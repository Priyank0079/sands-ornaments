import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, User, MapPin, CreditCard, ShieldCheck, FileText, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '../services/adminService';

const AdminSellerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);

    const fetchSeller = async () => {
        try {
            const data = await adminService.getSellerDetails(id);
            setSeller(data);
        } catch (err) {
            console.error("Seller load failed");
        }
    };

    useEffect(() => {
        fetchSeller();
    }, [id]);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleAction = async (status, reason = null) => {
        const success = await adminService.updateSellerStatus(id, status, reason);
        if (success) {
            if (status === 'REJECTED') setShowRejectModal(false);
            fetchSeller();
        }
    };

    if (!seller) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">Loading Seller Profile...</div>;

    const sectionTitleClasses = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2";
    const infoLabelClasses = "text-[9px] font-black text-gray-400 uppercase tracking-widest";
    const infoValueClasses = "text-sm font-bold text-gray-900 mt-1 uppercase";
    const cardClasses = "bg-white rounded-2xl border border-gray-100 p-8 shadow-sm h-full";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/sellers')}
                        className="p-2.5 hover:bg-white rounded-xl border border-gray-100 shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">SELLER DETAILS</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">VERIFICATION WORKFLOW • ID: {seller.id}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {seller.status === 'PENDING' ? (
                        <>
                            <button 
                                onClick={() => setShowRejectModal(true)}
                                className="bg-red-50 text-red-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2"
                            >
                                <XCircle size={18} /> Reject
                            </button>
                            <button 
                                onClick={() => handleAction('APPROVED')}
                                className="bg-[#3E2723] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all flex items-center gap-2"
                            >
                                <CheckCircle size={18} /> Approve Application
                            </button>
                        </>
                    ) : (
                        <div className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border flex items-center gap-2 ${
                            seller.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                            {seller.status === 'APPROVED' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                            Status: {seller.status}
                        </div>
                    )}
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">REJECT APPLICATION</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Please provide a reason for the rejection</p>
                        
                        <textarea 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-bold uppercase tracking-wider outline-none focus:border-red-200 transition-all min-h-[120px]"
                            placeholder="REASON FOR REJECTION..."
                        />
                        
                        <div className="flex gap-3 mt-8">
                            <button 
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 py-3 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleAction('REJECTED', rejectReason)}
                                disabled={!rejectReason.trim()}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {seller.status === 'REJECTED' && seller.rejectionReason && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                        <XCircle size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">REJECTION NOTICE</h4>
                    </div>
                    <p className="text-xs font-bold text-red-900 uppercase tracking-widest leading-relaxed">"{seller.rejectionReason}"</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Personal & Bank */}
                <div className="lg:col-span-1 space-y-8">
                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}>
                            <User size={14} className="text-[#3E2723]" /> Seller Information
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className={infoLabelClasses}>Full Name</p>
                                <p className={infoValueClasses}>{seller.fullName}</p>
                            </div>
                            <div>
                                <p className={infoLabelClasses}>Mobile Number</p>
                                <p className={infoValueClasses}>{seller.mobileNumber}</p>
                            </div>
                            <div>
                                <p className={infoLabelClasses}>Email Address</p>
                                <p className={infoValueClasses}>{seller.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}>
                            <CreditCard size={14} className="text-[#3E2723]" /> Bank Details
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className={infoLabelClasses}>Account Number</p>
                                <p className={infoValueClasses}>{seller.accountNumber}</p>
                            </div>
                            <div>
                                <p className={infoLabelClasses}>IFSC Code</p>
                                <p className={infoValueClasses}>{seller.ifscCode}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Shop & Verification */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={cardClasses}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className={sectionTitleClasses}>
                                    <Store size={14} className="text-[#3E2723]" /> Shop Information
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className={infoLabelClasses}>Shop Name</p>
                                        <p className={infoValueClasses}>{seller.shopName}</p>
                                    </div>
                                    <div>
                                        <p className={infoLabelClasses}>Address</p>
                                        <div className="mt-1">
                                            <p className="text-sm font-bold text-gray-900 uppercase leading-relaxed">
                                                {seller.shopAddress}<br />
                                                {seller.city}, {seller.state}<br />
                                                PIN: {seller.pincode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className={sectionTitleClasses}>
                                    <ShieldCheck size={14} className="text-[#3E2723]" /> Verification Details
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className={infoLabelClasses}>GST Number</p>
                                        <p className={infoValueClasses}>{seller.gstNumber}</p>
                                    </div>
                                    <div>
                                        <p className={infoLabelClasses}>PAN Number</p>
                                        <p className={infoValueClasses}>{seller.panNumber}</p>
                                    </div>
                                    <div>
                                        <p className={infoLabelClasses}>BIS Hallmark License</p>
                                        <p className={infoValueClasses}>{seller.bisNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cardClasses}>
                        <h3 className={sectionTitleClasses}>
                            <FileText size={14} className="text-[#3E2723]" /> Document Verification
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <p className={infoLabelClasses}>Aadhar Card</p>
                                <div className="aspect-video bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center group overflow-hidden relative">
                                    <FileText size={32} className="text-gray-300 group-hover:scale-110 transition-transform" />
                                    <button className="absolute bottom-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest underline decoration-dotted hover:text-[#3E2723]">View Full Document</button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className={infoLabelClasses}>Shop License</p>
                                <div className="aspect-video bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center group overflow-hidden relative">
                                    <ShieldCheck size={32} className="text-gray-300 group-hover:scale-110 transition-transform" />
                                    <button className="absolute bottom-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest underline decoration-dotted hover:text-[#3E2723]">View Full Document</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSellerDetails;
