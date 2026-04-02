import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
import latestRing from '../assets/latest_drop_ring.png';
import latestBracelet from '../assets/latest_drop_bracelet.png';
import latestNecklace from '../assets/latest_drop_necklace.png';
import latestEarrings from '../assets/latest_drop_earrings.png';
import newAnklets from '../assets/new_launch_anklets.png';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

const fallbackImageMap = {
    pendants: { main: catPendant, angle1: catPendantWine, angle2: latestNecklace },
    rings: { main: catRing, angle1: catRingWine, angle2: latestRing },
    earrings: { main: catEarrings, angle1: catEarringsWine, angle2: latestEarrings },
    bracelets: { main: catBracelet, angle1: catBraceletWine, angle2: latestBracelet },
    anklets: { main: catAnklet, angle1: catAnkletWine, angle2: newAnklets },
    chains: { main: catChain, angle1: catChain, angle2: catChain }
};

const resolveFallbackImage = (slugOrName) => {
    if (!slugOrName) return null;
    const key = String(slugOrName).toLowerCase().replace(/\s+/g, '-');
    return fallbackImageMap[key] || null;
};

const CategoryShowcase = () => {
    const { homepageSections, categories, products } = useShop();
    const sectionConfig = homepageSections['category-showcase'];

    const activeCategories = (categories || []).filter(
        (cat) => cat.isActive !== false && cat.showInCollection !== false
    );
    const productCategoryIds = new Set((products || []).map(p => String(p.categoryId || '')));

    const getCategoryFromPath = (path) => {
        if (!path || activeCategories.length === 0) return null;
        try {
            if (path.startsWith('/category/')) {
                const slug = path.replace('/category/', '').split('?')[0];
                return activeCategories.find(c => c.slug === slug || c.path === slug) || null;
            }
            if (path.includes('category=')) {
                const query = path.split('category=')[1]?.split('&')[0];
                return activeCategories.find(c => c._id === query || c.id === query || c.slug === query || c.path === query || c.name === query) || null;
            }
        } catch (err) {
            return null;
        }
        return null;
    };

    const getCategoryFromItem = (item) => {
        if (!item) return null;
        if (item.categoryId) {
            const match = activeCategories.find(c => String(c._id) === String(item.categoryId) || String(c.id) === String(item.categoryId));
            if (match) return match;
        }
        if (item.path) {
            const fromPath = getCategoryFromPath(item.path);
            if (fromPath) return fromPath;
        }
        if (item.name) {
            const byName = activeCategories.find(c => c.name === item.name);
            if (byName) return byName;
        }
        return null;
    };

    const sectionItems = Array.isArray(sectionConfig?.items) ? sectionConfig.items : [];

    // Merge displayItems and finalItems into a single source of truth
    const baseItems = (sectionItems.length > 0) ? sectionItems : (() => {
        const withProducts = activeCategories.filter(cat => productCategoryIds.has(String(cat._id)));
        const baseList = withProducts.length > 0 ? withProducts : activeCategories;
        return baseList.slice(0, 8);
    })();

    const finalItems = baseItems.map((item, index) => {
        const resolvedCategory = getCategoryFromItem(item);
        const name = (resolvedCategory?.name || item.name || item.label || '').toUpperCase();
        const fb = resolveFallbackImage(resolvedCategory?.slug || resolvedCategory?.name || name);
        return {
            id: item.itemId || item.id || resolvedCategory?._id || index,
            name,
            image: resolveLegacyCmsAsset(item.image || resolvedCategory?.image, fb?.main),
            path: item.path || (resolvedCategory ? `/shop?category=${resolvedCategory._id}` : '/shop'),
            tag: item.tag || '',
            fallback: fb
        };
    }).filter(it => it.name);

    const [activeHoverId, setActiveHoverId] = React.useState(null);
    const [angleIndex, setAngleIndex] = React.useState(0);

    React.useEffect(() => {
        let interval;
        if (activeHoverId !== null) {
            interval = setInterval(() => {
                setAngleIndex((prev) => (prev + 1) % 3);
            }, 1000);
        } else {
            setAngleIndex(0);
        }
        return () => clearInterval(interval);
    }, [activeHoverId]);

    return (
        <section className="pb-4 pt-0 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-nowrap overflow-x-auto justify-start gap-4 md:gap-10 px-4 md:px-10 md:pt-4 md:pb-12 scrollbar-hide snap-x snap-mandatory">
                    {finalItems.map((cat, idx) => {
                        const fallbacks = cat.fallback || resolveFallbackImage(cat.name);
                        return (
                            <Link 
                                to={cat.path} 
                                key={cat.id} 
                                className="group flex flex-col items-center flex-shrink-0 snap-start"
                                onMouseEnter={() => setActiveHoverId(cat.id)}
                                onMouseLeave={() => setActiveHoverId(null)}
                            >
                                {/* Square Card Design - Elegant & Professional */}
                                <div className="relative w-40 h-40 md:w-64 md:h-64 bg-[#F9F3F1] rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D7D0]/60 overflow-hidden transition-all duration-500 transform group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group-hover:border-[#C9A24D]">
                                    
                                    {/* Cycling Product Angles */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.img
                                            key={`${cat.id}-0`}
                                            initial={false}
                                            animate={{ 
                                                opacity: activeHoverId === cat.id ? (angleIndex === 0 ? 1 : 0) : 1,
                                                scale: activeHoverId === cat.id ? 1.05 : 1
                                            }}
                                            transition={{ duration: 0.6 }}
                                            src={cat.image}
                                            alt={`${cat.name} view 1`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        
                                        {fallbacks?.angle1 && (
                                            <motion.img
                                                key={`${cat.id}-1`}
                                                initial={{ opacity: 0 }}
                                                animate={{ 
                                                    opacity: activeHoverId === cat.id && angleIndex === 1 ? 1 : 0,
                                                }}
                                                transition={{ duration: 0.6 }}
                                                src={fallbacks.angle1}
                                                alt={`${cat.name} view 2`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        )}

                                        {fallbacks?.angle2 && (
                                            <motion.img
                                                key={`${cat.id}-2`}
                                                initial={{ opacity: 0 }}
                                                animate={{ 
                                                    opacity: activeHoverId === cat.id && angleIndex === 2 ? 1 : 0,
                                                }}
                                                transition={{ duration: 0.6 }}
                                                src={fallbacks.angle2}
                                                alt={`${cat.name} view 3`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        )}

                                        {/* Premium Shimmer */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out z-20"></div>
                                    </div>

                                    {/* Top Tag - Minimal */}
                                    {cat.tag && (
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-black text-[8px] md:text-[10px] text-[#4A1015] tracking-[0.1em] z-30 shadow-sm uppercase">
                                            {cat.tag}
                                        </div>
                                    )}
                                </div>

                                {/* Category Name Below - Serif Styling */}
                                <div className="mt-4 md:mt-6 flex flex-col items-center gap-1.5">
                                    <span className="font-serif font-bold text-sm md:text-lg text-[#2A2A2A] uppercase tracking-[0.25em] transition-colors duration-300 group-hover:text-[#C9A24D]">
                                        {cat.name}
                                    </span>
                                    <motion.div 
                                        className="h-[1px] bg-[#C9A24D]"
                                        initial={{ width: 0 }}
                                        animate={activeHoverId === cat.id ? { width: "100%" } : { width: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
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
