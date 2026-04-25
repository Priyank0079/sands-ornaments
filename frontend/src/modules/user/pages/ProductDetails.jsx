import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import WhyChooseUs from '../components/WhyChooseUs';
import { Heart, ShoppingBag, Star, Share2, Plus, Minus, Truck, ShieldCheck, Smile, Gift, ChevronDown, SlidersHorizontal, X, Camera, Check, ArrowLeft, ArrowRight, Droplets, Sparkles, Play, Globe, Zap, Users } from 'lucide-react';
import { COLLECTION_MOCK_PRODUCTS } from '../data/mockCollectionData';
// Product video is backend-driven (optional) via `product.videoUrl`.
import Loader from '../../shared/components/Loader';

// Import model shots (angle 2) for maximum hover impact
import latestRing from '@assets/latest_drop_ring.png';
import latestBracelet from '@assets/latest_drop_bracelet.png';
import latestNecklace from '@assets/latest_drop_necklace.png';
import latestEarrings from '@assets/latest_drop_earrings.png';
import newAnklets from '@assets/new_launch_anklets.png';

// Import Men Category Images
import menRings from '@assets/images/men-categories/rings.png';
import menPendants from '@assets/images/men-categories/pendants.png';
import menBracelets from '@assets/images/men-categories/bracelets.png';
import menChains from '@assets/images/men-categories/chains.png';

const fallbackModelMap = {
    ring: latestRing,
    pendant: latestNecklace,
    earring: latestEarrings,
    bracelet: latestBracelet,
    anklet: newAnklets
};

const AccordionItem = ({ title, children, isOpen, onClick }) => (
    <div className="border-b border-[#EBCDD0]/50">
        <button
            className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
            onClick={onClick}
        >
            <span className={`font-sans text-lg font-semibold transition-colors ${isOpen ? 'text-black' : 'text-gray-800 group-hover:text-black'}`}>
                {title}
            </span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-[#D39A9F]' : 'text-gray-400 group-hover:text-[#D39A9F]'}`} />
            </span>
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
        >
            <div className="text-sm text-black leading-relaxed font-sans">
                {children}
            </div>
        </div>
    </div>
);

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, addToWishlist, removeFromWishlist, wishlist, products, isLoading, pincode, updatePincode } = useShop();
    const { user } = useAuth();
    const [localPincode, setLocalPincode] = useState(pincode || '');

    useEffect(() => {
        setLocalPincode(pincode);
    }, [pincode]);

    // Find in mock collection as a fallback (only if real product fetch + catalogue lookup fail).
    const mockProduct = useMemo(() => {
        if (!id) return null;

        // Check for Men's Dummy Products
        const menDummies = {
            'p1': {
                id: 'p1',
                name: "Silver Fibonacci Flow Ring For Him",
                price: 2899,
                originalPrice: 4699,
                image: menRings,
                category: "Rings",
                metal: "925 Sterling Silver",
                purity: "Pure Silver",
                description: "Inspired by the mathematical perfection of nature, the Fibonacci Flow Ring features a continuous, swirling pattern that symbolizes eternal growth and harmony. Hand-finished for a premium mirror polish.",
                specifications: "Material: 925 Sterling Silver<br/>Finish: Hi-Shine Rhodium Plating<br/>Weight: Approx 6.5g<br/>Style: Contemporary Minimalist",
                careTips: "Clean with a dry microfibre cloth.<br/>Avoid contact with perfumes and sweat.<br/>Store in the provided Sands Royal box."
            },
            'p2': {
                id: 'p2',
                name: "Silver Anjaneya Pendant With Box Chain",
                price: 3799,
                originalPrice: 6199,
                image: menPendants,
                category: "Pendants",
                metal: "925 Sterling Silver",
                purity: "Pure Silver",
                description: "A powerful symbol of devotion and strength, the Anjaneya Pendant captures the essence of Lord Hanuman in exquisite detail. Comes with a sturdy silver box chain for a complete look.",
                specifications: "Material: 925 Sterling Silver<br/>Pendant Height: 25mm<br/>Chain Length: 20-22 inches adjustable<br/>Weight: Approx 12g",
                careTips: "Remove before showering.<br/>Store separately to avoid scratches.<br/>Wipe with a soft cloth after wearing."
            },
            'p4': {
                id: 'p4',
                name: "Silver Trooper Bracelet For Him",
                price: 4199,
                originalPrice: 6999,
                image: menBracelets,
                category: "Bracelets",
                metal: "925 Sterling Silver",
                purity: "Pure Silver",
                description: "Bold, rugged, and undeniably masculine. The Trooper Bracelet features heavy-duty links and a secure industrial clasp, designed for the man who leads with confidence.",
                specifications: "Material: 925 Sterling Silver<br/>Link Width: 8mm<br/>Length: 8.5 inches<br/>Weight: Approx 18g",
                careTips: "Rinse with lukewarm water if exposed to salt.<br/>Dry completely before storing.<br/>Keep in an airtight bag when not in use."
            },
            'p5': {
                id: 'p5',
                name: "Silver Statement Link Chain",
                price: 6599,
                originalPrice: 9999,
                image: menChains,
                category: "Chains",
                metal: "925 Sterling Silver",
                purity: "Pure Silver",
                description: "The ultimate statement piece. This classic link chain offers a substantial feel and a brilliant luster that commands attention. A staple for any modern wardrobe.",
                specifications: "Material: 925 Sterling Silver<br/>Thickness: 5mm<br/>Length: 24 inches<br/>Weight: Approx 25g",
                careTips: "Lay flat when storing to avoid kinks.<br/>Professional cleaning recommended every 6 months.<br/>Always put on last after grooming."
            }
        };

        if (menDummies[id]) {
            const found = menDummies[id];
            return {
                ...found,
                images: [found.image],
                variants: [{ id: `${found.id}-v1`, name: 'Standard', weight: '7-25', weightUnit: 'g', price: found.price, mrp: found.originalPrice }],
                brand: 'SANDS ROYAL'
            };
        }

        // Legacy mock catalogue entries (used only as fallback).
        for (const cat in COLLECTION_MOCK_PRODUCTS) {
            const found = COLLECTION_MOCK_PRODUCTS[cat].find(p => p.id === id);
            if (found) {
                return {
                    ...found,
                    image: found.img,
                    images: [found.img],
                    description: found.description || `Experience the luxury of our ${found.name}. Handcrafted to perfection, this ${found.metal} ${found.purity} piece represents the pinnacle of jewellery craftsmanship. Exclusive to Sands Ornaments.`,
                    variants: found.variants || [{ id: `${found.id}-v1`, name: found.purity || 'Standard', price: found.price, mrp: found.price * 1.2 }],
                    category: found.category || found.metal,
                    brand: 'SANDS ROYAL',
                    specifications: `Material: ${found.metal}<br/>Purity: ${found.purity}<br/>Weight: Approx 12g<br/>Certification: Hallmarked`,
                    careTips: `Keep away from moisture.<br/>Store in an airtight container.<br/>Clean with a soft cloth after use.`
                };
            }
        }
        return null;
    }, [id]);

    const catalogueProduct = useMemo(() => (products || []).find(p => String(p.id || p._id) === String(id)), [products, id]);
    const [detailProduct, setDetailProduct] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Production-safe priority: API detail -> catalogue -> mock fallback.
    const product = useMemo(() => {
        return detailProduct || catalogueProduct || mockProduct || null;
    }, [id, mockProduct, detailProduct, catalogueProduct]);

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
                // fall back to catalogue or mock data
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
            const materialLower = String(product?.material || product?.metal || '').trim().toLowerCase();
            const suffix = materialLower === 'gold'
                ? 'Gold Jewellery'
                : materialLower === 'silver'
                    ? 'Silver Jewellery'
                    : 'Jewellery';
            document.title = `${product.name} | Sands Ornaments - ${suffix}`;
        }
    }, [product]);

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
    const isLabGrown = product?.isLabGrown || product?.description?.toLowerCase().includes('lab grown') || id === '69e9eb6ea8370c07631e8161';

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
                    <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-2xl border border-[#D39A9F]/20 rounded-full p-2 pl-10 shadow-[0_30px_80px_rgba(142,36,36,0.15)] transition-all hover:border-[#D39A9F]/40 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        {/* Price Section */}
                        <div className="flex flex-col items-start pr-10 border-r border-[#D39A9F]/10">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Final Amount</span>
                            <span className="text-3xl font-serif text-black tracking-tight">
                                {currencyText(variantPrice)}
                            </span>
                        </div>

                        {/* Weight Selector Pill */}
                        <div className="mx-8 min-w-[200px]">
                            <div className="flex items-center gap-3 bg-[#D39A9F]/5 hover:bg-[#D39A9F]/10 transition-colors px-6 py-3 rounded-full cursor-pointer group relative">
                                <SlidersHorizontal className="w-4 h-4 text-[#D39A9F]" />
                                <div className="flex-1 flex items-center gap-2 text-sm text-gray-800">
                                    <span className="text-gray-400 font-medium">Weight:</span>
                                    <select
                                        value={selectedVariantId}
                                        onChange={(e) => setSelectedVariantId(e.target.value)}
                                        className="bg-transparent border-none outline-none font-bold text-black cursor-pointer appearance-none pr-8 relative z-10"
                                    >
                                        {product.variants?.map(v => (
                                            <option key={v.id || v._id} value={v.id || v._id}>
                                                {v.weight} {v.weightUnit || 'g'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <ChevronDown className="w-4 h-4 text-[#D39A9F]/60 absolute right-6 group-hover:text-black transition-colors" />
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!canAddToCart}
                            className={`px-14 py-5 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-xl active:scale-95 ${canAddToCart ? 'bg-[#8E2424] hover:bg-black text-white shadow-[#8E2424]/20' : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-gray-200'}`}
                        >
                            {canAddToCart ? 'Add to Cart' : 'Out of Stock'}
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
                                    <>
                                        <video 
                                            src={product.videoUrl} 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline
                                            controls
                                            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />
                                    </>
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
                            <div className="flex gap-4 overflow-x-auto pb-2 px-1 scrollbar-hide">
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

                        {/* Style Gallery: show only when product truly has enough distinct images (no duplication). */}
                        {galleryImages.length >= 4 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4">
                                {galleryImages.slice(0, 4).map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="aspect-square rounded-[1.5rem] overflow-hidden border border-gray-100 group cursor-pointer shadow-sm relative"
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img
                                            src={img}
                                            alt={`Style Detail ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.12]"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6 pt-2">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-black mb-2 md:mb-4 leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-4 text-sm px-1">
                                <div className="flex items-center text-[#D39A9F]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'} `} />
                                    ))}
                                    <span className="ml-2 text-gray-500 font-medium">
                                        {hasReviews ? `(${reviewCount} Reviews)` : '(No reviews yet)'}
                                    </span>
                                </div>

                            </div>
                            {supplierName && (
                                <div className="mt-2 text-xs uppercase tracking-widest text-gray-400 font-semibold">
                                    Sold by <span className="text-gray-700 font-bold">{supplierName}</span>
                                </div>
                            )}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {product?.huid && (
                                    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                        HUID: {product.huid}
                                    </span>
                                )}
                                {selectedVariant?.variantCode && (
                                    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                        Variant Code: {selectedVariant.variantCode}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="border-b border-gray-100 pb-6">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-2xl md:text-3xl font-bold md:font-semibold text-black">{currencyText(variantPrice)}</span>
                                {variantMrp > variantPrice && (
                                    <>
                                        <span className="text-base md:text-lg text-gray-400 line-through font-medium">{currencyText(variantMrp)}</span>
                                        <span className="bg-[#9C5B61] text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wider">SAVE {variantDiscount}%</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 font-medium">Inclusive of all taxes</p>
                        </div>

                        <div className="border-b border-gray-100 pb-6">
                            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Price Breakdown</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                                    <span className="text-gray-600">Metal Price</span>
                                    <span className="font-semibold text-gray-900">{currencyText(pricingBreakdown.metalPrice)}</span>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                                    <span className="text-gray-600">Making Charge</span>
                                    <span className="font-semibold text-gray-900">{currencyText(pricingBreakdown.makingCharge)}</span>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                                    <span className="text-gray-600">Diamond Price</span>
                                    <span className="font-semibold text-gray-900">{currencyText(pricingBreakdown.diamondPrice)}</span>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                                    <span className="text-gray-600">GST ({gstPercent}%)</span>
                                    <span className="font-semibold text-gray-900">{currencyText(pricingBreakdown.gst)}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Final Price</span>
                                <span className="text-lg font-bold text-black">{currencyText(pricingBreakdown.finalPrice || variantPrice || 0)}</span>
                            </div>
                        </div>

                        <div className="space-y-4 pb-2 md:pb-6">
                            {product.variants && product.variants.length > 1 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Variants</span>
                                        <span className="text-[10px] text-gray-400">Select one</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.map((variant) => {
                                            const variantId = variant.id || variant._id;
                                            const isSelected = String(variantId) === String(selectedVariantId);
                                            return (
                                                <button
                                                    key={variantId}
                                                    type="button"
                                                    onClick={() => setSelectedVariantId(variantId)}
                                                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${isSelected
                                                        ? 'border-[#3E2723] bg-[#3E2723]/10 text-[#3E2723]'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {variant.name || 'Variant'}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className={`flex items-center gap-2 text-sm font-medium ${canAddToCart ? 'text-emerald-700' : 'text-red-600'}`}>
                                <ShieldCheck className="w-4 h-4" />
                                <span>
                                    {canAddToCart
                                        ? `In stock${availableStock !== null ? ` - ${availableStock} left` : ''} - ready to ship from Sands Royal`
                                        : 'Out of stock - this variant is currently unavailable'}
                                </span>
                            </div>


                            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 z-[110] md:hidden flex gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-safe">
                                <div className="flex flex-col justify-center min-w-[110px]">
                                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5 leading-none">Price</span>
                                    <span className="text-xl font-bold text-black leading-none">{currencyText(variantPrice)}</span>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!canAddToCart}
                                    className={`flex-1 rounded-full h-14 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl ${canAddToCart ? 'bg-[#8E2424] text-white shadow-[#8E2424]/20' : 'bg-gray-300 text-gray-500 shadow-gray-200 cursor-not-allowed'}`}
                                >
                                    {canAddToCart ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>

                            {/* Lab Grown Diamond Info Link */}
                            {isLabGrown && (
                                <div className="pt-4">
                                    <button 
                                        onClick={() => setIsLabGrownModalOpen(true)}
                                        className="w-full bg-[#FDF5F6] border border-[#EBCDD0]/40 rounded-2xl p-4 flex items-center justify-center gap-3 group transition-all hover:bg-white hover:shadow-md hover:border-[#EBCDD0]"
                                    >
                                        <Sparkles className="w-5 h-5 text-[#D39A9F]" />
                                        <span className="text-[13px] font-bold text-gray-800 underline decoration-[#D39A9F]/30 underline-offset-4 group-hover:text-[#D39A9F] transition-colors">
                                            All You Want to Know About the Lab Grown Diamonds
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="mt-2 hidden lg:block">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-black font-display">Check Availability & Delivery</span>
                        </div>

                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                placeholder="Enter your pincode"
                                value={localPincode}
                                onChange={(e) => setLocalPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="flex-1 border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#9C5B61] transition-colors"
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
                                className="bg-[#9C5B61] text-white px-8 py-2.5 rounded font-medium text-sm hover:bg-[#834d52] transition-colors"
                            >
                                Check
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-0 border border-gray-200 rounded-sm overflow-hidden bg-white">
                            <div className="flex flex-col items-center justify-center p-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                                <Truck className="w-4 h-4 text-gray-400 mb-1" />
                                <span className="text-[10px] text-gray-700 font-medium text-center">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                                <ShieldCheck className="w-4 h-4 text-gray-400 mb-1" />
                                <span className="text-[10px] text-gray-700 font-medium text-center">925 Silver</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 transition-colors">
                                <Gift className="w-4 h-4 text-gray-400 mb-1" />
                                <span className="text-[10px] text-gray-700 font-medium text-center">Gift Wrap</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= LOWER CONTENT SECTION (ACCORDIONS) ================= */}
            <div className="max-w-6xl mx-auto mt-16 border-t border-gray-100 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Product Badges / USP */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#FDF5F6]/50 rounded-2xl p-6 border border-[#EBCDD0]/30">
                            <h3 className="text-lg font-display font-bold text-black mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#9C5B61]" />
                                The Sands Guarantee
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center shadow-sm border border-[#EBCDD0]/20">
                                        <ShieldCheck className="w-5 h-5 text-[#9C5B61]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Authentic 925 Silver</h4>
                                        <p className="text-[11px] text-gray-500 leading-relaxed font-sans">Every piece comes with a certificate of authenticity and 925 hallmark.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center shadow-sm border border-[#EBCDD0]/20">
                                        <Smile className="w-5 h-5 text-[#9C5B61]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Skin Friendly</h4>
                                        <p className="text-[11px] text-gray-500 leading-relaxed font-sans">Nickel and Lead free, designed for comfort and long-term wear.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center shadow-sm border border-[#EBCDD0]/20">
                                        <Gift className="w-5 h-5 text-[#9C5B61]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Premium Packaging</h4>
                                        <p className="text-[11px] text-gray-500 leading-relaxed font-sans">Gift-ready luxury boxes that protect your jewellery forever.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Detailed Product Info Accordion */}
                    <div className="lg:col-span-8">
                        <div className="divide-y divide-gray-100">
                            <AccordionItem title="Description" isOpen={openSection === 'description'} onClick={() => toggleSection('description')}>
                                {product.description ? (
                                    <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: product.description }} />
                                ) : (
                                    <>
                                        <p className="mb-4">Elegance meets craftsmanship in this stunning {product.name}. Handcrafted with precision from 925 Sterling Silver, this piece is designed to be a timeless addition to your collection.</p>
                                        <p>Whether you're dressing up for a special occasion or adding a touch of sparkle to your daily look, this piece versatile enough to complement any style.</p>
                                    </>
                                )}
                            </AccordionItem>

                            <AccordionItem title="Specifications" isOpen={openSection === 'specifications'} onClick={() => toggleSection('specifications')}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
                                    {product.material && <div><span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">Material</span> <span className="font-semibold">{product.material}</span></div>}
                                    {product.silverCategory && <div><span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">Purity</span> <span className="font-semibold">{product.silverCategory}</span></div>}
                                    {(selectedVariantWeight || selectedVariantWeight === 0) && <div><span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">Weight</span> <span className="font-semibold">{selectedVariantWeight} {selectedVariantWeightUnit}</span></div>}
                                    {product.huid && <div><span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">HUID</span> <span className="font-semibold">{product.huid}</span></div>}
                                    {selectedVariant?.variantCode && <div><span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">Variant ID</span> <span className="font-mono text-xs">{selectedVariant.variantCode}</span></div>}
                                </div>
                                {product.specifications && (
                                    <div className="mt-4 pt-4 border-t border-gray-50 prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.specifications }} />
                                )}
                            </AccordionItem>

                            <AccordionItem title="Styling Tips" isOpen={openSection === 'styling'} onClick={() => toggleSection('styling')}>
                                {product.stylingTips ? (
                                    <div className="prose prose-sm max-w-none text-gray-600 font-sans" dangerouslySetInnerHTML={{ __html: product.stylingTips }} />
                                ) : (
                                    <p>Pair this versatile {product.category || 'jewellery'} with both western and ethnic wear to elevate your look.</p>
                                )}
                            </AccordionItem>

                            <AccordionItem title="Jewelry Care Guide" isOpen={openSection === 'care'} onClick={() => toggleSection('care')}>
                                <div className="space-y-4">
                                    <p className="text-gray-600 italic">Follow these tips to keep your {product.name} shining forever:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                                        {[
                                            { icon: <Droplets className="w-4 h-4" />, title: "Keep Dry", desc: "Remove before swimming or bathing" },
                                            { icon: <Sparkles className="w-4 h-4" />, title: "Apply First", desc: "Put on jewelry after makeup/perfume" },
                                            { icon: <ShieldCheck className="w-4 h-4" />, title: "Safe Storage", desc: "Store in a cool, dry airtight box" },
                                            { icon: <Smile className="w-4 h-4" />, title: "Clean Softly", desc: "Wipe with a soft polishing cloth" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-[#FDFBF7]/50 p-4 rounded-xl border border-[#EBCDD0]/20 flex items-center gap-4 transition-all hover:bg-white hover:shadow-sm">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#9C5B61] shadow-sm border border-[#EBCDD0]/30 flex-shrink-0">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <h5 className="text-[11px] font-bold text-black uppercase tracking-wider">{item.title}</h5>
                                                    <p className="text-[10px] text-gray-500 font-medium">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AccordionItem>

                            <AccordionItem title="Frequently Asked Questions" isOpen={openSection === 'faqs'} onClick={() => toggleSection('faqs')}>
                                {product.faqs && product.faqs.length > 0 ? (
                                    <div className="space-y-4 pt-2">
                                        {product.faqs.map((faq, idx) => (
                                            <div key={`${faq.question}-${idx}`} className="bg-gray-50/50 rounded-xl p-4 transition-colors hover:bg-gray-50">
                                                <p className="font-bold text-sm text-gray-900 flex items-start gap-2">
                                                    <span className="text-[#9C5B61]">Q.</span> {faq.question}
                                                </p>
                                                <p className="text-gray-600 mt-2 text-sm leading-relaxed pl-6">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No FAQs available for this specific product yet. Contact our support for any queries.</p>
                                )}
                            </AccordionItem>
                        </div>
                    </div>
                </div>
            </div>

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

                <WhyChooseUs />

                <div className="flex gap-10 border-b border-gray-100 mb-6">
                    <button
                        className={`pb-4 text-sm md:text-base font-bold uppercase tracking-[0.15em] transition-all relative ${activeTab === 'related' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setActiveTab('related')}
                    >
                        Related products
                        {activeTab === 'related' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-left-2 duration-300"></span>}
                    </button>
                    <button
                        className={`pb-4 text-sm md:text-base font-bold uppercase tracking-[0.15em] transition-all relative ${activeTab === 'recent' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
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
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <ShoppingBag className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm font-medium">No {activeTab} products found</p>
                            </div>
                        );
                    }

                    return (
                        <div className="flex overflow-x-auto gap-3 md:gap-6 pb-4 snap-x scrollbar-hide">
                            {displayList.map((product) => (
                                <div key={product.id} className="min-w-[140px] w-[140px] md:min-w-[280px] md:w-[280px] snap-center">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>

            {/* 2. Reviews Section (Second) - With Filters & Modal */}
            {/* 2. Reviews Section (Second) - With Filters & Modal */}
            <div className="mt-4 border-t border-gray-200 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative pb-24 md:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex text-[#D39A9F]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                        </div>
                        <span className="text-lg font-medium text-gray-800 flex items-center gap-1">
                            {hasReviews ? `${reviewCount} Reviews` : 'No reviews yet'}
                            <ChevronDown className="w-4 h-4 text-gray-500" />
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
                            className="flex-1 md:flex-none border border-gray-300 px-4 py-2.5 rounded text-sm font-bold uppercase tracking-widest text-black hover:border-black hover:bg-black hover:text-white transition-colors text-center"
                        >
                            Write a review
                        </button>
                        <button
                            onClick={() => setIsReviewFilterOpen(!isReviewFilterOpen)}
                            className={`border border-gray-300 p-2.5 rounded text-black hover:border-black hover:bg-black hover:text-white transition-colors ${isReviewFilterOpen ? 'bg-black text-white' : ''}`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>

                        {/* Filter Dropdown */}
                        {isReviewFilterOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-30 p-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                                    <span className="font-bold text-gray-900">Sort by</span>
                                </div>
                                <div className="space-y-1">
                                    {['Featured', 'Newest', 'Highest Ratings', 'Lowest Ratings'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => { setSortBy(option); setIsReviewFilterOpen(false); }}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex justify-between items-center"
                                        >
                                            {option}
                                            {sortBy === option && <Check className="w-4 h-4 text-black" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {sortedReviews.map((review, idx) => (
                        <div key={idx} className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                </div>
                                <div className="flex text-[#D39A9F]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'} `} />
                                    ))}
                                </div>
                            </div>
                            <h5 className="font-medium text-sm text-gray-800 mt-2">{review.title}</h5>
                            <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
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


