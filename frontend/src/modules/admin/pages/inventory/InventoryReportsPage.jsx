import React, { useState, useEffect } from 'react';
import { Calendar, Download, PieChart, TrendingUp, DollarSign, Package } from 'lucide-react';

const InventoryReportsPage = () => {
    const activeTabState = useState('category'); // 'category' or 'sales'
    const activeTab = activeTabState[0];
    const setActiveTab = activeTabState[1];
    const [loading, setLoading] = useState(false);

    // Mock Data
    const categoryData = [
        { category: 'Necklaces', uniqueProducts: 24, totalQty: 1250, value: 450000 },
        { category: 'Earrings', uniqueProducts: 12, totalQty: 500, value: 120000 },
        { category: 'Bracelets', uniqueProducts: 18, totalQty: 800, value: 240000 },
        { category: 'Rings', uniqueProducts: 8, totalQty: 300, value: 45000 },
        { category: 'Anklets', uniqueProducts: 15, totalQty: 600, value: 90000 },
    ];

    const salesData = [
        { name: 'Gold Plated Necklace', category: 'Necklaces', sold: 450, avgPrice: 350, revenue: 157500 },
        { name: 'Diamond Stud Earrings', category: 'Earrings', sold: 380, avgPrice: 400, revenue: 152000 },
        { name: 'Silver Anklet', category: 'Anklets', sold: 320, avgPrice: 400, revenue: 128000 },
        { name: 'Rose Gold Bracelet', category: 'Bracelets', sold: 280, avgPrice: 850, revenue: 238000 },
        { name: 'Pearl Choker', category: 'Necklaces', sold: 150, avgPrice: 1100, revenue: 165000 },
    ];

    return (
        <div className="space-y-8 font-sans animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Inventory Reports</h1>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Valuation and sales analytics</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
                        <Calendar size={14} /> This Month
                    </button>
                    <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2">
                        <Download size={14} /> Export PDF
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
                <button
                    onClick={() => setActiveTab('category')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'category' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <PieChart size={14} /> Category Report
                </button>
                <button
                    onClick={() => setActiveTab('sales')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'sales' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <TrendingUp size={14} /> Product Sales
                </button>
            </div>

            {/* Category View */}
            {activeTab === 'category' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Inventory Value</p>
                            <p className="text-3xl font-black text-gray-900">₹9,45,000</p>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full w-[75%]"></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Items in Stock</p>
                            <p className="text-3xl font-black text-gray-900">3,450</p>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full w-[60%]"></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Top Category</p>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-black uppercase tracking-widest">Necklaces</div>
                                <span className="text-xs font-bold text-gray-400">45% of Value</span>
                            </div>
                        </div>
                    </div>

                    {/* Category Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8FAFC] border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Unique Products</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Total Quantity</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Estimated Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {categoryData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-black text-gray-900">{item.category}</td>
                                        <td className="px-6 py-4 text-center text-xs font-bold text-gray-600">{item.uniqueProducts}</td>
                                        <td className="px-6 py-4 text-center text-xs font-bold text-gray-600">{item.totalQty.toLocaleString()} units</td>
                                        <td className="px-6 py-4 text-right text-sm font-black text-gray-900">₹{item.value.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Sales View */}
            {activeTab === 'sales' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Revenue</p>
                                <p className="text-4xl font-black text-emerald-900">₹8,51,500</p>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Total Units Sold</p>
                                <p className="text-4xl font-black text-blue-900">2,150</p>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm">
                                <Package size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Sales Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8FAFC] border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[40%]">Product Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Units Sold</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Avg Price</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {salesData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-black text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{item.category}</td>
                                        <td className="px-6 py-4 text-center text-xs font-black text-blue-600">{item.sold}</td>
                                        <td className="px-6 py-4 text-right text-xs font-bold text-gray-500">₹{item.avgPrice}</td>
                                        <td className="px-6 py-4 text-right text-sm font-black text-emerald-600">₹{item.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryReportsPage;
