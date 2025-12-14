import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Play, Pause, ChevronLeft, ChevronRight, SkipBack } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { insertHeap, extractMaxHeap } from '../../algorithms/structures/heap/algorithm';
import { HEAP_CODE_JAVA } from '../../algorithms/structures/heap/types';
import type { HeapStep } from '../../algorithms/structures/heap/types';

const HeapVisualizer = () => {
    const [array, setArray] = useState<number[]>([50, 30, 20, 15, 10, 8, 16]); // Initial valid Max Heap
    const [inputValue, setInputValue] = useState(0);

    // Playback State
    const [frames, setFrames] = useState<HeapStep[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed] = useState(50); // Speed fixed for now or re-enable slider if needed

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Initial "Idle" step
    const idleStep: HeapStep = {
        type: 'complete',
        array: array,
        highlightIndices: [],
        description: "Ready...",
        codeLine: undefined
    };

    const activeStep = frames.length > 0 ? frames[currentFrame] : idleStep;

    // Helper to run generator and store frames
    const runGenerator = (generator: Generator<HeapStep>) => {
        const steps: HeapStep[] = [];
        for (const step of generator) {
            steps.push(step);
        }
        // If operation didn't yield changes (e.g. empty heap), steps might be empty
        if (steps.length === 0) return;

        setFrames(steps);
        setCurrentFrame(0);
        setIsPlaying(true);
    };

    const handleInsert = () => {
        if (isPlaying || inputValue === 0) return;
        setFrames([]); // Clear prev
        const gen = insertHeap([...activeStep.array], inputValue);
        runGenerator(gen);
        setInputValue(Math.floor(Math.random() * 100)); // Reset input
    };

    const handleExtractMax = () => {
        if (isPlaying || activeStep.array.length === 0) return;
        setFrames([]);
        const gen = extractMaxHeap([...activeStep.array]);
        runGenerator(gen);
    };

    const handleReset = () => {
        setFrames([]);
        setCurrentFrame(0);
        setIsPlaying(false);
        setArray([50, 30, 20, 15, 10, 8, 16]);
    };

    // Auto Playback Effect
    useEffect(() => {
        if (isPlaying && currentFrame < frames.length - 1) {
            const delay = Math.max(50, 1000 - (speed * 9));
            timeoutRef.current = setTimeout(() => {
                setCurrentFrame(prev => prev + 1);
            }, delay);
        } else if (currentFrame >= frames.length - 1) {
            setTimeout(() => {
                setIsPlaying(false);
                // Optionally update the base array
                if (frames.length > 0) {
                    setArray(frames[frames.length - 1].array);
                }
            }, 0);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isPlaying, currentFrame, frames, speed]);

    // Update base array when frames finish (to persist state across operations)
    // Actually, careful: if we scrub back, 'array' shouldn't change.
    // 'array' should only update when we COMMIT the operation or start a new one.
    // Better: Always use activeStep.array for rendering. 
    // When starting new op, use activeStep.array as base.
    // The 'array' state var is technically redundant if we just use the last frame of previous op.
    // But for simplicity, let's just keep 'activeStep' as source of truth.

    const getNodePosition = (index: number) => {
        const level = Math.floor(Math.log2(index + 1));
        const offset = index - (Math.pow(2, level) - 1);
        const width = 800;
        const levelGap = width / (Math.pow(2, level) + 1);
        const x = levelGap * (offset + 1);
        const y = 50 + (level * 80);
        return { x, y };
    };

    return (
        <ResizableSplit
            initialSplit={65}
            left={
                <div className="flex flex-col h-full gap-6">
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                        {/* Operations */}
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(Number(e.target.value))}
                                className="w-16 px-2 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none"
                                disabled={frames.length > 0 && currentFrame < frames.length - 1} // Disable during playback
                            />
                            <button onClick={handleInsert} disabled={frames.length > 0 && currentFrame < frames.length - 1} className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-colors">
                                <Plus className="w-4 h-4" /> Insert
                            </button>
                        </div>
                        <button onClick={handleExtractMax} disabled={frames.length > 0 && currentFrame < frames.length - 1} className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-colors">
                            <Trash2 className="w-4 h-4" /> Extract Max
                        </button>

                        {/* Playback Controls */}
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
                        <button onClick={handleReset} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors text-xs uppercase font-bold tracking-wider">
                            Reset Heap
                        </button>
                    </div>

                    {/* Visualization Area */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 relative overflow-hidden flex items-center justify-center min-h-[400px]">
                        <svg className="w-full h-full min-h-[500px]" viewBox="0 0 800 500">
                            {/* Edges */}
                            {activeStep.array.map((_, index) => {
                                if (index === 0) return null;
                                const parentIndex = Math.floor((index - 1) / 2);
                                const start = getNodePosition(parentIndex);
                                const end = getNodePosition(index);
                                return (
                                    <motion.line
                                        key={`edge-${index}`}
                                        initial={false}
                                        animate={{ x1: start.x, y1: start.y, x2: end.x, y2: end.y }}
                                        stroke="#475569"
                                        strokeWidth="2"
                                    />
                                );
                            })}

                            {/* Nodes */}
                            <AnimatePresence initial={false}>
                                {activeStep.array.map((value, index) => {
                                    const pos = getNodePosition(index);
                                    const isHighlighted = activeStep.highlightIndices.includes(index);

                                    return (
                                        <motion.g
                                            key={`${value}`} // Use value as key to animate movement? Or index? 
                                            // Using value as key allows node to "move" to new index.
                                            // But if duplicate values exist, this breaks. 
                                            // Heap can have duplicates. Index key is safer but no move animation.
                                            // Let's use index key for stability, but animate position.
                                            layoutId={`node-${index}`} // Actually layoutId might conflict if not unique
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                x: pos.x,
                                                y: pos.y
                                            }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <circle
                                                r="20"
                                                fill={isHighlighted ? "#fbbf24" : "#3b82f6"}
                                                stroke={isHighlighted ? "#d97706" : "#2563eb"}
                                                strokeWidth="2"
                                            />
                                            <text
                                                textAnchor="middle"
                                                dy=".3em"
                                                fill="white"
                                                fontWeight="bold"
                                                className="pointer-events-none select-none"
                                            >
                                                {value}
                                            </text>
                                            <text
                                                y="35"
                                                textAnchor="middle"
                                                fill="#94a3b8"
                                                fontSize="10"
                                                className="font-mono"
                                            >
                                                {index}
                                            </text>
                                        </motion.g>
                                    );
                                })}
                            </AnimatePresence>
                        </svg>
                    </div>

                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={activeStep.description} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer
                            code={HEAP_CODE_JAVA}
                            highlightLine={activeStep.codeLine}
                        />
                    </div>
                </div>
            }
        />
    );
};

export default HeapVisualizer;
