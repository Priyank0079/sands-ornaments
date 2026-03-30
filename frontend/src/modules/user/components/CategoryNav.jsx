import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoveRight, ArrowLeft } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

import navGiftWomen from '../assets/nav_gift_women.png';
import navGiftGirls from '../assets/nav_gift_girls.png';
import navGiftMens from '../assets/nav_gift_mens.png';
import navGiftCouple from '../assets/nav_gift_couple.png';
import navGiftKids from '../assets/nav_gift_kids.png';

import navOccasionBirthday from '../assets/nav_occasion_birthday.png';
import navOccasionAnniversary from '../assets/nav_occasion_anniversary.png';
import navOccasionWedding from '../assets/nav_occasion_wedding.png';
import navOccasionMothers from '../assets/nav_occasion_mothers.png';
import navOccasionValentine from '../assets/nav_occasion_valentine.png';
import {
    fallbackGiftImage,
    fallbackOccasionImage,
    normalizeHomepageNavItems
} from '../utils/homepageNav';

const CategoryNav = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [selectedMetal, setSelectedMetal] = useState(null);
    const [selectedPurity, setSelectedPurity] = useState(null);
    const { categories: dynamicCategories, products, homepageSections } = useShop();
    const navigate = useNavigate();

    // SHOP BY CATEGORY (Original Form)
    const shopByCategoryItem = {
        id: 'shop-by-category',
        name: 'Shop By Category',
        path: '/shop',
        type: 'mega-menu'
    };

    const defaultGiftsFor = [
        { id: 'women', name: "Womens", path: "womens", image: navGiftWomen },
        { id: 'girls', name: "Girls", path: "girls", image: navGiftGirls },
        { id: 'mens', name: "Mens", path: "mens", image: navGiftMens },
        { id: 'couple', name: "Couple", path: "couple", image: navGiftCouple },
        { id: 'kids', name: "Kids", path: "kids", image: navGiftKids }
    ];

    const defaultOccasions = [
        { id: 'birthday', name: "Birthday", path: "birthday", image: navOccasionBirthday },
        { id: 'anniversary', name: "Anniversary", path: "anniversary", image: navOccasionAnniversary },
        { id: 'wedding', name: "Wedding", path: "wedding", image: navOccasionWedding },
        { id: 'mothers-day', name: "Mother's Day", path: "mothers-day", image: navOccasionMothers },
        { id: 'valentine', name: "Valentine Day", path: "valentine", image: navOccasionValentine }
    ];

    const navGiftItems = useMemo(() => {
        const section = homepageSections?.['nav-gifts-for'];
        if (section?.items?.length) {
            return normalizeHomepageNavItems(section.items, 'filter', fallbackGiftImage);
        }
        return defaultGiftsFor;
    }, [homepageSections]);

    const navOccasionItems = useMemo(() => {
        const section = homepageSections?.['nav-occasions'];
        if (section?.items?.length) {
            return normalizeHomepageNavItems(section.items, 'occasion', fallbackOccasionImage);
        }
        return defaultOccasions;
    }, [homepageSections]);

    const giftsForItem = {
        id: 'gifts-for',
        name: 'Gifts For',
        path: '/shop',
        type: 'mega-menu',
        introTitle: "Gifts of Love",
        introDesc: "Find the perfect token of affection for every special person in your life.",
        subcategories: navGiftItems
    };

    const occasionsItem = {
        id: 'occasions',
        name: 'Occasions',
        path: '/shop',
        type: 'mega-menu',
        introTitle: "Celebrate Moments",
        introDesc: "Mark life's milestones with timeless elegance and unforgettable shine.",
        subcategories: navOccasionItems
    };

    const navItems = [
        shopByCategoryItem,
        giftsForItem,
        occasionsItem,
        { id: 'blogs', name: 'Blogs', path: '/blogs', type: 'link' },
        { id: 'about', name: 'About Us', path: '/about', type: 'link' }
    ];

    const visibleCategories = useMemo(() => (
        dynamicCategories.filter((c) => c.isActive !== false && c.showInNavbar !== false)
    ), [dynamicCategories]);

    const normalizeSilverTier = (value) => {
        const normalized = String(value || '').trim().toLowerCase();
        if (!normalized) return 'silver';
        if (normalized === '925 sterling silver') return '925 sterling silver';
        return 'silver';
    };

    const getTieredCategoryCards = (metal, purityValue) => {
        const allCategories = visibleCategories;
        const productsForMetal = (products || []).filter((p) => (
            String(p.material || p.metal || '').toLowerCase() === metal.toLowerCase()
        ));

        const productMatchesPurity = (product) => {
            if (metal === 'gold') {
                return String(product.goldCategory || '') === String(purityValue || '');
            }
            const tier = normalizeSilverTier(product.silverCategory);
            return tier === purityValue;
        };

        const matchedCategoryIds = new Set(
            productsForMetal.filter(productMatchesPurity).map((p) => String(p.categoryId)).filter(Boolean)
        );

        return allCategories
            .filter((cat) => matchedCategoryIds.has(String(cat._id || cat.id)))
            .map((cat) => ({
                id: cat._id || cat.id,
                name: cat.name,
                path: `/shop?metal=${metal}&${metal === 'gold' ? 'karat' : 'silver_type'}=${encodeURIComponent(purityValue)}&category=${cat._id || cat.id}`,
                image: cat.image || ''
            }));
    };

    const goldPurityCards = [
        { id: '14', name: '14 Karat', value: '14' },
        { id: '18', name: '18 Karat', value: '18' },
        { id: '22', name: '22 Karat', value: '22' },
        { id: '24', name: '24 Karat', value: '24' }
    ];

    const silverPurityCards = [
        { id: '925-sterling', name: '925 Sterling Silver', value: '925 sterling silver' },
        { id: 'silver', name: 'Silver', value: 'silver' }
    ];

    const getCategoriesByMetal = (metal) => (
        visibleCategories.filter((c) => c.metal?.toLowerCase() === metal.toLowerCase())
    );

    const getMetalCategoryCards = (metal) => (
        getCategoriesByMetal(metal).map((cat) => ({
            id: cat._id || cat.id,
            name: cat.name,
            path: `/shop?category=${cat._id || cat.id}`,
            image: cat.image || ''
        }))
    );

    return (
        <div className="bg-[#4A1015] border-b border-white/5 hidden md:block sticky top-[65px] z-40 shadow-xl font-sans">
            <div className="container mx-auto px-4">
                <ul className="flex justify-center items-center h-12 space-x-12 relative">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className="h-full flex items-center"
                            onMouseEnter={() => setHoveredCategory(item.id)}
                            onMouseLeave={() => { setHoveredCategory(null); setSelectedMetal(null); setSelectedPurity(null); }}
                        >
                            <Link
                                to={item.path}
                                onClick={() => setHoveredCategory(null)}
                                className={`font-display text-xs tracking-[0.2em] font-bold flex items-center gap-1 transition-all duration-300 relative py-2 uppercase
                                    ${hoveredCategory === item.id ? 'text-white' : 'text-white/70'}
                                `}
                            >
                                {item.name}
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#D39A9F] transform transition-transform duration-300 ${hoveredCategory === item.id ? 'scale-x-100' : 'scale-x-0'}`}></span>
                            </Link>

                            <AnimatePresence>
                                {hoveredCategory === item.id && item.type === 'mega-menu' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 top-full w-full bg-white shadow-2xl border-t border-gray-100 py-12 min-h-[400px] z-50 rounded-b-3xl"
                                    >
                                        <div className="container mx-auto px-8">
                                            {item.id === 'shop-by-category' ? (
                                                <div className="min-h-[300px] flex flex-col justify-center">
                                                    {!selectedMetal ? (
                                                        <motion.div 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="grid grid-cols-2 gap-12 max-w-4xl mx-auto w-full"
                                                        >
                                                            {/* Gold Collection */}
                                                            <button 
                                                                onClick={() => { setSelectedMetal('gold'); setSelectedPurity(null); }}
                                                                className="group relative bg-[#FDFBF7] border border-gray-100 rounded-[2rem] p-10 text-center transition-all hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-1 overflow-hidden"
                                                            >
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                                <div className="relative z-10 space-y-4">
                                                                    <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C] rounded-full mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                                        <span className="text-2xl font-black text-white italic">Au</span>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Gold Collection</h3>
                                                                        <p className="text-[9px] font-bold text-[#AA8C2C] uppercase tracking-[0.2em] mt-1">Premium 18K & 22K Hallmarked</p>
                                                                    </div>
                                                                </div>
                                                            </button>

                                                            {/* Silver Collection */}
                                                            <button 
                                                                onClick={() => { setSelectedMetal('silver'); setSelectedPurity(null); }}
                                                                className="group relative bg-white border border-gray-100 rounded-[2rem] p-10 text-center transition-all hover:shadow-2xl hover:shadow-[#D39A9F]/10 hover:-translate-y-1 overflow-hidden"
                                                            >
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D39A9F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                                <div className="relative z-10 space-y-4">
                                                                    <div className="w-20 h-20 bg-gradient-to-br from-[#C0C0C0] to-[#8D8D8D] rounded-full mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                                        <span className="text-2xl font-black text-white italic">Ag</span>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Silver Collection</h3>
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Sterling 925 Hallmarked</p>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        (() => {
                                                            const purityCards = selectedMetal === 'gold' ? goldPurityCards : silverPurityCards;
                                                            const list = selectedPurity ? getTieredCategoryCards(selectedMetal, selectedPurity) : [];
                                                            const hasCategories = list.length > 0;

                                                            return (
                                                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                                                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                                                <Link 
                                                                    to={hasCategories ? `/shop?metal=${selectedMetal}` : '/gold-collection'}
                                                                    onClick={() => { setHoveredCategory(null); setSelectedMetal(null); setSelectedPurity(null); }}
                                                                    className="flex items-center gap-4 group/header"
                                                                >
                                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover/header:rotate-12 ${selectedMetal === 'gold' ? 'bg-[#D4AF37]' : 'bg-gray-300'}`}>
                                                                        <span className="text-white font-black text-xs italic">{selectedMetal === 'gold' ? 'Au' : 'Ag'}</span>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight group-hover/header:text-[#D39A9F] transition-colors">{selectedMetal} Collection</h3>
                                                                        <p className="text-[10px] font-bold text-[#D39A9F] uppercase tracking-[0.2em]">
                                                                            {hasCategories ? `Explore our dynamic ${selectedMetal} range` : 'Exclusive line coming soon'}
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                                    <button 
                                                                        onClick={() => { setSelectedMetal(null); setSelectedPurity(null); }}
                                                                        className="text-[10px] font-black uppercase tracking-widest text-[#D39A9F] hover:text-black transition-colors flex items-center gap-2"
                                                                    >
                                                                        <ArrowLeft className="w-4 h-4" /> Back to Metals
                                                                    </button>
                                                                </div>

                                                                {!selectedPurity ? (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        className={`grid ${selectedMetal === 'gold' ? 'grid-cols-4' : 'grid-cols-2'} gap-8`}
                                                                    >
                                                                        {purityCards.map((purity) => (
                                                                            <button
                                                                                key={purity.id}
                                                                                onClick={() => setSelectedPurity(purity.value)}
                                                                                className="group relative bg-[#FDFBF7] border border-gray-100 rounded-[2rem] p-8 text-center transition-all hover:shadow-2xl hover:shadow-[#D39A9F]/10 hover:-translate-y-1 overflow-hidden"
                                                                            >
                                                                                <div className="relative z-10 space-y-2">
                                                                                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D39A9F]">
                                                                                        {selectedMetal === 'gold' ? 'Gold Karat' : 'Silver Purity'}
                                                                                    </div>
                                                                                    <div className="text-xl font-black text-gray-900 uppercase">
                                                                                        {purity.name}
                                                                                    </div>
                                                                                </div>
                                                                            </button>
                                                                        ))}
                                                                    </motion.div>
                                                                ) : hasCategories ? (
                                                                    <motion.div 
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        className="grid grid-cols-5 gap-x-6 gap-y-10"
                                                                    >
                                                                        {list.map((cat) => (
                                                                            <Link 
                                                                                key={cat.id || cat._id} 
                                                                                to={cat.path?.startsWith('/') ? cat.path : `/shop?category=${cat.id || cat._id}`}
                                                                                onClick={() => { setHoveredCategory(null); setSelectedMetal(null); setSelectedPurity(null); }}
                                                                                className="flex flex-col items-center text-center gap-3 group"
                                                                            >
                                                                                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm transition-all group-hover:shadow-md mx-auto group-hover:-translate-y-1 ring-4 ring-white">
                                                                                    <img src={cat.image || 'https://via.placeholder.com/150'} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                                </div>
                                                                                <h4 className="font-display font-bold text-black text-[11px] group-hover:text-[#D39A9F] transition-colors uppercase tracking-widest">{cat.name}</h4>
                                                                            </Link>
                                                                        ))}
                                                                    </motion.div>
                                                                    ) : (
                                                                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                                                            <div className="w-10 h-10 border-2 border-dashed border-[#D39A9F] rounded-full animate-spin" />
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <h4 className="font-display text-2xl text-black">Coming Soon</h4>
                                                                            <p className="text-gray-400 font-serif italic text-sm">We are expanding our {selectedMetal} collection for {selectedPurity}.</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => setSelectedPurity(null)}
                                                                            className="text-[10px] font-black uppercase tracking-widest text-[#D39A9F] hover:text-black transition-colors flex items-center gap-2"
                                                                        >
                                                                            <ArrowLeft className="w-4 h-4" /> Back to Purity
                                                                        </button>
                                                                    </div>
                                                                    )}
                                                            </div>
                                                            );
                                                        })()
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-5 gap-8">
                                                    <div className="col-span-1 pr-6 border-r border-gray-100">
                                                        <h3 className="font-display text-3xl text-black mb-4">{item.introTitle}</h3>
                                                        <p className="text-gray-500 font-serif italic mb-6 leading-relaxed text-sm">
                                                            {item.introDesc}
                                                        </p>
                                                        <Link to="/shop" onClick={() => setHoveredCategory(null)} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#D39A9F] hover:text-black transition-colors group">
                                                            View All Products <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </div>

                                                    <div className="col-span-4 grid grid-cols-5 gap-x-6 gap-y-10">
                                                        {item.subcategories.map((subCat) => (
                                                            <Link 
                                                                key={subCat.id} 
                                                                to={subCat.path?.startsWith('/') ? subCat.path : `/shop?filter=${subCat.path}`} 
                                                                onClick={() => setHoveredCategory(null)}
                                                                className="flex flex-col items-center text-center gap-3 group"
                                                            >
                                                                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1 mx-auto ring-4 ring-white">
                                                                    <img src={subCat.image} alt={subCat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                </div>
                                                                <h4 className="font-display font-bold text-black text-[11px] group-hover:text-[#D39A9F] transition-colors uppercase tracking-widest">{subCat.name}</h4>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryNav;
