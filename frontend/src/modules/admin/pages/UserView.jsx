import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin,
    ShoppingBag, Heart, ArrowLeft,
    Shield, CheckCircle2, XCircle,
    Calendar, Clock, ChevronRight
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const UserView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock User Data
    const [user, setUser] = useState({
        id: id || 'USR-1001',
        name: 'Aditi Singh',
        email: 'aditi.s@gmail.com',
        phone: '+91 98123 45678',
        joinedDate: 'December 12, 2024',
        status: 'Active',
        totalOrders: 12,
        totalSpent: '45,690',
        addresses: [
            { type: 'Home', address: 'B-402, Sunshine Heights, Andheri West, Mumbai - 400053', isDefault: true },
            { type: 'Office', address: 'Times Square Tower, 8th Floor, BKC, Mumbai - 400051', isDefault: false }
        ],
        wishlist: [
            { id: 201, name: '925 Silver Chain', price: 1545, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200' },
            { id: 202, name: 'Minimalist Bangle', price: 2800, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200' }
        ],
        orderHistory: [
            { id: 'ORD-82741', date: 'Dec 26, 2024', total: 5544, status: 'Ordered' },
            { id: 'ORD-81120', date: 'Dec 10, 2024', total: 12000, status: 'Delivered' },
            { id: 'ORD-79943', date: 'Nov 28, 2024', total: 3500, status: 'Delivered' }
        ],
        cart: [
            { id: 301, name: 'Royal Solitaire Ring', price: 5999, quantity: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200' },
            { id: 302, name: 'Classic Silver Earrings', price: 1200, quantity: 2, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200' }
        ]
    });

    const statusColors = {
        'Ordered': 'text-blue-600 bg-blue-50',
        'Delivered': 'text-green-600 bg-green-50',
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to User List
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${user.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                {user.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {user.email} • {user.id}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                            <div className="flex items-center justify-center py-4">
                                <div className="w-24 h-24 rounded-full bg-[#F5F0EB] border-4 border-white shadow-md flex items-center justify-center text-[#8D6E63] text-3xl font-bold">
                                    {user.name.charAt(0)}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600 font-medium">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600 font-medium">Joined: {user.joinedDate}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">Total Orders</p>
                                    <p className="text-lg font-bold text-gray-900">{user.totalOrders}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">Total Spent</p>
                                    <p className="text-lg font-bold text-gray-900">₹{user.totalSpent}</p>
                                </div>
                            </div>
                        </div>

                        {/* Addresses Box */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#8D6E63]" />
                                Saved Addresses
                            </h3>
                            <div className="space-y-4">
                                {user.addresses.map((addr, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-400">{addr.type}</span>
                                            {addr.isDefault && <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">Default</span>}
                                        </div>
                                        <p className="text-[11px] text-gray-600 leading-relaxed font-medium font-sans">
                                            {addr.address}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order History */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-[#8D6E63]" />
                                    Order History
                                </h3>
                                <span className="text-xs font-semibold text-gray-400">{user.orderHistory.length} Total Orders</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {user.orderHistory.map((order) => (
                                    <div key={order.id} className="py-3 px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                                            <p className="text-xs text-gray-400 font-medium">{order.date}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
                                                {order.status}
                                            </span>
                                            <button
                                                onClick={() => navigate(`/admin/orders/view/${order.id}`)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active Cart */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                                    Active Cart Items
                                </h3>
                                <span className="text-xs font-semibold text-blue-500">{user.cart.length} In Bag</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
                                {user.cart.map((item) => (
                                    <div key={item.id} className="bg-white p-6 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-sm font-bold text-[#3E2723]">₹{item.price.toLocaleString()}</p>
                                                <p className="text-[11px] font-semibold text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wishlist */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-400" />
                                <h3 className="text-sm font-semibold text-gray-800">Wishlist Items</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
                                {user.wishlist.map((item) => (
                                    <div key={item.id} className="bg-white p-6 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                                            <p className="text-sm font-bold text-[#3E2723]">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserView;
