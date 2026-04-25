import React from 'react';
import { useShop } from '../../../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Gift, ShieldCheck, ArrowLeft, Plus, Minus, X, Truck, Info, Tag, ChevronDown, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CouponsModal from '../components/CouponsModal';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, coupons, applyCoupon, appliedCoupon, couponDiscount, clearAppliedCoupon } = useShop();
    const navigate = useNavigate();
    const [showCouponModal, setShowCouponModal] = React.useState(false);
    const currencyText = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

    const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal > 450 ? 0 : 50;
    const discount = Number(couponDiscount || 0);
    const total = subtotal + shipping - discount;
    const gstIncluded = cart.reduce((acc, item) => acc + ((Number(item.gst || item.selectedVariant?.gst || 0)) * (item.quantity || 1)), 0);
    
    const variantLabel = (item) => item.selectedVariant?.name || item.selectedVariant?.variantName || '';
    const variantKey = (item) => item.variantId || item.packId || 'default';
    const availableCoupons = coupons ? coupons.filter(c => c.active !== false) : [];

    const handleApplyCoupon = async (code) => {
        const result = await applyCoupon(code, subtotal, cart);
        if (!result.valid) return;
        setShowCouponModal(false);
    };

    if (cart.length === 0) {
        return (
            <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center p-4 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8 bg-white p-12 rounded-[2.5rem] shadow-xl shadow-[#8E2B45]/5 border border-gray-100"
                >
                    <div className="relative inline-block">
                        <div className="w-24 h-24 bg-[#FDF5F6] rounded-full flex items-center justify-center border border-[#EBCDD0] shadow-inner">
                            <ShoppingBag className="w-10 h-10 text-[#8E2B45]" strokeWidth={1.5} />
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-[#8E2B45] rounded-full border-4 border-white"
                        />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Your bag is empty</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Fine jewellery deserves a home. Explore our collection and find pieces that resonate with your soul.
                        </p>
                    </div>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-3 bg-[#8E2B45] text-white px-10 py-4 rounded-full hover:bg-[#A33B58] transition-all duration-300 font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-[#8E2B45]/20 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" /> Start Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-[#F9FAFB] min-h-screen pb-24 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 mb-8 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#8E2B45] transition-all group font-bold uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800 tracking-tight">My Cart ({cart.length})</h1>
                    <div className="w-10" /> {/* Spacer for symmetry */}
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Items Section */}
                    <div className="flex-grow space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item, idx) => (
                                <motion.div
                                    key={`${item.id}-${variantKey(item)}`}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative"
                                >
                                    <button
                                        onClick={() => removeFromCart(item.id, variantKey(item))}
                                        className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-10"
                                    >
                                        <X className="w-5 h-5" strokeWidth={2} />
                                    </button>

                                    <div className="p-5 md:p-6 flex gap-6">
                                        {/* Image */}
                                        <Link to={`/product/${item.id}`} className="w-24 h-24 md:w-40 md:h-40 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-50">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase">No Image</div>
                                            )}
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-grow space-y-3">
                                            <div className="pr-8">
                                                <Link to={`/product/${item.id}`}>
                                                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug hover:text-[#8E2B45] transition-colors line-clamp-2">{item.name}</h3>
                                                </Link>
                                                {variantLabel(item) && (
                                                    <p className="text-[11px] font-bold text-[#8E2B45] uppercase tracking-wider mt-1">{variantLabel(item)}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg md:text-xl font-black text-gray-900">{currencyText(item.price)}</span>
                                                        {item.originalPrice && (
                                                            <span className="text-sm text-gray-400 line-through">{currencyText(item.originalPrice)}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Quantity Selector - GIVA Style */}
                                                <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-2 py-1 ml-auto">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1, variantKey(item))}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md border border-[#EBCDD0] text-[#E77382] disabled:opacity-30 transition-all"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-black text-gray-900 min-w-[20px] text-center">
                                                        {item.quantity || 1}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1, variantKey(item))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md bg-[#E77382] text-white hover:bg-[#8E2B45] transition-all"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-[#2DB37E] font-bold text-[11px] md:text-xs">
                                                <Truck className="w-4 h-4" />
                                                Free Delivery
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trust Banner - GIVA Style */}
                                    <div className="bg-[#FFF8F9] border-t border-[#FDF2F4] flex divide-x divide-[#FDF2F4] py-3.5">
                                        <div className="flex-1 text-center text-[10px] font-bold text-gray-500 px-2 uppercase tracking-[0.15em]">6-Month Warranty</div>
                                        <div className="flex-1 text-center text-[10px] font-bold text-gray-500 px-2 uppercase tracking-[0.15em]">Lifetime Plating</div>
                                        <div className="flex-1 text-center text-[10px] font-bold text-gray-500 px-2 uppercase tracking-[0.15em]">15-Day Returns</div>
                                    </div>

                                    {/* Gift Wrap Checkbox */}
                                    <div className="p-4 bg-white flex items-center gap-3">
                                        <input type="checkbox" id={`gift-${item.id}`} className="w-5 h-5 rounded accent-[#8E2B45] border-gray-200" />
                                        <label htmlFor={`gift-${item.id}`} className="text-xs text-gray-500 flex items-center gap-1.5 cursor-pointer font-medium">
                                            Add <span className="text-[#E77382] font-bold">gift wrap</span> and a personalized message (+ ₹50)
                                        </label>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Section */}
                    <div className="w-full lg:w-[400px] shrink-0">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-black/5 sticky top-28 space-y-8">
                            <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Order Summary</h2>

                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                                    <span className="text-gray-400 font-medium">Estimated Total</span>
                                    <div className="flex items-center gap-2">
                                        {discount > 0 && <span className="text-gray-300 line-through text-xs font-medium">{currencyText(subtotal + shipping)}</span>}
                                        <span className="text-xl tracking-tight">{currencyText(total)}</span>
                                        <Info className="w-4 h-4 text-gray-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Coupons Section - GIVA Style */}
                            <div className="pt-6 border-t border-gray-100">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Available Coupons</p>
                                <div className="space-y-1 border border-gray-100 rounded-2xl overflow-hidden">
                                    {availableCoupons.slice(0, 3).map((coupon) => (
                                        <div key={coupon.code} className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group cursor-pointer" onClick={() => handleApplyCoupon(coupon.code)}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-[#FFF8F9] flex items-center justify-center text-[#E77382] shrink-0 border border-[#FDF2F4]">
                                                    <Tag className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-black text-gray-900 uppercase tracking-wider truncate">{coupon.code}</p>
                                                    <p className="text-[10px] text-gray-400 truncate font-medium">{coupon.description || `Save ${coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : currencyText(coupon.discountValue)}`}</p>
                                                </div>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-[#E77382] transition-colors" />
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => setShowCouponModal(true)}
                                        className="w-full py-4 text-[11px] font-bold text-gray-400 hover:text-[#8E2B45] transition-colors bg-gray-50/50 uppercase tracking-widest"
                                    >
                                        View All Offers
                                    </button>
                                </div>
                            </div>

                            {appliedCoupon && (
                                <div className="bg-[#FFF8F9] border border-[#EBCDD0] p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Tag className="w-4 h-4 text-[#8E2B45]" />
                                        <div>
                                            <p className="text-[11px] font-black text-[#8E2B45] uppercase tracking-wider">{appliedCoupon.code}</p>
                                            <p className="text-[10px] text-[#E77382] font-medium">{currencyText(discount)} Discount Applied</p>
                                        </div>
                                    </div>
                                    <button onClick={clearAppliedCoupon} className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest">Remove</button>
                                </div>
                            )}

                            <div className="space-y-4 pt-4">
                                <p className="text-[10px] text-gray-400 font-medium text-center uppercase tracking-wider">Free Shipping on orders above ₹450</p>
                                
                                <div className="flex items-center gap-3 px-1">
                                    <input type="checkbox" id="gift-all" className="w-5 h-5 rounded accent-[#8E2B45] border-gray-200" />
                                    <label htmlFor="gift-all" className="text-[11px] text-gray-400 leading-tight cursor-pointer font-medium">
                                        <span className="text-[#E77382] font-bold">Gift wrap</span> all items in this order (+ ₹50 per item)
                                    </label>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="w-full bg-[#E77382] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#8E2B45] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#E77382]/20 active:scale-95 group"
                                >
                                    <Lock className="w-4 h-4" />
                                    Checkout Securely
                                </Link>

                                {gstIncluded > 0 && (
                                    <p className="text-[10px] text-gray-300 text-center font-medium">
                                        Prices include {currencyText(gstIncluded)} GST
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CouponsModal
                isOpen={showCouponModal}
                onClose={() => setShowCouponModal(false)}
                coupons={availableCoupons}
                onApply={handleApplyCoupon}
            />
        </div>
    );
};

export default Cart;
