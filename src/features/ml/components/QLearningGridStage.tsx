import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Sparkles, Trophy, Flame } from 'lucide-react';

export const QLearningGridStage: React.FC = () => {
  // 4x4 Grid: Start (0,0), Goal (3,3), Traps (1,1) & (2,2)
  const [agentPos, setAgentPos] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [episodes, setEpisodes] = useState<number>(0);
  const [totalReward, setTotalReward] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastInsight, setLastInsight] = useState<string>('Click "Step 1 Move" to let the agent take an action. Over time, it updates Q-values to find the shortest safe path.');

  // Q-Table: 16 states (4x4), 4 actions [Up, Right, Down, Left]
  const [qTable, setQTable] = useState<number[][]>(() =>
    Array(16).fill(0).map(() => [0, 0, 0, 0])
  );

  const goal = { r: 3, c: 3 };
  const traps = [
    { r: 1, c: 1 },
    { r: 2, c: 2 },
  ];

  const stateIndex = (r: number, c: number) => r * 4 + c;

  // Single step of Q-Learning
  const stepAgent = () => {
    const s = stateIndex(agentPos.r, agentPos.c);

    // Epsilon-greedy action choice (0: Up, 1: Right, 2: Down, 3: Left)
    const currentQ = qTable[s];
    let action = 0;
    if (Math.random() < 0.25) {
      action = Math.floor(Math.random() * 4); // Explore
    } else {
      action = currentQ.indexOf(Math.max(...currentQ)); // Exploit
    }

    let nextR = agentPos.r;
    let nextC = agentPos.c;
    if (action === 0 && nextR > 0) nextR--;
    if (action === 1 && nextC < 3) nextC++;
    if (action === 2 && nextR < 3) nextR++;
    if (action === 3 && nextC > 0) nextC--;

    // Reward calculation
    let reward = -1; // living penalty
    let isTerminal = false;

    if (nextR === goal.r && nextC === goal.c) {
      reward = 100;
      isTerminal = true;
    } else if (traps.some((t) => t.r === nextR && t.c === nextC)) {
      reward = -50;
      isTerminal = true;
    }

    // Q-Learning Bellman Update: Q(s,a) = Q(s,a) + alpha * [reward + gamma * maxQ(s') - Q(s,a)]
    const nextS = stateIndex(nextR, nextC);
    const alpha = 0.5;
    const gamma = 0.9;
    const maxNextQ = Math.max(...qTable[nextS]);

    const newQTable = qTable.map((row) => [...row]);
    newQTable[s][action] = Number(
      (newQTable[s][action] + alpha * (reward + gamma * maxNextQ - newQTable[s][action])).toFixed(1)
    );

    setQTable(newQTable);
    setTotalReward((prev) => prev + reward);

    if (isTerminal) {
      setAgentPos({ r: 0, c: 0 });
      setEpisodes((prev) => prev + 1);
      setLastInsight(
        reward > 0
          ? `Episode ${episodes + 1}: Reached Goal (+100)! Backpropagated positive Q-values.`
          : `Episode ${episodes + 1}: Hit Fire Trap (-50)! Updated Q-table to avoid this block.`
      );
    } else {
      setAgentPos({ r: nextR, c: nextC });
      setLastInsight(`Moved to cell (${nextR}, ${nextC}). Small living cost -1 applied.`);
    }
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => stepAgent(), 180);
      return () => clearInterval(timer);
    }
  }, [isRunning, agentPos, qTable, episodes]);

  const handleReset = () => {
    setIsRunning(false);
    setAgentPos({ r: 0, c: 0 });
    setEpisodes(0);
    setTotalReward(0);
    setQTable(Array(16).fill(0).map(() => [0, 0, 0, 0]));
    setLastInsight('Q-Learning memory erased. Agent is back at start.');
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full h-full bg-[#080b14] text-slate-200 overflow-hidden select-none">
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isRunning ? 'bg-amber-600 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              {isRunning ? <Pause size={13} /> : <Play size={13} />}
              <span>{isRunning ? 'Pause' : 'Auto-Train Agent'}</span>
            </button>
            <button
              onClick={stepAgent}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Step 1 Move</span>
              <ChevronRight size={13} />
            </button>
            <button onClick={handleReset} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer">
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <Trophy size={13} /> Goal (+100)
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <Flame size={13} /> Trap (-50)
            </span>
          </div>
        </div>

        {/* 4x4 Grid Board */}
        <div className="relative flex-1 min-h-90 bg-[#0c101f] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-center items-center shadow-inner overflow-hidden">
          <div className="grid grid-cols-4 gap-2.5 w-full max-w-105 aspect-square">
            {Array(16).fill(0).map((_, idx) => {
              const r = Math.floor(idx / 4);
              const c = idx % 4;
              const isAgent = agentPos.r === r && agentPos.c === c;
              const isGoal = goal.r === r && goal.c === c;
              const isTrap = traps.some((t) => t.r === r && t.c === c);
              const maxQ = Math.max(...qTable[idx]);

              return (
                <div
                  key={idx}
                  className={`relative rounded-xl border flex flex-col items-center justify-center p-2 transition-all ${
                    isGoal
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : isTrap
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900/90 border-slate-800 text-slate-400'
                  }`}
                >
                  {/* Content in Cell */}
                  {isAgent ? (
                    <span className="text-3xl animate-bounce">🤖</span>
                  ) : isGoal ? (
                    <span className="text-2xl">🧀</span>
                  ) : isTrap ? (
                    <span className="text-2xl">🔥</span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono text-slate-500">Q-Max</span>
                      <span className={`text-xs font-mono font-bold ${maxQ > 0 ? 'text-teal-300' : maxQ < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                        {maxQ.toFixed(0)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Sparkles size={16} className="text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Agent Learning: </span>
            <span>{lastInsight}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-84 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0a0d18] p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Bellman Equation</span>
          <div className="font-mono text-xs font-bold text-teal-300 leading-relaxed">
            Q(s,a) ← Q + α[R + γ·maxQ' - Q]
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Episodes</span>
            <span className="text-2xl font-mono font-black text-white">{episodes}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Reward</span>
            <span className={`text-2xl font-mono font-black ${totalReward >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalReward}
            </span>
          </div>
        </div>

        <div className="mt-auto p-3 bg-teal-950/30 border border-teal-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-teal-300 block mb-1">Reinforcement Learning Core:</strong>
          Unlike Supervised Learning, there is no correct answer given upfront. The agent explores the world by trial and error, getting positive rewards for cheese and negative penalties for fire.
        </div>
      </div>
    </div>
  );
};
