import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

// Import images
import catPendant from '../assets/cat_pendant_wine.png';
import catRing from '../assets/cat_ring_wine.png';
import catEarrings from '../assets/cat_earrings_wine.png';
import catBracelet from '../assets/cat_bracelet_wine.png';
import catAnklet from '../assets/cat_anklet_wine.png';
import catChain from '../assets/cat_chain_wine.png';

const categories = [
    { id: 'pendants', name: "Pendants", image: catPendant, path: "/category/pendants" },
    { id: 'rings', name: "Rings", image: catRing, path: "/category/rings" },
    { id: 'earrings', name: "Earrings", image: catEarrings, path: "/category/earrings" },
    { id: 'bracelets', name: "Bracelets", image: catBracelet, path: "/category/bracelets" },
    { id: 'anklets', name: "Anklets", image: catAnklet, path: "/category/anklets" },
    { id: 'chains', name: "Chains", image: catChain, path: "/category/chains" }
];

const CategoryShowcase = () => {
    const { homepageSections } = useShop();
    const sectionConfig = homepageSections['category-showcase'];

    // Use configured items if available and not empty, otherwise fallback to default
    const displayItems = (sectionConfig?.items && sectionConfig.items.length > 0)
        ? sectionConfig.items
        : categories;

    return (
        <section className="py-4 bg-white overflow-hidden">
            <div className="container mx-auto px-0 md:px-4">
                <div className="flex flex-nowrap overflow-x-auto justify-start gap-4 md:gap-8 px-4 md:p-10 pb-4 md:pb-12 scrollbar-hide snap-x snap-mandatory">
                    {displayItems.map((cat, index) => (
                        <Link to={cat.path} key={cat.id} className="group flex flex-col items-center flex-shrink-0 snap-start">
                            {/* Card with Premium Gradient and Shimmer Effect */}
                            <div className="relative w-36 h-36 md:w-52 md:h-52 bg-gradient-to-br from-[#D39A9F] to-[#4A1015] rounded-2xl md:rounded-[2.5rem] shadow-lg border md:border-2 border-[#C9A24D]/30 overflow-hidden transition-all duration-500 transform group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_rgba(74,16,21,0.2)] group-hover:border-[#C9A24D]">
                                
                                {/* Shimmer Overlay Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out z-20"></div>

                                {/* Top Tag - Gold/Beige with Glow */}
                                <div className="absolute top-0 left-0 right-0 bg-[#F5E6D3] py-1 text-center font-black text-[9px] md:text-[11px] text-[#4A1015] tracking-[0.15em] z-30 shadow-sm uppercase group-hover:bg-white transition-colors duration-300">
                                    {cat.tag || 'UPTO 15% OFF'}
                                </div>

                                {/* Image with Zoom Effect */}
                                <div className="absolute inset-0 pt-2 flex items-center justify-center p-3 md:p-0">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-contain md:object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    />
                                </div>

                                {/* Subtle Darkening Overlay for Text Contrast */}
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Category Name Below - Animated */}
                            <div className="mt-3 md:mt-4 flex flex-col items-center gap-1">
                                <span className="font-display font-bold text-xs md:text-base text-gray-500 uppercase tracking-widest group-hover:text-[#4A1015] transition-colors duration-300">
                                    {cat.name}
                                </span>
                                <div className="w-0 h-[2px] bg-[#4A1015] group-hover:w-full transition-all duration-300"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
