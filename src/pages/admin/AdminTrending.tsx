import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon, Upload } from 'lucide-react';
import { uploadToCloudinary } from '../../utils/cloudinary';

interface TrendingCard {
    id: string;
    title: string;
    subtitle: string;
    image_url: string;
    link_url: string;
    sort_order: number;
}

export const AdminTrending = () => {
    const [cards, setCards] = useState<TrendingCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCard, setEditingCard] = useState<Partial<TrendingCard> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        const { data, error } = await supabase
            .from('trending_cards')
            .select('*')
            .order('sort_order', { ascending: true });
        
        if (error) {
            console.error("Error fetching trending cards:", error);
        } else {
            setCards(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this trending card?")) return;
        
        const { error } = await supabase.from('trending_cards').delete().eq('id', id);
        if (error) {
            alert("Error deleting card");
        } else {
            fetchCards();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Create local preview
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!editingCard?.title || (!editingCard?.image_url && !selectedFile)) {
            alert("Title and Image are required");
            return;
        }

        setIsSaving(true);
        let finalImageUrl = editingCard.image_url || '';

        // If a new file is selected, upload to Cloudinary directly!
        if (selectedFile) {
            try {
                finalImageUrl = await uploadToCloudinary(selectedFile);
            } catch (err: any) {
                alert(`Upload failed: ${err.message}`);
                setIsSaving(false);
                return;
            }
        }

        const cardData = {
            title: editingCard.title,
            subtitle: editingCard.subtitle || '',
            link_url: editingCard.link_url || '/shop',
            image_url: finalImageUrl,
            sort_order: editingCard.sort_order || 0
        };

        if (editingCard.id) {
            const { error } = await supabase.from('trending_cards').update(cardData).eq('id', editingCard.id);
            if (error) alert("Error updating card");
        } else {
            const { error } = await supabase.from('trending_cards').insert([cardData]);
            if (error) alert("Error creating card");
        }

        setIsSaving(false);
        setEditingCard(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchCards();
    };

    const openModal = (card?: TrendingCard) => {
        setEditingCard(card || { title: '', subtitle: '', link_url: '/shop', image_url: '', sort_order: cards.length });
        setSelectedFile(null);
        setPreviewUrl(card?.image_url || null);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Trending Cards</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Manage editorial "Trending Now" banners</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Add Card</span>
                </button>
            </div>

            {loading ? (
                <div className="text-slate-500">Loading cards...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map(card => (
                        <motion.div key={card.id} layout className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="h-64 bg-slate-100 relative group flex-shrink-0">
                                <img src={card.image_url} alt={card.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button onClick={() => openModal(card)} className="bg-white text-slate-900 p-2 rounded-full hover:bg-indigo-50 transition">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(card.id)} className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    Order: {card.sort_order}
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{card.subtitle}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono truncate">
                                    Link: {card.link_url}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {cards.length === 0 && !editingCard && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-300 rounded-xl">
                            <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                            <h3 className="text-sm font-medium text-slate-900">No cards</h3>
                            <p className="text-sm text-slate-500 mt-1">Get started by uploading an editorial shot.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Edit / Create Modal */}
            {editingCard && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
                            <h2 className="text-xl font-bold text-slate-800">{editingCard.id ? 'Edit Trending Card' : 'New Trending Card'}</h2>
                            <button onClick={() => setEditingCard(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-5">
                            {/* Cloudinary Image Upload Section */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Editorial Image</label>
                                <div 
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors relative"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewUrl ? (
                                        <div className="relative aspect-[3/4] w-48 mx-auto overflow-hidden rounded-lg shadow-sm">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                                                    <Upload size={14} /> Replace
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <Upload className="mx-auto h-10 w-10 text-indigo-400 mb-3" />
                                            <p className="text-sm font-medium text-slate-700">Click to upload to Cloudinary</p>
                                            <p className="text-xs text-slate-400 mt-1">High-res portrait (3:4 ratio) recommended</p>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Primary Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-bold"
                                        value={editingCard.title || ''}
                                        onChange={e => setEditingCard({...editingCard, title: e.target.value})}
                                        placeholder="E.G. NEW UNIFORMS"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Subtitle</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                                        value={editingCard.subtitle || ''}
                                        onChange={e => setEditingCard({...editingCard, subtitle: e.target.value})}
                                        placeholder="E.G. SHOP THE COLLECTION"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Link URL</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 font-mono"
                                        value={editingCard.link_url || ''}
                                        onChange={e => setEditingCard({...editingCard, link_url: e.target.value})}
                                        placeholder="/shop"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={editingCard.sort_order || 0}
                                        onChange={e => setEditingCard({...editingCard, sort_order: parseInt(e.target.value) || 0})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                            <button 
                                onClick={() => setEditingCard(null)}
                                className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
                            >
                                {isSaving ? <span className="animate-pulse flex items-center gap-2"><Upload size={16} className="animate-bounce" /> Uploading...</span> : <><Check size={16} /> Save Card</>}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
