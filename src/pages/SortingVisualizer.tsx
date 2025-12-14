import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronDown, SkipBack, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { type SortAlgorithm, type SortStep } from '../algorithms/sorting/types';
import { bubbleSort, BUBBLE_SORT_CODE } from '../algorithms/sorting/bubbleSort';
import { selectionSort, SELECTION_SORT_CODE } from '../algorithms/sorting/selectionSort';
import { insertionSort, INSERTION_SORT_CODE } from '../algorithms/sorting/insertionSort';
import { mergeSort, MERGE_SORT_CODE } from '../algorithms/sorting/mergeSort';
import { quickSort, QUICK_SORT_CODE } from '../algorithms/sorting/quickSort';
import CodeViewer from '../components/CodeViewer';
import StepLogger from '../components/StepLogger';
import ResizableSplit from '../components/ui/ResizableSplit';
import AlgorithmInfoPanel from '../components/AlgorithmInfoPanel';
import { ALGORITHM_DATA } from '../data/algorithms';

interface SortingVisualizerProps {
    selectedAlgo: string;
    onSelectAlgo: (algo: string) => void;
}

const ALGORITHMS: { [key: string]: { name: string; fn: SortAlgorithm; code?: string } } = {
    'Bubble Sort': { name: 'Bubble Sort', fn: bubbleSort, code: BUBBLE_SORT_CODE },
    'Selection Sort': { name: 'Selection Sort', fn: selectionSort, code: SELECTION_SORT_CODE },
    'Insertion Sort': { name: 'Insertion Sort', fn: insertionSort, code: INSERTION_SORT_CODE },
    'Merge Sort': { name: 'Merge Sort', fn: mergeSort, code: MERGE_SORT_CODE },
    'Quick Sort': { name: 'Quick Sort', fn: quickSort, code: QUICK_SORT_CODE },
};

const SortingVisualizer = ({ selectedAlgo, onSelectAlgo }: SortingVisualizerProps) => {
    // Data State
    const [initialArray, setInitialArray] = useState<number[]>([]);

    // Playback State
    const [steps, setSteps] = useState<SortStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Initialize random array
    const generateNewArray = () => {
        const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 10);
        setInitialArray(newArray);
        resetPlayer(newArray);
    };

    // Reset player state with specific array
    const resetPlayer = (arr: number[]) => {
        setIsPlaying(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Initial "step" is just the raw array
        const initialStep: SortStep = {
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: [],
            codeLine: undefined,
            description: "Ready to sort..."
        };

        setSteps([initialStep]);
        setCurrentStepIndex(0);
    };

    useEffect(() => {
        setTimeout(generateNewArray, 0);
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // When algorithm changes, re-run generation logic? 
    // Usually better to keep the same array but reset progress.
    useEffect(() => {
        if (initialArray.length > 0) {
            resetPlayer(initialArray);
        }
    }, [selectedAlgo]);

    // Playback Loop
    useEffect(() => {
        if (isPlaying && currentStepIndex < steps.length - 1) {
            const delay = Math.max(50, 1000 - (speed * 9));
            timeoutRef.current = setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, delay);
        } else if (currentStepIndex >= steps.length - 1) {
            setTimeout(() => setIsPlaying(false), 0);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isPlaying, currentStepIndex, steps.length, speed]);


    const calculateSteps = () => {
        const algoFn = ALGORITHMS[selectedAlgo].fn;
        const generator = algoFn(initialArray);
        const newSteps = Array.from(generator);

        // Prepend current state as step 0 if needed, or just use the generated steps.
        // Usually generator yields initial state first.
        setSteps(newSteps);
        setCurrentStepIndex(0); // This sets it to "Start" state
        setIsPlaying(true);
    };

    const handleRun = () => {
        if (steps.length <= 1) {
            calculateSteps();
        } else {
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        setIsPlaying(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleReset = () => {
        setIsPlaying(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setCurrentStepIndex(0);
    };

    // Derived State
    const activeStep = steps[currentStepIndex] || { array: initialArray, comparing: [], swapping: [], sorted: [] };

    return (
        <div className="space-y-4">
            {/* Analysis Section Moved to Top */}
            {ALGORITHM_DATA[selectedAlgo] && (
                <div className="shrink-0">
                    <AlgorithmInfoPanel data={ALGORITHM_DATA[selectedAlgo]} />
                </div>
            )}

            {/* Top Controls Bar */}
            <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 shadow-lg sticky top-20 z-10 transition-all">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left: Algo Selector & New Array */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={generateNewArray}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                            title="Generate New Random Array"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>

                        <div className="relative z-20">
                            <button
                                onClick={() => !isPlaying && setIsMenuOpen(!isMenuOpen)}
                                disabled={isPlaying}
                                className="flex items-center justify-between gap-2 px-4 py-2 bg-slate-700 rounded-lg text-white font-medium transition-colors w-48 hover:bg-slate-600 disabled:opacity-50"
                            >
                                <span>{selectedAlgo}</span>
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
                                        {Object.keys(ALGORITHMS).map((algo) => (
                                            <button
                                                key={algo}
                                                onClick={() => {
                                                    onSelectAlgo(algo);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors text-slate-200 block"
                                            >
                                                {algo}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Center: Playback Controls */}
                    <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-700/50">
                        <button onClick={handleReset} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Reset to Start">
                            <SkipBack className="w-5 h-5" />
                        </button>
                        <button
                            onClick={isPlaying ? handlePause : handleRun}
                            className={`p-2 rounded text-white transition-colors ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>

                        {/* Manual Stepping */}
                        <div className="w-px h-6 bg-slate-700 mx-1" />

                        <button
                            onClick={() => {
                                setIsPlaying(false);
                                setCurrentStepIndex(c => Math.max(0, c - 1));
                            }}
                            disabled={currentStepIndex <= 0}
                            className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                setIsPlaying(false);
                                if (steps.length <= 1) handleRun();
                                else setCurrentStepIndex(c => Math.min(steps.length - 1, c + 1));
                            }}
                            disabled={currentStepIndex >= steps.length - 1 && steps.length > 1}
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
                                <span>{currentStepIndex}/{Math.max(0, steps.length - 1)}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max={Math.max(1, steps.length - 1)}
                                value={currentStepIndex}
                                onChange={(e) => {
                                    setIsPlaying(false);
                                    setCurrentStepIndex(Number(e.target.value));
                                }}
                                disabled={steps.length <= 1}
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

            {/* Main Visualizer Area */}
            <ResizableSplit
                initialSplit={60}
                left={
                    <div className="flex flex-col gap-4 h-full">
                        {/* Visualizer (Full Width) */}
                        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-hidden flex items-end justify-center p-8 min-h-[300px] shadow-inner relative">
                            <AnimatePresence>
                                {activeStep.array.map((value, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className={`w-8 sm:w-12 rounded-t-lg flex items-end justify-center pb-2 text-xs font-bold text-white shadow-lg transition-colors mx-0.5 ${activeStep.comparing.includes(idx) ? 'bg-amber-500 shadow-amber-500/25' :
                                            activeStep.swapping.includes(idx) ? 'bg-red-500 shadow-red-500/25' :
                                                activeStep.sorted.includes(idx) ? 'bg-emerald-500 shadow-emerald-500/25' :
                                                    'bg-blue-600 shadow-blue-500/25'
                                            }`}
                                        style={{ height: `${value * 3}px` }}
                                    >
                                        {value}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Legend */}
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                <div className="flex flex-wrap gap-4 text-xs text-slate-300 justify-center">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-600"></div> Unsorted</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div> Compare</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"></div> Swap</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500"></div> Sorted</div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                right={
                    <div className="flex flex-col h-full gap-4 p-4">
                        <StepLogger description={activeStep.description} />
                        <div className="flex-1 overflow-hidden min-h-0">
                            {ALGORITHMS[selectedAlgo].code && (
                                <CodeViewer
                                    code={ALGORITHMS[selectedAlgo].code}
                                    highlightLine={activeStep.codeLine}
                                />
                            )}
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default SortingVisualizer;
