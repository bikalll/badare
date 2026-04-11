import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { ScrambleText } from '../components/ScrambleText';
import { useFaqStore } from '../store/useFaqStore';

export const FAQ = () => {
    const { faqs, fetchFaqs } = useFaqStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchFaqs().then(() => setLoading(false));
    }, [fetchFaqs]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden bg-white text-black min-h-screen pt-40 pb-32 px-6"
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="font-display text-7xl md:text-9xl uppercase tracking-tighter mb-16 brutalist-border p-6 bg-black text-white shadow-[16px_16px_0_0_#000] rotate-1">
                    <ScrambleText text="ANSWERS." />
                </h1>
                
                <p className="text-2xl font-bold uppercase tracking-widest mb-16 bg-white brutalist-border p-4 shadow-[8px_8px_0_0_#000] transform -rotate-1 w-max">
                    NO BS. JUST FACTS.
                </p>

                {loading ? (
                    <div className="space-y-6">
                        {[1,2,3].map(i => (
                            <div key={i} className="animate-pulse bg-gray-200 h-24 w-full brutalist-border shadow-[8px_8px_0_0_#000]"></div>
                        ))}
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="p-12 border-4 border-black text-center shadow-[8px_8px_0_0_#000]">
                        <p className="text-2xl font-bold uppercase tracking-widest text-gray-500">NO DIRECTIVES ESTABLISHED YET.</p>
                    </div>
                ) : (
                    <Accordion.Root type="single" collapsible className="space-y-6">
                        <AnimatePresence>
                            {faqs.map((faq, index) => (
                                <Accordion.Item 
                                    key={faq.id} 
                                    value={`item-${faq.id}`}
                                    className="bg-white brutalist-border shadow-[8px_8px_0_0_#000] overflow-hidden group inverted-hover-reverse transition-none"
                                >
                                    <Accordion.Header>
                                        <Accordion.Trigger className="w-full flex items-center justify-between p-6 text-2xl md:text-4xl font-display uppercase tracking-widest text-left">
                                            {faq.question}
                                            <ChevronDown className="w-8 h-8 transform transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180" />
                                        </Accordion.Trigger>
                                    </Accordion.Header>
                                    <Accordion.Content className="overflow-hidden">
                                        <div className="p-6 pt-0 text-xl font-bold uppercase tracking-widest border-t-4 border-black bg-black text-white whitespace-pre-wrap leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Item>
                            ))}
                        </AnimatePresence>
                    </Accordion.Root>
                )}
            </div>
        </motion.div>
    );
};
