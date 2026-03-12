import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, ArrowUpRight, ArrowDownLeft, RefreshCcw, FileText } from 'lucide-react';

const StockHistoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); // All, Adjustment, Order, Return
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mock Data Load
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setHistory([
                {
                    id: 1,
                    date: '2025-02-07 14:30',
                    product: { name: 'Gold Plated Necklace', image: 'https://via.placeholder.com/40' },
                    type: 'Manual Adjustment',
                    change: 50,
                    effect: { from: 70, to: 120 },
                    user: 'Admin (Aditi)',
                    reason: 'New Stock Arrival'
                },
                {
                    id: 2,
                    date: '2025-02-07 12:15',
                    product: { name: 'Diamond Stud Earrings', image: 'https://via.placeholder.com/40' },
                    type: 'Order Fulfilled',
                    change: -2,
                    effect: { from: 47, to: 45 },
                    user: 'System',
                    reason: 'Order #ORD-5001'
                },
                {
                    id: 3,
                    date: '2025-02-06 09:45',
                    product: { name: 'Silver Anklet', image: 'https://via.placeholder.com/40' },
                    type: 'Return Restock',
                    change: 5,
                    effect: { from: 10, to: 15 },
                    user: 'Admin (Aditi)',
                    reason: 'Return #RTN-105 (Unopened)'
                },
                {
                    id: 4,
                    date: '2025-02-05 16:20',
                    product: { name: 'Rose Gold Bracelet', image: 'https://via.placeholder.com/40' },
                    type: 'Order Fulfilled',
                    change: -10,
                    effect: { from: 10, to: 0 },
                    user: 'System',
                    reason: 'Order #ORD-4998'
                },
                {
                    id: 5,
                    date: '2025-02-05 10:00',
                    product: { name: 'Pearl Choker', image: 'https://via.placeholder.com/40' },
                    type: 'Manual Adjustment',
                    change: -5,
                    effect: { from: 90, to: 85 },
                    user: 'Admin (Aditi)',
                    reason: 'Damaged Item'
                },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const getTypeStyle = (type) => {
        switch (type) {
            case 'Manual Adjustment': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Order Fulfilled': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Return Restock': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Manual Adjustment': return <RefreshCcw size={12} />;
            case 'Order Fulfilled': return <ArrowUpRight size={12} />;
            case 'Return Restock': return <ArrowDownLeft size={12} />;
            default: return <FileText size={12} />;
        }
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.reason.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === 'All' ||
            (filterType === 'Adjustment' && item.type === 'Manual Adjustment') ||
            (filterType === 'Order' && item.type === 'Order Fulfilled') ||
            (filterType === 'Return' && item.type === 'Return Restock');

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 font-sans animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Stock History</h1>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Audit trail of all inventory movements</p>
                </div>
                <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2">
                    <Download size={14} /> Export CSV
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md w-full ml-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                        type="text"
                        placeholder="Search by Product or Reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none text-xs font-bold text-gray-900 focus:ring-0 placeholder:text-gray-400"
                    />
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                    {['All', 'Adjustment', 'Order', 'Return'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterType(tab)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filterType === tab
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock Change</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Effect</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">User / Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Loading History...</td></tr>
                            ) : filteredHistory.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">No movements found</td></tr>
                            ) : (
                                filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-gray-900 font-mono">{item.date.split(' ')[0]}</p>
                                            <p className="text-[10px] font-bold text-gray-400">{item.date.split(' ')[1]}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-50 rounded border border-gray-100 p-0.5 flex-shrink-0">
                                                    <img src={item.product.image} className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 line-clamp-1">{item.product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${getTypeStyle(item.type)}`}>
                                                {getIcon(item.type)} {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-xs font-black ${item.change > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {item.change > 0 ? '+' : ''}{item.change}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-gray-600">
                                                <span className="opacity-50">{item.effect.from}</span>
                                                <span className="text-gray-300">→</span>
                                                <span className="text-gray-900">{item.effect.to}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-xs font-black text-gray-900">{item.user}</p>
                                            <p className="text-[10px] font-bold text-gray-400 italic">{item.reason}</p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockHistoryPage;
