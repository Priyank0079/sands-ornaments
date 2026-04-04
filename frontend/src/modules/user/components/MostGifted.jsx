import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

// Import Pink Premium Images
import braceletImg from '../assets/pink_bracelets_1767775488371.png';
import earringsImg from '../assets/pink_earrings_1767775466166.png';
import chainImg from '../assets/pink_chains_1767775516641.png';
import ankletImg from '../assets/pink_anklets_1767775536388.png';
import bannerModel from '../assets/gift_wife_silver.png';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

const categories = [
    { id: 1, name: "Earrings", image: earringsImg, path: "/shop?sort=most-sold", limit: 12 },
    { id: 2, name: "Bracelets", image: braceletImg, path: "/shop?sort=most-sold", limit: 12 },
    { id: 3, name: "Chains", image: chainImg, path: "/shop?sort=most-sold", limit: 12 },
    { id: 4, name: "Anklets", image: ankletImg, path: "/shop?sort=most-sold", limit: 12 },
];

const MostGifted = () => {
    const { homepageSections, categories: allCategories } = useShop();

    const sectionData = homepageSections?.['most-gifted'];
    const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
    const normalizedConfiguredItems = configuredItems
        .map((item, index) => {
            const category = item.categoryId
                ? allCategories.find(c => String(c._id || c.id) === String(item.categoryId))
                : null;
            const limit = Number(item.limit) || 0;
            if (!category || limit <= 0) {
                if (!item.path) return null;
                return {
                    ...item,
                    id: item.itemId || item._id || item.id || `legacy-${index}`,
                    name: item.name || item.label || 'Most Gifted',
                    image: resolveLegacyCmsAsset(item.image, earringsImg),
                    limit: Number(item.limit) || 12,
                    path: item.path
                };
            }
            return {
                ...item,
                id: item.itemId || item._id || item.id || `${category._id || category.id}-${index}`,
                name: item.name || item.label || category.name,
                image: resolveLegacyCmsAsset(item.image, earringsImg),
                limit,
                path: `/shop?category=${category._id || category.id}&limit=${limit}&sort=most-sold`
            };
        })
        .filter(Boolean);

    const displayItems = normalizedConfiguredItems.length > 0 ? normalizedConfiguredItems : categories;

    return (
        <section className="py-6 md:py-12 bg-white relative overflow-hidden">
            {/* Live Floating Particles Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ 
                            y: [0, -100, 0],
                            x: [0, 50, -50, 0],
                            opacity: [0.1, 0.4, 0.1],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ 
                            duration: 10 + i * 2, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: i * 1.5
                        }}
                        className="absolute w-24 h-24 md:w-64 md:h-64 bg-white/20 blur-[100px] rounded-full"
                        style={{ 
                            left: `${Math.random() * 80}%`, 
                            top: `${Math.random() * 80}%` 
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-5 lg:h-[480px]">
                    
                    {/* Cinematic Feature Banner - Ken Burns Video Style */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2 }}
                        className="w-full lg:w-[40%] relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl h-[320px] lg:h-full cursor-pointer isolate"
                    >
                        {/* Continuous Video-like Motion */}
                        <motion.img
                            animate={{ 
                                scale: [1, 1.1, 1],
                                x: [0, -20, 0]
                            }}
                            transition={{ 
                                duration: 12, 
                                repeat: Infinity, 
                                ease: "linear" 
                            }}
                            src={bannerModel}
                            alt="Glow in Motion Collection"
                            className="absolute inset-0 w-full h-full object-cover object-top"
                        />

                        {/* Layered Cinematic Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                        <div className="absolute inset-0 bg-[#722F37]/10 mix-blend-overlay z-15" />
                        
                        {/* Live Floating Shine */}
                        <motion.div 
                            animate={{ x: ["-100%", "300%"] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                            className="absolute top-0 bottom-0 w-20 bg-white/20 blur-2xl skew-x-[-20deg] z-20 pointer-events-none"
                        />

                        {/* Content Area */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-30 pb-10 md:pb-14">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <span className="text-[#C9A24D] text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-3 block drop-shadow-md">Collection Focus</span>
                                <h2 className="font-display text-2xl md:text-4xl font-medium text-white mb-4 leading-tight drop-shadow-xl uppercase tracking-wider">
                                    {sectionData?.label || "Most Gifted Items"}
                                </h2>
                            </motion.div>

                            <Link
                                to="/shop?sort=most-sold"
                                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white hover:text-[#722F37] transition-all duration-700 w-fit group/btn text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-lg"
                            >
                                Explore Collection
                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-2 transition-transform duration-500" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Gallery Strips - Vertical Video Style */}
                    <div className="w-full lg:w-[60%] flex flex-col sm:flex-row gap-4 h-[400px] lg:h-full">
                        {displayItems.map((cat, index) => {
                            const itemLabel = (cat.name || cat.label || 'Most Gifted').toUpperCase();
                            const path = cat.path || '/shop';

                            return (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                                    className="relative flex-1 rounded-2xl md:rounded-[2rem] overflow-hidden group h-full shadow-xl isolate cursor-pointer"
                                >
                                    <Link to={path} className="block w-full h-full">
                                        {/* Zoom-Video Image Animation */}
                                        <motion.img
                                            animate={{ scale: [1.1, 1.25, 1.1] }}
                                            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: index * 2 }}
                                            src={resolveLegacyCmsAsset(cat.image, earringsImg)}
                                            alt={itemLabel}
                                            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        />

                                        {/* Premium Tinted Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#4A1015] via-transparent to-transparent opacity-100 z-10 transition-transform duration-700 group-hover:translate-y-20" />
                                        
                                        {/* Bottom Animated Text */}
                                        <div className="absolute bottom-6 left-0 right-0 text-center z-30 px-2 leading-tight">
                                            <h3 className="font-serif text-xs md:text-base tracking-[0.2em] text-white font-medium group-hover:text-[#C9A24D] transition-all duration-500 transform group-hover:scale-105">
                                                {itemLabel}
                                            </h3>
                                            <motion.div 
                                                animate={{ width: ["0%", "30%", "0%"] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index }}
                                                className="w-[45%] md:w-48 lg:w-56 h-[1px] bg-[#C9A24D] mx-auto mt-2.5 opacity-60"
                                            />
                                        </div>

                                        {/* Hover Glow Reveal */}
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-15 pointer-events-none" />
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MostGifted;
