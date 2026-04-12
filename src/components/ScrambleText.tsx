interface ScrambleTextProps {
    text: string;
    className?: string;
}

export const ScrambleText = ({ text, className = '' }: ScrambleTextProps) => {
    return (
        <span className={className}>
            {text}
        </span>
    );
};
