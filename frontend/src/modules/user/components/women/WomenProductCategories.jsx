import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { buildWomenShopPath } from '../../utils/womenNavigation';

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
    { title: "RINGS", image: RingsImg, path: buildWomenShopPath({ category: 'rings' }) },
    { title: "EARRINGS", image: EarringsImg, path: buildWomenShopPath({ category: 'earrings' }) },
    { title: "BRACELETS", image: BraceletsImg, path: buildWomenShopPath({ category: 'bracelets' }) },
    { title: "PENDANTS", image: PendantsImg, path: buildWomenShopPath({ category: 'pendants' }) },
    { title: "CHAINS", image: ChainsImg, path: buildWomenShopPath({ category: 'chains' }) },
    { title: "BANGLES", image: BanglesImg, path: buildWomenShopPath({ category: 'bangles' }) },
    { title: "SETS", image: SetsImg, path: buildWomenShopPath({ category: 'sets' }) },
    { title: "PERSONALISED", image: PersonalisedImg, path: buildWomenShopPath({ category: 'personalised' }) }
];

const WomenProductCategories = ({ data }) => {
    const activeCategories = data?.items?.length > 0 ? data.items : categories;

    return (
        <section className="py-6 md:py-8 px-4 md:px-12 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Heading Block */}
                <div className="text-center mb-6 md:mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center space-y-2"
                    >
                        <h2 className="text-2xl md:text-3xl font-serif text-[#7A2E3A] tracking-tight">
                            {data?.settings?.title || "Shop by Category"}
                        </h2>
                        <p className="text-zinc-500 font-light text-xs md:text-sm max-w-xl mx-auto px-4 leading-relaxed">
                            {data?.settings?.subtitle || "Handcrafted silver masterpieces, each piece telling a unique story of elegance."}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-6">
                    {activeCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <Link 
                                to={category.path}
                                className="relative block w-full aspect-square rounded-xl overflow-hidden bg-zinc-50 shadow-sm border border-zinc-100 transition-all duration-500 hover:shadow-md hover:-translate-y-1"
                            >
                                <img 
                                    src={category.image} 
                                    alt={category.name || category.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </Link>

                            <div className="mt-2 text-center">
                                <h3 className="text-[#333333] font-serif text-sm md:text-base transition-colors duration-300 group-hover:text-[#7A2E3A] uppercase tracking-wide">
                                    {category.name || category.title}
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
