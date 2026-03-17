import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, RotateCcw, User, Box, CheckCircle, 
    XCircle, PlayCircle, Image as ImageIcon, AlertCircle
} from 'lucide-react';
import { sellerOrderService } from '../services/sellerOrderService';

const SellerReturnDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [returnReq, setReturnReq] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReturn = async () => {
            try {
                const data = await sellerOrderService.getReturnDetails(id);
                setReturnReq(data);
            } catch (err) {
                console.error("Return load failed");
            } finally {
                setLoading(false);
            }
        };
        fetchReturn();
    }, [id]);

    const handleAction = async (status) => {
        const res = await sellerOrderService.processReturn(id, status);
        if (res.success) {
            setReturnReq({ ...returnReq, status });
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest animate-pulse">Analyzing Claim Assets...</div>;
    if (!returnReq) return <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest">Return Request Not Found</div>;

    const cardClasses = "bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm h-full";
    const sectionTitleClasses = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2";
    const labelClasses = "text-[9px] font-black text-gray-400 uppercase tracking-widest";
    const valueClasses = "text-sm font-bold text-gray-900 mt-1 uppercase";

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/seller/returns')}
                        className="p-3 hover:bg-white rounded-2xl border border-gray-100 shadow-sm transition-all bg-gray-50/50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Return Authorization #{returnReq.id}</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                             STATUS: <span className={`font-black ${
                                 returnReq.status === 'APPROVED' ? 'text-emerald-500' : 
                                 returnReq.status === 'REJECTED' ? 'text-red-500' : 'text-amber-500'
                             }`}>{returnReq.status}</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    {returnReq.status === 'RETURN REQUESTED' && (
                        <>
                            <button 
                                onClick={() => handleAction('REJECTED')}
                                className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-red-100 text-red-600 hover:bg-red-50 transition-all flex items-center gap-3 backdrop-blur-sm"
                            >
                                <XCircle size={18} /> Reject Claim
                            </button>
                            <button 
                                onClick={() => handleAction('APPROVED')}
                                className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] bg-[#3E2723] text-white shadow-2xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all flex items-center gap-3"
                            >
                                <CheckCircle size={18} /> Approve & Refund
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details & Reason */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}><Box size={14} className="text-[#3E2723]" /> Return Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50 mb-10">
                            <div>
                                <p className={labelClasses}>Original Order</p>
                                <p className="text-lg font-black text-gray-900 mt-1 tracking-tight">#{returnReq.order?.orderId || returnReq.orderId}</p>
                            </div>
                            <div>
                                <p className={labelClasses}>Request Date</p>
                                <p className={valueClasses}>{new Date(returnReq.createdAt).toLocaleDateString()} {new Date(returnReq.createdAt).toLocaleTimeString()}</p>
                            </div>
                            <div>
                                <p className={labelClasses}>Item for Return</p>
                                <p className={valueClasses}>{returnReq.item?.product?.name || returnReq.product}</p>
                                <p className="text-[10px] font-black text-[#8D6E63] mt-1">SN: {returnReq.item?.sku || returnReq.barcode}</p>
                            </div>
                            <div>
                                <p className={labelClasses}>Unit Count</p>
                                <p className={valueClasses}>{returnReq.item?.quantity || returnReq.quantity} UNIT</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className={sectionTitleClasses}><AlertCircle size={14} className="text-amber-500" /> Client Feedback</h3>
                            <div className="p-8 bg-amber-50/30 rounded-3xl border border-amber-100/50">
                                <p className="text-sm font-bold text-gray-700 leading-relaxed italic">
                                    "{returnReq.returnReason}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Evidence Section */}
                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}><PlayCircle size={14} className="text-blue-500" /> Verification Assets (Mandatory Audit)</h3>
                        
                        <div className="space-y-8">
                            {/* 360 Video */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                     <p className={labelClasses}>360° Technical Inspection Video</p>
                                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-100">Verified Upload</span>
                                </div>
                                <div className="relative aspect-video bg-black rounded-3xl overflow-hidden group shadow-2xl">
                                    <video 
                                        src={returnReq.video360} 
                                        controls 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute top-6 left-6 bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> 360 Scan Active
                                    </div>
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                     <p className={labelClasses}>Static Condition Images (2-3 Views)</p>
                                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total: {returnReq.images?.length || 0} Assets</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {returnReq.images?.map((img, idx) => (
                                        <div key={idx} className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group cursor-zoom-in relative">
                                            <img src={img} alt="Evidence" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <PlayCircle className="text-white w-8 h-8 opacity-50" />
                                            </div>
                                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter">View #{idx + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Info */}
                <div className="space-y-8">
                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}><User size={14} className="text-[#3E2723]" /> Customer Snapshot</h3>
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#3E2723]/5 rounded-2xl flex items-center justify-center border border-[#3E2723]/10">
                                    <User size={24} className="text-[#3E2723]" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-gray-900 tracking-tight">{returnReq.user?.fullName || returnReq.customerName}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tier: {returnReq.user?.role || 'Premium Member'}</p>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-50 space-y-6">
                                <div>
                                    <p className={labelClasses}>Data Privacy</p>
                                    <p className="text-[10px] font-black text-gray-400 mt-1 uppercase italic tracking-widest">Contact Information Restricted</p>
                                </div>
                                <div>
                                    <p className={labelClasses}>Transaction Value</p>
                                    <p className="text-xl font-black text-[#3E2723] mt-1 tracking-tighter">₹{returnReq.order?.totalAmount?.toLocaleString() || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100/30">
                                    <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1">Security Risk Assessment</p>
                                    <p className="text-[10px] font-bold text-red-600">No historical return pattern identified. Minimal risk profile.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#3E2723] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-[#3E2723]/20">
                         <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <ImageIcon size={14} className="text-white/60" /> Operational Protocol
                         </h3>
                         <p className="text-xs font-bold leading-relaxed opacity-80 mb-8">
                             Sands Jewels returns requires strict adherence to physical verification protocols. The 360° video must show all hallmarks and seals intact.
                         </p>
                         <ul className="space-y-4">
                            {[
                                'Verify 360° video Hallmarks',
                                'Check high-res image polish',
                                'Verify Serial Number Integrity',
                                'Process Refund Authorization'
                            ].map((text, i) => (
                                <li key={i} className="flex gap-3 text-[10px] font-black uppercase tracking-widest items-center">
                                    <div className="w-1.5 h-1.5 bg-white/20 rounded-full" /> {text}
                                </li>
                            ))}
                         </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerReturnDetail;
