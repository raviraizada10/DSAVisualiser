import { useState } from 'react';
import { motion } from 'framer-motion';
import GraphVisualizer from '../components/GraphVisualizer';
import { bfs } from '../algorithms/graph/bfs';
import { dfs } from '../algorithms/graph/dfs';
import { dijkstra } from '../algorithms/graph/dijkstra';
import { astar } from '../algorithms/graph/astar';
import { prims } from '../algorithms/graph/prims';
import { bellmanFord } from '../algorithms/graph/bellmanFord';
import { GRAPH_ALGORITHMS_INFO } from '../algorithms/graph/info';
import { type GraphAlgorithm } from '../algorithms/graph/types';

const ALGORITHMS: { [key: string]: GraphAlgorithm } = {
    'BFS': bfs,
    'DFS': dfs,
    'Dijkstra': dijkstra,
    'A* Search': astar,
    "Prim's MST": prims,
    'Bellman-Ford': bellmanFord,
};

const Graphs = () => {
    const [selectedAlgo, setSelectedAlgo] = useState('BFS');
    const info = GRAPH_ALGORITHMS_INFO[selectedAlgo] || GRAPH_ALGORITHMS_INFO['BFS'];

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Graph Algorithms
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Explore complex graph traversal and pathfinding algorithms with interactive visualizations and code tracing.
                </p>
            </motion.div>

            <div className="space-y-8">
                <GraphVisualizer
                    algorithm={ALGORITHMS[selectedAlgo]}
                    algorithmName={selectedAlgo}
                    onSelectAlgorithm={setSelectedAlgo}
                    availableAlgorithms={Object.keys(ALGORITHMS)}
                />

                <div className="space-y-6">
                    <motion.div
                        key={selectedAlgo}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-6"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{info.title}</h2>
                            <p className="text-slate-300 leading-relaxed">{info.description}</p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold text-blue-400">Key Steps</h3>
                            <ul className="space-y-2">
                                {info.steps.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                            <div>
                                <span className="text-slate-400 text-sm">Time Complexity</span>
                                <p className="font-mono text-emerald-400">{info.complexity.time}</p>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm">Space Complexity</span>
                                <p className="font-mono text-purple-400">{info.complexity.space}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Graphs;
