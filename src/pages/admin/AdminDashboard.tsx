import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 'NPR 0',
        activeOrders: 0,
        totalProducts: 0,
        newUsers: 0,
        chartData: [] as any[],
        maxChartVal: 1
    });
    const [activities, setActivities] = useState<{message: string, date: Date}[]>([]);
    const [loading, setLoading] = useState(true);

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const [ordersRes, productsCountRes, recentProductsRes, contactsRes, subscribersRes] = await Promise.all([
                supabase.from('orders').select('orderNumber, id, total, status, created_at, customerEmail, shippingAddress'),
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('products').select('name, created_at').order('created_at', { ascending: false }).limit(5),
                supabase.from('contacts').select('name, created_at').order('created_at', { ascending: false }).limit(5),
                supabase.from('subscribers').select('email, created_at').order('created_at', { ascending: false }).limit(5)
            ]);

            const orders = ordersRes.data || [];
            const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
            const totalSalesVal = orders.reduce((acc, order) => acc + Number(order.total), 0);

            // Activity Logs Builder
            let logs: { message: string, date: Date }[] = [];
            
            orders.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5).forEach(o => {
                const customerIdentifier = o.shippingAddress?.name || o.customerEmail || 'Customer';
                logs.push({ message: `Order ${o.orderNumber || o.id.slice(0,8)} created by ${customerIdentifier}`, date: new Date(o.created_at) });
            });
            
            (recentProductsRes.data || []).forEach(p => {
                logs.push({ message: `Product "${p.name}" Added`, date: new Date(p.created_at) });
            });

            (contactsRes.data || []).forEach(c => {
                logs.push({ message: `New inquiry from ${c.name}`, date: new Date(c.created_at) });
            });

            (subscribersRes.data || []).forEach(s => {
                logs.push({ message: `New subscriber: ${s.email}`, date: new Date(s.created_at) });
            });

            logs.sort((a,b) => b.date.getTime() - a.date.getTime());
            setActivities(logs.slice(0, 6));

            // Chart Builder Metrics (7 Day Rolling)
            const recentDays = Array.from({length: 7}).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.toDateString(), total: 0 };
            });

            orders.forEach(o => {
                const orderDate = new Date(o.created_at).toDateString();
                const dayMatch = recentDays.find(d => d.date === orderDate);
                if (dayMatch) dayMatch.total += Number(o.total || 0);
            });

            setStats({
                totalSales: `NPR ${totalSalesVal.toLocaleString()}`,
                activeOrders,
                totalProducts: productsCountRes.count || 0,
                newUsers: (subscribersRes.data || []).length,
                chartData: recentDays,
                maxChartVal: Math.max(...recentDays.map(d => d.total), 1)
            });
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div className="w-full max-w-7xl">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Dashboard Overview
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Monitor your store's recent activity and key metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-slate-500 mb-4">Total Sales</h3>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalSales}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-slate-500 mb-4">Active Orders</h3>
                    <p className="text-3xl font-bold text-slate-900">{stats.activeOrders}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-slate-500 mb-4">Total Products</h3>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
                </div>
                <div className="bg-indigo-600 rounded-xl p-6 shadow-md border border-indigo-500 flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-indigo-100 mb-4">New Users</h3>
                    <p className="text-3xl font-bold text-white">{stats.newUsers}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 h-auto lg:h-[400px]">
                
                {/* Render Native Analytics Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Revenue Velocity (Last 7 Days)</h2>
                    {loading ? (
                        <div className="flex-1 w-full h-full bg-slate-100 rounded-lg animate-pulse min-h-[220px]"></div>
                    ) : (
                        <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 mt-auto relative min-h-[220px]">
                            {/* Horizontal guide lines */}
                            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-20">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="border-t border-slate-400 w-full"></div>
                                ))}
                            </div>
                            
                            {stats.chartData.map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 flex-1 group z-10 w-full h-full">
                                    <div className="w-full flex justify-center relative h-full items-end">
                                        <div 
                                            className="w-full max-w-[24px] md:max-w-[48px] bg-indigo-100 group-hover:bg-indigo-600 rounded-t-md transition-all duration-500 relative cursor-pointer"
                                            style={{ height: `${(day.total / stats.maxChartVal) * 100}%`, minHeight: '4px' }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded shadow-lg font-medium whitespace-nowrap transition-opacity pointer-events-none">
                                                NPR {day.total.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{day.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Activity Feed Dock */}
                <div className="bg-white border border-slate-200 rounded-xl p-0 shadow-sm overflow-y-auto flex flex-col h-full">
                    <div className="px-6 py-5 border-b border-slate-200 sticky top-0 bg-white z-10">
                        <h2 className="text-lg font-semibold text-slate-900">Live Activity</h2>
                    </div>
                    {loading ? (
                        <div className="flex-1 flex flex-col gap-4 p-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full h-12 bg-slate-100 rounded-md animate-pulse"></div>
                            ))}
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="divide-y divide-slate-100 flex-1">
                            {activities.map((log, i) => (
                                <div key={i} className="px-6 py-4 flex flex-col gap-1 hover:bg-slate-50 transition-colors">
                                    <span className="text-sm font-medium text-slate-700 leading-tight">{log.message}</span>
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{getTimeAgo(log.date)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-sm text-slate-500">No recent activity detected.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
