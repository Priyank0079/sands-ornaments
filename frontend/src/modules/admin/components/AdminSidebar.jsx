import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Layers,
    Package,
    Boxes,
    ShoppingBag,
    RefreshCcw,
    Ticket,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    Store,
    Plus,
    List,
    Share2,
    Monitor,
    Bell,
    Headphones,
    MessageSquare,
    Phone,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    RotateCcw,
    ClipboardList,
    MapPin,
    RefreshCw,
    AlertTriangle,
    FileBarChart,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useShop } from '../../../context/ShopContext';
import logo from '../../../assets/logo.png';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [combosExpanded, setCombosExpanded] = useState(location.pathname.startsWith('/admin/combo'));
    const [comboProductsExpanded, setComboProductsExpanded] = useState(location.pathname.startsWith('/admin/combo-products'));
    const [productsExpanded, setProductsExpanded] = useState(location.pathname.startsWith('/admin/products'));
    const [notificationsExpanded, setNotificationsExpanded] = useState(location.pathname.startsWith('/admin/notifications'));
    const [supportExpanded, setSupportExpanded] = useState(location.pathname.startsWith('/admin/support') || location.pathname.startsWith('/admin/contact'));
    const [inventoryExpanded, setInventoryExpanded] = useState(location.pathname.startsWith('/admin/inventory'));
    const [sectionsExpanded, setSectionsExpanded] = useState(location.pathname.startsWith('/admin/sections'));

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const { orders } = useShop();
    const [ordersExpanded, setOrdersExpanded] = useState(location.pathname.startsWith('/admin/orders'));

    // Calculate order counts
    const allOrders = Object.values(orders || {}).flat();
    const orderCounts = {
        all: allOrders.length,
        pending: allOrders.filter(o => o.status === 'Processing').length,
        received: allOrders.filter(o => o.status === 'Received').length,
        processed: allOrders.filter(o => o.status === 'Processed').length,
        shipped: allOrders.filter(o => o.status === 'Shipped').length,
        outForDelivery: allOrders.filter(o => o.status === 'Out For Delivery').length,
        delivered: allOrders.filter(o => o.status === 'Delivered').length,
        cancelled: allOrders.filter(o => o.status === 'Cancelled').length,
    };

    const mainMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Store, label: 'Sellers', path: '/admin/sellers' },
        { icon: Layers, label: 'Categories', path: '/admin/categories' },
        { icon: Layers, label: 'Sub-categories', path: '/admin/sub-categories' },
    ];

    const secondaryMenuItems = [
        { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
        { icon: Monitor, label: 'Banners', path: '/admin/banners' },
        { icon: Share2, label: 'Referrals', path: '/admin/referrals' },
        { icon: FileText, label: 'Seller Terms', path: '/admin/seller-terms' },
    ];

    const isActive = (path) => location.pathname.startsWith(path);
    const isCombosActive = location.pathname.startsWith('/admin/combo');
    const isProductsActive = location.pathname.startsWith('/admin/products');
    const isOrdersActive = location.pathname.startsWith('/admin/orders');
    const isNotificationsActive = location.pathname.startsWith('/admin/notifications');
    const isSupportActive = location.pathname.startsWith('/admin/support') || location.pathname.startsWith('/admin/contact');
    const isInventoryActive = location.pathname.startsWith('/admin/inventory');
    const isSectionsActive = location.pathname.startsWith('/admin/sections');

    return (
        <div className="w-64 h-screen bg-footerBg text-white flex flex-col fixed left-0 top-0 z-50">
            {/* Logo Section */}
            <div className="p-6 border-b border-white/10 flex items-center gap-3 shrink-0">
                <img src={logo} alt="FarmLyf" className="h-8 w-auto object-contain" />
                <span className="font-brand font-bold text-xl tracking-tight">Admin</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 min-h-0 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>

                {/* Main Items */}
                {mainMenuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive(item.path)
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                        <span className="font-bold text-sm">{item.label}</span>
                    </Link>
                ))}

                {/* Products Section - Expandable */}
                <div className="mt-1">
                    <button
                        onClick={() => setProductsExpanded(!productsExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isProductsActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Package size={20} strokeWidth={isProductsActive ? 2.5 : 2} />
                        <span className="font-bold text-sm flex-1 text-left">Products</span>
                        <div className={`transition-transform duration-200 ${productsExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    </button>

                    {productsExpanded && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            <Link
                                to="/admin/products/new"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/products/new'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Plus size={16} />
                                <span className="font-semibold">Add Product</span>
                            </Link>
                            <Link
                                to="/admin/products"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/products'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <List size={16} />
                                <span className="font-semibold">Product List</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Combos Section */}
                <div className="mt-1">
                    <button
                        onClick={() => setCombosExpanded(!combosExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isCombosActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Boxes size={20} strokeWidth={isCombosActive ? 2.5 : 2} />
                        <span className="font-bold text-sm flex-1 text-left">Combos</span>
                        {combosExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {combosExpanded && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                            <Link
                                to="/admin/combo-categories"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/combo-categories'
                                    ? 'bg-primary/20 text-white'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <List size={16} />
                                <span className="font-semibold">Combo Categories</span>
                            </Link>
                            <div>
                                <button
                                    onClick={() => setComboProductsExpanded(!comboProductsExpanded)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname.startsWith('/admin/combo-products')
                                        ? 'bg-primary/20 text-white'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Package size={16} />
                                    <span className="font-semibold flex-1 text-left">Combo Products</span>
                                    {comboProductsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                                {comboProductsExpanded && (
                                    <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                                        <Link
                                            to="/admin/combo-products"
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs ${location.pathname === '/admin/combo-products'
                                                ? 'bg-primary/10 text-white'
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <List size={14} />
                                            <span className="font-semibold">Product List</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications Section - Expandable */}
                <div className="mt-1">
                    <button
                        onClick={() => setNotificationsExpanded(!notificationsExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isNotificationsActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Bell size={20} strokeWidth={isNotificationsActive ? 2.5 : 2} />
                        <span className="font-bold text-sm flex-1 text-left">Notifications</span>
                        <div className={`transition-transform duration-200 ${notificationsExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    </button>

                    {notificationsExpanded && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            <Link
                                to="/admin/notifications/add"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/notifications/add'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Plus size={16} />
                                <span className="font-semibold">Create Notification</span>
                            </Link>
                            <Link
                                to="/admin/notifications"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/notifications'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <List size={16} />
                                <span className="font-semibold">All Notifications</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Support Section - Expandable */}
                <div className="mt-1">
                    <button
                        onClick={() => setSupportExpanded(!supportExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isSupportActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Headphones size={20} strokeWidth={isSupportActive ? 2.5 : 2} />
                        <span className="font-bold text-sm flex-1 text-left">Support</span>
                        <div className={`transition-transform duration-200 ${supportExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    </button>

                    {supportExpanded && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            <Link
                                to="/admin/support"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/support'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Ticket size={16} />
                                <span className="font-semibold">Support Tickets</span>
                            </Link>
                            <Link
                                to="/admin/support/inquiries"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/support/inquiries'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <MessageSquare size={16} />
                                <span className="font-semibold">Contact Inquiries</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Order Management Section */}
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 mt-6 px-2">Order Management</p>

                <div className="mt-1">
                    <button
                        onClick={() => setOrdersExpanded(!ordersExpanded)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isOrdersActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingBag size={20} strokeWidth={isOrdersActive ? 2.5 : 2} />
                            <span className="font-bold text-sm">Order List</span>
                        </div>
                        <div className={`transition-transform duration-200 ${ordersExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    </button>

                    {ordersExpanded && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            {/* All Orders */}
                            <Link
                                to="/admin/orders?status=all"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=all' || location.pathname === '/admin/orders' && !location.search
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <ShoppingBag size={14} />
                                    <span className="font-bold">All Order</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${location.search === '?status=all' ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white'}`}>{orderCounts.all}</span>
                            </Link>

                            {/* Pending Orders */}
                            <Link
                                to="/admin/orders?status=pending"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=pending'
                                    ? 'bg-amber-500/20 text-amber-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-amber-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span className="font-bold">Pending Order</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${location.search === '?status=pending' ? 'bg-amber-500 text-white' : 'bg-white/10 text-gray-400 group-hover:bg-amber-500/50 group-hover:text-white'}`}>{orderCounts.pending}</span>
                            </Link>

                            {/* Received Orders */}
                            <Link
                                to="/admin/orders?status=received"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=received'
                                    ? 'bg-blue-400/20 text-blue-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-blue-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} />
                                    <span className="font-bold">Received Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-blue-400/50 group-hover:text-white">{orderCounts.received}</span>
                            </Link>

                            {/* Processed Orders */}
                            <Link
                                to="/admin/orders?status=processed"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=processed'
                                    ? 'bg-indigo-500/20 text-indigo-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-indigo-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <ClipboardList size={14} />
                                    <span className="font-bold">Processed Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-indigo-500/50 group-hover:text-white">{orderCounts.processed}</span>
                            </Link>

                            {/* Shipped Orders */}
                            <Link
                                to="/admin/orders?status=shipped"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=shipped'
                                    ? 'bg-blue-600/20 text-blue-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-blue-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Truck size={14} />
                                    <span className="font-bold">Shipped Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-blue-600/50 group-hover:text-white">{orderCounts.shipped}</span>
                            </Link>

                            {/* Out For Delivery */}
                            <Link
                                to="/admin/orders?status=out-for-delivery"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=out-for-delivery'
                                    ? 'bg-purple-500/20 text-purple-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-purple-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    <span className="font-bold">Out For Delivery</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-purple-500/50 group-hover:text-white">{orderCounts.outForDelivery}</span>
                            </Link>

                            {/* Delivered */}
                            <Link
                                to="/admin/orders?status=delivered"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=delivered'
                                    ? 'bg-green-500/20 text-green-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-green-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} />
                                    <span className="font-bold">Delivered Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-green-500/50 group-hover:text-white">{orderCounts.delivered}</span>
                            </Link>

                            {/* Cancelled */}
                            <Link
                                to="/admin/orders?status=cancelled"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=cancelled'
                                    ? 'bg-red-500/20 text-red-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-red-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <XCircle size={14} />
                                    <span className="font-bold">Cancelled Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-red-500/50 group-hover:text-white">{orderCounts.cancelled}</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Returns */}
                <Link
                    to="/admin/returns"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${location.pathname === '/admin/returns'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <RotateCcw size={20} strokeWidth={location.pathname === '/admin/returns' ? 2.5 : 2} />
                    <span className="font-bold text-sm">Returns</span>
                </Link>

                {/* Replacements */}
                <Link
                    to="/admin/replacements"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${location.pathname === '/admin/replacements'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <RefreshCw size={20} strokeWidth={location.pathname === '/admin/replacements' ? 2.5 : 2} />
                    <span className="font-bold text-sm">Replacements</span>
                </Link>

                {/* Inventory Management */}
                {/* Inventory Management Section - Expandable */}
                <div className="mt-1">
                    <button
                        onClick={() => setInventoryExpanded(!inventoryExpanded)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isInventoryActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Boxes size={20} strokeWidth={isInventoryActive ? 2.5 : 2} />
                            <span className="font-bold text-sm">Inventory</span>
                        </div>
                        <div className={`transition-transform duration-200 ${inventoryExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    </button>

                    {inventoryExpanded && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            <Link
                                to="/admin/inventory"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <LayoutDashboard size={14} />
                                <span className="font-semibold">Overview</span>
                            </Link>
                            <Link
                                to="/admin/inventory/adjust"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory/adjust'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <RefreshCcw size={14} />
                                <span className="font-semibold">Stock Adjustment</span>
                            </Link>
                            <Link
                                to="/admin/inventory/history"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory/history'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Clock size={14} />
                                <span className="font-semibold">Stock History</span>
                            </Link>
                            <Link
                                to="/admin/inventory/alerts"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory/alerts'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <AlertTriangle size={14} />
                                <span className="font-semibold">Low Stock Alerts</span>
                            </Link>
                            <Link
                                to="/admin/inventory/reports"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory/reports'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <FileBarChart size={14} />
                                <span className="font-semibold">Reports</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Secondary Items */}
                {secondaryMenuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive(item.path)
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                        <span className="font-bold text-sm">{item.label}</span>
                    </Link>
                ))}

                <div className="mt-1">
                    <button
                        onClick={() => setSectionsExpanded(!sectionsExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isSectionsActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Layers size={20} strokeWidth={isSectionsActive ? 2.5 : 2} />
                        <span className="font-bold text-sm flex-1 text-left">Sections</span>
                        <div className={`transition-transform duration-200 ${sectionsExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    </button>

                    {sectionsExpanded && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            {[
                                { label: 'Home Sections', pageKey: 'home' },
                                { label: 'Shop for Men', pageKey: 'shop-men' },
                                { label: 'Shop for Women', pageKey: 'shop-women' },
                                { label: 'Shop for Family', pageKey: 'shop-family' }
                            ].map((item) => {
                                const href = `/admin/sections?pageKey=${item.pageKey}`;
                                const isActiveItem = location.pathname.startsWith('/admin/sections') && location.search.includes(`pageKey=${item.pageKey}`);
                                return (
                                    <Link
                                        key={item.pageKey}
                                        to={href}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${isActiveItem
                                            ? 'bg-primary/20 text-white shadow-sm'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <List size={16} />
                                        <span className="font-semibold">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 space-y-1 shrink-0">
                <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                    <Settings size={20} />
                    <span className="font-bold text-sm">Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-left"
                >
                    <LogOut size={20} />
                    <span className="font-bold text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
