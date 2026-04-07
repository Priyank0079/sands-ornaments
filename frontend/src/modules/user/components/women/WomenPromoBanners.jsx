import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const banners = [
    {
        id: 1,
        title: "Couple Rings",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=90&w=1600&auto=format&fit=crop",
        link: "/shop?category=rings",
        bg: "bg-[#FDF5F6]"
    },
    {
        id: 2,
        title: "Premium Gifts",
        image: "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=90&w=1600&auto=format&fit=crop",
        link: "/shop?category=gifts",
        bg: "bg-[#FDF5F6]"
    }
];

const WomenPromoBanners = () => {
    const navigate = useNavigate();

    return (
        <section className="py-10 bg-white px-6">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {banners.map((banner) => (
                    <motion.div
                        key={banner.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -4, shadow: "0 25px 50px -12px rgba(211, 154, 159, 0.25)" }}
                        onClick={() => navigate(banner.link)}
                        className={`relative h-[150px] md:h-[180px] rounded-[2rem] overflow-hidden cursor-pointer shadow-xl group border border-[#D39A9F]/20 ${banner.bg}`}
                    >
                        {/* Premium Airy Imagery */}
                        <img 
                            src={banner.image} 
                            alt={banner.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[2s] group-hover:scale-105"
                        />
                        
                        {/* Soft Brand-Colored Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FDF5F6] via-[#FDF5F6]/40 to-transparent" />
                        
                        {/* Decorative Signature Line */}
                        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#D39A9F] rounded-full opacity-60" />

                        {/* Text Overlay - Sophisticated & Left-Aligned */}
                        <div className="absolute inset-0 flex flex-col justify-center px-16">
                            <motion.span 
                                className="text-[10px] uppercase tracking-[0.4em] text-[#D39A9F] font-bold mb-1"
                            >
                                Exclusive
                            </motion.span>
                            <h3 className="text-black text-2xl md:text-3xl font-serif font-black tracking-tighter leading-tight">
                                {banner.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-black">Shop Now</span>
                                <div className="w-4 h-[1px] bg-black" />
                            </div>
                        </div>

                        {/* Subtle Corner Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D39A9F]/10 blur-3xl rounded-full pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default WomenPromoBanners;
