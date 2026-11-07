// Prebuild: compacts the committed repo files into site/src/data/records.json.
// Sources: Records/*/JSON/*.json (strokes), Records/*/*_report.json (recorded pipeline output),
// dynamic_feature_*.csv (notebook outputs) and RESEARCH_PAPER.md (claims). Nothing here is typed by hand.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const OUT = path.resolve(here, '../src/data/records.json');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// ISO-8601 or epoch-ms to integer microseconds, matching Python's parse_timestamp precision.
// Naive strings are read as UTC: only differences inside one session are ever used.
export function toMicros(v) {
  if (v == null) return null;
  if (typeof v === 'number') return Math.round(v * 1000);
  const m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:\.(\d{1,6}))?(Z|[+-]\d\d:\d\d)?$/.exec(v);
  if (!m) throw new Error(`unparsed timestamp ${v}`);
  let us = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]) * 1000 + +(m[7] || '0').padEnd(6, '0');
  if (m[8] && m[8] !== 'Z') { const s = m[8][0] === '-' ? -1 : 1; us -= s * (+m[8].slice(1, 3) * 60 + +m[8].slice(4)) * 60e6; }
  return us;
}

const csv = (p) => {
  const [head, ...rows] = read(p).trim().split(/\r?\n/).map((l) => l.split(','));
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, isNaN(+r[i]) || r[i] === '' ? r[i] : +r[i]])));
};

const pressures = new Set(), tilts = new Set(), inputTypes = new Set();
const sessions = fs.readdirSync(path.join(ROOT, 'Records')).sort().map((id) => {
  const dir = path.join('Records', id);
  const jsonFile = fs.readdirSync(path.join(ROOT, dir, 'JSON')).find((f) => f.endsWith('.json'));
  const raw = JSON.parse(read(path.join(dir, 'JSON', jsonFile)));
  const rep = JSON.parse(read(path.join(dir, `${id}_report.json`)));
  const kind = id.startsWith('test-') ? 'test' : id.startsWith('verify-') ? 'verify' : 'real';
  let t0 = Infinity, s0 = Infinity;
  for (const task of Object.values(raw.tasks)) for (const st of task.strokes || []) {
    for (const p of st.points) t0 = Math.min(t0, p.timestamp);
    const s = toMicros(st.startTime); if (s != null) s0 = Math.min(s0, s);
  }
  const tasks = Object.entries(raw.tasks).map(([key, task]) => ({
    key, title: task.title, type: task.type ?? task.taskType ?? null,
    strokes: (task.strokes || []).map((st) => {
      if (kind === 'real') { // input stats describe the 15 real sessions only
        for (const p of st.points) { pressures.add(p.pressure); tilts.add(`${p.tiltX},${p.tiltY}`); }
        inputTypes.add(st.inputType ?? st.pointerType);
      }
      const s = toMicros(st.startTime), e = toMicros(st.endTime);
      return {
        id: st.strokeId ?? null,
        s: s == null ? null : s - s0, e: e == null ? null : e - s0,
        x: st.points.map((p) => p.x), y: st.points.map((p) => p.y), t: st.points.map((p) => p.timestamp - t0),
      };
    }),
  }));
  const a = rep.analysis?.assessment ?? {}, o = a.overall_assessment ?? {}, mh = rep.mental_health_assessment;
  return {
    id, kind,
    recordedAt: raw.timestamp ?? rep.metadata?.generated_at ?? null, t0, s0,
    tasks,
    report: {
      generatedAt: rep.metadata?.generated_at, pipelineVersion: rep.metadata?.pipeline_version,
      dynamicErrors: rep.validation?.dynamic?.errors ?? [],
      dynamic: rep.features?.dynamic ?? {},
      shape: rep.features?.static?.shape ? { compactness: rep.features.static.shape.compactness, symmetry_x: rep.features.static.shape.symmetry_x, symmetry_y: rep.features.static.shape.symmetry_y } : null,
      efficiency: a.drawing_efficiency ?? null, quality: a.shape_quality ?? null, completion: a.task_completion ?? null,
      score: o.score ?? null, grade: o.grade ?? null, completionComponent: o.completion_component ?? null, scoringMethod: o.scoring_method ?? null,
      summary: rep.summary,
      mh: { stress: mh.stress_score, anxiety: mh.anxiety_score, burnout: mh.burnout_score, cognitive: mh.cognitive_load_score, wellness: mh.overall_wellness, level: mh.wellness_level, primary: mh.primary_concern, recommendations: mh.recommendations, indicators: mh.indicators },
    },
  };
});

// Paper claims, parsed from the markdown. Every regex must match or the build fails.
const paper = read('RESEARCH_PAPER.md');
const need = (re, what) => { const m = re.exec(paper); if (!m) throw new Error(`RESEARCH_PAPER.md: could not find ${what}`); return m; };
const table = {};
for (const dim of ['Stress', 'Anxiety', 'Burnout', 'Cognitive Load', 'Overall Wellness']) {
  const m = need(new RegExp(`\\|\\s*\\*\\*${dim}\\*\\*\\s*\\|\\s*([\\d.]+)\\s*\\|\\s*([\\d.]+)\\s*\\|\\s*([\\d.]+)\\s*\\|\\s*([\\d.]+)`), `${dim} row`);
  table[dim] = { mean: +m[1], sd: +m[2], min: +m[3], max: +m[4] };
}
const dist = {};
for (const lvl of ['Excellent', 'Good', 'Fair', 'Poor', 'Critical']) dist[lvl] = +need(new RegExp(`- ${lvl} \\([\\d-]+\\): (\\d+) sessions`), `${lvl} count`)[1];
const corr = [...paper.matchAll(/\*\*([^*]+?) ↔ ([^*]+?):\*\* r = (-?[\d.]+)/g)].map((m) => ({ a: m[1], b: m[2], r: +m[3] }));
if (corr.length < 4) throw new Error('RESEARCH_PAPER.md: correlations not found');
const taskAvg = [...paper.matchAll(/Average observed: ([\d.]+)/g)].map((m) => +m[1]);
if (taskAvg.length !== 3) throw new Error('RESEARCH_PAPER.md: per-task averages not found');
const claims = {
  n: +need(/validated on \*\*(\d+) real-world drawing sessions/, 'dataset size')[1],
  scoreFormula: need(/\\text\{Score\} = \(([\d.]+) \\times \\text\{Efficiency\}\) \+ \(([\d.]+) \\times \\text\{Quality\}\)/, 'score formula').slice(1, 3).map(Number),
  table, dist, corr, taskAvg,
};

const data = {
  generatedFrom: 'Records/, dynamic_feature_summary.csv, dynamic_feature_benchmarks*.csv, RESEARCH_PAPER.md',
  sessions,
  summaryCsv: csv('dynamic_feature_summary.csv'),
  benchRaw: csv('dynamic_feature_benchmarks_raw.csv'),
  bench: csv('dynamic_feature_benchmarks.csv'),
  input: { pressures: [...pressures].sort(), tilts: [...tilts], inputTypes: [...inputTypes] },
  claims,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(data));
const pts = sessions.reduce((n, s) => n + s.tasks.reduce((m, t) => m + t.strokes.reduce((k, st) => k + st.x.length, 0), 0), 0);
console.log(`records.json: ${sessions.length} sessions, ${pts} points, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
