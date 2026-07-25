import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Search, Settings, ChevronRight, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"/>
  </svg>
);

/* =========================================================
   GLOBAL SEARCH DATA — all programs across all topics
   ========================================================= */
const allPrograms = [
  // Variables
  { id: 'single_variable', topicId: 'variables', topicName: 'Variables', name: 'Create a Single Variable', lang: 'python' },
  { id: 'multiple_variables', topicId: 'variables', topicName: 'Variables', name: 'Create Multiple Variables', lang: 'python' },
  { id: 'update_variable', topicId: 'variables', topicName: 'Variables', name: 'Update Variable Value', lang: 'python' },
  { id: 'addition', topicId: 'variables', topicName: 'Variables', name: 'Addition Using Variables', lang: 'python' },
  { id: 'subtraction', topicId: 'variables', topicName: 'Variables', name: 'Subtraction Using Variables', lang: 'python' },
  { id: 'multiplication', topicId: 'variables', topicName: 'Variables', name: 'Multiplication Using Variables', lang: 'python' },
  { id: 'division', topicId: 'variables', topicName: 'Variables', name: 'Division Using Variables', lang: 'python' },
  { id: 'circle_area', topicId: 'variables', topicName: 'Variables', name: 'Circle Area', lang: 'python' },
  { id: 'square_root', topicId: 'variables', topicName: 'Variables', name: 'Square Root', lang: 'python' },
  { id: 'student_result', topicId: 'variables', topicName: 'Variables', name: 'Student Result Calculator', lang: 'python' },
  { id: 'square_area', topicId: 'variables', topicName: 'Variables', name: 'Square Area', lang: 'python' },
  { id: 'rectangle_area', topicId: 'variables', topicName: 'Variables', name: 'Rectangle Area', lang: 'python' },
  { id: 'temp_conversion', topicId: 'variables', topicName: 'Variables', name: 'Temperature Conversion', lang: 'python' },
  // If Statement
  { id: 'positive_number', topicId: 'if_statement', topicName: 'If Statement', name: 'Positive Number Check', lang: 'python' },
  { id: 'divisible_by_5', topicId: 'if_statement', topicName: 'If Statement', name: 'Divisible by 5', lang: 'python' },
  { id: 'voting_eligibility', topicId: 'if_statement', topicName: 'If Statement', name: 'Voting Eligibility', lang: 'python' },
  { id: 'pass_marks', topicId: 'if_statement', topicName: 'If Statement', name: 'Pass Marks Check', lang: 'python' },
  { id: 'square_root_positive', topicId: 'if_statement', topicName: 'If Statement', name: 'Square Root of Positive Number', lang: 'python' },
  // If Else
  { id: 'even_odd', topicId: 'if_else', topicName: 'If Else', name: 'Even or Odd', lang: 'python' },
  { id: 'greater_of_two', topicId: 'if_else', topicName: 'If Else', name: 'Greater of Two Numbers', lang: 'python' },
  { id: 'vowel_consonant', topicId: 'if_else', topicName: 'If Else', name: 'Vowel or Consonant', lang: 'python' },
  { id: 'profit_loss', topicId: 'if_else', topicName: 'If Else', name: 'Profit or Loss', lang: 'python' },
  { id: 'divisible_by_7', topicId: 'if_else', topicName: 'If Else', name: 'Divisible by 7', lang: 'python' },
  // If Elif Else
  { id: 'largest_of_three', topicId: 'if_elif_else', topicName: 'If Elif Else', name: 'Largest of Three Numbers', lang: 'python' },
  { id: 'grade_calculator', topicId: 'if_elif_else', topicName: 'If Elif Else', name: 'Grade Calculator', lang: 'python' },
  { id: 'positive_negative_zero', topicId: 'if_elif_else', topicName: 'If Elif Else', name: 'Positive / Negative / Zero', lang: 'python' },
  { id: 'electricity_bill', topicId: 'if_elif_else', topicName: 'If Elif Else', name: 'Electricity Bill Calculator', lang: 'python' },
  { id: 'income_tax', topicId: 'if_elif_else', topicName: 'If Elif Else', name: 'Income Tax Slab', lang: 'python' },
  // Match Case
  { id: 'day_name', topicId: 'match_case', topicName: 'Match Case', name: 'Day Name', lang: 'python' },
  { id: 'month_name', topicId: 'match_case', topicName: 'Match Case', name: 'Month Name', lang: 'python' },
  { id: 'menu_calculator', topicId: 'match_case', topicName: 'Match Case', name: 'Menu Driven Calculator', lang: 'python' },
  // For Loop
  { id: 'print_1_to_10', topicId: 'for_loop', topicName: 'For Loop', name: 'Print Numbers 1 to 10', lang: 'python' },
  { id: 'print_10_to_1', topicId: 'for_loop', topicName: 'For Loop', name: 'Print Numbers 10 to 1', lang: 'python' },
  { id: 'sum_n_natural', topicId: 'for_loop', topicName: 'For Loop', name: 'Sum of First N Natural Numbers', lang: 'python' },
  { id: 'factorial', topicId: 'for_loop', topicName: 'For Loop', name: 'Factorial of a Number', lang: 'python' },
  { id: 'multiplication_table', topicId: 'for_loop', topicName: 'For Loop', name: 'Multiplication Table', lang: 'python' },
  { id: 'reverse_multiplication_table', topicId: 'for_loop', topicName: 'For Loop', name: 'Reverse Multiplication Table', lang: 'python' },
  // While Loop
  { id: 'print_1_to_n', topicId: 'while_loop', topicName: 'While Loop', name: 'Print Numbers 1 to N', lang: 'python' },
  { id: 'sum_of_digits', topicId: 'while_loop', topicName: 'While Loop', name: 'Sum of Digits', lang: 'python' },
  { id: 'reverse_number', topicId: 'while_loop', topicName: 'While Loop', name: 'Reverse a Number', lang: 'python' },
  { id: 'count_digits', topicId: 'while_loop', topicName: 'While Loop', name: 'Count Digits', lang: 'python' },
  { id: 'palindrome_number', topicId: 'while_loop', topicName: 'While Loop', name: 'Palindrome Number', lang: 'python' },
  { id: 'armstrong_number', topicId: 'while_loop', topicName: 'While Loop', name: 'Armstrong Number', lang: 'python' },
  { id: 'perfect_number', topicId: 'while_loop', topicName: 'While Loop', name: 'Perfect Number Check', lang: 'python' },
  { id: 'strong_number', topicId: 'while_loop', topicName: 'While Loop', name: 'Strong Number Check', lang: 'python' },
  { id: 'decimal_to_binary', topicId: 'while_loop', topicName: 'While Loop', name: 'Decimal to Binary', lang: 'python' },
  { id: 'binary_to_decimal', topicId: 'while_loop', topicName: 'While Loop', name: 'Binary to Decimal', lang: 'python' },
  // Nested Loop
  { id: 'square_star', topicId: 'nested_loop', topicName: 'Nested Loop', name: 'Square Star Pattern', lang: 'python' },
  { id: 'right_triangle', topicId: 'nested_loop', topicName: 'Nested Loop', name: 'Right Triangle Pattern', lang: 'python' },
  { id: 'inverted_triangle', topicId: 'nested_loop', topicName: 'Nested Loop', name: 'Inverted Triangle Pattern', lang: 'python' },
  { id: 'number_triangle', topicId: 'nested_loop', topicName: 'Nested Loop', name: 'Number Triangle Pattern', lang: 'python' },
  { id: 'floyds_triangle', topicId: 'nested_loop', topicName: 'Nested Loop', name: 'Floyds Triangle', lang: 'python' },
  { id: 'full_pyramid', topicId: 'nested_loop', topicName: 'Nested Loop', name: 'Full Pyramid Star Pattern', lang: 'python' },
  // Loop Control
  { id: 'break_statement', topicId: 'loop_control', topicName: 'Loop Control', name: 'Break Statement', lang: 'python' },
  { id: 'continue_statement', topicId: 'loop_control', topicName: 'Loop Control', name: 'Continue Statement', lang: 'python' },
  { id: 'pass_statement', topicId: 'loop_control', topicName: 'Loop Control', name: 'Pass Statement', lang: 'python' },
  { id: 'prime_number', topicId: 'loop_control', topicName: 'Loop Control', name: 'Prime Number Check', lang: 'python' },
  // Functions
  { id: 'func_no_args', topicId: 'functions', topicName: 'Functions', name: 'Function Without Arguments', lang: 'python' },
  { id: 'func_with_args', topicId: 'functions', topicName: 'Functions', name: 'Function With Arguments', lang: 'python' },
  { id: 'func_with_return', topicId: 'functions', topicName: 'Functions', name: 'Function With Return Value', lang: 'python' },
  { id: 'add_using_func', topicId: 'functions', topicName: 'Functions', name: 'Addition Using Function', lang: 'python' },
  { id: 'square_using_func', topicId: 'functions', topicName: 'Functions', name: 'Square of a Number Using Function', lang: 'python' },
  { id: 'greatest_of_two', topicId: 'functions', topicName: 'Functions', name: 'Greatest of Two Numbers', lang: 'python' },
  { id: 'circle_area_func', topicId: 'functions', topicName: 'Functions', name: 'Circle Area Using Function', lang: 'python' },
  { id: 'simple_interest_func', topicId: 'functions', topicName: 'Functions', name: 'Simple Interest Using Function', lang: 'python' },
  { id: 'factorial_func', topicId: 'functions', topicName: 'Functions', name: 'Factorial Using Function', lang: 'python' },
  { id: 'even_odd_func', topicId: 'functions', topicName: 'Functions', name: 'Even or Odd Using Function', lang: 'python' },
  { id: 'largest_of_three_func', topicId: 'functions', topicName: 'Functions', name: 'Largest of Three Numbers Using Function', lang: 'python' },
  // Recursion
  { id: 'recursive_print_n', topicId: 'recursion', topicName: 'Recursion', name: 'Print Numbers 1 to N (Recursive)', lang: 'python' },
  { id: 'recursive_sum', topicId: 'recursion', topicName: 'Recursion', name: 'Sum of N Natural Numbers (Recursive)', lang: 'python' },
  { id: 'recursive_factorial', topicId: 'recursion', topicName: 'Recursion', name: 'Factorial Using Recursion', lang: 'python' },
  { id: 'recursive_fibonacci', topicId: 'recursion', topicName: 'Recursion', name: 'Fibonacci Using Recursion', lang: 'python' },
  { id: 'recursive_power', topicId: 'recursion', topicName: 'Recursion', name: 'Power of a Number Using Recursion', lang: 'python' },
  // Strings
  { id: 'print_string', topicId: 'strings', topicName: 'Strings', name: 'Print a String', lang: 'python' },
  { id: 'string_length', topicId: 'strings', topicName: 'Strings', name: 'Find String Length', lang: 'python' },
  { id: 'string_upper', topicId: 'strings', topicName: 'Strings', name: 'Convert String to Uppercase', lang: 'python' },
  { id: 'string_lower', topicId: 'strings', topicName: 'Strings', name: 'Convert String to Lowercase', lang: 'python' },
  { id: 'reverse_string', topicId: 'strings', topicName: 'Strings', name: 'Reverse a String', lang: 'python' },
  { id: 'string_palindrome', topicId: 'strings', topicName: 'Strings', name: 'Palindrome String Check', lang: 'python' },
  { id: 'count_vowels_consonants', topicId: 'strings', topicName: 'Strings', name: 'Count Vowels and Consonants', lang: 'python' },
  { id: 'count_chars_types', topicId: 'strings', topicName: 'Strings', name: 'Count Digits and Spaces', lang: 'python' },
  { id: 'string_concat', topicId: 'strings', topicName: 'Strings', name: 'Concatenate Two Strings', lang: 'python' },
  { id: 'compare_strings', topicId: 'strings', topicName: 'Strings', name: 'Compare Two Strings', lang: 'python' },
  // Lists
  { id: 'basic_list', topicId: 'lists', topicName: 'Lists', name: 'Basic List Operations', lang: 'python' },
  { id: 'list_stats', topicId: 'lists', topicName: 'Lists', name: 'List Statistics', lang: 'python' },
  { id: 'list_search', topicId: 'lists', topicName: 'Lists', name: 'Search Element in List', lang: 'python' },
  { id: 'list_modify', topicId: 'lists', topicName: 'Lists', name: 'Insert and Delete Elements', lang: 'python' },
  { id: 'list_sort_reverse', topicId: 'lists', topicName: 'Lists', name: 'Sort and Reverse List', lang: 'python' },
  { id: 'student_marks', topicId: 'lists', topicName: 'Lists', name: 'Student Marks Management', lang: 'python' },
  // Tuples
  { id: 'create_tuple', topicId: 'tuples', topicName: 'Tuples', name: 'Create and Display Tuple', lang: 'python' },
  { id: 'tuple_indexing', topicId: 'tuples', topicName: 'Tuples', name: 'Tuple Indexing and Slicing', lang: 'python' },
  { id: 'tuple_operations', topicId: 'tuples', topicName: 'Tuples', name: 'Tuple Operations', lang: 'python' },
  // Dictionaries
  { id: 'create_dict', topicId: 'dictionaries', topicName: 'Dictionaries', name: 'Create and Access Dictionary', lang: 'python' },
  { id: 'update_dict', topicId: 'dictionaries', topicName: 'Dictionaries', name: 'Update and Delete Dictionary', lang: 'python' },
  { id: 'traverse_dict', topicId: 'dictionaries', topicName: 'Dictionaries', name: 'Dictionary Traversal', lang: 'python' },
  // Searching & Sorting
  { id: 'linear_search', topicId: 'searching_sorting', topicName: 'Searching & Sorting', name: 'Linear Search', lang: 'python' },
  { id: 'binary_search', topicId: 'searching_sorting', topicName: 'Searching & Sorting', name: 'Binary Search', lang: 'python' },
  { id: 'bubble_sort', topicId: 'searching_sorting', topicName: 'Searching & Sorting', name: 'Bubble Sort', lang: 'python' },
  { id: 'selection_sort', topicId: 'searching_sorting', topicName: 'Searching & Sorting', name: 'Selection Sort', lang: 'python' },
  { id: 'insertion_sort', topicId: 'searching_sorting', topicName: 'Searching & Sorting', name: 'Insertion Sort', lang: 'python' },
];

/* =========================================================
   BREADCRUMB HELPER
   ========================================================= */
interface CrumbItem { label: string; path: string; }

function useBreadcrumbs(): CrumbItem[] {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const crumbs: CrumbItem[] = [{ label: 'Home', path: '/languages' }];

  if (parts[0] === 'settings') {
    crumbs.push({ label: 'Settings', path: '/settings' });
  } else if (parts[0] === 'topics' && parts[1]) {
    const lang = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    crumbs.push({ label: lang, path: `/topics/${parts[1]}` });
    if (parts[2] === 'programs' && parts[3]) {
      const topic = parts[3].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      crumbs.push({ label: topic, path: `/topics/${parts[1]}/programs/${parts[3]}` });
    }
  } else if (parts[0] === 'visualizer' && parts[1] && parts[2] && parts[3]) {
    const isDsa = parts[1] === 'dsa';
    const lang = isDsa ? 'DSA' : parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    crumbs.push({ label: lang, path: `/topics/${parts[1]}` });
    const topic = parts[2].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (isDsa) {
      crumbs.push({ label: topic, path: location.pathname });
    } else {
      crumbs.push({ label: topic, path: `/topics/${parts[1]}/programs/${parts[2]}` });
      const prog = parts[3].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      crumbs.push({ label: prog, path: location.pathname });
    }
  }

  return crumbs;
}

/* =========================================================
   GLOBAL SEARCH MODAL
   ========================================================= */
interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(0);

  const results = query.trim().length > 0
    ? allPrograms.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.topicName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];

  useEffect(() => { setFocused(0); }, [query]);

  const handleSelect = useCallback((prog: typeof allPrograms[0]) => {
    navigate(`/visualizer/${prog.lang}/${prog.topicId}/${prog.id}`);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  useEffect(() => {
    if (!open) { setQuery(''); setFocused(0); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setFocused(f => Math.min(f + 1, results.length - 1));
      if (e.key === 'ArrowUp') setFocused(f => Math.max(f - 1, 0));
      if (e.key === 'Enter' && results[focused]) handleSelect(results[focused]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, focused, onClose, handleSelect]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex items-start justify-center pt-[12vh] px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: -8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#141620', border: '1px solid rgba(255,255,255,0.09)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search className="w-5 h-5 shrink-0" style={{ color: '#6366f1' }} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search programs..."
            className="flex-1 bg-transparent outline-none text-lg placeholder:text-text-muted"
            style={{ color: '#f0f2f8', fontFamily: "'Inter', sans-serif" }}
          />
          <kbd className="text-xs px-2 py-1 rounded-md border font-mono"
            style={{ color: '#525870', borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="py-12 text-center" style={{ color: '#525870' }}>
              <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Type to search across all 100 programs</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center" style={{ color: '#525870' }}>
              <p className="text-sm">No programs found for "<span style={{ color: '#8b92a8' }}>{query}</span>"</p>
            </div>
          ) : (
            <ul>
              {results.map((prog, i) => (
                <li key={`${prog.topicId}-${prog.id}`}>
                  <button
                    onClick={() => handleSelect(prog)}
                    onMouseEnter={() => setFocused(i)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
                    style={{
                      background: i === focused ? 'rgba(99,102,241,0.08)' : 'transparent',
                      borderLeft: i === focused ? '3px solid #6366f1' : '3px solid transparent',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
                    >
                      <Code2 className="w-4 h-4" style={{ color: '#6366f1' }} />
                    </div>
                    <span className="flex-1 text-sm font-medium" style={{ color: '#f0f2f8' }}>{prog.name}</span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full shrink-0"
                      style={{ color: '#8b92a8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      {prog.topicName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-white/4 flex gap-4"
          style={{ color: '#525870' }}>
          <span className="text-xs flex items-center gap-1">
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>↑↓</kbd>
            Navigate
          </span>
          <span className="text-xs flex items-center gap-1">
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>↵</kbd>
            Open
          </span>
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================
   GLOBAL APP SHELL
   ========================================================= */
export const GlobalAppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();
  const [searchOpen, setSearchOpen] = useState(false);

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      className="h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#0a0b0f', fontFamily: "'Inter', sans-serif" }}
    >
      {/* === BACKGROUND GRADIENT === */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      {/* === HEADER === */}
      <header
        className="h-16 sticky top-0 z-50 shrink-0 flex items-center justify-between px-4 md:px-6"
        style={{
          background: 'rgba(10, 11, 15, 0.82)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* LEFT: Logo + App Name */}
        <button
          onClick={() => navigate('/languages')}
          className="flex items-center gap-3 shrink-0 group"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span
            className="hidden sm:block text-base font-bold"
            style={{ color: '#f0f2f8', letterSpacing: '-0.3px' }}
          >
            FlowTrace
          </span>
        </button>

        {/* CENTER: Breadcrumb */}
        <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.path}>
              {i > 0 && (
                <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: '#525870' }} />
              )}
              <button
                onClick={() => i < breadcrumbs.length - 1 ? navigate(crumb.path) : undefined}
                className="text-sm font-medium transition-colors px-1.5 py-0.5 rounded-md"
                style={{
                  color: i === breadcrumbs.length - 1 ? '#f0f2f8' : '#525870',
                  cursor: i === breadcrumbs.length - 1 ? 'default' : 'pointer',
                  background: i === breadcrumbs.length - 1 ? 'rgba(99,102,241,0.08)' : 'transparent',
                }}
              >
                {i === 0 && <Home className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* RIGHT: Search + Settings */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            title="Search programs (Ctrl+K)"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
            style={{
              color: '#8b92a8',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#f0f2f8';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#8b92a8';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
            }}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:block">Search</span>
            <kbd
              className="hidden sm:block text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ color: '#525870', background: 'rgba(255,255,255,0.05)' }}
            >
              ⌃K
            </kbd>
          </button>

          <style>{`
            @keyframes githubGlassShine {
              0% {
                left: -150%;
              }
              30% {
                left: 150%;
              }
              100% {
                left: 150%;
              }
            }
            .github-shine-btn {
              position: relative;
              overflow: hidden;
            }
            .github-shine-btn::after {
              content: '';
              position: absolute;
              top: 0;
              width: 40px;
              height: 100%;
              background: linear-gradient(
                to right,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
              );
              transform: skewX(-25deg);
              animation: githubGlassShine 3.5s infinite ease-in-out;
              pointer-events: none;
            }
          `}</style>

          <a
            href="https://github.com/prince19112003"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all github-shine-btn"
            style={{
              color: '#8b92a8',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#f0f2f8';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#8b92a8';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
            }}
          >
            <GithubIcon className="w-full h-full" />
          </a>

          <button
            onClick={() => navigate('/settings')}
            title="Settings"
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
            style={{
              color: location.pathname === '/settings' ? '#6366f1' : '#8b92a8',
              background: location.pathname === '/settings' ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${location.pathname === '/settings' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
            }}
            onMouseEnter={e => {
              if (location.pathname !== '/settings') {
                (e.currentTarget as HTMLElement).style.color = '#f0f2f8';
              }
            }}
            onMouseLeave={e => {
              if (location.pathname !== '/settings') {
                (e.currentTarget as HTMLElement).style.color = '#8b92a8';
              }
            }}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* === GLOBAL SEARCH MODAL === */}
      <AnimatePresence>
        {searchOpen && <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* === MAIN CONTENT === */}
      <main className="relative z-0 flex-1 overflow-hidden flex flex-col">
        <Outlet />
      </main>

      {/* Portal roots */}
      <div id="notification-root" className="fixed top-20 right-4 z-1060 flex flex-col gap-2 pointer-events-none" />
      <div id="dialog-root" className="relative z-1050" />
      <div id="tooltip-root" className="fixed inset-0 pointer-events-none z-1040" />
    </div>
  );
};
