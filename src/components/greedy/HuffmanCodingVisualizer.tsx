import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, SkipBack } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { HUFFMAN_CODE, huffmanCoding, type HuffmanStep, type HuffmanNode } from '../../algorithms/greedy/huffmanCoding';


const HuffmanCodingVisualizer = () => {
    const [frames, setFrames] = useState<HuffmanStep[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reset = () => {
        setIsPlaying(false);
        const input = [
            { char: 'a', freq: 5 },
            { char: 'b', freq: 9 },
            { char: 'c', freq: 12 },
            { char: 'd', freq: 13 },
            { char: 'e', freq: 16 },
            { char: 'f', freq: 45 },
        ];
        const generator = huffmanCoding(input);
        const steps: HuffmanStep[] = [];
        for (const step of generator) {
            steps.push(step);
        }
        setFrames(steps);
        setCurrentFrame(0);
    };

    useEffect(() => {
        setTimeout(reset, 0);
    }, []);

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

    const activeFrame = frames[currentFrame] || { queue: [], treeRoot: null, activeNodes: [], description: "Ready", codeLine: undefined };

    // Recursive render for the tree/forest nodes
    // Simplified rendering: Just rendering bubbles in a row (Queue) and if they have children, show connections?
    // Better: Render the forest. Since queue contains roots of trees.

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
                                    <button onClick={reset} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><SkipBack className="w-5 h-5" /></button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className={`p-2 rounded text-white transition-colors ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    </button>
                                    <div className="w-px h-6 bg-slate-700 mx-1" />
                                    <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.max(0, c - 1)); }} disabled={currentFrame === 0} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
                                    <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.min(frames.length - 1, c + 1)); }} disabled={currentFrame === frames.length - 1} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
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

                        {/* Visualization Area */}
                        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex flex-col items-center justify-center p-8 overflow-auto min-h-[400px]">
                            <div className="flex flex-wrap items-end justify-center gap-8 min-h-[200px]">
                                <AnimatePresence>
                                    {activeFrame.queue.map((node) => (
                                        <NodeComponent key={node.id} node={node} activeNodes={activeFrame.activeNodes} />
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="mt-8 text-slate-400 text-sm">Priority Queue (Min-Heap) Visualization</div>
                        </div>
                    </div>
                }
                right={
                    <div className="flex flex-col h-full gap-4 p-4">
                        <StepLogger description={activeFrame.description} />
                        <div className="flex-1 overflow-hidden min-h-0">
                            <CodeViewer code={HUFFMAN_CODE} highlightLine={activeFrame.codeLine} />
                        </div>
                    </div>
                }
            />


        </div>
    );
};

// Recursive Node Component
const NodeComponent = ({ node, activeNodes }: { node: HuffmanNode, activeNodes: string[] }) => {
    const isActive = activeNodes.includes(node.id);

    return (
        <motion.div
            layoutId={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`flex flex-col items-center`}
        >
            <div className={`
                w-12 h-12 rounded-full flex items-center justify-center border-2 
                ${isActive ? 'bg-amber-500 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-slate-800 border-slate-600 text-slate-300'}
                transition-colors duration-300 z-10 relative
            `}>
                <div className="flex flex-col items-center leading-none">
                    <span className="text-xs font-bold">{node.char === '-' ? '' : node.char}</span>
                    <span className="text-xs">{node.freq}</span>
                </div>
            </div>

            {(node.left || node.right) && (
                <div className="flex gap-4 mt-4 relative">
                    {/* SVG Connectors would go here normally, simplified with flex gaps for now */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-4 border-t-2 border-slate-700 pointer-events-none" style={{ width: '100%', top: '-8px' }} />

                    {node.left && (
                        <div className="relative">
                            <NodeComponent node={node.left} activeNodes={activeNodes} />
                            {/* Connector simplified: logic ok for simple tree vis */}
                        </div>
                    )}
                    {node.right && (
                        <div className="relative">
                            <NodeComponent node={node.right} activeNodes={activeNodes} />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default HuffmanCodingVisualizer;
