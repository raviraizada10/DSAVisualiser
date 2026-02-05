import { useState } from 'react';
import { motion } from 'framer-motion';
import DPVisualizer from '../components/dp/DPVisualizer';
import AlgorithmInfoPanel from '../components/AlgorithmInfoPanel';
import { ALGORITHM_DATA } from '../data/algorithms';

const DynamicProgramming = () => {
    const [selectedAlgo, setSelectedAlgo] = useState('fib');
    const info = ALGORITHM_DATA[selectedAlgo];

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
                    Dynamic Programming
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Visualize tabulation and memoization techniques. "Those who cannot remember the past are condemned to repeat it."
                </p>
            </motion.div>

            {/* Analysis Panel */}
            {info && (
                <div className="shrink-0">
                    <AlgorithmInfoPanel data={info} />
                </div>
            )}

            <DPVisualizer selectedAlgo={selectedAlgo} onSelectAlgo={setSelectedAlgo} />
        </div>
    );
};

export default DynamicProgramming;
