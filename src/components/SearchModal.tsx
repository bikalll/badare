import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { X, Search as SearchIcon } from 'lucide-react';

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
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 w-full max-w-4xl mx-auto pt-32 px-6 flex flex-col"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-8 right-6 text-gray-400 hover:text-gray-900 transition-colors p-2"
                        >
                            <X className="w-6 h-6" strokeWidth={1.5} />
                        </button>

                        <form onSubmit={handleSearchSubmit} className="w-full relative group border-b border-gray-200">
                            <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-gray-900 transition-colors" strokeWidth={1.5} />
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full bg-transparent text-2xl md:text-4xl font-light text-gray-900 placeholder-gray-300 py-6 pl-12 outline-none transition-all"
                            />
                        </form>

                        {/* Results Pane */}
                        <div className="w-full mt-12 flex flex-col gap-2">
                            <AnimatePresence>
                                {query.length >= 2 && filteredProducts.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="flex flex-col gap-2"
                                    >
                                        <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-4 px-2">Suggestions</h3>
                                        {filteredProducts.map((p) => (
                                            <Link 
                                                key={p.id} 
                                                to={`/product/${p.id}`}
                                                onClick={onClose}
                                                className="group flex items-center justify-between p-4 rounded-sm hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-16 overflow-hidden bg-gray-50 shrink-0">
                                                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-medium text-gray-900 uppercase tracking-widest">{p.name}</h4>
                                                        <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">{p.category} — NPR {p.price}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                                
                                {query.length >= 2 && filteredProducts.length === 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-20"
                                    >
                                        <p className="text-sm font-light text-gray-500 uppercase tracking-widest">No results found for "{query}"</p>
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
