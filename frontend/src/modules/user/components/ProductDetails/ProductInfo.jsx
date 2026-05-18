import React from 'react';
import { Star, ShoppingBag, Ruler, ShieldCheck, RotateCcw, Truck, Lock } from 'lucide-react';
import { formatCurrency } from '../../../utils/price';

const ProductInfo = ({
    product,
    averageRating,
    hasReviews,
    reviewCount,
    supplierName,
    variantPrice,
    variantMrp,
    variantDiscount,
    selectedVariantId,
    setSelectedVariantId,
    handleAddToCart,
    canAddToCart,
    setIsSizeGuideOpen,
    selectedVariant
}) => {
    return (
        <div className="w-full mt-8 mb-12 px-0">
            <div className="bg-white border-y border-gray-100 p-6 md:p-12 flex flex-col items-center text-center">
                {/* Header: Title & Rating */}
                <div className="max-w-4xl mx-auto mb-6">
                    <h1 className="text-2xl md:text-4xl font-sans font-bold text-black mb-4 tracking-tight uppercase">
                        {product.name}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <div className="flex items-center text-[#D39A9F] bg-[#FDF5F6] px-3 py-1 rounded-full border border-[#EBCDD0]/20">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-200'} `} />
                                ))}
                            </div>
                            <span className="ml-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                                {hasReviews ? `${reviewCount} Reviews` : 'Authentic Collection'}
                            </span>
                        </div>

                        {supplierName && (
                            <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                                By <span className="text-gray-900">{supplierName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Section - Compact */}
                <div className="mb-8">
                    <div className="flex items-baseline justify-center gap-3">
                        <span className="text-3xl md:text-5xl font-bold text-black tracking-tighter">
                            {formatCurrency(variantPrice)}
                        </span>
                        {variantMrp > variantPrice && (
                            <div className="flex items-center gap-2">
                                <span className="text-base md:text-lg text-gray-300 line-through font-medium">
                                    {formatCurrency(variantMrp)}
                                </span>
                                <span className="text-[9px] font-bold text-[#9C5B61] uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded">
                                    -{variantDiscount}%
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Inclusive of all taxes & shipping</p>
                </div>

                {/* Variant & Action Section - Tightened */}
                <div className="w-full max-w-xl space-y-8">
                    {product.variants && product.variants.length > 1 && (
                        <div className="space-y-3">
                            <div className="flex flex-wrap justify-center gap-2">
                                {product.variants.map((variant) => {
                                    const variantId = variant.id || variant._id;
                                    const isSelected = String(variantId) === String(selectedVariantId);
                                    return (
                                        <button
                                            key={variantId}
                                            type="button"
                                            onClick={() => setSelectedVariantId(variantId)}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${isSelected
                                                ? 'border-[#8E2B45] bg-[#8E2B45] text-white shadow-md'
                                                : 'border-gray-100 text-gray-400 hover:border-gray-300 bg-gray-50/30'
                                                }`}
                                        >
                                            {variant.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* DESKTOP ACTION BUTTONS */}
                    <div className="hidden md:flex flex-col items-center gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={!canAddToCart}
                            className={`w-full max-w-md py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 relative overflow-hidden group ${canAddToCart
                                    ? 'bg-[#8E2B45] text-white hover:bg-[#5B1E26] shadow-lg hover:-translate-y-0.5'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {canAddToCart ? (
                                    <>
                                        <ShoppingBag className="w-4 h-4" />
                                        Add to Bag
                                    </>
                                ) : 'Out of Stock'}
                            </span>
                        </button>

                        <div className="flex items-center justify-center gap-6 mt-2">
                            <button 
                                onClick={() => setIsSizeGuideOpen(true)}
                                className="text-[9px] font-black text-[#8E2B45] uppercase tracking-[0.2em] hover:underline flex items-center gap-1.5 transition-all active:scale-95"
                            >
                                <Ruler size={12} /> Find Your Size
                            </button>
                            <div className="h-3 w-[1px] bg-gray-100" />
                            <button className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-[#8E2B45] transition-all">
                                Shipping Policy
                            </button>
                        </div>
                    </div>

                    {/* Trust Ribbon - Premium Highlight */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-8 border-t border-gray-50">
                        {[
                            { icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, title: "BIS Hallmark", desc: "100% Pure & Certified" },
                            { icon: <RotateCcw className="w-5 h-5 text-amber-600" />, title: "7-Day Returns", desc: "Easy & Hassle Free" },
                            { icon: <Truck className="w-5 h-5 text-blue-600" />, title: "Free Delivery", desc: "Fully Insured Shipping" },
                            { icon: <Lock className="w-5 h-5 text-gray-600" />, title: "Secure Pay", desc: "Encrypted Payments" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group cursor-default">
                                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-md border border-transparent group-hover:border-gray-100">
                                    {item.icon}
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest">{item.title}</p>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5 opacity-0 group-hover:opacity-100 transition-all">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stock & Codes */}
                    <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-50">
                        <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest ${canAddToCart ? 'text-emerald-600' : 'text-rose-600'}`}>
                            <div className={`w-1 h-1 rounded-full ${canAddToCart ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                            {canAddToCart ? 'Ready to Ship' : 'Sold Out'}
                        </div>

                        <div className="flex gap-4 opacity-30">
                            {product?.huid && (
                                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">HUID {product.huid}</span>
                            )}
                            {selectedVariant?.variantCode && (
                                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">REF {selectedVariant.variantCode}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
