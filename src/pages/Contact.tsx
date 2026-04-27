import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useProductStore } from '../store/useProductStore';

export const Contact = () => {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (products.length === 0) fetchProducts();
    }, [fetchProducts, products.length]);

    const getProductImage = () => {
        if (!products || products.length === 0) return '';
        const p = products[products.length - 1]; // Use a recent product
        if (p.images && p.images.length > 0) return p.images[0];
        if (p.variants?.colors) {
            const firstColorWithImage = p.variants.colors.find((c: any) => typeof c === 'object' && c.images && c.images.length > 0);
            if (firstColorWithImage) return (firstColorWithImage as any).images[0];
        }
        return '';
    };
    const imageUrl = getProductImage();

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
            className="bg-white text-gray-900 min-h-screen pt-40 pb-32 px-6"
        >
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">

                {/* Info Column */}
                <div className="flex flex-col justify-start">
                    <h1 className="font-display text-4xl md:text-6xl uppercase tracking-widest mb-4 font-light">
                        Connect
                    </h1>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mb-12">
                        If your personality had an outfit, this would be it.
                    </p>
                    {imageUrl && (
                        <div className="w-full aspect-[16/9] overflow-hidden mb-12">
                            <img src={imageUrl} alt="Badare Editorial" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                        </div>
                    )}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <MapPin className="w-4 h-4" /> Headquarters
                            </h2>
                            <p className="text-sm font-light text-gray-600 leading-relaxed mt-4">
                                BADARE STUDIOS<br />
                                HADIGAUN<br />
                                KATHMANDU, 44600<br />
                                NEPAL
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Phone className="w-4 h-4" /> Direct Line
                            </h2>
                            <p className="text-sm font-light text-gray-600 leading-relaxed mt-4">
                                +977 9808771537<br />
                                MON-FRI / 10AM - 6PM NPT
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Mail className="w-4 h-4" /> Email
                            </h2>
                            <p className="text-sm font-light text-gray-600 leading-relaxed mt-4 break-all">
                                hello@badare.com.np
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="flex flex-col justify-start">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-50 border border-gray-100 p-8 md:p-12 shadow-sm rounded-sm"
                    >
                        <h2 className="font-display text-2xl uppercase tracking-widest mb-8 font-light text-gray-900">
                            Inquiries
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-medium uppercase tracking-widest mb-2 text-gray-500">Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white border border-gray-200 p-3 text-sm font-light outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-gray-900"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase tracking-widest mb-2 text-gray-500">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white border border-gray-200 p-3 text-sm font-light outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-gray-900"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase tracking-widest mb-2 text-gray-500">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-white border border-gray-200 p-3 text-sm font-light outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all resize-none text-gray-900"
                                    placeholder="How can we help?"
                                ></textarea>
                            </div>

                            <button
                                disabled={status !== "idle"}
                                type="submit"
                                className="w-full bg-gray-900 text-white font-medium text-sm uppercase tracking-widest py-4 hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mt-8 shadow-sm"
                            >
                                {status === "idle" ? (
                                    <>Send Message <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
                                ) : status === "submitting" ? (
                                    "Sending..."
                                ) : (
                                    "Message Sent"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </motion.div>
    );
};
