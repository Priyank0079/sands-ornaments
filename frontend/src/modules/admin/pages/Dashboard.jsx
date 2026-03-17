import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import {
    Plus, Ticket, Clock, RotateCcw, AlertTriangle, Image as ImageIcon,
    Users, IndianRupee, ListTree, Package, ShoppingBag,
    Truck, MapPin, XCircle, Activity, Ban, BatteryWarning,
    RefreshCw, CheckCircle2, MessageSquare, Store
} from 'lucide-react';
import AdminStatsCard from '../components/AdminStatsCard';
import AdminTable from '../components/AdminTable';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = React.useState({
        users: 0,
        orders: 0,
        pendingOrders: 0,
        sellers: 0,
        revenue: 0,
        recent: []
    });

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('admin/stats');
                if (res.data.success) {
                    const { stats, recentOrders } = res.data;
                    setStatsData({
                        users: stats.totalUsers || 0,
                        orders: stats.totalOrders || 0,
                        pendingOrders: stats.pendingOrders || 0,
                        sellers: stats.totalSellers || 0,
                        revenue: stats.totalRevenue || 0,
                        recent: recentOrders.map(o => ({
                            id: o._id,
                            date: new Date(o.createdAt).toLocaleDateString(),
                            customer: o.user?.fullName || o.shippingAddress?.firstName || 'Customer',
                            amount: `₹${(o.totalAmount || 0).toLocaleString()}`,
                            status: (o.orderStatus || 'PENDING').toUpperCase()
                        }))
                    });
                }
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const quickActions = [
        { label: 'ADD PRODUCT', icon: Plus, bg: 'bg-[#F0FDF4]', text: 'text-emerald-500', path: '/admin/products/new' },
        { label: 'CREATE COUPON', icon: Ticket, bg: 'bg-[#FDF2F8]', text: 'text-pink-500', path: '/admin/coupons/add' },
        { label: 'PENDING ORDERS', icon: Clock, bg: 'bg-[#FFF7ED]', text: 'text-orange-500', path: '/admin/orders?status=pending' },
        { label: 'CHECK RETURNS', icon: RotateCcw, bg: 'bg-[#FFF1F2]', text: 'text-rose-500', path: '/admin/returns' },
        { label: 'STOCK ALERTS', icon: AlertTriangle, bg: 'bg-[#FEF2F2]', text: 'text-red-500', path: '/admin/inventory/alerts' },
        { label: 'MANAGE SELLERS', icon: Store, bg: 'bg-[#EFF6FF]', text: 'text-blue-500', path: '/admin/sellers' },
    ];

    const stats = [
        { label: 'TOTAL USERS', value: statsData.users, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { label: 'TOTAL REVENUE', value: `₹${statsData.revenue.toLocaleString()}`, icon: IndianRupee, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
        { label: 'TOTAL SELLERS', value: statsData.sellers, icon: Store, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
        { label: 'TOTAL ORDERS', value: statsData.orders, icon: ShoppingBag, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { label: 'PENDING ORDERS', value: statsData.pendingOrders, icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-50', badge: statsData.pendingOrders > 0 ? 'ACTION REQUIRED' : '', badgeColor: 'text-red-500' },
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
            <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">ADMIN DASHBOARD</h1>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">PLATFORM ANALYTICS & QUICK CONTROLS</p>
            </div>

            {/* Quick Management Section */}
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-left">QUICK MANAGEMENT</p>
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
                <button 
                    onClick={() => {
                        const notifs = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
                        notifs.unshift({
                            id: Date.now(),
                            title: 'New Seller Registration',
                            message: 'A new merchant has just registered for a seller account.',
                            date: new Date().toISOString(),
                            unread: true,
                            isRead: false,
                            type: 'SELLER_REQUEST',
                            priority: 'High',
                            time: 'just now',
                            link: '/admin/sellers'
                        });
                        localStorage.setItem('admin_notifications', JSON.stringify(notifs));
                        alert('Simulation started! You should see a popup in a few seconds.');
                    }}
                    className="flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-2xl border border-indigo-100 hover:shadow-md transition-all group lg:col-span-1 h-full"
                >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Store className="w-6 h-6 text-indigo-500" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest text-center">Simulate Seller</span>
                </button>
                <button 
                    onClick={() => navigate('/admin/sellers')}
                    className="flex flex-col items-center justify-center p-6 bg-sky-50 rounded-2xl border border-sky-100 hover:shadow-md transition-all group lg:col-span-1 h-full"
                >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-6 h-6 text-sky-500" />
                    </div>
                    <span className="text-[10px] font-black text-sky-900 uppercase tracking-widest text-center">Manage Sellers</span>
                </button>
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-left">
                            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">RECENT ORDERS</h2>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">QUEUE OF LATEST CUSTOMER ORDERS</p>
                        </div>
                        <button onClick={() => navigate('/admin/orders')} className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700">VIEW ALL</button>
                    </div>
                    <AdminTable columns={orderColumns} data={statsData.recent} />
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
