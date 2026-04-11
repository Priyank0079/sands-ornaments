import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import curatedVideo from '../../assets/Screen Recording 2026-04-07 115349.mp4';

const collections = [
    { id: 1, title: "Shop Silver for Him", image: "/men_silver_1.png", link: "/shop?category=silver", type: 'image' },
    { id: 2, title: "Astra Collection", video: curatedVideo, link: "/shop?category=astra", type: 'video' },
    { id: 3, title: "Shop Gifts for Him", image: "/men_silver_2.png", link: "/shop?category=gifts", type: 'image' },
    { id: 4, title: "The Classics for Him", video: curatedVideo, link: "/shop?category=classics", type: 'video' },
    { id: 5, title: "Pendants for Him", image: "/men_silver_3.png", link: "/shop?category=pendants", type: 'image' },
    { id: 6, title: "925 Silver Shop", video: curatedVideo, link: "/shop?category=silver-925", type: 'video' },
    { id: 7, title: "Modern Chains", image: "/men_silver_1.png", link: "/shop?category=chains", type: 'image' },
    { id: 8, title: "Signature Rings", video: curatedVideo, link: "/shop?category=rings", type: 'video' },
    { id: 9, title: "Crafted Bracelets", image: "/men_silver_2.png", link: "/shop?category=bracelets", type: 'image' },
    { id: 10, title: "Elite Pendants", video: curatedVideo, link: "/shop?category=pendants-elite", type: 'video' }
];

const MenCuratedCollections = () => {
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
        <section className="py-4 md:py-8 bg-white select-none overflow-hidden">
            <div className="w-full">
                
                {/* Header */}
                <div className="text-center mb-5 md:mb-7 px-4">
                    <span className="inline-flex items-center rounded-full border border-black/10 bg-[#F8F3F4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/60">
                        More Gifts for Him
                    </span>
                    <h2 className="mt-3 text-2xl md:text-3xl font-medium text-black tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Curated Collections
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-black/55 max-w-2xl mx-auto">
                        Clean, easy-to-browse picks for gifting and everyday style.
                    </p>
                </div>

                {/* Horizontal Scroll Area with Arrows */}
                <div className="relative group/main">
                    
                    {/* Left Scroll Arrow */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5 text-black" />
                    </button>

                    {/* Right Scroll Arrow */}
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5 text-black" />
                    </button>

                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-3 md:gap-5 pb-4 md:pb-6 hide-scrollbar scroll-smooth snap-x snap-mandatory px-0 md:px-0"
                    >
                        {collections.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                onClick={() => navigate(item.link)}
                                className="flex-shrink-0 w-[150px] sm:w-[190px] md:w-[220px] lg:w-[250px] h-[220px] sm:h-[270px] md:h-[330px] relative group cursor-pointer overflow-hidden rounded-none bg-black snap-start shadow-[0_18px_45px_-24px_rgba(0,0,0,0.45)]"
                            >
                                {item.type === 'video' ? (
                                    <video 
                                        src={item.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] opacity-80 transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
                                    />
                                ) : (
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                                    />
                                )}
                                
                                {/* Bottom Gradient */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                                {/* Floating Label at Bottom Left */}
                                <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 text-white z-10 transition-all duration-300 group-hover:translate-x-1">
                                    <div className="flex items-center gap-1 group/btn">
                                        <span className="text-[10px] md:text-xs font-bold tracking-[0.08em] uppercase whitespace-nowrap">
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

export default MenCuratedCollections;
