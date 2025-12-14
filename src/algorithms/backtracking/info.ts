export const BACKTRACKING_INFO = {
    'nqueens': {
        title: 'N-Queens Problem',
        description: "The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other. Thus, a solution requires that no two queens share the same row, column, or diagonal.",
        complexity: {
            time: 'O(N!)',
            space: 'O(N) for recursion stack'
        },
        steps: [
            "Start in the leftmost column.",
            "If all queens are placed, return true.",
            "Try all rows in the current column.",
            "If the queen can be placed safely in this row, then mark this [row, column] as part of the solution and recursively check if this placement leads to a solution.",
            "If placing the queen in [row, column] leads to a solution, return true.",
            "If placing queen doesn't lead to a solution then unmark (backtrack) and go to the next step.",
            "If all rows have been tried and none worked, return false to trigger backtracking."
        ],
        interviewTips: {
            whenToUse: [
                "constraint satisfaction problems",
                "finding all solutions to a puzzle",
                "combinatorial optimization"
            ],
            commonProblems: [
                "N-Queens",
                "Sudoku Solver",
                "Permutations/Combinations",
                "Rat in a Maze"
            ],
            pitfalls: [
                "Not optimizing 'isSafe' check (can be O(1) with extra space)",
                "Confusing Backtracking with simple Recursion",
                "Forgetting to unmark (backtrack) state"
            ]
        }
    }
};
