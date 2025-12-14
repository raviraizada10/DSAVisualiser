import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { QUEUE_CODE } from '../../algorithms/structures/queue/code';

const QueueVisualizer = () => {
    const [queue, setQueue] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState(0);
    const [highlight, setHighlight] = useState<number | null>(null); // Index to highlight
    const [codeLine, setCodeLine] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState("Ready to use Queue operations.");
    const [isAnimating, setIsAnimating] = useState(false);

    const CAPACITY = 8;
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const enqueue = async () => {
        if (isAnimating) return;
        setIsAnimating(true);
        const val = inputValue;

        // Step 1: Check Full
        setCodeLine(16);
        setDescription("Checking if queue is full (size == capacity)...");
        await sleep(800);

        if (queue.length >= CAPACITY) {
            setDescription("Queue is full! Cannot enqueue.");
            await sleep(1000);
            setCodeLine(undefined);
            setIsAnimating(false);
            return;
        }

        // Step 2: Update Rear & Assign
        setCodeLine(21); // rear = (rear + 1) % capacity
        setDescription(`Calculating proper rear index...`);
        await sleep(600);

        setCodeLine(22); // array[rear] = item
        setDescription(`Inserting ${val} at the rear.`);
        setQueue(prev => [...prev, val]);
        setHighlight(queue.length);
        setInputValue(Math.floor(Math.random() * 100));
        await sleep(800);

        // Step 3: Inc Size
        setCodeLine(23);
        setDescription("Incrementing size.");
        setHighlight(null);
        await sleep(600);

        setCodeLine(undefined);
        setDescription(`Enqueued ${val} successfully.`);
        setIsAnimating(false);
    };

    const dequeue = async () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Step 1: Check Empty
        setCodeLine(27);
        setDescription("Checking if queue is empty...");
        await sleep(800);

        if (queue.length === 0) {
            setDescription("Queue is empty! Cannot dequeue.");
            await sleep(1000);
            setCodeLine(undefined);
            setIsAnimating(false);
            return;
        }

        // Step 2: Get Item
        setCodeLine(31);
        setDescription(`Retrieving item at front: ${queue[0]}`);
        setHighlight(0);
        await sleep(800);

        // Step 3: Shift Front
        setCodeLine(32); // front = (front + 1) % capacity
        setDescription("Updating front pointer (conceptually shifting items in visualizer).");
        await sleep(800);

        setQueue(prev => prev.slice(1));
        setHighlight(null);

        // Step 4: Dec Size
        setCodeLine(33);
        setDescription("Decrementing size.");
        await sleep(600);

        setCodeLine(undefined);
        setDescription("Dequeued element successfully.");
        setIsAnimating(false);
    };

    const peek = async () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Step 1: Check empty
        setCodeLine(37);
        setDescription("Checking if queue is empty...");
        await sleep(800);

        if (queue.length === 0) {
            setDescription("Queue is empty. Returning -1.");
            await sleep(1000);
            setCodeLine(undefined);
            setIsAnimating(false);
            return;
        }

        // Step 2: Return front
        setCodeLine(38);
        setDescription(`Peeking at front element: ${queue[0]}`);
        setHighlight(0);
        await sleep(1000);

        setHighlight(null);
        setCodeLine(undefined);
        setIsAnimating(false);
    };

    const reset = () => {
        setQueue([]);
        setHighlight(null);
        setCodeLine(undefined);
        setDescription("Queue reset.");
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
                                onClick={enqueue}
                                disabled={isAnimating || queue.length >= CAPACITY}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium"
                            >
                                <Plus size={18} />
                                Enqueue
                            </button>
                        </div>
                        <div className="w-px h-8 bg-slate-700 hidden md:block" />
                        <button
                            onClick={dequeue}
                            disabled={isAnimating || queue.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium"
                        >
                            <Minus size={18} />
                            Dequeue
                        </button>
                        <button
                            onClick={peek}
                            disabled={isAnimating || queue.length === 0}
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
                            title="Reset Queue"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>

                    {/* Visualization Area */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex flex-col items-center justify-center relative min-h-[400px]">

                        <div className="relative p-12">
                            {/* Queue Visual */}
                            <div className="flex items-center gap-4 h-28 px-8 rounded-2xl bg-slate-800/30 border border-slate-700 shadow-xl backdrop-blur-sm relative overflow-hidden min-w-[300px] justify-center">
                                {/* Indicators */}
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 -rotate-90">FRONT</div>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 -rotate-90">REAR</div>

                                <AnimatePresence mode="popLayout">
                                    {queue.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-slate-500 italic font-medium"
                                        >
                                            Empty Queue
                                        </motion.div>
                                    )}
                                    {queue.map((val, idx) => (
                                        <motion.div
                                            key={`${idx}-${val}`}
                                            layout
                                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                scale: 1,
                                                backgroundColor: highlight === idx ? '#f59e0b' : '#10b981',
                                                borderColor: highlight === idx ? '#d97706' : '#059669'
                                            }}
                                            exit={{ opacity: 0, x: -50, scale: 0.5, transition: { duration: 0.2 } }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className="min-w-[50px] h-[50px] flex items-center justify-center rounded-xl font-bold text-white shadow-lg border-2 text-lg z-10"
                                        >
                                            {val}
                                            {idx === 0 && queue.length > 0 && (
                                                <motion.div layoutId="front-arrow" className="absolute -bottom-8 text-emerald-500 text-xs font-bold flex flex-col items-center">
                                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-emerald-500" />
                                                    HEAD
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
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
                            code={QUEUE_CODE}
                            highlightLine={codeLine}
                        />
                    </div>
                </div>
            }
        />
    );
};

export default QueueVisualizer;
