import { motion } from 'framer-motion';

interface ScrambleTextProps {
    text: string;
    className?: string;
}

export const ScrambleText = ({ text, className = '' }: ScrambleTextProps) => {
    // Split text into characters including spaces
    const characters = text.split("");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2
            }
        }
    };

    const characterVariants = {
        hidden: { opacity: 0, y: 50, rotateX: 90 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { type: "spring", damping: 12, stiffness: 200 }
        }
    };

    return (
        <motion.span
            className={`inline-block ${className}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
        >
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    variants={characterVariants}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};
