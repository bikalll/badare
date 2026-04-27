import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Asterisk } from 'lucide-react';

export const Checkout = () => {
    const { items, getCartTotal, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation

    const [shippingData, setShippingData] = useState({
        email: '', firstName: '', lastName: '', address: '', contactNumber: ''
    });
    const [paymentPhone, setPaymentPhone] = useState('');
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (items.length === 0 && !isOrderPlaced) {
            navigate('/cart');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Generate a shorter, punchy order number
        const randomSegment = Math.random().toString(36).substring(2, 8).toUpperCase();
        const generatedOrderNumber = `BAD-${randomSegment}`;

        const orderData = {
            orderNumber: generatedOrderNumber,
            customerEmail: shippingData.email,
            shippingAddress: {
                name: `${shippingData.firstName} ${shippingData.lastName}`,
                address: shippingData.address,
                contactNumber: paymentPhone || shippingData.contactNumber
            },
            items: [...items],
            total: getCartTotal(),
            status: 'Pending'
        };

        const { error } = await supabase.from('orders').insert([orderData]);

        if (error) {
            console.error("Order insertion failed:", error);
            alert("Error Processing Order. Please try again.");
            return;
        }

        // Trigger email notification Edge Function
        try {
            await supabase.functions.invoke('send-order-email', {
                body: {
                    orderDetails: orderData,
                    customerEmail: shippingData.email,
                    adminEmail: 'bikalniraulaa@gmail.com'
                }
            });
        } catch (emailError) {
            console.warn("Emails may not have sent, but order was recorded:", emailError);
        }

        setIsOrderPlaced(true);
        clearCart();
        navigate('/order-confirmation/' + orderData.orderNumber, { state: { orderDetails: orderData } });
        window.scrollTo(0, 0);
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-6 py-12 md:py-24"
        >
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                {/* Left Column: Flow */}
                <div className="w-full lg:w-3/5">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-12 font-medium text-xs uppercase tracking-widest text-gray-400">
                        <span className={step === 1 ? 'text-gray-900 border-b border-gray-900 pb-1' : ''}>1. Shipping</span>
                        <span className={step === 2 ? 'text-gray-900 border-b border-gray-900 pb-1' : ''}>2. Payment</span>
                        <span>3. Complete</span>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleShippingSubmit} className="flex flex-col gap-8 animate-in fade-in duration-300">
                            <h2 className="font-display text-2xl uppercase tracking-widest text-gray-900 font-light mb-2">Delivery Details</h2>

                            <div className="flex flex-col gap-2 relative">
                                <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Email Address</label>
                                <input type="email" required value={shippingData.email} onChange={e => setShippingData({ ...shippingData, email: e.target.value })} className="bg-white border border-gray-200 p-4 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light text-sm" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2 relative">
                                    <label className="text-xs font-medium tracking-widest uppercase text-gray-500">First Name</label>
                                    <input type="text" required value={shippingData.firstName} onChange={e => setShippingData({ ...shippingData, firstName: e.target.value })} className="bg-white border border-gray-200 p-4 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light text-sm" />
                                </div>
                                <div className="flex flex-col gap-2 relative">
                                    <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Last Name</label>
                                    <input type="text" required value={shippingData.lastName} onChange={e => setShippingData({ ...shippingData, lastName: e.target.value })} className="bg-white border border-gray-200 p-4 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light text-sm" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Address</label>
                                <input type="text" required value={shippingData.address} onChange={e => setShippingData({ ...shippingData, address: e.target.value })} className="bg-white border border-gray-200 p-4 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light text-sm" />
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Contact Number</label>
                                <input type="tel" required value={shippingData.contactNumber} onChange={e => setShippingData({ ...shippingData, contactNumber: e.target.value })} className="bg-white border border-gray-200 p-4 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light text-sm" />
                            </div>

                            <button type="submit" className="bg-gray-900 w-full text-white font-medium text-sm uppercase tracking-widest py-4 hover:bg-black transition-colors shadow-sm mt-4">
                                Continue to Payment
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-8 animate-in fade-in duration-300">
                            <h2 className="font-display text-2xl uppercase tracking-widest text-gray-900 font-light mb-2">Payment</h2>

                            <div className="p-4 bg-gray-50 border border-gray-100 text-gray-600 text-xs tracking-widest uppercase text-center mb-4">
                                Demo Mode: Scan QR or Enter arbitrary code.
                            </div>

                            <div className="flex flex-col gap-8 items-center pb-8 border-b border-gray-100">
                                <div className="bg-white border border-gray-200 p-4">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BADARE_PAYMENT_NODE" alt="Payment QR Code Placeholder" className="w-48 h-48 md:w-56 md:h-56 object-cover" />
                                </div>
                                <p className="text-xs font-light tracking-widest text-gray-500 uppercase text-center max-w-sm">
                                    Awaiting Payment Verification
                                </p>
                                <div className="flex flex-col gap-2 relative w-full mt-4">
                                    <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Confirmation Code / Number</label>
                                    <input type="text" required value={paymentPhone} onChange={e => setPaymentPhone(e.target.value)} placeholder="Enter details..." className="w-full bg-white border border-gray-200 p-4 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-sm font-light placeholder-gray-400 text-center" />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="font-medium text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors py-4">
                                    Return to Shipping
                                </button>
                                <button type="submit" className="bg-gray-900 w-full md:w-auto text-white font-medium text-sm uppercase tracking-widest px-10 py-4 hover:bg-black transition-colors shadow-sm">
                                    Complete Order
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Right Column: Mini Cart Summary */}
                <div className="w-full lg:w-2/5">
                    <div className="bg-gray-50 border border-gray-100 p-8 lg:sticky lg:top-32">
                        <h2 className="text-sm font-medium uppercase tracking-widest mb-8 border-b border-gray-200 pb-4 text-gray-900">Order Summary</h2>

                        <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover border border-gray-200" />
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <p className="text-sm uppercase tracking-widest text-gray-900 font-medium line-clamp-1">{item.name}</p>
                                            <p className="text-xs uppercase text-gray-500 mt-1">{item.variant.size} / {item.variant.color}</p>
                                            {item.customDesign && (
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8860B] font-semibold mt-1 flex items-center gap-1">
                                                    <Asterisk className="w-3 h-3" /> Custom Graphic
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-end mt-2 text-sm">
                                            <p className="text-gray-500 font-light">Qty: {item.quantity}</p>
                                            <p className="font-medium text-gray-900">NPR {item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-4 text-xs font-medium uppercase tracking-widest text-gray-500 border-t border-gray-200 pt-6">
                            <span>Subtotal</span>
                            <span>NPR {getCartTotal()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-xs font-medium uppercase tracking-widest text-gray-500">
                            <span>Shipping</span>
                            <span>Complimentary</span>
                        </div>
                        <div className="flex justify-between items-center pt-6 border-t border-gray-200 text-sm font-medium uppercase tracking-widest text-gray-900">
                            <span>Total</span>
                            <span>NPR {getCartTotal()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
