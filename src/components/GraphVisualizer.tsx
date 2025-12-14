import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Graph, type GraphAlgorithm, type GraphStep } from '../algorithms/graph/types';
import { BFS_CODE } from '../algorithms/graph/bfs';
import { DFS_CODE } from '../algorithms/graph/dfs';
import { DIJKSTRA_CODE } from '../algorithms/graph/dijkstra';
import { ASTAR_CODE } from '../algorithms/graph/astar';
import { PRIMS_CODE } from '../algorithms/graph/prims';
import { BELLMAN_FORD_CODE } from '../algorithms/graph/bellmanFord';
import { Play, Pause, ChevronDown, ChevronRight, ChevronLeft, SkipBack } from 'lucide-react';
import CodeViewer from './CodeViewer';
import StepLogger from './StepLogger';
import ResizableSplit from './ui/ResizableSplit';
import AlgorithmInfoPanel from './AlgorithmInfoPanel';
import { ALGORITHM_DATA } from '../data/algorithms';

interface GraphVisualizerProps {
    algorithm: GraphAlgorithm;
    algorithmName: string;
    onSelectAlgorithm: (name: string) => void;
    availableAlgorithms: string[];
}

const ALGO_CODES: { [key: string]: string } = {
    'BFS': BFS_CODE,
    'DFS': DFS_CODE,
    'Dijkstra': DIJKSTRA_CODE,
    'A* Search': ASTAR_CODE,
    "Prim's MST": PRIMS_CODE,
    'Bellman-Ford': BELLMAN_FORD_CODE,
};

// State Frame for time-travel
interface Frame {
    visitedNodes: string[];
    visitedEdges: string[];
    current: string | null;
    path: string[];
    distances: Map<string, number>;
    heuristics: Map<string, { f: number, g: number, h: number }>;
    codeLine: number | undefined;
    description: string | undefined;
}

const GraphVisualizer = ({ algorithm, algorithmName, onSelectAlgorithm, availableAlgorithms }: GraphVisualizerProps) => {
    // Demo Graph Data
    const [graph] = useState<Graph>({
        nodes: [
            { id: 'A', x: 250, y: 50 },
            { id: 'B', x: 100, y: 150 },
            { id: 'C', x: 400, y: 150 },
            { id: 'D', x: 50, y: 300 },
            { id: 'E', x: 200, y: 300 },
            { id: 'F', x: 350, y: 300 },
            { id: 'G', x: 500, y: 300 },
        ],
        edges: [
            { source: 'A', target: 'B', weight: 4 },
            { source: 'A', target: 'C', weight: 2 },
            { source: 'B', target: 'D', weight: 3 },
            { source: 'B', target: 'E', weight: 3 },
            { source: 'C', target: 'F', weight: 5 },
            { source: 'C', target: 'G', weight: 2 },
            { source: 'E', target: 'F', weight: 1 },
        ]
    });

    // Playback State
    const [frames, setFrames] = useState<Frame[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Initial Empty Frame
    const initialFrame: Frame = useMemo(() => ({
        visitedNodes: [],
        visitedEdges: [],
        current: null,
        path: [],
        distances: new Map(),
        heuristics: new Map(),
        codeLine: undefined,
        description: 'Ready to start...'
    }), []);

    const reset = () => {
        setIsPlaying(false);
        setCurrentFrame(0);
        setFrames([initialFrame]);
    };

    useEffect(() => {
        setTimeout(reset, 0);
    }, [algorithm]);

    // Playback Loop
    useEffect(() => {
        if (isPlaying && currentFrame < frames.length - 1) {
            const delay = Math.max(50, 1000 - (speed * 9));
            timeoutRef.current = setTimeout(() => {
                setCurrentFrame(prev => prev + 1);
            }, delay);
        } else if (currentFrame >= frames.length - 1) {
            setTimeout(() => setIsPlaying(false), 0);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isPlaying, currentFrame, frames.length, speed]);

    const runAlgorithm = () => {
        setIsPlaying(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // 1. Generate all steps
        const gen = algorithm(graph, 'A', 'G');
        const steps: GraphStep[] = Array.from(gen);

        // 2. Build Frames
        const newFrames: Frame[] = [initialFrame];
        let lastFrame = { ...initialFrame }; // Clone

        // Helper to clone complex objects in frame
        const cloneFrame = (f: Frame): Frame => ({
            ...f,
            visitedNodes: [...f.visitedNodes],
            visitedEdges: [...f.visitedEdges],
            path: [...f.path],
            distances: new Map(f.distances),
            heuristics: new Map(f.heuristics)
        });

        for (const step of steps) {
            const nextFrame = cloneFrame(lastFrame);

            // Update metadata
            nextFrame.codeLine = step.codeLine;
            nextFrame.description = step.description;

            // Apply State Changes
            if (step.type === 'visit-node') {
                if (!nextFrame.visitedNodes.includes(step.nodeId)) {
                    nextFrame.visitedNodes.push(step.nodeId);
                }
                nextFrame.current = step.nodeId;
            } else if (step.type === 'visit-edge') {
                const edgeKey = `${step.source}-${step.target}`;
                if (!nextFrame.visitedEdges.includes(edgeKey)) {
                    nextFrame.visitedEdges.push(edgeKey);
                }
            } else if (step.type === 'path') {
                nextFrame.path = step.path;
            } else if (step.type === 'update-dist') {
                nextFrame.distances.set(step.nodeId, step.distance);
            } else if (step.type === 'update-heuristic') {
                nextFrame.heuristics.set(step.nodeId, { f: step.f, g: step.g, h: step.h });
            }

            newFrames.push(nextFrame);
            lastFrame = nextFrame; // Update reference for next iteration
        }

        setFrames(newFrames);
        setCurrentFrame(1); // Jump to first step
        setIsPlaying(true);
    };

    // Derived State for Rendering
    const activeFrame = frames[currentFrame] || initialFrame;

    const isEdgeVisited = (source: string, target: string) => {
        return activeFrame.visitedEdges.includes(`${source}-${target}`) ||
            activeFrame.visitedEdges.includes(`${target}-${source}`);
    };

    return (
        <div className="space-y-4">
            {ALGORITHM_DATA[algorithmName] && (
                <div className="shrink-0">
                    <AlgorithmInfoPanel data={ALGORITHM_DATA[algorithmName]} />
                </div>
            )}
            {/* Top Controls Bar */}
            <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 shadow-lg sticky top-20 z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Left: Algo Selector */}
                    <div className="relative z-20">
                        <button
                            onClick={() => !isPlaying && setIsMenuOpen(!isMenuOpen)}
                            disabled={isPlaying}
                            className="flex items-center justify-between gap-2 px-4 py-2 bg-slate-700 rounded-lg text-white font-medium transition-colors w-48 hover:bg-slate-600 disabled:opacity-50"
                        >
                            <span>{algorithmName}</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-12 left-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
                                >
                                    {availableAlgorithms.map((algo) => (
                                        <button
                                            key={algo}
                                            onClick={() => {
                                                onSelectAlgorithm(algo);
                                                setIsMenuOpen(false);
                                                reset();
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors text-slate-200"
                                        >
                                            {algo}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Center: Playback Controls */}
                    <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-700/50">
                        <button onClick={reset} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Reset">
                            <SkipBack className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                if (frames.length <= 1) {
                                    runAlgorithm();
                                    // Small timeout to allow state update before playing
                                    setTimeout(() => setIsPlaying(true), 10);
                                } else {
                                    setIsPlaying(!isPlaying);
                                }
                            }}
                            className={`p-2 rounded text-white transition-colors ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>

                        {/* Manual Stepping */}
                        <div className="w-px h-6 bg-slate-700 mx-1" />

                        <button
                            onClick={() => {
                                setIsPlaying(false);
                                setCurrentFrame(c => Math.max(0, c - 1));
                            }}
                            disabled={currentFrame <= 0 || frames.length <= 1}
                            className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                setIsPlaying(false);
                                if (frames.length <= 1) runAlgorithm(); // Start if not started
                                else setCurrentFrame(c => Math.min(frames.length - 1, c + 1));
                            }}
                            disabled={currentFrame >= frames.length - 1 && frames.length > 1}
                            className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Right: Speed & Progress */}
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-1 w-32">
                            <div className="flex justify-between text-xs text-slate-400 font-mono">
                                <span>Progress</span>
                                <span>{currentFrame}/{Math.max(0, frames.length - 1)}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max={Math.max(1, frames.length - 1)}
                                value={currentFrame}
                                onChange={(e) => {
                                    setIsPlaying(false);
                                    setCurrentFrame(Number(e.target.value));
                                }}
                                disabled={frames.length <= 1}
                                className="h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-24">
                            <span className="text-xs text-slate-400 font-mono">Speed</span>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout: Resizable Split */}
            <ResizableSplit
                initialSplit={60}
                left={
                    <div className="flex flex-col h-full gap-4">
                        {/* 1. Graph SVG */}
                        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-hidden flex items-center justify-center p-8 min-h-[400px] shadow-inner relative">
                            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-[800px] select-none h-full">
                                {/* Edges */}
                                {graph.edges.map((edge) => {
                                    const sourceNode = graph.nodes.find(n => n.id === edge.source);
                                    const targetNode = graph.nodes.find(n => n.id === edge.target);

                                    if (!sourceNode || !targetNode) return null;

                                    const isVisited = isEdgeVisited(edge.source, edge.target);

                                    return (
                                        <g key={`${edge.source}-${edge.target}`}>
                                            <motion.line
                                                x1={sourceNode.x}
                                                y1={sourceNode.y}
                                                x2={targetNode.x}
                                                y2={targetNode.y}
                                                stroke={isVisited ? "#f59e0b" : "#334155"}
                                                strokeWidth={isVisited ? "3" : "2"}
                                                initial={false}
                                                animate={{ stroke: isVisited ? "#f59e0b" : "#334155" }}
                                                transition={{ duration: 0.2 }}
                                            />
                                            {/* Weight Label */}
                                            {algorithmName !== 'BFS' && algorithmName !== 'DFS' && edge.weight && (
                                                <g>
                                                    <circle
                                                        cx={(sourceNode.x + targetNode.x) / 2}
                                                        cy={(sourceNode.y + targetNode.y) / 2}
                                                        r="10"
                                                        fill="#0f172a"
                                                    />
                                                    <text
                                                        x={(sourceNode.x + targetNode.x) / 2}
                                                        y={(sourceNode.y + targetNode.y) / 2}
                                                        dy=".3em"
                                                        textAnchor="middle"
                                                        fill="#94a3b8"
                                                        fontSize="11"
                                                        className="font-mono font-bold"
                                                    >
                                                        {edge.weight}
                                                    </text>
                                                </g>
                                            )}
                                        </g>
                                    );
                                })}

                                {/* Nodes */}
                                {graph.nodes.map((node) => {
                                    const isCurrent = node.id === activeFrame.current;
                                    const isVisited = activeFrame.visitedNodes.includes(node.id);
                                    const isPath = activeFrame.path.includes(node.id);
                                    const dist = activeFrame.distances.get(node.id);

                                    let fill = "#1e293b"; // slate-800
                                    let stroke = "#475569"; // slate-600
                                    let scale = 1;

                                    if (isPath) {
                                        fill = "#10b981"; // emerald-500
                                        stroke = "#059669";
                                        scale = 1.1;
                                    } else if (isCurrent) {
                                        fill = "#f59e0b"; // amber-500
                                        stroke = "#d97706";
                                        scale = 1.2;
                                    } else if (isVisited) {
                                        fill = "#3b82f6"; // blue-500
                                        stroke = "#2563eb";
                                    }

                                    return (
                                        <g key={node.id}>
                                            {/* Halo for current node */}
                                            {isCurrent && (
                                                <motion.circle
                                                    cx={node.x}
                                                    cy={node.y}
                                                    r="26"
                                                    fill="none"
                                                    stroke="#f59e0b"
                                                    strokeOpacity="0.5"
                                                    strokeWidth="2"
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1.2, opacity: 0 }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                />
                                            )}

                                            <motion.circle
                                                cx={node.x}
                                                cy={node.y}
                                                r="20"
                                                fill={fill}
                                                stroke={stroke}
                                                strokeWidth="2"
                                                initial={false}
                                                animate={{ fill, stroke, scale }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            <text
                                                x={node.x}
                                                y={node.y}
                                                dy=".35em"
                                                textAnchor="middle"
                                                fill="white"
                                                fontWeight="bold"
                                                pointerEvents="none"
                                                fontSize="14"
                                            >
                                                {node.id}
                                            </text>

                                            {/* Distance Label */}
                                            {(algorithmName === 'Dijkstra' || algorithmName === 'Bellman-Ford' || algorithmName === "Prim's MST") && dist !== undefined && (
                                                <g transform={`translate(${node.x}, ${node.y - 32})`}>
                                                    <rect x="-18" y="-10" width="36" height="14" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                                                    <text
                                                        textAnchor="middle"
                                                        fill={dist === Infinity ? "#94a3b8" : "#60a5fa"}
                                                        fontSize="10"
                                                        dy="1"
                                                        className="font-mono font-bold"
                                                    >
                                                        {dist === Infinity ? '∞' : dist}
                                                    </text>
                                                </g>
                                            )}

                                            {/* A* Heuristics */}
                                            {algorithmName === 'A* Search' && activeFrame.heuristics.get(node.id) && (
                                                <g>
                                                    <text x={node.x} y={node.y - 35} textAnchor="middle" fill="#f472b6" fontSize="10" className="font-mono">f:{activeFrame.heuristics.get(node.id)?.f.toFixed(1)}</text>
                                                </g>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                            <h4 className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Legend</h4>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Visited</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Current</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Path</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600"></div> Unvisited</div>
                            </div>
                        </div>
                    </div>
                }
                right={
                    <div className="flex flex-col h-full gap-4 p-4">
                        <StepLogger description={activeFrame.description} />
                        <div className="flex-1 overflow-hidden min-h-0">
                            <CodeViewer code={ALGO_CODES[algorithmName] || ''} highlightLine={activeFrame.codeLine} />
                        </div>
                    </div>
                }
            />


        </div>
    );
};

export default GraphVisualizer;
