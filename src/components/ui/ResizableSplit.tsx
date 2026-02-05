import { useState, useRef, useEffect, type ReactNode } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizableSplitProps {
    left: ReactNode;
    right: ReactNode;
    initialSplit?: number; // percentage, e.g., 60
}

const ResizableSplit = ({ left, right, initialSplit = 60 }: ResizableSplitProps) => {
    const [split, setSplit] = useState(initialSplit);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => {
        setIsDragging(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100;

            // Enforce limits (20% to 80%)
            const clampedSplit = Math.min(Math.max(newSplit, 20), 80);
            setSplit(clampedSplit);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="flex flex-col lg:flex-row w-full h-full min-h-[500px] gap-2 lg:gap-0" // Removed gap for seamless split on large screens
        >
            {/* Left Panel (Visualization) */}
            <div
                className="lg:h-full w-full lg:w-auto overflow-hidden flex flex-col"
                style={{ flex: `0 0 ${split}%` }}
            >
                {left}
            </div>

            {/* Drag Handle (Desktop only) */}
            <div
                className="hidden lg:flex flex-col justify-center items-center w-6 bg-slate-900/0 hover:bg-slate-800/50 cursor-col-resize transition-colors z-10 -ml-3 -mr-3 relative group"
                onMouseDown={handleMouseDown}
            >
                <div className="h-12 w-1.5 bg-slate-700/50 group-hover:bg-blue-500/80 rounded-full transition-colors flex items-center justify-center">
                    <GripVertical className="w-3 h-3 text-slate-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity absolute" />
                </div>
            </div>

            {/* Right Panel (Code) */}
            <div
                className="lg:h-full w-full lg:w-auto flex-1 overflow-hidden flex flex-col pl-2" // Added pl-2 for spacing
            >
                {right}
            </div>
        </div>
    );
};

export default ResizableSplit;
