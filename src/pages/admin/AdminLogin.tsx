import { useState } from 'react';
import { Lock } from 'lucide-react';
import { ScrambleText } from '../../components/ScrambleText';
import { supabase } from '../../utils/supabaseClient';

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden z-50">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSI+PC9wYXRoPjwvc3ZnPg==')] mix-blend-overlay opacity-30 pointer-events-none"></div>

            <div className="bg-white border-[16px] border-white text-black p-8 md:p-12 w-full max-w-lg brutalist-shadow-lg rotate-1 scale-105 z-10 relative">
                <div className="flex justify-center mb-8">
                    <div className="bg-black text-white p-4 brutalist-border shadow-[8px_8px_0_0_#000] -rotate-2">
                        <Lock className="w-12 h-12" />
                    </div>
                </div>

                <h1 className="font-display text-5xl md:text-6xl text-center uppercase tracking-tighter mb-8 leading-[0.9]">
                    <ScrambleText text="Admin" /> <br/>
                    <span className="funky-glitch-text inline-block transform -rotate-1">Access</span>
                </h1>

                {error && (
                    <div className="bg-red-600 text-white font-bold uppercase tracking-widest p-4 mb-6 brutalist-border shadow-[4px_4px_0_0_#000] rotate-1">
                        ERROR: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-xl font-black tracking-widest uppercase bg-black text-white px-2 py-1 absolute -top-4 left-4 rotate-[2deg]">Access ID</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="admin@badare.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-100 border-4 border-black p-4 outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none shadow-[4px_4px_0_0_#000] transition-all font-bold uppercase tracking-widest"
                        />
                    </div>

                    <div className="flex flex-col gap-2 relative mt-4">
                        <label className="text-xl font-black tracking-widest uppercase bg-black text-white px-2 py-1 absolute -top-4 left-4 -rotate-[2deg]">Passcode</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-100 border-4 border-black p-4 outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none shadow-[4px_4px_0_0_#000] transition-all font-bold tracking-widest"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-black text-white font-display text-3xl uppercase tracking-widest p-6 mt-6 brutalist-border shadow-[8px_8px_0_0_#000] hover:bg-white hover:text-black hover:shadow-[12px_12px_0_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Enter System'}
                    </button>
                    
                    <p className="text-center font-bold text-sm uppercase text-gray-500 mt-4 tracking-widest">
                        AUTHORIZED PERSONNEL ONLY.
                    </p>
                </form>
            </div>
        </div>
    );
};
