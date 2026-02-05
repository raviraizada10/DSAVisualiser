import { useState, useEffect, useRef, useCallback } from 'react';
import { type SearchStep, type SearchAlgorithm, linearSearch, binarySearch, LINEAR_SEARCH_CODE, BINARY_SEARCH_CODE } from '../algorithms/searching/algorithms';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronDown, Search, SkipBack, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import CodeViewer from './CodeViewer';
import StepLogger from './StepLogger';
import ResizableSplit from './ui/ResizableSplit';
import AlgorithmInfoPanel from './AlgorithmInfoPanel';
import { ALGORITHM_DATA } from '../data/algorithms';

interface SearchingVisualizerProps {
    selectedAlgo: string;
    onSelectAlgo: (algo: string) => void;
}

const ALGORITHMS: { [key: string]: { name: string; fn: SearchAlgorithm; sorted?: boolean; code: string } } = {
    'Linear Search': { name: 'Linear Search', fn: linearSearch, code: LINEAR_SEARCH_CODE },
    'Binary Search': { name: 'Binary Search', fn: binarySearch, sorted: true, code: BINARY_SEARCH_CODE },
};

const SearchingVisualizer = ({ selectedAlgo, onSelectAlgo }: SearchingVisualizerProps) => {
    // Data State
    const [array, setArray] = useState<number[]>([]);
    const [target, setTarget] = useState<number>(0);

    // Playback State
    const [steps, setSteps] = useState<SearchStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetPlayer = () => {
        setIsPlaying(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setSteps([]);
        setCurrentStepIndex(0);
    };

    const generateArray = useCallback(() => {
        const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 1);
        if (ALGORITHMS[selectedAlgo].sorted) {
            newArray.sort((a, b) => a - b);
        }
        setArray(newArray);
        const newTarget = newArray[Math.floor(Math.random() * newArray.length)];
        setTarget(newTarget);
        resetPlayer();
    }, [selectedAlgo]);

    useEffect(() => {
        setTimeout(generateArray, 0);
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
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

    // Derived Active Step
    // If steps are empty, create a dummy "Ready" step
    const activeStep: SearchStep | null = steps.length > 0 ? steps[currentStepIndex] : null;

    const runSearch = () => {
        if (steps.length === 0) {
            const algoFn = ALGORITHMS[selectedAlgo].fn;
            // Note: algoFn returns a generator
            const generator = algoFn(array, target);
            const newSteps = Array.from(generator);
            // Prepend a "start" step if appropriate, but the generator usually handles logic.
            // Let's add an initial "Ready" step if needed, or just rely on `activeStep == null` render logic.
            // Actually, let's keep it simple.
            setSteps(newSteps);
            setCurrentStepIndex(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(true);
        }
    };

    const handleReset = () => {
        setIsPlaying(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setCurrentStepIndex(0);
    };


    return (
        <div className="space-y-4">
            {ALGORITHM_DATA[selectedAlgo] && (
                <div className="shrink-0">
                    <AlgorithmInfoPanel data={ALGORITHM_DATA[selectedAlgo]} />
                </div>
            )}
            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 shadow-lg sticky top-20 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={generateArray}
                        disabled={isPlaying}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors disabled:opacity-50"
                        title="New Array"
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
                                            className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors text-slate-200"
                                        >
                                            {algo}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>


                {/* Center Controls */}
                <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-700/50">
                    <button onClick={handleReset} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Reset to Start">
                        <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => isPlaying ? setIsPlaying(false) : runSearch()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isPlaying
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlaying ? 'Pause' : 'Start'}</span>
                    </button>
                    {/* Manual Stepping */}
                    <div className="w-px h-6 bg-slate-700 mx-1" />

                    <button
                        onClick={() => {
                            setIsPlaying(false);
                            setCurrentStepIndex(c => Math.max(0, c - 1));
                        }}
                        disabled={currentStepIndex <= 0 || steps.length === 0}
                        className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            setIsPlaying(false);
                            if (steps.length === 0) runSearch();
                            else setCurrentStepIndex(c => Math.min(steps.length - 1, c + 1));
                        }}
                        disabled={currentStepIndex >= steps.length - 1 && steps.length > 0}
                        className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700">
                        <Search className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Target</span>
                        <input
                            type="number"
                            value={target}
                            onChange={(e) => {
                                setTarget(Number(e.target.value));
                                resetPlayer();
                            }}
                            disabled={isPlaying}
                            className="w-16 bg-transparent outline-none font-mono text-center text-white font-bold"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm font-medium">Speed</span>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Layout: Resizable Split */}
            <ResizableSplit
                initialSplit={65}
                left={
                    <div className="space-y-4 h-full flex flex-col">
                        <div className="flex-1 flex flex-wrap items-center justify-center gap-2 min-h-[400px] p-8 bg-slate-900/50 rounded-2xl border border-slate-800/50 relative overflow-hidden">
                            <AnimatePresence>
                                {array.map((value, idx) => {
                                    let isCurrent = false;
                                    let isFound = false;
                                    let inRange = true;

                                    if (activeStep) {
                                        if (activeStep.type === 'compare') {
                                            isCurrent = activeStep.index === idx;
                                        } else if (activeStep.type === 'found') {
                                            isFound = activeStep.index === idx;
                                            isCurrent = activeStep.index === idx;
                                        } else if (activeStep.type === 'range') {
                                            inRange = idx >= activeStep.start && idx <= activeStep.end;
                                        }
                                    }

                                    // For range persistence in Binary Search
                                    if (selectedAlgo === 'Binary Search' && activeStep) {
                                        for (let i = currentStepIndex; i >= 0; i--) {
                                            const s = steps[i];
                                            if (s.type === 'range') {
                                                inRange = idx >= s.start && idx <= s.end;
                                                break;
                                            }
                                        }
                                    }

                                    let bgColor = "bg-slate-800 text-slate-400 border-slate-700";
                                    let scale = 1;

                                    if (!inRange && selectedAlgo === 'Binary Search') {
                                        bgColor = "bg-slate-900/30 text-slate-700 border-slate-800";
                                        scale = 0.9;
                                    }

                                    if (isFound) {
                                        bgColor = "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
                                        scale = 1.15;
                                    } else if (isCurrent) {
                                        bgColor = "bg-amber-500 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
                                        scale = 1.15;
                                    } else if (inRange) {
                                        bgColor = "bg-slate-700 text-slate-200 border-slate-600";
                                    }

                                    return (
                                        <motion.div
                                            key={idx}
                                            layout
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale, opacity: 1 }}
                                            className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors duration-300 border-2 ${bgColor}`}
                                        >
                                            {value}
                                            {isCurrent && !isFound && (
                                                <motion.div
                                                    layoutId="pointer"
                                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-amber-500"
                                                >
                                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-amber-500 mx-auto" />
                                                    <span className="text-xs font-bold">idx:{idx}</span>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {activeStep?.type === 'not-found' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl z-10"
                                >
                                    <div className="bg-slate-900 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl font-bold text-xl shadow-2xl flex flex-col items-center gap-2">
                                        <Search className="w-8 h-8 opacity-50" />
                                        <span>Target Not Found</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                }
                right={
                    <div className="flex flex-col h-full gap-4 p-4">
                        <StepLogger description={activeStep?.description || "Ready to search..."} />
                        <div className="flex-1 overflow-hidden min-h-0">
                            <CodeViewer code={ALGORITHMS[selectedAlgo].code} highlightLine={activeStep?.codeLine} />
                        </div>
                    </div>
                }
            />


        </div>
    );
};

export default SearchingVisualizer;
