import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

import bannerMasterpiece from '@assets/hero/hero_masterpiece.png';
import bannerBridal from '@assets/hero/bridal_royal.png';

const banners = [
    {
        id: 1,
        image: bannerMasterpiece,
        title: 'Celestial Silver Masterpieces',
        subtitle: 'Artisan Crafted Jewels for Timeless Stories',
        ctaLabel: 'Discover Now'
    },
    {
        id: 2,
        image: bannerBridal,
        title: 'The Royal Bridal Heritage',
        subtitle: 'Ethereal Grace for Your Eternal Vows',
        ctaLabel: 'Explore Bridal'
    }
];

const AutoBannerSection = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['auto-banner-section'];
    const dynamicBanners = useMemo(() => {
        const items = Array.isArray(sectionData?.items) ? sectionData.items : [];
        return items
            .filter((item) => Boolean(item?.image && item?.label))
            .map((item, index) => ({
                id: item.itemId || item.id || `auto-banner-${index + 1}`,
                image: resolveLegacyCmsAsset(item.image, item.image),
                title: item.label,
                subtitle: item.subtitle || '',
                link: item.path || '/shop',
                ctaLabel: item.ctaLabel || 'Explore Collection'
            }));
    }, [sectionData?.items]);
    const slides = dynamicBanners.length > 0 ? dynamicBanners : banners;
    const autoplayMs = Number(sectionData?.settings?.autoplayMs) || 5000;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, autoplayMs);
        return () => clearInterval(timer);
    }, [autoplayMs, slides.length]);

    useEffect(() => {
        if (currentIndex >= slides.length) {
            setCurrentIndex(0);
        }
    }, [currentIndex, slides.length]);

    return (
        <section className="w-full relative overflow-hidden bg-white pt-10 md:pt-16 pb-0">
            <div className="container mx-auto px-4 mb-8 md:mb-12 text-center">
                <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-[#8E2B45] text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-3 block"
                >
                    Premium Narrative
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-4xl font-serif text-gray-900 tracking-tight"
                >
                    Signature <span className="italic font-light text-[#8E2B45]">Curations</span>
                </motion.h2>
                <div className="w-12 h-[2px] bg-[#8E2B45]/20 mx-auto mt-4 rounded-full" />
            </div>

            <div className="w-full h-[220px] md:h-[420px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <div className="w-full h-full relative group">
                            {/* Banner Image with subtle zoom */}
                            <motion.img 
                                key={`img-${currentIndex}`}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 5 }}
                                src={slides[currentIndex].image} 
                                alt={slides[currentIndex].title}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Premium Content Overlay */}
                            <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-center px-4">
                                <div className="max-w-4xl space-y-4 md:space-y-6">
                                    <motion.p 
                                        key={`subtitle-${currentIndex}`}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-[#D9C4B1] text-[9px] md:text-sm font-bold uppercase tracking-[0.4em]"
                                    >
                                        {slides[currentIndex].subtitle}
                                    </motion.p>

                                    <motion.h2 
                                        key={`title-${currentIndex}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-white text-3xl md:text-7xl font-serif italic leading-tight drop-shadow-2xl"
                                    >
                                        {slides[currentIndex].title}
                                    </motion.h2>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <Link
                                            to={slides[currentIndex].link || '/shop'}
                                            className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/30 px-8 py-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-[#5B1E26] transition-all duration-500 shadow-2xl"
                                        >
                                            {slides[currentIndex].ctaLabel || 'Explore Collection'}
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                            
                            {/* Optional Overlay for readability if wanted, but user asked for simple banner */}
                            <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-black/0" />
                            
                            {/* Progress Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-1.5 transition-all duration-300 ${
                                            index === currentIndex ? 'w-10 bg-white' : 'w-4 bg-white/40'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default AutoBannerSection;

