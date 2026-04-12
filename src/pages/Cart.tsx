import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';

export const Cart = () => {
    const { items, getCartTotal, removeItem, updateQuantity } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-6 py-12 md:py-24"
        >
            <h1 className="font-display text-3xl md:text-4xl uppercase tracking-widest mb-16 font-light text-center">Your Cart</h1>

            {items.length === 0 ? (
                <div className="text-center py-24 border-t border-b border-gray-100">
                    <p className="text-sm font-light uppercase tracking-widest mb-8 text-gray-500">Your cart is currently empty.</p>
                    <Link to="/shop" className="inline-block bg-gray-900 text-white font-medium text-sm uppercase tracking-widest px-10 py-4 hover:bg-black transition-colors shadow-sm">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    <div className="w-full lg:w-2/3">
                        <div className="hidden md:grid grid-cols-6 gap-4 border-b border-gray-200 pb-4 mb-8 text-xs uppercase font-medium tracking-widest text-gray-400">
                            <div className="col-span-3">Product</div>
                            <div className="col-span-1 text-center">Price</div>
                            <div className="col-span-1 text-center">Quantity</div>
                            <div className="col-span-1 text-right">Total</div>
                        </div>

                        <div className="flex flex-col gap-8">
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-8 items-center border-b border-gray-100 pb-8 md:pb-0 md:border-0 last:border-0">
                                    <div className="col-span-3 flex gap-6">
                                        <img src={item.image} alt={item.name} className="w-20 h-28 object-cover bg-gray-50 border border-gray-100" />
                                        <div className="flex flex-col justify-center">
                                            <Link to={`/product/${item.productId}`} className="font-medium text-sm text-gray-900 uppercase tracking-widest hover:text-gray-500 transition-colors">{item.name}</Link>
                                            <p className="text-xs uppercase tracking-widest text-gray-500 mt-2">{item.variant.color} / {item.variant.size}</p>
                                            <button onClick={() => removeItem(item.id)} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 mt-4 w-fit uppercase tracking-widest">
                                                <Trash2 className="w-3 h-3" /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:text-center text-sm font-light text-gray-900 hidden md:block">
                                        NPR {item.price}
                                    </div>

                                    <div className="col-span-1 flex justify-start md:justify-center">
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

                                    <div className="col-span-1 text-right text-sm font-medium text-gray-900 hidden md:block">
                                        NPR {item.price * item.quantity}
                                    </div>

                                    <div className="col-span-1 flex justify-between items-center md:hidden font-medium text-sm text-gray-900 mt-4">
                                        <span className="text-xs text-gray-500 uppercase tracking-widest">Total</span>
                                        <span>NPR {item.price * item.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3">
                        <div className="bg-gray-50 border border-gray-100 p-8 lg:sticky lg:top-32">
                            <h2 className="text-sm font-medium uppercase tracking-widest mb-8 border-b border-gray-200 pb-4 text-gray-900">Order Summary</h2>
                            <div className="flex justify-between items-center mb-4 text-xs font-medium uppercase tracking-widest text-gray-500">
                                <span>Subtotal</span>
                                <span>NPR {getCartTotal()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6 text-xs font-medium uppercase tracking-widest text-gray-500">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-200 text-sm font-medium uppercase tracking-widest text-gray-900">
                                <span>Total</span>
                                <span>NPR {getCartTotal()}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-gray-900 text-white font-medium text-sm uppercase tracking-widest py-4 hover:bg-black transition-colors shadow-sm"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="mt-6 flex justify-center">
                                <Link to="/shop" className="text-xs uppercase font-medium tracking-widest text-gray-500 hover:text-gray-900 transition-colors py-2 border-b border-transparent hover:border-gray-900">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
