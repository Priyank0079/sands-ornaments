import React from 'react';
import { Tag, Check, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/price';

const CouponsTab = ({ availableCoupons, copiedCoupon, handleCopyCoupon }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-black tracking-wide">My Coupons</h2>
                    <p className="text-xs text-gray-500 mt-1">Copy a code and use it in your cart or checkout.</p>
                </div>
                <button onClick={() => navigate('/shop')} className="hidden md:inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#D39A9F] transition-all">
                    Shop Now
                </button>
            </div>
            {availableCoupons.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-[#EBCDD0]">
                    <div className="w-14 h-14 rounded-2xl bg-[#FDF5F6] mx-auto flex items-center justify-center mb-4">
                        <Tag className="w-6 h-6 text-[#D39A9F]" />
                    </div>
                    <p className="text-gray-500 text-sm">No active coupons available right now.</p>
                    <button onClick={() => navigate('/shop')} className="mt-4 inline-flex items-center gap-2 text-[#D39A9F] hover:text-black text-xs font-bold uppercase tracking-widest">
                        Explore Collection
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {availableCoupons.map((coupon) => {
                        const minOrder = coupon.minOrderValue ?? coupon.minOrder ?? 0;
                        const maxDiscount = coupon.maxDiscount ?? coupon.maxAmount ?? null;
                        const description = coupon.description || coupon.desc || 'Special savings on your order';
                        const couponKey = coupon.id || coupon._id || coupon.code;
                        return (
                            <div key={couponKey} className="bg-white border border-[#EBCDD0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="inline-flex items-center gap-2 bg-[#FDF5F6] text-[#3E2723] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[#EBCDD0]">
                                            <Tag className="w-3 h-3 text-[#D39A9F]" />
                                            {coupon.code}
                                        </div>
                                        <p className="text-sm font-bold text-black mt-3">{description}</p>
                                        <div className="text-[10px] text-gray-500 mt-2 space-y-1">
                                            <p>Min order: {formatCurrency(minOrder)}</p>
                                            {maxDiscount ? <p>Max discount: {formatCurrency(maxDiscount)}</p> : null}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCopyCoupon(coupon.code)}
                                        className="p-2 rounded-lg border border-gray-200 hover:border-[#D39A9F] hover:text-[#D39A9F] transition-colors"
                                        title="Copy coupon code"
                                    >
                                        {copiedCoupon === coupon.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CouponsTab;
