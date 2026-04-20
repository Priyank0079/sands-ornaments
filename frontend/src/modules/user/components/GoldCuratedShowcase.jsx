import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

import ringGreen from '@assets/categories/gold_rings_green.png';

const fallbackCollections = [
    { id: 1, title: 'The Gold Standards', image: ringGreen, path: '/shop?category=Rings' },
    { id: 2, title: 'Pure Green Favourites', image: ringGreen, path: '/shop?category=Rings&search=promise' },
    { id: 3, title: 'Shubh Akshaya Tritiya', image: ringGreen, path: '/shop?metal=gold' },
    { id: 4, title: 'Sands Ornaments', image: ringGreen, path: '/shop?category=Rings&search=vanki' },
    { id: 5, title: 'Crafted in Pure Gold', image: ringGreen, path: '/shop?category=Rings&search=solitaire' },
    { id: 6, title: 'Luxury Ring Sets', image: ringGreen, path: '/shop?category=Rings&search=classic' }
];

const GoldCuratedShowcase = ({ sectionData = null }) => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const collections = useMemo(() => {
        const configured = Array.isArray(sectionData?.items) ? sectionData.items : [];
        if (configured.length === 0) return fallbackCollections;

        return configured.map((item, idx) => ({
            id: item?.itemId || item?.id || `gold-curated-${idx + 1}`,
            title: item?.name || item?.label || fallbackCollections[idx % fallbackCollections.length].title,
            image: resolveLegacyCmsAsset(item?.image, fallbackCollections[idx % fallbackCollections.length].image),
            path: item?.path || fallbackCollections[idx % fallbackCollections.length].path
        }));
    }, [sectionData]);

    const eyebrow = String(sectionData?.settings?.eyebrow || 'Curated Highlights').trim() || 'Curated Highlights';
    const title = String(sectionData?.settings?.title || sectionData?.label || 'Premium Gold Collections').trim() || 'Premium Gold Collections';

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = window.innerWidth > 768 ? 600 : 300;
        scrollRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    };

    return (
        <section className="py-8 md:py-14 bg-white select-none overflow-hidden">
            <div className="w-full">
                <div className="text-center mb-8 md:mb-12 px-4">
                    <span className="inline-flex items-center rounded-none border border-[#D4B390]/30 bg-[#FAF9F0] px-4 py-2.5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-[#2A4D35]">
                        {eyebrow}
                    </span>
                    <h2 className="mt-4 text-[26px] md:text-[36px] font-serif italic font-medium text-[#2A4D35] tracking-tight">
                        {title}
                    </h2>
                </div>

                <div className="relative group/main max-w-[1550px] mx-auto">
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-none flex items-center justify-center shadow-lg border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-all duration-300 hover:bg-[#FAF9F0] active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5 text-[#2A4D35]" />
                    </button>

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
                                onClick={() => navigate(item.path)}
                                className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] aspect-[4/5] relative group cursor-pointer overflow-hidden rounded-none bg-[#0D1C12] snap-start shadow-md border border-gray-200"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110"
                                />

                                <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity" />

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
