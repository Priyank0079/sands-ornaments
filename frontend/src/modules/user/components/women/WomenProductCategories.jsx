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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <Link 
                                to={category.path}
                                className="group relative block aspect-square rounded-[35px] md:rounded-[45px] overflow-hidden bg-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
                            >
                                {/* Category Image */}
                                <img 
                                    src={category.image} 
                                    alt={category.title}
                                    className="w-full h-full object-cover transition-all duration-[2s] ease-out group-hover:scale-110"
                                />
                                
                                {/* Bottom Accent Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                                
                                {/* Category Label */}
                                <div className="absolute inset-x-0 bottom-6 md:bottom-10 text-center px-4">
                                    <span className="text-white text-sm md:text-xl font-black tracking-[0.1em] transition-all duration-500 group-hover:tracking-[0.2em]">
                                        {category.title}
                                    </span>
                                </div>

                                {/* Hover Glass Shine Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br from-white via-transparent to-transparent" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WomenProductCategories;
