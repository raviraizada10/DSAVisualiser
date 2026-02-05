import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, SortAsc, Search, GitGraph, Database, Layers, Undo2, Lightbulb, Clock } from 'lucide-react';

const features = [
    {
        title: 'Sorting Algorithms',
        description: 'Visualize Bubble, Merge, Quick sort and more with real-time comparisons.',
        icon: SortAsc,
        path: '/sorting',
        color: 'from-blue-500 to-cyan-500',
        delay: 0.1
    },
    {
        title: 'Searching Algorithms',
        description: 'Understand Linear and Binary search through interactive steps.',
        icon: Search,
        path: '/searching',
        color: 'from-purple-500 to-pink-500',
        delay: 0.2
    },
    {
        title: 'Data Structures',
        description: 'Explore Arrays, Linked Lists, Trees, and Graphs visually.',
        icon: Database,
        path: '/structures',
        color: 'from-emerald-500 to-teal-500',
        delay: 0.3
    },
    {
        title: 'Graph Algorithms',
        description: 'Master BFS, DFS, Dijkstra and other pathfinding algorithms.',
        icon: GitGraph,
        path: '/graphs',
        color: 'from-orange-500 to-red-500',
        delay: 0.4
    },
    {
        title: 'Dynamic Programming',
        description: 'Visualize Fibonacci, Knapsack, and LCS with tabulation tables.',
        icon: Layers,
        path: '/dp',
        color: 'from-teal-400 to-emerald-400',
        delay: 0.5
    },
    {
        title: 'Algorithmic Patterns',
        description: 'Master Sliding Window, Two Pointers, and other key interview patterns.',
        icon: Lightbulb,
        path: '/patterns',
        color: 'from-indigo-400 to-cyan-400',
        delay: 0.6
    },
    {
        title: 'Backtracking',
        description: 'Visualize N-Queens and recursive search strategies.',
        icon: Undo2,
        path: '/backtracking',
        color: 'from-amber-500 to-orange-600',
        delay: 0.7
    },
    {
        title: 'Greedy Algorithms',
        description: 'Visualize Activity Selection and Huffman Coding.',
        icon: Clock,
        path: '/greedy',
        color: 'from-teal-400 to-emerald-400',
        delay: 0.8
    },
];

const Home = () => {
    return (
        <div className="space-y-16 py-8">
            {/* Hero Section */}
            <section className="text-center space-y-6 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                    Master Algorithms visually
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-slate-400 max-w-2xl mx-auto"
                >
                    An interactive platform to visualize, step through, and understand
                    complex Data Structures and Algorithms.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        to="/sorting"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
                    >
                        <span>Start Visualizing</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </section>

            {/* Grid */}
            <section className="grid md:grid-cols-2 gap-6">
                {features.map((feature) => (
                    <Link to={feature.path} key={feature.path} className="group">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: feature.delay }}
                            className="h-full p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all group-hover:transform group-hover:-translate-y-1 group-hover:shadow-xl"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    </Link>
                ))}
            </section>
        </div>
    );
};

export default Home;
