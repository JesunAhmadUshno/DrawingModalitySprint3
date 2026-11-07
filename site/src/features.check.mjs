// Known-answer check, run by `npm run build` before vite. Fails the build if the browser port drifts
// from the repo's Python outputs. All expected values come from committed files.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { extractDynamic, taskSession, reportSession, efficiency, shapeQuality, overallScore, grade, mentalHealth, extractIndicators, pyRound } from './features.js';

const data = createRequire(import.meta.url)('./data/records.json');
const close = (got, want, what) => assert.ok(Math.abs(got - want) <= 1e-9 * Math.max(1, Math.abs(want)), `${what}: JS ${got} vs repo ${want}`);
let n = 0;

// 1) dynamic_feature_summary.csv: written by dynamic_session_test.ipynb from Records/session-1772430903272, one row per task.
const src = data.sessions.find((s) => s.id === 'session-1772430903272');
for (const row of data.summaryCsv) {
  const task = src.tasks.find((t) => String(t.key) === String(row.task_key));
  const ts = taskSession(task, src.t0, src.s0);
  const f = extractDynamic(ts.strokes, ts.start, ts.end);
  for (const k of ['total_strokes', 'total_points', 'avg_speed', 'max_speed', 'speed_variance', 'avg_acceleration', 'max_acceleration', 'acceleration_variance',
    'total_drawing_time_ms', 'total_pause_time_ms', 'number_of_pauses', 'avg_pause_duration_ms', 'stroke_frequency_hz', 'direction_changes', 'avg_curvature', 'max_curvature', 'drawing_area']) {
    close(f[k], row[k], `${row.task_title} ${k}`); n++;
  }
}

// 2) Every recorded report with dynamic features: recompute them from the stroke JSON as backend_api did.
const map = { 'speed.average': 'avg_speed', 'speed.maximum': 'max_speed', 'speed.variance': 'speed_variance', 'acceleration.average': 'avg_acceleration',
  'acceleration.maximum': 'max_acceleration', 'acceleration.variance': 'acceleration_variance', 'timing.total_drawing_time_ms': 'total_drawing_time_ms',
  'timing.total_pause_time_ms': 'total_pause_time_ms', 'timing.strokes': 'total_strokes', 'timing.points': 'total_points', 'pauses.count': 'number_of_pauses',
  'pauses.average_duration_ms': 'avg_pause_duration_ms', 'pauses.maximum_duration_ms': 'max_pause_duration_ms', 'rhythm.stroke_frequency_per_sec': 'stroke_frequency_hz',
  'movement.direction_changes': 'direction_changes', 'movement.average_curvature': 'avg_curvature', 'movement.maximum_curvature': 'max_curvature' };
let freqSkipped = 0, reports = 0, effOk = 0, scoreMatches = 0, scoreTotal = 0;
for (const s of data.sessions) {
  const r = s.report;
  if (r.dynamic.speed) {
    reports++;
    const rs = reportSession(s);
    const f = extractDynamic(rs.strokes, rs.start, rs.end);
    for (const [path, k] of Object.entries(map)) {
      const [a, b] = path.split('.');
      // Later submits sent sessionStartTime/EndTime, which backend_api used but did not save to the JSON,
      // so a non-zero recorded stroke frequency cannot be rebuilt from committed files. Counted, not hidden.
      if (k === 'stroke_frequency_hz' && r.dynamic[a][b] !== 0) { freqSkipped++; continue; }
      close(f[k], r.dynamic[a][b], `${s.id} ${path}`); n++;
    }
    // efficiency and shape quality as recorded
    assert.equal(efficiency(f.speed_variance, f.number_of_pauses), r.efficiency, `${s.id} efficiency`); effOk++; n++;
    assert.equal(shapeQuality(r.shape), r.quality, `${s.id} shape quality`); n++;
    scoreTotal++; if (overallScore(r.efficiency, r.quality) === r.score) scoreMatches++;
    assert.equal(r.grade, grade(r.score), `${s.id} grade`); n++;
  }
  // 3) mental-health scores: the stored (2-decimal) indicators through the repo formulas land within one
  //    rounding step of every report; step 4 below reproduces them exactly from unrounded indicators.
  const mh = mentalHealth(r.mh.indicators);
  for (const k of ['stress', 'anxiety', 'burnout', 'cognitive', 'wellness']) { assert.ok(Math.abs(mh[k] - r.mh[k]) <= 0.1 + 1e-9, `${s.id} ${k}: ${mh[k]} vs ${r.mh[k]}`); n++; }
  assert.equal(mh.level, r.mh.level, `${s.id} level`); assert.deepEqual(mh.recommendations, r.mh.recommendations, `${s.id} recommendations`); n += 2;
  // 4) and _extract_indicators, applied to the report the pipeline produced, reproduces the stored indicators
  //    (backend_api stores them rounded to 2 decimals) and, unrounded, the same scores.
  const ind = extractIndicators({ features: { dynamic: r.dynamic }, analysis: { assessment: r.efficiency == null ? {} : { drawing_efficiency: r.efficiency, shape_quality: r.quality } }, summary: r.summary });
  for (const [k, v] of Object.entries(r.mh.indicators)) { close(pyRound(ind[k], 2), v, `${s.id} indicator ${k}`); n++; }
  const mh2 = mentalHealth(ind);
  for (const k of ['stress', 'anxiety', 'burnout', 'cognitive', 'wellness']) { assert.equal(mh2[k], r.mh[k], `${s.id} ${k} from extracted indicators`); n++; }
}
assert.equal(reports, 17, 'expected 17 reports with dynamic features (15 real + 2 verify)');

// 5) dynamic_feature_benchmarks.csv is the per-task mean/min/max of the raw runs.
for (const b of data.bench) {
  const runs = data.benchRaw.filter((r) => r.task_title === b.task_title).map((r) => r.extraction_ms);
  close(runs.reduce((a, v) => a + v, 0) / runs.length, b.mean_ms, `${b.task_title} mean`);
  close(Math.min(...runs), b.min_ms, `${b.task_title} min`); close(Math.max(...runs), b.max_ms, `${b.task_title} max`); n += 3;
}
console.log(`features ok: ${n} assertions; ${reports} reports recomputed (stroke frequency not rebuildable for ${freqSkipped}); current score formula reproduces ${scoreMatches}/${scoreTotal} recorded scores`);
