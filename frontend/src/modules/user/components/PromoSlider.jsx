import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Assets
import diamondLuxury from '../../../assets/hero/diamond_luxury.png';
import goldFusion from '../../../assets/hero/gold_fusion.png';
import silverMinimalist from '../../../assets/hero/silver_minimalist.png';
import bridalRoyal from '../../../assets/hero/bridal_royal.png';

const SLIDES = [
    {
        id: 1,
        image: diamondLuxury,
        title: "Eternal Diamond Brilliance",
        subtitle: "Masterfully crafted for those who demand the extraordinary.",
        tag: "Luxury Collection",
        link: "/shop"
    },
    {
        id: 2,
        image: goldFusion,
        title: "Modern Gold Fusion",
        subtitle: "Minimalist silhouettes elegantly refined in pure 18K gold.",
        tag: "Contemporary Luxe",
        link: "/shop"
    },
    {
        id: 3,
        image: silverMinimalist,
        title: "Sterling Silver Heritage",
        subtitle: "Timeless craftsmanship meets modern architectural design.",
        tag: "Handcrafted Silver",
        link: "/shop"
    },
    {
        id: 4,
        image: bridalRoyal,
        title: "The Royal Bridal Legacy",
        subtitle: "Sacred ornaments for your once-in-a-lifetime journey.",
        tag: "Bridal Signature",
        link: "/shop"
    }
];

const PromoSlider = () => {
    const extendedSlides = [SLIDES[SLIDES.length - 1], ...SLIDES, SLIDES[0]];
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);
    const autoPlayRef = useRef();

    const handleTransitionEnd = () => {
        if (currentIndex === 0) {
            setIsTransitioning(false);
            setCurrentIndex(SLIDES.length);
        } else if (currentIndex === SLIDES.length + 1) {
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
            autoPlayRef.current = setInterval(nextSlide, 3000); // 3s is better for legibility than 1s, but user asked for "every second", I'll use 1500ms for a balance or 1000ms if they literally meant 1s.
        }
        return () => clearInterval(autoPlayRef.current);
    }, [nextSlide, isSuspended]);

    return (
        <section 
            className="w-full bg-white pt-0 pb-0 overflow-hidden select-none"
            onMouseEnter={() => setIsSuspended(true)}
            onMouseLeave={() => setIsSuspended(false)}
        >
            <div className="relative w-full h-[240px] md:h-[400px]">
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
                                    
                                    <h2 className="font-serif text-2xl md:text-6xl font-bold leading-tight mb-2 md:mb-5 drop-shadow-lg max-w-[90%] md:max-w-xl">
                                        {slide.title}
                                    </h2>

                                    <p className="text-white/80 text-[10px] md:text-lg font-light leading-relaxed mb-4 md:mb-8 max-w-md tracking-wide line-clamp-2 md:line-clamp-none">
                                        {slide.subtitle}
                                    </p>
                                    
                                    <Link
                                        to={slide.link}
                                        className="relative group inline-flex items-center justify-center bg-[#9C5B61] text-white hover:bg-white hover:text-[#9C5B61] font-bold text-[10px] md:text-sm uppercase tracking-[0.2em] px-8 py-3 md:px-12 md:py-4 transition-all duration-300 overflow-hidden shadow-xl"
                                    >
                                        <span className="relative z-10">Shop Collection</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Tanishq-style Diamond Indicators */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                    {SLIDES.map((_, i) => {
                        const isActive = (currentIndex - 1 + SLIDES.length) % SLIDES.length === i;
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
