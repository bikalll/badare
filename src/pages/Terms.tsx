import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from '../components/ScrambleText';

export const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black text-white min-h-screen pt-40 pb-32 px-6"
        >
            <div className="max-w-5xl mx-auto">
                <h1 className="font-display text-6xl md:text-9xl uppercase tracking-tighter mb-16 bg-white text-black p-4 brutalist-border-white -rotate-2 inline-block">
                    <ScrambleText text="THE RULES." />
                </h1>

                <div className="space-y-12 text-xl font-bold uppercase tracking-widest leading-relaxed border-[12px] border-white p-8 md:p-12 shadow-[24px_24px_0_0_#fff] bg-black relative">
                    <div className="absolute -top-6 -right-6 bg-white text-black px-4 py-2 text-2xl rotate-[5deg]">
                        TERMS / CONDITIONS // OBEY
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-display bg-white text-black px-2 inline-block">RULE 01: AGREEMENT</h2>
                        <p> BY USING THIS PLATFORM, YOU AGREE TO EVERYTHING WRITTEN HERE. DON'T LIKE IT? CLOSE THE TAB. WE ARE BASED IN KATHMANDU, NEPAL. ACT ACCORDINGLY.</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t-8 border-white">
                        <h2 className="text-4xl font-display bg-white text-black px-2 inline-block">RULE 02: PRODUCT ACCURACY</h2>
                        <p> WE TRY TO BE ACCURATE AS HELL. BUT COLORS LOOK DIFFERENT ON YOUR SCREEN THAN IN REALITY. ALSO, SINCE OUR STUFF IS LIMITED RUN ALMOST-HANDCRAFTED, MINOR VARIATIONS OCCUR. THAT'S CALLED CHARACTER.</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t-8 border-white">
                        <h2 className="text-4xl font-display bg-white text-black px-2 inline-block">RULE 03: PAYMENT & PRICING</h2>
                        <p> PRICES CAN CHANGE AT ANY TIME. IF WE CHARGE YOU THE WRONG AMOUNT BY OUR MISTAKE, WE'LL FIX IT. IF YOU TRY TO SCAM US, WE WILL FIND YOU AND CANCEL YOUR COMMERCE INSTANTLY.</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t-8 border-white">
                        <h2 className="text-4xl font-display bg-white text-black px-2 inline-block">RULE 04: INTELLECTUAL PROPERTY</h2>
                        <p> THE NAME BADARE, THE DESIGNS, THE NOISE-OVERLAY, THE GLITCHES, EVERYTHING HERE IS OURS. DO NOT COPY. DO NOT REPRODUCE. DO NOT TRY TO BE US. BE YOU.</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t-8 border-white">
                        <h2 className="text-4xl font-display bg-white text-black px-2 inline-block">RULE 05: LIMITATION OF LIABILITY</h2>
                        <p> IF OUR SYSTEM GOES DOWN, OR A GARMENT DOESN'T CHANGE YOUR LIFE, WE ARE NOT LIABLE FOR DAMAGES. WE JUST MAKE CLOTHES, NOT MIRACLES.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
