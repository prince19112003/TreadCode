import React, { useState } from 'react';
import { CodeStepPanel } from './components/CodeStepPanel';
import { MemoryStage } from './components/MemoryStage';
import { StageControls } from './components/StageControls';
import { OutputConsole } from './components/OutputConsole';
import { ExplanationBar } from './components/ExplanationBar';
import { PenMenu } from './components/PenMenu';
import { CustomFlowchartStage } from './components/stages/CustomFlowchartStage';
import { DsaAlgoStage } from './components/stages/DsaAlgoStage';
import { DsaOperationalPanel } from './components/DsaOperationalPanel';
import { useLesson } from '../../lessons/LessonContext';

export const VisualizerWorkspace: React.FC = () => {
  const { lesson, isFullScreen } = useLesson();
  const [isConsoleFullScreen, setIsConsoleFullScreen] = useState(false);

  const isDsa = lesson?.language === 'dsa';

  const isFlowchartTopic = ['variables', 'type_casting', 'operators', 'operators_expressions', 'user_input', 'data_types', 'if_statement', 'if_else', 'if_elif_else', 'match_case', 'switch_case', 'for_loop', 'while_loop', 'do_while_loop', 'nested_loop', 'loop_control', 'loops', 'functions', 'recursion', 'strings', 'lists', 'tuples', 'dictionaries', 'arrays', 'arrays_1d', 'arrays_2d', 'searching_sorting', 'array_operations', 'searching', 'sorting', 'stack', 'queue', 'singly_linked_list', 'doubly_linked_list', 'recursion_dsa', 'binary_tree', 'graph_basics'].includes(lesson?.topic || '');

  if (isConsoleFullScreen) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#050510] text-slate-200 relative p-1.5 gap-1.5">
        <StageControls />
        <div className="flex-1 h-full relative overflow-hidden flex flex-col">
          <OutputConsole isFullScreen={isConsoleFullScreen} onToggleFullScreen={() => setIsConsoleFullScreen(false)} />
        </div>
      </div>
    );
  }

  if (isFullScreen) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#050510] text-slate-200 relative p-1.5 gap-1.5">
        <StageControls />
        <div className="flex-1 h-full relative overflow-hidden flex flex-col">
          {isDsa ? <DsaAlgoStage /> : isFlowchartTopic ? <CustomFlowchartStage /> : <MemoryStage />}
        </div>
        <PenMenu />
      </div>
    );
  }

  /* ── DSA Layout: Operational Panel on left, no timeline slider, Flowchart Stage on right ── */
  if (isDsa) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#050510] text-slate-200">
        <div className="flex-1 flex gap-1.5 p-1.5 overflow-hidden bg-[#050510]">

          {/* Left: Operations & Explanation Panel (38%) */}
          <div className="w-[38%] flex flex-col gap-1.5 overflow-hidden shrink-0">
            <div className="h-[70%] overflow-hidden flex flex-col">
              {lesson?.topic === 'stack' ? <DsaOperationalPanel /> : <CodeStepPanel />}
            </div>
            <div className="h-[30%] overflow-hidden flex flex-col">
              <ExplanationBar />
            </div>
          </div>

          {/* Right: Custom Flowchart Stage (62%) */}
          <div className="flex-1 flex flex-col gap-1.5 overflow-hidden relative">
            <div className="h-[70%] relative overflow-hidden flex flex-col">
              <CustomFlowchartStage />
              <PenMenu />
            </div>
            <div className="h-[30%] overflow-hidden flex flex-col">
              <OutputConsole isFullScreen={isConsoleFullScreen} onToggleFullScreen={() => setIsConsoleFullScreen(!isConsoleFullScreen)} />
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ── Standard Language Layout ─────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#050510] text-slate-200">
      <div className="flex-1 flex gap-1.5 p-1.5 overflow-hidden bg-[#050510]">

        {/* Left: Code Panel (38%) */}
        <div className="w-[38%] flex flex-col gap-1.5 overflow-hidden shrink-0">
          <div className="h-[70%] overflow-hidden flex flex-col">
            <CodeStepPanel />
          </div>
          <div className="h-[30%] overflow-hidden flex flex-col">
            <ExplanationBar />
          </div>
        </div>

        {/* Center: Vertical Playback Controls */}
        <StageControls />

        {/* Right: Visualization Stage */}
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden relative">
          <div className="h-[70%] relative overflow-hidden flex flex-col">
            {isFlowchartTopic ? <CustomFlowchartStage /> : <MemoryStage />}
            <PenMenu />
          </div>
          <div className="h-[30%] overflow-hidden flex flex-col">
            <OutputConsole isFullScreen={isConsoleFullScreen} onToggleFullScreen={() => setIsConsoleFullScreen(!isConsoleFullScreen)} />
          </div>
        </div>

      </div>
    </div>
  );
};

