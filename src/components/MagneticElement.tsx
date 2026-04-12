import React from 'react';

interface MagneticElementProps {
    children: React.ReactNode;
    className?: string;
}

export const MagneticElement = ({ children, className = '' }: MagneticElementProps) => {
    return (
        <div className={`inline-block ${className}`}>
            {children}
        </div>
    );
};
