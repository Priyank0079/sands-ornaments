import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    ShieldCheck,
    ShieldOff,
    Package,
    Heart,
    Ticket,
    MapPin,
    ChevronRight
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AdminStatsCard from '../components/AdminStatsCard';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const UserView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            try {
                const [userData, userOrders] = await Promise.all([
                    adminService.getUserById(id),
                    adminService.getOrders({ userId: id, limit: 50 })
                ]);
                setUser(userData);
                setOrders(userOrders || []);
            } catch (err) {
                toast.error("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [id]);

    const totalSpend = useMemo(
        () => orders.reduce((acc, order) => acc + (order.total || 0), 0),
        [orders]
    );

    const lastOrder = orders[0];
    const lastAddress = lastOrder?.shippingAddress;

    const handleToggleBlock = async () => {
        if (!user) return;
        setToggling(true);
        const success = await adminService.toggleUserStatus(user._id || user.id);
        if (success) {
            toast.success(user.isBlocked ? "User unblocked" : "User blocked");
            const refreshed = await adminService.getUserById(user._id || user.id);
            setUser(refreshed);
        } else {
            toast.error("Failed to update user status");
        }
        setToggling(false);
    };

    if (loading) {
        return (
            <div className="p-20 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                Loading user profile...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold text-gray-400">User Not Found</h2>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="mt-4 text-primary font-bold hover:underline underline-offset-4 flex items-center gap-2 mx-auto"
                >
                    <ArrowLeft size={16} /> Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 text-left animate-in fade-in duration-500">
            <PageHeader
                title="User Profile"
                subtitle={`Detailed overview of ${user.name || 'Customer'}`}
                backPath="/admin/users"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl font-black text-gray-600">
                            {(user.name || 'U').charAt(0)}
                        </div>
                        <div>
                            <p className="text-lg font-black text-gray-900">{user.name || 'Unnamed User'}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.role || 'user'}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            <span className="font-semibold">{user.email || 'No email'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Phone size={14} className="text-gray-400" />
                            <span className="font-semibold">{user.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="font-semibold">
                                Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={handleToggleBlock}
                            disabled={toggling}
                            className={`w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${user.isBlocked
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200'
                                : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200'
                                }`}
                        >
                            {user.isBlocked ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                            {user.isBlocked ? 'Enable Account' : 'Block Account'}
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <AdminStatsCard
                            label="Orders"
                            value={orders.length}
                            icon={Package}
                            color="text-blue-600"
                            bgColor="bg-blue-50"
                        />
                        <AdminStatsCard
                            label="Total Spend"
                            value={`INR ${totalSpend.toLocaleString()}`}
                            icon={Package}
                            color="text-emerald-600"
                            bgColor="bg-emerald-50"
                        />
                        <AdminStatsCard
                            label="Wishlist"
                            value={user.wishlist?.length || 0}
                            icon={Heart}
                            color="text-rose-600"
                            bgColor="bg-rose-50"
                        />
                        <AdminStatsCard
                            label="Coupons Used"
                            value={user.usedCoupons?.length || 0}
                            icon={Ticket}
                            color="text-amber-600"
                            bgColor="bg-amber-50"
                        />
                    </div>

                    {/* Recent Address */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin size={16} className="text-gray-400" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Last Shipping Address</h3>
                        </div>
                        {lastAddress ? (
                            <div className="text-sm font-semibold text-gray-700">
                                {lastAddress.firstName} {lastAddress.lastName}, {lastAddress.flatNo} {lastAddress.area}, {lastAddress.city}, {lastAddress.state} - {lastAddress.pincode}
                            </div>
                        ) : (
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">No orders yet</div>
                        )}
                    </div>

                    {/* Order History */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Order History</h3>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{orders.length} orders</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {orders.length > 0 ? orders.slice(0, 10).map((order) => (
                                <div
                                    key={order._id}
                                    className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                                >
                                    <div>
                                        <p className="text-xs font-black text-gray-900">#{order.orderId}</p>
                                        <p className="text-[10px] font-bold text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-gray-900">INR {order.total?.toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.status}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300" />
                                </div>
                            )) : (
                                <div className="p-10 text-center text-xs font-bold uppercase tracking-widest text-gray-400">No orders found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserView;
