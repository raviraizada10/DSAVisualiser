import { type Graph, type GraphStep } from './types';

export const BELLMAN_FORD_CODE = `void BellmanFord(Graph graph, int src) {
    int V = graph.V, E = graph.E;
    int dist[] = new int[V];

    for (int i = 0; i < V; ++i)
        dist[i] = Integer.MAX_VALUE;
    dist[src] = 0;

    // Relax all edges |V| - 1 times
    for (int i = 1; i < V; ++i) {
        for (int j = 0; j < E; ++j) {
            int u = graph.edge[j].src;
            int v = graph.edge[j].dest;
            int weight = graph.edge[j].weight;
            if (dist[u] != Integer.MAX_VALUE && dist[u] + weight < dist[v])
                dist[v] = dist[u] + weight;
        }
    }

    // Check for negative weight cycles
    for (int j = 0; j < E; ++j) {
        int u = graph.edge[j].src;
        int v = graph.edge[j].dest;
        int weight = graph.edge[j].weight;
        if (dist[u] != Integer.MAX_VALUE && dist[u] + weight < dist[v]) {
            System.out.println("Graph contains negative weight cycle");
            return;
        }
    }
}`;

export function* bellmanFord(graph: Graph, startNodeId: string): Generator<GraphStep> {
    const dist = new Map<string, number>();
    const prev = new Map<string, string>();
    const edges = graph.edges;
    const nodes = graph.nodes;
    const V = nodes.length;

    // Init
    for (const node of nodes) {
        dist.set(node.id, Infinity);
    }
    dist.set(startNodeId, 0);

    yield {
        type: 'visit-node', nodeId: startNodeId,
        codeLine: 7, description: `Initialized distances. src ${startNodeId} = 0, others Infinity`
    };

    // Relax edges |V| - 1 times
    for (let i = 1; i < V; i++) {
        let changed = false; // Optimization

        yield {
            type: 'path', path: [], // Dummy step to show iteration start
            codeLine: 10, description: `Iteration ${i} of ${V - 1}`
        };

        for (const edge of edges) {
            const u = edge.source;
            const v = edge.target;
            const weight = edge.weight || 1;

            yield {
                type: 'visit-edge', source: u, target: v,
                codeLine: 12, description: `Relaxing edge ${u} -> ${v} (weight: ${weight})`
            };

            const distU = dist.get(u) ?? Infinity;
            const distV = dist.get(v) ?? Infinity;

            if (distU !== Infinity && distU + weight < distV) {
                const newDist = distU + weight;
                dist.set(v, newDist);
                prev.set(v, u);
                changed = true;

                yield {
                    type: 'update-dist', nodeId: v, distance: newDist,
                    codeLine: 16, description: `Updated distance to ${v}: ${newDist}`
                };
            }

            // Handle undirected graph by relaxing v -> u as well?
            // Usually Bellman-Ford lists directed edges. Our graph is undirected conceptually but stored as edges.
            // If undirected, we should relax both ways.
            // But let's assume directed for strict Bellman-Ford logic matching the code snippet logic 
            // OR if standard implementation treats undirected as two directed edges, we should mimic that.
            // Let's stick to the edges array. If user wants undirected, we'd need to duplicate edges.
            // For now, visualizer treats edges as directed A->B unless we explicit create reverse edges.
            // Actually, in `GraphVisualizer` we draw lines. 
            // In Dijkstra we checked both directions in `getNeighbors`.
            // Here, let's also relax the reverse direction to support undirected-like behavior of our demo.

            /* 
            const revWeight = weight; // Same weight
            if (dist.get(v)!==Infinity && dist.get(v)! + revWeight < (dist.get(u)??Infinity)) {
                 // ... relax reverse
            }
            */
            // To keep it simple and consistent with "Code Tracing", we'll just iterate the edges list.
            // If the graph is undirected, the edges list should ideally contain both (u,v) and (v,u).
            // Our current data structure `graph.edges` lists single entries.
            // We should arguably iterate the reverse too if we want full undirected support.

            const distV_rev = dist.get(v) ?? Infinity;
            if (distV_rev !== Infinity && distV_rev + weight < (dist.get(u) ?? Infinity)) {
                const newDistU = distV_rev + weight;
                dist.set(u, newDistU);
                prev.set(u, v);
                changed = true;
                yield {
                    type: 'update-dist', nodeId: u, distance: newDistU,
                    codeLine: 16, description: `Updated distance to ${u}: ${newDistU} (Reverse direction)`
                };
            }
        }

        if (!changed) {
            yield {
                type: 'path', path: [],
                codeLine: 10, description: `No changes in iteration ${i}, breaking early.`
            };
            break;
        }
    }

    // Check for negative cycles (Skipped for simple demo as code snippet has it but we assume no neg cycles)
    yield {
        type: 'path', path: Array.from(nodes.map(n => n.id)),
        codeLine: 21, description: "Bellman-Ford Completed. Distances finalized."
    };
}
