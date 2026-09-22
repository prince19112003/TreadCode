import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { Eye, PlayCircle } from 'lucide-react';

const GRAPH_7_NODES = ['1', '2', '3', '4', '5', '6', '7'];
const GRAPH_GRAPH2_NODES = ['1', '2', '3', '4', '5', '6', '7'];

const DIJKSTRA_NODES = ['1', '2', '3', '4', '5', '6'];
const DIJKSTRA_GRAPH2_NODES = ['1', '2', '3', '4', '5', '6', '7'];

// Coordinates layout for 7 unweighted/weighted nodes (Spacious 520x340 Canvas)
const GRAPH_NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  '1': { x: 120, y: 65 },
  '4': { x: 320, y: 65 },
  '2': { x: 80, y: 170 },
  '3': { x: 250, y: 170 },
  '7': { x: 440, y: 170 },
  '5': { x: 160, y: 275 },
  '6': { x: 360, y: 275 },
};

// Graph 2: Exact 7-Node Layout from User Image
const GRAPH_GRAPH2_NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  '1': { x: 260, y: 40 },
  '2': { x: 130, y: 100 },
  '3': { x: 390, y: 110 },
  '4': { x: 260, y: 140 },
  '5': { x: 80, y: 220 },
  '6': { x: 390, y: 250 },
  '7': { x: 240, y: 270 },
};

// Coordinates layout for 6-node Weighted Graph (Spacious 520x340 Canvas)
const DIJKSTRA_NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  '1': { x: 75, y: 170 },
  '2': { x: 200, y: 65 },
  '3': { x: 200, y: 275 },
  '4': { x: 345, y: 65 },
  '5': { x: 345, y: 275 },
  '6': { x: 465, y: 170 },
};

const DIJKSTRA_GRAPH2_POSITIONS: Record<string, { x: number; y: number }> = {
  '1': { x: 65, y: 170 },
  '2': { x: 175, y: 70 },
  '3': { x: 175, y: 270 },
  '4': { x: 285, y: 70 },
  '5': { x: 285, y: 270 },
  '6': { x: 395, y: 70 },
  '7': { x: 395, y: 270 },
  '8': { x: 475, y: 170 },
};

const GRAPH_7_EDGES = [
  { u: '1', v: '2' },
  { u: '1', v: '3' },
  { u: '1', v: '4' },
  { u: '2', v: '3' },
  { u: '2', v: '5' },
  { u: '3', v: '5' },
  { u: '3', v: '6' },
  { u: '4', v: '7' },
  { u: '6', v: '7' },
];

// Graph 2: Exact 8 Edges from User Image for 7 Nodes
const GRAPH_GRAPH2_EDGES = [
  { u: '1', v: '2' },
  { u: '1', v: '3' },
  { u: '1', v: '4' },
  { u: '2', v: '4' },
  { u: '2', v: '5' },
  { u: '3', v: '6' },
  { u: '4', v: '6' },
  { u: '5', v: '7' },
];

// Weighted Edges for Dijkstra, Kruskal & Prim's Graphs
const DIJKSTRA_EDGES = [
  { u: '1', v: '2', weight: 4 },
  { u: '1', v: '3', weight: 2 },
  { u: '2', v: '3', weight: 1 },
  { u: '2', v: '4', weight: 5 },
  { u: '3', v: '4', weight: 8 },
  { u: '3', v: '5', weight: 10 },
  { u: '4', v: '5', weight: 2 },
  { u: '4', v: '6', weight: 6 },
  { u: '5', v: '6', weight: 3 },
];

const DIJKSTRA_GRAPH2_EDGES = [
  { u: '1', v: '2', weight: 3 },
  { u: '1', v: '3', weight: 6 },
  { u: '2', v: '3', weight: 2 },
  { u: '2', v: '4', weight: 4 },
  { u: '2', v: '5', weight: 7 },
  { u: '3', v: '5', weight: 1 },
  { u: '4', v: '6', weight: 5 },
  { u: '4', v: '7', weight: 3 },
  { u: '5', v: '7', weight: 8 },
  { u: '6', v: '8', weight: 2 },
  { u: '7', v: '8', weight: 4 },
];

interface FundamentalsNode {
  id: string;
  x: number;
  y: number;
  set?: 'U' | 'V';
}

interface FundamentalsEdge {
  u: string;
  v: string;
  weight?: number;
  isSelfLoop?: boolean;
  curve?: number;
  directed?: boolean;
  isCycle?: boolean;
}

interface FundamentalsComponent {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FundamentalsConcept {
  id: string;
  label: string;
  category: 'core' | 'types' | 'structures' | 'representations';
  title: string;
  mathNotation: string;
  descriptionEnglish: string;
  descriptionHinglish: string;
  nodes: FundamentalsNode[];
  edges: FundamentalsEdge[];
  isDirected?: boolean;
  isMultiGraph?: boolean;
  isBipartite?: boolean;
  isDisconnected?: boolean;
  components?: FundamentalsComponent[];
  defaultTab?: 'theory' | 'matrix' | 'list' | 'neighbors';
  defaultInspectNode?: string;
  properties: Array<{ label: string; value: string }>;
  dsaRelevance: string;
}

const FUNDAMENTALS_CONCEPTS: Record<string, FundamentalsConcept> = {
  vertices: {
    id: 'vertices',
    label: 'Vertices (V)',
    category: 'core',
    title: 'Vertices / Nodes (V)',
    mathNotation: 'G = (V, E), where V is a non-empty set of vertices: |V| = 7',
    descriptionEnglish: 'Vertices are the fundamental discrete entities or states in a network. In this network, |V| = 7.',
    descriptionHinglish: 'Vertices graph ke main nodes ya states hote hain. Is network mein |V| = 7 nodes hain.',
    nodes: [
      { id: '1', x: 120, y: 65 },
      { id: '4', x: 320, y: 65 },
      { id: '2', x: 80, y: 170 },
      { id: '3', x: 250, y: 170 },
      { id: '7', x: 440, y: 170 },
      { id: '5', x: 160, y: 275 },
      { id: '6', x: 360, y: 275 },
    ],
    edges: GRAPH_7_EDGES,
    defaultTab: 'theory',
    properties: [
      { label: 'Vertex Count |V|', value: '7' },
      { label: 'Node Set V', value: '{1, 2, 3, 4, 5, 6, 7}' },
      { label: 'Isolated Vertices', value: '0' },
      { label: 'Min Degree', value: '2' },
    ],
    dsaRelevance: 'Vertices model states in dynamic programming, cities in pathfinding, or vertices in topological sort.',
  },
  edges: {
    id: 'edges',
    label: 'Edges (E)',
    category: 'core',
    title: 'Edges / Links (E)',
    mathNotation: 'E ⊆ V × V. Undirected: {u, v} unordered pairs: |E| = 9',
    descriptionEnglish: 'Edges represent connections or relationships between pairs of vertices. In this network, |E| = 9.',
    descriptionHinglish: 'Edges do nodes ke beech sambandh (connections) darshate hain. Is network mein |E| = 9 edges hain.',
    nodes: [
      { id: '1', x: 120, y: 65 },
      { id: '4', x: 320, y: 65 },
      { id: '2', x: 80, y: 170 },
      { id: '3', x: 250, y: 170 },
      { id: '7', x: 440, y: 170 },
      { id: '5', x: 160, y: 275 },
      { id: '6', x: 360, y: 275 },
    ],
    edges: GRAPH_7_EDGES,
    defaultTab: 'theory',
    properties: [
      { label: 'Edge Count |E|', value: '9' },
      { label: 'Max Possible Edges', value: '21 (V*(V-1)/2)' },
      { label: 'Graph Density', value: '0.43 (Sparse)' },
      { label: 'Symmetry', value: 'Undirected {u, v}' },
    ],
    dsaRelevance: 'Edge density decides whether an Adjacency List O(V + E) or Adjacency Matrix O(V²) is optimal.',
  },
  degree: {
    id: 'degree',
    label: 'Degree & Neighbors',
    category: 'core',
    title: 'Degree & Connected Neighbors',
    mathNotation: 'deg(v) = |N(v)|. Handshaking Lemma: Σ deg(v) = 2|E|',
    descriptionEnglish: 'The degree of a vertex is the count of edges incident to it. Neighbors are all directly adjacent nodes.',
    descriptionHinglish: 'Kisi vertex ka degree usse judi edges ki sankhya hai. Neighbors direct connected nodes hote hain.',
    nodes: [
      { id: '1', x: 120, y: 65 },
      { id: '4', x: 320, y: 65 },
      { id: '2', x: 80, y: 170 },
      { id: '3', x: 250, y: 170 },
      { id: '7', x: 440, y: 170 },
      { id: '5', x: 160, y: 275 },
      { id: '6', x: 360, y: 275 },
    ],
    edges: GRAPH_7_EDGES,
    defaultTab: 'neighbors',
    properties: [
      { label: 'Handshaking Lemma', value: 'Σ deg(v) = 2|E| = 18' },
      { label: 'Sum of Degrees', value: '18 (Always Even)' },
      { label: 'Average Degree', value: '2.57' },
      { label: 'Max Degree node', value: 'Node [3] (deg = 4)' },
    ],
    dsaRelevance: 'Degree determines traversal branching in BFS/DFS. In bipartite graphs, degrees sum to |E| per partition.',
  },
  multigraph: {
    id: 'multigraph',
    label: 'Self-Loops & Multi-Edge',
    category: 'core',
    title: 'Multigraph (Pseudograph)',
    mathNotation: 'Self-loop: (u, u) ∈ E. Parallel edges: e₁ ≠ e₂ with same endpoints.',
    descriptionEnglish: 'A multigraph allows parallel edges between the same two nodes or self-loops incident to the same node.',
    descriptionHinglish: 'Multigraph mein ek hi node par self-loop aur do nodes ke beech multiple edges allowed hoti hain.',
    nodes: [
      { id: '1', x: 120, y: 170 },
      { id: '2', x: 260, y: 170 },
      { id: '3', x: 400, y: 170 },
    ],
    edges: [
      { u: '1', v: '1', isSelfLoop: true },
      { u: '1', v: '2' },
      { u: '2', v: '3', curve: -35 },
      { u: '2', v: '3', curve: 35 },
    ],
    isMultiGraph: true,
    defaultTab: 'theory',
    properties: [
      { label: 'Self-Loops', value: '1 on Node [1]' },
      { label: 'Parallel Edges', value: '2 between [2] and [3]' },
      { label: 'Simple Graph?', value: 'No (Multigraph)' },
      { label: 'Handshaking contribution', value: 'Self-loop adds 2 to degree' },
    ],
    dsaRelevance: 'Most DSA shortest path algorithms require sanitizing multigraphs into simple graphs by taking min edge weights.',
  },
  null_graph: {
    id: 'null_graph',
    label: 'Null / Empty Graph',
    category: 'types',
    title: 'Null Graph (N₅)',
    mathNotation: 'N_n = (V, ∅) where |V| = 5, |E| = 0. All vertices are isolated.',
    descriptionEnglish: 'A Null or Empty Graph contains vertices but zero edges. Every vertex has degree 0.',
    descriptionHinglish: 'Null Graph mein vertices hote hain par koi edge nahi hoti (|E| = 0). Sabhi nodes isolated hain.',
    nodes: [
      { id: '1', x: 110, y: 100 },
      { id: '2', x: 260, y: 70 },
      { id: '3', x: 410, y: 100 },
      { id: '4', x: 170, y: 250 },
      { id: '5', x: 350, y: 250 },
    ],
    edges: [],
    defaultTab: 'theory',
    properties: [
      { label: 'Vertex Count |V|', value: '5' },
      { label: 'Edge Count |E|', value: '0' },
      { label: 'Degree of all nodes', value: '0' },
      { label: 'Connected Components', value: '5' },
    ],
    dsaRelevance: 'Represents initial state in Disjoint Set Union (DSU / Kruskal) before edges are united.',
  },
  trivial_graph: {
    id: 'trivial_graph',
    label: 'Trivial Graph',
    category: 'types',
    title: 'Trivial Graph (K₁)',
    mathNotation: 'G = ({1}, ∅). |V| = 1, |E| = 0. Smallest possible non-empty graph.',
    descriptionEnglish: 'A Trivial Graph consists of a single isolated vertex with no edges.',
    descriptionHinglish: 'Trivial Graph mein sirf 1 akela node hota hai aur koi edge nahi hoti.',
    nodes: [
      { id: '1', x: 260, y: 170 },
    ],
    edges: [],
    defaultInspectNode: '1',
    defaultTab: 'theory',
    properties: [
      { label: 'Vertex Count |V|', value: '1' },
      { label: 'Edge Count |E|', value: '0' },
      { label: 'deg(1)', value: '0' },
      { label: 'Is Connected?', value: 'Trivially Yes' },
    ],
    dsaRelevance: 'Common edge-case boundary check in coding interviews: single-node inputs for BFS/DFS and path algorithms.',
  },
  complete_graph: {
    id: 'complete_graph',
    label: 'Complete Graph (Kn)',
    category: 'types',
    title: 'Complete Graph (K₅)',
    mathNotation: 'K_n: |E| = n(n-1)/2. For K₅: |E| = 5(4)/2 = 10 edges.',
    descriptionEnglish: 'A Complete Graph is a simple graph where every pair of distinct vertices is connected by an edge.',
    descriptionHinglish: 'Complete Graph mein har do nodes ke beech direct edge hoti hai (maximum possible connections).',
    nodes: [
      { id: '1', x: 260, y: 60 },
      { id: '2', x: 400, y: 145 },
      { id: '3', x: 350, y: 275 },
      { id: '4', x: 170, y: 275 },
      { id: '5', x: 120, y: 145 },
    ],
    edges: [
      { u: '1', v: '2' },
      { u: '1', v: '3' },
      { u: '1', v: '4' },
      { u: '1', v: '5' },
      { u: '2', v: '3' },
      { u: '2', v: '4' },
      { u: '2', v: '5' },
      { u: '3', v: '4' },
      { u: '3', v: '5' },
      { u: '4', v: '5' },
    ],
    defaultTab: 'theory',
    properties: [
      { label: 'Vertex Count |V|', value: '5' },
      { label: 'Edge Count |E|', value: '10' },
      { label: 'Regularity', value: '4-Regular (n-1)' },
      { label: 'Density', value: '1.0 (Max Possible)' },
    ],
    dsaRelevance: 'Worst-case density scenario for adjacency matrices. Prim\'s algorithm O(V²) outperforms Kruskal\'s on complete graphs.',
  },
  directed_graph: {
    id: 'directed_graph',
    label: 'Directed Graph',
    category: 'types',
    title: 'Directed Graph (Digraph)',
    mathNotation: 'E ⊆ V × V. Ordered pairs (u, v) representing direction u → v.',
    descriptionEnglish: 'Edges have specific direction from source to destination. Nodes have distinct in-degrees and out-degrees.',
    descriptionHinglish: 'Directed Graph mein edges arrows ke sath direction darshati hain (u se v tak).',
    nodes: [
      { id: '1', x: 85, y: 170 },
      { id: '2', x: 215, y: 80 },
      { id: '3', x: 215, y: 260 },
      { id: '4', x: 335, y: 80 },
      { id: '5', x: 335, y: 260 },
      { id: '6', x: 445, y: 170 },
    ],
    edges: [
      { u: '1', v: '2', weight: 3, directed: true },
      { u: '1', v: '3', weight: 2, directed: true },
      { u: '2', v: '4', weight: 4, directed: true },
      { u: '3', v: '2', weight: 1, directed: true },
      { u: '3', v: '5', weight: 5, directed: true },
      { u: '4', v: '6', weight: 2, directed: true },
      { u: '5', v: '4', weight: 3, directed: true },
      { u: '5', v: '6', weight: 6, directed: true },
    ],
    isDirected: true,
    defaultTab: 'theory',
    properties: [
      { label: 'Edge Count |E|', value: '8 directed' },
      { label: 'In-Degree sum', value: 'Σ in-deg = 8' },
      { label: 'Out-Degree sum', value: 'Σ out-deg = 8' },
      { label: 'Symmetric matrix?', value: 'No (Asymmetric)' },
    ],
    dsaRelevance: 'Models web links (PageRank), task dependency schedules, and is the prerequisite for Topological Sort.',
  },
  undirected_graph: {
    id: 'undirected_graph',
    label: 'Undirected Graph',
    category: 'types',
    title: 'Undirected Graph',
    mathNotation: 'E ⊆ {{u, v} | u, v ∈ V}. Bidirectional edges: {u, v} ≡ {v, u}.',
    descriptionEnglish: 'Edges represent bidirectional symmetrical connections with no fixed orientation.',
    descriptionHinglish: 'Undirected Graph mein edges dono directions mein chal sakti hain ({u, v} barabar hai {v, u}).',
    nodes: [
      { id: '1', x: 120, y: 65 },
      { id: '4', x: 320, y: 65 },
      { id: '2', x: 80, y: 170 },
      { id: '3', x: 250, y: 170 },
      { id: '7', x: 440, y: 170 },
      { id: '5', x: 160, y: 275 },
      { id: '6', x: 360, y: 275 },
    ],
    edges: GRAPH_7_EDGES,
    defaultTab: 'theory',
    properties: [
      { label: 'Orientation', value: 'Bidirectional' },
      { label: 'Matrix Property', value: 'Symmetric (M = Mᵀ)' },
      { label: 'Edge Count |E|', value: '9' },
      { label: 'Handshaking lemma', value: 'Holds' },
    ],
    dsaRelevance: 'Used in social networks (Facebook mutual friends), 2-way road networks, and Minimum Spanning Trees.',
  },
  weighted_graph: {
    id: 'weighted_graph',
    label: 'Weighted Graph',
    category: 'types',
    title: 'Weighted Graph',
    mathNotation: 'G = (V, E, w) where w: E → ℝ⁺ assigns numerical cost to each edge.',
    descriptionEnglish: 'Every edge carries a numeric weight representing cost, physical distance, latency, or capacity.',
    descriptionHinglish: 'Har edge par ek number (weight ya cost) hota hai jo distance ya latency darshata hai.',
    nodes: [
      { id: '1', x: 120, y: 65 },
      { id: '4', x: 320, y: 65 },
      { id: '2', x: 80, y: 170 },
      { id: '3', x: 250, y: 170 },
      { id: '7', x: 440, y: 170 },
      { id: '5', x: 160, y: 275 },
      { id: '6', x: 360, y: 275 },
    ],
    edges: [
      { u: '1', v: '2', weight: 4 },
      { u: '1', v: '3', weight: 2 },
      { u: '1', v: '4', weight: 5 },
      { u: '2', v: '3', weight: 1 },
      { u: '2', v: '5', weight: 7 },
      { u: '3', v: '5', weight: 3 },
      { u: '3', v: '6', weight: 8 },
      { u: '4', v: '7', weight: 6 },
      { u: '6', v: '7', weight: 2 },
    ],
    defaultTab: 'theory',
    properties: [
      { label: 'Weights Range', value: '1 to 8' },
      { label: 'Min Weight', value: '1 (Edge 2↔3)' },
      { label: 'Max Weight', value: '8 (Edge 3↔6)' },
      { label: 'Total Weight', value: '38' },
    ],
    dsaRelevance: 'Dijkstra and Prim algorithms rely strictly on non-negative weighted edges; Bellman-Ford supports negative weights.',
  },
  unweighted_graph: {
    id: 'unweighted_graph',
    label: 'Unweighted Graph',
    category: 'types',
    title: 'Unweighted Graph',
    mathNotation: '∀ e ∈ E, weight(e) = 1 (Uniform unit cost per edge).',
    descriptionEnglish: 'All edges carry equal cost. Shortest path is solved directly using standard BFS in O(V + E).',
    descriptionHinglish: 'Sabhi edges ka weight saman (1) hota hai. Shortest path direct BFS se O(V + E) mein mil jata hai.',
    nodes: [
      { id: '1', x: 120, y: 65 },
      { id: '4', x: 320, y: 65 },
      { id: '2', x: 80, y: 170 },
      { id: '3', x: 250, y: 170 },
      { id: '7', x: 440, y: 170 },
      { id: '5', x: 160, y: 275 },
      { id: '6', x: 360, y: 275 },
    ],
    edges: GRAPH_7_EDGES.map(e => ({ u: e.u, v: e.v })),
    defaultTab: 'theory',
    properties: [
      { label: 'Edge Weights', value: 'None (Unit 1)' },
      { label: 'Shortest Path Time', value: 'O(V + E) via BFS' },
      { label: 'Priority Queue?', value: 'Not needed' },
      { label: 'Storage', value: 'Simple Adjacency List' },
    ],
    dsaRelevance: 'When unweighted, BFS provides the exact minimum hop count shortest path without priority queues.',
  },
  connected_graph: {
    id: 'connected_graph',
    label: 'Connected Graph',
    category: 'structures',
    title: 'Connected Graph',
    mathNotation: '∀ u, v ∈ V, ∃ path between u and v. Connected components = 1.',
    descriptionEnglish: 'A graph is connected if there is at least one path between every pair of vertices.',
    descriptionHinglish: 'Graph connected hota hai jab kisi bhi node se doosre node tak path available ho (1 component).',
    nodes: [
      { id: '1', x: 120, y: 65 },
      { id: '4', x: 320, y: 65 },
      { id: '2', x: 80, y: 170 },
      { id: '3', x: 250, y: 170 },
      { id: '7', x: 440, y: 170 },
      { id: '5', x: 160, y: 275 },
      { id: '6', x: 360, y: 275 },
    ],
    edges: GRAPH_7_EDGES,
    defaultTab: 'theory',
    properties: [
      { label: 'Connected Components', value: '1' },
      { label: 'Min Edges for V=7', value: '6 (Tree minimum)' },
      { label: 'Actual Edges', value: '9' },
      { label: 'BFS reachability', value: '100% from any node' },
    ],
    dsaRelevance: 'A single BFS or DFS invocation visits all vertices if and only if the graph is connected.',
  },
  disconnected_graph: {
    id: 'disconnected_graph',
    label: 'Disconnected Graph',
    category: 'structures',
    title: 'Disconnected Graph (2 Components)',
    mathNotation: 'G = C₁ ∪ C₂. V(C₁) ∩ V(C₂) = ∅, E(C₁, C₂) = ∅.',
    descriptionEnglish: 'A disconnected graph contains two or more independent subgraphs with no edge connecting them.',
    descriptionHinglish: 'Disconnected graph mein do alag independent components hote hain jinme koi aapsi edge nahi hoti.',
    nodes: [
      { id: '1', x: 90, y: 115 },
      { id: '2', x: 200, y: 115 },
      { id: '3', x: 145, y: 235 },
      { id: '4', x: 335, y: 115 },
      { id: '5', x: 435, y: 115 },
      { id: '6', x: 335, y: 235 },
      { id: '7', x: 435, y: 235 },
    ],
    edges: [
      { u: '1', v: '2' },
      { u: '2', v: '3' },
      { u: '3', v: '1' },
      { u: '4', v: '5' },
      { u: '4', v: '6' },
      { u: '5', v: '7' },
      { u: '6', v: '7' },
    ],
    isDisconnected: true,
    components: [
      { id: 'c1', label: 'Component 1 (C₁)', x: 50, y: 55, width: 190, height: 230 },
      { id: 'c2', label: 'Component 2 (C₂)', x: 285, y: 55, width: 195, height: 230 },
    ],
    defaultTab: 'theory',
    properties: [
      { label: 'Connected Components', value: '2 (C₁ & C₂)' },
      { label: 'Component 1 Nodes', value: '{1, 2, 3}' },
      { label: 'Component 2 Nodes', value: '{4, 5, 6, 7}' },
      { label: 'Cross-Component Edges', value: '0' },
    ],
    dsaRelevance: 'Solving "Number of Connected Components" (LeetCode 323) using Disjoint Set Union (DSU) or outer BFS loops.',
  },
  cyclic_graph: {
    id: 'cyclic_graph',
    label: 'Cyclic Graph',
    category: 'structures',
    title: 'Cyclic Graph (Cycle Present)',
    mathNotation: '∃ closed walk v₀-v₁-...-vₖ with v₀ = vₖ. Highlighted cycle: 1-2-3-4-5-1.',
    descriptionEnglish: 'A graph is cyclic if it contains at least one cycle where a node can reach itself through distinct edges.',
    descriptionHinglish: 'Cyclic graph mein kam se kam ek aisi loop hoti hai jisme chalte hue wapas usi node par aa sakte hain.',
    nodes: [
      { id: '1', x: 130, y: 90 },
      { id: '2', x: 260, y: 70 },
      { id: '3', x: 390, y: 150 },
      { id: '4', x: 310, y: 265 },
      { id: '5', x: 150, y: 265 },
    ],
    edges: [
      { u: '1', v: '2', isCycle: true },
      { u: '2', v: '3', isCycle: true },
      { u: '3', v: '4', isCycle: true },
      { u: '4', v: '5', isCycle: true },
      { u: '5', v: '1', isCycle: true },
      { u: '2', v: '4' },
    ],
    defaultTab: 'theory',
    properties: [
      { label: 'Cycle Present?', value: 'Yes (Length 5)' },
      { label: 'Is a Tree?', value: 'No (Trees are acyclic)' },
      { label: 'Cycle Detection', value: 'DFS back-edges / DSU' },
      { label: 'Total Edges', value: '6' },
    ],
    dsaRelevance: 'Deadlock detection in operating systems and detecting infinite dependency loops in package managers.',
  },
  dag_graph: {
    id: 'dag_graph',
    label: 'DAG (Acyclic)',
    category: 'structures',
    title: 'Directed Acyclic Graph (DAG)',
    mathNotation: 'Directed graph with NO directed cycles. Admits a topological ordering.',
    descriptionEnglish: 'A DAG is a directed graph with no closed paths. Nodes can be sorted in a linear sequence.',
    descriptionHinglish: 'DAG ek directed graph hai jisme koi cycle nahi hoti. Isme topological ordering sambhav hai.',
    nodes: [
      { id: '1', x: 85, y: 170 },
      { id: '2', x: 210, y: 85 },
      { id: '3', x: 210, y: 255 },
      { id: '4', x: 335, y: 85 },
      { id: '5', x: 335, y: 255 },
      { id: '6', x: 445, y: 170 },
    ],
    edges: [
      { u: '1', v: '2', directed: true },
      { u: '1', v: '3', directed: true },
      { u: '2', v: '4', directed: true },
      { u: '3', v: '4', directed: true },
      { u: '3', v: '5', directed: true },
      { u: '4', v: '6', directed: true },
      { u: '5', v: '6', directed: true },
    ],
    isDirected: true,
    defaultTab: 'theory',
    properties: [
      { label: 'Has Cycle?', value: 'No (Acyclic)' },
      { label: 'Topological Sort', value: 'Valid (1, 2/3, 4/5, 6)' },
      { label: 'Source Node', value: 'Node [1] (in-deg 0)' },
      { label: 'Sink Node', value: 'Node [6] (out-deg 0)' },
    ],
    dsaRelevance: 'Powers Kahn\'s algorithm, LeetCode Course Schedule, git commit history, and build systems (Make/Webpack).',
  },
  bipartite_graph: {
    id: 'bipartite_graph',
    label: 'Bipartite Graph',
    category: 'structures',
    title: 'Bipartite Graph (2 Partitions)',
    mathNotation: 'V = U ∪ V, U ∩ V = ∅. Every edge connects a node in U to a node in V.',
    descriptionEnglish: 'Vertices are partitioned into two disjoint sets U and V with edges only between the sets.',
    descriptionHinglish: 'Graph do alag sets U aur V mein banta hota hai jisme sabhi edges U se V mein connect hoti hain.',
    nodes: [
      { id: 'U1', x: 140, y: 85, set: 'U' },
      { id: 'U2', x: 140, y: 170, set: 'U' },
      { id: 'U3', x: 140, y: 255, set: 'U' },
      { id: 'V1', x: 380, y: 85, set: 'V' },
      { id: 'V2', x: 380, y: 170, set: 'V' },
      { id: 'V3', x: 380, y: 255, set: 'V' },
    ],
    edges: [
      { u: 'U1', v: 'V1' },
      { u: 'U1', v: 'V2' },
      { u: 'U2', v: 'V1' },
      { u: 'U2', v: 'V3' },
      { u: 'U3', v: 'V2' },
      { u: 'U3', v: 'V3' },
    ],
    isBipartite: true,
    defaultTab: 'theory',
    properties: [
      { label: 'Set U', value: '{U1, U2, U3}' },
      { label: 'Set V', value: '{V1, V2, V3}' },
      { label: 'Internal Edges (U-U / V-V)', value: '0 (None)' },
      { label: 'Odd Length Cycle?', value: 'Impossible (2-Colorable)' },
    ],
    dsaRelevance: 'Graph 2-coloring test via BFS/DFS (LeetCode 785) and Maximum Bipartite Matching algorithms.',
  },
  adj_matrix: {
    id: 'adj_matrix',
    label: 'Adj Matrix',
    category: 'representations',
    title: 'Adjacency Matrix (7×7 Grid)',
    mathNotation: 'M[u][v] = 1 (or weight) if (u, v) ∈ E, else 0. Space: O(V²). Lookup: O(1).',
    descriptionEnglish: 'A 2D matrix of size V × V. Symmetric for undirected graphs. Best for dense graphs.',
    descriptionHinglish: 'V × V size ka 2D matrix. Undirected graph ke liye symmetric hota hai.',
    nodes: [
      { id: '1', x: 120, y: 65 },
      { id: '4', x: 320, y: 65 },
      { id: '2', x: 80, y: 170 },
      { id: '3', x: 250, y: 170 },
      { id: '7', x: 440, y: 170 },
      { id: '5', x: 160, y: 275 },
      { id: '6', x: 360, y: 275 },
    ],
    edges: GRAPH_7_EDGES,
    defaultTab: 'matrix',
    properties: [
      { label: 'Space Complexity', value: 'O(V²)' },
      { label: 'Edge Lookup', value: 'O(1) Instant' },
      { label: 'Matrix Dimensions', value: '7 × 7 (49 cells)' },
      { label: 'Symmetry', value: 'Symmetric (Undirected)' },
    ],
    dsaRelevance: 'Used in Warshall\'s and Floyd-Warshall all-pairs shortest paths algorithms.',
  },
  adj_list: {
    id: 'adj_list',
    label: 'Adj List',
    category: 'representations',
    title: 'Adjacency List (Linked Vectors)',
    mathNotation: 'adj[u] = [v₁, v₂, ...] for all neighbors of vertex u. Space: O(V + E).',
    descriptionEnglish: 'An array of dynamic lists where each cell stores only connected neighbor vertices.',
    descriptionHinglish: 'Array of lists jisme har index par sirf jude huye neighbors store hote hain. Space O(V + E).',
    nodes: [
      { id: '1', x: 120, y: 65 },
      { id: '4', x: 320, y: 65 },
      { id: '2', x: 80, y: 170 },
      { id: '3', x: 250, y: 170 },
      { id: '7', x: 440, y: 170 },
      { id: '5', x: 160, y: 275 },
      { id: '6', x: 360, y: 275 },
    ],
    edges: GRAPH_7_EDGES,
    defaultTab: 'list',
    properties: [
      { label: 'Space Complexity', value: 'O(V + E) Optimal' },
      { label: 'Iterate Neighbors', value: 'O(deg(u))' },
      { label: 'Best For', value: 'Sparse Graphs (95%+ DSA problems)' },
      { label: 'Storage Savings', value: 'Saves 60%+ memory vs Matrix' },
    ],
    dsaRelevance: 'The universal representation used in competitive programming and technical interviews.',
  },
};

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

  const [selectedInspectNode, setSelectedInspectNode] = useState<string>('1');
  const [activeConceptKey, setActiveConceptKey] = useState<string>('vertices');
  const [startNode, setStartNode] = useState<string>('1');
  const [targetNode, setTargetNode] = useState<string>('6');
  const [graphPreset, setGraphPreset] = useState<'1' | '2'>('1');

  const activeNodes = graphPreset === '2'
    ? (isDijkstra || isKruskal || isPrims || isAStar ? DIJKSTRA_GRAPH2_NODES : GRAPH_GRAPH2_NODES)
    : (isDijkstra || isKruskal || isPrims || isAStar ? DIJKSTRA_NODES : GRAPH_7_NODES);

  // Switch Preset Handler
  const handleSwitchPreset = (p: '1' | '2') => {
    setGraphPreset(p);
    const newStartNode = '1';
    const newTargetNode = p === '2' ? (isDijkstra || isAStar ? '7' : '7') : '6';
    setStartNode(newStartNode);
    setTargetNode(newTargetNode);

    if (isBfs) handleRunBfs(newStartNode, p);
    else if (isDfs) handleRunDfs(newStartNode, p);
    else if (isDijkstra) handleRunDijkstra(newStartNode, newTargetNode);
    else if (isKruskal) handleRunKruskal();
    else if (isPrims) handleRunPrims(newStartNode);
    else if (isAStar) handleRunAStar(newStartNode, newTargetNode);
  };

  // Dispatch Fundamentals Graph Steps
  const selectFundamentalsConcept = useCallback((
    conceptId: string,
    nodeOverride?: string,
    tabOverride?: 'theory' | 'matrix' | 'list' | 'neighbors'
  ) => {
    const concept = FUNDAMENTALS_CONCEPTS[conceptId] || FUNDAMENTALS_CONCEPTS.vertices;
    const inspectNode = nodeOverride || concept.defaultInspectNode || concept.nodes[0]?.id || '1';
    const activeTab = tabOverride || concept.defaultTab || 'theory';

    // Calculate neighbors for the inspected node
    const isDirected = concept.isDirected === true;
    const inNeighbors: string[] = [];
    const outNeighbors: string[] = [];
    const neighborsSet = new Set<string>();

    concept.edges.forEach(e => {
      if (e.isSelfLoop && e.u === inspectNode) {
        neighborsSet.add(e.u);
      } else if (isDirected || e.directed) {
        if (e.u === inspectNode) {
          outNeighbors.push(e.v);
          neighborsSet.add(e.v);
        }
        if (e.v === inspectNode) {
          inNeighbors.push(e.u);
          neighborsSet.add(e.u);
        }
      } else {
        if (e.u === inspectNode) neighborsSet.add(e.v);
        if (e.v === inspectNode) neighborsSet.add(e.u);
      }
    });

    const neighbors = Array.from(neighborsSet);
    const inDeg = inNeighbors.length;
    const outDeg = outNeighbors.length;
    const degree = isDirected ? inDeg + outDeg : neighbors.length;

    const step: ExecutionStep = {
      step: 1,
      lineNum: 1,
      explanationEnglish: `[${concept.title}]: ${concept.descriptionEnglish} Inspecting Node [${inspectNode}] (Degree: ${degree}).`,
      explanationHinglish: `[${concept.title}]: ${concept.descriptionHinglish} Node [${inspectNode}] inspect kiya (Degree: ${degree}).`,
      memorySnapshot: {
        concept: concept.id,
        conceptTitle: concept.title,
        description: concept.descriptionEnglish,
        category: concept.category,
        mathNotation: concept.mathNotation,
        properties: concept.properties,
        dsaRelevance: concept.dsaRelevance,
        nodes: concept.nodes,
        edges: concept.edges,
        isDirected: concept.isDirected ?? false,
        isMultiGraph: concept.isMultiGraph ?? false,
        isBipartite: concept.isBipartite ?? false,
        isDisconnected: concept.isDisconnected ?? false,
        components: concept.components,
        activeTab,
        inspectNode,
        neighbors,
        inNeighbors,
        outNeighbors,
        inDegree: inDeg,
        outDegree: outDeg,
        degree,
        inspectingNeighbors: neighbors,
      },
      consoleOutput: `> [${concept.title}] Node [${inspectNode}] Degree = ${degree} (Neighbors: ${neighbors.join(', ') || 'None'})`,
      animationEvent: { type: 'NONE' } as any,
    };

    setActiveConceptKey(conceptId);
    setSelectedInspectNode(inspectNode);
    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 20);
  }, [setCustomSteps, goToStep, setIsPlaying]);

  // Initial auto-select on mount for graph_basics
  useEffect(() => {
    if (lesson?.topic === 'graph_basics') {
      selectFundamentalsConcept('vertices');
    }
  }, [lesson?.topic, selectFundamentalsConcept]);

  // Generate BFS Steps
  const handleRunBfs = useCallback((startV: string, pOverride?: '1' | '2') => {
    const p = pOverride || graphPreset;
    const nodes = p === '2' ? GRAPH_GRAPH2_NODES : GRAPH_7_NODES;
    const edges = p === '2' ? GRAPH_GRAPH2_EDGES : GRAPH_7_EDGES;
    const pos = p === '2' ? GRAPH_GRAPH2_NODE_POSITIONS : GRAPH_NODE_POSITIONS;

    const adjMap: Record<string, string[]> = {};
    nodes.forEach(n => { adjMap[n] = []; });
    edges.forEach(e => {
      adjMap[e.u].push(e.v);
      adjMap[e.v].push(e.u);
    });
    nodes.forEach(n => adjMap[n].sort((a, b) => parseInt(a) - parseInt(b)));

    const steps: ExecutionStep[] = [];
    const queueBuffer: (string | null)[] = Array(nodes.length).fill(null);
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
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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
          nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
          edges: edges,
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
          if (rearIdx < nodes.length) {
            queueBuffer[rearIdx++] = nbr;
          }
        });

        steps.push({
          step: stepCount++,
          lineNum: 3,
          explanationEnglish: `BFS Enqueue: Added unvisited neighbors [${newlyAdded.join(', ')}] to Visited array & Enqueued into Queue.`,
          explanationHinglish: `BFS Enqueue: Unvisited neighbors [${newlyAdded.join(', ')}] Visited aur Queue memory blocks me store ho gaye.`,
          memorySnapshot: {
            nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
            edges: edges,
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
      explanationEnglish: `BFS Complete! All ${nodes.length} nodes visited in Level-Order: [${bfsOrder.join(' ➔ ')}]`,
      explanationHinglish: `BFS Traversal Complete! Sabhi ${nodes.length} nodes visited: [${bfsOrder.join(' ➔ ')}]`,
      memorySnapshot: {
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
        queue: [...queueBuffer],
        frontIdx: Math.min(frontIdx, nodes.length - 1),
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
  }, [setCustomSteps, goToStep, setIsPlaying, graphPreset]);

  // Generate DFS Steps
  const handleRunDfs = useCallback((startV: string, pOverride?: '1' | '2') => {
    const p = pOverride || graphPreset;
    const nodes = p === '2' ? GRAPH_GRAPH2_NODES : GRAPH_7_NODES;
    const edges = p === '2' ? GRAPH_GRAPH2_EDGES : GRAPH_7_EDGES;
    const pos = p === '2' ? GRAPH_GRAPH2_NODE_POSITIONS : GRAPH_NODE_POSITIONS;

    const adjMap: Record<string, string[]> = {};
    nodes.forEach(n => { adjMap[n] = []; });
    edges.forEach(e => {
      adjMap[e.u].push(e.v);
      adjMap[e.v].push(e.u);
    });
    nodes.forEach(n => adjMap[n].sort((a, b) => parseInt(b) - parseInt(a)));

    const steps: ExecutionStep[] = [];
    const stackBuffer: (string | null)[] = Array(nodes.length).fill(null);
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
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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
          nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
          edges: edges,
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
          if (topIdx < nodes.length) {
            stackBuffer[topIdx] = nbr;
          }
        });

        steps.push({
          step: stepCount++,
          lineNum: 3,
          explanationEnglish: `DFS Push: Added unvisited neighbors [${newlyAdded.join(', ')}] to Visited array & Pushed onto Stack Top [${topIdx}].`,
          explanationHinglish: `DFS Push: Unvisited neighbors [${newlyAdded.join(', ')}] Stack ke Top par push kar diye gaye.`,
          memorySnapshot: {
            nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
            edges: edges,
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
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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
  }, [setCustomSteps, goToStep, setIsPlaying, graphPreset]);

  // Generate Dijkstra's Algorithm Steps
  const handleRunDijkstra = useCallback((startV: string, destV: string) => {
    const nodes = graphPreset === '2' ? DIJKSTRA_GRAPH2_NODES : DIJKSTRA_NODES;
    const edges = graphPreset === '2' ? DIJKSTRA_GRAPH2_EDGES : DIJKSTRA_EDGES;
    const pos = graphPreset === '2' ? DIJKSTRA_GRAPH2_POSITIONS : DIJKSTRA_NODE_POSITIONS;

    const distMap: Record<string, number> = {};
    const parentMap: Record<string, string | null> = {};
    const settledSet: string[] = [];

    nodes.forEach(n => {
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
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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

    const unvisited = [...nodes];

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
          nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
          edges: edges,
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

      const outgoing = edges.filter(e => e.u === u || e.v === u);

      for (const edge of outgoing) {
        const v = edge.u === u ? edge.v : edge.u;
        if (settledSet.includes(v)) continue;

        const weight = edge.weight ?? 1;
        const newDist = distMap[u] + weight;
        const oldDist = distMap[v];

        if (newDist < oldDist) {
          distMap[v] = newDist;
          parentMap[v] = u;

          steps.push({
            step: stepCount++,
            lineNum: 3,
            explanationEnglish: `Edge Relaxation [${u} ➔ ${v}]: dist[${u}] (${distMap[u]}) + weight (${weight}) = ${newDist} < dist[${v}] (${oldDist === Infinity ? '∞' : oldDist}). Updated dist[${v}] = ${newDist}!`,
            explanationHinglish: `Edge Relaxed [${u} ➔ ${v}]: ${distMap[u]} + ${weight} = ${newDist} < ${oldDist === Infinity ? '∞' : oldDist}. Node [${v}] ka naya shortest distance = ${newDist}!`,
            memorySnapshot: {
              nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
              edges: edges,
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
              nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
              edges: edges,
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
    const pathVisited = new Set<string>();
    while (curr !== null && !pathVisited.has(curr)) {
      pathVisited.add(curr);
      shortestPath.unshift(curr);
      curr = parentMap[curr];
    }

    steps.push({
      step: stepCount,
      lineNum: 4,
      explanationEnglish: `Dijkstra Complete! Shortest Path from Node [${startV}] ➔ Node [${destV}] is [${shortestPath.join(' ➔ ')}] with Total Distance = ${distMap[destV] === Infinity ? '∞' : distMap[destV]}.`,
      explanationHinglish: `Dijkstra Algorithm Complete! Node [${startV}] se Node [${destV}] ka shortest path: [${shortestPath.join(' ➔ ')}] (Total Distance = ${distMap[destV] === Infinity ? '∞' : distMap[destV]}).`,
      memorySnapshot: {
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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
  }, [setCustomSteps, goToStep, setIsPlaying, graphPreset]);

  // Generate Kruskal's MST Steps (Edge Sorting + Disjoint Set Union DSU)
  const handleRunKruskal = useCallback(() => {
    const nodes = graphPreset === '2' ? DIJKSTRA_GRAPH2_NODES : DIJKSTRA_NODES;
    const edges = graphPreset === '2' ? DIJKSTRA_GRAPH2_EDGES : DIJKSTRA_EDGES;
    const pos = graphPreset === '2' ? DIJKSTRA_GRAPH2_POSITIONS : DIJKSTRA_NODE_POSITIONS;

    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

    const parent: Record<string, string> = {};
    nodes.forEach(n => { parent[n] = n; });

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
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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
          nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
          edges: edges,
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
            nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
            edges: edges,
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
            nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
            edges: edges,
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

      if (mstEdges.length === nodes.length - 1) break;
    }

    steps.push({
      step: stepCount,
      lineNum: 4,
      explanationEnglish: `Kruskal Complete! Minimum Spanning Tree (MST) constructed with ${mstEdges.length} edges. Total Minimum Weight = ${totalMstWeight}.`,
      explanationHinglish: `Kruskal MST Complete! Total ${mstEdges.length} edges se Minimum Spanning Tree taiyar ho gaya. Total Minimum Weight = ${totalMstWeight}.`,
      memorySnapshot: {
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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
    const nodes = graphPreset === '2' ? DIJKSTRA_GRAPH2_NODES : DIJKSTRA_NODES;
    const edges = graphPreset === '2' ? DIJKSTRA_GRAPH2_EDGES : DIJKSTRA_EDGES;
    const pos = graphPreset === '2' ? DIJKSTRA_GRAPH2_POSITIONS : DIJKSTRA_NODE_POSITIONS;

    const mstSet: string[] = [startV];
    const mstEdges: { u: string; v: string; weight: number }[] = [];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let totalMstWeight = 0;

    const getCandidateEdges = (currentMst: string[]) => {
      const candidates: { u: string; v: string; weight: number }[] = [];
      edges.forEach(e => {
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
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
        mstSet: [...mstSet],
        mstEdges: [...mstEdges],
        candidateEdges: getCandidateEdges(mstSet),
        totalMstWeight,
        isPrims: true,
      },
      consoleOutput: `> Prim's Init at Node [${startV}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    while (mstSet.length < nodes.length) {
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
          nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
          edges: edges,
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
          nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
          edges: edges,
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
      explanationEnglish: `Prim's MST Complete! All ${nodes.length} nodes connected using ${mstEdges.length} edges. Total Minimum Weight = ${totalMstWeight}.`,
      explanationHinglish: `Prim's MST Complete! Sabhi ${nodes.length} nodes connect ho gaye. Total Minimum Weight = ${totalMstWeight}.`,
      memorySnapshot: {
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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
  }, [setCustomSteps, goToStep, setIsPlaying, graphPreset]);

  // Generate A* (A-Star) Algorithm Steps
  const handleRunAStar = useCallback((startV: string, destV: string) => {
    const nodes = graphPreset === '2' ? DIJKSTRA_GRAPH2_NODES : DIJKSTRA_NODES;
    const edges = graphPreset === '2' ? DIJKSTRA_GRAPH2_EDGES : DIJKSTRA_EDGES;
    const pos = graphPreset === '2' ? DIJKSTRA_GRAPH2_POSITIONS : DIJKSTRA_NODE_POSITIONS;

    const calcH = (nodeId: string, targetId: string): number => {
      const p1 = pos[nodeId];
      const p2 = pos[targetId];
      if (!p1 || !p2) return 0;
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      return Math.round(Math.sqrt(dx * dx + dy * dy) / 30);
    };

    const gMap: Record<string, number> = {};
    const hMap: Record<string, number> = {};
    const fMap: Record<string, number> = {};
    const parentMap: Record<string, string | null> = {};

    nodes.forEach(n => {
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
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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
          nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
          edges: edges,
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

      const neighbors = edges.filter(e => e.u === current || e.v === current);

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
              nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
              edges: edges,
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
    const astarVisited = new Set<string>();
    if (gMap[destV] !== Infinity) {
      while (currNode !== null && !astarVisited.has(currNode)) {
        astarVisited.add(currNode);
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
        nodes: nodes.map(id => ({ id, x: pos[id].x, y: pos[id].y })),
        edges: edges,
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
    const defaultStart = '1';
    const defaultTarget = graphPreset === '2' ? (isDijkstra || isAStar ? '8' : '9') : '6';
    setStartNode(defaultStart);
    setTargetNode(defaultTarget);

    if (isBfs) {
      handleRunBfs(defaultStart);
    } else if (isDfs) {
      handleRunDfs(defaultStart);
    } else if (isDijkstra) {
      handleRunDijkstra(defaultStart, defaultTarget);
    } else if (isKruskal) {
      handleRunKruskal();
    } else if (isPrims) {
      handleRunPrims(defaultStart);
    } else if (isAStar) {
      handleRunAStar(defaultStart, defaultTarget);
    } else if (lesson?.topic === 'graph_basics') {
      selectFundamentalsConcept(activeConceptKey || 'vertices', defaultStart);
    }
  }, [lesson?.id, lesson?.topic, graphPreset, isBfs, isDfs, isDijkstra, isKruskal, isPrims, isAStar, handleRunBfs, handleRunDfs, handleRunDijkstra, handleRunKruskal, handleRunPrims, handleRunAStar, selectFundamentalsConcept, activeConceptKey]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Header */}
      <div className="px-4 py-3 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            {isBfs ? `GRAPH BFS (${graphPreset === '2' ? '9 NODES' : '7 NODES'})` : isDfs ? `GRAPH DFS (${graphPreset === '2' ? '9 NODES' : '7 NODES'})` : isDijkstra ? 'DIJKSTRA ALGORITHM' : isKruskal ? 'KRUSKAL MST ALGORITHM' : isPrims ? "PRIM'S MST ALGORITHM" : isAStar ? 'A* SEARCH ALGORITHM' : 'GRAPH FUNDAMENTALS'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded font-semibold">
          {isBfs ? 'FIFO Queue Simulation' : isDfs ? 'LIFO Stack Backtracking' : isDijkstra ? 'Priority Queue' : isKruskal ? 'Disjoint Set Union (DSU)' : isPrims ? 'Min-Heap Priority Queue' : isAStar ? 'Heuristic f(n) = g + h' : 'Vertices'}
        </span>
      </div>

      {/* Pinned Stable Node Inspector (Graph Fundamentals, Never Scrolls) */}
      {!isBfs && !isDfs && !isDijkstra && !isKruskal && !isPrims && !isAStar && (
        <div className="px-3.5 py-2.5 bg-[#060814] border-b border-slate-800/90 shrink-0 font-mono flex flex-col gap-1.5 shadow-md">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider px-0.5">
            <span className="text-amber-400 font-bold">Inspect Node</span>
            <span className="text-[10px] text-amber-300 font-black px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800">
              Active: Node [{selectedInspectNode}]
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {((FUNDAMENTALS_CONCEPTS[activeConceptKey] || FUNDAMENTALS_CONCEPTS.vertices).nodes).map(n => n.id).map(id => (
              <button
                key={id}
                onClick={() => selectFundamentalsConcept(activeConceptKey, id)}
                className={`min-w-7 h-7 px-2 rounded-md font-mono text-xs font-bold transition-all border ${
                  selectedInspectNode === id
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-sm'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Control Panel Body */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col justify-between gap-4">

        <div className="flex flex-col gap-3.5">
          
          {isBfs || isDfs || isDijkstra || isKruskal || isPrims || isAStar ? (
            /* BFS / DFS / DIJKSTRA / KRUSKAL / PRIMS / ASTAR CONTROLS */
            <div className="flex flex-col gap-3">

              {/* GRAPH PRESET SELECTOR (BFS, DFS, DIJKSTRA ONLY) */}
              {!isKruskal && !isPrims && !isAStar && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                    <Eye size={13} className="text-cyan-400" /> Graph Preset:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSwitchPreset('1')}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all border ${
                        graphPreset === '1'
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      Graph 1
                    </button>
                    <button
                      onClick={() => handleSwitchPreset('2')}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all border ${
                        graphPreset === '2'
                          ? 'bg-purple-500 text-white border-purple-300 font-black shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      Graph 2
                    </button>
                  </div>
                </div>
              )}

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
                  <div className="flex items-center gap-1 flex-wrap">
                    {activeNodes.map(id => (
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
                        className={`w-6.5 h-6.5 rounded-lg font-mono text-xs font-bold transition-all border ${
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
                    <div className="flex items-center gap-1 flex-wrap">
                      {activeNodes.map(id => (
                        <button
                          key={id}
                          onClick={() => {
                            setTargetNode(id);
                            if (isDijkstra) handleRunDijkstra(startNode, id);
                            else if (isAStar) handleRunAStar(startNode, id);
                          }}
                          className={`w-6.5 h-6.5 rounded-lg font-mono text-xs font-bold transition-all border ${
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
            <div className="flex flex-col gap-3 font-mono">
              {/* Section A: Core Elements */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider px-0.5 border-b border-slate-800/80 pb-0.5">
                  <span>Core Elements</span>
                  <span className="text-[8.5px] text-slate-500">Definitions</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                  {[
                    { id: 'vertices', label: 'Vertices (V)' },
                    { id: 'edges', label: 'Edges (E)' },
                    { id: 'degree', label: 'Degree & Neighbors' },
                    { id: 'multigraph', label: 'Self-Loops / Multi-Edge' },
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => selectFundamentalsConcept(btn.id)}
                      className={`py-1.5 px-2 rounded-md font-mono text-[10.5px] text-left transition-all border ${
                        activeConceptKey === btn.id
                          ? 'bg-slate-800 border-indigo-400 text-indigo-200 font-bold'
                          : 'bg-slate-950/90 hover:bg-slate-900 border-slate-800/90 text-slate-300'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section B: Graph Types */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider px-0.5 border-b border-slate-800/80 pb-0.5">
                  <span>Graph Types</span>
                  <span className="text-[8.5px] text-slate-500">Classification</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                  {[
                    { id: 'null_graph', label: 'Null / Empty Graph' },
                    { id: 'trivial_graph', label: 'Trivial Graph (V=1)' },
                    { id: 'directed_graph', label: 'Directed Graph' },
                    { id: 'undirected_graph', label: 'Undirected Graph' },
                    { id: 'weighted_graph', label: 'Weighted Graph' },
                    { id: 'unweighted_graph', label: 'Unweighted Graph' },
                    { id: 'complete_graph', label: 'Complete Graph (Kn)' },
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => selectFundamentalsConcept(btn.id)}
                      className={`py-1.5 px-2 rounded-md font-mono text-[10.5px] text-left transition-all border ${
                        activeConceptKey === btn.id
                          ? 'bg-slate-800 border-indigo-400 text-indigo-200 font-bold'
                          : 'bg-slate-950/90 hover:bg-slate-900 border-slate-800/90 text-slate-300'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section C: Topological Structures */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider px-0.5 border-b border-slate-800/80 pb-0.5">
                  <span>Topological Structures</span>
                  <span className="text-[8.5px] text-slate-500">Connectivity</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                  {[
                    { id: 'connected_graph', label: 'Connected Graph' },
                    { id: 'disconnected_graph', label: 'Disconnected (2 Subgraphs)' },
                    { id: 'cyclic_graph', label: 'Cyclic Graph' },
                    { id: 'dag_graph', label: 'DAG (Acyclic)' },
                    { id: 'bipartite_graph', label: 'Bipartite (U & V)' },
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => selectFundamentalsConcept(btn.id)}
                      className={`py-1.5 px-2 rounded-md font-mono text-[10.5px] text-left transition-all border ${
                        activeConceptKey === btn.id
                          ? 'bg-slate-800 border-indigo-400 text-indigo-200 font-bold'
                          : 'bg-slate-950/90 hover:bg-slate-900 border-slate-800/90 text-slate-300'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section D: Data Representations */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider px-0.5 border-b border-slate-800/80 pb-0.5">
                  <span>Data Representations</span>
                  <span className="text-[8.5px] text-slate-500">Storage</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                  {[
                    { id: 'adj_matrix', label: 'Adjacency Matrix' },
                    { id: 'adj_list', label: 'Adjacency List' },
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => selectFundamentalsConcept(btn.id)}
                      className={`py-1.5 px-2 rounded-md font-mono text-[10.5px] text-left transition-all border ${
                        activeConceptKey === btn.id
                          ? 'bg-slate-800 border-indigo-400 text-indigo-200 font-bold'
                          : 'bg-slate-950/90 hover:bg-slate-900 border-slate-800/90 text-slate-300'
                      }`}
                    >
                      {btn.label}
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
