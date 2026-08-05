import React from 'react';
import { useLesson } from '../../../../lessons/LessonContext';

interface GraphNode {
  id: string;
  x: number;
  y: number;
}

interface GraphEdge {
  u: string;
  v: string;
}

// Convert serialized graph representation from step memory snapshot
const getGraphDataFromStep = (step: any): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  if (!step) return { nodes: [], edges: [] };
  const mem = step.memorySnapshot;
  
  let nodes: GraphNode[] = [];
  let edges: GraphEdge[] = [];

  if (Array.isArray(mem?.nodes)) {
    nodes = mem.nodes;
  }
  if (Array.isArray(mem?.edges)) {
    edges = mem.edges;
  }

  // Fallback layout mapping if initial setup is loaded
  if (nodes.length === 0) {
    const defaultNodes = ['A', 'B', 'C', 'D', 'E'];
    const radius = 110;
    const cx = 400;
    const cy = 170;
    nodes = defaultNodes.map((id, index) => {
      const angle = (index * 2 * Math.PI) / defaultNodes.length - Math.PI / 2;
      return {
        id,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      };
    });
    // Default connecting edges
    edges = [
      { u: 'A', v: 'B' },
      { u: 'A', v: 'C' },
      { u: 'B', v: 'D' },
      { u: 'C', v: 'D' },
      { u: 'D', v: 'E' }
    ];
  }

  return { nodes, edges };
};

export const GraphVisualStage: React.FC = () => {
  const { lesson, currentStep, zoom } = useLesson();

  const { nodes, edges } = getGraphDataFromStep(currentStep);
  const ev = currentStep?.animationEvent as any;
  const activeNodeId: string | undefined = ev?.activeNodeId ?? currentStep?.memorySnapshot?.activeNodeId;
  const visitedNodes: string[] = ev?.visitedNodes ?? currentStep?.memorySnapshot?.visitedNodes ?? [];

  const isEmpty = nodes.length === 0;

  return (
    <div className="flex-1 w-full h-full bg-[#060814] flex flex-col items-center justify-start overflow-auto relative py-8 px-4">
      <div
        className="flex flex-col items-center gap-4 my-auto transition-transform duration-200 ease-out origin-top w-full"
        style={{ transform: `scale(${zoom})`, maxWidth: '800px' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-emerald-400/90">
            {lesson?.topic === 'graph_basics'
              ? 'Graph Fundamentals — Vertices & Edges'
              : lesson?.topic === 'graph_bfs'
              ? 'Graph Breadth-First Search (BFS)'
              : 'Graph Depth-First Search (DFS)'}
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
        </div>

        {/* Graph Mesh area */}
        <div
          className="relative border border-slate-800/40 bg-slate-950/20 rounded-2xl overflow-hidden py-4"
          style={{ width: '800px', height: '340px' }}
        >
          {isEmpty ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-700 text-xs font-mono">
              [EMPTY GRAPH - ADD VERTICES TO CONSTRUCT CONNECTION MESH]
            </div>
          ) : (
            <svg className="w-full h-full pointer-events-none">
              {/* Render edges */}
              {edges.map((edge, idx) => {
                const uNode = nodes.find(n => n.id === edge.u);
                const vNode = nodes.find(n => n.id === edge.v);
                if (!uNode || !vNode) return null;

                const isPathActive = 
                  (activeNodeId === edge.u && visitedNodes.includes(edge.v)) ||
                  (activeNodeId === edge.v && visitedNodes.includes(edge.u)) ||
                  (visitedNodes.includes(edge.u) && visitedNodes.includes(edge.v));

                return (
                  <line
                    key={idx}
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke={isPathActive ? '#10b981' : '#334155'}
                    strokeWidth={isPathActive ? '3' : '2'}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Render Vertex Nodes */}
              {nodes.map((node, idx) => {
                const isActive = activeNodeId !== undefined && node.id === activeNodeId;
                const isVisited = visitedNodes.includes(node.id);
                return (
                  <g key={idx}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'fill-emerald-950/80 stroke-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                          : isVisited
                          ? 'fill-emerald-900/50 stroke-emerald-600'
                          : 'fill-slate-900 stroke-slate-700'
                      }`}
                      strokeWidth="2.5"
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      className="fill-slate-200 text-xs font-mono font-black select-none pointer-events-none"
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800/60 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isEmpty ? 'bg-slate-500' : 'bg-emerald-500'}`} />
            <span className="text-slate-500">Vertices: <span className="text-slate-300 font-bold">{nodes.length}</span></span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">Edges: <span className="text-slate-300 font-bold">{edges.length}</span></span>
        </div>
      </div>
    </div>
  );
};
