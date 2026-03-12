import React, { useState } from 'react';
import {
    Bell, Settings, Send, Tag, ShoppingBag,
    Eye, EyeOff, Trash2, Filter, AlertCircle,
    CheckCircle2, Clock, Smartphone, Globe, Shield,
    Layout, ChevronRight, X, Plus
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const GlobalNotificationManager = () => {
    // Mock for System-wide notifications (Announcements/Offers)
    const [systemNotifications, setSystemNotifications] = useState([
        {
            id: 'SN-001',
            type: 'Offer',
            title: 'Flat 20% Off - Weekend Special',
            message: 'Use code WEEKEND20 on all silver jewelry. Valid till Sunday midnight!',
            status: 'Enabled',
            target: 'All Platforms',
            timestamp: 'Created: Oct 24, 2024'
        },
        {
            id: 'SN-002',
            type: 'System',
            title: 'New Collection Live',
            message: 'Our "Heritage Series" is now available. Explore 50+ new designs.',
            status: 'Disabled',
            target: 'App Only',
            timestamp: 'Created: Oct 20, 2024'
        }
    ]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newNotif, setNewNotif] = useState({
        type: 'Offer',
        title: '',
        message: '',
        target: 'All Platforms'
    });

    const toggleNotifStatus = (id) => {
        setSystemNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, status: n.status === 'Enabled' ? 'Disabled' : 'Enabled' } : n
        ));
    };

    const deleteNotif = (id) => {
        if (window.confirm('Delete this system notification?')) {
            setSystemNotifications(prev => prev.filter(n => n.id !== id));
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const created = {
            ...newNotif,
            id: `SN-00${systemNotifications.length + 1}`,
            status: 'Enabled',
            timestamp: `Created: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        };
        setSystemNotifications([created, ...systemNotifications]);
        setIsCreateModalOpen(false);
        setNewNotif({ type: 'Offer', title: '', message: '', target: 'All Platforms' });
    };

    const typeIcons = {
        'Offer': <Tag className="w-4 h-4 text-amber-600" />,
        'System': <Settings className="w-4 h-4 text-gray-600" />,
        'Order Update': <ShoppingBag className="w-4 h-4 text-blue-600" />
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-3 md:space-y-4 animate-in fade-in duration-500 pb-20 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 px-1">
                <PageHeader
                    title="Global Notifications"
                    subtitle="Manage system-wide alerts & updates"
                />
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-gray-800 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Notification</span>
                </button>
            </div>

            {/* Notifications Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white text-black uppercase tracking-widest text-[9px] md:text-[11px] font-bold border-b border-gray-100">
                                <th className="px-4 md:px-6 py-3 md:py-4 text-center w-16">Type</th>
                                <th className="px-4 md:px-6 py-3 md:py-4">Notification Details</th>
                                <th className="px-4 md:px-6 py-3 md:py-4">Target</th>
                                <th className="px-4 md:px-6 py-3 md:py-4">Date</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-center">Status</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 uppercase tracking-tighter text-[10px] md:text-sm">
                            {systemNotifications.map((notif) => (
                                <tr
                                    key={notif.id}
                                    className={`hover:bg-gray-50/50 transition-colors group ${notif.status === 'Disabled' ? 'bg-gray-50/30' : ''}`}
                                >
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-center align-top pt-5">
                                        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm inline-flex items-center justify-center">
                                            {typeIcons[notif.type] || <Bell className="w-4 h-4 text-gray-400" />}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 align-top pt-5">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-gray-900">
                                                {notif.title}
                                            </h4>
                                            <p className="text-[10px] md:text-xs text-gray-400 font-bold lowercase tracking-normal leading-relaxed max-w-lg">
                                                {notif.message}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 align-top pt-5">
                                        <div className="flex items-center gap-1.5 font-bold text-gray-500">
                                            <Smartphone className="w-3.5 h-3.5" />
                                            <span>{notif.target}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 align-top pt-5">
                                        <div className="flex items-center gap-1.5 font-bold text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{notif.timestamp.replace('Created: ', '')}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-center align-top pt-5">
                                        <span className={`px-2.5 py-1 rounded text-[10px] md:text-[11px] font-bold border ${notif.status === 'Enabled'
                                                ? 'bg-green-50 text-green-600 border-green-100'
                                                : 'bg-gray-100 text-gray-500 border-gray-200'
                                            }`}>
                                            {notif.status}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-right align-top pt-5">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            <button
                                                onClick={() => toggleNotifStatus(notif.id)}
                                                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-black hover:border-black transition-all shadow-sm"
                                                title={notif.status === 'Enabled' ? 'Disable' : 'Enable'}
                                            >
                                                {notif.status === 'Enabled' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => deleteNotif(notif.id)}
                                                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {systemNotifications.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-6 h-6 text-gray-300" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg mb-1">No Alerts Created</h3>
                        <p className="text-sm text-gray-400">Create a new notification to get started.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="text-xl font-black text-black uppercase tracking-wide">Create Notification</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Type</label>
                                    <select
                                        className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-xs font-bold focus:outline-none focus:border-black transition-all"
                                        value={newNotif.type}
                                        onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value })}
                                    >
                                        <option>Offer</option>
                                        <option>Order Update</option>
                                        <option>System</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Target Platform</label>
                                    <div className="relative">
                                        <select
                                            className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-xs font-bold focus:outline-none focus:border-black transition-all appearance-none"
                                            value={newNotif.target}
                                            onChange={(e) => setNewNotif({ ...newNotif, target: e.target.value })}
                                        >
                                            <option value="All Platforms">All Platforms</option>
                                            <option value="App Only">App Only</option>
                                            <option value="Web Only">Web Only</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Headline</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Flash Sale Live! ⚡"
                                    className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-sm font-bold focus:outline-none focus:border-black transition-all"
                                    value={newNotif.title}
                                    onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Message</label>
                                <textarea
                                    placeholder="Short message for customers..."
                                    className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-sm font-medium h-24 resize-none focus:outline-none focus:border-black transition-all"
                                    value={newNotif.message}
                                    onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-4 py-3.5 bg-white border-2 border-gray-100 text-gray-900 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3.5 bg-black text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    Launch Alert
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalNotificationManager;
