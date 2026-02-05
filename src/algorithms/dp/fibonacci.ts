import type { DPStep } from './types';

export function* fibonacci(n: number): Generator<DPStep> {
    // Initialize table: 1 row, n+1 columns
    const table: (number | null)[][] = [Array(n + 1).fill(null)];

    // Step 0: Init
    yield {
        table: JSON.parse(JSON.stringify(table)),
        highlightCells: [],
        codeLine: 3,
        description: `Initialize dp array of size ${n + 1}`
    };

    // Base cases
    table[0][0] = 0;
    yield {
        table: JSON.parse(JSON.stringify(table)),
        highlightCells: [{ row: 0, col: 0, color: 'current' }],
        codeLine: 4,
        description: `Base case: dp[0] = 0`
    };

    if (n >= 1) {
        table[0][1] = 1;
        yield {
            table: JSON.parse(JSON.stringify(table)),
            highlightCells: [{ row: 0, col: 1, color: 'current' }],
            codeLine: 5,
            description: `Base case: dp[1] = 1`
        };
    }

    // Loop
    for (let i = 2; i <= n; i++) {
        yield {
            table: JSON.parse(JSON.stringify(table)),
            highlightCells: [{ row: 0, col: i, color: 'current' }],
            codeLine: 6,
            description: `Calculating dp[${i}]...`
        };

        const val1 = table[0][i - 1] as number;
        const val2 = table[0][i - 2] as number;
        const sum = val1 + val2;

        table[0][i] = sum;

        yield {
            table: JSON.parse(JSON.stringify(table)),
            highlightCells: [
                { row: 0, col: i, color: 'current' },
                { row: 0, col: i - 1, color: 'source' },
                { row: 0, col: i - 2, color: 'source' }
            ],
            codeLine: 7,
            description: `dp[${i}] = dp[${i - 1}] (${val1}) + dp[${i - 2}] (${val2}) = ${sum}`
        };
    }

    yield {
        table: JSON.parse(JSON.stringify(table)),
        highlightCells: [{ row: 0, col: n, color: 'final' }],
        codeLine: 9,
        description: `Result: dp[${n}] = ${table[0][n]}`
    };
}
