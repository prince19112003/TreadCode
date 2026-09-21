# TreadCode Curriculum & Course Syllabus Specification

> **Complete Pedagogical Index & Syllabus Guide**  
> Covers 287 interactive visual programs across 7 programming domains, topic indices, and tier mappings.

---

## 1. Curriculum Structure & Philosophy

TreadCode's educational curriculum is designed specifically for **visual, step-by-step cognitive understanding**. Rather than testing students with abstract command-line printouts, each program visually surfaces the internal state of virtual memory:

- **Active Line Tracking**: Highlights the exact line of code currently executing in the processor.
- **Synchronized Memory State**: Visually reflects changes in variable values, pointer references, dynamic heap blocks, and stack frames.
- **Bilingual Guided Explanations**: Audio and textual explanations in both Hindi and English accompany every discrete step.

```
Total Programs: 287 Programs | 94 Topics | 7 Programming Domains
```

---

## 2. Detailed Course Breakdown

### 2.1 Python 3 Core Visualizer
- **Tier**: **Community Edition (Free Forever / Built-in)**
- **Scope**: 100 Programs | 16 Topics | 100% Offline
- **Topic Breakdown**:
  1. **Language Basics & Syntax** (Variables, data types, arithmetic operators) — 6 programs
  2. **Conditionals & Branching** (`if`, `elif`, `else`, ternary expressions) — 6 programs
  3. **Loops & Iteration** (`for`, `while`, `break`, `continue`, `range`) — 8 programs
  4. **Pattern Generation** (Star pyramids, number triangles, inverted matrices) — 6 programs
  5. **Functions & Scope** (Parameters, return values, default arguments, global/local scope) — 8 programs
  6. **Lists & Slicing** (Indexing, negative slicing, appending, popping, list comprehensions) — 8 programs
  7. **Tuples & Immutability** (Packing, unpacking, immutability rules) — 5 programs
  8. **Dictionaries & Key-Value Maps** (Hashing, lookups, iteration, nested dicts) — 8 programs
  9. **Sets & Set Operations** (Unions, intersections, differences, deduplication) — 5 programs
  10. **String Manipulation** (Formatting, splitting, joining, regex basics) — 6 programs
  11. **Recursion & Call Stack** (Factorial, Fibonacci, base cases, stack overflow limits) — 6 programs
  12. **File Input / Output** (Reading, writing, context managers `with open`) — 5 programs
  13. **Object-Oriented Programming** (Classes, `__init__`, `self`, methods, inheritance) — 8 programs
  14. **Exception Handling** (`try`, `except`, `finally`, custom exceptions) — 5 programs
  15. **Functional & Lambda** (`map`, `filter`, `reduce`, lambda expressions) — 5 programs
  16. **Modules & Imports** (Standard library, namespaces, math utilities) — 5 programs

---

### 2.2 C Programming & Pointers
- **Tier**: **Professional Edition**
- **Scope**: 45 Programs | 13 Topics | ~164 KB Module Size
- **Topic Breakdown**:
  1. **Data Types & Format Specifiers** (`int`, `float`, `char`, `sizeof`) — 3 programs
  2. **Operators & Expressions** (Precedence, modulo, bitwise shifts) — 3 programs
  3. **Control Structures** (`switch-case`, nested loops) — 3 programs
  4. **Arrays & Matrices** (1D arrays, 2D matrix multiplication, memory addresses) — 4 programs
  5. **Pointers & Memory Addresses** (`&` address-of, `*` dereference, pointer arithmetic) — 5 programs
  6. **Dynamic Memory Allocation** (`malloc`, `calloc`, `realloc`, `free`, memory leaks) — 4 programs
  7. **Strings & Character Pointers** (Null-terminators `\0`, `strlen`, `strcpy`, buffer safety) — 4 programs
  8. **Functions & Passing by Reference** (Pass-by-value vs pass-by-pointer) — 4 programs
  9. **Structures & Unions** (`struct`, padding, dot operator, arrow operator `->`) — 4 programs
  10. **File Streams** (`fopen`, `fprintf`, `fscanf`, `fclose`) — 3 programs
  11. **Bitwise Manipulation** (Bitmasks, bit shifts, setting/clearing bits) — 3 programs
  12. **Preprocessor Directives** (`#define`, `#include`, conditional compilation macros) — 2 programs
  13. **Advanced Pointers** (Pointers to pointers `int**`, function pointers) — 3 programs

---

### 2.3 C++ Object-Oriented & STL
- **Tier**: **Professional Edition**
- **Scope**: 50 Programs | 14 Topics | ~157 KB Module Size
- **Topic Breakdown**:
  1. **C++ Basics & I/O Streams** (`cin`, `cout`, namespaces, references `int&`) — 3 programs
  2. **Classes & Encapsulation** (Private/public access specifiers, getters, setters) — 4 programs
  3. **Constructors & Destructors** (Default, parameterized, copy constructors, RAII) — 4 programs
  4. **Inheritance Models** (Single, multiple, hierarchical, virtual base classes) — 4 programs
  5. **Polymorphism & Virtual Functions** (Function overriding, virtual tables `vptr`/`vtbl`) — 4 programs
  6. **Operator Overloading** (Overloading `+`, `==`, stream insertion `<<`) — 4 programs
  7. **Templates & Generic Programming** (Function templates, class templates) — 3 programs
  8. **STL Vectors** (Dynamic resizing, `push_back`, iterators, memory capacity) — 4 programs
  9. **STL Maps & Unordered Maps** (Red-Black tree maps vs hash-based lookup) — 4 programs
  10. **STL Stacks & Queues** (LIFO, FIFO, adapter containers) — 3 programs
  11. **Exception Handling** (`try-catch`, standard exception hierarchy) — 3 programs
  12. **Modern C++ Features** (`auto`, range-based for loops, smart pointers `unique_ptr`) — 4 programs
  13. **Memory Management & RAII** (Dynamic `new`/`delete`, memory leak prevention) — 3 programs
  14. **Standard Algorithms** (`std::sort`, `std::find`, lambda predicates) — 3 programs

---

### 2.4 Java Programming & JVM Architecture
- **Tier**: **Professional Edition**
- **Scope**: 52 Programs | 13 Topics | ~405 KB Module Size
- **Topic Breakdown**:
  1. **JVM Architecture** (Classloader, JVM Stack, Heap, Garbage Collection concepts) — 4 programs
  2. **Variables, Types & Wrappers** (Primitives vs Object Wrappers, autoboxing) — 4 programs
  3. **Control Flow** (`if-else`, loops, labeled breaks) — 4 programs
  4. **Arrays & Multi-Dimensional Arrays** (Heap array objects, length property) — 4 programs
  5. **OOP: Classes, Objects & Methods** (`this` keyword, method overloading) — 4 programs
  6. **Inheritance & `super`** (Method overriding, abstract classes, constructor chaining) — 4 programs
  7. **Interfaces & Multiple Implementation** (Default methods, functional interfaces) — 4 programs
  8. **Exception Handling** (Checked vs unchecked exceptions, `try-with-resources`) — 4 programs
  9. **Collections Framework** (`ArrayList`, `LinkedList`, `HashMap`, `HashSet`) — 5 programs
  10. **Generics & Type Safety** (Generic classes, bounded wildcards `<? extends T>`) — 4 programs
  11. **Multithreading Basics** (`Thread` class, `Runnable`, synchronization locks) — 4 programs
  12. **Stream API & Functional Java** (`filter`, `map`, `collect`, lambda expressions) — 4 programs
  13. **File I/O & Serialization** (`Path`, `Files`, object serialization) — 3 programs

---

### 2.5 Data Structures & Algorithms (DSA)
- **Tier**: **Professional Edition**
- **Scope**: 21 Programs | 19 Topics | ~357 KB Module Size
- **Topic Breakdown**:
  1. **Linear Search & Binary Search** (Divide and conquer index narrowing) — 2 programs
  2. **Bubble Sort Animation** (Step-by-step element swapping, early exit optimization) — 1 program
  3. **Selection Sort Animation** (Minimum element scanning and positioning) — 1 program
  4. **Insertion Sort Animation** (Sorted subarray shifting and insertion) — 1 program
  5. **Merge Sort Animation** (Recursive divide, temp array merge visualizer) — 1 program
  6. **Quick Sort Animation** (Pivot selection, Lomuto partitioning, recursive partition) — 1 program
  7. **Singly Linked List** (Node allocation, head pointer traversal, insertion, deletion) — 1 program
  8. **Doubly Linked List** (Forward and backward pointer linking) — 1 program
  9. **Stack (Array & Linked List implementation)** (LIFO push/pop visualizer) — 1 program
  10. **Queue (FIFO Queue & Circular Queue)** (Front and rear pointer visualizer) — 1 program
  11. **Binary Search Tree (BST) Insertion** (Recursive left/right branch navigation) — 1 program
  12. **BST Traversals** (Inorder, Preorder, Postorder traversal order highlighting) — 1 program
  13. **BST Deletion** (Leaf node, single child, and inorder successor replacement) — 1 program
  14. **Graph Representation** (Adjacency Matrix vs Adjacency List) — 1 program
  15. **Breadth-First Search (BFS)** (Queue-based level-order graph traversal) — 1 program
  16. **Depth-First Search (DFS)** (Stack/recursion-based graph traversal) — 1 program
  17. **Dijkstra Shortest Path** (Priority queue edge relaxation on weighted graphs) — 1 program
  18. **Recursion Tree Visualization** (Visual call tree branch expansion) — 1 program
  19. **Hash Table Collision Handling** (Separate chaining vs open addressing) — 1 program

---

### 2.6 Machine Learning Visualizer
- **Tier**: **Enterprise Edition**
- **Scope**: 11 Programs | 11 Topics | ~8 KB Module Size
- **Topic Breakdown**:
  1. **Linear Regression & Gradient Descent** (Loss minimization, slope/intercept update)
  2. **Logistic Regression & Decision Boundary** (Sigmoid activation, probability threshold)
  3. **K-Means Clustering** (Centroid initialization, cluster assignment, centroid recalculation)
  4. **K-Nearest Neighbors (KNN)** (Euclidean distance calculation, majority voting)
  5. **Decision Tree Split** (Gini impurity, entropy calculation, feature splitting)
  6. **Neural Network Forward Pass** (Input vectors, weight matrices, bias addition)
  7. **Activation Functions** (ReLU, Sigmoid, Tanh visual curves)
  8. **Loss Functions** (Mean Squared Error vs Cross-Entropy Loss)
  9. **Backpropagation Weight Update** (Gradient descent chain rule visualization)
  10. **Support Vector Machine (SVM) Margins** (Support vectors, maximum margin hyperplanes)
  11. **Confusion Matrix & Metrics** (Accuracy, precision, recall, F1 score)

---

### 2.7 Computer Networks & Protocol Visualizer
- **Tier**: **Enterprise Edition**
- **Scope**: 8 Programs | 8 Topics | ~6 KB Module Size
- **Topic Breakdown**:
  1. **OSI 7-Layer Flow** (Data encapsulation from Application down to Physical layer)
  2. **TCP 3-Way Handshake** (`SYN`, `SYN-ACK`, `ACK` packet sequence)
  3. **Packet Structure & Headers** (IP header, TCP header, payload breakdown)
  4. **IPv4 Subnetting & CIDR** (Network ID, subnet mask, host range, broadcast address)
  5. **DNS Resolution Hierarchy** (Root server, TLD server, authoritative nameserver)
  6. **HTTP Request / Response Lifecycle** (Client request, headers, server response status codes)
  7. **Routing Table Hop-by-Hop** (Longest prefix match routing lookup)
  8. **Sliding Window Flow Control** (Sender window, receiver acknowledgment, retransmission)
