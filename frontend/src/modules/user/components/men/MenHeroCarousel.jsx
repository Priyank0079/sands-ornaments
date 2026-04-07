import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const slides = [
    {
        id: 1,
        brandTitle: "SANDS BRINGS TO YOU",
        mainTitle1: "STRENGTH",
        mainTitle2: "IN",
        mainTitleScript: "Style",
        rightTitle: "Modern Silver for\nthe Bold Man",
        cta: "SHOP NOW",
        link: "/shop?category=men",
        image: "/images/men-hero/slide1.png",
    },
    {
        id: 2,
        brandTitle: "TIMELESS CRAFTSMANSHIP",
        mainTitle1: "MODERN",
        mainTitle2: "MEN",
        mainTitleScript: "Silver",
        rightTitle: "Classic Designs,\nContemporary Edge",
        cta: "DISCOVER",
        link: "/shop?category=men&sort=trending",
        image: "/images/men-hero/slide2.png",
    },
    {
        id: 3,
        brandTitle: "THE LUXURY COLLECTION",
        mainTitle1: "ELEVATE",
        mainTitle2: "YOUR",
        mainTitleScript: "Look",
        rightTitle: "Signature Pieces for\nEvery Occasion",
        cta: "EXPLORE",
        link: "/shop?category=men",
        image: "/images/men-hero/slide3.png",
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center pt-8 pb-8 px-4 md:px-12"
                >
                    {/* The Inner Framed Box like the screenshot */}
                    <div className="relative w-full max-w-[1400px] h-full border border-white/20 flex items-center overflow-hidden">
                        
                        {/* Background Model Centered */}
                        <div className="absolute inset-x-0 bottom-0 h-full flex justify-center items-end z-0">
                            <motion.img 
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2 }}
                                src={slides[current].image}
                                alt="Men Jewelry Model"
                                className="h-[110%] w-auto object-contain object-bottom mix-blend-screen opacity-90"
                            />
                        </div>

                        {/* Content Grid Container */}
                        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3 h-full items-center px-4 md:px-16">
                            
                            {/* Left Side: Brand & Title */}
                            <div className="text-white flex flex-col justify-center">
                                <motion.p 
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-[9px] md:text-[11px] font-medium tracking-[0.4em] uppercase mb-4 opacity-70"
                                >
                                    SANDS BRINGS TO YOU
                                </motion.p>
                                
                                <div className="leading-none select-none">
                                    <motion.h1 
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-6xl md:text-8xl font-bold tracking-tighter"
                                    >
                                        MEN
                                    </motion.h1>
                                    <div className="flex items-center gap-3 -mt-2 md:-mt-4">
                                        <motion.span 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                            className="text-sm md:text-xl font-light uppercase tracking-widest"
                                        >
                                            IN
                                        </motion.span>
                                        <motion.span 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8, type: "spring" }}
                                            className="text-4xl md:text-7xl italic font-serif"
                                            style={{ fontFamily: "'Dancing Script', 'Playball', cursive" }}
                                        >
                                            Silver
                                        </motion.span>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Reserved for Model in Background */}
                            <div className="hidden md:block"></div>

                            {/* Right Side: Quote & Button */}
                            <div className="text-white flex flex-col md:items-end md:text-right justify-center">
                                <motion.h2 
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-xl md:text-4xl font-medium mb-8 leading-[1.3] max-w-[300px]"
                                >
                                    {slides[current].rightTitle}
                                </motion.h2>
                                
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <Link
                                        to={slides[current].link}
                                        className="px-8 py-2 md:px-12 md:py-2.5 bg-white text-black text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors"
                                    >
                                        {slides[current].cta}
                                    </Link>
                                </motion.div>
                            </div>

                        </div>

                        {/* Vignette Overlays inside the box */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-transparent to-[#111] opacity-60 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-40 pointer-events-none" />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`transition-all duration-500 rounded-full ${
                            current === idx 
                                ? 'w-10 h-1 bg-white' 
                                : 'w-4 h-1 bg-white/20 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
            `}} />
        </section>
    );
};

export default MenHeroCarousel;
