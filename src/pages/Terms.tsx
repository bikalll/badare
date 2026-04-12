import { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Terms = () => {
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
                        Terms
                    </h1>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Conditions of Use</p>
                </div>

                <div className="space-y-12 text-sm md:text-base font-light text-gray-600 leading-relaxed">
                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">01. Agreement</h2>
                        <p>By using this platform, you agree to our terms. We operate from Kathmandu, Nepal, and all our services are bound by local jurisdiction.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">02. Product Accuracy</h2>
                        <p>While we strive for precision in our representation, screen variants may alter color perception. Minor variations are a natural outcome of our nuanced manufacturing process.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">03. Pricing & Transactions</h2>
                        <p>Prices are subject to change without notice. In the event of a pricing error, we reserve the right to correct the charge or cancel the order.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">04. Intellectual Property</h2>
                        <p>All designs, imagery, and assets associated with Badare are strictly our intellectual property. Reproduction without consent is prohibited.</p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-900">05. Liability</h2>
                        <p>We are not liable for any consequential, incidental, or indirect damages that result from the use or inability to use our products or platform.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
