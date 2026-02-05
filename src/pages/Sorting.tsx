
import { useState } from 'react';
import SortingVisualizer from './SortingVisualizer';
import { SORTING_ALGORITHMS_INFO } from '../algorithms/sorting/info';

const Sorting = () => {
    const [selectedAlgo, setSelectedAlgo] = useState('Bubble Sort');
    const info = SORTING_ALGORITHMS_INFO[selectedAlgo];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                    {info.title} Visualization
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    {info.description}
                </p>
            </div>

            <SortingVisualizer selectedAlgo={selectedAlgo} onSelectAlgo={setSelectedAlgo} />

            {/* Explanation Section */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                    <h3 className="text-xl font-bold mb-4 text-white">How it works</h3>
                    <ol className="list-decimal list-inside space-y-2 text-slate-400">
                        {info.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                    <h3 className="text-xl font-bold mb-4 text-white">Complexity</h3>
                    <div className="space-y-4 text-slate-400">
                        <div className="flex justify-between">
                            <span>Time Complexity (Best)</span>
                            <span className="font-mono text-emerald-400">{info.complexity.best}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Time Complexity (Average)</span>
                            <span className="font-mono text-amber-400">{info.complexity.average}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Space Complexity</span>
                            <span className="font-mono text-blue-400">{info.complexity.space}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sorting;
