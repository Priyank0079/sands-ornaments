import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Ticket, Clock, RotateCcw, AlertTriangle, Image as ImageIcon,
    Users, IndianRupee, ListTree, Package, ShoppingBag,
    Truck, MapPin, XCircle, Activity, Ban, BatteryWarning,
    RefreshCw, CheckCircle2, MessageSquare
} from 'lucide-react';
import AdminStatsCard from '../components/AdminStatsCard';
import AdminTable from '../components/AdminTable';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const quickActions = [
        { label: 'ADD PRODUCT', icon: Plus, bg: 'bg-[#F0FDF4]', text: 'text-emerald-500', path: '/admin/products/new' },
        { label: 'CREATE COUPON', icon: Ticket, bg: 'bg-[#FDF2F8]', text: 'text-pink-500', path: '/admin/coupons/add' },
        { label: 'PENDING ORDERS', icon: Clock, bg: 'bg-[#FFF7ED]', text: 'text-orange-500', path: '/admin/orders?status=pending' },
        { label: 'CHECK RETURNS', icon: RotateCcw, bg: 'bg-[#FFF1F2]', text: 'text-rose-500', path: '/admin/returns' },
        { label: 'STOCK ALERTS', icon: AlertTriangle, bg: 'bg-[#FEF2F2]', text: 'text-red-500', path: '/admin/inventory/alerts' },
        { label: 'MANAGE BANNERS', icon: ImageIcon, bg: 'bg-[#EFF6FF]', text: 'text-blue-500', path: '/admin/banners' },
    ];

    const stats = [
        { label: 'TOTAL USERS', value: '0', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { label: 'TOTAL REVENUE', value: '₹6,839', icon: IndianRupee, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
        { label: 'TOTAL CATEGORIES', value: '4', icon: ListTree, color: 'text-purple-500', bgColor: 'bg-purple-50' },
        { label: 'TOTAL SUBCATEGORIES', value: '12', icon: ListTree, color: 'text-purple-500', bgColor: 'bg-purple-50' },
        { label: 'TOTAL PRODUCTS', value: '2', icon: Package, color: 'text-amber-500', bgColor: 'bg-amber-50' },
        { label: 'TOTAL ORDERS', value: '9', icon: ShoppingBag, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { label: 'PENDING ORDERS', value: '1', icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-50', badge: 'ACTION REQUIRED', badgeColor: 'text-red-500' },
        { label: 'DELIVERED ORDERS', value: '1', icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
        { label: 'SHIPPED ORDERS', value: '0', icon: Truck, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
        { label: 'OUT FOR DELIVERY', value: '0', icon: MapPin, color: 'text-purple-500', bgColor: 'bg-purple-50' },
        { label: 'CANCELLED ORDERS', value: '0', icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50' },
        { label: 'IN-PROCESS', value: '0', icon: Activity, color: 'text-cyan-500', bgColor: 'bg-cyan-50' },
        { label: 'SOLD OUT', value: '1', icon: Ban, color: 'text-red-500', bgColor: 'bg-red-50', badge: 'URGENT', badgeColor: 'text-red-500' },
        { label: 'LOW STOCK', value: '0', icon: BatteryWarning, color: 'text-amber-500', bgColor: 'bg-amber-50' },
        { label: 'PENDING RETURNS', value: '0', icon: RotateCcw, color: 'text-orange-500', bgColor: 'bg-orange-50' },
        { label: 'ACTIVE REPLACEMENTS', value: '0', icon: RefreshCw, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { label: 'COMPLETED RETURNS', value: '0', icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
        { label: 'ACTIVE COUPONS', value: '2', icon: Ticket, color: 'text-pink-500', bgColor: 'bg-pink-50' },
        { label: 'USER REVIEWS', value: '0', icon: MessageSquare, color: 'text-blue-400', bgColor: 'bg-blue-50' },
    ];

    const recentOrders = [
        { id: '#60c4a3d2', date: '07/02/2025', customer: 'Om Parteki', amount: '₹400', status: 'PENDING' },
        { id: '#6499c6d1', date: '07/02/2025', customer: 'Om Parteki', amount: '₹400', status: 'PENDING' },
        { id: '#7c7f4799', date: '07/02/2025', customer: 'Om Parteki', amount: '₹400', status: 'PENDING' },
        { id: '#72c7b12d', date: '07/02/2025', customer: 'Om Parteki', amount: '₹400', status: 'PENDING' },
        { id: '#5e6289b2', date: '07/02/2025', customer: 'Om Parteki', amount: '₹600', status: 'PENDING' },
    ];

    const orderColumns = [
        {
            header: 'ORDER',
            className: 'w-[30%]',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-black">{row.id}</span>
                    <span className="text-[10px] font-medium text-gray-400 mt-1">{row.date}</span>
                </div>
            )
        },
        {
            header: 'CUSTOMER',
            className: 'w-[30%]',
            render: (row) => (
                <span className="text-xs font-semibold text-gray-600 group-hover:text-black transition-colors">{row.customer}</span>
            )
        },
        {
            header: 'AMOUNT',
            className: 'w-[20%] text-right',
            render: (row) => (
                <span className="text-xs font-semibold text-black">{row.amount}</span>
            )
        },
        {
            header: 'STATUS',
            className: 'w-[20%] text-right',
            render: (row) => (
                <span className="inline-block text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-md">
                    {row.status}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">ADMIN DASHBOARD</h1>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">PLATFORM ANALYTICS & QUICK CONTROLS</p>
            </div>

            {/* Quick Management Section */}
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">QUICK MANAGEMENT</p>
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(action.path)}
                            className={`${action.bg} py-3 px-3 rounded-lg flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95 border border-transparent hover:border-black/5 group h-full`}
                        >
                            <div className="p-2 bg-white/60 rounded-full group-hover:scale-110 transition-transform">
                                <action.icon className={`w-4 h-4 ${action.text}`} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900 text-center leading-tight">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((stat, idx) => (
                    <AdminStatsCard
                        key={idx}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        bgColor={stat.bgColor}
                        badge={stat.badge}
                        badgeColor={stat.badgeColor}
                    />
                ))}
            </div>

            {/* Bottom Section: Recent Orders & Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">RECENT ORDERS</h2>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">QUEUE OF LATEST CUSTOMER ORDERS</p>
                        </div>
                        <button onClick={() => navigate('/admin/orders')} className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700">VIEW ALL</button>
                    </div>
                    <AdminTable columns={orderColumns} data={recentOrders} />
                </div>

                {/* Stock Alerts Widget */}
                <div className="bg-[#0F172A] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                            <h2 className="text-sm font-bold uppercase tracking-wide">STOCK ALERTS</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#1E293B] rounded-xl p-4 border border-white/5">
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 line-clamp-1">PREMIUM JUMBO ROASTED ROYALE CASHEWS</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                        <span className="text-gray-400">SIZE: 250G</span>
                                        <span className="text-red-400">0 LEFT</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                        <span className="text-gray-400">SIZE: 500G</span>
                                        <span className="text-red-400">0 LEFT</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                        <span className="text-gray-400">SIZE: 1KG</span>
                                        <span className="text-red-400">0 LEFT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
