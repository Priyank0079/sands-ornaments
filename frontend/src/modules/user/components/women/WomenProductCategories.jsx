import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import images from assets
import RingsImg from '../../../../assets/women-categories/Rings.png';
import EarringsImg from '../../../../assets/women-categories/Earrings.png';
import BraceletsImg from '../../../../assets/women-categories/Bracelets.png';
import PendantsImg from '../../../../assets/women-categories/Pendants.png';
import ChainsImg from '../../../../assets/women-categories/Chains.png';
import BanglesImg from '../../../../assets/women-categories/Bangles.png';
import SetsImg from '../../../../assets/women-categories/Sets.png';
import PersonalisedImg from '../../../../assets/women-categories/Personalised.png';

const categories = [
    { title: "RINGS", image: RingsImg, path: "/shop?category=Rings" },
    { title: "EARRINGS", image: EarringsImg, path: "/shop?category=Earrings" },
    { title: "BRACELETS", image: BraceletsImg, path: "/shop?category=Bracelets" },
    { title: "PENDANTS", image: PendantsImg, path: "/shop?category=Pendants" },
    { title: "CHAINS", image: ChainsImg, path: "/shop?category=Chains" },
    { title: "BANGLES", image: BanglesImg, path: "/shop?category=Bangles" },
    { title: "SETS", image: SetsImg, path: "/shop?category=Sets" },
    { title: "PERSONALISED", image: PersonalisedImg, path: "/shop?category=Personalised" }
];

const WomenProductCategories = () => {
    return (
        <section className="py-24 px-4 md:px-12 bg-[#FFF9FA]">
            <div className="max-w-7xl mx-auto">
                {/* Elegant Best Heading */}
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-rose-400 mb-3">Discovery</span>
                        <h2 className="text-4xl md:text-6xl font-serif text-zinc-900 tracking-tight flex flex-col md:flex-row items-center gap-3">
                            SHOP BY <span className="italic font-light text-rose-400">CATEGORY</span>
                        </h2>
                        <div className="w-24 h-[1px] bg-rose-200 mt-8" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-10">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center group"
                        >
                            <Link 
                                to={category.path}
                                className="relative block w-full aspect-square rounded-full overflow-hidden bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
                            >
                                {/* Category Image */}
                                <img 
                                    src={category.image} 
                                    alt={category.title}
                                    className="w-full h-full object-cover transition-all duration-[2s] ease-out group-hover:scale-110"
                                />
                                
                                {/* Hover Glass Shine Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br from-white via-transparent to-transparent" />
                            </Link>

                            {/* Category Label - Now Below the Image */}
                            <div className="mt-3 md:mt-5 text-center">
                                <span className="text-zinc-600 group-hover:text-rose-400 text-[10px] md:text-sm font-black tracking-[0.15em] uppercase transition-all duration-500 block truncate w-full px-1">
                                    {category.title}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WomenProductCategories;
