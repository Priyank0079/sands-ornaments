import React, { useState, useMemo } from 'react';
import {
    Search,
    Download,
    Eye,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    Package,
    XCircle,
    Truck,
    Filter
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import AdminStatsCard from '../components/AdminStatsCard';

const OrderListPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const statusParam = searchParams.get('status') || 'all';
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ------------------------------------------------------------------
    // DUMMY DATA (Matching Screenshot & Extended for Approval Workflow)
    // ------------------------------------------------------------------
    const mockOrders = [
        { id: '#ORD-PEND-001', date: '2026-02-08', customer: 'Rahul Kumar', type: 'New', payment: 'COD', items: 2, value: 1200, status: 'Pending', shipment: 'Pending' },
        { id: '#ORD-REJ-002', date: '2026-02-07', customer: 'Sita Verma', type: 'Returning', payment: 'Online', items: 1, value: 850, status: 'Rejected', shipment: 'Cancelled' },
        { id: '#ORD-SHIP-003', date: '2026-02-06', customer: 'Amit Singh', type: 'New', payment: 'Online', items: 3, value: 2400, status: 'Shipped', shipment: 'In Transit' },
        { id: '#ORD-DEL-004', date: '2026-02-05', customer: 'Priya Sharma', type: 'Returning', payment: 'COD', items: 1, value: 500, status: 'Delivered', shipment: 'Delivered' },
        { id: '#1561-941', date: '2026-02-07', customer: 'Unknown', type: 'New', payment: 'COD', items: 1, value: 400, status: 'Pending', shipment: 'Pending' },
        { id: '#ORD-0998', date: '2026-01-20', customer: 'Amit Shah', type: 'New', payment: 'COD', items: 3, value: 5400, status: 'Cancelled', shipment: 'Cancelled' },
    ];

    // Filter Logic
    const filteredOrders = useMemo(() => {
        return mockOrders.filter(order => {
            // Text Search
            const matchesSearch =
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase());

            // Status Filter matches (Tabs)
            let matchesStatus = true;
            if (statusParam !== 'all') {
                if (statusParam === 'pending') matchesStatus = order.status === 'Pending' || order.status === 'Processing';
                else if (statusParam === 'shipped') matchesStatus = order.status === 'Shipped';
                else if (statusParam === 'delivered') matchesStatus = order.status === 'Delivered';
                else if (statusParam === 'cancelled') matchesStatus = order.status === 'Cancelled' || order.status === 'Rejected';
                else matchesStatus = order.status.toLowerCase() === statusParam;
            }

            return matchesSearch && matchesStatus;
        });
    }, [mockOrders, searchTerm, statusParam]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Stats Logic
    const stats = {
        total: mockOrders.length,
        pending: mockOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length,
        completed: mockOrders.filter(o => o.status === 'Delivered').length
    };

    const handleFilterChange = (status) => {
        setSearchParams({ status });
        setCurrentPage(1);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-gray-100 text-gray-600';
            case 'Processing': return 'bg-amber-100 text-amber-600';
            case 'Shipped': return 'bg-blue-100 text-blue-600';
            case 'Delivered': return 'bg-emerald-100 text-emerald-600';
            case 'Cancelled': return 'bg-red-100 text-red-600';
            case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-sans text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Order Management</h1>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Monitor and fulfill customer orders</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] hover:bg-black text-white rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-gray-200 active:scale-95">
                    <Download size={16} /> Export Reports
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatsCard
                    label="Total Orders"
                    value={stats.total}
                    icon={Package}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="Pending"
                    value={stats.pending}
                    icon={Clock}
                    color="text-amber-500"
                    bgColor="bg-amber-50"
                />
                <AdminStatsCard
                    label="Completed"
                    value={stats.completed}
                    icon={CheckCircle2}
                    color="text-emerald-500"
                    bgColor="bg-emerald-50"
                />
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 hover:bg-white focus:bg-white border-transparent focus:border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-50 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
                    {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => {
                        const active = statusParam === tab.toLowerCase();
                        return (
                            <button
                                key={tab}
                                onClick={() => handleFilterChange(tab.toLowerCase())}
                                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest w-12 text-center">#</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Payment</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest text-center">Items</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Value</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 uppercase tracking-tighter text-[10px] md:text-[11px] text-gray-900">
                            {paginatedOrders.map((order, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-5 text-center text-xs font-bold text-gray-400">
                                        {(currentPage - 1) * itemsPerPage + idx + 1}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-bold text-xs text-black">{order.id}</span>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-gray-500">
                                        {order.date}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-xs text-black">{order.customer}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${order.type === 'Returning' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                            }`}>
                                            {order.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`font-bold text-xs ${order.payment === 'COD' ? 'text-orange-600' : 'text-emerald-600'}`}>
                                            {order.payment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center font-bold text-xs text-gray-600">
                                        {order.items}
                                    </td>
                                    <td className="px-6 py-5 font-black text-xs text-gray-900">
                                        ₹{order.value.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {order.shipment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/orders/${order.id.replace('#', '')}`)}
                                            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md shadow-gray-200"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="11" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <Package size={48} className="text-gray-300 mb-4" />
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No orders found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
};

export default OrderListPage;
