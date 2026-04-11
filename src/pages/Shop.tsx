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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-24 pt-12"
        >
            <div className="max-w-[90rem] mx-auto px-6">
                <header className="mb-12 mt-4 md:mt-8 md:mb-20">
                    <div>
                        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] leading-[0.8] uppercase tracking-tighter mb-4 md:mb-6 text-white bg-black inline-block p-2 md:p-4 brutalist-border shadow-[4px_4px_0_0_#000] md:shadow-[8px_8px_0_0_#000]">
                            {activeCategory === 'All' ? 'Collection' : activeCategory}
                        </h1>
                        <br />
                        <p className="text-black bg-white inline-block px-3 md:px-4 py-2 md:py-3 text-sm md:text-lg font-black uppercase tracking-wide md:tracking-widest brutalist-border mt-2 shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000]">
                            EXPLORE THE LATEST FROM BADARE. FUNCTIONAL DESIGN MEETS EXTREME AESTHETIC RESTRAINT.
                        </p>
                    </div>
                </header>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 px-6 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] gap-4 sticky top-[100px] z-40 py-4">
                    <button
                        className="md:hidden flex items-center gap-2 font-black uppercase text-lg tracking-widest text-black bg-white px-4 py-2 brutalist-border inverted-hover shadow-[4px_4px_0_0_#000]"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-6 h-6" /> Filters
                    </button>

                    <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-6 w-full md:w-auto`}>
                        <div className="flex flex-wrap gap-4">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-sm md:text-lg tracking-widest uppercase font-black transition-colors p-2 border-4 border-black ${activeCategory === cat ? 'bg-black text-white shadow-[4px_4px_0_0_#000]' : 'bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_0_#000]'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 p-2 bg-gray-100 border-4 border-black shadow-[4px_4px_0_0_#000]">
                        <span className="text-sm uppercase font-black tracking-widest text-black shrink-0 px-2">Sort By:</span>
                        <select
                            className="bg-transparent border-none py-2 uppercase text-sm font-black tracking-widest outline-none cursor-pointer"
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
                    <div className="text-center py-32 bg-white border-4 border-black shadow-[8px_8px_0_0_#000] my-8">
                        <h2 className="font-display text-3xl uppercase tracking-widest animate-pulse">Establishing Link...</h2>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 gap-y-12 mb-16 px-4 md:px-0">
                            {filteredProducts.slice(0, visibleCount).map(product => (
                                <ProductCard key={product.id} product={product as any} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-32 bg-white border-8 border-black shadow-[16px_16px_0_0_#000] my-8">
                                <h2 className="font-display text-6xl uppercase mb-6 tracking-tighter">Nothing Found</h2>
                                <p className="text-black font-bold uppercase text-lg mb-12 bg-gray-100 inline-block px-4 py-2 border-2 border-black">WE COULDN'T FIND ANY PRODUCTS MATCHING YOUR CURRENT FILTERS.</p>
                                <br />
                                <button
                                    onClick={() => setActiveCategory('All')}
                                    className="bg-black text-white font-display text-2xl uppercase px-12 py-6 tracking-widest inverted-hover border-4 border-black shadow-[8px_8px_0_0_#000]"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </>
                )}

                {filteredProducts.length > visibleCount && (
                    <div className="flex justify-center mt-16 mb-12">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 12)}
                            className="bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] text-black font-display uppercase tracking-widest px-12 py-4 text-2xl inverted-hover"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
