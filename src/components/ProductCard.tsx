import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

interface ProductCardProps {
    product: any;
    hidePrice?: boolean;
}

export const ProductCard = ({ product, hidePrice }: ProductCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { openQuickView } = useCartStore();

    return (
        <div
            className="group flex flex-col gap-4 relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100/50 mb-1">
                <Link to={`/product/${product.id}`} className="absolute inset-0 block overflow-hidden">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] ease-[0.25,0.46,0.45,0.94] group-hover:scale-105 ${isHovered && product.images[1] ? 'opacity-0 scale-110' : 'opacity-100'}`}
                    />
                    {product.images[1] && (
                        <img
                            src={product.images[1]}
                            alt={`${product.name} alternate`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] ease-[0.25,0.46,0.45,0.94] group-hover:scale-105 scale-95 ${isHovered ? 'opacity-100 scale-105' : 'opacity-0'}`}
                        />
                    )}
                </Link>

                {product.isNew && (
                    <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold px-3 py-1.5 tracking-[0.2em] uppercase z-10 shadow-lg">
                        New In
                    </span>
                )}

                <div 
                    className={`absolute bottom-0 left-0 right-0 p-4 xl:p-6 z-10 transition-transform duration-500 ease-out ${isHovered ? 'translate-y-0' : 'translate-y-[120%]'}`}
                >
                    <button
                        onClick={(e) => { e.preventDefault(); openQuickView(product.id); }}
                        className="w-full bg-white/80 backdrop-blur-md text-black font-semibold text-xs tracking-[0.2em] uppercase py-4 flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Quick View
                    </button>
                </div>
            </div>

            <div className="flex flex-col text-center items-center justify-center gap-2 px-2">
                <Link to={`/product/${product.id}`} className="flex flex-col items-center">
                    <h3 className="font-display text-lg text-gray-900 leading-tight group-hover:text-gray-500 transition-colors">{product.name}</h3>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 mt-1 font-semibold">{product.category}</p>
                </Link>
                {!hidePrice && (
                    <span className="font-medium text-sm text-gray-900 mt-1">NPR {product.price.toLocaleString()}</span>
                )}
            </div>
        </div>
    );
};
