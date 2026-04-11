import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const Preloader = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    const [isLoading, setIsLoading] = useState(!isAdmin);
    const [textIndex, setTextIndex] = useState(0);
    const texts = ["LOADING VOID...", "NOISE IS CHEAP", "BE YOU"];

    useEffect(() => {
        if (isAdmin) return;

        const interval = setInterval(() => {
            setTextIndex(prev => (prev + 1) % texts.length);
        }, 300);

        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [texts.length, isAdmin]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[10000] bg-black text-white flex items-center justify-center pointer-events-auto"
                >
                    <div className="font-display text-5xl md:text-[8rem] uppercase tracking-tighter mix-blend-difference funky-glitch-text">
                        {texts[textIndex]}
                    </div>

                    <motion.div
                        className="absolute bottom-10 inset-x-10 h-2 bg-white origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2.2, ease: "circInOut" }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
