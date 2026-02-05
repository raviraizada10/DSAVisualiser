import { motion } from 'framer-motion';

interface CodeViewerProps {
    code: string;
    highlightLine: number | undefined;
    language?: string;
}

const CodeViewer = ({ code, highlightLine }: CodeViewerProps) => {
    const lines = code.split('\n');

    return (
        <div className="font-mono text-sm bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-auto max-h-[800px]">
            {lines.map((line, idx) => {
                const lineNumber = idx + 1;
                const isHighlighted = lineNumber === highlightLine;

                return (
                    <motion.div
                        key={idx}
                        initial={false}
                        animate={{
                            backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        }}
                        className={`flex w-full ${isHighlighted ? 'border-l-2 border-blue-500' : 'border-l-2 border-transparent'}`}
                    >
                        <span className="text-slate-600 select-none w-8 text-right pr-3 shrink-0">{lineNumber}</span>
                        <span className={`${isHighlighted ? 'text-blue-200' : 'text-slate-300'} whitespace-pre`}>
                            {line}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default CodeViewer;
