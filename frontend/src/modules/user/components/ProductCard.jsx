import React, { useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';

import latestRing from '../assets/latest_drop_ring.png';
import latestBracelet from '../assets/latest_drop_bracelet.png';
import latestNecklace from '../assets/latest_drop_necklace.png';
import latestEarrings from '../assets/latest_drop_earrings.png';
import newAnklets from '../assets/new_launch_anklets.png';

// Import high-end generated product shots for missing DB images
import premiumRingProduct from '../assets/premium_ring_product.png';
import premiumBraceletProduct from '../assets/premium_bracelet_product.png';
import premiumPendantProduct from '../assets/premium_pendant_product.png';
import premiumNecklaceProduct from '../assets/premium_necklace_product.png';

const fallbackProductMap = {
    ring: premiumRingProduct,
    pendant: premiumPendantProduct,
    necklace: premiumNecklaceProduct,
    bracelet: premiumBraceletProduct
};

const fallbackModelMap = {
    ring: latestRing,
    pendant: latestNecklace,
    earring: latestEarrings,
    bracelet: latestBracelet,
    anklet: newAnklets
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const ProductCard = ({ product, isWishlistPage = false }) => {
    const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useShop();
    const navigate = useNavigate();
    const [flying, setFlying] = useState(false);
    const [flyingType, setFlyingType] = useState('cart'); // 'cart' or 'heart'
    const currencyText = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
    const isWishlisted = safeWishlist.some(item => item.id === product.id);

    // Dynamic Image Resolution - Support DB images or Fallback Model Shots (Unique Only)
    const allUniqueImages = Array.from(new Set([
        product.image,
        ...(product.images || []),
        ...(product.variants || []).flatMap(v => v.variantImages || [])
    ].filter(Boolean)));

    const resolvePrimaryImage = () => {
        // 1. If DB has an image, use it
        if (allUniqueImages[0]) return allUniqueImages[0];
        
        // 2. If missing, use same keyword logic to find a signature product shot
        const categoryData = product.category;
        const categoryName = (typeof categoryData === 'object' ? categoryData?.name : categoryData) || '';
        const searchStr = String(categoryName + ' ' + (product.name || '')).toLowerCase();
        
        if (searchStr.includes('ring')) return fallbackProductMap.ring;
        if (searchStr.includes('pendant') || searchStr.includes('necklace') || searchStr.includes('chain')) return fallbackProductMap.pendant;
        if (searchStr.includes('bracelet')) return fallbackProductMap.bracelet;
        
        return null;
    };

    const primaryImage = resolvePrimaryImage();
    
    const resolveSecondaryImage = () => {
        // 1. If DB has a second UNIQUE image, use it
        const nextActualImage = allUniqueImages.find(img => img !== primaryImage);
        if (nextActualImage) return nextActualImage;
        
        // 2. Otherwise, match category/name keywords for model shot
        const categoryData = product.category;
        const categoryName = (typeof categoryData === 'object' ? categoryData?.name : categoryData) || '';
        const searchStr = String(categoryName + ' ' + (product.name || '')).toLowerCase();
        
        if (searchStr.includes('ring')) return fallbackModelMap.ring;
        if (searchStr.includes('pendant') || searchStr.includes('necklace') || searchStr.includes('chain')) return fallbackModelMap.pendant;
        if (searchStr.includes('earring')) return fallbackModelMap.earring;
        if (searchStr.includes('bracelet')) return fallbackModelMap.bracelet;
        if (searchStr.includes('anklet')) return fallbackModelMap.anklet;
        
        return null;
    };
    const secondaryImage = resolveSecondaryImage();

    const variantPrices = (product.variants || [])
        .map(v => Number(v.price))
        .filter(v => !Number.isNaN(v) && v > 0);
    const variantOriginalPrices = (product.variants || [])
        .map(v => Number(v.mrp))
        .filter(v => !Number.isNaN(v) && v > 0);
    const variantCount = (product.variants || []).length;
    const fromPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price || 0);
    const fromOriginalPrice = variantOriginalPrices.length > 0 ? Math.max(...variantOriginalPrices) : Number(product.originalPrice || 0);

    const effectivePrice = variantCount > 1 ? fromPrice : Number(product.price || 0);
    const effectiveOriginalPrice = variantCount > 1 ? fromOriginalPrice : Number(product.originalPrice || 0);
    
    // UI Label logic
    const categoryData = product.category;
    const categoryLabel = typeof categoryData === 'object' ? categoryData?.name : categoryData || '';
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
        setTimeout(() => {
            setFlying(false);
            navigate('/cart');
        }, 800);
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

            <Link to={`/product/${product.id}`} className="group relative w-full h-full flex flex-col bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(74,16,21,0.06)]">
                {/* Image Container - CLEAN IMAGE SWAP (No Zooming) */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] shrink-0">
                    <div className="absolute inset-0">
                        {primaryImage ? (
                            <>
                                <img
                                    src={primaryImage}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover z-0"
                                />
                                {secondaryImage && (
                                    <img
                                        src={secondaryImage}
                                        alt={`${product.name} detail`}
                                        className="absolute inset-0 w-full h-full object-cover z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms] ease-in-out"
                                    />
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F7F2F3] text-[#B88B90] text-[clamp(8px,1.5vw,12px)] font-bold uppercase tracking-[0.25em]">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Dynamic Badges */}
                    {product.isNew ? (
                        <span className="absolute top-[clamp(8px,1vw,12px)] right-0 bg-gradient-to-r from-[#D39A9F] to-[#4A1015] text-white text-[clamp(7px,1vw,9px)] font-bold px-[clamp(8px,1vw,12px)] py-[clamp(2px,0.5vw,4px)] shadow-sm tracking-widest z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%)' }}>
                            NEW
                        </span>
                    ) : hasReviews && ratingValue >= 4.5 ? (
                        <span className="absolute top-[clamp(8px,1vw,12px)] right-0 bg-gradient-to-r from-[#D39A9F] to-[#4A1015] text-white text-[clamp(7px,1vw,9px)] font-bold px-[clamp(8px,1vw,12px)] py-[clamp(2px,0.5vw,4px)] shadow-sm tracking-widest z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%)' }}>
                            TRENDING
                        </span>
                    ) : null}

                    {/* Collection Tag */}
                    <div className="hidden md:block absolute top-3 left-2 bg-white/95 backdrop-blur-md px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#4A1015] rounded-sm shadow-md z-20 border border-[#4A1015]/10">
                        {collectionLabel}
                    </div>

                    {/* Wishlist Heart */}
                    <button
                        onClick={handleWishlist}
                        className={`absolute bottom-2 right-2 z-20 p-1.5 bg-white/20 hover:bg-white rounded-full backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 shadow-sm ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-white hover:text-red-500'}`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart className={`w-[clamp(14px,2vw,18px)] h-[clamp(14px,2vw,18px)] ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={2} />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1 py-0.5 rounded flex items-center gap-0.5 md:gap-1 shadow-sm z-20 w-fit">
                        <span className="text-[clamp(8px,1vw,10px)] font-bold text-black">{hasReviews ? ratingValue.toFixed(1) : 'New'}</span>
                        <Star className="w-[clamp(6px,1vw,8px)] h-[clamp(6px,1vw,8px)] fill-yellow-400 text-yellow-400" />
                        <span className="text-[clamp(8px,1vw,10px)] text-gray-500 border-l border-gray-300 pl-1 ml-0.5">{hasReviews ? reviewCount : '0'}</span>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-[clamp(8px,1.5vw,16px)] text-left flex flex-col flex-1">
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                        <span className={`text-black font-bold text-[clamp(10px,1.5vw,14px)]`}>
                            {variantCount > 1 ? `From ${currencyText(fromPrice)}` : currencyText(product.price || 0)}
                        </span>
                        {effectiveOriginalPrice > effectivePrice && (
                            <span className="text-gray-400 line-through text-[clamp(8px,1.2vw,11px)]">{currencyText(effectiveOriginalPrice)}</span>
                        )}
                    </div>

                    {variantCount > 1 && (
                        <div className="text-[clamp(8px,1vw,10px)] uppercase tracking-[0.1em] text-[#D39A9F] font-bold mb-0.5">
                            {variantCount} Variants
                        </div>
                    )}

                    <h3 className={`text-black font-serif text-[clamp(10px,1.5vw,14px)] font-medium leading-tight mb-1 line-clamp-1`}>
                        {product.name}
                    </h3>

                    {isWishlistPage ? (
                        <div className="text-[clamp(8px,1vw,10px)] font-bold text-gray-400 uppercase tracking-widest mt-auto pb-1">
                            Wishlist
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="text-[clamp(8px,1vw,10px)] font-bold text-[#D39A9F] uppercase tracking-widest hover:text-[#4A1015] transition-colors flex items-center gap-1 mt-auto pb-1"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/product/${product.id}#care`);
                            }}
                        >
                            <span>Caring Tips</span>
                            <div className="w-1 h-1 rounded-full bg-[#D39A9F]" />
                        </button>
                    )}
                </div>

                {/* Premium Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-[#D39A9F] to-[#4A1015] text-white py-1.5 md:py-2 text-[8px] md:text-[10px] font-bold hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-[0.2em] mt-auto"
                >
                    Add to Cart
                </button>
            </Link>
        </>
    );
};

export default ProductCard;
