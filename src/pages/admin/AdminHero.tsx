import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon } from 'lucide-react';

interface HeroSlide {
    id: string;
    title: string;
    italic_text: string;
    description: string;
    image_url: string;
    sort_order: number;
}

export const AdminHero = () => {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .order('sort_order', { ascending: true });
        
        if (error) {
            console.error("Error fetching hero slides:", error);
        } else {
            setSlides(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this slide?")) return;
        
        const { error } = await supabase.from('hero_slides').delete().eq('id', id);
        if (error) {
            alert("Error deleting slide");
        } else {
            fetchSlides();
        }
    };

    const handleSave = async () => {
        if (!editingSlide?.title || !editingSlide?.image_url) {
            alert("Title and Image URL are required");
            return;
        }

        setIsSaving(true);
        const slideData = {
            title: editingSlide.title,
            italic_text: editingSlide.italic_text || '',
            description: editingSlide.description || '',
            image_url: editingSlide.image_url,
            sort_order: editingSlide.sort_order || 0
        };

        if (editingSlide.id) {
            const { error } = await supabase.from('hero_slides').update(slideData).eq('id', editingSlide.id);
            if (error) alert("Error updating slide");
        } else {
            const { error } = await supabase.from('hero_slides').insert([slideData]);
            if (error) alert("Error creating slide");
        }

        setIsSaving(false);
        setEditingSlide(null);
        fetchSlides();
    };

    return (
        <div className="p-8 max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Hero Slider</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Manage the cinematic homepage carousel</p>
                </div>
                <button
                    onClick={() => setEditingSlide({ title: '', italic_text: '', description: '', image_url: '', sort_order: slides.length })}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Add Slide</span>
                </button>
            </div>

            {loading ? (
                <div className="text-slate-500">Loading slides...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slides.map(slide => (
                        <motion.div key={slide.id} layout className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="h-48 bg-slate-100 relative group">
                                <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button onClick={() => setEditingSlide(slide)} className="bg-white text-slate-900 p-2 rounded-full hover:bg-indigo-50 transition">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(slide.id)} className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded">
                                    Order: {slide.sort_order}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-slate-800 uppercase tracking-wide">
                                    {slide.title} <span className="italic font-light text-slate-500">{slide.italic_text}</span>
                                </h3>
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{slide.description}</p>
                            </div>
                        </motion.div>
                    ))}
                    {slides.length === 0 && !editingSlide && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-300 rounded-xl">
                            <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                            <h3 className="text-sm font-medium text-slate-900">No slides</h3>
                            <p className="text-sm text-slate-500 mt-1">Get started by creating a new slide.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Edit / Create Modal */}
            {editingSlide && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingSlide.id ? 'Edit Slide' : 'New Slide'}</h2>
                            <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Title (e.g. "BE")</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-bold"
                                    value={editingSlide.title || ''}
                                    onChange={e => setEditingSlide({...editingSlide, title: e.target.value.toUpperCase()})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Italic Text (e.g. "YOU.")</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none uppercase italic"
                                    value={editingSlide.italic_text || ''}
                                    onChange={e => setEditingSlide({...editingSlide, italic_text: e.target.value.toUpperCase()})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description Copy</label>
                                <textarea 
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                    value={editingSlide.description || ''}
                                    onChange={e => setEditingSlide({...editingSlide, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Unsplash recommended)</label>
                                <input 
                                    type="url" 
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={editingSlide.image_url || ''}
                                    onChange={e => setEditingSlide({...editingSlide, image_url: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                                <input 
                                    type="number" 
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={editingSlide.sort_order || 0}
                                    onChange={e => setEditingSlide({...editingSlide, sort_order: parseInt(e.target.value) || 0})}
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button 
                                onClick={() => setEditingSlide(null)}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {isSaving ? <span className="animate-pulse">Saving...</span> : <><Check size={16} /> Save</>}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
