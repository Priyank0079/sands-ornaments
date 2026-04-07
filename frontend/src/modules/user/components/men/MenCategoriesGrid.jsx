import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
    { title: 'Rings', image: '/images/men-categories/rings.png', link: '/shop?category=rings' },
    { title: 'Chains', image: '/images/men-categories/chains.png', link: '/shop?category=chains' },
    { title: 'Bracelets', image: '/images/men-categories/bracelets.png', link: '/shop?category=bracelets' },
    { title: 'Earrings', image: '/images/men-categories/cufflinks.png', link: '/shop?category=earrings' },
    { title: 'Pendants', image: '/images/men-categories/pendants.png', link: '/shop?category=pendants' },
    { title: 'Spiritual', image: '/images/men-categories/spiritual.png', link: '/shop?category=spiritual' },
    { title: 'Personalized', image: '/images/men-categories/custom.png', link: '/shop?category=custom' },
    { title: 'Sets', image: '/images/men-categories/sets.png', link: '/shop?category=sets' }
];

const MenCategoriesGrid = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 md:py-32 bg-[#F8FAFC]">
            <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-3xl text-[#111] mb-1 font-medium tracking-wide">
                        Discover by
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#000]">
                        Category
                    </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative cursor-pointer block h-full"
                            onClick={() => navigate(cat.link)}
                        >
                            <div className="relative aspect-[4/3] rounded-2xl md:rounded-[20px] overflow-hidden bg-[#F2F2F2] border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.03)] group-hover:shadow-[0_20px_40px_rgba(10,31,68,0.15)] group-hover:border-[#3B82F6]/30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                                />
                                
                                {/* Blue glow overlay that appears on hover */}
                                <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                
                                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none" />
                                
                                {/* Gradient for text readability */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A1F44]/90 via-[#0A1F44]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="absolute bottom-4 left-0 w-full text-center z-10 transition-transform duration-700 transform group-hover:translate-y-[-4px]">
                                    <h3 className="text-white font-bold tracking-[0.2em] uppercase text-[10px] md:text-[13px] drop-shadow-lg">
                                        {cat.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenCategoriesGrid;
