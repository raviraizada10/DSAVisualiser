import { useState } from 'react';
import { motion } from 'framer-motion';
import { PATTERNS_INFO } from '../algorithms/patterns/info';
import SlidingWindowVisualizer from '../components/patterns/SlidingWindowVisualizer';
import TwoPointersVisualizer from '../components/patterns/TwoPointersVisualizer';
import MergeIntervalsVisualizer from '../components/patterns/MergeIntervalsVisualizer';
import { Lightbulb } from 'lucide-react';
import AlgorithmInfoPanel from '../components/AlgorithmInfoPanel';

const TABS = [
    { id: 'sliding-window', label: 'Sliding Window', component: SlidingWindowVisualizer },
    { id: 'two-pointers', label: 'Two Pointers', component: TwoPointersVisualizer },
    { id: 'intervals', label: 'Merge Intervals', component: MergeIntervalsVisualizer },
];

const Patterns = () => {
    const [activeTab, setActiveTab] = useState('sliding-window');
    const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || SlidingWindowVisualizer;
    const info = PATTERNS_INFO[activeTab];

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>Essential for FAANG Interviews</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Algorithmic Patterns
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Master the underlying patterns behind thousands of coding problems.
                    Recognizing the pattern is half the battle.
                </p>
            </motion.div>

            {/* Tech-style Tabs */}
            <div className="flex flex-wrap justify-center gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm max-w-3xl mx-auto">
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

export default Patterns;
