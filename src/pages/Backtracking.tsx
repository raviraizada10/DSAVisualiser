import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Grid, Compass } from 'lucide-react';
import NQueensVisualizer from '../components/backtracking/NQueensVisualizer';
import SudokuVisualizer from '../components/backtracking/SudokuVisualizer';
import RatInMazeVisualizer from '../components/backtracking/RatInMazeVisualizer';
import AlgorithmInfoPanel from '../components/AlgorithmInfoPanel';
import { ALGORITHM_DATA } from '../data/algorithms';

const TABS = [
    { id: 'nqueens', label: 'N-Queens', icon: Crown, component: NQueensVisualizer, algoKey: 'N-Queens' },
    { id: 'sudoku', label: 'Sudoku Solver', icon: Grid, component: SudokuVisualizer, algoKey: 'Sudoku Solver' },
    { id: 'rat', label: 'Rat in a Maze', icon: Compass, component: RatInMazeVisualizer, algoKey: 'Rat in a Maze' },
];

const Backtracking = () => {
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
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                    Backtracking Algorithms
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Visualize recursive search algorithms that incrementally build candidates to solutions. "A journey of a thousand miles begins with a single step (and sometimes steps back)."
                </p>
            </motion.div>

            {/* Tech-style Tabs */}
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
                                    layoutId="activeTabBacktracking"
                                    className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg shadow-orange-900/20"
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

export default Backtracking;
