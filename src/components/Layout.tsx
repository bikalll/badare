import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { QuickViewModal } from './QuickViewModal';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col selection:bg-black selection:text-white">
            <Navigation />
            <CartDrawer />
            <QuickViewModal />
            <main className="flex-1 w-full pt-[76px]">
                {children}
            </main>
            <Footer />
        </div>
    );
};
