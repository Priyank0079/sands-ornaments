import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const occasions = [
    {
        id: 1,
        title: "Temple Date",
        image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop",
        path: "/shop?occasion=temple-date"
    },
    {
        id: 2,
        title: "Girl Outing",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
        path: "/shop?occasion=girl-outing"
    },
    {
        id: 3,
        title: "Date Night",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1600&auto=format&fit=crop",
        path: "/shop?occasion=date-night",
        featured: true
    },
    {
        id: 4,
        title: "Party Glam",
        image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1600&auto=format&fit=crop",
        path: "/shop?occasion=party-glam"
    },
    {
        id: 5,
        title: "Got Hitched",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop",
        path: "/shop?occasion=wedding"
    }
];

const WomenOccasionCarousel = () => {
    const navigate = useNavigate();
    const targetRef = useRef(null);
    const { scrollXProgress } = useScroll({ container: targetRef });

    return (
        <section className="py-24 bg-[#FDF5F6] overflow-hidden select-none">
            <div className="container mx-auto px-6 mb-12">
                <div className="flex flex-col items-center text-center">
                    <motion.h3 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-serif text-[#4A1015] mb-2"
                    >
                        Shop by Occasion
                    </motion.h3>
                    <div className="w-16 h-1 bg-[#D39A9F] rounded-full" />
                </div>
            </div>

            <div 
                ref={targetRef}
                className="flex gap-6 overflow-x-auto pb-12 px-6 md:px-24 snap-x snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {occasions.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        onClick={() => navigate(item.path)}
                        className={`snap-center shrink-0 cursor-pointer group transition-all duration-700 ${
                            item.featured ? 'w-[300px] md:w-[380px]' : 'w-[250px] md:w-[320px]'
                        }`}
                    >
                        {/* Card Container with Elegant Border */}
                        <div className={`relative aspect-[3/4] rounded-3xl overflow-hidden border-2 transition-all duration-700 ${
                            item.featured ? 'border-[#D39A9F] shadow-2xl scale-105' : 'border-white/50 shadow-lg group-hover:scale-105 group-hover:border-[#D39A9F]/50'
                        }`}>
                            {/* Full Height Image with Zoom */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            
                            {/* Soft Gradient for Label Readability */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-6 md:pb-8">
                                <span className={`bg-white/90 backdrop-blur-md px-6 md:px-10 py-2.5 md:py-3.5 rounded-full text-black font-bold text-sm md:text-base uppercase tracking-[0.1em] shadow-lg border border-[#EBCDD0]/50 group-hover:bg-[#4A1015] group-hover:text-white transition-all duration-500`}>
                                    {item.title}
                                </span>
                            </div>

                            {/* Corner Decorative Accent */}
                            <div className="absolute top-4 left-4 w-8 h-8 md:w-10 md:h-10 text-[#D39A9F]/30 animate-pulse">
                                <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                                    <path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Visual Instruction Line */}
            <div className="flex justify-center mt-6">
                <div className="w-48 h-1 bg-white/50 rounded-full relative overflow-hidden ring-1 ring-black/5">
                    <motion.div 
                        className="absolute inset-y-0 bg-[#D39A9F] w-1/3"
                        animate={{ x: ["0%", "200%", "0%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </section>
    );
};

export default WomenOccasionCarousel;
