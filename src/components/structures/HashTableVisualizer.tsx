import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, RefreshCw, ArrowRight } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { HASHTABLE_CODE } from '../../algorithms/structures/hashTable/code';

interface HashNode {
    key: number;
    value: number; // For visualization, we might just use key as value or generic val
    id: string;
}

const CONSTANT_CAPACITY = 7;

const HashTableVisualizer = () => {
    // State
    const [buckets, setBuckets] = useState<HashNode[][]>(Array(CONSTANT_CAPACITY).fill([]));
    const [inputValue, setInputValue] = useState<number>(0);

    // Animation
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
    const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null);
    const [foundNodeId, setFoundNodeId] = useState<string | null>(null);
    const [codeLine, setCodeLine] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState('Ready to use Hash Table.');
    const [isAnimating, setIsAnimating] = useState(false);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const hash = (key: number) => Math.abs(key) % CONSTANT_CAPACITY;

    const insert = async () => {
        if (!inputValue || isAnimating) return;
        setIsAnimating(true);
        setHighlightIndex(null);
        setHighlightNodeId(null);
        setFoundNodeId(null);

        const key = inputValue;
        setCodeLine(21); // put method
        setDescription(`Inserting key ${key}...`);
        await sleep(500);

        const index = hash(key);
        setCodeLine(22); // hash
        setDescription(`Hash(${key}) = ${key} % ${CONSTANT_CAPACITY} = ${index}`);
        setHighlightIndex(index);
        await sleep(800);

        const bucket = buckets[index];
        setCodeLine(23); // head = buckets[index]
        await sleep(500);

        // Scan for update
        let found = false;
        setCodeLine(26); // while head != null
        for (const node of bucket) {
            setHighlightNodeId(node.id);
            await sleep(400);
            if (node.key === key) {
                setCodeLine(27); // if head.key == key
                setDescription(`Key ${key} found! Updating value.`);
                await sleep(500);
                found = true;
                break;
            }
        }
        setHighlightNodeId(null);

        if (found) {
            // In a real map we'd update value, here we just show "Updated"
            setDescription(`Key ${key} already exists.`);
            setIsAnimating(false);
            setCodeLine(undefined);
            setHighlightIndex(null);
            return;
        }

        // Insert at head
        setCodeLine(35); // New Node
        setDescription(`Inserting ${key} at beginning of chain ${index}.`);
        await sleep(500);

        const newNode: HashNode = { key: key, value: key, id: Math.random().toString() };

        setBuckets(prev => {
            const newBuckets = [...prev];
            newBuckets[index] = [newNode, ...newBuckets[index]];
            return newBuckets;
        });

        setCodeLine(37); // buckets[index] = newNode
        await sleep(500);

        setDescription(`Inserted ${key} at index ${index}.`);
        setInputValue(Math.floor(Math.random() * 100));
        setHighlightIndex(null);
        setCodeLine(undefined);
        setIsAnimating(false);
    };

    const search = async () => {
        if (!inputValue || isAnimating) return;
        setIsAnimating(true);
        setHighlightIndex(null);
        setHighlightNodeId(null);
        setFoundNodeId(null);

        const key = inputValue;
        setCodeLine(40); // get
        setDescription(`Searching for key ${key}...`);
        await sleep(500);

        const index = hash(key);
        setCodeLine(41); // index = hash
        setDescription(`Checking bucket ${index}...`);
        setHighlightIndex(index);
        await sleep(800);

        const bucket = buckets[index];
        let found = false;

        setCodeLine(43); // while loop
        for (const node of bucket) {
            setHighlightNodeId(node.id);
            await sleep(500);
            if (node.key === key) {
                setFoundNodeId(node.id);
                setCodeLine(44); // return val
                setDescription(`Found key ${key}!`);
                await sleep(1000);
                found = true;
                break;
            }
        }

        if (!found) {
            setCodeLine(47); // return -1
            setDescription(`Key ${key} not found in bucket ${index}.`);
        }

        setIsAnimating(false);
        setCodeLine(undefined);
        setHighlightIndex(null);
        setHighlightNodeId(null);
        // keep foundHighlighted for a bit? No, clear it on next run
    };

    const clear = () => {
        setBuckets(Array(CONSTANT_CAPACITY).fill([]));
        setHighlightIndex(null);
        setHighlightNodeId(null);
        setFoundNodeId(null);
        setDescription('Table cleared.');
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
                                placeholder="Key"
                            />
                            <button onClick={insert} disabled={isAnimating} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg disabled:opacity-50 text-white text-sm font-medium transition-colors">
                                <Plus size={16} /> Put
                            </button>
                            <button onClick={search} disabled={isAnimating} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 text-white text-sm font-medium transition-colors">
                                <Search size={16} /> Get
                            </button>
                        </div>
                        <div className="flex-1" />
                        <button onClick={clear} disabled={isAnimating} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-50 text-slate-300 hover:text-white text-sm transition-colors">
                            <RefreshCw size={16} /> Clear
                        </button>
                    </div>

                    {/* Visualization Area */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6 overflow-auto min-h-[400px]">
                        <div className="flex flex-col gap-4">
                            {buckets.map((bucket, bIdx) => (
                                <div key={bIdx} className="flex items-center gap-2 group">
                                    {/* Bucket Index */}
                                    <div className={`
                                        w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono text-sm font-bold
                                        transition-colors duration-300
                                        ${highlightIndex === bIdx ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-500'}
                                    `}>
                                        {bIdx}
                                    </div>

                                    {/* Chain */}
                                    <AnimatePresence>
                                        {bucket.map((node) => (
                                            <motion.div
                                                key={node.id}
                                                initial={{ scale: 0, x: -20 }}
                                                animate={{ scale: 1, x: 0 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <ArrowRight className="w-4 h-4 text-slate-600" />
                                                <div className={`
                                                    min-w-[50px] h-10 px-3 flex items-center justify-center rounded border
                                                    text-sm font-semibold shadow-lg transition-colors duration-300
                                                    ${node.id === foundNodeId
                                                        ? 'bg-emerald-600 border-emerald-500 text-white'
                                                        : node.id === highlightNodeId
                                                            ? 'bg-amber-600 border-amber-500 text-white'
                                                            : 'bg-slate-700 border-slate-600 text-slate-200'
                                                    }
                                                `}>
                                                    {node.key}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {bucket.length === 0 && (
                                        <div className="text-slate-700 text-sm italic ml-2">null</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={description} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer
                            code={HASHTABLE_CODE}
                            highlightLine={codeLine}
                        />
                    </div>
                </div>
            }
        />
    );
};

export default HashTableVisualizer;
