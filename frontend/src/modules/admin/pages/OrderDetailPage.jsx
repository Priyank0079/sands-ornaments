import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Printer,
    Download,
    CheckCircle2,
    Clock,
    Truck,
    Package,
    MapPin,
    User,
    CreditCard,
    Tag,
    MessageCircle,
    Mail,
    AlertCircle,
    XCircle,
    Check,
    X
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Approval Workflow State
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await adminService.getOrderDetails(id);
                setOrder(data);
            } catch (err) {
                toast.error("Order not found");
                navigate('/admin/orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleApprove = async () => {
        const success = await adminService.updateOrderStatus(id, 'SHIPPED');
        if (success) {
            toast.success("Order marked as shipped");
            const data = await adminService.getOrderDetails(id);
            setOrder(data);
        } else {
            toast.error("Update failed");
        }
    };

    const confirmReject = async () => {
        if (!rejectionReason.trim()) return;
        const success = await adminService.updateOrderStatus(id, 'CANCELLED');
        if (success) {
            toast.success("Order rejected");
            const data = await adminService.getOrderDetails(id);
            setOrder(data);
            setShowRejectInput(false);
            setRejectionReason('');
        } else {
            toast.error("Update failed");
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest">Loading Order Details...</div>;
    if (!order) return <div className="p-10 text-center text-red-400 font-bold uppercase tracking-widest">Order not found</div>;

    const statusColor = (status) => {
        if (status === 'Delivered' || status === 'Approved') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (status === 'Cancelled' || status === 'Rejected') return 'bg-red-50 text-red-600 border-red-100';
        if (status === 'Shipped') return 'bg-blue-50 text-blue-600 border-blue-100';
        return 'bg-amber-50 text-amber-600 border-amber-100';
    };

    const getTimeline = () => {
        const steps = [
            { status: 'Order Placed', completed: true, date: new Date(order.createdAt).toLocaleDateString() },
            { status: 'Payment Confirmed', completed: !!order.paymentInfo?.paidAt, date: order.paymentInfo?.paidAt ? new Date(order.paymentInfo.paidAt).toLocaleDateString() : 'N/A' },
        ];

        const s = order.orderStatus;
        if (s === 'CANCELLED') {
            steps.push({ status: 'Order Cancelled', completed: true, date: order.cancellation?.date ? new Date(order.cancellation.date).toLocaleDateString() : 'Today', isError: true });
        } else if (s === 'PENDING') {
            steps.push({ status: 'Processing', completed: false, date: 'Pending' });
        } else {
            steps.push({ status: 'Processing', completed: true, date: 'OK' });
            steps.push({ status: 'Shipped', completed: ['SHIPPED', 'DELIVERED'].includes(s), date: order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : 'Pending' });
            steps.push({ status: 'Delivered', completed: s === 'DELIVERED', date: order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'Pending' });
        }
        return steps;
    };

    return (
        <div className="space-y-6 font-sans text-left pb-20 animate-in fade-in duration-500 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Orders
                </button>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                        <Printer size={14} /> Print Invoice
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                        <Download size={14} /> Download Slip
                    </button>
                </div>
            </div>

            {/* Info Strip */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-xl font-black text-gray-900">#{order.orderId}</p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
                    <p className="text-sm font-bold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')} <span className="text-gray-400 text-xs font-normal ml-1">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                    </span>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Mode</p>
                    <p className={`text-sm font-black uppercase tracking-wider ${order.paymentMethod?.toLowerCase().includes('cod') ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {order.paymentMethod || 'Online'}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Order Value</p>
                    <p className="text-2xl font-black text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Items, Billing, Coupon */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items, Billing, Coupon sections remain same... */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                            <Package size={16} className="text-gray-400" />
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Order Items ({order.items?.length || 0})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/2">Item Details</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {(order.items || []).map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 p-1 flex-shrink-0">
                                                        <img src={item.image || 'https://via.placeholder.com/50'} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-gray-900 text-sm">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs font-bold text-gray-500">
                                                {item.quantity} x ₹{item.price}
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-gray-900 text-sm">
                                                ₹{(item.quantity * item.price).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard size={16} className="text-gray-400" />
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Billing Summary</h3>
                        </div>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-gray-900">₹{(order.subtotal || order.amount).toLocaleString()}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-xs font-bold text-emerald-600">
                                    <span>Discount (Coupon)</span>
                                    <span>-₹{order.discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>GST (18% Included)</span>
                                <span className="text-gray-900">₹{order.gst || 0}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>Shipping Charges</span>
                                <span className="text-emerald-600 uppercase tracking-widest text-[10px]">Free</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Final Payable Amount</span>
                                <span className="text-xl font-black text-gray-900">₹{order.amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {(order.couponCode || order.discount > 0) && (
                        <div className="bg-purple-50 rounded-2xl border border-purple-100 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                                    <Tag size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Applied Code</p>
                                    <p className="text-lg font-black text-purple-900">{order.couponCode || 'WELCOME200'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Coupon Saved</p>
                                <p className="text-xl font-black text-purple-600">₹{order.discount || 200}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Steps, Customer, etc. */}
                <div className="space-y-6">

                    {/* ADMIN ACTIONS: Conditionally show for Pending Orders */}
                    {order.status === 'Pending' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-in slide-in-from-top-4">
                            <div className="flex items-center gap-2 mb-6">
                                <AlertCircle size={16} className="text-amber-500" />
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Admin Actions</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 font-medium">This order requires your approval to proceed to shipment.</p>

                            {!showRejectInput ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleApprove}
                                        className="flex flex-col items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-95"
                                    >
                                        <CheckCircle2 size={24} /> Approve
                                    </button>
                                    <button
                                        onClick={() => setShowRejectInput(true)}
                                        className="flex flex-col items-center justify-center gap-2 py-4 bg-white border-2 border-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:bg-red-50 transition-all active:scale-95"
                                    >
                                        <XCircle size={24} /> Reject
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                        <label className="text-[9px] font-black text-red-400 uppercase tracking-widest block mb-2">Reason for Rejection</label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="e.g. Out of stock, Customer unavailable..."
                                            className="w-full bg-white border border-red-200 rounded-lg p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all min-h-[80px] resize-none"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setShowRejectInput(false)}
                                            className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmReject}
                                            disabled={!rejectionReason.trim()}
                                            className="py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-200"
                                        >
                                            Confirm Rejection
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* REJECTION REASON: Show if Rejected */}
                    {(order.status === 'Rejected' || order.status === 'Cancelled') && order.rejection && (
                        <div className="bg-red-50 rounded-2xl border border-red-100 p-6 animate-in fade-in">
                            <div className="flex items-center gap-2 mb-4">
                                <XCircle size={16} className="text-red-500" />
                                <h3 className="text-xs font-black text-red-900 uppercase tracking-widest">Order Rejected</h3>
                            </div>
                            <div className="bg-white/50 rounded-xl p-4 border border-red-100/50 space-y-3">
                                <div>
                                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-0.5">Rejected By</p>
                                    <p className="text-xs font-bold text-red-900">{order.rejection.by}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-0.5">Reason</p>
                                    <p className="text-xs font-bold text-red-800 leading-relaxed">{order.rejection.reason}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-0.5">Date</p>
                                    <p className="text-xs font-bold text-red-900">{new Date(order.rejection.date).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SHIPMENT DETAILS: Only show if Approved (Shipped/Delivered etc) */}
                    {['Approved', 'Shipped', 'Out For Delivery', 'Delivered'].includes(order.status) && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-in fade-in">
                            <div className="flex items-center gap-2 mb-6">
                                <Truck size={16} className="text-gray-400" />
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Shipment Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-400">Courier Partner</span>
                                    <span className="font-black text-gray-900">{order.shipment?.courier || 'Pending'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-400">AWB Number</span>
                                    <span className="font-black text-gray-900">{order.shipment?.awb || 'Pending'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-400">Estimated Delivery</span>
                                    <span className="font-black text-emerald-600">{order.shipment?.estimated || 'Calculating...'}</span>
                                </div>
                                <button className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors mt-2">
                                    Track Shipment
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Ordered By */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <User size={16} className="text-gray-400" />
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Ordered By</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold border border-gray-100 text-lg">
                                {order.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{order.user?.name || 'Unknown User'}</p>
                                <p className="text-xs font-semibold text-gray-400">{order.user?.email || 'N/A'}</p>
                                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 rounded text-[9px] font-black uppercase tracking-widest text-gray-500">
                                    {order.user?.type || 'Individual'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin size={16} className="text-gray-400" />
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Delivery Details</h3>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="font-black text-xs text-gray-900 mb-1">{order.address?.name}</p>
                            <p className="text-xs font-bold text-gray-400 flex items-center gap-1 mb-3">
                                <MessageCircle size={10} /> {order.address?.phone || 'N/A'}
                            </p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Address</p>
                            <p className="text-xs font-bold text-gray-600 leading-relaxed">
                                {order.address?.street}<br />
                                {order.address?.city}, {order.address?.state} - {order.address?.zip}
                            </p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Clock size={16} className="text-gray-400" />
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Order Timeline</h3>
                        </div>
                        <div className="space-y-6 relative pl-2">
                            {getTimeline().map((step, i, arr) => (
                                <div key={i} className="relative flex items-start gap-4 z-10">
                                    {/* Line */}
                                    {i !== arr.length - 1 && (
                                        <div className={`absolute left-[9px] top-6 bottom-[-24px] w-[2px] ${step.completed ? 'bg-emerald-100' : 'bg-gray-100'} -z-10`}></div>
                                    )}

                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 ${step.isError
                                        ? 'bg-red-500 border-red-500 text-white'
                                        : step.completed
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'bg-white border-gray-200 text-gray-300'
                                        }`}>
                                        {step.isError ? <X size={10} strokeWidth={4} /> : step.completed && <CheckCircle2 size={10} strokeWidth={4} />}
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${step.isError ? 'text-red-600' : 'text-gray-900'}`}>{step.status}</p>
                                        <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">{step.date || 'Pending'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
