import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import AllJewelleryMegaMenu from './AllJewelleryMegaMenu';
import AllJewelleryMenu from './CategoryNavComponents/AllJewelleryMenu';
import FamilyMegaMenu from './FamilyMegaMenu';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryNav = ({ showMetalToggle = true }) => {
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
        { id: 'store', name: 'Gift Store', path: '/shop?search=gift', hasChevron: false },
        { id: 'exclusive', name: 'Exclusive Collections', path: '/shop?search=exclusive', hasChevron: false },
        { id: 'more', name: 'More at SANDS', path: '/about', hasChevron: false },
    ];

    const resetMenu = () => {
        setHoveredItem(null);
    };

    return (
        <div className="bg-white border-b border-gray-100 hidden md:block w-full">
            <div className="container mx-auto px-4 md:px-12 relative" onMouseLeave={resetMenu}>
                {/* Navigation Links - Centered and Spaced Out */}
                <div className="flex justify-center items-center py-3">
                    <ul className="flex items-center gap-12">
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
                    <div className="flex justify-center pb-3 pt-0.5 relative">
                        <div className="p-0.5 rounded-full border border-[#D4B390] flex items-center bg-white shadow-sm overflow-hidden" style={{ minWidth: '680px' }}>
                            <button
                                onClick={() => {
                                    updateActiveMetal('silver');
                                    navigate('/');
                                }}
                                className={`flex-1 py-1 px-12 rounded-full text-[17px] font-bold transition-all duration-500 transform ${activeMetal === 'silver' ? 'bg-[#9C3D5E] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                Silver Jewellery
                            </button>
                            <button
                                onClick={() => {
                                    updateActiveMetal('gold');
                                    navigate('/gold-collection');
                                }}
                                className={`flex-1 py-1 px-12 rounded-full text-[17px] font-bold transition-all duration-500 transform ${activeMetal === 'gold' ? 'bg-[#9C3D5E] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                Gold Jewellery
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryNav;
