import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(timer);
    }, []);

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
                                src={banners[currentIndex].image} 
                                alt={banners[currentIndex].title}
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
                                    {banners[currentIndex].title}
                                </motion.h2>
                                <motion.p 
                                    key={`subtitle-${currentIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-white/90 text-sm md:text-xl font-light italic drop-shadow-md"
                                >
                                    {banners[currentIndex].subtitle}
                                </motion.p>
                            </div>
                            
                            {/* Optional Overlay for readability if wanted, but user asked for simple banner */}
                            <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-black/0" />
                            
                            {/* Progress Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                                {banners.map((_, index) => (
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
