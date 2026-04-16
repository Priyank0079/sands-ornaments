import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

import bannerMasterpiece from '../../../assets/hero/hero_masterpiece.png';
import bannerBridal from '../../../assets/hero/bridal_royal.png';

const banners = [
    {
        id: 1,
        image: bannerMasterpiece,
        title: 'Discover Your Unique Story in Diamonds',
        subtitle: 'Timeless pieces for your most memorable moments.'
    },
    {
        id: 2,
        image: bannerBridal,
        title: 'Exquisite Bridal Collection',
        subtitle: 'Crafted for Elegance and Eternal Love'
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
        <section className="w-full relative overflow-hidden bg-white">
            <div className="w-full h-[160px] md:h-[280px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <div className="w-full h-full relative group">
                            {/* Banner Image */}
                            <img 
                                src={slides[currentIndex].image} 
                                alt={slides[currentIndex].title}
                                className="w-full h-full object-cover rounded-none"
                            />
                            
                            {/* Premium Content Overlay */}
                            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-4">
                                <motion.h2 
                                    key={`title-${currentIndex}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-white text-2xl md:text-5xl font-serif font-bold mb-2 drop-shadow-lg"
                                >
                                    {slides[currentIndex].title}
                                </motion.h2>
                                <motion.p 
                                    key={`subtitle-${currentIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-white/90 text-sm md:text-xl font-light italic drop-shadow-md"
                                >
                                    {slides[currentIndex].subtitle}
                                </motion.p>
                                <Link
                                    to={slides[currentIndex].link || '/shop'}
                                    className="mt-4 inline-flex items-center justify-center rounded-full bg-white/95 px-6 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#5B1E26] hover:bg-white transition-all"
                                >
                                    {slides[currentIndex].ctaLabel || 'Explore Collection'}
                                </Link>
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
