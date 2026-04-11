import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { Search, Clock, Truck } from 'lucide-react';
import { Box, MapPin } from 'lucide-react';

export const OrderTracking = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleTrackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber) return;

        setLoading(true);
        setError('');
        setOrderData(null);

        try {
            // Adding a slight delay to simulate processing for cool effect
            await new Promise(r => setTimeout(r, 800));

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('orderNumber', orderNumber)
                .single();

            if (error) {
                if (error.code === 'PGRST116') { // No rows returned
                    setError('Order not found. Verify your Order ID and try again.');
                } else {
                    setError('An error occurred. Please try again later.');
                }
                return;
            }
            if (data.customerEmail !== email) {
                setError('Invalid order number or email combination.');
                return;
            }
            setOrderData(data);
        } catch (err) {
            console.error('Tracking Error:', err);
            setError('System malfunction. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = (status: string) => {
        const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        return statuses.indexOf(status) !== -1 ? statuses.indexOf(status) : 0;
    };

    const isCancelled = orderData?.status === 'Cancelled';
    const currentStep = getStatusIndex(orderData?.status || 'Pending');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-5xl mx-auto px-6 py-12 md:py-24"
        >
            <div className="flex flex-col gap-12 text-center mb-16">
                <h1 className="font-display text-6xl md:text-8xl uppercase tracking-tighter bg-black text-white inline-block w-max mx-auto p-4 md:p-6 shadow-[8px_8px_0_0_#e2e8f0]">
                    RADAR
                </h1>
                <p className="text-xl md:text-2xl font-bold uppercase tracking-widest text-gray-500">
                    Locate your inbound assets.
                </p>
            </div>

            <div className="bg-white border-[6px] border-black p-8 md:p-12 shadow-[12px_12px_0_0_#000] relative max-w-2xl mx-auto mb-16">
                <form onSubmit={handleTrackSubmit} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-sm md:text-base font-black tracking-widest uppercase bg-black text-white w-max px-3 py-1 absolute -top-4 left-4 z-10">Order Identifier</label>
                        <input
                            type="text"
                            required
                            placeholder="BAD-123456"
                            value={orderNumber}
                            onChange={e => setOrderNumber(e.target.value)}
                            className="bg-gray-50 border-[3px] border-black p-5 md:p-6 outline-none focus:border-black focus:bg-white focus:ring-4 ring-black/20 transition-all font-bold text-xl md:text-2xl font-mono uppercase"
                        />
                    </div>
                    <div className="flex flex-col gap-2 relative mt-4">
                        <label className="text-sm md:text-base font-black tracking-widest uppercase bg-black text-white w-max px-3 py-1 absolute -top-4 left-4 z-10">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="Enter the email used for the order"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-gray-50 border-[3px] border-black p-5 md:p-6 outline-none focus:border-black focus:bg-white focus:ring-4 ring-black/20 transition-all font-bold text-lg md:text-xl"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white border-[3px] border-black font-display text-3xl uppercase tracking-widest py-6 hover:bg-white hover:text-black transition-all flex justify-center items-center gap-4 disabled:opacity-70 group"
                    >
                        {loading ? (
                            <span className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full group-hover:border-black group-hover:border-t-transparent"></span>
                        ) : (
                            <>
                                INITIALIZE SCAN <Search className="w-8 h-8" />
                            </>
                        )}
                    </button>
                    {error && (
                        <div className="bg-red-500 text-white font-bold p-4 text-center mt-2 border-2 border-red-900 animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}
                </form>
            </div>

            <AnimatePresence>
                {orderData && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border-[6px] border-black shadow-[12px_12px_0_0_#000] p-8 md:p-16 mb-24"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-black pb-8 mb-12 gap-6">
                            <div>
                                <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tighter mix-blend-difference mb-2">STATUS REPORT</h2>
                                <p className="text-xl font-bold uppercase tracking-widest text-gray-500">ID: {orderData.orderNumber}</p>
                            </div>
                            <div className={`px-6 py-3 font-display text-3xl uppercase border-4 shadow-[4px_4px_0_0_#000] ${isCancelled ? 'bg-red-500 border-red-900 text-white' :
                                orderData.status === 'Delivered' ? 'bg-green-400 border-green-800 text-black' :
                                    'bg-yellow-400 border-black text-black'
                                }`}>
                                {orderData.status}
                            </div>
                        </div>

                        {!isCancelled && (
                            <div className="relative mb-20 max-w-3xl mx-auto">
                                <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 -translate-y-1/2 z-0 hidden md:block"></div>
                                <div className="absolute top-1/2 left-0 h-2 bg-black -translate-y-1/2 z-0 transition-all duration-1000 hidden md:block" style={{ width: `${(currentStep / 3) * 100}%` }}></div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-8 md:gap-0">
                                    {[
                                        { title: 'Pending', icon: Clock },
                                        { title: 'Processing', icon: Box },
                                        { title: 'Shipped', icon: Truck },
                                        { title: 'Delivered', icon: MapPin }
                                    ].map((step, idx) => {
                                        const Icon = step.icon;
                                        const isActive = idx <= currentStep;
                                        const isCurrent = idx === currentStep;
                                        return (
                                            <div key={idx} className="flex flex-row md:flex-col items-center gap-4 md:gap-4 w-full md:w-auto">
                                                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-500 shadow-md md:shadow-[4px_4px_0_0_#000] shrink-0 ${isActive ? 'bg-black border-black text-white' : 'bg-white border-gray-300 text-gray-400'
                                                    } ${isCurrent ? 'scale-110 ring-4 ring-black/20' : ''}`}>
                                                    <Icon className="w-8 h-8" />
                                                </div>
                                                <div className="flex flex-col md:items-center">
                                                    <span className={`font-black uppercase tracking-widest md:text-center text-lg ${isActive ? 'text-black' : 'text-gray-400'}`}>
                                                        {step.title}
                                                    </span>
                                                    {isCurrent && <span className="text-xs font-bold bg-black text-white px-2 py-1 uppercase mt-1">CURRENT</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-4 border-black pt-12">
                            <div>
                                <h3 className="font-display text-3xl uppercase mb-6 bg-black text-white inline-block px-4 py-2">DESTINATION</h3>
                                <div className="bg-gray-50 border-2 border-black p-6 font-bold text-lg leading-relaxed shadow-[4px_4px_0_0_#000]">
                                    <p className="uppercase text-xl mb-2">{orderData.shippingAddress?.name}</p>
                                    <p>{orderData.shippingAddress?.address}</p>
                                    <p className="mt-4 pt-4 border-t-2 border-dashed border-gray-300 text-gray-500">CONTACT: {orderData.shippingAddress?.contactNumber}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-display text-3xl uppercase mb-6 bg-black text-white inline-block px-4 py-2">MANIFEST</h3>
                                <div className="bg-gray-50 border-2 border-black p-6 shadow-[4px_4px_0_0_#000]">
                                    <div className="flex flex-col gap-4 mb-6 max-h-64 overflow-y-auto pr-2">
                                        {orderData.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-sm font-bold border-b-2 border-dashed border-gray-300 pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-black text-white px-2 py-1 font-display text-lg">{item.quantity}X</span>
                                                    <span className="uppercase">{item.name} <span className="text-gray-500">[{item.variant?.size}]</span></span>
                                                </div>
                                                <span className="font-mono text-lg">NPR {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center text-2xl font-display uppercase pt-4 border-t-4 border-black">
                                        <span>TOTAL</span>
                                        <span>NPR {orderData.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};