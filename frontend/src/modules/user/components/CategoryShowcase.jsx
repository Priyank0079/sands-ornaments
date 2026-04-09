import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

// Import images - Main (Angle 1) and Wine/Hover (Angle 2)
import catPendant from '../assets/cat_pendant.png';
import catPendantWine from '../assets/cat_pendant_wine.png';
import catRing from '../assets/cat_rings.png';
import catRingWine from '../assets/cat_ring_wine.png';
import catEarrings from '../assets/cat_earrings.png';
import catEarringsWine from '../assets/cat_earrings_wine.png';
import catBracelet from '../assets/cat_bracelets.png';
import catBraceletWine from '../assets/cat_bracelet_wine.png';
import catAnklet from '../assets/cat_anklets.png';
import catAnkletWine from '../assets/cat_anklet_wine.png';
import catChain from '../assets/cat_chain_wine.png';

// Import model shots (angle 2) for maximum hover impact
import latestRing from '../assets/latest_drop_ring.png';
import latestBracelet from '../assets/latest_drop_bracelet.png';
import latestNecklace from '../assets/latest_drop_necklace.png';
import latestEarrings from '../assets/latest_drop_earrings.png';
import newAnklets from '../assets/new_launch_anklets.png';

import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

const fallbackImageMap = {
    pendants: { main: catPendant, angle1: catPendantWine, angle2: latestNecklace },
    pendant: { main: catPendant, angle1: catPendantWine, angle2: latestNecklace },
    necklaces: { main: catPendant, angle1: catPendantWine, angle2: latestNecklace },
    necklace: { main: catPendant, angle1: catPendantWine, angle2: latestNecklace },
    rings: { main: catRing, angle1: catRingWine, angle2: latestRing },
    ring: { main: catRing, angle1: catRingWine, angle2: latestRing },
    earrings: { main: catEarrings, angle1: catEarringsWine, angle2: latestEarrings },
    earring: { main: catEarrings, angle1: catEarringsWine, angle2: latestEarrings },
    bracelets: { main: catBracelet, angle1: catBraceletWine, angle2: latestBracelet },
    bracelet: { main: catBracelet, angle1: catBraceletWine, angle2: latestBracelet },
    anklets: { main: catAnklet, angle1: catAnkletWine, angle2: newAnklets },
    anklet: { main: catAnklet, angle1: catAnkletWine, angle2: newAnklets },
    chains: { main: catChain, angle1: catChain, angle2: catChain },
    chain: { main: catChain, angle1: catChain, angle2: catChain }
};

const resolveFallbackImage = (slugOrName) => {
    if (!slugOrName) return null;
    const clean = String(slugOrName).toLowerCase().trim().replace(/\s+/g, '-');
    return fallbackImageMap[clean] || null;
};

const CategoryShowcase = () => {
    const { homepageSections, categories, products } = useShop();
    const sectionConfig = homepageSections['category-showcase'];
    const [activeHoverId, setActiveHoverId] = React.useState(null);

    const activeCategories = (categories || []).filter(
        (cat) => cat.isActive !== false && cat.showInCollection !== false
    );
    const productCategoryIds = new Set((products || []).map(p => String(p.categoryId || '')));

    const getCategoryFromItem = (item) => {
        if (!item) return null;
        if (item.categoryId) {
            const match = activeCategories.find(c => String(c._id) === String(item.categoryId));
            if (match) return match;
        }
        if (item.name) {
            const byName = activeCategories.find(c => c.name === item.name);
            if (byName) return byName;
        }
        return null;
    };

    const sectionItems = Array.isArray(sectionConfig?.items) ? sectionConfig.items : [];
    const baseItems = (sectionItems.length > 0) ? sectionItems : activeCategories.slice(0, 8);

    const finalItems = baseItems.map((item, index) => {
        const resolvedCategory = getCategoryFromItem(item);
        const name = (resolvedCategory?.name || item.name || item.label || '').toUpperCase();
        const fb = resolveFallbackImage(resolvedCategory?.slug || resolvedCategory?.name || name);
        return {
            id: item.itemId || item.id || resolvedCategory?._id || index,
            name,
            image: resolveLegacyCmsAsset(item.image || resolvedCategory?.image, fb?.main),
            hoverImage: resolveLegacyCmsAsset(item.hoverImage, fb?.angle2 || fb?.angle1 || fb?.main),
            path: item.path || (resolvedCategory ? `/shop?category=${resolvedCategory._id}` : '/shop'),
            tag: item.tag || '',
            fallback: fb
        };
    }).filter(it => it.name);

    return (
        <section className="pb-16 pt-12 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">

                {/* Elegant Header */}
                <div className="text-center mb-16 md:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="text-[#D39A9F] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 block">Curated Collections</span>
                    <h2 className="font-serif text-4xl md:text-6xl text-[#8E4A50] mb-6 leading-tight">Shop by Category</h2>
                    <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-medium uppercase tracking-[0.1em]">
                        Discover our handcrafted silver masterpieces, each piece telling <br className="hidden md:block" /> a unique story of timeless elegance.
                    </p>
                    <div className="w-16 h-px bg-[#D39A9F] mx-auto mt-8 opacity-40"></div>
                </div>

                <div className="flex flex-nowrap overflow-x-auto justify-center gap-2 md:gap-4 px-4 md:px-10 md:pt-4 md:pb-12 scrollbar-hide snap-x snap-mandatory">
                    {finalItems.map((cat) => {
                        const fallbacks = cat.fallback || resolveFallbackImage(cat.name);
                        const isHovered = activeHoverId === cat.id;

                        // Use the high-end model shot (angle2) for a drama-filled hover state
                        const hoverImageSrc = cat.hoverImage || fallbacks?.angle2 || fallbacks?.angle1 || cat.image;

                        return (
                            <Link
                                to={cat.path}
                                key={cat.id}
                                className="group flex flex-col items-center flex-shrink-0 snap-start"
                                onMouseEnter={() => setActiveHoverId(cat.id)}
                                onMouseLeave={() => setActiveHoverId(null)}
                            >
                                {/* Professional Card Container - BOLDER OLD GOLD BORDER */}
                                <div className="relative w-40 h-40 md:w-64 md:h-64 bg-[#F9F3F1] rounded-2xl md:rounded-[2rem] border border-[#E8D7D0]/60 overflow-hidden transition-all duration-700 group-hover:shadow-[0_30px_60px_rgba(142,74,80,0.15)] group-hover:border-[#B8860B] group-hover:border-[4px]">

                                    {/* Layered Image Cross-Fade (NO FLASH) */}
                                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out group-hover:scale-110">
                                        {/* Base Product Shot */}
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="absolute inset-0 w-full h-full object-cover z-0"
                                        />

                                        {/* High-End Model Look - DUAL ZOOM (125%) */}
                                        <img
                                            src={hoverImageSrc}
                                            alt={`${cat.name} stylized`}
                                            className={`absolute inset-0 w-full h-full object-cover z-10 transition-all duration-1000 ease-in-out group-hover:scale-115 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    </div>

                                    {/* Minimalist Tag */}
                                    {cat.tag && (
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full font-black text-[8px] md:text-[10px] text-[#4A1015] tracking-[0.1em] z-20 shadow-sm uppercase">
                                            {cat.tag}
                                        </div>
                                    )}
                                </div>

                                {/* Typography Section */}
                                <div className="mt-4 md:mt-6 flex flex-col items-center gap-1.5">
                                    <span className={`font-serif font-bold text-sm md:text-lg uppercase tracking-[0.25em] transition-colors duration-500 ${isHovered ? 'text-[#8E4A50]' : 'text-[#2A2A2A]'}`}>
                                        {cat.name}
                                    </span>
                                    <div className={`h-px bg-[#8E4A50] transition-all duration-700 ease-out ${isHovered ? 'w-full' : 'w-0'}`} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
