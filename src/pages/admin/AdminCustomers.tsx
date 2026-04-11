import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Trash2, Mail, Users } from 'lucide-react';


export const AdminCustomers = () => {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('subscribers')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (data && !error) {
            setSubscribers(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleDelete = async (id: string, email: string) => {
        if (window.confirm(`Are you sure you want to purge subscriber: ${email}?`)) {
            const { error } = await supabase.from('subscribers').delete().eq('id', id);
            if (!error) {
                setSubscribers(prev => prev.filter(s => s.id !== id));
            } else {
                alert("Failed to purge subscriber.");
            }
        }
    };

    return (
        <div className="w-full max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-600" />
                        Customer Intel
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">Review newsletter subscriptions and contact profiles.</p>
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm text-sm font-semibold text-slate-700">
                    Total Operatives: <span className="text-indigo-600">{subscribers.length}</span>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col gap-4 p-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-full h-16 bg-slate-50 rounded-md animate-pulse"></div>
                        ))}
                    </div>
                ) : subscribers.length === 0 ? (
                    <div className="flex flex-col w-full items-center justify-center p-16 text-slate-500">
                        <Mail className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="font-medium text-lg text-slate-700">No Customers Identified</p>
                        <p className="text-sm mt-1">Wait for users to submit the Inner Circle intercept module.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Comm Link (Email)</th>
                                    <th className="px-6 py-4">Intercept Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {subscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                                    {sub.email.charAt(0).toUpperCase()}
                                                </div>
                                                {sub.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                            {new Date(sub.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(sub.id, sub.email)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 shadow-sm opacity-0 group-hover:opacity-100"
                                                title="Purge Intel"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
