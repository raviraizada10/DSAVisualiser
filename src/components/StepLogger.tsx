import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface StepLoggerProps {
    description?: string;
}

const StepLogger = ({ description }: StepLoggerProps) => {
    if (!description) return null;

    return (
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3 shadow-lg">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <AnimatePresence mode="wait">
                <motion.p
                    key={description}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-slate-200 text-sm leading-relaxed"
                >
                    {description}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

export default StepLogger;
