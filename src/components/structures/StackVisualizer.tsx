import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { STACK_CODE } from '../../algorithms/structures/stack/code';

const StackVisualizer = () => {
    const [stack, setStack] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState(0);
    const [highlight, setHighlight] = useState<number | null>(null);
    const [codeLine, setCodeLine] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState("Ready to use Stack operations.");
    const [isAnimating, setIsAnimating] = useState(false);

    const CAPACITY = 8;

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const push = async () => {
        if (isAnimating) return;
        setIsAnimating(true);
        const val = inputValue;

        // Step 1: Check Overflow
        setCodeLine(8);
        setDescription("Checking for Stack Overflow (top == capacity - 1)...");
        await sleep(800);

        if (stack.length >= CAPACITY) {
            setDescription("Stack Overflow! Cannot push new element.");
            await sleep(1000);
            setCodeLine(undefined);
            setIsAnimating(false);
            return;
        }

        // Step 2: Increment Top & Assign
        setCodeLine(12);
        setDescription(`Incrementing top and assigning store[${stack.length}] = ${val}`);
        setStack(prev => [...prev, val]);
        setHighlight(stack.length);
        setInputValue(Math.floor(Math.random() * 100)); // Prep next random
        await sleep(800);

        setHighlight(null);
        setCodeLine(undefined);
        setDescription(`Pushed ${val} onto the stack.`);
        setIsAnimating(false);
    };

    const pop = async () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Step 1: Check Underflow
        setCodeLine(16);
        setDescription("Checking for Stack Underflow (top == -1)...");
        await sleep(800);

        if (stack.length === 0) {
            setDescription("Stack Underflow! Stack is empty.");
            await sleep(1000);
            setCodeLine(undefined);
            setIsAnimating(false);
            return;
        }

        // Step 2: Return & Decrement
        setCodeLine(20);
        setDescription(`Returning store[${stack.length - 1}] and decrementing top.`);
        setHighlight(stack.length - 1);
        await sleep(800);

        setStack(prev => prev.slice(0, -1));
        setHighlight(null);
        setCodeLine(undefined);
        setDescription("Popped element from stack.");
        setIsAnimating(false);
    };

    const peek = async () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Step 1: Check empty
        setCodeLine(24);
        setDescription("Checking if stack is empty...");
        await sleep(800);

        if (stack.length === 0) {
            setDescription("Stack is empty. Returning -1.");
            await sleep(1000);
            setCodeLine(undefined);
            setIsAnimating(false);
            return;
        }

        // Step 2: Return top
        setCodeLine(27);
        setDescription(`Peeking at top element: ${stack[stack.length - 1]}`);
        setHighlight(stack.length - 1);
        await sleep(1000);

        setHighlight(null);
        setCodeLine(undefined);
        setIsAnimating(false);
    };

    const reset = () => {
        setStack([]);
        setHighlight(null);
        setCodeLine(undefined);
        setDescription("Stack reset.");
    };

    return (
        <ResizableSplit
            initialSplit={60}
            left={
                <div className="flex flex-col h-full gap-6">
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(Number(e.target.value))}
                                className="w-20 px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 outline-none text-center text-white font-mono"
                                disabled={isAnimating}
                            />
                            <button
                                onClick={push}
                                disabled={isAnimating || stack.length >= CAPACITY}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium"
                            >
                                <Plus size={18} />
                                Push
                            </button>
                        </div>
                        <div className="w-px h-8 bg-slate-700 hidden md:block" />
                        <button
                            onClick={pop}
                            disabled={isAnimating || stack.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium"
                        >
                            <Minus size={18} />
                            Pop
                        </button>
                        <button
                            onClick={peek}
                            disabled={isAnimating || stack.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium"
                        >
                            <Eye size={18} />
                            Peek
                        </button>
                        <div className="w-px h-8 bg-slate-700 hidden md:block" />
                        <button
                            onClick={reset}
                            disabled={isAnimating}
                            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                            title="Reset Stack"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>

                    {/* Visualization Area */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex flex-col items-center justify-end pb-12 relative min-h-[400px]">

                        {/* Stack Container Visual */}
                        <div className="relative">
                            <div className="w-48 min-h-[300px] border-l-4 border-r-4 border-b-4 border-slate-700 rounded-b-xl flex flex-col-reverse justify-start items-center p-2 gap-2 bg-slate-800/20 backdrop-blur-sm">
                                <AnimatePresence mode="popLayout">
                                    {stack.map((val, idx) => (
                                        <motion.div
                                            key={`${idx}-${val}`}
                                            layout
                                            initial={{ opacity: 0, y: -100, scale: 0.5 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                                backgroundColor: highlight === idx ? '#f59e0b' : '#3b82f6',
                                                borderColor: highlight === idx ? '#d97706' : '#2563eb'
                                            }}
                                            exit={{ opacity: 0, y: -20, scale: 0.5, transition: { duration: 0.2 } }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className="w-40 h-14 flex items-center justify-center rounded-lg font-bold text-white shadow-lg border-2 text-xl z-10"
                                        >
                                            {val}
                                            {idx === stack.length - 1 && (
                                                <motion.span
                                                    layoutId="top-label"
                                                    className="absolute -right-12 text-xs font-mono text-slate-400 flex items-center gap-1"
                                                >
                                                    ← TOP
                                                </motion.span>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {stack.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-medium italic">
                                        Empty Stack
                                    </div>
                                )}
                            </div>
                            {/* Capacity Indicator */}
                            <div className="absolute top-0 -right-8 h-full flex flex-col justify-between py-2">
                                <span className="text-[10px] text-slate-600 font-mono">CAP:{CAPACITY}</span>
                                <span className="text-[10px] text-slate-600 font-mono">0</span>
                            </div>
                        </div>
                    </div>

                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={description} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer
                            code={STACK_CODE}
                            highlightLine={codeLine}
                        />
                    </div>
                </div>
            }
        />
    );
};

export default StackVisualizer;
