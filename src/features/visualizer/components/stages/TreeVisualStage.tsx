import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLesson } from '../../../../lessons/LessonContext';

interface TreeNode {
  val: string | number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
}

// Convert flat BST array to Tree Node hierarchy
const buildTreeFromList = (list: (string | number)[]): TreeNode | null => {
  if (list.length === 0) return null;
  const nodes = list.map(v => (v === null || v === undefined ? null : { val: v } as TreeNode));

  // BST Insertion logic for interactive list
  const root = nodes[0];
  if (!root) return null;

  for (let i = 1; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;
    insertBST(root, node);
  }

  // Calculate coordinates recursively
  calculateCoords(root, 0, 800, 40, 60);
  return root;
};

const insertBST = (parent: TreeNode, node: TreeNode) => {
  if (Number(node.val) < Number(parent.val)) {
    if (!parent.left) {
      parent.left = node;
    } else {
      insertBST(parent.left, node);
    }
  } else {
    if (!parent.right) {
      parent.right = node;
    } else {
      insertBST(parent.right, node);
    }
  }
};

const calculateCoords = (
  node: TreeNode | undefined,
  leftBoundary: number,
  rightBoundary: number,
  y: number,
  levelGap: number
) => {
  if (!node) return;
  const midX = (leftBoundary + rightBoundary) / 2;
  node.x = midX;
  node.y = y;

  calculateCoords(node.left, leftBoundary, midX, y + levelGap, levelGap);
  calculateCoords(node.right, midX, rightBoundary, y + levelGap, levelGap);
};

// Render links and nodes lists flatly
const collectTreeVisualElements = (
  node: TreeNode | null,
  elements: { nodes: TreeNode[]; links: { fromX: number; fromY: number; toX: number; toY: number }[] } = { nodes: [], links: [] }
) => {
  if (!node) return elements;
  elements.nodes.push(node);

  if (node.left && typeof node.x === 'number' && typeof node.y === 'number' && typeof node.left.x === 'number' && typeof node.left.y === 'number') {
    elements.links.push({ fromX: node.x, fromY: node.y, toX: node.left.x, toY: node.left.y });
    collectTreeVisualElements(node.left, elements);
  }
  if (node.right && typeof node.x === 'number' && typeof node.y === 'number' && typeof node.right.x === 'number' && typeof node.right.y === 'number') {
    elements.links.push({ fromX: node.x, fromY: node.y, toX: node.right.x, toY: node.right.y });
    collectTreeVisualElements(node.right, elements);
  }
  return elements;
};

const getListFromStep = (step: any): { list: (string | number)[]; capacity: number } => {
  if (!step) return { list: [], capacity: 7 };
  const mem = step.memorySnapshot;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 7;
  if (Array.isArray(mem?.list)) return { list: mem.list, capacity: cap };
  if (typeof mem?.list === 'string') {
    try { return { list: JSON.parse(mem.list), capacity: cap }; } catch { return { list: [], capacity: cap }; }
  }
  const ev = step.animationEvent;
  if (ev?.listState) return { list: ev.listState, capacity: cap };
  return { list: [], capacity: cap };
};

export const TreeVisualStage: React.FC = () => {
  const { currentStep, zoom } = useLesson();

  const { list: listItems, capacity: CAPACITY } = getListFromStep(currentStep);
  const ev = currentStep?.animationEvent as any;
  const activeVal: string | number | undefined = ev?.activeNodeValue ?? currentStep?.memorySnapshot?.activeNodeValue;

  const root = buildTreeFromList(listItems);
  const { nodes: treeNodes, links: treeLinks } = collectTreeVisualElements(root);

  const isEmpty = listItems.length === 0;
  const isFull = listItems.length >= CAPACITY;
  const isUnderflow = (ev?.type === 'TREE_DELETE' && isEmpty) || (currentStep?.explanationEnglish?.includes('Underflow'));

  return (
    <div className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-auto relative py-8 px-4">
      <div
        className="flex flex-col items-center gap-4 my-auto transition-transform duration-200 ease-out origin-top w-full"
        style={{ transform: `scale(${zoom})`, maxWidth: '800px' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse" />
          <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-violet-400/90">
            Binary Search Tree (BST) — Max Nodes {CAPACITY}
          </span>
          <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse" />
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {isFull && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 text-[11px] font-mono font-black tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              MAX TREE NODES LIMIT ({listItems.length}/{CAPACITY})
            </motion.div>
          )}
          {isUnderflow && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[11px] font-mono font-black tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              UNDERFLOW: TREE IS EMPTY
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tree Render Canvas Area */}
        <div
          className="relative border border-slate-800/40 bg-slate-950/20 rounded-2xl overflow-hidden py-4"
          style={{ width: '800px', height: '340px' }}
        >
          {isEmpty ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-700 text-xs font-mono">
              [EMPTY TREE - INSERT NODES TO START BRANCHING]
            </div>
          ) : (
            <svg className="w-full h-full pointer-events-none">
              {/* Render branches */}
              {treeLinks.map((link, idx) => (
                <line
                  key={idx}
                  x1={link.fromX}
                  y1={link.fromY}
                  x2={link.toX}
                  y2={link.toY}
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="transition-all duration-300"
                />
              ))}

              {/* Render Nodes as SVG foreignObjects to enable HTML styling inside SVG map */}
              {treeNodes.map((node, idx) => {
                const isActive = activeVal !== undefined && node.val === activeVal;
                return (
                  <g key={idx}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="19"
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'fill-violet-950/80 stroke-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                          : 'fill-slate-900 stroke-slate-700'
                      }`}
                      strokeWidth="2.5"
                    />
                    <text
                      x={node.x}
                      y={(node.y ?? 0) + 4}
                      textAnchor="middle"
                      className="fill-slate-200 text-xs font-mono font-black select-none pointer-events-none"
                    >
                      {node.val}
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
            <span className={`w-1.5 h-1.5 rounded-full ${isEmpty ? 'bg-slate-500' : isFull ? 'bg-red-500' : 'bg-violet-500'}`} />
            <span className="text-slate-500">{isEmpty ? 'Empty' : isFull ? 'Full' : 'Active'}</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">Nodes count: <span className="text-slate-300 font-bold">{listItems.length}/{CAPACITY}</span></span>
        </div>
      </div>
    </div>
  );
};
