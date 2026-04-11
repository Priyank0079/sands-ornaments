import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import local gold assets for the display
import goldRings from '../../../assets/categories/gold_rings_green.png';
import goldEarrings from '../../../assets/categories/gold_earrings_green.png';
import pendants from '../../../assets/categories/pendants.png';
import bangle from '../../../assets/categories/bangle.png';
import mangalsutra from '../../../assets/categories/mangalsutra.png';

const collections = [
    { 
        id: 1, 
        title: "The Regal Gold Rings", 
        image: goldRings, 
        link: "/shop?category=rings&metal=gold", 
        type: 'image' 
    },
    { 
        id: 2, 
        title: "24KT Gold Essence", 
        video: "/Screen Recording 2026-04-11 150529.mp4", 
        link: "/shop?purity=24k", 
        type: 'video' 
    },
    { 
        id: 3, 
        title: "Eternal Gold Pendants", 
        image: pendants, 
        link: "/shop?category=pendants&metal=gold", 
        type: 'image' 
    },
    { 
        id: 4, 
        title: "Boutique Craftsmanship", 
        video: "/Screen Recording 2026-04-11 150441.mp4", 
        link: "/shop?metal=gold", 
        type: 'video' 
    },
    { 
        id: 5, 
        title: "Gold Bangles & Kada", 
        image: bangle, 
        link: "/shop?category=bangles&metal=gold", 
        type: 'image' 
    },
    { 
        id: 6, 
        title: "Traditional Mangalsutra", 
        image: mangalsutra, 
        link: "/shop?category=mangalsutra&metal=gold", 
        type: 'image' 
    },
    { 
        id: 7, 
        title: "Elite Earrings", 
        image: goldEarrings, 
        link: "/shop?category=earrings&metal=gold", 
        type: 'image' 
    }
];

const GoldCuratedCollections = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = window.innerWidth > 768 ? 600 : 300;
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };

    return (
        <section className="py-8 md:py-14 bg-white select-none">
            <div className="container mx-auto px-4 max-w-[1440px]">
                
                {/* Header - Matching Boutique Style */}
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-medium text-[#2A4D35] tracking-tight font-serif italic">
                        Gold Curated Collections
                    </h2>
                </div>

                {/* Horizontal Scroll Area with Arrows */}
                <div className="relative group/main">
                    
                    {/* Left Scroll Arrow */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:scale-110 active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Right Scroll Arrow */}
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:scale-110 active:scale-95"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-3 md:gap-4 pb-8 hide-scrollbar scroll-smooth snap-x snap-mandatory"
                    >
                        {collections.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                onClick={() => navigate(item.link)}
                                className="flex-shrink-0 w-[160px] sm:w-[220px] md:w-[240px] lg:w-[280px] h-[260px] sm:h-[320px] md:h-[400px] relative group cursor-pointer overflow-hidden bg-[#0D1C12] snap-center first:ml-4 last:mr-4 lg:first:ml-0 lg:last:mr-0 rounded-none shadow-lg"
                            >
                                {item.type === 'video' ? (
                                    <video 
                                        src={item.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
                                    />
                                ) : (
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110"
                                    />
                                )}
                                
                                {/* Bottom Gradient for Readability */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                                {/* Floating Label at Bottom Left */}
                                <div className="absolute bottom-6 left-5 text-white z-10 transition-all duration-300 group-hover:translate-x-1">
                                    <div className="flex items-center gap-1 group/btn">
                                        <span className="text-[10px] md:text-sm font-bold tracking-tight uppercase whitespace-nowrap">
                                            {item.title}
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <style>
                {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
        </section>
    );
};

export default GoldCuratedCollections;
