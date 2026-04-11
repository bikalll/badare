import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

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
        navigate('/order-confirmation/' + orderData.orderNumber);
        window.scrollTo(0, 0);
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 py-12 md:py-24"
        >
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                {/* Left Column: Flow */}
                <div className="w-full lg:w-3/5">
                    <div className="flex justify-between items-center border border-black p-4 mb-12 font-display text-xl md:text-2xl uppercase bg-white shadow-sm">
                        <span className={step === 1 ? 'text-white bg-black px-4 py-2' : 'text-gray-400 opacity-60'}>1. SHIPPING</span>
                        <span className={step === 2 ? 'text-white bg-black px-4 py-2' : 'text-gray-400 opacity-60'}>2. PAYMENT</span>
                        <span className="text-gray-400 opacity-60">3. DONE</span>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleShippingSubmit} className="flex flex-col gap-8 animate-in fade-in duration-300">
                            <h2 className="font-display text-5xl uppercase tracking-tighter bg-black text-white inline-block w-max p-4 mb-4 shadow-sm">LOGISTICS</h2>

                            <div className="flex flex-col gap-2 relative">
                                <label className="text-sm md:text-base font-bold tracking-widest uppercase bg-black text-white w-max px-3 py-1 absolute -top-3 left-4 z-10">Email</label>
                                <input type="email" required value={shippingData.email} onChange={e => setShippingData({...shippingData, email: e.target.value})} className="bg-white border-2 border-black p-4 md:p-6 outline-none hover:border-gray-600 focus:border-black focus:ring-2 ring-black/10 transition-all font-bold text-lg md:text-xl" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="flex flex-col gap-2 relative">
                                    <label className="text-sm md:text-base font-bold tracking-widest uppercase bg-black text-white w-max px-3 py-1 absolute -top-3 left-4 z-10">First Name</label>
                                    <input type="text" required value={shippingData.firstName} onChange={e => setShippingData({...shippingData, firstName: e.target.value})} className="bg-white border-2 border-black p-4 md:p-6 outline-none hover:border-gray-600 focus:border-black focus:ring-2 ring-black/10 transition-all font-bold text-lg md:text-xl" />
                                </div>
                                <div className="flex flex-col gap-2 relative">
                                    <label className="text-sm md:text-base font-bold tracking-widest uppercase bg-black text-white w-max px-3 py-1 absolute -top-3 left-4 z-10">Last Name</label>
                                    <input type="text" required value={shippingData.lastName} onChange={e => setShippingData({...shippingData, lastName: e.target.value})} className="bg-white border-2 border-black p-4 md:p-6 outline-none hover:border-gray-600 focus:border-black focus:ring-2 ring-black/10 transition-all font-bold text-lg md:text-xl" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 relative mt-4">
                                <label className="text-sm md:text-base font-bold tracking-widest uppercase bg-black text-white w-max px-3 py-1 absolute -top-3 left-4 z-10">Delivery Address</label>
                                <input type="text" required value={shippingData.address} onChange={e => setShippingData({...shippingData, address: e.target.value})} className="bg-white border-2 border-black p-4 md:p-6 outline-none hover:border-gray-600 focus:border-black focus:ring-2 ring-black/10 transition-all font-bold text-lg md:text-xl" />
                            </div>

                            <div className="flex flex-col gap-2 relative mt-4">
                                <label className="text-sm md:text-base font-bold tracking-widest uppercase bg-black text-white w-max px-3 py-1 absolute -top-3 left-4 z-10">Contact Number</label>
                                <input type="tel" required value={shippingData.contactNumber} onChange={e => setShippingData({...shippingData, contactNumber: e.target.value})} className="bg-white border-2 border-black p-4 md:p-6 outline-none hover:border-gray-600 focus:border-black focus:ring-2 ring-black/10 transition-all font-bold text-lg md:text-xl" />
                            </div>

                            <button type="submit" className="bg-white w-full text-black border-2 border-black shadow-lg font-display text-2xl uppercase tracking-widest py-6 hover:bg-black hover:text-white transition-all mt-8">
                                PURSUE PAYMENT
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-8 animate-in fade-in duration-300">
                            <h2 className="font-display text-5xl uppercase tracking-tighter bg-black text-white inline-block w-max p-4 mb-4 shadow-sm">FUNDS</h2>
                            <div className="p-6 bg-gray-100 text-black text-base md:text-lg font-bold border-l-4 border-black">
                                DEMO MODE: ENTER ARBITRARY DATA OR MOCK THE QR SCAN.
                            </div>

                            <div className="flex flex-col gap-6 md:gap-8 mt-4 items-center border-b border-gray-300 pb-12">
                                <div className="bg-white border-2 border-black p-4 shadow-sm">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BADARE_PAYMENT_NODE" alt="Payment QR Code Placeholder" className="w-48 h-48 md:w-56 md:h-56 object-cover" />
                                </div>
                                <p className="text-sm md:text-base font-medium uppercase tracking-widest text-center max-w-sm mt-2 leading-relaxed text-gray-500">
                                    SCAN TO TRANSMIT FUNDS. ENTER YOUR PHONE NUMBER BELOW TO VERIFY.
                                </p>
                                <div className="flex flex-col gap-2 relative w-full mt-4">
                                    <label className="text-sm md:text-base font-bold tracking-widest uppercase bg-black text-white w-max px-3 py-1 absolute -top-3 left-4 z-10">Verification Number</label>
                                    <input type="tel" required value={paymentPhone} onChange={e => setPaymentPhone(e.target.value)} placeholder="+977" className="w-full bg-white border-2 border-black p-4 md:p-6 outline-none hover:border-gray-600 focus:border-black focus:ring-2 ring-black/10 transition-all font-mono font-bold text-xl md:text-3xl placeholder-gray-300" />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center mt-2 gap-4">
                                <button type="button" onClick={() => setStep(1)} className="font-display w-full md:w-auto text-lg md:text-xl uppercase tracking-widest border border-gray-400 px-6 py-4 hover:border-black transition-colors text-gray-600 hover:text-black">
                                    ← RETURN
                                </button>
                                <button type="submit" className="bg-black w-full md:w-auto text-white border-2 border-black shadow-lg font-display text-xl md:text-2xl uppercase tracking-widest py-5 px-10 hover:bg-white hover:text-black transition-all">
                                    FINALIZE PURCHASE
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Right Column: Mini Cart Summary */}
                <div className="w-full lg:w-2/5">
                    <div className="bg-white border-2 border-black shadow-lg p-6 lg:p-8 lg:sticky lg:top-32">
                        <h2 className="font-display text-4xl uppercase tracking-tighter mb-8 border-b-2 border-black pb-4">INVENTORY</h2>

                        <div className="flex flex-col gap-6 mb-12 max-h-[40vh] overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover border border-gray-300" />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <p className="font-display text-lg uppercase text-black leading-none">{item.name}</p>
                                            <p className="text-xs font-bold text-gray-500 mt-1">{item.variant.size} / {item.variant.color}</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-sm font-black text-gray-600">Qty: {item.quantity}</p>
                                            <p className="font-display text-xl">NPR {item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-4 text-lg font-bold uppercase tracking-widest text-gray-600 border-t border-gray-200 pt-4">
                            <span>Subtotal</span>
                            <span>NPR {getCartTotal()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-lg font-bold uppercase tracking-widest text-gray-600">
                            <span>Shipping</span>
                            <span>NPR 0</span>
                        </div>
                        <div className="flex justify-between items-center p-4 border-t-2 border-black text-black font-display text-4xl uppercase">
                            <span>TOTAL</span>
                            <span>NPR {getCartTotal()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
