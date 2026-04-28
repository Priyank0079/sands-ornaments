import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import AllJewelleryMegaMenu from './AllJewelleryMegaMenu';
import AllJewelleryMenu from './CategoryNavComponents/AllJewelleryMenu';
import FamilyMegaMenu from './FamilyMegaMenu';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryNav = ({ showMetalToggle = true }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { activeMetal, updateActiveMetal } = useShop();
    const [hoveredItem, setHoveredItem] = useState(null);

    const navItems = [
        { id: 'cat', name: 'Shop by Category', path: '/collections', hasChevron: true },
        { id: 'all', name: 'ALL TYPE', path: '/collections', hasChevron: true },
        { id: 'him', name: 'Gifts for Him', path: '/category/men', hasChevron: false },
        { id: 'her', name: 'Gifts for Her', path: '/category/women', hasChevron: false },
        { id: 'family', name: 'Gifts for Family', path: '/category/family', hasChevron: false },
        // Legacy filter tags were removed from product placement. Keep these links functional via search.
        { id: 'card', name: 'SANDS Gift Card', path: '/shop?search=gift%20card', hasChevron: false },
        { id: 'blogs', name: 'Blogs', path: '/blogs', hasChevron: false },
        { id: 'exclusive', name: 'Exclusive Collections', path: '/shop?search=exclusive', hasChevron: false },
        { id: 'more', name: 'More at SANDS', path: '/about', hasChevron: false },
    ];

    const resetMenu = () => {
        setHoveredItem(null);
    };

    // Keep the metal toggle consistent with the current route/query.
    // This prevents confusing UI states when a user lands directly on a gold page or a gold-filtered shop URL.
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const metalParam = String(params.get('metal') || '').trim().toLowerCase();
        const karatParam = String(params.get('karat') || params.get('purity') || '').trim();
        const silverTypeParam = String(params.get('silver_type') || '').trim();
        const isGoldRoute = location.pathname.startsWith('/gold');
        const desiredMetal = (
            metalParam === 'gold'
            || isGoldRoute
            || (!metalParam && Boolean(karatParam))
        ) ? 'gold' : (
            metalParam === 'silver'
            || (!metalParam && Boolean(silverTypeParam))
        ) ? 'silver' : 'silver';

        if (desiredMetal && desiredMetal !== activeMetal) {
            updateActiveMetal(desiredMetal);
        }
    }, [activeMetal, location.pathname, location.search, updateActiveMetal]);

    return (
        <div className="bg-white border-b border-gray-100 hidden md:block w-full">
            <div className="container mx-auto px-4 md:px-12 relative" onMouseLeave={resetMenu}>
                {/* Navigation Links - Centered and Spaced Out */}
                <div className="flex justify-center items-center py-3">
                    <ul className="flex items-center gap-16">
                        {navItems.map((item) => (
                            <li
                                key={item.id}
                                onMouseEnter={() => {
                                    // Only 'Shop by Category' and 'ALL TYPE' show dropdowns on hover
                                    if (item.id === 'cat' || item.id === 'all') {
                                        setHoveredItem(item.id);
                                    }
                                }}
                                onMouseLeave={() => setHoveredItem(null)}
                                className="relative py-1"
                            >
                                <Link
                                    to={item.path}
                                    className="text-[15px] font-medium text-gray-900 hover:text-[#9C3D5E] flex items-center gap-1.5 transition-all duration-300 whitespace-nowrap"
                                >
                                    {item.name}
                                    {item.hasChevron && <ChevronDown className="w-4 h-4 text-gray-600" />}
                                </Link>

                                {/* Dropdowns Mapping — Positioned to show "Pura Box" (Full width) */}
                                <AnimatePresence>
                                    {hoveredItem === item.id && (
                                        <div className="absolute top-full left-[-40px] pt-4 z-[110]">
                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
                                            >
                                                {item.id === 'cat' && <AllJewelleryMenu resetMenu={resetMenu} />}
                                                {item.id === 'all' && <AllJewelleryMegaMenu resetMenu={resetMenu} />}
                                                {item.id === 'family' && <FamilyMegaMenu resetMenu={resetMenu} />}
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Silver / Gold Toggle - Precise SANDS Polish with Navigation logic */}
                {showMetalToggle && (
                    <div className="flex justify-center pb-2 pt-1 relative">
                        <div className="p-0.5 rounded-full border border-[#D4B390]/40 flex items-center bg-white shadow-[0_4px_25px_rgba(212,179,144,0.15)] overflow-hidden" style={{ minWidth: '850px' }}>
                            <button
                                onClick={() => {
                                    updateActiveMetal('silver');
                                    navigate('/');
                                }}
                                className={`flex-1 py-1.5 px-16 rounded-full text-[17px] font-bold uppercase tracking-widest transition-all duration-500 transform ${activeMetal === 'silver' ? 'bg-gradient-to-r from-[#434343] via-[#C0C0C0] to-[#434343] text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] scale-[1.01]' : 'text-[#4A4A4A] hover:bg-gray-50 hover:text-black'}`}
                            >
                                Silver
                            </button>
                            <button
                                onClick={() => {
                                    updateActiveMetal('gold');
                                    navigate('/gold-collection');
                                }}
                                className={`flex-1 py-1.5 px-16 rounded-full text-[17px] font-bold uppercase tracking-widest transition-all duration-500 transform ${activeMetal === 'gold' ? 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#3D2B1F] shadow-[0_8px_30px_rgba(191,149,63,0.35)] scale-[1.01]' : 'text-[#4A4A4A] hover:bg-gray-50 hover:text-black'}`}
                            >
                                Gold
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryNav;
