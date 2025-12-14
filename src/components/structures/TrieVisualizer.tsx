import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Play, Pause, ChevronLeft, ChevronRight, SkipBack, RotateCcw } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { insertTrie, searchTrie, createTrieNode, cloneTrie } from '../../algorithms/structures/trie/algorithm';
import { TRIE_CODE_JAVA } from '../../algorithms/structures/trie/types';
import type { TrieStep, TrieNode } from '../../algorithms/structures/trie/types';

interface NodePos {
    id: string;
    x: number;
    y: number;
    char: string;
    isEndOfWord: boolean;
    parentId: string | null;
}

const TrieVisualizer = () => {
    // Committed state (persistent between animations)
    const [committedRoot, setCommittedRoot] = useState<TrieNode>(createTrieNode());

    // Playback State
    const [frames, setFrames] = useState<TrieStep[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed] = useState(50);
    const [message, setMessage] = useState(''); // For found/not-found status

    const [inputValue, setInputValue] = useState('');
    const [searchVal, setSearchVal] = useState('');

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Determines what to show: Animation frame OR Committed state
    const currentRoot = frames.length > 0 ? frames[currentFrame].root : committedRoot;
    const currentStep = frames.length > 0 ? frames[currentFrame] : null;

    // Helper to generate frames
    const runGenerator = (generator: Generator<TrieStep>, updateRootOnFinish: boolean) => {
        const steps: TrieStep[] = [];
        for (const step of generator) {
            // Snapshot the root because 'insert' mutates it in place
            steps.push({ ...step, root: cloneTrie(step.root) });
        }

        if (steps.length === 0) return;

        setFrames(steps);
        setCurrentFrame(0);
        setIsPlaying(true);
        setMessage('');

        // If this operation modifies the tree, we need to update committedRoot 
        // BUT only after animation or immediately?
        // If we update immediately, scrubbing works.
        // But 'search' doesn't modify. 
        if (updateRootOnFinish) {
            // We can update committedRoot to the final state of the steps immediately,
            // so that if we Clear frames, we revert to this new state.
            setCommittedRoot(steps[steps.length - 1].root);
        }
    };

    const handleInsert = () => {
        if (isPlaying || !inputValue.trim()) return;
        setFrames([]);
        const gen = insertTrie(committedRoot, inputValue.toLowerCase().trim());
        runGenerator(gen, true);
        setInputValue('');
    };

    const handleSearch = () => {
        if (isPlaying || !searchVal.trim()) return;
        setFrames([]);
        const gen = searchTrie(committedRoot, searchVal.toLowerCase().trim());
        runGenerator(gen, false);
    };

    const reset = () => {
        setCommittedRoot(createTrieNode());
        setFrames([]);
        setCurrentFrame(0);
        setMessage('');
        setIsPlaying(false);
    };

    // Auto Playback
    useEffect(() => {
        if (isPlaying && currentFrame < frames.length - 1) {
            const delay = Math.max(50, 1000 - (speed * 9));
            timeoutRef.current = setTimeout(() => {
                setCurrentFrame(prev => prev + 1);
            }, delay);
        } else if (currentFrame >= frames.length - 1) {
            setTimeout(() => {
                setIsPlaying(false);
                const lastStep = frames[frames.length - 1];
                if (lastStep.type === 'found') setMessage(`Found "${searchVal}"!`);
                else if (lastStep.type === 'not-found') setMessage(`"${searchVal}" not found.`);
            }, 0);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isPlaying, currentFrame, frames, speed, searchVal]);


    // Layout Calculation
    const { nodes, edges, width, height } = useMemo(() => {
        const nodeList: NodePos[] = [];
        const edgeList: { source: NodePos, target: NodePos }[] = [];

        let maxX = 0;
        const Y_GAP = 80;
        let currentX = 50;
        let maxDepth = 0;

        const traverse = (node: TrieNode, depth: number, parentId: string | null, char: string): NodePos => {
            maxDepth = Math.max(maxDepth, depth);
            const keys = Object.keys(node.children).sort();
            const childrenPos: NodePos[] = [];

            for (const key of keys) {
                childrenPos.push(traverse(node.children[key], depth + 1, node.id, key));
            }

            let myX = 0;
            if (childrenPos.length === 0) {
                myX = currentX;
                currentX += 60;
            } else {
                const first = childrenPos[0].x;
                const last = childrenPos[childrenPos.length - 1].x;
                myX = (first + last) / 2;
            }

            const pos: NodePos = {
                id: node.id,
                x: myX,
                y: 50 + (depth * Y_GAP),
                char,
                isEndOfWord: node.isEndOfWord,
                parentId
            };

            nodeList.push(pos);

            childrenPos.forEach(child => {
                edgeList.push({ source: pos, target: child });
            });

            maxX = Math.max(maxX, myX);
            return pos;
        };

        if (currentRoot) traverse(currentRoot, 0, null, 'root');

        return {
            nodes: nodeList,
            edges: edgeList,
            width: Math.max(800, maxX + 100),
            height: Math.max(600, (maxDepth * Y_GAP) + 200)
        };
    }, [currentRoot]);

    return (
        <ResizableSplit
            initialSplit={65}
            left={
                <div className="flex flex-col h-full gap-6">
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="word"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                                className="w-24 px-3 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none text-center"
                                disabled={isPlaying}
                            />
                            <button onClick={handleInsert} disabled={isPlaying} className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium disabled:opacity-50 transition-colors">
                                <Plus className="w-4 h-4" /> Insert
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="search"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-24 px-3 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none text-center"
                                disabled={isPlaying}
                            />
                            <button onClick={handleSearch} disabled={isPlaying} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium disabled:opacity-50 transition-colors">
                                <Search className="w-4 h-4" /> Search
                            </button>
                        </div>

                        <div className="w-px h-8 bg-slate-700 hidden md:block" />
                        <button onClick={() => { setIsPlaying(false); setCurrentFrame(0); }} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Restart Op">
                            <SkipBack className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.max(0, c - 1)); }} disabled={currentFrame === 0} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)} disabled={frames.length === 0} className={`p-2 rounded text-white transition-colors ${isPlaying ? 'bg-amber-600' : 'bg-blue-600'}`}>
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { setIsPlaying(false); setCurrentFrame(c => Math.min(frames.length - 1, c + 1)); }} disabled={currentFrame === frames.length - 1} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <div className="flex-1" />
                        <button onClick={reset} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Status Message */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-lg text-center font-bold relative z-10 ${message.includes('Found')
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : 'bg-red-500/20 text-red-400 border border-red-500/50'
                                }`}
                        >
                            {message}
                        </motion.div>
                    )}

                    {/* Canvas */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700 min-h-[400px]">
                        <svg width={width} height={height} className="min-w-full min-h-full">
                            <AnimatePresence>
                                {/* Edges */}
                                {edges.map((edge) => (
                                    <motion.line
                                        key={`edge-${edge.source.id}-${edge.target.id}`}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        x1={edge.source.x}
                                        y1={edge.source.y}
                                        x2={edge.target.x}
                                        y2={edge.target.y}
                                        stroke="#475569"
                                        strokeWidth="2"
                                    />
                                ))}

                                {/* Nodes */}
                                {nodes.map((node) => {
                                    const isActive = currentStep?.activeNodeId === node.id;
                                    const isFound = node.isEndOfWord;

                                    return (
                                        <motion.g
                                            key={node.id}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <circle
                                                r={isFound ? "18" : "15"}
                                                fill={isActive ? "#fbbf24" : (isFound ? "#10b981" : "#3b82f6")}
                                                stroke={isActive ? "#d97706" : (isFound ? "#059669" : "#2563eb")}
                                                strokeWidth={isFound ? "3" : "2"}
                                            />
                                            <text
                                                textAnchor="middle"
                                                dy=".3em"
                                                fill="white"
                                                fontWeight="bold"
                                                className="pointer-events-none select-none text-sm"
                                            >
                                                {node.char === 'root' ? '' : node.char}
                                            </text>
                                        </motion.g>
                                    );
                                })}
                            </AnimatePresence>
                        </svg>
                    </div>

                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={currentStep?.description || "Ready"} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer
                            code={TRIE_CODE_JAVA}
                            highlightLine={currentStep?.codeLine}
                        />
                    </div>
                </div>
            }
        />
    );
};

export default TrieVisualizer;
