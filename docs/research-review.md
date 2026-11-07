# Research review: DrawingModalitySprint3

A review of the repository against a doctoral-level research rubric, plus an engineering rubric for the software.
Every factual statement below was checked against committed files. The numbers are produced by
`site/scripts/build-data.mjs` and `site/src/features.check.mjs` (run by `cd site && npm run build`) and by
`tests/test_feature_math.py`.

**Overall grade: D on research validity, C+ on engineering.** The capture and feature-extraction code is real
and reproduces its own outputs. The psychological claims have no supporting evidence in the repo.

## What was verified

| Check | Result | Where |
|---|---|---|
| Dynamic features for the 3 tasks of `Records/session-1772430903272` vs `dynamic_feature_summary.csv` | match to 1e-9, in Python and in the JS port | `tests/test_feature_math.py`, `site/src/features.check.mjs` |
| Dynamic features of every saved report that has them (17: 15 real, 2 verify), recomputed from the stroke JSON | match to 1e-9, except stroke frequency in 5 later reports (their session start/end times were used but not saved) | `features.check.mjs` |
| Drawing efficiency, shape quality and grade in those 17 reports | all reproduce with the current code | `features.check.mjs` |
| Overall score `0.4·E + 0.6·Q` | reproduces 3 of 17 saved scores; the rest use a `completion_component` that no code in the repo contains | `features.check.mjs` |
| Wellness indicators and the four scores in all 21 reports | reproduce exactly from `_extract_indicators` applied to the saved report | `features.check.mjs` |
| `tests/integration_tests.py` | 14/14 pass (numpy, pandas, opencv-python-headless, scikit-image installed locally) | run locally |

## Rubric

| Criterion | Grade | Finding |
|---|---|---|
| Research question | D | The paper asks whether drawing dynamics measure stress, anxiety, burnout and cognitive load, but never states it as a testable question with an outcome measure. |
| Hypotheses | F | No pre-specified hypotheses or falsification criteria. The correlations in section 4.4 are reported as "validating" after the fact. |
| Method | C | The feature definitions are explicit and documented in code (speed, acceleration, pauses, 30° direction changes, curvature). The scoring weights are hand-picked. Two metric definitions are weak: efficiency divides speed variance by 1000 when recorded variances are 0.03 to 1.17, so it reduces to a pause count; shape "symmetry" uses the absolute pixel correlation with a mirror image, so negative correlation counts as symmetry. |
| Baselines | F | No comparison with any existing clock-drawing or handwriting scoring, or with a trivial baseline such as stroke count. |
| Statistics and uncertainty | F | The paper's table (n=35, stress mean 35.2, SD 18.4) and correlations (r = 0.62, −0.71, −0.68, −0.45) cannot be computed from any committed file. In the committed reports stress is 5.0 and anxiety 12.5 in every session, so those correlations are undefined. No intervals anywhere. |
| Reproducibility | C− | Feature extraction reproduces (above). The results section does not. Reports were produced by a pipeline version that is not in the repo. `requirements.txt` uses unpinned `>=` ranges. Notebooks hard-code a Windows path. |
| Threats to validity | D | Paper section 6 lists small sample and missing clinical validation, but the abstract still claims validation. Unlisted: one apparent participant, mouse input with constant pressure, the indicator bug below. |
| Related work | D | Classic drawing tests are cited, but some references are irrelevant or doubtful (Viterbi 1967 under digital health; "Ramirez-Mahaluf 2018, Tremor and Parkinson's disease, Nat Rev Dis Primers"). None supports the specific motor-to-psychology weights. |
| Limitations | D | See below. The dashboard's limitations window states them plainly. |
| Engineering rigor | C+ | Clear module boundaries (dynamic, static, pipeline, engine, Flask API), validation of stroke data, an integration test script that passes. Hygiene debt: committed `__pycache__` and `.obsidian`, `.backup` and `-old.html` duplicates, script-style tests rather than asserts on the maths. |

## The critical bug

`mental_health_assessment._extract_indicators` reads `features.dynamic.temporal.acceleration_profile`,
`motion.avg_speed_per_stroke`, `timing.pause_events`, `rhythm.rhythm_regularity` and `raw_session_data`.
`integration_pipeline` writes none of them. So tremor index, speed inconsistency and pause frequency are always 0, and
fluidity and pressure stability always 0.5. The result is stress = 5.0 and anxiety = 12.5 in all 21 committed reports.
The dashboard's weights playground shows this with the "as the pipeline actually received them" preset, and a
labelled what-if shows what the same formulas give when fed indicators computed from the strokes.

## Fixed now (cheap)

- Known-answer link between the Python method and the browser demo: `site/src/features.check.mjs` (fails the build on drift) and `tests/test_feature_math.py`.
- Reproducibility note in `README.md` pointing at the claims check; the paper itself is unchanged.
- `.gitignore` for caches, test reports and the site build (tracked `__pycache__` files left as they are).
- Public dashboard with the plumbing bug, the constant scores and the paper/data mismatch shown openly.

## Remaining gaps and exactly what each needs

| Gap | What closes it | Cost |
|---|---|---|
| Indicator key mismatch | Change `_extract_indicators` to read `timing.strokes`, `pauses.count` and per-stroke speed/acceleration arrays that the extractor already computes, add one assert test, regenerate the 21 reports. Changes the stored science, so it needs the Owner's approval first. | about an hour, no compute |
| Code/report drift (`completion_component`) | Recover the scoring code that wrote the reports, or regenerate every report with the current code and say so. | about an hour, needs the opencv stack locally |
| No ground truth | A validated questionnaire (PHQ-9, GAD-7, a burnout scale) collected next to each drawing session, with ethics approval and consent. | data collection, weeks |
| Sample size | Power analysis first; for detecting r ≈ 0.3 at 80% power and α = 0.05 a study needs about 85 participants, each from a distinct person, across days. | recruitment |
| Constant pressure | Stylus or tablet input (Apple Pencil, Wacom) so pressure and tilt carry signal. | hardware, no compute |
| Fitted, tested weights | Pre-register hypotheses; fit weights on a training split, report held-out performance with confidence intervals, compare with a stroke-count baseline. | CPU minutes once labelled data exists |
| Paper section 4 | Either commit the 35-session data and the script that produced the table, or rewrite section 4 from the committed 15 sessions. | an afternoon |
| Pinned environment | Pin `requirements.txt` to exact versions and move notebook paths to repo-relative. | minutes |
