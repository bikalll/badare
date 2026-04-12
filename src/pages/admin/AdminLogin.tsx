import { useState } from 'react';
import { Lock } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden z-50">
            <div className="bg-white border border-slate-200 text-slate-800 p-8 md:p-12 w-full max-w-md rounded-2xl shadow-xl z-10 relative">
                <div className="flex justify-center mb-8">
                    <div className="bg-indigo-50 text-indigo-600 p-4 rounded-full border border-indigo-100">
                        <Lock className="w-8 h-8" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-slate-900 tracking-tight mb-2">
                    Admin Access
                </h1>
                <p className="text-center text-sm font-medium text-slate-500 mb-8">
                    Enter your credentials to manage the store.
                </p>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 font-medium text-sm p-4 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold tracking-wider uppercase text-slate-500">Email Address</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="admin@badare.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium text-slate-900"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold tracking-wider uppercase text-slate-500">Password</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium text-slate-900"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-indigo-600 text-white font-semibold text-sm py-3 mt-4 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                    
                    <p className="text-center font-medium text-xs text-slate-400 mt-4">
                        Secure access for authorized personnel.
                    </p>
                </form>
            </div>
        </div>
    );
};
