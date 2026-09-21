# SmartBoard Drawing & Ink Engine (`src/features/smartboard/`)

> **Architectural Layer**: Hardware-Accelerated Teaching Whiteboard & Annotation System  
> **Primary Technology**: HTML5 2D Context (`desynchronized: true`), Chaikin Curve Interpolation, Douglas-Peucker Point Reduction

---

## 1. Directory Purpose

The `src/features/smartboard/` directory implements TreadCode’s integrated teaching whiteboard. It allows instructors to sketch diagrams, annotate directly over live code execution, draw geometric primitives, and export classroom lecture notes with zero compositor lag.

---

## 2. Key Files & Sub-components

```
smartboard/
├── SmartBoardModal.tsx                # Dual-layer canvas modal, overlay mode, hotkey listener
├── components/
│   ├── SmartBoardToolbar.tsx         # Floating tool palette (pen, highlighter, shapes, eraser)
│   ├── PageDrawer.tsx                # Multi-page blackboard sheet drawer
│   ├── RadialMenu.tsx                # Quick-access circular gesture palette
│   └── InspectorPanel.tsx            # Stroke width, color, and background texture selector
└── engine/
    ├── inkEngine.ts                  # Curve smoothing, Chaikin subdivision, point decimation
    ├── eraserEngine.ts               # Vector collision detection for stroke & point erasing
    └── shapeSnap.ts                  # Geometric recognition (rectangles, ellipses, arrows)
```

---

## 3. Dual-Layer Canvas Architecture

To deliver fluid 60 FPS inking while live code steps run in the background:

- **Base Layer (Committed Canvas)**: Renders static background grids (dots, lines, dark blackboard) and finalized stroke history.
- **Active Layer (In-Flight Canvas)**: Dedicated solely to the current stroke. Runs directly on `requestAnimationFrame` with `desynchronized: true` to bypass browser composition latency.
- **Commit Phase**: On `pointerup`, the in-flight stroke is smoothed, snapped if applicable, and committed to the base layer stroke stack, supporting full multi-level Undo/Redo.

---

## 4. Key Capabilities & Safety

1. **Chaikin Curve Smoothing**: Automatically converts jagged raw pointer coordinates into organic handwriting curves.
2. **Geometric Shape Snapping**: Pausing momentarily at the end of a stroke converts rough hand-drawn shapes into clean mathematical vectors.
3. **High-DPI Scaling**: Automatically compensates for `window.devicePixelRatio` to prevent blurriness on 4K projectors and Retina displays.
4. **Instant Export**: Export clean high-resolution `.png` blackboard snapshots with a single click.
