import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoveRight, ArrowRight, Menu } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { categories } from '../assets/data';
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

const CategoryNav = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [selectedMetal, setSelectedMetal] = useState(null); // null, 'gold', 'silver'
    const { toggleMenu } = useShop();

    // 1. Shop By Category (Mega Menu)
    const shopByCategoryItem = {
        id: 'shop-by-category',
        name: 'Shop By Category',
        path: '/shop',
        subcategories: categories,
        type: 'mega-menu',
        introTitle: "Complete Collection",
        introDesc: "Browse our entire catalogue of handcrafted silver pieces, from everyday essentials to statement luxury."
    };

    // 2. Gifts For (Mega Menu)
    const giftsForItem = {
        id: 'gifts-for',
        name: 'Gifts For',
        path: '/shop',
        type: 'mega-menu',
        introTitle: "Gifts of Love",
        introDesc: "Find the perfect token of affection for every special person in your life.",
        subcategories: [
            { id: 'women', name: "Womens", path: "womens", image: navGiftWomen },
            { id: 'girls', name: "Girls", path: "girls", image: navGiftGirls },
            { id: 'mens', name: "Mens", path: "mens", image: navGiftMens },
            { id: 'couple', name: "Couple", path: "couple", image: navGiftCouple },
            { id: 'kids', name: "Kids", path: "kids", image: navGiftKids }
        ]
    };

    // 3. Occasions (Mega Menu)
    const occasionsItem = {
        id: 'occasions',
        name: 'Occasions',
        path: '/shop',
        type: 'mega-menu',
        introTitle: "Celebrate Moments",
        introDesc: "Mark life's milestones with timeless elegance and unforgettable shine.",
        subcategories: [
            { id: 'birthday', name: "Birthday", path: "birthday", image: navOccasionBirthday },
            { id: 'anniversary', name: "Anniversary", path: "anniversary", image: navOccasionAnniversary },
            { id: 'wedding', name: "Wedding", path: "wedding", image: navOccasionWedding },
            { id: 'mothers-day', name: "Mother's Day", path: "mothers-day", image: navOccasionMothers },
            { id: 'valentine', name: "Valentine Day", path: "valentine", image: navOccasionValentine }
        ]
    };

    // 4. Other Links
    const super1999Item = { id: 'super-1999', name: 'Super 1,999', path: '/shop?maxPrice=1999', type: 'link' };
    const blogsItem = { id: 'blogs', name: 'Blogs', path: '/blogs', type: 'link' };
    const aboutUsItem = { id: 'about', name: 'About Us', path: '/about', type: 'link' };

    // Combine all
    const navItems = [
        shopByCategoryItem,
        giftsForItem,
        occasionsItem,
        super1999Item,
        blogsItem,
        aboutUsItem
    ];

    return (
        <div className="bg-[#4A1015] border-b border-white/5 hidden md:block sticky top-[65px] z-40 shadow-xl font-sans">
            <div className="container mx-auto px-4">
                <ul className="flex justify-center items-center h-12 space-x-12 relative">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className="h-full flex items-center"
                            onMouseEnter={() => setHoveredCategory(item.id)}
                            onMouseLeave={() => { setHoveredCategory(null); setSelectedMetal(null); }}
                        >
                            <Link
                                to={item.path}
                                onClick={() => setHoveredCategory(null)}
                                className={`font-display text-xs tracking-[0.2em] font-bold flex items-center gap-1 transition-all duration-300 relative py-2 uppercase
                                    ${hoveredCategory === item.id ? 'text-white' : 'text-white/70'}
                                `}
                            >
                                {item.name}
                                {/* Underline Effect */}
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#C9A24D] transform transition-transform duration-300 ${hoveredCategory === item.id ? 'scale-x-100' : 'scale-x-0'}`}></span>
                            </Link>

                            {/* MEGA MENU - Unified for all 3 types */}
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
                                                            {/* Gold Option - Navigates to new page */}
                                                            <Link 
                                                                to="/gold-collection"
                                                                onClick={() => setHoveredCategory(null)}
                                                                className="group bg-[#FDFBF7] border border-gray-100 rounded-3xl p-10 text-center transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1 block"
                                                            >
                                                                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                                    <span className="text-2xl font-black text-white italic">Au</span>
                                                                </div>
                                                                <h3 className="text-xl font-bold text-black uppercase tracking-tight">Gold Collection</h3>
                                                                <p className="text-[10px] font-bold text-[#AA8C2C] uppercase tracking-widest mt-2">Coming Soon</p>
                                                            </Link>

                                                            {/* Silver Option */}
                                                            <div 
                                                                onClick={(e) => { e.preventDefault(); setSelectedMetal('silver'); }}
                                                                className="group cursor-pointer bg-white border border-gray-100 rounded-3xl p-10 text-center transition-all hover:shadow-xl hover:-translate-y-1"
                                                            >
                                                                <div className="w-20 h-20 bg-gradient-to-br from-[#C0C0C0] to-[#8D8D8D] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                                    <span className="text-2xl font-black text-white italic">Ag</span>
                                                                </div>
                                                                <h3 className="text-xl font-bold text-black uppercase tracking-tight">Silver Collection</h3>
                                                                <p className="text-[10px] font-bold text-[#D39A9F] uppercase tracking-widest mt-2">925 Sterling Silver</p>
                                                            </div>
                                                        </motion.div>
                                                    ) : (
                                                        <div className="space-y-8">
                                                            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                                                <h3 className="font-display text-2xl text-black">Silver Collection</h3>
                                                                <button 
                                                                    onClick={() => setSelectedMetal(null)}
                                                                    className="text-[10px] font-black uppercase tracking-widest text-[#D39A9F] hover:text-black transition-colors"
                                                                >
                                                                    ← Back to Selection
                                                                </button>
                                                            </div>
                                                            <motion.div 
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="grid grid-cols-5 gap-x-6 gap-y-10"
                                                            >
                                                                {item.subcategories.map((subCat) => (
                                                                    <div key={subCat.id} className="flex flex-col items-center text-center gap-3 group">
                                                                        <Link to={`/category/${subCat.path}`} onClick={() => { setHoveredCategory(null); setSelectedMetal(null); }}>
                                                                            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm transition-shadow group-hover:shadow-md mx-auto">
                                                                                <img src={subCat.image} alt={subCat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                            </div>
                                                                        </Link>
                                                                        <div className="flex flex-col items-center">
                                                                            <Link to={`/category/${subCat.path}`} onClick={() => { setHoveredCategory(null); setSelectedMetal(null); }}>
                                                                                <h4 className="font-display font-bold text-black text-sm group-hover:text-[#D39A9F] transition-colors">{subCat.name}</h4>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </motion.div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-5 gap-8">
                                                    {/* Left Column: Intro */}
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                                        className="col-span-1 pr-6 border-r border-gray-100"
                                                    >
                                                        <h3 className="font-display text-3xl text-black mb-4">{item.introTitle}</h3>
                                                        <p className="text-gray-500 font-serif italic mb-6 leading-relaxed">
                                                            {item.introDesc}
                                                        </p>
                                                        <Link to="/shop" onClick={() => setHoveredCategory(null)} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#D39A9F] hover:text-black transition-colors group">
                                                            View All Products <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </motion.div>

                                                    {/* Right Grid: Subcategories */}
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                                                        className="col-span-4 grid grid-cols-5 gap-x-6 gap-y-10"
                                                    >
                                                        {item.subcategories.map((subCat) => (
                                                            <div key={subCat.id} className="flex flex-col items-center text-center gap-3 group">
                                                                <Link to={item.id === 'shop-by-category' ? `/category/${subCat.path}` : `/shop?filter=${subCat.path}`} onClick={() => setHoveredCategory(null)}>
                                                                    <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm transition-shadow group-hover:shadow-md mx-auto">
                                                                        <img src={subCat.image} alt={subCat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                    </div>
                                                                </Link>
                                                                <div className="flex flex-col items-center">
                                                                    <Link to={item.id === 'shop-by-category' ? `/category/${subCat.path}` : `/shop?filter=${subCat.path}`} onClick={() => setHoveredCategory(null)}>
                                                                        <h4 className="font-display font-bold text-black text-sm group-hover:text-[#D39A9F] transition-colors">{subCat.name}</h4>
                                                                    </Link>
                                                                    <Link to={item.id === 'shop-by-category' ? `/category/${subCat.path}` : `/shop?filter=${subCat.path}`} onClick={() => setHoveredCategory(null)} className="text-[10px] font-bold text-[#D39A9F] uppercase tracking-wider mt-2 hover:underline opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0">
                                                                        View Collection
                                                                        </Link>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </motion.div>
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
