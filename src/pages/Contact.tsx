import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from '../components/ScrambleText';
import { MagneticElement } from '../components/MagneticElement';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export const Contact = () => {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        const { error } = await supabase.from('contacts').insert([formData]);

        if (error) {
            console.error("Submission failed:", error);
            alert("Transmission failed. Try again.");
            setStatus("idle");
            return;
        }

        setStatus("success");
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus("idle"), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden bg-black text-white min-h-screen pt-40 pb-32 px-6"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Info Column */}
                <div className="flex flex-col justify-start">
                    <h1 className="font-display text-6xl md:text-[10rem] uppercase tracking-tighter mb-4 md:mb-8 leading-[0.8] funky-glitch-text text-white">
                        <ScrambleText text="TALK." />
                    </h1>
                    <div className="bg-white text-black p-4 md:p-8 brutalist-border-white shadow-[8px_8px_0_0_#fff] md:shadow-[16px_16px_0_0_#fff] rotate-1 mt-4 md:mt-8 space-y-8 md:space-y-12 shrink-0">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-display uppercase border-b-[4px] md:border-b-8 border-black pb-2 mb-4 md:mb-6 flex items-center gap-2 md:gap-4">
                                <MapPin className="w-6 h-6 md:w-10 md:h-10" /> ADDRESS
                            </h2>
                            <p className="text-lg md:text-2xl font-bold uppercase tracking-widest leading-relaxed">
                                BADARE STUDIOS<br />
                                HADIGAUN<br />
                                KATHMANDU, 44600<br />
                                NEPAL
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl md:text-4xl font-display uppercase border-b-[4px] md:border-b-8 border-black pb-2 mb-4 md:mb-6 flex items-center gap-2 md:gap-4">
                                <Phone className="w-6 h-6 md:w-10 md:h-10" /> DIRECT LINE
                            </h2>
                            <p className="text-lg md:text-2xl font-bold uppercase tracking-widest leading-relaxed">
                                +977 9808771537<br />
                                MON-FRI / 10AM - 6PM NPT
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl md:text-4xl font-display uppercase border-b-[4px] md:border-b-8 border-black pb-2 mb-4 md:mb-6 flex items-center gap-2 md:gap-4">
                                <Mail className="w-6 h-6 md:w-10 md:h-10" /> DIGITAL PING
                            </h2>
                            <p className="text-lg md:text-2xl font-bold uppercase tracking-widest leading-relaxed bg-black text-white p-2 md:p-4 brutalist-skew inline-block mt-2 break-all">
                                HELLO@BADARE.COM.NP
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-end mt-12 md:mt-0">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-black border-[4px] md:border-[12px] border-white p-6 md:p-12 shadow-[8px_8px_0_0_#fff] md:shadow-[16px_16px_0_0_#fff] rotate-0 md:-rotate-1 relative"
                    >
                        <div className="absolute -top-4 md:-top-6 -right-2 md:-right-6 bg-white text-black font-display text-xl md:text-3xl uppercase px-2 md:px-4 py-1 md:py-2 rotate-6 shadow-[4px_4px_0_0_#fff] md:shadow-[8px_8px_0_0_#fff]">
                            MAKE IT QUICK.
                        </div>

                        <div className="space-y-8 mt-8">
                            <div>
                                <label className="block text-lg md:text-2xl font-bold uppercase tracking-widest mb-2 md:mb-4">IDENTIFIER (NAME)</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-transparent border-2 md:border-4 border-white p-3 md:p-4 text-lg md:text-2xl font-bold outline-none focus:bg-white focus:text-black focus:shadow-[4px_4px_0_0_#fff] md:focus:shadow-[8px_8px_0_0_#fff] transition-all"
                                    placeholder="BIKAL BADARE"
                                />
                            </div>

                            <div>
                                <label className="block text-lg md:text-2xl font-bold uppercase tracking-widest mb-2 md:mb-4">COMM LINK (EMAIL)</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-transparent border-2 md:border-4 border-white p-3 md:p-4 text-lg md:text-2xl font-bold outline-none focus:bg-white focus:text-black focus:shadow-[4px_4px_0_0_#fff] md:focus:shadow-[8px_8px_0_0_#fff] transition-all"
                                    placeholder="JD@EXAMPLE.COM"
                                />
                            </div>

                            <div>
                                <label className="block text-lg md:text-2xl font-bold uppercase tracking-widest mb-2 md:mb-4">THE MESSAGE</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-transparent border-2 md:border-4 border-white p-3 md:p-4 text-lg md:text-2xl font-bold outline-none focus:bg-white focus:text-black focus:shadow-[4px_4px_0_0_#fff] md:focus:shadow-[8px_8px_0_0_#fff] transition-all resize-none"
                                    placeholder="WHAT DO YOU WANT?"
                                ></textarea>
                            </div>

                            <MagneticElement>
                                <button
                                    disabled={status !== "idle"}
                                    type="submit"
                                    className="w-full bg-white text-black font-display text-3xl md:text-5xl uppercase tracking-widest py-4 md:py-6 border-2 md:border-4 border-white hover:bg-black hover:text-white inverted-hover transition-all flex items-center justify-center gap-2 md:gap-4 disabled:opacity-50 disabled:cursor-not-allowed group mt-6 md:mt-8"
                                >
                                    {status === "idle" ? (
                                        <>SEND <Send className="w-6 h-6 md:w-10 md:h-10 group-hover:translate-x-4 transition-transform" /></>
                                    ) : status === "submitting" ? (
                                        <ScrambleText text="TRANSMITTING..." />
                                    ) : (
                                        "RECEIVED."
                                    )}
                                </button>
                            </MagneticElement>
                        </div>
                    </form>
                </div>

            </div>
        </motion.div>
    );
};
