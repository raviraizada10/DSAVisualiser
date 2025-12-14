import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RefreshCw, ChevronLeft, ChevronRight, SkipBack } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';

import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { fibonacci } from '../../algorithms/dp/fibonacci';
import { knapsack } from '../../algorithms/dp/knapsack';
import { lcs } from '../../algorithms/dp/lcs';
import { FIB_CODE, KNAPSACK_CODE, LCS_CODE, type DPStep, type DPCell } from '../../algorithms/dp/types';
import AlgorithmInfoPanel from '../AlgorithmInfoPanel';
import { ALGORITHM_DATA } from '../../data/algorithms';

const ALGORITHMS = {
    'fib': { name: 'Fibonacci Sequence', code: FIB_CODE, generator: fibonacci },
    'knapsack': { name: '0/1 Knapsack', code: KNAPSACK_CODE, generator: knapsack },
    'lcs': { name: 'Longest Common Subsequence', code: LCS_CODE, generator: lcs }
};

type AlgoKey = keyof typeof ALGORITHMS;

interface DPVisualizerProps {
    selectedAlgo: string;
    onSelectAlgo: (algo: string) => void;
}

const DPVisualizer = ({ selectedAlgo, onSelectAlgo }: DPVisualizerProps) => {
    // Inputs
    const [fibN, setFibN] = useState(6);
    const [knapCap, setKnapCap] = useState(7);
    const [knapWt, setKnapWt] = useState("1, 3, 4, 5");
    const [knapVal, setKnapVal] = useState("1, 4, 5, 7");
    const [lcsS1, setLcsS1] = useState("abcde");
    const [lcsS2, setLcsS2] = useState("ace");

    // Playback State
    const [frames, setFrames] = useState<DPStep[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeStep = frames.length > 0 ? frames[currentFrame] : null;
    const table = activeStep?.table || [];
    const highlightCells = activeStep?.highlightCells || [];

    const activeAlgo = ALGORITHMS[selectedAlgo as AlgoKey] || ALGORITHMS['fib'];

    const reset = () => {
        setIsPlaying(false);
        setFrames([]);
        setCurrentFrame(0);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const runGenerator = (generator: Generator<DPStep>) => {
        const steps: DPStep[] = [];
        for (const step of generator) {
            steps.push({
                ...step,
                table: step.table.map(row => [...row]), // Deep copy table
                highlightCells: [...step.highlightCells] // Copy highlights
            });
        }
        if (steps.length === 0) return;
        setFrames(steps);
        setCurrentFrame(0);
        setIsPlaying(true);
    };

    const run = () => {
        if (isPlaying) return;
        reset();

        let gen: Generator<DPStep> | null = null;

        if (selectedAlgo === 'fib') {
            gen = fibonacci(fibN);
        } else if (selectedAlgo === 'knapsack') {
            const weights = knapWt.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));
            const values = knapVal.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));
            if (weights.length !== values.length) {
                alert("Weights and Values must have same length");
                return;
            }
            gen = knapsack(knapCap, weights, values);
        } else if (selectedAlgo === 'lcs') {
            gen = lcs(lcsS1, lcsS2);
        }

        if (gen) runGenerator(gen);
    };

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

    const getCellColor = (r: number, c: number) => {
        const highlight = highlightCells.find((h: DPCell) => h.row === r && h.col === c);
        if (!highlight) return 'bg-slate-800';
        if (highlight.color === 'current') return 'bg-yellow-500/50 border-yellow-500';
        if (highlight.color === 'source') return 'bg-blue-500/50 border-blue-500';
        if (highlight.color === 'compare') return 'bg-purple-500/50 border-purple-500';
        if (highlight.color === 'final') return 'bg-green-500/50 border-green-500';
        return 'bg-slate-800';
    };

    return (
        <div className="space-y-4">
            <ResizableSplit
                initialSplit={60}
                left={
                    <div className="flex flex-col gap-6 p-1 h-full">
                        {/* Controls */}
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <select
                                    value={selectedAlgo}
                                    onChange={(e) => {
                                        onSelectAlgo(e.target.value);
                                        reset();
                                    }}
                                    className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 outline-none focus:border-blue-500"
                                    disabled={frames.length > 0} // Disable algo switch during active session (optional, but cleaner)
                                >
                                    {Object.entries(ALGORITHMS).map(([key, algo]) => (
                                        <option key={key} value={key}>{algo.name}</option>
                                    ))}
                                </select>

                                {selectedAlgo === 'fib' && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400">N:</span>
                                        <input
                                            type="number"
                                            min="0" max="20"
                                            value={fibN}
                                            onChange={(e) => setFibN(Math.min(20, Math.max(0, Number(e.target.value))))}
                                            className="w-16 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                                            disabled={frames.length > 0}
                                        />
                                    </div>
                                )}

                                {selectedAlgo === 'knapsack' && (
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">Cap:</span>
                                            <input
                                                type="number"
                                                min="0" max="20"
                                                value={knapCap}
                                                onChange={(e) => setKnapCap(Math.min(20, Math.max(0, Number(e.target.value))))}
                                                className="w-16 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                                                disabled={frames.length > 0}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">Wt:</span>
                                            <input
                                                type="text"
                                                value={knapWt}
                                                onChange={(e) => setKnapWt(e.target.value)}
                                                className="w-32 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                                                placeholder="1, 3, 4"
                                                disabled={frames.length > 0}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">Val:</span>
                                            <input
                                                type="text"
                                                value={knapVal}
                                                onChange={(e) => setKnapVal(e.target.value)}
                                                className="w-32 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                                                placeholder="1, 4, 5"
                                                disabled={frames.length > 0}
                                            />
                                        </div>
                                    </div>
                                )}

                                {selectedAlgo === 'lcs' && (
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">Str1:</span>
                                            <input
                                                type="text"
                                                value={lcsS1}
                                                onChange={(e) => setLcsS1(e.target.value.slice(0, 10))}
                                                className="w-24 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                                                disabled={frames.length > 0}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">Str2:</span>
                                            <input
                                                type="text"
                                                value={lcsS2}
                                                onChange={(e) => setLcsS2(e.target.value.slice(0, 10))}
                                                className="w-24 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600"
                                                disabled={frames.length > 0}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 ml-auto">
                                    <div className="flex items-center gap-2 mr-2">
                                        <span className="text-slate-400 text-sm">Speed</span>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={speed}
                                            onChange={(e) => setSpeed(Number(e.target.value))}
                                            className="w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                    <button
                                        onClick={run}
                                        disabled={frames.length > 0}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium disabled:opacity-50 transition-colors"
                                    >
                                        <Play className="w-4 h-4" /> Run
                                    </button>
                                    <button
                                        onClick={reset}
                                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Playback Controls */}
                            {frames.length > 0 && (
                                <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-700">
                                    <button onClick={() => { setIsPlaying(false); setCurrentFrame(0); }} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Restart">
                                        <SkipBack className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.max(0, c - 1)); }} disabled={currentFrame === 0} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className={`p-2 rounded text-white transition-colors ${isPlaying ? 'bg-amber-600' : 'bg-blue-600'}`}>
                                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.min(frames.length - 1, c + 1)); }} disabled={currentFrame === frames.length - 1} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Table Visualization */}
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6 overflow-auto min-h-[400px]">
                            {table.length > 0 ? (
                                <div className="min-w-fit"> {/* Wrapper to allow scroll */}
                                    {/* Column Indices */}
                                    <div className="flex gap-1 mb-1 ml-12"> {/* ml-12 to offset row header */}
                                        {table[0].map((_, cIdx) => (
                                            <div key={`col-${cIdx}`} className="w-12 text-center text-xs text-slate-500 font-mono">
                                                {cIdx}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-1 items-start">
                                        {table.map((row, rIdx) => (
                                            <div key={rIdx} className="flex gap-1 items-center">
                                                {/* Row Index */}
                                                <div className="w-10 text-right pr-2 text-xs text-slate-500 font-mono">
                                                    {rIdx}
                                                </div>

                                                {row.map((cell, cIdx) => (
                                                    <motion.div
                                                        key={`${rIdx}-${cIdx}`} // Use stable key? Or just index? Index seems fine here as grid is fixed size mostly
                                                        // layout // Removing layout prop for better performance on large grids
                                                        initial={{ scale: 0.9 }}
                                                        animate={{
                                                            scale: 1,
                                                            opacity: 1
                                                        }}
                                                        className={`
                                                            w-12 h-12 flex items-center justify-center rounded-lg border-2
                                                            text-sm font-bold shadow-lg transition-colors
                                                            ${getCellColor(rIdx, cIdx)}
                                                            ${cell === null ? 'text-slate-600 border-slate-800' : 'text-white'}
                                                        `}
                                                    >
                                                        {cell ?? ''}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500">
                                    Press Run to visualize
                                </div>
                            )}
                        </div>

                    </div>
                }
                right={
                    <div className="flex flex-col h-full gap-4 p-4">
                        <StepLogger description={activeStep?.description || "Ready"} />
                        <div className="flex-1 overflow-hidden min-h-0">
                            <CodeViewer code={activeAlgo.code} highlightLine={activeStep?.codeLine} />
                        </div>
                    </div>
                }
            />


        </div>
    );
};

export default DPVisualizer;
