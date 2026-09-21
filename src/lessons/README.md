# Lesson Curriculum & Execution Registry (`src/lessons/`)

> **Architectural Layer**: Educational Content Data Layer & Playback Store  
> **Primary Technology**: TypeScript Schemas, Dynamic Asynchronous Imports, Zustand v5

---

## 1. Directory Purpose

The `src/lessons/` directory defines the entire curriculum of interactive visual programming lessons. It contains over **280+ step-by-step programs** across 7 core computer science subjects, dynamic chunk loaders, and the global playback store.

---

## 2. Directory & Language Hierarchy

```
lessons/
├── types.ts                          # Type definitions (CodeLine, ExecutionStep, MemorySnapshot)
├── registry.ts                       # Dynamic chunk import loader & course metadata
├── useLessonStore.ts                 # Global playback store (step pointer, timeline scrubber)
├── LessonContext.tsx                 # Legacy initialization adapter
├── python/                           # 100 Programs (16 Topics) — Community Tier (Built-in)
├── c/                                # 45 Programs (13 Topics) — Professional Tier
├── cpp/                              # 50 Programs (14 Topics) — Professional Tier
├── java/                             # 52 Programs (13 Topics) — Professional Tier
├── dsa/                              # 21 Programs (19 Topics) — Professional Tier
├── ml/                               # 11 Programs (11 Topics) — Enterprise Tier
└── networks/                         # 8 Programs (8 Topics) — Enterprise Tier
```

---

## 3. Data Schema: How a Lesson is Defined

Every interactive program conforms to the strict schema in `types.ts`:

```typescript
interface Lesson {
  id: string;
  title: string;
  topicId: string;
  language: 'python' | 'c' | 'cpp' | 'java' | 'dsa' | 'ml' | 'networks';
  code: string;                       // Raw source code
  lines: CodeLine[];                  // Formatted code with syntax tokenization
  steps: ExecutionStep[];             // Sequential execution timeline
  explanationHindi: string[];         // Audio/text Hindi guidance per step
  explanationEnglish: string[];       // Audio/text English guidance per step
}
```

---

## 4. Dynamic Chunk Loading Architecture

To prevent huge initial JavaScript bundle sizes:
- **Python** is bundled directly with the core application.
- **C, C++, Java, DSA, ML, and Networks** are registered in `registry.ts` as dynamic `import()` promises.
- Course packs are only downloaded or evaluated when the student navigates to that specific language hub, reducing initial app memory footprint to under **80 MB RAM**.
