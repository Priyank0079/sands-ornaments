import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildWomenShopPath } from '../../utils/womenNavigation';
import { resolveLegacyCmsAsset } from '../../utils/legacyCmsAssets';
import heroRadiance from '@assets/women_hero_radiance.png';

const defaultSlides = [
    {
        id: 'women-hero-default',
        title: 'Eternal ',
        titleItalic: 'Radiance',
        subtitle: 'Diamonds that capture the light and her heart.',
        image: heroRadiance,
        cta: 'Shop Diamonds',
        path: buildWomenShopPath({ category: 'women' }),
        accent: '#FFFFFF'
    }
];

const splitTitle = (label = '') => {
    const source = String(label || '').trim();
    if (!source) return { title: 'Eternal ', titleItalic: 'Radiance' };
    const parts = source.split(' ');
    if (parts.length < 2) return { title: `${source} `, titleItalic: '' };
    const italic = parts.pop();
    return { title: `${parts.join(' ')} `, titleItalic: italic };
};

const WomenHeroCarousel = ({ sectionData }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [brokenSlideIds, setBrokenSlideIds] = useState({});

    const slides = useMemo(() => {
        const configured = Array.isArray(sectionData?.items) ? sectionData.items : [];
        const mapped = configured
            .filter((item) => item?.label || item?.name || item?.image)
            .map((item, index) => {
                const { title, titleItalic } = splitTitle(item.label || item.name || defaultSlides[0].title.trim());
                return {
                    id: item.itemId || item.id || `women-hero-${index + 1}`,
                    title,
                    titleItalic,
                    subtitle: item.subtitle || defaultSlides[0].subtitle,
                    image: resolveLegacyCmsAsset(item.image, defaultSlides[0].image),
                    cta: item.ctaLabel || defaultSlides[0].cta,
                    path: item.path || buildWomenShopPath({ category: 'women' }),
                    accent: defaultSlides[0].accent
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

    const slide = slides[currentIndex] || defaultSlides[0];
    const activeImage = brokenSlideIds[slide.id] ? defaultSlides[0].image : slide.image;

    return (
        <section className="relative w-full h-[200px] md:h-[400px] overflow-hidden select-none">
            <div className="absolute inset-0 w-full h-full">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-105"
                    style={{ backgroundImage: `url(${activeImage})`, backgroundPosition: 'center 35%' }}
                />
                <img
                    src={activeImage}
                    alt=""
                    className="hidden"
                    onError={() => setBrokenSlideIds((prev) => ({ ...prev, [slide.id]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />

                <div className="relative h-full container mx-auto px-6 md:px-20 flex flex-col justify-center items-end text-right">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-xl"
                    >
                        <span className="inline-block text-[8px] md:text-xs text-white/50 tracking-[0.3em] md:tracking-[0.5em] uppercase mb-2 md:mb-4 font-bold border-r-2 border-white/30 pr-2 md:pr-4">
                            Sands Ornaments Exclusive
                        </span>

                        <h1 className="text-4xl md:text-8xl font-serif text-white tracking-tight font-light leading-[1] transition-all">
                            {slide.title}
                            <span className="italic" style={{ color: slide.accent }}>
                                {slide.titleItalic}
                            </span>
                        </h1>

                        <p className="text-xs md:text-lg text-white/80 font-light mt-2 mb-4 md:mt-4 md:mb-8 tracking-wide italic">
                            {slide.subtitle}
                        </p>

                        <div className="flex flex-wrap gap-4 justify-end">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(slide.path)}
                                className="px-5 py-2 md:px-8 md:py-4 bg-white text-black text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-none hover:bg-black hover:text-white transition-all shadow-2xl flex items-center gap-2 md:gap-3 group"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                {slide.cta}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />
            </div>
        </section>
    );
};

export default WomenHeroCarousel;
