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
        <section className="py-6 md:py-8 bg-white">
            <div className="container mx-auto px-4 max-w-[1240px]">
                {/* Header */}
                <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-base md:text-lg font-sans text-gray-800 tracking-[0.15em] font-medium uppercase">
                        Luxury within Reach
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-[800px] mx-auto">
                    {PRICE_POINTS.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -3, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(item.path)}
                            className="relative h-[110px] md:h-[140px] bg-gradient-to-br from-[#540D1D] to-[#2D060F] rounded-[20px] md:rounded-[28px] cursor-pointer flex flex-col items-center justify-center text-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] overflow-hidden group"
                        >
                            {/* Subtle inner highlight */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
                            
                            <span className="text-[9px] md:text-[11px] font-sans tracking-[0.25em] uppercase font-semibold mb-0.5 relative z-10 opacity-90">
                                {item.label}
                            </span>
                            <div className="flex items-center gap-1 relative z-10">
                                <span className="text-2xl md:text-4xl font-sans font-bold tracking-tight">
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
