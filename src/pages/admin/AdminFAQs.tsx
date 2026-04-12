import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { useFaqStore, FAQ } from '../../store/useFaqStore';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminFAQs = () => {
    const { faqs, fetchFaqs, addFaq, updateFaq, deleteFaq } = useFaqStore();
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState<Partial<FAQ> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchFaqs().then(() => setLoading(false));
    }, [fetchFaqs]);

    const openCreateForm = () => {
        setEditData({ question: '', answer: '', order_idx: faqs.length });
        setIsFormOpen(true);
    };

    const openEditForm = (faq: FAQ) => {
        setEditData(faq);
        setIsFormOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        if (editData?.id) {
            await updateFaq(editData.id, { 
                question: editData.question, 
                answer: editData.answer, 
                order_idx: editData.order_idx 
            });
        } else if (editData) {
            await addFaq({ 
                question: editData.question, 
                answer: editData.answer, 
                order_idx: editData.order_idx || faqs.length 
            });
        }
        setIsFormOpen(false);
        setEditData(null);
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this FAQ?")) {
            await deleteFaq(id);
        }
    };

    return (
        <div className="w-full max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">FAQs</h1>
                    <p className="text-slate-500 mt-1 text-sm">Manage frequently asked questions.</p>
                </div>
                <button 
                    onClick={openCreateForm}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus size={18} /> Add FAQ
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col gap-4 p-6">
                        <div className="w-full h-10 bg-slate-100 rounded-md animate-pulse"></div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-full h-24 bg-slate-50 rounded-md animate-pulse"></div>
                        ))}
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="flex flex-col w-full items-center justify-center p-16 text-slate-500">
                        <p className="font-medium text-lg text-slate-700">No FAQs Found</p>
                        <p className="text-sm mt-1">Add frequently asked questions here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 justify-between group">
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-2">{faq.question}</h3>
                                    <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap">{faq.answer}</p>
                                </div>
                                <div className="flex items-start gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => openEditForm(faq)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100 shadow-sm"
                                        title="Edit FAQ"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(faq.id)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 shadow-sm"
                                        title="Delete FAQ"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for Create/Edit */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col"
                        >
                            <div className="flex justify-between items-center bg-slate-50 border-b border-slate-200 px-6 py-4">
                                <h2 className="text-lg font-bold text-slate-800">
                                    {editData?.id ? 'Edit FAQ' : 'Add FAQ'}
                                </h2>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 md:p-8 flex flex-col gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Question</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={editData?.question || ''} 
                                        onChange={(e) => setEditData({...editData, question: e.target.value})}
                                        className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow shadow-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Answer</label>
                                    <textarea 
                                        required 
                                        rows={6}
                                        value={editData?.answer || ''} 
                                        onChange={(e) => setEditData({...editData, answer: e.target.value})}
                                        className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow shadow-sm resize-none" 
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sort Priority</label>
                                        <input 
                                            type="number" 
                                            value={editData?.order_idx ?? 0} 
                                            onChange={(e) => setEditData({...editData, order_idx: parseInt(e.target.value) || 0})}
                                            className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow shadow-sm" 
                                        />
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-slate-100">
                                     <button 
                                        type="button" 
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save FAQ'}
                                    </button>
                                </div>
                            </form>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
