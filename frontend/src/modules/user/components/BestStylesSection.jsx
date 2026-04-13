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

import ProductCard from './ProductCard';

const PRODUCTS = [
    {
        id: "best-1",
        name: "Classic Silver Cuban Chain",
        price: 2499,
        originalPrice: 4999,
        rating: 4.9,
        reviewCount: 1240,
        image: bestStylePot1,
        bestseller: true,
    },
    {
        id: "best-2",
        name: "Elegant Silver Drop Earrings",
        price: 1899,
        originalPrice: 3599,
        rating: 4.8,
        reviewCount: 856,
        image: bestStylePot2,
        bestseller: true,
    },
    {
        id: "best-3",
        name: "Rustic Silver Signature Ring",
        price: 1599,
        originalPrice: 2899,
        rating: 4.7,
        reviewCount: 642,
        image: silverChainDark, 
        priceDrop: true,
    },
    {
        id: "best-4",
        name: "Vintage Silver Filigree Band",
        price: 2199,
        originalPrice: 4299,
        rating: 4.8,
        reviewCount: 312,
        image: silverBraceletDark, 
        priceDrop: true,
    },
    {
        id: "best-5",
        name: "Premium Silver Link Bracelet",
        price: 3299,
        originalPrice: 6499,
        rating: 4.9,
        reviewCount: 1105,
        image: silverEarringsDark, 
        bestseller: true,
    },
    {
        id: "best-6",
        name: "Minimalist Silver Choker",
        price: 4599,
        originalPrice: 8999,
        rating: 4.7,
        reviewCount: 432,
        image: silverAnkletDark,
        priceDrop: true,
    }
];

const BestStylesSection = () => {
    const scrollRef = useRef(null);
    const { products, activeMetal } = useShop();

    const dynamicProducts = useMemo(() => {
        let goldProds = products.filter(p => 
            p.metal?.toLowerCase() === 'gold' || 
            p.material?.toLowerCase() === 'gold' ||
            p.category?.toLowerCase().includes('gold') ||
            p.goldCategory
        );

        let otherProds = products.filter(p => !goldProds.some(gp => gp.id === p.id));
        let combined = [...goldProds, ...otherProds];

        let processed = combined.map(p => ({
            ...p,
            id: p.id,
            originalPrice: p.originalPrice || p.price * 1.5,
            rating: p.rating || 4.5,
            reviewCount: p.reviewCount || 0,
            bestseller: p.isTrending || true,
            priceDrop: p.originalPrice > p.price
        }));

        const uniqueProcessed = processed.filter(p => !PRODUCTS.some(sp => sp.name === p.name));
        return [...PRODUCTS, ...uniqueProcessed].slice(0, 12);
    }, [products, activeMetal]);

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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                        <h2 className="text-[20px] md:text-[24px] font-sans font-medium text-gray-900 tracking-tight">
                            Best styles, now for less!
                        </h2>
                        <Link to="/collection/best-styles" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8E4A50] hover:underline transition-all">
                            View All Collection
                        </Link>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory px-1">
                    {dynamicProducts.map((product) => (
                        <div key={product.id} className="min-w-[180px] md:min-w-[280px] w-[180px] md:w-[280px] snap-start">
                            <ProductCard product={product} />
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
