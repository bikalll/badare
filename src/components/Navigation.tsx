import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MonkeyMascot } from './MonkeyMascot';
import { MagneticElement } from './MagneticElement';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { SearchModal } from './SearchModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    const { toggleCart, items } = useCartStore();
    const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navClasses = cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-6 flex items-center justify-between",
        isScrolled ? "bg-white text-black border-b-[8px] border-black brutalist-shadow-lg" :
            (isHome ? "bg-transparent text-black drop-shadow-md" : "bg-white text-black border-b-[8px] border-black")
    );

    return (
        <>
            <nav className={navClasses}>
                <div className="flex items-center gap-6 flex-1 drop-shadow-md">
                    <button
                        className="md:hidden bg-black text-white p-2 brutalist-border-white inverted-hover-reverse"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="w-8 h-8" />
                    </button>

                    <div className="hidden md:flex gap-4 text-lg uppercase tracking-widest font-black">
                        <MagneticElement><Link to="/shop" className="bg-white text-black px-4 py-2 brutalist-border inverted-hover shadow-[4px_4px_0_0_#000]">Shop</Link></MagneticElement>
                        <MagneticElement><Link to="/about" className="bg-white text-black px-4 py-2 brutalist-border inverted-hover shadow-[4px_4px_0_0_#000]">About</Link></MagneticElement>
                        <MagneticElement><Link to="/contact" className="bg-white text-black px-4 py-2 brutalist-border inverted-hover shadow-[4px_4px_0_0_#000]">Contact</Link></MagneticElement>
                        <MagneticElement><Link to="/track" className="bg-white text-black px-4 py-2 brutalist-border inverted-hover shadow-[4px_4px_0_0_#000]">Track</Link></MagneticElement>
                    </div>
                </div>

                <div className="flex-1 text-center">
                    <Link to="/" className="font-display text-5xl md:text-6xl uppercase tracking-tighter funky-glitch-text bg-white text-black px-4 py-1 brutalist-border shadow-[6px_6px_0_0_#000] inline-flex items-center gap-4 -rotate-2 hover:rotate-2 transition-transform">
                        <MonkeyMascot className="w-12 h-12 hover:animate-spin" />
                        Badare
                    </Link>
                </div>

                <div className="flex items-center justify-end gap-6 flex-1 drop-shadow-md">
                    <MagneticElement>
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Search" 
                            className="bg-white text-black p-3 brutalist-border inverted-hover shadow-[4px_4px_0_0_#000]"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </MagneticElement>
                    <MagneticElement>
                        <button
                            onClick={toggleCart}
                            className="relative bg-white text-black p-3 brutalist-border inverted-hover shadow-[4px_4px_0_0_#000]"
                            aria-label="Cart"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-3 -right-3 bg-black text-white text-sm font-black w-8 h-8 flex items-center justify-center rounded-none brutalist-border-white animate-wobble">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </MagneticElement>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6 overflow-hidden">
                    <div className="noise-overlay z-[-1]"></div>
                    <div className="flex justify-between items-center mb-16 border-b-[8px] border-black pb-6">
                        <Link to="/" className="font-display text-5xl uppercase tracking-tighter bg-black text-white px-4 py-2 brutalist-skew" onClick={() => setIsMobileMenuOpen(false)}>
                            Badare
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="bg-black text-white p-2 brutalist-skew">
                            <X className="w-10 h-10" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-12 text-6xl md:text-8xl font-display uppercase tracking-tighter overflow-y-auto">
                        <Link to="/shop" className="hover:funky-glitch-text bg-black text-white px-6 py-4 w-fit transition-transform transform hover:translate-x-8 brutalist-shadow-lg">Shop</Link>
                        <Link to="/about" className="hover:funky-glitch-text bg-black text-white px-6 py-4 w-fit transition-transform transform hover:translate-x-8 brutalist-shadow-lg">About</Link>
                        <Link to="/contact" className="hover:funky-glitch-text bg-black text-white px-6 py-4 w-fit transition-transform transform hover:translate-x-8 brutalist-shadow-lg">Contact</Link>
                        <Link to="/track" className="hover:funky-glitch-text bg-black text-white px-6 py-4 w-fit transition-transform transform hover:translate-x-8 brutalist-shadow-lg">Track</Link>
                        <Link to="/faq" className="hover:funky-glitch-text bg-black text-white px-6 py-4 w-fit transition-transform transform hover:translate-x-8 brutalist-shadow-lg">FAQ</Link>
                    </div>
                </div>
            )}

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};
