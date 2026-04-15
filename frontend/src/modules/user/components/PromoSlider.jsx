import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

// Import Assets
// Import Assets
import heroRings from '../../../assets/hero/hero_rings.png';
import heroBracelets from '../../../assets/hero/hero_bracelets.png';
import heroPendants from '../../../assets/categories/pendants.png';
import heroEarrings from '../../../assets/categories/earrings.png';
import heroMasterpiece from '../../../assets/hero/hero_masterpiece.png';

const SLIDES = [
    {
        id: 5,
        image: heroMasterpiece,
        title: "The Masterpiece Collection",
        subtitle: "Exquisite craftsmanship meets timeless luxury.",
        tag: "Exclusive Launch",
        link: "/category/necklaces"
    },
    {
        id: 1,
        image: heroRings,
        title: "Eternal Silver Rings",
        subtitle: "Handcrafted perfection inspired by timeless traditions.",
        tag: "Boutique Collection",
        link: "/category/rings"
    },
    {
        id: 2,
        image: heroBracelets,
        title: "Graceful Silver Bracelets",
        subtitle: "Minimalist elegance refined for the modern woman.",
        tag: "Premium Silver",
        link: "/category/bracelets"
    },
    {
        id: 3,
        image: heroPendants,
        title: "Celestial Silver Pendants",
        subtitle: "Shine brighter with our artisan-carved collections.",
        tag: "Artisan Series",
        link: "/category/necklaces"
    },
    {
        id: 4,
        image: heroEarrings,
        title: "Ethereal Silver Earrings",
        subtitle: "Delicate designs that capture the essence of luxury.",
        tag: "Limited Edition",
        link: "/category/earrings"
    }
];

const PromoSlider = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['hero-banners'];
    const dynamicSlides = Array.isArray(sectionData?.items)
        ? sectionData.items
            .filter((item) => Boolean(item?.image && item?.label))
            .map((item, index) => ({
                id: item.itemId || item.id || `hero-slide-${index + 1}`,
                image: item.image,
                title: item.label,
                subtitle: item.subtitle || '',
                tag: item.tag || item.name || '',
                link: item.path || '/shop',
                ctaLabel: item.ctaLabel || 'Shop Collection'
            }))
        : [];
    const slides = dynamicSlides.length > 0 ? dynamicSlides : SLIDES;
    const autoplayMs = Number(sectionData?.settings?.autoplayMs) || 4000;
    const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);
    const autoPlayRef = useRef();

    const handleTransitionEnd = () => {
        if (currentIndex === 0) {
            setIsTransitioning(false);
            setCurrentIndex(slides.length);
        } else if (currentIndex === slides.length + 1) {
            setIsTransitioning(false);
            setCurrentIndex(1);
        } else {
            setIsTransitioning(false);
        }
    };

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    }, [isTransitioning]);

    const prevSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    }, [isTransitioning]);

    useEffect(() => {
        if (!isSuspended) {
            autoPlayRef.current = setInterval(nextSlide, autoplayMs);
        }
        return () => clearInterval(autoPlayRef.current);
    }, [nextSlide, isSuspended, autoplayMs]);

    useEffect(() => {
        setCurrentIndex(1);
        setIsTransitioning(false);
    }, [slides.length]);

    return (
        <section 
            className="w-full bg-white pt-0 pb-0 overflow-hidden select-none"
            onMouseEnter={() => setIsSuspended(true)}
            onMouseLeave={() => setIsSuspended(false)}
        >
            <div className="relative w-full h-[220px] md:h-[350px]">
                <motion.div
                    className="flex h-full w-full gap-[1.5%]"
                    animate={{ 
                        x: `calc(4.25% - ${currentIndex * 90}% - ${currentIndex * 1.5}%)` 
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 30,
                        mass: 0.8
                    }}
                    onAnimationComplete={handleTransitionEnd}
                >
                    {extendedSlides.map((slide, idx) => (
                        <div 
                            key={`${idx}-${slide.id}`}
                            className="relative flex-shrink-0 w-[90%] h-full rounded-lg md:rounded-2xl overflow-hidden shadow-2xl bg-gray-50 group"
                        >
                            {/* Professional Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none z-[5]" />
                            
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-[4000ms] ease-out"
                            />
                            
                            {/* Subtle Brand Watermark */}
                            <div className="absolute top-4 left-6 md:top-8 md:left-12 z-20">
                                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1.5 rounded-sm">
                                    A SANDS PRODUCT
                                </span>
                            </div>

                            {/* Refined Content Overlay - Left-aligned for high-end professional look */}
                            <div className="absolute inset-y-0 left-0 w-full md:w-[65%] flex flex-col justify-center px-8 md:px-20 z-10">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={currentIndex === idx ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-white flex flex-col items-start"
                                >
                                    <div className="flex items-center gap-3 mb-2 md:mb-4">
                                        <div className="w-8 h-[2px] bg-[#9C5B61]"></div>
                                        <span className="text-[10px] md:text-sm text-[#9C5B61] font-bold uppercase tracking-[0.4em]">
                                            {slide.tag}
                                        </span>
                                    </div>
                                    
                                    <h2 className="font-serif text-2xl md:text-5xl font-bold leading-tight mb-1 md:mb-3 drop-shadow-lg max-w-[90%] md:max-w-xl">
                                        {slide.title}
                                    </h2>

                                    <p className="text-white/80 text-[10px] md:text-base font-light leading-relaxed mb-3 md:mb-6 max-w-md tracking-wide line-clamp-2 md:line-clamp-none">
                                        {slide.subtitle}
                                    </p>
                                    
                                    <Link
                                        to={slide.link}
                                        className="relative group inline-flex items-center justify-center bg-[#9C5B61] text-white hover:bg-white hover:text-[#9C5B61] font-bold text-[10px] md:text-sm uppercase tracking-[0.2em] px-8 py-3 md:px-12 md:py-4 transition-all duration-300 overflow-hidden shadow-xl"
                                    >
                                        <span className="relative z-10">{slide.ctaLabel || 'Shop Collection'}</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Tanishq-style Diamond Indicators */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                    {slides.map((_, i) => {
                        const isActive = (currentIndex - 1 + slides.length) % slides.length === i;
                        return (
                            <button
                                key={i}
                                onClick={() => !isTransitioning && setCurrentIndex(i + 1)}
                                className={`w-2 h-2 transition-all duration-500 transform rotate-45 border ${isActive ? 'bg-[#9C5B61] border-[#9C5B61] scale-125' : 'bg-transparent border-white/40'}`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PromoSlider;
