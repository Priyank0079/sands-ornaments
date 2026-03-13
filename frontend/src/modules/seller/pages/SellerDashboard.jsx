import React, { useState, useEffect } from 'react';
import { 
    Package, ShoppingBag, RotateCcw, TrendingUp, TrendingDown,
    IndianRupee, Clock, CheckCircle2, Boxes, AlertCircle,
    ArrowRight, ShoppingCart, Calendar, ChevronRight, Eye
} from 'lucide-react';
import { sellerProductService } from '../services/sellerProductService';
import { sellerOrderService } from '../services/sellerOrderService';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalInventory: 0,
        pendingOrders: 0,
        acceptedOrders: 0,
        deliveredOrders: 0,
        returnRequests: 0,
        totalRevenue: 0,
        lowStockItems: []
    });
    const [analytics, setAnalytics] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const products = sellerProductService.getSellerProducts();
        const orders = sellerOrderService.getSellerOrders();
        const returns = sellerOrderService.getReturns();
        const analyticalData = sellerOrderService.getAnalytics();

        const pending = orders.filter(o => o.orderStatus === 'PENDING').length;
        const accepted = orders.filter(o => o.orderStatus === 'ACCEPTED' || o.orderStatus === 'SHIPPED').length;
        const delivered = orders.filter(o => o.orderStatus === 'DELIVERED').length;
        const totalRev = orders.reduce((acc, curr) => acc + (curr.price), 0);
        
        const lowStock = products.filter(p => parseInt(p.availableStock) < 5);

        setStats({
            totalProducts: products.length,
            totalInventory: products.reduce((acc, curr) => acc + parseInt(curr.availableStock), 0),
            pendingOrders: pending,
            acceptedOrders: accepted,
            deliveredOrders: delivered,
            returnRequests: returns.length,
            totalRevenue: totalRev,
            lowStockItems: lowStock
        });

        setAnalytics(analyticalData);
        setRecentOrders(orders.slice(0, 5));
    }, []);

    const statCards = [
        { label: 'Active Listings', value: stats.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Inventory', value: stats.totalInventory, icon: Boxes, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pending Fulfillment', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'In-Transit Orders', value: stats.acceptedOrders, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Completed Orders', value: stats.deliveredOrders, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Return Requests', value: stats.returnRequests, icon: RotateCcw, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Gross Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-[#3E2723]', bg: 'bg-[#FDFBF7]', wide: true },
        { label: "Today's Volume", value: analytics?.todayStats?.orders || 0, icon: ShoppingCart, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: "Monthly Target", value: `₹${(analytics?.monthlyStats?.revenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const statusWidgets = [
        { label: 'Pending', count: stats.pendingOrders, color: 'bg-amber-500' },
        { label: 'Processing', count: stats.acceptedOrders, color: 'bg-indigo-500' },
        { label: 'Shipped', count: ordersFilter(recentOrders, 'SHIPPED').length, color: 'bg-blue-500' },
        { label: 'Delivered', count: stats.deliveredOrders, color: 'bg-emerald-500' },
        { label: 'Returned', count: stats.returnRequests, color: 'bg-red-500' }
    ];

    function ordersFilter(arr, status) {
        return arr.filter(o => o.orderStatus === status);
    }

    return (
        <div className="space-y-10 font-sans pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight text-left">OPERATIONAL DASHBOARD</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 text-left">Comprehensive store performance & transaction metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <TrendingUp size={12} /> Store Availability: Online
                    </span>
                    <div className="h-6 w-px bg-gray-200 mx-2" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className={`bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:shadow-[#3E2723]/5 transition-all duration-500 ${stat.wide ? 'xl:col-span-1' : ''}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                            <TrendingUp size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Low Inventory Alert */}
            {stats.lowStockItems.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-red-900 uppercase tracking-widest">Inventory Depletion Warning</h3>
                            <p className="text-xs font-bold text-red-700/60 uppercase mt-1">{stats.lowStockItems.length} SKUs are currently below operational safety thresholds (&lt; 5 units).</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/seller/inventory')} className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
                        Restock Now <ArrowRight size={14} />
                    </button>
                </div>
            )}

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Orders Chart (Line/Area) */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Transaction Frequency</h3>
                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 italic">30-Day Acquisition Cycle</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[#3E2723]">
                                 <div className="w-1.5 h-1.5 rounded-full bg-[#3E2723]" /> Orders
                             </div>
                        </div>
                    </div>
                    
                    {/* SVG Chart Implementation */}
                    <div className="relative h-64 w-full group">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                             <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3E2723" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#3E2723" stopOpacity="0" />
                                </linearGradient>
                             </defs>
                             {/* Grid Lines */}
                             {[0, 25, 50, 75, 100].map(v => (
                                 <line key={v} x1="0" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke="#F8F9FA" strokeWidth="1" />
                             ))}
                             {/* Area/Path */}
                             <path 
                                d="M0,80 Q10,70 20,40 T40,60 T60,20 T80,45 T100,30 L100,100 L0,100 Z" 
                                fill="url(#gradient)" 
                                className="transition-all duration-700"
                             />
                             <path 
                                d="M0,80 Q10,70 20,40 T40,60 T60,20 T80,45 T100,30" 
                                fill="none" 
                                stroke="#3E2723" 
                                strokeWidth="3" 
                                strokeLinecap="round"
                                className="transition-all duration-700"
                             />
                        </svg>
                        <div className="absolute inset-0 flex items-end justify-between px-2 pt-10">
                            {analytics?.dailyOrders.slice(-7).map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="text-[8px] font-bold text-gray-300 uppercase">{d.date.split(' ')[0]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category Mix */}
                <div className="lg:col-span-4 bg-[#3E2723] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-8 group-hover:text-white transition-colors">Category Composition</h3>
                        <div className="space-y-6">
                            {analytics?.categoryPerformance.map((cat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="opacity-80">{cat.name}</span>
                                        <span>{cat.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-white transition-all duration-1000 ease-out" 
                                            style={{ width: `${cat.value}%` }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                                Top performing category is <span className="text-white">NECKLACES</span> accounting for 45% of total acquisition volume this quarter.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Status Summary & Revenue Bar Chart */}
                <div className="lg:col-span-4 space-y-8">
                     {/* Order Status Summary */}
                     <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-8">Fulfillment Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {statusWidgets.map((widget, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${widget.color}`} />
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{widget.label}</span>
                                    </div>
                                    <span className="text-lg font-black text-gray-900">{widget.count}</span>
                                </div>
                            ))}
                        </div>
                     </div>

                     {/* Revenue Chart (Simple Bar) */}
                     <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Revenue Velocity</h3>
                             <IndianRupee size={16} className="text-gray-200" />
                        </div>
                        <div className="flex items-end justify-between h-32 gap-3 px-2">
                            {analytics?.weeklyRevenue.map((w, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div 
                                        className="w-full bg-[#EFEBE9] group-hover:bg-[#8D6E63] rounded-t-lg transition-all duration-500"
                                        style={{ height: `${(w.revenue / 220000) * 100}%` }}
                                    />
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">₹{Math.round(w.revenue/1000)}k</div>
                                    <div className="mt-3 text-[8px] font-black text-gray-300 uppercase text-center">{w.week}</div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

                {/* Recent Orders Table */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Live Transaction Stream</h3>
                        <button onClick={() => navigate('/seller/orders')} className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest flex items-center gap-1 hover:text-[#3E2723] transition-colors">
                            Audit Module <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#FDFBF7] border-b border-[#EFEBE9]">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                    <th className="px-4 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                    <th className="px-4 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Asset</th>
                                    <th className="px-4 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Value</th>
                                    <th className="px-4 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Security</th>
                                    <th className="px-8 py-5 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 text-[10px] font-black text-[#3E2723]">{order.id}</td>
                                        <td className="px-4 py-5">
                                            <div className="text-[10px] font-black text-gray-900 uppercase leading-none mb-1">{order.customerName}</div>
                                            <div className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic leading-none">KYC VERIFIED</div>
                                        </td>
                                        <td className="px-4 py-5 max-w-[150px]">
                                            <div className="text-[10px] font-bold text-gray-700 uppercase truncate">{order.product}</div>
                                        </td>
                                        <td className="px-4 py-5 text-[10px] font-black text-gray-900 tracking-tighter">₹{order.price.toLocaleString()}</td>
                                        <td className="px-4 py-5">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                                order.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => navigate(`/seller/order-details/${order.id}`)}
                                                className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all text-gray-400 hover:text-[#3E2723]"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
