import { type Graph, type GraphStep } from './types';

export const DFS_CODE = `void dfs(int v, boolean visited[]) {
    // Mark the current node as visited
    visited[v] = true;
    
    // Recur for all the vertices adjacent to this vertex
    Iterator<Integer> i = adj[v].listIterator();
    while (i.hasNext()) {
        int n = i.next();
        if (!visited[n])
            dfs(n, visited);
    }
}`;

export function* dfs(graph: Graph, startNodeId: string): Generator<GraphStep> {
    const visited = new Set<string>();

    function* dfsRecursive(nodeId: string): Generator<GraphStep> {
        if (visited.has(nodeId)) {
            yield {
                type: 'visit-node', nodeId: nodeId,
                codeLine: 9, description: `${nodeId} is already visited`
            };
            return;
        }

        visited.add(nodeId);
        yield {
            type: 'visit-node', nodeId: nodeId,
            codeLine: 3, description: `Visiting node ${nodeId}`
        };

        const neighbors = getNeighbors(graph, nodeId);

        for (const neighborId of neighbors) {
            yield {
                type: 'visit-edge', source: nodeId, target: neighborId,
                codeLine: 6, description: `Checking neighbor ${neighborId}`
            };

            if (!visited.has(neighborId)) {
                yield {
                    type: 'queue-push', nodeId: neighborId, queue: [],
                    codeLine: 10, description: `Recursively calling DFS on ${neighborId}`
                };
                yield* dfsRecursive(neighborId);
            }
        }
    }

    yield* dfsRecursive(startNodeId);

    yield {
        type: 'path', path: Array.from(visited),
        codeLine: 11, description: "DFS Traversal Completed"
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
