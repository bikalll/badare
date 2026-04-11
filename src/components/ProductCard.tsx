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
            className="group flex flex-col gap-4 relative cursor-pointer brutalist-border p-2 bg-white brutalist-shadow-lg transition-transform hover:-translate-y-2 hover:translate-x-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-black brutalist-border grayscale contrast-[120%] group-hover:grayscale-0 transition-all duration-300">
                <Link to={`/product/${product.id}`} className="absolute inset-0">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
                    />
                    {product.images[1] && (
                        <img
                            src={product.images[1]}
                            alt={`${product.name} alternate`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </Link>

                {product.isNew && (
                    <span className="absolute top-4 left-4 bg-white text-black text-sm font-black px-4 py-2 uppercase tracking-widest z-10 brutalist-border shadow-[4px_4px_0_0_#000] transform -rotate-6 group-hover:rotate-0 transition-transform">
                        New
                    </span>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <button
                        onClick={(e) => { e.preventDefault(); openQuickView(product.id); }}
                        className="w-full bg-white text-black font-display uppercase tracking-widest py-4 text-xl flex items-center justify-center gap-3 inverted-hover brutalist-border shadow-[4px_4px_0_0_#000]"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        Quick View
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row justify-between items-start pt-2 px-2 gap-3 xl:gap-0">
                <Link to={`/product/${product.id}`} className="hover:funky-glitch-text transition-all flex-1 pr-2">
                    <h3 className="font-display font-black text-lg md:text-xl uppercase leading-tight bg-black text-white px-2 py-1 brutalist-skew inline-block mb-1">{product.name}</h3>
                    <p className="text-xs md:text-sm text-black font-bold uppercase tracking-widest mt-1 px-1">{product.category}</p>
                </Link>
                {!hidePrice && (
                    <span className="font-display font-black text-xl md:text-2xl bg-white text-black brutalist-border shadow-[4px_4px_0_0_#000] px-2 py-1 transform rotate-2 shrink-0 self-start">NPR {product.price}</span>
                )}
            </div>
        </div>
    );
};
