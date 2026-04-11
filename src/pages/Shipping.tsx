import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from '../components/ScrambleText';

export const Shipping = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white text-black min-h-screen pt-40 pb-32 px-6"
        >
            <div className="max-w-5xl mx-auto">
                <div className="relative inline-block mb-16">
                     <h1 className="font-display text-5xl md:text-8xl uppercase tracking-tighter bg-black text-white p-4 brutalist-border-white rotate-2 z-10 relative">
                        <ScrambleText text="LOGISTICS &" />
                    </h1>
                     <h1 className="font-display text-5xl md:text-8xl uppercase tracking-tighter bg-white text-black p-4 brutalist-border mt-[-20px] -rotate-1 z-0 relative ml-8 shadow-[16px_16px_0_0_#000]">
                        <ScrambleText text="RETURNS." />
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    
                    {/* Shipping Box */}
                    <div className="border-[12px] border-black p-8 shadow-[16px_16px_0_0_#000] bg-white inverted-hover-reverse transition-none">
                        <h2 className="text-5xl font-display uppercase border-b-8 border-black pb-4 mb-8">1. SHIPPING</h2>
                        <div className="space-y-6 text-xl font-bold uppercase tracking-widest leading-relaxed">
                            <p className="bg-black text-white p-2 w-max brutalist-skew">ORIGIN: KATHMANDU, NEPAL</p>
                            <p>WE SHIP WORLDWIDE USING DHL/FEDEX EXPRESS. NO SLOW MAIL. NO EXCUSES.</p>
                            <ul className="list-disc list-inside space-y-4 pt-4 border-t-4 border-black">
                                <li>ASIA: 3-5 BUSINESS DAYS</li>
                                <li>EUROPE: 5-7 BUSINESS DAYS</li>
                                <li>NORTH AMERICA: 7-10 BUSINESS DAYS</li>
                                <li>REST OF WORLD: 10-14 BUSINESS DAYS</li>
                            </ul>
                            <p className="mt-8 text-sm bg-black text-white p-4 inline-block">
                                WARNING: YOU ARE RESPONSIBLE FOR CUSTOMS DUTIES IN YOUR COUNTRY.
                            </p>
                        </div>
                    </div>

                    {/* Returns Box */}
                    <div className="border-[12px] border-black p-8 shadow-[16px_16px_0_0_#000] bg-black text-white inverted-hover transition-none">
                        <h2 className="text-5xl font-display uppercase border-b-8 border-white pb-4 mb-8 text-white">2. RETURNS</h2>
                        <div className="space-y-6 text-xl font-bold uppercase tracking-widest leading-relaxed">
                            <p className="bg-white text-black p-2 w-max brutalist-skew">POLICY: STRICT.</p>
                            <p>WE PREFER YOU MAKE A FIRM DECISION BEFORE PURCHASE. BUT IF THERE IS A DEFECT, WE GOT YOU.</p>
                            <ul className="list-disc list-inside space-y-4 pt-4 border-t-4 border-white">
                                <li>14 DAYS FROM DELIVERY DATE.</li>
                                <li>MUST BE UNWORN. UNWASHED. TAGS ON.</li>
                                <li>IF YOU JUST CHANGED YOUR MIND, YOU PAY RETURN SHIPPING TO NEPAL.</li>
                            </ul>
                            <p className="mt-8 text-sm bg-white text-black p-4 inline-block font-black">
                                CONTACT HELLO@BADARE.COM.NP BEFORE RETURNING ANYTHING.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};
