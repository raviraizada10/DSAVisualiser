
import { type AlgorithmMetadata } from '../types/algorithm';

export const ALGORITHM_DATA: Record<string, AlgorithmMetadata> = {
    // SORTING
    'Bubble Sort': {
        id: 'bubble-sort',
        name: 'Bubble Sort',
        category: 'Sorting',
        description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
        keySteps: [
            'Start at the beginning of the array.',
            'Compare the current element with the next element.',
            'If the current element is greater than the next, swap them.',
            'Move to the next pair and repeat until the end of the array.',
            'Repeat the process for N-1 passes until no swaps are needed.'
        ],
        complexity: {
            time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
            space: 'O(1)'
        },
        useCases: ['Teaching sorting concepts', 'Small datasets where code simplicity matters'],
        pros: ['Easy to understand and implement', 'Does not require extra space (in-place)'],
        cons: ['Very inefficient for large datasets', 'O(n²) performance makes it impractical for production'],
        interviewTips: {
            whenToUse: ['Teaching sorting mechanics', 'Very small datasets (< 50 items)', 'Checking if a list is already sorted (optimized version)'],
            commonProblems: ['Sort Colors', 'Bubble Sort Swaps Count'],
            pitfalls: ['Forgetting the "swapped" flag optimization', 'Using it in production code']
        }
    },
    'Selection Sort': {
        id: 'selection-sort',
        name: 'Selection Sort',
        category: 'Sorting',
        description: 'Divides the list into a sorted and an unsorted region. Repeatedly finds the minimum element from the unsorted region and moves it to the sorted region.',
        keySteps: [
            'Divide the array into sorted (left) and unsorted (right) parts.',
            'Find the minimum element in the unsorted part.',
            'Swap the minimum element with the first element of the unsorted part.',
            'Move the boundary of the sorted part one step to the right.',
            'Repeat until the entire array is sorted.'
        ],
        complexity: {
            time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
            space: 'O(1)'
        },
        useCases: ['Small lists', 'When memory writes are very expensive (min swaps)'],
        pros: ['Simple to implement', 'In-place sort'],
        cons: ['Always O(n²) regardless of initial order', 'Inefficient for large lists'],
        interviewTips: {
            whenToUse: ['Minimizing memory writes (flash memory)', 'Simple implementation needed'],
            commonProblems: ['Kth Smallest Element (Selection Algo variant)', 'Sort a Linked List (simple approach)'],
            pitfalls: ['Not stable by default (requires care to make stable)', 'Modifying list order unnecessarily']
        }
    },
    'Insertion Sort': {
        id: 'insertion-sort',
        name: 'Insertion Sort',
        category: 'Sorting',
        description: 'Builds the sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
        keySteps: [
            'Start from the second element (assume the first is sorted).',
            'Compare the current element with the previous elements.',
            'Shift all greater elements one position to the right.',
            'Insert the current element into its correct position.',
            'Repeat for all elements in the array.'
        ],
        complexity: {
            time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
            space: 'O(1)'
        },
        useCases: ['Small datasets', 'Almost sorted data (adaptive)', 'Online sorting (receiving data one by one)'],
        pros: ['Adaptive (fast for sorted lists)', 'Stable sort', 'In-place', 'Low overhead'],
        cons: ['Inefficient for large unsorted lists'],
        interviewTips: {
            whenToUse: ['Small datasets (< 50 items)', 'Almost sorted data (adaptive)', 'Online sorting (streaming data)'],
            commonProblems: ['Insertion Sort List', 'Online Median Finding'],
            pitfalls: ['High time complexity O(N^2) for reverse sorted data', 'Forgetting it is stable']
        }
    },
    'Merge Sort': {
        id: 'merge-sort',
        name: 'Merge Sort',
        category: 'Sorting',
        description: 'A divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
        keySteps: [
            'Recursively split the array into two halves until single elements remain.',
            'Compare the elements of the two halves.',
            'Merge them back together in sorted order into a temporary array.',
            'Copy the sorted elements back to the original array.',
            'Repeat the merge process up the recursion stack.'
        ],
        complexity: {
            time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
            space: 'O(n)'
        },
        useCases: ['Sorting linked lists', 'External sorting (large data on disk)', 'Stable sort requirements'],
        pros: ['Consistent O(n log n) performance', 'Stable sort', 'Parallelizable'],
        cons: ['Requires O(n) extra space', 'Recursion overhead for small arrays'],
        interviewTips: {
            whenToUse: ['Sorting Linked Lists (no random access)', 'External Sorting (large files)', 'Stable sort required'],
            commonProblems: ['Merge k Sorted Lists', 'Count Inversions', 'Sort List (Linked List)'],
            pitfalls: ['O(N) auxiliary space usage', 'Implementation complexity compared to simple sorts']
        }
    },
    'Quick Sort': {
        id: 'quick-sort',
        name: 'Quick Sort',
        category: 'Sorting',
        description: 'Picks an element as pivot and partitions the given array around the picked pivot. There are many different versions of quickSort that pick pivot in different ways.',
        keySteps: [
            'Choose a "pivot" element from the array.',
            'Partition the array: move smaller elements to the left, larger to the right.',
            'Place the pivot in its correct sorted position.',
            'Recursively apply Quick Sort to the left and right sub-arrays.',
            'Base case: sub-array has 0 or 1 element.'
        ],
        complexity: {
            time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
            space: 'O(log n)'
        },
        useCases: ['General purpose sorting', 'Arrays (better cache locality than Merge Sort)'],
        pros: ['Fastest on average for arrays', 'In-place (mostly)', 'Cache friendly'],
        cons: ['Worst case O(n²)', 'Unstable sort'],
        interviewTips: {
            whenToUse: ['General purpose array sorting', 'Memory locality importance', 'Average case performance priority'],
            commonProblems: ['Kth Largest Element (QuickSelect)', 'Sort Colors (Dutch National Flag)', 'Wiggle Sort'],
            pitfalls: ['Worst case O(N^2) with bad pivot', 'Not stable', 'Recursion depth overflow on large inputs']
        }
    },

    // GREEDY
    'Activity Selection': {
        id: 'activity-selection',
        name: 'Activity Selection',
        category: 'Greedy',
        description: 'Selects the maximum number of activities that can be performed by a single person, assuming that a person can only work on a single activity at a time. It helps understanding greedy choice property.',
        keySteps: [
            'Sort all activities by their finish times.',
            'Select the first activity (smallest finish time) and print it.',
            'Iterate through remaining activities.',
            'If the start time of the current activity is >= finish time of the last selected activity, select it.',
            'Repeat until all activities are checked.'
        ],
        complexity: {
            time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
            space: 'O(1)'
        },
        useCases: ['Scheduling problems', 'Resource allocation', 'Meeting room booking'],
        pros: ['Optimal solution for interval scheduling', 'Greedy approach is intuitive'],
        cons: ['Requires sorted input (end times)'],
        interviewTips: {
            whenToUse: ['Scheduling non-overlapping meetings', 'Interval scheduling with maximum throughput', 'Resource allocation problems'],
            commonProblems: ['Maximum Meetings in One Room', 'Minimum Platforms Required', 'Non-overlapping Intervals'],
            pitfalls: ['Forgetting to sort by END times (sorting by start time is a common trap)', 'Not handling equal finish times correctly']
        }
    },
    'Huffman Coding': {
        id: 'huffman-coding',
        name: 'Huffman Coding',
        category: 'Greedy',
        description: 'A popular technique used for lossless data compression. It assigns variable-length codes to input characters, with shorter codes assigned to more frequent characters.',
        keySteps: [
            'Create a leaf node for each unique character and its frequency.',
            'Build a min-priority queue with these nodes.',
            'Extract two nodes with the lowest frequencies.',
            'Create a new internal node with these two as children somewhat summing their frequencies.',
            'Add the new node back to the priority queue.',
            'Repeat until only one node remains (the root of the Huffman tree).'
        ],
        complexity: {
            time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
            space: 'O(n)'
        },
        useCases: ['File compression (ZIP, GZIP)', 'Data transmission bandwidth reduction'],
        pros: ['Optimal prefix codes', 'Lossless compression'],
        cons: ['Requires storing the tree/table', 'Does not consider context (like LZ77)'],
        interviewTips: {
            whenToUse: ['Lossless text compression', 'Minimizing weighted path length', 'Variable length encoding'],
            commonProblems: ['Encode and Decode Strings', 'Merge k Sorted Files', 'Connect Ropes with Minimum Cost'],
            pitfalls: ['Using Min-Heap correctly', 'Handling edge cases with single character input', 'Prefix code property violation']
        }
    },

    // BACKTRACKING
    'N-Queens': {
        id: 'n-queens',
        name: 'N-Queens',
        category: 'Backtracking',
        description: 'The N-Queens problem is the challenge of placing N chess queens on an N×N chessboard so that no two queens threaten each other.',
        keySteps: [
            'Start in the leftmost column.',
            'Try all rows in the current column.',
            'Check if placing a queen is safe (no attack from left, upper-left diagonal, lower-left diagonal).',
            'If safe, place queen and recursively move to the next column.',
            'If all rows in the current column lead to no solution, backtrack (remove queen from previous column) and try next row.'
        ],
        complexity: {
            time: { best: 'O(n!)', average: 'O(n!)', worst: 'O(n!)' },
            space: 'O(n)'
        },
        useCases: ['Constraint satisfaction problems', 'AI/Game theory', 'Testing backtracking engines'],
        pros: ['Classic demonstration of backtracking', 'Finds all solutions'],
        cons: ['Exponential time complexity', 'Impractical for large N'],
        interviewTips: {
            whenToUse: ['Finding all valid configurations', 'Constraint satisfaction testing', 'Teaching recursion and backtracking'],
            commonProblems: ['Sudoku Solver', 'Valid Sudoku', 'Permutations / Combinations'],
            pitfalls: ['Not optimizing the safe check (O(1) with arrays vs O(N))', 'Stack overflow on deep recursion']
        }
    },
    'Sudoku Solver': {
        id: 'sudoku-solver',
        name: 'Sudoku Solver',
        category: 'Backtracking',
        description: 'Fills a 9x9 grid with digits so that each column, each row, and each of the nine 3x3 subgrids contain all of the digits from 1 to 9.',
        keySteps: [
            'Find the first empty cell on the board.',
            'Try digits 1 through 9 for that cell.',
            'Check if the digit is valid (not in current row, column, or 3x3 box).',
            'If valid, place the digit and recursively try to fill the rest of the board.',
            'If recursion fails (leads to no solution), backtrack (reset cell to empty) and try next digit.'
        ],
        complexity: {
            time: { best: 'O(9^(n*n))', average: 'Exponential', worst: 'O(9^m) where m is empty cells' },
            space: 'O(n*n)'
        },
        useCases: ['Puzzle solving', 'Constraint satisfaction'],
        pros: ['Guaranteed solution if one exists'],
        cons: ['NP-Complete behavior in general case'],
        interviewTips: {
            whenToUse: ['Solving logic puzzles', 'Exact cover problems', 'Constraint satisfaction'],
            commonProblems: ['N-Queens', 'Word Search', 'Restore IP Addresses'],
            pitfalls: ['Mutating state without undoing (backtracking) changes', 'Infinite recursion loops']
        }
    },
    'Rat in a Maze': {
        id: 'rat-maze',
        name: 'Rat in a Maze',
        category: 'Backtracking',
        description: 'Finds a path from source to destination in a maze with obstacles. The rat can move in four directions (forward, backward, left, right).',
        keySteps: [
            'Start at the source (0,0).',
            'Try moving in a direction (Down, Right, Up, Left).',
            'Check if the move is valid (within bounds, not a wall, not visited).',
            'If valid, mark cell as visited and recurse.',
            'If destination reached, return true.',
            'If path blocked, backtrack (unmark visited) and try next direction.'
        ],
        complexity: {
            time: { best: 'O(2^(n^2))', average: 'Exponential', worst: 'O(4^(n^2))' },
            space: 'O(n^2)'
        },
        useCases: ['Pathfinding', 'Robotics traversal'],
        pros: ['Simple pathfinding logic', 'Finds all paths'],
        cons: ['Not necessarily the shortest path (BFS is better for that)', 'Exponential complexity'],
        interviewTips: {
            whenToUse: ['Exploring all paths in a grid', 'Maze solving where any path works', ' Robot path planning'],
            commonProblems: ['Rat in a Maze Problem I', 'Unique Paths III', 'Word Search'],
            pitfalls: ['Cycles in path (need visited array)', 'Boundary checks causing index out of bounds']
        }
    },

    // GRAPH
    'BFS': {
        id: 'bfs',
        name: 'Breadth First Search',
        category: 'Graph',
        description: 'Traverses a graph level by level. It starts at the tree root (or some arbitrary node of a graph) and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
        keySteps: [
            'Start with a queue containing only the starting node.',
            'Mark start node as visited.',
            'While queue is not empty, dequeue the front node.',
            'Process current node.',
            'Enqueue all unvisited neighbors and mark them as visited.',
            'Repeat until queue is empty.'
        ],
        complexity: {
            time: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
            space: 'O(V)'
        },
        useCases: ['Shortest path in unweighted graphs', 'Peer-to-peer networks', 'Social network crawlers', 'Garbage collection'],
        pros: ['Guarantees shortest path in unweighted graph', 'Complete (finds solution if exists)'],
        cons: ['High memory usage (stores whole level)'],
        interviewTips: {
            whenToUse: ['Shortest path in unweighted graphs', 'Finding connected components', 'Level-order traversal'],
            commonProblems: ['01 Matrix', 'Rotting Oranges', 'Word Ladder'],
            pitfalls: ['Forgetting to mark visited nodes (infinite loop)', 'Using DFS when shortest path is required']
        }
    },
    'DFS': {
        id: 'dfs',
        name: 'Depth First Search',
        category: 'Graph',
        description: 'Traverses a graph by exploring as far as possible along each branch before backtracking.',
        keySteps: [
            'Push start node to stack (or call recursive function).',
            'Mark start node as visited.',
            'For every neighbor of the current node:',
            'If neighbor is not visited, recursively call DFS on it.',
            'After visiting all neighbors, backtrack.',
            'Repeat until all reachable nodes are visited.'
        ],
        complexity: {
            time: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
            space: 'O(V)'
        },
        useCases: ['Topological sorting', 'detecting cycles', 'Pathfinding in mazes', 'Solving puzzles with only one solution'],
        pros: ['Low memory usage compared to BFS', 'Easy to implement recursively'],
        cons: ['Does not guarantee shortest path', 'Can get stuck in deep paths'],
        interviewTips: {
            whenToUse: ['Exploring all paths', 'Topological sort', 'Cycle detection', 'Solving mazes/puzzles (backtracking)'],
            commonProblems: ['Number of Islands', 'Course Schedule', 'Path Sum'],
            pitfalls: ['Stack overflow on very deep graphs', 'Not resetting visited array for new path exploration (if needed)']
        }
    },
    'Dijkstra': {
        id: 'dijkstra',
        name: "Dijkstra's Algorithm",
        category: 'Graph',
        description: 'Finds the shortest paths between nodes in a graph, which may represent, for example, road networks. It was conceived by computer scientist Edsger W. Dijkstra.',
        keySteps: [
            'Initialize distances to all nodes as Infinity, source as 0.',
            'Add all nodes to a Priority Queue (min-heap).',
            'While PQ is not empty, extract node U with min distance.',
            'For every neighbor V of U:',
            'Relax edge: If dist[U] + weight(U,V) < dist[V], update dist[V].',
            'Update V in PQ with new distance.'
        ],
        complexity: {
            time: { best: 'O(E+V log V)', average: 'O(E+V log V)', worst: 'O(E+V log V)' },
            space: 'O(V)'
        },
        useCases: ['Digital Mapping Services (Google Maps)', 'IP Routing (OSPF)', 'Telephone Networks'],
        pros: ['Guarantees shortest path', 'Widely used standard'],
        cons: ['Cannot handle negative weights', 'More overhead than BFS for unweighted graphs'],
        interviewTips: {
            whenToUse: ['Shortest path in weighted graphs with non-negative weights', 'Network routing'],
            commonProblems: ['Network Delay Time', 'Path with Maximum Probability', 'Cheapest Flights Within K Stops'],
            pitfalls: ['Applying to graphs with negative edges', 'Using inefficient Priority Queue implementation']
        }
    },
    "A* Search": {
        id: 'astar',
        name: "A* Search",
        category: 'Graph',
        description: 'An informed search algorithm, meaning it accepts a heuristic function to guide its search towards the destination, typically achieving better performance than Dijkstra.',
        keySteps: [
            'Initialize g(n) [actual cost] and f(n) [g(n) + h(n)].',
            'Add start node to Priority Queue based on f(n).',
            'While PQ is not empty, pop node with lowest f(n).',
            'If node is goal, reconstruct path.',
            'For neighbors, calculate tentative g score.',
            'If better path found, update g, f, parent, and add to PQ.'
        ],
        complexity: {
            time: { best: 'O(1)', average: 'Depends on Heuristic', worst: 'O(b^d)' },
            space: 'O(b^d)'
        },
        useCases: ['Game Development (Pathfinding)', 'Robotics', 'Traffic Navigation'],
        pros: ['Optimally efficient with admissible heuristic', 'Very fast in practice'],
        cons: ['Heuristic quality determines performance', 'High memory consumption'],
        interviewTips: {
            whenToUse: ['Pathfinding in games (grids/maps)', 'Situations where target location is known'],
            commonProblems: ['Sliding Puzzle', 'Shortest Path in Binary Matrix (Heuristic variant)'],
            pitfalls: ['Using an inadmissible heuristic (guarantees lost)', 'Ignoring edge weights']
        }
    },
    "Prim's MST": {
        id: 'prims',
        name: "Prim's Algorithm",
        category: 'Graph',
        description: 'A greedy algorithm that finds a minimum spanning tree for a weighted undirected graph. This means it finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.',
        keySteps: [
            'Initialize a tree with a single node, chosen arbitrarily.',
            'Grow the tree by one edge: of the edges connecting the tree to vertices not yet in the tree, find the minimum-weight edge.',
            'Add vertex incident to that edge to the tree.',
            'Repeat until all vertices are in the tree.'
        ],
        complexity: {
            time: { best: 'O(E+V log V)', average: 'O(E+V log V)', worst: 'O(E+V log V)' },
            space: 'O(V)'
        },
        useCases: ['Network Design (Cabling)', 'Circuit Design', 'Clustering'],
        pros: ['Good for dense graphs', 'Greedy approach is intuitive'],
        cons: ['Harder to implement than Kruskal\'s for some', 'Requires Priority Queue'],
        interviewTips: {
            whenToUse: ['Minimum Spanning Tree in dense graphs', 'Network design'],
            commonProblems: ['Min Cost to Connect All Points', 'Construct Roads'],
            pitfalls: ['Mixing up Prim\'s and Dijkstra\'s logic', 'Not handling disconnected graphs']
        }
    },
    "Bellman-Ford": {
        id: 'bellman-ford',
        name: "Bellman-Ford Algorithm",
        category: 'Graph',
        description: 'Computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra\'s algorithm for the same problem, but more versatile, as it is capable of handling graphs in which some of the edge weights are negative numbers.',
        keySteps: [
            'Initialize distance to source as 0, others as infinity.',
            'Relax all edges |V| - 1 times.',
            'Relaxation: if dist[u] + weight(u,v) < dist[v], update dist[v].',
            'Check for negative cycles: run relaxation one more time.',
            'If any distance updates, a negative cycle exists.'
        ],
        complexity: {
            time: { best: 'O(E)', average: 'O(VE)', worst: 'O(VE)' },
            space: 'O(V)'
        },
        useCases: ['Routing protocols (RIP)', 'Financial Arbitrage Detection', 'Negative Cycle Detection'],
        pros: ['Handles negative weights', 'Detects negative cycles'],
        cons: ['Much slower than Dijkstra (O(VE))'],
        interviewTips: {
            whenToUse: ['Graphs with negative edge weights', 'Detecting negative cycles', 'Shortest path with edge constraints'],
            commonProblems: ['Cheapest Flights Within K Stops', 'Negative Cycle Detection'],
            pitfalls: ['Relaxing edges defined number of times (V-1)', 'Not running Nth relaxation to detect cycle']
        }
    },
    // SEARCHING
    'Linear Search': {
        id: 'linear-search',
        name: 'Linear Search',
        category: 'Searching',
        description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
        keySteps: [
            'Start from the first element.',
            'Compare the current element with the target.',
            'If they match, return the current index.',
            'If not, move to the next element.',
            'Repeat until found or list ends (return -1).'
        ],
        complexity: {
            time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
            space: 'O(1)'
        },
        useCases: ['Unsorted lists', 'Small datasets', 'Single-use searches'],
        pros: ['No sorting required', 'Simple to implement'],
        cons: ['Inefficient for large lists (O(n))'],
        interviewTips: {
            whenToUse: ['Unsorted data', 'Data is streaming (one by one)', 'Very small datasets'],
            commonProblems: ['Find Element in Array', 'Count Occurrences'],
            pitfalls: ['Not checking boundary conditions', 'Inefficient for repeated lookups']
        }
    },
    'Binary Search': {
        id: 'binary-search',
        name: 'Binary Search',
        category: 'Searching',
        description: 'Locates a target value within a sorted array. Binary search compares the target value to the middle element of the array. If they are not equal, the half in which the target cannot lie is eliminated and the search continues on the remaining half.',
        keySteps: [
            'Find the middle element of the current range.',
            'If middle element matches target, return index.',
            'If target < middle, narrow search to the left half.',
            'If target > middle, narrow search to the right half.',
            'Repeat until found or range is empty.'
        ],
        complexity: {
            time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
            space: 'O(1)'
        },
        useCases: ['Sorted arrays', 'Database indexing', 'Dictionary lookups'],
        pros: ['Extremely fast (O(log n))', 'Efficient for large sorted datasets'],
        cons: ['Requires sorted/monotonic input'],
        interviewTips: {
            whenToUse: ['Searching in sorted arrays', 'Finding boundaries of a condition (e.g. first/last bad version)', 'Optimizing solutions from O(N) to O(logN)'],
            commonProblems: ['Search in Rotated Sorted Array', 'First Bad Version', 'Koko Eating Bananas (Binary Search on Answer)'],
            pitfalls: ['Infinite loop (mid calculation)', 'Integer overflow (start + end)', 'Not handling duplicates correctly']
        }
    },
    // DYNAMIC PROGRAMMING
    'fib': {
        id: 'fib',
        name: 'Fibonacci Sequence',
        category: 'DP',
        description: 'Calculates the nth Fibonacci number using dynamic programming. Compares recursive (exponential), memoization (top-down), and tabulation (bottom-up) approaches.',
        keySteps: [
            'Initialize base cases: F(0)=0, F(1)=1.',
            'Iterate from 2 up to N.',
            'For each i, calculate F(i) = F(i-1) + F(i-2).',
            'Store the result to avoid recomputation.',
            'Return F(N).'
        ],
        complexity: {
            time: { best: 'O(1) [Closed Form]', average: 'O(n)', worst: 'O(n)' },
            space: 'O(n) [Memo] or O(1) [Tabulation]'
        },
        useCases: ['Intro to DP', 'Population growth models', 'Financial markets (Fibonacci retracement)'],
        pros: ['Demonstrates Memoization vs Tabulation', 'Optimizes exponential recursion'],
        cons: ['Recursion depth limits in naive approach'],
        interviewTips: {
            whenToUse: ['Problems with overlapping subproblems', 'Counting ways to reach a state'],
            commonProblems: ['Climbing Stairs', 'House Robber', 'Decode Ways'],
            pitfalls: ['Forgetting base cases', 'Recomputing subproblems (forgetting memoization)', 'Stack overflow']
        }
    },
    'knapsack': {
        id: 'knapsack',
        name: '0/1 Knapsack Problem',
        category: 'DP',
        description: 'Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.',
        keySteps: [
            'Create a DP table/array indexed by capacity.',
            'Iterate through each item.',
            'For each item, iterate through capacities backwards (for 1D array).',
            'Decide max(current value, value of (capacity - item_weight) + item_value).',
            'Result at full capacity is the answer.'
        ],
        complexity: {
            time: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' },
            space: 'O(nW)'
        },
        useCases: ['Resource allocation', 'Financial portfolio selection', 'Cargo loading'],
        pros: ['Finds optimal subset', 'Classic pseudo-polynomial time problem'],
        cons: ['Computationally expensive for large W', 'Pseudo-polynomial (depends on constraints)'],
        interviewTips: {
            whenToUse: ['Optimization problems with capacity constraints', 'Choosing subsets with max value'],
            commonProblems: ['Partition Equal Subset Sum', 'Target Sum', 'Coin Change 2'],
            pitfalls: ['Confusing 0/1 Knapsack with Unbounded Knapsack', 'Incorrect state definition (not including index or capacity)']
        }
    },
    'lcs': {
        id: 'lcs',
        name: 'Longest Common Subsequence',
        category: 'DP',
        description: 'Finds the longest subsequence present in all given sequences. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.',
        keySteps: [
            'Create a DP table of size (M+1) x (N+1).',
            'Iterate through strings S1 and S2.',
            'If characters match, dp[i][j] = 1 + dp[i-1][j-1].',
            'If they don\'t match, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
            'Value at dp[M][N] is the length of LCS.'
        ],
        complexity: {
            time: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)' },
            space: 'O(mn)'
        },
        useCases: ['Diff tools (git)', 'Bioinformatics (DNA alignment)', 'Spell checking'],
        pros: ['Essential for text comparison', 'Solves many string problems'],
        cons: ['O(mn) space and time can be heavy for long strings'],
        interviewTips: {
            whenToUse: ['String comparison', 'Finding sequences in order but not contiguous'],
            commonProblems: ['Longest Palindromic Subsequence', 'Edit Distance', 'Distinct Subsequences'],
            pitfalls: ['Confusing Subsequence with Substring', 'Off-by-one errors in DP table initialization']
        }
    },
};
