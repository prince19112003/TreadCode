import type { LessonProgram } from './types';
import { variablesLessons } from './python/variables/index';
import { ifStatementLessons } from './python/if_statement/index';
import { ifElseLessons } from './python/if_else/index';
import { ifElifElseLessons } from './python/if_elif_else/index';
import { matchCaseLessons } from './python/match_case/index';
import { forLoopLessons } from './python/for_loop/index';
import { whileLoopLessons } from './python/while_loop/index';
import { nestedLoopLessons } from './python/nested_loop/index';
import { loopControlLessons } from './python/loop_control/index';
import { functionsLessons } from './python/functions/index';
import { recursionLessons } from './python/recursion/index';
import { stringsLessons } from './python/strings/index';
import { listsLessons } from './python/lists/index';
import { tuplesLessons } from './python/tuples/index';
import { dictionariesLessons } from './python/dictionaries/index';
import { searchingSortingLessons } from './python/searching_sorting/index';

import { cLessons } from './c/index';
import { cppLessons } from './cpp/index';
import { javaLessons } from './java/index';
import { dsaLessons } from './dsa/index';

// In the future, this registry will grow to include other topics and languages.
export const lessonRegistry: Record<string, Record<string, Record<string, LessonProgram>>> = {
  python: {
    t1: variablesLessons,
    variables: variablesLessons, // supporting both ID formats just in case
    if_statement: ifStatementLessons,
    if_else: ifElseLessons,
    if_elif_else: ifElifElseLessons,
    match_case: matchCaseLessons,
    for_loop: forLoopLessons,
    while_loop: whileLoopLessons,
    nested_loop: nestedLoopLessons,
    loop_control: loopControlLessons,
    functions: functionsLessons,
    recursion: recursionLessons,
    strings: stringsLessons,
    lists: listsLessons,
    tuples: tuplesLessons,
    dictionaries: dictionariesLessons,
    searching_sorting: searchingSortingLessons,
  },
  dsa: {
    array_operations: {
      dsa_array_declare: dsaLessons.dsa_array_declare,
      dsa_array_sum: dsaLessons.dsa_array_sum,
      dsa_array_max_min: dsaLessons.dsa_array_max_min,
      dsa_array_reverse: dsaLessons.dsa_array_reverse,
      dsa_array_count: dsaLessons.dsa_array_count,
    },
    searching: {
      dsa_linear_search: dsaLessons.dsa_linear_search,
      dsa_binary_search: dsaLessons.dsa_binary_search,
    },
    sorting: {
      dsa_bubble_sort: dsaLessons.dsa_bubble_sort,
      dsa_selection_sort: dsaLessons.dsa_selection_sort,
      dsa_insertion_sort: dsaLessons.dsa_insertion_sort,
    },
    recursion_dsa: {
      dsa_recursion_factorial: dsaLessons.dsa_recursion_factorial,
      dsa_recursion_sum: dsaLessons.dsa_recursion_sum,
    },
    stack: {
      dsa_stack_push_pop: dsaLessons.dsa_stack_push_pop,
    },
    queue: {
      dsa_queue_enq_deq: dsaLessons.dsa_queue_enq_deq,
    },
    singly_linked_list: {
      dsa_sll_traverse: dsaLessons.dsa_sll_traverse,
      dsa_sll_reverse: dsaLessons.dsa_sll_reverse,
    },
    doubly_linked_list: {
      dsa_sll_traverse: dsaLessons.dsa_sll_traverse,
    },
    binary_tree: {
      dsa_sll_traverse: dsaLessons.dsa_sll_traverse,
    },
    graph_basics: {
      dsa_graph_basics: dsaLessons.dsa_graph_basics,
    },
    graph_traversals: {
      dsa_graph_traversals: dsaLessons.dsa_graph_traversals,
    },
  },
  c: {
    variables: {
      c_int: cLessons.c_int,
      c_float: cLessons.c_float,
      c_char: cLessons.c_char,
      c_swap_temp: cLessons.c_swap_temp,
      c_swap_no_temp: cLessons.c_swap_no_temp,
      c_constants: cLessons.c_constants,
    },
    operators: {
      c_arithmetic: cLessons.c_arithmetic,
      c_relational_logical: cLessons.c_relational_logical,
      c_inc_dec: cLessons.c_inc_dec,
      c_circle_geometry: cLessons.c_circle_geometry,
    },
    user_input: {
      c_scanf_integer: cLessons.c_scanf_integer,
      c_scanf_float: cLessons.c_scanf_float,
      c_scanf_string: cLessons.c_scanf_string,
    },
    type_casting: {
      c_implicit_casting: cLessons.c_implicit_casting,
      c_explicit_casting: cLessons.c_explicit_casting,
      c_char_ascii: cLessons.c_char_ascii,
    },
    if_else: {
      c_even_odd: cLessons.c_even_odd,
      c_largest_three: cLessons.c_largest_three,
      c_leap_year: cLessons.c_leap_year,
      c_vowel_consonant: cLessons.c_vowel_consonant,
    },
    if_elif_else: {
      c_marks_grade: cLessons.c_marks_grade,
      c_tax_calc: cLessons.c_tax_calc,
      c_pos_neg_zero: cLessons.c_pos_neg_zero,
      c_electricity_bill: cLessons.c_electricity_bill,
    },
    switch_case: {
      c_switch_day: cLessons.c_switch_day,
      c_switch_calc: cLessons.c_switch_calc,
      c_switch_vowel: cLessons.c_switch_vowel,
      c_switch_month: cLessons.c_switch_month,
    },
    for_loop: {
      c_for_sum: cLessons.c_for_sum,
      c_multiplication_table: cLessons.c_multiplication_table,
      c_even_numbers: cLessons.c_even_numbers,
      c_fibonacci: cLessons.c_fibonacci,
    },
    while_loop: {
      c_while_basic: cLessons.c_while_basic,
      c_digit_sum: cLessons.c_digit_sum,
      c_factorial: cLessons.c_factorial,
      c_reverse_num: cLessons.c_reverse_num,
    },
    do_while_loop: {
      c_do_while_basic: cLessons.c_do_while_basic,
      c_do_while_sum: cLessons.c_do_while_sum,
    },
    strings: {
      c_string_length: cLessons.c_string_length,
      c_string_copy: cLessons.c_string_copy,
      c_string_reverse: cLessons.c_string_reverse,
    },
    functions: {
      c_functions: cLessons.c_functions,
      c_func_addition: cLessons.c_func_addition,
      c_func_call_by_val: cLessons.c_func_call_by_val,
    },
    arrays_1d: {
      c_array_sum: cLessons.c_array_sum,
      c_array_max: cLessons.c_array_max,
      c_linear_search: cLessons.c_linear_search,
    },
  },
  cpp: {
    variables: {
      cpp_types: cppLessons.cpp_types,
      cpp_swap_temp: cppLessons.cpp_swap_temp,
      cpp_swap_no_temp: cppLessons.cpp_swap_no_temp,
    },
    operators: {
      cpp_arithmetic: cppLessons.cpp_arithmetic,
      cpp_relational_logical: cppLessons.cpp_relational_logical,
      cpp_inc_dec: cppLessons.cpp_inc_dec,
      cpp_circle_geometry: cppLessons.cpp_circle_geometry,
    },
    user_input: {
      cpp_cin_primitives: cppLessons.cpp_cin_primitives,
      cpp_cin_strings: cppLessons.cpp_cin_strings,
    },
    type_casting: {
      cpp_implicit_casting: cppLessons.cpp_implicit_casting,
      cpp_explicit_casting: cppLessons.cpp_explicit_casting,
      cpp_char_ascii: cppLessons.cpp_char_ascii,
    },
    if_else: {
      cpp_if_else: cppLessons.cpp_if_else,
      cpp_even_odd: cppLessons.cpp_even_odd,
      cpp_largest_three: cppLessons.cpp_largest_three,
      cpp_leap_year: cppLessons.cpp_leap_year,
    },
    if_elif_else: {
      cpp_marks_grade: cppLessons.cpp_marks_grade,
      cpp_tax_calc: cppLessons.cpp_tax_calc,
      cpp_pos_neg_zero: cppLessons.cpp_pos_neg_zero,
      cpp_electricity_bill: cppLessons.cpp_electricity_bill,
    },
    switch_case: {
      cpp_switch_day: cppLessons.cpp_switch_day,
      cpp_switch_calc: cppLessons.cpp_switch_calc,
      cpp_switch_vowel: cppLessons.cpp_switch_vowel,
      cpp_switch_month: cppLessons.cpp_switch_month,
    },
    for_loop: {
      cpp_for_sum: cppLessons.cpp_for_sum,
      cpp_multiplication_table: cppLessons.cpp_multiplication_table,
      cpp_even_numbers: cppLessons.cpp_even_numbers,
      cpp_fibonacci: cppLessons.cpp_fibonacci,
    },
    while_loop: {
      cpp_while: cppLessons.cpp_while,
      cpp_digit_sum: cppLessons.cpp_digit_sum,
      cpp_factorial: cppLessons.cpp_factorial,
      cpp_reverse_num: cppLessons.cpp_reverse_num,
    },
    do_while_loop: {
      cpp_do_while: cppLessons.cpp_do_while,
      cpp_do_while_sum: cppLessons.cpp_do_while_sum,
    },
    strings: {
      cpp_string_concat: cppLessons.cpp_string_concat,
      cpp_string_access: cppLessons.cpp_string_access,
      cpp_string_reverse: cppLessons.cpp_string_reverse,
    },
    functions: {
      cpp_square_func: cppLessons.cpp_square_func,
      cpp_func_addition: cppLessons.cpp_func_addition,
      cpp_func_pass_by_val: cppLessons.cpp_func_pass_by_val,
      cpp_func_pass_by_ref: cppLessons.cpp_func_pass_by_ref,
    },
    arrays_1d: {
      cpp_array_max: cppLessons.cpp_array_max,
      cpp_array_sum: cppLessons.cpp_array_sum,
      cpp_linear_search: cppLessons.cpp_linear_search,
      cpp_array_reverse: cppLessons.cpp_array_reverse,
    },
    arrays_2d: {
      cpp_matrix_2d: cppLessons.cpp_matrix_2d,
      cpp_diagonal_sum_2d: cppLessons.cpp_diagonal_sum_2d,
      cpp_matrix_transpose: cppLessons.cpp_matrix_transpose,
    },
  },
  java: {
    variables: {
      java_types: javaLessons.java_types,
      java_swap_temp: javaLessons.java_swap_temp,
      java_swap_no_temp: javaLessons.java_swap_no_temp,
    },
    type_casting: {
      java_casting: javaLessons.java_casting,
      java_widening: javaLessons.java_widening,
    },
    operators_expressions: {
      java_temp_convert: javaLessons.java_temp_convert,
      java_circle_area: javaLessons.java_circle_area,
      java_simple_interest: javaLessons.java_simple_interest,
    },
    user_input: {
      java_scanner_number: javaLessons.java_scanner_number,
      java_scanner_float: javaLessons.java_scanner_float,
      java_scanner_string: javaLessons.java_scanner_string,
    },
    if_else: {
      java_even_odd: javaLessons.java_even_odd,
      java_largest_three: javaLessons.java_largest_three,
      java_leap_year: javaLessons.java_leap_year,
      java_vowel_if: javaLessons.java_vowel_if,
    },
    if_elif_else: {
      java_grade: javaLessons.java_grade,
      java_tax_calc: javaLessons.java_tax_calc,
      java_pos_neg_zero: javaLessons.java_pos_neg_zero,
      java_bmi_calc: javaLessons.java_bmi_calc,
      java_electricity_bill: javaLessons.java_electricity_bill,
    },
    switch_case: {
      java_switch_day: javaLessons.java_switch_day,
      java_switch_vowel: javaLessons.java_switch_vowel,
      java_switch_calc: javaLessons.java_switch_calc,
      java_switch_month: javaLessons.java_switch_month,
      java_switch_grade: javaLessons.java_switch_grade,
    },
    for_loop: {
      java_for_sum: javaLessons.java_for_sum,
      java_multiplication_table: javaLessons.java_multiplication_table,
      java_fibonacci_for: javaLessons.java_fibonacci_for,
      java_even_numbers: javaLessons.java_even_numbers,
      java_power_calc: javaLessons.java_power_calc,
    },
    while_loop: {
      java_while_digits: javaLessons.java_while_digits,
      java_factorial: javaLessons.java_factorial,
      java_reverse_num: javaLessons.java_reverse_num,
      java_prime_check: javaLessons.java_prime_check,
      java_palindrome_num: javaLessons.java_palindrome_num,
    },
    do_while_loop: {
      java_do_while: javaLessons.java_do_while,
      java_do_while_sum: javaLessons.java_do_while_sum,
    },
    strings: {
      java_ascii: javaLessons.java_ascii,
      java_string_concat: javaLessons.java_string_concat,
    },
    arrays_1d: {
      java_array_sum_1d: javaLessons.java_array_sum_1d,
      java_array_max_1d: javaLessons.java_array_max_1d,
      java_linear_search: javaLessons.java_linear_search,
      java_array_reverse: javaLessons.java_array_reverse,
    },
    arrays_2d: {
      java_matrix_2d: javaLessons.java_matrix_2d,
      java_diagonal_sum_2d: javaLessons.java_diagonal_sum_2d,
      java_matrix_transpose: javaLessons.java_matrix_transpose,
    },
  },
};

export const getLesson = (languageId: string, topicId: string, programId: string): LessonProgram | undefined => {
  return lessonRegistry[languageId]?.[topicId]?.[programId];
};
