import React, { useState, useEffect } from 'react';
import { 
    Users, MousePointer2, Clock, Target, 
    Smartphone, Monitor, Globe, ArrowUpRight,
    Search, ShoppingCart, Heart, Activity, MapPin
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import api from '../../../services/api';
import AdminStatsCard from '../components/AdminStatsCard';
import Loader from '../../shared/components/Loader';

const COLORS = ['#3E2723', '#8D6E63', '#D39A9F', '#FFE1E6', '#FDFBF7'];

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('analytics/dashboard');
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <Loader fullPage={false} />;
    if (!data) return <div className="p-10 text-center">Failed to load analytics data.</div>;

    const { overview, trafficTrends, deviceStats, browserStats, countryStats, cityStats, topPages, productStats, funnel } = data;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">VISITOR ANALYTICS</h1>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Real-time visitor tracking & engagement metrics</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AdminStatsCard 
                    label="TOTAL VISITORS" 
                    value={overview.totalVisitors} 
                    icon={Users} 
                    color="text-blue-500" 
                    bgColor="bg-blue-50" 
                />
                <AdminStatsCard 
                    label="ACTIVE NOW" 
                    value={overview.activeVisitors} 
                    icon={Activity} 
                    color="text-emerald-500" 
                    bgColor="bg-emerald-50" 
                    badge="LIVE" 
                    badgeColor="text-emerald-600"
                />
                <AdminStatsCard 
                    label="TOTAL SESSIONS" 
                    value={overview.totalSessions} 
                    icon={Clock} 
                    color="text-orange-500" 
                    bgColor="bg-orange-50" 
                />
                <AdminStatsCard 
                    label="CAPTURED LEADS" 
                    value={overview.totalLeads} 
                    icon={Target} 
                    color="text-pink-500" 
                    bgColor="bg-pink-50" 
                />
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bounce Rate</p>
                        <h4 className="text-2xl font-black text-gray-900 mt-1">{overview.bounceRate}%</h4>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                        <ArrowUpRight size={20} className={overview.bounceRate > 50 ? 'rotate-0' : 'rotate-180'} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Session Duration</p>
                        <h4 className="text-2xl font-black text-gray-900 mt-1">{Math.floor(overview.avgSessionDuration / 60)}m {overview.avgSessionDuration % 60}s</h4>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            {/* Traffic Trends */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Traffic Trends (Last 30 Days)</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficTrends}>
                            <defs>
                                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3E2723" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3E2723" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="uniqueVisitors" stroke="#3E2723" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Device Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Device Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {deviceStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Conversion Funnel</h3>
                    <div className="space-y-4">
                        {funnel.map((item, idx) => {
                            const percentage = idx === 0 ? 100 : Math.round((item.count / funnel[0].count) * 100);
                            return (
                                <div key={item.step} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <span>{item.step.replace('_', ' ')}</span>
                                        <span>{item.count} ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[#3E2723] transition-all duration-1000" 
                                            style={{ width: `${percentage}%`, opacity: 1 - (idx * 0.2) }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Countries */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Top Countries</h3>
                    <div className="space-y-4">
                        {countryStats?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <Globe className="text-gray-400" size={16} />
                                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-tight">{item._id || 'UNKNOWN'}</span>
                                </div>
                                <span className="text-xs font-black text-gray-900">{item.count} VISITORS</span>
                            </div>
                        ))}
                        {(!countryStats || countryStats.length === 0) && <p className="text-[10px] font-bold text-gray-400 uppercase text-center py-4">Collecting data...</p>}
                    </div>
                </div>

                {/* Top Cities */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Top Cities</h3>
                    <div className="space-y-4">
                        {cityStats?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-gray-400" size={16} />
                                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-tight">{item._id || 'UNKNOWN'}</span>
                                </div>
                                <span className="text-xs font-black text-gray-900">{item.count} VISITORS</span>
                            </div>
                        ))}
                        {(!cityStats || cityStats.length === 0) && <p className="text-[10px] font-bold text-gray-400 uppercase text-center py-4">Collecting data...</p>}
                    </div>
                </div>
            </div>

            {/* Recent Leads Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Captured Leads</h3>
                    <Target size={16} className="text-gray-300" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Source</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cart Items</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.recentLeads?.map((lead, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-900 uppercase truncate max-w-[150px]">{lead.email}</span>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{lead.phone || 'NO PHONE'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 text-[8px] font-black text-gray-500 rounded-md uppercase tracking-widest">
                                            {lead.source?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-black text-gray-700">
                                        {lead.lastCart?.length || 0} ITEMS
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">
                                        {new Date(lead.capturedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Viewed Products */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Top Engaging Products</h3>
                    <div className="space-y-4">
                        {productStats.map((prod, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                        {idx + 1}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-tight">{prod.name}</span>
                                </div>
                                <span className="text-xs font-black text-gray-900">{prod.views} VIEWS</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Traffic Pages */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Most Visited Pages</h3>
                    <div className="space-y-4">
                        {topPages.map((page, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <span className="text-xs font-semibold text-gray-600 truncate max-w-[250px]">{page._id}</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500" 
                                            style={{ width: `${(page.views / topPages[0].views) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-900">{page.views}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
