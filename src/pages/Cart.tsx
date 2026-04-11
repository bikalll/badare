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
            className="max-w-7xl mx-auto px-6 py-12 md:py-24"
        >
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter mb-12">Your Cart</h1>

            {items.length === 0 ? (
                <div className="text-center py-24 border-y border-muted">
                    <p className="font-display text-2xl uppercase mb-6 text-gray-800">Your cart is currently empty.</p>
                    <Link to="/shop" className="inline-block bg-black text-white font-display text-lg uppercase tracking-widest px-10 py-5 hover:bg-white hover:text-black border-2 border-black transition-all shadow-md hover:shadow-none">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    <div className="w-full lg:w-2/3">
                        <div className="hidden md:grid grid-cols-6 gap-4 border-b border-black pb-4 mb-8 text-xs uppercase font-bold tracking-widest text-gray-500">
                            <div className="col-span-3">Product</div>
                            <div className="col-span-1 text-center">Price</div>
                            <div className="col-span-1 text-center">Quantity</div>
                            <div className="col-span-1 text-right">Total</div>
                        </div>

                        <div className="flex flex-col gap-8">
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-8 items-center border-b border-muted pb-8 md:pb-0 md:border-0 last:border-0">
                                    <div className="col-span-3 flex gap-6">
                                        <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-muted" />
                                        <div className="flex flex-col justify-center">
                                            <Link to={`/product/${item.productId}`} className="font-bold text-sm uppercase hover:underline transition-colors">{item.name}</Link>
                                            <p className="text-sm text-gray-500 mt-1">{item.variant.color} / {item.variant.size}</p>
                                            <button onClick={() => removeItem(item.id)} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 mt-4 w-fit">
                                                <Trash2 className="w-3 h-3" /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:text-center text-sm font-medium hidden md:block">
                                        NPR {item.price}
                                    </div>

                                    <div className="col-span-1 flex justify-start md:justify-center">
                                        <div className="flex items-center gap-4 border border-muted px-2 py-1">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 hover:text-black">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-black">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-span-1 text-right text-sm font-medium hidden md:block">
                                        NPR {item.price * item.quantity}
                                    </div>

                                    <div className="col-span-1 flex justify-between items-center md:hidden font-medium">
                                        <span>NPR {item.price * item.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3">
                        <div className="bg-muted p-8 lg:sticky lg:top-32">
                            <h2 className="font-display text-2xl uppercase tracking-tighter mb-6 border-b border-black pb-4">Order Summary</h2>
                            <div className="flex justify-between items-center mb-4 text-sm font-bold uppercase tracking-widest text-gray-600">
                                <span>Subtotal</span>
                                <span>NPR {getCartTotal()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6 text-sm font-bold uppercase tracking-widest text-gray-600">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between items-center mb-8 pt-4 border-t border-black font-display text-2xl uppercase">
                                <span>Total</span>
                                <span>NPR {getCartTotal()}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-black text-white font-display text-xl uppercase tracking-widest py-5 hover:bg-white hover:text-black border-2 border-black transition-all shadow-md hover:shadow-none"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="mt-6 flex justify-center">
                                <Link to="/shop" className="text-xs uppercase font-bold tracking-widest underline hover:bg-black hover:text-white px-2 py-1 transition-colors">
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
