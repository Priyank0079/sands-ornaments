import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import local gold assets for the display - ALL GREEN THEMED
import goldRings from '@assets/categories/gold_rings_green.png';
import goldEarrings from '@assets/categories/gold_earrings_green.png';
import goldPendants from '@assets/categories/gold_pendants_green.png';
import goldBangles from '@assets/categories/gold_bangles_green.png';
import goldMangalsutra from '@assets/categories/gold_mangalsutra_green.png';
import goldBracelets from '@assets/categories/gold_bracelets_green.png';
import goldNewArrivals from '@assets/categories/gold_new_arrivals_green.png';

const collections = [
    { 
        id: 1, 
        title: "Regal Gold Rings", 
        image: goldRings, 
        link: "/shop?category=rings&metal=gold", 
        type: 'image' 
    },
    { 
        id: 2, 
        title: "24KT Gold Essence", 
        video: "/Screen Recording 2026-04-11 150529.mp4", 
        // Ensure gold-only filtering: backend applies karat only when metal=gold.
        link: "/shop?metal=gold&karat=24", 
        type: 'video' 
    },
    { 
        id: 3, 
        title: "Eternal Pendants", 
        image: goldPendants, 
        link: "/shop?category=pendants&metal=gold", 
        type: 'image' 
    },
    { 
        id: 4, 
        title: "Boutique Craft", 
        video: "/Screen Recording 2026-04-11 150441.mp4", 
        link: "/shop?metal=gold", 
        type: 'video' 
    },
    { 
        id: 5, 
        title: "Bangles & Kada", 
        image: goldBangles, 
        link: "/shop?category=bangles&metal=gold", 
        type: 'image' 
    },
    { 
        id: 6, 
        title: "Pure Brilliance", 
        video: "/Screen Recording 2026-04-11 150529.mp4", 
        link: "/shop?metal=gold", 
        type: 'video' 
    },
    { 
        id: 7, 
        title: "Royal Mangalsutra", 
        image: goldMangalsutra, 
        link: "/shop?category=mangalsutra&metal=gold", 
        type: 'image' 
    },
    { 
        id: 8, 
        title: "Design Showcase", 
        video: "/Screen Recording 2026-04-11 150441.mp4", 
        link: "/shop?metal=gold", 
        type: 'video' 
    }
];

const GoldCuratedCollections = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = window.innerWidth > 768 ? 400 : 250;
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };

    return (
        <section className="py-6 md:py-10 bg-white select-none overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1450px]">
                
                {/* Header - Compact */}
                <div className="text-center mb-6 md:mb-8">
                    <h2 className="text-[18px] md:text-[24px] font-medium text-[#2A4D35] tracking-tight font-serif italic">
                        Gold Curated Collections
                    </h2>
                </div>

                {/* Horizontal Scroll Area with Arrows */}
                <div className="relative group/main">
                    
                    {/* Left Scroll Arrow - Smaller */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:scale-110 active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Right Scroll Arrow - Smaller */}
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:scale-110 active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-2 md:gap-3 pb-6 hide-scrollbar scroll-smooth snap-x snap-mandatory"
                    >
                        {collections.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                onClick={() => navigate(item.link)}
                                className="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px] h-[180px] sm:h-[240px] md:h-[280px] relative group cursor-pointer overflow-hidden bg-[#0D1C12] snap-center first:ml-4 last:mr-4 lg:first:ml-0 lg:last:mr-0 rounded-none shadow-md"
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
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                                {/* Floating Label at Bottom Left - More Compact */}
                                <div className="absolute bottom-4 left-4 text-white z-10 transition-all duration-300 group-hover:translate-x-1">
                                    <div className="flex items-center gap-1 group/btn">
                                        <span className="text-[9px] md:text-[12px] font-bold tracking-tight uppercase whitespace-nowrap">
                                            {item.title}
                                        </span>
                                        <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
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

