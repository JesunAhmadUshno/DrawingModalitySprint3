# `dynamic_features.py` - Line-by-Line Explanation

This document explains every line in `features/dynamic_features.py`.

| Line | Code | Explanation |
|---:|---|---|
| 1 | `"""` | Opens or closes a triple-quoted docstring block. |
| 2 | `Sprint 3 - Dynamic Feature Extraction Module` | Docstring text describing module/class/function behavior. |
| 3 | `==============================================` | Docstring text describing module/class/function behavior. |
| 4 | `Temporal Stroke Signal Processing & Behavioral Feature Extraction` | Docstring text describing module/class/function behavior. |
| 5 | `` | Blank line for readability and structure. |
| 6 | `Module: dynamic_features.py` | Docstring text describing module/class/function behavior. |
| 7 | `Author: Jesun - Dynamic Feature Generation Lead` | Docstring text describing module/class/function behavior. |
| 8 | `Date: February 16-March 2, 2026` | Docstring text describing module/class/function behavior. |
| 9 | `` | Blank line for readability and structure. |
| 10 | `Purpose:` | Docstring section header describing the next documented topic. |
| 11 | `Extract temporal/dynamic features from drawing session data.` | Docstring text describing module/class/function behavior. |
| 12 | `Dynamic features = features derived from live interaction timing and movement patterns.` | Docstring text describing module/class/function behavior. |
| 13 | `` | Blank line for readability and structure. |
| 14 | `Key Features:` | Docstring section header describing the next documented topic. |
| 15 | `- Temporal signal validation and continuity checking` | Docstring bullet describing a capability or component. |
| 16 | `- Real-time behavioral signal extraction` | Docstring bullet describing a capability or component. |
| 17 | `- Speed/velocity profile calculation` | Docstring bullet describing a capability or component. |
| 18 | `- Acceleration pattern analysis` | Docstring bullet describing a capability or component. |
| 19 | `- Stroke timing statistics` | Docstring bullet describing a capability or component. |
| 20 | `- Pause detection and analysis` | Docstring bullet describing a capability or component. |
| 21 | `- Movement rhythm extraction` | Docstring bullet describing a capability or component. |
| 22 | `- Direction changes and curvature calculation` | Docstring bullet describing a capability or component. |
| 23 | `` | Blank line for readability and structure. |
| 24 | `Classes:` | Docstring section header describing the next documented topic. |
| 25 | `--------` | Docstring text describing module/class/function behavior. |
| 26 | `- DrawingSessionValidator: Validates temporal data integrity` | Docstring bullet describing a capability or component. |
| 27 | `- DynamicFeatureExtractor: Extracts all dynamic features` | Docstring bullet describing a capability or component. |
| 28 | `- StrokeAnalyzer: Low-level stroke analysis` | Docstring bullet describing a capability or component. |
| 29 | `` | Blank line for readability and structure. |
| 30 | `Functions:` | Docstring section header describing the next documented topic. |
| 31 | `----------` | Docstring text describing module/class/function behavior. |
| 32 | `See individual class methods for comprehensive documentation.` | Docstring text describing module/class/function behavior. |
| 33 | `"""` | Opens or closes a triple-quoted docstring block. |
| 34 | `` | Blank line for readability and structure. |
| 35 | `import numpy as np` | Imports a required library or module into scope. |
| 36 | `import pandas as pd` | Imports a required library or module into scope. |
| 37 | `import json` | Imports a required library or module into scope. |
| 38 | `from typing import Dict, List, Tuple, Optional, Any` | Imports specific symbols from a module. |
| 39 | `from dataclasses import dataclass, asdict` | Imports specific symbols from a module. |
| 40 | `from datetime import datetime` | Imports specific symbols from a module. |
| 41 | `import warnings` | Imports a required library or module into scope. |
| 42 | `` | Blank line for readability and structure. |
| 43 | `` | Blank line for readability and structure. |
| 44 | `def parse_timestamp(timestamp) -> datetime:` | Defines a function or method signature and return contract. |
| 45 | `    """` | Opens or closes a triple-quoted docstring block. |
| 46 | `    Parse timestamp from either Unix timestamp (int/float in milliseconds) or ISO string.` | Docstring text describing module/class/function behavior. |
| 47 | `    ` | Blank line for readability and structure. |
| 48 | `    Args:` | Docstring section header describing the next documented topic. |
| 49 | `        timestamp: Either int/float (Unix ms) or ISO string` | Docstring text describing module/class/function behavior. |
| 50 | `        ` | Blank line for readability and structure. |
| 51 | `    Returns:` | Docstring section header describing the next documented topic. |
| 52 | `        datetime object` | Docstring text describing module/class/function behavior. |
| 53 | `    """` | Opens or closes a triple-quoted docstring block. |
| 54 | `    if isinstance(timestamp, (int, float)):` | Conditional branch that runs when condition is true. |
| 55 | `        return datetime.fromtimestamp(timestamp / 1000)` | Returns computed value(s) to the caller. |
| 56 | `    else:` | Fallback branch when prior conditions are not met. |
| 57 | `        return datetime.fromisoformat(timestamp.replace('Z', '+00:00'))` | Returns computed value(s) to the caller. |
| 58 | `` | Blank line for readability and structure. |
| 59 | `` | Blank line for readability and structure. |
| 60 | `@dataclass` | Applies dataclass decorator to auto-generate boilerplate methods. |
| 61 | `class TemporalValidationResult:` | Defines a class used to organize related data or behavior. |
| 62 | `    """Result of temporal validation"""` | Executes part of the dynamic feature extraction workflow. |
| 63 | `    is_valid: bool` | Executes part of the dynamic feature extraction workflow. |
| 64 | `    errors: List[str]` | Executes part of the dynamic feature extraction workflow. |
| 65 | `    warnings: List[str]` | Executes part of the dynamic feature extraction workflow. |
| 66 | `    stats: Dict[str, Any]` | Executes part of the dynamic feature extraction workflow. |
| 67 | `` | Blank line for readability and structure. |
| 68 | `` | Blank line for readability and structure. |
| 69 | `@dataclass` | Applies dataclass decorator to auto-generate boilerplate methods. |
| 70 | `class DynamicFeatures:` | Defines a class used to organize related data or behavior. |
| 71 | `    """Container for extracted dynamic features"""` | Executes part of the dynamic feature extraction workflow. |
| 72 | `    # Speed features` | Comment describing purpose of the next code block. |
| 73 | `    avg_speed: float` | Executes part of the dynamic feature extraction workflow. |
| 74 | `    max_speed: float` | Executes part of the dynamic feature extraction workflow. |
| 75 | `    min_speed: float` | Executes part of the dynamic feature extraction workflow. |
| 76 | `    speed_variance: float` | Executes part of the dynamic feature extraction workflow. |
| 77 | `    speed_profile: List[float]` | Executes part of the dynamic feature extraction workflow. |
| 78 | `    ` | Blank line for readability and structure. |
| 79 | `    # Acceleration features` | Comment describing purpose of the next code block. |
| 80 | `    avg_acceleration: float` | Executes part of the dynamic feature extraction workflow. |
| 81 | `    max_acceleration: float` | Executes part of the dynamic feature extraction workflow. |
| 82 | `    acceleration_variance: float` | Executes part of the dynamic feature extraction workflow. |
| 83 | `    acceleration_profile: List[float]` | Executes part of the dynamic feature extraction workflow. |
| 84 | `    ` | Blank line for readability and structure. |
| 85 | `    # Stroke timing` | Comment describing purpose of the next code block. |
| 86 | `    total_drawing_time: float  # milliseconds` | Executes part of the dynamic feature extraction workflow. |
| 87 | `    total_pause_time: float    # milliseconds` | Executes part of the dynamic feature extraction workflow. |
| 88 | `    stroke_durations: List[float]  # milliseconds per stroke` | Executes part of the dynamic feature extraction workflow. |
| 89 | `    ` | Blank line for readability and structure. |
| 90 | `    # Pause analysis` | Comment describing purpose of the next code block. |
| 91 | `    number_of_pauses: int` | Executes part of the dynamic feature extraction workflow. |
| 92 | `    avg_pause_duration: float` | Executes part of the dynamic feature extraction workflow. |
| 93 | `    max_pause_duration: float` | Executes part of the dynamic feature extraction workflow. |
| 94 | `    pause_durations: List[float]` | Executes part of the dynamic feature extraction workflow. |
| 95 | `    ` | Blank line for readability and structure. |
| 96 | `    # Movement rhythm` | Comment describing purpose of the next code block. |
| 97 | `    inter_stroke_interval: List[float]  # time between strokes` | Executes part of the dynamic feature extraction workflow. |
| 98 | `    avg_inter_stroke_interval: float` | Executes part of the dynamic feature extraction workflow. |
| 99 | `    stroke_frequency: float  # strokes per second` | Executes part of the dynamic feature extraction workflow. |
| 100 | `    ` | Blank line for readability and structure. |
| 101 | `    # Direction & curvature` | Comment describing purpose of the next code block. |
| 102 | `    direction_changes: int` | Executes part of the dynamic feature extraction workflow. |
| 103 | `    avg_curvature: float` | Executes part of the dynamic feature extraction workflow. |
| 104 | `    max_curvature: float` | Executes part of the dynamic feature extraction workflow. |
| 105 | `    curvature_profile: List[float]` | Executes part of the dynamic feature extraction workflow. |
| 106 | `    ` | Blank line for readability and structure. |
| 107 | `    # Overall statistics` | Comment describing purpose of the next code block. |
| 108 | `    total_strokes: int` | Executes part of the dynamic feature extraction workflow. |
| 109 | `    total_points: int` | Executes part of the dynamic feature extraction workflow. |
| 110 | `    avg_points_per_stroke: float` | Executes part of the dynamic feature extraction workflow. |
| 111 | `    drawing_area: float  # bounding box area` | Executes part of the dynamic feature extraction workflow. |
| 112 | `` | Blank line for readability and structure. |
| 113 | `` | Blank line for readability and structure. |
| 114 | `class DrawingSessionValidator:` | Defines a class used to organize related data or behavior. |
| 115 | `    """` | Opens or closes a triple-quoted docstring block. |
| 116 | `    Validates temporal integrity of drawing sessions.` | Docstring text describing module/class/function behavior. |
| 117 | `    ` | Blank line for readability and structure. |
| 118 | `    Ensures:` | Docstring section header describing the next documented topic. |
| 119 | `    - Timestamps are monotonically increasing within strokes` | Docstring bullet describing a capability or component. |
| 120 | `    - Time values are reasonable (not negative, not in future)` | Docstring bullet describing a capability or component. |
| 121 | `    - All required fields present` | Docstring bullet describing a capability or component. |
| 122 | `    - No data corruption` | Docstring bullet describing a capability or component. |
| 123 | `    """` | Opens or closes a triple-quoted docstring block. |
| 124 | `    ` | Blank line for readability and structure. |
| 125 | `    @staticmethod` | Declares the following method as static (no self required). |
| 126 | `    def validate_session(session: Dict) -> TemporalValidationResult:` | Defines a function or method signature and return contract. |
| 127 | `        """` | Opens or closes a triple-quoted docstring block. |
| 128 | `        Validate temporal integrity of entire session.` | Docstring text describing module/class/function behavior. |
| 129 | `        ` | Blank line for readability and structure. |
| 130 | `        Args:` | Docstring section header describing the next documented topic. |
| 131 | `            session: Drawing session JSON object` | Docstring text describing module/class/function behavior. |
| 132 | `            ` | Blank line for readability and structure. |
| 133 | `        Returns:` | Docstring section header describing the next documented topic. |
| 134 | `            TemporalValidationResult with validation status and details` | Docstring text describing module/class/function behavior. |
| 135 | `        """` | Opens or closes a triple-quoted docstring block. |
| 136 | `        errors = []` | Assigns a computed value to a variable or field. |
| 137 | `        warnings = []` | Assigns a computed value to a variable or field. |
| 138 | `        stats = {}` | Assigns a computed value to a variable or field. |
| 139 | `        ` | Blank line for readability and structure. |
| 140 | `        try:` | Begins protected block to catch runtime exceptions. |
| 141 | `            # Check required top-level fields` | Comment describing purpose of the next code block. |
| 142 | `            required_fields = ['sessionId', 'sessionStartTime', 'strokes', 'deviceInfo']` | Assigns a computed value to a variable or field. |
| 143 | `            for field in required_fields:` | Iterates through a sequence to process each item. |
| 144 | `                if field not in session:` | Conditional branch that runs when condition is true. |
| 145 | `                    errors.append(f"Missing required field: {field}")` | Executes part of the dynamic feature extraction workflow. |
| 146 | `            ` | Blank line for readability and structure. |
| 147 | `            if errors:` | Conditional branch that runs when condition is true. |
| 148 | `                return TemporalValidationResult(False, errors, warnings, {})` | Returns computed value(s) to the caller. |
| 149 | `            ` | Blank line for readability and structure. |
| 150 | `            # Validate session timestamps` | Comment describing purpose of the next code block. |
| 151 | `            task_start = parse_timestamp(session['sessionStartTime'])` | Assigns a computed value to a variable or field. |
| 152 | `            task_end = parse_timestamp(session.get('sessionEndTime', session['sessionStartTime']))` | Assigns a computed value to a variable or field. |
| 153 | `            ` | Blank line for readability and structure. |
| 154 | `            if task_end < task_start:` | Conditional branch that runs when condition is true. |
| 155 | `                errors.append("Task end time is before start time")` | Executes part of the dynamic feature extraction workflow. |
| 156 | `            ` | Blank line for readability and structure. |
| 157 | `            session_duration_ms = (task_end - task_start).total_seconds() * 1000` | Assigns a computed value to a variable or field. |
| 158 | `            stats['session_duration_ms'] = session_duration_ms` | Assigns a computed value to a variable or field. |
| 159 | `            ` | Blank line for readability and structure. |
| 160 | `            # Validate each stroke` | Comment describing purpose of the next code block. |
| 161 | `            total_points = 0` | Assigns a computed value to a variable or field. |
| 162 | `            stroke_count = len(session['strokes'])` | Assigns a computed value to a variable or field. |
| 163 | `            ` | Blank line for readability and structure. |
| 164 | `            for idx, stroke in enumerate(session['strokes']):` | Iterates through a sequence to process each item. |
| 165 | `                stroke_errors = DrawingSessionValidator.validate_stroke(stroke, idx)` | Assigns a computed value to a variable or field. |
| 166 | `                errors.extend(stroke_errors)` | Executes part of the dynamic feature extraction workflow. |
| 167 | `                total_points += len(stroke.get('points', []))` | Assigns a computed value to a variable or field. |
| 168 | `            ` | Blank line for readability and structure. |
| 169 | `            stats['total_strokes'] = stroke_count` | Assigns a computed value to a variable or field. |
| 170 | `            stats['total_points'] = total_points` | Assigns a computed value to a variable or field. |
| 171 | `            stats['avg_points_per_stroke'] = total_points / max(stroke_count, 1)` | Assigns a computed value to a variable or field. |
| 172 | `            ` | Blank line for readability and structure. |
| 173 | `            is_valid = len(errors) == 0` | Executes part of the dynamic feature extraction workflow. |
| 174 | `            ` | Blank line for readability and structure. |
| 175 | `            return TemporalValidationResult(is_valid, errors, warnings, stats)` | Returns computed value(s) to the caller. |
| 176 | `            ` | Blank line for readability and structure. |
| 177 | `        except Exception as e:` | Handles exceptions raised in the preceding try block. |
| 178 | `            errors.append(f"Validation error: {str(e)}")` | Executes part of the dynamic feature extraction workflow. |
| 179 | `            return TemporalValidationResult(False, errors, warnings, stats)` | Returns computed value(s) to the caller. |
| 180 | `    ` | Blank line for readability and structure. |
| 181 | `    @staticmethod` | Declares the following method as static (no self required). |
| 182 | `    def validate_stroke(stroke: Dict, stroke_idx: int) -> List[str]:` | Defines a function or method signature and return contract. |
| 183 | `        """` | Opens or closes a triple-quoted docstring block. |
| 184 | `        Validate temporal integrity of single stroke.` | Docstring text describing module/class/function behavior. |
| 185 | `        ` | Blank line for readability and structure. |
| 186 | `        Args:` | Docstring section header describing the next documented topic. |
| 187 | `            stroke: Stroke object` | Docstring text describing module/class/function behavior. |
| 188 | `            stroke_idx: Index of stroke in session` | Docstring text describing module/class/function behavior. |
| 189 | `            ` | Blank line for readability and structure. |
| 190 | `        Returns:` | Docstring section header describing the next documented topic. |
| 191 | `            List of error messages (empty if valid)` | Docstring text describing module/class/function behavior. |
| 192 | `        """` | Opens or closes a triple-quoted docstring block. |
| 193 | `        errors = []` | Assigns a computed value to a variable or field. |
| 194 | `        ` | Blank line for readability and structure. |
| 195 | `        try:` | Begins protected block to catch runtime exceptions. |
| 196 | `            # Check required stroke fields` | Comment describing purpose of the next code block. |
| 197 | `            required = ['strokeId', 'points', 'startTime', 'endTime']` | Assigns a computed value to a variable or field. |
| 198 | `            for field in required:` | Iterates through a sequence to process each item. |
| 199 | `                if field not in stroke:` | Conditional branch that runs when condition is true. |
| 200 | `                    errors.append(f"Stroke {stroke_idx}: Missing {field}")` | Executes part of the dynamic feature extraction workflow. |
| 201 | `                    return errors  # Can't continue without critical fields` | Returns computed value(s) to the caller. |
| 202 | `            ` | Blank line for readability and structure. |
| 203 | `            points = stroke['points']` | Assigns a computed value to a variable or field. |
| 204 | `            if not points:` | Conditional branch that runs when condition is true. |
| 205 | `                errors.append(f"Stroke {stroke_idx}: No points")` | Executes part of the dynamic feature extraction workflow. |
| 206 | `                return errors` | Returns computed value(s) to the caller. |
| 207 | `            ` | Blank line for readability and structure. |
| 208 | `            # Validate point timestamps are monotonically increasing` | Comment describing purpose of the next code block. |
| 209 | `            prev_timestamp = None` | Assigns a computed value to a variable or field. |
| 210 | `            for pt_idx, point in enumerate(points):` | Iterates through a sequence to process each item. |
| 211 | `                if 'timestamp' not in point:` | Conditional branch that runs when condition is true. |
| 212 | `                    errors.append(f"Stroke {stroke_idx}, Point {pt_idx}: Missing timestamp")` | Executes part of the dynamic feature extraction workflow. |
| 213 | `                    continue` | Executes part of the dynamic feature extraction workflow. |
| 214 | `                ` | Blank line for readability and structure. |
| 215 | `                timestamp = point['timestamp']` | Assigns a computed value to a variable or field. |
| 216 | `                ` | Blank line for readability and structure. |
| 217 | `                # Check timestamp is positive` | Comment describing purpose of the next code block. |
| 218 | `                if timestamp < 0:` | Conditional branch that runs when condition is true. |
| 219 | `                    errors.append(f"Stroke {stroke_idx}, Point {pt_idx}: Negative timestamp")` | Executes part of the dynamic feature extraction workflow. |
| 220 | `                ` | Blank line for readability and structure. |
| 221 | `                # Check monotonic increasing` | Comment describing purpose of the next code block. |
| 222 | `                if prev_timestamp is not None and timestamp < prev_timestamp:` | Conditional branch that runs when condition is true. |
| 223 | `                    errors.append(f"Stroke {stroke_idx}, Point {pt_idx}: Timestamp not monotonically increasing")` | Executes part of the dynamic feature extraction workflow. |
| 224 | `                ` | Blank line for readability and structure. |
| 225 | `                prev_timestamp = timestamp` | Assigns a computed value to a variable or field. |
| 226 | `            ` | Blank line for readability and structure. |
| 227 | `            # Validate stroke start/end times` | Comment describing purpose of the next code block. |
| 228 | `            stroke_start = parse_timestamp(stroke['startTime'])` | Assigns a computed value to a variable or field. |
| 229 | `            stroke_end = parse_timestamp(stroke['endTime'])` | Assigns a computed value to a variable or field. |
| 230 | `            ` | Blank line for readability and structure. |
| 231 | `            if stroke_end < stroke_start:` | Conditional branch that runs when condition is true. |
| 232 | `                errors.append(f"Stroke {stroke_idx}: End time before start time")` | Executes part of the dynamic feature extraction workflow. |
| 233 | `            ` | Blank line for readability and structure. |
| 234 | `        except Exception as e:` | Handles exceptions raised in the preceding try block. |
| 235 | `            errors.append(f"Stroke {stroke_idx}: {str(e)}")` | Executes part of the dynamic feature extraction workflow. |
| 236 | `        ` | Blank line for readability and structure. |
| 237 | `        return errors` | Returns computed value(s) to the caller. |
| 238 | `` | Blank line for readability and structure. |
| 239 | `` | Blank line for readability and structure. |
| 240 | `class StrokeAnalyzer:` | Defines a class used to organize related data or behavior. |
| 241 | `    """` | Opens or closes a triple-quoted docstring block. |
| 242 | `    Low-level analysis of individual strokes.` | Docstring text describing module/class/function behavior. |
| 243 | `    Calculates point-level and stroke-level metrics.` | Docstring text describing module/class/function behavior. |
| 244 | `    """` | Opens or closes a triple-quoted docstring block. |
| 245 | `    ` | Blank line for readability and structure. |
| 246 | `    @staticmethod` | Declares the following method as static (no self required). |
| 247 | `    def calculate_distances(stroke: Dict) -> np.ndarray:` | Defines a function or method signature and return contract. |
| 248 | `        """` | Opens or closes a triple-quoted docstring block. |
| 249 | `        Calculate Euclidean distances between consecutive points.` | Docstring text describing module/class/function behavior. |
| 250 | `        ` | Blank line for readability and structure. |
| 251 | `        Args:` | Docstring section header describing the next documented topic. |
| 252 | `            stroke: Stroke object with points` | Docstring text describing module/class/function behavior. |
| 253 | `            ` | Blank line for readability and structure. |
| 254 | `        Returns:` | Docstring section header describing the next documented topic. |
| 255 | `            Array of distances (pixels)` | Docstring text describing module/class/function behavior. |
| 256 | `        """` | Opens or closes a triple-quoted docstring block. |
| 257 | `        points = stroke['points']` | Assigns a computed value to a variable or field. |
| 258 | `        if len(points) < 2:` | Conditional branch that runs when condition is true. |
| 259 | `            return np.array([])` | Returns computed value(s) to the caller. |
| 260 | `        ` | Blank line for readability and structure. |
| 261 | `        coords = np.array([[p['x'], p['y']] for p in points])` | Assigns a computed value to a variable or field. |
| 262 | `        distances = np.sqrt(np.sum(np.diff(coords, axis=0)**2, axis=1))` | Assigns a computed value to a variable or field. |
| 263 | `        return distances` | Returns computed value(s) to the caller. |
| 264 | `    ` | Blank line for readability and structure. |
| 265 | `    @staticmethod` | Declares the following method as static (no self required). |
| 266 | `    def calculate_time_deltas(stroke: Dict) -> np.ndarray:` | Defines a function or method signature and return contract. |
| 267 | `        """` | Opens or closes a triple-quoted docstring block. |
| 268 | `        Calculate time differences between consecutive points.` | Docstring text describing module/class/function behavior. |
| 269 | `        ` | Blank line for readability and structure. |
| 270 | `        Args:` | Docstring section header describing the next documented topic. |
| 271 | `            stroke: Stroke object with points` | Docstring text describing module/class/function behavior. |
| 272 | `            ` | Blank line for readability and structure. |
| 273 | `        Returns:` | Docstring section header describing the next documented topic. |
| 274 | `            Array of time deltas (milliseconds)` | Docstring text describing module/class/function behavior. |
| 275 | `        """` | Opens or closes a triple-quoted docstring block. |
| 276 | `        points = stroke['points']` | Assigns a computed value to a variable or field. |
| 277 | `        if len(points) < 2:` | Conditional branch that runs when condition is true. |
| 278 | `            return np.array([])` | Returns computed value(s) to the caller. |
| 279 | `        ` | Blank line for readability and structure. |
| 280 | `        timestamps = np.array([p['timestamp'] for p in points])` | Assigns a computed value to a variable or field. |
| 281 | `        time_deltas = np.diff(timestamps)` | Assigns a computed value to a variable or field. |
| 282 | `        return time_deltas` | Returns computed value(s) to the caller. |
| 283 | `    ` | Blank line for readability and structure. |
| 284 | `    @staticmethod` | Declares the following method as static (no self required). |
| 285 | `    def calculate_velocity(stroke: Dict) -> Tuple[np.ndarray, float, float, float]:` | Defines a function or method signature and return contract. |
| 286 | `        """` | Opens or closes a triple-quoted docstring block. |
| 287 | `        Calculate velocity (pixels/millisecond) for each segment.` | Docstring text describing module/class/function behavior. |
| 288 | `        ` | Blank line for readability and structure. |
| 289 | `        Args:` | Docstring section header describing the next documented topic. |
| 290 | `            stroke: Stroke object` | Docstring text describing module/class/function behavior. |
| 291 | `            ` | Blank line for readability and structure. |
| 292 | `        Returns:` | Docstring section header describing the next documented topic. |
| 293 | `            Tuple of (velocity_array, avg_velocity, max_velocity, min_velocity)` | Docstring text describing module/class/function behavior. |
| 294 | `        """` | Opens or closes a triple-quoted docstring block. |
| 295 | `        distances = StrokeAnalyzer.calculate_distances(stroke)` | Assigns a computed value to a variable or field. |
| 296 | `        time_deltas = StrokeAnalyzer.calculate_time_deltas(stroke)` | Assigns a computed value to a variable or field. |
| 297 | `        ` | Blank line for readability and structure. |
| 298 | `        if len(time_deltas) == 0 or np.any(time_deltas == 0):` | Conditional branch that runs when condition is true. |
| 299 | `            return np.array([]), 0, 0, 0` | Returns computed value(s) to the caller. |
| 300 | `        ` | Blank line for readability and structure. |
| 301 | `        # Avoid division by zero` | Comment describing purpose of the next code block. |
| 302 | `        velocities = np.divide(distances, time_deltas, ` | Assigns a computed value to a variable or field. |
| 303 | `                              where=time_deltas != 0,` | Assigns a computed value to a variable or field. |
| 304 | `                              out=np.zeros_like(distances, dtype=float))` | Assigns a computed value to a variable or field. |
| 305 | `        ` | Blank line for readability and structure. |
| 306 | `        avg_vel = np.mean(velocities) if len(velocities) > 0 else 0` | Assigns a computed value to a variable or field. |
| 307 | `        max_vel = np.max(velocities) if len(velocities) > 0 else 0` | Assigns a computed value to a variable or field. |
| 308 | `        min_vel = np.min(velocities) if len(velocities) > 0 else 0` | Assigns a computed value to a variable or field. |
| 309 | `        ` | Blank line for readability and structure. |
| 310 | `        return velocities, avg_vel, max_vel, min_vel` | Returns computed value(s) to the caller. |
| 311 | `    ` | Blank line for readability and structure. |
| 312 | `    @staticmethod` | Declares the following method as static (no self required). |
| 313 | `    def calculate_acceleration(stroke: Dict) -> Tuple[np.ndarray, float, float]:` | Defines a function or method signature and return contract. |
| 314 | `        """` | Opens or closes a triple-quoted docstring block. |
| 315 | `        Calculate acceleration (change in velocity).` | Docstring text describing module/class/function behavior. |
| 316 | `        ` | Blank line for readability and structure. |
| 317 | `        Args:` | Docstring section header describing the next documented topic. |
| 318 | `            stroke: Stroke object` | Docstring text describing module/class/function behavior. |
| 319 | `            ` | Blank line for readability and structure. |
| 320 | `        Returns:` | Docstring section header describing the next documented topic. |
| 321 | `            Tuple of (acceleration_array, avg_acceleration, max_acceleration)` | Docstring text describing module/class/function behavior. |
| 322 | `        """` | Opens or closes a triple-quoted docstring block. |
| 323 | `        velocities, _, _, _ = StrokeAnalyzer.calculate_velocity(stroke)` | Assigns a computed value to a variable or field. |
| 324 | `        time_deltas = StrokeAnalyzer.calculate_time_deltas(stroke)` | Assigns a computed value to a variable or field. |
| 325 | `        ` | Blank line for readability and structure. |
| 326 | `        if len(velocities) < 2 or np.any(time_deltas == 0):` | Conditional branch that runs when condition is true. |
| 327 | `            return np.array([]), 0, 0` | Returns computed value(s) to the caller. |
| 328 | `        ` | Blank line for readability and structure. |
| 329 | `        # Acceleration = change in velocity / time` | Comment describing purpose of the next code block. |
| 330 | `        accel = np.diff(velocities) / time_deltas[:-1]` | Assigns a computed value to a variable or field. |
| 331 | `        avg_accel = np.mean(np.abs(accel)) if len(accel) > 0 else 0` | Assigns a computed value to a variable or field. |
| 332 | `        max_accel = np.max(np.abs(accel)) if len(accel) > 0 else 0` | Assigns a computed value to a variable or field. |
| 333 | `        ` | Blank line for readability and structure. |
| 334 | `        return accel, avg_accel, max_accel` | Returns computed value(s) to the caller. |
| 335 | `    ` | Blank line for readability and structure. |
| 336 | `    @staticmethod` | Declares the following method as static (no self required). |
| 337 | `    def calculate_curvature(stroke: Dict) -> Tuple[List[float], float, float]:` | Defines a function or method signature and return contract. |
| 338 | `        """` | Opens or closes a triple-quoted docstring block. |
| 339 | `        Calculate curvature at each point (rate of direction change).` | Docstring text describing module/class/function behavior. |
| 340 | `        ` | Blank line for readability and structure. |
| 341 | `        Curvature = \|dθ/ds\| where θ is angle and s is arc length` | Docstring text describing module/class/function behavior. |
| 342 | `        ` | Blank line for readability and structure. |
| 343 | `        Args:` | Docstring section header describing the next documented topic. |
| 344 | `            stroke: Stroke object` | Docstring text describing module/class/function behavior. |
| 345 | `            ` | Blank line for readability and structure. |
| 346 | `        Returns:` | Docstring section header describing the next documented topic. |
| 347 | `            Tuple of (curvature_profile, avg_curvature, max_curvature)` | Docstring text describing module/class/function behavior. |
| 348 | `        """` | Opens or closes a triple-quoted docstring block. |
| 349 | `        points = stroke['points']` | Assigns a computed value to a variable or field. |
| 350 | `        if len(points) < 3:` | Conditional branch that runs when condition is true. |
| 351 | `            return [], 0, 0` | Returns computed value(s) to the caller. |
| 352 | `        ` | Blank line for readability and structure. |
| 353 | `        coords = np.array([[p['x'], p['y']] for p in points])` | Assigns a computed value to a variable or field. |
| 354 | `        ` | Blank line for readability and structure. |
| 355 | `        # Calculate vectors between consecutive points` | Comment describing purpose of the next code block. |
| 356 | `        vectors = np.diff(coords, axis=0)` | Assigns a computed value to a variable or field. |
| 357 | `        ` | Blank line for readability and structure. |
| 358 | `        curvatures = []` | Assigns a computed value to a variable or field. |
| 359 | `        for i in range(len(vectors) - 1):` | Iterates through a sequence to process each item. |
| 360 | `            v1 = vectors[i]` | Assigns a computed value to a variable or field. |
| 361 | `            v2 = vectors[i + 1]` | Assigns a computed value to a variable or field. |
| 362 | `            ` | Blank line for readability and structure. |
| 363 | `            # Normalize vectors` | Comment describing purpose of the next code block. |
| 364 | `            v1_norm = np.linalg.norm(v1)` | Assigns a computed value to a variable or field. |
| 365 | `            v2_norm = np.linalg.norm(v2)` | Assigns a computed value to a variable or field. |
| 366 | `            ` | Blank line for readability and structure. |
| 367 | `            if v1_norm == 0 or v2_norm == 0:` | Conditional branch that runs when condition is true. |
| 368 | `                curvatures.append(0)` | Executes part of the dynamic feature extraction workflow. |
| 369 | `                continue` | Executes part of the dynamic feature extraction workflow. |
| 370 | `            ` | Blank line for readability and structure. |
| 371 | `            # Calculate angle between vectors` | Comment describing purpose of the next code block. |
| 372 | `            cos_angle = np.dot(v1, v2) / (v1_norm * v2_norm)` | Assigns a computed value to a variable or field. |
| 373 | `            cos_angle = np.clip(cos_angle, -1, 1)  # Handle numerical errors` | Assigns a computed value to a variable or field. |
| 374 | `            angle = np.arccos(cos_angle)` | Assigns a computed value to a variable or field. |
| 375 | `            ` | Blank line for readability and structure. |
| 376 | `            # Curvature ~ angle / distance` | Comment describing purpose of the next code block. |
| 377 | `            distance = (v1_norm + v2_norm) / 2` | Assigns a computed value to a variable or field. |
| 378 | `            curvature = angle / distance if distance > 0 else 0` | Assigns a computed value to a variable or field. |
| 379 | `            curvatures.append(curvature)` | Executes part of the dynamic feature extraction workflow. |
| 380 | `        ` | Blank line for readability and structure. |
| 381 | `        curvatures = np.array(curvatures)` | Assigns a computed value to a variable or field. |
| 382 | `        avg_curv = np.mean(curvatures) if len(curvatures) > 0 else 0` | Assigns a computed value to a variable or field. |
| 383 | `        max_curv = np.max(curvatures) if len(curvatures) > 0 else 0` | Assigns a computed value to a variable or field. |
| 384 | `        ` | Blank line for readability and structure. |
| 385 | `        return curvatures.tolist(), avg_curv, max_curv` | Returns computed value(s) to the caller. |
| 386 | `    ` | Blank line for readability and structure. |
| 387 | `    @staticmethod` | Declares the following method as static (no self required). |
| 388 | `    def count_direction_changes(stroke: Dict, angle_threshold: float = 30) -> int:` | Defines a function or method signature and return contract. |
| 389 | `        """` | Opens or closes a triple-quoted docstring block. |
| 390 | `        Count number of significant direction changes in stroke.` | Docstring text describing module/class/function behavior. |
| 391 | `        ` | Blank line for readability and structure. |
| 392 | `        Args:` | Docstring section header describing the next documented topic. |
| 393 | `            stroke: Stroke object` | Docstring text describing module/class/function behavior. |
| 394 | `            angle_threshold: Minimum angle (degrees) to count as direction change` | Docstring text describing module/class/function behavior. |
| 395 | `            ` | Blank line for readability and structure. |
| 396 | `        Returns:` | Docstring section header describing the next documented topic. |
| 397 | `            Count of direction changes` | Docstring text describing module/class/function behavior. |
| 398 | `        """` | Opens or closes a triple-quoted docstring block. |
| 399 | `        points = stroke['points']` | Assigns a computed value to a variable or field. |
| 400 | `        if len(points) < 3:` | Conditional branch that runs when condition is true. |
| 401 | `            return 0` | Returns computed value(s) to the caller. |
| 402 | `        ` | Blank line for readability and structure. |
| 403 | `        coords = np.array([[p['x'], p['y']] for p in points])` | Assigns a computed value to a variable or field. |
| 404 | `        vectors = np.diff(coords, axis=0)` | Assigns a computed value to a variable or field. |
| 405 | `        ` | Blank line for readability and structure. |
| 406 | `        direction_changes = 0` | Assigns a computed value to a variable or field. |
| 407 | `        for i in range(len(vectors) - 1):` | Iterates through a sequence to process each item. |
| 408 | `            v1 = vectors[i]` | Assigns a computed value to a variable or field. |
| 409 | `            v2 = vectors[i + 1]` | Assigns a computed value to a variable or field. |
| 410 | `            ` | Blank line for readability and structure. |
| 411 | `            v1_norm = np.linalg.norm(v1)` | Assigns a computed value to a variable or field. |
| 412 | `            v2_norm = np.linalg.norm(v2)` | Assigns a computed value to a variable or field. |
| 413 | `            ` | Blank line for readability and structure. |
| 414 | `            if v1_norm == 0 or v2_norm == 0:` | Conditional branch that runs when condition is true. |
| 415 | `                continue` | Executes part of the dynamic feature extraction workflow. |
| 416 | `            ` | Blank line for readability and structure. |
| 417 | `            cos_angle = np.dot(v1, v2) / (v1_norm * v2_norm)` | Assigns a computed value to a variable or field. |
| 418 | `            cos_angle = np.clip(cos_angle, -1, 1)` | Assigns a computed value to a variable or field. |
| 419 | `            angle_rad = np.arccos(cos_angle)` | Assigns a computed value to a variable or field. |
| 420 | `            angle_deg = np.degrees(angle_rad)` | Assigns a computed value to a variable or field. |
| 421 | `            ` | Blank line for readability and structure. |
| 422 | `            if angle_deg > angle_threshold:` | Conditional branch that runs when condition is true. |
| 423 | `                direction_changes += 1` | Assigns a computed value to a variable or field. |
| 424 | `        ` | Blank line for readability and structure. |
| 425 | `        return direction_changes` | Returns computed value(s) to the caller. |
| 426 | `` | Blank line for readability and structure. |
| 427 | `` | Blank line for readability and structure. |
| 428 | `class DynamicFeatureExtractor:` | Defines a class used to organize related data or behavior. |
| 429 | `    """` | Opens or closes a triple-quoted docstring block. |
| 430 | `    Extract all dynamic (temporal) features from drawing session.` | Docstring text describing module/class/function behavior. |
| 431 | `    ` | Blank line for readability and structure. |
| 432 | `    Main interface for feature extraction.` | Docstring text describing module/class/function behavior. |
| 433 | `    Coordinates all sub-analyzers and compiles final feature set.` | Docstring text describing module/class/function behavior. |
| 434 | `    """` | Opens or closes a triple-quoted docstring block. |
| 435 | `    ` | Blank line for readability and structure. |
| 436 | `    def __init__(self, session: Dict, validate: bool = True):` | Defines a function or method signature and return contract. |
| 437 | `        """` | Opens or closes a triple-quoted docstring block. |
| 438 | `        Initialize feature extractor.` | Docstring text describing module/class/function behavior. |
| 439 | `        ` | Blank line for readability and structure. |
| 440 | `        Args:` | Docstring section header describing the next documented topic. |
| 441 | `            session: Drawing session JSON object` | Docstring text describing module/class/function behavior. |
| 442 | `            validate: Whether to validate temporal integrity` | Docstring text describing module/class/function behavior. |
| 443 | `        """` | Opens or closes a triple-quoted docstring block. |
| 444 | `        self.session = session` | Assigns a computed value to a variable or field. |
| 445 | `        self.validate = validate` | Assigns a computed value to a variable or field. |
| 446 | `        self._validation_result = None` | Assigns a computed value to a variable or field. |
| 447 | `        ` | Blank line for readability and structure. |
| 448 | `        if validate:` | Conditional branch that runs when condition is true. |
| 449 | `            self._validation_result = DrawingSessionValidator.validate_session(session)` | Assigns a computed value to a variable or field. |
| 450 | `    ` | Blank line for readability and structure. |
| 451 | `    def extract_all_features(self) -> DynamicFeatures:` | Defines a function or method signature and return contract. |
| 452 | `        """` | Opens or closes a triple-quoted docstring block. |
| 453 | `        Extract complete set of dynamic features.` | Docstring text describing module/class/function behavior. |
| 454 | `        ` | Blank line for readability and structure. |
| 455 | `        Returns:` | Docstring section header describing the next documented topic. |
| 456 | `            DynamicFeatures object with all calculated metrics` | Docstring text describing module/class/function behavior. |
| 457 | `        """` | Opens or closes a triple-quoted docstring block. |
| 458 | `        if self.validate and not self._validation_result.is_valid:` | Conditional branch that runs when condition is true. |
| 459 | `            warnings.warn(f"Session validation failed: {self._validation_result.errors}")` | Emits a warning while allowing execution to continue. |
| 460 | `        ` | Blank line for readability and structure. |
| 461 | `        strokes = self.session.get('strokes', [])` | Assigns a computed value to a variable or field. |
| 462 | `        ` | Blank line for readability and structure. |
| 463 | `        # Initialize feature lists` | Comment describing purpose of the next code block. |
| 464 | `        all_speeds = []` | Assigns a computed value to a variable or field. |
| 465 | `        all_accelerations = []` | Assigns a computed value to a variable or field. |
| 466 | `        all_curvatures = []` | Assigns a computed value to a variable or field. |
| 467 | `        all_stroke_durations = []` | Assigns a computed value to a variable or field. |
| 468 | `        all_pause_durations = []` | Assigns a computed value to a variable or field. |
| 469 | `        inter_stroke_intervals = []` | Assigns a computed value to a variable or field. |
| 470 | `        ` | Blank line for readability and structure. |
| 471 | `        # Analyze each stroke` | Comment describing purpose of the next code block. |
| 472 | `        for idx, stroke in enumerate(strokes):` | Iterates through a sequence to process each item. |
| 473 | `            # Speed analysis` | Comment describing purpose of the next code block. |
| 474 | `            vel_profile, avg_vel, max_vel, min_vel = StrokeAnalyzer.calculate_velocity(stroke)` | Assigns a computed value to a variable or field. |
| 475 | `            all_speeds.extend(vel_profile.tolist())` | Executes part of the dynamic feature extraction workflow. |
| 476 | `            ` | Blank line for readability and structure. |
| 477 | `            # Acceleration analysis` | Comment describing purpose of the next code block. |
| 478 | `            accel_profile, avg_accel, max_accel = StrokeAnalyzer.calculate_acceleration(stroke)` | Assigns a computed value to a variable or field. |
| 479 | `            all_accelerations.extend(accel_profile.tolist())` | Executes part of the dynamic feature extraction workflow. |
| 480 | `            ` | Blank line for readability and structure. |
| 481 | `            # Curvature analysis` | Comment describing purpose of the next code block. |
| 482 | `            curv_profile, avg_curv, max_curv = StrokeAnalyzer.calculate_curvature(stroke)` | Assigns a computed value to a variable or field. |
| 483 | `            all_curvatures.extend(curv_profile)` | Executes part of the dynamic feature extraction workflow. |
| 484 | `            ` | Blank line for readability and structure. |
| 485 | `            # Stroke duration` | Comment describing purpose of the next code block. |
| 486 | `            stroke_start = parse_timestamp(stroke['startTime'])` | Assigns a computed value to a variable or field. |
| 487 | `            stroke_end = parse_timestamp(stroke['endTime'])` | Assigns a computed value to a variable or field. |
| 488 | `            stroke_duration = (stroke_end - stroke_start).total_seconds() * 1000` | Assigns a computed value to a variable or field. |
| 489 | `            all_stroke_durations.append(stroke_duration)` | Executes part of the dynamic feature extraction workflow. |
| 490 | `        ` | Blank line for readability and structure. |
| 491 | `        # Post-stroke pause analysis` | Comment describing purpose of the next code block. |
| 492 | `        for idx in range(len(strokes) - 1):` | Iterates through a sequence to process each item. |
| 493 | `            stroke_end = parse_timestamp(strokes[idx]['endTime'])` | Assigns a computed value to a variable or field. |
| 494 | `            next_stroke_start = parse_timestamp(strokes[idx + 1]['startTime'])` | Assigns a computed value to a variable or field. |
| 495 | `            pause_duration = (next_stroke_start - stroke_end).total_seconds() * 1000` | Assigns a computed value to a variable or field. |
| 496 | `            ` | Blank line for readability and structure. |
| 497 | `            if pause_duration > 0:` | Conditional branch that runs when condition is true. |
| 498 | `                all_pause_durations.append(pause_duration)` | Executes part of the dynamic feature extraction workflow. |
| 499 | `                inter_stroke_intervals.append(pause_duration)` | Executes part of the dynamic feature extraction workflow. |
| 500 | `        ` | Blank line for readability and structure. |
| 501 | `        # Calculate aggregate statistics` | Comment describing purpose of the next code block. |
| 502 | `        speed_array = np.array(all_speeds)` | Assigns a computed value to a variable or field. |
| 503 | `        accel_array = np.array(all_accelerations)` | Assigns a computed value to a variable or field. |
| 504 | `        curv_array = np.array(all_curvatures)` | Assigns a computed value to a variable or field. |
| 505 | `        ` | Blank line for readability and structure. |
| 506 | `        # Count direction changes` | Comment describing purpose of the next code block. |
| 507 | `        total_direction_changes = sum(` | Assigns a computed value to a variable or field. |
| 508 | `            StrokeAnalyzer.count_direction_changes(stroke) ` | Executes part of the dynamic feature extraction workflow. |
| 509 | `            for stroke in strokes` | Iterates through a sequence to process each item. |
| 510 | `        )` | Executes part of the dynamic feature extraction workflow. |
| 511 | `        ` | Blank line for readability and structure. |
| 512 | `        # Drawing bounding box` | Comment describing purpose of the next code block. |
| 513 | `        all_x = []` | Assigns a computed value to a variable or field. |
| 514 | `        all_y = []` | Assigns a computed value to a variable or field. |
| 515 | `        for stroke in strokes:` | Iterates through a sequence to process each item. |
| 516 | `            for point in stroke.get('points', []):` | Iterates through a sequence to process each item. |
| 517 | `                all_x.append(point.get('x', 0))` | Executes part of the dynamic feature extraction workflow. |
| 518 | `                all_y.append(point.get('y', 0))` | Executes part of the dynamic feature extraction workflow. |
| 519 | `        ` | Blank line for readability and structure. |
| 520 | `        drawing_area = 0` | Assigns a computed value to a variable or field. |
| 521 | `        if all_x and all_y:` | Conditional branch that runs when condition is true. |
| 522 | `            width = max(all_x) - min(all_x)` | Assigns a computed value to a variable or field. |
| 523 | `            height = max(all_y) - min(all_y)` | Assigns a computed value to a variable or field. |
| 524 | `            drawing_area = width * height` | Assigns a computed value to a variable or field. |
| 525 | `        ` | Blank line for readability and structure. |
| 526 | `        # Session timing` | Comment describing purpose of the next code block. |
| 527 | `        task_start = parse_timestamp(self.session['sessionStartTime'])` | Assigns a computed value to a variable or field. |
| 528 | `        task_end = parse_timestamp(self.session.get('sessionEndTime', self.session['sessionStartTime']))` | Assigns a computed value to a variable or field. |
| 529 | `        total_session_time = (task_end - task_start).total_seconds() * 1000` | Assigns a computed value to a variable or field. |
| 530 | `        ` | Blank line for readability and structure. |
| 531 | `        total_drawing_time = sum(all_stroke_durations)` | Assigns a computed value to a variable or field. |
| 532 | `        total_pause_time = sum(all_pause_durations)` | Assigns a computed value to a variable or field. |
| 533 | `        ` | Blank line for readability and structure. |
| 534 | `        # Create features object` | Comment describing purpose of the next code block. |
| 535 | `        features = DynamicFeatures(` | Assigns a computed value to a variable or field. |
| 536 | `            # Speed` | Comment describing purpose of the next code block. |
| 537 | `            avg_speed=float(np.mean(speed_array)) if len(speed_array) > 0 else 0,` | Assigns a computed value to a variable or field. |
| 538 | `            max_speed=float(np.max(speed_array)) if len(speed_array) > 0 else 0,` | Assigns a computed value to a variable or field. |
| 539 | `            min_speed=float(np.min(speed_array)) if len(speed_array) > 0 else 0,` | Assigns a computed value to a variable or field. |
| 540 | `            speed_variance=float(np.var(speed_array)) if len(speed_array) > 0 else 0,` | Assigns a computed value to a variable or field. |
| 541 | `            speed_profile=speed_array.tolist(),` | Assigns a computed value to a variable or field. |
| 542 | `            ` | Blank line for readability and structure. |
| 543 | `            # Acceleration` | Comment describing purpose of the next code block. |
| 544 | `            avg_acceleration=float(np.mean(np.abs(accel_array))) if len(accel_array) > 0 else 0,` | Assigns a computed value to a variable or field. |
| 545 | `            max_acceleration=float(np.max(np.abs(accel_array))) if len(accel_array) > 0 else 0,` | Assigns a computed value to a variable or field. |
| 546 | `            acceleration_variance=float(np.var(accel_array)) if len(accel_array) > 0 else 0,` | Assigns a computed value to a variable or field. |
| 547 | `            acceleration_profile=accel_array.tolist(),` | Assigns a computed value to a variable or field. |
| 548 | `            ` | Blank line for readability and structure. |
| 549 | `            # Timing` | Comment describing purpose of the next code block. |
| 550 | `            total_drawing_time=total_drawing_time,` | Assigns a computed value to a variable or field. |
| 551 | `            total_pause_time=total_pause_time,` | Assigns a computed value to a variable or field. |
| 552 | `            stroke_durations=all_stroke_durations,` | Assigns a computed value to a variable or field. |
| 553 | `            ` | Blank line for readability and structure. |
| 554 | `            # Pauses` | Comment describing purpose of the next code block. |
| 555 | `            number_of_pauses=len(all_pause_durations),` | Assigns a computed value to a variable or field. |
| 556 | `            avg_pause_duration=float(np.mean(all_pause_durations)) if all_pause_durations else 0,` | Assigns a computed value to a variable or field. |
| 557 | `            max_pause_duration=float(np.max(all_pause_durations)) if all_pause_durations else 0,` | Assigns a computed value to a variable or field. |
| 558 | `            pause_durations=all_pause_durations,` | Assigns a computed value to a variable or field. |
| 559 | `            ` | Blank line for readability and structure. |
| 560 | `            # Rhythm` | Comment describing purpose of the next code block. |
| 561 | `            inter_stroke_interval=inter_stroke_intervals,` | Assigns a computed value to a variable or field. |
| 562 | `            avg_inter_stroke_interval=float(np.mean(inter_stroke_intervals)) if inter_stroke_intervals else 0,` | Assigns a computed value to a variable or field. |
| 563 | `            stroke_frequency=len(strokes) / (total_session_time / 1000) if total_session_time > 0 else 0,` | Assigns a computed value to a variable or field. |
| 564 | `            ` | Blank line for readability and structure. |
| 565 | `            # Direction & curvature` | Comment describing purpose of the next code block. |
| 566 | `            direction_changes=total_direction_changes,` | Assigns a computed value to a variable or field. |
| 567 | `            avg_curvature=float(np.mean(curv_array)) if len(curv_array) > 0 else 0,` | Assigns a computed value to a variable or field. |
| 568 | `            max_curvature=float(np.max(curv_array)) if len(curv_array) > 0 else 0,` | Assigns a computed value to a variable or field. |
| 569 | `            curvature_profile=curv_array.tolist(),` | Assigns a computed value to a variable or field. |
| 570 | `            ` | Blank line for readability and structure. |
| 571 | `            # Overall` | Comment describing purpose of the next code block. |
| 572 | `            total_strokes=len(strokes),` | Assigns a computed value to a variable or field. |
| 573 | `            total_points=sum(len(stroke.get('points', [])) for stroke in strokes),` | Assigns a computed value to a variable or field. |
| 574 | `            avg_points_per_stroke=sum(len(stroke.get('points', [])) for stroke in strokes) / max(len(strokes), 1),` | Assigns a computed value to a variable or field. |
| 575 | `            drawing_area=drawing_area` | Assigns a computed value to a variable or field. |
| 576 | `        )` | Executes part of the dynamic feature extraction workflow. |
| 577 | `        ` | Blank line for readability and structure. |
| 578 | `        return features` | Returns computed value(s) to the caller. |
| 579 | `    ` | Blank line for readability and structure. |
| 580 | `    def get_validation_report(self) -> Dict:` | Defines a function or method signature and return contract. |
| 581 | `        """Get detailed validation report."""` | Executes part of the dynamic feature extraction workflow. |
| 582 | `        if not self._validation_result:` | Conditional branch that runs when condition is true. |
| 583 | `            return {"status": "Not validated"}` | Returns computed value(s) to the caller. |
| 584 | `        ` | Blank line for readability and structure. |
| 585 | `        return {` | Returns computed value(s) to the caller. |
| 586 | `            "is_valid": self._validation_result.is_valid,` | Executes part of the dynamic feature extraction workflow. |
| 587 | `            "errors": self._validation_result.errors,` | Executes part of the dynamic feature extraction workflow. |
| 588 | `            "warnings": self._validation_result.warnings,` | Executes part of the dynamic feature extraction workflow. |
| 589 | `            "stats": self._validation_result.stats` | Executes part of the dynamic feature extraction workflow. |
| 590 | `        }` | Executes part of the dynamic feature extraction workflow. |
| 591 | `    ` | Blank line for readability and structure. |
| 592 | `    def to_dataframe(self) -> pd.DataFrame:` | Defines a function or method signature and return contract. |
| 593 | `        """` | Opens or closes a triple-quoted docstring block. |
| 594 | `        Convert features to pandas DataFrame (single row).` | Docstring text describing module/class/function behavior. |
| 595 | `        ` | Blank line for readability and structure. |
| 596 | `        Returns:` | Docstring section header describing the next documented topic. |
| 597 | `            DataFrame with one row containing all features` | Docstring text describing module/class/function behavior. |
| 598 | `        """` | Opens or closes a triple-quoted docstring block. |
| 599 | `        features = self.extract_all_features()` | Assigns a computed value to a variable or field. |
| 600 | `        features_dict = asdict(features)` | Assigns a computed value to a variable or field. |
| 601 | `        ` | Blank line for readability and structure. |
| 602 | `        # Expand list fields into separate columns or keep as JSON` | Comment describing purpose of the next code block. |
| 603 | `        # For now, convert lists to JSON strings for DataFrame compatibility` | Comment describing purpose of the next code block. |
| 604 | `        for key, value in features_dict.items():` | Iterates through a sequence to process each item. |
| 605 | `            if isinstance(value, list):` | Conditional branch that runs when condition is true. |
| 606 | `                features_dict[key] = json.dumps(value)` | Assigns a computed value to a variable or field. |
| 607 | `        ` | Blank line for readability and structure. |
| 608 | `        return pd.DataFrame([features_dict])` | Returns computed value(s) to the caller. |
| 609 | `` | Blank line for readability and structure. |
| 610 | `` | Blank line for readability and structure. |
| 611 | `def load_and_extract_features(session_path: str) -> Tuple[DynamicFeatures, Dict]:` | Defines a function or method signature and return contract. |
| 612 | `    """` | Opens or closes a triple-quoted docstring block. |
| 613 | `    Load session from file and extract features.` | Docstring text describing module/class/function behavior. |
| 614 | `    ` | Blank line for readability and structure. |
| 615 | `    Args:` | Docstring section header describing the next documented topic. |
| 616 | `        session_path: Path to session JSON file` | Docstring text describing module/class/function behavior. |
| 617 | `        ` | Blank line for readability and structure. |
| 618 | `    Returns:` | Docstring section header describing the next documented topic. |
| 619 | `        Tuple of (DynamicFeatures, validation_report)` | Docstring text describing module/class/function behavior. |
| 620 | `    """` | Opens or closes a triple-quoted docstring block. |
| 621 | `    with open(session_path, 'r') as f:` | Uses a context manager for safe resource handling. |
| 622 | `        session = json.load(f)` | Assigns a computed value to a variable or field. |
| 623 | `    ` | Blank line for readability and structure. |
| 624 | `    extractor = DynamicFeatureExtractor(session, validate=True)` | Assigns a computed value to a variable or field. |
| 625 | `    features = extractor.extract_all_features()` | Assigns a computed value to a variable or field. |
| 626 | `    validation = extractor.get_validation_report()` | Assigns a computed value to a variable or field. |
| 627 | `    ` | Blank line for readability and structure. |
| 628 | `    return features, validation` | Returns computed value(s) to the caller. |
| 629 | `` | Blank line for readability and structure. |
| 630 | `` | Blank line for readability and structure. |
| 631 | `if __name__ == "__main__":` | Runs example usage when this file is executed directly. |
| 632 | `    # Example usage` | Comment describing purpose of the next code block. |
| 633 | `    print("Dynamic Feature Extraction Module")` | Executes part of the dynamic feature extraction workflow. |
| 634 | `    print("=" * 50)` | Assigns a computed value to a variable or field. |
| 635 | `    print("\nExample: Load and extract features from session JSON")` | Executes part of the dynamic feature extraction workflow. |
| 636 | `    print("\nUsage:")` | Executes part of the dynamic feature extraction workflow. |
| 637 | `    print("-" * 50)` | Executes part of the dynamic feature extraction workflow. |
| 638 | `    print("""` | Executes part of the dynamic feature extraction workflow. |
| 639 | `from dynamic_feature_extraction import DynamicFeatureExtractor` | Docstring text describing module/class/function behavior. |
| 640 | `import json` | Docstring text describing module/class/function behavior. |
| 641 | `` | Blank line for readability and structure. |
| 642 | `# Load session` | Docstring text describing module/class/function behavior. |
| 643 | `with open('session.json') as f:` | Docstring section header describing the next documented topic. |
| 644 | `    session = json.load(f)` | Docstring text describing module/class/function behavior. |
| 645 | `` | Blank line for readability and structure. |
| 646 | `# Extract features` | Docstring text describing module/class/function behavior. |
| 647 | `extractor = DynamicFeatureExtractor(session, validate=True)` | Docstring text describing module/class/function behavior. |
| 648 | `features = extractor.extract_all_features()` | Docstring text describing module/class/function behavior. |
| 649 | `` | Blank line for readability and structure. |
| 650 | `# Get validation report` | Docstring text describing module/class/function behavior. |
| 651 | `print(extractor.get_validation_report())` | Docstring text describing module/class/function behavior. |
| 652 | `` | Blank line for readability and structure. |
| 653 | `# Convert to DataFrame` | Docstring text describing module/class/function behavior. |
| 654 | `df = extractor.to_dataframe()` | Docstring text describing module/class/function behavior. |
| 655 | `print(df)` | Docstring text describing module/class/function behavior. |
| 656 | `` | Blank line for readability and structure. |
| 657 | `# Access specific features` | Docstring text describing module/class/function behavior. |
| 658 | `print(f"Average speed: {features.avg_speed}")` | Docstring text describing module/class/function behavior. |
| 659 | `print(f"Total drawing time: {features.total_drawing_time} ms")` | Docstring text describing module/class/function behavior. |
| 660 | `    """)` | Docstring text describing module/class/function behavior. |
