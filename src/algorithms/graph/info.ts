export const GRAPH_ALGORITHMS_INFO: Record<string, {
    title: string;
    description: string;
    steps: string[];
    complexity: { time: string; space: string };
}> = {
    'BFS': {
        title: "Breadth-First Search",
        description: "Explores a graph level by level. It starts at a chosen node and explores all of its neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. Excellent for finding the shortest path in unweighted graphs.",
        steps: [
            "Start with a queue containing only the starting node.",
            "Mark start node as visited.",
            "While queue is not empty, remove the first node.",
            "Add all unvisited neighbors to the queue and mark them as visited.",
            "Repeat until queue is empty."
        ],
        complexity: {
            time: "O(V + E)",
            space: "O(V)"
        }
    },
    'DFS': {
        title: "Depth-First Search",
        description: "Explores as far as possible along each branch before backtracking. Useful for topological sorting, cycle detection, and solving maze-like puzzles.",
        steps: [
            "Start with a stack (or recursion) containing the starting node.",
            "Mark start node as visited.",
            "Explore the first unvisited neighbor.",
            "If no unvisited neighbors, backtrack.",
            "Repeat until all reachable nodes are visited."
        ],
        complexity: {
            time: "O(V + E)",
            space: "O(V)"
        }
    },
    'Dijkstra': {
        title: "Dijkstra's Algorithm",
        description: "Finds the shortest paths between nodes in a graph, which may represent road networks. It maintains a set of unvisited nodes and calculates tentative distances.",
        steps: [
            "Set distance to start node as 0, all others as infinity.",
            "Add all nodes to a priority queue.",
            "Extract min distance node u from PQ.",
            "For each neighbor v of u, if dist[u] + weight < dist[v], update dist[v].",
            "Repeat until PQ is empty or target reached."
        ],
        complexity: {
            time: "O(E log V)",
            space: "O(V + E)"
        }
    },
    'A* Search': {
        title: "A* Search Algorithm",
        description: "Heuristic search algorithm used in pathfinding. It extends Dijkstra's by using a heuristic function to estimate the cost to the goal, prioritizing promising paths.",
        steps: [
            "Maintain open set (priority queue) sorted by f(n) = g(n) + h(n).",
            "g(n) is cost from start, h(n) is heuristic estimate to goal.",
            "Extract node with lowest f(n).",
            "If target reached, reconstruct path.",
            "Update neighbors: if new path is better, update g(n) and f(n)."
        ],
        complexity: {
            time: "O(E log V)", // Heavily dependent on heuristic
            space: "O(V)"
        }
    },
    "Prim's MST": {
        title: "Prim's Algorithm (MST)",
        description: "Greedy algorithm that finds a Minimum Spanning Tree for a weighted undirected graph. It grows the MST one edge at a time from a starting vertex.",
        steps: [
            "Maintain a set of visited nodes (MST Set).",
            "Start with an arbitrary node.",
            "Repeatedly add the minimum weight edge connecting a node in MST to a node outside.",
            "Continue until all nodes are included in the MST."
        ],
        complexity: {
            time: "O(E log V)",
            space: "O(V)"
        }
    },
    'Bellman-Ford': {
        title: "Bellman-Ford Algorithm",
        description: "Computes shortest paths from a source to all other vertices. Unlike Dijkstra, it can handle negative weight edges.",
        steps: [
            "Initialize distances to infinity, start node to 0.",
            "Relax all edges |V| - 1 times.",
            "Relaxation: if dist[u] + weight < dist[v], update dist[v].",
            "Check for negative weight cycles by relaxing one more time.",
            "If any distance reduces, a negative cycle exists."
        ],
        complexity: {
            time: "O(V * E)",
            space: "O(V)"
        }
    }
};
