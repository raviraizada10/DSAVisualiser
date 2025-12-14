import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, ChevronLeft, ChevronRight, SkipBack, RotateCcw } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { union } from '../../algorithms/structures/unionfind/algorithm';
import { UF_CODE_JAVA } from '../../algorithms/structures/unionfind/types';
import type { UFStep } from '../../algorithms/structures/unionfind/types';

const UnionFindVisualizer = () => {
    const N = 10;

    // Persistent State
    const [committedParent, setCommittedParent] = useState<number[]>(Array.from({ length: N }, (_, i) => i));
    const [committedRank, setCommittedRank] = useState<number[]>(Array(N).fill(0));

    // Playback State
    const [frames, setFrames] = useState<UFStep[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed] = useState(50); // Fixed speed for now

    const [inputA, setInputA] = useState(0);
    const [inputB, setInputB] = useState(1);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Initial "Idle" step logic
    const activeStep = frames.length > 0 ? frames[currentFrame] : {
        parent: committedParent,
        rank: committedRank,
        activeIndices: [] as number[],
        description: "Ready",
        codeLine: undefined
    };

    const runGenerator = (generator: Generator<UFStep>) => {
        const steps: UFStep[] = [];
        for (const step of generator) {
            // Snapshot arrays
            steps.push({
                ...step,
                parent: [...step.parent],
                rank: [...step.rank]
            });
        }

        if (steps.length === 0) return;

        setFrames(steps);
        setCurrentFrame(0);
        setIsPlaying(true);
        // Update committed state immediately
        setCommittedParent(steps[steps.length - 1].parent);
        setCommittedRank(steps[steps.length - 1].rank);
    };

    const handleUnion = () => {
        if (isPlaying) return;
        setFrames([]);
        // Pass COPIES of committed state to algorithm so it doesn't mutate committed state directly before generator runs
        const gen = union([...committedParent], [...committedRank], inputA, inputB);
        runGenerator(gen);
    };

    const reset = () => {
        setCommittedParent(Array.from({ length: N }, (_, i) => i));
        setCommittedRank(Array(N).fill(0));
        setFrames([]);
        setCurrentFrame(0);
        setIsPlaying(false);
    };

    // Auto Playback
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
    }, [isPlaying, currentFrame, frames, speed]);

    const getNodePos = (i: number) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        return {
            x: 100 + col * 150,
            y: 100 + row * 200
        };
    };

    return (
        <ResizableSplit
            initialSplit={65}
            left={
                <div className="flex flex-col h-full gap-6">
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono">Union(</span>
                            <input
                                type="number"
                                min="0" max={N - 1}
                                value={inputA}
                                onChange={(e) => setInputA(Math.min(N - 1, Math.max(0, Number(e.target.value))))}
                                className="w-12 px-2 py-1 bg-slate-700 rounded text-center text-white border border-slate-600 focus:outline-none"
                                disabled={isPlaying}
                            />
                            <span className="text-slate-400 font-mono">,</span>
                            <input
                                type="number"
                                min="0" max={N - 1}
                                value={inputB}
                                onChange={(e) => setInputB(Math.min(N - 1, Math.max(0, Number(e.target.value))))}
                                className="w-12 px-2 py-1 bg-slate-700 rounded text-center text-white border border-slate-600 focus:outline-none"
                                disabled={isPlaying}
                            />
                            <span className="text-slate-400 font-mono">)</span>

                            <button
                                onClick={handleUnion}
                                disabled={isPlaying}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium disabled:opacity-50 transition-colors ml-2"
                            >
                                <ArrowRight className="w-4 h-4" /> Go
                            </button>
                        </div>

                        <div className="w-px h-8 bg-slate-700 hidden md:block" />
                        <button onClick={() => { setIsPlaying(false); setCurrentFrame(0); }} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Restart Op">
                            <SkipBack className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.max(0, c - 1)); }} disabled={currentFrame === 0} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)} disabled={frames.length === 0} className={`p-2 rounded text-white transition-colors ${isPlaying ? 'bg-amber-600' : 'bg-blue-600'}`}>
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.min(frames.length - 1, c + 1)); }} disabled={currentFrame === frames.length - 1} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <div className="flex-1" />
                        <button onClick={reset} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-hidden min-h-[500px] relative flex items-center justify-center">
                        <svg className="w-full h-full min-h-[500px]" viewBox="0 0 800 500">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                                </marker>
                            </defs>

                            {/* Edges from i to parent[i] */}
                            {activeStep.parent.map((p, i) => {
                                if (p === i) return null; // Root loops not drawn or drawn as self-loop? Let's skip self-loops for clarity
                                const start = getNodePos(i);
                                const end = getNodePos(p);
                                return (
                                    <motion.line
                                        key={`link-${i}-${p}`}
                                        initial={false}
                                        animate={{ x1: start.x, y1: start.y, x2: end.x, y2: end.y }}
                                        stroke="#475569"
                                        strokeWidth="2"
                                        markerEnd="url(#arrowhead)"
                                    />
                                );
                            })}

                            {/* Nodes */}
                            {Array.from({ length: N }).map((_, i) => {
                                const pos = getNodePos(i);
                                const isActive = activeStep.activeIndices?.includes(i);
                                return (
                                    <motion.g
                                        key={i}
                                        initial={false}
                                        animate={{ x: pos.x, y: pos.y }}
                                    >
                                        <circle
                                            r="20"
                                            fill={isActive ? "#fbbf24" : "#3b82f6"}
                                            stroke={isActive ? "#d97706" : "#2563eb"}
                                            strokeWidth="2"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dy=".3em"
                                            fill="white"
                                            fontWeight="bold"
                                            className="pointer-events-none select-none"
                                        >
                                            {i}
                                        </text>

                                        {/* Rank Label */}
                                        {activeStep.rank[i] > 0 && (
                                            <text
                                                y="-30"
                                                textAnchor="middle"
                                                fill="#94a3b8"
                                                fontSize="12"
                                                className="font-mono"
                                            >
                                                rank:{activeStep.rank[i]}
                                            </text>
                                        )}
                                    </motion.g>
                                );
                            })}
                        </svg>
                    </div>

                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={activeStep.description} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer
                            code={UF_CODE_JAVA}
                            highlightLine={activeStep.codeLine}
                        />
                    </div>
                </div>
            }
        />
    );
};

export default UnionFindVisualizer;
