
import { type AlgorithmMetadata } from '../../types/algorithm';

export const PATTERNS_INFO: Record<string, AlgorithmMetadata> = {
    'sliding-window': {
        id: 'sliding-window',
        name: 'Sliding Window',
        category: 'Patterns',
        description: "A technique used to perform a required operation on a specific window size of a given array or linked list. The window slides over the data to capture different portions.",
        keySteps: [
            'Initialize window pointers (start/end) and result variables.',
            'Expand the window by moving the end pointer.',
            'Check against constraints/condition.',
            'Contract window from start if constraints are violated (shrink).',
            'Update result (max/min/count) at each valid state.'
        ],
        complexity: {
            time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
            space: 'O(1) usually'
        },
        useCases: [
            "Finding longest/shortest substring/subarray with a condition.",
            "Fixed sized window problems (e.g., max sum of size K).",
            "String permutations/anagrams."
        ],
        pros: [
            "Optimizes nested loops (O(n^2)) to linear time (O(n)).",
            "Efficient for contiguous subarray problems."
        ],
        cons: [
            "Not applicable for non-contiguous subsequences.",
            "Requires careful boundary management."
        ],
        interviewTips: {
            whenToUse: [
                "Finding longest/shortest substring/subarray with a condition.",
                "Fixed sized window problems (e.g., max sum of size K).",
                "String permutations/anagrams."
            ],
            commonProblems: [
                "Max Sum Subarray of Size K",
                "Longest Substring Without Repeating Characters",
                "Minimum Window Substring",
                "Permutation in String"
            ],
            pitfalls: [
                "Off-by-one errors in window edges.",
                "Forgetting to shrink the window (dynamic size)."
            ]
        }
    },
    'two-pointers': {
        id: 'two-pointers',
        name: 'Two Pointers',
        category: 'Patterns',
        description: "Using two pointers to iterate through a data structure (usually an array or linked list), often to compare or swap values. Pointers can move towards each other, or in the same direction.",
        keySteps: [
            'Initialize two pointers (e.g., left/right or slow/fast).',
            'Loop while pointers valid (left < right or fast not null).',
            'Compare elements at pointers.',
            'Move pointers based on logic (e.g., if sum too small, left++).',
            'Return result based on improved state.'
        ],
        complexity: {
            time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
            space: 'O(1)'
        },
        useCases: [
            "Sorted arrays (searching pairs).",
            "In-place operation (removing duplicates, moving zeros).",
            "Comparing ends of strings (palindromes).",
            "Cycle detection (Floyd's Tortoise and Hare)."
        ],
        pros: [
            "Reduces time complexity from O(n^2) to O(n) for pair problems.",
            "Constant space complexity O(1)."
        ],
        cons: [
            "Often requires sorted input (adding O(n log n) cost).",
            "Limited to linear data structures."
        ],
        interviewTips: {
            whenToUse: [
                "Sorted arrays (searching pairs).",
                "In-place operation (removing duplicates, moving zeros).",
                "Comparing ends of strings (palindromes)."
            ],
            commonProblems: [
                "Two Sum II (Input Array Is Sorted)",
                "Container With Most Water",
                "Valid Palindrome",
                "Move Zeroes"
            ],
            pitfalls: [
                "Infinite loops if pointers don't move correctly.",
                "Not handling even/odd length cases in palindromes."
            ]
        }
    },
    'intervals': {
        id: 'intervals',
        name: 'Merge Intervals',
        category: 'Patterns',
        description: "Handling overlapping intervals effectively, usually by sorting logic based on start times to merge or manage ranges.",
        keySteps: [
            'Sort intervals by start time (crucial first step).',
            'Initialize result list with the first interval.',
            'Iterate through remaining intervals.',
            'If current starts before previous ends -> Overlap! Merge them (end = max(end1, end2)).',
            'Else -> No overlap. Add current to result.'
        ],
        complexity: {
            time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
            space: 'O(n)'
        },
        useCases: [
            "Scheduling problems.",
            "Merging time ranges (calendar availability).",
            "Finding available free time."
        ],
        pros: [
            "Standardizes logic for complex range queries.",
            "Visualizable as lines on a number line."
        ],
        cons: [
            "Dominated by sorting complexity O(n log n).",
            "Requires careful handling of inclusive/exclusive bounds."
        ],
        interviewTips: {
            whenToUse: [
                "Scheduling problems.",
                "Merging time ranges.",
                "finding available free time."
            ],
            commonProblems: [
                "Merge Intervals",
                "Insert Interval",
                "Non-overlapping Intervals",
                "Meeting Rooms II"
            ],
            pitfalls: [
                "Forgetting to sort intervals first.",
                "Edge cases where end == start."
            ]
        }
    }
};
