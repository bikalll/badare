import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Search } from 'lucide-react';

export const AdminOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            if (data) setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (!error) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } else {
            alert('Failed to update status: ' + error.message);
        }
    };

    const filteredOrders = orders.filter((o) => {
        // Status Filter
        if (filterStatus !== 'ALL') {
            if (filterStatus === 'ONGOING') {
                if (!['Pending', 'Processing', 'Shipped'].includes(o.status)) return false;
            } else {
                if (o.status !== filterStatus) return false;
            }
        }

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const emailMatch = o.customerEmail?.toLowerCase().includes(query);
            const idMatch = o.orderNumber?.toLowerCase().includes(query) || o.id?.toLowerCase().includes(query);
            if (!emailMatch && !idMatch) return false;
        }

        return true;
    });

    const handleExportCSV = () => {
        if (filteredOrders.length === 0) return alert('No orders to export.');
        
        const headers = ['Order ID', 'Date', 'Customer Email', 'Customer Name', 'Phone', 'Total (NPR)', 'Status', 'Items Summary'];
        
        const rows = filteredOrders.map(o => {
            const date = new Date(o.created_at).toLocaleDateString();
            const email = o.customerEmail || '';
            const name = `"${o.shippingAddress?.name || ''}"`;
            const phone = `"${o.shippingAddress?.contactNumber || o.customerPhone || ''}"`;
            const total = o.total;
            const status = o.status;
            
            // Summarize items for simple CSV view
            const items = o.items ? o.items.map((i: any) => `${i.quantity}x ${i.name}`).join(' | ') : '';
            const itemsFormatted = `"${items}"`;

            return [o.orderNumber || o.id, date, email, name, phone, total, status, itemsFormatted].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `badare_orders_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orders Ledger</h1>
                <p className="text-slate-500 mt-1 text-sm">Review, manage, and dispatch active customer shipments.</p>
            </div>

            {/* Filter Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="w-full md:w-auto">
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-auto bg-white border border-slate-200 text-slate-700 shadow-sm px-4 py-2.5 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                    >
                        <option value="ALL">All Manifests</option>
                        <option value="ONGOING">Ongoing Operations</option>
                        <option disabled>──────────</option>
                        <option value="Pending">Status: Pending</option>
                        <option value="Processing">Status: Processing</option>
                        <option value="Shipped">Status: Shipped</option>
                        <option value="Delivered">Status: Delivered</option>
                        <option value="Cancelled">Status: Cancelled</option>
                    </select>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                        <input 
                            type="text" 
                            placeholder="Search email or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <button 
                        onClick={handleExportCSV}
                        className="bg-white border border-slate-200 text-slate-700 shadow-sm px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col gap-4 p-6">
                        <div className="w-full h-10 bg-slate-100 rounded-md animate-pulse"></div>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-full h-16 bg-slate-50 rounded-md animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex w-full items-center justify-center p-12 text-sm text-slate-500">
                        No orders match filter.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                                <th className="py-4 pl-6 pr-4">Order ID</th>
                                <th className="py-4 px-4">Date</th>
                                <th className="py-4 px-4">Customer</th>
                                <th className="py-4 px-4">Total</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {filteredOrders.map((o) => (
                                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 pl-6 pr-4 font-medium text-slate-900 max-w-[120px] truncate">{o.orderNumber || o.id}</td>
                                    <td className="py-4 px-4 text-slate-500">{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-4">{o.customerEmail}</td>
                                    <td className="py-4 px-4 text-slate-500">NPR {o.total}</td>
                                    <td className="py-4 px-4">
                                        <select 
                                            value={o.status || 'Pending'} 
                                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                            className={`text-xs font-medium px-2 py-1 rounded-md outline-none cursor-pointer border border-transparent focus:ring-2 focus:ring-indigo-500 ${
                                                o.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                o.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button 
                                            onClick={() => setSelectedOrder(o)}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition-colors"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <OrderDetailsModal 
                isOpen={!!selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
                order={selectedOrder} 
                onUpdate={(updatedOrder) => {
                    setSelectedOrder(updatedOrder);
                    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
                }}
            />
        </div>
    );
};
