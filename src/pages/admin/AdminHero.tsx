import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon, Upload, Eye, Crop } from 'lucide-react';
import { ImageCropperModal } from '../../components/ImageCropperModal';
import { uploadToCloudinary } from '../../utils/cloudinary';

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);


    const [cropModalData, setCropModalData] = useState<{
        isOpen: boolean;
        file: File | null;
        imageUrl: string;
    } | null>(null);

    const handleCropComplete = (croppedFile: File) => {
        setSelectedFile(croppedFile);
        setPreviewUrl(URL.createObjectURL(croppedFile));
        setCropModalData(null);
    };

    const openCropModal = (e: React.MouseEvent, file: File) => {
        e.stopPropagation();
        setCropModalData({
            isOpen: true,
            file,
            imageUrl: URL.createObjectURL(file),
        });
    };
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!editingSlide?.title || (!editingSlide?.image_url && !selectedFile)) {
            alert("Title and Image are required");
            return;
        }

        setIsSaving(true);
        let finalImageUrl = editingSlide.image_url || '';

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

        const slideData = {
            title: editingSlide.title,
            italic_text: editingSlide.italic_text || '',
            description: editingSlide.description || '',
            image_url: finalImageUrl,
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
        setSelectedFile(null);
        setPreviewUrl(null);
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
                    onClick={() => {
                        setEditingSlide({ title: '', italic_text: '', description: '', image_url: '', sort_order: slides.length });
                        setSelectedFile(null);
                        setPreviewUrl(null);
                    }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Add Slide</span>
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                            <div className="h-48 bg-slate-200"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-200 rounded w-full"></div>
                                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slides.map(slide => (
                        <motion.div key={slide.id} layout className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group/card relative">
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-in-out" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <button onClick={() => setPreviewImage(slide.image_url)} className="bg-white text-indigo-600 p-2.5 rounded-full hover:bg-indigo-50 hover:scale-110 transition-all shadow-xl" title="Preview Full Image">
                                        <Eye size={16} />
                                    </button>
                                    <button onClick={() => {
                                        setEditingSlide(slide);
                                        setSelectedFile(null);
                                        setPreviewUrl(slide.image_url);
                                    }} className="bg-white text-slate-900 p-2.5 rounded-full hover:bg-slate-50 hover:scale-110 transition-all shadow-xl" title="Edit Slide">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(slide.id)} className="bg-white text-rose-600 p-2.5 rounded-full hover:bg-rose-50 hover:scale-110 transition-all shadow-xl" title="Delete Slide">
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
                                    onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Italic Text (e.g. "YOU.")</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none uppercase italic"
                                    value={editingSlide.italic_text || ''}
                                    onChange={e => setEditingSlide({ ...editingSlide, italic_text: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description Copy</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                    value={editingSlide.description || ''}
                                    onChange={e => setEditingSlide({ ...editingSlide, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Hero Image</label>
                                <div
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors relative mb-3"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewUrl ? (
                                        <div className="relative h-32 w-full mx-auto overflow-hidden rounded-lg shadow-sm group/heroimg">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/heroimg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                                                    <Upload size={14} /> Replace
                                                </span>
                                            </div>
                                            {selectedFile && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => openCropModal(e, selectedFile)}
                                                        className="absolute top-2 right-10 bg-indigo-600 text-white p-1.5 rounded-md hover:bg-indigo-700 opacity-0 group-hover/heroimg:opacity-100 transition-opacity z-10"
                                                        title="Crop Image"
                                                    >
                                                        <Crop size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFile(null);
                                                            setPreviewUrl(editingSlide.image_url || null);
                                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 opacity-0 group-hover/heroimg:opacity-100 transition-opacity z-10"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <Upload className="mx-auto h-8 w-8 text-indigo-400 mb-2" />
                                            <p className="text-sm font-medium text-slate-700">Click to upload from device</p>
                                            <p className="text-xs text-slate-400 mt-1">Saves directly to Cloudinary</p>
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

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="h-px bg-slate-200 flex-1"></span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Or use URL</span>
                                    <span className="h-px bg-slate-200 flex-1"></span>
                                </div>

                                <input
                                    type="url"
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm disabled:opacity-50 disabled:bg-slate-50"
                                    value={editingSlide.image_url || ''}
                                    onChange={e => setEditingSlide({ ...editingSlide, image_url: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    disabled={!!selectedFile}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                                <input
                                    type="number"
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={editingSlide.sort_order || 0}
                                    onChange={e => setEditingSlide({ ...editingSlide, sort_order: parseInt(e.target.value) || 0 })}
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

            {/* Fullscreen Image Preview */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setPreviewImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all bg-white/10 p-2 rounded-full" onClick={() => setPreviewImage(null)}>
                            <X size={24} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            src={previewImage}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
                            alt="Preview Fullscreen"
                            onClick={e => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {cropModalData && cropModalData.isOpen && (
                <ImageCropperModal
                    isOpen={cropModalData.isOpen}
                    imageUrl={cropModalData.imageUrl}
                    onClose={() => setCropModalData(null)}
                    onCropComplete={handleCropComplete}
                />
            )}
        </div>
    );
};
