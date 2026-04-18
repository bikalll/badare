import React, { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Upload, Check, Plus, Trash2, Crop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageCropperModal } from '../../components/ImageCropperModal';
import { useProductStore } from '../../store/useProductStore';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export const EditProductModal = ({ isOpen, onClose, product }: EditProductModalProps) => {
    const { updateProduct, loading, error } = useProductStore();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Apparel');
    const [editorNotes, setEditorNotes] = useState('');
    const [stock, setStock] = useState('0');
    const [sizes, setSizes] = useState('');

    interface ColorInput { id: string; hex: string; files: File[]; existingImages: string[] }
    const [colorInputs, setColorInputs] = useState<ColorInput[]>([{ id: 'c1', hex: '#000000', files: [], existingImages: [] }]);

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [cropModalData, setCropModalData] = useState<{
        isOpen: boolean;
        file: File | null;
        imageUrl: string;
        type: 'color' | 'general' | null;
        colorId?: string;
        index: number;
    } | null>(null);

    const handleCropComplete = (croppedFile: File) => {
        if (!cropModalData) return;
        const { type, colorId, index } = cropModalData;
        if (type === 'color' && colorId) {
            setColorInputs(prev => prev.map(c => {
                if (c.id === colorId) {
                    const newFiles = [...c.files];
                    newFiles[index] = croppedFile;
                    return { ...c, files: newFiles };
                }
                return c;
            }));
        } else if (type === 'general') {
            setImageFiles(prev => {
                const newFiles = [...prev];
                newFiles[index] = croppedFile;
                return newFiles;
            });
        }
        setCropModalData(null);
    };

    const openCropModal = (e: React.MouseEvent, type: 'color' | 'general', file: File, index: number, colorId?: string) => {
        e.stopPropagation();
        setCropModalData({
            isOpen: true,
            file,
            imageUrl: URL.createObjectURL(file),
            type,
            index,
            colorId,
        });
    };

    useEffect(() => {
        if (product && isOpen) {
            setName(product.name || '');
            setPrice(product.price ? String(product.price) : '');
            setDescription(product.description || '');
            setEditorNotes(product.editorNotes || '');
            setStock(product.stock !== undefined ? String(product.stock) : '0');
            setCategory(product.category || 'Apparel');
            setSizes((product.variants?.sizes || []).join(', '));

            const prodColors = product.variants?.colors || [];
            let mappedColors: ColorInput[] = prodColors.map((c: any, i: number) => {
                if (typeof c === 'string') return { id: `c-${i}`, hex: c, files: [], existingImages: [] };
                return { id: `c-${i}`, hex: c.hex || '#000000', files: [], existingImages: c.images || [] };
            });
            if (mappedColors.length === 0) {
                mappedColors = [{ id: 'c1', hex: '#000000', files: [], existingImages: [] }];
            }
            setColorInputs(mappedColors);

            setExistingImages(product.images || []);
            setImageFiles([]);
        }
    }, [product, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        const colorImageMap: { [hex: string]: File[] } = {};
        const productColors: { hex: string, images: string[] }[] = [];

        colorInputs.forEach(input => {
            const hex = input.hex.trim();
            if (hex) {
                if (input.files.length > 0) colorImageMap[hex] = input.files;
                productColors.push({ hex, images: input.existingImages });
            }
        });

        const success = await updateProduct(product.id, {
            name,
            price: parseFloat(price) || 0,
            description,
            category,
            editorNotes,
            stock: parseInt(stock) || 0,
            variants: {
                sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
                colors: productColors
            },
            images: imageFiles.length > 0 ? [] : existingImages,
        }, imageFiles, colorImageMap);

        if (success) {
            onClose();
        }
    };

    const handleColorFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setColorInputs(prev => prev.map(c => c.id === id ? { ...c, files: [...c.files, ...filesArray] } : c));
        }
    };

    const removeExistingColorImage = (colorId: string, idx: number) => {
        setColorInputs(prev => prev.map(c => c.id === colorId ? { ...c, existingImages: c.existingImages.filter((_, i) => i !== idx) } : c));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeNewColorImage = (colorId: string, idx: number) => {
        setColorInputs(prev => prev.map(c => c.id === colorId ? { ...c, files: c.files.filter((_, i) => i !== idx) } : c));
    };

    const removeNewImage = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        setImageFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <AnimatePresence>
                {isOpen && product && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                            />
                        </Dialog.Overlay>

                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                                exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                                className="fixed top-[50%] left-[50%] z-[110] w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 p-6 md:p-8"
                            >
                                <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                                    <Dialog.Title className="text-2xl font-bold text-slate-900 tracking-tight">
                                        Edit Item
                                    </Dialog.Title>
                                    <Dialog.Close asChild>
                                        <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </Dialog.Close>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    {error && (
                                        <div className="bg-rose-50 text-rose-600 p-4 rounded-lg font-medium text-sm border border-rose-100">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</label>
                                            <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Product Name" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price (NPR)</label>
                                            <input required value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="0.00" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Count</label>
                                            <input required value={stock} onChange={e => setStock(e.target.value)} type="number" placeholder="0" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                                        <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Product details..." rows={4} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm resize-none"></textarea>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Editor's Notes (Optional)</label>
                                        <textarea value={editorNotes} onChange={e => setEditorNotes(e.target.value)} placeholder="Curator's insight..." rows={3} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm resize-none"></textarea>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm cursor-pointer bg-white">
                                            <option>Apparel</option>
                                            <option>Accessories</option>
                                            <option>Footwear</option>
                                            <option>Outerwear</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sizes (Comma Separated)</label>
                                            <input value={sizes} onChange={e => setSizes(e.target.value)} type="text" placeholder="S, M, L, XL" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Color Variations</label>
                                            <button type="button" onClick={() => setColorInputs(prev => [...prev, { id: Math.random().toString(), hex: '#000000', files: [], existingImages: [] }])} className="text-xs flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md transition-colors">
                                                <Plus size={14} /> Add Color
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {colorInputs.map((colorInput) => (
                                                <div key={colorInput.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">

                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col gap-1 text-center items-center justify-center">
                                                            <div className="w-10 h-10 rounded-full border-2 border-slate-200 overflow-hidden shadow-inner flex-shrink-0 relative cursor-pointer group/color">
                                                                <input
                                                                    type="color"
                                                                    value={colorInput.hex.startsWith('#') ? colorInput.hex : '#000000'}
                                                                    onChange={e => setColorInputs(prev => prev.map(c => c.id === colorInput.id ? { ...c, hex: e.target.value } : c))}
                                                                    className="absolute pl-[10px] pr-[10px] -inset-6 w-24 h-24 cursor-pointer opacity-0"
                                                                />
                                                                <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: colorInput.hex }}></div>
                                                            </div>
                                                            <div className="text-[10px] font-mono text-slate-500 uppercase truncate w-12">{colorInput.hex}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 w-full border-l border-slate-100 pl-3">
                                                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 block">Upload Swatch/Color Images</label>
                                                        <div className="flex flex-wrap gap-2 items-center">

                                                            {colorInput.existingImages.map((src, i) => (
                                                                <div key={`ext-${i}`} className="relative w-12 h-12 rounded border border-slate-200 overflow-hidden shadow-sm group/img">
                                                                    <img src={src} alt="existing" className="w-full h-full object-cover opacity-80" />
                                                                    <button type="button" onClick={() => removeExistingColorImage(colorInput.id, i)} className="absolute inset-0 bg-red-500/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                                        <Trash2 size={14} className="text-red-600" />
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            {colorInput.files.map((f, i) => (
                                                                <div key={i} className="relative w-12 h-12 rounded border border-slate-200 overflow-hidden shadow-sm group/img">
                                                                    <img src={URL.createObjectURL(f)} alt="pic" className="w-full h-full object-cover opacity-80 group-hover/img:opacity-40 transition-opacity" />
                                                                    <div className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                                                        <button type="button" onClick={(e) => openCropModal(e, 'color', f, i, colorInput.id)} className="bg-slate-900/80 text-white p-1 rounded-sm hover:bg-indigo-600 transition-colors" title="Crop">
                                                                            <Crop size={12} />
                                                                        </button>
                                                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeNewColorImage(colorInput.id, i); }} className="bg-rose-500/90 text-white p-1 rounded-sm hover:bg-rose-500 transition-colors" title="Delete">
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            <label className="w-12 h-12 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-400 hover:bg-slate-50 cursor-pointer transition-colors">
                                                                <Plus size={18} />
                                                                <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleColorFileChange(colorInput.id, e)} />
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {colorInputs.length > 1 && (
                                                        <button type="button" onClick={() => setColorInputs(prev => prev.filter(c => c.id !== colorInput.id))} className="text-slate-400 hover:text-red-500 transition-colors p-2 absolute right-1 top-1 sm:relative sm:right-auto sm:top-auto opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-center text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                        <span className="font-semibold text-slate-700">Heads up:</span> Color Hex is now the primary method of specifying colors!
                                    </div>
                                    <div className="mt-2 hidden">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">General Product Visuals (Fallback)</label>
                                        <div
                                            className="border-2 border-slate-300 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50 group hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer mt-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

                                            {imageFiles.length > 0 ? (
                                                <div className="flex flex-wrap gap-3 justify-center">
                                                    {imageFiles.map((f, i) => (
                                                        <div key={i} className="relative w-20 h-20 border border-slate-200 rounded overflow-hidden shadow-sm group/img">
                                                            <img src={URL.createObjectURL(f)} className="w-full h-full object-cover opacity-80 group-hover/img:opacity-40 transition-opacity" alt="preview" />
                                                            <div className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                <button type="button" onClick={(e) => openCropModal(e, 'general', f, i)} className="bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-indigo-600 transition-colors hover:scale-110 shadow-sm" title="Crop">
                                                                    <Crop size={14} />
                                                                </button>
                                                                <button type="button" onClick={(e) => removeNewImage(e, i)} className="bg-rose-600/90 text-white p-1.5 rounded-full hover:bg-rose-500 transition-colors hover:scale-110 shadow-sm" title="Delete">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : existingImages.length > 0 ? (
                                                <div className="flex flex-wrap gap-3 justify-center">
                                                    {existingImages.map((src, i) => (
                                                        <div key={i} className="relative w-20 h-20 border border-slate-200 rounded overflow-hidden shadow-sm bg-white group/img">
                                                            <img src={src} className="w-full h-full object-cover opacity-80" alt="existing" />
                                                            <button type="button" onClick={(e) => removeExistingImage(e, i)} className="absolute inset-0 bg-red-500/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                                <Trash2 size={18} className="text-red-600" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <div className="w-full text-center mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1.5 pointer-events-none">
                                                        <Check className="w-4 h-4 text-emerald-500" /> Keeping existing images
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                                    <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600">Drop visuals here or click to browse</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                                        <Dialog.Close asChild>
                                            <button type="button" className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                Cancel
                                            </button>
                                        </Dialog.Close>
                                        <button disabled={loading} type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]">
                                            {loading ? 'Processing...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>

            {cropModalData && cropModalData.isOpen && (
                <ImageCropperModal
                    isOpen={cropModalData.isOpen}
                    imageUrl={cropModalData.imageUrl}
                    onClose={() => setCropModalData(null)}
                    onCropComplete={handleCropComplete}
                    aspectRatio={0.8}
                />
            )}
        </Dialog.Root>
    );
};
