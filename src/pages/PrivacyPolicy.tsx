import { useEffect } from 'react';
import { motion } from 'framer-motion';

export const PrivacyPolicy = () => {
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
            <div className="max-w-3xl mx-auto">
                <div className="mb-16 border-b border-gray-100 pb-8">
                    <h1 className="font-display text-4xl md:text-5xl uppercase tracking-widest font-light mb-4">
                        Privacy
                    </h1>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Data Protocol</p>
                </div>

                <div className="space-y-12 text-sm md:text-base font-light text-gray-600 leading-relaxed">
                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">1. Data Collection</h2>
                        <p>We only collect the essential information needed to fulfill your orders, such as your delivery address, contact method, and payment trace. We respect your anonymity.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">2. Usage</h2>
                        <p>Your data is used strictly for order fulfillment and limited vital communications. You may opt out of promotional updates at any time.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">3. Third Parties</h2>
                        <p>Payment processing is securely managed by trusted third-party gateways. We do not store sensitive payment information on our servers.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">4. Tracking</h2>
                        <p>We utilize strictly necessary cookies to maintain session states and cart integrity. Non-essential tracking is kept to an absolute minimum.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">5. Jurisdiction</h2>
                        <p>Badare operates under the legal framework of Kathmandu, Nepal. All privacy matters correspond to our local regulations.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
