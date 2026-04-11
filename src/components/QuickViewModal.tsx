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
            setSelectedColor(product.variants.colors[0]);
        }
    }, [product]);

    if (!product) return null;

    const handleAdd = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeQuickView} />

            <div className="relative bg-primary-bg w-full max-w-4xl flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] border-4 border-black md:h-auto overflow-hidden">
                <button
                    onClick={closeQuickView}
                    className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-white border-2 border-black p-2 hover:bg-black hover:text-white transition-colors brutalist-shadow"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="w-full md:w-1/2 h-48 md:h-[600px] shrink-0 bg-muted border-b-4 md:border-b-0 md:border-r-4 border-black">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-6 md:p-12 w-full flex flex-col overflow-y-auto">
                    <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tighter mb-2">{product.name}</h2>
                    <p className="text-xl font-medium mb-4">NPR {product.price}</p>
                    <p className="text-sm text-gray-600 mb-6">{product.description}</p>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs uppercase font-bold tracking-widest">Size: {selectedSize}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {product.variants.sizes.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`border py-3 text-sm font-medium transition-colors ${selectedSize === size ? 'border-primary-text bg-primary-text text-primary-bg' : 'border-muted hover:border-black'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-10 flex-1">
                        <span className="text-xs uppercase font-bold tracking-widest block mb-3">Color:</span>
                        <div className="flex gap-3">
                            {product.variants.colors.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === color ? 'border-primary-text scale-110' : 'border-transparent hover:scale-110'}`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="w-full bg-black text-white font-display text-lg uppercase tracking-widest py-4 hover:bg-white hover:text-black transition-colors mt-auto border-2 border-transparent hover:border-black brutalist-border"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
