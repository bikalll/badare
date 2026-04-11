import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MonkeyMascot } from './MonkeyMascot';

const COLORS = [
    '#FFFFFF', // Base white
    '#FF00FF', // Hot Pink
    '#00FFCC', // Cyber Green
    '#FFFF00', // Acid Yellow
    '#FF3300', // Neon Orange
    '#0033FF'  // Pure Blue
];

export const BrutalistHeroMockup = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [colorIndex, setColorIndex] = useState(0);

    // Rapid color cycling when hovered
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isHovered) {
            interval = setInterval(() => {
                setColorIndex((prev) => (prev === COLORS.length - 1 ? 1 : prev + 1));
            }, 300); // Shift color every 300ms
        } else {
            setColorIndex(0); // Reset to base white
        }
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <motion.div
            className="w-full h-[60vh] md:h-[80vh] relative group cursor-crosshair border-[12px] md:border-[24px] border-black shadow-[16px_16px_0_0_#000] hover:shadow-[32px_32px_0_0_#000] transition-all duration-300 overflow-hidden z-10 bg-white"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
                x: isHovered ? -8 : 0,
                y: isHovered ? -8 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Color Shifting Base Layer */}
            <motion.div
                className="absolute inset-0 z-0 transition-colors duration-200"
                style={{ backgroundColor: COLORS[colorIndex] }}
            />

            {/* Brutalist Background Grid Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-difference z-0"
                style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '40px 40px' }}
            />

            {/* Giant Monkey Mascot */}
            <motion.div
                className="w-full h-full relative z-10 flex items-center justify-center p-8 md:p-16 pointer-events-none"
                initial={{ scale: 1 }}
                animate={{
                    scale: isHovered ? 1.15 : 1,
                    rotate: isHovered ? -2 : 0,
                    y: isHovered ? -20 : 0
                }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            >
                <div className="w-[80vw] h-[80vw] md:w-[60vh] md:h-[60vh] max-w-[600px] max-h-[600px] relative mt-16 md:mt-0">
                    {/* The Giant Mascot */}
                    <MonkeyMascot
                        className={`w-full h-full text-black transition-all duration-300 drop-shadow-[8px_8px_0_rgba(255,255,255,1)] ${isHovered ? 'scale-110 drop-shadow-[32px_32px_0_rgba(255,255,255,1)]' : ''}`}
                        variant="brutalist"
                    />
                </div>
            </motion.div>

            {/* Large Obtrusive Glitch Text Overlay */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', bounce: 0.6 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none mix-blend-exclusion"
                    >
                        <h2 className="font-display text-[20vw] md:text-[14vw] leading-[0.8] text-white font-black uppercase mt-4 tracking-tighter mix-blend-difference drop-shadow-[12px_12px_0_rgba(0,0,0,1)] text-center" style={{ WebkitTextStroke: '2px black' }}>
                            PURE<br />FUNK
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Permanent Subtle Badges */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 text-black bg-white px-6 py-3 font-black uppercase text-xl md:text-3xl shadow-[8px_8px_0_0_#000] rotate-[-5deg] group-hover:rotate-[5deg] transition-transform duration-300 z-30 border-[6px] border-black">
                VOL. 01
            </div>

            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white bg-black px-4 py-2 font-black uppercase text-sm md:text-xl transform rotate-90 origin-bottom-left group-hover:rotate-0 transition-transform duration-500 z-30 group-hover:shadow-[8px_8px_0_0_#fff]">
                EXPERIMENTAL
            </div>
        </motion.div>
    );
};
