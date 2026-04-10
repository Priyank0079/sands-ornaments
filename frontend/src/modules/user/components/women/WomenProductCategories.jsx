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
        <section className="py-12 md:py-16 px-4 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Heading Block */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif text-[#7A2E3A] tracking-tight">
                            Shop by Category
                        </h2>
                        <p className="text-zinc-500 font-light text-sm md:text-base max-w-xl mx-auto px-4 leading-relaxed">
                            Discover our handcrafted silver masterpieces, each piece telling a unique story of timeless elegance.
                        </p>
                        <div className="w-12 h-[1px] bg-[#7A2E3A]/20 mt-2" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <Link 
                                to={category.path}
                                className="relative block w-full aspect-square rounded-2xl overflow-hidden bg-zinc-50 shadow-sm border border-zinc-100 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
                            >
                                <img 
                                    src={category.image} 
                                    alt={category.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </Link>

                            <div className="mt-4 text-center">
                                <h3 className="text-[#333333] font-serif text-base md:text-lg transition-colors duration-300 group-hover:text-[#7A2E3A]">
                                    {category.title.charAt(0) + category.title.slice(1).toLowerCase()}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WomenProductCategories;
