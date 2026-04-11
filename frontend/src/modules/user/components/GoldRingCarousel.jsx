import React from 'react';
import { motion } from 'framer-motion';
import ringImg from '../../../assets/categories/gold_rings_green.png';

const RING_TYPES = [
    { id: 1, name: 'Solitaire Ring', image: ringImg },
    { id: 2, name: 'Promise Ring', image: ringImg },
    { id: 3, name: '9kt Ring', image: ringImg },
    { id: 4, name: 'Vanki Ring', image: ringImg },
    { id: 5, name: 'Rose Gold Ring', image: ringImg },
    { id: 6, name: 'Classic Ring', image: ringImg },
];

const GoldRingCarousel = () => {
    return (
        <section className="w-full py-6 bg-white">
            <div className="max-w-[1450px] mx-auto px-4">
                <div className="bg-[#FAF9F0] rounded-[24px] p-6 md:p-8 text-center shadow-sm">
                    <h2 className="text-[20px] md:text-[28px] text-[#2A4D35] font-medium mb-6 tracking-tight font-serif italic">
                        Get The Right Ring
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
                        {RING_TYPES.map((type) => (
                            <div key={type.id} className="flex flex-col items-center group cursor-pointer">
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className="w-[110px] h-[110px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden mb-3 bg-[#142E1F] relative shadow-md"
                                >
                                    <img
                                        src={type.image}
                                        alt={type.name}
                                        className="w-full h-full object-cover p-1 scale-110"
                                    />
                                    {/* Subtle inner vignette */}
                                    <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] rounded-full" />
                                </motion.div>
                                <span className="text-[13px] md:text-[15px] font-medium text-gray-800 tracking-tight leading-tight">
                                    {type.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-2">
                        <button className="bg-gradient-to-b from-[#F5ECD7] to-[#E8D8A0] border border-[#D4B390] text-[#142E1F] font-bold text-[13px] md:text-[15px] px-8 py-2.5 rounded-xl hover:brightness-105 transition-all duration-300 shadow-md">
                            View All Rings
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GoldRingCarousel;
