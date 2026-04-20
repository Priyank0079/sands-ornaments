import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import familyHeroBanner from '@assets/family_hero_banner_4k.jpg';
import { buildFamilyShopPath } from '../../utils/familyNavigation';
import { resolveLegacyCmsAsset } from '../../utils/legacyCmsAssets';

const defaultSlides = [
    {
        id: 'family-hero-default',
        tag: 'The Sands Family Boutique',
        title: 'Masterpiece ',
        titleItalic: 'Gifting',
        subtitle: 'Exquisite delicate treasures designed for those who matter most in your life.',
        image: familyHeroBanner,
        ctaLabel: 'Explore Catalog',
        path: buildFamilyShopPath()
    }
];

const splitTitle = (label = '') => {
    const source = String(label || '').trim();
    if (!source) return { title: 'Masterpiece ', titleItalic: 'Gifting' };
    const parts = source.split(' ');
    if (parts.length < 2) return { title: `${source} `, titleItalic: '' };
    const italic = parts.pop();
    return { title: `${parts.join(' ')} `, titleItalic: italic };
};

const FamilyHeroCarousel = ({ sectionData }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [brokenSlideIds, setBrokenSlideIds] = useState({});

    const slides = useMemo(() => {
        const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
        const mapped = configuredItems
            .filter((item) => item?.label || item?.name || item?.image)
            .map((item, index) => {
                const { title, titleItalic } = splitTitle(item.label || item.name || defaultSlides[0].title.trim());
                return {
                    id: item.itemId || item.id || `family-hero-${index + 1}`,
                    tag: String(item.tag || defaultSlides[0].tag).trim() || defaultSlides[0].tag,
                    title,
                    titleItalic,
                    subtitle: String(item.subtitle || defaultSlides[0].subtitle).trim() || defaultSlides[0].subtitle,
                    image: resolveLegacyCmsAsset(item.image, defaultSlides[0].image),
                    ctaLabel: String(item.ctaLabel || defaultSlides[0].ctaLabel).trim() || defaultSlides[0].ctaLabel,
                    path: item.path || buildFamilyShopPath()
                };
            });

        return mapped.length > 0 ? mapped : defaultSlides;
    }, [sectionData]);

    useEffect(() => {
        setBrokenSlideIds({});
        setCurrentIndex(0);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return undefined;
        const autoplayMs = Number(sectionData?.settings?.autoplayMs) || 5000;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => ((prev + 1) % slides.length));
        }, autoplayMs);
        return () => clearInterval(interval);
    }, [slides.length, sectionData?.settings?.autoplayMs]);

    const activeSlide = slides[currentIndex] || defaultSlides[0];
    const activeImage = brokenSlideIds[activeSlide.id] ? defaultSlides[0].image : activeSlide.image;

    return (
        <section className="relative w-full h-[220px] md:h-[450px] overflow-hidden select-none bg-[#111]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full"
            >
                {/* Background Image with slow zoom animation */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] scale-100 animate-slow-zoom"
                    style={{ 
                        backgroundImage: `url(${activeImage})`, 
                        backgroundPosition: 'center 40%',
                        filter: 'hue-rotate(330deg) brightness(0.85) contrast(1.15) saturate(1.2)' 
                    }}
                />
                <img
                    src={activeImage}
                    alt=""
                    className="hidden"
                    onError={() => setBrokenSlideIds((prev) => ({ ...prev, [activeSlide.id]: true }))}
                />
                
                {/* Dark & Elegant Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2a0e16]/80 via-[#2a0e16]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[#FFD9E0]/5 mix-blend-overlay" />

                {/* Content Overlay */}
                <div className="relative h-full container mx-auto px-6 md:px-20 flex flex-col justify-center items-start text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-xl"
                    >
                        <span className="inline-block text-[7px] md:text-[10px] text-[#FFD9E0] tracking-[0.3em] md:tracking-[0.4em] uppercase mb-2 md:mb-4 font-black border-l-2 border-[#FFD9E0]/50 pl-2 md:pl-3">
                            {activeSlide.tag}
                        </span>

                        <h1 className="text-3xl md:text-6xl font-serif text-white tracking-tight font-light leading-[1.1] mb-1 md:mb-2 drop-shadow-lg">
                            {activeSlide.title}<br />
                            <span className="italic text-[#FFD9E0]">
                                {activeSlide.titleItalic}
                            </span>
                        </h1>

                        <p className="text-[10px] md:text-sm text-white/80 font-light mt-2 mb-4 md:mt-4 md:mb-8 tracking-wider max-w-sm leading-relaxed italic drop-shadow-md">
                            "{activeSlide.subtitle}"
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(activeSlide.path)}
                                className="px-5 py-2 md:px-8 md:py-3 bg-[#FFD9E0] text-[#8E2B45] text-[7px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] rounded-none hover:bg-white transition-all shadow-2xl flex items-center gap-2 md:gap-3 backdrop-blur-sm"
                            >
                                <ShoppingBag className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                {activeSlide.ctaLabel}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />

            <style>
                {`
                    @keyframes slowZoom {
                        from { transform: scale(1); }
                        to { transform: scale(1.05); }
                    }
                    .animate-slow-zoom {
                        animation: slowZoom 12s linear infinite alternate;
                    }
                `}
            </style>
        </section>
    );
};

export default FamilyHeroCarousel;

