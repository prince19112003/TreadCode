import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, CheckCircle2, Zap, ShieldAlert, Pin } from 'lucide-react';
import { useLessonStore } from '../../../lessons/useLessonStore';

interface ExamNoteContent {
  title: string;
  subtitle: string;
  examDefinition: string;
  realWorldAnalogy: string;
  keyPoints: string[];
  keyOps: Array<{ op: string; desc: string; time: string }>;
}

const EXAM_NOTES_DB: Record<string, ExamNoteContent> = {
  stack: {
    title: 'Stack CheatSheet (LIFO)',
    subtitle: 'Core Concepts & Algorithmic Summary',
    examDefinition: 'Linear data structure following Last In First Out. Insertion (PUSH) and Deletion (POP) occur strictly at TOP.',
    realWorldAnalogy: 'Stack of plates — last plate placed on top is the first one removed.',
    keyPoints: [
      'TOP = -1 → Stack is Empty (Underflow on Pop).',
      'TOP = Capacity - 1 → Stack is Full (Overflow on Push).',
      'Used in Recursion, Expression Parsing, and Undo/Redo.',
    ],
    keyOps: [
      { op: 'Push(x)', desc: 'TOP = TOP + 1; Stack[TOP] = x;', time: 'O(1)' },
      { op: 'Pop()', desc: 'val = Stack[TOP]; TOP = TOP - 1;', time: 'O(1)' },
      { op: 'Peek()', desc: 'return Stack[TOP];', time: 'O(1)' },
    ],
  },
  queue: {
    title: 'Queue CheatSheet (FIFO)',
    subtitle: 'Core Concepts & Algorithmic Summary',
    examDefinition: 'Linear data structure following First In First Out. Enqueue happens at REAR and Dequeue happens at FRONT.',
    realWorldAnalogy: 'Customer line at ticket counter — first person to enter is served first.',
    keyPoints: [
      'FRONT = -1, REAR = -1 → Queue is Empty.',
      'Circular Queue formula: REAR = (REAR + 1) % Capacity.',
      'Used in CPU Scheduling (Round-Robin) & BFS Graph Traversal.',
    ],
    keyOps: [
      { op: 'Enqueue(x)', desc: 'REAR = REAR + 1; Queue[REAR] = x;', time: 'O(1)' },
      { op: 'Dequeue()', desc: 'val = Queue[FRONT]; FRONT = FRONT + 1;', time: 'O(1)' },
      { op: 'Peek Front()', desc: 'return Queue[FRONT];', time: 'O(1)' },
    ],
  },
  singly_linked_list: {
    title: 'Singly Linked List CheatSheet (SLL)',
    subtitle: 'Core Concepts & Algorithmic Summary',
    examDefinition: 'Dynamic linear structure of memory nodes, where each node contains Data and a Next Pointer to the next node.',
    realWorldAnalogy: 'Treasure hunt clues — each clue gives address of the next clue.',
    keyPoints: [
      'First Node = HEAD pointer; Last Node next = NULL.',
      'Dynamic size in Heap memory (No contiguous allocation needed).',
      'Search requires sequential traversal from HEAD to NULL.',
    ],
    keyOps: [
      { op: 'Insert Head', desc: 'New Node next = HEAD; HEAD = New Node;', time: 'O(1)' },
      { op: 'Insert Tail', desc: 'temp.next = New Node; New Node next = NULL;', time: 'O(N)' },
      { op: 'Delete Head', desc: 'temp = HEAD; HEAD = HEAD.next; free(temp);', time: 'O(1)' },
      { op: 'Search(x)', desc: 'while(curr != NULL) { if(curr.data == x) return true; }', time: 'O(N)' },
    ],
  },
  doubly_linked_list: {
    title: 'Doubly Linked List CheatSheet (DLL)',
    subtitle: 'Core Concepts & Algorithmic Summary',
    examDefinition: 'Linear node structure containing Data, Prev Pointer (to previous node), and Next Pointer (to next node).',
    realWorldAnalogy: 'Train cars linked in both forward and backward directions.',
    keyPoints: [
      'First Node prev = NULL; Last Node next = NULL.',
      'Supports bidirectional traversal (Forward & Backward).',
      'O(1) deletion when target node pointer is known.',
    ],
    keyOps: [
      { op: 'Insert Head', desc: 'newNode.next = HEAD; HEAD.prev = newNode; HEAD = newNode;', time: 'O(1)' },
      { op: 'Insert Tail', desc: 'TAIL.next = newNode; newNode.prev = TAIL; TAIL = newNode;', time: 'O(1)' },
      { op: 'Delete Node', desc: 'node.prev.next = node.next; node.next.prev = node.prev;', time: 'O(1)' },
    ],
  },
  binary_tree: {
    title: 'Binary Search Tree CheatSheet (BST)',
    subtitle: 'Core Concepts & Algorithmic Summary',
    examDefinition: 'Hierarchical tree structure where for every node: Left Subtree < Root < Right Subtree.',
    realWorldAnalogy: 'Sorted dictionary index for fast binary search.',
    keyPoints: [
      'Inorder Traversal (Left → Root → Right) yields sorted array.',
      'Height of balanced BST = log2(N). Worst case skewed BST = O(N).',
      'Duplicate values handled in left/right depending on convention.',
    ],
    keyOps: [
      { op: 'Search(x)', desc: 'if(x < root) go Left; else if(x > root) go Right;', time: 'O(log N)' },
      { op: 'Insert(x)', desc: 'Find NULL position by comparing with current node;', time: 'O(log N)' },
      { op: 'Inorder', desc: 'Traverse(root.left); print(root.val); Traverse(root.right);', time: 'O(N)' },
    ],
  },
};

export const QuickHandwrittenNote: React.FC<{ topic: string }> = ({ topic }) => {
  const showCheatSheet = useLessonStore(s => s.showCheatSheet);
  const toggleCheatSheet = useLessonStore(s => s.toggleCheatSheet);

  const noteKey =
    topic === 'stack' ? 'stack' :
    topic === 'queue' ? 'queue' :
    topic === 'singly_linked_list' || topic === 'sll' ? 'singly_linked_list' :
    topic === 'doubly_linked_list' || topic === 'dll' ? 'doubly_linked_list' :
    topic === 'binary_tree' || topic === 'tree' ? 'binary_tree' : 'stack';

  const note = EXAM_NOTES_DB[noteKey] ?? EXAM_NOTES_DB.stack;

  if (!showCheatSheet) return null;

  return (
    <AnimatePresence>
      {/* Global Fixed Overlay Backdrop */}
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        
        {/* Full Wide Rectangle Lined Notebook Paper Card (2-Column Layout) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full max-w-4xl max-h-[85vh] bg-[#fcfbf7] border-l-4 border-l-rose-500 border border-slate-300 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-xl overflow-y-auto flex flex-col relative font-['Caveat',cursive] p-5 select-text"
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between border-b-2 border-rose-200 pb-2 mb-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-600">
                <BookOpen size={20} className="font-mono" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#dc2626] leading-none tracking-wide">{note.title}</h2>
                <p className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mt-0.5">{note.subtitle}</p>
              </div>
            </div>

            <button
              onClick={toggleCheatSheet}
              className="p-1.5 rounded-full bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-700 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Close CheatSheet"
            >
              <X size={16} />
            </button>
          </div>

          {/* 2-Column Wide Rectangle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">

            {/* Left Column: Core Concepts & Rules */}
            <div className="space-y-3">
              
              {/* 1. Core Definition */}
              <div className="p-3 rounded-lg bg-[#f4f1ea] border-l-2 border-rose-400">
                <div className="flex items-center gap-1 text-xs font-sans font-bold text-[#dc2626] uppercase tracking-wider mb-0.5">
                  <CheckCircle2 size={13} />
                  <span>Core Definition:</span>
                </div>
                <p className="text-[#1e3a8a] text-xl font-bold leading-snug">{note.examDefinition}</p>
              </div>

              {/* 2. Real-World Analogy */}
              <div className="px-3 py-2 rounded-lg bg-[#f4f1ea]/70 border border-slate-300/60">
                <div className="flex items-center gap-1 text-xs font-sans font-bold text-[#dc2626] uppercase tracking-wider mb-0.5">
                  <Zap size={12} />
                  <span>Real-World Analogy:</span>
                </div>
                <p className="text-[#1e3a8a] text-lg font-bold">{note.realWorldAnalogy}</p>
              </div>

              {/* 3. Key Memory Rules */}
              <div className="p-3 rounded-lg bg-[#f4f1ea]/70 border border-slate-300/60">
                <div className="flex items-center gap-1 text-xs font-sans font-bold text-[#dc2626] uppercase tracking-wider mb-1">
                  <Pin size={12} />
                  <span>Key Memory Rules & Pointer States:</span>
                </div>
                <ul className="list-disc list-inside text-[#1e3a8a] text-lg font-bold space-y-0.5">
                  {note.keyPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Column: Primary Operations & Algorithmic Steps */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-sans font-bold text-[#dc2626] uppercase tracking-wider mb-1">
                <ShieldAlert size={13} />
                <span>Primary Operations & Algorithmic Steps:</span>
              </div>

              <div className="space-y-2">
                {note.keyOps.map((op, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#f4f1ea] border border-slate-300/70 flex flex-col justify-between gap-1 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-[#dc2626]">{op.op}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900 font-mono text-xs font-bold">
                        {op.time}
                      </span>
                    </div>
                    <p className="text-[#1e3a8a] text-lg font-bold leading-tight font-mono">{op.desc}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Footer Bar */}
          <div className="border-t border-slate-300 pt-2.5 mt-3 shrink-0 flex items-center justify-between font-sans text-xs text-slate-500">
            <span className="font-bold">TreadCode DSA Master CheatSheet</span>
            <button
              onClick={toggleCheatSheet}
              className="px-4 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all cursor-pointer font-mono text-xs shadow"
            >
              Close CheatSheet
            </button>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
