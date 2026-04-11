import { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { EditProductModal } from './EditProductModal';
import { AddProductModal } from './AddProductModal';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export const AdminProducts = () => {
    const { products, fetchProducts } = useProductStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');

    const getStockBadge = (stock: any) => {
        const s = Number(stock || 0);
        if (s === 0) return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-xs font-semibold">Out of Stock</span>;
        if (s <= 5) return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold">Low Stock ({s})</span>;
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-semibold">In Stock ({s})</span>;
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this product permanently?')) return;
        
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
            fetchProducts();
        } else {
            alert('Error deleting product');
        }
    };

    return (
        <div className="w-full max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Directory</h1>
                    <p className="text-slate-500 mt-1 text-sm">Manage inventory, variants, and product catalog.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* View Toggle */}
                    <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
                        <button 
                            onClick={() => setViewMode('TABLE')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'TABLE' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <List size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('GRID')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'GRID' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm whitespace-nowrap"
                    >
                        <Plus size={18} />
                        New Product
                    </button>
                </div>
            </div>

            {viewMode === 'TABLE' ? (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto min-h-[400px]">
                    {products.length === 0 ? (
                        <div className="flex w-full items-center justify-center p-12 text-sm text-slate-500">
                            No products mapped. Add one to begin.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                                    <th className="py-4 pl-6 pr-4">Image</th>
                                    <th className="py-4 px-4">Name</th>
                                    <th className="py-4 px-4">Category</th>
                                    <th className="py-4 px-4">Price</th>
                                    <th className="py-4 px-4">Stock</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {products.map((p) => (
                                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 pl-6 pr-4">
                                            <div className="w-12 h-12 rounded-md overflow-hidden border border-slate-200 bg-white shadow-sm">
                                                <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 font-medium text-slate-900">{p.name}</td>
                                        <td className="py-4 px-4 text-slate-500 capitalize">{p.category}</td>
                                        <td className="py-4 px-4 font-semibold text-slate-900">NPR {p.price}</td>
                                        <td className="py-4 px-4">
                                            {getStockBadge(p.stock)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button 
                                                    onClick={() => setEditingProduct(p)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(p.id)}
                                                    className="text-rose-600 hover:text-rose-900 font-medium text-sm transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
                    {products.length === 0 ? (
                        <div className="col-span-full flex items-center justify-center p-12 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl">
                            No products mapped. Add one to begin.
                        </div>
                    ) : (
                        products.map((p) => (
                            <div key={p.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                                    <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3">
                                        {getStockBadge(p.stock)}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">{p.category}</span>
                                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{p.name}</h3>
                                    <p className="font-semibold text-slate-700 mt-auto">NPR {p.price}</p>
                                    
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => setEditingProduct(p)}
                                            className="flex-1 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(p.id)}
                                            className="flex-1 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            {editingProduct && (
                <EditProductModal 
                    isOpen={!!editingProduct} 
                    onClose={() => setEditingProduct(null)} 
                    product={editingProduct} 
                />
            )}
        </div>
    );
};
