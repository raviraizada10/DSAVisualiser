
export const RAT_MAZE_CODE = `public boolean solveMaze(int[][] maze) {
    if (solve(maze, 0, 0)) return true;
    return false;
}

private boolean solve(int[][] maze, int x, int y) {
    if (x == N - 1 && y == N - 1) { // Destination
        sol[x][y] = 1;
        return true;
    }
    if (isValid(maze, x, y)) {
        sol[x][y] = 1; // Mark path
        if (solve(maze, x + 1, y)) return true; // Down
        if (solve(maze, x, y + 1)) return true; // Right
        sol[x][y] = 0; // Backtrack
        return false;
    }
    return false;
}`;

export interface MazeStep {
    maze: number[][]; // 0: Open, 1: Wall
    path: number[][]; // 0: Not visited, 1: Path, 2: Visited/Backtracked
    currentX: number;
    currentY: number;
    description: string;
    codeLine: number;
}

export function* ratInMazeSolver(maze: number[][]): Generator<MazeStep> {
    const N = maze.length;
    const path = Array.from({ length: N }, () => Array(N).fill(0));

    yield* solveMaze(maze, path, 0, 0, N);

    yield {
        maze,
        path: path.map(r => [...r]), // Copy
        currentX: N - 1,
        currentY: N - 1,
        description: "Reached Destination!",
        codeLine: 4
    };
}

function* solveMaze(maze: number[][], path: number[][], x: number, y: number, N: number): Generator<MazeStep, boolean, unknown> {
    const descriptionBase = `Checking [${x}, ${y}]...`;

    yield {
        maze,
        path: path.map(r => [...r]),
        currentX: x,
        currentY: y,
        description: descriptionBase,
        codeLine: 6
    };

    if (x === N - 1 && y === N - 1) {
        path[x][y] = 1;
        return true;
    }

    if (isSafe(maze, x, y, N)) {
        path[x][y] = 1; // Mark as part of solution path
        yield {
            maze,
            path: path.map(r => [...r]),
            currentX: x,
            currentY: y,
            description: `[${x}, ${y}] is safe. Marking path.`,
            codeLine: 12
        };

        // Down
        if (yield* solveMaze(maze, path, x + 1, y, N)) return true;

        // Right
        if (yield* solveMaze(maze, path, x, y + 1, N)) return true;

        path[x][y] = 0; // Backtrack
        yield {
            maze,
            path: path.map(r => [...r]),
            currentX: x,
            currentY: y,
            description: `Dead end at [${x}, ${y}]. Backtracking.`,
            codeLine: 15
        };
        return false;
    }

    return false;
}

function isSafe(maze: number[][], x: number, y: number, N: number): boolean {
    return x >= 0 && x < N && y >= 0 && y < N && maze[x][y] === 0;
}
