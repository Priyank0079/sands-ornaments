import React, { useState } from 'react';
import {
    Bell, ShoppingBag, UserPlus, Star,
    AlertTriangle, Check, Trash2,
    Filter, MoreVertical, Clock, Package,
    CheckCircle2, Eye, X
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const AdminNotifications = () => {
    // Mock Admin Notifications Data
    const [notifications, setNotifications] = useState([
        {
            id: 'NOT-001',
            type: 'Order',
            title: 'New Order Received',
            message: 'Order #ORD-82745 has been placed by Aditi Singh.',
            time: '2 mins ago',
            isRead: false,
            priority: 'High'
        },
        {
            id: 'NOT-002',
            type: 'Inventory',
            title: 'Low Stock Alert',
            message: 'Classic Solitaire Ring is down to 2 units in stock.',
            time: '45 mins ago',
            isRead: false,
            priority: 'Urgent'
        },
        {
            id: 'NOT-003',
            type: 'Review',
            title: 'New Review Submitted',
            message: 'Sneha Kapoor left a 5-star review for Infinity Bracelet.',
            time: '2 hours ago',
            isRead: true,
            priority: 'Medium'
        },
        {
            id: 'NOT-004',
            type: 'User',
            title: 'New User Registered',
            message: 'Rahul Verma has just created an account.',
            time: '5 hours ago',
            isRead: true,
            priority: 'Low'
        }
    ]);



    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const typeIcons = {
        'Order': <ShoppingBag className="w-4 h-4 text-blue-600" />,
        'Inventory': <AlertTriangle className="w-4 h-4 text-red-600" />,
        'Review': <Star className="w-4 h-4 text-amber-600" />,
        'User': <UserPlus className="w-4 h-4 text-green-600" />
    };

    const priorityStyles = {
        'Urgent': 'bg-red-100 text-red-700 border-red-200',
        'High': 'bg-orange-100 text-orange-700 border-orange-200',
        'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
        'Low': 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <PageHeader
                        title="Notifications"
                        subtitle="Manage system alerts & updates"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark all read
                        </button>
                    </div>
                </div>

                {/* Notifications Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-16 text-center">Type</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Notification Details</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-24">Priority</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-32">Time</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-24 text-center">Status</th>
                                    <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-24 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {notifications.map((notif) => (
                                    <tr
                                        key={notif.id}
                                        className={`group hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-[#FDFBF7]' : ''}`}
                                    >
                                        <td className="p-4 text-center align-top pt-5">
                                            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm inline-flex items-center justify-center">
                                                {typeIcons[notif.type]}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top pt-5">
                                            <div className="space-y-1">
                                                <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-black' : 'text-gray-600'}`}>
                                                    {notif.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-md">
                                                    {notif.message}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top pt-5">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${priorityStyles[notif.priority]}`}>
                                                {notif.priority}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top pt-5">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{notif.time}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center align-top pt-5">
                                            {notif.isRead ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wide">
                                                    Read
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide animate-pulse">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                                    New
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right align-top pt-5">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notif.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notif.id)}
                                                        className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notif.id)}
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

                    {notifications.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-6 h-6 text-gray-300" />
                            </div>
                            <h3 className="text-gray-900 font-bold text-lg mb-1">No notifications found</h3>
                            <p className="text-sm text-gray-400">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
