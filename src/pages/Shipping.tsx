import { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Shipping = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white text-gray-900 min-h-screen pt-40 pb-32 px-6"
        >
            <div className="max-w-4xl mx-auto">
                <div className="mb-20 text-center">
                    <h1 className="font-display text-4xl md:text-5xl uppercase tracking-widest font-light mb-4">
                        Logistics
                    </h1>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Shipping & Returns</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                    
                    {/* Shipping Box */}
                    <div className="flex flex-col">
                        <h2 className="text-sm font-medium uppercase tracking-widest border-b border-gray-200 pb-4 mb-6">1. Shipping</h2>
                        <div className="space-y-6 text-sm font-light text-gray-600 leading-relaxed">
                            <p className="text-gray-900 font-medium">Origin: Kathmandu, Nepal</p>
                            <p>We provide expedited global shipping utilizing reliable carriers.</p>
                            <ul className="space-y-2 py-4 border-y border-gray-100">
                                <li className="flex justify-between"><span>Asia</span> <span>3-5 Days</span></li>
                                <li className="flex justify-between"><span>Europe</span> <span>5-7 Days</span></li>
                                <li className="flex justify-between"><span>North America</span> <span>7-10 Days</span></li>
                                <li className="flex justify-between"><span>Rest of World</span> <span>10-14 Days</span></li>
                            </ul>
                            <p className="text-xs uppercase tracking-widest text-gray-400 mt-6">
                                * Customers are responsible for any applicable import duties.
                            </p>
                        </div>
                    </div>

                    {/* Returns Box */}
                    <div className="flex flex-col">
                        <h2 className="text-sm font-medium uppercase tracking-widest border-b border-gray-200 pb-4 mb-6">2. Returns</h2>
                        <div className="space-y-6 text-sm font-light text-gray-600 leading-relaxed">
                            <p className="text-gray-900 font-medium">Policy Overview</p>
                            <p>We encourage mindful purchasing. However, if a product does not meet expectations, our return framework is straightforward.</p>
                            <ul className="space-y-2 py-4 border-y border-gray-100 list-inside list-disc">
                                <li>Eligible within 14 days of delivery.</li>
                                <li>Garments must remain unworn, unwashed, and tagged.</li>
                                <li>Return logistics costs are borne by the customer.</li>
                            </ul>
                            <p className="text-xs tracking-widest mt-6 bg-gray-50 p-4 border border-gray-100">
                                Contact <span className="font-medium text-gray-900">hello@badare.com.np</span> to initiate a process.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};
