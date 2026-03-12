import React, { useState, useEffect } from 'react';
import { AlertTriangle, Zap, Package, XCircle, ArrowRight, Clock, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminStatsCard from '../../components/AdminStatsCard';

const LowStockAlertsPage = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setAlerts([
                { id: 1, name: 'Gold Plated Necklace', category: 'Necklace', stock: 0, threshold: 15, image: 'https://via.placeholder.com/40' },
                { id: 2, name: 'Diamond Stud Earrings', category: 'Earrings', stock: 2, threshold: 5, image: 'https://via.placeholder.com/40' },
                { id: 3, name: 'Silver Anklet', category: 'Anklet', stock: 15, threshold: 20, image: 'https://via.placeholder.com/40' },
                { id: 4, name: 'Rose Gold Bracelet', category: 'Bracelet', stock: 8, threshold: 10, image: 'https://via.placeholder.com/40' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const outOfStockCount = alerts.filter(a => a.stock === 0).length;
    const lowStockCount = alerts.filter(a => a.stock > 0 && a.stock <= a.threshold).length;

    return (
        <div className="space-y-8 font-sans animate-in fade-in duration-500">
            {/* Header with Quick Action */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Low Stock Alerts</h1>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Critical inventory warnings</p>
                </div>
                <button
                    onClick={() => navigate('/admin/inventory/adjust')}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
                >
                    <Zap size={14} /> Quick Restock
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatsCard
                    label="Total Alerts"
                    value={alerts.length}
                    icon={AlertTriangle}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <AdminStatsCard
                    label="Out of Stock"
                    value={outOfStockCount}
                    icon={Ban}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
                <AdminStatsCard
                    label="Low Stock Warning"
                    value={lowStockCount}
                    icon={Clock}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                />
            </div>

            {/* Alerts Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Product Details</th>
                                <th className="px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Category</th>
                                <th className="px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Stock Status</th>
                                <th className="px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 uppercase tracking-tighter text-[10px] md:text-[11px] text-gray-900">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Alerts...</td></tr>
                            ) : alerts.map((item) => {
                                const isOOS = item.stock === 0;
                                const percentage = Math.min((item.stock / item.threshold) * 100, 100);

                                return (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 p-1 flex-shrink-0 relative ${isOOS ? 'grayscale opacity-75' : ''}`}>
                                                    <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" />
                                                    {isOOS && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-lg">
                                                            <AlertTriangle size={16} className="text-red-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-black line-clamp-1">{item.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[200px]">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                                                    <span className={isOOS ? 'text-red-600' : 'text-orange-600'}>
                                                        {item.stock} Units Left
                                                    </span>
                                                    <span className="text-gray-400">Alert at {item.threshold}</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${isOOS ? 'bg-red-500' : 'bg-orange-500'}`}
                                                        style={{ width: `${isOOS ? 0 : percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate('/admin/inventory/adjust')}
                                                className="px-4 py-2 bg-white border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center gap-2 ml-auto"
                                            >
                                                Quick Restock <ArrowRight size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LowStockAlertsPage;
