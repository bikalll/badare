import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from '../components/ScrambleText';

export const PrivacyPolicy = () => {
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
                <h1 className="font-display text-6xl md:text-9xl uppercase tracking-tighter mb-16 bg-black text-white p-4 brutalist-border-white rotate-1 inline-block">
                    <ScrambleText text="YOUR DATA." />
                </h1>

                <div className="space-y-12 text-xl font-bold uppercase tracking-widest leading-relaxed border-[12px] border-black p-8 md:p-12 shadow-[24px_24px_0_0_#000] bg-white relative">
                    <div className="absolute -top-6 -left-6 bg-black text-white px-4 py-2 text-2xl rotate-[-5deg]">
                        PRIVACY PROTOCOL // v1.0
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-display bg-black text-white px-2 inline-block">1. WHAT WE COLLECT</h2>
                        <p> WE ONLY TAKE WHAT WE NEED TO GET THE GARMENT TO YOUR DOOR. NAME, ADDRESS, PAYMENT TRACE, AND CONTACT METHOD. NO SNOOPING. NO SELLING YOUR DATA TO SHADY BROKERS.</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t-8 border-black">
                        <h2 className="text-4xl font-display bg-black text-white px-2 inline-block">2. HOW WE USE IT</h2>
                        <p> WE USE IT TO FULFILL ORDERS. PERIOD. OCCASIONALLY, WE MIGHT PING YOU IF WE DROP SOMETHING NEW. YOU CAN OPT OUT WHENEVER. WE DON'T CARE.</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t-8 border-black">
                        <h2 className="text-4xl font-display bg-black text-white px-2 inline-block">3. THIRD PARTIES</h2>
                        <p> WE USE PAYMENT GATEWAYS LIKE STRIPE OR PAYPAL. THEY PROCESS THE MONEY. WE DON'T STORE YOUR CREDIT CARD ON OUR NEPAL SERVERS. IT'S HANDLED BY MULTI-BILLION DOLLAR CORPS SO BLAME THEM IF IT GOES WRONG.</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t-8 border-black">
                        <h2 className="text-4xl font-display bg-black text-white px-2 inline-block">4. COOKIES</h2>
                        <p> YEAH, WE USE COOKIES TO KEEP YOUR CART INTACT WHILE YOU BROWSE. BLOCK THEM IF YOU WANT, BUT DON'T COMPLAIN WHEN THE SITE STOPS WORKING FOR YOU.</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t-8 border-black">
                        <h2 className="text-4xl font-display bg-black text-white px-2 inline-block">5. JURISDICTION</h2>
                        <p> BADARE OPERATES UNDER THE LAWS OF KATHMANDU, NEPAL. ANY DISPUTES WILL BE HANDLED ACCORDINGLY. DON'T BE A CREEP.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
