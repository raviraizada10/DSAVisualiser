import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { MERGE_INTERVALS_CODE } from '../../algorithms/patterns/code';

interface IntervalItem {
    id: string;
    start: number;
    end: number;
    merged: boolean;
}

const MergeIntervalsVisualizer = () => {
    // State
    const [intervals, setIntervals] = useState<IntervalItem[]>([
        { id: '1', start: 1, end: 3, merged: false },
        { id: '2', start: 2, end: 6, merged: false },
        { id: '3', start: 8, end: 10, merged: false },
        { id: '4', start: 15, end: 18, merged: false },
    ]);
    const [result, setResult] = useState<IntervalItem[]>([]);

    // Animation
    const [currentIdx, setCurrentIdx] = useState<number | null>(null);
    const [compareIdx, setCompareIdx] = useState<number | null>(null);
    const [description, setDescription] = useState('Ready to merge intervals.');
    const [codeLine, setCodeLine] = useState<number | undefined>(undefined);
    const [isAnimating, setIsAnimating] = useState(false);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const run = async () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setResult([]);
        setCurrentIdx(null);
        setCompareIdx(null);

        // Sort (already sorted in this demo, but logic...)
        setDescription("Sorting intervals by start time...");
        setCodeLine(5);
        const sorted = [...intervals].sort((a, b) => a.start - b.start);
        setIntervals(sorted); // Update visual
        await sleep(1000);

        if (sorted.length === 0) {
            setIsAnimating(false);
            return;
        }

        const res: IntervalItem[] = [{ ...sorted[0], id: `res-${sorted[0].id}` }];
        setResult([...res]);

        setCodeLine(7); // init result
        setDescription(`Start with first interval: [${sorted[0].start}, ${sorted[0].end}]`);
        await sleep(1000);

        setCodeLine(9); // Loop
        for (let i = 1; i < sorted.length; i++) {
            const current = sorted[i];
            setCurrentIdx(i);

            // Highlight last in result
            const lastIdx = res.length - 1;
            const last = res[lastIdx];
            setCompareIdx(lastIdx); // This index refers to Result array now? 
            // Visualizing comparison between 'current' (from input list) and 'last' (from result list)

            setDescription(`Comparing [${current.start}, ${current.end}] with Result's last: [${last.start}, ${last.end}]`);
            setCodeLine(10);
            await sleep(1000);

            // Overlap?
            setCodeLine(14); // check overlap
            if (current.start <= last.end) {
                setDescription(`Overlap detected! ${current.start} <= ${last.end}. Merging...`);
                await sleep(800);

                // Merge
                setCodeLine(16);
                const newEnd = Math.max(last.end, current.end);
                last.end = newEnd;
                // Update result visual
                setResult([...res]);
                setDescription(`Merged. New interval: [${last.start}, ${newEnd}].`);
                await sleep(1000);
            } else {
                setDescription(`No overlap. ${current.start} > ${last.end}. Adding to result.`);
                setCodeLine(19);
                await sleep(800);

                const newResItem = { ...current, id: `res-${current.id}` };
                res.push(newResItem);
                setResult([...res]);
            }
        }

        setDescription("Finished merging intervals.");
        setCurrentIdx(null);
        setCompareIdx(null);
        setCodeLine(undefined);
        setIsAnimating(false);
    };

    const reset = () => {
        if (isAnimating) return;
        // Random intervals
        const count = 5;
        const newIntervals: IntervalItem[] = [];
        for (let i = 0; i < count; i++) {
            // Random jump forward
            // Easier: just make some start < prev end.
            // Let's stick to generating random and sorting.
            const s = Math.floor(Math.random() * 15) + 1;
            const e = s + Math.floor(Math.random() * 5) + 1;
            newIntervals.push({ id: Math.random().toString(), start: s, end: e, merged: false });
        }
        newIntervals.sort((a, b) => a.start - b.start);
        setIntervals(newIntervals);
        setResult([]);
        setDescription("Ready.");
    };

    return (
        <ResizableSplit
            initialSplit={60}
            left={
                <div className="flex flex-col gap-6 p-1 h-full">
                    <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                        <button onClick={run} disabled={isAnimating} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium disabled:opacity-50 transition-colors">
                            <Play size={16} /> Run
                        </button>
                        <button onClick={reset} disabled={isAnimating} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors">
                            <RefreshCw size={16} /> Randomize
                        </button>
                    </div>

                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 p-8 flex flex-col items-center gap-12 min-h-[400px]">

                        {/* Timeline Visualization */}
                        <div className="w-full flex flex-col gap-8">

                            {/* Input Intervals */}
                            <div className="relative h-20 bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                                <div className="absolute -top-3 left-4 text-xs font-mono text-slate-500 bg-slate-900 px-2">Input Intervals</div>
                                <div className="relative w-full h-full flex items-center">
                                    {/* Axis line */}
                                    <div className="absolute w-full h-px bg-slate-700 top-1/2 -translate-y-1/2" />

                                    {intervals.map((int, idx) => {
                                        const scaleX = 25; // px per unit
                                        const isCurrent = idx === currentIdx;

                                        return (
                                            <motion.div
                                                key={int.id}
                                                layout
                                                className={`absolute h-8 rounded-md flex items-center justify-center text-xs font-bold ring-2 ring-offset-2 ring-offset-slate-900
                                                    ${isCurrent ? 'bg-amber-600 ring-amber-500 z-10' : 'bg-blue-600 ring-transparent opacity-60'}
                                                `}
                                                style={{
                                                    left: int.start * scaleX,
                                                    width: (int.end - int.start) * scaleX,
                                                    top: '50%',
                                                    y: '-50%'
                                                }}
                                            >
                                                [{int.start},{int.end}]
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Result Intervals */}
                            <div className="relative h-20 bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                                <div className="absolute -top-3 left-4 text-xs font-mono text-slate-500 bg-slate-900 px-2">Result Intervals</div>
                                <div className="relative w-full h-full flex items-center">
                                    <div className="absolute w-full h-px bg-slate-700 top-1/2 -translate-y-1/2" />

                                    <AnimatePresence>
                                        {result.map((int, idx) => {
                                            const scaleX = 25;
                                            const isCompare = idx === compareIdx;

                                            return (
                                                <motion.div
                                                    key={int.id}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    layout
                                                    className={`absolute h-8 rounded-md flex items-center justify-center text-xs font-bold ring-2 ring-offset-2 ring-offset-slate-900
                                                        ${isCompare ? 'bg-purple-600 ring-purple-500 z-10' : 'bg-emerald-600 ring-transparent'}
                                                    `}
                                                    style={{
                                                        left: int.start * scaleX,
                                                        width: (int.end - int.start) * scaleX,
                                                        top: '50%',
                                                        y: '-50%'
                                                    }}
                                                >
                                                    [{int.start},{int.end}]
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={description} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer code={MERGE_INTERVALS_CODE} highlightLine={codeLine} />
                    </div>
                </div>
            }
        />
    );
};

export default MergeIntervalsVisualizer;
