import type { DPStep } from './types';

// Helper for deep copy
const cloneTable = (table: (number | null)[][]) => table.map(row => [...row]);

export function* knapsack(capacity: number, weights: number[], values: number[]): Generator<DPStep> {
    const n = weights.length;
    // dp[i][w] = max value with first i items and capacity w
    // Rows: 0..n (n+1 rows)
    // Cols: 0..capacity (capacity+1 cols)

    // Init table with nulls
    let table: (number | null)[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(null));

    yield {
        table: cloneTable(table),
        highlightCells: [],
        codeLine: 2,
        description: `Initialize split table [${n + 1}][${capacity + 1}]`
    };

    // Fill row 0 and col 0 with 0
    // Actually we iterate i from 0 to n
    for (let i = 0; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // Highlight current cell calculation
            yield {
                table: cloneTable(table),
                highlightCells: [{ row: i, col: w, color: 'current' }],
                codeLine: 5, // loop start roughly
                description: `Calculating dp[${i}][${w}]...`
            };

            if (i === 0 || w === 0) {
                table[i][w] = 0;
                yield {
                    table: cloneTable(table),
                    highlightCells: [{ row: i, col: w, color: 'current' }],
                    codeLine: 6,
                    description: `Base case: 0 items or 0 capacity -> 0 value`
                };
            } else if (weights[i - 1] <= w) {
                // Determine max of including or excluding
                const valWithout = table[i - 1][w] as number;
                const remainingCap = w - weights[i - 1];
                const valWith = values[i - 1] + (table[i - 1][remainingCap] as number);

                // Highlight dependencies
                yield {
                    table: cloneTable(table),
                    highlightCells: [
                        { row: i, col: w, color: 'current' },
                        { row: i - 1, col: w, color: 'compare' }, // Exclude
                        { row: i - 1, col: remainingCap, color: 'compare' } // Include
                    ],
                    codeLine: 10,
                    description: `Compare: Exclude (${valWithout}) vs Include (${values[i - 1]} + ${table[i - 1][remainingCap]} = ${valWith})`
                };

                table[i][w] = Math.max(valWithout, valWith);

                yield {
                    table: cloneTable(table),
                    highlightCells: [{ row: i, col: w, color: 'current' }],
                    codeLine: 9, // assignment
                    description: `Takes max: ${table[i][w]}`
                };
            } else {
                table[i][w] = table[i - 1][w];
                yield {
                    table: cloneTable(table),
                    highlightCells: [
                        { row: i, col: w, color: 'current' },
                        { row: i - 1, col: w, color: 'source' }
                    ],
                    codeLine: 14,
                    description: `Item too heavy (${weights[i - 1]} > ${w}). Copy from previous: ${table[i][w]}`
                };
            }
        }
    }

    yield {
        table: cloneTable(table),
        highlightCells: [{ row: n, col: capacity, color: 'final' }],
        codeLine: 17,
        description: `Result: Max Value = ${table[n][capacity]}`
    };
}
