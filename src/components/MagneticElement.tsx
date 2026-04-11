import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticElementProps {
    children: React.ReactNode;
    className?: string;
}

export const MagneticElement = ({ children, className = '' }: MagneticElementProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const springX = useSpring(position.x, springConfig);
    const springY = useSpring(position.y, springConfig);

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        // Intensity of pull
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    // Sync springs to state
    React.useEffect(() => {
        springX.set(position.x);
        springY.set(position.y);
    }, [position, springX, springY]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: springX, y: springY }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
};
