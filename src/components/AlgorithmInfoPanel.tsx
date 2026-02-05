import { useState } from 'react';
import { Database, CheckCircle, XCircle, CheckCircle2, HelpCircle, AlertTriangle, ChevronDown, ChevronUp, BookOpen, Clock, Zap } from 'lucide-react';
import { type AlgorithmMetadata } from '../types/algorithm';
import { motion, AnimatePresence } from 'framer-motion';

interface AlgorithmInfoPanelProps {
    data: AlgorithmMetadata;
}

const AlgorithmInfoPanel = ({ data }: AlgorithmInfoPanelProps) => {
    const [isHowItWorksExpanded, setIsHowItWorksExpanded] = useState(false);
    const [isDeepDiveExpanded, setIsDeepDiveExpanded] = useState(false);

    return (
        <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 rounded-xl overflow-hidden mb-6 shadow-xl">
            {/* Main Header Section */}
            <div className="p-6 space-y-6">

                {/* Top Row: Identity & Complexity Grid */}
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
                    {/* Identity & Desc */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                {data.category}
                            </span>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{data.name}</h2>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-sm max-w-3xl">
                            {data.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {data.useCases.map((useCase, idx) => (
                                <span key={idx} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-400">
                                    {useCase}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Complexity Compact Grid - Always visible for quick reference */}
                    <div className="w-full lg:w-auto shrink-0 bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Zap className="w-3 h-3 text-amber-500" /> Complexity Analysis
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-3">
                            <ComplexityCompact label="Time (Best)" value={data.complexity.time.best} color="text-emerald-400" />
                            <ComplexityCompact label="Time (Average)" value={data.complexity.time.average} color="text-amber-400" />
                            <ComplexityCompact label="Time (Worst)" value={data.complexity.time.worst} color="text-red-400" />
                            <ComplexityCompact label="Space" value={data.complexity.space} color="text-blue-400" icon={<Database className="w-3 h-3" />} />
                        </div>
                    </div>
                </div>

                {/* Collapsible Sections Controls */}
                <div className="flex flex-wrap gap-4 border-t border-slate-800/50 pt-4">
                    <button
                        onClick={() => setIsHowItWorksExpanded(!isHowItWorksExpanded)}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isHowItWorksExpanded
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        How it Works
                        {isHowItWorksExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                    </button>

                    <button
                        onClick={() => setIsDeepDiveExpanded(!isDeepDiveExpanded)}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDeepDiveExpanded
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        Deep Dive Analysis
                        {isDeepDiveExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                    </button>
                </div>
            </div>

            {/* Collapsible Content: How it Works */}
            <AnimatePresence>
                {isHowItWorksExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-800 bg-slate-900/30"
                    >
                        <div className="p-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                                <BookOpen className="w-4 h-4 text-blue-500" /> Step-by-Step Logic
                            </h3>
                            {data.keySteps && data.keySteps.length > 0 ? (
                                <ol className="space-y-3 max-w-4xl">
                                    {data.keySteps.map((step, idx) => (
                                        <li key={idx} className="flex gap-4 text-sm text-slate-300">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-500 mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <span className="leading-relaxed bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/50 w-full">
                                                {step}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-sm text-slate-500 italic">Key steps not available.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapsible Content: Deep Dive */}
            <AnimatePresence>
                {isDeepDiveExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-800 bg-slate-900/50"
                    >
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
                            {/* Column 1: Pros & Cons */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Advantages
                                    </h3>
                                    <ul className="space-y-2">
                                        {data.pros.map((pro, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                                <span>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
                                        <XCircle className="w-4 h-4 text-red-500" /> Disadvantages
                                    </h3>
                                    <ul className="space-y-2">
                                        {data.cons.map((con, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                                                <span>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Column 2: Interview Tips (When to Use) */}
                            {data.interviewTips && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> When to Use
                                        </h3>
                                        <ul className="space-y-2">
                                            {data.interviewTips.whenToUse.map((tip, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-slate-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
                                            <AlertTriangle className="w-4 h-4 text-amber-500" /> Common Pitfalls
                                        </h3>
                                        <ul className="space-y-2">
                                            {data.interviewTips.pitfalls.map((pit, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-slate-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                                    <span>{pit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Column 3: Common Problems */}
                            {data.interviewTips && (
                                <div>
                                    <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
                                        <HelpCircle className="w-4 h-4 text-blue-500" /> Common Problems
                                    </h3>
                                    <ul className="space-y-2">
                                        {data.interviewTips.commonProblems.map((prob, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                                                <span>{prob}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ComplexityCompact = ({ label, value, color, icon }: { label: string, value: string, color: string, icon?: React.ReactNode }) => (
    <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium flex items-center gap-1 mb-0.5">
            {icon} {label}
        </span>
        <span className={`text-sm font-mono font-bold ${color}`}>
            {value}
        </span>
    </div>
);

export default AlgorithmInfoPanel;
