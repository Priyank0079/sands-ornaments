import React from 'react';
import { motion } from 'framer-motion';
import { Gem, RotateCcw, Truck, FileText } from 'lucide-react';

const BrandPromises = () => {
    const promises = [
        {
            id: 1,
            icon: Gem,
            title: "Pure 925",
            subtitle: "SILVER",
            desc: "Certified Authenticity"
        },
        {
            id: 2,
            icon: RotateCcw,
            title: "30-Day Easy",
            subtitle: "RETURN",
            desc: "Hassle-free Refund"
        },
        {
            id: 3,
            icon: Truck,
            title: "Free Delivery",
            subtitle: "ABOVE ₹999",
            desc: "Fast Shipping"
        },
        {
            id: 4,
            icon: FileText,
            title: "T&C Apply",
            subtitle: "SECURE SHOP",
            desc: "100% Protection"
        }
    ];

    return (
        <section className="py-12 md:py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <span className="text-[#D39A9F] text-[9px] md:text-xs font-bold tracking-[0.4em] uppercase mb-3 block">Our Commitments</span>
                    <h2 className="font-display text-3xl md:text-4xl text-[#8E4A50]">Why Choose Us</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 max-w-6xl mx-auto px-4">
                    {promises.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative group flex flex-col items-center pt-10 pb-6 px-4 cursor-default"
                        >
                            {/* The Arch - Minimalist Line Art */}
                            <div className="absolute inset-x-0 inset-y-0 border border-[#D39A9F]/25 rounded-t-full rounded-b-[2px] transition-all duration-500 group-hover:border-[#D39A9F]/50 shadow-[0_4px_25px_rgba(211,154,159,0.03)]" />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center text-center w-full">
                                {/* Minimal Central Icon */}
                                <div className="mb-6 text-[#8E4A50] group-hover:scale-110 transition-transform duration-500">
                                    <item.icon strokeWidth={1} className="w-6 h-6 md:w-8 md:h-8" />
                                </div>

                                {/* Script Title with Brush Stroke */}
                                <div className="relative mb-2 w-full px-2">
                                    {/* The Horizontal Pink Brush Stroke Effect */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-3 md:h-4 bg-[#D39A9F]/10 blur-md rounded-full -z-10 group-hover:bg-[#D39A9F]/20 transition-all duration-500" />

                                    <h3 className="font-serif italic text-lg md:text-2xl text-[#8E4A50] leading-none whitespace-nowrap tracking-tight">
                                        {item.title}
                                    </h3>
                                </div>

                                {/* Subtitle & Tiny Desc */}
                                <div className="space-y-1">
                                    <h4 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#D39A9F]">{item.subtitle}</h4>
                                    <p className="text-[9px] md:text-[11px] text-gray-400 font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandPromises;
