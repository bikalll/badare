import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { useProductStore } from '../store/useProductStore';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export const Home = () => {
    const { products, loading } = useProductStore();
    const { scrollY } = useScroll();

    const [sliderIndex, setSliderIndex] = useState(0);
    const [heroSlides, setHeroSlides] = useState([
        {
            title: "BE",
            italic: "YOU.",
            desc: "Unapologetic expression. Break the mold and wear your authenticity loudly.",
            img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=100&w=1500"
        },
        {
            title: "STAY",
            italic: "WEIRD.",
            desc: "Ordinary is boring. Embrace the chaos and let your style speak volumes.",
            img: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=100&w=1500"
        },
        {
            title: "OWN",
            italic: "IT.",
            desc: "No rules. No boundaries. Make the streets your personal runway.",
            img: "https://images.unsplash.com/photo-1529139574466-a303027c028b?auto=format&fit=crop&q=100&w=1500"
        }
    ]);

    const [trendingCards, setTrendingCards] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Hero
            const { data: heroData, error: heroError } = await supabase
                .from('hero_slides')
                .select('*')
                .order('sort_order', { ascending: true });
            
            if (!heroError && heroData && heroData.length > 0) {
                setHeroSlides(heroData.map((d: any) => ({
                    title: d.title,
                    italic: d.italic_text,
                    desc: d.description,
                    img: d.image_url
                })));
            }

            // Fetch Trending
            const { data: trendData, error: trendError } = await supabase
                .from('trending_cards')
                .select('*')
                .order('sort_order', { ascending: true });
            
            if (!trendError && trendData && trendData.length > 0) {
                setTrendingCards(trendData);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setSliderIndex((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    useEffect(() => {
        window.scrollTo(0, 0);

        // ONE-OFF SCRIPT TO UPGRADE IMAGES TO LUXURY UNSPLASH IMAGES
        const upgradeImages = async () => {
            const hasRun = localStorage.getItem('upgraded_images_v1');
            if (hasRun || !products || products.length === 0) return;

            console.log("Upgrading product database to Unsplash luxury images...");
            localStorage.setItem('upgraded_images_v1', 'true');

            const imagePool: Record<string, string[]> = {
                'Apparel': [
                    'https://images.unsplash.com/photo-1434389678369-182cb207c427?auto=format&fit=crop&q=80&w=2000', 
                    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=2000', 
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000', 
                    'https://images.unsplash.com/photo-1550614000-4b95d466f272?auto=format&fit=crop&q=80&w=2000', 
                    'https://images.unsplash.com/photo-1574180564177-3e110ef90a1e?auto=format&fit=crop&q=80&w=2000' 
                ],
                'Outerwear': [
                    'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=2000', 
                    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=2000' 
                ],
                'Accessories': [
                    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=2000', 
                    'https://images.unsplash.com/photo-1611078704689-f53e680e9803?auto=format&fit=crop&q=80&w=2000', 
                    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=2000' 
                ],
                'Footwear': [
                    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=2000', 
                    'https://images.unsplash.com/photo-1620809228913-c971eb0ebd0e?auto=format&fit=crop&q=80&w=2000'
                ]
            };

            for (let p of products) {
                const categoryPool = imagePool[p.category] || imagePool['Apparel'];
                
                let charCodeSum = 0;
                for (let j = 0; j < p.id.length; j++) charCodeSum += p.id.charCodeAt(j);
                
                const img1 = categoryPool[charCodeSum % categoryPool.length];
                const img2 = categoryPool[(charCodeSum + 1) % categoryPool.length];

                const { error: updateError } = await supabase
                    .from('products')
                    .update({ images: [img1, img2] })
                    .eq('id', p.id);
                
                if (updateError) console.error("Error updating image for", p.name, updateError);
            }
            console.log("Images completely updated to Unsplash Luxury! Refresh the page to see them.");
        };

        upgradeImages();
    }, [products]);
    
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);

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

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };
    
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } }
    };

    return (
        <div className="w-full bg-[#fcfcfc]">
            {/* World-Class Editorial Light Hero Section - Full Slide Sync */}
            <section className="relative min-h-screen flex flex-col lg:flex-row bg-[#fcfcfc] overflow-hidden border-b border-gray-100">
                {/* Left Typography Pane */}
                <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-32 pb-16 lg:py-0 z-10 relative">
                    {/* Micro-labels (Removed per user request) */}

                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, delay: 0.1 }}
                            className="overflow-hidden mb-6"
                        >
                            <span className="block text-[10px] md:text-xs text-black/40 tracking-[0.4em] uppercase font-semibold">The New Standard</span>
                        </motion.div>
                        
                        <AnimatePresence mode="wait">
                            <motion.h1 
                                key={`title-${sliderIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="font-display text-6xl md:text-7xl lg:text-[7.5rem] leading-[0.9] tracking-tighter text-black flex flex-wrap gap-x-2 md:gap-x-4 mb-12"
                            >
                                <span className="inline-block">{heroSlides[sliderIndex].title}</span>
                                <span className="w-full h-0 block"></span>
                                <span className="inline-block italic pr-1 md:pr-2 font-light text-gray-800">{heroSlides[sliderIndex].italic}</span>
                            </motion.h1>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`desc-${sliderIndex}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="flex flex-col gap-8"
                            >
                                <p className="max-w-[320px] text-xs md:text-sm font-light text-gray-500 tracking-[0.05em] leading-relaxed min-h-[80px]">
                                    {heroSlides[sliderIndex].desc}
                                </p>
                                <Link to="/shop" className="group relative inline-flex items-center gap-6 text-black font-medium text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all hover:text-black/60 w-fit">
                                    <span className="relative z-10 border-b border-transparent group-hover:border-black/30 pb-1 transition-colors">Shop Collection</span>
                                    <span className="w-12 h-px bg-black/20 group-hover:w-20 group-hover:bg-black transition-all duration-500 ease-out"></span>
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Image Pane - Slider */}
                <div className="w-full lg:w-[45%] h-[60vh] lg:h-screen relative overflow-hidden bg-gray-100 group">
                    <motion.div style={{ y: y1 }} className="absolute inset-0 w-full h-[120%] -top-10">
                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={`img-${sliderIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                src={heroSlides[sliderIndex].img}
                                alt="Collection showcase"
                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 object-[center_top]"
                            />
                        </AnimatePresence>
                    </motion.div>

                    {/* Slider Indicator Controls */}
                    <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex gap-4 items-center">
                        <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-black/60 bg-white/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/50">
                            0{sliderIndex + 1} / 0{heroSlides.length}
                        </span>
                        <div className="flex gap-2">
                            {heroSlides.map((_, idx) => (
                                <button 
                                    key={`btn-${idx}`}
                                    onClick={() => setSliderIndex(idx)}
                                    className={`w-8 h-px transition-all duration-300 ${idx === sliderIndex ? 'bg-black' : 'bg-black/20 hover:bg-black/40'}`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals - Staggered Grid */}
            <section className="py-16 md:py-24 px-6 max-w-[90rem] mx-auto mb-20">
                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-200 pb-6 gap-4"
                >
                    <motion.h2 variants={fadeInUp} className="font-display text-3xl md:text-5xl tracking-tight text-gray-900">New Arrivals</motion.h2>
                    <motion.div variants={fadeInUp}>
                        <Link to="/shop" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                            View All <span className="text-lg">→</span>
                        </Link>
                    </motion.div>
                </motion.div>

                {loading ? (
                    <div className="w-full py-24 text-center text-gray-400 font-light tracking-widest uppercase">Curating collection...</div>
                ) : (
                    <motion.div 
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 gap-y-16"
                    >
                        {newArrivals.slice(0, 4).map(product => (
                            <motion.div variants={fadeInUp} key={product.id}>
                                <ProductCard product={product as any} hidePrice={false} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>

            {/* Immersive Editorial Strip */}
            <section className="my-32 h-[80vh] md:h-[70vh] relative flex items-center justify-center lg:justify-end border-none overflow-hidden">
                <div className="absolute inset-0 bg-gray-100">
                    <motion.img
                        initial={{ scale: 1.1 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover grayscale opacity-50 mix-blend-multiply object-center"
                        alt="Editorial"
                    />
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative z-10 w-full max-w-2xl px-6 md:px-16"
                >
                    <div className="bg-white/80 backdrop-blur-3xl p-10 md:p-16 border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
                        <h2 className="font-display text-4xl md:text-5xl tracking-tight leading-tight text-black mb-6">
                            Design Like You Give A Damn
                        </h2>
                        <p className="text-gray-600 font-light text-sm md:text-base leading-relaxed mb-10">
                            We believe aesthetics and utility are not mutually exclusive. Our pieces are designed to perform quietly in the background of your fast-paced life.
                        </p>
                        <Link to="/about" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                            Discover Our Story
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Trending */}
            <section className="py-24 px-6 max-w-[90rem] mx-auto mb-24">
                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="flex flex-col items-center text-center mb-16 gap-4"
                >
                    <motion.h2 variants={fadeInUp} className="font-display text-3xl md:text-5xl tracking-tight text-gray-900">
                        Trending Now
                    </motion.h2>
                    <motion.div variants={fadeInUp}>
                        <Link to="/shop" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">
                            Explore Collection
                        </Link>
                    </motion.div>
                </motion.div>

                {trendingCards.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 opacity-50">
                        {/* Fallback to normal products if no editorial cards are set up yet */}
                        {trending.slice(0, 3).map((product) => (
                            <ProductCard key={product.id} product={product as any} />
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
                    >
                        {trendingCards.map((card) => (
                            <motion.div 
                                variants={fadeInUp} 
                                key={card.id} 
                                className="group relative w-full h-[500px] lg:h-[600px] overflow-hidden bg-gray-100 flex flex-col justify-end p-8"
                            >
                                <img src={card.image_url} alt={card.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                <div className="relative z-10 text-white">
                                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-80 mb-2 block">{card.subtitle}</span>
                                    <h3 className="text-3xl font-display mb-4">{card.title}</h3>
                                    <Link to={card.link_url} className="text-[10px] uppercase tracking-[0.2em] font-medium inline-block border-b border-white pb-1 group-hover:text-gray-300 group-hover:border-gray-300 transition-colors">
                                        Discover
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>

            {/* Newsletter VIP */}
            <section className="py-32 px-6 bg-gray-50 border-t border-gray-100 text-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] mix-blend-multiply"></div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-6 text-black">The Inner Circle</h2>
                    <p className="mb-12 text-sm md:text-base text-gray-500 font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                        Exclusive releases, thoughtful editorial, and early access. Join the few who know.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto border border-gray-200 hover:border-gray-300 transition-colors bg-white shadow-sm p-1" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            className="flex-1 bg-transparent px-6 py-4 outline-none text-sm text-black placeholder-gray-400 font-light"
                            required
                        />
                        <button disabled={newsletterStatus !== 'idle'} type="submit" className="bg-black text-white font-semibold px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-50">
                            {newsletterStatus === 'idle' ? 'Join' : newsletterStatus === 'submitting' ? '...' : 'Welcome'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};
