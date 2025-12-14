import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RefreshCw, Crown, ChevronLeft, ChevronRight, SkipBack } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { nQueens } from '../../algorithms/backtracking/nQueens';
import { N_QUEENS_CODE, type BacktrackingStep } from '../../algorithms/backtracking/types';



const NQueensVisualizer = () => {
    // State
    const [n, setN] = useState(4);
    const [frames, setFrames] = useState<BacktrackingStep[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    const activeStep = frames.length > 0 ? frames[currentFrame] : null;
    const board = activeStep?.board || Array(n).fill(0).map(() => Array(n).fill(0));

    const reset = () => {
        setIsPlaying(false);
        setFrames([]);
        setCurrentFrame(0);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const run = () => {
        reset();
        const generator = nQueens(n);
        const steps: BacktrackingStep[] = [];
        for (const step of generator) {
            steps.push({
                ...step,
                board: step.board.map(row => [...row])
            });
        }
        setFrames(steps);
        setCurrentFrame(0);
        setIsPlaying(true);
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

    // Cell Styling
    const getCellColor = (val: number, r: number, c: number) => {
        const isBlack = (r + c) % 2 === 1;
        const base = isBlack ? 'bg-slate-800' : 'bg-slate-700';

        if (val === 1) return 'bg-emerald-600/80 border-emerald-500 shadow-emerald-500/50'; // Queen
        if (val === 2) return 'bg-amber-500/50 border-amber-500'; // Checking
        if (val === 3) return 'bg-red-500/50 border-red-500'; // Conflict

        return base;
    };

    return (
        <div className="space-y-4">

            <ResizableSplit
                initialSplit={60}
                left={
                    <div className="flex flex-col gap-6 p-1 h-full">
                        {/* Controls */}
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                            <div className="flex flex-wrap items-center gap-6 justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 font-bold">Board Size (N):</span>
                                        <input
                                            type="number"
                                            min="4" max="8"
                                            value={n}
                                            onChange={(e) => {
                                                setN(Math.min(8, Math.max(4, Number(e.target.value))));
                                                reset();
                                            }}
                                            className="w-16 bg-slate-700 text-white px-2 py-1 rounded border border-slate-600 text-center font-mono"
                                            disabled={frames.length > 0}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-sm">Speed</span>
                                        <input
                                            type="range"
                                            min="1" max="100"
                                            value={speed}
                                            onChange={(e) => setSpeed(Number(e.target.value))}
                                            className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={run}
                                        disabled={frames.length > 0}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
                                    >
                                        <Play className="w-4 h-4" /> Start Visualization
                                    </button>
                                    <button
                                        onClick={reset}
                                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                                        title="Reset"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Playback Controls */}
                            {frames.length > 0 && (
                                <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-700">
                                    <button onClick={() => { setIsPlaying(false); setCurrentFrame(0); }} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Restart">
                                        <SkipBack className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.max(0, c - 1)); }} disabled={currentFrame === 0} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className={`p-3 rounded-xl text-white transition-colors shadow-lg ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                    </button>
                                    <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.min(frames.length - 1, c + 1)); }} disabled={currentFrame === frames.length - 1} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Board */}
                        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 p-8 flex items-center justify-center min-h-[400px]">
                            <div
                                className="grid gap-1 bg-slate-800 p-2 rounded-lg shadow-2xl"
                                style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
                            >
                                {board.map((row, rIdx) => (
                                    row.map((val, cIdx) => (
                                        <motion.div
                                            key={`${rIdx}-${cIdx}`}
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            className={`
                                                w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-md
                                                transition-colors duration-300 border-2 border-transparent
                                                ${getCellColor(val, rIdx, cIdx)}
                                            `}
                                        >
                                            {val === 1 && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -45 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-yellow-400 drop-shadow-lg" strokeWidth={1.5} />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))
                                ))}
                            </div>
                        </div>

                    </div>
                }
                right={
                    <div className="flex flex-col h-full gap-4 p-4">
                        <StepLogger description={activeStep?.description || `Ready to solve ${n}-Queens...`} />
                        <div className="flex-1 overflow-hidden min-h-0">
                            <CodeViewer code={N_QUEENS_CODE} highlightLine={activeStep?.codeLine} />
                        </div>
                    </div>
                }
            />


        </div >
    );
};

export default NQueensVisualizer;
