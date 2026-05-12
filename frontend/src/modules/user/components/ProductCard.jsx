import React, { useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import latestRing from '@assets/latest_drop_ring.png';
import latestBracelet from '@assets/latest_drop_bracelet.png';
import latestNecklace from '@assets/latest_drop_necklace.png';
import latestEarrings from '@assets/latest_drop_earrings.png';
import newAnklets from '@assets/new_launch_anklets.png';

// Import high-end generated product shots for missing DB images
import premiumRingProduct from '@assets/premium_ring_product.png';
import premiumBraceletProduct from '@assets/premium_bracelet_product.png';
import premiumPendantProduct from '@assets/premium_pendant_product.png';
import premiumNecklaceProduct from '@assets/premium_necklace_product.png';

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

const ProductCard = ({ product, isWishlistPage = false, requireLogin = false, loginSource = 'men' }) => {
    const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useShop();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [flying, setFlying] = useState(false);
    const [flyingType, setFlyingType] = useState('cart'); // 'cart' or 'heart'
    const currencyText = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
    const isWishlisted = safeWishlist.some(item => (item.id || item._id) === (product.id || product._id));

    // Dynamic Image Resolution
    const productImages = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    const variantImages = Array.isArray(product.variants)
        ? product.variants.flatMap((v) => (Array.isArray(v?.variantImages) ? v.variantImages : [])).filter(Boolean)
        : [];

    const dbImages = productImages.length > 0 ? productImages : variantImages;

    const resolvePrimaryImage = () => {
        if (dbImages[0]) return dbImages[0];
        const categoryData = product.category;
        const categoryName = (typeof categoryData === 'object' ? categoryData?.name : categoryData) || '';
        const searchStr = String(categoryName + ' ' + (product.name || '')).toLowerCase();
        if (searchStr.includes('ring')) return fallbackProductMap.ring;
        if (searchStr.includes('necklace') || searchStr.includes('choker') || searchStr.includes('set')) return fallbackProductMap.necklace;
        if (searchStr.includes('pendant') || searchStr.includes('chain')) return fallbackProductMap.pendant;
        if (searchStr.includes('bracelet')) return fallbackProductMap.bracelet;
        return null;
    };

    const primaryImage = resolvePrimaryImage();

    const resolveSecondaryImage = () => {
        if (productImages.length >= 2) return productImages[1];
        if (productImages.length === 0) {
            const variantHover = variantImages.find((img) => img && img !== primaryImage);
            if (variantHover) return variantHover;
        }
        if (!dbImages[0]) {
            const categoryData = product.category;
            const categoryName = (typeof categoryData === 'object' ? categoryData?.name : categoryData) || '';
            const searchStr = String(categoryName + ' ' + (product.name || '')).toLowerCase();
            if (searchStr.includes('ring')) return fallbackModelMap.ring;
            if (searchStr.includes('necklace') || searchStr.includes('choker') || searchStr.includes('set')) return fallbackModelMap.pendant;
            if (searchStr.includes('pendant') || searchStr.includes('chain')) return fallbackModelMap.pendant;
            if (searchStr.includes('earring')) return fallbackModelMap.earring;
            if (searchStr.includes('bracelet')) return fallbackModelMap.bracelet;
            if (searchStr.includes('anklet')) return fallbackModelMap.anklet;
        }
        return null;
    };
    const secondaryImage = resolveSecondaryImage();

    const variantPrices = (product.variants || []).map(v => Number(v.price)).filter(v => !Number.isNaN(v) && v > 0);
    const variantOriginalPrices = (product.variants || []).map(v => Number(v.mrp)).filter(v => !Number.isNaN(v) && v > 0);
    const variantCount = (product.variants || []).length;
    const fromPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price || 0);
    const fromOriginalPrice = variantOriginalPrices.length > 0 ? Math.max(...variantOriginalPrices) : Number(product.originalPrice || 0);
    const effectivePrice = variantCount > 1 ? fromPrice : Number(product.price || 0);
    const effectiveOriginalPrice = variantCount > 1 ? fromOriginalPrice : Number(product.originalPrice || 0);

    const reviewCount = Number(product.reviewCount ?? product.reviews ?? 0);

    const handleProductOpen = () => {
        navigate(`/product/${product.id || product._id}`);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.status === 'Draft' || product.active === false) {
            toast.error("This product is currently unavailable");
            return;
        }
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
            removeFromWishlist(product.id || product._id);
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

            <div className="group/card relative w-full flex flex-col bg-white overflow-hidden cursor-pointer" onClick={handleProductOpen}>
                <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-none mb-3">
                    {primaryImage ? (
                        <>
                            <img
                                src={primaryImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover/card:scale-105"
                            />
                            {secondaryImage && (
                                <img
                                    src={secondaryImage}
                                    alt={`${product.name} detail`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-[1.2s] ease-in-out"
                                />
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px] uppercase tracking-widest font-bold">
                            Sands Ornament
                        </div>
                    )}

                    {(product.isTrending || product.tags?.isTrending) && (
                        <div className="absolute top-0 left-0 bg-[#E89BA8] text-white text-[9px] font-bold px-2 py-1 z-10 uppercase tracking-widest">
                            Bestseller
                        </div>
                    )}

                    <button
                        onClick={handleWishlist}
                        className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all transform hover:scale-110 ${isWishlisted ? 'text-[#8E2B45]' : 'text-gray-400 hover:text-rose-500'}`}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute bottom-2 left-2 z-10 bg-white/95 px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-800">{product.rating || 4.5}</span>
                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                        <div className="w-px h-2.5 bg-gray-300 mx-0.5" />
                        <span className="text-[10px] text-gray-500">{reviewCount || 0}</span>
                    </div>
                </div>

                <div className="flex flex-col h-[115px] px-0">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[15px] font-bold text-gray-900">{currencyText(effectivePrice)}</span>
                        {effectiveOriginalPrice > effectivePrice && (
                            <span className="text-[12px] text-gray-400 line-through font-medium">{currencyText(effectiveOriginalPrice)}</span>
                        )}
                    </div>
                    
                    <h3 className="text-[12px] text-gray-700 line-clamp-1 h-[18px] group-hover/card:text-black transition-colors uppercase tracking-tight font-medium overflow-hidden mb-1">
                        {product.name}
                    </h3>

                    <div className="h-[15px] mb-2">
                        {(product.priceDrop || (effectiveOriginalPrice > effectivePrice)) && (
                            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                                PRICE DROP!
                            </p>
                        )}
                    </div>
                    
                    <div className="mt-auto">
                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-[#FFD9E0] text-[#8E2B45] font-bold text-[11px] py-2.5 rounded-none hover:bg-[#ffc2cd] transition-all duration-300 uppercase tracking-widest"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductCard;
