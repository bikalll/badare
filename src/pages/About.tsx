import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ScrambleText } from '../components/ScrambleText';
import { MagneticElement } from '../components/MagneticElement';

export const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden bg-black text-white pb-32"
        >
            {/* Massive Ticker Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20 flex flex-col justify-center gap-12 z-0 whitespace-nowrap overflow-hidden">
                <div className="font-display text-7xl md:text-[10rem] lg:text-[15rem] leading-none uppercase tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px white' }}>BADARE BEYOU BADARE BEYOU</div>
                <div className="font-display text-7xl md:text-[10rem] lg:text-[15rem] leading-none uppercase tracking-tighter text-transparent -translate-x-[20%]" style={{ WebkitTextStroke: '2px white' }}>BE YOU BE YOU BE YOU</div>
                <div className="font-display text-7xl md:text-[10rem] lg:text-[15rem] leading-none uppercase tracking-tighter text-transparent translate-x-[10%]" style={{ WebkitTextStroke: '2px white' }}>NOISE IS CHEAP NOISE IS CHEAP</div>
            </div>

            <section className="relative z-10 min-h-screen flex items-center justify-center px-6 brutalist-border-white m-4 shadow-[16px_16px_0_0_#fff]">
                <h1 className="font-display text-5xl md:text-[10rem] lg:text-[15rem] uppercase tracking-tighter max-w-7xl text-center leading-[0.8] text-white funky-glitch-text mix-blend-difference hover:scale-105 transition-transform duration-500 relative">
                    ANTI<br />STANDARD.
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm md:text-2xl bg-white text-black font-bold uppercase tracking-widest py-1 md:py-2 px-4 md:px-8 -rotate-6 shadow-[4px_4px_0_0_#fff] md:shadow-[8px_8px_0_0_#fff]">EST. 2026</span>
                </h1>
            </section>

            <section className="relative z-10 py-32 px-6 max-w-[90rem] mx-auto">
                <div className="flex flex-col items-center max-w-5xl mx-auto">
                    <div className="w-full bg-white text-black p-6 md:p-12 lg:p-24 border-[8px] md:border-[16px] border-black shadow-[12px_12px_0_0_#fff] md:shadow-[24px_24px_0_0_#fff] rotate-1 hover:rotate-2 transition-transform">
                        <h2 className="font-display text-4xl md:text-8xl uppercase tracking-tighter mb-8 md:mb-12 border-b-[6px] md:border-b-[12px] border-black pb-4 leading-none">RAW<br />DYNAMICS.</h2>
                        <p className="text-lg md:text-2xl font-bold uppercase tracking-widest leading-relaxed mb-8">
                            Badare refuses to play the safe game. We synthesize pure defiance into structural fashion. Every seam has a purpose. Every silhouette is an act of rebellion.
                        </p>
                        <p className="text-lg md:text-2xl font-bold uppercase tracking-widest leading-relaxed bg-black text-white inline-block p-4 mt-8 brutalist-skew">
                            Defy gravity. <br />Embrace structure. <br />Dismantle the normal.
                        </p>
                    </div>
                </div>
            </section>

            <section className="relative z-10 py-48 px-6 text-center bg-white text-black my-48 border-y-[32px] border-black brutalist-shadow-lg transform skew-y-3">
                <div className="max-w-7xl mx-auto flex flex-col gap-32 transform -skew-y-3">
                    <motion.h2
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="font-display text-3xl md:text-7xl lg:text-9xl uppercase tracking-tighter leading-none"
                    >
                        <span className="bg-black text-white px-4 md:px-8 py-2 block w-max mx-auto rotate-[-2deg] mb-6 shadow-[8px_8px_0_0_#000] md:shadow-[16px_16px_0_0_#000]">"NOISE IS CHEAP."</span>
                        <span className="block border-[4px] md:border-8 border-black p-4 md:p-6 inline-block shadow-[12px_12px_0_0_#000] md:shadow-[24px_24px_0_0_#000] rotate-1">SILENCE IS LUXURY.</span>
                    </motion.h2>

                    <motion.h2
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="font-display text-3xl md:text-7xl lg:text-9xl uppercase tracking-tighter leading-none"
                    >
                        <span className="bg-black text-white px-4 md:px-8 py-2 block w-max mx-auto rotate-[1deg] mb-6 shadow-[-8px_8px_0_0_#000] md:shadow-[-16px_16px_0_0_#000]"><ScrambleText text="FUNCTION IS TRUTH." /></span>
                        <span className="block border-[4px] md:border-8 border-black p-4 md:p-6 inline-block shadow-[-12px_12px_0_0_#000] md:shadow-[-24px_24px_0_0_#000] -rotate-2"><ScrambleText text="DESIGN THE CHARACTER." /></span>
                    </motion.h2>
                </div>
            </section>

            <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
                <h1 className="font-display text-5xl md:text-9xl lg:text-[12rem] uppercase tracking-tighter mb-8 leading-none bg-white text-black p-4 brutalist-border-white rotate-2">
                    <ScrambleText text="Be" /> <ScrambleText text="You" />
                </h1>
            </div>

            <section className="relative z-10 py-16 md:py-32 px-6 bg-black text-white text-center border-[8px] md:border-[16px] border-white m-4 md:m-6 rotate-1 hover:-rotate-1 transition-transform shadow-[8px_8px_0_0_#fff] md:shadow-[16px_16px_0_0_#fff]">
                <h2 className="font-display text-5xl md:text-8xl lg:text-[10rem] uppercase tracking-tighter mb-10 md:mb-16 leading-[0.85] funky-glitch-text cursor-none">
                    <ScrambleText text="ENOUGH" /><br /><ScrambleText text="READING." />
                </h2>
                <MagneticElement>
                    <Link to="/shop" className="bg-white text-black font-display text-2xl md:text-6xl uppercase tracking-widest px-8 md:px-16 py-4 md:py-8 border-[6px] md:border-[12px] border-black shadow-[8px_8px_0_0_#fff] md:shadow-[16px_16px_0_0_#fff] hover:bg-black hover:text-white inverted-hover transition-transform inline-block rotate-[-2deg] scale-105 hover:scale-[1.15]">
                        WEAR SOMETHING NOW.
                    </Link>
                </MagneticElement>
            </section>
        </motion.div>
    );
};
