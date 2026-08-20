# Modular Visualizer UI Elements

This directory contains the reusable, standardized UI blocks for rendering the execution steps of the code visualizer. By using these elements, we maintain a strict, non-overlapping design system across all lesson topics (variables, loops, conditions, etc.).

## Global Design Rules

1. **Height & Width**: All boxes have a fixed height (e.g., `h-10` or `h-12`) to maintain a clean horizontal flow. Width is dynamic and auto-adjusts based on content (e.g., variable name).
2. **Spacing**: Use standard flex gaps (`gap-4` or similar) to separate blocks.
3. **Connectors**:
   - Assignment: Use `<Operator symbol="=" />` instead of boxes or arrows.
   - Math/Logic: Use `<Operator symbol="+" />`, etc.
4. **Parent-Child Relation**:
   - Sub-steps within a parent block (like loops) inherit the parent's color but with reduced opacity/faded styling.

## Color & Shape Palette (Strict non-duplicate assignments)

- **VariableBox**: Blue border (`border-blue-500`)
- **PrintBox**: Green border (`border-green-500`)
- **InputBox**: Purple border (`border-purple-500`)
- **ConditionBox**: Soft rounded (`rounded-2xl`), Teal/Cyan border (`border-teal-500`)
- **LoopBox**: Yellow border (`border-yellow-500`) wrapper
- **ExceptionBox**: Red border (`border-red-500`) with alert styling
- **FunctionBox**: Orange border (`border-orange-500`)
- **Constant/Raw Value**: Subtle Grey/Slate border

## Data Structures
- **Lists/Tuples**: Rendered as a single block divided into contiguous cells (`flex` row with internal dividers).
- **Dictionaries**: Rendered as a table/chart structure (rows of keys and values).
