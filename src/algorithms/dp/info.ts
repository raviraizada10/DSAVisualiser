export const DP_INFO: Record<string, {
    title: string;
    description: string;
    complexity: {
        time: string;
        space: string;
    };
    interviewTips: {
        whenToUse: string[];
        commonProblems: string[];
        pitfalls: string[];
    };
}> = {
    'fib': {
        title: "Fibonacci Sequence",
        description: "The classic introduction to Dynamic Programming. Calculates F(n) = F(n-1) + F(n-2).",
        complexity: {
            time: "O(n)",
            space: "O(n) (can be O(1) with optimization)"
        },
        interviewTips: {
            whenToUse: [
                "Problems where the current state depends on previous few states.",
                "Counting ways to reach a step (Climbing Stairs).",
                "Tiling problems (2xN grid)."
            ],
            commonProblems: [
                "Climbing Stairs",
                "House Robber",
                "Decode Ways",
                "Unique Paths (2D variation)"
            ],
            pitfalls: [
                "Using simple recursion (O(2^n)) instead of memoization/tabulation.",
                "Integer overflow for large N (use BigInt or Modulo)."
            ]
        }
    },
    'knapsack': {
        title: "0/1 Knapsack Problem",
        description: "Maximize value in a knapsack of capacity W, choosing from items with weight w[i] and value v[i]. Each item can be picked at most once.",
        complexity: {
            time: "O(N * W)",
            space: "O(N * W) (can be O(W) with 1D array)"
        },
        interviewTips: {
            whenToUse: [
                "Optimization with capacity constraints.",
                "Resource allocation problems.",
                "Subset Sum problems (Boolean variation)."
            ],
            commonProblems: [
                "Partition Equal Subset Sum",
                "Coin Change 2 (Unbounded Knapsack)",
                "Target Sum",
                "Ones and Zeroes"
            ],
            pitfalls: [
                "Confusing 0/1 Knapsack with Fractional Knapsack (Greedy).",
                "Incorrect inner loop direction when optimizing to 1D array.",
                "Memory Limit Exceeded for large capacity W."
            ]
        }
    },
    'lcs': {
        title: "Longest Common Subsequence",
        description: "Find the longest subsequence present in both strings (order maintained, continuity not required).",
        complexity: {
            time: "O(M * N)",
            space: "O(M * N)"
        },
        interviewTips: {
            whenToUse: [
                "Comparing strings or sequences.",
                "Diff tools (git diff).",
                "Bioinformatics (DNA sequence matching)."
            ],
            commonProblems: [
                "Longest Common Substring (continuity required)",
                "Edit Distance (Levenshtein)",
                "Shortest Common Supersequence",
                "Delete Operation for Two Strings"
            ],
            pitfalls: [
                "Confusing Subsequence (gaps allowed) vs Substring (continuous).",
                "Off-by-one errors in table initialization (size m+1, n+1)."
            ]
        }
    }
};
