import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Plus,
    List,
    ShoppingBag,
    ScanLine,
    LogOut,
    X,
    ChevronDown,
    Boxes,
    RotateCcw,
    RefreshCcw,
    AlertTriangle,
    Users,
    UserCircle
} from 'lucide-react';
import logo from '../assets/sands-logo.png';
import logoName from '../assets/sands-logoname.png';
import { sellerService } from '../services/sellerService';

const SellerSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/seller/dashboard' },
        {
            name: 'Products',
            icon: Package,
            path: '/seller/products',
            subItems: [
                { name: 'Product List', path: '/seller/products', icon: List },
                { name: 'Add Product', path: '/seller/products/new', icon: Plus }
            ]
        },
        {
            name: 'Inventory',
            icon: Boxes,
            path: '/seller/inventory',
            subItems: [
                { name: 'Overview', path: '/seller/inventory', icon: Boxes },
                { name: 'Adjust Stock', path: '/seller/inventory/adjust', icon: Plus },
                { name: 'Stock History', path: '/seller/inventory/history', icon: RotateCcw },
                { name: 'Low Stock Alerts', path: '/seller/inventory/alerts', icon: AlertTriangle },
                { name: 'Reports', path: '/seller/inventory/reports', icon: Package }
            ]
        },
        { name: 'Shipments', icon: ShoppingBag, path: '/seller/orders' },
        { name: 'Returns', icon: RotateCcw, path: '/seller/returns' },
        { name: 'Customers', icon: Users, path: '/seller/customers' },
        { name: 'Direct Sales', icon: ScanLine, path: '/seller/offline-sale' },
        { name: 'Metal Pricing', icon: RefreshCcw, path: '/seller/metal-pricing' },
        { name: 'Profile', icon: UserCircle, path: '/seller/profile' }
    ];

    const [expandedMenu, setExpandedMenu] = useState(() => {
        const activeItem = menuItems.find(item =>
            item.subItems?.some(sub => location.pathname === sub.path)
        );
        return activeItem ? activeItem.name : null;
    });

    const handleLogout = () => {
        sellerService.logout();
        navigate('/seller/login');
    };

    const handleMenuClick = (item) => {
        if (item.subItems) {
            setExpandedMenu(expandedMenu === item.name ? null : item.name);
            if (!isSidebarOpen) setIsSidebarOpen(true);
        } else {
            navigate(item.path);
            if (window.innerWidth <= 1024) {
                setIsSidebarOpen(false);
            }
        }
    };

    return (
        <aside
            className={`
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                fixed inset-y-0 left-0 z-[100] bg-[#3E2723] text-white transition-all duration-500 flex flex-col
                w-[300px] lg:z-50 border-r border-white/10
                ${isSidebarOpen ? 'lg:w-80' : 'lg:w-20'}
            `}
        >
            <div className="h-16 flex items-center justify-center px-4 border-b border-white/10 shrink-0 relative bg-[#3E2723]">
                {isSidebarOpen ? (
                    <img src={logoName} alt="Sands" className="h-13 lg:h-15 brightness-0 invert object-contain" />
                ) : (
                    <img src={logo} alt="S" className="h-13 w-13 mx-auto brightness-0 invert object-contain" />
                )}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors absolute right-2"
                >
                    <X className="w-6 h-6 text-gray-400" />
                </button>
            </div>

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
                                            <span className="text-lg lg:text-base font-semibold flex-1 tracking-wide">{item.name}</span>
                                            {item.subItems && (
                                                <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    <ChevronDown className="w-5 h-5" />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </button>

                                {item.subItems && isExpanded && (isSidebarOpen || window.innerWidth <= 1024) && (
                                    <div className="bg-black/20 lg:bg-transparent overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                        {item.subItems.map((subItem) => {
                                            const isSubActive = location.pathname === subItem.path;
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
    );
};

export default SellerSidebar;
