import React, { useState, useEffect } from 'react';
import { Bell, User, LogOut, ShoppingBag, XCircle, RotateCcw, AlertTriangle, CheckCircle2, Menu, ArrowLeft, QrCode } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sellerService } from '../services/sellerService';
import { sellerOrderService } from '../services/sellerOrderService';

const SellerHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [seller, setSeller] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const refreshSeller = () => setSeller(sellerService.getCurrentSeller());
        refreshSeller();
        loadNotifications();

        const interval = setInterval(loadNotifications, 5000);
        window.addEventListener('seller-profile-updated', refreshSeller);
        return () => {
            clearInterval(interval);
            window.removeEventListener('seller-profile-updated', refreshSeller);
        };
    }, []);

    const loadNotifications = async () => {
        const notifs = await sellerOrderService.getNotifications();
        const safeList = Array.isArray(notifs) ? notifs : [];
        setNotifications(safeList);
        setUnreadCount(safeList.filter(n => n.unread).length);
    };

    const handleLogout = () => {
        sellerService.logout();
        navigate('/seller/login');
    };

    const markRead = () => {
        sellerOrderService.markNotificationsRead();
        setUnreadCount(0);
        setShowNotifications(!showNotifications);
    };

    const getIcon = (type) => {
        switch(type) {
            case 'ORDER': return <ShoppingBag className="text-blue-500" size={16} />;
            case 'CANCEL': return <XCircle className="text-red-500" size={16} />;
            case 'RETURN': return <RotateCcw className="text-amber-500" size={16} />;
            case 'STOCK': return <AlertTriangle className="text-purple-500" size={16} />;
            default: return <Bell className="text-gray-400" size={16} />;
        }
    };

    // Helper to get page title based on path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('products')) return 'Products';
        if (path.includes('add-product')) return 'Add Product';
        if (path.includes('orders')) return 'Shipments';
        if (path.includes('returns')) return 'Returns';
        if (path.includes('customers')) return 'Customer Management';
        if (path.includes('profile')) return 'Identity Configuration';
        if (path.includes('offline-sale')) return 'Direct Sales';
        if (path.includes('inventory')) return 'Inventory Analysis';
        return 'Seller Panel';
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0 shadow-sm font-sans">
            <div className="flex items-center gap-3 lg:gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 lg:border-none shadow-sm lg:shadow-none"
                >
                    <Menu className="w-5 h-5 text-gray-500" />
                </button>
                <h2 className="text-sm lg:text-lg font-bold text-gray-800 tracking-tight line-clamp-1">
                    {getPageTitle()}
                </h2>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
                {/* Terminal Scanner */}
                <div className="relative">
                    <button 
                        onClick={() => navigate('/scanner')}
                        className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 shadow-sm group bg-amber-50/30 border-amber-100/50"
                        title="Terminal Scanner"
                    >
                        <QrCode className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                    </button>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                    <button 
                        onClick={markRead}
                        className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 shadow-sm group"
                    >
                        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-amber-600' : 'text-gray-500'} group-hover:scale-110 transition-transform`} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-6 font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[110]">
                            <div className="px-6 pb-4 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setShowNotifications(false)}
                                        className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-all lg:hidden"
                                    >
                                        <ArrowLeft size={14} />
                                    </button>
                                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Activity Stream</h4>
                                </div>
                                <span className="text-[8px] font-bold text-[#8D6E63] uppercase tracking-widest leading-none">{unreadCount} New Update</span>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto sidebar-scroll">
                                {notifications.length > 0 ? (
                                    notifications.map((n, i) => (
                                        <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 flex gap-4 items-start">
                                            <div className="p-2 bg-gray-50 rounded-lg shrink-0">{getIcon(n.type)}</div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-gray-900 uppercase leading-snug">{n.title}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase leading-relaxed">{n.message}</p>
                                                <p className="text-[8px] font-medium text-gray-300 mt-1 uppercase tracking-tighter">{new Date(n.date).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center space-y-3">
                                        <CheckCircle2 className="w-8 h-8 text-gray-100 mx-auto" strokeWidth={1} />
                                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">All caught up!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />

                {/* Profile */}
                <div className="flex items-center gap-2 lg:gap-3 group cursor-pointer">
                    <div className="text-right hidden sm:block font-medium">
                        <p className="text-[11px] lg:text-sm text-gray-900 font-bold tracking-tight uppercase line-clamp-1">{seller?.fullName || 'Seller'}</p>
                        <p className="text-[9px] lg:text-xs text-gray-500 font-black uppercase tracking-widest mt-0.5">Verified Merchant</p>
                    </div>
                    <div className="relative">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#3E2723] text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-[#3E2723]/20 border border-white/10 group-hover:scale-105 transition-transform">
                            {seller?.fullName?.charAt(0) || 'S'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SellerHeader;
