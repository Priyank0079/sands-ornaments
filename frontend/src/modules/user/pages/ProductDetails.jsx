import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

import { Heart, ShoppingBag, Star, Share2, Plus, Minus, Truck, ShieldCheck, Smile, Gift, ChevronDown, SlidersHorizontal, X, Camera, Check, ArrowLeft, ArrowRight, Droplets, Sparkles, Play, Globe, Zap, Users } from 'lucide-react';
// Product video is backend-driven (optional) via `product.videoUrl`.
import { useAnalytics } from '../../../hooks/useAnalytics';
import Loader from '../../shared/components/Loader';

// Import model shots (angle 2) for maximum hover impact
import latestRing from '@assets/latest_drop_ring.png';
import latestBracelet from '@assets/latest_drop_bracelet.png';
import latestNecklace from '@assets/latest_drop_necklace.png';
import latestEarrings from '@assets/latest_drop_earrings.png';
import newAnklets from '@assets/new_launch_anklets.png';


const fallbackModelMap = {
    ring: latestRing,
    pendant: latestNecklace,
    earring: latestEarrings,
    bracelet: latestBracelet,
    anklet: newAnklets
};

const isImageMedia = (src = '') => /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(String(src));

const AccordionItem = ({ title, children, isOpen, onClick }) => (
    <div className="border-b border-[#EBCDD0]/50">
        <button
            className="w-full py-5 flex items-center justify-center md:justify-between text-center md:text-left focus:outline-none group relative"
            onClick={onClick}
        >
            <span className={`font-sans text-lg font-semibold transition-colors ${isOpen ? 'text-black' : 'text-gray-800 group-hover:text-black'}`}>
                {title}
            </span>
            <span className={`md:static absolute right-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-[#D39A9F]' : 'text-gray-400 group-hover:text-[#D39A9F]'}`} />
            </span>
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
        >
            <div className="text-sm text-black leading-relaxed font-sans text-center md:text-left">
                {children}
            </div>
        </div>
    </div>
);

const ProductDetails = () => {
    const { id } = useParams();
    const { track } = useAnalytics();
    const navigate = useNavigate();
    const { addToCart, addToWishlist, removeFromWishlist, wishlist, products, isLoading, pincode, updatePincode } = useShop();
    const { user } = useAuth();
    const [localPincode, setLocalPincode] = useState(pincode || '');

    useEffect(() => {
        setLocalPincode(pincode);
    }, [pincode]);

    const catalogueProduct = useMemo(() => (products || []).find(p => String(p.id || p._id) === String(id)), [products, id]);
    const [detailProduct, setDetailProduct] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Production-safe priority: API detail -> catalogue.
    const product = useMemo(() => {
        return detailProduct || catalogueProduct || null;
    }, [detailProduct, catalogueProduct]);

    useEffect(() => {
        let ignore = false;
        const loadDetail = async () => {
            if (!id) return;
            setDetailLoading(true);
            try {
                const res = await api.get(`public/products/${id}`);
                const data = res.data?.data?.product || res.data?.product;
                if (!ignore && data) {
                    setDetailProduct({
                        ...data,
                        id: data._id || data.id
                    });
                }
            } catch (err) {
                // fall back to catalogue (if already in context)
                if (!ignore) setDetailProduct(null);
            } finally {
                if (!ignore) setDetailLoading(false);
            }
        };
        loadDetail();
        return () => {
            ignore = true;
        };
    }, [id]);

    useEffect(() => {
        if (product) {
            track('product_view', { productId: product._id || product.id, name: product.name });
            const materialLower = String(product?.material || product?.metal || '').trim().toLowerCase();
            const suffix = materialLower === 'gold'
                ? 'Gold Jewellery'
                : materialLower === 'silver'
                    ? 'Silver Jewellery'
                    : 'Jewellery';
            document.title = `${product.name} | Sands Ornaments - ${suffix}`;
        }
    }, [product, track]);

    useEffect(() => {
        const loadReviews = async () => {
            const productId = product?.id || product?._id;
            if (!productId) return;
            try {
                const res = await api.get('public/reviews', { params: { productId } });
                const list = res.data?.data?.reviews || res.data?.reviews || [];
                setReviews(list.map(r => ({
                    id: r._id,
                    name: r.userId?.name || 'Customer',
                    date: new Date(r.createdAt).toLocaleDateString('en-GB'),
                    rating: r.rating || 0,
                    title: r.title || 'Review',
                    comment: r.body || ''
                })));
            } catch (err) {
                console.error("Failed to load reviews", err);
            }
        };
        loadReviews();
    }, [product?.id, product?._id]);

    // State for Animations
    const [flying, setFlying] = useState(false);
    const [flyingType, setFlyingType] = useState('cart');

    // State for UI Sections
    const [openSection, setOpenSection] = useState('description');
    const [activeTab, setActiveTab] = useState('related');
    const [activeDetailTab, setActiveDetailTab] = useState('details');

    // State for Reviews
    const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
    const [reviewStep, setReviewStep] = useState(1);
    const [isReviewFilterOpen, setIsReviewFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Featured');
    const [rating, setRating] = useState(0);

    const [reviews, setReviews] = useState([]);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [isLabGrownModalOpen, setIsLabGrownModalOpen] = useState(false);
    const sortedReviews = useMemo(() => {
        const parseReviewDate = (value) => {
            if (!value) return 0;
            const [day, month, year] = String(value).split('/');
            return new Date(`${year}-${month}-${day}`).getTime() || 0;
        };

        const list = [...reviews];
        if (sortBy === 'Newest') return list.sort((a, b) => parseReviewDate(b.date) - parseReviewDate(a.date));
        if (sortBy === 'Highest Ratings') return list.sort((a, b) => b.rating - a.rating);
        if (sortBy === 'Lowest Ratings') return list.sort((a, b) => a.rating - b.rating);
        return list.sort((a, b) => (b.rating - a.rating) || (parseReviewDate(b.date) - parseReviewDate(a.date)));
    }, [reviews, sortBy]);

    const handleReviewSubmit = async () => {
        if (!reviewTitle.trim() && !reviewComment.trim() && rating === 0) return;
        if (!user) {
            const redirectPath = `${window.location.pathname}${window.location.search}`;
            toast.error('Please login to write a review');
            navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
            return;
        }

        const productId = product?.id || product?._id;
        if (!productId) return;

        try {
            const res = await api.post('public/reviews', {
                productId,
                rating: rating || 5,
                title: reviewTitle.trim() || 'Review',
                body: reviewComment.trim() || 'No comment provided.'
            });
            if (res.data?.success) {
                toast.success(res.data.message || 'Review submitted for approval');
                setIsWriteReviewOpen(false);
                setReviewTitle('');
                setReviewComment('');
                setRating(0);
                setReviewStep(1);
            } else {
                toast.error(res.data?.message || 'Unable to submit review');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Unable to submit review');
        }
    };



    // Image Gallery State
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVariantId, setSelectedVariantId] = useState(null);

    useEffect(() => {
        if (product) {
            const firstVariant = product.variants?.[0];
            setSelectedVariantId(firstVariant?.id || firstVariant?._id || null);
            // Defer image selection to the unified galleryImages logic below (variant images > product images).
            setSelectedImage(null);
        }
        setOpenSection(window.location.hash === '#care' ? 'care' : 'description'); // Reset sections
    }, [product, id]);

    useEffect(() => {
        if (window.location.hash === '#care' && product) {
            setOpenSection('care');
            const el = document.getElementById('care-guide-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [product]);

    const selectedVariant = product?.variants?.find(v => String(v.id || v._id) === String(selectedVariantId)) || product?.variants?.[0];
    const variantPrice = selectedVariant?.price ?? product?.price;
    const variantMrp = selectedVariant?.mrp ?? product?.originalPrice;
    const variantDiscount = variantMrp > variantPrice ? Math.round(((variantMrp - variantPrice) / variantMrp) * 100) : 0;
    const selectedVariantStock = Number(selectedVariant?.stock);
    const availableStock = Number.isFinite(selectedVariantStock) ? Math.max(0, selectedVariantStock) : null;
    const canAddToCart = availableStock === null || availableStock > 0;

    const galleryImages = useMemo(() => {
        const productImages = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
        const variantImages = Array.isArray(selectedVariant?.variantImages) ? selectedVariant.variantImages.filter(Boolean) : [];
        const legacy = product?.image ? [product.image] : [];

        const chosen = variantImages.length > 0
            ? variantImages
            : (productImages.length > 0 ? productImages : legacy);

        // Keep order, remove duplicates.
        const seen = new Set();
        return chosen.filter((img) => {
            if (!img) return false;
            if (seen.has(img)) return false;
            seen.add(img);
            return true;
        });
    }, [product, selectedVariant]);

    useEffect(() => {
        if (galleryImages.length === 0) return;
        if (!selectedImage || !galleryImages.includes(selectedImage)) {
            setSelectedImage(galleryImages[0]);
        }
        // Intentionally ignore setSelectedImage in deps.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [galleryImages, selectedVariantId, product?.id, product?._id]);

    // Compute primary image with robust fallback
    const primaryImage = useMemo(() => {
        return selectedImage || galleryImages[0] || null;
    }, [selectedImage, galleryImages]);

    const hoverPaneImage = useMemo(() => {
        const candidate = galleryImages.find((img) => img && img !== primaryImage);
        if (candidate) return candidate;

        const categoryData = product?.category;
        const categoryName = typeof categoryData === 'object' ? categoryData?.name : categoryData;
        const searchStr = String(categoryName || product?.name || '').toLowerCase();

        if (searchStr.includes('ring')) return fallbackModelMap.ring;
        if (searchStr.includes('pendant') || searchStr.includes('necklace')) return fallbackModelMap.pendant;
        if (searchStr.includes('earring')) return fallbackModelMap.earring;
        if (searchStr.includes('bracelet')) return fallbackModelMap.bracelet;
        if (searchStr.includes('anklet')) return fallbackModelMap.anklet;
        return null;
    }, [galleryImages, primaryImage, product]);

    const reviewCount = product?.reviewCount ?? reviews.length ?? 0;
    const averageRating = Number(product?.rating || 0);
    const hasReviews = reviewCount > 0 && averageRating > 0;

    const pricingBreakdown = {
        metalPrice: selectedVariant?.metalPrice ?? 0,
        makingCharge: selectedVariant?.makingCharge ?? 0,
        diamondPrice: selectedVariant?.diamondPrice ?? 0,
        gst: selectedVariant?.gst ?? 0,
        finalPrice: selectedVariant?.finalPrice ?? variantPrice ?? 0
    };
    const selectedVariantWeight = selectedVariant?.weight ?? product?.weight ?? 0;
    const selectedVariantWeightUnit = selectedVariant?.weightUnit || product?.weightUnit || '';
    const pricingSubtotal = Number(pricingBreakdown.metalPrice || 0) + Number(pricingBreakdown.makingCharge || 0) + Number(pricingBreakdown.diamondPrice || 0);
    const gstPercent = pricingSubtotal > 0 ? Math.round((Number(pricingBreakdown.gst || 0) / pricingSubtotal) * 10000) / 100 : 0;
    const supplierName = product?.sellerId?.shopName || product?.supplierInfo || product?.brand || '';

    const currencyText = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
    const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

    // State for Size Selection


    // Handlers for Animation
    const handleAddToCart = () => {
        if (!canAddToCart) {
            toast.error("This variant is out of stock");
            return;
        }

        // Add to cart with specific size
        setFlyingType('cart');
        setFlying(true);

        // Create a unique ID for this specific size variant so it doesn't merge with other sizes
        // Pass 'selectedSize' so the Cart component can display it
        addToCart({
            ...product,
            selectedVariant: product?.variants?.find(v => String(v.id || v._id) === String(selectedVariantId))
        });

        setTimeout(() => {
            setFlying(false);
            navigate('/cart');
        }, 800);
    };

    const handleWishlist = () => {
        if (!isWishlisted) {
            setFlyingType('heart');
            setFlying(true);
            addToWishlist(product);
            setTimeout(() => {
                setFlying(false);
                navigate('/wishlist');
            }, 800);
        } else {
            removeFromWishlist(product.id);
        }
    };


    if (isLoading || detailLoading) {
        return <Loader />;
    }

    if (!product) {
        return (
            <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-2xl font-serif text-black mb-2">Product Not Found</h3>
                <p className="text-gray-600 mb-8 max-w-md">The jewellery piece you are looking for might have been moved or is no longer available.</p>
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#D39A9F] transition-colors"
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    // Derived State
    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
    const isWishlisted = safeWishlist.some(item => item.id === product?.id);

    const currentVariant = selectedVariant || product?.variants?.[0] || {};
    const hasDiamonds = !!(product?.diamondWeight || product?.diamondCount || currentVariant?.diamondWeight || currentVariant?.diamondCount || Number(currentVariant?.diamondPrice || 0) > 0);
    const diamondType = product?.diamondType || currentVariant?.diamondType || (hasDiamonds ? 'Natural' : 'None');
    const isLabGrown = String(diamondType).toLowerCase().includes('lab_grown');

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="bg-white min-h-screen py-8 pb-24 md:pb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both selection:bg-[#D39A9F] selection:text-white">
            {/* Back Button */}
            <div className="container mx-auto px-4 md:px-6 mb-6 md:mb-10 pt-2 lg:pt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-black hover:text-[#9C5B61] transition-all group font-bold uppercase tracking-widest text-[10px] md:text-xs"
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:-translate-x-1 transition-transform">
                        <ArrowLeft className="w-4 h-4 md:w-5 h-5 text-gray-500" />
                    </div>
                    <span>Go Back</span>
                </button>
            </div>
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
                    className={`fixed z-[9999] w-64 h-64 object-cover shadow-2xl pointer-events-none border-4 border-white ${flyingType === 'cart' ? 'animate-fly-cart' : 'animate-fly-heart'}`}
                    style={{ left: '50%', top: '50%' }}
                />
            )}

            <div className="container mx-auto px-4 md:px-6">
                {/* STICKY CENTRE ACTION BAR - Requested by USER (Theme Rewritten) */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] hidden md:flex pointer-events-none w-full max-w-fit px-4">
                    <div className="pointer-events-auto flex items-center bg-white border border-gray-100 rounded-full p-1.5 shadow-md transition-all animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {/* Price Section */}
                        <div className="flex flex-col items-start px-6 border-r border-gray-100">
                            <span className="text-[9px] text-gray-400 font-medium uppercase tracking-widest mb-0.5">Price</span>
                            <span className="text-xl font-semibold text-gray-900 tracking-tight">
                                {currencyText(variantPrice)}
                            </span>
                        </div>

                        {/* Weight Selector Pill */}
                        <div className="px-6 min-w-[160px]">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full cursor-pointer group relative">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                                <div className="flex-1 flex items-center gap-1.5 text-[13px] text-gray-600">
                                    <span className="text-gray-400 font-medium">Size:</span>
                                    <select
                                        value={selectedVariantId}
                                        onChange={(e) => setSelectedVariantId(e.target.value)}
                                        className="bg-transparent border-none outline-none font-medium text-black cursor-pointer appearance-none pr-6 relative z-10"
                                    >
                                        {product.variants?.map(v => (
                                            <option key={v.id || v._id} value={v.id || v._id}>
                                                {v.weight} {v.weightUnit || 'g'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-4" />
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!canAddToCart}
                            className={`px-8 py-3 rounded-full font-medium text-[10px] tracking-widest uppercase transition-all active:scale-95 ${canAddToCart ? 'bg-[#8E2B45] hover:bg-[#5B1E26] text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                            {canAddToCart ? 'Add to Bag' : 'Out of Stock'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Left: Product Lookbook (Split: Video & Image) */}
                    <div className="relative space-y-4">
                        <div className="h-[400px] lg:h-[520px] w-full bg-white rounded-2xl overflow-hidden shadow-sm relative flex flex-col md:flex-row gap-[1px] border border-gray-100">
                            {/* Video Pane (optional, product-specific) */}
                            <div className="w-full md:w-1/2 relative h-1/2 md:h-full group overflow-hidden border-r border-white/10 bg-black">
                                {product?.videoUrl ? (
                                    isImageMedia(product.videoUrl) ? (
                                        <>
                                            <img
                                                src={product.videoUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />
                                        </>
                                    ) : (
                                        <>
                                            <video
                                                src={product.videoUrl}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                controls
                                                preload="auto"
                                                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                                onError={(e) => {
                                                    console.error("Product video playback failed:", e);
                                                    // Optional: Hide the video container or show a fallback if needed
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors pointer-events-none" />
                                        </>
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#111]">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">No product video</p>
                                    </div>
                                )}

                                {/* Experience Sticker Layer (Subtle) */}
                                <div className="absolute bottom-4 right-4 z-30 scale-75 md:scale-[0.85]">
                                    <div className="relative w-24 h-24 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <path id="circlePathSmall" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                                            <text className="text-[9px] font-bold tracking-[0.2em] uppercase fill-white/80">
                                                <textPath xlinkHref="#circlePathSmall">The Lookbook • Sands Royal • </textPath>
                                            </text>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center animate-none">
                                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                                <Play className="w-3 h-3 text-white fill-current translate-x-[1px]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Pane - CLEAN IMAGE SWAP (No Zoom) */}
                            <div className="w-full md:w-1/2 relative h-1/2 md:h-full group overflow-hidden bg-[#F7F2F3]">
                                {primaryImage ? (
                                    <>
                                        {/* Main State Image (Thumbnail selected or default) */}
                                        <img
                                            src={primaryImage}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover z-0"
                                        />

                                        {/* Hover Image (2nd gallery image when available; otherwise model fallback) */}
                                        {hoverPaneImage ? (
                                            <img
                                                src={hoverPaneImage}
                                                alt={`${product.name} look`}
                                                className="absolute inset-0 w-full h-full object-cover z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms] ease-in-out"
                                            />
                                        ) : null}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#B88B90] text-[10px] font-bold uppercase tracking-widest">
                                        Pure Silver
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                                    <button className="bg-white/90 p-2 rounded-full shadow-md hover:bg-[#D39A9F] hover:text-white text-black transition-all">
                                        <Share2 className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Wishlist Button Overlay */}
                            <div className="absolute top-4 left-4 z-20">
                                <button
                                    onClick={handleWishlist}
                                    className={`p-3 rounded-full shadow-lg transition-all active:scale-90 ${isWishlisted ? 'bg-red-50 text-red-500 shadow-red-100' : 'bg-white/90 text-black hover:bg-[#D39A9F] hover:text-white'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnails Row */}
                        {galleryImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide justify-center">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all shadow-sm ${selectedImage === img ? 'border-[#D39A9F] ring-1 ring-[#D39A9F]' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        {selectedImage === img && <div className="absolute inset-0 bg-black/10" />}
                                    </button>
                                ))}
                            </div>
                        )}


                    </div>

                    {/* JEWELLERY DETAILS TABBED SECTION - Moved to center below product area */}
                    <div className="h-[400px] lg:h-[520px] w-full bg-white rounded-[2rem] border border-gray-100 p-6 md:p-10 shadow-sm relative flex flex-col">
                        <div className="flex-1 flex flex-col justify-start pt-4 overflow-y-auto no-scrollbar">
                            <h2 className="text-xl font-bold text-center text-gray-900 mb-6 tracking-tight">Jewellery Details</h2>

                            {/* Tab Switcher */}
                            <div className="bg-white border border-gray-100 rounded-full p-1 grid grid-cols-2 mt-4 mb-10 max-w-[540px] mx-auto shadow-md">
                                <button
                                    onClick={() => setActiveDetailTab('details')}
                                    className={`py-3 rounded-full text-[13px] font-medium transition-all duration-500 whitespace-nowrap px-10 ${activeDetailTab === 'details' ? 'bg-[#8E2B45] text-white shadow-lg' : 'text-gray-900 hover:text-[#8E2B45]'}`}
                                >
                                    Product Details
                                </button>
                                <button
                                    onClick={() => setActiveDetailTab('price')}
                                    className={`py-3 rounded-full text-[13px] font-medium transition-all duration-500 whitespace-nowrap px-10 ${activeDetailTab === 'price' ? 'bg-[#8E2B45] text-white shadow-lg' : 'text-gray-900 hover:text-[#8E2B45]'}`}
                                >
                                    Price Breakup
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {activeDetailTab === 'details' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {hasDiamonds && (
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-[#D39A9F]/10 flex items-center justify-center mb-6">
                                                    <Sparkles className="w-6 h-6 text-[#D39A9F]" />
                                                </div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">Diamond & Setting</h4>
                                                <div className="grid grid-cols-2 gap-y-8 gap-x-12 w-full">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Type</span>
                                                        <span className="text-sm font-semibold text-gray-900 block capitalize">{String(diamondType).replace('_', ' ')}</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Weight</span>
                                                        <span className="text-sm font-semibold text-gray-900 block">{product.diamondWeight || currentVariant?.diamondWeight || '---'} cts</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Diamonds</span>
                                                        <span className="text-sm font-semibold text-gray-900 block">{product.diamondCount || currentVariant?.diamondCount || '---'}</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Clarity</span>
                                                        <span className="text-sm font-semibold text-gray-900 block">{product.diamondClarity || currentVariant?.diamondClarity || '---'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className={`${hasDiamonds ? '' : 'md:col-span-2 max-w-lg mx-auto w-full'} bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center`}>
                                            <div className="w-12 h-12 rounded-full bg-[#9C5B61]/10 flex items-center justify-center mb-6">
                                                <ShieldCheck className="w-6 h-6 text-[#9C5B61]" />
                                            </div>
                                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">Metal & Authentication</h4>
                                            <div className="grid grid-cols-2 gap-y-8 gap-x-12 w-full">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Metal</span>
                                                    <span className="text-sm font-semibold text-gray-900 block">{product.material || product.metal || '925 Silver'}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Purity</span>
                                                    <span className="text-sm font-semibold text-gray-900 block">{product.silverCategory || product.purity || '---'}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Weight</span>
                                                    <span className="text-sm font-semibold text-gray-900 block">{selectedVariantWeight || product.weight || '---'} {selectedVariantWeightUnit || product.weightUnit || 'g'}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Certificate</span>
                                                    <span className="text-sm font-semibold text-emerald-700 block">{product.certificate || 'Sands Authenticated'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-2xl mx-auto space-y-6">
                                        <div className="grid grid-cols-1 gap-4 text-sm">
                                            {[
                                                { label: 'Metal Price', value: pricingBreakdown.metalPrice },
                                                { label: 'Making Charge', value: pricingBreakdown.makingCharge },
                                                { label: 'Diamond Price', value: pricingBreakdown.diamondPrice },
                                                { label: `GST (${gstPercent}%)`, value: pricingBreakdown.gst }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{item.label}</span>
                                                    <span className="font-semibold text-gray-900 text-sm">{currencyText(item.value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-8">
                                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Total Price</span>
                                            <span className="text-2xl font-bold text-gray-900">{currencyText(pricingBreakdown.finalPrice || variantPrice || 0)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Product Info */}
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
                                {currencyText(variantPrice)}
                            </span>
                            {variantMrp > variantPrice && (
                                <div className="flex items-center gap-2">
                                    <span className="text-base md:text-lg text-gray-300 line-through font-medium">
                                        {currencyText(variantMrp)}
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

                            <div className="flex items-center justify-center gap-8 text-[9px] font-bold uppercase tracking-widest text-gray-400 opacity-60">
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Authentic</span>
                                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-blue-500" /> Free Global Shipping</span>
                            </div>
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

            {/* Lab Grown Diamond Info Link - Integrated more smoothly */}
            {isLabGrown && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setIsLabGrownModalOpen(true)}
                        className="group flex items-center gap-4 bg-emerald-50/30 border border-emerald-100/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all px-8 py-4 rounded-2xl"
                    >
                        <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-900 uppercase tracking-[0.15em] border-b border-emerald-200 pb-0.5">
                            Conscious Luxury: Lab Grown Diamond Guide
                        </span>
                    </button>
                </div>
            )}

            {/* Mobile Sticky Bottom Action Bar - Always functional */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 z-[150] md:hidden flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pb-safe animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col justify-center px-2">
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Total</span>
                    <span className="text-lg font-bold text-black tracking-tight">{currencyText(variantPrice)}</span>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className={`flex-1 rounded-xl h-11 font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-xl ${canAddToCart
                            ? 'bg-[#8E2B45] text-white shadow-[#8E2B45]/20 hover:bg-[#5B1E26]'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {canAddToCart ? (
                        <>
                            <ShoppingBag className="w-4 h-4" />
                            Add to Bag
                        </>
                    ) : 'Out of Stock'}
                </button>
            </div>

            <style>
                {`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 2s infinite;
                    }
                    @media (max-width: 768px) {
                        .whatsapp-floating {
                            bottom: 90px !important;
                        }
                    }
                `}
            </style>

            {/* CHECK AVAILABILITY SECTION - Ultra Compact */}
            <div className="container mx-auto px-4 mt-4 mb-10 max-w-4xl">
                <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col md:flex-row items-center gap-4 shadow-sm">
                    <div className="flex items-center gap-2 pl-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-500 hidden lg:block whitespace-nowrap">Check Delivery</span>
                    </div>

                    <div className="flex w-full md:max-w-xs gap-1.5 bg-gray-50 rounded-lg p-1">
                        <input
                            type="text"
                            placeholder="Enter Pincode"
                            value={localPincode}
                            onChange={(e) => setLocalPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="flex-1 bg-transparent border-none px-3 py-1 text-xs focus:ring-0 transition-all placeholder:text-gray-300 font-medium"
                        />
                        <button
                            onClick={() => {
                                if (localPincode.length === 6) {
                                    updatePincode(localPincode);
                                    toast.success("Pincode applied!");
                                } else {
                                    toast.error("Please enter a 6-digit pincode");
                                }
                            }}
                            className="bg-[#8E2B45] text-white px-4 py-1.5 rounded-md font-medium text-[9px] uppercase tracking-wider hover:bg-[#5B1E26] transition-all"
                        >
                            Check
                        </button>
                    </div>

                    <div className="flex items-center gap-6 md:ml-auto md:border-l md:border-gray-100 md:pl-6 pr-2">
                        {[
                            { icon: <Truck className="w-3.5 h-3.5" />, label: "Fast Shipping" },
                            { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "925 Certified" },
                            { icon: <Gift className="w-3.5 h-3.5" />, label: "Luxury Gift Box" }
                        ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-400">
                                {badge.icon}
                                <span className="text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">{badge.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= LOWER CONTENT SECTION (ACCORDIONS) ================= */}
            <div className="w-full mt-24 border-y border-gray-100 bg-white">
                <div className="max-w-[1440px] mx-auto py-20 px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Left: Product Badges / USP - Clean & Modern */}
                        <div className="lg:col-span-4 space-y-10">
                            <div>
                                <h3 className="text-2xl font-sans font-bold text-black mb-2 flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-[#9C5B61]" />
                                    The Sands Promise
                                </h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Our commitment to excellence</p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 transition-colors group-hover:bg-[#FDF5F6] group-hover:border-[#EBCDD0]/30">
                                        <ShieldCheck className="w-6 h-6 text-[#9C5B61]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-black mb-1">Authentic 925 Silver</h4>
                                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Certified 925 Sterling Silver with official hallmarking on every single piece.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 transition-colors group-hover:bg-[#FDF5F6] group-hover:border-[#EBCDD0]/30">
                                        <Smile className="w-6 h-6 text-[#9C5B61]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-black mb-1">Skin Safe Luxury</h4>
                                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Hypoallergenic, Nickel and Lead-free materials designed for sensitive skin.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 transition-colors group-hover:bg-[#FDF5F6] group-hover:border-[#EBCDD0]/30">
                                        <Gift className="w-6 h-6 text-[#9C5B61]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-black mb-1">Signature Packaging</h4>
                                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Arrives in our signature velvet-lined box, perfect for gifting and safekeeping.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="pt-8 border-t border-gray-50">
                                <div className="bg-[#F8F9FA] rounded-2xl p-6 flex flex-col items-center text-center">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-1">Secure Purchase</span>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">100% Insured Shipping</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Detailed Product Info Accordion - Professional & Minimal */}
                        <div className="lg:col-span-8">
                            <div className="divide-y divide-gray-100">
                                <AccordionItem title="Product Story" isOpen={openSection === 'description'} onClick={() => toggleSection('description')}>
                                    <div className="py-2">
                                        {product.description ? (
                                            <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                                        ) : (
                                            <div className="text-gray-600 font-medium leading-relaxed space-y-4">
                                                <p>Elegance meets craftsmanship in this stunning {product.name}. Handcrafted with precision from 925 Sterling Silver, this piece is designed to be a timeless addition to your collection.</p>
                                                <p>Whether you're dressing up for a special occasion or adding a touch of sparkle to your daily look, this piece is versatile enough to complement any style.</p>
                                            </div>
                                        )}
                                    </div>
                                </AccordionItem>

                                <AccordionItem title="Full Specifications" isOpen={openSection === 'specifications'} onClick={() => toggleSection('specifications')}>
                                    <div className="space-y-8 py-4">
                                        {/* Diamond Section */}
                                        {(hasDiamonds || product.diamondWeight || product.diamondCount) && (
                                            <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100">
                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9C5B61] mb-8 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#9C5B61]" />
                                                    Diamond & Setting
                                                </h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
                                                    {[
                                                        { label: 'Type', value: String(diamondType).replace('_', ' ') || 'Natural' },
                                                        { label: 'Total Weight', value: `${product.diamondWeight || currentVariant?.diamondWeight || '---'} cts` },
                                                        { label: 'Count', value: product.diamondCount || currentVariant?.diamondCount || '---' },
                                                        { label: 'Shape', value: product.diamondShape || currentVariant?.diamondShape || 'Round' },
                                                        { label: 'Color/Clarity', value: product.diamondClarity || currentVariant?.diamondClarity || '---' },
                                                        { label: 'Setting', value: product.diamondSetting || currentVariant?.diamondSetting || 'Prong' }
                                                    ].map((spec, i) => (
                                                        <div key={i} className="space-y-1.5">
                                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{spec.label}</span>
                                                            <span className="text-sm font-bold text-gray-900 block">{spec.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Metal Section */}
                                        <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100">
                                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9C5B61] mb-8 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#9C5B61]" />
                                                Material & Authenticity
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
                                                {[
                                                    { label: 'Metal', value: product.material || product.metal || '925 Silver' },
                                                    { label: 'Purity', value: product.silverCategory || product.purity || '---' },
                                                    { label: 'Weight', value: `${selectedVariantWeight || product.weight || '---'} ${selectedVariantWeightUnit || product.weightUnit || 'g'}` },
                                                    { label: 'Certificate', value: product.certificate || 'Sands Authenticated' },
                                                    { label: 'HUID', value: product.huid || '---' },
                                                    { label: 'Reference', value: selectedVariant?.variantCode || '---' }
                                                ].map((spec, i) => (
                                                    <div key={i} className="space-y-1.5">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{spec.label}</span>
                                                        <span className="text-sm font-bold text-gray-900 block">{spec.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {product.specifications && (
                                            <div className="mt-6 p-6 bg-gray-50/30 rounded-2xl border border-gray-100 prose prose-sm max-w-none text-gray-600 font-medium" dangerouslySetInnerHTML={{ __html: product.specifications }} />
                                        )}
                                    </div>
                                </AccordionItem>

                                <AccordionItem title="Styling & Tips" isOpen={openSection === 'styling'} onClick={() => toggleSection('styling')}>
                                    <div className="py-4">
                                        {product.stylingTips ? (
                                            <div className="prose prose-sm max-w-none text-gray-600 font-medium" dangerouslySetInnerHTML={{ __html: product.stylingTips }} />
                                        ) : (
                                            <p className="text-gray-600 font-medium leading-relaxed">Pair this versatile {product.category || 'jewellery'} with both western and ethnic wear to elevate your look. It's designed to be lightweight enough for daily wear yet sophisticated enough for evening gala events.</p>
                                        )}
                                    </div>
                                </AccordionItem>

                                <AccordionItem title="Care Instructions" isOpen={openSection === 'care'} onClick={() => toggleSection('care')}>
                                    <div className="py-4 space-y-6">
                                        <p className="text-gray-500 font-medium">To maintain the brilliance of your silver jewellery, we recommend:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                { icon: <Droplets className="w-4 h-4" />, title: "Stay Dry", desc: "Remove before showering or swimming" },
                                                { icon: <Sparkles className="w-4 h-4" />, title: "Apply First", desc: "Wear after lotions and perfumes" },
                                                { icon: <ShieldCheck className="w-4 h-4" />, title: "Safe Box", desc: "Store in an airtight container" },
                                                { icon: <Smile className="w-4 h-4" />, title: "Polish", desc: "Use a soft micro-fibre cloth" }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-sm transition-all">
                                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#9C5B61] border border-gray-100">{item.icon}</div>
                                                    <div>
                                                        <h5 className="text-[10px] font-bold text-black uppercase tracking-widest">{item.title}</h5>
                                                        <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </AccordionItem>

                                <AccordionItem title="Shipping & Returns" isOpen={openSection === 'faqs'} onClick={() => toggleSection('faqs')}>
                                    <div className="py-4 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-black uppercase tracking-widest flex items-center gap-2">
                                                    <Truck className="w-4 h-4 text-[#9C5B61]" />
                                                    Free Shipping
                                                </h4>
                                                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">We offer complimentary express shipping worldwide. Domestic orders arrive within 3-5 business days.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-black uppercase tracking-widest flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                    Returns
                                                </h4>
                                                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">7-day hassle-free returns on all unused and authentic products. See our returns policy for details.</p>
                                            </div>
                                        </div>

                                        {product.faqs && product.faqs.length > 0 && (
                                            <div className="pt-6 border-t border-gray-50 space-y-4">
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Common Questions</h4>
                                                {product.faqs.map((faq, idx) => (
                                                    <div key={idx} className="space-y-1">
                                                        <p className="font-bold text-xs text-gray-900">{faq.question}</p>
                                                        <p className="text-[11px] text-gray-500 leading-relaxed">{faq.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </AccordionItem>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STYLE GALLERY - Refined to show always with fallbacks */}
            {galleryImages.length > 0 && (
                <div className="mt-12 mb-20 px-4 max-w-6xl mx-auto">
                    <div className="flex flex-col items-center mb-10">
                        <span className="text-[9px] font-bold text-[#D39A9F] uppercase tracking-[0.4em] mb-2">Style Showcase</span>
                        <h2 className="text-2xl font-display font-bold text-black tracking-tight">Capturing the Brilliance</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 4 }).map((_, idx) => {
                            const img = galleryImages[idx] || galleryImages[0];
                            return (
                                <div
                                    key={idx}
                                    className="aspect-square rounded-[2rem] overflow-hidden border border-gray-100 group cursor-pointer shadow-md hover:shadow-xl transition-all duration-700 relative bg-white"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img
                                        src={img}
                                        alt={`Style Detail ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                                    {/* Subtle Overlay on Hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                            <Sparkles className="w-5 h-5 text-[#D39A9F]" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ================= REORDERED SECTIONS ================= */}

            <div className="mt-4 md:mt-8">
                {/* Exclusive Care Guide Section */}
                <div className="mt-8 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FDF5F6] to-white border border-[#EBCDD0]/30 shadow-sm p-8 md:p-12">
                        {/* Design Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EBCDD0]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D39A9F]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-50" />

                        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
                            <div className="bg-[#D39A9F] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
                                Care Guide
                            </div>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-black tracking-tight leading-tight">
                                Preserve the radiance of your <span className="text-[#D39A9F]">{product.name}</span>
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed font-sans">
                                Our jewelry is crafted with pure 925 sterling silver and premium plating. Follow these simple steps to ensure your pieces remain as stunning as the day you first wore them.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
                            {[
                                {
                                    icon: <Droplets className="w-5 h-5 md:w-6 h-6" />,
                                    title: "Stay Dry",
                                    desc: "Remove before bathing or swimming to prevent tarnishing."
                                },
                                {
                                    icon: <Sparkles className="w-5 h-5 md:w-6 h-6" />,
                                    title: "Last Step",
                                    desc: "Avoid contact with perfumes, makeup, and hairsprays."
                                },
                                {
                                    icon: <ShieldCheck className="w-5 h-5 md:w-6 h-6" />,
                                    title: "Safe Haven",
                                    desc: "Store in individual airtight bags to minimize oxidation."
                                },
                                {
                                    icon: <Smile className="w-5 h-5 md:w-6 h-6" />,
                                    title: "Gentle Clean",
                                    desc: "Regularly wipe with a soft cloth to restore its natural glow."
                                }
                            ].map((card, i) => (
                                <div key={i} className="group bg-white/80 backdrop-blur-sm p-6 rounded-[1.5rem] border border-white shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-2xl bg-[#FDF5F6] flex items-center justify-center text-[#D39A9F] mb-4 group-hover:bg-[#D39A9F] group-hover:text-white transition-colors">
                                        {card.icon}
                                    </div>
                                    <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-2 font-display">{card.title}</h4>
                                    <p className="text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed font-sans">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                <div className="flex gap-4 md:gap-10 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
                    <button
                        className={`pb-4 text-xs md:text-base font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap px-1 ${activeTab === 'related' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setActiveTab('related')}
                    >
                        Related pieces
                        {activeTab === 'related' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-left-2 duration-300"></span>}
                    </button>
                    <button
                        className={`pb-4 text-xs md:text-base font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap px-1 ${activeTab === 'recent' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setActiveTab('recent')}
                    >
                        More to explore
                        {activeTab === 'recent' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-left-2 duration-300"></span>}
                    </button>
                </div>

                {(() => {
                    const relatedList = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
                    const recentList = products.filter(p => p.id !== product.id).reverse().slice(0, 8);
                    const displayList = activeTab === 'related' ? relatedList : recentList;

                    if (displayList.length === 0) {
                        return (
                            <div className="flex flex-col items-center justify-center py-16 px-6 text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                                    <ShoppingBag className="w-8 h-8 opacity-30" />
                                </div>
                                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">No {activeTab} pieces found</p>
                                <p className="text-[11px] text-gray-400 mt-1 max-w-xs text-center">We're updating our collection daily. Check back soon for more exquisite designs.</p>
                            </div>
                        );
                    }

                    return (
                        <div className="flex overflow-x-auto gap-3 md:gap-6 pb-6 snap-x no-scrollbar">
                            {displayList.map((product) => (
                                <div key={product.id} className="min-w-[160px] w-[160px] md:min-w-[280px] md:w-[280px] snap-center">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>

            {/* 2. Reviews Section (Second) - With Filters & Modal */}
            <div className="mt-8 border-t border-gray-200 pt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 relative pb-32 md:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="flex text-[#D39A9F]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 fill-current" />
                            ))}
                        </div>
                        <span className="text-xl font-bold text-black flex items-center gap-1">
                            {hasReviews ? `${reviewCount} Reviews` : 'No reviews yet'}
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </span>
                    </div>
                    <div className="flex gap-3 relative w-full md:w-auto">
                        <button
                            onClick={() => {
                                if (!user) {
                                    const redirectPath = `${window.location.pathname}${window.location.search}`;
                                    toast.error('Please login to write a review');
                                    navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
                                    return;
                                }
                                setIsWriteReviewOpen(true);
                                setReviewStep(1);
                            }}
                            className="flex-1 md:flex-none bg-white border border-black px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                        >
                            Write a review
                        </button>
                        <button
                            onClick={() => setIsReviewFilterOpen(!isReviewFilterOpen)}
                            className={`border border-gray-200 p-4 rounded-xl text-black hover:border-black transition-all duration-300 ${isReviewFilterOpen ? 'bg-black text-white' : 'bg-white shadow-sm'}`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>

                        {/* Filter Dropdown */}
                        {isReviewFilterOpen && (
                            <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 p-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sort Reviews By</span>
                                </div>
                                <div className="space-y-1">
                                    {['Featured', 'Newest', 'Highest Ratings', 'Lowest Ratings'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => { setSortBy(option); setIsReviewFilterOpen(false); }}
                                            className={`w-full text-left px-4 py-3 text-sm rounded-xl flex justify-between items-center transition-colors ${sortBy === option ? 'bg-[#FDF5F6] text-[#9C5B61] font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {option}
                                            {sortBy === option && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {sortedReviews.map((review, idx) => (
                        <div key={idx} className="bg-[#FDFBF7]/30 p-6 md:p-8 rounded-[2rem] border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 font-display">{review.name}</h4>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.date}</span>
                                </div>
                                <div className="flex text-[#D39A9F]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'} `} />
                                    ))}
                                </div>
                            </div>
                            <h5 className="font-bold text-sm text-gray-800 mt-4 leading-tight">{review.title}</h5>
                            <p className="text-gray-600 text-sm mt-2 leading-relaxed font-sans">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Review Modal Overlay */}
            {isWriteReviewOpen && (
                <div className="fixed inset-0 bg-black/50 z-[120] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-2xl md:rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                            <h3 className="font-display font-bold text-lg text-black">Write a Review</h3>
                            <button onClick={() => setIsWriteReviewOpen(false)} className="text-gray-400 hover:text-black bg-white rounded-full p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 md:p-6">
                            <div className="mb-6 rounded-xl border border-[#EBCDD0] bg-[#FDF7F8] px-4 py-3 text-xs md:text-sm text-gray-600">
                                Reviews can be submitted only for delivered purchases and will appear after approval.
                            </div>
                            {/* Step Indicators */}
                            <div className="flex justify-center gap-2 mb-6 md:mb-8">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${reviewStep >= step ? 'bg-black' : 'bg-gray-200'}`}
                                    />
                                ))}
                            </div>

                            {reviewStep === 1 && (
                                <div className="text-center space-y-6">
                                    <h4 className="text-lg md:text-xl font-medium text-gray-800">How would you rate this product?</h4>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className="transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-8 h-8 md:w-10 md:h-10 ${star <= rating ? 'fill-[#D39A9F] text-[#D39A9F]' : 'text-gray-300'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setReviewStep(2)}
                                        className="w-full bg-black text-white py-3.5 rounded-lg font-bold tracking-widest uppercase text-xs md:text-sm hover:bg-[#D39A9F] transition-all mt-4 active:scale-95 shadow-lg shadow-black/5"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {reviewStep === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h4 className="text-lg font-medium text-gray-800 mb-2">Show us your style!</h4>
                                        <p className="text-sm text-gray-500">Upload photos of the product (Optional)</p>
                                    </div>

                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-gray-400 hover:border-[#8D6E63] hover:text-[#8D6E63] transition-colors cursor-pointer bg-gray-50">
                                        <Camera className="w-8 h-8 mb-2" />
                                        <span className="text-sm font-medium">Click to upload photos</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setReviewStep(1)}
                                            className="flex-1 px-4 py-3.5 border border-gray-300 rounded-lg text-gray-600 font-bold tracking-widest uppercase text-xs transition-all hover:bg-gray-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setReviewStep(3)}
                                            className="flex-1 bg-black text-white px-4 py-3.5 rounded-lg font-bold tracking-widest uppercase text-xs md:text-sm hover:bg-[#D39A9F] transition-all active:scale-95 shadow-lg shadow-black/5"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setReviewStep(3)}
                                        className="w-full text-center text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:text-[#5D4037] mt-3 transition-colors"
                                    >
                                        Skip this step
                                    </button>
                                </div>
                            )}

                            {reviewStep === 3 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Review Title</label>
                                        <input
                                            type="text"
                                            value={reviewTitle}
                                            onChange={(e) => setReviewTitle(e.target.value)}
                                            placeholder="Summary of your experience"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-[#8D6E63] focus:border-[#8D6E63] transition-all bg-gray-50/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Your Review</label>
                                        <textarea
                                            rows="4"
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="Tell us what you liked or disliked..."
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-[#8D6E63] focus:border-[#8D6E63] resize-none transition-all bg-gray-50/30"
                                        ></textarea>
                                        <p className="text-[10px] text-gray-400 mt-2 italic px-1">* At least one field (Rating, Title, or Comment) must be provided.</p>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => setReviewStep(2)}
                                            className="flex-1 px-4 py-3.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleReviewSubmit}
                                            disabled={!reviewTitle.trim() && !reviewComment.trim() && rating === 0}
                                            className={`flex-1 text-white px-4 py-3.5 rounded-lg transition-all font-bold tracking-widest uppercase text-xs md:text-sm ${(!reviewTitle.trim() && !reviewComment.trim() && rating === 0) ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-black hover:bg-[#D39A9F] shadow-lg shadow-black/10'}`}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Lab Grown Diamond Information Modal */}
            {isLabGrownModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 bg-[#FEF9F0] border-b border-[#F5E6CC] flex items-center justify-between sticky top-0 z-10">
                            <div className="flex flex-col">
                                <h3 className="font-display font-black text-xl text-[#5D4037] uppercase tracking-tight">All about Lab grown diamonds</h3>
                            </div>
                            <button
                                onClick={() => setIsLabGrownModalOpen(false)}
                                className="bg-white/80 hover:bg-white text-gray-500 hover:text-black rounded-full p-2 shadow-sm transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
                            {/* Definition Section */}
                            <div className="space-y-4">
                                <h4 className="text-2xl font-bold text-gray-900 leading-tight">What are Lab grown diamonds?</h4>
                                <p className="text-gray-600 leading-relaxed text-base font-sans">
                                    <strong className="text-gray-900">Lab grown diamonds</strong>, also known as cultured diamonds, are <strong className="text-gray-900">real diamonds</strong> created in a controlled laboratory environment. They are identical to mined diamonds and share the same physical, chemical, and optical attributes.
                                </p>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D39A9F]/20 flex items-center justify-center mt-0.5 shrink-0">
                                        <Check className="w-3 h-3 text-[#D39A9F]" />
                                    </div>
                                    <p className="text-[13px] text-gray-500 font-medium">Same chemical, physical, and optical attributes as mined diamonds.</p>
                                </div>
                            </div>

                            {/* Why Choose Section */}
                            <div className="space-y-6">
                                <h4 className="text-2xl font-bold text-gray-900 leading-tight">Why Choose Sands Lab-Grown Diamonds?</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { icon: <Droplets className="w-6 h-6" />, title: "Saves Water", value: "408 litres", color: "bg-blue-50 text-blue-500" },
                                        { icon: <Globe className="w-6 h-6" />, title: "Saves Environment", value: "100% Conflict Free", color: "bg-emerald-50 text-emerald-500" },
                                        { icon: <Zap className="w-6 h-6" />, title: "Saves Energy", value: "288 MJ", color: "bg-amber-50 text-amber-500" },
                                        { icon: <Users className="w-6 h-6" />, title: "Saves Human life", value: "Ethically Sourced", color: "bg-rose-50 text-rose-500" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                                            <div className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center mb-4 shadow-inner`}>
                                                {item.icon}
                                            </div>
                                            <h5 className="text-[11px] font-black text-gray-900 uppercase tracking-wider mb-1 leading-tight">{item.title}</h5>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Final Assurance */}
                            <div className="bg-[#FDF5F6] rounded-2xl p-6 border border-[#EBCDD0]/30 flex flex-col md:flex-row items-center gap-6">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-[#EBCDD0]/20">
                                    <Sparkles className="w-10 h-10 text-[#D39A9F]" />
                                </div>
                                <div className="space-y-2">
                                    <h5 className="font-bold text-gray-900">Brilliance without compromise.</h5>
                                    <p className="text-[13px] text-gray-600 leading-relaxed font-sans">
                                        Choosing lab-grown doesn't mean compromising on quality. It means choosing a future that is sustainable, ethical, and equally brilliant.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-white">
                            <button
                                onClick={() => setIsLabGrownModalOpen(false)}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#8E2424] transition-all active:scale-95"
                            >
                                Close & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;


