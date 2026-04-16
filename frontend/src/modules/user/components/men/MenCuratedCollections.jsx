import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildMenShopPath } from '../../utils/menNavigation';

// Import existing assets from global and local folders
import men1 from '@assets/luxury_ring_men.png';
import men2 from '@assets/luxury_pendant_men.png';
import men3 from '@assets/luxury_gifts_men.png';
import men4 from '@assets/men/style_bracelets.png';

const collections = [
    { id: 1, title: "SHOP SILVER FOR HIM", image: men1, link: buildMenShopPath({ metal: 'silver' }), type: 'image' },
    { id: 2, title: "ASTRA COLLECTION", image: men2, link: buildMenShopPath({ search: 'astra' }), type: 'image' },
    { id: 3, title: "SHOP GIFTS FOR HIM", image: men3, link: buildMenShopPath(), type: 'image' },
    { id: 4, title: "THE CLASSICS FOR HIM", image: men1, link: buildMenShopPath({ sort: 'most-sold' }), type: 'image' }, 
    { id: 5, title: "PENDANTS FOR HIM", image: men2, link: buildMenShopPath({ category: 'pendants' }), type: 'image' },
    { id: 6, title: "925 SILVER SHOP", image: men4, link: buildMenShopPath({ metal: 'silver', silverType: '925 sterling silver' }), type: 'image' }
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
        <section className="py-2 md:py-8 bg-white select-none overflow-hidden">
            <div className="w-full">
                
                {/* Header */}
                <div className="text-center mb-3 md:mb-7 px-4">
                    <span className="inline-flex items-center rounded-full border border-black/10 bg-[#F8F3F4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/60">
                        More Gifts for Him
                    </span>
                    <h2 className="mt-2 text-xl md:text-3xl font-medium text-black tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Curated Collections
                    </h2>
                    <p className="mt-1.5 text-[12px] md:text-base text-black/55 max-w-2xl mx-auto">
                        Clean, easy-to-browse picks for gifting and everyday style.
                    </p>
                </div>

                {/* Horizontal Scroll Area with Arrows */}
                <div className="relative group/main">
                    
                    {/* Left Scroll Arrow */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-11 md:h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-black" />
                    </button>

                    {/* Right Scroll Arrow */}
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-11 md:h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95"
                    >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-black" />
                    </button>

                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-2 md:gap-4 pb-3 md:pb-10 hide-scrollbar scroll-smooth snap-x snap-mandatory px-4"
                    >
                        {collections.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                onClick={() => navigate(item.link)}
                                className="flex-shrink-0 w-[132px] md:w-[280px] lg:w-[320px] aspect-square relative group cursor-pointer overflow-hidden rounded-none bg-[#F5F5F5] snap-start shadow-[0_10px_25px_rgba(0,0,0,0.08)] md:shadow-[0_15px_35px_rgba(0,0,0,0.12)]"
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                
                                {/* Bottom Gradient - Fixed and subtle */}
                                <div className="absolute inset-x-0 bottom-0 h-[54px] md:h-[80px] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Label at Bottom Center/Left as per screenshot */}
                                <div className="absolute bottom-2.5 md:bottom-6 left-2 md:left-4 right-2 md:right-4 text-white z-10">
                                    <div className="flex items-center gap-1 md:gap-1.5 translate-y-0 group-hover:translate-x-1 transition-transform duration-300">
                                        <span className="text-[7.5px] md:text-[13px] font-bold tracking-[0.08em] md:tracking-[0.1em] uppercase whitespace-nowrap drop-shadow-md">
                                            {item.title}
                                        </span>
                                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-white/90" />
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

