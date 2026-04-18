import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Asset imports
import dailyWearBanner from '@assets/explore/gold_daily_wear_banner_1775911015640.png';
import officeWearBanner from '@assets/explore/gold_office_wear_banner_1775911038204.png';

// Import some thumbnails for the small circles
import thumb1 from '@assets/categories/gold_rings_green.png';
import thumb2 from '@assets/categories/gold_earrings_green.png';
import thumb3 from '@assets/categories/gold_pendants_green.png';
import thumb4 from '@assets/categories/gold_bracelets_green.png';

const goldCollections = [
    {
        id: 1,
        label: "EFFORTLESS EVERYDAY",
        title: "DAILY WEAR",
        description: "Minimalist gold pieces for your everyday sparkle",
        image: dailyWearBanner,
        link: "/shop?metal=gold",
        items: [thumb1, thumb2, thumb3]
    },
    {
        id: 2,
        label: "PROFESSIONAL CHIC",
        title: "OFFICE WEAR",
        description: "Sophisticated designs for the modern workplace",
        image: officeWearBanner,
        link: "/shop?metal=gold",
        items: [thumb4, thumb1, thumb2]
    },
    {
        id: 3,
        label: "CELEBRATION READY",
        title: "PARTY WEAR",
        description: "Extravagant gold jewelry for those special moments",
        image: dailyWearBanner, 
        link: "/shop?metal=gold",
        items: [thumb3, thumb4, thumb1]
    }
];

const GoldExploreCollections = () => {
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
        <section className="py-4 md:py-16 bg-white select-none overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1450px]">
                
                {/* Horizontal Scroll Area */}
                <div className="relative group/main">
                    
                    {/* Navigation Arrows */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 rounded-full hidden md:flex items-center justify-center shadow-md opacity-0 group-hover/main:opacity-100 transition-opacity border border-gray-100"
                    >
                        <ChevronLeft className="w-5 h-5 text-black" />
                    </button>

                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 rounded-full hidden md:flex items-center justify-center shadow-md opacity-0 group-hover/main:opacity-100 transition-opacity border border-gray-100"
                    >
                        <ChevronRight className="w-5 h-5 text-black" />
                    </button>

                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-3 md:gap-8 pb-10 md:pb-16 hide-scrollbar scroll-smooth snap-x snap-mandatory"
                    >
                        {goldCollections.map((col, idx) => (
                            <div key={col.id} className="flex-shrink-0 w-[88vw] md:w-[680px] snap-start relative px-1">
                                {/* Main Banner Card */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                    onClick={() => navigate(col.link)}
                                    className="relative h-[200px] sm:h-[220px] md:h-[340px] rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer shadow-2xl group/card border border-gray-100"
                                >
                                    <img 
                                        src={col.image} 
                                        alt={col.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover/card:scale-110"
                                    />
                                    {/* Glassy Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                                    
                                    {/* Text Content */}
                                    <div className="absolute inset-y-0 left-5 md:left-14 flex flex-col justify-center max-w-[78%] md:max-w-[70%] text-white">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 md:px-4 py-0.5 md:py-1 self-start mb-2.5 md:mb-4">
                                            <span className="text-[9px] md:text-[12px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
                                                {col.label}
                                            </span>
                                        </div>
                                        <h3 className="text-[26px] sm:text-[34px] md:text-7xl font-serif font-medium tracking-tight leading-none mb-2.5 md:mb-4 drop-shadow-lg">
                                            {col.title}
                                        </h3>
                                        <div className="h-0.5 w-12 md:w-16 bg-[#D4AF37] mb-2.5 md:mb-4 opacity-0 group-hover/card:opacity-100 transition-all duration-500 group-hover/card:w-20 md:group-hover/card:w-24" />
                                        <p className="text-[11px] sm:text-xs md:text-base font-medium tracking-wide opacity-90 leading-relaxed font-body italic max-w-[260px] md:max-w-sm">
                                            {col.description}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Item Thumbnails */}
                                <div className="absolute -bottom-6 md:-bottom-10 left-6 md:left-16 flex gap-2.5 md:gap-5 z-20">
                                    {col.items.map((img, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-32 md:h-32 bg-white rounded-[16px] sm:rounded-[18px] md:rounded-[32px] shadow-[0_15px_30px_rgba(0,0,0,0.12)] border-2 md:border-4 border-white overflow-hidden flex items-center justify-center md:hover:-translate-y-4 transition-all duration-500 cursor-pointer group/thumb"
                                        >
                                            <img src={img} alt="item" className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
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

export default GoldExploreCollections;

