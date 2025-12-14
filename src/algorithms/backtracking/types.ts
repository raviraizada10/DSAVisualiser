export interface BacktrackingStep {
    board: number[][]; // 0 = empty, 1 = queen, 2 = conflict/checking
    row: number;
    col: number;
    description: string;
    codeLine?: number;
}

export const N_QUEENS_CODE = `function solveNQueens(board, row) {
    if (row >= n) return true;

    for (let col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row][col] = 'Q';
            if (solveNQueens(board, row + 1))
                return true;
            board[row][col] = '.'; // Backtrack
        }
    }
    return false;
}

function isSafe(board, row, col) {
    // Check column
    for (let i = 0; i < row; i++)
        if (board[i][col] == 'Q') return false;

    // Check upper-left diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j] == 'Q') return false;

    // Check upper-right diagonal
    for (let i = row, j = col; i >= 0 && j < n; i--, j++)
        if (board[i][j] == 'Q') return false;

    return true;
}`;
