import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Users, Image as ImageIcon,
    Bell, ChevronRight, ChevronDown, Star, HelpCircle, LogOut, Menu, X, ListTree,
    FileText, MessageSquare, Ticket, Settings, Plus, List, BookOpen,
    Clock, RefreshCw, RefreshCcw, RotateCcw, Boxes, ClipboardList, MapPin, Truck, CheckCircle2, XCircle,
    AlertTriangle, FileBarChart, Store
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import logo from '../assets/sands-logo.png';
import logoName from '../assets/sands-logoname.png';
import toast from 'react-hot-toast';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const location = useLocation();
    const navigate = useNavigate();
    const { orders, globalGst, setGlobalGst } = useShop();
    const [gstValue, setGstValue] = useState(globalGst);

    const allOrders = useMemo(() => Object.values(orders || {}).flat(), [orders]);
    const getCount = (status) => allOrders.filter(o => o.status === status).length;

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Categories', icon: ImageIcon, path: '/admin/categories' },

        {
            name: 'Products',
            icon: Package,
            path: '/admin/products',
            subItems: [
                { name: 'Add Product', path: '/admin/products/new', icon: Plus },
                { name: 'Product List', path: '/admin/products', icon: List }
            ]
        },
        { name: 'Coupons', icon: Ticket, path: '/admin/coupons' },
        {
            name: 'Orders',
            icon: ShoppingCart,
            path: '/admin/orders',
            subItems: [
                { name: `All Orders (${allOrders.length})`, path: '/admin/orders?status=all', icon: ShoppingCart },
                { name: `Pending (${getCount('Processing')})`, path: '/admin/orders?status=pending', icon: Clock },
                { name: `Received (${getCount('Received')})`, path: '/admin/orders?status=received', icon: CheckCircle2 },
                { name: `Processed (${getCount('Processed')})`, path: '/admin/orders?status=processed', icon: ClipboardList },
                { name: `Shipped (${getCount('Shipped')})`, path: '/admin/orders?status=shipped', icon: Truck },
                { name: `Out for Delivery (${getCount('Out For Delivery')})`, path: '/admin/orders?status=out-for-delivery', icon: MapPin },
                { name: `Delivered (${getCount('Delivered')})`, path: '/admin/orders?status=delivered', icon: CheckCircle2 },
                { name: `Cancelled (${getCount('Cancelled')})`, path: '/admin/orders?status=cancelled', icon: XCircle },
            ]
        },
        { name: 'Returns', icon: RotateCcw, path: '/admin/returns' },
        { name: 'Replacements', icon: RefreshCw, path: '/admin/replacements' },
        {
            name: 'Inventory',
            icon: Boxes,
            path: '/admin/inventory',
            subItems: [
                { name: 'Stock Adjustment', path: '/admin/inventory/adjust', icon: RefreshCcw },
                { name: 'Stock History', path: '/admin/inventory/history', icon: Clock },
                { name: 'Low Stock Alerts', path: '/admin/inventory/alerts', icon: AlertTriangle },
                { name: 'Reports', path: '/admin/inventory/reports', icon: FileBarChart }
            ]
        },
        { name: 'Sellers', icon: Store, path: '/admin/sellers' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Reviews', icon: Star, path: '/admin/reviews' },
        { name: 'Banners', icon: ImageIcon, path: '/admin/banners' },
        {
            name: 'Notifications',
            icon: Bell,
            path: '/admin/notifications',
            subItems: [
                { name: 'Create Notification', path: '/admin/notifications/add', icon: Plus },
                { name: 'Notification List', path: '/admin/notifications', icon: List }
            ]
        },
        {
            name: 'Support',
            icon: HelpCircle,
            path: '/admin/support',
            subItems: [
                { name: 'Support Tickets', path: '/admin/support', icon: Ticket },
                { name: 'Contact Inquiries', path: '/admin/support/inquiries', icon: MessageSquare }
            ]
        },

        {
            name: 'Pages',
            icon: FileText,
            path: '/admin/pages',
            subItems: [
                { name: 'Privacy Policy', path: '/admin/pages/privacy-policy', icon: FileText },
                { name: 'Terms & Conditions', path: '/admin/pages/terms-conditions', icon: FileText },
                { name: 'Return & Refund', path: '/admin/pages/return-refund-policy', icon: FileText },
                { name: 'Shipping Policy', path: '/admin/pages/shipping-policy', icon: FileText },
                { name: 'Cancellation Policy', path: '/admin/pages/cancellation-policy', icon: FileText },
                { name: 'Jewelry Care', path: '/admin/pages/jewelry-care', icon: FileText },
                { name: 'Warranty Info', path: '/admin/pages/warranty-info', icon: FileText },
                { name: 'Our Craftsmanship', path: '/admin/pages/our-craftsmanship', icon: FileText },
                { name: 'Customization', path: '/admin/pages/customization', icon: FileText },
                { name: 'About Us', path: '/admin/about-us', icon: FileText },
            ]
        },
        { name: 'Blogs', icon: BookOpen, path: '/admin/blogs' },
        { name: 'Sections', icon: LayoutDashboard, path: '/admin/sections' },
        { name: 'Global Settings', icon: Settings, path: '/admin/settings' },
    ];

    // Notification state with ref for count tracking
    const [notifications, setNotifications] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [latestNotif, setLatestNotif] = useState(null);
    const prevCountRef = React.useRef(0);

    React.useEffect(() => {
        const checkNotifications = () => {
            const allNotifs = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
            const unreadCount = allNotifs.filter(n => n.unread).length;
            
            if (unreadCount > prevCountRef.current) {
                // New notification arrived
                const newest = allNotifs.find(n => n.unread);
                if (newest) {
                    setLatestNotif(newest);
                    setShowPopup(true);
                    setTimeout(() => setShowPopup(false), 8000);
                }
            }
            prevCountRef.current = unreadCount;
            setNotifications(allNotifs);
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 3000); // Poll every 3 seconds

        window.addEventListener('storage', checkNotifications);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', checkNotifications);
        };
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;

    // State for expanded menus
    const [expandedMenu, setExpandedMenu] = useState(() => {
        // Auto-expand if current path matches a subitem
        const activeItem = menuItems.find(item =>
            item.subItems?.some(sub => location.pathname === sub.path)
        );
        return activeItem ? activeItem.name : null;
    });

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    const handleMenuClick = (item) => {
        if (item.subItems) {
            setExpandedMenu(expandedMenu === item.name ? null : item.name);
            if (!isSidebarOpen) setIsSidebarOpen(true);
            
            // If the item itself has a path, navigate to it too
            if (item.path) navigate(item.path);
        } else {
            navigate(item.path);
            if (window.innerWidth <= 1024) {
                setIsSidebarOpen(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-x-hidden admin-font-reset">
            <style>{`
                .admin-font-reset, .admin-font-reset * {
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
                }
                .sidebar-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .sidebar-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
            `}</style>
            {/* Sidebar Backdrop (Mobile only) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[90] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar / Mobile Menu Drawer */}
            <aside
                className={`
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    fixed inset-y-0 left-0 z-[100] bg-[#3E2723] text-white transition-all duration-500 flex flex-col
                    w-[300px] lg:z-50 border-r border-white/10
                    ${isSidebarOpen ? 'lg:w-80' : 'lg:w-20'}
                `}
            >
                {/* Header Section */}
                <div className="h-16 flex items-center justify-center px-4 border-b border-white/10 shrink-0 relative bg-[#3E2723]">
                    {isSidebarOpen ? (
                        <img src={logoName} alt="Sands" className="h-13 lg:h-15 brightness-0 invert object-contain" />
                    ) : (
                        <img src={logo} alt="S" className="h-13 w-13 mx-auto brightness-0 invert object-contain" />
                    )}
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors absolute right-2"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Scrollable Container for Nav */}
                <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll bg-[#3E2723]">
                    <nav className="py-6 lg:py-4 px-4 lg:px-0 space-y-1 lg:space-y-0 pb-20">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.subItems && location.pathname.startsWith(item.path));
                            const isExpanded = expandedMenu === item.name;

                            return (
                                <div key={item.name} className="flex flex-col">
                                    <button
                                        onClick={() => handleMenuClick(item)}
                                        className={`flex items-center gap-4 px-6 py-4 lg:py-3.5 rounded-xl lg:rounded-none transition-all w-full text-left ${isActive && !item.subItems
                                            ? 'bg-[#8D6E63] text-white shadow-lg lg:scale-100 scale-[1.02]'
                                            : isActive && item.subItems ? 'text-white bg-white/5' : 'text-gray-200 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className={`w-6 h-6 lg:w-6 lg:h-6 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                                        {(isSidebarOpen || window.innerWidth <= 1024) && (
                                            <>
                                                <span className="text-lg lg:text-base font-semibold lg:font-semibold flex-1 tracking-wide">{item.name}</span>
                                                {item.subItems && (
                                                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <ChevronDown className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </button>

                                    {/* Submenu */}
                                    {item.subItems && isExpanded && (isSidebarOpen || window.innerWidth <= 1024) && (
                                        <div className="bg-black/20 lg:bg-transparent overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                            {item.subItems.map((subItem) => {
                                                const currentPath = location.pathname + location.search;
                                                const isSubActive = currentPath === subItem.path ||
                                                    (subItem.path.includes('?status=all') && location.pathname === subItem.path.split('?')[0] && !location.search);

                                                return (
                                                    <button
                                                        key={subItem.path}
                                                        onClick={() => navigate(subItem.path)}
                                                        className={`flex items-center gap-3 pl-14 pr-6 py-3 w-full text-left transition-all ${isSubActive
                                                            ? 'text-white bg-white/5 font-bold'
                                                            : 'text-white/90 hover:text-white hover:bg-white/5'
                                                            }`}
                                                    >
                                                        <subItem.icon className="w-4 h-4" />
                                                        <span className="text-base font-medium">{subItem.name}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                        );
                    })}
                </nav>

                {/* Global Configuration Card - Added Above Logout */}
                {(isSidebarOpen || window.innerWidth <= 1024) && (
                    <div className="px-6 py-4 mx-4 mb-4 rounded-3xl bg-white/5 border border-white/10 space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                            <span className="text-[10px] font-black text-amber-200 uppercase tracking-widest leading-none">Global Master GST</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                                    <span className="text-xs font-bold text-gray-500">₹</span>
                                </div>
                                <input 
                                    type="number"
                                    value={gstValue}
                                    onChange={(e) => setGstValue(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-8 pr-4 text-xs font-black text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-white/10"
                                    placeholder="0"
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    setGlobalGst(gstValue);
                                    toast.success("Global GST fixed: " + gstValue);
                                }}
                                className="w-full py-2 bg-amber-600/90 hover:bg-amber-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-900/20"
                            >
                                Save Configuration
                            </button>
                        </div>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest text-center leading-relaxed">
                            Global Tax Standard
                        </p>
                    </div>
                )}
            </div>

                {/* Logout Section - Fixed at Bottom */}
                <div className="p-6 lg:p-4 border-t border-white/10 shrink-0 bg-[#3E2723]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors w-full px-2 py-3 lg:py-2"
                    >
                        <LogOut className="w-6 h-6 lg:w-6 lg:h-6" />
                        {(isSidebarOpen || window.innerWidth <= 1024) && <span className="text-lg lg:text-base font-semibold">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-grow flex flex-col h-screen overflow-hidden transition-all duration-500 ease-in-out ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-20'
                }`}>
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0 shadow-sm">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 lg:border-none shadow-sm lg:shadow-none"
                        >
                            {isSidebarOpen && window.innerWidth > 1024 ? <Menu className="w-5 h-5 text-gray-500" /> : <Menu className="w-5 h-5 text-gray-500" />}
                        </button>
                        <h2 className="text-sm lg:text-lg font-bold text-gray-800 tracking-tight line-clamp-1">
                            {menuItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-6">
                        {/* Notification Icon */}
                        <button 
                            onClick={() => navigate('/admin/notifications')}
                            className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 shadow-sm group"
                        >
                            <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-amber-600' : 'text-gray-500'} group-hover:scale-110 transition-transform`} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />

                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="text-right hidden sm:block font-medium">
                                <p className="text-[11px] lg:text-sm text-gray-900 font-bold tracking-tight">Admin User</p>
                                <p className="text-[9px] lg:text-xs text-gray-500 font-black uppercase tracking-widest mt-0.5">Super Admin</p>
                            </div>
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#3E2723] text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-[#3E2723]/20 border border-white/10">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-grow overflow-y-auto bg-gray-50 p-4 lg:p-8 space-y-6 relative">
                    {/* Floating Notification Popup */}
                    {showPopup && latestNotif && (
                        <div className="fixed top-20 right-8 z-[200] w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in slide-in-from-right-8 fade-in duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Bell className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{latestNotif.title}</h4>
                                    <p className="text-[11px] text-gray-500 font-bold mt-1 line-clamp-2 leading-relaxed uppercase tracking-tight">{latestNotif.message}</p>
                                    <button 
                                        onClick={() => {
                                            navigate(latestNotif.link || '/admin/notifications');
                                            setShowPopup(false);
                                        }}
                                        className="text-[10px] font-black text-[#3E2723] uppercase tracking-widest mt-3 hover:underline"
                                    >
                                        View Details
                                    </button>
                                </div>
                                <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
