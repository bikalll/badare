import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
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
            className="bg-white text-gray-900 min-h-screen pt-40 pb-32 px-6"
        >
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="font-display text-4xl md:text-6xl uppercase tracking-widest mb-6 font-light">
                        Answers
                    </h1>
                    <p className="text-sm font-light text-gray-500 uppercase tracking-widest">
                        Common inquiries
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-gray-50 h-16 w-full border border-gray-100"></div>
                        ))}
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-sm font-medium uppercase tracking-widest text-gray-400">No entries yet.</p>
                    </div>
                ) : (
                    <Accordion.Root type="single" collapsible className="space-y-4">
                        <AnimatePresence>
                            {faqs.map((faq) => (
                                <Accordion.Item 
                                    key={faq.id} 
                                    value={`item-${faq.id}`}
                                    className="bg-white border-b border-gray-200 overflow-hidden group"
                                >
                                    <Accordion.Header>
                                        <Accordion.Trigger className="w-full flex items-center justify-between py-6 text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 transition-colors text-left outline-none">
                                            {faq.question}
                                            <ChevronDown className="w-5 h-5 text-gray-400 transform transition-transform duration-300 group-data-[state=open]:rotate-180" />
                                        </Accordion.Trigger>
                                    </Accordion.Header>
                                    <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                                        <div className="pb-6 pr-8 text-sm md:text-base font-light text-gray-600 whitespace-pre-wrap leading-relaxed">
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
