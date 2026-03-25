import React from 'react';
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
        <section className="py-8 md:py-24 bg-[#FFF0F0] relative overflow-hidden">
            {/* Custom Animation for Reverse/Yoyo Effect */}
            <style>{`
                @keyframes shine-alt {
                    0% { transform: translateX(0) rotate(45deg); }
                    100% { transform: translateX(1200%) rotate(45deg); }
                }
            `}</style>
            <div className="container mx-auto px-2 md:px-4">

                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 h-auto lg:h-[450px]">
                    {/* Feature Banner - Glow in Motion */}
                    <div className="w-full lg:w-[45%] relative rounded-2xl md:rounded-[2rem] overflow-hidden group shadow-md md:shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 cursor-pointer h-[300px] md:h-auto">
                        <img
                            src={bannerModel}
                            alt="Glow in Motion Collection"
                            className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-[1500ms]"
                        />

                        {/* Shine Effect */}
                        <div className="absolute top-[-200%] left-[-200%] w-[40%] h-[500%] bg-gradient-to-r from-transparent via-white/40 to-transparent transform rotate(45 group-hover:translate-x-[800%] transition-transform duration-1000 z-20 pointer-events-none" />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-6 md:p-14 z-30 pb-8 md:pb-14">
                            <span className="text-[#C9A24D] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-2 md:mb-4 drop-shadow-md">Collection Focus</span>
                            <h2 className="font-display text-3xl md:text-5xl text-white mb-4 md:mb-8 leading-tight drop-shadow-lg">
                                {sectionData?.label || "Most Gifted Items"}
                            </h2>

                            {/* CTA Button */}
                            <Link
                                to="/shop?sort=most-sold"
                                className="mt-4 md:mt-8 inline-flex items-center gap-3 bg-white/20 border border-white/30 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-white hover:text-[#722F37] transition-all duration-500 w-fit group/btn backdrop-blur-md"
                            >
                                <span className="uppercase tracking-widest text-[10px] md:text-xs font-bold">Explore Collection</span>
                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Category Cards - Vertical & Dark */}
                    <div className="w-full lg:w-[55%] grid grid-cols-2 md:grid-cols-4 gap-4">
                        {displayItems.map((cat, index) => {
                            const limit = Number(cat.limit) || 12;
                            const itemLabel = cat.name || cat.label || 'Most Gifted';
                            const path = cat.path || `/shop?limit=${limit}&sort=most-sold`;

                            return (
                                <Link
                                    to={path}
                                    key={cat.itemId || cat._id || cat.id || itemLabel}
                                    className="relative rounded-2xl md:rounded-[2rem] overflow-hidden group h-[200px] md:h-[280px] lg:h-full bg-white shadow-md md:shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer isolate"
                                >
                                    {/* Product Image */}
                                    <img
                                        src={resolveLegacyCmsAsset(cat.image, earringsImg)}
                                        alt={itemLabel}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms] opacity-90 group-hover:opacity-100"
                                    />

                                    {/* Shine Effect */}
                                    <div className="absolute top-[-200%] left-[-200%] w-[100%] h-[500%] bg-gradient-to-r from-transparent via-white/40 to-transparent transform rotate(45 group-hover:translate-x-[2000%] transition-all duration-[2500ms] z-20 pointer-events-none opacity-0 group-hover:opacity-100 blur-[2px]" />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#722F37]/90 via-transparent to-transparent opacity-100 z-10" />

                                    {/* Subtle Inner Border */}
                                    <div className="absolute inset-0 border border-white/20 rounded-2xl md:rounded-[2rem] group-hover:border-[#C9A24D]/30 transition-colors duration-500 z-10 pointer-events-none" />

                                    {/* Text Content */}
                                    <div className="absolute bottom-4 md:bottom-6 left-0 right-0 text-center z-30 px-2 transition-transform duration-500 group-hover:-translate-y-2">
                                        <h3 className="font-display text-base md:text-lg tracking-[0.15em] text-white uppercase font-bold group-hover:text-[#C9A24D] transition-colors duration-300 drop-shadow-md">
                                            {itemLabel}
                                        </h3>
                                        <div className="h-[1px] w-0 bg-[#C9A24D] mx-auto mt-2 transition-all duration-500 group-hover:w-8" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MostGifted;
