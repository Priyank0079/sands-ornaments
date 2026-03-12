import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Users, Image as ImageIcon,
    Bell, ChevronRight, ChevronDown, Star, HelpCircle, LogOut, Menu, X, ListTree,
    FileText, MessageSquare, Ticket, Settings, Plus, List, BookOpen,
    Clock, RefreshCw, RefreshCcw, RotateCcw, Boxes, ClipboardList, MapPin, Truck, CheckCircle2, XCircle,
    AlertTriangle, FileBarChart
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import logo from '../assets/sands-logo.png';
import logoName from '../assets/sands-logoname.png';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const location = useLocation();
    const navigate = useNavigate();
    const { orders } = useShop();

    const allOrders = useMemo(() => Object.values(orders || {}).flat(), [orders]);
    const getCount = (status) => allOrders.filter(o => o.status === status).length;

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Categories', icon: ImageIcon, path: '/admin/categories' },
        { name: 'Subcategories', icon: ListTree, path: '/admin/subcategories' },
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
        { name: 'FAQ', icon: MessageSquare, path: '/admin/faq' },
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
            if (!isSidebarOpen) setIsSidebarOpen(true); // Auto-open sidebar if expanding menu
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

                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className="text-right hidden sm:block font-medium">
                            <p className="text-[11px] lg:text-sm text-gray-900 font-bold">Admin User</p>
                            <p className="text-[9px] lg:text-xs text-gray-500 font-bold uppercase tracking-wider">Super Admin</p>
                        </div>
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FDFBF7] rounded-xl lg:rounded-full border border-gray-200 flex items-center justify-center text-[#5D4037] font-bold shadow-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-grow overflow-y-auto bg-gray-50 p-4 lg:p-8 space-y-6">
                    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
