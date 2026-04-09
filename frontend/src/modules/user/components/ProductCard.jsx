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

            <Link to={`/product/${product.id}`} className="group relative w-full flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#FBFBFB] rounded-2xl">
                    {primaryImage ? (
                        <>
                            <img
                                src={primaryImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                            />
                            {secondaryImage && (
                                <img
                                    src={secondaryImage}
                                    alt={`${product.name} detail`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[1.2s] ease-in-out"
                                />
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs font-medium uppercase tracking-widest">
                            No Image
                        </div>
                    )}

                    {/* Minimal Heart Icon */}
                    <button
                        onClick={handleWishlist}
                        className={`absolute top-5 right-5 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${isWishlisted ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/80 text-zinc-400 hover:text-rose-500 shadow-sm'}`}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Simplified Info Section */}
                <div className="p-4 pb-6 text-center flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1.5">
                        {metalLabel} {categoryLabel}
                    </span>
                    <h3 className="text-zinc-800 font-serif text-base md:text-lg mb-1.5 line-clamp-1 group-hover:text-[#7A2E3A] transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-900 font-bold text-sm">
                            {currencyText(effectivePrice)}
                        </span>
                        {effectiveOriginalPrice > effectivePrice && (
                            <span className="text-zinc-300 line-through text-xs">{currencyText(effectiveOriginalPrice)}</span>
                        )}
                    </div>
                    
                    {/* Hover Reveal: Quick Add or View Link */}
                    <div className="mt-2.5 overflow-hidden h-0 group-hover:h-6 transition-all duration-500">
                        <button 
                            onClick={handleAddToCart}
                            className="text-[10px] font-bold uppercase tracking-widest text-[#7A2E3A] hover:underline"
                        >
                            Quick Add to Bag
                        </button>
                    </div>
                </div>
            </Link>

        </>
    );
};

export default ProductCard;
