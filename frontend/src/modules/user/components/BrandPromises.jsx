import React from 'react';
import { motion } from 'framer-motion';
import { Gem, RotateCcw, Truck, FileText, X } from 'lucide-react'; // Using Lucide icons

const BrandPromises = () => {
    const promises = [
        {
            id: 1,
            icon: Gem,
            title: "Pure 925 Silver",
            desc: "Certified Authenticity"
        },
        {
            id: 2,
            icon: RotateCcw,
            title: "30-Day Easy Return",
            desc: "Hassle-free Refund"
        },
        {
            id: 3,
            icon: Truck,
            title: "Free Delivery",
            desc: "On all orders above ₹999"
        },
        {
            id: 4,
            icon: FileText,
            title: "T&C Apply",
            desc: "Secure Shopping"
        }
    ];

    return (
        <section className="pt-8 pb-8 md:pt-16 md:pb-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-2 md:px-4">

                {/* Header */}
                <div className="text-center mb-8 md:mb-16">
                    <span className="text-[#C9A24D] text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase mb-2 block">Our Commitments</span>
                    <h2 className="font-display text-2xl md:text-5xl text-[#4A1015]">Why Choose Us</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-12 lg:gap-8 pt-4 md:pt-10">
                    {promises.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative group flex flex-col items-center"
                        >
                            {/* Diamond Box */}
                            <div className="w-28 h-28 md:w-52 md:h-52 bg-[#4A1015] rotate-45 rounded-xl md:rounded-[2rem] flex items-center justify-center shadow-md md:shadow-[0_20px_40px_rgba(74,16,21,0.25)] relative z-10 border-2 md:border-4 border-white cursor-pointer transition-colors duration-300 hover:bg-[#5C242B]">
                                {/* Content (Rotated back for upright position) */}
                                <div className="-rotate-45 flex flex-col items-center justify-center text-white p-2 md:p-4 text-center">
                                    <item.icon strokeWidth={1.2} className="w-5 h-5 md:w-10 md:h-10 mb-1 md:mb-3 text-[#EBCDD0]" />
                                    <h3 className="font-display text-[10px] md:text-[15px] font-bold text-white mb-0.5 md:mb-1 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-[#EBCDD0]/70 text-[7px] md:text-[10px] tracking-widest uppercase font-medium leading-relaxed max-w-[80px] md:max-w-[120px]">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Glow effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-[#4A1015]/10 blur-3xl rounded-full -z-10 group-hover:bg-[#4A1015]/20 transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandPromises;
