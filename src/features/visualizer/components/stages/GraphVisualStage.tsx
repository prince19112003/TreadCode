import React, { useRef, useEffect } from 'react';
import { useLessonStore } from '../../../../lessons/useLessonStore';

const GRAPH_7_NODES = ['0', '1', '2', '3', '4', '5', '6'];
const DIJKSTRA_NODES = ['0', '1', '2', '3', '4', '5'];

const FALLBACK_GRAPH_POSITIONS: Record<string, { x: number; y: number }> = {
  '0': { x: 80, y: 70 },
  '3': { x: 300, y: 70 },
  '6': { x: 440, y: 150 },
  '2': { x: 220, y: 170 },
  '1': { x: 80, y: 270 },
  '4': { x: 270, y: 280 },
  '5': { x: 400, y: 250 },
};

// Coordinates layout for 6-node Weighted Graph (Large 520x340 Canvas)
const DIJKSTRA_NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  '0': { x: 75, y: 170 },
  '1': { x: 200, y: 65 },
  '2': { x: 200, y: 275 },
  '3': { x: 345, y: 65 },
  '4': { x: 345, y: 275 },
  '5': { x: 465, y: 170 },
};

interface GraphNode {
  id: string;
  x: number;
  y: number;
}

interface WeightedEdge {
  u: string;
  v: string;
  weight?: number;
}

export const GraphVisualStage: React.FC = () => {
  const currentStep = useLessonStore(s => s.currentStep);
  const activeSteps = useLessonStore(s => s.activeSteps);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);
  const zoom = useLessonStore(s => s.zoom);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extract snapshot reliably
  const stepSnapshot = (activeSteps && activeSteps.length > 0)
    ? (activeSteps[currentStepIndex] || activeSteps[0])
    : currentStep;

  const mem = (stepSnapshot?.memorySnapshot as any) || {};
  const rawNodes: GraphNode[] = Array.isArray(mem.nodes) ? mem.nodes : [];
  const edges: WeightedEdge[] = Array.isArray(mem.edges) ? mem.edges : [];
  
  // Algorithm specific state
  const isBfs = mem.isBfs === true;
  const isDfs = mem.isDfs === true;
  const isDijkstra = mem.isDijkstra === true;
  const isKruskal = mem.isKruskal === true;
  const isPrims = mem.isPrims === true;
  const isAlgo = isBfs || isDfs || isDijkstra || isKruskal || isPrims;

  const queueBuffer: (string | null)[] = Array.isArray(mem.queue) ? mem.queue : Array(7).fill(null);
  const stackBuffer: (string | null)[] = Array.isArray(mem.stack) ? mem.stack : Array(7).fill(null);
  const frontIdx: number = typeof mem.frontIdx === 'number' ? mem.frontIdx : 0;
  const topIdx: number = typeof mem.topIdx === 'number' ? mem.topIdx : 0;

  const visited: string[] = Array.isArray(mem.visited) ? mem.visited : [];
  const activeNode: string | undefined = typeof mem.activeNode === 'string' ? mem.activeNode : undefined;
  const inspectingNeighbors: string[] = Array.isArray(mem.inspectingNeighbors) ? mem.inspectingNeighbors : [];
  const bfsOrder: string[] = Array.isArray(mem.bfsOrder) ? mem.bfsOrder : [];
  const dfsOrder: string[] = Array.isArray(mem.dfsOrder) ? mem.dfsOrder : [];

  // Dijkstra state
  const distMap: Record<string, number> = mem.distMap || {};
  const parentMap: Record<string, string | null> = mem.parentMap || {};
  const settledSet: string[] = Array.isArray(mem.settledSet) ? mem.settledSet : [];
  const relaxingEdge: { u: string; v: string; weight: number; updated: boolean } | undefined = mem.relaxingEdge;
  const shortestPath: string[] = Array.isArray(mem.shortestPath) ? mem.shortestPath : [];
  const totalDist: number | undefined = mem.totalDist;

  // Kruskal & Prim's state
  const sortedEdges: WeightedEdge[] = Array.isArray(mem.sortedEdges) ? mem.sortedEdges : [];
  const edgeStatuses: Record<string, 'ACCEPTED' | 'REJECTED' | 'TESTING' | 'PENDING'> = mem.edgeStatuses || {};
  const mstEdges: WeightedEdge[] = Array.isArray(mem.mstEdges) ? mem.mstEdges : [];
  const mstSet: string[] = Array.isArray(mem.mstSet) ? mem.mstSet : [];
  const candidateEdges: WeightedEdge[] = Array.isArray(mem.candidateEdges) ? mem.candidateEdges : [];
  const testingEdge: WeightedEdge | undefined = mem.testingEdge;
  const acceptedEdge: WeightedEdge | undefined = mem.acceptedEdge;
  const rejectedEdge: WeightedEdge | undefined = mem.rejectedEdge;
  const totalMstWeight: number = typeof mem.totalMstWeight === 'number' ? mem.totalMstWeight : 0;

  // Fundamentals state
  const inspectNode: string = typeof mem.inspectNode === 'string' ? mem.inspectNode : '0';
  const neighbors: string[] = Array.isArray(mem.neighbors) ? mem.neighbors : [];

  // Guarantee node positions map
  const activeNodeList = (isDijkstra || isKruskal || isPrims) ? DIJKSTRA_NODES : GRAPH_7_NODES;
  const activePosMap = (isDijkstra || isKruskal || isPrims) ? DIJKSTRA_NODE_POSITIONS : FALLBACK_GRAPH_POSITIONS;

  const nodes: GraphNode[] = activeNodeList.map(id => {
    const found = rawNodes.find(n => n.id === id);
    return {
      id,
      x: found ? found.x : activePosMap[id].x,
      y: found ? found.y : activePosMap[id].y,
    };
  });

  // Auto-scroll on step change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentStepIndex]);

  const activePath = isBfs ? bfsOrder : isDfs ? dfsOrder : shortestPath;

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto p-3 md:p-5 select-none custom-scrollbar"
    >
      <div
        className="w-full max-w-6xl flex flex-col items-center gap-5 transition-transform duration-200 ease-out py-1"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        
        {/* Header Status Bar */}
        <div className="flex items-center justify-between w-full bg-slate-950/90 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-md ${
              isPrims || isKruskal || isDijkstra ? 'bg-amber-400 shadow-amber-400/80' : isBfs ? 'bg-cyan-400 shadow-cyan-400/80' : isDfs ? 'bg-purple-400 shadow-purple-400/80' : 'bg-emerald-400 shadow-emerald-400/80'
            }`} />
            <span className="font-black text-amber-300 tracking-wider text-xs uppercase drop-shadow">
              {isPrims ? "PRIM'S MINIMUM SPANNING TREE (MST)" : isKruskal ? "KRUSKAL'S MINIMUM SPANNING TREE (MST)" : isDijkstra ? "DIJKSTRA'S ALGORITHM (WEIGHTED GRAPH)" : isBfs ? 'GRAPH BREADTH-FIRST SEARCH (BFS)' : isDfs ? 'GRAPH DEPTH-FIRST SEARCH (DFS)' : 'GRAPH FUNDAMENTALS'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 font-mono text-xs">
            {isPrims || isKruskal ? (
              <div>
                <span className="text-slate-400 font-semibold">MST Edges:</span>{' '}
                <span className="text-amber-400 font-black text-xs">{mstEdges.length} / 5 (Weight = {totalMstWeight})</span>
              </div>
            ) : isDijkstra ? (
              <div>
                <span className="text-slate-400 font-semibold">Active Min Node:</span>{' '}
                <span className="text-amber-400 font-black text-xs">{activeNode !== undefined ? `Node [${activeNode}] (dist = ${distMap[activeNode]})` : 'None'}</span>
              </div>
            ) : isAlgo ? (
              <div>
                <span className="text-slate-400 font-semibold">{isBfs ? 'Active Dequeued:' : 'Active Popped:'}</span>{' '}
                <span className="text-amber-400 font-black text-xs">{activeNode !== undefined ? `Node [${activeNode}]` : 'None'}</span>
              </div>
            ) : (
              <div>
                <span className="text-slate-400 font-semibold">Inspecting:</span>{' '}
                <span className="text-amber-400 font-black text-xs">Node [{inspectNode}]</span>
              </div>
            )}
          </div>
        </div>

        {isAlgo ? (
          /* =========================================================================
             EXPANDED GRAPH CANVAS (7 COLUMNS) | COMPACT SOLUTION TABLE (5 COLUMNS)
             ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-stretch">
            
            {/* Left Column: EXPANDED GRAPH NETWORK CANVAS (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xl min-h-95">
              <div className="w-full flex items-center justify-between font-mono text-xs text-slate-300 pb-2 border-b border-slate-900">
                <span className="font-black text-amber-300 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {isPrims ? 'PRIM MST GRAPH' : isKruskal ? 'KRUSKAL MST GRAPH' : isDijkstra ? 'WEIGHTED GRAPH NETWORK' : `7-Node Graph Network (${isBfs ? 'BFS' : 'DFS'})`}
                </span>
                {isPrims ? (
                  acceptedEdge ? (
                    <span className="text-emerald-400 font-mono font-black text-xs animate-pulse">
                      Accepted {acceptedEdge.u}↔{acceptedEdge.v} (w={acceptedEdge.weight})
                    </span>
                  ) : testingEdge ? (
                    <span className="text-amber-300 font-mono font-black text-xs animate-pulse">
                      Testing Min Edge {testingEdge.u}↔{testingEdge.v} (w={testingEdge.weight})
                    </span>
                  ) : (
                    <span className="text-amber-400 font-mono font-bold">Prim's Ready</span>
                  )
                ) : isKruskal ? (
                  acceptedEdge ? (
                    <span className="text-emerald-400 font-mono font-black text-xs animate-pulse">
                      Accepted {acceptedEdge.u}↔{acceptedEdge.v} (w={acceptedEdge.weight})
                    </span>
                  ) : rejectedEdge ? (
                    <span className="text-rose-400 font-mono font-black text-xs animate-pulse">
                      Cycle Skipped {rejectedEdge.u}↔{rejectedEdge.v}
                    </span>
                  ) : testingEdge ? (
                    <span className="text-amber-300 font-mono font-black text-xs animate-pulse">
                      Testing {testingEdge.u}↔{testingEdge.v} (w={testingEdge.weight})
                    </span>
                  ) : (
                    <span className="text-amber-400 font-mono font-bold">Kruskal Ready</span>
                  )
                ) : isDijkstra && relaxingEdge ? (
                  <span className={`font-mono font-black text-xs animate-pulse ${relaxingEdge.updated ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {relaxingEdge.updated ? `Relaxed ${relaxingEdge.u}↔${relaxingEdge.v} (w=${relaxingEdge.weight})` : `Checked ${relaxingEdge.u}↔${relaxingEdge.v}`}
                  </span>
                ) : (
                  <span className="text-cyan-400 font-mono font-bold">Ready</span>
                )}
              </div>

              {/* SVG Graph Canvas - Spacious 520x340 ViewBox */}
              <div className="w-full h-85 relative mt-2 flex items-center justify-center">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 520 340"
                  shapeRendering="geometricPrecision"
                  textRendering="geometricPrecision"
                >
                  
                  {/* Connecting Edges with Weights */}
                  {edges.map((edge, idx) => {
                    const uNode = nodes.find(n => n.id === edge.u);
                    const vNode = nodes.find(n => n.id === edge.v);
                    if (!uNode || !vNode) return null;

                    const edgeKey = `${edge.u}-${edge.v}`;
                    const edgeRevKey = `${edge.v}-${edge.u}`;
                    
                    const isMstEdge = (isKruskal || isPrims) && mstEdges.some(e => (e.u === edge.u && e.v === edge.v) || (e.u === edge.v && e.v === edge.u));
                    const isTestingEdge = testingEdge && ((testingEdge.u === edge.u && testingEdge.v === edge.v) || (testingEdge.u === edge.v && testingEdge.v === edge.u));
                    const isRejectedEdge = isKruskal && (edgeStatuses[edgeKey] === 'REJECTED' || edgeStatuses[edgeRevKey] === 'REJECTED');

                    // Dijkstra specific edge highlights
                    const isRelaxingThisEdge = isDijkstra && relaxingEdge && (
                      (relaxingEdge.u === edge.u && relaxingEdge.v === edge.v) ||
                      (relaxingEdge.u === edge.v && relaxingEdge.v === edge.u)
                    );

                    const isShortestPathEdge = isDijkstra && shortestPath.length > 0 && shortestPath.some((nodeId, i) => {
                      if (i === 0) return false;
                      const prev = shortestPath[i - 1];
                      return (prev === edge.u && nodeId === edge.v) || (prev === edge.v && nodeId === edge.u);
                    });

                    const isInspectingEdge = !isDijkstra && !isKruskal && !isPrims && activeNode !== undefined && (
                      (edge.u === activeNode && inspectingNeighbors.includes(edge.v)) ||
                      (edge.v === activeNode && inspectingNeighbors.includes(edge.u))
                    );

                    const isVisitedEdge = !isDijkstra && !isKruskal && !isPrims && visited.includes(edge.u) && visited.includes(edge.v);

                    // Midpoint for weight text label badge
                    const midX = (uNode.x + vNode.x) / 2;
                    const midY = (uNode.y + vNode.y) / 2;

                    return (
                      <g key={`edge-g-${edge.u}-${edge.v}-${idx}`}>
                        {/* Line */}
                        <line
                          x1={uNode.x}
                          y1={uNode.y}
                          x2={vNode.x}
                          y2={vNode.y}
                          strokeWidth={isMstEdge ? 4.5 : isTestingEdge ? 4.5 : isShortestPathEdge ? 4.5 : isRelaxingThisEdge ? 4 : isInspectingEdge ? 4.5 : 2.5}
                          stroke={
                            isMstEdge
                              ? '#10b981'
                              : isTestingEdge
                              ? '#f59e0b'
                              : isRejectedEdge
                              ? '#ef4444'
                              : isShortestPathEdge
                              ? '#10b981'
                              : isRelaxingThisEdge
                              ? (relaxingEdge?.updated ? '#10b981' : '#f59e0b')
                              : isInspectingEdge
                              ? '#f59e0b'
                              : isVisitedEdge
                              ? (isBfs ? '#06b6d4' : '#a855f7')
                              : '#475569'
                          }
                          className="transition-all duration-300"
                        />

                        {/* Edge Weight Text Label (No Box, Floating Center Above Line) */}
                        {(isDijkstra || isKruskal || isPrims) && edge.weight !== undefined && (
                          <g transform={`translate(${midX}, ${midY})`}>
                            {/* Dark halo outline for 100% contrast over any line */}
                            <text
                              x="0"
                              y="-8"
                              textAnchor="middle"
                              stroke="#050711"
                              strokeWidth="5"
                              strokeLinejoin="round"
                              className="font-mono text-sm font-black select-none pointer-events-none opacity-90"
                            >
                              {edge.weight}
                            </text>
                            <text
                              x="0"
                              y="-8"
                              textAnchor="middle"
                              className={`font-mono text-sm font-black select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                                isMstEdge || isShortestPathEdge
                                  ? 'fill-emerald-300 font-black'
                                  : isTestingEdge || isRelaxingThisEdge
                                  ? 'fill-amber-300 font-black'
                                  : isRejectedEdge
                                  ? 'fill-rose-400 font-black'
                                  : 'fill-amber-400 font-black'
                              }`}
                            >
                              {edge.weight}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Vertex Nodes */}
                  {nodes.map(node => {
                    const id = node.id;
                    const isActive = id === activeNode;
                    const isSettled = isDijkstra ? settledSet.includes(id) : false;
                    const isInspectingNbr = inspectingNeighbors.includes(id);
                    const isInBuffer = isBfs ? queueBuffer.includes(id) : isDfs ? stackBuffer.includes(id) : false;
                    const isVisited = visited.includes(id);

                    // Check if node is part of MST Set for Prim's or Kruskal
                    const isMstNode = (isKruskal || isPrims) && (mstSet.includes(id) || mstEdges.some(e => e.u === id || e.v === id));

                    return (
                      <g key={`graph-node-${id}`} transform={`translate(${node.x}, ${node.y})`}>
                        {/* Circle */}
                        <circle
                          r="26"
                          className={`transition-all duration-200 ${
                            isMstNode
                              ? 'fill-emerald-950 stroke-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.9)]'
                              : isActive
                              ? 'fill-amber-950 stroke-amber-400 shadow-[0_0_30px_rgba(251,191,36,1)] ring-4 ring-amber-400/50'
                              : isSettled
                              ? 'fill-emerald-950 stroke-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.9)]'
                              : isInspectingNbr
                              ? isBfs
                                ? 'fill-cyan-950 stroke-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.9)] animate-pulse'
                                : 'fill-purple-950 stroke-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.9)] animate-pulse'
                              : isInBuffer
                              ? isBfs
                                ? 'fill-cyan-600 stroke-cyan-300'
                                : 'fill-purple-600 stroke-purple-300'
                              : isVisited
                              ? 'fill-emerald-950 stroke-emerald-400'
                              : 'fill-purple-950/80 stroke-purple-500'
                          }`}
                          strokeWidth="3"
                        />
                        {/* Text */}
                        <text
                          y="6"
                          textAnchor="middle"
                          className="fill-white font-mono font-black text-lg select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                        >
                          {id}
                        </text>

                        {/* Distance Badge for Dijkstra */}
                        {isDijkstra && distMap[id] !== undefined && (
                          <g transform="translate(0, 40)">
                            <rect
                              x="-22"
                              y="-10"
                              width="44"
                              height="20"
                              rx="5"
                              className={`transition-all ${
                                distMap[id] === Infinity
                                  ? 'fill-slate-900/90 stroke-slate-700'
                                  : isSettled
                                  ? 'fill-emerald-950 stroke-emerald-400'
                                  : 'fill-amber-950 stroke-amber-400'
                              }`}
                              strokeWidth="1.5"
                            />
                            <text
                              y="4"
                              textAnchor="middle"
                              className={`font-mono text-xs font-black select-none pointer-events-none ${
                                distMap[id] === Infinity ? 'fill-slate-500' : 'fill-amber-300 font-black'
                              }`}
                            >
                              {distMap[id] === Infinity ? '∞' : `d=${distMap[id]}`}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                </svg>
              </div>
            </div>

            {/* Right Column: COMPACT SOLUTION TABLE (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xl">
              
              {isPrims ? (
                /* ================= PRIM'S PRIORITY CUT CANDIDATES TABLE ================= */
                <div className="flex flex-col gap-2.5 font-mono">
                  <div className="flex items-center justify-between text-xs text-slate-300 pb-1 border-b border-slate-800">
                    <span className="font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      PRIM'S CUT CANDIDATES
                    </span>
                    <span className="text-emerald-400 font-black text-xs">MST Wt = {totalMstWeight}</span>
                  </div>

                  {/* Compact Candidate Edges Evaluation List */}
                  <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-300 uppercase tracking-wider">
                          <th className="py-1.5 px-2.5 font-black">Cut Edge</th>
                          <th className="py-1.5 px-2.5 font-black">Wt</th>
                          <th className="py-1.5 px-2.5 font-black text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-bold text-slate-100">
                        {candidateEdges.map((edge, idx) => {
                          const isPickedMin = testingEdge && ((testingEdge.u === edge.u && testingEdge.v === edge.v) || (testingEdge.u === edge.v && testingEdge.v === edge.u));

                          return (
                            <tr
                              key={`prims-edge-${idx}`}
                              className={`transition-colors ${
                                isPickedMin
                                  ? 'bg-amber-950/60 text-amber-200'
                                  : 'text-slate-300 hover:bg-slate-900/50'
                              }`}
                            >
                              <td className="py-1.5 px-2.5 font-mono font-black text-xs">
                                [{edge.u} ↔ {edge.v}]
                              </td>
                              <td className="py-1.5 px-2.5 font-mono text-amber-300 font-black text-xs">
                                {edge.weight}
                              </td>
                              <td className="py-1.5 px-2.5 text-right font-mono text-[10px]">
                                {isPickedMin ? (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600 font-black animate-pulse">
                                    MIN EDGE 🔍
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                    CANDIDATE
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              ) : isKruskal ? (
                /* ================= KRUSKAL SORTED EDGES & DSU TABLE ================= */
                <div className="flex flex-col gap-2.5 font-mono">
                  <div className="flex items-center justify-between text-xs text-slate-300 pb-1 border-b border-slate-800">
                    <span className="font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      SORTED EDGES (DSU)
                    </span>
                    <span className="text-emerald-400 font-black text-xs">MST Wt = {totalMstWeight}</span>
                  </div>

                  <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-300 uppercase tracking-wider">
                          <th className="py-1.5 px-2.5 font-black">Edge</th>
                          <th className="py-1.5 px-2.5 font-black">Wt</th>
                          <th className="py-1.5 px-2.5 font-black text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-bold text-slate-100">
                        {sortedEdges.map((edge, idx) => {
                          const edgeKey = `${edge.u}-${edge.v}`;
                          const status = edgeStatuses[edgeKey] || 'PENDING';

                          return (
                            <tr
                              key={`kruskal-edge-${idx}`}
                              className={`transition-colors ${
                                status === 'ACCEPTED'
                                  ? 'bg-emerald-950/40 text-emerald-200'
                                  : status === 'REJECTED'
                                  ? 'bg-rose-950/30 text-rose-400 line-through opacity-75'
                                  : status === 'TESTING'
                                  ? 'bg-amber-950/50 text-amber-200'
                                  : 'text-slate-400'
                              }`}
                            >
                              <td className="py-1.5 px-2.5 font-mono font-black text-xs">
                                [{edge.u} ↔ {edge.v}]
                              </td>
                              <td className="py-1.5 px-2.5 font-mono text-amber-300 font-black text-xs">
                                {edge.weight}
                              </td>
                              <td className="py-1.5 px-2.5 text-right font-mono text-[10px]">
                                {status === 'ACCEPTED' ? (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-black">
                                    ACCEPTED ✓
                                  </span>
                                ) : status === 'REJECTED' ? (
                                  <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-black">
                                    SKIPPED ❌
                                  </span>
                                ) : status === 'TESTING' ? (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-200 border border-amber-600 font-black animate-pulse">
                                    TESTING 🔍
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                                    PENDING
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              ) : isDijkstra ? (
                /* ================= COMPACT DIJKSTRA DISTANCE TABLE ================= */
                <div className="flex flex-col gap-2.5 font-mono">
                  <div className="flex items-center justify-between text-xs text-slate-300 pb-1 border-b border-slate-800">
                    <span className="font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      DIJKSTRA DISTANCE TABLE
                    </span>
                    <span className="text-slate-400 font-bold text-xs">{settledSet.length} / 6 Settled</span>
                  </div>

                  <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-300 uppercase tracking-wider">
                          <th className="py-1.5 px-2.5 font-black">Node</th>
                          <th className="py-1.5 px-2.5 font-black text-center">Shortest</th>
                          <th className="py-1.5 px-2.5 font-black text-center">Parent</th>
                          <th className="py-1.5 px-2.5 font-black text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-bold text-slate-100">
                        {DIJKSTRA_NODES.map(id => {
                          const isSettled = settledSet.includes(id);
                          const isActive = id === activeNode;
                          const dist = distMap[id];
                          const parent = parentMap[id];

                          return (
                            <tr
                              key={`table-row-${id}`}
                              className={`transition-colors ${
                                isActive
                                  ? 'bg-amber-950/50 text-amber-200'
                                  : isSettled
                                  ? 'bg-emerald-950/30 text-emerald-300'
                                  : 'hover:bg-slate-900/50'
                              }`}
                            >
                              <td className="py-1.5 px-2.5 font-mono font-black text-xs flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isSettled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                                Node [{id}]
                              </td>
                              <td className={`py-1.5 px-2.5 text-center font-mono font-black text-xs ${dist === Infinity ? 'text-slate-600' : 'text-amber-300'}`}>
                                {dist === Infinity ? '∞' : dist}
                              </td>
                              <td className="py-1.5 px-2.5 text-center font-mono text-slate-300 text-xs">
                                {parent !== null ? `Node [${parent}]` : '-'}
                              </td>
                              <td className="py-1.5 px-2.5 text-right font-mono text-[9.5px]">
                                {isSettled ? (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-black">
                                    SETTLED ✓
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                                    UNVISITED
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {relaxingEdge && (
                    <div className={`p-2.5 rounded-xl border font-mono text-[11px] flex flex-col gap-0.5 transition-all ${
                      relaxingEdge.updated
                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                        : 'bg-amber-950/50 border-amber-700 text-amber-200'
                    }`}>
                      <div className="flex items-center justify-between font-black">
                        <span>Edge Relaxation ({relaxingEdge.u} ➔ {relaxingEdge.v}):</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                          Weight = {relaxingEdge.weight}
                        </span>
                      </div>
                      <div className="text-[10.5px]">
                        Formula: <span className="font-black text-amber-300">dist[{relaxingEdge.u}] + w &lt; dist[{relaxingEdge.v}]</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ================= BFS / DFS BUFFERS ================= */
                <>
                  <div className="flex flex-col gap-2 font-mono">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        VISITED ARRAY
                      </span>
                      <span className="text-slate-400 font-bold">{visited.length} / 7 Marked</span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      <div className="inline-flex rounded-none border border-slate-600 bg-slate-950 shadow-xl divide-x divide-slate-700">
                        {GRAPH_7_NODES.map((_, idx) => {
                          const val = visited[idx];
                          return (
                            <div
                              key={`v-box-${idx}`}
                              className={`w-9 h-10 flex items-center justify-center font-mono font-black text-sm ${
                                val !== undefined ? 'bg-cyan-950 text-cyan-300 border-b-2 border-cyan-400' : 'bg-slate-900/60 text-slate-700'
                              }`}
                            >
                              {val !== undefined ? val : ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 font-mono relative pb-6">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        {isBfs ? 'FIFO QUEUE BUFFER' : 'LIFO STACK BUFFER'}
                      </span>
                      <span className="text-slate-400 font-bold">
                        {isBfs ? `Front = ${frontIdx}` : `Top = ${topIdx}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto">
                      <div className="inline-flex rounded-none border border-slate-600 bg-slate-950 shadow-xl divide-x divide-slate-700">
                        {GRAPH_7_NODES.map((_, idx) => {
                          const val = isBfs ? queueBuffer[idx] : stackBuffer[idx];
                          const isPointer = isBfs ? idx === frontIdx : idx === topIdx;

                          return (
                            <div
                              key={`b-box-${idx}`}
                              className={`w-9 h-10 flex items-center justify-center font-mono font-black text-sm transition-all ${
                                isPointer
                                  ? 'bg-purple-950 text-purple-200 border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.9)] ring-2 ring-purple-400/60'
                                  : val !== null
                                  ? 'bg-slate-900 text-purple-300'
                                  : 'bg-slate-900/60 text-slate-700'
                              }`}
                            >
                              {val !== null ? val : ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className="flex flex-col items-center transition-all duration-300 absolute -bottom-5 text-purple-400"
                      style={{ left: `${(isBfs ? frontIdx : topIdx) * 37 + 10}px` }}
                    >
                      <span className="font-black text-sm text-purple-400 animate-bounce">↑</span>
                      <span className="font-mono font-black text-[9.5px] tracking-wider uppercase text-purple-300">
                        {isBfs ? 'FRONT' : 'TOP'}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Traversal / Shortest Path / MST Result */}
              {isKruskal || isPrims ? (
                <div className="pt-2.5 border-t border-slate-800 flex flex-col gap-1.5 font-mono">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-300 uppercase tracking-wider">
                    <span>Minimum Spanning Tree Result:</span>
                    <span className="text-emerald-400 font-black text-xs">Min Weight = {totalMstWeight}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {mstEdges.map((edge, idx) => (
                      <div key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-400 text-emerald-300 text-[11px] font-mono font-black shadow-md flex items-center gap-1">
                        <span>[{edge.u} ↔ {edge.v}]</span>
                        <span className="text-[10px] text-amber-300 font-black">(w={edge.weight})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activePath.length > 0 && (
                <div className="pt-2.5 border-t border-slate-800 flex flex-col gap-1.5 font-mono">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-300 uppercase tracking-wider">
                    <span>{isDijkstra ? 'Dijkstra Shortest Path Result:' : isBfs ? 'BFS Result Path:' : 'DFS Result Path:'}</span>
                    {isDijkstra && totalDist !== undefined && (
                      <span className="text-amber-400 font-black text-xs">Total Dist = {totalDist}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {activePath.map((nodeId, idx) => (
                      <React.Fragment key={idx}>
                        <div className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center font-mono font-black shadow-md ${
                          isDijkstra
                            ? 'bg-emerald-950 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                            : nodeId === activeNode
                            ? 'bg-amber-950 border border-amber-400 text-amber-300'
                            : 'bg-cyan-950 border border-cyan-400 text-cyan-300'
                        }`}>
                          {nodeId}
                        </div>
                        {idx < activePath.length - 1 && <span className="text-slate-500 font-bold text-[11px]">➔</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* GRAPH FUNDAMENTALS SINGLE VIEW */
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden shadow-2xl min-h-85">
            
            <div className="w-full flex items-center justify-between font-mono text-xs text-slate-300 pb-2 border-b border-slate-900">
              <span className="font-black text-emerald-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                1. GRAPH NETWORK MESH (7 VERTICES)
              </span>
              
              <span className="text-amber-300 font-mono font-black animate-pulse">
                Inspecting Node [{inspectNode}] ➔ Neighbors: [{neighbors.join(', ') || 'None'}]
              </span>
            </div>

            <div className="w-full h-85 relative mt-2 flex items-center justify-center">
              <svg
                className="w-full h-full"
                viewBox="0 0 520 340"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
              >
                {edges.map((edge, idx) => {
                  const uNode = nodes.find(n => n.id === edge.u);
                  const vNode = nodes.find(n => n.id === edge.v);
                  if (!uNode || !vNode) return null;

                  const isConnectedToInspect = (edge.u === inspectNode || edge.v === inspectNode);

                  return (
                    <line
                      key={`edge-${edge.u}-${edge.v}-${idx}`}
                      x1={uNode.x}
                      y1={uNode.y}
                      x2={vNode.x}
                      y2={vNode.y}
                      strokeWidth={isConnectedToInspect ? 4 : 2.5}
                      stroke={isConnectedToInspect ? '#f59e0b' : '#475569'}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {nodes.map(node => {
                  const id = node.id;
                  const isInspect = id === inspectNode;
                  const isNeighbor = neighbors.includes(id);

                  return (
                    <g key={`node-${id}`} transform={`translate(${node.x}, ${node.y})`}>
                      <circle
                        r="26"
                        className={`transition-all duration-200 ${
                          isInspect
                            ? 'fill-amber-950 stroke-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.9)]'
                            : isNeighbor
                            ? 'fill-emerald-950 stroke-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                            : 'fill-slate-900 stroke-slate-700'
                        }`}
                        strokeWidth="3"
                      />
                      <text y="6" textAnchor="middle" className="fill-white font-mono font-black text-lg select-none pointer-events-none drop-shadow">
                        {id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

          </div>
        )}

        {/* High-Contrast Sharp Legend Footer */}
        <div className="flex items-center justify-center gap-6 font-mono text-xs text-slate-300 pt-3 border-t border-slate-800/80 w-full">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600" />
            <span>Unvisited Node</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-200" />
            <span>Testing / Active Edge</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-200" />
            <span>Accepted MST / Shortest Edge</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300" />
            <span>Cycle Skipped Edge</span>
          </div>
        </div>

      </div>
    </div>
  );
};
