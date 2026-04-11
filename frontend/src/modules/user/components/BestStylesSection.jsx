import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import goldEarrings from '../../../assets/categories/earrings.png'; // Corrected filename
import goldRings from '../../../assets/categories/rings.png'; // Corrected filename
import silverEarrings from '../../../assets/products/silver_earrings.png';
import silverBangles from '../../../assets/products/silver_bangles.png';
import silverBracelet from '../../../assets/products/silver_bracelet.png';

const PRODUCTS = [
    {
        id: 1,
        name: "Premium Drop Earrings",
        price: 2999,
        originalPrice: 5499,
        rating: 4.8,
        reviews: 929,
        image: silverEarrings,
        bestseller: true,
    },
    {
        id: 2,
        name: "Adjustable Silver Bracelet",
        price: 3499,
        originalPrice: 6199,
        rating: 4.8,
        reviews: 698,
        image: silverBracelet,
        bestseller: true,
    },
    {
        id: 3,
        name: "Geometric Silver Bangle",
        price: 2999,
        originalPrice: 5499,
        rating: 4.8,
        reviews: 579,
        image: silverBangles,
        priceDrop: true,
    },
    {
        id: 4,
        name: "Gold Lotus Earrings",
        price: 3199,
        originalPrice: 5799,
        rating: 4.8,
        reviews: 439,
        image: goldEarrings,
        priceDrop: true,
    },
    {
        id: 5,
        name: "Floral Zircon Gold Ring",
        price: 1999,
        originalPrice: 3599,
        rating: 4.6,
        reviews: 772,
        image: goldRings,
        priceDrop: true,
    }
];

const BestStylesSection = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1240px]">
                {/* Header - Kept in container to align with site */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-sans font-medium text-gray-800 tracking-tight">
                        Best styles, now for less!
                    </h2>
                </div>
            </div>

            {/* Full Screen Scroll Container */}
            <div className="relative group w-full">
                {/* Scroll Buttons - Repositioned for full screen */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-6 top-[35%] -translate-y-1/2 z-40 bg-white/90 shadow-2xl rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white border border-gray-100 hidden md:flex items-center justify-center"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-6 top-[35%] -translate-y-1/2 z-40 bg-white/90 shadow-2xl rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white border border-gray-100 hidden md:flex items-center justify-center"
                >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                {/* Product List - Bleeds edge to edge */}
                <div 
                    ref={scrollRef}
                    className="flex gap-3 md:gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory px-4 md:px-12"
                >
                    {PRODUCTS.map((product) => (
                        <div 
                            key={product.id}
                            className="min-w-[200px] md:min-w-[260px] w-[200px] md:w-[260px] snap-start"
                        >
                                {/* card start */}
                                <div className="bg-white rounded-none overflow-hidden group/card relative">
                                    {/* Image Container */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-none">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 rounded-none"
                                        />
                                        
                                        {/* Bestseller Badge */}
                                        {product.bestseller && (
                                            <div className="absolute top-2 left-0 bg-[#E89BA8] text-white text-[9px] md:text-[10px] font-bold px-2 py-1 z-10 uppercase tracking-widest shadow-sm">
                                                Bestseller
                                            </div>
                                        )}
 
                                        {/* Wishlist Button */}
                                        <button className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                                            <Heart className="w-3.5 h-3.5 text-[#8E2B45]" />
                                        </button>
 
                                        {/* Rating Badge */}
                                        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-none flex items-center gap-1 shadow-sm">
                                            <span className="text-[10px] font-bold text-gray-800">{product.rating}</span>
                                            <Star className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                                            <div className="w-px h-2 bg-gray-300 mx-0.5" />
                                            <span className="text-[10px] text-gray-500">{product.reviews}</span>
                                        </div>
                                    </div>
 
                                    {/* Content Container */}
                                    <div className="pt-3 pb-1">
                                        <div className="flex items-baseline gap-1.5 mb-0.5">
                                            <span className="text-base font-bold text-black font-sans">₹{product.price}</span>
                                            <span className="text-[12px] text-gray-400 line-through">₹{product.originalPrice}</span>
                                        </div>
                                        
                                        <h3 className="text-[11px] md:text-[12px] text-gray-600 line-clamp-1 mb-1 hover:text-gray-900 transition-colors uppercase tracking-tight font-medium">
                                            {product.name}
                                        </h3>
 
                                        {product.priceDrop ? (
                                            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                                                PRICE DROP!
                                            </p>
                                        ) : (
                                            <div className="h-[12px] mb-2" />
                                        )}
                                        
                                        {/* Add to Cart Button */}
                                        <button className="w-full bg-[#FFD9E0] text-[#8E2B45] font-bold text-[11px] py-2 rounded-none hover:bg-[#ffc2cd] transition-all duration-300 uppercase tracking-widest">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        </section>
    );
};

export default BestStylesSection;
