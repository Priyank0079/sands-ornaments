import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

import budgetEarrings from '../../../assets/promos/budget_earrings.png';
import budgetPendant from '../../../assets/promos/budget_pendant.png';

const ShopByPrice = () => {
    const navigate = useNavigate();
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['luxury-within-reach'];

    // Using the user's specific labels from the reference design
    const displayItems = [
        {
            id: 'soulitaire',
            title: 'SOULitaire',
            subtitle: 'Under ₹999',
            image: budgetEarrings,
            path: '/shop?price_max=999'
        },
        {
            id: 'beyond-bold',
            title: 'Beyond Bold',
            subtitle: 'Under ₹1999',
            image: budgetPendant,
            path: '/shop?price_max=1999'
        }
    ];

    return (
        <section className="py-4 md:py-8 bg-[#FDF8F8]">
            <div className="container mx-auto px-4 max-w-[1240px]">
                {/* Minimal Editorial Header */}
                <div className="flex flex-col items-center mb-6 md:mb-10 text-center">
                    <span className="inline-block bg-[#9C5B61] text-white px-3 py-1 text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-3 rounded-sm shadow-sm">
                        Budget Boutique
                    </span>
                    <h2 className="text-2xl md:text-5xl font-serif text-gray-950 tracking-tight leading-none mb-4">
                        Luxury <span className="italic font-light text-[#9C5B61]">within Reach</span>
                    </h2>
                    <div className="w-12 h-[1px] bg-[#9C5B61]/20" />
                </div>

                {/* New Image-Based Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-[1100px] mx-auto">
                    {displayItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            onClick={() => navigate(item.path)}
                            className="relative aspect-[16/7.5] md:aspect-[16/6.5] rounded-[24px] md:rounded-[36px] overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-500"
                        >
                            {/* Background Image with soft zoom */}
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            
                            {/* Soft Gradient Overlay (using brand primary pink) */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#4A1B24]/90 via-[#4A1B24]/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
                            
                            {/* Content */}
                            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-center">
                                <motion.div 
                                    className="transform transition-transform duration-500 group-hover:translate-x-2"
                                >
                                    <h3 className="text-white font-bold text-2xl md:text-4xl tracking-tight mb-1">
                                        {item.title}
                                    </h3>
                                    <div className="h-[2px] w-8 bg-[#C9A24D] mb-2 md:mb-3 group-hover:w-16 transition-all duration-500" />
                                    <p className="text-white/90 text-sm md:text-lg font-medium tracking-wide">
                                        {item.subtitle}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Interactive Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByPrice;
