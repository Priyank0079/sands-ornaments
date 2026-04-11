import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import menImg from '../../../assets/collections/cat_men_nobg.png';
import womenImg from '../../../assets/collections/cat_women_nobg.png';
import allImg from '../../../assets/collections/cat_family_nobg.png';

const FALLBACK_CATEGORIES = [
    {
        title: 'Men',
        subtitle: 'FOR HIM',
        image: menImg,
        path: '/category/men',
        bgColor: '#F3C4C9',
        delay: 0.1
    },
    {
        title: 'Women',
        subtitle: 'FOR HER',
        image: womenImg,
        path: '/category/women',
        bgColor: '#F3C4C9',
        delay: 0.2
    },
    {
        title: 'Family',
        subtitle: 'FOR EVERYONE',
        image: allImg,
        path: '/category/family',
        bgColor: '#F3C4C9',
        delay: 0.3
    }
];

const PremiumCategoryCards = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    const RECIPIENTS = [
        {
            id: 'him',
            title: 'Him',
            image: menImg,
            path: '/category/men',
            layout: 'left',
        },
        {
            id: 'her',
            title: 'Her',
            image: womenImg,
            path: '/category/women',
            layout: 'right',
        }
    ];

    return (
        <section
            ref={containerRef}
            className="pt-4 pb-12 md:pt-6 md:pb-16 bg-white"
        >
            <div className="container mx-auto px-4 max-w-[1240px]">
                {/* Header */}
                <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-sans font-medium text-gray-800 tracking-tight">
                        Shop by Recipient
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
                    {RECIPIENTS.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            onClick={() => navigate(item.path)}
                            className="relative h-[160px] md:h-[190px] bg-[#FFF0F1] rounded-[40px] cursor-pointer group shadow-sm flex items-center overflow-visible"
                            style={{ overflow: 'visible' }}
                        >
                            {/* Maroon Inset Box - Compact Height */}
                            <div 
                                className={`absolute top-[5%] bottom-[5%] w-[68%] bg-gradient-to-br from-[#AC3B61] to-[#7A1C3C] rounded-[32px] flex flex-col justify-end p-4 md:p-6 z-10 transition-all duration-300 group-hover:brightness-105 
                                ${item.layout === 'left' ? 'left-[2%]' : 'right-[2%]'}`}
                                style={{ overflow: 'visible' }}
                            >
                                {/* Shop Now Button inside maroon box */}
                                <div className={`flex items-center gap-2 text-white/90 font-bold group-hover:translate-x-1 transition-transform mb-1 ${item.layout === 'right' ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-[10px] md:text-[12px] tracking-[0.2em] uppercase font-black">Shop Now</span>
                                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#AC3B61]">
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>

                            {/* Label Pill - Precise Architectural Rounding */}
                            <div className={`absolute top-[40%] -translate-y-1/2 z-20 w-[60%] md:w-[65%] ${item.layout === 'left' ? 'left-[4%]' : 'right-[4%]'}`}>
                                <div className={`bg-[#F7E7CE] py-3.5 md:py-4.5 px-6 shadow-[0_8px_25px_rgba(0,0,0,0.15)] text-center flex items-center justify-center border border-white/20 transform -rotate-0.2 group-hover:rotate-0 transition-all duration-300
                                    ${item.layout === 'left' ? 'rounded-l-[32px] rounded-r-none' : 'rounded-r-[32px] rounded-l-none'}`}>
                                    <span className="text-[#8E2B45] text-4xl md:text-6xl font-serif italic font-bold tracking-tighter">
                                        {item.title}
                                    </span>
                                </div>
                            </div>

                            {/* Model Image - POPPING OUT (overflow-visible) */}
                            <div className={`absolute bottom-0 h-[140%] md:h-[165%] z-30 pointer-events-none transition-transform duration-700 group-hover:scale-105 ${item.layout === 'left' ? 'right-0' : 'left-0'}`}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className={`h-full w-auto object-contain drop-shadow-[20px_20px_40px_rgba(0,0,0,0.3)] ${item.layout === 'left' ? 'scale-x-[1] translate-x-[5%]' : 'scale-x-[-1] -translate-x-[5%]'}`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PremiumCategoryCards;
