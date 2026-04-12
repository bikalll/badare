import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';

export const AdminTrending = () => {
    const { products, loading, fetchProducts, updateProduct } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const toggleTrending = async (id: string, currentStatus: boolean) => {
        await updateProduct(id, { isTrending: !currentStatus });
    };

    return (
        <div className="p-8 max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Trending Products</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Select which products appear in the "Trending Now" editorial section</p>
                </div>
            </div>

            {loading && products.length === 0 ? (
                <div className="text-slate-500">Loading products...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <motion.div key={product.id} layout className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all ${product.isTrending ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'}`}>
                            <div className="h-64 bg-slate-100 relative group flex-shrink-0">
                                <img src={product.images[0] || ''} alt={product.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={() => toggleTrending(product.id, product.isTrending || false)} 
                                        className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition ${product.isTrending ? 'bg-white text-rose-600 hover:bg-rose-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                    >
                                        <Star size={16} className={product.isTrending ? "fill-rose-600" : ""} />
                                        {product.isTrending ? 'Remove' : 'Mark Trending'}
                                    </button>
                                </div>
                                {product.isTrending && (
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 text-indigo-600">
                                        <Star size={12} className="fill-indigo-600" />
                                        TRENDING
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800 tracking-wide">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{product.category}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono flex justify-between items-center">
                                    <span>NPR {product.price}</span>
                                    <span className={product.isTrending ? 'text-indigo-600 font-bold' : ''}>
                                        {product.isTrending ? 'Active' : 'Hidden'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-300 rounded-xl">
                            <h3 className="text-sm font-medium text-slate-900">No products found</h3>
                            <p className="text-sm text-slate-500 mt-1">Add products to your store first.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
