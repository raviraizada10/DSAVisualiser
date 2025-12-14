import { type Graph, type GraphStep } from './types';

export const DIJKSTRA_CODE = `void dijkstra(int graph[][], int src) {
    int dist[] = new int[V]; 
    Boolean sptSet[] = new Boolean[V];

    for (int i = 0; i < V; i++) {
        dist[i] = Integer.MAX_VALUE;
        sptSet[i] = false;
    }
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        // Pick min distance vertex not yet processed
        int u = minDistance(dist, sptSet);
        sptSet[u] = true;

        for (int v = 0; v < V; v++)
            if (!sptSet[v] && graph[u][v] != 0 && 
                dist[u] != Integer.MAX_VALUE && 
                dist[u] + graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
    }
}`;

export function* dijkstra(graph: Graph, startNodeId: string, endNodeId: string = 'G'): Generator<GraphStep> {
    const dist = new Map<string, number>();
    const prev = new Map<string, string>();
    const pq: { id: string; dist: number }[] = [];

    // Init
    for (const node of graph.nodes) {
        dist.set(node.id, Infinity);
    }
    dist.set(startNodeId, 0);
    pq.push({ id: startNodeId, dist: 0 });

    yield {
        type: 'visit-node', nodeId: startNodeId,
        codeLine: 6, description: `Initialized distances. src ${startNodeId} = 0`
    };
    yield {
        type: 'queue-push', nodeId: startNodeId, queue: pq.map(p => `${p.id}(${p.dist})`),
        codeLine: 13, description: `Start processing from source`
    };

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);

        yield {
            type: 'queue-pop', nodeId: pq[0].id, queue: pq.map(p => `${p.id}(${p.dist})`),
            codeLine: 13, description: `Selecting min distance vertex ${pq[0].id}`
        };

        const { id: u, dist: d } = pq.shift()!;

        yield {
            type: 'visit-node', nodeId: u,
            codeLine: 14, description: `Marking ${u} as processed (sptSet[u] = true)`
        };

        if (d > (dist.get(u) ?? Infinity)) {
            continue;
        }

        if (u === endNodeId) {
            yield {
                type: 'visit-node', nodeId: u,
                codeLine: 14, description: `Reached target node ${u}!`
            };
        }

        const neighbors = getNeighbors(graph, u);

        for (const neighborId of neighbors) {
            const weight = getWeight(graph, u, neighborId);

            yield {
                type: 'visit-edge', source: u, target: neighborId,
                codeLine: 16, description: `Checking neighbor ${neighborId} (weight: ${weight})`
            };

            const newDist = (dist.get(u) ?? Infinity) + weight;
            const currentNeighborDist = dist.get(neighborId) ?? Infinity;

            if (newDist < currentNeighborDist) {
                dist.set(neighborId, newDist);
                prev.set(neighborId, u);
                pq.push({ id: neighborId, dist: newDist });

                yield {
                    type: 'update-dist', nodeId: neighborId, distance: newDist,
                    codeLine: 20, description: `Relaxing edge. New dist to ${neighborId} is ${newDist}`
                };
            }
        }
    }

    // Reconstruct path
    const path: string[] = [];
    let curr: string | undefined = endNodeId;

    if (dist.get(endNodeId) === Infinity) {
        yield {
            type: 'path', path: [],
            codeLine: 22, description: `Target ${endNodeId} is unreachable from ${startNodeId}`
        };
        return;
    }

    while (curr) {
        path.unshift(curr);
        curr = prev.get(curr);
    }

    yield {
        type: 'path', path: path,
        codeLine: 22, description: `Shortest path found: ${path.join(' -> ')}`
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
    return edge?.weight ?? 1; // Default weight 1 if not specified
}
