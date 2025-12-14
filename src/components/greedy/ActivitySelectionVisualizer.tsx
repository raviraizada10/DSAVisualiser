import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, SkipBack } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { ACTIVITY_SELECTION_CODE, activitySelection, type GreedyStep, type Activity } from '../../algorithms/greedy/activitySelection';

const ActivitySelectionVisualizer = () => {
    const [frames, setFrames] = useState<GreedyStep[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const generateActivities = () => {
        const generated: Activity[] = [];
        // Generate random non-overlapping-ish activities to make it interesting
        // We want some overlaps.
        for (let i = 0; i < 8; i++) {
            const start = Math.floor(Math.random() * 20); // 0-20
            const duration = Math.floor(Math.random() * 6) + 2; // 2-8
            generated.push({
                id: i.toString(),
                start,
                end: start + duration,
                isSelected: false,
                isConsidered: false
            });
        }
        // Ensure they are not sorted initially so we see the sort step if we wanted,
        // but the algo sorts them.
        return generated;
    };

    const reset = () => {
        setIsPlaying(false);
        const acts = generateActivities();
        const generator = activitySelection(acts);
        const steps: GreedyStep[] = [];
        for (const step of generator) {
            steps.push(step);
        }
        setFrames(steps);
        setCurrentFrame(0);
    };

    // Initial run
    useEffect(() => {
        setTimeout(reset, 0);
    }, []);

    // Playback
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
    }, [isPlaying, currentFrame, frames.length, speed]);

    const activeFrame = frames[currentFrame] || {
        activities: [],
        currentIdx: -1,
        lastSelectedIdx: null,
        description: "Ready",
        codeLine: undefined
    };

    return (
        <div className="space-y-4">
            <ResizableSplit
                initialSplit={60}
                left={
                    <div className="flex flex-col h-full gap-6 p-1">
                        {/* Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-700/50">
                                    <button onClick={reset} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Reset">
                                        <SkipBack className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className={`p-2 rounded text-white transition-colors ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    </button>
                                    <div className="w-px h-6 bg-slate-700 mx-1" />
                                    <button
                                        onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.max(0, c - 1)); }}
                                        disabled={currentFrame === 0}
                                        className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.min(frames.length - 1, c + 1)); }}
                                        disabled={currentFrame === frames.length - 1}
                                        className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-1 w-32">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Speed</span>
                                        <span>{speed}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={speed}
                                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                                        className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Visualization */}
                        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex flex-col items-center justify-center p-8 min-h-[400px]">
                            {/* Time Axis */}
                            <div className="relative w-full h-[60%] flex items-center">
                                <div className="absolute w-full h-px bg-slate-700 bottom-0 translate-y-4" />
                                {/* Marks */}
                                {Array.from({ length: 26 }).map((_, i) => (
                                    <div key={i} className="absolute flex flex-col items-center gap-1" style={{ left: `${(i / 25) * 100}%`, bottom: '-24px' }}>
                                        <div className="w-px h-2 bg-slate-600" />
                                        <span className="text-[10px] text-slate-500">{i}</span>
                                    </div>
                                ))}

                                {/* Activities */}
                                <AnimatePresence>
                                    {activeFrame.activities.map((act, idx) => {
                                        const isCurrent = idx === activeFrame.currentIdx;
                                        const isSelected = act.isSelected;
                                        const isConsidered = act.isConsidered;
                                        const isLastSelected = idx === activeFrame.lastSelectedIdx;

                                        let bgColor = 'bg-slate-700';
                                        let ringColor = 'ring-transparent';

                                        if (isSelected) bgColor = 'bg-emerald-500';
                                        else if (isConsidered) bgColor = 'bg-amber-500';
                                        else if (isLastSelected) bgColor = 'bg-emerald-500 opacity-60';

                                        if (isCurrent) ringColor = 'ring-amber-400';

                                        // Calculate Position
                                        const leftPct = (act.start / 25) * 100;
                                        const widthPct = ((act.end - act.start) / 25) * 100;

                                        // Stagger vertically based on index to avoid overlap mess visually,
                                        // sorted by end time naturally puts them in a cascade.
                                        // Let's use a fixed height and stack them slightly or just put them on one line?
                                        // One line is hard if they overlap.
                                        // Use 'row' assignment.
                                        // Simple row: index % 5
                                        const row = idx % 5;
                                        const topPct = 10 + (row * 15);

                                        return (
                                            <motion.div
                                                key={act.id}
                                                layout
                                                className={`
                                                absolute h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white
                                                ${bgColor} ring-2 ${ringColor} shadow-lg
                                            `}
                                                style={{
                                                    left: `${leftPct}%`,
                                                    width: `${widthPct}%`,
                                                    top: `${topPct}%`
                                                }}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                            >
                                                {act.start}-{act.end}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                }
                right={
                    <div className="flex flex-col h-full gap-4 p-4">
                        <StepLogger description={activeFrame.description} />
                        <div className="flex-1 overflow-hidden min-h-0">
                            <CodeViewer code={ACTIVITY_SELECTION_CODE} highlightLine={activeFrame.codeLine} />
                        </div>
                    </div>
                }
            />


        </div>
    );
};

export default ActivitySelectionVisualizer;
