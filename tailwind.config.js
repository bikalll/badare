/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    bg: "#FFFFFF",
                    text: "#0A0A0A"
                },
                accent: {
                    DEFAULT: "#0A0A0A",
                    hover: "#000000"
                },
                muted: "#F5F5F5",
                inverse: {
                    bg: "#0A0A0A",
                    text: "#FFFFFF"
                }
            },
            fontFamily: {
                display: ['"Archivo Black"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif']
            },
            keyframes: {
                glitch: {
                    '0%, 100%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-4px, 4px)' },
                    '40%': { transform: 'translate(-4px, -4px)' },
                    '60%': { transform: 'translate(4px, 4px)' },
                    '80%': { transform: 'translate(4px, -4px)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                wobble: {
                    '0%, 100%': { transform: 'translateX(0%) rotate(0deg)' },
                    '15%': { transform: 'translateX(-5px) rotate(-2deg)' },
                    '30%': { transform: 'translateX(3px) rotate(1deg)' },
                    '45%': { transform: 'translateX(-3px) rotate(-1.5deg)' },
                    '60%': { transform: 'translateX(1px) rotate(0.5deg)' },
                    '75%': { transform: 'translateX(-1px) rotate(-0.5deg)' }
                }
            },
            animation: {
                'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite',
                'glitch-hover': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both',
                'marquee-fast': 'marquee 10s linear infinite',
                'marquee-regular': 'marquee 20s linear infinite',
                'marquee-slow': 'marquee 40s linear infinite',
                'wobble': 'wobble 1s ease-in-out infinite'
            },
            cursor: {
                'crosshair': 'crosshair',
                'wait': 'wait',
                'move': 'move'
            }
        },
    },
    plugins: [],
}
