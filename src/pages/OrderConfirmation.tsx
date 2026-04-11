import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export const OrderConfirmation = () => {
    const { orderNumber } = useParams<{ orderNumber: string }>();
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderNumber) return;
            
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

        fetchOrder();
        window.scrollTo(0, 0);
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-32 text-center min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin w-16 h-16 border-4 border-black border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !orderDetails) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-32 text-center">
                <div className="bg-white border-4 border-black p-12 shadow-[8px_8px_0_0_#000]">
                    <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter mb-8 text-black">ERROR</h1>
                    <p className="text-xl font-bold uppercase tracking-widest text-gray-500 mb-12">{error || "Order not found."}</p>
                    <Link to="/" className="inline-block bg-black text-white font-display text-2xl uppercase px-10 py-5 tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all">
                        RETURN HOME
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-6 py-32 text-center"
        >
            <div className="bg-black text-white p-12 md:p-16 border border-gray-800 shadow-xl relative">
                <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter mb-8 bg-white text-black inline-block p-4">ORDER CONFIRMED</h1>
                <p className="text-2xl font-bold mb-6 bg-white text-black inline-block px-4 py-2 border border-black">{orderDetails.orderNumber}</p>
                <p className="text-lg font-bold uppercase tracking-widest mb-4 text-gray-400">WE'LL ENCRYPT YOUR RECEIPT AND BEAM IT TO YOUR EMAIL.</p>
                <div className="bg-white text-black inline-block px-6 py-3 border-2 border-white shadow-[4px_4px_0_0_#fff] font-bold uppercase tracking-widest mb-16 relative transform -rotate-1 hover:rotate-0 transition-transform">
                    Keep this identifier to track your drop status at any time.
                </div>

                <div className="bg-white text-black p-8 border border-gray-200 text-left mb-16 shadow-md">
                    <h2 className="font-display text-4xl uppercase tracking-tighter mb-8 border-b-2 border-black pb-4">MANIFEST</h2>
                    <div className="flex flex-col gap-6 relative">
                        {orderDetails.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center text-lg font-bold border-b border-gray-200 pb-4 last:border-0 last:pb-0 gap-4">
                                <div className="flex items-center gap-6">
                                    <span className="bg-black text-white px-3 py-1 text-xl font-display shrink-0">{item.quantity}X</span>
                                    <span className="uppercase tracking-widest break-words leading-tight">{item.name} - {item.variant?.size || 'N/A'}</span>
                                </div>
                                <span className="font-display text-3xl shrink-0">NPR {item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col md:flex-row justify-between md:items-center text-3xl font-display uppercase pt-8 mt-4 border-t-2 border-black gap-4">
                        <span>TOTAL COST</span>
                        <span className="bg-black text-white px-6 py-2 shadow-lg w-max">NPR {orderDetails.total}</span>
                    </div>
                </div>

                <Link to="/" className="inline-block bg-white text-black font-display text-2xl md:text-3xl uppercase px-12 py-6 tracking-widest border-2 border-white hover:bg-black hover:text-white transition-all hover:border-gray-500">
                    RETURN TO REALITY
                </Link>
            </div>
        </motion.div>
    );
};
