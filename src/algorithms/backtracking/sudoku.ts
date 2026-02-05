
export const SUDOKU_CODE = `public boolean solveSudoku(int[][] board) {
    for (int row = 0; row < 9; row++) {
        for (int col = 0; col < 9; col++) {
            if (board[row][col] == 0) {
                for (int num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

private boolean isValid(int[][] board, int row, int col, int num) {
    for (int i = 0; i < 9; i++) {
        if (board[row][i] == num) return false;
        if (board[i][col] == num) return false;
        if (board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3] == num) return false;
    }
    return true;
}`;

export interface SudokuStep {
    board: number[][];
    currentRow: number;
    currentCol: number;
    currentNum?: number;
    isValid?: boolean;
    description: string;
    codeLine: number;
}

export function* sudokuSolver(initialBoard: number[][]): Generator<SudokuStep> {
    const board = initialBoard.map(row => [...row]);

    // Generator wrapper
    yield* solve(board);

    yield {
        board: board,
        currentRow: -1,
        currentCol: -1,
        description: "Sudoku Solved!",
        codeLine: 16
    };
}

function* solve(board: number[][]): Generator<SudokuStep, boolean, unknown> {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    yield {
                        board: board.map(r => [...r]),
                        currentRow: row,
                        currentCol: col,
                        currentNum: num,
                        description: `Trying ${num} at [${row}, ${col}]...`,
                        codeLine: 5
                    };

                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        yield {
                            board: board.map(r => [...r]),
                            currentRow: row,
                            currentCol: col,
                            currentNum: num,
                            isValid: true,
                            description: `${num} is valid. Moving forward.`,
                            codeLine: 7
                        };

                        if (yield* solve(board)) return true;

                        board[row][col] = 0; // Backtrack
                        yield {
                            board: board.map(r => [...r]),
                            currentRow: row,
                            currentCol: col,
                            description: `Backtracking from [${row}, ${col}]. Resetting to 0.`,
                            codeLine: 9
                        };
                    } else {
                        yield {
                            board: board.map(r => [...r]),
                            currentRow: row,
                            currentCol: col,
                            currentNum: num,
                            isValid: false,
                            description: `${num} is invalid at [${row}, ${col}].`,
                            codeLine: 6
                        };
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
        if (board[i][col] === num) return false;
        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + (i % 3);
        if (board[boxRow][boxCol] === num) return false;
    }
    return true;
}
