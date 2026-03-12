import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Search, Mail, Phone, Calendar,
    MoreHorizontal, Eye, UserX, UserCheck,
    Download, ArrowUpRight, Shield, ShoppingBag, Heart,
    ShieldCheck, ShieldOff, UserPlus, Users
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AdminStatsCard from '../components/AdminStatsCard';

const UserManagement = () => {
    const navigate = useNavigate();

    // Mock Users Data
    const [users, setUsers] = useState([
        {
            id: 'USR-1001',
            name: 'Aditi Singh',
            email: 'aditi.s@gmail.com',
            phone: '+91 98123 45678',
            joinedDate: 'Dec 12, 2024',
            ordersCount: 12,
            spentAmount: '45,690',
            status: 'Active'
        },
        {
            id: 'USR-1002',
            name: 'Rahul Verma',
            email: 'rahul.v@yahoo.com',
            phone: '+91 77654 32109',
            joinedDate: 'Nov 05, 2024',
            ordersCount: 3,
            spentAmount: '8,200',
            status: 'Active'
        },
        {
            id: 'USR-1003',
            name: 'Sneha Kapoor',
            email: 'sneha.k@gmail.com',
            phone: '+91 88990 11223',
            joinedDate: 'Jan 15, 2025',
            ordersCount: 0,
            spentAmount: '0',
            status: 'Disabled'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const toggleUserStatus = (id) => {
        setUsers(users.map(user => {
            if (user.id === id) {
                return { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' };
            }
            return user;
        }));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-3 md:space-y-4 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 px-1">
                <PageHeader
                    title="User Management"
                    subtitle="Manage registrations & access"
                />
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatsCard
                    label="Total Users"
                    value={users.length}
                    icon={Users}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="Active Users"
                    value={users.filter(u => u.status === 'Active').length}
                    icon={ShieldCheck}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <AdminStatsCard
                    label="Disabled Users"
                    value={users.filter(u => u.status !== 'Active').length}
                    icon={ShieldOff}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
            </div>

            {/* Filters Row */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Customer</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Joined On</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Orders</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Total Spent</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Status</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 uppercase tracking-tighter text-[10px] md:text-[11px] text-gray-900">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200 shadow-sm shrink-0 text-[10px] md:text-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-black truncate">{user.name}</p>
                                                <p className="text-[9px] md:text-[11px] text-gray-400 font-bold truncate lowercase">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-600 font-bold">
                                            <Calendar className="w-3 md:w-3.5 h-3 md:h-3.5 text-gray-400" />
                                            {user.joinedDate}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-gray-700">
                                        {user.ordersCount}
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-gray-900">
                                        ₹{user.spentAmount}
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <span className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded text-[9px] md:text-[11px] font-bold border ${user.status === 'Active'
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : 'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 md:gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/users/view/${user.id}`)}
                                                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#3E2723] transition-all"
                                                title="View Profile"
                                            >
                                                <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                            <button
                                                onClick={() => toggleUserStatus(user.id)}
                                                className={`p-1.5 md:p-2 rounded-lg transition-all ${user.status === 'Active'
                                                    ? 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                                                    : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                                                    }`}
                                                title={user.status === 'Active' ? 'Disable Account' : 'Enable Account'}
                                            >
                                                {user.status === 'Active' ? <UserX className="w-4 h-4 md:w-5 md:h-5" /> : <UserCheck className="w-4 h-4 md:w-5 md:h-5" />}
                                            </button>
                                        </div>
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

export default UserManagement;
