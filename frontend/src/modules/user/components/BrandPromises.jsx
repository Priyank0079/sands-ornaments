import React from 'react';
import { motion } from 'framer-motion';
import { Gem, RotateCcw, Truck, FileText, X } from 'lucide-react'; // Using Lucide icons

const BrandPromises = () => {
    const promises = [
        {
            id: 1,
            icon: Gem,
            title: "Pure 925 Silver",
            desc: "Certified Authenticity",
            gradient: "from-[#9C5B61] via-[#8E4A50] to-[#7D343A]"
        },
        {
            id: 2,
            icon: RotateCcw,
            title: "30-Day Easy Return",
            desc: "Hassle-free Refund",
            gradient: "from-[#8D5459] via-[#9C5B61] to-[#AD6B72]"
        },
        {
            id: 3,
            icon: Truck,
            title: "Free Delivery",
            desc: "On all orders above ₹999",
            gradient: "from-[#B0747A] via-[#9C5B61] to-[#8D5459]"
        },
        {
            id: 4,
            icon: FileText,
            title: "T&C Apply",
            desc: "Secure Shopping",
            gradient: "from-[#7D4045] via-[#8D5459] to-[#9C5B61]"
        }
    ];

    return (
        <section className="pt-8 pb-8 md:pt-16 md:pb-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="text-center mb-8 md:mb-16">
                    <span className="text-[#C9A24D] text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase mb-2 block">Our Commitments</span>
                    <h2 className="font-display text-2xl md:text-5xl text-[#9C5B61]">Why Choose Us</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-12 lg:gap-8 pt-4 md:pt-10">
                    {promises.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ y: 0 }}
                            animate={{ y: [0, -12, 0] }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity, 
                                ease: "easeInOut",
                                delay: index * 0.5 // Staggered movement for organic feel
                            }}
                            className="relative group flex flex-col items-center"
                        >
                            {/* Diamond Box */}
                            <div className={`w-28 h-28 md:w-56 md:h-56 bg-gradient-to-br ${item.gradient} rotate-45 rounded-xl md:rounded-[2.5rem] flex items-center justify-center shadow-lg md:shadow-[0_20px_50px_rgba(156,91,97,0.3)] relative z-10 border-2 md:border-[3px] border-white/80 cursor-pointer overflow-hidden group/card transition-all duration-700 hover:scale-105`}>
                                
                                {/* Inner Glow Overlay */}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                {/* Content (Rotated back for upright position) */}
                                <div className="-rotate-45 flex flex-col items-center justify-center text-white p-2 md:p-6 text-center transform transition-transform duration-700 group-hover/card:scale-110">
                                    <item.icon strokeWidth={1} className="w-5 h-5 md:w-12 md:h-12 mb-1 md:mb-4 text-white/90 drop-shadow-md" />
                                    <h3 className="font-display text-[10px] md:text-lg font-bold text-white mb-0.5 md:mb-2 uppercase tracking-widest">
                                        {item.title}
                                    </h3>
                                    <p className="text-white/70 text-[7px] md:text-sm italic font-light leading-relaxed max-w-[80px] md:max-w-[160px]">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Glow effect */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-[#9C5B61]/10 blur-3xl rounded-full -z-10 group-hover/card:bg-[#9C5B61]/20 transition-all duration-500`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandPromises;
