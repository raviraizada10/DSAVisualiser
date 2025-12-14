import { type Graph, type GraphStep } from './types';

export const PRIMS_CODE = `public void primMST(int graph[][]) {
    int parent[] = new int[V];
    int key[] = new int[V];
    Boolean mstSet[] = new Boolean[V];

    for (int i = 0; i < V; i++) {
        key[i] = Integer.MAX_VALUE;
        mstSet[i] = false;
    }

    key[0] = 0;
    parent[0] = -1;

    for (int count = 0; count < V - 1; count++) {
        int u = minKey(key, mstSet);
        mstSet[u] = true;

        for (int v = 0; v < V; v++)
            if (graph[u][v] != 0 && mstSet[v] == false && 
                graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
    }
}`;

export function* prims(graph: Graph, startNodeId: string): Generator<GraphStep> {
    const key = new Map<string, number>();
    const parent = new Map<string, string | null>();
    const mstSet = new Set<string>();
    const nodes = graph.nodes.map(n => n.id);

    // Init
    for (const id of nodes) {
        key.set(id, Infinity);
        parent.set(id, null);
    }

    key.set(startNodeId, 0);

    yield {
        type: 'visit-node', nodeId: startNodeId,
        codeLine: 6, description: `Initialized keys to Infinity. Start node ${startNodeId} key = 0`
    };

    // Use a simple selection sort-like approach to find min key

    // Note: Java code uses a loop V-1 times, but logic is same as picking from set

    while (mstSet.size < nodes.length) {
        // Find min key vertex not in mstSet
        let u: string | null = null;
        let minVal = Infinity;

        for (const id of nodes) {
            if (!mstSet.has(id) && (key.get(id) || Infinity) < minVal) {
                minVal = key.get(id) || Infinity;
                u = id;
            }
        }

        yield {
            type: 'queue-pop', nodeId: u || '?', queue: [],
            codeLine: 15, description: `Picking minimum key vertex ${u} (key: ${minVal})`
        };

        if (!u) break;

        mstSet.add(u);
        yield {
            type: 'visit-node', nodeId: u,
            codeLine: 16, description: `Included ${u} in MST Set`
        };

        // If parent exists, visualize the MST edge
        const p = parent.get(u);
        if (p) {
            yield {
                type: 'visit-edge', source: p, target: u,
                codeLine: 11, description: `Edge (${p}, ${u}) added to MST`
            };
        }

        const neighbors = getNeighbors(graph, u);

        for (const v of neighbors) {
            const weight = getWeight(graph, u, v);

            yield {
                type: 'visit-edge', source: u, target: v,
                codeLine: 18, description: `Checking neighbor ${v} with weight ${weight}`
            };

            if (!mstSet.has(v) && weight < (key.get(v) || Infinity)) {
                parent.set(v, u);
                key.set(v, weight);

                yield {
                    type: 'update-dist', nodeId: v, distance: weight, // We can reuse update-dist for key update
                    codeLine: 22, description: `Update key(${v}) = ${weight}, parent(${v}) = ${u}`
                };
            }
        }
    }

    // Yield final MST edges as path/result? 
    // Actually we can reconstruct them.
    // We already highlighted them as we went.
    yield {
        type: 'path', path: Array.from(mstSet),
        codeLine: 25, description: "Prim's MST Construction Completed"
    };
}

function getNeighbors(graph: Graph, nodeId: string): string[] {
    const neighbors: string[] = [];
    for (const edge of graph.edges) {
        if (edge.source === nodeId) neighbors.push(edge.target);
        else if (edge.target === nodeId) neighbors.push(edge.source);
    }
    return neighbors.sort();
}

function getWeight(graph: Graph, source: string, target: string): number {
    const edge = graph.edges.find(e =>
        (e.source === source && e.target === target) ||
        (e.source === target && e.target === source)
    );
    return edge?.weight ?? 1;
}
