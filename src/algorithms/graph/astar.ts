import { type Graph, type GraphStep } from './types';

export const ASTAR_CODE = `public List<Node> aStar(Node start, Node target) {
    PriorityQueue<Node> openSet = new PriorityQueue<>();
    Set<Node> closedSet = new HashSet<>();
    Map<Node, Double> gScore = new HashMap<>();
    Map<Node, Double> fScore = new HashMap<>();

    gScore.put(start, 0.0);
    fScore.put(start, heuristic(start, target));
    openSet.add(start);

    while (!openSet.isEmpty()) {
        Node current = openSet.poll();
        if (current.equals(target))
            return reconstructPath(current);

        closedSet.add(current);

        for (Edge edge : current.edges) {
            Node neighbor = edge.target;
            if (closedSet.contains(neighbor)) continue;

            double tentativeG = gScore.get(current) + edge.weight;
            if (tentativeG < gScore.getOrDefault(neighbor, Double.MAX_VALUE)) {
                gScore.put(neighbor, tentativeG);
                fScore.put(neighbor, tentativeG + heuristic(neighbor, target));
                if (!openSet.contains(neighbor))
                    openSet.add(neighbor);
            }
        }
    }
    return Collections.emptyList(); // Path not found
}`;

export function* astar(graph: Graph, startNodeId: string, endNodeId: string = 'G'): Generator<GraphStep> {
    const openSet: { id: string; f: number }[] = [];
    const closedSet = new Set<string>();

    // Maps for costs
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const cameFrom = new Map<string, string>();

    // Helper: Heuristic Function (Euclidean Distance)
    const heuristic = (id1: string, id2: string): number => {
        const n1 = graph.nodes.find(n => n.id === id1);
        const n2 = graph.nodes.find(n => n.id === id2);
        if (!n1 || !n2) return 0;
        // Scale down slightly to make weights comparable to pixel distances or vice versa
        // Actually, let's just use raw distance but maybe scaled to be reasonable 
        // compared to our small integer edge weights (1-10)?
        // Our edge weights are small integers (1-5). Pixel distances are hundreds.
        // Let's divide by ~50 to map ~50px to cost 1
        return Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2)) / 50;
    };

    // Initialize
    for (const node of graph.nodes) {
        gScore.set(node.id, Infinity);
        fScore.set(node.id, Infinity);
    }

    gScore.set(startNodeId, 0);
    const startH = heuristic(startNodeId, endNodeId);
    fScore.set(startNodeId, startH);

    openSet.push({ id: startNodeId, f: startH });

    yield {
        type: 'visit-node', nodeId: startNodeId,
        codeLine: 8, description: `Initialize: g(start) = 0, f(start) = h(start) = ${startH.toFixed(2)}`
    };
    yield {
        type: 'update-heuristic', nodeId: startNodeId, f: startH, g: 0, h: startH,
        codeLine: 8, description: `Calculated initial heuristic costs`
    };
    yield {
        type: 'queue-push', nodeId: startNodeId, queue: openSet.map(n => `${n.id}(${n.f.toFixed(1)})`),
        codeLine: 10, description: `Add ${startNodeId} to open set`
    };

    while (openSet.length > 0) {
        // Find node with lowest fScore in openSet
        openSet.sort((a, b) => a.f - b.f);

        const currentId = openSet[0].id; // Peek
        yield {
            type: 'queue-pop', nodeId: currentId, queue: openSet.map(n => `${n.id}(${n.f.toFixed(1)})`),
            codeLine: 13, description: `Picking node with lowest f-score: ${currentId}`
        };

        openSet.shift(); // Remove

        if (currentId === endNodeId) {
            yield {
                type: 'visit-node', nodeId: currentId,
                codeLine: 14, description: `Reached target node ${currentId}!`
            };
            break; // Reconstruct path
        }

        closedSet.add(currentId);
        yield {
            type: 'visit-node', nodeId: currentId,
            codeLine: 17, description: `Adding ${currentId} to closed set`
        };

        const neighbors = getNeighbors(graph, currentId);

        for (const neighborId of neighbors) {
            if (closedSet.has(neighborId)) continue;

            const edgeWeight = getWeight(graph, currentId, neighborId);

            yield {
                type: 'visit-edge', source: currentId, target: neighborId,
                codeLine: 19, description: `Checking neighbor ${neighborId}, edge weight: ${edgeWeight}`
            };

            const tentativeG = (gScore.get(currentId) || Infinity) + edgeWeight;

            if (tentativeG < (gScore.get(neighborId) || Infinity)) {
                cameFrom.set(neighborId, currentId);
                gScore.set(neighborId, tentativeG);

                const h = heuristic(neighborId, endNodeId);
                const f = tentativeG + h;
                fScore.set(neighborId, f);

                yield {
                    type: 'update-heuristic', nodeId: neighborId, f, g: tentativeG, h,
                    codeLine: 24, description: `Found better path to ${neighborId}. g=${tentativeG.toFixed(1)}, h=${h.toFixed(1)}, f=${f.toFixed(1)}`
                };

                if (!openSet.find(n => n.id === neighborId)) {
                    openSet.push({ id: neighborId, f });
                    yield {
                        type: 'queue-push', nodeId: neighborId, queue: openSet.map(n => `${n.id}(${n.f.toFixed(1)})`),
                        codeLine: 28, description: `Adding ${neighborId} to open set`
                    };
                } else {
                    // Update f in openSet
                    const idx = openSet.findIndex(n => n.id === neighborId);
                    if (idx !== -1) openSet[idx].f = f;
                    yield {
                        type: 'queue-push', nodeId: neighborId, queue: openSet.map(n => `${n.id}(${n.f.toFixed(1)})`),
                        codeLine: 25, description: `Updated f-score for ${neighborId} in open set`
                    };
                }
            }
        }
    }

    // Reconstruct path
    const path: string[] = [];
    let curr: string | undefined = endNodeId;

    // Check if reachable
    if (!cameFrom.has(endNodeId) && startNodeId !== endNodeId) {
        yield {
            type: 'path', path: [],
            codeLine: 32, description: `Target ${endNodeId} is unreachable from ${startNodeId}`
        };
        return;
    }

    while (curr) {
        path.unshift(curr);
        curr = cameFrom.get(curr);
    }

    yield {
        type: 'path', path: path,
        codeLine: 15, description: `Shortest path found: ${path.join(' -> ')}`
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
