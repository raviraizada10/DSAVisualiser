
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trees } from 'lucide-react';
import ActivitySelectionVisualizer from '../components/greedy/ActivitySelectionVisualizer';
import HuffmanCodingVisualizer from '../components/greedy/HuffmanCodingVisualizer';
import AlgorithmInfoPanel from '../components/AlgorithmInfoPanel';
import { ALGORITHM_DATA } from '../data/algorithms';

const TABS = [
    { id: 'activity', label: 'Activity Selection', icon: Clock, component: ActivitySelectionVisualizer, algoKey: 'Activity Selection' },
    { id: 'huffman', label: 'Huffman Coding', icon: Trees, component: HuffmanCodingVisualizer, algoKey: 'Huffman Coding' },
];

const Greedy = () => {
    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const activeTabData = TABS.find(t => t.id === activeTab);
    const info = activeTabData ? ALGORITHM_DATA[activeTabData.algoKey] : undefined;

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500">
                    Greedy Algorithms
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Optimization strategies that make the locally optimal choice at each stage with the hope of finding a global optimum. "Take what you can, give nothing back (unless it's optimal)."
                </p>
            </motion.div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-300
                                ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabGreedy"
                                    className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg shadow-lg shadow-teal-900/20"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Icon size={18} />
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Analysis Panel */}
            {info && (
                <div className="shrink-0">
                    <AlgorithmInfoPanel data={info} />
                </div>
            )}

            {/* Content Area */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    {TABS.map((tab) => {
                        if (tab.id !== activeTab) return null;
                        const Component = tab.component;
                        return (
                            <motion.div
                                key={tab.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Component />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Greedy;
