import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export const CartDrawer = () => {
    const { isCartOpen, closeCart, items, removeItem, updateQuantity, getCartTotal } = useCartStore();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    const handleGoToCart = () => {
        closeCart();
        navigate('/cart');
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md transition-opacity"
                onClick={closeCart}
            />

            <div className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-black text-white z-[70] border-l-[16px] border-white shadow-[-20px_0_0_0_rgba(255,255,255,1)] flex flex-col animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center p-8 border-b-8 border-white">
                    <h2 className="font-display text-6xl uppercase tracking-tighter funky-glitch-text">CART</h2>
                    <button onClick={closeCart} className="hover:rotate-180 transition-transform bg-white text-black p-2 brutalist-border-white shadow-[6px_6px_0_0_rgba(255,255,255,1)]">
                        <X className="w-8 h-8" strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                    {items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <p className="font-display text-4xl uppercase mb-6 bg-white text-black p-4 rotate-2">EMPTY</p>
                            <button onClick={closeCart} className="font-bold uppercase tracking-widest text-xl underline hover:bg-white hover:text-black p-2">Resume Browsing</button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-6 border-4 border-white p-4 bg-black brutalist-shadow-lg scale-100 hover:scale-105 transition-transform rotate-1">
                                <div className="w-28 h-36 bg-white relative shrink-0 border-4 border-white grayscale">
                                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-display text-2xl uppercase tracking-tighter leading-none mb-2">{item.name}</h3>
                                        <p className="text-sm font-bold uppercase tracking-widest bg-white text-black inline-block px-2 mb-2">{item.variant.color} / {item.variant.size}</p>
                                        <p className="font-display text-3xl mt-1">NPR {item.price}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-4 bg-white text-black px-2 py-1 brutalist-border-white">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="hover:scale-125 transition-transform">
                                                <Minus className="w-4 h-4" strokeWidth={4} />
                                            </button>
                                            <span className="text-xl font-display min-w-[2rem] text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:scale-125 transition-transform">
                                                <Plus className="w-4 h-4" strokeWidth={4} />
                                            </button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="bg-red-600 text-white p-2 brutalist-border-white hover:bg-white hover:text-red-600 shadow-[6px_6px_0_0_#fff]">
                                            <Trash2 className="w-6 h-6" strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-8 border-t-8 border-white bg-black">
                        <div className="flex justify-between mb-8 font-display text-4xl uppercase">
                            <span>Total</span>
                            <span className="bg-white text-black px-4 shadow-[8px_8px_0_0_#fff] -rotate-2">NPR {getCartTotal()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-white text-black font-display text-3xl uppercase tracking-widest py-6 hover:bg-black hover:text-white transition-colors border-8 border-white shadow-[12px_12px_0_0_#fff] scale-105 hover:scale-110"
                        >
                            CHECKOUT NOW
                        </button>
                        <button
                            onClick={handleGoToCart}
                            className="w-full mt-8 text-center text-lg font-bold uppercase tracking-widest bg-gray-900 border-4 border-white py-4 hover:bg-white hover:text-black"
                        >
                            View Cart Details
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
