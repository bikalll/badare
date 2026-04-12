import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-gray-50 text-gray-600 py-16 px-6 mt-24 border-t border-gray-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2">
                    <Link to="/" className="inline-block mb-6">
                        <img src="/image.png" alt="BADAR-È" className="h-8 md:h-10 w-auto mix-blend-multiply object-contain grayscale" />
                    </Link>
                    <p className="max-w-sm text-sm font-light leading-relaxed text-gray-500">
                        Supreme clarity. Functional restraint. An elegant approach to modern aesthetic design.
                    </p>
                </div>

                <div className="flex flex-col gap-4 text-sm">
                    <h3 className="text-black font-medium uppercase tracking-widest mb-2">Shop</h3>
                    <Link to="/shop" className="hover:text-black transition-colors w-fit">All Products</Link>
                    <Link to="/shop?category=Apparel" className="hover:text-black transition-colors w-fit">Apparel</Link>
                    <Link to="/shop?category=Accessories" className="hover:text-black transition-colors w-fit">Accessories</Link>
                </div>

                <div className="flex flex-col gap-4 text-sm">
                    <h3 className="text-black font-medium uppercase tracking-widest mb-2">Info</h3>
                    <Link to="/about" className="hover:text-black transition-colors w-fit">About Us</Link>
                    <Link to="/faq" className="hover:text-black transition-colors w-fit">FAQ</Link>
                    <Link to="/contact" className="hover:text-black transition-colors w-fit">Contact</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-light gap-6">
                <div className="flex items-center gap-6">
                    <p>&copy; {new Date().getFullYear()} BADARE. ALL RIGHTS RESERVED.</p>
                </div>
                <div className="flex gap-6 mt-4 md:mt-0 uppercase tracking-widest">
                    <Link to="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
                    <Link to="/privacy-policy" className="hover:text-gray-600 transition-colors">Privacy</Link>
                </div>
                <div className="flex gap-6 uppercase tracking-widest">
                    <a href="https://www.instagram.com/badare.beyou/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">IG</a>
                    <a href="#" className="hover:text-black transition-colors">TW</a>
                    <a href="#" className="hover:text-black transition-colors">SP</a>
                </div>
            </div>
        </footer>
    );
};
