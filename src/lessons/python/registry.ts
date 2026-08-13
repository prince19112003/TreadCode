import { variablesLessons } from './variables/index';
import { ifStatementLessons } from './if_statement/index';
import { ifElseLessons } from './if_else/index';
import { ifElifElseLessons } from './if_elif_else/index';
import { matchCaseLessons } from './match_case/index';
import { forLoopLessons } from './for_loop/index';
import { whileLoopLessons } from './while_loop/index';
import { nestedLoopLessons } from './nested_loop/index';
import { loopControlLessons } from './loop_control/index';
import { functionsLessons } from './functions/index';
import { recursionLessons } from './recursion/index';
import { stringsLessons } from './strings/index';
import { listsLessons } from './lists/index';
import { tuplesLessons } from './tuples/index';
import { dictionariesLessons } from './dictionaries/index';
import { searchingSortingLessons } from './searching_sorting/index';

export const pythonRegistry: Record<string, any> = {
  t1: variablesLessons,
  variables: variablesLessons,
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
};
