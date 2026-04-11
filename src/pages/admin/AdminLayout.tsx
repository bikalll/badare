import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Package, LayoutDashboard, ShoppingCart, Users, Power, ChevronLeft, ChevronRight, Bell, Search, User as UserIcon, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminLogin } from './AdminLogin';
import { supabase } from '../../utils/supabaseClient';

export const AdminLayout = () => {
    const location = useLocation();
    const { isAuthenticated, setAuth, logout } = useAuthStore();
    const [isInitializing, setIsInitializing] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        // Fetch session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuth(session);
            setIsInitializing(false);
        });

        // Listen for realtime auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuth(session);
        });

        return () => subscription.unsubscribe();
    }, [setAuth]);

    if (isInitializing) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center font-display text-4xl uppercase tracking-tighter animate-pulse">Initializing Comm Link...</div>;
    }

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    const links = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/products', label: 'Products', icon: Package },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/admin/customers', label: 'Customers', icon: Users },
        { path: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    ];

    return (
        <div className="min-h-screen h-screen bg-slate-50 flex overflow-hidden font-sans relative z-50">
            {/* Sidebar Navigation */}
            <aside 
                className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 flex-shrink-0 text-slate-300 flex flex-col h-full border-r border-slate-800 shadow-xl transition-all duration-300 relative z-20`}
            >
                <div className={`p-6 mb-4 mt-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && <h2 className="text-xl font-bold tracking-wider text-white">Command</h2>}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)} 
                        className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link 
                                key={link.path} 
                                to={link.path}
                                title={isCollapsed ? link.label : ''}
                                className={`flex items-center gap-3 px-4 py-3 font-medium text-sm rounded-lg transition-colors ${isCollapsed ? 'justify-center px-0' : ''} ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-800">
                    <button 
                        onClick={logout} 
                        title={isCollapsed ? "Sign Out" : ""}
                        className={`w-full flex items-center gap-2 px-4 py-3 font-medium text-sm bg-slate-800 text-slate-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors ${isCollapsed ? 'justify-center px-0' : 'justify-center'}`}
                    >
                        <Power className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>
            
            {/* Main Interface */}
            <div className="flex flex-col flex-1 h-full overflow-hidden w-full relative z-10">
                {/* Header Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0 shadow-sm z-20">
                    {/* Search Component */}
                    <div className="relative w-full max-w-md hidden md:block">
                        <input 
                            type="text"
                            placeholder="Global system search..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>

                    <div className="flex items-center gap-6 ml-auto">
                        {/* Notifications */}
                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        </button>
                        
                        {/* User Profile */}
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer group">
                            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 group-hover:border-indigo-300 transition-colors">
                                <UserIcon className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
                            </div>
                            <div className="hidden md:flex flex-col">
                                <span className="text-sm font-bold text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">Admin Session</span>
                                <span className="text-xs font-medium text-slate-400">Authenticated</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Outlet Engine */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};
