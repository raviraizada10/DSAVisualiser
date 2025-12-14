import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, GitBranch, Play } from 'lucide-react';
import ResizableSplit from '../ui/ResizableSplit';
import CodeViewer from '../CodeViewer';
import StepLogger from '../StepLogger';
import { BST_INSERT_CODE, BST_SEARCH_CODE, BST_TRAVERSAL_CODE } from '../../algorithms/structures/bst/code';

interface TreeNode {
    value: number;
    x: number;
    y: number;
    left?: TreeNode;
    right?: TreeNode;
    id: string;
}

const BSTVisualizer = () => {
    const [root, setRoot] = useState<TreeNode | null>(null);
    const [inputValue, setInputValue] = useState<number>(0);
    // Animation State
    const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null);
    const [visitedIds, setVisitedIds] = useState<string[]>([]);
    const [foundNodeId, setFoundNodeId] = useState<string | null>(null);
    const [codeLine, setCodeLine] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState('Ready to build Binary Search Tree.');
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeCode, setActiveCode] = useState(BST_INSERT_CODE);
    const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const { nodes, edges } = useMemo(() => {
        if (!root) {
            return { nodes: [], edges: [] };
        }

        const newNodes: TreeNode[] = [];
        const newEdges: { source: TreeNode; target: TreeNode; id: string }[] = [];

        const traverse = (node: TreeNode, x: number, y: number, level: number) => {
            const spread = 200 / Math.pow(1.6, level);

            // Note: Mutating node.x/y for visualization is accepted here as node objects are part of state
            // and we want stable references, though ideally we'd clone. 
            // Since we are only reading x/y for render, it is okay-ish.
            node.x = x;
            node.y = y;
            newNodes.push(node);

            if (node.left) {
                newEdges.push({ source: node, target: node.left, id: `${node.id}-${node.left.id}` });
                traverse(node.left, x - spread, y + 70, level + 1);
            }
            if (node.right) {
                newEdges.push({ source: node, target: node.right, id: `${node.id}-${node.right.id}` });
                traverse(node.right, x + spread, y + 70, level + 1);
            }
        };

        traverse(root, 300, 50, 0);
        return { nodes: newNodes, edges: newEdges };
    }, [root]);

    const insert = async () => {
        if (!inputValue || isAnimating) return;
        setIsAnimating(true);
        setActiveCode(BST_INSERT_CODE);
        setFoundNodeId(null);
        setHighlightNodeId(null);
        setVisitedIds([]);
        const val = inputValue;

        setCodeLine(2); // insert
        setDescription(`Inserting ${val}...`);
        await sleep(500);

        if (!root) {
            setCodeLine(7); // New node
            setDescription("Root is null. Creating new root node.");
            await sleep(500);
            setRoot({ value: val, x: 300, y: 50, id: Math.random().toString() });
            setIsAnimating(false);
            setInputValue(Math.floor(Math.random() * 100));
            setCodeLine(undefined);
            return;
        }

        let current = root;
        while (true) {
            setHighlightNodeId(current.id);
            await sleep(500);

            if (val === current.value) {
                setDescription(`Value ${val} already exists.`);
                setIsAnimating(false);
                setHighlightNodeId(null);
                setCodeLine(undefined);
                return;
            }

            if (val < current.value) {
                setCodeLine(11);
                setDescription(`${val} < ${current.value}. Going Left.`);
                await sleep(500);
                if (!current.left) {
                    setCodeLine(12);
                    setDescription("Left is empty. Inserting here.");
                    await sleep(500);
                    break;
                }
                current = current.left;
            } else {
                setCodeLine(13);
                setDescription(`${val} > ${current.value}. Going Right.`);
                await sleep(500);
                if (!current.right) {
                    setCodeLine(14);
                    setDescription("Right is empty. Inserting here.");
                    await sleep(500);
                    break;
                }
                current = current.right;
            }
        }

        // Functional Insert
        const insertNode = (node: TreeNode, val: number): TreeNode => {
            if (val < node.value) {
                if (!node.left) return { ...node, left: { value: val, x: 0, y: 0, id: Math.random().toString() } };
                return { ...node, left: insertNode(node.left, val) };
            } else if (val > node.value) {
                if (!node.right) return { ...node, right: { value: val, x: 0, y: 0, id: Math.random().toString() } };
                return { ...node, right: insertNode(node.right, val) };
            }
            return node;
        };

        setRoot(prev => prev ? insertNode(prev, val) : null);
        setHighlightNodeId(null);
        setCodeLine(undefined);
        setDescription(`Inserted ${val}.`);
        setInputValue(Math.floor(Math.random() * 100));
        setIsAnimating(false);
    };

    const search = async () => {
        if (!inputValue || !root || isAnimating) return;
        setIsAnimating(true);
        setActiveCode(BST_SEARCH_CODE);
        setFoundNodeId(null);
        setHighlightNodeId(null);
        setVisitedIds([]);
        const val = inputValue;

        setDescription(`Searching for ${val}...`);
        setCodeLine(2);
        await sleep(500);

        let current: TreeNode | undefined = root;
        while (current) {
            setHighlightNodeId(current.id);
            await sleep(500);

            if (current.value === val) {
                setCodeLine(7);
                setDescription(`Found ${val}!`);
                setFoundNodeId(current.id);
                setHighlightNodeId(null);
                await sleep(1000);
                break;
            }

            if (val < current.value) {
                setCodeLine(9);
                setDescription(`$${val} < ${current.value}. Search Left.`);
                await sleep(500);
                current = current.left;
            } else {
                setCodeLine(11);
                setDescription(`$${val} > ${current.value}. Search Right.`);
                await sleep(500);
                current = current.right;
            }
        }

        if (!current) {
            setCodeLine(6);
            setDescription(`${val} not found.`);
        }

        setHighlightNodeId(null);
        setCodeLine(undefined);
        setIsAnimating(false);
    };

    const traverse = async () => {
        if (!root || isAnimating) return;
        setIsAnimating(true);
        setActiveCode(BST_TRAVERSAL_CODE);
        setFoundNodeId(null);
        setHighlightNodeId(null);
        setVisitedIds([]);
        setDescription(`Starting ${traversalType} traversal...`);

        const visit = async (node: TreeNode) => {
            setHighlightNodeId(node.id);
            await sleep(600);

            // Mark Visited (Purple) after processing
            setVisitedIds(prev => [...prev, node.id]);
            setHighlightNodeId(null);
            setDescription(`Visited ${node.value}`);
            await sleep(300);
        };

        if (traversalType === 'inorder') {
            setCodeLine(1);
            const inorderRec = async (node: TreeNode | undefined) => {
                if (!node) return;
                setCodeLine(4); // recur left
                await inorderRec(node.left);
                setCodeLine(5); // print
                await visit(node);
                setCodeLine(6); // recur right
                await inorderRec(node.right);
            };
            await inorderRec(root);
        } else if (traversalType === 'preorder') {
            setCodeLine(10);
            const preorderRec = async (node: TreeNode | undefined) => {
                if (!node) return;
                setCodeLine(13); // print
                await visit(node);
                setCodeLine(14); // recur left
                await preorderRec(node.left);
                setCodeLine(15); // recur right
                await preorderRec(node.right);
            };
            await preorderRec(root);
        } else if (traversalType === 'postorder') {
            setCodeLine(19);
            const postorderRec = async (node: TreeNode | undefined) => {
                if (!node) return;
                setCodeLine(22); // recur left
                await postorderRec(node.left);
                setCodeLine(23); // recur right
                await postorderRec(node.right);
                setCodeLine(24); // print
                await visit(node);
            };
            await postorderRec(root);
        }

        setDescription("Traversal Complete.");
        setCodeLine(undefined);
        setIsAnimating(false);
    };

    const clear = () => {
        setRoot(null);
        setDescription('Tree cleared.');
        setVisitedIds([]);
    };

    return (
        <ResizableSplit
            initialSplit={65}
            left={
                <div className="flex flex-col h-full gap-6">
                    {/* Controls */}
                    <div className="flex flex-col gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                        {/* Top: Insert/Search/Clear */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(Number(e.target.value))}
                                    className="w-20 px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 outline-none text-center text-white font-mono"
                                    disabled={isAnimating}
                                    placeholder="Val"
                                />
                                <button onClick={insert} disabled={isAnimating} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg disabled:opacity-50 text-white text-sm font-medium transition-colors">
                                    <Plus size={16} /> Insert
                                </button>
                                <button onClick={search} disabled={isAnimating || !root} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 text-white text-sm font-medium transition-colors">
                                    <Search size={16} /> Search
                                </button>
                            </div>
                            <div className="flex-1" />
                            <button onClick={clear} disabled={isAnimating} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-50 text-slate-300 hover:text-white text-sm transition-colors">
                                <Trash2 size={16} /> Clear
                            </button>
                        </div>

                        {/* Bottom: Traversal */}
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-700/50">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 text-sm font-medium flex items-center gap-1"><GitBranch size={14} /> Traversal:</span>
                                <select
                                    value={traversalType}
                                    onChange={(e) => setTraversalType(e.target.value as 'inorder' | 'preorder' | 'postorder')}
                                    className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 outline-none"
                                    disabled={isAnimating}
                                >
                                    <option value="inorder">In-Order</option>
                                    <option value="preorder">Pre-Order</option>
                                    <option value="postorder">Post-Order</option>
                                </select>
                            </div>
                            <button onClick={traverse} disabled={isAnimating || !root} className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg disabled:opacity-50 text-white text-sm font-medium transition-colors">
                                <Play size={14} /> Run Traversal
                            </button>
                        </div>
                    </div>

                    {/* Tree Visualization */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 relative overflow-hidden flex items-center justify-center p-8 min-h-[400px]">
                        <svg width="600" height="400" viewBox="0 0 600 400" className="w-full h-full select-none">
                            <AnimatePresence>
                                {edges.map(edge => (
                                    <motion.line
                                        key={edge.id}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        x1={edge.source.x}
                                        y1={edge.source.y}
                                        x2={edge.target.x}
                                        y2={edge.target.y}
                                        stroke="#475569"
                                        strokeWidth="2"
                                        transition={{ duration: 0.5 }}
                                    />
                                ))}
                            </AnimatePresence>
                            <AnimatePresence>
                                {nodes.map(node => {
                                    const isHighlight = node.id === highlightNodeId;
                                    const isFound = node.id === foundNodeId;
                                    const isVisited = visitedIds.includes(node.id);

                                    let fillColor = "#0f172a"; // default slate-900
                                    let strokeColor = "#3b82f6"; // blue-500

                                    if (isFound) {
                                        fillColor = "#10b981"; // emerald-500
                                        strokeColor = "#059669";
                                    } else if (isHighlight) {
                                        fillColor = "#f59e0b"; // amber-500
                                        strokeColor = "#d97706";
                                    } else if (isVisited) {
                                        fillColor = "#9333ea"; // purple-600
                                        strokeColor = "#7e22ce";
                                    }

                                    return (
                                        <g key={node.id}>
                                            <motion.circle
                                                cx={node.x}
                                                cy={node.y}
                                                r={isHighlight ? 22 : 18}
                                                fill={fillColor}
                                                stroke={strokeColor}
                                                strokeWidth={isHighlight || isFound ? 3 : 2}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            />
                                            <text
                                                x={node.x}
                                                y={node.y}
                                                dy=".35em"
                                                textAnchor="middle"
                                                fill={(isHighlight || isFound || isVisited) ? "white" : "#e2e8f0"}
                                                fontSize={isHighlight ? "14" : "12"}
                                                fontWeight="bold"
                                                pointerEvents="none"
                                            >
                                                {node.value}
                                            </text>
                                        </g>
                                    );
                                })}
                            </AnimatePresence>
                        </svg>
                    </div>

                </div>
            }
            right={
                <div className="flex flex-col h-full gap-4">
                    <StepLogger description={description} />
                    <div className="flex-1 overflow-hidden min-h-0">
                        <CodeViewer
                            code={activeCode}
                            highlightLine={codeLine}
                        />
                    </div>
                </div>
            }
        />
    );
};

export default BSTVisualizer;
