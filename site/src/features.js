// JS port of the repo's scoring code, kept line-for-line close to the Python so the known-answer
// check (features.check.mjs) can hold it to the committed outputs.
//   features/dynamic_features.py      StrokeAnalyzer + DynamicFeatureExtractor.extract_all_features
//   integration_pipeline.py           _calculate_efficiency, _calculate_shape_quality, overall score, _score_to_grade
//   features/mental_health_assessment.py  _extract_indicators, _calculate_*, get_wellness_level, _generate_recommendations
//
// A stroke is { s, e, x[], y[], t[] }: s/e are start/end in integer microseconds (Python parses
// ISO timestamps to microseconds), t are point timestamps in ms. Only differences are used.

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const variance = (a) => { const m = mean(a); return mean(a.map((v) => (v - m) ** 2)); }; // np.var, population
const std = (a) => Math.sqrt(variance(a));
const max = (a) => a.reduce((m, v) => (v > m ? v : m), -Infinity);
const diffMs = (us) => (us / 1e6) * 1000; // timedelta.total_seconds() * 1000
// Python round(x, n) on a double; toFixed also rounds the exact binary value, so they agree off exact ties.
export const pyRound = (x, n) => Number(x.toFixed(n));

function deltas(st) {
  const d = [], dt = [];
  for (let i = 1; i < st.x.length; i++) {
    const dx = st.x[i] - st.x[i - 1], dy = st.y[i] - st.y[i - 1];
    d.push(Math.sqrt(dx * dx + dy * dy));
    dt.push(st.t[i] - st.t[i - 1]);
  }
  return { d, dt };
}

// calculate_velocity: a stroke with any zero time delta contributes no speeds at all.
export function strokeVelocity(st) {
  if (st.x.length < 2) return [];
  const { d, dt } = deltas(st);
  if (dt.some((v) => v === 0)) return [];
  return d.map((v, i) => v / dt[i]);
}

// calculate_acceleration: diff(v) / dt[:-1]
export function strokeAcceleration(st) {
  const v = strokeVelocity(st);
  const { dt } = deltas(st);
  if (v.length < 2 || dt.some((x) => x === 0)) return [];
  const a = [];
  for (let i = 0; i < v.length - 1; i++) a.push((v[i + 1] - v[i]) / dt[i]);
  return a;
}

function turnAngles(st) {
  // angle (radians) between consecutive segment vectors, null where a segment has zero length
  const out = [];
  for (let i = 0; i + 2 < st.x.length; i++) {
    const v1x = st.x[i + 1] - st.x[i], v1y = st.y[i + 1] - st.y[i];
    const v2x = st.x[i + 2] - st.x[i + 1], v2y = st.y[i + 2] - st.y[i + 1];
    const n1 = Math.sqrt(v1x * v1x + v1y * v1y), n2 = Math.sqrt(v2x * v2x + v2y * v2y);
    if (n1 === 0 || n2 === 0) { out.push(null); continue; }
    const c = Math.min(1, Math.max(-1, (v1x * v2x + v1y * v2y) / (n1 * n2)));
    out.push({ angle: Math.acos(c), dist: (n1 + n2) / 2 });
  }
  return out;
}

export function strokeCurvature(st) {
  if (st.x.length < 3) return [];
  return turnAngles(st).map((a) => (a === null ? 0 : a.dist > 0 ? a.angle / a.dist : 0));
}

export function directionChanges(st, thresholdDeg = 30) {
  if (st.x.length < 3) return 0;
  return turnAngles(st).filter((a) => a !== null && (a.angle * 180) / Math.PI > thresholdDeg).length;
}

// DynamicFeatureExtractor.extract_all_features. sessionStart/sessionEnd in microseconds.
export function extractDynamic(strokes, sessionStart, sessionEnd) {
  const speeds = [], accels = [], curvs = [], durations = [], pauses = [], perStrokeSpeed = [];
  for (const st of strokes) {
    const v = strokeVelocity(st);
    speeds.push(...v);
    if (v.length) perStrokeSpeed.push(mean(v));
    accels.push(...strokeAcceleration(st));
    curvs.push(...strokeCurvature(st));
    durations.push(diffMs(st.e - st.s));
  }
  for (let i = 0; i + 1 < strokes.length; i++) {
    const p = diffMs(strokes[i + 1].s - strokes[i].e);
    if (p > 0) pauses.push(p);
  }
  const xs = strokes.flatMap((s) => s.x), ys = strokes.flatMap((s) => s.y);
  const totalSession = diffMs(sessionEnd - sessionStart);
  const absA = accels.map(Math.abs);
  return {
    avg_speed: speeds.length ? mean(speeds) : 0,
    max_speed: speeds.length ? max(speeds) : 0,
    speed_variance: speeds.length ? variance(speeds) : 0,
    avg_acceleration: accels.length ? mean(absA) : 0,
    max_acceleration: accels.length ? max(absA) : 0,
    acceleration_variance: accels.length ? variance(accels) : 0,
    total_drawing_time_ms: durations.reduce((s, v) => s + v, 0),
    total_pause_time_ms: pauses.reduce((s, v) => s + v, 0),
    number_of_pauses: pauses.length,
    avg_pause_duration_ms: pauses.length ? mean(pauses) : 0,
    max_pause_duration_ms: pauses.length ? max(pauses) : 0,
    stroke_frequency_hz: totalSession > 0 ? strokes.length / (totalSession / 1000) : 0,
    direction_changes: strokes.reduce((n, s) => n + directionChanges(s), 0),
    avg_curvature: curvs.length ? mean(curvs) : 0,
    max_curvature: curvs.length ? max(curvs) : 0,
    total_strokes: strokes.length,
    total_points: xs.length,
    drawing_area: xs.length ? (max(xs) - Math.min(...xs)) * (max(ys) - Math.min(...ys)) : 0,
    // Not in the Python feature set: used only by the labelled what-if indicators below.
    _accelerations: accels, _perStrokeSpeed: perStrokeSpeed,
  };
}

// integration_pipeline._calculate_efficiency
export function efficiency(speedVariance, pauseCount) {
  const es = Math.max(0, 1 - speedVariance / 1000.0);
  const ep = Math.max(0, 1 - pauseCount / 20.0);
  return pyRound(Math.min(100, Math.max(0, (es * 0.6 + ep * 0.4) * 100)), 2);
}
// integration_pipeline._calculate_shape_quality
export function shapeQuality({ compactness, symmetry_x, symmetry_y }) {
  return pyRound(Math.min(100, Math.max(0, (compactness * 0.5 + Math.abs(symmetry_x) * 0.25 + Math.abs(symmetry_y) * 0.25) * 100)), 2);
}
// integration_pipeline._calculate_overall_score (the formula in the current code)
export const overallScore = (eff, q) => pyRound(eff * 0.4 + q * 0.6, 2);
export const grade = (s) => (s >= 90 ? 'A' : s >= 80 ? 'B' : s >= 70 ? 'C' : s >= 60 ? 'D' : 'F');

// mental_health_assessment._extract_indicators, applied to the report dict the pipeline produces.
// The keys it reads for tremor, speed inconsistency, pause events, rhythm and raw pressure do not exist
// in that dict, so those five indicators fall back to their defaults. This reproduces that faithfully.
export function extractIndicators(report) {
  const dyn = report.features?.dynamic ?? {};
  const temporal = dyn.temporal ?? {};
  const timing = dyn.timing ?? {};
  const motion = dyn.motion ?? {};
  const rhythm = dyn.rhythm ?? {};
  const cv = (arr) => std(arr) / (mean(arr.map(Math.abs)) + 1e-5);
  const pauseMs = timing.total_pause_time_ms ?? 0, drawMs = timing.total_drawing_time_ms ?? 1;
  const dur = (pauseMs + drawMs) / 1000;
  const assess = report.analysis?.assessment ?? {};
  const summary = report.summary ?? {};
  return {
    tremor_index: Array.isArray(temporal.acceleration_profile) && temporal.acceleration_profile.length ? cv(temporal.acceleration_profile) : 0,
    pause_ratio: pauseMs / (pauseMs + drawMs),
    pause_frequency: Math.min((timing.pause_events ?? 0) / Math.max(timing.strokes ?? 1, 1), 1),
    speed_inconsistency: Array.isArray(motion.avg_speed_per_stroke) && motion.avg_speed_per_stroke.length ? std(motion.avg_speed_per_stroke) / (mean(motion.avg_speed_per_stroke) + 1e-5) : 0,
    efficiency_level: assess.drawing_efficiency ?? 50,
    quality_level: assess.shape_quality ?? 50,
    pressure_stability: 0.5, // raw_session_data is never attached to the report, so the default always applies
    fluidity_index: rhythm.rhythm_regularity ?? 0.5,
    duration_concern: dur > 120 ? Math.min((dur - 120) / 120, 1) : dur < 30 ? Math.min((30 - dur) / 30, 1) : 0,
    completion_status: summary.is_complete ? 1 : 0.5,
    error_count: Math.min((summary.total_errors ?? 0) / 5, 1),
  };
}

// What-if only: indicators computed from features the extractor really produces. Not the repo's behaviour.
export function whatIfIndicators(f, base) {
  const a = f._accelerations, s = f._perStrokeSpeed;
  return {
    ...base,
    tremor_index: a.length ? std(a) / (mean(a.map(Math.abs)) + 1e-5) : 0,
    speed_inconsistency: s.length ? std(s) / (mean(s) + 1e-5) : 0,
    pause_frequency: Math.min(f.number_of_pauses / Math.max(f.total_strokes, 1), 1),
  };
}

const c100 = (v) => Math.min(v * 100, 100);
export function mentalHealth(ind) {
  const stress = Math.min(c100(ind.tremor_index) * 0.4 + c100(ind.speed_inconsistency) * 0.3 + ind.pause_frequency * 100 * 0.2 + (1 - ind.pressure_stability) * 100 * 0.1, 100);
  const anxiety = Math.min(c100(ind.tremor_index) * 0.25 + ind.pause_frequency * 100 * 0.3 + c100(ind.speed_inconsistency) * 0.2 + (1 - ind.fluidity_index) * 100 * 0.15 + (1 - ind.pressure_stability) * 100 * 0.1, 100);
  const burnout = Math.min((100 - ind.efficiency_level) * 0.35 + (100 - ind.quality_level) * 0.25 + (1 - ind.completion_status) * 100 * 0.2 + ind.duration_concern * 100 * 0.15, 100);
  const cognitive = Math.min(c100(ind.speed_inconsistency) * 0.25 + ind.error_count * 100 * 0.25 + (1 - ind.fluidity_index) * 100 * 0.2 + (1 - ind.completion_status) * 100 * 0.2 + ind.duration_concern * 100 * 0.1, 100);
  const wellness = 100 - (stress + anxiety + burnout + cognitive) / 4;
  const scores = { stress, anxiety, burnout, cognitive_load: cognitive };
  const primary = Object.keys(scores).reduce((b, k) => (scores[k] > scores[b] ? k : b));
  return {
    stress: pyRound(stress, 1), anxiety: pyRound(anxiety, 1), burnout: pyRound(burnout, 1), cognitive: pyRound(cognitive, 1),
    wellness: pyRound(wellness, 1), level: wellnessLevel(wellness), primary, recommendations: recommendations(stress, anxiety, burnout, cognitive),
  };
}
export const wellnessLevel = (w) => (w >= 80 ? 'Excellent' : w >= 60 ? 'Good' : w >= 40 ? 'Fair' : w >= 20 ? 'Poor' : 'Critical');
export function recommendations(stress, anxiety, burnout, cog) {
  const r = [];
  if (stress > 70) r.push('Take regular breaks (5-10 min every 30 min)', 'Practice deep breathing or meditation');
  else if (stress > 50) r.push('Try short relaxation breaks');
  if (anxiety > 70) r.push('Consider grounding techniques (5-4-3-2-1 sensory method)', 'Slow down your pace - focus on precision over speed');
  else if (anxiety > 50) r.push('Pause between strokes to reset focus');
  if (burnout > 70) r.push('Take a longer break (30+ min) before next session', 'Reduce task complexity temporarily', 'Reassess workload balance');
  else if (burnout > 50) r.push('Ensure adequate rest between sessions');
  if (cog > 70) r.push('Break tasks into smaller, manageable parts', 'Reduce distractions in your environment');
  else if (cog > 50) r.push('Focus on one task at a time');
  if (!r.length) r.push('Maintain current pace - doing well!', 'Continue regular practice sessions');
  return r;
}

// The two ways the repo turns recorded strokes into extractor sessions.
// 1) dynamic_session_test.ipynb: one session per task; missing stroke times fall back to point times,
//    session bounds are the first and last point.
export function taskSession(task, t0, s0) {
  const us = (ms) => (t0 + ms) * 1000 - s0;
  const strokes = task.strokes.filter((st) => st.x.length).map((st) => ({ ...st, s: st.s ?? us(Math.min(...st.t)), e: st.e ?? us(max(st.t)) }));
  const ts = strokes.flatMap((st) => st.t);
  return { strokes, start: us(Math.min(...ts)), end: us(max(ts)) };
}
// 2) backend_api.submit_session: every task's strokes flattened in order; the session start and end
//    are both the submit timestamp, so stroke frequency is always 0 in the reports.
export const reportSession = (session) => ({ strokes: session.tasks.flatMap((t) => t.strokes), start: 0, end: 0 });

// Report-shaped dict built from features, as integration_pipeline would assemble it (for extractIndicators).
export function pipelineReport(f, quality, complete = true) {
  return {
    features: { dynamic: {
      timing: { total_drawing_time_ms: f.total_drawing_time_ms, total_pause_time_ms: f.total_pause_time_ms, strokes: f.total_strokes, points: f.total_points },
      pauses: { count: f.number_of_pauses }, rhythm: { stroke_frequency_per_sec: f.stroke_frequency_hz },
    } },
    analysis: { assessment: { drawing_efficiency: efficiency(f.speed_variance, f.number_of_pauses), shape_quality: quality } },
    summary: { is_complete: complete, total_errors: 0 },
  };
}
