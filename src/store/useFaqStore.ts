import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    order_idx: number;
    created_at: string;
}

interface FaqState {
    faqs: FAQ[];
    fetchFaqs: () => Promise<void>;
    addFaq: (faq: Partial<FAQ>) => Promise<{error: any}>;
    updateFaq: (id: string, updates: Partial<FAQ>) => Promise<{error: any}>;
    deleteFaq: (id: string) => Promise<{error: any}>;
}

export const useFaqStore = create<FaqState>((set) => ({
    faqs: [],
    fetchFaqs: async () => {
        const { data, error } = await supabase.from('faqs').select('*').order('order_idx', { ascending: true });
        if (!error && data) {
            set({ faqs: data });
        }
    },
    addFaq: async (faq) => {
        const { error } = await supabase.from('faqs').insert([faq]);
        if (!error) {
            useFaqStore.getState().fetchFaqs();
        }
        return { error };
    },
    updateFaq: async (id, updates) => {
        const { error } = await supabase.from('faqs').update(updates).eq('id', id);
        if (!error) {
            useFaqStore.getState().fetchFaqs();
        }
        return { error };
    },
    deleteFaq: async (id) => {
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (!error) {
            useFaqStore.getState().fetchFaqs();
        }
        return { error };
    }
}));
