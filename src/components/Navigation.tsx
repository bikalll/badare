import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 md:px-16 lg:px-24 py-6 md:py-8 flex items-center justify-between border-b",
        isScrolled 
            ? "bg-white/95 backdrop-blur-3xl text-black border-black/5 shadow-sm py-4 md:py-5" 
            : "bg-transparent text-black border-transparent shadow-none"
    );

    return (
        <div className="flex justify-center w-full">
            <nav className={navClasses}>
                <div className="flex items-center gap-6 flex-1">
                    <button
                        className="md:hidden text-xs tracking-[0.2em] font-medium uppercase text-black hover:text-gray-500 transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        MENU
                    </button>

                    <div className="hidden md:flex gap-10 text-xs uppercase tracking-[0.2em] font-medium text-gray-500">
                        <Link to="/" className="hover:text-black transition-colors">Home</Link>
                        <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
                        <Link to="/about" className="hover:text-black transition-colors">About</Link>
                        <Link to="/contact" className="hover:text-black transition-colors">Contact</Link>
                        <Link to="/track" className="hover:text-black transition-colors">Track</Link>
                    </div>
                </div>

                <div className="flex-1 text-center flex justify-center">
                    <Link to="/" className="inline-flex items-center justify-center group overflow-visible">
                        {/* Rotating logo on hover with an elegant slow spin curve */}
                        <img src="/image.png" alt="BADAR-È" className="h-8 md:h-10 w-auto mix-blend-multiply object-contain group-hover:rotate-[360deg] transition-all duration-1000 ease-in-out" />
                    </Link>
                </div>

                <div className="flex items-center justify-end gap-6 md:gap-10 flex-1 text-xs uppercase tracking-[0.2em] font-medium text-gray-500">
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        aria-label="Search" 
                        className="hidden md:block hover:text-black transition-colors"
                    >
                        SEARCH
                    </button>
                    <button
                        onClick={toggleCart}
                        className="hover:text-black transition-colors"
                        aria-label="Cart"
                    >
                        CART {cartItemCount > 0 ? `[${cartItemCount}]` : ''}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                            <img src="/image.png" alt="BADAR-È" className="h-8 w-auto mix-blend-multiply object-contain" />
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="text-black hover:text-gray-600 p-2 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-8 text-2xl md:text-4xl font-light uppercase tracking-wide overflow-y-auto pl-4">
                        <Link to="/" className="hover:text-gray-500 transition-colors">Home</Link>
                        <Link to="/shop" className="hover:text-gray-500 transition-colors">Shop</Link>
                        <Link to="/about" className="hover:text-gray-500 transition-colors">About</Link>
                        <Link to="/contact" className="hover:text-gray-500 transition-colors">Contact</Link>
                        <Link to="/track" className="hover:text-gray-500 transition-colors">Track</Link>
                        <Link to="/faq" className="hover:text-gray-500 transition-colors">FAQ</Link>
                    </div>
                </div>
            )}

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
};
