import { type Graph, type GraphStep } from './types';

export const BFS_CODE = `void bfs(int startNode) {
    boolean visited[] = new boolean[V];
    LinkedList<Integer> queue = new LinkedList<Integer>();

    visited[startNode] = true;
    queue.add(startNode);

    while (queue.size() != 0) {
        startNode = queue.poll();
        // Process node...
        
        Iterator<Integer> i = adj[startNode].listIterator();
        while (i.hasNext()) {
            int n = i.next();
            if (!visited[n]) {
                visited[n] = true;
                queue.add(n);
            }
        }
    }
}`;

export function* bfs(graph: Graph, startNodeId: string): Generator<GraphStep> {
    const visited = new Set<string>();
    const queue: string[] = [startNodeId];

    visited.add(startNodeId);
    yield {
        type: 'visit-node', nodeId: startNodeId,
        codeLine: 5, description: `Initializing BFS, marking start node ${startNodeId} as visited`
    };
    yield {
        type: 'queue-push', nodeId: startNodeId, queue: [...queue],
        codeLine: 6, description: `Adding ${startNodeId} to queue`
    };

    while (queue.length > 0) {
        yield {
            type: 'queue-pop', nodeId: queue[0], queue: [...queue],
            codeLine: 8, description: `Checking queue emptiness`
        };

        const currentNodeId = queue.shift()!;
        yield {
            type: 'queue-pop', nodeId: currentNodeId, queue: [...queue],
            codeLine: 9, description: `Dequeued ${currentNodeId} for processing`
        };

        const neighbors = getNeighbors(graph, currentNodeId);

        for (const neighborId of neighbors) {
            yield {
                type: 'visit-edge', source: currentNodeId, target: neighborId,
                codeLine: 12, description: `Checking neighbor ${neighborId} of ${currentNodeId}`
            };

            if (!visited.has(neighborId)) {
                visited.add(neighborId);
                queue.push(neighborId);

                yield {
                    type: 'visit-node', nodeId: neighborId,
                    codeLine: 15, description: `Marking ${neighborId} as visited`
                };
                yield {
                    type: 'queue-push', nodeId: neighborId, queue: [...queue],
                    codeLine: 16, description: `Pushing ${neighborId} to queue`
                };
            } else {
                yield {
                    type: 'visit-node', nodeId: neighborId,
                    codeLine: 13, description: `${neighborId} is already visited, skipping`
                };
            }
        }
    }

    yield {
        type: 'path', path: Array.from(visited),
        codeLine: 19, description: "BFS Traversal Completed"
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
