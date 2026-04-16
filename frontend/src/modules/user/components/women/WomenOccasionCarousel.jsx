import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildWomenShopPath } from '../../utils/womenNavigation';

// Import local images
import TempleDateImg from '../../../../assets/occasions/TempleDate.png';
import GirlOutingImg from '../../../../assets/occasions/GirlOuting.png';
import DateNightImg from '../../../../assets/occasions/DateNight.png';
import PartyGlamImg from '../../../../assets/occasions/PartyGlam.png';
import GotHitchedImg from '../../../../assets/occasions/GotHitched.png';

const occasions = [
    {
        id: 1,
        title: "Temple Date",
        image: TempleDateImg,
        path: buildWomenShopPath({ occasion: 'temple-date' }),
        height: "h-[350px] md:h-[450px]"
    },
    {
        id: 2,
        title: "Girl Outing",
        image: GirlOutingImg,
        path: buildWomenShopPath({ occasion: 'girl-outing' }),
        height: "h-[400px] md:h-[500px]"
    },
    {
        id: 3,
        title: "Date Night",
        image: DateNightImg,
        path: buildWomenShopPath({ occasion: 'date-night' }),
        height: "h-[450px] md:h-[550px]",
        featured: true
    },
    {
        id: 4,
        title: "Party Glam",
        image: PartyGlamImg,
        path: buildWomenShopPath({ occasion: 'party-glam' }),
        height: "h-[400px] md:h-[500px]"
    },
    {
        id: 5,
        title: "Got Hitched",
        image: GotHitchedImg,
        path: buildWomenShopPath({ occasion: 'wedding' }),
        height: "h-[350px] md:h-[450px]"
    }
];

const WomenOccasionCarousel = ({ data }) => {
    const navigate = useNavigate();
    const activeOccasions = data?.items?.length > 0 ? data.items : occasions;
    const [activeIndex, setActiveIndex] = useState(2);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cardWidth = isMobile ? 120 : 180;
    const gap = isMobile ? 8 : 12;

    const next = () => setActiveIndex((prev) => (prev + 1) % activeOccasions.length);
    const prev = () => setActiveIndex((prev) => (prev - 1 + activeOccasions.length) % activeOccasions.length);

    return (
        <section className="py-6 md:py-10 bg-[#FBF0F2] overflow-hidden select-none">
            <div className="container mx-auto px-4 max-w-[1200px]">
                <div className="text-center mb-6 md:mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#333] tracking-tight font-serif italic" style={{ fontFamily: "'Cinzel', serif" }}>
                        {data?.settings?.title || "Shop by Occasion"}
                    </h3>
                </div>

                <div className="relative flex items-center justify-center">
                    {/* Navigation - Compact Style */}
                    <button onClick={prev} className="absolute left-0 md:left-4 z-40 p-2 rounded-full bg-white/60 backdrop-blur-md hover:bg-white shadow-sm group">
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-black" />
                    </button>
                    <button onClick={next} className="absolute right-0 md:right-4 z-40 p-2 rounded-full bg-white/60 backdrop-blur-md hover:bg-white shadow-sm group">
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-black" />
                    </button>

                    <div className="w-full flex justify-center">
                        <motion.div 
                            className="flex items-center gap-2 md:gap-3"
                            animate={{ x: (2 - activeIndex) * (cardWidth + gap) }}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        >
                            {activeOccasions.map((item, idx) => {
                                const isActive = idx === activeIndex;

                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        animate={{ 
                                            opacity: isActive ? 1 : 0.4,
                                            scale: isActive ? 1.05 : 0.85,
                                            zIndex: isActive ? 20 : 10,
                                            filter: isActive ? 'none' : 'grayscale(60%)',
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className={`relative flex-shrink-0 cursor-pointer overflow-hidden rounded-[20px] md:rounded-[32px] border-[4px] md:border-[6px] border-white shadow-xl ${
                                            isActive ? 'w-[180px] h-[280px] md:w-[260px] md:h-[400px]' : 'w-[120px] h-[200px] md:w-[180px] md:h-[300px]'
                                        }`}
                                        onClick={() => {
                                            if (isActive) navigate(item.path);
                                            else setActiveIndex(idx);
                                        }}
                                    >
                                        <img src={item.image} alt={item.name || item.title} className="w-full h-full object-cover" />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] pointer-events-none">
                                            <div className={`py-1.5 md:py-2.5 rounded-full bg-white/95 text-center shadow-md transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                                <span className="text-[10px] md:text-[14px] font-bold text-gray-800 tracking-tight uppercase whitespace-nowrap px-3">
                                                    {item.name || item.title}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </div>

            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
                `}
            </style>
        </section>
    );
};

export default WomenOccasionCarousel;
