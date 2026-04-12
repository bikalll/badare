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

        // Sanitize input values
        const cleanOrder = orderNumber.trim().toUpperCase();
        const cleanEmail = email.trim().toLowerCase();

        try {
            // Adding a slight delay to simulate processing for cool effect
            await new Promise(r => setTimeout(r, 800));

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('orderNumber', cleanOrder)
                .maybeSingle();

            if (error) {
                setError('An error occurred. Please try again later.');
                return;
            }

            if (!data) {
                setError('Order not found. Verify your Order ID and try again.');
                return;
            }

            if (data.customerEmail?.toLowerCase() !== cleanEmail) {
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
            <div className="flex flex-col gap-6 text-center mb-16">
                <h1 className="font-display text-3xl md:text-4xl uppercase tracking-widest font-light text-gray-900">
                    Order Tracking
                </h1>
                <p className="text-sm font-light uppercase tracking-widest text-gray-500">
                    Check the status of your recent delivery.
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-8 md:p-12 relative max-w-xl mx-auto mb-16 shadow-sm">
                <form onSubmit={handleTrackSubmit} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Order Number</label>
                        <input
                            type="text"
                            required
                            placeholder="BAD-123456"
                            value={orderNumber}
                            onChange={e => setOrderNumber(e.target.value)}
                            className="bg-white border border-gray-200 p-4 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-sm font-medium uppercase tracking-widest placeholder-gray-300"
                        />
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-xs font-medium tracking-widest uppercase text-gray-500">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="Email used for the order"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-white border border-gray-200 p-4 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-sm font-light placeholder-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gray-900 text-white font-medium text-sm uppercase tracking-widest py-4 hover:bg-black transition-colors flex justify-center items-center gap-3 disabled:opacity-70 group shadow-sm mt-4"
                    >
                        {loading ? (
                            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full opacity-80"></span>
                        ) : (
                            <>
                                Track Order <Search className="w-4 h-4 opacity-70" />
                            </>
                        )}
                    </button>
                    {error && (
                        <div className="text-red-500 text-xs font-medium uppercase tracking-widest text-center mt-2 animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}
                </form>
            </div>

            <AnimatePresence>
                {orderData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-100 p-8 md:p-12 mb-24 shadow-sm"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-8 mb-12 gap-6">
                            <div>
                                <h2 className="text-lg font-medium uppercase tracking-widest text-gray-900 mb-2">Status Report</h2>
                                <p className="text-xs font-light uppercase tracking-widest text-gray-500">ID: {orderData.orderNumber}</p>
                            </div>
                            <div className={`px-4 py-2 text-xs font-medium uppercase tracking-widest border ${isCancelled ? 'bg-red-50 border-red-200 text-red-600' :
                                orderData.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                                    'bg-gray-100 border-gray-200 text-gray-900'
                                }`}>
                                {orderData.status}
                            </div>
                        </div>

                        {!isCancelled && (
                            <div className="relative mb-16 max-w-3xl mx-auto px-4">
                                <div className="absolute top-1/2 left-8 right-8 h-px bg-gray-200 -translate-y-1/2 z-0 hidden md:block"></div>
                                <div className="absolute top-1/2 left-8 h-px bg-gray-900 -translate-y-1/2 z-0 transition-all duration-1000 hidden md:block" style={{ width: `calc(${(currentStep / 3) * 100}% - 4rem)` }}></div>

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
                                            <div key={idx} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto">
                                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 ${isActive ? 'bg-gray-900 border-gray-900 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-300'
                                                    } ${isCurrent ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}>
                                                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                                                </div>
                                                <div className="flex flex-col md:items-center">
                                                    <span className={`text-xs uppercase tracking-widest md:text-center font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {step.title}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12 mt-8">
                            <div>
                                <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-6">Delivery Details</h3>
                                <div className="bg-gray-50 border border-gray-100 p-6 text-sm font-light leading-loose text-gray-700">
                                    <p className="uppercase font-medium text-gray-900 mb-2">{orderData.shippingAddress?.name}</p>
                                    <p>{orderData.shippingAddress?.address}</p>
                                    <p className="mt-4 pt-4 border-t border-gray-200 uppercase text-xs tracking-widest">Contact: {orderData.shippingAddress?.contactNumber}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-6">Item Manifest</h3>
                                <div className="bg-gray-50 border border-gray-100 p-6">
                                    <div className="flex flex-col gap-4 mb-6 max-h-64 overflow-y-auto pr-2">
                                        {orderData.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-gray-500 font-light w-6">{item.quantity}×</span>
                                                    <span className="uppercase tracking-widest font-medium text-gray-900">{item.name} <span className="text-gray-500 font-light text-xs ml-1">({item.variant?.size})</span></span>
                                                </div>
                                                <span className="font-medium text-gray-900 text-xs">NPR {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium uppercase tracking-widest pt-4 border-t border-gray-200 text-gray-900">
                                        <span>Total</span>
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