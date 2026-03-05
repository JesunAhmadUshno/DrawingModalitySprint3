# Dynamic Features - System Architecture & Schemas

**Sprint 3: Dynamic Feature Extraction System**  
**Generated:** March 2, 2026  
**Purpose:** Visual reference for system architecture, data flows, and data structures

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Flow Diagrams](#data-flow-diagrams)
3. [Class Hierarchy](#class-hierarchy)
4. [Session Data Schema](#session-data-schema)
5. [Feature Extraction Pipeline](#feature-extraction-pipeline)
6. [Output Schemas](#output-schemas)
7. [Validation Architecture](#validation-architecture)
8. [Component Relationships](#component-relationships)

---

## System Architecture

### High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Dynamic Feature Extraction System             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Input Layer                            │   │
│  │  Drawing Session JSON (sessionId, strokes, timestamps)  │   │
│  └──────────────┬───────────────────────────────────────────┘   │
│                 │                                                │
│  ┌──────────────▼───────────────────────────────────────────┐   │
│  │            Validation Layer                              │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ DrawingSessionValidator                             │ │   │
│  │  │ • Temporal integrity check                          │ │   │
│  │  │ • Point validation                                  │ │   │
│  │  │ • Timestamp sequences                               │ │   │
│  │  └─────────────┬────────────────────────────────────────┘ │   │
│  │                │                                            │   │
│  │                ▼                                            │   │
│  │   TemporalValidationResult                                 │   │
│  │   • is_valid: bool                                         │   │
│  │   • errors: List                                           │   │
│  │   • warnings: List                                         │   │
│  └──────────────┬───────────────────────────────────────────┘   │
│                 │                                                │
│  ┌──────────────▼───────────────────────────────────────────┐   │
│  │         Feature Extraction Layer                          │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ DynamicFeatureExtractor                             │ │   │
│  │  │                                                     │ │   │
│  │  │ ┌─────────────────────────────────────────────────┐ │ │   │
│  │  │ │ StrokeAnalyzer (Helper)                         │ │ │   │
│  │  │ │ • compute_distances()                           │ │ │   │
│  │  │ │ • compute_velocities()                          │ │ │   │
│  │  │ │ • compute_accelerations()                       │ │ │   │
│  │  │ │ • compute_curvature()                           │ │ │   │
│  │  │ │ • compute_direction_changes()                   │ │ │   │
│  │  │ └─────────────────────────────────────────────────┘ │ │   │
│  │  │                                                     │ │   │
│  │  │ ┌─────────────────────────────────────────────────┐ │ │   │
│  │  │ │ Feature Calculators                             │ │ │   │
│  │  │ │ • Speed Metrics (5)                             │ │ │   │
│  │  │ │ • Acceleration Metrics (3)                      │ │ │   │
│  │  │ │ • Timing Metrics (3)                            │ │ │   │
│  │  │ │ • Pause Metrics (4)                             │ │ │   │
│  │  │ │ • Rhythm Metrics (3)                            │ │ │   │
│  │  │ │ • Direction Metrics (4)                         │ │ │   │
│  │  │ │ • Overall Stats (3)                             │ │ │   │
│  │  │ └─────────────────────────────────────────────────┘ │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────┬───────────────────────────────────────────┘   │
│                 │                                                │
│  ┌──────────────▼───────────────────────────────────────────┐   │
│  │            Output Layer                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ DynamicFeatures (Dataclass)                         │ │   │
│  │  │ • 24 Feature Metrics                                │ │   │
│  │  │ • Raw Profiles (Arrays)                             │ │   │
│  │  │ • Validation Status                                 │ │   │
│  │  │                                                     │ │   │
│  │  │ Exportable as:                                      │ │   │
│  │  │ • Python Dict                                       │ │   │
│  │  │ • Pandas DataFrame                                  │ │   │
│  │  │ • JSON                                              │ │   │
│  │  │ • CSV                                               │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Complete Processing Pipeline

```
┌─────────────────┐
│  Session JSON   │
│  (with strokes) │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────┐
│  Parse Session Data          │
│  • Extract timestamps        │
│  • Extract point coords      │
│  • Extract stroke structure  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Validate Temporal Integrity │
│  • Check timestamp order     │
│  • Verify point counts       │
│  • Detect anomalies          │
└────────┬─────────────────────┘
         │
         ├─ Valid ─────────────┐
         │                     │
         │                     ▼
         │          ┌──────────────────────┐
         │          │ Extract Raw Profiles │
         │          │ • Distance arrays    │
         │          │ • Velocity arrays    │
         │          │ • Acceleration arr.  │
         │          │ • Direction arrays   │
         │          │ • Curvature arrays   │
         │          └──────┬───────────────┘
         │                 │
         │                 ▼
         │       ┌──────────────────────┐
         │       │ Compute 24 Metrics   │
         │       │ • Speed (5)          │
         │       │ • Acceleration (3)   │
         │       │ • Timing (3)         │
         │       │ • Pauses (4)         │
         │       │ • Rhythm (3)         │
         │       │ • Direction (4)      │
         │       │ • Stats (3)          │
         │       └──────┬───────────────┘
         │              │
         │              ▼
         │       ┌──────────────────────┐
         │       │  Create DynamicFeat. │
         │       │  (dataclass instance)│
         │       └──────┬───────────────┘
         │              │
         ├─ Invalid ────┤
         │              │
         └──────┬───────┴──────────┐
                │                  │
                ▼                  ▼
        ┌──────────────┐  ┌─────────────────┐
        │ Return Errors│  │ Return Features │
        │ + Warnings   │  │ + Validation    │
        └──────────────┘  └─────────────────┘
```

---

## Class Hierarchy

### Component Dependency Tree

```
DynamicFeatureExtractor (Main Class)
    │
    ├── DrawingSessionValidator (dependency)
    │   │
    │   └── TemporalValidationResult (output)
    │       ├── is_valid: bool
    │       ├── errors: List[str]
    │       ├── warnings: List[str]
    │       └── stats: Dict
    │
    ├── StrokeAnalyzer (helper)
    │   ├── compute_distances() → List[float]
    │   ├── compute_velocities() → List[float]
    │   ├── compute_accelerations() → List[float]
    │   ├── compute_curvature() → List[float]
    │   └── compute_direction_changes() → List[float]
    │
    └── DynamicFeatures (output dataclass)
        ├── Speed Metrics (5)
        │   ├── avg_speed: float
        │   ├── max_speed: float
        │   ├── min_speed: float
        │   ├── speed_variance: float
        │   └── speed_profile: List[float]
        │
        ├── Acceleration Metrics (3)
        │   ├── avg_acceleration: float
        │   ├── max_acceleration: float
        │   └── acceleration_variance: float
        │
        ├── Timing Metrics (3)
        │   ├── total_drawing_time: float
        │   ├── total_pause_time: float
        │   └── stroke_durations: List[float]
        │
        ├── Pause Metrics (4)
        │   ├── number_of_pauses: int
        │   ├── avg_pause_duration: float
        │   ├── max_pause_duration: float
        │   └── pause_durations: List[float]
        │
        ├── Rhythm Metrics (3)
        │   ├── inter_stroke_interval: List[float]
        │   ├── rhythm_regularity: float
        │   └── stroke_timing_variance: float
        │
        ├── Direction Metrics (4)
        │   ├── avg_direction_change: float
        │   ├── max_direction_change: float
        │   ├── direction_change_count: int
        │   └── direction_changes: List[float]
        │
        └── Overall Stats (3)
            ├── total_points: int
            ├── avg_points_per_stroke: float
            └── drawing_area: float
```

---

## Session Data Schema

### Input Session JSON Structure

```json
{
  "sessionId": "string (unique identifier)",
  "taskStartTime": "ISO-8601 timestamp",
  "taskEndTime": "ISO-8601 timestamp",
  "strokes": [
    {
      "strokeId": "string",
      "startTime": "ISO-8601 timestamp",
      "endTime": "ISO-8601 timestamp",
      "points": [
        {
          "x": "number (0 to canvas width)",
          "y": "number (0 to canvas height)",
          "timestamp": "integer milliseconds from epoch",
          "pressure": "number (optional, 0-1)"
        }
      ]
    }
  ],
  "deviceInfo": {
    "type": "string (touchscreen, stylus, mouse, etc.)",
    "samplingRate": "number (optional, Hz)"
  },
  "canvasSize": {
    "width": "integer",
    "height": "integer"
  }
}
```

### Session Schema Relationships

```
Session
│
├── Metadata
│   ├── sessionId
│   ├── taskStartTime
│   ├── taskEndTime
│   ├── canvasSize
│   └── deviceInfo
│
├── Strokes (Array)
│   └── Stroke N
│       ├── strokeId
│       ├── startTime
│       ├── endTime
│       │
│       └── Points (Array)
│           └── Point N
│               ├── x (spatial)
│               ├── y (spatial)
│               └── timestamp (temporal)
│
└── Computed Intervals
    ├── Inter-point intervals (milliseconds)
    ├── Inter-stroke intervals (milliseconds)
    └── Pause durations (milliseconds)
```

---

## Feature Extraction Pipeline

### Step-by-Step Processing

```
Step 1: Data Parsing
┌─────────────────────────────────────────┐
│ Input: Session JSON                     │
│ • Parse timestamps                      │
│ • Extract (x, y) coordinates            │
│ • Build stroke data                     │
│ Output: Structured session with arrays  │
└─────────────────────────────────────────┘
         │
         ▼
Step 2: Validation
┌─────────────────────────────────────────┐
│ Validate Temporal Data                  │
│ • Check timestamps are monotonic        │
│ • Verify timestamp ordering             │
│ • Detect invalid points                 │
│ • Report warnings                       │
└─────────────────────────────────────────┘
         │
         ▼
Step 3: Distance/Velocity Computation
┌─────────────────────────────────────────┐
│ For each point pair:                    │
│ • distance = √((Δx)² + (Δy)²)          │
│ • velocity = distance / Δtime           │
│ • Build velocity profile                │
└─────────────────────────────────────────┘
         │
         ▼
Step 4: Acceleration Computation
┌─────────────────────────────────────────┐
│ For each velocity pair:                 │
│ • acceleration = Δvelocity / Δtime      │
│ • Build acceleration profile            │
│ • Compute variance                      │
└─────────────────────────────────────────┘
         │
         ▼
Step 5: Curvature/Direction Computation
┌─────────────────────────────────────────┐
│ For each triplet of points:             │
│ • Compute curvature using geometry      │
│ • Compute angle between segments        │
│ • Identify direction changes            │
│ • Build profiles                        │
└─────────────────────────────────────────┘
         │
         ▼
Step 6: Temporal Analysis
┌─────────────────────────────────────────┐
│ Analyze stroke timing:                  │
│ • Calculate total drawing time          │
│ • Identify pauses (gaps > threshold)    │
│ • Calculate pause statistics            │
│ • Extract rhythm patterns               │
└─────────────────────────────────────────┘
         │
         ▼
Step 7: Aggregate Metrics
┌─────────────────────────────────────────┐
│ Compute summary statistics:             │
│ • Speed: avg, max, min, variance        │
│ • Acceleration: avg, max, variance      │
│ • Pause: count, avg, max duration       │
│ • Direction: avg, max change, count     │
│ • Overall: total points, area, ratios   │
└─────────────────────────────────────────┘
         │
         ▼
Step 8: Package Results
┌─────────────────────────────────────────┐
│ Create DynamicFeatures dataclass:       │
│ • Organize 24 metrics                   │
│ • Include raw profiles                  │
│ • Attach validation info                │
│ • Ready for export                      │
└─────────────────────────────────────────┘
```

---

## Output Schemas

### DynamicFeatures Dataclass Structure

```
DynamicFeatures
│
├── SPEED METRICS (5)
│   ├── avg_speed: float            [px/ms]
│   ├── max_speed: float            [px/ms]
│   ├── min_speed: float            [px/ms]
│   ├── speed_variance: float       [(px/ms)²]
│   └── speed_profile: List[float]  [px/ms per segment]
│
├── ACCELERATION METRICS (3)
│   ├── avg_acceleration: float           [px/ms²]
│   ├── max_acceleration: float           [px/ms²]
│   └── acceleration_variance: float      [(px/ms²)²]
│
├── TIMING METRICS (3)
│   ├── total_drawing_time: float   [ms]
│   ├── total_pause_time: float     [ms]
│   └── stroke_durations: List[float] [ms per stroke]
│
├── PAUSE METRICS (4)
│   ├── number_of_pauses: int         [count]
│   ├── avg_pause_duration: float    [ms]
│   ├── max_pause_duration: float    [ms]
│   └── pause_durations: List[float] [ms per pause]
│
├── RHYTHM METRICS (3)
│   ├── inter_stroke_interval: List[float]  [ms]
│   ├── rhythm_regularity: float            [0-1]
│   └── stroke_timing_variance: float       [(ms)²]
│
├── DIRECTION METRICS (4)
│   ├── avg_direction_change: float   [degrees]
│   ├── max_direction_change: float   [degrees]
│   ├── direction_change_count: int   [count]
│   └── direction_changes: List[float] [degrees]
│
├── OVERALL STATS (3)
│   ├── total_points: int              [count]
│   ├── avg_points_per_stroke: float  [points/stroke]
│   └── drawing_area: float            [px²]
│
└── METADATA
    ├── session_id: str
    ├── validation_status: bool
    ├── is_valid: bool
    ├── errors: List[str]
    └── warnings: List[str]
```

### Export Formats

```
DynamicFeatures
│
├── .to_dict() → Dict[str, Any]
│   └── Output:  {"avg_speed": 0.85, "max_speed": 2.1, ...}
│
├── .to_dataframe() → pd.DataFrame
│   └── Output:  Single-row DataFrame with all metrics as columns
│
└── .to_json() → str
    └── Output:  JSON string representation
```

---

## Validation Architecture

### Temporal Validation Flow

```
Session Data Input
    │
    ▼
┌─────────────────────────────────────────┐
│ DrawingSessionValidator                 │
│                                         │
│ Checks:                                 │
│ ✓ Session has strokes                  │
│ ✓ Strokes have points                  │
│ ✓ Timestamps are sequential            │
│ ✓ Point coordinates are valid          │
│ ✓ Time deltas are reasonable           │
│ ✓ No extreme outliers                  │
└─────────────────────────────────────────┘
    │
    ├─ Valid  ──────────────┐
    │                       │
    │                       ▼
    │            ┌──────────────────────┐
    │            │ TemporalValidationRe │
    │            │ is_valid = True      │
    │            │ errors = []          │
    │            │ warnings = []        │
    │            └──────────────────────┘
    │
    └─ Invalid ────────────┐
                           │
                           ▼
                ┌──────────────────────┐
                │ TemporalValidationRe │
                │ is_valid = False     │
                │ errors = [...]       │
                │ warnings = [...]     │
                └──────────────────────┘
```

### Validation Error Categories

```
TEMPORAL ERRORS
    ├── Missing strokes
    ├── Strokes without points
    ├── Invalid timestamp ordering
    ├── Negative time deltas
    ├── Extreme time gaps
    └── Duplicate timestamps

SPATIAL ERRORS
    ├── Out-of-bounds coordinates
    ├── Invalid x/y values
    ├── Extreme jumps between points
    └── Degenerate points

STRUCTURAL ERRORS
    ├── Missing required fields
    ├── Invalid data types
    ├── Malformed JSON
    └── Inconsistent stroke data
```

---

## Component Relationships

### Interaction Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│                                                              │
│  Usage Pattern:                                              │
│  1. from dynamic_feature_extraction import *               │
│  2. extractor = DynamicFeatureExtractor(session)           │
│  3. features = extractor.extract_all_features()            │
│  4. results = features.to_dataframe()                      │
│  5. results.to_csv("output.csv")                           │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                   DynamicFeatureExtractor                    │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Public Methods:                                        │  │
│ │ • __init__(session, validate=True)                    │  │
│ │ • extract_all_features() → DynamicFeatures            │  │
│ │ • get_validation_report() → TemporalValidationResult  │  │
│ │ • to_dataframe() → pd.DataFrame                       │  │
│ │ • to_dict() → Dict                                    │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ Dependencies:                                                │
│ ┌──────────────────┐            ┌──────────────────┐       │
│ │ DrawingSessVal.  │            │ StrokeAnalyzer   │       │
│ │ • validate()     │            │ • compute_*()    │       │
│ │ • check_*()      │            │ • extract_*()    │       │
│ └──────────────────┘            └──────────────────┘       │
│           │                              │                  │
│           └──────────────┬───────────────┘                  │
│                          │                                  │
│                          ▼                                  │
│                   Combined Results                          │
│                   to DynamicFeatures                        │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    Output Formats                            │
├──────────────────────────────────────────────────────────────┤
│ • Python Dictionary (native Python)                         │
│ • Pandas DataFrame (tabular format)                         │
│ • JSON (web/API transfer)                                  │
│ • CSV (spreadsheet import)                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Quick Reference: Feature Categories

### Feature Count Summary

```
SPEED METRICS           5 features
├─ avg_speed
├─ max_speed
├─ min_speed
├─ speed_variance
└─ speed_profile

ACCELERATION METRICS    3 features
├─ avg_acceleration
├─ max_acceleration
└─ acceleration_variance

TIMING METRICS          3 features
├─ total_drawing_time
├─ total_pause_time
└─ stroke_durations

PAUSE METRICS           4 features
├─ number_of_pauses
├─ avg_pause_duration
├─ max_pause_duration
└─ pause_durations

RHYTHM METRICS          3 features
├─ inter_stroke_interval
├─ rhythm_regularity
└─ stroke_timing_variance

DIRECTION METRICS       4 features
├─ avg_direction_change
├─ max_direction_change
├─ direction_change_count
└─ direction_changes

OVERALL STATS           3 features
├─ total_points
├─ avg_points_per_stroke
└─ drawing_area

───────────────────────────────────
TOTAL:                  25 features*
```

*Note: 24 primary metrics + validation status

---

## End of Architecture Diagrams

For detailed mathematical formulas and API documentation, refer to:
- `DYNAMIC_FEATURES_DOCUMENTATION.md` - Complete specification
- `dynamic_feature_extraction.py` - Source code implementation
- `sprint3_dynamic_features_test.ipynb` - Usage examples and tests
