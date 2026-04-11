import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Asset imports
import edgeBanner from '../../../../assets/explore/edge_banner.png';
import classicsBanner from '../../../../assets/explore/classics_banner.png';
import iykykBanner from '../../../../assets/explore/iykyk_banner.png';
import thumbRing from '../../../../assets/explore/thumb_ring.png';
import thumbChain from '../../../../assets/explore/thumb_chain.png';
import thumbPendant from '../../../../assets/explore/thumb_pendant.png';

const exploreCollections = [
    {
        id: 1,
        title: "EDGE",
        description: "Sleek, silver, and made to turn heads",
        image: edgeBanner,
        link: "/shop?collection=edge",
        items: [thumbRing, thumbChain, thumbRing]
    },
    {
        id: 2,
        title: "THE CLASSICS",
        description: "Because classics never go out of style",
        image: classicsBanner,
        link: "/shop?collection=classics",
        items: [thumbPendant, thumbChain, thumbChain]
    },
    {
        id: 3,
        title: "IYKYK",
        description: "Street style that speaks for itself",
        image: iykykBanner,
        link: "/shop?collection=iykyk",
        items: [thumbPendant, thumbRing, thumbChain]
    }
];

const MenExploreCollections = () => {
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
        <section className="py-6 md:py-10 bg-[#FDF6F2] select-none overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1450px]">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Explore Collections
                    </h2>
                </div>

                {/* Horizontal Scroll Area */}
                <div className="relative group/main">
                    
                    {/* Navigation Arrows */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/main:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="w-5 h-5 text-black" />
                    </button>

                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/main:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="w-5 h-5 text-black" />
                    </button>

                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-4 md:gap-6 pb-12 hide-scrollbar scroll-smooth snap-x snap-mandatory"
                    >
                        {exploreCollections.map((col, idx) => (
                            <div key={col.id} className="flex-shrink-0 w-[85vw] md:w-[600px] snap-start relative">
                                {/* Main Banner Card */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    onClick={() => navigate(col.link)}
                                    className="relative h-[220px] md:h-[280px] rounded-[20px] overflow-hidden cursor-pointer shadow-xl group/card"
                                >
                                    <img 
                                        src={col.image} 
                                        alt={col.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                                    
                                    {/* Text Content */}
                                    <div className="absolute inset-y-0 left-6 md:left-12 flex flex-col justify-center max-w-[60%] text-white">
                                        <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-2 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            {col.title}
                                        </h3>
                                        <p className="text-xs md:text-sm font-medium tracking-wide opacity-80">
                                            {col.description}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Item Thumbnails */}
                                <div className="absolute -bottom-5 md:-bottom-6 left-6 md:left-10 flex gap-2 md:gap-3 z-20">
                                    {col.items.map((img, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                                            className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-[12px] md:rounded-[16px] shadow-lg border border-gray-100 p-2 overflow-hidden flex items-center justify-center hover:-translate-y-1.5 transition-transform duration-300"
                                        >
                                            <img src={img} alt="item" className="w-full h-full object-contain" />
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

export default MenExploreCollections;
