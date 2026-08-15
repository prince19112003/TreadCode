import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, BarChart2, Layers } from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { motion } from 'motion/react';

/* =========================================================
   STANDARD LANGUAGE TOPIC DATA
   ========================================================= */
const pythonTopics = [
  { id: 'variables', number: '01', name: 'Variables', subtitle: 'Store & Manipulate Data', programsCount: 13, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#6366f1' },
  { id: 'if_statement', number: '02', name: 'If Statement', subtitle: 'Single Condition Decisions', programsCount: 5, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#6366f1' },
  { id: 'if_else', number: '03', name: 'If Else', subtitle: 'Two-Path Decisions', programsCount: 5, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#6366f1' },
  { id: 'if_elif_else', number: '04', name: 'If Elif Else', subtitle: 'Multi-Condition Decisions', programsCount: 5, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#6366f1' },
  { id: 'match_case', number: '05', name: 'Match Case', subtitle: 'Pattern Matching', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#6366f1' },
  { id: 'for_loop', number: '06', name: 'For Loop', subtitle: 'Counted Repetition', programsCount: 6, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#06b6d4' },
  { id: 'while_loop', number: '07', name: 'While Loop', subtitle: 'Conditional Repetition', programsCount: 10, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#06b6d4' },
  { id: 'nested_loop', number: '08', name: 'Nested Loop', subtitle: 'Loops Inside Loops', programsCount: 6, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#06b6d4' },
  { id: 'loop_control', number: '09', name: 'Loop Control', subtitle: 'Break & Continue', programsCount: 4, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#06b6d4' },
  { id: 'functions', number: '10', name: 'Functions', subtitle: 'Reusable Logic Blocks', programsCount: 11, difficulty: 'Intermediate' as const, category: 'functions', accentColor: '#8b5cf6' },
  { id: 'recursion', number: '11', name: 'Recursion', subtitle: 'Self-Calling Functions', programsCount: 5, difficulty: 'Advanced' as const, category: 'functions', accentColor: '#8b5cf6' },
  { id: 'strings', number: '12', name: 'Strings', subtitle: 'Text Processing', programsCount: 10, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#f59e0b' },
  { id: 'lists', number: '13', name: 'Lists', subtitle: 'Ordered Collections', programsCount: 6, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#f59e0b' },
  { id: 'tuples', number: '14', name: 'Tuples', subtitle: 'Immutable Collections', programsCount: 3, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#f59e0b' },
  { id: 'dictionaries', number: '15', name: 'Dictionaries', subtitle: 'Key-Value Maps', programsCount: 3, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#f59e0b' },
  { id: 'searching_sorting', number: '16', name: 'Searching & Sorting', subtitle: 'Classic Algorithms', programsCount: 5, difficulty: 'Advanced' as const, category: 'algo', accentColor: '#ec4899' },
];

const cTopics = [
  { id: 'variables', number: '01', name: 'Variables', subtitle: 'Data Types & Memory', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#38bdf8' },
  { id: 'operators', number: '02', name: 'Operators', subtitle: 'Arithmetic & Expressions', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#10b981' },
  { id: 'user_input', number: '03', name: 'User Input', subtitle: 'scanf Function Reading', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#14b8a6' },
  { id: 'type_casting', number: '04', name: 'Type Casting', subtitle: 'Implicit & Explicit Casting', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#eab308' },
  { id: 'if_else', number: '05', name: 'If Else', subtitle: 'Two-Path Decisions', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#6366f1' },
  { id: 'if_elif_else', number: '06', name: 'If Else If', subtitle: 'Multi-Condition Ladder', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#4f46e5' },
  { id: 'switch_case', number: '07', name: 'Switch Case', subtitle: 'Option & Menu Selection', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#ec4899' },
  { id: 'for_loop', number: '08', name: 'For Loop', subtitle: 'Counted Iteration', programsCount: 4, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#06b6d4' },
  { id: 'while_loop', number: '09', name: 'While Loop', subtitle: 'Conditional Repetition', programsCount: 4, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#0891b2' },
  { id: 'do_while_loop', number: '10', name: 'Do-While Loop', subtitle: 'Exit-Controlled Repetition', programsCount: 2, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#0284c7' },
  { id: 'strings', number: '11', name: 'Strings', subtitle: 'Character Arrays & strlen', programsCount: 3, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#8b5cf6' },
  { id: 'functions', number: '12', name: 'Functions', subtitle: 'Functions & Scope', programsCount: 3, difficulty: 'Intermediate' as const, category: 'functions', accentColor: '#a855f7' },
  { id: 'arrays_1d', number: '13', name: '1D Arrays', subtitle: 'Indexed Contiguous Memory', programsCount: 3, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#f59e0b' },
];

const cppTopics = [
  { id: 'variables', number: '01', name: 'Variables', subtitle: 'Data Storage & Memory', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#00599c' },
  { id: 'operators', number: '02', name: 'Operators', subtitle: 'Arithmetic & Expressions', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#10b981' },
  { id: 'user_input', number: '03', name: 'User Input', subtitle: 'Console Input (cin)', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#14b8a6' },
  { id: 'type_casting', number: '04', name: 'Type Casting', subtitle: 'Implicit & Static Casting', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#eab308' },
  { id: 'if_else', number: '05', name: 'If Else', subtitle: 'Two-Path Decisions', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#6366f1' },
  { id: 'if_elif_else', number: '06', name: 'If Else If', subtitle: 'Multi-Condition Decisions', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#4f46e5' },
  { id: 'switch_case', number: '07', name: 'Switch Case', subtitle: 'Option & Menu Selection', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#ec4899' },
  { id: 'for_loop', number: '08', name: 'For Loop', subtitle: 'Counted Iteration', programsCount: 4, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#06b6d4' },
  { id: 'while_loop', number: '09', name: 'While Loop', subtitle: 'Conditional Repetition', programsCount: 4, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#0891b2' },
  { id: 'do_while_loop', number: '10', name: 'Do-While Loop', subtitle: 'Exit-Controlled Repetition', programsCount: 2, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#0284c7' },
  { id: 'strings', number: '11', name: 'Strings', subtitle: 'std::string Processing', programsCount: 3, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#8b5cf6' },
  { id: 'functions', number: '12', name: 'Functions', subtitle: 'Call Stack & References', programsCount: 4, difficulty: 'Intermediate' as const, category: 'functions', accentColor: '#a855f7' },
  { id: 'arrays_1d', number: '13', name: '1D Arrays', subtitle: 'Indexed Contiguous Memory', programsCount: 4, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#f59e0b' },
  { id: 'arrays_2d', number: '14', name: '2D Arrays', subtitle: 'Row-Column Matrix Grids', programsCount: 3, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#d97706' },
];

const javaTopics = [
  { id: 'variables', number: '01', name: 'Variables', subtitle: 'Data Storage & Memory', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#f97316' },
  { id: 'type_casting', number: '02', name: 'Type Casting', subtitle: 'Type Conversion & Widening', programsCount: 2, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#eab308' },
  { id: 'operators_expressions', number: '03', name: 'Operators', subtitle: 'Arithmetic & Formulas', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#10b981' },
  { id: 'user_input', number: '04', name: 'User Input', subtitle: 'Scanner Class Reading', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#14b8a6' },
  { id: 'if_else', number: '05', name: 'If Else', subtitle: 'Two-Path Decisions', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#6366f1' },
  { id: 'if_elif_else', number: '06', name: 'If Else If', subtitle: 'Multi-Branch Decision Ladder', programsCount: 5, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#4f46e5' },
  { id: 'switch_case', number: '07', name: 'Switch Case', subtitle: 'Menu & Option Selection', programsCount: 5, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#ec4899' },
  { id: 'for_loop', number: '08', name: 'For Loop', subtitle: 'Counted Iteration', programsCount: 5, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#06b6d4' },
  { id: 'while_loop', number: '09', name: 'While Loop', subtitle: 'Conditional Repetition', programsCount: 5, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#0891b2' },
  { id: 'do_while_loop', number: '10', name: 'Do-While Loop', subtitle: 'Exit-Controlled Repetition', programsCount: 2, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#0284c7' },
  { id: 'strings', number: '11', name: 'Strings', subtitle: 'Text & ASCII Character Processing', programsCount: 2, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#8b5cf6' },
  { id: 'arrays_1d', number: '12', name: '1D Arrays', subtitle: 'Indexed Array Memory', programsCount: 4, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#f59e0b' },
  { id: 'arrays_2d', number: '13', name: '2D Arrays', subtitle: 'Row-Column Matrix Grids', programsCount: 3, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#d97706' },
];

/* =========================================================
   DSA TOPIC DATA — New structure with icons, complexity, tags
   ========================================================= */
const dsaTopics = [
  { id: 'bubble_sort', number: '01', name: 'Bubble Sort', subtitle: 'Bubble adjacent elements to sort array', complexity: 'O(N²)', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Algorithm', accentColor: '#a855f7' },
  { id: 'selection_sort', number: '02', name: 'Selection Sort', subtitle: 'Select minimum element to swap repeatedly', complexity: 'O(N²)', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Algorithm', accentColor: '#8b5cf6' },
  { id: 'insertion_sort', number: '03', name: 'Insertion Sort', subtitle: 'Insert elements sequentially into sorted sublist', complexity: 'O(N²)', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Algorithm', accentColor: '#6366f1' },
  { id: 'merge_sort', number: '04', name: 'Merge Sort', subtitle: 'Divide and conquer recursive array merge', complexity: 'O(N log N)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Algorithm', accentColor: '#ec4899' },
  { id: 'heap_sort', number: '05', name: 'Heap Sort', subtitle: 'Build max heap and swap root repeatedly', complexity: 'O(N log N)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Algorithm', accentColor: '#f97316' },
  { id: 'stack', number: '06', name: 'Stack (LIFO)', subtitle: 'Push, Pop, Peek, Search & Traverse', complexity: 'O(1)', programsCount: 9, difficulty: 'Intermediate' as const, category: 'Data Struct', accentColor: '#ec4899' },
  { id: 'queue', number: '07', name: 'Queue (FIFO)', subtitle: 'Enqueue, Dequeue & Front/Rear Pointers', complexity: 'O(1)', programsCount: 4, difficulty: 'Intermediate' as const, category: 'Data Struct', accentColor: '#06b6d4' },
  { id: 'singly_linked_list', number: '08', name: 'Singly Linked List', subtitle: 'Node → Data | Next Pointer Chain', complexity: 'O(N)', programsCount: 5, difficulty: 'Intermediate' as const, category: 'Data Struct', accentColor: '#8b5cf6' },
  { id: 'doubly_linked_list', number: '09', name: 'Doubly Linked List', subtitle: 'Prev ↔ Data ↔ Next Bidirectional Links', complexity: 'O(N)', programsCount: 4, difficulty: 'Advanced' as const, category: 'Data Struct', accentColor: '#6366f1' },
  { id: 'binary_tree', number: '10', name: 'Binary Search Tree (BST)', subtitle: 'Insert, Delete, Search & Traversals (Inorder, Preorder, Postorder)', complexity: 'O(log N)', programsCount: 4, difficulty: 'Advanced' as const, category: 'Data Struct', accentColor: '#a78bfa' },
  { id: 'graph_basics', number: '11', name: 'Graph Fundamentals', subtitle: 'Vertices, Edges & Adjacency Matrix', complexity: 'O(V+E)', programsCount: 2, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#eab308' },
  { id: 'graph_bfs', number: '12', name: 'Graph BFS Traversal', subtitle: 'Breadth-First Queue-based Level-Order Path Scan', complexity: 'O(V+E)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#10b981' },
  { id: 'graph_dfs', number: '13', name: 'Graph DFS Traversal', subtitle: 'Depth-First Stack-based Backtracking Path Scan', complexity: 'O(V+E)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#8b5cf6' },
  { id: 'graph_dijkstra', number: '14', name: "Dijkstra's Algorithm", subtitle: 'Single-Source Shortest Path in Weighted Graph', complexity: 'O((V+E) log V)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#38bdf8' },
  { id: 'graph_kruskal', number: '15', name: "Kruskal's Algorithm", subtitle: 'Minimum Spanning Tree (MST) via Disjoint Set Union', complexity: 'O(E log E)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#f59e0b' },
  { id: 'graph_prims', number: '16', name: "Prim's Algorithm", subtitle: 'Minimum Spanning Tree (MST) via Priority Queue', complexity: 'O((V+E) log V)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#10b981' },
  { id: 'graph_astar', number: '17', name: 'A* Search Algorithm', subtitle: 'Heuristic Optimal Pathfinding f(n) = g(n) + h(n)', complexity: 'O(E log V)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#ec4899' },
];

const difficultyConfig = {
  Beginner:     { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.22)' },
  Intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)' },
  Advanced:     { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.22)' },
};

/* =========================================================
   PAGE
   ========================================================= */
export const TopicSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { languageId } = useParams();

  const isDsa = languageId === 'dsa';

  const topics = useMemo(() => {
    if (languageId === 'c') return cTopics;
    if (languageId === 'cpp') return cppTopics;
    if (languageId === 'java') return javaTopics;
    if (isDsa) return dsaTopics;
    return pythonTopics;
  }, [languageId, isDsa]);

  const totalPrograms = useMemo(() => topics.reduce((s, t) => s + t.programsCount, 0), [topics]);
  const langDisplay = languageId
    ? (languageId === 'cpp' ? 'C++' : languageId === 'dsa' ? 'DSA' : languageId.charAt(0).toUpperCase() + languageId.slice(1))
    : 'Python';

  const handleTopicClick = (topicId: string) => {
    if (isDsa) {
      let programId = `dsa_${topicId}_op`;
      if (topicId === 'stack') programId = 'dsa_stack_push_pop';
      else if (topicId === 'queue') programId = 'dsa_queue_enq_deq';
      else if (topicId === 'singly_linked_list') programId = 'dsa_sll_traverse';
      else if (topicId === 'doubly_linked_list') programId = 'dsa_dll_traverse';
      else if (topicId === 'binary_tree') programId = 'dsa_binary_tree';
      else if (topicId === 'graph_basics') programId = 'dsa_graph_basics';
      else if (topicId === 'graph_bfs') programId = 'dsa_graph_bfs';
      else if (topicId === 'graph_dfs') programId = 'dsa_graph_dfs';
      else if (topicId === 'graph_dijkstra') programId = 'dsa_graph_dijkstra';
      else if (topicId === 'graph_kruskal') programId = 'dsa_graph_kruskal';
      else if (topicId === 'graph_prims') programId = 'dsa_graph_prims';
      else if (topicId === 'graph_astar') programId = 'dsa_graph_astar';
      else if (topicId === 'bubble_sort') programId = 'dsa_bubble_sort';
      else if (topicId === 'selection_sort') programId = 'dsa_selection_sort';
      else if (topicId === 'insertion_sort') programId = 'dsa_insertion_sort';
      else if (topicId === 'merge_sort') programId = 'dsa_merge_sort';
      else if (topicId === 'heap_sort') programId = 'dsa_heap_sort';
      navigate(`/visualizer/${languageId}/${topicId}/${programId}`);
    } else {
      navigate(`/topics/${languageId}/programs/${topicId}`);
    }
  };



  /* ── STANDARD LANGUAGE PAGE ────────────────────────────────────────────── */
  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-80 bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="flex flex-col pt-4 md:pt-6 pb-12 px-4 max-w-6xl mx-auto w-full min-h-full relative z-10">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight text-white drop-shadow-sm">
            {langDisplay} Topics
          </h1>
          <p className="text-sm md:text-base text-slate-200 font-medium leading-normal whitespace-nowrap">
            Select a topic to step through code execution and variable tracing.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex gap-2.5 mb-6 flex-wrap">
          {[
            { icon: Layers, label: `${topics.length} Topics`, color: '#6366f1' },
            ...(!isDsa ? [{ icon: BookOpen, label: `${totalPrograms} Programs`, color: '#a855f7' }] : []),
            { icon: BarChart2, label: '3 Difficulty Levels', color: '#38bdf8' },
          ].map(stat => (
            <div
              key={stat.label}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm"
              style={{ background: 'rgba(12, 14, 22, 0.8)', border: `1px solid ${stat.color}35` }}
            >
              <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Topic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 pb-12">
          {(topics as typeof pythonTopics).map((topic, index) => {
            const diff = difficultyConfig[topic.difficulty];
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Select topic ${topic.name}`}
                  onClick={() => handleTopicClick(topic.id)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleTopicClick(topic.id)}
                  className="relative flex flex-col overflow-hidden rounded-2xl p-5 min-h-48 transition-all duration-300 group select-none"
                  style={{
                    background: 'rgba(12, 14, 22, 0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${topic.accentColor}60`;
                    el.style.transform = 'translateY(-3px)';
                    el.style.boxShadow = `0 10px 30px -8px ${topic.accentColor}25, 0 0 0 1px ${topic.accentColor}40`;
                    const bar = el.querySelector('.accent-bar') as HTMLElement;
                    if (bar) bar.style.opacity = '1';
                    const num = el.querySelector('.chapter-num') as HTMLElement;
                    if (num) num.style.color = `${topic.accentColor}40`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.1)';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                    const bar = el.querySelector('.accent-bar') as HTMLElement;
                    if (bar) bar.style.opacity = '0';
                    const num = el.querySelector('.chapter-num') as HTMLElement;
                    if (num) num.style.color = 'rgba(255,255,255,0.12)';
                  }}
                >
                  <div className="accent-bar absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-opacity duration-200" style={{ background: topic.accentColor, opacity: 0 }} />
                  
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className="chapter-num font-black transition-colors duration-200"
                      style={{ fontSize: '46px', lineHeight: 1, color: 'rgba(255,255,255,0.12)', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {topic.number}
                    </span>
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
                      style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}
                    >
                      {topic.difficulty}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h2 className="text-xl font-black mb-1 leading-tight tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                      {topic.name}
                    </h2>
                    <p className="text-xs font-medium mb-4 text-slate-200 line-clamp-1">{topic.subtitle}</p>
                    
                    <div className="flex items-center justify-between text-xs font-bold pt-3 border-t text-white" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      {'complexity' in topic ? (
                        <>
                          <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">TIME COMPLEXITY</span>
                          <span className="text-[11px] font-mono font-black" style={{ color: topic.accentColor }}>{(topic as any).complexity}</span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{topic.programsCount} Programs</span>
                          </div>
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md font-extrabold uppercase"
                            style={{ color: topic.accentColor, background: `${topic.accentColor}15`, border: `1px solid ${topic.accentColor}30` }}
                          >
                            {topic.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};
