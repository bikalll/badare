import { useEffect, useState } from 'react';

interface MascotProps {
    className?: string;
    variant?: 'ghost' | 'brutalist';
}

export const MonkeyMascot = ({ className = '', variant = 'brutalist' }: MascotProps) => {
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
        if (variant !== 'brutalist') return;

        // Randomly trigger an intense glitch state
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), Math.random() * 200 + 50);
            }
        }, 800);

        return () => clearInterval(interval);
    }, [variant]);

    const pathData = (
        <>
            <path d="M 18 50 L 82 50" />
            <path d="M 20 50 C 20 15, 50 15, 50 50" />
            <path d="M 50 50 C 50 15, 80 15, 80 50" />
            <path d="M 20 35 C 5 35, 5 48, 20 48" />
            <path d="M 80 35 C 95 35, 95 48, 80 48" />
            <path d="M 30 40 L 35 30 L 40 40" strokeLinejoin="miter" />
            <path d="M 60 40 L 65 30 L 70 40" strokeLinejoin="miter" />
            <path d="M 40 68 C 50 72, 58 68, 58 60 C 58 52, 52 50, 50 50 C 38 50, 32 62, 32 75 C 32 90, 45 95, 55 95 C 65 95, 70 88, 72 82" />
        </>
    );

    const bgFills = (
        <>
            <path d="M 20 50 C 20 15, 50 15, 50 50 Z" />
            <path d="M 50 50 C 50 15, 80 15, 80 50 Z" />
            <path d="M 20 35 C 5 35, 5 48, 20 48 Z" />
            <path d="M 80 35 C 95 35, 95 48, 80 48 Z" />
        </>
    );

    if (variant === 'ghost') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square">
                {pathData}
            </svg>
        );
    }

    return (
        <div className={`relative inline-block ${className} group`}>
            {/* Offset Hard Brutalist Shadow */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 translate-x-[6%] translate-y-[6%] text-black transition-transform duration-75 group-hover:translate-x-[12%] group-hover:translate-y-[12%]" stroke="currentColor" strokeWidth="6" strokeLinecap="square" fill="none">
                {pathData}
            </svg>

            {/* Glitch Offset Inverse Layer */}
            {glitchActive && (
                <svg viewBox="0 0 100 100" className="absolute inset-0 -translate-x-[4%] translate-y-[2%] text-white mix-blend-exclusion" stroke="currentColor" strokeWidth="5" strokeLinecap="square" fill="none">
                    {pathData}
                    <rect x="20" y="40" width="60" height="8" fill="white" stroke="none" />
                    <rect x="30" y="70" width="40" height="4" fill="white" stroke="none" />
                </svg>
            )}

            {/* Primary Foreground */}
            <svg viewBox="0 0 100 100" className={`relative z-10 text-black ${glitchActive ? '-translate-x-[2px]' : ''}`} stroke="currentColor" strokeWidth="5" strokeLinecap="square" fill="none">
                <g fill="white" stroke="none">
                    {bgFills}
                </g>
                <g>
                    {pathData}
                </g>
                {glitchActive && (
                    <g>
                        <path d="M 10 30 L 90 30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" />
                        <path d="M 10 65 L 90 65" stroke="currentColor" strokeWidth="3" strokeDasharray="12 4" />
                    </g>
                )}
            </svg>
        </div>
    );
};
