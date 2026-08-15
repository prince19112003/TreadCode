import React, { useState, useEffect } from 'react';
import { Contrast, Expand, Shrink } from 'lucide-react';
import { CodeStepPanel } from './components/CodeStepPanel';
import { StageControls } from './components/StageControls';
import { OutputConsole } from './components/OutputConsole';
import { ExplanationBar } from './components/ExplanationBar';
import { PenMenu } from './components/PenMenu';
const CustomFlowchartStage = React.lazy(() => import('./components/stages/CustomFlowchartStage').then(m => ({ default: m.CustomFlowchartStage })));
const StackVisualStage = React.lazy(() => import('./components/stages/StackVisualStage').then(m => ({ default: m.StackVisualStage })));
const QueueVisualStage = React.lazy(() => import('./components/stages/QueueVisualStage').then(m => ({ default: m.QueueVisualStage })));
const SllVisualStage = React.lazy(() => import('./components/stages/SllVisualStage').then(m => ({ default: m.SllVisualStage })));
const DllVisualStage = React.lazy(() => import('./components/stages/DllVisualStage').then(m => ({ default: m.DllVisualStage })));
const BubbleSortVisualStage = React.lazy(() => import('./components/stages/BubbleSortVisualStage').then(m => ({ default: m.BubbleSortVisualStage })));
const SelectionSortVisualStage = React.lazy(() => import('./components/stages/SelectionSortVisualStage').then(m => ({ default: m.SelectionSortVisualStage })));
const InsertionSortVisualStage = React.lazy(() => import('./components/stages/InsertionSortVisualStage').then(m => ({ default: m.InsertionSortVisualStage })));
const MergeSortVisualStage = React.lazy(() => import('./components/stages/MergeSortVisualStage').then(m => ({ default: m.MergeSortVisualStage })));
const HeapSortVisualStage = React.lazy(() => import('./components/stages/HeapSortVisualStage').then(m => ({ default: m.HeapSortVisualStage })));
const TreeVisualStage = React.lazy(() => import('./components/stages/TreeVisualStage').then(m => ({ default: m.TreeVisualStage })));
const GraphVisualStage = React.lazy(() => import('./components/stages/GraphVisualStage').then(m => ({ default: m.GraphVisualStage })));
const DsaAlgoStage = React.lazy(() => import('./components/stages/DsaAlgoStage').then(m => ({ default: m.DsaAlgoStage })));
const DsaOperationalPanel = React.lazy(() => import('./components/DsaOperationalPanel').then(m => ({ default: m.DsaOperationalPanel })));
const QueueOperationalPanel = React.lazy(() => import('./components/QueueOperationalPanel').then(m => ({ default: m.QueueOperationalPanel })));
const SllOperationalPanel = React.lazy(() => import('./components/SllOperationalPanel').then(m => ({ default: m.SllOperationalPanel })));
const DllOperationalPanel = React.lazy(() => import('./components/DllOperationalPanel').then(m => ({ default: m.DllOperationalPanel })));
const BubbleSortOperationalPanel = React.lazy(() => import('./components/BubbleSortOperationalPanel').then(m => ({ default: m.BubbleSortOperationalPanel })));
const SelectionSortOperationalPanel = React.lazy(() => import('./components/SelectionSortOperationalPanel').then(m => ({ default: m.SelectionSortOperationalPanel })));
const InsertionSortOperationalPanel = React.lazy(() => import('./components/InsertionSortOperationalPanel').then(m => ({ default: m.InsertionSortOperationalPanel })));
const MergeSortOperationalPanel = React.lazy(() => import('./components/MergeSortOperationalPanel').then(m => ({ default: m.MergeSortOperationalPanel })));
const HeapSortOperationalPanel = React.lazy(() => import('./components/HeapSortOperationalPanel').then(m => ({ default: m.HeapSortOperationalPanel })));
const TreeOperationalPanel = React.lazy(() => import('./components/TreeOperationalPanel').then(m => ({ default: m.TreeOperationalPanel })));
const GraphOperationalPanel = React.lazy(() => import('./components/GraphOperationalPanel').then(m => ({ default: m.GraphOperationalPanel })));
import { QuickHandwrittenNote } from './components/QuickHandwrittenNote';
import { useLessonStore } from '../../lessons/useLessonStore';

export const VisualizerWorkspace = React.memo(() => {
  const lesson = useLessonStore(s => s.lesson);
  const isFullScreen = useLessonStore(s => s.isFullScreen);
  const toggleFullScreen = useLessonStore(s => s.toggleFullScreen);
  const isDsa = lesson?.language === 'dsa';
  const [isConsoleFullScreen, setIsConsoleFullScreen] = useState(false);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(() => lesson?.language === 'dsa');
  const [isPureBlack, setIsPureBlack] = useState(() => localStorage.getItem('treadcode_pure_black') === 'true');

  // Ensure output console is collapsed by default for all DSA topics
  useEffect(() => {
    if (isDsa) {
      setIsConsoleCollapsed(true);
    }
  }, [lesson?.id, isDsa]);

  const togglePureBlack = () => {
    setIsPureBlack(prev => {
      const next = !prev;
      localStorage.setItem('treadcode_pure_black', String(next));
      return next;
    });
  };

  const isStackTopic = isDsa && lesson?.topic === 'stack';
  const isQueueTopic = isDsa && lesson?.topic === 'queue';
  const isSllTopic = isDsa && lesson?.topic === 'singly_linked_list';
  const isDllTopic = isDsa && lesson?.topic === 'doubly_linked_list';
  const isBubbleSortTopic = isDsa && (lesson?.topic === 'bubble_sort' || lesson?.id === 'dsa_bubble_sort');
  const isSelectionSortTopic = isDsa && (lesson?.topic === 'selection_sort' || lesson?.id === 'dsa_selection_sort');
  const isInsertionSortTopic = isDsa && (lesson?.topic === 'insertion_sort' || lesson?.id === 'dsa_insertion_sort');
  const isMergeSortTopic = isDsa && (lesson?.topic === 'merge_sort' || lesson?.id === 'dsa_merge_sort');
  const isHeapSortTopic = isDsa && (lesson?.topic === 'heap_sort' || lesson?.id === 'dsa_heap_sort');
  const isSortingTopic = isBubbleSortTopic || isSelectionSortTopic || isInsertionSortTopic || isMergeSortTopic || isHeapSortTopic;
  const isTreeTopic = isDsa && lesson?.topic === 'binary_tree';
  const isGraphTopic = isDsa && (lesson?.topic === 'graph_basics' || lesson?.topic === 'graph_bfs' || lesson?.topic === 'graph_dfs' || lesson?.topic === 'graph_dijkstra' || lesson?.topic === 'graph_kruskal' || lesson?.topic === 'graph_prims' || lesson?.topic === 'graph_astar');

  const isFlowchartTopic = !isDsa && [
    'variables', 'type_casting', 'operators', 'operators_expressions', 'user_input', 'data_types',
    'if_statement', 'if_else', 'if_elif_else', 'match_case', 'switch_case',
    'for_loop', 'while_loop', 'do_while_loop', 'nested_loop', 'loop_control', 'loops',
    'functions', 'recursion', 'strings', 'lists', 'tuples', 'dictionaries',
    'arrays', 'arrays_1d', 'arrays_2d', 'searching_sorting', 'array_operations',
    'searching', 'sorting',
  ].includes(lesson?.topic || '');

  /* ── Stage FullScreen Toggle Button (Bottom-Left) ── */
  const fullScreenToggleButton = (
    <button
      onClick={toggleFullScreen}
      title={isFullScreen ? "Exit Fullscreen Stage" : "Fullscreen Stage View"}
      className="absolute bottom-4 left-4 z-50 p-2 backdrop-blur-md rounded-xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.4)] flex items-center justify-center border bg-[#0d1126]/80 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 hover:scale-105 active:scale-95"
    >
      {isFullScreen ? <Shrink size={16} /> : <Expand size={16} />}
    </button>
  );

  /* ── Canvas Background Toggle Button (Bottom-Left next to Full Screen) ── */
  const pureBlackToggleButton = (
    <button
      onClick={togglePureBlack}
      title={isPureBlack ? "Switch Canvas to Regular Dark Theme" : "Switch Canvas to Pure OLED Black (#000000)"}
      className={`absolute bottom-4 left-15 z-50 p-2 backdrop-blur-md rounded-xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.4)] flex items-center justify-center border ${
        isPureBlack
          ? 'bg-black/90 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95'
          : 'bg-[#0d1126]/80 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 hover:scale-105 active:scale-95'
      }`}
    >
      <Contrast size={16} />
    </button>
  );

  const isCodeFullScreen = useLessonStore(s => s.isCodeFullScreen);

  /* ── Code Panel FullScreen ──────────────────────────────────────────────── */
  if (isCodeFullScreen) {
    return (
      <div className={`flex h-screen w-screen overflow-hidden text-slate-200 relative p-1.5 gap-1.5 ${isPureBlack ? 'bg-black' : 'bg-[#050510]'}`}>
        <StageControls />
        <div className="flex-1 h-full relative overflow-hidden flex flex-col gap-1.5">
          <div className="flex-1 overflow-hidden flex flex-col">
            <CodeStepPanel />
          </div>
          <div className="h-28 overflow-hidden flex flex-col">
            <ExplanationBar />
          </div>
        </div>
      </div>
    );
  }

  /* ── Stage FullScreen ───────────────────────────────────────────────────── */
  if (isFullScreen) {
    return (
      <div className={`flex h-screen w-screen overflow-hidden text-slate-200 relative p-1.5 gap-1.5 ${isPureBlack ? 'bg-black' : 'bg-[#050510]'}`}>
        <StageControls />
        <div className="flex-1 h-full relative overflow-hidden flex flex-col">
          {fullScreenToggleButton}
          {pureBlackToggleButton}
          <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
            {isStackTopic ? <StackVisualStage /> : isQueueTopic ? <QueueVisualStage /> : isSllTopic ? <SllVisualStage /> : isDllTopic ? <DllVisualStage /> : isBubbleSortTopic ? <BubbleSortVisualStage /> : isSelectionSortTopic ? <SelectionSortVisualStage /> : isInsertionSortTopic ? <InsertionSortVisualStage /> : isMergeSortTopic ? <MergeSortVisualStage /> : isHeapSortTopic ? <HeapSortVisualStage /> : isTreeTopic ? <TreeVisualStage /> : isGraphTopic ? <GraphVisualStage /> : isFlowchartTopic ? <CustomFlowchartStage /> : <DsaAlgoStage />}
          </React.Suspense>
        </div>
        <PenMenu />
      </div>
    );
  }

  /* ── DSA Interactive Layout ─────────────────────────────────────────────── */
  if (isDsa) {
    return (
      <div className={`flex flex-col h-screen w-screen overflow-hidden text-slate-200 ${isPureBlack ? 'bg-black' : 'bg-[#050510]'}`}>
        <div className={`flex-1 flex flex-col md:flex-row gap-1.5 p-1.5 overflow-hidden ${isPureBlack ? 'bg-black' : 'bg-[#050510]'}`}>

          {/* ── Left Column: Operational Dashboard (Mobile: flex-1/scrollable, PC: 30%) ── */}
          <div className="w-full md:w-[30%] flex flex-col gap-1.5 overflow-hidden shrink-0 h-[45%] md:h-full">
            <div className={`overflow-hidden flex flex-col transition-all duration-300 ${
              isSortingTopic ? 'h-[48%] md:h-[46%]' : 'h-[60%] md:h-[66%]'
            }`}>
              <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
                {isStackTopic ? <DsaOperationalPanel /> : isQueueTopic ? <QueueOperationalPanel /> : isSllTopic ? <SllOperationalPanel /> : isDllTopic ? <DllOperationalPanel /> : isBubbleSortTopic ? <BubbleSortOperationalPanel /> : isSelectionSortTopic ? <SelectionSortOperationalPanel /> : isInsertionSortTopic ? <InsertionSortOperationalPanel /> : isMergeSortTopic ? <MergeSortOperationalPanel /> : isHeapSortTopic ? <HeapSortOperationalPanel /> : isTreeTopic ? <TreeOperationalPanel /> : isGraphTopic ? <GraphOperationalPanel /> : <CodeStepPanel />}
              </React.Suspense>
            </div>
            <div className={`overflow-hidden flex flex-col transition-all duration-300 ${
              isSortingTopic ? 'h-[52%] md:h-[54%]' : 'h-[40%] md:h-[34%]'
            }`}>
              <ExplanationBar />
            </div>
          </div>

          {/* ── Center: Vertical/Horizontal Control Panel (Zoom, Fit, Reset) ── */}
          <StageControls />

          {/* ── Right Column: Visual Stage (Mobile: flex-1, PC: 62%) ── */}
          <div className="flex-1 flex flex-col gap-1.5 overflow-hidden relative h-[50%] md:h-full">
            <div className={`relative overflow-hidden flex flex-col rounded-lg border border-slate-800/50 transition-all duration-300 ${
              isPureBlack ? 'bg-black' : 'bg-[#050510]'
            } ${isConsoleCollapsed ? 'flex-1' : 'h-[70%]'}`}>
              {fullScreenToggleButton}
              {pureBlackToggleButton}
              <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
                {isStackTopic ? <StackVisualStage /> : isQueueTopic ? <QueueVisualStage /> : isSllTopic ? <SllVisualStage /> : isDllTopic ? <DllVisualStage /> : isBubbleSortTopic ? <BubbleSortVisualStage /> : isSelectionSortTopic ? <SelectionSortVisualStage /> : isInsertionSortTopic ? <InsertionSortVisualStage /> : isMergeSortTopic ? <MergeSortVisualStage /> : isHeapSortTopic ? <HeapSortVisualStage /> : isTreeTopic ? <TreeVisualStage /> : isGraphTopic ? <GraphVisualStage /> : <DsaAlgoStage />}
              </React.Suspense>
              <PenMenu />
              <QuickHandwrittenNote topic={lesson?.topic ?? 'stack'} />
            </div>
            <div className={`overflow-hidden flex flex-col transition-all duration-300 ${
              isConsoleCollapsed ? 'h-10 shrink-0' : 'h-[30%]'
            }`}>
              <OutputConsole
                isFullScreen={isConsoleFullScreen}
                onToggleFullScreen={() => setIsConsoleFullScreen(!isConsoleFullScreen)}
                isCollapsed={isConsoleCollapsed}
                onToggleCollapse={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
              />
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ── Standard Language Layout ───────────────────────────────────────────── */
  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden text-slate-200 ${isPureBlack ? 'bg-black' : 'bg-[#050510]'}`}>
      <div className={`flex-1 flex flex-col md:flex-row gap-1.5 p-1.5 overflow-hidden ${isPureBlack ? 'bg-black' : 'bg-[#050510]'}`}>

        {/* Left: Code Panel (Mobile: 45% height, PC: 38% width) */}
        <div className="w-full md:w-[38%] flex flex-col gap-1.5 overflow-hidden shrink-0 h-[45%] md:h-full">
          <div className="h-[65%] md:h-[75%] overflow-hidden flex flex-col">
            <CodeStepPanel />
          </div>
          <div className="h-[35%] md:h-[25%] overflow-hidden flex flex-col">
            <ExplanationBar />
          </div>
        </div>

        {/* Center: Vertical Playback Controls */}
        <StageControls />

        {/* Right: Visualization Stage */}
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden relative h-[50%] md:h-full">
          <div className={`relative overflow-hidden flex flex-col transition-all duration-300 rounded-lg border border-slate-800/50 ${
            isPureBlack ? 'bg-black' : 'bg-[#050510]'
          } ${isConsoleCollapsed ? 'flex-1' : 'h-[70%]'}`}>
            {pureBlackToggleButton}
            <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
              {isFlowchartTopic ? <CustomFlowchartStage /> : <DsaAlgoStage />}
            </React.Suspense>
            <PenMenu />
          </div>
          <div className={`overflow-hidden flex flex-col transition-all duration-300 ${
            isConsoleCollapsed ? 'h-10 shrink-0' : 'h-[30%]'
          }`}>
            <OutputConsole
              isFullScreen={isConsoleFullScreen}
              onToggleFullScreen={() => setIsConsoleFullScreen(!isConsoleFullScreen)}
              isCollapsed={isConsoleCollapsed}
              onToggleCollapse={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
            />
          </div>
        </div>

      </div>
    </div>
  );
});
