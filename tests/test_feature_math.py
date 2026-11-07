"""Known-answer test: the dynamic feature extractor reproduces dynamic_feature_summary.csv.

dynamic_session_test.ipynb wrote that CSV from Records/session-1772430903272, one row per task.
This rebuilds the same task sessions and asserts every numeric column to 1e-9.
Run: python -m pytest tests/test_feature_math.py
"""
import csv
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "features"))
from dynamic_features import DynamicFeatureExtractor  # noqa: E402

SESSION = ROOT / "Records" / "session-1772430903272" / "JSON" / "session-1772430903272.json"


def _iso(ms):
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).isoformat().replace("+00:00", "Z")


def _task_session(task):
    # Same construction as build_task_dynamic_session in dynamic_session_test.ipynb
    strokes, ts = [], []
    for i, st in enumerate(task["strokes"]):
        pts = [p["timestamp"] for p in st["points"]]
        ts += pts
        strokes.append({"strokeId": st.get("strokeId", f"stroke-{i + 1}"), "points": st["points"],
                        "startTime": st.get("startTime") or _iso(min(pts)), "endTime": st.get("endTime") or _iso(max(pts))})
    return {"sessionId": "t", "sessionStartTime": _iso(min(ts)), "sessionEndTime": _iso(max(ts)),
            "strokes": strokes, "deviceInfo": {}}


def test_extractor_reproduces_summary_csv():
    raw = json.loads(SESSION.read_text())
    rows = list(csv.DictReader((ROOT / "dynamic_feature_summary.csv").open()))
    assert len(rows) == 3
    for row in rows:
        f = DynamicFeatureExtractor(_task_session(raw["tasks"][row["task_key"]])).extract_all_features()
        got = {"total_strokes": f.total_strokes, "total_points": f.total_points, "avg_speed": f.avg_speed,
               "max_speed": f.max_speed, "speed_variance": f.speed_variance, "avg_acceleration": f.avg_acceleration,
               "max_acceleration": f.max_acceleration, "acceleration_variance": f.acceleration_variance,
               "total_drawing_time_ms": f.total_drawing_time, "total_pause_time_ms": f.total_pause_time,
               "number_of_pauses": f.number_of_pauses, "avg_pause_duration_ms": f.avg_pause_duration,
               "stroke_frequency_hz": f.stroke_frequency, "direction_changes": f.direction_changes,
               "avg_curvature": f.avg_curvature, "max_curvature": f.max_curvature, "drawing_area": f.drawing_area}
        for k, v in got.items():
            assert math.isclose(v, float(row[k]), rel_tol=1e-9, abs_tol=1e-12), (row["task_title"], k, v, row[k])
