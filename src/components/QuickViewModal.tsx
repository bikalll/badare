import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useProductStore } from '../store/useProductStore';

export const QuickViewModal = () => {
    const { activeQuickViewProduct, closeQuickView, addItem } = useCartStore();
    const { products } = useProductStore();
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const product = products.find(p => p.id === activeQuickViewProduct);

    useEffect(() => {
        // Reset selection when product changes
        if (product) {
            setSelectedSize(product.variants.sizes[0]);
            const firstColor = product.variants.colors[0];
            setSelectedColor(typeof firstColor === 'string' ? firstColor : (firstColor?.hex || ''));
        }
    }, [product]);

    if (!product) return null;

    const normalizedColors = product.variants.colors.map((c: any) => {
        if (typeof c === 'string') return { hex: c, images: [] };
        return { hex: c.hex, images: c.images || [] };
    });

    const currentColorObj = normalizedColors.find((c: any) => c.hex === selectedColor);
    const displayImages = currentColorObj && currentColorObj.images.length > 0 
        ? currentColorObj.images 
        : product.images;

    const handleAdd = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: displayImages[0] || product.images[0],
            quantity: 1,
            variant: {
                size: selectedSize,
                color: selectedColor
            }
        });
        closeQuickView();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-white/80 backdrop-blur-md transition-opacity" onClick={closeQuickView} />

            <div className="relative bg-white w-full max-w-4xl flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] md:h-auto overflow-hidden border border-gray-100">
                <button
                    onClick={closeQuickView}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-900 transition-colors p-2 bg-white/80 backdrop-blur-sm rounded-full md:bg-transparent"
                >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>

                <div className="w-full md:w-1/2 h-64 md:h-[600px] shrink-0 bg-gray-50 border-r border-gray-100">
                    <img src={displayImages[0] || ''} alt={product.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-8 md:p-12 w-full flex flex-col overflow-y-auto">
                    <h2 className="font-display text-2xl md:text-3xl uppercase tracking-widest mb-3 font-light text-gray-900">{product.name}</h2>
                    <p className="text-lg font-medium text-gray-800 mb-6">NPR {product.price}</p>
                    <p className="text-sm font-light text-gray-500 leading-relaxed mb-8">{product.description}</p>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs uppercase font-medium tracking-widest text-gray-500">Size: <span className="text-gray-900">{selectedSize}</span></span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {product.variants.sizes.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-3 text-xs font-medium uppercase tracking-widest transition-colors border ${selectedSize === size ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-12 flex-1">
                        <span className="text-xs uppercase font-medium tracking-widest text-gray-500 block mb-3">Color</span>
                        <div className="flex gap-4">
                            {normalizedColors.map((colorObj: any) => (
                                <button
                                    key={colorObj.hex}
                                    onClick={() => setSelectedColor(colorObj.hex)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === colorObj.hex ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900 scale-100' : 'border-transparent hover:scale-110 shadow-sm'}`}
                                    style={{ backgroundColor: colorObj.hex }}
                                    title={colorObj.hex}
                                    aria-label={`Select color ${colorObj.hex}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="w-full bg-gray-900 text-white font-medium text-sm uppercase tracking-widest py-4 hover:bg-black transition-colors mt-auto shadow-sm"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
