export interface SearchProgram {
  id: string;
  topicId: string;
  topicName: string;
  name: string;
  lang: 'python' | 'dsa' | 'c' | 'cpp' | 'java' | 'ml' | 'networking';
  langLabel: string;
  description: string;
  keywords?: string;
}

export const searchCatalog: SearchProgram[] = [
  // ══════════════════════════════════════════════════════════
  // DATA STRUCTURES & ALGORITHMS (DSA)
  // ══════════════════════════════════════════════════════════
  {
    id: 'dsa_graph_basics',
    topicId: 'graph_basics',
    topicName: 'Graph Fundamentals',
    name: 'Graph Fundamentals & Adjacency Matrix',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Vertices, Edges, Directed/Undirected representations & Adjacency Matrix visualization.',
    keywords: 'graph fundamentals vertices edges adjacency matrix directed undirected degree components weights',
  },
  {
    id: 'dsa_graph_bfs',
    topicId: 'graph_bfs',
    topicName: 'Graph BFS',
    name: 'Graph BFS Level-Order Traversal',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Breadth-First Search queue simulation with level-order traversal, visited array, and path tracking.',
    keywords: 'graph bfs breadth first search queue traversal level order shortest path unweighted explore visit',
  },
  {
    id: 'dsa_graph_dfs',
    topicId: 'graph_dfs',
    topicName: 'Graph DFS',
    name: 'Graph DFS Stack Traversal',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Depth-First Search recursive stack simulation with deep path exploring and backtracking.',
    keywords: 'graph dfs depth first search stack recursion backtracking connected components cycle detection',
  },
  {
    id: 'dsa_graph_dijkstra',
    topicId: 'graph_dijkstra',
    topicName: 'Graph Dijkstra',
    name: "Dijkstra's Shortest Path Algorithm",
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Single-source shortest path calculation on weighted graph with distance table & edge relaxation.',
    keywords: 'graph dijkstra shortest path weighted greedy priority queue min distance relaxation cost',
  },
  {
    id: 'dsa_graph_kruskal',
    topicId: 'graph_kruskal',
    topicName: 'Graph Kruskal',
    name: "Kruskal's Minimum Spanning Tree (MST)",
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Greedy Minimum Spanning Tree construction using edge weight sorting & Disjoint Set Union (DSU).',
    keywords: 'graph kruskal minimum spanning tree mst dsu disjoint set union find greedy edge sort cycle',
  },
  {
    id: 'dsa_graph_prims',
    topicId: 'graph_prims',
    topicName: 'Graph Prim',
    name: "Prim's Minimum Spanning Tree (MST)",
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Greedy Minimum Spanning Tree construction using priority queue and expanding vertex cut.',
    keywords: 'graph prims prim minimum spanning tree mst priority queue vertex cut greedy weights',
  },
  {
    id: 'dsa_graph_astar',
    topicId: 'graph_astar',
    topicName: 'Graph A*',
    name: 'A* Pathfinding Search Algorithm',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Heuristic optimal pathfinding f(n) = g(n) + h(n) on 2D grid/graph with Euclidean/Manhattan distance.',
    keywords: 'graph astar a* pathfinding search heuristic manhattan euclidean optimal route grid',
  },
  {
    id: 'dsa_binary_tree',
    topicId: 'binary_tree',
    topicName: 'Binary Search Tree',
    name: 'Binary Search Tree (BST) & Traversals',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Insert, Delete, Search and Inorder, Preorder, Postorder, and Level-Order traversals.',
    keywords: 'tree bst binary search tree root leaf inorder preorder postorder traversal insert delete',
  },
  {
    id: 'dsa_sll_traverse',
    topicId: 'singly_linked_list',
    topicName: 'Singly Linked List',
    name: 'Singly Linked List Node & Traversal',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Dynamic node allocation, head pointer, next links, forward traversal, and insertion.',
    keywords: 'singly linked list sll node head next pointer dynamic memory allocate traverse insert',
  },
  {
    id: 'dsa_sll_reverse',
    topicId: 'singly_linked_list',
    topicName: 'Singly Linked List',
    name: 'Reverse Singly Linked List',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Reverse next pointers in-place using three pointers: prev, curr, and next.',
    keywords: 'reverse singly linked list in-place three pointers prev curr next flip links',
  },
  {
    id: 'dsa_dll_traverse',
    topicId: 'doubly_linked_list',
    topicName: 'Doubly Linked List',
    name: 'Doubly Linked List Bidirectional Links',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Nodes with prev and next pointers, bidirectional traversal, insert and delete operations.',
    keywords: 'doubly linked list dll prev next bidirectional node head tail insert delete traverse',
  },
  {
    id: 'dsa_stack_push_pop',
    topicId: 'stack',
    topicName: 'Stack (LIFO)',
    name: 'Stack Operations (Push, Pop, Peek)',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Last-In First-Out structure with top index pointer, overflow, and underflow handling.',
    keywords: 'stack lifo push pop peek top array implementation parentheses balance',
  },
  {
    id: 'dsa_queue_enq_deq',
    topicId: 'queue',
    topicName: 'Queue (FIFO)',
    name: 'Queue Operations (Enqueue, Dequeue)',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'First-In First-Out structure with front and rear pointer indices and circular buffer.',
    keywords: 'queue fifo enqueue dequeue front rear circular buffer ring buffer',
  },
  {
    id: 'dsa_bubble_sort',
    topicId: 'bubble_sort',
    topicName: 'Bubble Sort',
    name: 'Bubble Sort Algorithm (O(N²))',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Sort array by repeatedly comparing and swapping adjacent out-of-order elements.',
    keywords: 'bubble sort array comparison swap adjacent iterations o(n2) sorting',
  },
  {
    id: 'dsa_selection_sort',
    topicId: 'selection_sort',
    topicName: 'Selection Sort',
    name: 'Selection Sort Algorithm (O(N²))',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Find minimum element in unsorted subarray and swap to sorted portion.',
    keywords: 'selection sort min minimum unsorted swap linear scan sorting',
  },
  {
    id: 'dsa_insertion_sort',
    topicId: 'insertion_sort',
    topicName: 'Insertion Sort',
    name: 'Insertion Sort Algorithm (O(N²))',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Build sorted array one element at a time by shifting elements into correct position.',
    keywords: 'insertion sort shift key insert cards sorted partition',
  },
  {
    id: 'dsa_merge_sort',
    topicId: 'merge_sort',
    topicName: 'Merge Sort',
    name: 'Merge Sort Algorithm (O(N log N))',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Divide and conquer recursive array splitting and two-way sorted merging.',
    keywords: 'merge sort divide conquer recursive split halves merge o(n log n)',
  },
  {
    id: 'dsa_heap_sort',
    topicId: 'heap_sort',
    topicName: 'Heap Sort',
    name: 'Heap Sort Algorithm (O(N log N))',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Build Max-Heap binary tree and extract maximum element iteratively.',
    keywords: 'heap sort max heap heapify sift down root extract max binary heap',
  },
  {
    id: 'dsa_linear_search',
    topicId: 'linear_search',
    topicName: 'Linear Search',
    name: 'Linear Search Algorithm (O(N))',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Sequentially check each element from index 0 to N-1 for target match.',
    keywords: 'linear search sequential find target element match index scanning',
  },
  {
    id: 'dsa_binary_search',
    topicId: 'binary_search',
    topicName: 'Binary Search',
    name: 'Binary Search Algorithm (O(log N))',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Divide-and-conquer search on sorted array using low, mid, and high pointers.',
    keywords: 'binary search sorted divide conquer low mid high log n halving',
  },
  {
    id: 'dsa_hashset',
    topicId: 'hashset',
    topicName: 'HashSet',
    name: 'HashSet Buckets & Unique Keys',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Hash table with bucket chains, hash function key % 7, and O(1) average lookup.',
    keywords: 'hashset hash table buckets hash function collision unique keys o(1)',
  },
  {
    id: 'dsa_hashmap',
    topicId: 'hashmap',
    topicName: 'HashMap',
    name: 'HashMap Key-Value Mapping',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Key-value mapping using hash buckets, collision chaining, and instant key lookup.',
    keywords: 'hashmap hash table dictionary key value pair buckets collision lookup',
  },
  {
    id: 'dsa_array_declare',
    topicId: 'array_operations',
    topicName: 'Array Operations',
    name: 'Array Declaration & Memory Layout',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Understand contiguous memory addresses, byte offsets, and indexed array reads.',
    keywords: 'array contiguous memory addresses index offset declaration buffer',
  },
  {
    id: 'dsa_array_sum',
    topicId: 'array_operations',
    topicName: 'Array Operations',
    name: 'Sum & Average of Array Elements',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'Accumulate array elements and compute arithmetic mean.',
    keywords: 'array sum average accumulate elements arithmetic mean',
  },
  {
    id: 'dsa_array_max_min',
    topicId: 'array_operations',
    topicName: 'Array Operations',
    name: 'Find Maximum & Minimum in Array',
    lang: 'dsa',
    langLabel: 'DSA',
    description: 'One-pass traversal to track smallest and largest elements in contiguous memory.',
    keywords: 'array max min maximum minimum traversal compare extreme values',
  },

  // ══════════════════════════════════════════════════════════
  // PYTHON
  // ══════════════════════════════════════════════════════════
  {
    id: 'single_variable',
    topicId: 'variables',
    topicName: 'Variables',
    name: 'Create a Single Variable',
    lang: 'python',
    langLabel: 'Python',
    description: 'Store numbers and assign values in memory using Python named variables.',
    keywords: 'python variable assignment memory storage integers',
  },
  {
    id: 'multiple_variables',
    topicId: 'variables',
    topicName: 'Variables',
    name: 'Create Multiple Variables',
    lang: 'python',
    langLabel: 'Python',
    description: 'Declare independent variables and execute sequential statements.',
    keywords: 'python multiple variables sequential statements allocation',
  },
  {
    id: 'update_variable',
    topicId: 'variables',
    topicName: 'Variables',
    name: 'Update Variable Value',
    lang: 'python',
    langLabel: 'Python',
    description: 'Modify variables over time and overwrite previous memory slots.',
    keywords: 'python update variable reassignment overwrite mutate',
  },
  {
    id: 'addition',
    topicId: 'variables',
    topicName: 'Variables',
    name: 'Addition Using Variables',
    lang: 'python',
    langLabel: 'Python',
    description: 'Compute arithmetic sum using variables and store the result.',
    keywords: 'python addition arithmetic sum plus operator',
  },
  {
    id: 'circle_area',
    topicId: 'variables',
    topicName: 'Variables',
    name: 'Circle Area Calculation',
    lang: 'python',
    langLabel: 'Python',
    description: 'Calculate area of circle using formula 3.14 * r * r.',
    keywords: 'python circle area formula math float variables',
  },
  {
    id: 'positive_number',
    topicId: 'if_statement',
    topicName: 'If Statement',
    name: 'Positive Number Check',
    lang: 'python',
    langLabel: 'Python',
    description: 'Execute conditional branch when input is strictly greater than 0.',
    keywords: 'python if statement condition branch positive comparison',
  },
  {
    id: 'divisible_by_5',
    topicId: 'if_statement',
    topicName: 'If Statement',
    name: 'Divisible by 5 Check',
    lang: 'python',
    langLabel: 'Python',
    description: 'Check remainder with modulo operator (% 5 == 0).',
    keywords: 'python modulo divisibility remainder if condition',
  },
  {
    id: 'even_odd',
    topicId: 'if_else',
    topicName: 'If Else',
    name: 'Even or Odd Number',
    lang: 'python',
    langLabel: 'Python',
    description: 'Check integer parity with if-else decision branching.',
    keywords: 'python even odd if else parity modulo binary branch',
  },
  {
    id: 'greater_of_two',
    topicId: 'if_else',
    topicName: 'If Else',
    name: 'Greater of Two Numbers',
    lang: 'python',
    langLabel: 'Python',
    description: 'Compare two numbers and select the maximum value.',
    keywords: 'python max greater comparison if else two numbers',
  },
  {
    id: 'largest_of_three',
    topicId: 'if_elif_else',
    topicName: 'If Elif Else',
    name: 'Largest of Three Numbers',
    lang: 'python',
    langLabel: 'Python',
    description: 'Evaluate multi-condition ladder to identify greatest value among three inputs.',
    keywords: 'python largest three if elif else multi condition ladder',
  },
  {
    id: 'grade_calculator',
    topicId: 'if_elif_else',
    topicName: 'If Elif Else',
    name: 'Student Grade Calculator',
    lang: 'python',
    langLabel: 'Python',
    description: 'Assign letter grades based on percentage ranges.',
    keywords: 'python grade score marks ladder if elif else',
  },
  {
    id: 'print_1_to_10',
    topicId: 'for_loop',
    topicName: 'For Loop',
    name: 'Print Numbers 1 to 10',
    lang: 'python',
    langLabel: 'Python',
    description: 'Iterate through a range of numbers and print each step.',
    keywords: 'python for loop range iteration counter numbers',
  },
  {
    id: 'sum_n_natural',
    topicId: 'for_loop',
    topicName: 'For Loop',
    name: 'Sum of First N Natural Numbers',
    lang: 'python',
    langLabel: 'Python',
    description: 'Loop accumulator adding 1 through N.',
    keywords: 'python sum natural numbers accumulator loop for',
  },
  {
    id: 'multiplication_table',
    topicId: 'for_loop',
    topicName: 'For Loop',
    name: 'Multiplication Table',
    lang: 'python',
    langLabel: 'Python',
    description: 'Generate formatted multiplication table using a loop.',
    keywords: 'python multiplication table math multiples for loop',
  },
  {
    id: 'print_1_to_n',
    topicId: 'while_loop',
    topicName: 'While Loop',
    name: 'Print Numbers 1 to N',
    lang: 'python',
    langLabel: 'Python',
    description: 'Repeated loop execution while counter condition remains true.',
    keywords: 'python while loop counter iteration condition',
  },
  {
    id: 'sum_of_digits',
    topicId: 'while_loop',
    topicName: 'While Loop',
    name: 'Sum of Digits',
    lang: 'python',
    langLabel: 'Python',
    description: 'Extract and sum digits of a number using % 10 and // 10.',
    keywords: 'python sum digits modulo floor division while loop',
  },
  {
    id: 'reverse_number',
    topicId: 'while_loop',
    topicName: 'While Loop',
    name: 'Reverse a Number',
    lang: 'python',
    langLabel: 'Python',
    description: 'Reverse digits of an integer using arithmetic shifting.',
    keywords: 'python reverse number digits while loop math',
  },
  {
    id: 'square_star',
    topicId: 'nested_loop',
    topicName: 'Nested Loop',
    name: 'Square Star Pattern',
    lang: 'python',
    langLabel: 'Python',
    description: '2D grid rendering with outer and inner loops.',
    keywords: 'python pattern star nested loop grid rows columns',
  },
  {
    id: 'right_triangle',
    topicId: 'nested_loop',
    topicName: 'Nested Loop',
    name: 'Right Triangle Star Pattern',
    lang: 'python',
    langLabel: 'Python',
    description: 'Increasing pattern with inner loop bound to outer index.',
    keywords: 'python pattern right triangle star nested loop',
  },
  {
    id: 'prime_number',
    topicId: 'loop_control',
    topicName: 'Loop Control',
    name: 'Prime Number Check',
    lang: 'python',
    langLabel: 'Python',
    description: 'Check primality by testing divisors with early break.',
    keywords: 'python prime check divisor break loop control',
  },
  {
    id: 'func_with_args',
    topicId: 'functions',
    topicName: 'Functions',
    name: 'Function With Arguments',
    lang: 'python',
    langLabel: 'Python',
    description: 'Define functions, pass parameter values, and return computed results.',
    keywords: 'python function def parameters arguments return call',
  },
  {
    id: 'recursive_factorial',
    topicId: 'recursion',
    topicName: 'Recursion',
    name: 'Factorial Using Recursion',
    lang: 'python',
    langLabel: 'Python',
    description: 'Trace call stack frames and base case in recursive factorial(n).',
    keywords: 'python recursion factorial call stack base case',
  },
  {
    id: 'recursive_fibonacci',
    topicId: 'recursion',
    topicName: 'Recursion',
    name: 'Fibonacci Series Using Recursion',
    lang: 'python',
    langLabel: 'Python',
    description: 'Branching tree recursion calculating Fibonacci numbers.',
    keywords: 'python recursion fibonacci tree call stack',
  },
  {
    id: 'string_palindrome',
    topicId: 'strings',
    topicName: 'Strings',
    name: 'Palindrome String Check',
    lang: 'python',
    langLabel: 'Python',
    description: 'Check if string reads identical forward and backward.',
    keywords: 'python palindrome string reverse slicing compare',
  },
  {
    id: 'basic_list',
    topicId: 'lists',
    topicName: 'Lists',
    name: 'Basic List Operations',
    lang: 'python',
    langLabel: 'Python',
    description: 'Create, index, append, and iterate through Python dynamic lists.',
    keywords: 'python list array append index traverse slice',
  },
  {
    id: 'create_dict',
    topicId: 'dictionaries',
    topicName: 'Dictionaries',
    name: 'Create & Access Dictionary',
    lang: 'python',
    langLabel: 'Python',
    description: 'Store and look up key-value pairs using Python dictionaries.',
    keywords: 'python dictionary dict key value hash map lookup',
  },

  // ══════════════════════════════════════════════════════════
  // C PROGRAMMING
  // ══════════════════════════════════════════════════════════
  {
    id: 'c_int',
    topicId: 'variables',
    topicName: 'Variables',
    name: 'C Integer Data Type (int)',
    lang: 'c',
    langLabel: 'C',
    description: 'Understand 4-byte signed integers and memory allocation in C.',
    keywords: 'c variables int data types memory 4 bytes signed',
  },
  {
    id: 'c_swap_temp',
    topicId: 'variables',
    topicName: 'Variables',
    name: 'Swap Two Variables (C)',
    lang: 'c',
    langLabel: 'C',
    description: 'Exchange values between two variables using a temporary memory slot.',
    keywords: 'c swap temp variable exchange values memory',
  },
  {
    id: 'c_scanf_integer',
    topicId: 'user_input',
    topicName: 'User Input',
    name: 'Read Integer Input (scanf %d)',
    lang: 'c',
    langLabel: 'C',
    description: 'Read console input using scanf format specifier %d and address-of operator &.',
    keywords: 'c scanf input address-of pointer console integer',
  },
  {
    id: 'c_for_sum',
    topicId: 'for_loop',
    topicName: 'For Loop',
    name: 'Sum of First N Numbers (C)',
    lang: 'c',
    langLabel: 'C',
    description: 'Accumulate running total in C for loop counter.',
    keywords: 'c for loop sum accumulator iteration natural numbers',
  },
  {
    id: 'c_while_basic',
    topicId: 'while_loop',
    topicName: 'While Loop',
    name: 'While Loop in C',
    lang: 'c',
    langLabel: 'C',
    description: 'Condition checking, body execution, and counter updates in C.',
    keywords: 'c while loop condition repetition counter',
  },
  {
    id: 'c_string_reverse',
    topicId: 'strings',
    topicName: 'Strings',
    name: 'Reverse Character Array String',
    lang: 'c',
    langLabel: 'C',
    description: 'In-place two-pointer character swapping in null-terminated string.',
    keywords: 'c string char array reverse two pointers null terminator',
  },
  {
    id: 'c_functions',
    topicId: 'functions',
    topicName: 'Functions',
    name: 'Function Declaration & Return in C',
    lang: 'c',
    langLabel: 'C',
    description: 'Parameters, call by value stack frames, and return values in C.',
    keywords: 'c functions call stack parameters return scope',
  },
  {
    id: 'c_array_sum',
    topicId: 'arrays_1d',
    topicName: '1D Arrays',
    name: '1D Array Declaration & Element Sum',
    lang: 'c',
    langLabel: 'C',
    description: 'Contiguous memory allocation and indexed summation in C.',
    keywords: 'c array 1d contiguous memory index sum elements',
  },

  // ══════════════════════════════════════════════════════════
  // C++ PROGRAMMING
  // ══════════════════════════════════════════════════════════
  {
    id: 'cpp_types',
    topicId: 'variables',
    topicName: 'Variables',
    name: 'C++ Primitive Data Types',
    lang: 'cpp',
    langLabel: 'C++',
    description: 'int, double, bool, char declarations and memory storage in C++.',
    keywords: 'cpp c++ variables data types primitives memory int double bool char',
  },
  {
    id: 'cpp_cin_primitives',
    topicId: 'user_input',
    topicName: 'User Input',
    name: 'Read Console Inputs (cin >>)',
    lang: 'cpp',
    langLabel: 'C++',
    description: 'Input stream extraction from user console using std::cin.',
    keywords: 'cpp c++ cin input stream extraction console',
  },
  {
    id: 'cpp_for_sum',
    topicId: 'for_loop',
    topicName: 'For Loop',
    name: 'Sum of First N Numbers in C++',
    lang: 'cpp',
    langLabel: 'C++',
    description: 'Loop counter accumulation and stdout stream formatting in C++.',
    keywords: 'cpp c++ for loop sum accumulator cout stream',
  },
  {
    id: 'cpp_while',
    topicId: 'while_loop',
    topicName: 'While Loop',
    name: 'While Loop in C++',
    lang: 'cpp',
    langLabel: 'C++',
    description: 'Conditional repetition and state mutations in C++ while loops.',
    keywords: 'cpp c++ while loop conditional repetition',
  },
  {
    id: 'cpp_func_pass_by_ref',
    topicId: 'functions',
    topicName: 'Functions',
    name: 'Pass by Reference (int &x)',
    lang: 'cpp',
    langLabel: 'C++',
    description: 'Modify caller memory directly using C++ reference parameters.',
    keywords: 'cpp c++ pass by reference alias memory & parameter',
  },
  {
    id: 'cpp_array_max',
    topicId: 'arrays_1d',
    topicName: '1D Arrays',
    name: 'Find Maximum Element in C++ Array',
    lang: 'cpp',
    langLabel: 'C++',
    description: 'Traverse array and update maximum value tracker in C++.',
    keywords: 'cpp c++ array 1d max maximum element traversal',
  },

  // ══════════════════════════════════════════════════════════
  // JAVA PROGRAMMING
  // ══════════════════════════════════════════════════════════
  {
    id: 'java_types',
    topicId: 'variables',
    topicName: 'Variables',
    name: 'Java Primitive Data Types',
    lang: 'java',
    langLabel: 'Java',
    description: 'Strongly typed variables (int, double, boolean, char) in Java virtual memory.',
    keywords: 'java variables primitives data types memory allocation',
  },
  {
    id: 'java_scanner_number',
    topicId: 'user_input',
    topicName: 'User Input',
    name: 'Read User Input (Scanner)',
    lang: 'java',
    langLabel: 'Java',
    description: 'Scanner class initialization and sc.nextInt() integer input parsing.',
    keywords: 'java scanner input user sc.nextint console reading',
  },
  {
    id: 'java_for_sum',
    topicId: 'for_loop',
    topicName: 'For Loop',
    name: 'Sum of First N Numbers in Java',
    lang: 'java',
    langLabel: 'Java',
    description: 'Accumulate sum inside a Java for loop counter.',
    keywords: 'java for loop sum accumulator iteration natural numbers',
  },
  {
    id: 'java_while_digits',
    topicId: 'while_loop',
    topicName: 'While Loop',
    name: 'Sum of Digits in Java',
    lang: 'java',
    langLabel: 'Java',
    description: 'Digit extraction with % 10 and / 10 in Java while loop.',
    keywords: 'java while loop sum digits extraction modulo',
  },
  {
    id: 'java_method_basic',
    topicId: 'methods',
    topicName: 'Methods',
    name: 'Method Declaration & Calling',
    lang: 'java',
    langLabel: 'Java',
    description: 'Define static methods, pass parameters, and execute stack frames in Java.',
    keywords: 'java methods functions static call stack parameters return',
  },
  {
    id: 'java_recursion_factorial',
    topicId: 'recursion',
    topicName: 'Recursion',
    name: 'Factorial Using Recursion in Java',
    lang: 'java',
    langLabel: 'Java',
    description: 'Recursive call stack visualization with base case and bubbling returns.',
    keywords: 'java recursion factorial call stack base case method',
  },
  {
    id: 'java_array_sum_1d',
    topicId: 'arrays_1d',
    topicName: '1D Arrays',
    name: 'Java 1D Array Sum & Average',
    lang: 'java',
    langLabel: 'Java',
    description: 'Heap array allocation, element indexing, and average calculation in Java.',
    keywords: 'java array 1d heap allocation sum average index',
  },

  // ══════════════════════════════════════════════════════════
  // MACHINE LEARNING (ML)
  // ══════════════════════════════════════════════════════════
  {
    id: 'ml_linear_regression',
    topicId: 'linear_regression',
    topicName: 'Linear Regression',
    name: 'Linear Regression Visualizer',
    lang: 'ml',
    langLabel: 'ML',
    description: 'Best-fit line, slope (m), intercept (c), and Mean Squared Error residuals.',
    keywords: 'ml machine learning linear regression best fit slope intercept mse supervised',
  },
  {
    id: 'ml_logistic_regression',
    topicId: 'logistic_regression',
    topicName: 'Logistic Regression',
    name: 'Logistic Regression & Sigmoid Curve',
    lang: 'ml',
    langLabel: 'ML',
    description: 'Binary classification, sigmoid activation curve, and decision threshold boundary.',
    keywords: 'ml logistic regression sigmoid binary classification threshold probability',
  },
  {
    id: 'ml_knn_classification',
    topicId: 'knn_classification',
    topicName: 'KNN',
    name: 'K-Nearest Neighbors (KNN)',
    lang: 'ml',
    langLabel: 'ML',
    description: 'Distance-based voting, radius boundary expansion, and class assignment.',
    keywords: 'ml knn k nearest neighbors euclidean distance classification voting',
  },
  {
    id: 'ml_decision_tree',
    topicId: 'decision_tree',
    topicName: 'Decision Tree',
    name: 'Decision Tree Classifier',
    lang: 'ml',
    langLabel: 'ML',
    description: 'Orthogonal axis splits, information gain, entropy, and decision regions.',
    keywords: 'ml decision tree entropy information gain split partitioning classification',
  },
  {
    id: 'ml_svm',
    topicId: 'svm',
    topicName: 'Support Vector Machine',
    name: 'Support Vector Machine (SVM)',
    lang: 'ml',
    langLabel: 'ML',
    description: 'Maximum margin hyperplane, support vectors, and linear separation.',
    keywords: 'ml svm support vector machine hyperplane margin classification kernel',
  },
  {
    id: 'ml_kmeans_clustering',
    topicId: 'kmeans_clustering',
    topicName: 'K-Means',
    name: 'K-Means Clustering',
    lang: 'ml',
    langLabel: 'ML',
    description: 'Unsupervised centroid shifting, point clustering, and convergence.',
    keywords: 'ml kmeans k-means clustering unsupervised centroids convergence groups',
  },
  {
    id: 'ml_gradient_descent',
    topicId: 'gradient_descent',
    topicName: 'Gradient Descent',
    name: 'Gradient Descent Optimization',
    lang: 'ml',
    langLabel: 'ML',
    description: 'Loss function valley, learning rate alpha, and parameter optimization.',
    keywords: 'ml gradient descent optimization learning rate loss minima convex slope',
  },

  // ══════════════════════════════════════════════════════════
  // COMPUTER NETWORKS
  // ══════════════════════════════════════════════════════════
  {
    id: 'net_osi_model',
    topicId: 'osi_model',
    topicName: 'OSI Model',
    name: '7-Layer OSI Model Visualizer',
    lang: 'networking',
    langLabel: 'Networks',
    description: 'Encapsulation and decapsulation across Physical to Application layers.',
    keywords: 'networking networks osi model 7 layers encapsulation packet frame transport',
  },
  {
    id: 'net_tcp_ip_suite',
    topicId: 'tcp_ip_suite',
    topicName: 'TCP/IP',
    name: 'TCP 3-Way Handshake & Protocols',
    lang: 'networking',
    langLabel: 'Networks',
    description: 'SYN, SYN-ACK, ACK handshake, sequence numbers, and packet delivery.',
    keywords: 'networking tcp ip handshake syn ack packets connection transmission',
  },
  {
    id: 'net_dns_resolution',
    topicId: 'dns_resolution',
    topicName: 'DNS',
    name: 'DNS Hierarchical Resolution',
    lang: 'networking',
    langLabel: 'Networks',
    description: 'Root servers, TLD servers, authoritative name servers, and IP lookup.',
    keywords: 'networking dns domain name resolution ip address root server tld lookup',
  },
  {
    id: 'net_http_lifecycle',
    topicId: 'http_lifecycle',
    topicName: 'HTTP Lifecycle',
    name: 'HTTP Request & Response Lifecycle',
    lang: 'networking',
    langLabel: 'Networks',
    description: 'Client GET/POST requests, headers, status codes, and server response rendering.',
    keywords: 'networking http https request response get post headers status code client server',
  },
];

// ══════════════════════════════════════════════════════════════
// HIGH-ACCURACY FUZZY SEARCH ENGINE
// ══════════════════════════════════════════════════════════════

export interface FuzzySearchResult {
  item: SearchProgram;
  score: number;
}

export function fuzzySearchCatalog(query: string, langFilter?: string): SearchProgram[] {
  const clean = query.trim().toLowerCase();
  let list = searchCatalog;

  if (langFilter && langFilter !== 'all') {
    list = list.filter(item => item.lang.toLowerCase() === langFilter.toLowerCase());
  }

  if (!clean) {
    return [];
  }

  const queryTokens = clean.split(/\s+/).filter(Boolean);

  const scoredResults: FuzzySearchResult[] = [];

  for (const item of list) {
    const nameLower = item.name.toLowerCase();
    const topicLower = item.topicName.toLowerCase();
    const descLower = item.description.toLowerCase();
    const kwLower = (item.keywords || '').toLowerCase();
    const idLower = item.id.toLowerCase();
    const langLower = item.lang.toLowerCase();

    let score = 0;
    let allTokensMatched = true;

    for (const token of queryTokens) {
      let tokenScore = 0;

      // 1. Exact match on token
      if (nameLower === token) {
        tokenScore += 1000;
      } else if (nameLower.startsWith(token)) {
        tokenScore += 600;
      } else if (nameLower.includes(' ' + token)) {
        tokenScore += 450;
      } else if (nameLower.includes(token)) {
        tokenScore += 300;
      }

      // 2. Acronym matching (e.g., 'bfs' -> 'Breadth First Search')
      const acronym = item.name
        .split(/[\s-]+/)
        .map(w => w[0]?.toLowerCase())
        .join('');
      if (acronym.includes(token)) {
        tokenScore += 500;
      }

      // 3. Topic name match
      if (topicLower.startsWith(token)) {
        tokenScore += 400;
      } else if (topicLower.includes(token)) {
        tokenScore += 250;
      }

      // 4. Language match
      if (langLower === token || item.langLabel.toLowerCase() === token) {
        tokenScore += 350;
      }

      // 5. Keyword match
      if (kwLower.includes(token)) {
        tokenScore += 200;
      }

      // 6. ID match
      if (idLower.includes(token)) {
        tokenScore += 150;
      }

      // 7. Description match
      if (descLower.includes(token)) {
        tokenScore += 100;
      }

      // 8. Character subsequence match
      if (tokenScore === 0) {
        let tIdx = 0;
        let charMatches = 0;
        for (let i = 0; i < nameLower.length && tIdx < token.length; i++) {
          if (nameLower[i] === token[tIdx]) {
            tIdx++;
            charMatches++;
          }
        }
        if (tIdx === token.length) {
          tokenScore += 50 + charMatches * 5;
        } else {
          allTokensMatched = false;
        }
      }

      score += tokenScore;
    }

    if (allTokensMatched && score > 0) {
      scoredResults.push({ item, score });
    }
  }

  // Sort descending by relevance score
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.map(r => r.item);
}
