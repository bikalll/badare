import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export const OrderConfirmation = () => {
    const { orderNumber } = useParams<{ orderNumber: string }>();
    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState<any>(location.state?.orderDetails || null);
    const [loading, setLoading] = useState(!location.state?.orderDetails);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderNumber || orderDetails) return;
            
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('orderNumber', orderNumber)
                    .single();

                if (error) throw error;
                setOrderDetails(data);
            } catch (err: any) {
                console.error("Error fetching order:", err);
                setError("Could not retrieve order details. Please check the order number.");
            } finally {
                setLoading(false);
            }
        };

        if (!orderDetails) {
            fetchOrder();
        }
        window.scrollTo(0, 0);
    }, [orderNumber, orderDetails]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-32 text-center min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !orderDetails) {
        return (
            <div className="max-w-xl mx-auto px-6 py-32 text-center">
                <div className="bg-gray-50 border border-gray-200 p-12">
                    <h1 className="font-display text-3xl uppercase tracking-widest mb-6 text-gray-900 font-light">Order Not Found</h1>
                    <p className="text-sm font-light tracking-widest text-gray-500 mb-12 uppercase">{error || "The requested order could not be located."}</p>
                    <Link to="/" className="inline-block bg-gray-900 text-white font-medium text-sm uppercase px-10 py-4 tracking-widest hover:bg-black transition-colors shadow-sm">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-6 py-24 text-center"
        >
            <div className="mb-16">
                <h1 className="font-display text-3xl md:text-4xl uppercase tracking-widest mb-6 font-light text-gray-900">Order Confirmed</h1>
                <p className="text-sm font-medium text-gray-900 bg-gray-50 inline-block px-4 py-2 border border-gray-200 uppercase tracking-widest mb-6">
                    {orderDetails.orderNumber}
                </p>
                <p className="text-xs font-light uppercase tracking-widest text-gray-500 max-w-md mx-auto leading-relaxed">
                    A confirmation email with your receipt and tracking details will be sent shortly. Please keep your order number for reference.
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-8 md:p-12 text-left mb-16 shadow-sm">
                <h2 className="text-sm font-medium uppercase tracking-widest mb-8 border-b border-gray-200 pb-4 text-gray-900">Order Manifest</h2>
                <div className="flex flex-col gap-6">
                    {orderDetails.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-6">
                                <span className="text-gray-500 font-light w-8">{item.quantity}×</span>
                                <span className="uppercase tracking-widest font-medium text-gray-900">{item.name} <span className="text-gray-500 font-light ml-2">({item.variant?.size || 'N/A'})</span></span>
                            </div>
                            <span className="font-medium text-gray-900 shrink-0">NPR {item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-sm font-medium uppercase tracking-widest pt-6 mt-6 border-t border-gray-200 text-gray-900">
                    <span>Total Amount</span>
                    <span>NPR {orderDetails.total}</span>
                </div>
            </div>

            <Link to="/shop" className="inline-block bg-gray-900 text-white font-medium text-sm uppercase px-12 py-5 tracking-widest hover:bg-black transition-colors shadow-sm">
                Continue Shopping
            </Link>
        </motion.div>
    );
};
