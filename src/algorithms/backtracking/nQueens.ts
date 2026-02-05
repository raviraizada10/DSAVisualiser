import type { BacktrackingStep } from './types';

export function* nQueens(n: number): Generator<BacktrackingStep> {
    const board: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    yield* solve(board, 0, n);
}

function* solve(board: number[][], row: number, n: number): Generator<BacktrackingStep> {
    if (row >= n) {
        yield {
            board: copyBoard(board),
            row: -1,
            col: -1,
            description: "Solution Found! All queens placed safely.",
            codeLine: 2
        };
        return true; // Use boolean to indicate success for standard N-Queens, but for "Find All" or "Find One" logic differs. 
        // Here we'll just stop at first solution for visualization simplicity or let user "Continue"?
        // Usually visualizers stop at first or have a "Next Solution" mode.
        // Let's assume we want to find ONE solution first.
    }

    // yield {
    //     board: copyBoard(board),
    //     row: row,
    //     col: -1,
    //     description: `Starting row ${row}...`,
    //     codeLine: 4
    // };

    for (let col = 0; col < n; col++) {
        // Visualize checking
        board[row][col] = 2; // Checking
        yield {
            board: copyBoard(board),
            row,
            col,
            description: `Checking if safe to place at [${row}, ${col}]...`,
            codeLine: 5
        };

        if (isSafe(board, row, col, n)) {
            // Safe
            board[row][col] = 1; // Place Queen
            yield {
                board: copyBoard(board),
                row,
                col,
                description: `Safe! Placing Queen at [${row}, ${col}]`,
                codeLine: 6
            };

            // Recurse
            yield {
                board: copyBoard(board),
                row,
                col,
                description: `Moving to next row...`,
                codeLine: 7
            };

            if (yield* solve(board, row + 1, n)) {
                return true;
            }

            // Backtrack
            board[row][col] = 0; // Remove Queen
            yield {
                board: copyBoard(board),
                row,
                col,
                description: `Backtracking from [${row}, ${col}]`,
                codeLine: 9
            };
        } else {
            // Conflict
            board[row][col] = 3; // Conflict
            yield {
                board: copyBoard(board),
                row,
                col,
                description: `Conflict at [${row}, ${col}]! Cannot place here.`,
                codeLine: 5
            };
            board[row][col] = 0; // Reset
        }
    }
    return false;
}

function isSafe(board: number[][], row: number, col: number, n: number): boolean {
    // Check column
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false;
    }

    // Check upper-left diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) return false;
    }

    // Check upper-right diagonal
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
        if (board[i][j] === 1) return false;
    }

    return true;
}

function copyBoard(board: number[][]): number[][] {
    return board.map(row => [...row]);
}
