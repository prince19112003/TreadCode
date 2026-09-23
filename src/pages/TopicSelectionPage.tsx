import React, { useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Layers, ArrowLeft } from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { motion } from 'motion/react';
import { useModuleStore } from '@shared/hooks/useModuleStore';
import { useThemeStore } from '@shared/hooks/useThemeStore';

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
  { id: 'operators', number: '02', name: 'Operators', subtitle: 'Arithmetic & Expressions', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#10b981' },
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
  { id: 'variables', number: '01', name: 'Variables', subtitle: 'Data Storage & Memory', programsCount: 6, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#f97316' },
  { id: 'type_casting', number: '02', name: 'Type Casting', subtitle: 'Type Conversion & Widening', programsCount: 2, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#eab308' },
  { id: 'operators_expressions', number: '03', name: 'Operators', subtitle: 'Arithmetic & Formulas', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#10b981' },
  { id: 'user_input', number: '04', name: 'User Input', subtitle: 'Scanner Class Reading', programsCount: 3, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#14b8a6' },
  { id: 'if_else', number: '05', name: 'If Else', subtitle: 'Two-Path Decisions', programsCount: 4, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#6366f1' },
  { id: 'if_elif_else', number: '06', name: 'If Else If', subtitle: 'Multi-Branch Decision Ladder', programsCount: 5, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#4f46e5' },
  { id: 'switch_case', number: '07', name: 'Switch Case', subtitle: 'Menu & Option Selection', programsCount: 5, difficulty: 'Beginner' as const, category: 'basics', accentColor: '#ec4899' },
  { id: 'for_loop', number: '08', name: 'For Loop', subtitle: 'Counted Iteration', programsCount: 5, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#06b6d4' },
  { id: 'while_loop', number: '09', name: 'While Loop', subtitle: 'Conditional Repetition', programsCount: 5, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#0891b2' },
  { id: 'do_while_loop', number: '10', name: 'Do-While Loop', subtitle: 'Exit-Controlled Repetition', programsCount: 2, difficulty: 'Intermediate' as const, category: 'loops', accentColor: '#0284c7' },
  { id: 'strings', number: '11', name: 'Strings', subtitle: 'Text & ASCII Character Processing', programsCount: 5, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#8b5cf6' },
  { id: 'arrays_1d', number: '12', name: '1D Arrays', subtitle: 'Indexed Array Memory', programsCount: 4, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#f59e0b' },
  { id: 'arrays_2d', number: '13', name: '2D Arrays', subtitle: 'Row-Column Matrix Grids', programsCount: 3, difficulty: 'Intermediate' as const, category: 'data', accentColor: '#d97706' },
  { id: 'methods', number: '14', name: 'Methods (Functions)', subtitle: 'Parameters, Return & Call Stack', programsCount: 4, difficulty: 'Intermediate' as const, category: 'functions', accentColor: '#a855f7' },
  { id: 'recursion', number: '15', name: 'Recursion', subtitle: 'Base Cases & Recursive Call Stack', programsCount: 4, difficulty: 'Advanced' as const, category: 'functions', accentColor: '#ec4899' },
];

/* =========================================================
   DSA TOPIC DATA — New structure with icons, complexity, tags
   ========================================================= */
const dsaTopics = [
  { id: 'linear_search', number: '01', name: 'Linear Search', subtitle: 'Sequential search from index 0 to N-1 for target match', complexity: 'O(N)', programsCount: 1, difficulty: 'Beginner' as const, category: 'Algorithm', accentColor: '#38bdf8' },
  { id: 'binary_search', number: '02', name: 'Binary Search', subtitle: 'Divide & conquer: halve search space using low, mid, high', complexity: 'O(log N)', programsCount: 2, difficulty: 'Intermediate' as const, category: 'Algorithm', accentColor: '#06b6d4' },
  { id: 'bubble_sort', number: '03', name: 'Bubble Sort', subtitle: 'Bubble adjacent elements to sort array', complexity: 'O(N²)', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Algorithm', accentColor: '#a855f7' },
  { id: 'selection_sort', number: '04', name: 'Selection Sort', subtitle: 'Select minimum element to swap repeatedly', complexity: 'O(N²)', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Algorithm', accentColor: '#8b5cf6' },
  { id: 'insertion_sort', number: '05', name: 'Insertion Sort', subtitle: 'Insert elements sequentially into sorted sublist', complexity: 'O(N²)', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Algorithm', accentColor: '#6366f1' },
  { id: 'merge_sort', number: '06', name: 'Merge Sort', subtitle: 'Divide and conquer recursive array merge', complexity: 'O(N log N)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Algorithm', accentColor: '#ec4899' },
  { id: 'heap_sort', number: '07', name: 'Heap Sort', subtitle: 'Build max heap and swap root repeatedly', complexity: 'O(N log N)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Algorithm', accentColor: '#f97316' },
  { id: 'hashset', number: '08', name: 'HashSet (Unique Keys)', subtitle: 'h(key) = key % 7 Hash Buckets. Unique elements only', complexity: 'O(1) Avg', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Data Struct', accentColor: '#10b981' },
  { id: 'hashmap', number: '09', name: 'HashMap (Key-Value Map)', subtitle: 'h(key) = Hash Buckets. Key-Value mapping', complexity: 'O(1) Avg', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Data Struct', accentColor: '#6366f1' },
  { id: 'stack', number: '10', name: 'Stack (LIFO)', subtitle: 'Push, Pop, Peek, Search & Traverse', complexity: 'O(1)', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Data Struct', accentColor: '#ec4899' },
  { id: 'queue', number: '11', name: 'Queue (FIFO)', subtitle: 'Enqueue, Dequeue & Front/Rear Pointers', complexity: 'O(1)', programsCount: 2, difficulty: 'Intermediate' as const, category: 'Data Struct', accentColor: '#06b6d4' },
  { id: 'singly_linked_list', number: '12', name: 'Singly Linked List', subtitle: 'Node → Data | Next Pointer Chain', complexity: 'O(N)', programsCount: 2, difficulty: 'Intermediate' as const, category: 'Data Struct', accentColor: '#8b5cf6' },
  { id: 'doubly_linked_list', number: '13', name: 'Doubly Linked List', subtitle: 'Prev ↔ Data ↔ Next Bidirectional Links', complexity: 'O(N)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Data Struct', accentColor: '#6366f1' },
  { id: 'binary_tree', number: '14', name: 'Binary Search Tree (BST)', subtitle: 'Insert, Delete, Search & Traversals (Inorder, Preorder, Postorder)', complexity: 'O(log N)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Data Struct', accentColor: '#a78bfa' },
  { id: 'graph_basics', number: '15', name: 'Graph Fundamentals', subtitle: 'Vertices, Edges & Adjacency Matrix', complexity: 'O(V+E)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#eab308' },
  { id: 'graph_bfs', number: '16', name: 'Graph BFS Traversal', subtitle: 'Breadth-First Queue-based Level-Order Path Scan', complexity: 'O(V+E)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#10b981' },
  { id: 'graph_dfs', number: '17', name: 'Graph DFS Traversal', subtitle: 'Depth-First Stack-based Backtracking Path Scan', complexity: 'O(V+E)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#8b5cf6' },
  { id: 'graph_dijkstra', number: '18', name: "Dijkstra's Algorithm", subtitle: 'Single-Source Shortest Path in Weighted Graph', complexity: 'O((V+E) log V)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#38bdf8' },
  { id: 'graph_kruskal', number: '19', name: "Kruskal's Algorithm", subtitle: 'Minimum Spanning Tree (MST) via Disjoint Set Union', complexity: 'O(E log E)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#f59e0b' },
  { id: 'graph_prims', number: '20', name: "Prim's Algorithm", subtitle: 'Minimum Spanning Tree (MST) via Priority Queue', complexity: 'O((V+E) log V)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#10b981' },
  { id: 'graph_astar', number: '21', name: 'A* Search Algorithm', subtitle: 'Heuristic Optimal Pathfinding f(n) = g(n) + h(n)', complexity: 'O(E log V)', programsCount: 1, difficulty: 'Advanced' as const, category: 'Graph', accentColor: '#ec4899' },
];

/* =========================================================
   MACHINE LEARNING TOPIC DATA — Sequenced Learning Path
   ========================================================= */
const mlTopics = [
  // ── SUPERVISED LEARNING: REGRESSION ───────────────────
  { id: 'linear_regression', number: '01', name: 'Linear Regression', subtitle: 'Best-Fit Line, Slope (m), Intercept & MSE Residuals', programsCount: 1, difficulty: 'Beginner' as const, category: 'Supervised', modelType: 'Regression', accentColor: '#06b6d4' },
  { id: 'polynomial_regression', number: '02', name: 'Polynomial Regression', subtitle: 'Non-linear Data Curves, Polynomial Degree & Curve Fitting', programsCount: 1, difficulty: 'Beginner' as const, category: 'Supervised', modelType: 'Regression', accentColor: '#0ea5e9' },
  
  // ── SUPERVISED LEARNING: CLASSIFICATION ───────────────
  { id: 'logistic_regression', number: '03', name: 'Logistic Regression', subtitle: 'Binary Classes, Sigmoid S-Curve & Probability Threshold', programsCount: 1, difficulty: 'Beginner' as const, category: 'Supervised', modelType: 'Classification', accentColor: '#3b82f6' },
  { id: 'knn_classification', number: '04', name: 'K-Nearest Neighbors (KNN)', subtitle: 'Distance-Based Voting, Radius Search & Decision Boundaries', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Supervised', modelType: 'Classification', accentColor: '#8b5cf6' },
  { id: 'decision_tree', number: '05', name: 'Decision Tree Classifier', subtitle: 'Orthogonal Axis Splits, Information Gain & Space Partitioning', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Supervised', modelType: 'Classification', accentColor: '#10b981' },
  { id: 'svm', number: '06', name: 'Support Vector Machine (SVM)', subtitle: 'Maximum Margin Hyperplane, Margins & Support Vectors', programsCount: 1, difficulty: 'Advanced' as const, category: 'Supervised', modelType: 'Classification', accentColor: '#ec4899' },
  
  // ── UNSUPERVISED LEARNING ─────────────────────────────
  { id: 'kmeans_clustering', number: '07', name: 'K-Means Clustering', subtitle: 'Centroid Shift, Point Assignment & Cluster Convergence', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Unsupervised', modelType: 'Clustering', accentColor: '#f59e0b' },
  
  // ── OPTIMIZATION & MODEL EVALUATION ───────────────────
  { id: 'gradient_descent', number: '08', name: 'Gradient Descent', subtitle: 'Convex Loss Curve, Step Size & Learning Rate (α) Tuning', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Optimization', modelType: 'Optimization', accentColor: '#f97316' },
  { id: 'overfitting_underfitting', number: '09', name: 'Overfitting vs Underfitting', subtitle: 'Bias-Variance Tradeoff, Noise Fitting & Sweet Spot', programsCount: 1, difficulty: 'Beginner' as const, category: 'Evaluation', modelType: 'Evaluation', accentColor: '#a855f7' },
  
  // ── REINFORCEMENT LEARNING ────────────────────────────
  { id: 'q_learning_grid', number: '10', name: 'Grid World (Q-Learning)', subtitle: 'Agent Environment, Penalties, Rewards & Policy Convergence', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Reinforcement', modelType: 'Reinforcement', accentColor: '#14b8a6' },
  
  // ── NEURAL NETWORKS FOUNDATION ────────────────────────
  { id: 'single_perceptron', number: '11', name: 'Single Perceptron', subtitle: 'Artificial Neuron, Synaptic Weights, Bias & Step Activation', programsCount: 1, difficulty: 'Intermediate' as const, category: 'Neural Nets', modelType: 'Neural Nets', accentColor: '#6366f1' },
];

/* =========================================================
   COMPUTER NETWORKS TOPIC DATA — Basics & Fundamentals
   ========================================================= */
const networkingTopics = [
  {
    id: 'osi_model',
    number: '01',
    name: 'OSI 7-Layer Model',
    subtitle: 'Encapsulation & Decapsulation across Application to Physical',
    programsCount: 1,
    difficulty: 'Beginner' as const,
    category: 'Architecture',
    layer: 'L1 - L7 Layers',
    accentColor: '#0ea5e9',
  },
  {
    id: 'tcp_ip_model',
    number: '02',
    name: 'TCP/IP 4-Layer Suite',
    subtitle: 'DoD Protocol Architecture & Packet Structure',
    programsCount: 1,
    difficulty: 'Beginner' as const,
    category: 'Architecture',
    layer: 'Internet Suite',
    accentColor: '#38bdf8',
  },
  {
    id: 'network_topologies',
    number: '03',
    name: 'Network Topologies',
    subtitle: 'Star, Mesh, Bus, Ring & Hybrid Device Interconnections',
    programsCount: 1,
    difficulty: 'Beginner' as const,
    category: 'Physical',
    layer: 'Layer 1 & 2',
    accentColor: '#06b6d4',
  },
  {
    id: 'ipv4_addressing',
    number: '04',
    name: 'IPv4 Addressing & Classes',
    subtitle: '32-Bit Dotted Decimal, Class A-E & Private Ranges',
    programsCount: 1,
    difficulty: 'Beginner' as const,
    category: 'Addressing',
    layer: 'Network (L3)',
    accentColor: '#10b981',
  },
  {
    id: 'tcp_vs_udp',
    number: '05',
    name: 'TCP vs UDP Protocols',
    subtitle: 'Reliable Byte Stream vs Low-Latency Datagram Comparison',
    programsCount: 1,
    difficulty: 'Beginner' as const,
    category: 'Transport',
    layer: 'Transport (L4)',
    accentColor: '#8b5cf6',
  },
  {
    id: 'subnetting_cidr',
    number: '06',
    name: 'Subnetting & CIDR Basics',
    subtitle: 'Slash Notation (/24, /27), Network Mask & Host Bits',
    programsCount: 1,
    difficulty: 'Intermediate' as const,
    category: 'Addressing',
    layer: 'Network (L3)',
    accentColor: '#f59e0b',
  },
  {
    id: 'tcp_handshake',
    number: '07',
    name: 'TCP 3-Way Handshake',
    subtitle: 'SYN, SYN-ACK, ACK Connection Setup & FIN Teardown',
    programsCount: 1,
    difficulty: 'Intermediate' as const,
    category: 'Transport',
    layer: 'Transport (L4)',
    accentColor: '#6366f1',
  },
  {
    id: 'dns_resolution',
    number: '08',
    name: 'DNS Resolution Lifecycle',
    subtitle: 'Client Query to Root, TLD & Authoritative Nameservers',
    programsCount: 1,
    difficulty: 'Intermediate' as const,
    category: 'Application',
    layer: 'Application (L7)',
    accentColor: '#ec4899',
  },
];

/* =========================================================
   PAGE
   ========================================================= */
export const TopicSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { languageId } = useParams();
  const { moduleStatus, isInitialized, init } = useModuleStore();
  const { isLight } = useThemeStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (isInitialized && languageId && languageId !== 'python') {
      const PACK_IDS = ['c', 'cpp', 'java', 'dsa', 'ml', 'networking'];
      if (PACK_IDS.includes(languageId) && moduleStatus[languageId] !== 'installed') {
        navigate('/');
      }
    }
  }, [isInitialized, languageId, moduleStatus, navigate]);

  const isDsa = languageId === 'dsa';
  const isMl = languageId === 'ml';
  const isNetworking = languageId === 'networking';

  const topics = useMemo(() => {
    if (languageId === 'c') return cTopics;
    if (languageId === 'cpp') return cppTopics;
    if (languageId === 'java') return javaTopics;
    if (isDsa) return dsaTopics;
    if (isMl) return mlTopics;
    if (isNetworking) return networkingTopics;
    return pythonTopics;
  }, [languageId, isDsa, isMl, isNetworking]);

  const totalPrograms = useMemo(() => topics.reduce((s, t) => s + t.programsCount, 0), [topics]);
  const langDisplay = languageId
    ? (languageId === 'cpp' ? 'C++' : languageId === 'dsa' ? 'DSA' : languageId === 'ml' ? 'Machine Learning' : languageId === 'networking' ? 'Computer Networks' : languageId.charAt(0).toUpperCase() + languageId.slice(1))
    : 'Python';

  const handleTopicClick = (topicId: string) => {
    if (isMl) {
      navigate(`/visualizer/ml/${topicId}/ml_${topicId}`);
    } else if (isNetworking) {
      navigate(`/visualizer/networking/${topicId}/net_${topicId}`);
    } else if (isDsa) {
      let programId = `dsa_${topicId}`;
      if (topicId === 'linear_search') programId = 'dsa_linear_search';
      else if (topicId === 'binary_search') programId = 'dsa_binary_search';
      else if (topicId === 'stack') programId = 'dsa_stack_push_pop';
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
      else if (topicId === 'hashset') programId = 'dsa_hashset';
      else if (topicId === 'hashmap') programId = 'dsa_hashmap';
      navigate(`/visualizer/${languageId}/${topicId}/${programId}`);
    } else {
      navigate(`/topics/${languageId}/programs/${topicId}`);
    }
  };

  /* ── STANDARD LANGUAGE PAGE ────────────────────────────────────────────── */
  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full relative">
      <div className="flex flex-col pt-4 md:pt-6 pb-12 px-4 sm:px-6 max-w-7xl mx-auto w-full min-h-full relative z-10">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/languages')}
            className={`inline-flex items-center gap-1.5 text-xs font-medium mb-3 cursor-pointer transition-colors ${
              isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modules</span>
          </button>
          <h1 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {langDisplay} Topics
          </h1>
          <p className={`text-xs md:text-sm mt-1 transition-colors ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            {isMl
              ? 'Intuitive, code-free algorithm playgrounds and visual model simulations.'
              : isNetworking
              ? 'Interactive packet flow, protocol handshakes, and network topology simulations.'
              : 'Select a topic to step through code execution and variable tracing.'}
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex gap-2 mb-6 flex-wrap">
          {[
            { icon: Layers, label: `${topics.length} Topics`, color: '#6366f1' },
            ...(isMl
              ? [{ icon: BookOpen, label: `${topics.length} Interactive Playgrounds`, color: '#06b6d4' }]
              : isNetworking
              ? [{ icon: BookOpen, label: `${topics.length} Network Topics`, color: '#0ea5e9' }]
              : !isDsa
              ? [{ icon: BookOpen, label: `${totalPrograms} Programs`, color: '#a855f7' }]
              : []),
          ].map(stat => (
            <div
              key={stat.label}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
              style={{
                background: isLight ? '#ffffff' : '#0b0d13',
                border: `1px solid ${isLight ? '#cbd5e1' : '#1e2433'}`,
                boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
              }}
            >
              <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Topic Grid: 4 Cards per row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 pb-12">
          {(topics as typeof pythonTopics).map((topic, index) => {
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.025, ease: 'easeOut' }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Select topic ${topic.name}`}
                  onClick={() => handleTopicClick(topic.id)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleTopicClick(topic.id)}
                  className="relative flex flex-col justify-between overflow-hidden rounded-lg p-4.5 min-h-42 transition-all duration-200 group select-none"
                  style={{
                    background: isLight ? '#ffffff' : '#0b0d13',
                    border: `1px solid ${isLight ? '#cbd5e1' : '#1e2433'}`,
                    boxShadow: isLight
                      ? '0 1px 3px 0 rgba(15, 23, 42, 0.10), 0 4px 12px -2px rgba(15, 23, 42, 0.08)'
                      : 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = isLight ? '#ffffff' : '#11141d';
                    el.style.borderColor = topic.accentColor || '#3b82f6';
                    el.style.transform = 'translateY(-2px)';
                    el.style.boxShadow = isLight
                      ? '0 14px 28px -4px rgba(15, 23, 42, 0.14), 0 4px 10px -2px rgba(15, 23, 42, 0.08)'
                      : '0 8px 24px -4px rgba(0, 0, 0, 0.85)';
                    const num = el.querySelector('.chapter-num') as HTMLElement;
                    if (num) num.style.color = isLight ? '#334155' : 'rgba(255, 255, 255, 0.45)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = isLight ? '#ffffff' : '#0b0d13';
                    el.style.borderColor = isLight ? '#cbd5e1' : '#1e2433';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = isLight
                      ? '0 1px 3px 0 rgba(15, 23, 42, 0.10), 0 4px 12px -2px rgba(15, 23, 42, 0.08)'
                      : 'none';
                    const num = el.querySelector('.chapter-num') as HTMLElement;
                    if (num) num.style.color = isLight ? '#64748b' : 'rgba(255, 255, 255, 0.20)';
                  }}
                >
                  {/* Top Header: Watermark Number only */}
                  <div className="flex justify-between items-start mb-1.5">
                    <span
                      className="chapter-num font-mono font-black select-none transition-colors duration-200"
                      style={{
                        fontSize: '34px',
                        lineHeight: 1,
                        color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.20)'
                      }}
                    >
                      {topic.number}
                    </span>
                  </div>

                  {/* Body: Larger Topic Title & Subtitle */}
                  <div className="mt-1">
                    <h2 className={`text-xl font-bold mb-1 leading-snug tracking-tight transition-colors ${
                      isLight ? 'text-slate-950 group-hover:text-blue-600' : 'text-white group-hover:text-blue-300'
                    }`}>
                      {topic.name}
                    </h2>
                    <p className={`text-xs line-clamp-1 leading-normal font-medium transition-colors ${
                      isLight ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {topic.subtitle}
                    </p>
                  </div>

                  {/* Footer: Functional info only */}
                  <div className="flex items-center justify-between text-xs font-medium pt-2.5 mt-3.5 border-t" style={{
                    borderColor: isLight ? '#cbd5e1' : '#171c26'
                  }}>
                    {'complexity' in topic ? (
                      <>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          TIME COMPLEXITY
                        </span>
                        <span className="text-xs font-mono font-extrabold" style={{ color: topic.accentColor }}>
                          {(topic as any).complexity}
                        </span>
                      </>
                    ) : isMl ? (
                      <div className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800 font-semibold' : 'text-slate-300'}`}>
                        <BookOpen className="w-3.5 h-3.5" style={{ color: topic.accentColor }} />
                        <span className="text-xs font-mono font-semibold">Interactive Model</span>
                      </div>
                    ) : isNetworking ? (
                      <div className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800 font-semibold' : 'text-slate-300'}`}>
                        <BookOpen className="w-3.5 h-3.5" style={{ color: topic.accentColor }} />
                        <span className="text-xs font-mono font-semibold">{(topic as any).layer}</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800 font-semibold' : 'text-slate-300'}`}>
                        <BookOpen className="w-3.5 h-3.5" style={{ color: topic.accentColor }} />
                        <span className="text-xs font-semibold">{topic.programsCount} Programs</span>
                      </div>
                    )}
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
