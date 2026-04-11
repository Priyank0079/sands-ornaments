import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PRICE_POINTS = [
    {
        id: '1499',
        price: '1499',
        label: 'Under',
        path: '/shop?price_lte=1499'
    },
    {
        id: '1999',
        price: '1999',
        label: 'Under',
        path: '/shop?price_lte=1999'
    }
];

const ShopByPrice = () => {
    const navigate = useNavigate();

    return (
        <section className="py-10 md:py-14 bg-white">
            <div className="container mx-auto px-4 max-w-[1240px]">
                {/* Header */}
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-lg md:text-xl font-sans text-gray-800 tracking-[0.15em] font-medium">
                        Luxury within Reach
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 gap-5 md:gap-10 max-w-[850px] mx-auto">
                    {PRICE_POINTS.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(item.path)}
                            className="relative h-[135px] md:h-[180px] bg-gradient-to-br from-[#540D1D] to-[#2D060F] rounded-[28px] md:rounded-[36px] cursor-pointer flex flex-col items-center justify-center text-white shadow-[0_15px_35px_rgba(0,0,0,0.15)] overflow-hidden group"
                        >
                            {/* Subtle inner highlight */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
                            
                            <span className="text-[10px] md:text-[13px] font-sans tracking-[0.25em] uppercase font-semibold mb-1 relative z-10 opacity-90">
                                {item.label}
                            </span>
                            <div className="flex items-center gap-1 relative z-10">
                                <span className="text-3xl md:text-5xl font-sans font-bold tracking-tight">
                                    ₹{item.price}
                                </span>
                            </div>
                            
                            {/* Subtle glow on hover */}
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByPrice;
