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
            className="pt-6 pb-10 md:pt-10 md:pb-16 bg-white overflow-visible"
        >
            <div className="container mx-auto px-4 max-w-[1100px]">
                {/* Header */}
                <div className="flex flex-col items-center mb-6 md:mb-12">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A24D] mb-1.5 md:mb-3">Gift the Excellence</span>
                    <h2 className="text-2xl md:text-4xl font-serif text-gray-950 tracking-tight leading-none text-center">
                        Shop by <span className="italic font-light text-[#8E2B45]">Recipient</span>
                    </h2>
                    <div className="w-8 h-[1px] md:w-10 md:h-[2px] bg-[#C9A24D]/60 mt-3 md:mt-5" />
                </div>

                {/* Cards Grid */}
                <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-16 relative">
                    {RECIPIENTS.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            onClick={() => navigate(item.path)}
                            className="relative h-[130px] md:h-[180px] bg-[#FDF8F8] rounded-[32px] md:rounded-[48px] cursor-pointer group shadow-sm flex items-center border border-[#F3E0E2]/50"
                        >
                            {/* Maroon Inset Box - More Compact */}
                            <div 
                                className={`absolute top-[4%] bottom-[4%] w-[75%] bg-gradient-to-br from-[#8E2B45] via-[#5C1625] to-[#2D060F] rounded-[28px] md:rounded-[44px] flex flex-col justify-end p-4 md:p-8 z-10 transition-all duration-500 group-hover:shadow-[0_15px_30px_rgba(74,16,21,0.2)] 
                                ${item.layout === 'left' ? 'left-[2%]' : 'right-[2%]'}`}
                            >
                                {/* Shop Now Button inside maroon box */}
                                <div className={`flex items-center gap-2 text-[#FFD9E0] font-black group-hover:translate-x-1 transition-transform mb-1 ${item.layout === 'right' ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-[8px] md:text-[10px] tracking-[0.25em] uppercase">Browse Edit</span>
                                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#FFD9E0] flex items-center justify-center text-[#8E2B45] shadow-sm">
                                        <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[2.5]" />
                                    </div>
                                </div>
                            </div>

                            {/* Model Image - Scaled for Compactness */}
                            <div className={`absolute bottom-0 h-[135%] md:h-[165%] z-30 pointer-events-none transition-all duration-1000 group-hover:scale-[1.03] ${item.layout === 'left' ? 'right-0' : 'left-0'}`}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className={`h-full w-auto object-contain drop-shadow-[10px_15px_30px_rgba(0,0,0,0.2)] transition-all duration-700 ${item.layout === 'left' ? 'translate-x-[5%] group-hover:translate-x-[8%]' : 'scale-x-[-1] -translate-x-[5%] group-hover:-translate-x-[8%]'}`}
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
