import React, { useState } from 'react';
import { Eye, RotateCcw, Clock, CheckCircle2, Search, Filter, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminStatsCard from '../components/AdminStatsCard';

const ReturnsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Dummy Data matching Screenshot
    const mockReturns = [
        { id: 'RTN-105', orderId: 'ORD-5005', customer: 'Vikram Das', reason: 'Changed Mind', date: '05/02/2025', amount: 1200, status: 'COMPLETED' },
        { id: 'RTN-104', orderId: 'ORD-5004', customer: 'Neha Gupta', reason: 'Defective', date: '04/02/2025', amount: 750, status: 'REJECTED' },
        { id: 'RTN-103', orderId: 'ORD-5003', customer: 'Amit Singh', reason: 'Size Issue', date: '03/02/2025', amount: 2100, status: 'REFUNDED' },
        { id: 'RTN-102', orderId: 'ORD-5002', customer: 'Priya Verma', reason: 'Wrong Color', date: '02/02/2025', amount: 899, status: 'APPROVED' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
            case 'REFUNDED': return 'bg-teal-50 text-teal-600 border border-teal-100'; // Using teal to differentiate slightly or swap with Completed
            case 'APPROVED': return 'bg-blue-50 text-blue-600 border border-blue-100';
            case 'REJECTED': return 'bg-red-50 text-red-600 border border-red-100';
            case 'PENDING': return 'bg-amber-50 text-amber-600 border border-amber-100';
            default: return 'bg-gray-50 text-gray-600 border border-gray-100';
        }
    };

    return (
        <div className="space-y-8 font-sans animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Return Management</h1>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Manage Returns, Replacements and Refunds</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatsCard
                    label="Total Requests"
                    value="5"
                    icon={RotateCcw}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="Pending"
                    value="1"
                    icon={Clock}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <AdminStatsCard
                    label="Refunded"
                    value="1"
                    icon={IndianRupee}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md w-full ml-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                        type="text"
                        placeholder="Search by ID or Customer..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none text-xs font-bold text-gray-900 focus:ring-0 placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 p-1 bg-gray-50 rounded-xl">
                    {['ALL', 'PENDING', 'APPROVED', 'REFUNDED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Return ID</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Reason</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 uppercase tracking-tighter text-[10px] md:text-[11px] text-gray-900">
                            {mockReturns.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-xs font-bold text-black">{item.id}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{item.orderId}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-black">{item.customer}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{item.reason}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500 font-mono">{item.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-black">₹{item.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/returns/${item.id}`)}
                                            className="bg-[#0f172a] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPage;
