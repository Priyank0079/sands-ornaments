import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Asset imports
import partySparkImg from '../../../../assets/glam/party_spark.png';
import weddingJewelsImg from '../../../../assets/glam/wedding_jewels.png';
import ritualRangeImg from '../../../../assets/glam/ritual_range.png';
import dailyWearImg from '../../../../assets/glam/daily_wear.png';
import officeWearImg from '../../../../assets/glam/office_wear.png';

const glamItems = [
    { id: 1, title: 'Party Spark', image: partySparkImg },
    { id: 2, title: 'Wedding Jewels', image: weddingJewelsImg },
    { id: 3, title: 'Ritual Range', image: ritualRangeImg },
    { id: 4, title: 'Daily Wear', image: dailyWearImg },
    { id: 5, title: 'Office Wear', image: officeWearImg },
];

const MenPickYourGlam = () => {
    const [activeIndex, setActiveIndex] = useState(2); // Start with Ritual Range in middle
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const next = () => setActiveIndex((prev) => (prev + 1) % glamItems.length);
    const prev = () => setActiveIndex((prev) => (prev - 1 + glamItems.length) % glamItems.length);

    return (
        <section className="py-4 md:py-8 bg-[#F9FAFB] overflow-hidden select-none">
            <div className="container mx-auto px-4 max-w-[1200px]">
                {/* Header */}
                <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight font-serif italic" style={{ fontFamily: "'Cinzel', serif" }}>
                        Pick Your Glam
                    </h2>
                </div>

                {/* Carousel Container */}
                <div className="relative flex items-center justify-center">
                    
                    {/* Navigation Arrows - Compact Style */}
                    <button 
                        onClick={prev}
                        className="absolute left-0 md:left-4 z-30 p-1.5 md:p-2 rounded-full bg-white/60 backdrop-blur-md hover:bg-white transition-all shadow-sm group"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-black" />
                    </button>

                    <button 
                        onClick={next}
                        className="absolute right-0 md:right-4 z-30 p-1.5 md:p-2 rounded-full bg-white/60 backdrop-blur-md hover:bg-white transition-all shadow-sm group"
                    >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-black" />
                    </button>

                    <div className="flex items-center justify-center gap-2 md:gap-3 w-full">
                        {glamItems.map((item, idx) => {
                            let diff = idx - activeIndex;
                            if (diff < -2) diff += glamItems.length;
                            if (diff > 2) diff -= glamItems.length;

                            const isActive = diff === 0;
                            const isVisible = isMobile ? isActive : Math.abs(diff) <= 2;

                            if (!isVisible) return null;

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ 
                                        opacity: isActive ? 1 : 0.5,
                                        scale: isActive ? 1.05 : 0.85,
                                        zIndex: isActive ? 20 : 10,
                                        filter: isActive ? 'grayscale(0%)' : 'grayscale(60%)',
                                    }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className={`relative flex-shrink-0 cursor-pointer overflow-hidden rounded-[16px] md:rounded-[24px] border-[4px] md:border-[6px] border-white shadow-xl ${
                                        isActive ? 'w-[160px] h-[280px] md:w-[240px] md:h-[400px]' : 'w-[110px] h-[200px] md:w-[170px] md:h-[300px]'
                                    }`}
                                    onClick={() => setActiveIndex(idx)}
                                >
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Pill Label - Compact */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%]">
                                        <div className={`py-1.5 md:py-2 rounded-full bg-white/95 text-center shadow-md transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                                            <span className="text-[9px] md:text-[12px] font-bold text-gray-800 tracking-tight whitespace-nowrap px-3 uppercase">
                                                {item.title}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                `}
            </style>
        </section>
    );
};

export default MenPickYourGlam;
