import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Code2, Play, ArrowRight } from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { motion } from 'motion/react';

/* =========================================================
   FULL PROGRAM DATA (same as before, kept in this file)
   ========================================================= */
const mockProgramsByTopic: Record<string, { id: string; number: string; friendlyName: string; description: string }[]> = {
  variables: [
    { id: 'single_variable',    number: '01', friendlyName: 'Create a Single Variable',      description: 'Understand how a computer stores a number in memory using a named variable.' },
    { id: 'multiple_variables', number: '02', friendlyName: 'Create Multiple Variables',      description: 'Understand that the computer reads code line-by-line and can store multiple independent variables.' },
    { id: 'update_variable',    number: '03', friendlyName: 'Update Variable Value',          description: 'Understand that variables can change over time and old values are destroyed when updated.' },
    { id: 'addition',           number: '04', friendlyName: 'Addition Using Variables',       description: 'Learn how to perform addition operations with variables and store the result.' },
    { id: 'subtraction',        number: '05', friendlyName: 'Subtraction Using Variables',    description: 'Learn how to subtract values using variables.' },
    { id: 'multiplication',     number: '06', friendlyName: 'Multiplication Using Variables', description: 'Learn how to multiply values stored in variables.' },
    { id: 'division',           number: '07', friendlyName: 'Division Using Variables',       description: 'Learn how to divide values using variables.' },
    { id: 'circle_area',        number: '08', friendlyName: 'Circle Area Using Variables',    description: 'Learn how to combine variables and numbers to calculate the area of a circle.' },
    { id: 'square_root',        number: '09', friendlyName: 'Square Root Using Variables',    description: 'Learn how to use exponentiation to find the square root.' },
    { id: 'student_result',     number: '10', friendlyName: 'Student Result Calculator',      description: 'Learn how to combine multiple operations to calculate total marks, average, and percentage.' },
    { id: 'square_area',        number: '11', friendlyName: 'Square Area',                    description: 'Learn how to calculate the area of a square using variables.' },
    { id: 'rectangle_area',     number: '12', friendlyName: 'Rectangle Area',                 description: 'Learn how to calculate the area of a rectangle using two variables.' },
    { id: 'temp_conversion',    number: '13', friendlyName: 'Temperature Conversion',         description: 'Learn how to convert temperature from Celsius to Fahrenheit using variables and a formula.' },
  ],
  if_statement: [
    { id: 'positive_number',       number: '01', friendlyName: 'Positive Number Check',             description: 'Learn how to use an if statement to execute code only when a condition is true.' },
    { id: 'divisible_by_5',        number: '02', friendlyName: 'Divisible by 5',                    description: 'Learn how to use the modulo operator (%) in an if condition to check divisibility.' },
    { id: 'voting_eligibility',    number: '03', friendlyName: 'Voting Eligibility',                description: 'Use the greater than or equal to (>=) operator in an if statement.' },
    { id: 'pass_marks',            number: '04', friendlyName: 'Pass Marks Check',                  description: 'Use an if statement to verify a passing threshold condition.' },
    { id: 'square_root_positive',  number: '05', friendlyName: 'Square Root of Positive Number',    description: 'Use an if statement to ensure an operation is only performed on valid inputs.' },
  ],
  if_else: [
    { id: 'even_odd',         number: '01', friendlyName: 'Even or Odd',             description: 'Learn how to use an if-else statement to execute one block for true conditions and another for false.' },
    { id: 'greater_of_two',   number: '02', friendlyName: 'Greater of Two Numbers',  description: 'Use if-else to compare two variables and output the larger one.' },
    { id: 'vowel_consonant',  number: '03', friendlyName: 'Vowel or Consonant',      description: 'Use the "in" keyword within an if-else structure to check if a character is in a group.' },
    { id: 'profit_loss',      number: '04', friendlyName: 'Profit or Loss',          description: 'Use variables representing real-world values in an if-else decision.' },
    { id: 'divisible_by_7',   number: '05', friendlyName: 'Divisible by 7 or Not',  description: 'Use modulo with an if-else to verify exact divisibility.' },
  ],
  if_elif_else: [
    { id: 'largest_of_three',        number: '01', friendlyName: 'Largest of Three Numbers',    description: 'Use if, elif, and else together to check multiple conditions sequentially.' },
    { id: 'grade_calculator',        number: '02', friendlyName: 'Grade Calculator',            description: 'Use multiple elif statements to assign a grade based on numeric scores.' },
    { id: 'positive_negative_zero',  number: '03', friendlyName: 'Positive / Negative / Zero', description: 'Categorize a number into three exact states using if, elif, and else.' },
    { id: 'electricity_bill',        number: '04', friendlyName: 'Electricity Bill Calculator', description: 'Calculate variable costs based on different conditional slabs.' },
    { id: 'income_tax',              number: '05', friendlyName: 'Income Tax Slab',             description: 'Apply tax percentages based on varying income brackets using conditional logic.' },
  ],
  match_case: [
    { id: 'day_name',         number: '01', friendlyName: 'Day Name',                  description: 'Use match-case to cleanly handle multiple specific value conditions.' },
    { id: 'month_name',       number: '02', friendlyName: 'Month Name',                description: 'Use the default case (_) in a match statement to handle invalid inputs.' },
    { id: 'menu_calculator',  number: '03', friendlyName: 'Menu Driven Calculator',    description: 'Use match-case to execute different mathematical operations based on a menu choice.' },
  ],
  for_loop: [
    { id: 'print_1_to_10',                 number: '01', friendlyName: 'Print Numbers (1 to 10)',            description: 'Understand how a for loop iterates over a range of numbers.' },
    { id: 'print_10_to_1',                 number: '02', friendlyName: 'Print Numbers (10 to 1)',            description: 'Learn how to use a negative step in a range function to loop backwards.' },
    { id: 'sum_n_natural',                 number: '03', friendlyName: 'Sum of First N Natural Numbers',     description: 'Understand how to use an accumulator variable inside a loop.' },
    { id: 'factorial',                     number: '04', friendlyName: 'Factorial of a Number',              description: 'Understand how to use an accumulator variable with multiplication.' },
    { id: 'multiplication_table',          number: '05', friendlyName: 'Multiplication Table',               description: 'Learn how to generate a multiplication table using a loop.' },
    { id: 'reverse_multiplication_table',  number: '06', friendlyName: 'Reverse Multiplication Table',       description: 'Learn how to generate a multiplication table backwards.' },
  ],
  while_loop: [
    { id: 'print_1_to_n',      number: '01', friendlyName: 'Print Numbers (1 to N)',  description: 'Understand how a while loop repeats as long as a condition is true.' },
    { id: 'sum_of_digits',     number: '02', friendlyName: 'Sum of Digits',            description: 'Use modulo and integer division in a while loop to process individual digits.' },
    { id: 'reverse_number',    number: '03', friendlyName: 'Reverse a Number',         description: 'Learn to reconstruct a number backwards digit-by-digit using a while loop.' },
    { id: 'count_digits',      number: '04', friendlyName: 'Count Digits',             description: 'Learn how to use a while loop as a simple counter.' },
    { id: 'palindrome_number', number: '05', friendlyName: 'Palindrome Number',        description: 'Learn how to compare modified data against its original state using while loops.' },
    { id: 'armstrong_number',  number: '06', friendlyName: 'Armstrong Number',         description: 'Learn how to process digits and calculate complex sums in a loop.' },
    { id: 'perfect_number',    number: '07', friendlyName: 'Perfect Number Check',     description: 'Learn how to use a while loop to find divisors and check if a number is a Perfect Number.' },
    { id: 'strong_number',     number: '08', friendlyName: 'Strong Number Check',      description: 'Learn how to extract digits and calculate factorial sum to check Strong Number.' },
    { id: 'decimal_to_binary', number: '09', friendlyName: 'Decimal to Binary',        description: 'Learn how to convert decimal to binary using division by 2 in a while loop.' },
    { id: 'binary_to_decimal', number: '10', friendlyName: 'Binary to Decimal',        description: 'Learn how to convert binary to decimal using modulo and powers of 2.' },
    { id: 'factorial',         number: '11', friendlyName: 'Factorial of a Number',    description: 'Learn how to compute the product of numbers from 1 to N using a while loop.' },
  ],
  nested_loop: [
    { id: 'square_star',       number: '01', friendlyName: 'Square Star Pattern',     description: 'Learn the fundamentals of nested loops by generating a grid.' },
    { id: 'right_triangle',    number: '02', friendlyName: 'Right Triangle Pattern',  description: 'Learn how to make the inner loop depend on the outer loop variable.' },
    { id: 'inverted_triangle', number: '03', friendlyName: 'Inverted Triangle Pattern', description: 'Learn how combining a reverse outer loop and dynamic inner loop creates inverted patterns.' },
    { id: 'number_triangle',   number: '04', friendlyName: 'Number Triangle Pattern', description: 'Learn how to use inner loop variables to dynamically generate output values.' },
    { id: 'floyds_triangle',   number: '05', friendlyName: 'Floyds Triangle',         description: 'Learn how to manage independent external state across multiple nested loops.' },
    { id: 'full_pyramid',      number: '06', friendlyName: 'Full Pyramid Star Pattern', description: 'Understand how to use multiple consecutive inner loops inside an outer loop to draw a pyramid.' },
  ],
  loop_control: [
    { id: 'break_statement',    number: '01', friendlyName: 'Break Statement',    description: 'Understand how break terminates the entire loop execution immediately.' },
    { id: 'continue_statement', number: '02', friendlyName: 'Continue Statement', description: 'Understand how continue skips the current iteration and jumps to the next one.' },
    { id: 'pass_statement',     number: '03', friendlyName: 'Pass Statement',     description: 'Understand how pass works as a null statement to prevent syntax errors.' },
    { id: 'prime_number',       number: '04', friendlyName: 'Prime Number Check', description: 'Use loop control variables to check complex conditions like primality.' },
  ],
  functions: [
    { id: 'func_no_args',       number: '01', friendlyName: 'Function Without Arguments',                description: 'Learn how to define a basic function and execute it using a function call.' },
    { id: 'func_with_args',     number: '02', friendlyName: 'Function With Arguments',                   description: 'Learn how to pass data into a function using arguments and parameters.' },
    { id: 'func_with_return',   number: '03', friendlyName: 'Function With Return Value',                description: 'Understand how a function can send computed data back to the calling code.' },
    { id: 'add_using_func',     number: '04', friendlyName: 'Addition Using Function',                   description: 'Learn how to pass variables as arguments and retrieve the computed sum.' },
    { id: 'square_using_func',  number: '05', friendlyName: 'Square of a Number Using Function',         description: 'Learn to encapsulate mathematical logic inside a reusable function.' },
    { id: 'greatest_of_two',    number: '06', friendlyName: 'Greatest of Two Numbers',                   description: 'Combine decision-making logic inside a reusable function.' },
    { id: 'circle_area_func',   number: '07', friendlyName: 'Circle Area Using Function',                description: 'Use functions to perform geometric calculations dynamically based on arguments.' },
    { id: 'simple_interest_func', number: '08', friendlyName: 'Simple Interest Using Function',          description: 'Learn to pass multiple arguments to a function and perform mathematical operations.' },
    { id: 'factorial_func',     number: '09', friendlyName: 'Factorial Using Function',                  description: 'Learn to use loops inside a function to compute a value and return it.' },
    { id: 'even_odd_func',      number: '10', friendlyName: 'Even or Odd Using Function',                description: 'Learn how functions can return different strings based on conditional checks.' },
    { id: 'largest_of_three',   number: '11', friendlyName: 'Largest of Three Numbers Using Function',   description: 'Learn to use if-elif-else statements inside a function and return the correct result.' },
  ],
  recursion: [
    { id: 'recursive_print_n',   number: '01', friendlyName: 'Print Numbers 1 to N',         description: 'Visualize how a recursive function calls itself and builds a call stack.' },
    { id: 'recursive_sum',       number: '02', friendlyName: 'Sum of N Natural Numbers',      description: 'Understand how a recursive function computes values and bubbles them up the call stack.' },
    { id: 'recursive_factorial', number: '03', friendlyName: 'Factorial Using Recursion',     description: 'Observe how recursion mathematically builds up a result.' },
    { id: 'recursive_fibonacci', number: '04', friendlyName: 'Fibonacci Series Using Recursion', description: 'Understand how a function can branch out into multiple recursive calls.' },
    { id: 'recursive_power',     number: '05', friendlyName: 'Power of a Number Using Recursion', description: 'Observe how recursion performs repeated multiplication to compute exponents.' },
  ],
  strings: [
    { id: 'print_string',           number: '01', friendlyName: 'Print a String',                 description: 'Learn how to create and display a basic text string.' },
    { id: 'string_length',          number: '02', friendlyName: 'Find String Length',              description: 'Learn how to use the len() function to count the number of characters in a string.' },
    { id: 'string_upper',           number: '03', friendlyName: 'Convert String to Uppercase',     description: 'Learn how to transform all letters in a string to uppercase.' },
    { id: 'string_lower',           number: '04', friendlyName: 'Convert String to Lowercase',     description: 'Learn how to transform all letters in a string to lowercase.' },
    { id: 'reverse_string',         number: '05', friendlyName: 'Reverse a String',                description: 'Learn how to iterate through a string and build a new string backwards.' },
    { id: 'string_palindrome',      number: '06', friendlyName: 'Palindrome String Check',         description: 'Learn how to compare a string with its reversed version to check for palindromes.' },
    { id: 'count_vowels_consonants',number: '07', friendlyName: 'Count Vowels and Consonants',     description: 'Learn how to process strings character-by-character and classify letters using conditions.' },
    { id: 'count_chars_types',      number: '08', friendlyName: 'Count Digits and Spaces',         description: 'Learn how to use string methods like isdigit() and isspace() to analyze text.' },
    { id: 'string_concat',          number: '09', friendlyName: 'Concatenate Two Strings',         description: 'Learn how to join multiple strings together using the + operator.' },
    { id: 'compare_strings',        number: '10', friendlyName: 'Compare Two Strings',             description: 'Understand how string comparison works and why it is case-sensitive.' },
  ],
  lists: [
    { id: 'basic_list',        number: '01', friendlyName: 'Basic List Operations',             description: 'Learn how to create, access, update, and traverse a Python list.' },
    { id: 'list_stats',        number: '02', friendlyName: 'List Statistics',                   description: 'Learn how to traverse a list to compute sum, average, min, and max values manually.' },
    { id: 'list_search',       number: '03', friendlyName: 'Search Element and Count Occurrences', description: 'Learn how to traverse a list and search for specific elements using conditionals.' },
    { id: 'list_modify',       number: '04', friendlyName: 'Insert and Delete Elements',        description: 'Learn how to add elements to a specific position and remove them using list methods.' },
    { id: 'list_sort_reverse', number: '05', friendlyName: 'Sort and Reverse List',             description: 'Learn how to rearrange list elements using the sort() and reverse() methods.' },
    { id: 'student_marks',     number: '06', friendlyName: 'Student Marks Management',          description: 'Learn to combine iteration, arithmetic and conditionals to process a list of data.' },
  ],
  tuples: [
    { id: 'create_tuple',     number: '01', friendlyName: 'Create and Display Tuple',       description: 'Learn how to create a tuple, print it, and access its elements.' },
    { id: 'tuple_indexing',   number: '02', friendlyName: 'Tuple Indexing and Slicing',     description: 'Understand how to access tuple elements using positive indexes, negative indexes, and slicing.' },
    { id: 'tuple_operations', number: '03', friendlyName: 'Tuple Operations',               description: 'Learn how to use tuple methods like count() and index(), and check membership.' },
  ],
  dictionaries: [
    { id: 'create_dict',    number: '01', friendlyName: 'Create and Access Dictionary',    description: 'Learn how to create a key-value dictionary and access values using their keys.' },
    { id: 'update_dict',    number: '02', friendlyName: 'Update and Delete Dictionary',    description: 'Learn how to modify dictionary values, add new keys, and remove keys using del.' },
    { id: 'traverse_dict',  number: '03', friendlyName: 'Dictionary Traversal',            description: 'Learn how to loop through a dictionary to access keys, values, and key-value pairs.' },
  ],
  searching_sorting: [
    { id: 'linear_search',   number: '01', friendlyName: 'Linear Search',   description: 'Learn how linear search iterates sequentially to find a target.' },
    { id: 'binary_search',   number: '02', friendlyName: 'Binary Search',   description: 'Learn how binary search repeatedly divides a sorted array in half to find a target.' },
    { id: 'bubble_sort',     number: '03', friendlyName: 'Bubble Sort',     description: 'Learn how bubble sort repeatedly steps through the list, compares adjacent elements and swaps them.' },
    { id: 'selection_sort',  number: '04', friendlyName: 'Selection Sort',  description: 'Learn how selection sort finds the minimum element and swaps it to the front.' },
    { id: 'insertion_sort',  number: '05', friendlyName: 'Insertion Sort',  description: 'Learn how insertion sort builds the sorted array one element at a time.' },
  ],
  bubble_sort: [
    { id: 'dsa_bubble_sort', number: '01', friendlyName: 'Bubble Sort Algorithm (O(N²))', description: 'Repeatedly compare adjacent elements and swap if left > right until array is sorted.' },
  ],
  selection_sort: [
    { id: 'dsa_selection_sort', number: '01', friendlyName: 'Selection Sort Algorithm (O(N²))', description: 'Find minimum element in unsorted portion and swap it to the front.' },
  ],
  insertion_sort: [
    { id: 'dsa_insertion_sort', number: '01', friendlyName: 'Insertion Sort Algorithm (O(N²))', description: 'Pick each element and insert it into its correct position in the sorted sublist.' },
  ],
};

const otherProgramsByLang: Record<string, Record<string, { id: string; number: string; friendlyName: string; description: string }[]>> = {
  c: {
    variables: [
      { id: 'c_int', number: '01', friendlyName: 'Integer Data Type (int)', description: 'Understand how C allocates 4 bytes of memory for storing integers.' },
      { id: 'c_float', number: '02', friendlyName: 'Float & Double Data Types', description: 'Learn decimal storage with float and double precision in C.' },
      { id: 'c_char', number: '03', friendlyName: 'Char & ASCII Storage', description: 'Learn how C stores single characters using 1-byte ASCII codes.' },
      { id: 'c_swap_temp', number: '04', friendlyName: 'Swap Two Variables (Using Temp)', description: 'Understand variable value swapping using a third temporary memory slot in C.' },
    ],
    operators: [
      { id: 'c_arithmetic', number: '01', friendlyName: 'Arithmetic Operators (+, -, *, /, %)', description: 'Master C arithmetic operator evaluation rules and integer division vs modulo.' },
      { id: 'c_relational_logical', number: '02', friendlyName: 'Relational & Logical Operators (&&, ||, !)', description: 'Combine multiple boolean evaluation conditions with logical operators in C.' },
      { id: 'c_inc_dec', number: '03', friendlyName: 'Pre-increment vs Post-increment (++i vs i++)', description: 'Understand side effects and memory evaluation timing of ++ operators in C.' },
      { id: 'c_circle_geometry', number: '04', friendlyName: 'Circle Area & Circumference Formulas', description: 'Apply mathematical float expressions for geometry calculations in C.' },
    ],
    user_input: [
      { id: 'c_scanf_integer', number: '01', friendlyName: 'Read Console Integer Input (scanf)', description: 'Read standard user integer input using scanf with format specifiers.' },
      { id: 'c_scanf_float', number: '02', friendlyName: 'Read Console Floating Point (scanf)', description: 'Read decimal floating point input using scanf.' },
      { id: 'c_scanf_string', number: '03', friendlyName: 'Read String Input (scanf)', description: 'Read character array string input in C.' },
    ],
    type_casting: [
      { id: 'c_implicit_casting', number: '01', friendlyName: 'Implicit Widening Type Casting', description: 'Learn automatic conversion from smaller int to float without precision loss.' },
      { id: 'c_explicit_casting', number: '02', friendlyName: 'Explicit Type Casting ((int)val)', description: 'Perform explicit type conversions in C.' },
      { id: 'c_char_ascii', number: '03', friendlyName: 'Char to ASCII Integer Code Conversion', description: 'Understand single character storage as 1-byte ASCII integer codes.' },
    ],
    if_else: [
      { id: 'c_even_odd', number: '01', friendlyName: 'Even or Odd Check in C', description: 'Understand conditional branch execution using modulo % and if-else in C.' },
      { id: 'c_largest_three', number: '02', friendlyName: 'Largest of Three Numbers', description: 'Learn nested conditional evaluation using logical AND (&&) in C.' },
      { id: 'c_leap_year', number: '03', friendlyName: 'Leap Year Checker', description: 'Evaluate compound leap year criteria (% 4, % 100, % 400).' },
      { id: 'c_vowel_consonant', number: '04', friendlyName: 'Vowel or Consonant Check', description: 'Check vowel character matching in C if-else.' },
    ],
    if_elif_else: [
      { id: 'c_marks_grade', number: '01', friendlyName: 'Student Grade System (If-Else Ladder)', description: 'Evaluate multi-tier marks grading system using if-else if ladder.' },
      { id: 'c_tax_calc', number: '02', friendlyName: 'Income Tax Slab Calculator', description: 'Compute variable tax slabs based on total income in C.' },
      { id: 'c_pos_neg_zero', number: '03', friendlyName: 'Positive, Negative, or Zero Checker', description: 'Classify any integer into Positive, Negative, or Zero.' },
      { id: 'c_electricity_bill', number: '04', friendlyName: 'Tiered Electricity Bill Calculator', description: 'Calculate utility electricity bills by consumption units.' },
    ],
    switch_case: [
      { id: 'c_switch_day', number: '01', friendlyName: 'Day of Week Switch Case', description: 'Understand C switch jump tables and break execution.' },
      { id: 'c_switch_calc', number: '02', friendlyName: 'Menu-Driven Arithmetic Calculator', description: 'Build operation selector using char switch in C.' },
      { id: 'c_switch_vowel', number: '03', friendlyName: 'Vowel or Consonant Check (Fallthrough)', description: 'Learn case fallthrough grouping for multiple matching conditions.' },
      { id: 'c_switch_month', number: '04', friendlyName: 'Season Finder by Month Number', description: 'Map month ranges to seasonal weather using switch case.' },
    ],
    for_loop: [
      { id: 'c_for_sum', number: '01', friendlyName: 'Sum of First N Natural Numbers', description: 'Accumulate sum inside a for loop counter in C.' },
      { id: 'c_multiplication_table', number: '02', friendlyName: 'Multiplication Table Generator', description: 'Generate formatted multiplication tables using for loops.' },
      { id: 'c_even_numbers', number: '03', friendlyName: 'Print Even Numbers up to N', description: 'Loop with step increment (i += 2) to filter even numbers.' },
      { id: 'c_fibonacci', number: '04', friendlyName: 'Fibonacci Series Generator (N terms)', description: 'Generate N Fibonacci terms (0, 1, 1, 2, 3...) using for loops.' },
    ],
    while_loop: [
      { id: 'c_while_basic', number: '01', friendlyName: 'While Loop Counter Accumulator', description: 'Learn while loop conditional repetition and state updates in C.' },
      { id: 'c_digit_sum', number: '02', friendlyName: 'Sum of Digits (While Loop)', description: 'Extract digits using % 10 and / 10 inside a while loop.' },
      { id: 'c_factorial', number: '03', friendlyName: 'Factorial Calculation', description: 'Compute multiplicative factorial sequence using while loops.' },
      { id: 'c_reverse_num', number: '04', friendlyName: 'Reverse an Integer Number', description: 'Shift and reverse integer digits in C while loop.' },
    ],
    do_while_loop: [
      { id: 'c_do_while_basic', number: '01', friendlyName: 'Do-While Guaranteed Execution', description: 'Understand exit-controlled loop execution guaranteed to run at least once.' },
      { id: 'c_do_while_sum', number: '02', friendlyName: 'Accumulator Loop (Do-While)', description: 'Accumulate numbers inside a do-while loop in C.' },
    ],
    strings: [
      { id: 'c_string_length', number: '01', friendlyName: 'String Length Calculation (strlen)', description: 'Measure null-terminated character array length.' },
      { id: 'c_string_copy', number: '02', friendlyName: 'String Copy Operation (strcpy)', description: 'Copy character array contents into destination buffer.' },
      { id: 'c_string_reverse', number: '03', friendlyName: 'Reverse a Character Array String', description: 'Reverse character array in-place using two-pointer swap.' },
    ],
    functions: [
      { id: 'c_functions', number: '01', friendlyName: 'Function Declaration & Return in C', description: 'Learn function parameter passing and value returning in C.' },
      { id: 'c_func_addition', number: '02', friendlyName: 'Custom Addition Function with Parameters', description: 'Pass multiple parameters to function and receive return value.' },
      { id: 'c_func_call_by_val', number: '03', friendlyName: 'Call by Value Parameter Passing', description: 'Understand local stack parameter copies in C functions.' },
    ],
    arrays_1d: [
      { id: 'c_array_sum', number: '01', friendlyName: '1D Array Declaration & Element Sum', description: 'Understand contiguous memory allocation and zero-based indexing in C arrays.' },
      { id: 'c_array_max', number: '02', friendlyName: 'Find Maximum Element in 1D Array', description: 'Learn 1D array iteration and comparison logic in C.' },
      { id: 'c_linear_search', number: '03', friendlyName: 'Linear Search in 1D Array', description: 'Search target element in array with early break execution.' },
    ],
  },
  cpp: {
    variables: [
      { id: 'cpp_types', number: '01', friendlyName: 'C++ Primitive Data Types (int, double, bool, char)', description: 'Learn C++ strongly-typed variable declarations and explicit memory storage.' },
      { id: 'cpp_swap_temp', number: '02', friendlyName: 'Swap Two Variables (Using Temp)', description: 'Understand variable value swapping using a third temporary memory slot in C++.' },
      { id: 'cpp_swap_no_temp', number: '03', friendlyName: 'Swap Two Variables (Without Temp)', description: 'Swap two variables using arithmetic addition and subtraction.' },
    ],
    operators: [
      { id: 'cpp_arithmetic', number: '01', friendlyName: 'Arithmetic Operators (+, -, *, /, %)', description: 'Master C++ arithmetic operator evaluation rules and integer division vs modulo.' },
      { id: 'cpp_relational_logical', number: '02', friendlyName: 'Relational & Logical Operators (&&, ||, !)', description: 'Combine multiple boolean evaluation conditions with logical operators in C++.' },
      { id: 'cpp_inc_dec', number: '03', friendlyName: 'Pre-increment vs Post-increment (++i vs i++)', description: 'Understand side effects and memory evaluation timing of ++ operators.' },
      { id: 'cpp_circle_geometry', number: '04', friendlyName: 'Circle Area & Circumference Formulas', description: 'Apply mathematical double expressions for geometry calculations.' },
    ],
    user_input: [
      { id: 'cpp_cin_primitives', number: '01', friendlyName: 'Read Primitive Inputs (cin >>)', description: 'Read different primitive data types (int, float, char) from console.' },
      { id: 'cpp_cin_strings', number: '02', friendlyName: 'Read String Inputs (cin vs getline)', description: 'Compare reading single word strings with cin vs full lines with getline.' },
    ],
    type_casting: [
      { id: 'cpp_implicit_casting', number: '01', friendlyName: 'Implicit Widening Type Casting', description: 'Learn automatic conversion from smaller int to double without precision loss.' },
      { id: 'cpp_explicit_casting', number: '02', friendlyName: 'Explicit Static Casting (static_cast)', description: 'Perform safe explicit type conversions in C++.' },
      { id: 'cpp_char_ascii', number: '03', friendlyName: 'Char to ASCII Integer Code Conversion', description: 'Understand single character storage as 1-byte ASCII integer codes.' },
    ],
    if_else: [
      { id: 'cpp_if_else', number: '01', friendlyName: 'Max of Two Numbers in C++', description: 'Learn conditional logic and std::cout output in C++.' },
      { id: 'cpp_even_odd', number: '02', friendlyName: 'Even or Odd Number Checker', description: 'Check integer parity using modulo % operator in C++.' },
      { id: 'cpp_largest_three', number: '03', friendlyName: 'Largest of Three Numbers', description: 'Learn nested conditional evaluation using logical AND (&&) in C++.' },
      { id: 'cpp_leap_year', number: '04', friendlyName: 'Leap Year Checker', description: 'Evaluate compound leap year criteria (% 4, % 100, % 400).' },
    ],
    if_elif_else: [
      { id: 'cpp_marks_grade', number: '01', friendlyName: 'Student Grade System (If-Else Ladder)', description: 'Evaluate multi-tier marks grading system using if-else if ladder.' },
      { id: 'cpp_tax_calc', number: '02', friendlyName: 'Income Tax Slab Calculator', description: 'Compute variable tax slabs based on total income.' },
      { id: 'cpp_pos_neg_zero', number: '03', friendlyName: 'Positive, Negative, or Zero Checker', description: 'Classify any integer into Positive, Negative, or Zero.' },
      { id: 'cpp_electricity_bill', number: '04', friendlyName: 'Tiered Electricity Bill Calculator', description: 'Calculate utility electricity bills by consumption units.' },
    ],
    switch_case: [
      { id: 'cpp_switch_day', number: '01', friendlyName: 'Day of Week Switch Case', description: 'Understand C++ switch jump tables and break execution.' },
      { id: 'cpp_switch_calc', number: '02', friendlyName: 'Menu-Driven Arithmetic Calculator', description: 'Build operation selector using char switch in C++.' },
      { id: 'cpp_switch_vowel', number: '03', friendlyName: 'Vowel or Consonant Check (Fallthrough)', description: 'Learn case fallthrough grouping for multiple matching conditions.' },
      { id: 'cpp_switch_month', number: '04', friendlyName: 'Season Finder by Month Number', description: 'Map month ranges to seasonal weather using switch case.' },
    ],
    for_loop: [
      { id: 'cpp_for_sum', number: '01', friendlyName: 'Sum of First N Natural Numbers', description: 'Accumulate sum inside a for loop counter in C++.' },
      { id: 'cpp_multiplication_table', number: '02', friendlyName: 'Multiplication Table Generator', description: 'Generate formatted multiplication tables using for loops.' },
      { id: 'cpp_even_numbers', number: '03', friendlyName: 'Print Even Numbers up to N', description: 'Loop with step increment (i += 2) to filter even numbers.' },
      { id: 'cpp_fibonacci', number: '04', friendlyName: 'Fibonacci Series Generator (N terms)', description: 'Generate N Fibonacci terms (0, 1, 1, 2, 3...) using for loops.' },
    ],
    while_loop: [
      { id: 'cpp_while', number: '01', friendlyName: 'While Loop Accumulator in C++', description: 'Learn while loop conditional repetition and state updates in C++.' },
      { id: 'cpp_digit_sum', number: '02', friendlyName: 'Sum of Digits (While Loop)', description: 'Extract digits using % 10 and / 10 inside a while loop.' },
      { id: 'cpp_factorial', number: '03', friendlyName: 'Factorial Calculation (long long)', description: 'Compute multiplicative factorial sequence using while loops.' },
      { id: 'cpp_reverse_num', number: '04', friendlyName: 'Reverse an Integer Number', description: 'Shift and reverse integer digits in C++ while loop.' },
    ],
    do_while_loop: [
      { id: 'cpp_do_while', number: '01', friendlyName: 'Do-While Guaranteed Execution', description: 'Understand exit-controlled loop execution guaranteed to run at least once.' },
      { id: 'cpp_do_while_sum', number: '02', friendlyName: 'Accumulator Loop (Do-While)', description: 'Accumulate numbers inside a do-while loop in C++.' },
    ],
    strings: [
      { id: 'cpp_string_concat', number: '01', friendlyName: 'String Concatenation & Length (.length())', description: 'Join C++ std::string objects and inspect string length.' },
      { id: 'cpp_string_access', number: '02', friendlyName: 'String Character Access & Indexing (str[i])', description: 'Access individual characters in C++ string by zero-based index.' },
      { id: 'cpp_string_reverse', number: '03', friendlyName: 'Reverse a String (std::string)', description: 'Reverse string characters in-place using two-pointer swap.' },
    ],
    functions: [
      { id: 'cpp_square_func', number: '01', friendlyName: 'Square Function in C++', description: 'Understand function parameters, local scope, and return values in C++.' },
      { id: 'cpp_func_addition', number: '02', friendlyName: 'Custom Addition Function with Parameters', description: 'Pass multiple parameters to function and receive return value.' },
      { id: 'cpp_func_pass_by_val', number: '03', friendlyName: 'Pass by Value (Parameter Copying)', description: 'Understand how pass by value creates independent local memory copies.' },
      { id: 'cpp_func_pass_by_ref', number: '04', friendlyName: 'Pass by Reference (int &x)', description: 'Modify caller variables directly using C++ reference parameters.' },
    ],
    arrays_1d: [
      { id: 'cpp_array_max', number: '01', friendlyName: 'Find Maximum Element in C++ Array', description: 'Learn 1D array iteration and comparison logic in C++.' },
      { id: 'cpp_array_sum', number: '02', friendlyName: '1D Array Sum & Average Computation', description: 'Calculate array element sum and average in C++.' },
      { id: 'cpp_linear_search', number: '03', friendlyName: 'Linear Search in 1D Array', description: 'Search target element in array with early break execution.' },
      { id: 'cpp_array_reverse', number: '04', friendlyName: 'Reverse 1D Array Elements In-place', description: 'Swap array elements in-place using two pointers in C++.' },
    ],
    arrays_2d: [
      { id: 'cpp_matrix_2d', number: '01', friendlyName: '2D Matrix Declaration & Traversal', description: 'Traverse row-column grid elements using nested loops in C++.' },
      { id: 'cpp_diagonal_sum_2d', number: '02', friendlyName: 'Primary Diagonal Sum of 2D Matrix', description: 'Calculate primary diagonal sum (matrix[i][i]) in 2D array.' },
      { id: 'cpp_matrix_transpose', number: '03', friendlyName: '2D Matrix Transpose', description: 'Transpose matrix rows into columns in C++.' },
    ],
  },
  dsa: {
    array_operations: [
      { id: 'dsa_array_declare', number: '01', friendlyName: 'Array Declaration & Initialization', description: 'Declare a fixed-size array and initialize elements at each index.' },
      { id: 'dsa_array_sum', number: '02', friendlyName: 'Sum & Average of Array Elements', description: 'Traverse all elements and accumulate sum to compute average.' },
      { id: 'dsa_array_max_min', number: '03', friendlyName: 'Find Maximum & Minimum Element', description: 'Single pass linear scan to track max and min values in array.' },
      { id: 'dsa_array_reverse', number: '04', friendlyName: 'In-place Array Reversal (Two Pointers)', description: 'Swap elements from both ends moving inward until they meet.' },
      { id: 'dsa_array_count', number: '05', friendlyName: 'Count Occurrences of Element', description: 'Count how many times a target value appears in an array.' },
    ],
    searching: [
      { id: 'dsa_linear_search', number: '01', friendlyName: 'Linear Search Algorithm (O(N))', description: 'Sequentially check each element from index 0 to N-1 for target match.' },
      { id: 'dsa_binary_search', number: '02', friendlyName: 'Binary Search Algorithm (O(log N))', description: 'Divide-and-conquer: eliminate half the array with each low, mid, high comparison.' },
      { id: 'dsa_binary_search', number: '03', friendlyName: 'Binary Search — First Occurrence', description: 'Find the first index of a repeated element in a sorted array.' },
    ],
    sorting: [
      { id: 'dsa_bubble_sort', number: '01', friendlyName: 'Bubble Sort Algorithm (O(N²))', description: 'Repeatedly compare adjacent elements and swap them into sorted order.' },
      { id: 'dsa_selection_sort', number: '02', friendlyName: 'Selection Sort Algorithm (O(N²))', description: 'Select the minimum element from the unsorted region and move it to front.' },
      { id: 'dsa_insertion_sort', number: '03', friendlyName: 'Insertion Sort Algorithm', description: 'Build a sorted array one element at a time by inserting into the correct position.' },
      { id: 'dsa_bubble_sort', number: '04', friendlyName: 'Sort Array in Descending Order', description: 'Modify sort algorithm to arrange elements from largest to smallest.' },
    ],
    recursion_dsa: [
      { id: 'dsa_recursion_factorial', number: '01', friendlyName: 'Factorial — Recursive Call Stack', description: 'Visualize how factorial(N) builds a call stack of recursive frames until base case N=0.' },
      { id: 'dsa_recursion_sum', number: '02', friendlyName: 'Sum of N Natural Numbers (Recursion)', description: 'Compute sum(N) = N + sum(N-1) recursively and visualize the return stack.' },
      { id: 'dsa_recursion_factorial', number: '03', friendlyName: 'Fibonacci — Recursive Call Tree', description: 'Trace overlapping sub-problem recursive calls in Fibonacci computation.' },
      { id: 'dsa_recursion_factorial', number: '04', friendlyName: 'Power of Number Using Recursion', description: 'Compute pow(base, exp) = base * pow(base, exp-1) with call stack frames.' },
    ],
    stack: [
      { id: 'dsa_stack_push_pop', number: '01', friendlyName: 'Stack Implementation Using Array', description: 'Build a stack with a fixed array and maintain a top index pointer.' },
      { id: 'dsa_stack_push_pop', number: '02', friendlyName: 'Stack Push Operation', description: 'Increment top pointer and insert element at stack[top] position.' },
      { id: 'dsa_stack_push_pop', number: '03', friendlyName: 'Stack Pop & Top Peek', description: 'Retrieve and remove the top element; decrement top pointer.' },
      { id: 'dsa_stack_push_pop', number: '04', friendlyName: 'Balanced Parentheses Checker', description: 'Use a stack to match every opening bracket with its closing bracket.' },
    ],
    queue: [
      { id: 'dsa_queue_array_impl', number: '01', friendlyName: 'Queue Implementation Using Array', description: 'Build a queue with a fixed array and maintain front and rear pointer indices.' },
      { id: 'dsa_queue_enq_deq', number: '02', friendlyName: 'Queue Enqueue (Insert at Rear)', description: 'Add element to the rear of the queue and advance the rear pointer.' },
      { id: 'dsa_queue_enq_deq', number: '03', friendlyName: 'Queue Dequeue (Remove from Front)', description: 'Remove element from the front of the queue and advance the front pointer.' },
      { id: 'dsa_queue_enq_deq', number: '04', friendlyName: 'Circular Queue (Ring Buffer)', description: 'Wrap around the array when rear reaches end using modulo arithmetic.' },
    ],
    singly_linked_list: [
      { id: 'dsa_sll_traverse', number: '01', friendlyName: 'Singly Linked List — Node Structure', description: 'Create nodes with data and next pointer; understand heap memory allocation.' },
      { id: 'dsa_sll_traverse', number: '02', friendlyName: 'Insert Node at Head', description: 'Prepend a new node at the beginning; update head pointer.' },
      { id: 'dsa_sll_traverse', number: '03', friendlyName: 'Insert Node at Tail', description: 'Traverse to the last node; set its next pointer to new node.' },
      { id: 'dsa_sll_traverse', number: '04', friendlyName: 'Traverse & Print Linked List', description: 'Follow next pointers from head to NULL and print each node value.' },
      { id: 'dsa_sll_reverse', number: '05', friendlyName: 'Reverse a Singly Linked List', description: 'Use three pointers (prev, curr, next) to reverse all next pointer links.' },
    ],
    doubly_linked_list: [
      { id: 'dsa_dll_traverse', number: '01', friendlyName: 'Doubly Linked List — Node Structure', description: 'Create nodes with prev, data, and next pointers for bidirectional traversal.' },
      { id: 'dsa_dll_traverse', number: '02', friendlyName: 'Insert Node at Head (Doubly)', description: 'Prepend node: set new node next = head, update head prev = new node.' },
      { id: 'dsa_dll_traverse', number: '03', friendlyName: 'Traverse Forward & Backward', description: 'Traverse doubly linked list using next pointers, then using prev pointers.' },
      { id: 'dsa_dll_traverse', number: '04', friendlyName: 'Delete Node from Doubly Linked List', description: 'Update both prev and next pointers of neighboring nodes to unlink a node.' },
    ],
    binary_tree: [
      { id: 'dsa_sll_traverse', number: '01', friendlyName: 'Binary Tree — Node Structure', description: 'Create tree nodes with value, left pointer, and right pointer.' },
      { id: 'dsa_sll_traverse', number: '02', friendlyName: 'Inorder Traversal (Left-Root-Right)', description: 'Recursively visit left subtree, then root, then right subtree.' },
      { id: 'dsa_sll_traverse', number: '03', friendlyName: 'Preorder Traversal (Root-Left-Right)', description: 'Recursively visit root first, then left subtree, then right subtree.' },
      { id: 'dsa_sll_traverse', number: '04', friendlyName: 'Level Order (BFS on Tree)', description: 'Visit tree nodes level by level using a queue data structure.' },
    ],
    graph_basics: [
      { id: 'dsa_array_max_min', number: '01', friendlyName: 'Graph — Adjacency Matrix Representation', description: 'Represent an undirected graph as a 2D N×N matrix of 0s and 1s.' },
      { id: 'dsa_array_max_min', number: '02', friendlyName: 'Graph — Adjacency List Representation', description: 'Represent graph as array of linked lists (space efficient for sparse graphs).' },
      { id: 'dsa_linear_search', number: '03', friendlyName: 'Breadth First Search (BFS)', description: 'Level-order graph traversal using a queue; shortest path in unweighted graphs.' },
      { id: 'dsa_linear_search', number: '04', friendlyName: 'Depth First Search (DFS)', description: 'Explore as far as possible along each branch before backtracking.' },
    ],
  },
  java: {
    variables: [
      { id: 'java_types', number: '01', friendlyName: 'Java Primitive Data Types (int, double, boolean, char)', description: 'Understand Java strongly-typed primitives, explicit byte sizes, and memory allocation.' },
      { id: 'java_swap_temp', number: '02', friendlyName: 'Swap Two Variables (Using Temp Variable)', description: 'Understand variable swapping logic and temporary memory slot usage.' },
      { id: 'java_swap_no_temp', number: '03', friendlyName: 'Swap Two Variables (Without Temp Variable)', description: 'Swap two integer variables using arithmetic addition and subtraction.' },
    ],
    type_casting: [
      { id: 'java_casting', number: '01', friendlyName: 'Implicit & Explicit Type Casting', description: 'Learn automatic widening and manual narrowing casting in Java.' },
      { id: 'java_widening', number: '02', friendlyName: 'Automatic Widening Type Casting', description: 'Understand automatic conversion from smaller int [4B] to larger double [8B].' },
    ],
    operators_expressions: [
      { id: 'java_temp_convert', number: '01', friendlyName: 'Temperature Converter (Celsius to Fahrenheit)', description: 'Learn mixed double expression evaluation and formula computation in Java.' },
      { id: 'java_circle_area', number: '02', friendlyName: 'Area & Circumference of Circle', description: 'Learn floating point math formulas using double precision in Java.' },
      { id: 'java_simple_interest', number: '03', friendlyName: 'Simple Interest Calculator', description: 'Compute interest formula (P * R * T) / 100 using double arithmetic expressions.' },
    ],
    user_input: [
      { id: 'java_scanner_number', number: '01', friendlyName: 'Read User Integer Input (Scanner.nextInt)', description: 'Learn Scanner initialization and integer user input reading with sc.nextInt().' },
      { id: 'java_scanner_float', number: '02', friendlyName: 'Read User Double Input (Scanner.nextDouble)', description: 'Read decimal floating point input from user using sc.nextDouble().' },
      { id: 'java_scanner_string', number: '03', friendlyName: 'Read User String Line (Scanner.nextLine)', description: 'Read full text line input from user using sc.nextLine().' },
    ],
    if_else: [
      { id: 'java_even_odd', number: '01', friendlyName: 'Even or Odd Check', description: 'Understand binary branch decision execution using if-else and modulo % in Java.' },
      { id: 'java_largest_three', number: '02', friendlyName: 'Largest of Three Numbers', description: 'Learn logical AND (&&) combination in Java if-else if decision trees.' },
      { id: 'java_leap_year', number: '03', friendlyName: 'Leap Year Checker', description: 'Learn complex boolean expression logic (% 4, % 100, % 400).' },
      { id: 'java_vowel_if', number: '04', friendlyName: 'Vowel or Consonant (If-Else Logical OR)', description: 'Learn multiple character comparisons using logical OR (||) in Java.' },
    ],
    if_elif_else: [
      { id: 'java_grade', number: '01', friendlyName: 'Student Grade Calculator (If-Else Ladder)', description: 'Learn multi-branch conditional execution using if-else if in Java.' },
      { id: 'java_tax_calc', number: '02', friendlyName: 'Income Tax Slab Calculator', description: 'Calculate variable tax percentage slabs using Java conditionals.' },
      { id: 'java_pos_neg_zero', number: '03', friendlyName: 'Positive, Negative or Zero Checker', description: 'Classify any integer into Positive, Negative, or Zero using an if-else if ladder.' },
      { id: 'java_bmi_calc', number: '04', friendlyName: 'BMI Category Calculator', description: 'Calculate Body Mass Index (weight / height^2) and categorize health status.' },
      { id: 'java_electricity_bill', number: '05', friendlyName: 'Electricity Bill Slab Calculator', description: 'Calculate tiered utility electricity bills by unit consumption slabs.' },
    ],
    switch_case: [
      { id: 'java_switch_day', number: '01', friendlyName: 'Day of Week Switch Case', description: 'Understand Java switch-case jumping and break statements.' },
      { id: 'java_switch_vowel', number: '02', friendlyName: 'Vowel or Consonant Check', description: 'Learn switch case fallthrough grouping for multiple matching conditions.' },
      { id: 'java_switch_calc', number: '03', friendlyName: 'Menu Driven Calculator', description: 'Learn operation selection using char switch in Java.' },
      { id: 'java_switch_month', number: '04', friendlyName: 'Season Finder by Month Number', description: 'Learn range mapping with switch case statements.' },
      { id: 'java_switch_grade', number: '05', friendlyName: 'Performance Comment by Grade', description: 'Learn character switch matching with descriptive output.' },
    ],
    for_loop: [
      { id: 'java_for_sum', number: '01', friendlyName: 'Sum of First N Natural Numbers', description: 'Learn accumulator variable accumulation in Java for loop.' },
      { id: 'java_multiplication_table', number: '02', friendlyName: 'Multiplication Table Generator', description: 'Learn dynamic loop multiplier output formatting.' },
      { id: 'java_fibonacci_for', number: '03', friendlyName: 'Fibonacci Series Generator (For Loop)', description: 'Generate N Fibonacci terms (0, 1, 1, 2, 3, 5...) using variable swapping in a for loop.' },
      { id: 'java_even_numbers', number: '04', friendlyName: 'Print Even Numbers up to N', description: 'Loop with step increment (i += 2) to filter even numbers.' },
      { id: 'java_power_calc', number: '05', friendlyName: 'Power of a Number (base^exp)', description: 'Compute exponential power by repeated multiplication inside a for loop.' },
    ],
    while_loop: [
      { id: 'java_while_digits', number: '01', friendlyName: 'Sum of Digits (While Loop)', description: 'Learn digit extraction using % 10 and / 10 inside a while loop.' },
      { id: 'java_factorial', number: '02', friendlyName: 'Factorial Calculation', description: 'Learn multiplicative accumulation in loops.' },
      { id: 'java_reverse_num', number: '03', friendlyName: 'Reverse an Integer Number', description: 'Learn math digit shifting (rev = rev * 10 + digit) in loops.' },
      { id: 'java_prime_check', number: '04', friendlyName: 'Prime Number Checker', description: 'Learn divisor testing using boolean flags in loops.' },
      { id: 'java_palindrome_num', number: '05', friendlyName: 'Palindrome Number Checker', description: 'Check if integer reading forward and backward is identical (e.g., 121 -> 121).' },
    ],
    do_while_loop: [
      { id: 'java_do_while', number: '01', friendlyName: 'Do-While Guaranteed Execution', description: 'Learn exit-controlled do-while loops in Java.' },
      { id: 'java_do_while_sum', number: '02', friendlyName: 'Accumulator Loop (Do-While Loop)', description: 'Accumulate numbers inside a do-while loop guaranteed to run at least once.' },
    ],
    strings: [
      { id: 'java_ascii', number: '01', friendlyName: 'Char to ASCII Integer Conversion', description: 'Understand character encoding and numeric ASCII representation in Java.' },
      { id: 'java_string_concat', number: '02', friendlyName: 'String Concatenation & Length', description: 'Join String objects using + operator and inspect string .length().' },
    ],
    arrays_1d: [
      { id: 'java_array_sum_1d', number: '01', friendlyName: '1D Array Sum & Average', description: 'Learn Java 1D array allocation, element indexing, and average computation.' },
      { id: 'java_array_max_1d', number: '02', friendlyName: 'Find Maximum & Minimum in 1D Array', description: 'Learn element comparisons and tracking extrema in Java arrays.' },
      { id: 'java_linear_search', number: '03', friendlyName: 'Linear Search in 1D Array', description: 'Learn target element search and early break execution in Java arrays.' },
      { id: 'java_array_reverse', number: '04', friendlyName: 'Reverse 1D Array Elements', description: 'Learn in-place array swapping using two pointers.' },
    ],
    arrays_2d: [
      { id: 'java_matrix_2d', number: '01', friendlyName: '2D Matrix Declaration & Traversal', description: 'Understand 2D array matrix row and column indexing in Java.' },
      { id: 'java_diagonal_sum_2d', number: '02', friendlyName: 'Primary Diagonal Sum of 2D Matrix', description: 'Learn matrix primary diagonal indexing (matrix[i][i]) in Java 2D arrays.' },
      { id: 'java_matrix_transpose', number: '03', friendlyName: '2D Matrix Transpose', description: 'Learn row-column swapping matrix transposition in Java.' },
    ],
  }
};

/* =========================================================
   PAGE
   ========================================================= */
export const ProgramSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { languageId, topicId } = useParams();
  const programs = (languageId && topicId && otherProgramsByLang[languageId]?.[topicId])
    ? otherProgramsByLang[languageId][topicId]
    : (topicId && mockProgramsByTopic[topicId] ? mockProgramsByTopic[topicId] : []);

  const topicDisplayName = topicId
    ? topicId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Programs';
  const langDisplay = languageId?.toUpperCase() || 'Language';

  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-80 bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="flex flex-col pt-4 md:pt-6 pb-12 px-4 max-w-7xl mx-auto w-full min-h-full relative z-10">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono font-extrabold text-indigo-300 bg-indigo-950/50 border border-indigo-400/30 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md shadow-sm">
              {langDisplay} · {topicDisplayName}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight text-white drop-shadow-sm">
            {topicDisplayName} Programs
          </h1>
          <p className="text-sm md:text-base text-slate-200 font-medium leading-normal whitespace-nowrap">
            Select a program to step through step-by-step visual execution.
          </p>
        </motion.div>

        {/* Program Grid */}
        {programs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-16">
              <Code2 className="w-10 h-10 mx-auto mb-4 text-indigo-400 opacity-40" />
              <p className="text-slate-300 font-medium">No programs found for this topic.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            {programs.map((prog, index) => (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Open program ${prog.friendlyName}`}
                  onClick={() => navigate(`/visualizer/${languageId}/${topicId}/${prog.id}`)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/visualizer/${languageId}/${topicId}/${prog.id}`); }}
                  className="flex flex-col min-h-50 p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden select-none"
                  style={{
                    background: 'rgba(12, 14, 22, 0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(99,102,241,0.5)';
                    el.style.transform = 'translateY(-3px)';
                    el.style.boxShadow = '0 10px 30px -8px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.3)';
                    const arrow = el.querySelector('.arrow-hint') as HTMLElement;
                    if (arrow) arrow.style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.1)';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                    const arrow = el.querySelector('.arrow-hint') as HTMLElement;
                    if (arrow) arrow.style.opacity = '0';
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-950/60 border border-indigo-400/30">
                        <Code2 className="w-5 h-5 text-indigo-300" />
                      </div>
                    </div>

                    {/* Program number badge */}
                    <span className="text-[10px] font-extrabold shrink-0 px-2.5 py-1 rounded-full font-mono text-slate-200 bg-white/5 border border-white/10">
                      #{prog.number}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="font-extrabold mb-2 leading-snug text-base text-white group-hover:text-indigo-200 transition-colors">
                    {prog.friendlyName}
                  </h2>

                  {/* Description — fully visible */}
                  <p className="text-xs font-medium leading-relaxed flex-1 text-slate-200">
                    {prog.description}
                  </p>

                  {/* Bottom action hint */}
                  <div
                    className="arrow-hint flex items-center gap-2 mt-4 pt-3 transition-opacity duration-200 border-t border-white/10 text-indigo-300 text-xs font-bold"
                    style={{ opacity: 0 }}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Visualization</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};
