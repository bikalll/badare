import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Printer, Save, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useProductStore } from '../../store/useProductStore';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onUpdate: (updatedOrder: any) => void;
}

export const OrderDetailsModal = ({ isOpen, onClose, order, onUpdate }: OrderDetailsModalProps) => {
    const { products } = useProductStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (order && !isEditing) {
            setEditData(JSON.parse(JSON.stringify(order))); // Deep cloning
        }
    }, [order, isEditing]);

    if (!order || !editData) return null;

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...editData.items];
        newItems[index][field] = value;
        const newTotal = newItems.reduce((acc: number, item: any) => acc + (Number(item.price) * parseInt(item.quantity || 0)), 0);
        setEditData({ ...editData, items: newItems, total: newTotal });
    };

    const handleRemoveItem = (index: number) => {
        if (!window.confirm("Remove item?")) return;
        const newItems = editData.items.filter((_: any, i: number) => i !== index);
        const newTotal = newItems.reduce((acc: number, item: any) => acc + (Number(item.price) * parseInt(item.quantity || 0)), 0);
        setEditData({ ...editData, items: newItems, total: newTotal });
    };

    const handleProductSelect = (index: number, productIdentifier: string) => {
        const product = products.find(p => p.id === productIdentifier || p.name === productIdentifier);
        if (!product) return;
        
        const newItems = [...editData.items];
        newItems[index] = {
            ...newItems[index],
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            variant: { size: '', color: '' } 
        };
        const newTotal = newItems.reduce((acc: number, item: any) => acc + (Number(item.price) * parseInt(item.quantity || 0)), 0);
        setEditData({ ...editData, items: newItems, total: newTotal });
    };

    const handleVariantChange = (index: number, key: 'size' | 'color', val: string) => {
        const newItems = [...editData.items];
        newItems[index].variant = { ...newItems[index].variant, [key]: val };
        setEditData({ ...editData, items: newItems });
    };

    const handleSaveChanges = async () => {
        setIsUpdating(true);
        const { error } = await supabase.from('orders').update({
            shippingAddress: editData.shippingAddress,
            customerEmail: editData.customerEmail,
            items: editData.items,
            total: editData.total,
        }).eq('id', order.id);
        
        if (!error) {
            onUpdate(editData);
            setIsEditing(false);
        } else {
            alert('Failed to update order: ' + error.message);
        }
        setIsUpdating(false);
    };

    const handlePrint = () => {
        const printContent = `
            <html>
            <head>
                <title>Packing Slip - ${order.orderNumber || order.id}</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #111; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
                    th { background-color: #f8fafc; font-size: 12px; text-transform: uppercase; color: #64748b; }
                    .header { margin-bottom: 40px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
                    h2 { margin: 0 0 10px 0; color: #0f172a; }
                    .meta { color: #64748b; font-size: 14px; }
                    .ship-to { margin-top: 30px; }
                    .ship-to h3 { margin-top: 0; color: #64748b; font-size: 12px; text-transform: uppercase; }
                    .ship-to p { margin: 4px 0; font-weight: 500; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>Packing Slip</h2>
                    <p class="meta"><strong>Order ID:</strong> ${order.orderNumber || order.id} &nbsp;|&nbsp; <strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                    
                    <div class="ship-to">
                        <h3>Ship To:</h3>
                        <p>${editData.shippingAddress?.name || editData.customerEmail}</p>
                        <p>${editData.shippingAddress?.address || 'No Address Provided'}</p>
                        <p>${editData.shippingAddress?.contactNumber || editData.customerPhone || 'N/A'}</p>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr><th>Item</th><th>Variant</th><th>Qty</th></tr>
                    </thead>
                    <tbody>
                        ${(editData.items || []).map((item: any) => `
                            <tr>
                                <td><strong>${item.name}</strong></td>
                                <td>${item.variant?.size || '-'} / ${item.variant?.color || '-'}</td>
                                <td>${item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        const printWindow = window.open('', '', 'width=800,height=800');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 15 }}
                        className="bg-slate-50 border border-slate-200 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center bg-white border-b border-slate-200 px-6 py-4 z-10 shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Order Details</h2>
                                <p className="text-sm font-medium text-slate-500">ID: {order.orderNumber || order.id}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    <Printer size={16} /> Print Slip
                                </button>
                                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col gap-6">
                            
                            {/* Meta Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Customer Card */}
                                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Customer Info</h3>
                                        {!isEditing ? (
                                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                                <Edit2 size={12} /> Edit
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button onClick={() => setIsEditing(false)} className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                                                <button onClick={handleSaveChanges} disabled={isUpdating} className="flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md shadow-sm transition-colors disabled:opacity-50">
                                                    <Save size={12} /> {isUpdating ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Name</label>
                                                <input type="text" value={editData.shippingAddress?.name || ''} onChange={(e) => setEditData({...editData, shippingAddress: {...editData.shippingAddress, name: e.target.value}})} className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
                                                <input type="email" value={editData.customerEmail} onChange={(e) => setEditData({...editData, customerEmail: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone Number</label>
                                                <input type="text" value={editData.shippingAddress?.contactNumber || ''} onChange={(e) => setEditData({...editData, shippingAddress: {...editData.shippingAddress, contactNumber: e.target.value}})} className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div>
                                                <span className="block text-xs font-medium text-slate-500 uppercase">Name</span>
                                                <span className="font-semibold text-slate-800">{order.shippingAddress?.name || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs font-medium text-slate-500 uppercase">Email</span>
                                                <span className="font-semibold text-slate-800">{order.customerEmail}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs font-medium text-slate-500 uppercase">Phone</span>
                                                <span className="font-semibold text-slate-800">{order.shippingAddress?.contactNumber || order.customerPhone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Logistics Card */}
                                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Logistics Routing</h3>
                                    </div>
                                    
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
                                                <textarea rows={3} value={editData.shippingAddress?.address || ''} onChange={(e) => setEditData({...editData, shippingAddress: {...editData.shippingAddress, address: e.target.value}})} className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none"></textarea>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div>
                                                <span className="block text-xs font-medium text-slate-500 uppercase">Address</span>
                                                <span className="font-semibold text-slate-800 whitespace-pre-wrap">{order.shippingAddress?.address || 'N/A'}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-slate-500 uppercase">Created On</span>
                                            <span className="text-sm font-semibold text-slate-800">{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-slate-500 uppercase">Status</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                                order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                                                order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 
                                                order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Item Manifest */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                                    Item Manifest
                                </h3>
                                
                                <div className="flex flex-col gap-3">
                                    {editData.items && editData.items.length > 0 ? (
                                        editData.items.map((item: any, idx: number) => (
                                            <div key={idx} className={`flex gap-4 items-start md:items-center border rounded-lg p-4 transition-colors ${isEditing ? 'border-indigo-100 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                                                <div className="w-16 h-20 shrink-0 bg-slate-100 rounded-md overflow-hidden border border-slate-200 hidden sm:block">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                
                                                {isEditing ? (
                                                    <div className="flex-1 flex flex-col gap-3 w-full">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Product Base</label>
                                                            <select 
                                                                value={item.productId || item.name} 
                                                                onChange={(e) => handleProductSelect(idx, e.target.value)}
                                                                className="w-full border border-slate-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium"
                                                            >
                                                                <option value={item.name} disabled>{item.name}</option> 
                                                                {products.map(p => (
                                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                                            <div className="col-span-1 md:col-span-5 flex gap-2">
                                                                <div className="w-1/2">
                                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Size</label>
                                                                    <select 
                                                                        value={item.variant?.size || ''} 
                                                                        onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                                                                        className="w-full border border-slate-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800"
                                                                    >
                                                                        <option value="">-</option>
                                                                        {(products.find(p => p.id === item.productId || p.name === item.name)?.variants?.sizes || [item.variant?.size]).filter(Boolean).map((s: string) => (
                                                                            <option key={s} value={s}>{s}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="w-1/2">
                                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Color</label>
                                                                    <select 
                                                                        value={item.variant?.color || ''} 
                                                                        onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                                                                        className="w-full border border-slate-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800"
                                                                    >
                                                                        <option value="">-</option>
                                                                        {(products.find(p => p.id === item.productId || p.name === item.name)?.variants?.colors || [item.variant?.color]).filter(Boolean).map((c: string) => (
                                                                            <option key={c} value={c}>{c}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-1 md:col-span-3">
                                                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price (NPR)</label>
                                                                <input type="number" min="0" value={item.price} onChange={(e) => handleItemChange(idx, 'price', e.target.value)} className="w-full border border-slate-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium" />
                                                            </div>
                                                            <div className="col-span-1 md:col-span-4 flex items-end gap-2">
                                                                <div className="flex-1">
                                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Qty</label>
                                                                    <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} className="w-full border border-slate-300 rounded-md p-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium" />
                                                                </div>
                                                                <button 
                                                                    title="Remove Item" 
                                                                    onClick={() => handleRemoveItem(idx)} 
                                                                    className="p-2 text-rose-500 bg-white border border-rose-200 hover:bg-rose-50 rounded-md transition-colors"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 flex flex-col justify-between h-full">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800 mb-0.5">{item.name}</h4>
                                                            <p className="text-xs font-medium text-slate-500">{item.variant?.size} / {item.variant?.color}</p>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                                                            <p className="text-sm font-medium text-slate-500">Qty: {item.quantity}</p>
                                                            <p className="text-sm font-bold text-slate-900">NPR {item.price * item.quantity}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                                            <p className="text-sm font-medium text-slate-500">No items in this order.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Financial Header */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex justify-between items-center mb-4">
                                <span className={`text-base font-bold uppercase tracking-wider ${isEditing ? 'text-indigo-600' : 'text-slate-500'}`}>Total Amount</span>
                                <span className="text-2xl font-bold text-slate-900">NPR {editData.total}</span>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
