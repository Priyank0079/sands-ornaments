import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import heroMenBold from '../../assets/men_hero_bold.png';
import heroMenStyle from '../../assets/men_hero_style.png';
import heroMenElite from '../../assets/men_hero_elite.png';

const slides = [
    {
        id: 1,
        brandTitle: "SANDS BRINGS TO YOU",
        mainTitle: "MEN",
        scriptTitle: "Silver",
        rightTitle: "Modern Silver for\nthe Bold Man",
        cta: "SHOP NOW",
        link: "/shop?category=men",
        image: heroMenBold,
    },
    {
        id: 2,
        brandTitle: "TIMELESS CRAFTSMANSHIP",
        mainTitle: "BOLD",
        scriptTitle: "Style",
        rightTitle: "Classic Designs,\nContemporary Edge",
        cta: "DISCOVER",
        link: "/shop?category=men&sort=trending",
        image: heroMenStyle,
    },
    {
        id: 3,
        brandTitle: "THE LUXURY COLLECTION",
        mainTitle: "ELITE",
        scriptTitle: "Look",
        rightTitle: "Signature Pieces for\nEvery Occasion",
        cta: "EXPLORE",
        link: "/shop?category=men",
        image: heroMenElite,
    }
];

const MenHeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-[#111111]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 1.0 }}
                    className="absolute inset-0"
                >
                    {/* Full-width Background Image */}
                    <img
                        src={slides[current].image}
                        alt="Men Jewelry Model"
                        className="w-full h-full object-cover object-center"
                    />

                    {/* Dark gradient overlays for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </motion.div>
            </AnimatePresence>

            {/* Text Content */}
            <div className="absolute inset-0 z-10 flex items-center">
                <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

                    {/* Left: Brand & Main Title */}
                    <div className="text-white flex flex-col justify-center">
                        <motion.p
                            key={`brand-${current}`}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-[9px] md:text-[11px] font-medium tracking-[0.4em] uppercase mb-3 md:mb-4 opacity-70"
                        >
                            {slides[current].brandTitle}
                        </motion.p>

                        <div className="leading-none select-none">
                            <motion.h1
                                key={`title-${current}`}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter"
                            >
                                {slides[current].mainTitle}
                            </motion.h1>
                            <div className="flex items-center gap-2 md:gap-3 -mt-2 md:-mt-4">
                                <motion.span
                                    key={`in-${current}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-sm md:text-xl font-light uppercase tracking-widest"
                                >
                                    IN
                                </motion.span>
                                <motion.span
                                    key={`script-${current}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, type: "spring" }}
                                    className="text-4xl sm:text-5xl md:text-7xl italic font-serif"
                                    style={{ fontFamily: "'Dancing Script', 'Playball', cursive" }}
                                >
                                    {slides[current].scriptTitle}
                                </motion.span>
                            </div>
                        </div>
                    </div>

                    {/* Center: empty on mobile, spacer on desktop */}
                    <div className="hidden md:block" />

                    {/* Right: Quote & CTA */}
                    <div className="text-white flex flex-col items-start md:items-end md:text-right justify-center">
                        <motion.h2
                            key={`right-${current}`}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-lg sm:text-2xl md:text-4xl font-medium mb-5 md:mb-8 leading-[1.3] max-w-[260px] md:max-w-[300px] whitespace-pre-line"
                        >
                            {slides[current].rightTitle}
                        </motion.h2>

                        <motion.div
                            key={`cta-${current}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <Link
                                to={slides[current].link}
                                className="px-7 py-2.5 md:px-12 md:py-3 bg-white text-black text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-100 transition-colors inline-block"
                            >
                                {slides[current].cta}
                            </Link>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`transition-all duration-500 rounded-full ${
                            current === idx
                                ? 'w-10 h-1 bg-white'
                                : 'w-4 h-1 bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`
            }} />
        </section>
    );
};

export default MenHeroCarousel;
