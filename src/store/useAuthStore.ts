import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';

interface AuthState {
    isAuthenticated: boolean;
    session: any | null;
    setAuth: (session: any | null) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    session: null,
    setAuth: (session) => set({ isAuthenticated: !!session, session }),
    logout: async () => {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, session: null });
    },
}));
