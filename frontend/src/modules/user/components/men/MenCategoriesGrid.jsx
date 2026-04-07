import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
    { title: 'Rings', image: '/images/men-categories/rings.png', link: '/shop?category=rings' },
    { title: 'Earrings', image: '/images/men-categories/cufflinks.png', link: '/shop?category=earrings' },
    { title: 'Chains', image: '/images/men-categories/chains.png', link: '/shop?category=chains' },
    { title: 'Spiritual Picks', image: '/images/men-categories/spiritual.png', link: '/shop?category=spiritual' },
    { title: 'Pendants', image: '/images/men-categories/pendants.png', link: '/shop?category=pendants' },
    { title: 'Bracelets', image: '/images/men-categories/bracelets.png', link: '/shop?category=bracelets' },
    { title: 'Sets', image: '/images/men-categories/sets.png', link: '/shop?category=sets' },
    { title: 'Personalised', image: '/images/men-categories/custom.png', link: '/shop?category=custom' }
];

const MenCategoriesGrid = () => {
    const navigate = useNavigate();

    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 max-w-[1200px]">
                {/* Header matching Screenshot 1 */}
                <div className="text-center mb-12 flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-0">
                        Discover by
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-black mt-[-4px]">
                        Category
                    </h1>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="group relative cursor-pointer overflow-hidden rounded-[15px] md:rounded-[20px] aspect-[0.9/1] shadow-md hover:shadow-xl transition-all"
                            onClick={() => navigate(cat.link)}
                        >
                            <img
                                src={cat.image}
                                alt={cat.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Dark gradient overlay for text readability */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                            {/* Text label at bottom center */}
                            <div className="absolute bottom-4 left-0 w-full text-center px-2">
                                <h3 className="text-white font-bold tracking-widest uppercase text-[10px] md:text-[13px]">
                                    {cat.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenCategoriesGrid;
