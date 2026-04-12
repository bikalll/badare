import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#fcfcfc] text-gray-900 pb-32 pt-24"
        >
            {/* Hero Image Section */}
            <section className="relative min-h-[75vh] flex items-center justify-center px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=2500" 
                        alt="Editorial Manifesto" 
                        className="w-full h-full object-cover grayscale opacity-20 object-top"
                    />
                </div>
                <div className="relative z-10 w-full max-w-7xl pt-16 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    >
                        <span className="block text-[10px] uppercase font-bold tracking-[0.4em] text-gray-400 mb-6">Established 2026</span>
                        <h1 className="font-display text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-[0.8] font-black text-black">
                            THE <br /> MANIFESTO.
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Core Ethos - Two Column */}
            <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                    <div className="flex flex-col justify-end">
                        <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight mb-8 text-black leading-none">
                            We don't do<br /><span className="italic text-gray-500 font-light">seasons.</span>
                        </h2>
                        <img 
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1500" 
                            alt="Studio" 
                            className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-1000 mt-6"
                        />
                    </div>
                    <div>
                        <div className="prose prose-lg prose-gray text-gray-600 font-light leading-relaxed space-y-12 mb-16 pt-8 md:pt-48">
                            <p className="text-xl md:text-2xl text-black leading-snug">
                                Badar-è was not built to follow the fashion calendar. We exist to disrupt the noise, creating uniforms for those who refuse to blend in.
                            </p>
                            <p className="text-sm md:text-base">
                                Traditional fashion forces you into boxes. Spring, Summer, Fall, Winter. We believe your style shouldn't be dictated by the weather passing outside your window. We drop when we have something to say. We build garments that are ruthless in their quality and unapologetic in their cut.
                            </p>
                            <p className="text-sm md:text-base pl-6 border-l border-black italic">
                                "The streets don't ask for permission. Neither should your wardrobe."
                            </p>
                        </div>
                        <img 
                            src="https://images.unsplash.com/photo-1550614000-4b95d466f272?auto=format&fit=crop&q=80&w=1500" 
                            alt="Archive" 
                            className="w-full aspect-square object-cover grayscale mix-blend-multiply"
                        />
                    </div>
                </div>
            </section>

            {/* Statement Ticker */}
            <section className="relative z-10 py-32 bg-black text-white overflow-hidden border-y border-gray-900 mt-12 mb-24">
                <div className="whitespace-nowrap flex gap-16 overflow-hidden max-w-full">
                    <motion.div 
                        animate={{ x: ["0%", "-50%"] }} 
                        transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
                        className="flex gap-16 items-center"
                    >
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter">BE YOU.</h2>
                        <span className="text-gray-600">//</span>
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter">STAY WEIRD.</h2>
                        <span className="text-gray-600">//</span>
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter">OWN IT.</h2>
                        <span className="text-gray-600">//</span>
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter">BE YOU.</h2>
                        <span className="text-gray-600">//</span>
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter">STAY WEIRD.</h2>
                        <span className="text-gray-600">//</span>
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter">OWN IT.</h2>
                    </motion.div>
                </div>
            </section>

            {/* Ending Hook */}
            <section className="relative z-10 py-16 px-6 text-center max-w-3xl mx-auto">
                <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 text-black">
                    Join The Culture
                </h2>
                <Link to="/shop" className="bg-transparent border border-black text-black font-semibold text-xs md:text-sm uppercase tracking-[0.3em] px-16 py-6 hover:bg-black hover:text-white transition-colors duration-500 inline-block">
                    Enter the Shop
                </Link>
            </section>
        </motion.div>
    );
};
