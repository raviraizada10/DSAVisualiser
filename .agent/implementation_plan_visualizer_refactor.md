# Visualizer Consistency & Refactoring Plan

## Objective
Standardize the "Execution" and "Analysis" UI across all algorithm visualizers using the `ExecutionAnalysisTabs` component. Ensure all pages load without errors and data is consistent.

## Current Status Overview
*   **Sorting, Greedy (Activity Selection):** Implemented.
*   **Backtracking (Rat in Maze, Sudoku):** **CRITICAL SYNTAX ERRORS** (Imports inside JSX).
*   **Searching, Graph, DP, N-Queens:** Implemented but require verification of data keys and cleanup of legacy info sections.

## Step-by-Step Implementation Plan

### 1. 🚨 Fix Critical Syntax Errors (Immediate Priority)
Restore valid file structure for files broken during previous edits.
- [ ] **RatInMazeVisualizer.tsx**
    - Move `import ExecutionAnalysisTabs` to the top level.
    - Fix the `right` prop structure in `ResizableSplit`.
- [ ] **SudokuVisualizer.tsx**
    - Move `import ExecutionAnalysisTabs` to the top level.
    - Fix the `right` prop structure in `ResizableSplit`.

### 2. 🧩 Standardize & Verify Visualizers
For each visualizer, ensure:
1.  `ExecutionAnalysisTabs` is correctly imported.
2.  `right` prop uses `ExecutionAnalysisTabs`.
3.  `algorithmKey` matches `src/data/algorithms.ts`.
4.  **Legacy "Info/Analysis" sections at the bottom of the file are REMOVED.**

#### Backtracking
- [ ] **NQueensVisualizer.tsx**: Verify imports and cleanup bottom info section.

#### Greedy
- [ ] **HuffmanCodingVisualizer.tsx**: Ensure it uses `ExecutionAnalysisTabs` (currently uses `SidebarTabs` manually?).

#### Searching
- [ ] **SearchingVisualizer.tsx**: key is `selectedAlgo`. Verify `ALGORITHM_DATA` has keys for 'Linear Search', 'Binary Search'.

#### Dynamic Programming
- [ ] **DPVisualizer.tsx**: key is `selectedAlgo` ('fib', 'knapsack', 'lcs'). Verify `ALGORITHM_DATA` keys.

#### Graph
- [ ] **GraphVisualizer.tsx**: key is `algorithmName` ('BFS', 'DFS', etc.). Verify `ALGORITHM_DATA` keys.

### 3. 🗄️ Update Central Data Repository
Ensure `src/data/algorithms.ts` contains all the keys referenced above.
- [ ] Add/Verify keys:
    - `linear-search`, `binary-search` (or generic `searching`)?
    - `fib`, `knapsack`, `lcs`
    - `bfs`, `dfs`, `dijkstra`, `astar`, `bellman-ford`, `prims`

### 4. 🛠️ Component Robustness
- [ ] Confirm `ExecutionAnalysisTabs.tsx` gracefully handles missing data (renders a "No analysis available" placeholder instead of crashing).

## Execution Strategy
I will proceed by fixing the syntax errors first (Step 1), then batch-update the data file (Step 3) to prevent "undefined" errors, and finally go through each visualizer (Step 2) to enforce consistency.
