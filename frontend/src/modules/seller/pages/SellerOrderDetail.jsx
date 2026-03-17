import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, ShoppingBag, User, MapPin, CreditCard, 
    Box, CheckCircle, XCircle, Truck, PackageCheck 
} from 'lucide-react';
import { sellerOrderService } from '../services/sellerOrderService';
import SellerFAQ from '../components/SellerFAQ';

const SellerOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await sellerOrderService.getOrderDetails(id);
                setOrder(data);
            } catch (err) {
                console.error("Order load failed");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (status) => {
        const res = await sellerOrderService.updateOrderStatus(id, status);
        if (res.success) {
            setOrder({ ...order, orderStatus: status });
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest animate-pulse">Synchronizing Data...</div>;
    if (!order) return <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest">Order Not Found</div>;

    const cardClasses = "bg-white rounded-2xl border border-gray-100 p-8 shadow-sm h-full";
    const sectionTitleClasses = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2";
    const labelClasses = "text-[9px] font-black text-gray-400 uppercase tracking-widest";
    const valueClasses = "text-sm font-bold text-gray-900 mt-1 uppercase";

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/seller/orders')}
                        className="p-2.5 hover:bg-white rounded-xl border border-gray-100 shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">PURCHASE ORDER #{order.orderId}</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                             STATUS: <span className="text-[#3E2723]">{order.orderStatus}</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {order.orderStatus === 'PENDING' && (
                        <>
                            <button 
                                onClick={() => handleStatusUpdate('REJECTED')}
                                className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-red-100 text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                            >
                                <XCircle size={16} /> Reject
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate('ACCEPTED')}
                                className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-[#3E2723] text-white shadow-xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all flex items-center gap-2"
                            >
                                <CheckCircle size={16} /> Accept Order
                            </button>
                        </>
                    )}
                    {order.orderStatus === 'ACCEPTED' && (
                        <button 
                            onClick={() => handleStatusUpdate('SHIPPED')}
                            className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
                        >
                            <Truck size={16} /> Mark as Shipped
                        </button>
                    )}
                    {order.orderStatus === 'SHIPPED' && (
                        <button 
                            onClick={() => handleStatusUpdate('DELIVERED')}
                            className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                        >
                            <PackageCheck size={16} /> Mark as Delivered
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Order & Payments */}
                <div className="space-y-8">
                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}><ShoppingBag size={14} className="text-[#3E2723]" /> Order Specifications</h3>
                        <div className="space-y-6">
                            <div>
                                <p className={labelClasses}>Order Date</p>
                                <p className={valueClasses}>{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className={labelClasses}>Payment Method</p>
                                <p className={valueClasses}>{order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className={labelClasses}>Payment Status</p>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                    order.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}><CreditCard size={14} className="text-[#3E2723]" /> Financial Breakdown</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>Delivery Fee</span>
                                <span className="text-emerald-500 uppercase">FREE</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between">
                                <span className="text-[10px] font-black text-[#3E2723] uppercase tracking-[0.2em]">Total Amount</span>
                                <span className="text-xl font-black text-gray-900 tracking-tighter">₹{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Customer & Shipping */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={cardClasses}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className={sectionTitleClasses}><User size={14} className="text-[#3E2723]" /> Customer Credentials</h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className={labelClasses}>Individual Identity</p>
                                        <p className={valueClasses}>{order.user?.fullName || order.shippingAddress?.firstName || 'Customer'}</p>
                                        <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase italic">Private Profile</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className={sectionTitleClasses}><MapPin size={14} className="text-[#3E2723]" /> Shipping Destination</h3>
                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-gray-900 uppercase leading-relaxed max-w-[250px]">
                                        {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                                    </p>
                                    {order.trackingId && (
                                        <div className="pt-4 border-t border-gray-50">
                                            <p className={labelClasses}>Logistics Tracking</p>
                                            <p className="text-[10px] font-black text-blue-600 mt-1 uppercase">{order.shippingCarrier}: {order.trackingId}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}><Box size={14} className="text-[#3E2723]" /> Product Manifest</h3>
                        <div className="flex gap-8 items-center p-8 bg-[#FDFBF7] rounded-[2rem] border border-[#EFEBE9] relative overflow-hidden group">
                             <div className="w-24 h-24 bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-3 shadow-inner relative z-10">
                                <img src={order.items?.[0]?.product?.image} alt="" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center font-black text-[#3E2723] text-xl opacity-0 group-hover:opacity-100 transition-opacity">{order.items?.[0]?.quantity}x</div>
                             </div>
                             <div className="flex-1 space-y-4 relative z-10">
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">{order.items?.[0]?.product?.name || 'Jewellery Item'}</h4>
                                    <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest mt-1">Order Identification: {order.orderId}</p>
                                </div>
                                <div className="flex gap-12">
                                    <div>
                                        <p className={labelClasses}>Unit Valuation</p>
                                        <p className="text-sm font-black text-gray-900 mt-1">₹{order.items?.[0]?.price?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className={labelClasses}>Regulatory Compliance</p>
                                        <p className="text-sm font-black text-gray-400 mt-1 italic">INC. ALL TAXES</p>
                                    </div>
                                    <div>
                                        <p className={labelClasses}>Inventory State</p>
                                        <p className="text-sm font-black text-emerald-500 mt-1">ALLOCATED</p>
                                    </div>
                                </div>
                             </div>
                             <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#3E2723]/5 to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}><Truck size={14} className="text-[#3E2723]" /> Operational Lifecycle</h3>
                        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                             {[
                                { date: order.createdAt, label: 'Acquisition Logged', status: 'COMPLETED' },
                                { date: order.paymentInfo?.paidAt || order.createdAt, label: 'Payment Verified', status: order.paymentStatus === 'PAID' ? 'COMPLETED' : 'PENDING' },
                                { date: order.acceptedAt, label: 'Ready for Dispatch', status: ['ACCEPTED', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus) ? 'COMPLETED' : 'PENDING' },
                                { date: order.shippedAt, label: 'Logistics Handover', status: ['SHIPPED', 'DELIVERED'].includes(order.orderStatus) ? 'COMPLETED' : 'PENDING' }
                             ].map((step, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-[27px] w-3.5 h-3.5 rounded-full border-2 bg-white transition-colors duration-500 ${step.status === 'COMPLETED' ? 'border-[#3E2723] bg-[#3E2723]' : 'border-gray-200'}`} />
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${step.status === 'COMPLETED' ? 'text-[#3E2723]' : 'text-gray-300'}`}>
                                            {step.label}
                                        </p>
                                        {step.date && (
                                            <p className="text-[9px] font-bold text-gray-400 mt-0.5">{new Date(step.date).toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-12">
                <SellerFAQ />
            </div>
        </div>
    );
};

export default SellerOrderDetail;
