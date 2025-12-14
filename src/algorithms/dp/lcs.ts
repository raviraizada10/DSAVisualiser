import type { DPStep } from './types';

// Helper for deep copy
const cloneTable = (table: (number | null)[][]) => table.map(row => [...row]);

export function* lcs(s1: string, s2: string): Generator<DPStep> {
    const m = s1.length;
    const n = s2.length;

    // dp[i][j] length of LCS of s1[0..i-1] and s2[0..j-1]
    let table: (number | null)[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null));

    yield {
        table: cloneTable(table),
        highlightCells: [],
        codeLine: 2,
        description: `Initialize table [${m + 1}][${n + 1}] for strings "${s1}" and "${s2}"`
    };

    // Iterate
    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            yield {
                table: cloneTable(table),
                highlightCells: [{ row: i, col: j, color: 'current' }],
                codeLine: 5,
                description: `Processing cell (${i}, ${j})`
            };

            if (i === 0 || j === 0) {
                table[i][j] = 0;
                yield {
                    table: cloneTable(table),
                    highlightCells: [{ row: i, col: j, color: 'current' }],
                    codeLine: 34, // Need to map to LCS_CODE line... wait, LCS_CODE is approx.
                    description: 'Base case: 0 length prefix -> 0 LCS'
                };
            } else {
                // Check chars. Note: indices in string are i-1, j-1
                if (s1[i - 1] === s2[j - 1]) {
                    yield {
                        table: cloneTable(table),
                        highlightCells: [
                            { row: i, col: j, color: 'current' },
                            { row: i - 1, col: j - 1, color: 'source' }
                        ],
                        codeLine: 7,
                        description: `Match: '${s1[i - 1]}' == '${s2[j - 1]}'. Add 1 to diagonal.`
                    };
                    table[i][j] = 1 + (table[i - 1][j - 1] as number);
                    yield {
                        table: cloneTable(table),
                        highlightCells: [{ row: i, col: j, color: 'current' }],
                        codeLine: 8,
                        description: `dp[${i}][${j}] = ${table[i][j]}`
                    };
                } else {
                    yield {
                        table: cloneTable(table),
                        highlightCells: [
                            { row: i, col: j, color: 'current' },
                            { row: i - 1, col: j, color: 'compare' },
                            { row: i, col: j - 1, color: 'compare' }
                        ],
                        codeLine: 9,
                        description: `Mismatch: '${s1[i - 1]}' != '${s2[j - 1]}'. Take max of top/left.`
                    };
                    table[i][j] = Math.max(table[i - 1][j] as number, table[i][j - 1] as number);
                    yield {
                        table: cloneTable(table),
                        highlightCells: [{ row: i, col: j, color: 'current' }],
                        codeLine: 10,
                        description: `Takes max: ${table[i][j]}`
                    };
                }
            }
        }
    }

    yield {
        table: cloneTable(table),
        highlightCells: [{ row: m, col: n, color: 'final' }],
        codeLine: 14,
        description: `Result: LCS Length = ${table[m][n]}`
    };
}
