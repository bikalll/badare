import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { useProductStore } from '../store/useProductStore';
import { Filter } from 'lucide-react';

export const Shop = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialCategory = searchParams.get('category') || 'All';

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState('Newest');
    const [showFilters, setShowFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        setVisibleCount(12);
    }, [activeCategory, sortBy]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { products, loading } = useProductStore();

    const categories = ['All', 'Apparel', 'Accessories', 'Footwear', 'Outerwear'];

    let filteredProducts = [...products];
    if (activeCategory !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
    }

    // Sorting
    if (sortBy === 'Price Low-High') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price High-Low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Popular') {
        filteredProducts.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    } else {
        // Newest
        filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
    };

    return (
        <div className="pb-32 pt-24 bg-[#fcfcfc] min-h-screen">
            <div className="max-w-[100rem] mx-auto px-6">
                <header className="mb-16 mt-8 md:mt-24 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="font-display text-4xl sm:text-5xl md:text-7xl tracking-tight mb-6 text-gray-900"
                    >
                        {activeCategory === 'All' ? 'Collection' : activeCategory}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-gray-500 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        Explore the latest from Badare. Functional design meets absolute aesthetic restraint.
                        <span className="block mt-6 text-black font-semibold uppercase tracking-[0.2em] text-xs">We don’t follow trends. We interrupt them.</span>
                    </motion.p>
                </header>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-gray-200 pb-8 gap-4 sticky top-[72px] bg-[#fcfcfc]/90 backdrop-blur-xl z-30">
                    <button
                        className="md:hidden flex items-center gap-2 font-semibold uppercase text-[10px] tracking-[0.2em] text-gray-600 hover:text-black transition-colors py-2"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-4 h-4" /> Filters
                    </button>

                    <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-3 w-full md:w-auto`}>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-[10px] tracking-[0.2em] uppercase font-semibold transition-all px-5 py-2.5 border ${activeCategory === cat
                                            ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-black/10'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto mt-6 md:mt-0">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 shrink-0">Sort</span>
                        <select
                            className="bg-transparent border-b border-gray-300 py-1.5 focus:border-gray-900 uppercase text-[10px] font-semibold tracking-[0.2em] outline-none cursor-pointer text-gray-800 transition-colors"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option>Newest</option>
                            <option>Price Low-High</option>
                            <option>Price High-Low</option>
                            <option>Popular</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-32 text-gray-400 font-light uppercase tracking-widest">
                        Loading collection...
                    </div>
                ) : (
                    <>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 mb-20"
                        >
                            {filteredProducts.slice(0, visibleCount).map(product => (
                                <motion.div variants={fadeInUp} key={product.id}>
                                    <ProductCard product={product as any} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {filteredProducts.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center py-32 max-w-lg mx-auto"
                            >
                                <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6 text-gray-900">Nothing Found</h2>
                                <p className="text-gray-500 font-light text-base mb-10 leading-relaxed">
                                    We couldn't find any products matching your current filters. Take a step back and try another category.
                                </p>
                                <button
                                    onClick={() => setActiveCategory('All')}
                                    className="bg-gray-900 text-white font-medium text-xs uppercase px-10 py-4 tracking-[0.2em] hover:bg-black transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </motion.div>
                        )}
                    </>
                )}

                {filteredProducts.length > visibleCount && (
                    <div className="flex justify-center mt-24 mb-12">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 12)}
                            className="bg-transparent border border-gray-300 text-gray-900 font-semibold uppercase tracking-[0.2em] px-12 py-4 text-xs hover:border-gray-900 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
