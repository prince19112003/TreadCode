import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { Eye, PlayCircle } from 'lucide-react';

const GRAPH_7_NODES = ['0', '1', '2', '3', '4', '5', '6'];
const DIJKSTRA_NODES = ['0', '1', '2', '3', '4', '5'];

// Coordinates layout for 7 unweighted nodes (520x340 Canvas)
const GRAPH_NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  '0': { x: 80, y: 70 },
  '3': { x: 300, y: 70 },
  '6': { x: 440, y: 150 },
  '2': { x: 220, y: 170 },
  '1': { x: 80, y: 270 },
  '4': { x: 270, y: 280 },
  '5': { x: 400, y: 250 },
};

// Coordinates layout for 6-node Weighted Graph (Spacious 520x340 Canvas)
const DIJKSTRA_NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  '0': { x: 75, y: 170 },
  '1': { x: 200, y: 65 },
  '2': { x: 200, y: 275 },
  '3': { x: 345, y: 65 },
  '4': { x: 345, y: 275 },
  '5': { x: 465, y: 170 },
};

const GRAPH_7_EDGES = [
  { u: '0', v: '1' },
  { u: '0', v: '2' },
  { u: '0', v: '3' },
  { u: '1', v: '2' },
  { u: '1', v: '4' },
  { u: '2', v: '4' },
  { u: '2', v: '5' },
  { u: '3', v: '6' },
  { u: '5', v: '6' },
];

// Weighted Edges for Dijkstra, Kruskal & Prim's Graphs
const DIJKSTRA_EDGES = [
  { u: '0', v: '1', weight: 4 },
  { u: '0', v: '2', weight: 2 },
  { u: '1', v: '2', weight: 1 },
  { u: '1', v: '3', weight: 5 },
  { u: '2', v: '3', weight: 8 },
  { u: '2', v: '4', weight: 10 },
  { u: '3', v: '4', weight: 2 },
  { u: '3', v: '5', weight: 6 },
  { u: '4', v: '5', weight: 3 },
];

export const GraphOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);

  const isBfs = lesson?.topic === 'graph_bfs';
  const isDfs = lesson?.topic === 'graph_dfs';
  const isDijkstra = lesson?.topic === 'graph_dijkstra';
  const isKruskal = lesson?.topic === 'graph_kruskal';
  const isPrims = lesson?.topic === 'graph_prims';
  const isAStar = lesson?.topic === 'graph_astar';

  const [selectedInspectNode, setSelectedInspectNode] = useState<string>('0');
  const [startNode, setStartNode] = useState<string>('0');
  const [targetNode, setTargetNode] = useState<string>('5');
  const [edgesList] = useState(GRAPH_7_EDGES);

  // Dispatch Fundamentals Graph Steps
  const updateGraphState = useCallback((
    edges: { u: string; v: string; weight?: number }[],
    inspectNode: string,
    actionMsg: string,
    activeTab: 'matrix' | 'list' | 'neighbors' | 'weights' = 'neighbors'
  ) => {
    const activeEdges = (edges && edges.length > 0) ? edges : DIJKSTRA_EDGES;
    const neighbors = activeEdges
      .filter(e => e.u === inspectNode || e.v === inspectNode)
      .map(e => (e.u === inspectNode ? e.v : e.u));

    const step: ExecutionStep = {
      step: 1,
      lineNum: 1,
      explanationEnglish: `Graph Fundamentals: Inspecting Node [${inspectNode}]. Connected Neighbors: [${neighbors.length > 0 ? neighbors.join(', ') : 'None'}]. ${actionMsg}`,
      explanationHinglish: `Graph Fundamentals: Node [${inspectNode}] inspect kiya. Connected Neighbors: [${neighbors.length > 0 ? neighbors.join(', ') : 'Koi nahi'}]. ${actionMsg}`,
      memorySnapshot: {
        inspectNode,
        neighbors,
        inspectingNeighbors: neighbors,
        degree: neighbors.length,
        activeTab,
        concept: activeTab === 'matrix' ? 'ADJACENCY_MATRIX' : activeTab === 'list' ? 'ADJACENCY_LIST' : activeTab === 'weights' ? 'EDGE_WEIGHTS' : 'NEIGHBORS',
      },
      consoleOutput: `> Node [${inspectNode}] Degree = ${neighbors.length} (Neighbors: ${neighbors.join(', ') || 'None'})`,
      animationEvent: { type: 'NONE' } as any,
    };

    setSelectedInspectNode(inspectNode);
    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 20);
  }, [setCustomSteps, goToStep, setIsPlaying]);

  // Generate BFS Steps
  const handleRunBfs = useCallback((startV: string) => {
    const adjMap: Record<string, string[]> = {};
    GRAPH_7_NODES.forEach(n => { adjMap[n] = []; });
    GRAPH_7_EDGES.forEach(e => {
      adjMap[e.u].push(e.v);
      adjMap[e.v].push(e.u);
    });
    GRAPH_7_NODES.forEach(n => adjMap[n].sort((a, b) => parseInt(a) - parseInt(b)));

    const steps: ExecutionStep[] = [];
    const queueBuffer: (string | null)[] = Array(7).fill(null);
    let frontIdx = 0;
    let rearIdx = 0;

    queueBuffer[rearIdx++] = startV;
    const visitedList: string[] = [startV];
    const bfsOrder: string[] = [];

    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `BFS Step 1: Start node [${startV}] added to Visited array & Enqueued into Queue at position [0].`,
      explanationHinglish: `BFS Step 1: Start node [${startV}] ko Visited list me dala aur Queue me Enqueue kiya.`,
      memorySnapshot: {
        nodes: GRAPH_7_NODES.map(id => ({ id, x: GRAPH_NODE_POSITIONS[id].x, y: GRAPH_NODE_POSITIONS[id].y })),
        edges: GRAPH_7_EDGES,
        queue: [...queueBuffer],
        frontIdx,
        rearIdx: rearIdx - 1,
        visited: [...visitedList],
        activeNode: undefined,
        inspectingNeighbors: [],
        bfsOrder: [...bfsOrder],
        isBfs: true,
      },
      consoleOutput: `> BFS Start: Enqueued Node [${startV}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    while (frontIdx < rearIdx) {
      const curr = queueBuffer[frontIdx]!;
      bfsOrder.push(curr);

      const allNbrs = adjMap[curr] || [];
      const newlyAdded: string[] = [];

      allNbrs.forEach(nbr => {
        if (!visitedList.includes(nbr)) {
          newlyAdded.push(nbr);
        }
      });

      steps.push({
        step: stepCount++,
        lineNum: 2,
        explanationEnglish: `BFS Dequeue: Processing Node [${curr}]. Inspecting connected edges to neighbors ➔ [${allNbrs.join(', ')}]. Unvisited to add: [${newlyAdded.join(', ') || 'None'}].`,
        explanationHinglish: `BFS Dequeue: Node [${curr}] process ho raha hai. Connected edges/neighbors [${allNbrs.join(', ')}] highlight hue. Unvisited: [${newlyAdded.join(', ') || 'Koi nahi'}].`,
        memorySnapshot: {
          nodes: GRAPH_7_NODES.map(id => ({ id, x: GRAPH_NODE_POSITIONS[id].x, y: GRAPH_NODE_POSITIONS[id].y })),
          edges: GRAPH_7_EDGES,
          queue: [...queueBuffer],
          frontIdx,
          rearIdx: rearIdx - 1,
          visited: [...visitedList],
          activeNode: curr,
          inspectingNeighbors: allNbrs,
          bfsOrder: [...bfsOrder],
          isBfs: true,
        },
        consoleOutput: `> Dequeued: Node [${curr}]. Inspecting neighbors: [${allNbrs.join(', ')}]`,
        animationEvent: { type: 'HIGHLIGHT_NODE', activeNodeId: curr } as any,
      });

      if (newlyAdded.length > 0) {
        newlyAdded.forEach(nbr => {
          visitedList.push(nbr);
          if (rearIdx < 7) {
            queueBuffer[rearIdx++] = nbr;
          }
        });

        steps.push({
          step: stepCount++,
          lineNum: 3,
          explanationEnglish: `BFS Enqueue: Added unvisited neighbors [${newlyAdded.join(', ')}] to Visited array & Enqueued into Queue.`,
          explanationHinglish: `BFS Enqueue: Unvisited neighbors [${newlyAdded.join(', ')}] Visited aur Queue memory blocks me store ho gaye.`,
          memorySnapshot: {
            nodes: GRAPH_7_NODES.map(id => ({ id, x: GRAPH_NODE_POSITIONS[id].x, y: GRAPH_NODE_POSITIONS[id].y })),
            edges: GRAPH_7_EDGES,
            queue: [...queueBuffer],
            frontIdx,
            rearIdx: rearIdx - 1,
            visited: [...visitedList],
            activeNode: curr,
            inspectingNeighbors: [],
            bfsOrder: [...bfsOrder],
            isBfs: true,
          },
          consoleOutput: `> Enqueued to Queue & Visited: [${newlyAdded.join(', ')}]`,
          animationEvent: { type: 'NONE' } as any,
        });
      }

      frontIdx++;
    }

    steps.push({
      step: stepCount,
      lineNum: 4,
      explanationEnglish: `BFS Complete! All 7 nodes visited in Level-Order: [${bfsOrder.join(' ➔ ')}]`,
      explanationHinglish: `BFS Traversal Complete! Sabhi 7 nodes visited: [${bfsOrder.join(' ➔ ')}]`,
      memorySnapshot: {
        nodes: GRAPH_7_NODES.map(id => ({ id, x: GRAPH_NODE_POSITIONS[id].x, y: GRAPH_NODE_POSITIONS[id].y })),
        edges: GRAPH_7_EDGES,
        queue: [...queueBuffer],
        frontIdx: Math.min(frontIdx, 6),
        rearIdx: rearIdx - 1,
        visited: [...visitedList],
        activeNode: undefined,
        inspectingNeighbors: [],
        bfsOrder: [...bfsOrder],
        isBfs: true,
        isComplete: true,
      },
      consoleOutput: `> BFS Complete Path: ${bfsOrder.join(' -> ')}`,
      animationEvent: { type: 'NONE' } as any,
    });

    setCustomSteps(steps);
    setIsPlaying(true);
    setTimeout(() => goToStep(0), 20);
  }, [setCustomSteps, goToStep, setIsPlaying]);

  // Generate DFS Steps
  const handleRunDfs = useCallback((startV: string) => {
    const adjMap: Record<string, string[]> = {};
    GRAPH_7_NODES.forEach(n => { adjMap[n] = []; });
    GRAPH_7_EDGES.forEach(e => {
      adjMap[e.u].push(e.v);
      adjMap[e.v].push(e.u);
    });
    GRAPH_7_NODES.forEach(n => adjMap[n].sort((a, b) => parseInt(b) - parseInt(a)));

    const steps: ExecutionStep[] = [];
    const stackBuffer: (string | null)[] = Array(7).fill(null);
    let topIdx = -1;

    topIdx++;
    stackBuffer[topIdx] = startV;
    const visitedList: string[] = [startV];
    const dfsOrder: string[] = [];

    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `DFS Step 1: Start node [${startV}] added to Visited array & Pushed onto Top of Stack at index [0].`,
      explanationHinglish: `DFS Step 1: Start node [${startV}] Visited list me store hua aur Stack me Push kiya.`,
      memorySnapshot: {
        nodes: GRAPH_7_NODES.map(id => ({ id, x: GRAPH_NODE_POSITIONS[id].x, y: GRAPH_NODE_POSITIONS[id].y })),
        edges: GRAPH_7_EDGES,
        stack: [...stackBuffer],
        topIdx,
        visited: [...visitedList],
        activeNode: undefined,
        inspectingNeighbors: [],
        dfsOrder: [...dfsOrder],
        isDfs: true,
      },
      consoleOutput: `> DFS Start: Pushed Node [${startV}] onto Stack`,
      animationEvent: { type: 'NONE' } as any,
    });

    while (topIdx >= 0) {
      const curr = stackBuffer[topIdx]!;
      stackBuffer[topIdx] = null;
      topIdx--;

      dfsOrder.push(curr);

      const allNbrs = adjMap[curr] || [];
      const newlyAdded: string[] = [];

      allNbrs.forEach(nbr => {
        if (!visitedList.includes(nbr)) {
          newlyAdded.push(nbr);
        }
      });

      steps.push({
        step: stepCount++,
        lineNum: 2,
        explanationEnglish: `DFS Pop: Popped Top Node [${curr}] from Stack. Inspecting connected edges to neighbors ➔ [${allNbrs.join(', ')}]. Unvisited to push: [${newlyAdded.join(', ') || 'None'}].`,
        explanationHinglish: `DFS Pop: Stack se Top Node [${curr}] pop kiya. Connected edges/neighbors [${allNbrs.join(', ')}] inspect kiye. Unvisited: [${newlyAdded.join(', ') || 'Koi nahi'}].`,
        memorySnapshot: {
          nodes: GRAPH_7_NODES.map(id => ({ id, x: GRAPH_NODE_POSITIONS[id].x, y: GRAPH_NODE_POSITIONS[id].y })),
          edges: GRAPH_7_EDGES,
          stack: [...stackBuffer],
          topIdx: Math.max(0, topIdx),
          visited: [...visitedList],
          activeNode: curr,
          inspectingNeighbors: allNbrs,
          dfsOrder: [...dfsOrder],
          isDfs: true,
        },
        consoleOutput: `> Popped: Node [${curr}]. Inspecting neighbors: [${allNbrs.join(', ')}]`,
        animationEvent: { type: 'HIGHLIGHT_NODE', activeNodeId: curr } as any,
      });

      if (newlyAdded.length > 0) {
        newlyAdded.forEach(nbr => {
          visitedList.push(nbr);
          topIdx++;
          if (topIdx < 7) {
            stackBuffer[topIdx] = nbr;
          }
        });

        steps.push({
          step: stepCount++,
          lineNum: 3,
          explanationEnglish: `DFS Push: Added unvisited neighbors [${newlyAdded.join(', ')}] to Visited array & Pushed onto Stack Top [${topIdx}].`,
          explanationHinglish: `DFS Push: Unvisited neighbors [${newlyAdded.join(', ')}] Stack ke Top par push kar diye gaye.`,
          memorySnapshot: {
            nodes: GRAPH_7_NODES.map(id => ({ id, x: GRAPH_NODE_POSITIONS[id].x, y: GRAPH_NODE_POSITIONS[id].y })),
            edges: GRAPH_7_EDGES,
            stack: [...stackBuffer],
            topIdx,
            visited: [...visitedList],
            activeNode: curr,
            inspectingNeighbors: [],
            dfsOrder: [...dfsOrder],
            isDfs: true,
          },
          consoleOutput: `> Pushed to Stack & Visited: [${newlyAdded.join(', ')}]`,
          animationEvent: { type: 'NONE' } as any,
        });
      }
    }

    steps.push({
      step: stepCount,
      lineNum: 4,
      explanationEnglish: `DFS Traversal Complete! Stack is empty. Depth-First Path: [${dfsOrder.join(' ➔ ')}]`,
      explanationHinglish: `DFS Traversal Complete! Stack khali ho gayi. Depth-First Path: [${dfsOrder.join(' ➔ ')}]`,
      memorySnapshot: {
        nodes: GRAPH_7_NODES.map(id => ({ id, x: GRAPH_NODE_POSITIONS[id].x, y: GRAPH_NODE_POSITIONS[id].y })),
        edges: GRAPH_7_EDGES,
        stack: [...stackBuffer],
        topIdx: 0,
        visited: [...visitedList],
        activeNode: undefined,
        inspectingNeighbors: [],
        dfsOrder: [...dfsOrder],
        isDfs: true,
        isComplete: true,
      },
      consoleOutput: `> DFS Complete Path: ${dfsOrder.join(' -> ')}`,
      animationEvent: { type: 'NONE' } as any,
    });

    setCustomSteps(steps);
    setIsPlaying(true);
    setTimeout(() => goToStep(0), 20);
  }, [setCustomSteps, goToStep, setIsPlaying]);

  // Generate Dijkstra's Algorithm Steps
  const handleRunDijkstra = useCallback((startV: string, destV: string) => {
    const distMap: Record<string, number> = {};
    const parentMap: Record<string, string | null> = {};
    const settledSet: string[] = [];

    DIJKSTRA_NODES.forEach(n => {
      distMap[n] = Infinity;
      parentMap[n] = null;
    });
    distMap[startV] = 0;

    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `Dijkstra Initialization: Set distance of Start Node [${startV}] = 0, and all other nodes to Infinity (∞).`,
      explanationHinglish: `Dijkstra Start: Node [${startV}] ka distance 0 set hua, baki sabhi nodes ka distance Infinity (∞) initialize hua.`,
      memorySnapshot: {
        nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
        edges: DIJKSTRA_EDGES,
        distMap: { ...distMap },
        parentMap: { ...parentMap },
        settledSet: [...settledSet],
        activeNode: startV,
        relaxingEdge: undefined,
        isDijkstra: true,
      },
      consoleOutput: `> Dijkstra Init: dist[${startV}] = 0, all others = ∞`,
      animationEvent: { type: 'NONE' } as any,
    });

    const unvisited = [...DIJKSTRA_NODES];

    while (unvisited.length > 0) {
      unvisited.sort((a, b) => distMap[a] - distMap[b]);
      const u = unvisited.shift()!;

      if (distMap[u] === Infinity) break;

      settledSet.push(u);

      steps.push({
        step: stepCount++,
        lineNum: 2,
        explanationEnglish: `Select Min Node: Node [${u}] has smallest distance = ${distMap[u]}. Settling Node [${u}].`,
        explanationHinglish: `Min Node Picked: Node [${u}] ka distance minimum (${distMap[u]}) hai. Node [${u}] ko Settled mark kiya.`,
        memorySnapshot: {
          nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
          edges: DIJKSTRA_EDGES,
          distMap: { ...distMap },
          parentMap: { ...parentMap },
          settledSet: [...settledSet],
          activeNode: u,
          relaxingEdge: undefined,
          isDijkstra: true,
        },
        consoleOutput: `> Settled Node [${u}] with dist = ${distMap[u]}`,
        animationEvent: { type: 'HIGHLIGHT_NODE', activeNodeId: u } as any,
      });

      const outgoing = DIJKSTRA_EDGES.filter(e => e.u === u || e.v === u);

      for (const edge of outgoing) {
        const v = edge.u === u ? edge.v : edge.u;
        if (settledSet.includes(v)) continue;

        const weight = edge.weight;
        const newDist = distMap[u] + weight;
        const oldDist = distMap[v];

        if (newDist < oldDist) {
          distMap[v] = newDist;
          parentMap[v] = u;

          steps.push({
            step: stepCount++,
            lineNum: 3,
            explanationEnglish: `Edge Relaxation [${u} ➔ ${v}]: dist[${u}] (${distMap[u] - weight}) + weight (${weight}) = ${newDist} < dist[${v}] (${oldDist === Infinity ? '∞' : oldDist}). Updated dist[${v}] = ${newDist}!`,
            explanationHinglish: `Edge Relaxed [${u} ➔ ${v}]: ${distMap[u] - weight} + ${weight} = ${newDist} < ${oldDist === Infinity ? '∞' : oldDist}. Node [${v}] ka naya shortest distance = ${newDist}!`,
            memorySnapshot: {
              nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
              edges: DIJKSTRA_EDGES,
              distMap: { ...distMap },
              parentMap: { ...parentMap },
              settledSet: [...settledSet],
              activeNode: u,
              relaxingEdge: { u, v, weight, updated: true },
              isDijkstra: true,
            },
            consoleOutput: `> Relaxed (${u}->${v}): dist[${v}] updated from ${oldDist === Infinity ? '∞' : oldDist} to ${newDist}`,
            animationEvent: { type: 'NONE' } as any,
          });
        } else {
          steps.push({
            step: stepCount++,
            lineNum: 3,
            explanationEnglish: `Check Edge [${u} ➔ ${v}]: dist[${u}] (${distMap[u]}) + weight (${weight}) = ${newDist} ≥ dist[${v}] (${oldDist}). No update needed.`,
            explanationHinglish: `Check Edge [${u} ➔ ${v}]: ${distMap[u]} + ${weight} = ${newDist} ≥ ${oldDist}. Naya path chhota nahi hai.`,
            memorySnapshot: {
              nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
              edges: DIJKSTRA_EDGES,
              distMap: { ...distMap },
              parentMap: { ...parentMap },
              settledSet: [...settledSet],
              activeNode: u,
              relaxingEdge: { u, v, weight, updated: false },
              isDijkstra: true,
            },
            consoleOutput: `> Checked (${u}->${v}): dist[${v}] remains ${oldDist}`,
            animationEvent: { type: 'NONE' } as any,
          });
        }
      }
    }

    const shortestPath: string[] = [];
    let curr: string | null = destV;
    while (curr !== null) {
      shortestPath.unshift(curr);
      curr = parentMap[curr];
    }

    steps.push({
      step: stepCount,
      lineNum: 4,
      explanationEnglish: `Dijkstra Complete! Shortest Path from Node [${startV}] ➔ Node [${destV}] is [${shortestPath.join(' ➔ ')}] with Total Distance = ${distMap[destV]}.`,
      explanationHinglish: `Dijkstra Algorithm Complete! Node [${startV}] se Node [${destV}] ka shortest path: [${shortestPath.join(' ➔ ')}] (Total Distance = ${distMap[destV]}).`,
      memorySnapshot: {
        nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
        edges: DIJKSTRA_EDGES,
        distMap: { ...distMap },
        parentMap: { ...parentMap },
        settledSet: [...settledSet],
        activeNode: undefined,
        relaxingEdge: undefined,
        shortestPath: [...shortestPath],
        totalDist: distMap[destV],
        isDijkstra: true,
        isComplete: true,
      },
      consoleOutput: `> Dijkstra Final Path (${startV} to ${destV}): ${shortestPath.join(' -> ')} (Distance = ${distMap[destV]})`,
      animationEvent: { type: 'NONE' } as any,
    });

    setCustomSteps(steps);
    setIsPlaying(true);
    setTimeout(() => goToStep(0), 20);
  }, [setCustomSteps, goToStep, setIsPlaying]);

  // Generate Kruskal's MST Steps (Edge Sorting + Disjoint Set Union DSU)
  const handleRunKruskal = useCallback(() => {
    const sortedEdges = [...DIJKSTRA_EDGES].sort((a, b) => a.weight - b.weight);

    const parent: Record<string, string> = {};
    DIJKSTRA_NODES.forEach(n => { parent[n] = n; });

    const find = (i: string): string => {
      if (parent[i] === i) return i;
      return find(parent[i]);
    };

    const union = (i: string, j: string) => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
      }
    };

    const steps: ExecutionStep[] = [];
    const mstEdges: { u: string; v: string; weight: number }[] = [];
    const edgeStatuses: Record<string, 'ACCEPTED' | 'REJECTED' | 'TESTING' | 'PENDING'> = {};

    sortedEdges.forEach(e => {
      edgeStatuses[`${e.u}-${e.v}`] = 'PENDING';
    });

    let stepCount = 1;
    let totalMstWeight = 0;

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `Kruskal Step 1: Sorted all ${sortedEdges.length} edges in ascending order of weights. DSU components initialized.`,
      explanationHinglish: `Kruskal Step 1: Sabhi ${sortedEdges.length} edges ko weight ke ascending order me sort kar diya gaya. DSU parent array initialize hua.`,
      memorySnapshot: {
        nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
        edges: DIJKSTRA_EDGES,
        sortedEdges,
        edgeStatuses: { ...edgeStatuses },
        parentMap: { ...parent },
        mstEdges: [...mstEdges],
        totalMstWeight,
        isKruskal: true,
      },
      consoleOutput: `> Kruskal Init: Sorted ${sortedEdges.length} edges by weight.`,
      animationEvent: { type: 'NONE' } as any,
    });

    for (const edge of sortedEdges) {
      const edgeKey = `${edge.u}-${edge.v}`;
      const rootU = find(edge.u);
      const rootV = find(edge.v);

      edgeStatuses[edgeKey] = 'TESTING';

      steps.push({
        step: stepCount++,
        lineNum: 2,
        explanationEnglish: `Testing Edge [${edge.u} ↔ ${edge.v}] (w=${edge.weight}): find(${edge.u}) = Node [${rootU}], find(${edge.v}) = Node [${rootV}].`,
        explanationHinglish: `Edge Test [${edge.u} ↔ ${edge.v}] (w=${edge.weight}): Node [${edge.u}] ka root [${rootU}] hai aur Node [${edge.v}] ka root [${rootV}] hai.`,
        memorySnapshot: {
          nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
          edges: DIJKSTRA_EDGES,
          sortedEdges,
          edgeStatuses: { ...edgeStatuses },
          parentMap: { ...parent },
          mstEdges: [...mstEdges],
          testingEdge: edge,
          totalMstWeight,
          isKruskal: true,
        },
        consoleOutput: `> Testing Edge (${edge.u}-${edge.v}, w=${edge.weight})`,
        animationEvent: { type: 'NONE' } as any,
      });

      if (rootU !== rootV) {
        union(edge.u, edge.v);
        mstEdges.push(edge);
        edgeStatuses[edgeKey] = 'ACCEPTED';
        totalMstWeight += edge.weight;

        steps.push({
          step: stepCount++,
          lineNum: 3,
          explanationEnglish: `ACCEPTED! Node [${edge.u}] & Node [${edge.v}] are in different components (${rootU} ≠ ${rootV}). Added Edge (${edge.u}↔${edge.v}, w=${edge.weight}) to MST!`,
          explanationHinglish: `ACCEPTED! Node [${edge.u}] aur [${edge.v}] alag components me hain. Edge (${edge.u}↔${edge.v}) MST me add ho gaya. Total Weight = ${totalMstWeight}.`,
          memorySnapshot: {
            nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
            edges: DIJKSTRA_EDGES,
            sortedEdges,
            edgeStatuses: { ...edgeStatuses },
            parentMap: { ...parent },
            mstEdges: [...mstEdges],
            acceptedEdge: edge,
            totalMstWeight,
            isKruskal: true,
          },
          consoleOutput: `> ACCEPTED Edge (${edge.u}-${edge.v}, w=${edge.weight}) ➔ MST Weight = ${totalMstWeight}`,
          animationEvent: { type: 'NONE' } as any,
        });
      } else {
        edgeStatuses[edgeKey] = 'REJECTED';

        steps.push({
          step: stepCount++,
          lineNum: 3,
          explanationEnglish: `CYCLE DETECTED! Both Node [${edge.u}] & Node [${edge.v}] belong to the same component [${rootU}]. Skipped Edge (${edge.u}↔${edge.v}) to avoid cycle!`,
          explanationHinglish: `CYCLE DETECTED! Dono nodes [${edge.u}] aur [${edge.v}] pehle se same component [${rootU}] me hain. Edge (${edge.u}↔${edge.v}) ko SKIP kar diya.`,
          memorySnapshot: {
            nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
            edges: DIJKSTRA_EDGES,
            sortedEdges,
            edgeStatuses: { ...edgeStatuses },
            parentMap: { ...parent },
            mstEdges: [...mstEdges],
            rejectedEdge: edge,
            totalMstWeight,
            isKruskal: true,
          },
          consoleOutput: `> REJECTED Edge (${edge.u}-${edge.v}) ➔ Cycle Detected!`,
          animationEvent: { type: 'NONE' } as any,
        });
      }

      if (mstEdges.length === DIJKSTRA_NODES.length - 1) break;
    }

    steps.push({
      step: stepCount,
      lineNum: 4,
      explanationEnglish: `Kruskal Complete! Minimum Spanning Tree (MST) constructed with ${mstEdges.length} edges. Total Minimum Weight = ${totalMstWeight}.`,
      explanationHinglish: `Kruskal MST Complete! Total ${mstEdges.length} edges se Minimum Spanning Tree taiyar ho gaya. Total Minimum Weight = ${totalMstWeight}.`,
      memorySnapshot: {
        nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
        edges: DIJKSTRA_EDGES,
        sortedEdges,
        edgeStatuses: { ...edgeStatuses },
        parentMap: { ...parent },
        mstEdges: [...mstEdges],
        totalMstWeight,
        isKruskal: true,
        isComplete: true,
      },
      consoleOutput: `> Kruskal MST Complete! Total Minimum Spanning Tree Weight = ${totalMstWeight}`,
      animationEvent: { type: 'NONE' } as any,
    });

    setCustomSteps(steps);
    setIsPlaying(true);
    setTimeout(() => goToStep(0), 20);
  }, [setCustomSteps, goToStep, setIsPlaying]);

  // Generate Prim's MST Steps (Priority Cut Expansion)
  const handleRunPrims = useCallback((startV: string) => {
    const mstSet: string[] = [startV];
    const mstEdges: { u: string; v: string; weight: number }[] = [];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let totalMstWeight = 0;

    const getCandidateEdges = (currentMst: string[]) => {
      const candidates: { u: string; v: string; weight: number }[] = [];
      DIJKSTRA_EDGES.forEach(e => {
        const uIn = currentMst.includes(e.u);
        const vIn = currentMst.includes(e.v);
        if ((uIn && !vIn) || (!uIn && vIn)) {
          candidates.push(e);
        }
      });
      return candidates.sort((a, b) => a.weight - b.weight);
    };

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `Prim's MST Step 1: Initialized tree growth at Start Node [${startV}]. MST Set = {${startV}}.`,
      explanationHinglish: `Prim's MST Step 1: Start Node [${startV}] se MST tree growth shuru hui. Initial MST Set = {${startV}}.`,
      memorySnapshot: {
        nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
        edges: DIJKSTRA_EDGES,
        mstSet: [...mstSet],
        mstEdges: [...mstEdges],
        candidateEdges: getCandidateEdges(mstSet),
        totalMstWeight,
        isPrims: true,
      },
      consoleOutput: `> Prim's Init at Node [${startV}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    while (mstSet.length < DIJKSTRA_NODES.length) {
      const candidates = getCandidateEdges(mstSet);
      if (candidates.length === 0) break;

      const minEdge = candidates[0];
      const nextNode = mstSet.includes(minEdge.u) ? minEdge.v : minEdge.u;

      steps.push({
        step: stepCount++,
        lineNum: 2,
        explanationEnglish: `Inspecting Cut Edges: Smallest connecting edge is (${minEdge.u} ↔ ${minEdge.v}) with Weight = ${minEdge.weight}.`,
        explanationHinglish: `Cut Edges Inspect: Minimum weight edge (${minEdge.u} ↔ ${minEdge.v}) w=${minEdge.weight} choose kiya.`,
        memorySnapshot: {
          nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
          edges: DIJKSTRA_EDGES,
          mstSet: [...mstSet],
          mstEdges: [...mstEdges],
          testingEdge: minEdge,
          candidateEdges: [...candidates],
          totalMstWeight,
          isPrims: true,
        },
        consoleOutput: `> Prim's Pick Min Edge: (${minEdge.u}-${minEdge.v}, w=${minEdge.weight})`,
        animationEvent: { type: 'NONE' } as any,
      });

      mstSet.push(nextNode);
      mstEdges.push(minEdge);
      totalMstWeight += minEdge.weight;

      steps.push({
        step: stepCount++,
        lineNum: 3,
        explanationEnglish: `ADDED TO MST! Edge (${minEdge.u} ↔ ${minEdge.v}, w=${minEdge.weight}) accepted. Node [${nextNode}] added to MST Set. Total Weight = ${totalMstWeight}.`,
        explanationHinglish: `ADDED TO MST! Edge (${minEdge.u} ↔ ${minEdge.v}) accept hua. Node [${nextNode}] MST Set me add ho gaya. Total Weight = ${totalMstWeight}.`,
        memorySnapshot: {
          nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
          edges: DIJKSTRA_EDGES,
          mstSet: [...mstSet],
          mstEdges: [...mstEdges],
          acceptedEdge: minEdge,
          candidateEdges: getCandidateEdges(mstSet),
          totalMstWeight,
          isPrims: true,
        },
        consoleOutput: `> Added Node [${nextNode}] & Edge (${minEdge.u}-${minEdge.v}) to MST`,
        animationEvent: { type: 'NONE' } as any,
      });
    }

    steps.push({
      step: stepCount,
      lineNum: 4,
      explanationEnglish: `Prim's MST Complete! All ${DIJKSTRA_NODES.length} nodes connected using ${mstEdges.length} edges. Total Minimum Weight = ${totalMstWeight}.`,
      explanationHinglish: `Prim's MST Complete! Sabhi ${DIJKSTRA_NODES.length} nodes connect ho gaye. Total Minimum Weight = ${totalMstWeight}.`,
      memorySnapshot: {
        nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
        edges: DIJKSTRA_EDGES,
        mstSet: [...mstSet],
        mstEdges: [...mstEdges],
        candidateEdges: [],
        totalMstWeight,
        isPrims: true,
        isComplete: true,
      },
      consoleOutput: `> Prim's Complete! Total Minimum Spanning Weight = ${totalMstWeight}`,
      animationEvent: { type: 'NONE' } as any,
    });

    setCustomSteps(steps);
    setIsPlaying(true);
    setTimeout(() => goToStep(0), 20);
  }, [setCustomSteps, goToStep, setIsPlaying]);

  // Generate A* (A-Star) Algorithm Steps
  const handleRunAStar = useCallback((startV: string, destV: string) => {
    const calcH = (nodeId: string, targetId: string): number => {
      const p1 = DIJKSTRA_NODE_POSITIONS[nodeId];
      const p2 = DIJKSTRA_NODE_POSITIONS[targetId];
      if (!p1 || !p2) return 0;
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      return Math.round(Math.sqrt(dx * dx + dy * dy) / 30);
    };

    const gMap: Record<string, number> = {};
    const hMap: Record<string, number> = {};
    const fMap: Record<string, number> = {};
    const parentMap: Record<string, string | null> = {};

    DIJKSTRA_NODES.forEach(n => {
      gMap[n] = Infinity;
      hMap[n] = calcH(n, destV);
      fMap[n] = Infinity;
      parentMap[n] = null;
    });

    gMap[startV] = 0;
    fMap[startV] = gMap[startV] + hMap[startV];

    const openSet: string[] = [startV];
    const closedSet: string[] = [];

    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `A* Search Init: Target Node = [${destV}]. Calculated Heuristic h(n) for all nodes. Start Node [${startV}]: g=0, h=${hMap[startV]} ➔ f(n) = g + h = ${fMap[startV]}.`,
      explanationHinglish: `A* Search Init: Target Node [${destV}] target hai. Subhi nodes ke liye Heuristic h(n) calculate kiya. Start Node [${startV}]: g=0, h=${hMap[startV]} ➔ f(n) = ${fMap[startV]}.`,
      memorySnapshot: {
        nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
        edges: DIJKSTRA_EDGES,
        gMap: { ...gMap },
        hMap: { ...hMap },
        fMap: { ...fMap },
        parentMap: { ...parentMap },
        openSet: [...openSet],
        closedSet: [...closedSet],
        activeNode: startV,
        startNode: startV,
        targetNode: destV,
        isAStar: true,
      },
      consoleOutput: `> A* Init: Target = Node [${destV}], Start Node [${startV}] (f = 0 + ${hMap[startV]} = ${fMap[startV]})`,
      animationEvent: { type: 'NONE' } as any,
    });

    while (openSet.length > 0) {
      openSet.sort((a, b) => fMap[a] - fMap[b]);
      const current = openSet.shift()!;

      closedSet.push(current);

      steps.push({
        step: stepCount++,
        lineNum: 2,
        explanationEnglish: `Open Set Priority Selection: Selected Node [${current}] with MINIMUM f(n) = ${fMap[current]} (g=${gMap[current]}, h=${hMap[current]}). Moved to Closed Set.`,
        explanationHinglish: `Open Set Selection: Node [${current}] pick kiya jiska MINIMUM f(n) = ${fMap[current]} hai (g=${gMap[current]}, h=${hMap[current]}). Closed Set me add kiya.`,
        memorySnapshot: {
          nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
          edges: DIJKSTRA_EDGES,
          gMap: { ...gMap },
          hMap: { ...hMap },
          fMap: { ...fMap },
          parentMap: { ...parentMap },
          openSet: [...openSet],
          closedSet: [...closedSet],
          activeNode: current,
          startNode: startV,
          targetNode: destV,
          isAStar: true,
        },
        consoleOutput: `> Picked Node [${current}] (Min f = ${fMap[current]}) from Open Set`,
        animationEvent: { type: 'HIGHLIGHT_NODE', activeNodeId: current } as any,
      });

      if (current === destV) {
        break;
      }

      const neighbors = DIJKSTRA_EDGES.filter(e => e.u === current || e.v === current);

      for (const edge of neighbors) {
        const neighbor = edge.u === current ? edge.v : edge.u;
        if (closedSet.includes(neighbor)) continue;

        const weight = edge.weight || 1;
        const tentativeG = gMap[current] + weight;

        if (tentativeG < gMap[neighbor]) {
          const oldF = fMap[neighbor];
          parentMap[neighbor] = current;
          gMap[neighbor] = tentativeG;
          fMap[neighbor] = gMap[neighbor] + hMap[neighbor];

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }

          steps.push({
            step: stepCount++,
            lineNum: 3,
            explanationEnglish: `Path Evaluation [${current} ➔ ${neighbor}]: g(${neighbor}) updated = ${gMap[neighbor]}, h(${neighbor}) = ${hMap[neighbor]} ➔ f(${neighbor}) = g+h = ${fMap[neighbor]} (was ${oldF === Infinity ? '∞' : oldF}). Added to Open Set.`,
            explanationHinglish: `Path Evaluation [${current} ➔ ${neighbor}]: Naya g(${neighbor}) = ${gMap[neighbor]}, h(${neighbor}) = ${hMap[neighbor]} ➔ Naya f(${neighbor}) = ${fMap[neighbor]}. Open Set me add/update hua.`,
            memorySnapshot: {
              nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
              edges: DIJKSTRA_EDGES,
              gMap: { ...gMap },
              hMap: { ...hMap },
              fMap: { ...fMap },
              parentMap: { ...parentMap },
              openSet: [...openSet],
              closedSet: [...closedSet],
              activeNode: current,
              relaxingEdge: { u: current, v: neighbor, weight, updated: true },
              startNode: startV,
              targetNode: destV,
              isAStar: true,
            },
            consoleOutput: `> Updated Node [${neighbor}]: f = ${gMap[neighbor]} + ${hMap[neighbor]} = ${fMap[neighbor]}`,
            animationEvent: { type: 'NONE' } as any,
          });
        }
      }
    }

    const astarPath: string[] = [];
    let currNode: string | null = destV;
    if (gMap[destV] !== Infinity) {
      while (currNode !== null) {
        astarPath.unshift(currNode);
        currNode = parentMap[currNode];
      }
    }

    steps.push({
      step: stepCount,
      lineNum: 4,
      explanationEnglish: `A* Search Complete! Optimal Path from Node [${startV}] ➔ Node [${destV}] is [${astarPath.join(' ➔ ')}] with Total Cost = ${gMap[destV]}.`,
      explanationHinglish: `A* Search Complete! Node [${startV}] se Node [${destV}] ka Optimal Path: [${astarPath.join(' ➔ ')}] (Total Path Cost = ${gMap[destV]}).`,
      memorySnapshot: {
        nodes: DIJKSTRA_NODES.map(id => ({ id, x: DIJKSTRA_NODE_POSITIONS[id].x, y: DIJKSTRA_NODE_POSITIONS[id].y })),
        edges: DIJKSTRA_EDGES,
        gMap: { ...gMap },
        hMap: { ...hMap },
        fMap: { ...fMap },
        parentMap: { ...parentMap },
        openSet: [...openSet],
        closedSet: [...closedSet],
        activeNode: undefined,
        astarPath: [...astarPath],
        totalDist: gMap[destV],
        startNode: startV,
        targetNode: destV,
        isAStar: true,
        isComplete: true,
      },
      consoleOutput: `> A* Optimal Path: ${astarPath.join(' -> ')} (Cost: ${gMap[destV]})`,
      animationEvent: { type: 'NONE' } as any,
    });

    setCustomSteps(steps);
    setIsPlaying(true);
    setTimeout(() => goToStep(0), 20);
  }, [setCustomSteps, goToStep, setIsPlaying]);

  useEffect(() => {
    if (isBfs) {
      handleRunBfs('0');
    } else if (isDfs) {
      handleRunDfs('0');
    } else if (isDijkstra) {
      handleRunDijkstra('0', '5');
    } else if (isKruskal) {
      handleRunKruskal();
    } else if (isPrims) {
      handleRunPrims('0');
    } else if (isAStar) {
      handleRunAStar('0', '5');
    } else {
      updateGraphState(GRAPH_7_EDGES, '0', 'Default Mesh Network Initialized.');
    }
  }, [lesson?.id, isBfs, isDfs, isDijkstra, isKruskal, isPrims, isAStar, handleRunBfs, handleRunDfs, handleRunDijkstra, handleRunKruskal, handleRunPrims, handleRunAStar, updateGraphState]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Header */}
      <div className="px-4 py-3 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            {isBfs ? 'GRAPH BFS (7 NODES)' : isDfs ? 'GRAPH DFS (7 NODES)' : isDijkstra ? 'DIJKSTRA ALGORITHM' : isKruskal ? 'KRUSKAL MST ALGORITHM' : isPrims ? "PRIM'S MST ALGORITHM" : isAStar ? 'A* SEARCH ALGORITHM' : 'GRAPH FUNDAMENTALS'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded font-semibold">
          {isBfs ? 'FIFO Queue Simulation' : isDfs ? 'LIFO Stack Backtracking' : isDijkstra ? 'Priority Queue' : isKruskal ? 'Disjoint Set Union (DSU)' : isPrims ? 'Min-Heap Priority Queue' : isAStar ? 'Heuristic f(n) = g + h' : '7 Vertices'}
        </span>
      </div>

      {/* Control Panel Body */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col justify-between gap-4">

        <div className="flex flex-col gap-3.5">
          
          {isBfs || isDfs || isDijkstra || isKruskal || isPrims || isAStar ? (
            /* BFS / DFS / DIJKSTRA / KRUSKAL / PRIMS / ASTAR CONTROLS */
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold px-0.5 flex items-center gap-1">
                  <PlayCircle size={12} className="text-cyan-400" /> Select Node & Auto-Execute
                </span>
              </div>

              <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-300">
                    {isKruskal ? 'Reset MST:' : 'Start Node:'}
                  </span>
                  <div className="flex items-center gap-1">
                    {(isDijkstra || isKruskal || isPrims || isAStar ? DIJKSTRA_NODES : GRAPH_7_NODES).map(id => (
                      <button
                        key={id}
                        onClick={() => {
                          setStartNode(id);
                          if (isBfs) handleRunBfs(id);
                          else if (isDfs) handleRunDfs(id);
                          else if (isDijkstra) handleRunDijkstra(id, targetNode);
                          else if (isKruskal) handleRunKruskal();
                          else if (isPrims) handleRunPrims(id);
                          else if (isAStar) handleRunAStar(id, targetNode);
                        }}
                        className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all border ${
                          startNode === id
                            ? isKruskal || isDijkstra || isPrims || isAStar
                              ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                              : isBfs
                              ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                              : 'bg-purple-500 text-white border-purple-300 font-black shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>

                {(isDijkstra || isAStar) && (
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900">
                    <span className="text-xs font-mono text-slate-300">Target Node:</span>
                    <div className="flex items-center gap-1">
                      {DIJKSTRA_NODES.map(id => (
                        <button
                          key={id}
                          onClick={() => {
                            setTargetNode(id);
                            if (isDijkstra) handleRunDijkstra(startNode, id);
                            else if (isAStar) handleRunAStar(startNode, id);
                          }}
                          className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all border ${
                            targetNode === id
                              ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isAStar && (
                /* Institute Classroom Heuristic Formula Box */
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col gap-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-indigo-300 font-extrabold text-[11px] uppercase tracking-wider border-b border-indigo-900/60 pb-1">
                    <span>A* Evaluation Formula</span>
                    <span className="text-amber-400">f(n) = g(n) + h(n)</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    • <span className="text-cyan-300 font-bold">g(n)</span> = Path cost from Start Node
                    <br />
                    • <span className="text-purple-300 font-bold">h(n)</span> = Heuristic distance to Target
                    <br />
                    • <span className="text-emerald-300 font-bold">f(n)</span> = Total estimated path cost
                  </div>
                  <div className="text-[10.5px] text-indigo-200/90 pt-1.5 border-t border-indigo-900/60 font-mono">
                    <span className="font-bold text-amber-300">Heuristic Values h(n) → Target [{targetNode}]:</span>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      {DIJKSTRA_NODES.map(id => {
                        const p1 = DIJKSTRA_NODE_POSITIONS[id];
                        const p2 = DIJKSTRA_NODE_POSITIONS[targetNode];
                        const h = (p1 && p2) ? Math.round(Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) / 30) : 0;
                        return (
                          <div key={id} className="px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/60 text-[10px] text-center font-bold text-slate-200">
                            h({id}) = <span className="text-amber-300 font-black">{h}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* GRAPH FUNDAMENTALS CONTROLS */
            <div className="flex flex-col gap-2.5">
              {/* Compact Concept Selector Buttons */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-widest font-bold px-0.5 flex items-center gap-1">
                  <Eye size={11} className="text-cyan-400" /> SELECT CONCEPT TO VISUALIZE
                </span>

                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                  <button
                    onClick={() => updateGraphState(edgesList, selectedInspectNode, `Visualizing Adjacency Matrix (7×7 Grid).`, 'matrix')}
                    className="py-1.5 px-2 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 font-bold flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
                  >
                    📊 Matrix
                  </button>
                  <button
                    onClick={() => updateGraphState(edgesList, selectedInspectNode, `Visualizing Adjacency List (Linked Vectors).`, 'list')}
                    className="py-1.5 px-2 rounded-lg bg-purple-950/50 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 font-bold flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
                  >
                    🔗 Adj List
                  </button>
                  <button
                    onClick={() => updateGraphState(edgesList, selectedInspectNode, `Visualizing Node Neighbors & Degree.`, 'neighbors')}
                    className="py-1.5 px-2 rounded-lg bg-amber-950/50 hover:bg-amber-900/80 border border-amber-500/40 text-amber-200 font-bold flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
                  >
                    🎯 Neighbors
                  </button>
                  <button
                    onClick={() => updateGraphState(edgesList, selectedInspectNode, `Visualizing Floating Edge Weights.`, 'weights')}
                    className="py-1.5 px-2 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 font-bold flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
                  >
                    ⚖️ Weights
                  </button>
                </div>
              </div>

              {/* Compact Node Inspector Bar */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-widest font-bold px-0.5 flex items-center gap-1">
                  <Eye size={11} className="text-amber-400" /> INSPECT NODE
                </span>

                <div className="grid grid-cols-7 gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  {GRAPH_7_NODES.map(id => (
                    <button
                      key={id}
                      onClick={() => updateGraphState(edgesList, id, `Inspecting Node [${id}]: Neighbors & Degree.`)}
                      className={`py-1 rounded-lg font-mono text-xs font-bold transition-all border ${
                        selectedInspectNode === id
                          ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
