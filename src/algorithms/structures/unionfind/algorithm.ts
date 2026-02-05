import type { UFStep } from './types';

// Helper to yield current state
const yieldState = (
    type: UFStep['type'],
    parent: number[],
    rank: number[],
    activeIndices: number[],
    codeLine: number,
    description: string
): UFStep => ({
    type,
    parent: [...parent],
    rank: [...rank],
    activeIndices,
    codeLine,
    description
});

function* findGenerator(parent: number[], rank: number[], i: number): Generator<UFStep, number> {
    yield yieldState('highlight', parent, rank, [i], 12, `Finding representative of ${i}`);

    if (parent[i] !== i) {
        yield yieldState('find', parent, rank, [i, parent[i]], 13, `${i} is not root. Recursively find parent(${i}) = ${parent[i]}`);

        const root = yield* findGenerator(parent, rank, parent[i]);

        // Path compression
        if (parent[i] !== root) {
            parent[i] = root;
            yield yieldState('compress', parent, rank, [i, root], 14, `Path Compression: Set parent[${i}] = ${root}`);
        }

        return root;
    }

    yield yieldState('find', parent, rank, [i], 16, `Found root: ${i}`);
    return i;
}

export function* union(parent: number[], rank: number[], i: number, j: number): Generator<UFStep> {
    yield yieldState('union', parent, rank, [i, j], 19, `Union(${i}, ${j}) started`);

    const rootI = yield* findGenerator(parent, rank, i);
    const rootJ = yield* findGenerator(parent, rank, j);

    if (rootI !== rootJ) {
        yield yieldState('union', parent, rank, [rootI, rootJ], 23, `Roots are different (${rootI} != ${rootJ}). Merging...`);

        if (rank[rootI] < rank[rootJ]) {
            parent[rootI] = rootJ;
            yield yieldState('union', parent, rank, [rootI, rootJ], 25, `Rank[${rootI}] < Rank[${rootJ}]. Parent[${rootI}] = ${rootJ}`);
        } else if (rank[rootI] > rank[rootJ]) {
            parent[rootJ] = rootI;
            yield yieldState('union', parent, rank, [rootI, rootJ], 27, `Rank[${rootI}] > Rank[${rootJ}]. Parent[${rootJ}] = ${rootI}`);
        } else {
            parent[rootJ] = rootI;
            rank[rootI]++;
            yield yieldState('union', parent, rank, [rootI, rootJ], 30, `Ranks equal. Parent[${rootJ}] = ${rootI}, Rank[${rootI}] increased.`);
        }
    } else {
        yield yieldState('status', parent, rank, [rootI], 23, `Both elements (${i}, ${j}) are already in the same set (Root: ${rootI})`);
    }
}
