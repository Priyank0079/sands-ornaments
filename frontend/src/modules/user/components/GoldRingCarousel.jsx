import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import local assets for variety
import ringGreen from '../../../assets/categories/gold_rings_green.png';

const RING_TYPES = [
    { 
        id: 1, 
        name: 'Solitaire Ring', 
        image: ringGreen,
        filter: 'solitaire'
    },
    { 
        id: 2, 
        name: 'Promise Ring', 
        image: ringGreen,
        filter: 'promise'
    },
    { 
        id: 3, 
        name: '9kt Ring', 
        image: ringGreen,
        filter: '9kt'
    },
    { 
        id: 4, 
        name: 'Vanki Ring', 
        image: ringGreen,
        filter: 'vanki'
    },
    { 
        id: 5, 
        name: 'Rose Gold Ring', 
        image: ringGreen,
        filter: 'rose-gold'
    },
    { 
        id: 6, 
        name: 'Classic Ring', 
        image: ringGreen,
        filter: 'classic'
    },
];

const GoldRingCarousel = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (filter) => {
        navigate(`/shop?category=Rings&search=${filter}`);
    };

    return (
        <section className="w-full py-10 bg-white">
            <div className="max-w-[1450px] mx-auto px-4">
                <div className="bg-[#FAF9F0] rounded-[24px] p-8 md:p-10 text-center shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-[24px] md:text-[32px] text-[#2A4D35] font-serif font-medium tracking-tight italic mb-3">
                            Get The Right Ring
                        </h2>
                        {/* Golden Divider Line from Screenshot */}
                        <div className="h-px w-20 bg-[#D4B390]/50 mx-auto" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-10 mt-12">
                        {RING_TYPES.map((type, idx) => (
                            <div 
                                key={type.id} 
                                onClick={() => handleCategoryClick(type.filter)}
                                className="flex flex-col items-center group cursor-pointer"
                            >
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden mb-4 bg-[#142E1F] relative shadow-lg border-2 border-white group-hover:border-[#D4B390]/30 transition-all"
                                >
                                    <img
                                        src={type.image}
                                        alt={type.name}
                                        className="w-full h-full object-cover p-1 scale-110"
                                    />
                                    {/* Subtle inner vignette */}
                                    <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] rounded-full" />
                                </motion.div>
                                <span className="text-[14px] md:text-[16px] font-bold text-gray-900 tracking-tight leading-tight group-hover:text-[#2A4D35] transition-colors">
                                    {type.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={() => navigate('/shop?category=Rings')}
                            className="bg-gradient-to-b from-[#F5ECD7] to-[#E8D8A0] border border-[#D4B390] text-[#142E1F] font-black text-[14px] md:text-[16px] px-10 py-3 rounded-xl hover:brightness-105 transition-all duration-300 shadow-md"
                        >
                            View All Rings
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GoldRingCarousel;


