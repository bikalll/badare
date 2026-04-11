import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Search } from 'lucide-react';

export const AdminCRM = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCRM = async () => {
            const { data } = await supabase.from('orders').select('customerEmail, total, created_at, shippingAddress, status').neq('status', 'Cancelled');
            
            if (data) {
                const crmMap = new Map();
                
                data.forEach(order => {
                    const email = order.customerEmail;
                    if (!email) return;

                    const existing = crmMap.get(email) || { 
                        email, 
                        name: order.shippingAddress?.name || 'Unknown',
                        phone: order.shippingAddress?.contactNumber || 'N/A',
                        ltv: 0, 
                        orderCount: 0, 
                        lastOrder: order.created_at 
                    };

                    existing.ltv += Number(order.total || 0);
                    existing.orderCount += 1;
                    
                    if (new Date(order.created_at) > new Date(existing.lastOrder)) {
                        existing.lastOrder = order.created_at;
                        // Always keep the freshest name/phone
                        if (order.shippingAddress?.name) existing.name = order.shippingAddress.name;
                        if (order.shippingAddress?.contactNumber) existing.phone = order.shippingAddress.contactNumber;
                    }

                    crmMap.set(email, existing);
                });

                const sortedCustomers = Array.from(crmMap.values()).sort((a: any, b: any) => b.ltv - a.ltv);
                setCustomers(sortedCustomers);
            }
            setLoading(false);
        };
        fetchCRM();
    }, []);

    const filtered = customers.filter(c => 
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Intelligence (CRM)</h1>
                <p className="text-slate-500 mt-1 text-sm">Monitor shopper aggregates, Lifetime Values (LTV), and repeat purchasing data.</p>
            </div>

            {/* Filter Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                    <input 
                        type="text" 
                        placeholder="Search by Email or Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col gap-4 p-6">
                        <div className="w-full h-10 bg-slate-100 rounded-md animate-pulse"></div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-full h-16 bg-slate-50 rounded-md animate-pulse"></div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex w-full items-center justify-center p-12 text-sm text-slate-500">
                        No customer aggregates found.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                                <th className="py-4 pl-6 pr-4">Profile</th>
                                <th className="py-4 px-4">Contact</th>
                                <th className="py-4 px-4">Last Active</th>
                                <th className="py-4 px-4 text-right">Order Count</th>
                                <th className="py-4 px-6 text-right">Lifetime Value (LTV)</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {filtered.map((c, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 pl-6 pr-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">{c.name}</span>
                                            <span className="text-xs text-slate-500 mt-0.5">{c.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 font-medium">{c.phone}</td>
                                    <td className="py-4 px-4 text-slate-500">{new Date(c.lastOrder).toLocaleDateString()}</td>
                                    <td className="py-4 px-4 text-right font-medium">
                                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs">
                                            {c.orderCount}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right font-semibold text-slate-900">
                                        NPR {c.ltv.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
