import { useState } from 'react';
import { motion } from 'framer-motion';
import StackVisualizer from '../components/structures/StackVisualizer';
import QueueVisualizer from '../components/structures/QueueVisualizer';
import LinkedListVisualizer from '../components/structures/LinkedListVisualizer';
import BSTVisualizer from '../components/structures/BSTVisualizer';
import HeapVisualizer from '../components/structures/HeapVisualizer';
import TrieVisualizer from '../components/structures/TrieVisualizer';
import UnionFindVisualizer from '../components/structures/UnionFindVisualizer';
import HashTableVisualizer from '../components/structures/HashTableVisualizer';

const TABS = [
    { id: 'stack', label: 'Stack', component: StackVisualizer },
    { id: 'queue', label: 'Queue', component: QueueVisualizer },
    { id: 'linked-list', label: 'Linked List', component: LinkedListVisualizer },
    { id: 'hash-table', label: 'Hash Table', component: HashTableVisualizer },
    { id: 'bst', label: 'Binary Search Tree', component: BSTVisualizer },
    { id: 'heap', label: 'Max Heap', component: HeapVisualizer },
    { id: 'trie', label: 'Trie (Prefix Tree)', component: TrieVisualizer },
    { id: 'union-find', label: 'Union-Find', component: UnionFindVisualizer },
];

import { STRUCTURES_INFO } from '../algorithms/structures/info';
import AlgorithmInfoPanel from '../components/AlgorithmInfoPanel';

const Structures = () => {
    const [activeTab, setActiveTab] = useState('stack');
    const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || StackVisualizer;
    const info = STRUCTURES_INFO[activeTab];

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 mb-8"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
                    Data Structures
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Interactive visualizations of fundamental data structures.
                </p>
            </motion.div>

            {/* Custom Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm max-w-5xl mx-auto mb-8">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                            ? 'bg-slate-700 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Analysis Panel at Top */}
            {info && (
                <div className="shrink-0">
                    <AlgorithmInfoPanel data={info} />
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {/* Visualizer */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ActiveComponent />
                </motion.div>
            </div>
        </div>
    );
};

export default Structures;
