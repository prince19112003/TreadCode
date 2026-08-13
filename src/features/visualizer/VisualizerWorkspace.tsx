import React, { useState } from 'react';
import { Contrast } from 'lucide-react';
import { CodeStepPanel } from './components/CodeStepPanel';
import { StageControls } from './components/StageControls';
import { OutputConsole } from './components/OutputConsole';
import { ExplanationBar } from './components/ExplanationBar';
import { PenMenu } from './components/PenMenu';
import { CustomFlowchartStage } from './components/stages/CustomFlowchartStage';
import { StackVisualStage } from './components/stages/StackVisualStage';
import { QueueVisualStage } from './components/stages/QueueVisualStage';
import { SllVisualStage } from './components/stages/SllVisualStage';
import { DllVisualStage } from './components/stages/DllVisualStage';
import { TreeVisualStage } from './components/stages/TreeVisualStage';
import { GraphVisualStage } from './components/stages/GraphVisualStage';
import { DsaAlgoStage } from './components/stages/DsaAlgoStage';
import { DsaOperationalPanel } from './components/DsaOperationalPanel';
import { QueueOperationalPanel } from './components/QueueOperationalPanel';
import { SllOperationalPanel } from './components/SllOperationalPanel';
import { DllOperationalPanel } from './components/DllOperationalPanel';
import { TreeOperationalPanel } from './components/TreeOperationalPanel';
import { GraphOperationalPanel } from './components/GraphOperationalPanel';
import { useLesson } from '../../lessons/LessonContext';

export const VisualizerWorkspace: React.FC = () => {
  const { lesson, isFullScreen } = useLesson();
  const isDsa = lesson?.language === 'dsa';
  const [isConsoleFullScreen, setIsConsoleFullScreen] = useState(false);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(() => lesson?.language === 'dsa');
  const [isPureBlack, setIsPureBlack] = useState(() => localStorage.getItem('treadcode_pure_black') === 'true');

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
  const isTreeTopic = isDsa && lesson?.topic === 'binary_tree';
  const isGraphTopic = isDsa && (lesson?.topic === 'graph_basics' || lesson?.topic === 'graph_bfs' || lesson?.topic === 'graph_dfs');

  const isFlowchartTopic = [
    'variables', 'type_casting', 'operators', 'operators_expressions', 'user_input', 'data_types',
    'if_statement', 'if_else', 'if_elif_else', 'match_case', 'switch_case',
    'for_loop', 'while_loop', 'do_while_loop', 'nested_loop', 'loop_control', 'loops',
    'functions', 'recursion', 'strings', 'lists', 'tuples', 'dictionaries',
    'arrays', 'arrays_1d', 'arrays_2d', 'searching_sorting', 'array_operations',
    'searching', 'sorting',
    'stack', 'queue', 'singly_linked_list', 'doubly_linked_list', 'recursion_dsa',
    'binary_tree', 'graph_basics', 'graph_bfs', 'graph_dfs',
  ].includes(lesson?.topic || '');

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

  /* ── Output Console FullScreen ──────────────────────────────────────────── */
  if (isConsoleFullScreen) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#050510] text-slate-200 relative p-1.5 gap-1.5">
        {!isDsa && <StageControls />}
        <div className="flex-1 h-full relative overflow-hidden flex flex-col">
          <OutputConsole isFullScreen onToggleFullScreen={() => setIsConsoleFullScreen(false)} />
        </div>
      </div>
    );
  }

  /* ── Stage FullScreen ───────────────────────────────────────────────────── */
  if (isFullScreen) {
    return (
      <div className={`flex h-screen w-screen overflow-hidden text-slate-200 relative p-1.5 gap-1.5 ${isPureBlack ? 'bg-black' : 'bg-[#050510]'}`}>
        {!isDsa && <StageControls />}
        <div className="flex-1 h-full relative overflow-hidden flex flex-col">
          {pureBlackToggleButton}
          {isStackTopic ? <StackVisualStage /> : isQueueTopic ? <QueueVisualStage /> : isSllTopic ? <SllVisualStage /> : isDllTopic ? <DllVisualStage /> : isTreeTopic ? <TreeVisualStage /> : isGraphTopic ? <GraphVisualStage /> : isFlowchartTopic ? <CustomFlowchartStage /> : <DsaAlgoStage />}
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
            <div className="h-[65%] md:h-[75%] overflow-hidden flex flex-col">
              {isStackTopic ? <DsaOperationalPanel /> : isQueueTopic ? <QueueOperationalPanel /> : isSllTopic ? <SllOperationalPanel /> : isDllTopic ? <DllOperationalPanel /> : isTreeTopic ? <TreeOperationalPanel /> : isGraphTopic ? <GraphOperationalPanel /> : <CodeStepPanel />}
            </div>
            <div className="h-[35%] md:h-[25%] overflow-hidden flex flex-col">
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
              {pureBlackToggleButton}
              {isStackTopic ? <StackVisualStage /> : isQueueTopic ? <QueueVisualStage /> : isSllTopic ? <SllVisualStage /> : isDllTopic ? <DllVisualStage /> : isTreeTopic ? <TreeVisualStage /> : isGraphTopic ? <GraphVisualStage /> : <CustomFlowchartStage />}
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
            {isFlowchartTopic ? <CustomFlowchartStage /> : <DsaAlgoStage />}
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
};
