import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, ArrowUp } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { TWO_POINTERS_CODE } from '../../algorithms/patterns/code';

const TwoPointersVisualizer = () => {
    const [array, setArray] = useState([-5, -2, 0, 1, 3, 4, 6, 8]); // Sorted
    const [target, setTarget] = useState(4);

    // Animation
    const [pointers, setPointers] = useState<{ left: number, right: number } | null>(null);
    const [found, setFound] = useState<boolean>(false);
    const [codeLine, setCodeLine] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState('Ready to find pair with Target Sum.');
    const [isAnimating, setIsAnimating] = useState(false);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const run = async () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setFound(false);
        setPointers(null);

        // Sorting check (visual only logic)
        // arr is already sorted state

        let left = 0;
        let right = array.length - 1;
        setPointers({ left, right });

        setCodeLine(2); // init
        setDescription(`Start: Left at 0 (${array[left]}), Right at ${right} (${array[right]}).`);
        await sleep(1000);

        setCodeLine(5); // while
        while (left < right) {
            setPointers({ left, right });
            const sum = array[left] + array[right];

            setCodeLine(6); // calc sum
            setDescription(`Checking: ${array[left]} + ${array[right]} = ${sum}`);
            await sleep(1000);

            if (sum === target) {
                setCodeLine(9); // found
                setDescription(`Match! ${sum} === ${target}. Pair found at [${left}, ${right}].`);
                setFound(true);
                await sleep(500);
                setIsAnimating(false);
                setCodeLine(undefined);
                return;
            } else if (sum < target) {
                setCodeLine(11); // increment left
                setDescription(`Sum ${sum} < ${target}. Too small, move Left pointer ->`);
                left++;
            } else {
                setCodeLine(13); // decrement right
                setDescription(`Sum ${sum} > ${target}. Too big, move Right pointer <-`);
                right--;
            }
            await sleep(800);
        }

        setDescription('No pair found.');
        setCodeLine(16);
        setIsAnimating(false);
        setCodeLine(undefined);
    };

    const reset = () => {
        if (isAnimating) return;
        // Generate random sorted array
        const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) - 5).sort((a, b) => a - b);
        setArray(newArr);
        setPointers(null);
        setFound(false);
        setDescription("Ready.");
    };

    return (
        <ResizableSplit
            initialSplit={60}
            left={
                <div className="flex flex-col gap-6 p-1 h-full">
                    <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono">Target:</span>
                            <input
                                type="number"
                                value={target}
                                onChange={(e) => setTarget(Number(e.target.value))}
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

                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 p-8 flex flex-col items-center justify-center gap-16 min-h-[300px]">

                        <div className="flex flex-wrap justify-center gap-4 relative">
                            {array.map((val, idx) => {
                                const isLeft = pointers?.left === idx;
                                const isRight = pointers?.right === idx;

                                return (
                                    <div key={idx} className="relative">
                                        {/* Value Box */}
                                        <motion.div
                                            animate={{
                                                scale: (isLeft || isRight) ? 1.1 : 1,
                                                borderColor: found && (isLeft || isRight) ? '#10b981' : ((isLeft || isRight) ? '#3b82f6' : '#334155')
                                            }}
                                            className={`
                                                w-14 h-14 flex items-center justify-center rounded-lg border-2 text-xl font-bold
                                                bg-slate-800 text-slate-200
                                            `}
                                        >
                                            {val}
                                        </motion.div>

                                        {/* Index */}
                                        <div className="absolute -top-6 left-0 w-full text-center text-xs text-slate-600 font-mono">
                                            {idx}
                                        </div>

                                        {/* Pointers */}
                                        <AnimatePresence>
                                            {isLeft && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-blue-400 font-bold text-sm"
                                                >
                                                    <ArrowUp className="w-5 h-5 mb-1" />
                                                    L
                                                </motion.div>
                                            )}
                                            {isRight && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-purple-400 font-bold text-sm"
                                                >
                                                    <ArrowUp className="w-5 h-5 mb-1" />
                                                    R
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                    </div>

                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={description} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer code={TWO_POINTERS_CODE} highlightLine={codeLine} />
                    </div>
                </div>
            }
        />
    );
};

export default TwoPointersVisualizer;
