import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-white text-black py-24 px-6 mt-32 border-t-[16px] border-black brutalist-shadow-lg relative overflow-hidden">
            {/* Background Marquee for Footer */}
            <div className="absolute top-10 left-0 w-full overflow-hidden opacity-5 pointer-events-none">
                <div className="flex whitespace-nowrap animate-marquee-fast">
                    {Array(20).fill("BADARE ✦ ").map((text, i) => (
                        <span key={i} className="font-display text-9xl font-black uppercase mx-4">{text}</span>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2 relative z-10">
                    <h2 className="font-display text-7xl md:text-9xl uppercase tracking-tighter mb-6 text-black funky-glitch-text">Badare</h2>
                    <p className="max-w-sm text-xl font-bold bg-black text-white p-4 brutalist-border-white brutalist-shadow transform -rotate-1">
                        BE YOU. SUPREME CLARITY, FUNCTIONAL RESTRAINT, AND A FUNKY HEARTBEAT.
                    </p>
                </div>

                <div className="flex flex-col gap-6 text-xl font-black uppercase relative z-10">
                    <h3 className="text-black bg-white inline-block px-2 border-b-4 border-black w-fit tracking-widest mb-4">Shop</h3>
                    <Link to="/shop" className="inverted-hover brutalist-border p-2 w-fit transform transition-transform hover:scale-110">All Products</Link>
                    <Link to="/shop?category=Apparel" className="inverted-hover brutalist-border p-2 w-fit transform transition-transform hover:scale-110">Apparel</Link>
                    <Link to="/shop?category=Accessories" className="inverted-hover brutalist-border p-2 w-fit transform transition-transform hover:scale-110">Accessories</Link>
                </div>

                <div className="flex flex-col gap-6 text-xl font-black uppercase relative z-10">
                    <h3 className="text-black bg-white inline-block px-2 border-b-4 border-black w-fit tracking-widest mb-4">Info</h3>
                    <Link to="/about" className="inverted-hover brutalist-border p-2 w-fit transform transition-transform hover:scale-110">About Us</Link>
                    <Link to="/faq" className="inverted-hover brutalist-border p-2 w-fit transform transition-transform hover:scale-110">FAQ</Link>
                    <Link to="/contact" className="inverted-hover brutalist-border p-2 w-fit transform transition-transform hover:scale-110">Contact</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t-8 border-black pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-black font-bold uppercase gap-6 relative z-10">
                <div className="flex items-center gap-6">
                    <p className="bg-black text-white px-4 py-2 brutalist-skew">&copy; {new Date().getFullYear()} BADARE. ALL RIGHTS RESERVED.</p>
                </div>
                <div className="flex gap-6 mt-4 md:mt-0 text-lg">
                    <Link to="/terms" className="hover:underline decoration-4">TERMS</Link>
                    <Link to="/privacy-policy" className="hover:underline decoration-4">PRIVACY</Link>
                </div>
                <div className="flex gap-6 text-2xl">
                    <a href="https://www.instagram.com/badare.beyou/" target="_blank" rel="noopener noreferrer" className="inverted-hover brutalist-border px-4 py-2">IG</a>
                    <a href="#" className="inverted-hover brutalist-border px-4 py-2">TW</a>
                    <a href="#" className="inverted-hover brutalist-border px-4 py-2">SP</a>
                </div>
            </div>
        </footer>
    );
};
