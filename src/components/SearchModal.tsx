import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const [query, setQuery] = useState('');
    const { products } = useProductStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            setQuery('');
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const filteredProducts = query.length >= 2 
        ? products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || 
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 5)
        : [];

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length > 0) {
            navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex flex-col">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-md"
                        onClick={onClose}
                    />
                    
                    <motion.div 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="relative z-10 w-full max-w-5xl mx-auto pt-24 px-6 md:px-12 flex flex-col items-center"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-8 right-6 md:right-12 bg-black text-white p-3 brutalist-border-white inverted-hover-reverse group"
                        >
                            <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                        </button>

                        <form onSubmit={handleSearchSubmit} className="w-full relative group">
                            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="WHAT ARE YOU LOOKING FOR?"
                                className="w-full bg-transparent border-[8px] border-black text-4xl md:text-6xl font-display uppercase tracking-tighter p-8 pl-24 outline-none focus:bg-white focus:shadow-[16px_16px_0_0_#000] transition-all placeholder-gray-300"
                            />
                        </form>

                        {/* Results Pane */}
                        <div className="w-full mt-12 flex flex-col gap-4">
                            <AnimatePresence>
                                {query.length >= 2 && filteredProducts.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="flex flex-col gap-4"
                                    >
                                        <h3 className="text-xl font-bold uppercase tracking-widest border-b-4 border-black pb-2">Top Matches</h3>
                                        {filteredProducts.map((p) => (
                                            <Link 
                                                key={p.id} 
                                                to={`/product/${p.id}`}
                                                onClick={onClose}
                                                className="group flex items-center justify-between p-6 bg-white border-4 border-black shadow-[8px_8px_0_0_#000] hover:bg-black hover:text-white inverted-hover transition-all"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-24 overflow-hidden border-2 border-black bg-gray-100 shrink-0">
                                                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-display text-2xl md:text-3xl uppercase tracking-wider">{p.name}</h4>
                                                        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-400">{p.category}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                                
                                {query.length >= 2 && filteredProducts.length === 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center p-12 bg-black text-white border-4 border-black shadow-[12px_12px_0_0_#000]"
                                    >
                                        <h3 className="font-display text-4xl uppercase tracking-tighter">NO DATA FOUND FOR &quot;{query}&quot;</h3>
                                        <p className="mt-4 font-bold tracking-widest text-gray-400">TRY SOMETHING ELSE OR BROWSE THE FULL SHOP.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
