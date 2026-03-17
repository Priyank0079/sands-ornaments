import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import {
    ArrowLeft,
    Box,
    Truck,
    Clock,
    User,
    Phone,
    Mail,
    MapPin,
    AlertCircle,
    CheckCircle2,
    XCircle,
    FileText,
    Image as ImageIcon,
    Video,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    IndianRupee,
    CreditCard,
    Check,
    X,
    Send,
    Printer,
    Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import ringImg from '../../../assets/diamond_ring.png';
import necklaceImg from '../../../assets/gold_necklace.png';
import banglesImg from '../../../assets/gold_bangles.png';

const ReturnDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ret, setRet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adminComment, setAdminComment] = useState('');

    const fetchReturnData = async () => {
        setLoading(true);
        try {
            const data = await adminService.getReturnDetails(id);
            setRet(data);
            if (data?.adminComment) setAdminComment(data.adminComment);
        } catch (err) {
            console.error("Return load failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturnData();
    }, [id]);

    const handleAction = async (status) => {
        const success = await adminService.processReturn(id, status);
        if (success) {
            toast.success(`Return request ${status}`);
            fetchReturnData();
        } else {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest animate-pulse">Analyzing Return Assets...</div>;
    if (!ret) return <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest">Return Request Not Found</div>;

    const isReplacement = ret.type === 'Replacement';

    const getStatusColor = (st) => {
        switch (st) {
            case 'Completed':
            case 'Refunded': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'Approved': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'Rejected': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="space-y-6 pb-20 text-left font-['Inter']">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/returns')}
                    className="flex items-center gap-2 text-gray-500 hover:text-footerBg font-bold text-xs uppercase tracking-widest transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Requests
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold uppercase tracking-widest text-black hover:border-footerBg transition-all shadow-sm">
                        <Download size={14} /> Download
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                        <Printer size={14} /> Print Slip
                    </button>
                </div>
            </div>

            {/* 1. Return Summary (Top Card) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <p className="text-[10px] font-bold text-footerBg uppercase tracking-widest mb-1">Return ID</p>
                    <p className="text-lg font-medium text-black select-all">#{ret.id}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-footerBg uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-sm font-medium text-primary cursor-pointer hover:underline" onClick={() => navigate(`/admin/orders/${ret.order?._id || ret.orderId}`)}>
                        #{ret.order?.orderId || ret.orderId}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-footerBg uppercase tracking-widest mb-1">Status</p>
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-widest border ${getStatusColor(ret.status)}`}>
                        {ret.status}
                    </span>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-footerBg uppercase tracking-widest mb-1">Amount</p>
                    <p className="text-xl font-medium text-footerBg">₹{(ret.refundAmount || 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Items, Breakup, Evidence */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 4. Return Items Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="text-xs font-black text-footerBg uppercase tracking-widest flex items-center gap-2">
                                <Box size={16} /> Return Items ({ret.items?.length})
                            </h3>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-black text-footerBg uppercase tracking-widest">
                                    <th className="p-4">Item Details</th>
                                    <th className="p-4 text-center">Qty</th>
                                    <th className="p-4 text-right">Price</th>
                                    <th className="p-4">Reason</th>
                                    <th className="p-4 text-right">Condition</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {ret.items?.map((item, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr className="hover:bg-gray-50/50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-200 p-1 shrink-0">
                                                        <img src={item.image || "https://placehold.co/400x400/png?text=Product"} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-footerBg">{item.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center font-bold text-gray-600">{item.qty}</td>
                                            <td className="p-4 text-right font-bold text-footerBg">₹{item.price.toLocaleString()}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-black uppercase tracking-wider">{item.reason}</span>
                                            </td>
                                            <td className="p-4 text-right text-xs font-bold text-gray-500">{item.condition}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 5. Customer Evidence */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-xs font-black text-footerBg uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertCircle size={16} /> Customer Evidence
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                            <div className="flex gap-3">
                                <MessageSquare size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Comment</p>
                                    <p className="text-xs font-bold text-footerBg mt-1 italic leading-relaxed">"{ret.evidence?.comment}"</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">Proof Uploads</p>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {ret.evidence?.images?.map((img, i) => (
                                    <div key={i} className="w-20 h-20 rounded-xl border border-gray-200 overflow-hidden shrink-0 relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
                                        <img src={img} alt="Proof" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {ret.evidence?.video && (
                                    <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:shadow-md transition-all">
                                        <Video className="text-gray-400" size={20} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 9. Refund Details (Conditional) */}
                    {(!isReplacement && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-xs font-black text-footerBg uppercase tracking-widest mb-4 flex items-center gap-2">
                                <IndianRupee size={16} /> Refund Details
                            </h3>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between text-gray-500">
                                    <span className="font-medium">Refund Method</span>
                                    <span className="font-bold text-footerBg flex items-center gap-1">
                                        <CreditCard size={12} /> {ret.refund?.method || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span className="font-medium">Transaction ID</span>
                                    <span className="font-mono font-bold text-footerBg">{ret.refund?.transactionId || 'Pending'}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
                                    <span className="font-black text-footerBg uppercase tracking-tight">Total Refund Amount</span>
                                    <span className="text-xl font-black text-emerald-600">₹{ret.refund?.amount || '0'}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Right Column: Customer, Timeline, Actions */}
                <div className="space-y-6">

                    {/* 6. Admin Actions (For New Requests) */}
                    {ret.status === 'Pending' && (
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Admin Actions</h3>
                            <textarea
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-primary min-h-[80px] resize-none mb-2"
                                placeholder="Add internal comment..."
                                value={adminComment}
                                onChange={(e) => setAdminComment(e.target.value)}
                            ></textarea>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleAction('Approved')}
                                    className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                                >
                                    <Check size={16} /> Approve
                                </button>
                                <button
                                    onClick={() => handleAction('Rejected')}
                                    className="flex items-center justify-center gap-2 bg-white text-red-500 border border-red-100 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition-all"
                                >
                                    <X size={16} /> Reject
                                </button>
                            </div>
                        </div>
                    )}

                    {/* APPROVAL REASON (If Approved) */}
                    {ret.status === 'Approved' && (
                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Approval Note
                            </h3>
                            <p className="text-xs font-bold text-emerald-700 leading-relaxed">
                                {ret.adminComment || "No note provided."}
                            </p>
                        </div>
                    )}

                    {/* REJECTION REASON (If Rejected) */}
                    {ret.status === 'Rejected' && (
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <XCircle size={12} /> Rejection Reason
                            </h3>
                            <p className="text-xs font-bold text-red-700 leading-relaxed">
                                {ret.adminComment || "No reason provided."}
                            </p>
                        </div>
                    )}

                    {/* 2. Customer & Pickup Details */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">

                        {/* Customer Info */}
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <User size={14} /> Customer
                            </h3>
                            <div className="flex items-center gap-4 p-2 -ml-2 rounded-xl transition-all">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center font-black text-sm text-gray-400 uppercase border border-gray-200 shrink-0">
                                    {(ret.user?.fullName || ret.userName || 'U')?.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-footerBg text-sm truncate">{ret.user?.fullName || ret.userName}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 truncate">
                                        <Phone size={12} /> {ret.user?.phone || ret.phone}
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 truncate">
                                        <Mail size={12} /> {ret.user?.email || ret.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-50"></div>

                        {/* Pickup Address */}
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin size={14} /> Pickup Address
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    {ret.address?.line1}<br />
                                    <span className="block mt-1 font-bold text-gray-700">
                                        {ret.address?.city}, {ret.address?.state} - {ret.address?.pincode}
                                    </span>
                                </p>
                                <p className="text-[9px] font-bold text-blue-400 mt-2 flex items-center gap-1">
                                    <Truck size={10} /> Shiprocket API Integration
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 7. Return Timeline */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-black text-footerBg uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Clock size={16} /> Return Timeline
                        </h3>
                        <div className="space-y-6 relative">
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                            {ret.timeline?.map((step, idx) => (
                                <div key={idx} className={`relative flex items-start gap-4 ${step.done ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 ${step.done ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                        {step.done ? <Check size={12} strokeWidth={4} /> : <div className="w-2 h-2 rounded-full bg-gray-200"></div>}
                                    </div>
                                    <div className="-mt-1">
                                        <p className="text-xs font-bold text-footerBg">{step.status}</p>
                                        {step.date && <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wide mt-0.5">{step.date}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 8. Logistics Info (If Approved) */}
                    {(ret.status === 'Approved' || ret.status === 'Completed' || ret.status === 'Refunded') && (
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-blue-500">
                            <h3 className="text-xs font-black text-footerBg uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Truck size={16} /> Return Pickup Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Partner</span>
                                    <span className="font-bold text-footerBg">{ret.courier?.partner}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Return AWB</span>
                                    <span className="font-mono font-bold text-footerBg select-all">{ret.courier?.awb}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Pickup Scheduled</span>
                                    <span className="font-bold text-footerBg">{ret.courier?.pickupDate}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Pickup Status</span>
                                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">{ret.courier?.status}</span>
                                </div>
                                <button className="w-full mt-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">
                                    Track Status
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 10. Notifications */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-green-100 transition-all border border-green-100">
                            <Send size={14} /> WhatsApp
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
                            <Mail size={14} /> Email Log
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReturnDetailPage;
