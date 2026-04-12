import { X, Plus, Minus } from 'lucide-react';
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
                className="fixed inset-0 bg-white/60 z-[60] backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white text-gray-900 z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-gray-100">
                <div className="flex justify-between items-center p-8 border-b border-gray-100">
                    <h2 className="font-display text-2xl uppercase tracking-widest font-light">Your Cart</h2>
                    <button onClick={closeCart} className="text-gray-400 hover:text-gray-900 transition-colors p-2">
                        <X className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                    {items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <p className="text-sm font-light uppercase tracking-widest text-gray-500 mb-6">Cart is empty</p>
                            <button onClick={closeCart} className="text-sm border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">Continue Shopping</button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-24 h-32 bg-gray-50 relative shrink-0">
                                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                            <h3 className="text-sm uppercase tracking-widest font-medium line-clamp-2">{item.name}</h3>
                                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors mt-0.5">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs uppercase text-gray-500 mb-2">{item.variant.color} / {item.variant.size}</p>
                                        <p className="text-sm font-medium">NPR {item.price}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-4 border border-gray-200 px-3 py-1">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="text-gray-400 hover:text-gray-900 transition-colors">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs min-w-[1rem] text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-8 border-t border-gray-100 bg-white">
                        <div className="flex justify-between mb-6 text-sm font-medium uppercase tracking-widest">
                            <span className="text-gray-500">Subtotal</span>
                            <span>NPR {getCartTotal()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-gray-900 text-white text-sm font-medium uppercase tracking-widest py-4 hover:bg-black transition-colors mb-4"
                        >
                            Proceed to Checkout
                        </button>
                        <button
                            onClick={handleGoToCart}
                            className="w-full text-center text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors py-2"
                        >
                            View Cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
