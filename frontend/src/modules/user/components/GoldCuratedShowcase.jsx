import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Assets
import ringGreen from '@assets/categories/gold_rings_green.png';

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
        <section className="py-8 md:py-14 bg-white select-none overflow-hidden">
            <div className="w-full">

                {/* Compact Header */}
                <div className="text-center mb-8 md:mb-12 px-4">
                    <span className="inline-flex items-center rounded-none border border-[#D4B390]/30 bg-[#FAF9F0] px-4 py-2.5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-[#2A4D35]">
                        Curated Highlights
                    </span>
                    <h2 className="mt-4 text-[26px] md:text-[36px] font-serif italic font-medium text-[#2A4D35] tracking-tight">
                        Premium Gold Collections
                    </h2>
                </div>

                {/* Horizontal Scroll Area with Arrows */}
                <div className="relative group/main max-w-[1550px] mx-auto">

                    {/* Left Scroll Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-none flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-[#FAF9F0] active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5 text-[#2A4D35]" />
                    </button>

                    {/* Right Scroll Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-none flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-[#FAF9F0] active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5 text-[#2A4D35]" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-3 md:gap-5 pb-8 hide-scrollbar scroll-smooth snap-x snap-mandatory px-4"
                    >
                        {collections.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                onClick={() => navigate(item.link)}
                                className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] aspect-[4/5] relative group cursor-pointer overflow-hidden rounded-none bg-[#0D1C12] snap-start shadow-md border border-gray-200"
                            >
                                {item.type === 'video' ? (
                                    <video
                                        src={item.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110"
                                    />
                                )}

                                {/* Bottom Gradient */}
                                <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity" />

                                {/* Label at Bottom - Square Style */}
                                <div className="absolute bottom-6 left-6 right-6 text-white z-10 transition-all duration-300">
                                    <div className="flex items-center justify-between group/btn border-b border-white/20 pb-2">
                                        <h3 className="text-[11px] md:text-[13px] font-black tracking-[0.2em] uppercase leading-tight max-w-[85%]">
                                            {item.title}
                                        </h3>
                                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
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

