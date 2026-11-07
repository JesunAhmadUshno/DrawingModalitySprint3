import { useMemo, useState, useEffect, useRef, useId, useCallback } from 'react';
import data from './data/records.json';
import { extractDynamic, taskSession, reportSession, efficiency, overallScore, grade, mentalHealth, extractIndicators, whatIfIndicators, pipelineReport } from './features.js';
import imgPentagon from '../../frontend/ReferanceImages/TwoPentagon.png';
import imgHouse from '../../frontend/ReferanceImages/HouseDrawing.png';
import imgClock from '../../frontend/ReferanceImages/ClockDrawing.png';

const REPO = 'https://github.com/JesunAhmadUshno/DrawingModalitySprint3';
const blob = (p) => `${REPO}/blob/main/${p}`;
const f2 = (v, d = 2) => (v == null ? '–' : Number(v).toFixed(d));
const avg = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const sd = (a) => { const m = avg(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); };
const pearson = (a, b) => {
  const ma = avg(a), mb = avg(b); let n = 0, da = 0, db = 0;
  a.forEach((v, i) => { n += (v - ma) * (b[i] - mb); da += (v - ma) ** 2; db += (b[i] - mb) ** 2; });
  return da && db ? n / Math.sqrt(da * db) : null;
};

// ---------- build-time facts, all derived from records.json ----------
const S = data.sessions;
const real = S.filter((s) => s.kind === 'real');
const nTestVerify = S.length - real.length;
const strokesOf = (s) => s.tasks.reduce((n, t) => n + t.strokes.length, 0);
const pointsOf = (s) => s.tasks.reduce((n, t) => n + t.strokes.reduce((m, st) => m + st.x.length, 0), 0);
const realStrokes = real.reduce((n, s) => n + strokesOf(s), 0);
const realPoints = real.reduce((n, s) => n + pointsOf(s), 0);
const taskCounts = {};
real.forEach((s) => s.tasks.forEach((t) => { taskCounts[t.title] = (taskCounts[t.title] || 0) + 1; }));
const fullSessions = real.filter((s) => ['Two-Pentagon Copy', 'House Drawing Copy', 'Clock Drawing'].every((t) => s.tasks.some((x) => x.title === t))).length;
const days = [...new Set(real.map((s) => s.recordedAt.slice(0, 10)))].sort();
const realMh = (k) => real.map((s) => s.report.mh[k]);
const withFeatures = S.filter((s) => s.report.efficiency != null && s.report.dynamic.speed);
const scoreRows = withFeatures.map((s) => ({ s, calc: overallScore(s.report.efficiency, s.report.quality) }));
const scoreMatches = scoreRows.filter((r) => r.calc === r.s.report.score).length;
const maxSpeedVar = Math.max(...withFeatures.map((s) => s.report.dynamic.speed.variance));
const worstGap = scoreRows.reduce((b, r) => (Math.abs(r.calc - r.s.report.score) > Math.abs(b.calc - b.s.report.score) ? r : b));
const realQuality = real.map((s) => s.report.quality).filter((v) => v != null).sort((a, b) => a - b);
const medianQuality = realQuality[Math.floor(realQuality.length / 2)];
const INDICATOR_KEYS = ['tremor_index', 'speed_inconsistency', 'pause_frequency', 'pressure_stability', 'fluidity_index', 'efficiency_level', 'quality_level', 'duration_concern', 'completion_status', 'error_count'];
const constantIndicators = INDICATOR_KEYS.filter((k) => new Set(S.map((s) => s.report.mh.indicators[k])).size === 1);
const shortId = (id) => id.replace('session-', '').replace('test-', 'test ').replace('verify-', 'verify ');
const when = (s) => new Date(s.recordedAt).toLocaleString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' UTC';

const SECTIONS = [['top', 'Overview', '◎'], ['pad', 'Draw', '✎'], ['replay', 'Replay', '▶'], ['sessions', 'Sessions', '▥'], ['weights', 'Weights', '⚖'], ['bench', 'Timing', '◷'], ['claims', 'Claims', '✓'], ['limits', 'Limits', '!']];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function MenuBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  return (
    <div className="menubar" role="banner">
      <span className="apple" aria-hidden="true">◆</span>
      <a className="app" href="#top">Drawing Modality</a>
      <a className="m" href={blob('RESEARCH_PAPER.md')}>Paper</a>
      <a className="m" href={blob('docs/research-review.md')}>Research review</a>
      <a className="m" href={`${REPO}/tree/main/Records`}>Records</a>
      <span className="spacer" />
      <span className="status"><i /> Port checked at build</span>
      <a href={REPO}>GitHub ↗</a>
      <span className="clock">{now.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</span>
    </div>
  );
}

function Dock() {
  const [active, setActive] = useState('top');
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav className="dock" aria-label="Sections">
      {SECTIONS.map(([id, label, icon]) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined}>
          <span className="ico" aria-hidden="true">{icon}</span><span className="lbl">{label}</span>
        </a>
      ))}
    </nav>
  );
}

function Range({ label, value, min, max, step, onChange, show }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label} <span>{show ?? value}</span></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

function Select({ label, value, onChange, children }) {
  const id = useId();
  return (
    <div className="field"><label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>{children}</select>
    </div>
  );
}

export default function App() {
  useReveal();
  return (
    <div className="wrap">
      <MenuBar />
      <div className="glow" aria-hidden="true" />
      <Hero />
      <Pad />
      <Replay />
      <Sessions />
      <Weights />
      <Bench />
      <Claims />
      <Limits />
      <Dock />
      <footer>
        Code: MIT. Every number on this page is read from <code>Records/</code>, the benchmark CSVs and <code>RESEARCH_PAPER.md</code> at build time, or computed in your browser by a port of the repo&rsquo;s Python that the build checks against those files.
        <br />Research prototype. Not a diagnostic tool. The wellness scores are not clinically validated.
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <header className="card hero window" id="top" data-title="DrawingModalitySprint3 — README">
      <div className="head">
        <p className="eyebrow">Digital drawing test · research prototype</p>
        <span className="pill warn">● Not a diagnostic tool</span>
      </div>
      <h1>A drawing test that <em>times every pen stroke</em>: {real.length} recorded sessions, {realStrokes} strokes.</h1>
      <p className="sub">
        The repo captures the pentagon, house and clock copying tasks in the browser, then a Python pipeline turns each stroke into speed, acceleration, pause and curvature features and a set of wellness scores.
        This page replays the recorded sessions, re-runs that feature code live on your own drawing, and checks the paper&rsquo;s claims against the files.
        The mental-health scores come from hand-picked weights with no ground-truth labels. Treat them as an engineering demo, not a measurement.
      </p>
      <div className="actions">
        <a className="btn primary" href="#pad">Draw and measure</a>
        <a className="btn ghost" href="#claims">See the claims check</a>
        <span className="hint">Build check: <code>cd site &amp;&amp; npm run build</code></span>
      </div>
      <div className="tiles">
        <div className="tile"><div className="num">{real.length}</div><div className="cap">real sessions in <code>Records/</code>, plus {nTestVerify} test and verify runs</div></div>
        <div className="tile"><div className="num">{realStrokes}</div><div className="cap">strokes, {realPoints.toLocaleString('en-US')} timed points</div></div>
        <div className="tile"><div className="num">{fullSessions}</div><div className="cap">sessions with all three standard tasks</div></div>
        <div className="tile"><div className="num">{days.length}</div><div className="cap">recording days ({days.join(', ')})</div></div>
      </div>
    </header>
  );
}

// ---------- live drawing pad ----------
const TASKS = [['Two-Pentagon Copy', imgPentagon], ['House Drawing Copy', imgHouse], ['Clock Drawing', imgClock]];
const PAD_W = 900, PAD_H = 560;

function Pad() {
  const canvas = useRef(null);
  const [strokes, setStrokes] = useState([]);
  const cur = useRef(null);
  const [task, setTask] = useState(0);
  const [quality, setQuality] = useState(medianQuality);
  const theme = () => getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#1b1915';

  const redraw = useCallback((list) => {
    const c = canvas.current; if (!c) return;
    const g = c.getContext('2d');
    g.clearRect(0, 0, PAD_W, PAD_H);
    g.strokeStyle = theme(); g.lineWidth = 3; g.lineCap = 'round'; g.lineJoin = 'round';
    for (const st of list) { g.beginPath(); st.x.forEach((x, i) => (i ? g.lineTo(x, st.y[i]) : g.moveTo(x, st.y[i]))); g.stroke(); }
  }, []);
  useEffect(() => { redraw(strokes); }, [strokes, redraw]);

  const pos = (e) => { const r = canvas.current.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * PAD_W, ((e.clientY - r.top) / r.height) * PAD_H]; };
  const down = (e) => {
    e.preventDefault(); canvas.current.setPointerCapture(e.pointerId);
    const [x, y] = pos(e);
    cur.current = { s: Math.round(e.timeStamp * 1000), x: [x], y: [y], t: [e.timeStamp] };
  };
  const move = (e) => {
    const st = cur.current; if (!st) return;
    const evs = e.nativeEvent.getCoalescedEvents ? e.nativeEvent.getCoalescedEvents() : [e.nativeEvent];
    for (const ev of evs.length ? evs : [e.nativeEvent]) { const [x, y] = pos(ev); st.x.push(x); st.y.push(y); st.t.push(ev.timeStamp); }
    const g = canvas.current.getContext('2d'); const n = st.x.length;
    g.strokeStyle = theme(); g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(st.x[Math.max(0, n - evs.length - 1)], st.y[Math.max(0, n - evs.length - 1)]);
    for (let i = Math.max(0, n - evs.length); i < n; i++) g.lineTo(st.x[i], st.y[i]);
    g.stroke();
  };
  const up = (e) => {
    const st = cur.current; if (!st) return;
    cur.current = null;
    st.e = Math.round(e.timeStamp * 1000);
    setStrokes((l) => [...l, st]);
  };

  const f = useMemo(() => strokes.length ? extractDynamic(strokes, strokes[0].s, strokes.at(-1).e) : null, [strokes]);
  const eff = f && efficiency(f.speed_variance, f.number_of_pauses);
  const rep = f && pipelineReport(f, quality);
  const asPipeline = rep && mentalHealth(extractIndicators(rep));
  const whatIf = f && mentalHealth(whatIfIndicators(f, extractIndicators(rep)));
  const rows = f ? [
    ['Average speed', `${f2(f.avg_speed, 3)} px/ms`], ['Max speed', `${f2(f.max_speed, 3)} px/ms`], ['Speed variance', f2(f.speed_variance, 4)],
    ['Average |acceleration|', `${f2(f.avg_acceleration, 4)} px/ms²`], ['Pauses between strokes', `${f.number_of_pauses} (${f2(f.total_pause_time_ms, 0)} ms)`],
    ['Drawing time', `${f2(f.total_drawing_time_ms, 0)} ms`], ['Direction changes > 30°', f.direction_changes], ['Average curvature', `${f2(f.avg_curvature, 3)} rad/px`],
    ['Stroke frequency', `${f2(f.stroke_frequency_hz, 2)} /s`], ['Strokes · points', `${f.total_strokes} · ${f.total_points}`],
  ] : [];
  return (
    <section id="pad" className="card window reveal" data-title="task.html — drawing pad (live)">
      <div className="head">
        <div>
          <p className="eyebrow">Live in your browser</p>
          <h2>Copy the figure. Every stroke is measured as you lift the pen.</h2>
          <p className="sub">
            Your pointer events (x, y, time) go through a JavaScript port of <a href={blob('features/dynamic_features.py')}>dynamic_features.py</a>, then the efficiency rule from <a href={blob('integration_pipeline.py')}>integration_pipeline.py</a> and the wellness engine.
            The build fails unless this port reproduces the repo&rsquo;s recorded features to within 10⁻⁹. Nothing you draw leaves the page.
          </p>
        </div>
        <span className="pill info">{strokes.length} strokes</span>
      </div>
      <div className="seg" role="group" aria-label="Reference figure">
        {TASKS.map(([t], i) => <button key={t} aria-pressed={task === i} onClick={() => setTask(i)}>{t}</button>)}
      </div>
      <div className="padgrid">
        <div className="refimg"><img src={TASKS[task][1]} alt={`Reference figure: ${TASKS[task][0]}`} /><span className="hint">Reference from <code>frontend/ReferanceImages</code></span></div>
        <canvas ref={canvas} className="pad" width={PAD_W} height={PAD_H} aria-label="Drawing pad: draw here with a mouse, pen or finger"
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      </div>
      <div className="actions" style={{ marginTop: 12 }}>
        <button className="btn ghost" onClick={() => setStrokes([])} disabled={!strokes.length}>Clear</button>
        <button className="btn ghost" onClick={() => setStrokes((l) => l.slice(0, -1))} disabled={!strokes.length}>Undo stroke</button>
        <span className="hint">Coordinates are canvas pixels on a {PAD_W}×{PAD_H} pad, so speeds are comparable to the recorded mouse sessions only roughly.</span>
      </div>
      {f ? (
        <div className="grid2" style={{ marginTop: 16 }}>
          <div>
            <h3>Dynamic features</h3>
            <table><tbody>{rows.map(([k, v]) => <tr key={k}><td>{k}</td><td className="num-cell">{v}</td></tr>)}</tbody></table>
          </div>
          <div>
            <h3>Pipeline outputs</h3>
            <div className="tiles two">
              <div className="tile"><div className="num">{f2(eff)}</div><div className="cap">drawing efficiency (60% speed-variance term, 40% pause term)</div></div>
              <div className="tile"><div className="num">{f2(asPipeline.wellness, 1)}</div><div className="cap">wellness as the pipeline computes it ({asPipeline.level})</div></div>
            </div>
            <table style={{ marginTop: 12 }}>
              <thead><tr><th>Score</th><th>As the pipeline runs</th><th>What-if, wired up</th></tr></thead>
              <tbody>
                {[['Stress', 'stress'], ['Anxiety', 'anxiety'], ['Burnout', 'burnout'], ['Cognitive load', 'cognitive'], ['Wellness', 'wellness']].map(([l, k]) => (
                  <tr key={k}><td>{l}</td><td className="num-cell">{f2(asPipeline[k], 1)}</td><td className="num-cell">{f2(whatIf[k], 1)}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="hint">The middle column is what the repo does: its indicator code reads keys the pipeline never writes, so stress and anxiety cannot move. The right column is a labelled what-if that feeds the same formulas tremor, speed inconsistency and pause frequency computed from your strokes. It is not the repo&rsquo;s behaviour.</p>
            <Range label="Shape quality used for burnout (not computed in the browser)" value={quality} min={0} max={100} step={0.01} onChange={setQuality} show={f2(quality)} />
            <p className="hint">Shape quality needs the OpenCV raster pipeline in <code>static_features.py</code>. It starts at the median recorded value ({f2(medianQuality)}).</p>
          </div>
        </div>
      ) : <p className="hint" style={{ marginTop: 16 }}>Draw at least one stroke to see its features.</p>}
    </section>
  );
}

// ---------- recorded replay ----------
const GAP_CAP = 1500; // ms: long pauses are shortened during playback

function Replay() {
  const [sid, setSid] = useState(real[0].id);
  const session = S.find((s) => s.id === sid);
  const [tk, setTk] = useState('all');
  const [speed, setSpeed] = useState(2);
  const [playing, setPlaying] = useState(true);
  const [clock, setClock] = useState(0);
  useEffect(() => { setTk('all'); }, [sid]);
  const strokes = useMemo(() => (tk === 'all' ? session.tasks.flatMap((t) => t.strokes) : session.tasks.find((t) => t.key === tk).strokes), [session, tk]);
  // playback timeline: recorded point times with gaps longer than GAP_CAP shortened
  const timeline = useMemo(() => {
    let prev = null, acc = 0;
    return strokes.map((st) => st.t.map((t) => { if (prev !== null) acc += Math.min(Math.max(0, t - prev), GAP_CAP); prev = t; return acc; }));
  }, [strokes]);
  const total = timeline.length ? timeline.at(-1).at(-1) : 0;
  useEffect(() => { setClock(0); setPlaying(true); }, [strokes]);
  useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now();
    const step = (now) => { setClock((c) => { const n = c + (now - last) * speed; if (n >= total) { setPlaying(false); return total; } return n; }); last = now; raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, total]);

  const xs = strokes.flatMap((s) => s.x), ys = strokes.flatMap((s) => s.y);
  const pad = 16, minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad, w = Math.max(...xs) - minX + pad, h = Math.max(...ys) - minY + pad;
  const f = useMemo(() => {
    if (tk === 'all') { const r = reportSession(session); return extractDynamic(r.strokes, r.start, r.end); }
    const t = taskSession(session.tasks.find((x) => x.key === tk), session.t0, session.s0); return extractDynamic(t.strokes, t.start, t.end);
  }, [session, tk]);
  const rd = session.report.dynamic;
  const cmp = [
    ['Average speed (px/ms)', f.avg_speed, rd.speed?.average, 4], ['Speed variance', f.speed_variance, rd.speed?.variance, 4],
    ['Average |acceleration|', f.avg_acceleration, rd.acceleration?.average, 5], ['Pauses', f.number_of_pauses, rd.pauses?.count, 0],
    ['Pause time (ms)', f.total_pause_time_ms, rd.timing?.total_pause_time_ms, 0], ['Drawing time (ms)', f.total_drawing_time_ms, rd.timing?.total_drawing_time_ms, 0],
    ['Direction changes', f.direction_changes, rd.movement?.direction_changes, 0], ['Average curvature', f.avg_curvature, rd.movement?.average_curvature, 4],
  ];
  return (
    <section id="replay" className="card window reveal" data-title="Records/ — session replay (recorded)">
      <div className="head">
        <div>
          <p className="eyebrow">Recorded replay</p>
          <h2>Watch a real session redraw itself on its recorded timing.</h2>
          <p className="sub">
            These strokes are the x, y and timestamp points saved in <code>Records/{session.id}/JSON</code>. The features beside the replay are recomputed in your browser from those points and set against the session&rsquo;s saved report.
            Pauses longer than {GAP_CAP / 1000} s are shortened during playback only.
          </p>
        </div>
        <span className="pill info">recorded · {when(session)}</span>
      </div>
      <div className="controls">
        <Select label="Session" value={sid} onChange={setSid}>
          {S.map((s) => <option key={s.id} value={s.id}>{shortId(s.id)} · {strokesOf(s)} strokes{s.kind !== 'real' ? ` (${s.kind})` : ''}</option>)}
        </Select>
        <Select label="Task" value={tk} onChange={setTk}>
          <option value="all">All tasks (as the report saw them)</option>
          {session.tasks.map((t) => <option key={t.key} value={t.key}>{t.title} · {t.strokes.length} strokes</option>)}
        </Select>
        <Range label="Playback speed" value={speed} min={0.5} max={8} step={0.5} onChange={setSpeed} show={`${speed}×`} />
        <Range label="Position" value={Math.round(clock)} min={0} max={Math.max(1, Math.round(total))} step={1} onChange={(v) => { setPlaying(false); setClock(v); }} show={`${(clock / 1000).toFixed(1)} s`} />
      </div>
      <div className="grid2">
        <div>
          <svg className="chart replay" viewBox={`${minX} ${minY} ${w} ${h}`} role="img" aria-label={`Recorded strokes of ${session.id}, replayed`}>
            {strokes.map((st, i) => {
              const tl = timeline[i]; let k = 0; while (k < tl.length && tl[k] <= clock) k++;
              const ghost = st.x.map((x, j) => `${x},${st.y[j]}`).join(' ');
              const live = st.x.slice(0, k).map((x, j) => `${x},${st.y[j]}`).join(' ');
              return <g key={i}><polyline points={ghost} className="ghost" />{k > 1 && <polyline points={live} className="ink" />}{k === 1 && <circle cx={st.x[0]} cy={st.y[0]} r="2.5" className="dot" />}</g>;
            })}
          </svg>
          <div className="actions" style={{ marginTop: 8 }}>
            <button className="btn primary" onClick={() => { if (clock >= total) setClock(0); setPlaying((p) => !p); }}>{playing ? 'Pause' : clock >= total ? 'Replay' : 'Play'}</button>
            <span className="hint">{strokes.length} strokes · {xs.length.toLocaleString('en-US')} points</span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Feature</th><th>Recomputed here</th><th>Saved report</th></tr></thead>
            <tbody>
              {cmp.map(([k, a, b, d]) => (
                <tr key={k}><td>{k}</td><td className="num-cell">{f2(a, d)}</td>
                  <td className={`num-cell ${tk === 'all' && b != null ? (Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)) ? 'ok' : 'no') : ''}`}>{tk === 'all' ? f2(b, d) : '–'}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="hint">{tk !== 'all' ? 'Reports cover the whole session, so a single task has no saved counterpart.' : rd.speed ? 'Green: the browser port matches the saved report.' : `This run has no saved features: its validation failed (${session.report.dynamicErrors.join('; ') || 'no strokes'}).`}</p>
        </div>
      </div>
    </section>
  );
}

// ---------- sessions explorer ----------
const COLS = [['efficiency', 'Efficiency'], ['quality', 'Shape quality'], ['score', 'Score'], ['stress', 'Stress'], ['anxiety', 'Anxiety'], ['burnout', 'Burnout'], ['cognitive', 'Cognitive load'], ['wellness', 'Wellness']];
const val = (s, k) => (['efficiency', 'quality', 'score'].includes(k) ? s.report[k] : s.report.mh[k]);

function Sessions() {
  const [showTest, setShowTest] = useState(false);
  const [sort, setSort] = useState('time');
  const [hover, setHover] = useState(null);
  const rows = useMemo(() => {
    const r = S.filter((s) => showTest || s.kind === 'real');
    if (sort !== 'time') r.sort((a, b) => (val(b, sort) ?? -1) - (val(a, sort) ?? -1));
    return r;
  }, [showTest, sort]);
  const W = 960, H = 260, pl = 30, pr = 10, pt = 14, pb = 34;
  const cx = (i) => pl + (i + 0.5) * ((W - pl - pr) / COLS.length);
  const y = (v) => pt + (1 - v / 100) * (H - pt - pb);
  const testId = useId();
  return (
    <section id="sessions" className="card window reveal" data-title={`Records/*_report.json — ${S.length} sessions (recorded)`}>
      <div className="head">
        <div>
          <p className="eyebrow">Recorded results</p>
          <h2>Every saved report, side by side. Two of the four scores never move.</h2>
          <p className="sub">
            One dot per session per score, read straight from each <code>_report.json</code>. Stress and anxiety sit on single values ({[...new Set(realMh('stress'))].join(', ')} and {[...new Set(realMh('anxiety'))].join(', ')}) in every report, because the indicator code reads keys the pipeline never writes.
            Every real session lands in the &ldquo;{[...new Set(realMh('level'))].join(', ')}&rdquo; wellness band ({f2(Math.min(...realMh('wellness')), 1)} to {f2(Math.max(...realMh('wellness')), 1)}), while every overall score is a grade {[...new Set(real.map((s) => s.report.grade))].join(', ')}.
          </p>
        </div>
        <label className="check" htmlFor={testId}><input id={testId} type="checkbox" checked={showTest} onChange={(e) => setShowTest(e.target.checked)} /> Include {nTestVerify} test and verify runs</label>
      </div>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Strip chart of recorded efficiency, shape quality, score and wellness scores per session" onMouseLeave={() => setHover(null)}>
        {[0, 25, 50, 75, 100].map((t) => <g key={t}><line className="axis" x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} /><text x={pl - 6} y={y(t) + 4} textAnchor="end">{t}</text></g>)}
        {COLS.map(([k, l], i) => (
          <g key={k}>
            <text x={cx(i)} y={H - 12} textAnchor="middle" style={{ fill: 'var(--text)' }}>{l}</text>
            {rows.map((s, j) => {
              const v = val(s, k); if (v == null) return null;
              const on = hover === s.id;
              return <circle key={s.id} cx={cx(i) + ((j % 9) - 4) * 5} cy={y(v)} r={on ? 6 : 4} fill={s.kind === 'real' ? 'var(--primary)' : 'var(--warn)'} opacity={hover && !on ? 0.2 : 0.75} onMouseEnter={() => setHover(s.id)} />;
            })}
          </g>
        ))}
      </svg>
      <div className="legend"><span><i style={{ background: 'var(--primary)' }} />real session</span><span><i style={{ background: 'var(--warn)' }} />test or verify run</span><span>Hover a dot or a row to follow one session.</span></div>
      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table className="sessions">
          <thead><tr>
            <th><button className="sort" aria-pressed={sort === 'time'} onClick={() => setSort('time')}>Session</button></th><th>Strokes</th>
            {COLS.map(([k, l]) => <th key={k}><button className="sort" aria-pressed={sort === k} onClick={() => setSort(k)}>{l}</button></th>)}<th>Grade</th>
          </tr></thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className={hover === s.id ? 'hl' : ''} onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}>
                <td className="mono">{shortId(s.id)}{s.kind !== 'real' && <span className="pill warn tiny">{s.kind}</span>}</td><td>{strokesOf(s)}</td>
                {COLS.map(([k]) => <td key={k}>{f2(val(s, k), k === 'efficiency' || k === 'quality' || k === 'score' ? 2 : 1)}</td>)}<td>{s.report.grade ?? '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint">Click a column header to sort. Test runs have no features because their strokes failed validation (missing stroke IDs), so the engine scored them from defaults.</p>
    </section>
  );
}

// ---------- weights playground ----------
const IND = {
  tremor_index: ['Tremor index', 0, 2, 0.01], speed_inconsistency: ['Speed inconsistency', 0, 2, 0.01], pause_frequency: ['Pause frequency', 0, 1, 0.01],
  pressure_stability: ['Pressure stability', 0, 1, 0.01], fluidity_index: ['Fluidity', 0, 1, 0.01], efficiency_level: ['Efficiency level', 0, 100, 0.01],
  quality_level: ['Quality level', 0, 100, 0.01], duration_concern: ['Duration concern', 0, 1, 0.01], completion_status: ['Completion status', 0.5, 1, 0.5], error_count: ['Error count (normalised)', 0, 1, 0.01],
};

function Weights() {
  const [sid, setSid] = useState(real[0].id);
  const session = S.find((s) => s.id === sid);
  const [ind, setInd] = useState(() => ({ ...real[0].report.mh.indicators }));
  const [mode, setMode] = useState('recorded');
  const load = (m, s = session) => {
    setMode(m);
    if (m === 'recorded') setInd({ ...s.report.mh.indicators });
    else { const r = reportSession(s); const f = extractDynamic(r.strokes, r.start, r.end); setInd(whatIfIndicators(f, s.report.mh.indicators)); }
  };
  const mh = mentalHealth(ind);
  const bars = [['Stress', mh.stress], ['Anxiety', mh.anxiety], ['Burnout', mh.burnout], ['Cognitive load', mh.cognitive]];
  return (
    <section id="weights" className="card window reveal" data-title="mental_health_assessment.py — weights playground">
      <div className="head">
        <div>
          <p className="eyebrow">Formula playground</p>
          <h2>Move the ten inputs and watch the hand-picked weights respond.</h2>
          <p className="sub">
            The four scores use the exact weights and caps in <a href={blob('features/mental_health_assessment.py')}>mental_health_assessment.py</a>. Load a session&rsquo;s indicators as the pipeline actually received them: {constantIndicators.length} of the ten ({constantIndicators.map((k) => IND[k][0].toLowerCase()).join(', ')}) are identical in all {S.length} reports.
            With tremor, speed inconsistency and pause frequency at 0 and pressure stability and fluidity at 0.5, stress is always 5.0 and anxiety always 12.5.
          </p>
        </div>
        <span className={`pill ${mode === 'recorded' ? 'info' : mode === 'whatif' ? 'warn' : 'bad'}`}>{mode === 'recorded' ? 'as recorded' : mode === 'whatif' ? 'what-if' : 'edited'}</span>
      </div>
      <div className="controls">
        <Select label="Session to load" value={sid} onChange={(v) => { setSid(v); load(mode === 'whatif' ? 'whatif' : 'recorded', S.find((s) => s.id === v)); }}>
          {real.map((s) => <option key={s.id} value={s.id}>{shortId(s.id)} · {when(s)}</option>)}
        </Select>
      </div>
      <div className="actions" style={{ marginTop: 0, marginBottom: 16 }}>
        <button className="btn primary" onClick={() => load('recorded')}>Inputs as the pipeline actually received them</button>
        <button className="btn ghost" onClick={() => load('whatif')}>What-if: inputs computed from this session&rsquo;s strokes</button>
      </div>
      <div className="grid2">
        <div className="controls" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {Object.entries(IND).map(([k, [l, mn, mx, st]]) => (
            <Range key={k} label={l} value={ind[k]} min={mn} max={mx} step={st} show={f2(ind[k], mx > 2 ? 2 : 3)} onChange={(v) => { setMode('edited'); setInd((o) => ({ ...o, [k]: v })); }} />
          ))}
        </div>
        <div>
          <div className="bars">
            {bars.map(([l, v]) => (
              <div className="bar-row" key={l}>
                <div className="lab"><span>{l}</span><b>{f2(v, 1)}</b></div>
                <div className="track"><div className="fill" style={{ width: `${v}%`, background: v > 70 ? 'var(--bad)' : v > 50 ? 'var(--warn)' : 'var(--primary)' }} /></div>
              </div>
            ))}
          </div>
          <div className="tiles two" style={{ marginTop: 16 }}>
            <div className="tile"><div className="num">{f2(mh.wellness, 1)}</div><div className="cap">wellness = 100 − mean of the four ({mh.level})</div></div>
            <div className="tile"><div className="num small">{mh.primary.replace('_', ' ')}</div><div className="cap">primary concern (highest score)</div></div>
          </div>
          <h3 style={{ marginTop: 16 }}>Recommendations the repo would print</h3>
          <ul className="recs">{mh.recommendations.map((r) => <li key={r}>{r}</li>)}</ul>
          {mode === 'recorded' && <p className="hint">Saved report for this session: stress {f2(session.report.mh.stress, 1)}, anxiety {f2(session.report.mh.anxiety, 1)}, burnout {f2(session.report.mh.burnout, 1)}, cognitive {f2(session.report.mh.cognitive, 1)}, wellness {f2(session.report.mh.wellness, 1)}. Indicators are stored to two decimals, so a score can differ by 0.1.</p>}
          {mode === 'whatif' && <p className="hint">What-if only: tremor is the coefficient of variation of acceleration, speed inconsistency that of per-stroke mean speed, pause frequency is pauses per stroke. The repo never computes these for the engine.</p>}
        </div>
      </div>
    </section>
  );
}

// ---------- benchmark ----------
function Bench() {
  const tasks = data.bench.map((b) => ({ ...b, runs: data.benchRaw.filter((r) => r.task_title === b.task_title).map((r) => r.extraction_ms) }));
  const src = S.find((s) => s.id === 'session-1772430903272');
  const pts = (title) => src.tasks.find((t) => t.title === title)?.strokes.reduce((n, st) => n + st.x.length, 0);
  const W = 960, rowH = 56, H = tasks.length * rowH + 34, l = 210, r = 20, mx = Math.ceil(Math.max(...tasks.map((t) => t.max_ms)) / 5) * 5;
  const x = (v) => l + (v / mx) * (W - l - r);
  return (
    <section id="bench" className="card window reveal" data-title="dynamic_feature_benchmarks.csv — extraction time (recorded)">
      <p className="eyebrow">Recorded timings</p>
      <h2>Feature extraction takes milliseconds and grows with the number of points.</h2>
      <p className="sub">
        Five timed runs per task of the Python extractor on session 1772430903272, as saved by <a href={blob('dynamic_session_test.ipynb')}>dynamic_session_test.ipynb</a>. Dots are single runs from <code>dynamic_feature_benchmarks_raw.csv</code>; the bar is the mean and the whisker the min to max from <code>dynamic_feature_benchmarks.csv</code>. The machine that recorded them is not documented.
      </p>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Extraction time per task: individual runs, mean and range" style={{ marginTop: 12 }}>
        {Array.from({ length: mx / 5 + 1 }, (_, i) => i * 5).map((t) => <g key={t}><line className="axis" x1={x(t)} x2={x(t)} y1={0} y2={H - 24} /><text x={x(t)} y={H - 8} textAnchor="middle">{t} ms</text></g>)}
        {tasks.map((t, i) => {
          const cy = i * rowH + 26;
          return (
            <g key={t.task_title}>
              <text x={0} y={cy - 2} style={{ fill: 'var(--text)', fontSize: 13 }}>{t.task_title}</text>
              <text x={0} y={cy + 14}>{pts(t.task_title)?.toLocaleString('en-US')} points</text>
              <rect x={l} y={cy - 9} width={x(t.mean_ms) - l} height={18} rx="5" fill="var(--primary)" opacity="0.18" />
              <line x1={x(t.min_ms)} x2={x(t.max_ms)} y1={cy} y2={cy} stroke="var(--primary)" strokeWidth="2" />
              {t.runs.map((v, j) => <circle key={j} cx={x(v)} cy={cy} r="4.5" fill="var(--primary)" opacity="0.8" />)}
              <text x={x(t.max_ms) + 8} y={cy + 4} style={{ fill: 'var(--text)' }}>{f2(t.mean_ms, 1)} ms</text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

// ---------- claims ----------
function Claims() {
  const c = data.claims;
  const lv = realMh('level'); const cnt = (k) => lv.filter((x) => x === k).length;
  const effBurn = pearson(real.map((s) => s.report.efficiency), realMh('burnout'));
  const scores = real.map((s) => s.report.score);
  const dims = [['Stress', 'stress'], ['Anxiety', 'anxiety'], ['Burnout', 'burnout'], ['Cognitive Load', 'cognitive'], ['Overall Wellness', 'wellness']];
  const rows = [
    ['Dataset size', `${c.n} real-world sessions`, `${real.length} real sessions (+${nTestVerify} test/verify) recorded on ${days.length} days`, 'bad'],
    ...dims.map(([d, k]) => {
      const v = realMh(k), p = c.table[d];
      return [`${d} mean (SD), range`, `${p.mean} (${p.sd}), ${p.min} to ${p.max}`, `${f2(avg(v), 1)} (${f2(sd(v), 1)}), ${f2(Math.min(...v), 1)} to ${f2(Math.max(...v), 1)}`, Math.abs(avg(v) - p.mean) < 1 ? 'good' : 'bad'];
    }),
    ['Wellness bands E/G/F/P/C', Object.values(c.dist).join(' / '), ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'].map(cnt).join(' / '), 'bad'],
    ...c.corr.map((r) => {
      let got = 'not computable: input not stored';
      if (r.a === 'Efficiency' && r.b === 'Burnout') got = `r = ${f2(effBurn)}`;
      if ([r.a, r.b].includes('Stress') && new Set(realMh('stress')).size === 1) got = 'undefined: stress is constant';
      return [`${r.a} ↔ ${r.b}`, `r = ${r.r}`, got, got.startsWith('r =') ? 'warn' : 'bad'];
    }),
    ['Average score per task', c.taskAvg.join(' / '), `session scores ${f2(Math.min(...scores))} to ${f2(Math.max(...scores))}, all grade ${[...new Set(real.map((s) => s.report.grade))].join('')}`, 'bad'],
    [`Score = ${c.scoreFormula[0]}·E + ${c.scoreFormula[1]}·Q`, 'the scoring rule', `reproduces ${scoreMatches} of ${scoreRows.length} saved scores (e.g. ${shortId(worstGap.s.id)}: saved ${f2(worstGap.s.report.score)}, formula ${f2(worstGap.calc)})`, 'warn'],
  ];
  return (
    <section id="claims" className="card window reveal" data-title="RESEARCH_PAPER.md — reproducibility check">
      <p className="eyebrow">Reproducibility check</p>
      <h2>The paper&rsquo;s results section cannot be rebuilt from the committed data.</h2>
      <p className="sub">
        Left: values parsed from <a href={blob('RESEARCH_PAPER.md')}>RESEARCH_PAPER.md</a> section 4 at build time. Right: the same quantity computed from the {real.length} real reports in <code>Records/</code>.
        The paper may describe data that was never committed, but nothing in the repo supports its table, distribution or correlations. The feature extraction code itself does reproduce: see the replay and the build check.
      </p>
      <div style={{ overflowX: 'auto', marginTop: 16 }}>
        <table>
          <thead><tr><th>Claim</th><th>Paper says</th><th>Committed data gives</th><th>Match</th></tr></thead>
          <tbody>{rows.map(([k, p, g, s]) => <tr key={k}><td>{k}</td><td>{p}</td><td>{g}</td><td><span className={`pill ${s}`}>{s === 'good' ? 'Close' : s === 'warn' ? 'Partial' : 'No'}</span></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function Limits() {
  const items = [
    ['No ground truth', 'There are no PHQ-9, GAD-7 or burnout-scale labels anywhere in the repo. Every wellness weight was chosen by hand; none was fitted or validated.'],
    ['Plumbing bug', `The indicator code reads keys the pipeline never writes, so ${constantIndicators.length} of 10 indicators are constant across all ${S.length} reports and two of four scores carry no information.`],
    ['Mouse input', `Every point in the real sessions has pressure ${data.input.pressures.join(', ')} and tilt ${data.input.tilts.join(', ')} (input type: ${data.input.inputTypes.join(', ')}). Pressure stability could never vary.`],
    ['Tiny sample', `${real.length} sessions over ${days.length} days, apparently from one person. Only ${fullSessions} cover all three standard tasks; ${real.filter((s) => strokesOf(s) <= 3).length} have three strokes or fewer.`],
    ['Code and reports drifted', `The saved scores use a completion term that no code in the repo contains: the current 0.4·E + 0.6·Q rule reproduces ${scoreMatches} of ${scoreRows.length}. Saved values are shown as recorded.`],
    ['Weak metric definitions', `Efficiency divides speed variance by 1000, but the largest recorded variance is ${f2(maxSpeedVar, 3)}, so the speed term is about 1 and efficiency reduces to a pause count. Shape quality takes the absolute pixel correlation with a mirror image, so a negative correlation counts as symmetry.`],
  ];
  const next = [
    'Fix the indicator key mismatch in mental_health_assessment.py and regenerate the reports (needs the Owner’s sign-off, because it changes the stored results).',
    'Collect labelled data: a validated questionnaire next to each session, many participants, stylus input with real pressure.',
    'Pre-register the hypotheses and fit the weights on one split, test them on another.',
  ];
  return (
    <section id="limits" className="card window reveal" data-title="limitations.md">
      <p className="eyebrow">Threats to validity</p>
      <h2>What this repo can and cannot show.</h2>
      <p className="sub">It shows a working capture-and-feature pipeline whose maths reproduces. It does not show that drawing dynamics measure stress, anxiety, burnout or cognitive load.</p>
      <div className="grid2" style={{ marginTop: 16 }}>
        {items.map(([t, d]) => <div className="tile" key={t}><h3>{t}</h3><p className="hint" style={{ margin: '6px 0 0', fontSize: 13 }}>{d}</p></div>)}
      </div>
      <h3 style={{ marginTop: 20 }}>Next steps</h3>
      <ol className="steps" style={{ marginTop: 12 }}>
        {next.map((n, i) => <li key={i}><span className="n">{i + 1}</span><div className="hint" style={{ fontSize: 13, paddingTop: 6 }}>{n}</div></li>)}
      </ol>
      <p className="hint" style={{ marginTop: 16 }}>Full grading and the compute or data each gap needs: <a href={blob('docs/research-review.md')}>docs/research-review.md</a>.</p>
    </section>
  );
}
