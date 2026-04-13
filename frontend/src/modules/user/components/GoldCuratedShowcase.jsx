import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Assets
import ringGreen from '../../../assets/categories/gold_rings_green.png';

const collections = [
    { 
        id: 1, 
        title: "The Gold Standards", 
        video: "/Screen Recording 2026-04-11 150441.mp4", 
        link: "/shop?category=Rings", 
        type: 'video' 
    },
    { 
        id: 2, 
        title: "Pure Green Favourites", 
        image: ringGreen, 
        link: "/shop?category=Rings&search=promise", 
        type: 'image' 
    },
    { 
        id: 3, 
        title: "Shubh Akshaya Tritiya", 
        video: "/Screen Recording 2026-04-11 150529.mp4", 
        link: "/shop?metal=gold", 
        type: 'video' 
    },
    { 
        id: 4, 
        title: "Sands Ornaments", 
        image: ringGreen, 
        link: "/shop?category=Rings&search=vanki", 
        type: 'image' 
    },
    { 
        id: 5, 
        title: "Crafted in Pure Gold", 
        video: "/Screen Recording 2026-04-11 150441.mp4", 
        link: "/shop?category=Rings&search=solitaire", 
        type: 'video' 
    },
    { 
        id: 6, 
        title: "Luxury Ring Sets", 
        video: "/Screen Recording 2026-04-11 150529.mp4", 
        link: "/shop?category=Rings&search=classic", 
        type: 'video' 
    }
];

const GoldCuratedShowcase = () => {
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
        <section className="py-12 md:py-20 bg-white select-none overflow-hidden">
            <div className="w-full">
                
                {/* Header */}
                <div className="text-center mb-10 md:mb-16 px-4">
                    <span className="inline-flex items-center rounded-full border border-[#D4B390]/30 bg-[#FAF9F0] px-4 py-1.5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-[#2A4D35]">
                        Curated Highlights
                    </span>
                    <h2 className="mt-6 text-[28px] md:text-[40px] font-serif italic font-medium text-[#2A4D35] tracking-tight">
                        Premium Gold Collections
                    </h2>
                    <div className="h-px w-20 bg-[#D4B390]/50 mx-auto mt-6 mb-4" />
                    <p className="mt-4 text-sm md:text-base text-gray-500 max-w-2xl mx-auto uppercase tracking-widest font-medium opacity-80">
                        Modern craftsmanship meets timeless tradition.
                    </p>
                </div>

                {/* Horizontal Scroll Area with Arrows */}
                <div className="relative group/main max-w-[1450px] mx-auto">
                    
                    {/* Left Scroll Arrow */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-[#FAF9F0] hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6 text-[#2A4D35]" />
                    </button>

                    {/* Right Scroll Arrow */}
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-[#FAF9F0] hover:scale-105 active:scale-95"
                    >
                        <ChevronRight className="w-6 h-6 text-[#2A4D35]" />
                    </button>

                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-4 md:gap-8 pb-10 hide-scrollbar scroll-smooth snap-x snap-mandatory px-4 md:px-0"
                    >
                        {collections.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                onClick={() => navigate(item.link)}
                                className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-[3/4] relative group cursor-pointer overflow-hidden rounded-[32px] bg-[#0D1C12] snap-start shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] border border-gray-100"
                            >
                                {item.type === 'video' ? (
                                    <video 
                                        src={item.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
                                    />
                                ) : (
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
                                    />
                                )}
                                
                                {/* Bottom Gradient */}
                                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                                {/* Floating Label at Bottom Center-ish */}
                                <div className="absolute bottom-10 left-8 right-8 text-white z-10 transition-all duration-300">
                                    <div className="flex items-end justify-between group/btn border-b border-white/20 pb-4">
                                        <h3 className="text-[13px] md:text-[15px] font-black tracking-[0.2em] uppercase leading-tight max-w-[80%]">
                                            {item.title}
                                        </h3>
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
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

export default GoldCuratedShowcase;
