import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, RotateCcw, Trash2, ArrowLeftRight } from 'lucide-react';

interface GraphNode {
  id: string;
  x: number;
  y: number;
}

interface GraphEdge {
  u: string;
  v: string;
}

const getGraphDataFromStep = (step: any): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  if (!step) return { nodes: [], edges: [] };
  const mem = step.memorySnapshot;
  let nodes: GraphNode[] = [];
  let edges: GraphEdge[] = [];
  if (Array.isArray(mem?.nodes)) nodes = mem.nodes;
  if (Array.isArray(mem?.edges)) edges = mem.edges;

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

export const GraphOperationalPanel: React.FC = () => {
  const { lesson, setCustomSteps, currentStep, goToStep } = useLesson();

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  const [nodeId, setNodeId] = useState('');
  const [edgeU, setEdgeU] = useState('');
  const [edgeV, setEdgeV] = useState('');
  const [startVertex, setStartVertex] = useState('A');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { nodes: n, edges: e } = getGraphDataFromStep(currentStep);
    setNodes(n);
    setEdges(e);
  }, [currentStep]);

  useEffect(() => {
    const defaultNodes = ['A', 'B', 'C', 'D', 'E'];
    const radius = 110;
    const cx = 400;
    const cy = 170;
    const initialNodes = defaultNodes.map((id, index) => {
      const angle = (index * 2 * Math.PI) / defaultNodes.length - Math.PI / 2;
      return {
        id,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      };
    });
    const initialEdges = [
      { u: 'A', v: 'B' },
      { u: 'A', v: 'C' },
      { u: 'B', v: 'D' },
      { u: 'C', v: 'D' },
      { u: 'D', v: 'E' }
    ];

    const initStep: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: 'Graph Mesh workspace initialized with default vertices A, B, C, D, E.',
      explanationHinglish: 'Graph Mesh workspace initialized hua. default vertices A, B, C, D, E set hain.',
      memorySnapshot: { nodes: initialNodes, edges: initialEdges, visitedNodes: [] },
      consoleOutput: '> Graph Initialized.',
      animationEvent: { type: 'NONE' } as any
    };

    setNodes(initialNodes);
    setEdges(initialEdges);
    setCustomSteps([initStep]);
    setTimeout(() => goToStep(1), 30);
  }, [lesson?.id]);

  const dispatch = useCallback((
    newNodes: GraphNode[],
    newEdges: GraphEdge[],
    explanationEn: string,
    explanationHi: string,
    consoleOut: string,
    event: any
  ) => {
    setError(null);
    const step: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: explanationEn,
      explanationHinglish: explanationHi,
      memorySnapshot: { nodes: newNodes, edges: newEdges, visitedNodes: [] },
      consoleOutput: `> ${consoleOut}`,
      animationEvent: event
    };
    setNodes(newNodes);
    setEdges(newEdges);
    setCustomSteps([step]);
    setTimeout(() => goToStep(1), 30);
  }, [setCustomSteps, goToStep]);

  /* ── Vertex / Edge Operations ── */

  const handleAddVertex = () => {
    const id = nodeId.trim().toUpperCase();
    if (!id) return setError('Enter a vertex ID');
    if (id.length > 3) return setError('Vertex ID too long (Max 3 chars)');
    if (nodes.some(n => n.id === id)) return setError(`Vertex ${id} already exists`);

    // Circular layout alignment map
    const nextNodes = [...nodes, { id, x: 400, y: 170 }];
    const radius = 110;
    const cx = 400;
    const cy = 170;
    const repositionedNodes = nextNodes.map((node, index) => {
      const angle = (index * 2 * Math.PI) / nextNodes.length - Math.PI / 2;
      return {
        id: node.id,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      };
    });

    dispatch(repositionedNodes, edges,
      `ADD VERTEX(${id}): New vertex added. Realigned graph circular nodes map.`,
      `ADD VERTEX(${id}): Naya vertex add hua. Nodes ko circular alignment di.`,
      `Added Vertex: ${id}`,
      { type: 'GRAPH_ADD_VERTEX', id }
    );
    setNodeId('');
  };

  const handleRemoveVertex = () => {
    const id = nodeId.trim().toUpperCase();
    if (!id) return setError('Enter a vertex ID to delete');
    if (!nodes.some(n => n.id === id)) return setError(`Vertex ${id} not found`);

    const nextNodes = nodes.filter(n => n.id !== id);
    const nextEdges = edges.filter(e => e.u !== id && e.v !== id);

    // Realign remaining nodes
    const radius = 110;
    const cx = 400;
    const cy = 170;
    const repositionedNodes = nextNodes.map((node, index) => {
      const angle = (index * 2 * Math.PI) / nextNodes.length - Math.PI / 2;
      return {
        id: node.id,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      };
    });

    dispatch(repositionedNodes, nextEdges,
      `REMOVE VERTEX(${id}): Removed vertex and unlinked all adjacent edges.`,
      `REMOVE VERTEX(${id}): Vertex delete kiya aur edges links clear kiye.`,
      `Removed Vertex: ${id}`,
      { type: 'GRAPH_REMOVE_VERTEX', id }
    );
    setNodeId('');
  };

  const handleAddEdge = () => {
    const u = edgeU.trim().toUpperCase();
    const v = edgeV.trim().toUpperCase();
    if (!u || !v) return setError('Enter both vertex IDs to link');
    if (u === v) return setError('Cannot create self loop edge');
    if (!nodes.some(n => n.id === u) || !nodes.some(n => n.id === v)) return setError('Vertex not found in graph');

    const edgeExists = edges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
    if (edgeExists) return setError(`Edge ${u}-${v} already exists`);

    const nextEdges = [...edges, { u, v }];
    dispatch(nodes, nextEdges,
      `ADD EDGE(${u} - ${v}): Bidirectional edge created between ${u} and ${v}.`,
      `ADD EDGE(${u} - ${v}): Vertices ke beech edge created link map.`,
      `Added Edge: ${u} - ${v}`,
      { type: 'GRAPH_ADD_EDGE', u, v }
    );
    setEdgeU('');
    setEdgeV('');
  };

  const handleRemoveEdge = () => {
    const u = edgeU.trim().toUpperCase();
    const v = edgeV.trim().toUpperCase();
    if (!u || !v) return setError('Enter both vertex IDs to unlink');

    const nextEdges = edges.filter(e => !((e.u === u && e.v === v) || (e.u === v && e.v === u)));
    dispatch(nodes, nextEdges,
      `REMOVE EDGE(${u} - ${v}): Removed connection between ${u} and ${v}.`,
      `REMOVE EDGE(${u} - ${v}): Connections boundary links remove kiye.`,
      `Removed Edge: ${u} - ${v}`,
      { type: 'GRAPH_REMOVE_EDGE', u, v }
    );
    setEdgeU('');
    setEdgeV('');
  };

  /* ── Traversals Algorithms (BFS & DFS) ── */

  const handleBFS = () => {
    const start = startVertex.trim().toUpperCase();
    if (!nodes.some(n => n.id === start)) return setError(`Start vertex ${start} not found`);

    const steps: ExecutionStep[] = [];
    const visited: string[] = [];
    const queue: string[] = [start];

    // Build Adjacency List representation
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.u].push(e.v);
      adj[e.v].push(e.u);
    });
    // Sort adjacency nodes alphabetically for deterministic traversal
    Object.keys(adj).forEach(k => adj[k].sort());

    visited.push(start);
    steps.push({
      step: 1, lineNum: 1,
      explanationEnglish: `BFS Initialized: Start at vertex ${start}. Queue: [${queue.join(', ')}]`,
      explanationHinglish: `BFS Start: vertex ${start} se shuru. Queue: [${queue.join(', ')}]`,
      memorySnapshot: { nodes, edges, activeNodeId: start, visitedNodes: [...visited] },
      consoleOutput: `> BFS Starting Node: ${start}`,
      animationEvent: { type: 'HIGHLIGHT_NODE', activeNodeId: start, visitedNodes: [...visited] } as any
    });

    while (queue.length > 0) {
      const curr = queue.shift()!;
      
      const neighbors = adj[curr] || [];
      neighbors.forEach(neighbor => {
        if (!visited.includes(neighbor)) {
          visited.push(neighbor);
          queue.push(neighbor);
          
          steps.push({
            step: steps.length + 1, lineNum: steps.length + 1,
            explanationEnglish: `BFS: Discovered neighbor node ${neighbor} from node ${curr}. Queue: [${queue.join(', ')}]`,
            explanationHinglish: `BFS: Node ${curr} se neighbor node ${neighbor} mila. Queue: [${queue.join(', ')}]`,
            memorySnapshot: { nodes, edges, activeNodeId: neighbor, visitedNodes: [...visited] },
            consoleOutput: `> Visited: ${neighbor} (discovered from ${curr})`,
            animationEvent: { type: 'HIGHLIGHT_NODE', activeNodeId: neighbor, visitedNodes: [...visited] } as any
          });
        }
      });
    }

    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleDFS = () => {
    const start = startVertex.trim().toUpperCase();
    if (!nodes.some(n => n.id === start)) return setError(`Start vertex ${start} not found`);

    const steps: ExecutionStep[] = [];
    const visited: string[] = [];

    // Build Adjacency List representation
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.u].push(e.v);
      adj[e.v].push(e.u);
    });
    Object.keys(adj).forEach(k => adj[k].sort());

    const dfsHelper = (curr: string) => {
      visited.push(curr);
      steps.push({
        step: steps.length + 1, lineNum: steps.length + 1,
        explanationEnglish: `DFS Visited Node: ${curr}. DFS stack depth path growing.`,
        explanationHinglish: `DFS Visited: Node ${curr} traverse kiya.`,
        memorySnapshot: { nodes, edges, activeNodeId: curr, visitedNodes: [...visited] },
        consoleOutput: `> DFS Visited Node: ${curr}`,
        animationEvent: { type: 'HIGHLIGHT_NODE', activeNodeId: curr, visitedNodes: [...visited] } as any
      });

      const neighbors = adj[curr] || [];
      for (const neighbor of neighbors) {
        if (!visited.includes(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    };

    dfsHelper(start);

    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleClear = () => {
    dispatch([], [],
      'Graph cleared.',
      'Graph khali kiya.',
      'Cleared Graph Mesh',
      { type: 'GRAPH_CLEAR' }
    );
  };

  const handleReset = () => {
    const defaultNodes = ['A', 'B', 'C', 'D', 'E'];
    const radius = 110;
    const cx = 400;
    const cy = 170;
    const initialNodes = defaultNodes.map((id, index) => {
      const angle = (index * 2 * Math.PI) / defaultNodes.length - Math.PI / 2;
      return {
        id,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      };
    });
    const initialEdges = [
      { u: 'A', v: 'B' },
      { u: 'A', v: 'C' },
      { u: 'B', v: 'D' },
      { u: 'C', v: 'D' },
      { u: 'D', v: 'E' }
    ];

    dispatch(initialNodes, initialEdges,
      'Graph reset to default configuration.',
      'Graph ko default configuration me reset kiya.',
      'Reset Graph Workspace',
      { type: 'NONE' }
    );
  };

  const isBasics = lesson?.topic === 'graph_basics';
  const isTraversals = lesson?.topic === 'graph_traversals';
  const isEmpty = nodes.length === 0;

  return (
    <div className="h-full flex flex-col bg-[#0a0c16] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0d0f1f] border-b border-slate-800/60 flex items-center justify-between shrink-0 font-mono text-xs">
        <span className="font-bold text-slate-300">
          {isBasics ? 'GRAPH FUNDAMENTALS' : 'GRAPH BFS & DFS'}
        </span>
        <button onClick={handleReset} className="text-slate-500 hover:text-slate-300 p-1" title="Reset default configuration">
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center justify-between">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-400">✕</button>
          </div>
        )}

        {/* Add/Remove Vertex (Basics only) */}
        {isBasics && (
          <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Manage Vertices</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ID (e.g. A)..."
                value={nodeId}
                onChange={e => setNodeId(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
              />
              <button
                onClick={handleAddVertex}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
              <button
                onClick={handleRemoveVertex}
                disabled={isEmpty}
                className="px-3 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 disabled:opacity-40 text-rose-300 font-bold text-xs font-mono"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Add/Remove Edge (Basics only) */}
        {isBasics && (
          <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Manage Edges (Connections)</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="From..."
                value={edgeU}
                onChange={e => setEdgeU(e.target.value)}
                className="w-1/4 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
              />
              <div className="flex items-center text-slate-600">
                <ArrowLeftRight size={13} />
              </div>
              <input
                type="text"
                placeholder="To..."
                value={edgeV}
                onChange={e => setEdgeV(e.target.value)}
                className="w-1/4 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
              />
              <button
                onClick={handleAddEdge}
                disabled={isEmpty}
                className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs font-mono"
              >
                Link
              </button>
              <button
                onClick={handleRemoveEdge}
                disabled={isEmpty}
                className="px-3 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 disabled:opacity-40 text-rose-300 font-bold text-xs font-mono"
              >
                Unlink
              </button>
            </div>
          </div>
        )}

        {/* Traversals Algorithms (Traversals only) */}
        {isTraversals && (
          <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Graph Traversals</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Start node (e.g. A)..."
                value={startVertex}
                onChange={e => setStartVertex(e.target.value)}
                className="w-1/3 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleBFS}
                disabled={isEmpty}
                className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs font-mono"
              >
                BFS Path
              </button>
              <button
                onClick={handleDFS}
                disabled={isEmpty}
                className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs font-mono"
              >
                DFS Path
              </button>
            </div>
          </div>
        )}

        {/* Clear Graph (Basics only) */}
        {isBasics && (
          <button
            onClick={handleClear}
            disabled={isEmpty}
            className="w-full py-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 disabled:opacity-30 text-red-400 font-mono text-[11px] flex items-center justify-center gap-1"
          >
            <Trash2 size={12} /> Clear Graph
          </button>
        )}
      </div>
    </div>
  );
};
