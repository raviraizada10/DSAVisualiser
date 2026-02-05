
import { type AlgorithmMetadata } from '../../types/algorithm';

export const STRUCTURES_INFO: Record<string, AlgorithmMetadata> = {
    'stack': {
        id: 'stack',
        name: 'Stack (LIFO)',
        category: 'Data Structure',
        description: "A linear data structure following Last-In-First-Out order. Think of a stack of plates where you can only add or remove the top plate.",
        keySteps: [
            'Push: Add an element to the top of the stack.',
            'Pop: Remove the top element from the stack.',
            'Peek: View the top element without removing it.',
            'isEmpty: Check if the stack has no elements.'
        ],
        complexity: {
            time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, // Push/Pop are O(1)
            space: 'O(n)'
        },
        useCases: [
            "Processing nested structures (parentheses, HTML tags).",
            "Backtracking algorithms (DFS) explicity or implicitly.",
            "Expression evaluation (Reverse Polish Notation).",
            "Undo/Redo features in editors."
        ],
        pros: [
            "Fast operations (O(1)) for adding/removing from top.",
            "Simple memory management implementation.",
            "Natural fit for recursive problems."
        ],
        cons: [
            "No random access (accessing middle elements is O(n)).",
            "Fixed size (in static array implementation)."
        ],
        interviewTips: {
            whenToUse: [
                "Processing nested structures (parentheses, HTML tags).",
                "Backtracking algorithms (DFS) explicity or implicitly.",
                "Expression evaluation (RPN).",
                "Undo/Redo features."
            ],
            commonProblems: [
                "Valid Parentheses",
                "Daily Temperatures (Monotonic Stack)",
                "Min Stack",
                "Implement Queue using Stacks"
            ],
            pitfalls: [
                "Stack Overflow in recursion.",
                "Forgetting to check if stack is empty before popping."
            ]
        }
    },
    'queue': {
        id: 'queue',
        name: 'Queue (FIFO)',
        category: 'Data Structure',
        description: "A linear data structure following First-In-First-Out order. Think of a line at a store where the first person in line is the first one served.",
        keySteps: [
            'Enqueue: Add an element to the back (rear) of the queue.',
            'Dequeue: Remove the element from the front of the queue.',
            'Peek/Front: View the front element without removing it.',
            'isEmpty: Check if the queue is empty.'
        ],
        complexity: {
            time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
            space: 'O(n)'
        },
        useCases: [
            "Breadth-First Search (BFS) in graphs/trees.",
            "Task scheduling (process management).",
            "Buffering data streams (IO buffers).",
            "Level-order traversal."
        ],
        pros: [
            "Fair resource allocation (FIFO).",
            "Handles asynchronous data flows properly."
        ],
        cons: [
            "No random access.",
            "Static implementation requires circular buffer logic to be efficient."
        ],
        interviewTips: {
            whenToUse: [
                "Breadth-First Search (BFS) in graphs/trees.",
                "Task scheduling (process management).",
                "Buffering data streams.",
                "Level-order traversal."
            ],
            commonProblems: [
                "Implement Stack using Queues",
                "Rotting Oranges (Grid BFS)",
                "Sliding Window Maximum (Deque)",
                "Design Circular Queue"
            ],
            pitfalls: [
                "Confusing BFS queue logic with DFS stack logic."
            ]
        }
    },
    'linked-list': {
        id: 'linked-list',
        name: 'Linked List',
        category: 'Data Structure',
        description: "A linear collection of data elements where each element points to the next. Unlike arrays, elements are not stored at contiguous memory locations.",
        keySteps: [
            'Traversal: Start at head, follow "next" pointers until null.',
            'Insertion (Head): Create node, point "next" to current head, update head.',
            'Deletion: Change "next" pointer of previous node to skip the target node.',
            'Search: Traverse sequentially until value is found or end is reached.'
        ],
        complexity: {
            time: { best: 'O(1) (Head Insert)', average: 'O(n)', worst: 'O(n) (Search/Tail Access)' },
            space: 'O(n)'
        },
        useCases: [
            "Dynamic memory allocation is required.",
            "Constant time insertions/deletions at known positions (like head).",
            "Implementing Stacks/Queues.",
            "Adjacency lists for graphs."
        ],
        pros: [
            "Dynamic size (no fixed capacity).",
            "Efficient insertion/deletion if pointer is known (O(1))."
        ],
        cons: [
            "No random access (O(n) to get kth element).",
            "Extra memory for pointer storage."
        ],
        interviewTips: {
            whenToUse: [
                "Dynamic memory allocation is required.",
                "Constant time insertions/deletions at known positions.",
                "Implementing Stacks/Queues."
            ],
            commonProblems: [
                "Reverse a Linked List",
                "Detect Cycle (Floyd's Cycle Finding)",
                "Merge Two Sorted Lists",
                "Remove N-th Node From End"
            ],
            pitfalls: [
                "Lost references (breaking the chain).",
                "Handling head/tail edge cases (dummy nodes help)."
            ]
        }
    },
    'bst': {
        id: 'bst',
        name: 'Binary Search Tree',
        category: 'Data Structure',
        description: "A tree where left child < parent < right child. Allows fast lookup, addition, and removal by maintaining sorted order property.",
        keySteps: [
            'Search: Compare target with root. If < go left, if > go right.',
            'Insert: Traverse like search to find null spot, then link new node.',
            'Delete: Find node. If leaf, remove. If 1 child, bypass. If 2 children, replace with successor (min of right subtree).'
        ],
        complexity: {
            time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n) (Skewed)' },
            space: 'O(n)'
        },
        useCases: [
            "Maintaining a sorted stream of data.",
            "Range queries (finding elements between X and Y).",
            "Ordered map implementations."
        ],
        pros: [
            "Fast search/insert/delete compared to arrays (O(log n)).",
            "Data is consistently sorted."
        ],
        cons: [
            "Can become unbalanced (skewed) degrading to O(n).",
            "Complex deletion logic."
        ],
        interviewTips: {
            whenToUse: [
                "Maintaining a sorted stream of data.",
                "Range queries (finding elements between X and Y).",
                "Ordered map implementations."
            ],
            commonProblems: [
                "Validate BST",
                "Lowest Common Ancestor (LCA)",
                "K-th Smallest Element in BST",
                "Convert Sorted Array to BST"
            ],
            pitfalls: [
                "Tree becoming unbalanced (skewed) -> degrades to Linked List.",
                "Handling deletion of nodes with two children."
            ]
        }
    },
    'heap': {
        id: 'heap',
        name: 'Heap (Priority Queue)',
        category: 'Data Structure',
        description: "A specialized tree-based structure that satisfies the heap property (max or min is always at root). Usually implemented as an array.",
        keySteps: [
            'Insert: Add at end implies complete tree, then "bubble up" to restore property.',
            'Extract Max/Min: Remove root, replace with last element, then "bubble down".',
            'Peek: Return root element (O(1)).'
        ],
        complexity: {
            time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
            space: 'O(n)'
        },
        useCases: [
            "Finding the K-th largest/smallest element.",
            "Scheduling tasks by priority.",
            "Median finding (stream data).",
            "Dijkstra's Shortest Path / Prim's MST."
        ],
        pros: [
            "Guarantees O(log n) performance for priority operations.",
            "Space efficient if implemented as array."
        ],
        cons: [
            "Not suitable for searching generic elements (O(n)).",
            "Strictly weak ordering (only parent-child relationship)."
        ],
        interviewTips: {
            whenToUse: [
                "Finding the K-th largest/smallest element.",
                "Scheduling tasks by priority.",
                "Median finding (stream data).",
                "Dijkstra's Shortest Path / Prim's MST."
            ],
            commonProblems: [
                "Kth Largest Element in an Array",
                "Merge K Sorted Lists",
                "Find Median from Data Stream",
                "Top K Frequent Elements"
            ],
            pitfalls: [
                "Confusing Min-Heap vs Max-Heap (default in Java is Min-Heap for PriorityQueue).",
                "Forgetting O(n) build time vs O(n log n) by repetitive insertion."
            ]
        }
    },
    'trie': {
        id: 'trie',
        name: 'Trie (Prefix Tree)',
        category: 'Data Structure',
        description: "A tree data structure used for efficient retrieval of keys in a dataset of strings. Nodes store characters, paths represent strings.",
        keySteps: [
            'Insert: Traverse tree char by char. Create nodes if missing. Mark end node as word.',
            'Search: Traverse char by char. If path breaks, not found. Check end flag if full word required.',
            'StartsWith: Same as search but return true if path exists (flag irrelevant).'
        ],
        complexity: {
            time: { best: 'O(1)', average: 'O(L)', worst: 'O(L) (L=word len)' },
            space: 'O(AL) (A=alphabet size)'
        },
        useCases: [
            "Autocomplete / Typeahead suggestions.",
            "Spell checking.",
            "Longest Common Prefix problems.",
            "Word Search games (Boggle)."
        ],
        pros: [
            "O(L) lookup is faster than O(L log N) BST/Hash for strings.",
            "Prefix search is very efficient."
        ],
        cons: [
            "High memory usage due to many pointers (often sparse).",
            "Not standard in many standard libraries (need to implement)."
        ],
        interviewTips: {
            whenToUse: [
                "Autocomplete / Typeahead suggestions.",
                "Spell checking.",
                "Longest Common Prefix problems.",
                "Word Search games (Boggle)."
            ],
            commonProblems: [
                "Implement Trie (Prefix Tree)",
                "Word Search II (Grid Backtracking + Trie)",
                "Replace Words (Roots)",
                "Maximum XOR of Two Numbers in an Array"
            ],
            pitfalls: [
                "High memory usage due to many null pointers.",
                "Handling end-of-word flags correctly."
            ]
        }
    },
    'union-find': {
        id: 'union-find',
        name: 'Union-Find (Disjoint Set)',
        category: 'Data Structure',
        description: "Tracks a set of elements partitioned into a number of disjoint (non-overlapping) subsets. Supports merging sets and finding the representative.",
        keySteps: [
            'Find: Follow parent pointers to find the root. Use Path Compression for O(1) amortized.',
            'Union: Find roots of both elements. Attach one root to another. Use Union by Rank/Size to keep tree flat.',
            'Connected: Check if Find(A) == Find(B).'
        ],
        complexity: {
            time: { best: 'O(1)', average: 'O(α(n))', worst: 'O(log n) (naive)' },
            space: 'O(n)'
        },
        useCases: [
            "Connectivity queries in a network.",
            "Cycle detection in undirected graphs.",
            "Kruskal's Algorithm (MST).",
            "Finding connected components in grids/images."
        ],
        pros: [
            "Nearly constant time operations with optimizations.",
            "Simple array-based implementation."
        ],
        cons: [
            "Cannot easily 'split' sets after union.",
            "Only tracks connectivity, not path."
        ],
        interviewTips: {
            whenToUse: [
                "Connectivity queries in a network.",
                "Cycle detection in undirected graphs.",
                "Kruskal's Algorithm (MST).",
                "Finding connected components in grids/images."
            ],
            commonProblems: [
                "Number of Islands (can also be BFS/DFS)",
                "Redundant Connection",
                "Longest Consecutive Sequence",
                "Friend Circles"
            ],
            pitfalls: [
                "Forgetting Path Compression or Union by Rank (degrades to O(n)).",
                "Confusing with BFS/DFS for simple connectivity (UF is often faster to code but harder to trace)."
            ]
        }
    },
    'hash-table': {
        id: 'hash-table',
        name: 'Hash Table (Map)',
        category: 'Data Structure',
        description: "A data structure that implements an associative array abstract data type, using a hash function to map keys to indices in an array (buckets).",
        keySteps: [
            'Hash: Compute index using hash_function(key) % array_size.',
            'Insert: Store key-value pair at computed index. Handle collisions (Chaining/Open Addressing).',
            'Search: Compute index, check bucket for key.',
            'Delete: Compute index, find and remove key.'
        ],
        complexity: {
            time: { best: 'O(1)', average: 'O(1)', worst: 'O(n) (Collisions)' },
            space: 'O(n)'
        },
        useCases: [
            "Fast lookups are required (O(1)).",
            "Counting frequencies of elements.",
            "Finding duplicates.",
            "Caching/Memoization."
        ],
        pros: [
            "Extremely fast access on average.",
            "Keys can be arbitrary types (strings, objects)."
        ],
        cons: [
            "Worst case O(n) if many collisions.",
            "Unordered (unless using specialized LinkedHashMap)."
        ],
        interviewTips: {
            whenToUse: [
                "Fast lookups are required (O(1)).",
                "Counting frequencies of elements.",
                "Finding duplicates.",
                "Caching/Memoization."
            ],
            commonProblems: [
                "Two Sum",
                "Group Anagrams",
                "Longest Substring Without Repeating Characters",
                "Subarray Sum Equals K"
            ],
            pitfalls: [
                "Collisions degrading performance to O(n) (worst case).",
                "Choosing a poor hash function.",
                "Not handling resizing."
            ]
        }
    }
};
