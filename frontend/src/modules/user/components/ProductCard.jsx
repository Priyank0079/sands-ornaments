import React, { useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const ProductCard = ({ product, isWishlistPage = false }) => {
    const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useShop();
    const navigate = useNavigate();
    const [flying, setFlying] = useState(false);
    const [flyingType, setFlyingType] = useState('cart'); // 'cart' or 'heart'
    const currencyText = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
    const isWishlisted = safeWishlist.some(item => item.id === product.id);
    const primaryImage = product.image || product.images?.[0] || null;

    const variantPrices = (product.variants || [])
        .map(v => Number(v.price))
        .filter(v => !Number.isNaN(v) && v > 0);
    const variantOriginalPrices = (product.variants || [])
        .map(v => Number(v.mrp))
        .filter(v => !Number.isNaN(v) && v > 0);
    const variantCount = (product.variants || []).length;
    const fromPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price || 0);
    const fromOriginalPrice = variantOriginalPrices.length > 0 ? Math.max(...variantOriginalPrices) : Number(product.originalPrice || 0);

    // Calculate discount percentage if original price exists
    const effectivePrice = variantCount > 1 ? fromPrice : Number(product.price || 0);
    const effectiveOriginalPrice = variantCount > 1 ? fromOriginalPrice : Number(product.originalPrice || 0);
    const discount = effectiveOriginalPrice > effectivePrice
        ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
        : 0;
    const categoryLabel = product.category || '';
    const metalLabel = product.metal?.toLowerCase() === 'gold' ? 'Gold' : 'Silver';
    const collectionLabel = categoryLabel
        ? `925 ${metalLabel} ${categoryLabel}`
        : `925 ${metalLabel} Jewellery`;
    const ratingValue = Number(product.rating || 0);
    const reviewCount = Number(product.reviewCount ?? product.reviews ?? 0);
    const hasReviews = reviewCount > 0 && ratingValue > 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFlyingType('cart');
        setFlying(true);
        addToCart(product);
        setTimeout(() => setFlying(false), 800);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isWishlisted) {
            setFlyingType('heart');
            setFlying(true);
            addToWishlist(product);
            setTimeout(() => setFlying(false), 800);
        } else {
            removeFromWishlist(product.id);
        }
    };

    return (
        <>
            <style>
                {`
                    @keyframes flyToCart {
                        0% { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); opacity: 1; border-radius: 20px; }
                        50% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.4); }
                        100% { top: 30px; left: 92%; transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-radius: 50%; }
                    }
                     @keyframes flyToHeart {
                        0% { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); opacity: 1; border-radius: 20px; }
                        50% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.4); }
                        100% { top: 30px; left: 88%; transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-radius: 50%; }
                    }
                    .animate-fly-cart {
                        animation: flyToCart 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    }
                    .animate-fly-heart {
                        animation: flyToHeart 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    }
                `}
            </style>

            {/* Flying Image Animation Element */}
            {flying && primaryImage && (
                <img
                    src={primaryImage}
                    alt=""
                    className={`fixed z-[9999] w-48 h-48 object-cover shadow-2xl pointer-events-none border-4 border-white ${flyingType === 'cart' ? 'animate-fly-cart' : 'animate-fly-heart'}`}
                    style={{ left: '50%', top: '50%' }}
                />
            )}

            <Link to={`/product/${product.id}`} className="group relative w-full h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-square md:aspect-[5/4] max-h-[160px] md:max-h-none overflow-hidden bg-[#F5F5F5] shrink-0">
                    <div className="block w-full h-full">
                        {primaryImage ? (
                            <img
                                src={primaryImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F7F2F3] text-[#B88B90] text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Dynamic Badges */}
                    {product.isNew ? (
                        <span className="absolute top-2 md:top-4 right-0 bg-gradient-to-r from-[#D39A9F] to-[#4A1015] text-white text-[7px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 shadow-sm tracking-widest z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%)', paddingLeft: '12px' }}>
                            NEW
                        </span>
                    ) : hasReviews && ratingValue >= 4.5 ? (
                        <span className="absolute top-2 md:top-4 right-0 bg-gradient-to-r from-[#D39A9F] to-[#4A1015] text-white text-[7px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 shadow-sm tracking-widest z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%)', paddingLeft: '12px' }}>
                            TRENDING
                        </span>
                    ) : null}

                    {/* Dynamic Collection Tag - Top Left (Hidden on Mobile) */}
                    <div className="hidden md:block absolute top-4 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#4A1015] rounded-sm shadow-md z-20 border border-[#4A1015]/10">
                        {collectionLabel}
                    </div>

                    {/* Wishlist Heart - Bottom Right */}
                    <button
                        onClick={handleWishlist}
                        className={`absolute bottom-2 right-2 z-20 p-2 bg-white/20 hover:bg-white rounded-full backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 shadow-sm ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-white hover:text-red-500'}`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={2} />
                    </button>

                    {/* Rating Badge - Bottom Left (Image Overlay) */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm z-10 w-fit">
                        <span className="text-[10px] font-bold text-black">{hasReviews ? ratingValue.toFixed(1) : 'New'}</span>
                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] text-gray-500 border-l border-gray-300 pl-1 ml-0.5">{hasReviews ? reviewCount : 'No reviews'}</span>
                    </div>
                </div>

                <div className={`${isWishlistPage ? 'p-2 md:p-3.5' : 'p-1.5 md:p-3'} text-left flex flex-col flex-1 pb-1.5 md:pb-2`}>

                    <div className="flex items-baseline gap-2 mb-1">
                        <span className={`text-black font-bold ${isWishlistPage ? 'text-sm' : 'text-base'}`}>
                            {variantCount > 1 ? `From ${currencyText(fromPrice)}` : currencyText(product.price || 0)}
                        </span>
                        {effectiveOriginalPrice > effectivePrice && (
                            <span className="text-gray-400 line-through text-xs">{currencyText(effectiveOriginalPrice)}</span>
                        )}
                    </div>

                    {variantCount > 1 && (
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
                            Variants: {variantCount}
                        </div>
                    )}

                    {/* Title */}
                    <h3 className={`text-black font-serif ${isWishlistPage ? 'text-sm md:text-base' : 'text-base md:text-lg'} font-medium leading-tight mb-2 line-clamp-2`}>
                        {product.name}
                    </h3>

                    {isWishlistPage ? (
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-auto pb-2">
                            Saved for later
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="text-[10px] font-bold text-[#D39A9F] uppercase tracking-widest hover:text-[#4A1015] transition-colors flex items-center gap-1 mt-auto pb-2"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/product/${product.id}#care`);
                            }}
                        >
                            <span>Caring Tips</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D39A9F]" />
                        </button>
                    )}
                </div>

                {/* Add to Cart Button - Full Width Flush Bottom with Premium Gradient */}
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-[#D39A9F] to-[#4A1015] text-white py-2.5 md:py-3 text-[10px] md:text-sm font-bold hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest mt-auto mb-0 rounded-none border-t border-transparent shadow-lg"
                >
                    Add to Cart
                </button>
            </Link>
        </>
    );
};

export default ProductCard;

