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
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [isHeroLoading, setIsHeroLoading] = useState(true);

    // Database connected hero functionality

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
            setIsHeroLoading(false);
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (heroSlides.length === 0) return;
        const interval = setInterval(() => {
            setSliderIndex((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

                        {isHeroLoading ? (
                            <div className="animate-pulse space-y-6">
                                <div className="h-24 md:h-32 bg-gray-200 rounded w-full max-w-lg mb-12"></div>
                                <div className="flex flex-col gap-4">
                                    <div className="h-4 bg-gray-200 rounded w-full max-w-[320px]"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/5 max-w-[280px]"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mt-4"></div>
                                </div>
                            </div>
                        ) : heroSlides.length > 0 ? (
                            <>
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
                            </>
                        ) : null}
                    </div>
                </div>

                {/* Right Image Pane - Slider */}
                <div className="w-full lg:w-[45%] h-[60vh] lg:h-screen relative overflow-hidden bg-gray-100 group">
                    {isHeroLoading ? (
                        <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse"></div>
                    ) : heroSlides.length > 0 ? (
                        <>
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
                                        className="absolute inset-0 w-full h-full object-cover opacity-90 object-[center_top]"
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
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">No highlight imagery available</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Manifesto Strip 1 */}
            <section className="py-24 px-6 text-center max-w-4xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-black">
                    Badare is not fashion.
                </h2>
                <p className="mt-8 text-sm md:text-base font-medium text-gray-500 uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
                    It’s a statement you wear when you’re done explaining yourself.
                </p>
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
                            Dress Like You Give A Damn
                        </h2>
                        <p className="text-gray-600 font-light text-sm md:text-base leading-relaxed mb-10">
                            Wearing Badare isn’t just putting on a T-shirt—it’s choosing bold self-expression, unapologetic style, and statement fashion that actually says something. It means you dress like you give a damn about who you are, what you stand for, and how loudly you want the world to hear it.
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

                {trending.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Fallback to normal products if no editorial cards are set up yet */}
                        {products.slice(0, 3).map((product) => (
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
                        {trending.slice(0, 4).map((product) => (
                            <motion.div
                                variants={fadeInUp}
                                key={product.id}
                                className="group relative w-full h-[500px] lg:h-[600px] overflow-hidden bg-gray-100 flex flex-col justify-end p-8"
                            >
                                <img src={(product.images && product.images.length > 0) ? product.images[0] : ((product.variants?.colors?.find((c: any) => typeof c === 'object' && (c as any).images && (c as any).images.length > 0) as any)?.images?.[0] || '')} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10 text-white">
                                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-80 mb-2 block">{product.category}</span>
                                    <h3 className="text-3xl font-display mb-4">{product.name}</h3>
                                    <Link to={`/product/${product.id}`} className="text-[10px] uppercase tracking-[0.2em] font-medium inline-block border-b border-white pb-1 group-hover:text-gray-300 group-hover:border-gray-300 transition-colors">
                                        Shop Now
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>

            {/* Manifesto Strip 2 */}
            <section className="py-24 px-6 text-center max-w-4xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-black">
                    We don’t dress to impress.
                </h2>
                <p className="mt-8 text-base md:text-lg font-light text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    We dress to express—the chaos, the confidence, the contradictions.
                </p>
            </section>

            {/* Customization Feature Block */}
            <section className="py-24 px-6 max-w-[80rem] mx-auto border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-6 block">The Badare Experience</span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-5xl tracking-tight leading-tight text-black mb-8">
                            Choose your Badare. <br /> Make it yours.
                        </h2>
                        <p className="text-gray-500 font-light text-base md:text-lg leading-relaxed mb-8">
                            We don't just sell clothes; we give you a canvas. Choose your design, select your product, pick your color, and find your perfect size. Everything is fully customizable according to your choice.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 mb-10">
                            <Link to="/custom" className="bg-black text-white font-medium text-[10px] md:text-xs uppercase px-12 py-5 tracking-[0.25em] hover:bg-gray-800 transition-colors">
                                Start Customizing
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <span className="text-[10px] uppercase font-semibold tracking-[0.2em] border border-gray-200 px-6 py-3 text-black">Design</span>
                            <span className="text-[10px] uppercase font-semibold tracking-[0.2em] border border-gray-200 px-6 py-3 text-black">Product</span>
                            <span className="text-[10px] uppercase font-semibold tracking-[0.2em] border border-gray-200 px-6 py-3 text-black">Color</span>
                            <span className="text-[10px] uppercase font-semibold tracking-[0.2em] border border-gray-200 px-6 py-3 text-black">Size</span>
                        </div>
                    </div>
                    <div className="relative aspect-square md:aspect-[4/5] bg-gray-100 overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000"
                            alt="Customizable Apparel"
                            className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        />
                        <div className="absolute inset-x-8 bottom-8 bg-white/90 backdrop-blur-md p-6 text-center">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black group-hover:text-gray-500 transition-colors">100% Modifiable</span>
                        </div>
                    </div>
                </div>
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
