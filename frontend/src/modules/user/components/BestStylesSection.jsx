import React, { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

// Assets
import bestStylePot1 from '../assets/best_style_pot_1.png';
import bestStylePot2 from '../assets/best_style_pot_2.png';
import silverChainDark from '../assets/silver_chain_dark.png';
import silverBraceletDark from '../assets/silver_bracelet_dark.png';
import silverEarringsDark from '../assets/silver_earrings_dark.png';
import silverAnkletDark from '../assets/silver_anklet_dark.png';

const PRODUCTS = [
    {
        id: "best-1",
        name: "Classic Silver Cuban Chain",
        price: 2499,
        originalPrice: 4999,
        rating: 4.9,
        reviews: 1240,
        image: bestStylePot1,
        bestseller: true,
    },
    {
        id: "best-2",
        name: "Elegant Silver Drop Earrings",
        price: 1899,
        originalPrice: 3599,
        rating: 4.8,
        reviews: 856,
        image: bestStylePot2,
        bestseller: true,
    },
    {
        id: "best-3",
        name: "Rustic Silver Signature Ring",
        price: 1599,
        originalPrice: 2899,
        rating: 4.7,
        reviews: 642,
        image: silverChainDark, // Moody fallback
        priceDrop: true,
    },
    {
        id: "best-4",
        name: "Vintage Silver Filigree Band",
        price: 2199,
        originalPrice: 4299,
        rating: 4.8,
        reviews: 312,
        image: silverBraceletDark, // Moody fallback
        priceDrop: true,
    },
    {
        id: "best-5",
        name: "Premium Silver Link Bracelet",
        price: 3299,
        originalPrice: 6499,
        rating: 4.9,
        reviews: 1105,
        image: silverEarringsDark, // Moody fallback
        bestseller: true,
    },
    {
        id: "best-6",
        name: "Minimalist Silver Choker",
        price: 4599,
        originalPrice: 8999,
        rating: 4.7,
        reviews: 432,
        image: silverAnkletDark, // Moody fallback
        priceDrop: true,
    }
];

const BestStylesSection = () => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, wishlist, cart, products, activeMetal } = useShop();
    const [addedId, setAddedId] = useState(null);

    // Filter dynamic products: Gold items prioritized, then any other products to fill the section
    const dynamicProducts = useMemo(() => {
        // 1. Get all Gold products
        let goldProds = products.filter(p => 
            p.metal?.toLowerCase() === 'gold' || 
            p.material?.toLowerCase() === 'gold' ||
            p.category?.toLowerCase().includes('gold') ||
            p.goldCategory
        );

        // 2. Get other products to fill slots if needed
        let otherProds = products.filter(p => !goldProds.some(gp => gp.id === p.id));
        
        // 3. Combine them
        let combined = [...goldProds, ...otherProds];

        // 4. Normalize
        let processed = combined.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice || p.price * 1.5,
            rating: p.rating || 4.5,
            reviews: p.reviews || 0,
            image: p.image,
            bestseller: p.isTrending || true,
            priceDrop: p.originalPrice > p.price
        }));

        // 5. Prepend the curated PRODUCTS (new images) and then add unique dynamic products
        const uniqueProcessed = processed.filter(p => !PRODUCTS.some(sp => sp.name === p.name));
        return [...PRODUCTS, ...uniqueProcessed].slice(0, 12);
    }, [products, activeMetal]);

    const isInWishlist = (id) => wishlist?.some(item => item.id === id);
    const isInCart = (id) => cart?.some(item => item.id === id);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 2000);
    };

    const handleWishlist = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const scrollAmount = window.innerWidth > 768 ? 400 : 250;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1450px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[20px] md:text-[24px] font-sans font-medium text-gray-900 tracking-tight">
                        Best styles, now for less!
                    </h2>
                    <div className="hidden md:flex gap-2">
                        <button 
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Product List */}
                <div 
                    ref={scrollRef}
                    className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory px-1"
                >
                    {dynamicProducts.map((product) => (
                        <div 
                            key={product.id}
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="min-w-[180px] md:min-w-[240px] w-[180px] md:w-[240px] snap-start cursor-pointer group/card"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-none mb-3">
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                                />
                                
                                {/* Bestseller Badge */}
                                {product.bestseller && (
                                    <div className="absolute top-0 left-0 bg-[#E89BA8] text-white text-[9px] font-bold px-2 py-1 z-10 uppercase tracking-widest">
                                        Bestseller
                                    </div>
                                )}
        
                                {/* Wishlist Button */}
                                <button 
                                    onClick={(e) => handleWishlist(e, product)}
                                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all transform hover:scale-110"
                                >
                                    <Heart 
                                        className={`w-4 h-4 transition-colors ${isInWishlist(product.id) ? 'fill-[#8E2B45] text-[#8E2B45]' : 'text-gray-400'}`} 
                                    />
                                </button>
        
                                {/* Rating Badge */}
                                <div className="absolute bottom-2 left-2 z-10 bg-white/95 px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm border border-gray-100">
                                    <span className="text-[10px] font-bold text-gray-800">{product.rating}</span>
                                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                    <div className="w-px h-2.5 bg-gray-300 mx-0.5" />
                                    <span className="text-[10px] text-gray-500">{product.reviews}</span>
                                </div>
                            </div>
        
                            {/* Content Container - Fixed Height for alignment */}
                            <div className="flex flex-col h-[115px]">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-[15px] font-bold text-gray-900">₹{product.price}</span>
                                    <span className="text-[12px] text-gray-400 line-through font-medium">₹{product.originalPrice}</span>
                                </div>
                                
                                <h3 className="text-[12px] text-gray-700 line-clamp-1 h-[18px] group-hover/card:text-black transition-colors uppercase tracking-tight font-medium overflow-hidden mb-1">
                                    {product.name}
                                </h3>

                                <div className="h-[15px] mb-2">
                                    {product.priceDrop && (
                                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                                            PRICE DROP!
                                        </p>
                                    )}
                                </div>
                                
                                {/* Add to Cart Button - Pushed to bottom */}
                                <div className="mt-auto">
                                    <button 
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={addedId === product.id}
                                        className={`w-full py-2.5 rounded-none font-bold text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                                            addedId === product.id 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-[#FFD9E0] text-[#8E2B45] hover:bg-[#ffc2cd]'
                                        }`}
                                    >
                                        {addedId === product.id ? (
                                            <>
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Added
                                            </>
                                        ) : (
                                            'Add to Cart'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
        </section>
    );
};

export default BestStylesSection;
