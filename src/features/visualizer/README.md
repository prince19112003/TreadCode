# Code Visualizer Feature (`src/features/visualizer/`)

> **Architectural Layer**: Interactive Execution & Memory Modeling Engine  
> **Primary Technology**: Zustand v5, Motion (Framer Motion v12), HTML5 Canvas, Tailwind CSS

---

## 1. Directory Purpose

The `src/features/visualizer/` directory contains the core code execution visualizer. It renders code line-by-line, animates variable mutations, models virtual memory (Stack, Heap, Symbol Tables), visualizes Data Structures & Algorithms, and synchronizes bilingual step guidance.

---

## 2. Key Files & Sub-components

```
visualizer/
├── VisualizerWorkspace.tsx            # Main responsive split-pane layout container
├── components/
│   ├── CodeStepPanel.tsx             # Syntax-highlighted code with dynamic active-line cursor
│   ├── StageControls.tsx             # Play, pause, step forward, backward, speed slider
│   ├── ExplanationBar.tsx            # Textual bilingual explanation bar with audio hook
│   ├── OutputConsole.tsx             # Virtual terminal output pane
│   └── stages/                       # Modular visual stages (rendered based on lesson type)
│       ├── StackVisualStage.tsx      # Simulated function call stack frames & scopes
│       ├── VariableInspectorStage.tsx # Live variable symbol table (Type, Name, Value, Address)
│       ├── DsaAlgoStage.tsx          # Trees, Graphs, Sorting arrays, and Dijkstra pathfinding
│       ├── CustomFlowchartStage.tsx  # Dynamic flowchart highlighting corresponding blocks
│       └── PointerStage.tsx          # Visual pointer dereferencing arrows
```

---

## 3. State & Execution Lifecycle

1. **State Consumption**: Subscribes directly to `useLessonStore` (`src/lessons/useLessonStore.ts`) using isolated selectors to prevent unnecessary re-renders.
2. **Deterministic Step Scrubbing**: Each step defines a complete `ExecutionStep` with an immutable memory delta. Time-travel stepping (forward/backward) reconstructs the exact stack, heap, and variable state instantly.
3. **Animated Delta Highlighting**: When variables change value or pointers rebind, Motion triggers spring micro-animations to visually guide student attention.

---

## 4. Safety & Performance Measures

- **No Infinite Loops**: Code execution does not use `eval()` or unconstrained WebAssembly interpreters at runtime. Lessons use deterministic, pre-compiled execution steps.
- **Selector Isolation**: Individual components select only the properties they require from `useLessonStore`, ensuring 60 FPS performance even during rapid auto-stepping.
