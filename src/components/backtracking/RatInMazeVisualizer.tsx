
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, SkipBack } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { RAT_MAZE_CODE, ratInMazeSolver, type MazeStep } from '../../algorithms/backtracking/ratInMaze';


const START_MAZE = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0]
];

const RatInMazeVisualizer = () => {
    const [frames, setFrames] = useState<MazeStep[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reset = () => {
        setIsPlaying(false);
        const generator = ratInMazeSolver(START_MAZE);
        const steps: MazeStep[] = [];
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
            const delay = Math.max(50, 800 - (speed * 7));
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
        maze: START_MAZE,
        path: Array(5).fill(0).map(() => Array(5).fill(0)),
        currentX: 0,
        currentY: 0,
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

                        {/* Maze Grid */}
                        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex flex-col items-center justify-center p-8 min-h-[400px]">
                            <div className="grid grid-cols-5 gap-2">
                                {activeFrame.maze.map((row, rIdx) =>
                                    row.map((cell, cIdx) => {
                                        const isWall = cell === 1;
                                        const isPath = activeFrame.path[rIdx][cIdx] === 1;
                                        const isCurrent = rIdx === activeFrame.currentX && cIdx === activeFrame.currentY;

                                        let bgColor = 'bg-slate-700';
                                        if (isWall) bgColor = 'bg-slate-900 border border-slate-600';
                                        else if (isCurrent) bgColor = 'bg-amber-500';
                                        else if (isPath) bgColor = 'bg-emerald-500';
                                        else bgColor = 'bg-slate-800'; // Open path

                                        return (
                                            <motion.div
                                                key={`${rIdx}-${cIdx}`}
                                                layout
                                                className={`
                                                    w-14 h-14 rounded-lg flex items-center justify-center
                                                    ${bgColor}
                                                    transition-colors duration-300
                                                `}
                                            >
                                                {isCurrent && <div className="w-4 h-4 rounded-full bg-white animate-pulse" />}
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="mt-8 flex gap-4 text-sm text-slate-400">
                                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-800 rounded"></div> Open</div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-900 border border-slate-600 rounded"></div> Wall</div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-500 rounded"></div> Path</div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-500 rounded"></div> Rat</div>
                            </div>
                        </div>
                    </div>
                }
                right={
                    <div className="flex flex-col h-full gap-4 p-4">
                        <StepLogger description={activeFrame.description} />
                        <div className="flex-1 overflow-hidden min-h-0">
                            <CodeViewer code={RAT_MAZE_CODE} highlightLine={activeFrame.codeLine} />
                        </div>
                    </div>
                }
            />


        </div>
    );
};

export default RatInMazeVisualizer;

