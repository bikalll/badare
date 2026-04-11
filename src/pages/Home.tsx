import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MonkeyMascot } from '../components/MonkeyMascot';
import { ProductCard } from '../components/ProductCard';
import { MagneticElement } from '../components/MagneticElement';
import { ScrambleText } from '../components/ScrambleText';
import { useProductStore } from '../store/useProductStore';
import { Link } from 'react-router-dom';

import { supabase } from '../utils/supabaseClient';

export const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { products, loading } = useProductStore();

    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        setNewsletterStatus('submitting');
        
        const { error } = await supabase.from('subscribers').insert([{ email: newsletterEmail }]);
        if (error) {
            console.error("Newsletter error", error);
            alert("Error subscribing.");
            setNewsletterStatus('idle');
            return;
        }
        setNewsletterStatus('success');
        setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus('idle'), 3000);
    };

    const newArrivals = products.filter(p => p.isNew);
    const trending = products.filter(p => p.isTrending);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pb-24"
        >
            {/* Hero Section */}
            <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-black text-white brutalist-border-white m-4 animate-wobble" style={{ animationDuration: '20s' }}>
                <img
                    src="https://images.unsplash.com/photo-1549449673-902dce867da8?auto=format&fit=crop&q=80&w=2000"
                    alt="Hero background"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay grayscale contrast-150 scale-105"
                />

                {/* Random huge offset elements */}
                <div className="absolute top-10 left-10 opacity-10 rotate-[-15deg] select-none pointer-events-none">
                    <MonkeyMascot className="w-[800px] h-[800px] text-white mix-blend-overlay" variant="ghost" />
                </div>
                <div className="absolute bottom-20 right-10 font-display text-9xl opacity-10 rotate-[25deg] select-none pointer-events-none uppercase">Order</div>

                <div className="relative z-10 text-center flex flex-col items-center px-4 bg-black/50 p-6 md:p-12 brutalist-border-white transform -rotate-2 hover:rotate-1 transition-transform">
                    <h1 className="font-display text-4xl sm:text-6xl md:text-9xl lg:text-[14rem] leading-[0.8] uppercase tracking-tighter mb-4 md:mb-6 text-white">
                        <ScrambleText text="Be" /><br /><ScrambleText text="You" />
                    </h1>
                    <p className="max-w-md text-xl md:text-2xl font-bold mb-10 brutalist-skew bg-white text-black p-4 brutalist-shadow-lg">
                        SUPREME CLARITY. FUNCTIONAL RESTRAINT. THE UNIFORM FOR THE NEW CREATIVE CLASS.
                    </p>
                    <MagneticElement>
                        <Link to="/shop" className="bg-white text-black font-display px-12 py-6 text-4xl uppercase tracking-widest inverted-hover brutalist-border-white brutalist-shadow-lg inline-block">
                            Shop Now
                        </Link>
                    </MagneticElement>
                </div>
            </section>

            {/* Marquee Ticker */}
            <section className="bg-white text-black py-8 overflow-hidden border-y-8 border-black transform -rotate-1 scale-105 shadow-[0_20px_0_0_rgba(0,0,0,1)] my-12 z-20 relative">
                <div className="flex whitespace-nowrap animate-marquee-fast hover:animation-paused">
                    {Array(15).fill("BUY PUNK ✦ SUPREME CLARITY ★ FUNKY HEARTBEAT ✦ ").map((text, i) => (
                        <span key={i} className="font-display text-3xl md:text-5xl font-black uppercase mx-8 italic hover:funky-glitch-text">{text}</span>
                    ))}
                </div>
            </section>


            {/* New Arrivals */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter">New Arrivals</h2>
                    <Link to="/shop" className="text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white px-2 py-1 transition-colors hidden md:block">View All</Link>
                </div>
                {loading ? (
                    <div className="col-span-full py-12 text-center font-display text-4xl uppercase animate-pulse">Loading Comm Link...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 gap-y-12">
                        {newArrivals.slice(0, 4).map(product => (
                            <ProductCard key={product.id} product={product as any} hidePrice={true} />
                        ))}
                    </div>
                )}
            </section>

            {/* Editorial Strip */}
            <section className="my-32 h-[80vh] relative flex items-center justify-center text-center brutalist-border mx-6 brutalist-shadow-lg">
                <div className="absolute inset-0 bg-black">
                    <img
                        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover grayscale contrast-[150%] opacity-80"
                        alt="Editorial"
                    />
                </div>
                {/* Glitch overlays */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSI+PC9wYXRoPjwvc3ZnPg==')] opacity-50 mix-blend-overlay"></div>

                <div className="relative z-10 bg-white text-black p-4 md:p-8 brutalist-shadow transform rotate-3 hover:-rotate-1 transition-transform">
                    <h2 className="font-display text-4xl md:text-8xl lg:text-[10rem] uppercase tracking-tighter leading-[0.85] funky-glitch-text">
                        Design<br />Like You<br /><span className="bg-black text-white px-2 md:px-4 inline-block mt-2 md:mt-4 brutalist-border-white origin-left hover:scale-110 transition-transform">Give A Damn</span>
                    </h2>
                </div>
            </section>

            {/* Trending */}
            <section className="py-32 px-6 bg-black text-white relative overflow-hidden border-t-[16px] border-b-[16px] border-white my-32">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000')] opacity-30 grayscale object-cover mix-blend-overlay"></div>
                
                <div className="max-w-[90rem] mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 border-b-[4px] md:border-b-8 border-white pb-8 md:pb-12 relative">
                        <h2 className="font-display text-5xl md:text-[8rem] uppercase tracking-tighter leading-[0.8] text-white">
                            CHOOSE<br />YOUR<br /><span className="funky-glitch-text text-transparent" style={{ WebkitTextStroke: '4px white' }}>POISON</span>
                        </h2>
                        <Link to="/shop" className="text-xl md:text-2xl font-black uppercase tracking-widest bg-white text-black px-8 py-4 hover:bg-black hover:text-white border-4 border-white transition-colors mt-8 md:mt-0 shadow-[8px_8px_0_0_#fff] hover:translate-x-2 hover:-translate-y-2 relative z-20">
                            VIEW ALL TOXINS
                        </Link>
                    </div>

                    {loading ? (
                        <div className="py-24 text-center font-display text-4xl uppercase animate-pulse">Loading Database...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 relative z-20">
                            {trending.slice(0, 3).map((product, i) => (
                                <div key={product.id} className="relative group">
                                    <div className="absolute -top-16 -left-8 md:-left-12 font-display text-[10rem] md:text-[14rem] text-transparent leading-none select-none z-0 opacity-20 group-hover:opacity-60 transition-opacity" style={{ WebkitTextStroke: '2px rgba(255,255,255,1)' }}>
                                        0{i + 1}
                                    </div>
                                    <div className="relative z-10 brutalist-border-white bg-white p-4 md:p-6 transform transition-transform group-hover:-translate-y-4 shadow-[16px_16px_0_0_rgba(255,255,255,1)] group-hover:shadow-[24px_24px_0_0_rgba(255,255,255,1)]">
                                        <ProductCard product={product as any} />
                                    </div>
                                    <div className="mt-8 text-white font-bold uppercase tracking-widest border-l-4 border-white pl-4 group-hover:pl-8 transition-all">
                                        TRENDING /// RANK 0{i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 md:py-32 px-6 bg-black text-white text-center border-t-8 border-b-8 border-black bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGwyMCAyME0yMCAwTDAgMjAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')]">
                <div className="max-w-4xl mx-auto bg-white text-black p-6 md:p-24 brutalist-shadow-lg transform md:scale-105 brutalist-border">
                    <h2 className="font-display text-4xl md:text-8xl uppercase tracking-tighter mb-4 md:mb-6 leading-none funky-glitch-text">Inner<br />Circle</h2>
                    <p className="mb-8 md:mb-12 text-lg md:text-2xl font-bold brutalist-skew bg-black text-white inline-block px-4 py-2">NO SPAM. JUST PURE FUNK.</p>
                    <form className="flex flex-col md:flex-row max-w-2xl mx-auto brutalist-border shadow-[4px_4px_0_0_#000] md:shadow-[8px_8px_0_0_#000]" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            placeholder="YOUR EMAIL"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            className="flex-1 bg-white border-b-4 md:border-b-0 md:border-r-4 border-black px-6 py-6 outline-none focus:bg-gray-100 text-xl tracking-widest font-bold uppercase transition-all placeholder:text-gray-400"
                            required
                        />
                        <MagneticElement>
                            <button disabled={newsletterStatus !== 'idle'} type="submit" className="bg-black h-full text-white font-display uppercase tracking-widest px-12 py-6 text-2xl hover:bg-white hover:text-black transition-colors disabled:opacity-50">
                                {newsletterStatus === 'idle' ? 'Sign Up' : newsletterStatus === 'submitting' ? '...' : 'Done'}
                            </button>
                        </MagneticElement>
                    </form>
                </div>
            </section>
        </motion.div>
    );
};
