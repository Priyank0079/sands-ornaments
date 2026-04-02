import React, { useMemo, useState, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoveRight, Gift, Sparkles, BookOpen, Info, Users, UserCircle2, User } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load the heavy jewellery menu to prevent preloading warnings
const AllJewelleryMenu = lazy(() => import('./CategoryNavComponents/AllJewelleryMenu'));

const NecklaceIcon = ({ className }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M5 4c0 2 1 8 7 8s7-6 7-8" />
        <path d="M12 12v2" />
        <path d="M12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M10.5 17.5 9 19" />
        <path d="M13.5 17.5 15 19" />
        <path d="M12 18.5v2" />
    </svg>
);

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

const navGiftItems = [
    { id: 'g1', name: 'FOR WOMEN', path: 'womens', image: navGiftWomen },
    { id: 'g2', name: 'FOR GIRLS', path: 'girls', image: navGiftGirls },
    { id: 'g3', name: 'FOR MEN', path: 'mens', image: navGiftMens },
    { id: 'g4', name: 'FOR COUPLES', path: 'couples', image: navGiftCouple },
    { id: 'g5', name: 'FOR KIDS', path: 'kids', image: navGiftKids },
];

const navOccasionItems = [
    { id: 'o1', name: 'BIRTHDAY', path: 'birthday', image: navOccasionBirthday },
    { id: 'o2', name: 'ANNIVERSARY', path: 'anniversary', image: navOccasionAnniversary },
    { id: 'o3', name: 'WEDDING', path: 'wedding', image: navOccasionWedding },
    { id: 'o4', name: 'MOTHER\'S DAY', path: 'mothers-day', image: navOccasionMothers },
    { id: 'o5', name: 'VALENTINE', path: 'valentine', image: navOccasionValentine },
];

const CategoryNav = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const { useShop: _ignored } = useShop(); // Just to keep the hook call if needed, though we moved logic
    const navigate = useNavigate();

    const [menuViewLevel, setMenuViewLevel] = useState('METALS'); 
    const [menuSelectedMetal, setMenuSelectedMetal] = useState(null);
    const [menuSelectedCategory, setMenuSelectedCategory] = useState(null);

    const resetMenu = () => {
        setHoveredCategory(null);
        setMenuViewLevel('METALS');
        setMenuSelectedMetal(null);
        setMenuSelectedCategory(null);
    };

    const allJewelleryItem = {
        id: 'shop-by-category',
        name: 'ALL JEWELLERY',
        icon: <NecklaceIcon className="w-5 h-5 opacity-80" />,
        path: '/shop', 
        type: 'mega-menu'
    };

    const navItems = [
        allJewelleryItem,
        { id: 'men', name: 'SHOP FOR MEN', path: '/shop?filter=mens', type: 'link', icon: <User className="w-5 h-5 opacity-80" /> },
        { id: 'women', name: 'SHOP FOR WOMEN', path: '/shop?filter=womens', type: 'link', icon: <UserCircle2 className="w-5 h-5 opacity-80" /> },
        { id: 'family', name: 'SHOP FOR FAMILY', path: '/shop?filter=family', type: 'link', icon: <Users className="w-5 h-5 opacity-80" /> },
        { id: 'gifts', name: 'GIFTS FOR', path: '/shop', type: 'mega-menu', icon: <Gift className="w-5 h-5 opacity-80" />, subcategories: navGiftItems, introTitle: "Gifts of Love", introDesc: "Find the perfect token." },
        { id: 'occasions', name: 'OCCASIONS', path: '/shop', type: 'mega-menu', icon: <Sparkles className="w-5 h-5 opacity-80" />, subcategories: navOccasionItems, introTitle: "Celebrate Moments", introDesc: "Timeless elegance." },
        { id: 'blogs', name: 'BLOGS', path: '/blogs', type: 'link', icon: <BookOpen className="w-5 h-5 opacity-80" /> },
        { id: 'about', name: 'ABOUT US', path: '/about', type: 'link', icon: <Info className="w-5 h-5 opacity-80" /> }
    ];

    return (
        <div className="bg-white border-b border-gray-100 hidden md:block sticky top-[84px] md:top-[104px] z-40 font-body">
            <div className="container mx-auto px-4 md:px-6">
                <ul className="flex justify-center items-center h-14 gap-2 lg:gap-8 relative">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className="h-full flex items-center"
                            onMouseEnter={() => setHoveredCategory(item.id)}
                            onMouseLeave={resetMenu}
                        >
                            <Link
                                to={item.path}
                                onClick={resetMenu}
                                className={`text-[11px] lg:text-[12px] tracking-wider font-bold flex items-center gap-2 transition-all duration-300 relative py-2 uppercase
                                    ${hoveredCategory === item.id ? 'text-[#9C5B61]' : 'text-gray-700'}
                                `}
                            >
                                {item.icon}
                                {item.name}
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#9C5B61] transform transition-transform duration-300 ${hoveredCategory === item.id ? 'scale-x-100' : 'scale-x-0'}`}></span>
                            </Link>

                            <AnimatePresence mode="wait">
                                {hoveredCategory === item.id && item.type === 'mega-menu' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.2 }}
                                        className="absolute left-0 top-full w-full bg-white shadow-2xl border-t border-gray-100 py-8 min-h-[350px] z-50 rounded-b-2xl overflow-hidden"
                                    >
                                        <div className="container mx-auto px-8 max-w-5xl">
                                            {item.id === 'shop-by-category' ? (
                                                <Suspense fallback={<div className="flex items-center justify-center h-[300px] text-[10px] uppercase tracking-widest text-gray-400">Loading Collections...</div>}>
                                                    <AllJewelleryMenu 
                                                        menuViewLevel={menuViewLevel}
                                                        setMenuViewLevel={setMenuViewLevel}
                                                        menuSelectedMetal={menuSelectedMetal}
                                                        setMenuSelectedMetal={setMenuSelectedMetal}
                                                        menuSelectedCategory={menuSelectedCategory}
                                                        setMenuSelectedCategory={setMenuSelectedCategory}
                                                        resetMenu={resetMenu}
                                                    />
                                                </Suspense>
                                            ) : (
                                                <div className="grid grid-cols-5 gap-8">
                                                    <div className="col-span-1 pr-6 border-r border-gray-100">
                                                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-2">{item.introTitle}</h3>
                                                        <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-4">{item.introDesc}</p>
                                                        <Link to="/shop" onClick={resetMenu} className="text-[#9C5B61] text-[10px] font-bold uppercase tracking-[0.2em] hover:text-black transition-colors flex items-center gap-2">Explore <MoveRight className="w-3 h-3" /></Link>
                                                    </div>
                                                    <div className="col-span-4 grid grid-cols-5 gap-6">
                                                        {(item.subcategories || []).map((sub) => (
                                                            <Link key={sub.id} to={sub.path?.startsWith('/') ? sub.path : `/shop?filter=${sub.path}`} onClick={resetMenu} className="group flex flex-col items-center">
                                                                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 mb-2 group-hover:shadow-md transition-all">
                                                                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                </div>
                                                                <span className="text-[9px] font-bold uppercase tracking-widest text-black group-hover:text-[#9C5B61] transition-colors">{sub.name}</span>
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
            <style dangerouslySetInnerHTML={{ __html: `.font-body { font-family: 'Lato', sans-serif; }` }} />
        </div>
    );
};

export default CategoryNav;
