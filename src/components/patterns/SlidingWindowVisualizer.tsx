import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { SLIDING_WINDOW_CODE } from '../../algorithms/patterns/code';

const SlidingWindowVisualizer = () => {
    // State
    const [array, setArray] = useState([2, 1, 5, 1, 3, 2, 9, 7]);
    const [k, setK] = useState(3);
    const [maxValue, setMaxValue] = useState<number | null>(null);
    const [windowIndices, setWindowIndices] = useState<number[]>([]);
    const [currSum, setCurrSum] = useState<number>(0);
    const [codeLine, setCodeLine] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState('Ready to find Max Sum Subarray.');
    const [isAnimating, setIsAnimating] = useState(false);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const run = async () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setMaxValue(0); // Reset
        setCurrSum(0);

        const n = array.length;
        if (n < k) {
            setDescription("Array length must be >= K");
            setIsAnimating(false);
            return;
        }

        setDescription(`Step 1: Calculate sum of first ${k} elements.`);
        setCodeLine(7); // First loop

        let sum = 0;
        const indices = [];
        for (let i = 0; i < k; i++) {
            setWindowIndices([...indices, i]); // Animate building window
            indices.push(i);
            sum += array[i];
            setCurrSum(sum);
            await sleep(600);
        }

        let max = sum;
        setMaxValue(max);
        setWindowIndices(indices);
        setDescription(`Initial Window Sum: ${sum}. Max is now ${max}.`);
        setCodeLine(10);
        await sleep(1000);

        // Slide
        setCodeLine(14); // loop
        for (let i = k; i < n; i++) {
            const entering = array[i];
            const leaving = array[i - k];

            setDescription(`Sliding... Add ${entering}, Remove ${leaving}.`);
            // Highlight shift?

            await sleep(800);

            sum = sum + entering - leaving;
            setCurrSum(sum);
            setCodeLine(15); // windowSum calc

            // Update indices
            const newIndices = Array.from({ length: k }, (_, idx) => i - k + 1 + idx);
            setWindowIndices(newIndices);
            await sleep(800);

            if (sum > max) {
                setDescription(`New Sum ${sum} > Max ${max}. Updating Max.`);
                max = sum;
                setMaxValue(max);
                setCodeLine(16); // max update
                await sleep(800);
            } else {
                setDescription(`Sum ${sum} <= Max ${max}. No change.`);
                await sleep(800);
            }
        }

        setDescription(`Finished! Max Sum is ${max}.`);
        setCodeLine(undefined);
        setIsAnimating(false);
    };

    const reset = () => {
        if (isAnimating) return;
        setArray(Array.from({ length: 8 }, () => Math.floor(Math.random() * 10) + 1));
        setWindowIndices([]);
        setMaxValue(null);
        setCurrSum(0);
        setDescription("Ready.");
    };

    return (
        <ResizableSplit
            initialSplit={60}
            left={
                <div className="flex flex-col gap-6 p-1 h-full">
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono">K:</span>
                            <input
                                type="number"
                                min="2" max="5"
                                value={k}
                                onChange={(e) => setK(Number(e.target.value))}
                                className="w-16 bg-slate-700 text-white text-center rounded border border-slate-600 outline-none"
                                disabled={isAnimating}
                            />
                        </div>
                        <button onClick={run} disabled={isAnimating} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium disabled:opacity-50 transition-colors">
                            <Play size={16} /> Run
                        </button>
                        <button onClick={reset} disabled={isAnimating} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                            <RefreshCw size={16} /> Randomize
                        </button>
                    </div>

                    {/* Visualization */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 p-8 flex flex-col items-center justify-center gap-12 min-h-[300px]">

                        {/* Values Monitor */}
                        <div className="flex gap-12">
                            <div className="text-center">
                                <div className="text-sm text-slate-500 mb-1">Window Sum</div>
                                <div className="text-3xl font-bold font-mono text-emerald-400">{currSum}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-slate-500 mb-1">Max Sum</div>
                                <div className="text-3xl font-bold font-mono text-purple-400">{maxValue ?? '-'}</div>
                            </div>
                        </div>

                        {/* Array */}
                        <div className="flex flex-wrap justify-center gap-2 relative">
                            {/* Window Box Overlay */}
                            {windowIndices.length > 0 && (
                                <motion.div
                                    layoutId="window-box"
                                    className="absolute -inset-2 border-2 border-emerald-500 rounded-xl bg-emerald-500/10 pointer-events-none z-0"
                                    // Calculate position dynamically? Hard with flex.
                                    // Actually, let's just highlight the boxes themselves for simplicity and robustness
                                    // Or use a container for the items involved?
                                    // Let's stick to highlighting individual cells for now, simpler than generic bounding box in flex
                                    style={{ display: 'none' }} // Disabled approach
                                />
                            )}

                            {array.map((val, idx) => {
                                const inWindow = windowIndices.includes(idx);
                                return (
                                    <motion.div
                                        key={idx}
                                        layout
                                        className={`
                                            w-14 h-14 flex items-center justify-center rounded-lg border-2 text-xl font-bold
                                            transition-colors duration-300 relative
                                            ${inWindow
                                                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 scale-110 z-10 shadow-lg shadow-emerald-900/20'
                                                : 'bg-slate-800 border-slate-700 text-slate-400'
                                            }
                                        `}
                                    >
                                        {val}
                                        {/* Index */}
                                        <span className="absolute -bottom-6 text-xs text-slate-600 font-mono">{idx}</span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Window Bracket (Visual decoration) */}
                        {windowIndices.length > 0 && (
                            <motion.div
                                className="h-4 border-b-2 border-l-2 border-r-2 border-emerald-500/50 rounded-b-lg mt-2"
                                animate={{
                                    width: `${k * 64 - 8}px`, // Approx width: item(56)+gap(8) * K
                                    x: (windowIndices[0] - (array.length - 1) / 2) * 64 // Rough centering math, maybe flaky if wrapped
                                    // Better to not do absolute math if possible.
                                }}
                                style={{ display: 'none' }} // Revisit if time.
                            />
                        )}

                    </div>

                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={description} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer code={SLIDING_WINDOW_CODE} highlightLine={codeLine} />
                    </div>
                </div>
            }
        />
    );
};

export default SlidingWindowVisualizer;
