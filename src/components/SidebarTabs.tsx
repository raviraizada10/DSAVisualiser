
import { useState } from 'react';
import { motion } from 'framer-motion';

interface SidebarTabsProps {
    tabs: {
        id: string;
        label: string;
        icon: React.ElementType;
        content: React.ReactNode;
    }[];
}

const SidebarTabs = ({ tabs }: SidebarTabsProps) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className="flex flex-col h-full bg-slate-900/30">
            {/* Tab Header */}
            <div className="flex border-b border-slate-700/50">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative
                                ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabSidebar"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden relative">
                {tabs.map(tab => {
                    if (tab.id !== activeTab) return null;
                    return (
                        <div key={tab.id} className="h-full w-full flex flex-col">
                            {tab.content}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SidebarTabs;
