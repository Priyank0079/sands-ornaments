import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomepageCms } from '../hooks/useHomepageCms';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

const DynamicPromoBanner = () => {
    const { data: homepageSections = {} } = useHomepageCms();
    const sectionData = homepageSections?.['dynamic-promo-banner'];

    const bannerItems = useMemo(() => {
        const items = Array.isArray(sectionData?.items) ? sectionData.items : [];
        return items
            .filter((item) => Boolean(item?.image)) // image is required
            .map((item, index) => ({
                id: item.itemId || item.id || `dynamic-promo-${index + 1}`,
                image: resolveLegacyCmsAsset(item.image, item.image),
                mobileImage: item.mobileImage ? resolveLegacyCmsAsset(item.mobileImage, item.mobileImage) : null,
                link: item.path || '/shop',
                title: item.label || 'Promo Banner',
                name: item.name || '',
                tag: item.tag || '',
                subtitle: item.subtitle || '',
                ctaLabel: item.ctaLabel || 'Shop Collection'
            }));
    }, [sectionData?.items]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const autoplayMs = Number(sectionData?.settings?.autoplayMs) || 3000;

    useEffect(() => {
        if (bannerItems.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
        }, autoplayMs);
        return () => clearInterval(timer);
    }, [autoplayMs, bannerItems.length]);

    useEffect(() => {
        if (currentIndex >= bannerItems.length) {
            setCurrentIndex(0);
        }
    }, [currentIndex, bannerItems.length]);

    if (bannerItems.length === 0) {
        return null;
    }

    const renderBannerItem = (banner, idx) => {
        const aspectClass = banner.mobileImage ? 'aspect-[16/9] md:aspect-[4/1]' : 'aspect-[4/1]';
        return (
            <Link to={banner.link} className="block w-full">
                {/* 
                    Container locks aspect ratio dynamically.
                    If a mobile image is provided, it uses 16:9 on mobile and 4:1 on desktop.
                    If no mobile image is provided, it uses 4:1 everywhere to prevent cropping the desktop image on mobile screens.
                */}
                <div className={`w-full relative rounded-2xl overflow-hidden shadow-sm group ${aspectClass}`}>
                    
                    {/* Mobile Image */}
                    {banner.mobileImage && (
                        <img
                            src={banner.mobileImage}
                            alt={banner.title}
                            className="absolute inset-0 w-full h-full object-cover block md:hidden"
                            loading={idx === 0 ? "eager" : "lazy"}
                            decoding="async"
                        />
                    )}

                    {/* Desktop Image */}
                    <img
                        src={banner.image}
                        alt={banner.title}
                        className={`absolute inset-0 w-full h-full object-cover ${banner.mobileImage ? 'hidden md:block' : 'block'}`}
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding="async"
                    />

                    {/* Text Overlay */}
                    <div className="absolute top-1 left-2 md:top-8 md:left-12 z-20">
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[4px] sm:text-[6px] md:text-[10px] font-bold uppercase tracking-[0.3em] px-1 py-0.5 md:px-3 md:py-1.5 rounded-sm">
                            {banner.name || 'A SANDS PRODUCT'}
                        </span>
                    </div>

                    <div className="absolute inset-y-0 left-0 w-full md:w-[65%] flex flex-col justify-center px-3 md:px-20 z-10 text-white">
                        {banner.tag && (
                            <div className="flex items-center gap-1 md:gap-3 mb-0.5 md:mb-4">
                                <div className="w-4 md:w-8 h-[1px] md:h-[2px] bg-[#9C5B61]"></div>
                                <span className="text-[5px] sm:text-[7px] md:text-sm text-[#9C5B61] font-bold uppercase tracking-[0.4em]">
                                    {banner.tag}
                                </span>
                            </div>
                        )}

                        {banner.title && (
                            <h2 className="font-serif text-sm sm:text-lg md:text-5xl font-bold leading-none md:leading-tight mb-0.5 md:mb-3 drop-shadow-lg max-w-[90%] md:max-w-xl">
                                {banner.title}
                            </h2>
                        )}

                        {banner.subtitle && (
                            <p className="text-white/80 text-[5px] sm:text-[7px] md:text-base font-light leading-tight md:leading-relaxed mb-1 md:mb-6 max-w-md tracking-wide line-clamp-2 md:line-clamp-none">
                                {banner.subtitle}
                            </p>
                        )}

                        <span
                            className="relative group inline-flex items-center justify-center bg-[#9C5B61] text-white hover:bg-white hover:text-[#9C5B61] font-bold text-[5px] sm:text-[6px] md:text-sm uppercase tracking-[0.2em] px-2 py-0.5 md:px-12 md:py-4 transition-all duration-300 overflow-hidden shadow-xl w-max"
                        >
                            <span className="relative z-10">{banner.ctaLabel}</span>
                        </span>
                    </div>
                </div>
            </Link>
        );
    };

    if (bannerItems.length === 1) {
        return (
            <section className="w-full bg-white">
                <div className="container mx-auto px-4">
                    {renderBannerItem(bannerItems[0], 0)}
                </div>
            </section>
        );
    }

    const activeBanner = bannerItems[currentIndex];
    const bannerContainerAspect = activeBanner.mobileImage ? 'aspect-[16/9] md:aspect-[4/1]' : 'aspect-[4/1]';

    return (
        <section className="w-full bg-white relative">
            <div className="container mx-auto px-4">
                <div className={`w-full relative ${bannerContainerAspect}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {renderBannerItem(activeBanner, currentIndex)}
                        </motion.div>
                    </AnimatePresence>

                    {/* Sliding Line Indicators */}
                    <div className="absolute bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 md:gap-3 z-30">
                        {bannerItems.map((_, i) => {
                            const isActive = i === currentIndex;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-[2px] md:h-1 transition-all duration-500 rounded-full ${
                                        isActive ? 'w-6 md:w-10 bg-white' : 'w-2 md:w-4 bg-white/40 hover:bg-white/70'
                                    }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DynamicPromoBanner;
