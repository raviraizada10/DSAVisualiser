import { Link, useLocation } from 'react-router-dom';
import { Code2, GitGraph, Search, SortAsc, Menu, X, Home, Layers, Undo2, Lightbulb, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Sorting', path: '/sorting', icon: SortAsc },
        { name: 'Searching', path: '/searching', icon: Search },
        { name: 'Graphs', path: '/graphs', icon: GitGraph },
        { name: 'Structures', path: '/structures', icon: Code2 },
        { name: 'DP', path: '/dp', icon: Layers },
        { name: 'Patterns', path: '/patterns', icon: Lightbulb },
        { name: 'Backtracking', path: '/backtracking', icon: Undo2 },
        { name: 'Greedy', path: '/greedy', icon: Clock },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                            <Code2 className="h-6 w-6 text-blue-400" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            DSA.Viz
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-400 ${isActive('/') ? 'text-blue-400' : 'text-slate-400'
                                }`}
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-400 ${isActive(item.path) ? 'text-blue-400' : 'text-slate-400'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-b border-slate-700/50 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/') ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                <Home className="w-5 h-5" />
                                <span>Home</span>
                            </Link>
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 p-3 rounded-lg ${isActive(item.path) ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
