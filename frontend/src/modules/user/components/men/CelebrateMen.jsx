import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const guides = [
    { id: 1, title: 'Brothers', image: '/images/men-gifts/brothers.png', link: '/shop?gifts=brothers' },
    { id: 2, title: 'Husbands', image: '/images/men-gifts/husbands.png', link: '/shop?gifts=husbands' },
    { id: 3, title: 'Boyfriends', image: '/images/men-gifts/boyfriends.png', link: '/shop?gifts=boyfriends' },
    { id: 4, title: 'Couple Gifts', image: '/images/men-gifts/couples.png', link: '/shop?gifts=couples' }
];

const CelebrateMen = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 md:py-32 bg-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0A1F44] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Celebrate Men
                    </h2>
                    <p className="text-[#64748B] text-sm md:text-base tracking-[0.2em] uppercase">
                        A Gifting Guide for Every Occasion
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {guides.map((guide, idx) => (
                        <motion.div
                            key={guide.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            whileHover={{ y: -10 }}
                            onClick={() => navigate(guide.link)}
                            className="group relative cursor-pointer h-96 rounded-2xl overflow-hidden shadow-lg bg-[#F8FAFC]"
                        >
                            <img 
                                src={guide.image} 
                                alt={guide.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/90 via-[#0A1F44]/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="absolute bottom-8 left-0 w-full flex justify-center">
                                <motion.div 
                                    className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:bg-[#3B82F6] group-hover:border-[#3B82F6]"
                                >
                                    <span className="text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                                        {guide.title}
                                        <span className="opacity-0 -ml-4 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0">→</span>
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CelebrateMen;
