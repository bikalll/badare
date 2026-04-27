import { useState, useEffect } from 'react';

import { useProductStore, Product, ProductColor } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { uploadToCloudinary } from '../utils/cloudinary';
import { Upload, ChevronRight, Check, Asterisk } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomBuilder = () => {
    const { products, loading, fetchProducts } = useProductStore();
    const { addItem } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (products.length === 0) fetchProducts();
    }, [fetchProducts, products.length]);

    const [step, setStep] = useState<1 | 2 | 3>(1);

    // State
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [designFile, setDesignFile] = useState<File | null>(null);
    const [designPreview, setDesignPreview] = useState<string>('');
    const [designText, setDesignText] = useState<string>('');

    const [isUploading, setIsUploading] = useState(false);

    const selectedProduct = products.find(p => p.id === selectedProductId);

    // Derived lists
    const colors = selectedProduct?.variants?.colors || [];
    const sizes = selectedProduct?.variants?.sizes || [];

    // Find representative image of product/color
    const getProductImage = (p: Product) => {
        if (selectedColor) {
            const colorObj = p.variants.colors.find(c => typeof c === 'object' && c.hex === selectedColor) as ProductColor;
            if (colorObj?.images && colorObj.images.length > 0) return colorObj.images[0];
        }
        if (p.images && p.images.length > 0) return p.images[0];
        const firstColor = p.variants.colors.find(c => typeof c === 'object' && c.images && c.images.length > 0);
        if (firstColor) return (firstColor as any).images[0];
        return '';
    };

    const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setDesignFile(file);
            setDesignPreview(URL.createObjectURL(file));
        }
    };

    const handleAddToCart = async () => {
        if (!selectedProduct || !selectedSize || !selectedColor) return;

        setIsUploading(true);
        let uploadedUrl = '';
        if (designFile) {
            try {
                uploadedUrl = await uploadToCloudinary(designFile);
            } catch (err) {
                console.error("Upload failed", err);
                alert("Failed to upload design image. Please try again.");
                setIsUploading(false);
                return;
            }
        }

        const priceMarkup = (uploadedUrl || designText) ? 500 : 0; // flat customizable premium

        addItem({
            productId: selectedProduct.id,
            name: `${selectedProduct.name} [CUSTOM]`,
            price: selectedProduct.price + priceMarkup,
            image: getProductImage(selectedProduct),
            quantity: 1,
            variant: {
                size: selectedSize,
                color: selectedColor
            },
            customDesign: {
                image: uploadedUrl || undefined,
                text: designText || undefined
            }
        });

        setIsUploading(false);
        navigate('/cart');
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-gray-900 pt-32 pb-24 px-6 relative">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                {/* Left: Input Flow */}
                <div className="col-span-1 lg:col-span-7 flex flex-col gap-16">
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">The Badare Experience</span>
                        <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-none text-black">
                            Customize
                        </h1>
                        <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed max-w-lg">
                            Build your statement piece from the ground up. Select your base canvas, lock in the specifications, and upload your identity.
                        </p>
                    </div>

                    <div className="flex flex-col gap-12">
                        {/* Step 1: Base Canvas */}
                        <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-black"><span className="text-gray-400 mr-2">01/</span> Base Canvas</h2>
                                {step > 1 && <button onClick={() => setStep(1)} className="text-[10px] text-gray-400 hover:text-black uppercase tracking-widest font-semibold">Edit</button>}
                            </div>

                            {step === 1 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {loading ? (
                                        <div className="col-span-full py-12 text-center text-[10px] uppercase tracking-widest text-gray-400 animate-pulse">Loading Canvas Collection...</div>
                                    ) : (
                                        products.slice(0, 9).map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => { setSelectedProductId(p.id); setSelectedColor(''); setSelectedSize(''); }}
                                                className={`text-left group flex flex-col gap-3 transition-colors p-3 border ${selectedProductId === p.id ? 'border-gray-900 bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                                            >
                                                <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                                                    <img src={getProductImage(p)} className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={p.name} />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-display text-sm truncate">{p.name}</span>
                                                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">NPR {p.price}</span>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="flex text-sm text-gray-600 font-light items-center gap-4">
                                    <div className="w-12 h-16 bg-gray-100"><img src={getProductImage(selectedProduct!)} className="w-full h-full object-cover mix-blend-multiply" /></div>
                                    <span className="font-display text-lg">{selectedProduct?.name}</span>
                                </div>
                            )}

                            {step === 1 && (
                                <button
                                    disabled={!selectedProductId}
                                    onClick={() => setStep(2)}
                                    className="mt-10 bg-black text-white px-8 py-4 text-[10px] uppercase font-semibold tracking-[0.2em] w-fit hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4"
                                >
                                    Next: Specifications <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Step 2: Specifications */}
                        <div className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-black"><span className="text-gray-400 mr-2">02/</span> Specifications</h2>
                                {step > 2 && <button onClick={() => setStep(2)} className="text-[10px] text-gray-400 hover:text-black uppercase tracking-widest font-semibold">Edit</button>}
                            </div>

                            {step === 2 && selectedProduct ? (
                                <div className="flex flex-col gap-10">
                                    <div className="flex flex-col gap-4">
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Color Variant</span>
                                        <div className="flex flex-wrap gap-4">
                                            {colors.map((c: any, i) => {
                                                const hex = typeof c === 'string' ? c : c.hex;
                                                return (
                                                    <button
                                                        key={`col-${i}`}
                                                        onClick={() => setSelectedColor(hex)}
                                                        className={`w-10 h-10 rounded-full border-2 transition-transform ${selectedColor === hex ? 'border-gray-900 scale-110 shadow-lg' : 'border-gray-200 hover:scale-105'}`}
                                                        style={{ backgroundColor: hex }}
                                                        aria-label={hex}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Size</span>
                                        <div className="flex flex-wrap gap-3">
                                            {sizes.map((s: string) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setSelectedSize(s)}
                                                    className={`min-w-[3rem] h-10 px-4 flex items-center justify-center border text-[10px] uppercase tracking-widest transition-colors font-semibold ${selectedSize === s ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-900 text-gray-600'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        disabled={!selectedColor || !selectedSize}
                                        onClick={() => setStep(3)}
                                        className="bg-black text-white px-8 py-4 text-[10px] uppercase font-semibold tracking-[0.2em] w-fit hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 mt-2"
                                    >
                                        Next: Identity & Graphic <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : step > 2 ? (
                                <div className="flex gap-4 text-sm font-semibold tracking-wide text-gray-800">
                                    <div className="px-4 py-2 border border-gray-200 bg-gray-50 flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full border border-gray-200 inline-block" style={{ backgroundColor: selectedColor }}></span>
                                        {selectedColor}
                                    </div>
                                    <div className="px-4 py-2 border border-gray-200 bg-gray-50 flex items-center">{selectedSize}</div>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 font-light tracking-wide">Select a canvas first.</p>
                            )}
                        </div>

                        {/* Step 3: Graphic */}
                        <div className={`transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-black"><span className="text-gray-400 mr-2">03/</span> Identity</h2>
                            </div>

                            {step === 3 && selectedProduct ? (
                                <div className="flex flex-col gap-10">
                                    {/* Upload bounds */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 flex items-center gap-2">
                                            Upload Graphic <span className="font-light normal-case tracking-normal text-gray-400">(Optional)</span>
                                        </span>
                                        <div className="relative border border-dashed border-gray-300 bg-gray-50 p-10 flex flex-col items-center justify-center gap-4 text-center hover:bg-gray-100 transition-colors group cursor-pointer overflow-hidden min-h-[200px]">
                                            <input type="file" accept="image/*" onChange={handleFileDrop} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            {designPreview ? (
                                                <img src={designPreview} className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply" />
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:text-black group-hover:scale-110 transition-all">
                                                        <Upload className="w-5 h-5" />
                                                    </div>
                                                    <p className="text-xs font-semibold text-gray-500 tracking-wider">Drag or click to upload</p>
                                                    <p className="text-[10px] text-gray-400 max-w-xs">High resolution PNG, JPG, or SVG. We'll handle the alignment.</p>
                                                </>
                                            )}
                                        </div>
                                        {designPreview && (
                                            <button onClick={() => { setDesignFile(null); setDesignPreview(''); }} className="text-[10px] text-rose-500 uppercase tracking-widest font-semibold hover:text-rose-700 w-fit">
                                                Remove Graphic
                                            </button>
                                        )}
                                    </div>

                                    {/* Text bounds */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 flex items-center gap-2">
                                            Typography Instructions <span className="font-light normal-case tracking-normal text-gray-400">(Optional)</span>
                                        </span>
                                        <textarea
                                            value={designText}
                                            onChange={(e) => setDesignText(e.target.value)}
                                            rows={3}
                                            placeholder="E.g., 'Savage' written in bold gothic letters across the chest..."
                                            className="w-full border border-gray-200 bg-white p-4 text-sm font-light text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 font-light tracking-wide">Lock in specifications first.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Summary Sticky Pane */}
                <div className="col-span-1 lg:col-span-5 relative">
                    <div className="sticky top-32 flex flex-col gap-8 bg-white p-8 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <h3 className="font-display text-3xl uppercase tracking-widest border-b border-gray-100 pb-6 text-black">
                            Summary
                        </h3>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Canvas</span>
                                <span className="text-base font-semibold text-gray-900">{selectedProduct?.name || '---'}</span>
                            </div>

                            <div className="flex gap-8 border-y border-gray-50 py-4">
                                <div className="flex flex-col gap-1 flex-1">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Color</span>
                                    <span className="text-sm font-semibold capitalize text-gray-900 flex items-center gap-2">
                                        {selectedColor ? (
                                            <><span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: selectedColor }}></span> {selectedColor}</>
                                        ) : '---'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Size</span>
                                    <span className="text-sm font-semibold text-gray-900">{selectedSize || '---'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Additions</span>
                                <div className="flex flex-col gap-2 text-sm text-gray-600">
                                    <span className="flex items-center gap-2"><Asterisk className="w-3 h-3" /> Base Production</span>
                                    {designPreview && <span className="flex items-center gap-2 text-green-600"><Check className="w-3 h-3" /> Custom Graphic Attached</span>}
                                    {designText && <span className="flex items-center gap-2 text-green-600"><Check className="w-3 h-3" /> Custom Typography Attached</span>}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Total Estimation</span>
                                <span className="font-display text-2xl md:text-3xl text-gray-900">
                                    NPR {selectedProduct ? selectedProduct.price + ((designPreview || designText) ? 500 : 0) : 0}
                                </span>
                            </div>
                        </div>

                        <button
                            disabled={!selectedProduct || !selectedColor || !selectedSize || isUploading}
                            onClick={handleAddToCart}
                            className="bg-gray-900 text-white border border-gray-900 py-5 uppercase text-xs tracking-[0.2em] font-semibold hover:bg-white hover:text-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group w-full mt-4 shadow-sm"
                        >
                            {isUploading ? (
                                <span className="animate-pulse">Processing Custom Order...</span>
                            ) : (
                                <>Confirm & Add to Cart <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>

                        {(designPreview || designText) && (
                            <p className="text-center text-[10px] text-gray-400 font-light mt-2 italic">Includes NPR 500 custom identity premium</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
