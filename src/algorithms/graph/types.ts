export interface Node {
    id: string;
    x: number;
    y: number;
}

export interface Edge {
    source: string;
    target: string;
    weight?: number; // For Dijkstra
}

export interface Graph {
    nodes: Node[];
    edges: Edge[];
}

// Visualization step types
export type GraphStep =
    | { type: 'visit-node'; nodeId: string; codeLine?: number; description?: string }
    | { type: 'visit-edge'; source: string; target: string; codeLine?: number; description?: string }
    | { type: 'queue-push'; nodeId: string; queue: string[]; codeLine?: number; description?: string }
    | { type: 'queue-pop'; nodeId: string; queue: string[]; codeLine?: number; description?: string }
    | { type: 'path'; path: string[]; codeLine?: number; description?: string }
    | { type: 'update-dist'; nodeId: string; distance: number; codeLine?: number; description?: string } // For Dijkstra
    | { type: 'update-heuristic'; nodeId: string; f: number; g: number; h: number; codeLine?: number; description?: string }; // For A*

export type GraphAlgorithm = (graph: Graph, startNodeId: string, endNodeId?: string) => Generator<GraphStep>;
