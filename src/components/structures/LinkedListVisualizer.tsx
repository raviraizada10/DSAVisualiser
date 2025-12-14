import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Trash2, RotateCcw } from 'lucide-react'; // Added icons
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { LINKED_LIST_CODE } from '../../algorithms/structures/linkedlist/code';

interface ListNode {
    id: string;
    value: number;
    highlight?: boolean;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const LinkedListVisualizer = () => {
    const [list, setList] = useState<ListNode[]>([]);
    const [inputValue, setInputValue] = useState(0);
    const [currentLine, setCurrentLine] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState("Ready to operations.");
    const [isAnimating, setIsAnimating] = useState(false);

    // Operation: Add First (Head)
    const insertHead = async () => {
        if (list.length >= 7) {
            setDescription("List is full (max 7 nodes).");
            return;
        }
        setIsAnimating(true);
        const newNode: ListNode = { id: Math.random().toString(36).substr(2, 9), value: inputValue };

        setDescription(`Creating new node with value ${inputValue} `);
        setCurrentLine(12); // Node newNode = new Node(val);
        await sleep(600);

        if (list.length === 0) {
            setDescription("List is empty. New node becomes Head and Tail.");
            setCurrentLine(14); // head = tail = newNode;
            setList([newNode]);
            await sleep(600);
        } else {
            setDescription("Setting new node's next to current Head.");
            setCurrentLine(16); // newNode.next = head;
            await sleep(600);

            setDescription("Updating Head to new node.");
            setCurrentLine(17); // head = newNode;
            setList([newNode, ...list]);
            await sleep(600);
        }

        setDescription("Incremented size.");
        setCurrentLine(19);
        setInputValue(Math.floor(Math.random() * 100));
        await sleep(400);

        setDescription("Ready.");
        setCurrentLine(undefined);
        setIsAnimating(false);
    };

    // Operation: Add Last (Tail)
    const insertTail = async () => {
        if (list.length >= 7) {
            setDescription("List is full (max 7 nodes).");
            return;
        }
        setIsAnimating(true);
        const newNode: ListNode = { id: Math.random().toString(36).substr(2, 9), value: inputValue };

        setDescription(`Creating new node with value ${inputValue} `);
        setCurrentLine(22); // Node newNode = new Node(val);
        await sleep(600);

        if (list.length === 0) {
            setDescription("List is empty. New node becomes Head and Tail.");
            setCurrentLine(24); // head = tail = newNode;
            setList([newNode]);
            await sleep(600);
        } else {
            setDescription("Setting current Tail's next to new node.");
            setCurrentLine(26); // tail.next = newNode;
            // Temporarily show usage of tail? Visualizer inherently shows it.
            await sleep(600);

            setDescription("Updating Tail to new node.");
            setCurrentLine(27); // tail = newNode;
            setList([...list, newNode]);
            await sleep(600);
        }

        setDescription("Incremented size.");
        setCurrentLine(29);
        setInputValue(Math.floor(Math.random() * 100));
        await sleep(400);

        setDescription("Ready.");
        setCurrentLine(undefined);
        setIsAnimating(false);
    };

    // Operation: Remove First (Head)
    const removeHead = async () => {
        if (list.length === 0) {
            setDescription("Cannot remove from empty list.");
            setCurrentLine(33);
            await sleep(500);
            setCurrentLine(undefined);
            return;
        }
        setIsAnimating(true);

        setDescription("Checking if head exists.");
        setCurrentLine(33);
        await sleep(500);

        const val = list[0].value;
        setDescription(`Retrieving data from Head(${val}).`);
        setCurrentLine(34); // T val = head.data;
        await sleep(600);

        setDescription("Moving Head to next node.");
        setCurrentLine(35); // head = head.next;

        // Visual removal
        const newList = list.slice(1);
        setList(newList);
        await sleep(600);

        if (newList.length === 0) {
            setDescription("List became empty, update Tail to null.");
            setCurrentLine(36);
            await sleep(500);
        }

        setDescription(`Decremented size.Returned ${val}.`);
        setCurrentLine(37);
        await sleep(500);

        setDescription("Ready.");
        setCurrentLine(undefined);
        setIsAnimating(false);
    };

    // Operation: Remove Last (Tail)
    const removeTail = async () => {
        if (list.length === 0) {
            setDescription("Cannot remove from empty list.");
            setCurrentLine(42);
            await sleep(500);
            setCurrentLine(undefined);
            return;
        }
        setIsAnimating(true);

        setDescription("Checking if head exists.");
        setCurrentLine(42);
        await sleep(500);

        if (list.length === 1) {
            setDescription("Only one node. Head and Tail become null.");
            setCurrentLine(43); // if (head == tail)
            await sleep(500);

            setList([]);
            setCurrentLine(45); // head = tail = null;
            await sleep(500);
        } else {
            setDescription("Initializing traversal to find second to last node.");
            setCurrentLine(49); // Node current = head;

            // Traversal Animation
            for (let i = 0; i < list.length - 1; i++) {
                setDescription(`Traversing... current at index ${i} `);
                setCurrentLine(50); // while (current.next != tail)

                // Highlight current
                setList(prev => prev.map((n, idx) => ({ ...n, highlight: idx === i })));
                await sleep(400);

                setCurrentLine(51); // current = current.next;
                // move highlight
                setList(prev => prev.map((n, idx) => ({ ...n, highlight: idx === i + 1 }))); // simplistic
                await sleep(400);
            }

            // Remove highlight
            setList(prev => prev.map(n => ({ ...n, highlight: false })));

            setDescription("Found second to last node. Updating Tail.");
            setCurrentLine(55); // tail = current;
            await sleep(500);

            setList(list.slice(0, -1));

            setDescription("Setting new Tail's next to null.");
            setCurrentLine(56); // tail.next = null;
            await sleep(500);
        }

        setDescription("Decremented size.");
        setCurrentLine(57); // size--;
        await sleep(400);

        setDescription("Ready.");
        setCurrentLine(undefined);
        setIsAnimating(false);
    };

    const reset = () => {
        setList([]);
        setDescription("Ready.");
        setInputValue(0);
        setCurrentLine(undefined);
        setIsAnimating(false);
    };

    return (
        <ResizableSplit
            initialSplit={60}
            left={
                <div className="flex flex-col h-full gap-6">
                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(Number(e.target.value))}
                                className="w-16 px-2 py-1 bg-slate-700 rounded text-center text-white border border-slate-600 focus:outline-none"
                                disabled={isAnimating}
                            />

                            <button onClick={insertHead} disabled={isAnimating || list.length >= 7} className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm disabled:opacity-50 transition-colors">
                                <Plus className="w-4 h-4" /> Add Head
                            </button>
                            <button onClick={insertTail} disabled={isAnimating || list.length >= 7} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm disabled:opacity-50 transition-colors">
                                <Plus className="w-4 h-4" /> Add Tail
                            </button>
                        </div>

                        <div className="w-px h-8 bg-slate-700 hidden md:block" />

                        <div className="flex items-center gap-2">
                            <button onClick={removeHead} disabled={isAnimating || list.length === 0} className="flex items-center gap-1 px-3 py-1 bg-red-600/80 hover:bg-red-500 rounded-lg text-white text-sm disabled:opacity-50 transition-colors">
                                <Trash2 className="w-4 h-4" /> Remove Head
                            </button>
                            <button onClick={removeTail} disabled={isAnimating || list.length === 0} className="flex items-center gap-1 px-3 py-1 bg-orange-600/80 hover:bg-orange-500 rounded-lg text-white text-sm disabled:opacity-50 transition-colors">
                                <Trash2 className="w-4 h-4" /> Remove Tail
                            </button>
                        </div>

                        <div className="flex-1" />
                        <button onClick={reset} disabled={isAnimating} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Visualization Area */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-x-auto flex flex-col items-center justify-center relative min-h-[300px]">
                        <div className="flex items-center justify-start px-8 gap-0 min-w-max">
                            <AnimatePresence mode="popLayout">
                                {list.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="text-slate-500 italic"
                                    >
                                        Empty List
                                    </motion.div>
                                )}
                                {list.map((node, idx) => (
                                    <motion.div
                                        key={node.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                                        className="flex items-center group relative"
                                    >
                                        {/* Node Box */}
                                        <div className={`
w - 16 h - 16 flex flex - col items - center justify - center rounded - lg border - 2
transition - colors duration - 300 z - 10
                                            ${node.highlight ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-800 border-slate-600'}
`}>
                                            <span className="text-lg font-bold text-white">{node.value}</span>
                                            {idx === 0 && <span className="absolute -top-6 text-[10px] text-blue-400 font-mono">HEAD</span>}
                                            {idx === list.length - 1 && <span className="absolute -bottom-6 text-[10px] text-indigo-400 font-mono">TAIL</span>}
                                        </div>

                                        {/* Arrow */}
                                        <div className="w-12 flex justify-center text-slate-500">
                                            {idx < list.length - 1 ? (
                                                <ArrowRight className="w-6 h-6" />
                                            ) : (
                                                <div className="flex items-center gap-1 opacity-50">
                                                    <div className="w-4 h-[2px] bg-slate-600" />
                                                    <div className="w-[1px] h-4 bg-slate-600 rotate-12" />
                                                    <div className="w-[1px] h-4 bg-slate-600 -rotate-12 -ml-1" />
                                                    <span className="text-[10px] font-mono ml-1">NULL</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={description} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer code={LINKED_LIST_CODE} highlightLine={currentLine} />
                    </div>
                </div>
            }
        />
    );
};


export default LinkedListVisualizer;
