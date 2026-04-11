import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';

export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCartStore();
    const { products } = useProductStore();

    const product = products.find((p) => p.id === id);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (product) {
            setSelectedSize(product.variants.sizes[0]);
            setSelectedColor(product.variants.colors[0]);
        } else {
            navigate('/shop');
        }
    }, [product, navigate]);

    if (!product) return null;

    const handleAdd = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity,
            variant: {
                size: selectedSize,
                color: selectedColor
            }
        });
        
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8 md:py-16 pt-24"
        >
            {/* Breadcrumb / Back Navigation */}
            <nav className="flex items-center text-sm font-medium text-gray-500 mb-8 md:mb-12 space-x-2">
                <button 
                    onClick={() => navigate('/shop')} 
                    className="hover:text-black transition-colors flex items-center gap-2 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Shop</span>
                </button>
                <span>/</span>
                <span className="text-gray-900">{product.category || 'Collection'}</span>
                <span>/</span>
                <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                {/* Left Column: Image Gallery */}
                <div className="w-full lg:w-3/5 flex flex-col md:flex-row-reverse gap-4 md:gap-6">
                    {/* Main Image */}
                    <div className="w-full bg-slate-50 relative aspect-[4/5] overflow-hidden group">
                        <img
                            src={product.images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                        />
                    </div>
                    
                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar md:w-24 shrink-0">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`relative w-20 md:w-full aspect-[4/5] bg-slate-50 overflow-hidden transition-all duration-300 ${
                                    activeImage === idx 
                                    ? 'ring-1 ring-black ring-offset-2 opacity-100' 
                                    : 'opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img 
                                    src={img} 
                                    alt={`View ${idx + 1}`} 
                                    className="w-full h-full object-cover" 
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className="w-full lg:w-2/5 flex flex-col justify-start">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 leading-tight pr-8">
                            {product.name}
                        </h1>
                        <button className="text-gray-400 hover:text-red-500 transition-colors mt-2">
                            <Heart className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="text-2xl font-medium text-gray-900 mb-8">
                        NPR {product.price.toLocaleString()}
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed font-light">
                        <p>{product.description}</p>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">Color</span>
                            <span className="text-sm text-gray-500 capitalize">{selectedColor}</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.colors.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                                        selectedColor === color 
                                        ? 'ring-2 ring-black ring-offset-2' 
                                        : 'ring-1 ring-gray-200 hover:ring-gray-400'
                                    }`}
                                >
                                    <span 
                                        className="w-8 h-8 rounded-full shadow-inner" 
                                        style={{ backgroundColor: color }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">Size</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {product.variants.sizes.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-3 text-sm font-medium transition-all ${
                                        selectedSize === size 
                                        ? 'bg-black text-white border border-black' 
                                        : 'bg-white text-gray-900 border border-gray-200 hover:border-black'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between border border-gray-200 px-4 py-4 sm:w-1/3">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                                className="text-gray-400 hover:text-black transition-colors"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-base font-medium">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)} 
                                className="text-gray-400 hover:text-black transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAdd}
                            disabled={isAdded}
                            className={`flex-1 flex justify-center items-center py-4 px-8 text-sm font-medium uppercase tracking-widest transition-all ${
                                isAdded 
                                ? 'bg-green-600 text-white border-green-600' 
                                : 'bg-black text-white border border-black hover:bg-gray-900'
                            }`}
                        >
                            {isAdded ? 'Added to Bag' : 'Add to Bag'}
                        </button>
                    </div>

                    {/* Additional Info Accordions (Static layout for premium feel) */}
                    <div className="border-t border-gray-200 divide-y divide-gray-200">
                        {product.editorNotes && (
                            <div className="py-5">
                                <div className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">Editor's Notes</div>
                                <p className="text-sm text-gray-600 font-light leading-relaxed">
                                    {product.editorNotes}
                                </p>
                            </div>
                        )}
                        <div className="py-5 flex items-center gap-4 text-sm text-gray-900 uppercase tracking-wider font-medium cursor-pointer hover:text-gray-600 transition-colors">
                            <Share2 className="w-4 h-4"/> Share
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Minimalist CSS for hiding scrollbar on webkit if needed */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </motion.div>
    );
};
