import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import yellowImg from '@assets/gold_color_yellow.png';
import roseImg from '@assets/gold_color_rose.png';
import whiteImg from '@assets/gold_color_white.png';
import dualImg from '@assets/gold_color_dual.png';

const GoldShopByColour = () => {
    const navigate = useNavigate();

    const colors = [
        { id: 'yellow', name: 'Yellow Gold', image: yellowImg, gradient: 'bg-gradient-to-tr from-[#DEB36D] to-[#F7E2AF]' },
        { id: 'rose', name: 'Rose Gold', image: roseImg, gradient: 'bg-gradient-to-tr from-[#E6A0A0] to-[#FAD4D4]' },
        { id: 'white', name: 'White Gold', image: whiteImg, gradient: 'bg-gradient-to-tr from-[#C0C0C0] to-[#E8E8E8]' },
        { id: 'dual', name: 'Dual tone Gold', image: dualImg, gradient: 'bg-gradient-to-tr from-[#E8C59A] via-[#E8E8E8] to-[#E6A0A0]' },
    ];

    return (
        <section className="w-full py-6 bg-white overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-6">
                    <h2 className="text-xl md:text-2xl font-serif text-black">Shop by Colour</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                    {colors.map((color, idx) => (
                        <motion.div
                            key={color.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            onClick={() => navigate(`/shop?metal=gold&search=${color.name}`)}
                            className="group cursor-pointer flex flex-col items-center"
                        >
                            <div className="relative w-full aspect-square rounded-[20px] overflow-hidden shadow-sm border border-gray-100 mb-2 transition-transform duration-500 group-hover:-translate-y-1">
                                <img src={color.image} alt={color.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                
                                {/* Overlay Swap/Swatch Bubble - Extra Small */}
                                <div className={`absolute bottom-2 right-2 w-6 md:w-8 h-6 md:h-8 rounded-full border-2 border-white shadow-md ${color.gradient}`} />
                                
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="text-gray-900 font-bold text-[13px] md:text-[14px] tracking-tight">{color.name}</h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GoldShopByColour;
