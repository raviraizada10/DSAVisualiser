
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, SkipBack } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { SUDOKU_CODE, sudokuSolver, type SudokuStep } from '../../algorithms/backtracking/sudoku';

const INITIAL_BOARD = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const SudokuVisualizer = () => {
    const [frames, setFrames] = useState<SudokuStep[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(80); // 1-100
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reset = () => {
        setIsPlaying(false);
        const generator = sudokuSolver(INITIAL_BOARD);
        const steps: SudokuStep[] = [];
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
            const delay = Math.max(10, 500 - (speed * 4.5)); // Faster speed range
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
        board: INITIAL_BOARD,
        currentRow: -1,
        currentCol: -1,
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

                        {/* Board */}
                        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex flex-col items-center justify-center p-8 min-h-[400px]">
                            <div className="grid grid-cols-9 gap-0.5 bg-slate-600 border-2 border-slate-600">
                                {activeFrame.board.map((row, rIdx) =>
                                    row.map((cell, cIdx) => {
                                        const isCurrent = rIdx === activeFrame.currentRow && cIdx === activeFrame.currentCol;
                                        const isInitial = INITIAL_BOARD[rIdx][cIdx] !== 0;

                                        // Border styling for 3x3 grids
                                        const borderRight = (cIdx + 1) % 3 === 0 && cIdx !== 8 ? 'border-r-2 border-r-slate-500' : '';
                                        const borderBottom = (rIdx + 1) % 3 === 0 && rIdx !== 8 ? 'border-b-2 border-b-slate-500' : '';

                                        return (
                                            <div
                                                key={`${rIdx}-${cIdx}`}
                                                className={`
                                                w-10 h-10 flex items-center justify-center text-lg font-bold
                                                ${isInitial ? 'bg-slate-800 text-slate-300' : 'bg-slate-900 text-white'}
                                                ${isCurrent ? 'bg-amber-500/30 ring-2 ring-inset ring-amber-500' : ''}
                                                ${borderRight} ${borderBottom}
                                            `}
                                            >
                                                {cell !== 0 ? cell : ''}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                }
                right={
                    <div className="flex flex-col h-full gap-4 p-4">
                        <StepLogger description={activeFrame.description} />
                        <div className="flex-1 overflow-hidden min-h-0">
                            <CodeViewer code={SUDOKU_CODE} highlightLine={activeFrame.codeLine} />
                        </div>
                    </div>
                }
            />


        </div>
    );
};

export default SudokuVisualizer;
