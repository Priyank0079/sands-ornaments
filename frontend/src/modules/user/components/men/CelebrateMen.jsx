import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const guides = [
    { id: 1, title: 'Brothers', image: '/men_gift_1.png', link: '/shop?gifts=brothers' },
    { id: 2, title: 'Husbands', image: '/men_gift_2.png', link: '/shop?gifts=husbands' },
    { id: 3, title: 'Couple Gifts', image: '/men_gift_3.png', link: '/shop?gifts=couples' },
    { id: 4, title: 'Boyfriends', image: '/men_gift_4.png', link: '/shop?gifts=boyfriends' }
];

const CelebrateMen = () => {
    const navigate = useNavigate();

    return (
        <section className="py-12 md:py-16 bg-[#F4EDE4]">
            <div className="container mx-auto px-4 max-w-[1200px]">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#4A3228] mb-1.5" style={{ fontFamily: "'Serif', 'Playfair Display', serif" }}>
                        Celebrate Men
                    </h2>
                    <p className="text-[#4A3228]/70 text-xs md:text-sm font-medium tracking-wide">
                        A Gifting Guide For Them
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {guides.map((guide, idx) => (
                        <motion.div
                            key={guide.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            onClick={() => navigate(guide.link)}
                            className="group relative cursor-pointer"
                        >
                            {/* Card with Reduced Border Width */}
                            <div className="relative aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-[4px] md:border-[6px] border-white shadow-lg bg-white transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1.5">
                                <img 
                                    src={guide.image} 
                                    alt={guide.title} 
                                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                                />
                            </div>

                            {/* Refined Gold Gradient Pill Label */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] z-20 transform transition-transform duration-300 group-hover:scale-105">
                                <div className="bg-gradient-to-b from-[#FCEABB] via-[#F8D490] to-[#CF9B52] py-2.5 md:py-3 rounded-lg md:rounded-xl shadow-md border border-white/20 text-center">
                                    <span className="text-black font-black tracking-widest uppercase text-[10px] md:text-xs">
                                        {guide.title}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CelebrateMen;
