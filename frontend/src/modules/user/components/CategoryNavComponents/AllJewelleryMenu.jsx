import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../../../context/ShopContext';

const AllJewelleryMenu = ({ resetMenu }) => {
    const { activeMetal } = useShop();
    const [hoveredCategory, setHoveredCategory] = useState('All');

    const mainCategories = [
        { id: 'all', name: 'All', path: '/shop' },
        { id: 'rings', name: 'Rings', path: '/category/rings', hasSub: true },
        { id: 'necklaces', name: 'Necklaces & Pendants', path: '/category/necklaces', hasSub: true },
        { id: 'bracelets', name: 'Bracelets', path: '/category/bracelets', hasSub: true },
        { id: 'earrings', name: 'Earrings', path: '/category/earrings', hasSub: true },
        { id: 'anklets', name: 'Anklets', path: '/category/anklets', hasSub: true },
        { id: 'others', name: 'Other Categories', path: '/collections', hasSub: true },
    ];

    const allJewelleryLinks = [
        { id: 'sets', name: 'Jewellery Sets', path: '/category/sets' },
        { id: 'personalised', name: 'Personalised', path: '/category/personalised' },
        { id: 'watch-charms', name: 'Watch Charms', path: '/category/watch-charms' },
        { id: 'mangalsutras', name: 'Mangalsutras', path: '/category/mangalsutras' },
        { id: 'chains', name: 'Chains', path: '/category/chains' },
        { id: 'toe-rings', name: 'Toe Rings', path: '/category/toe-rings' },
        { id: 'nose-pins', name: 'Nose Pins', path: '/category/nose-pins' },
        { id: 'kids', name: 'Kids', path: '/category/kids' },
    ];

    const filterGroups = [
        {
            title: 'Shop by Price',
            items: [
                { name: 'Under 1500', path: '/shop?max_price=1500' },
                { name: '1500 to 3000', path: '/shop?min_price=1500&max_price=3000' },
                { name: '3000 to 5000', path: '/shop?min_price=3000&max_price=5000' },
                { name: 'Above 5000', path: '/shop?min_price=5000' },
            ]
        },
        {
            title: 'Shop by Metal',
            items: [
                { name: '925 Silver', path: '/shop?metal=silver' },
                { name: 'Pure Gold', path: '/shop?metal=gold' },
            ]
        },
        {
            title: 'Shop by Colour',
            items: [
                { name: 'Silver', path: '/shop?color=silver' },
                { name: 'Gold Plated', path: '/shop?color=gold-plated' },
                { name: 'Rose Gold', path: '/shop?color=rose-gold' },
                { name: 'Oxidised', path: '/shop?color=oxidised' },
            ]
        },
        {
            title: 'Shop by Style',
            items: [
                { name: 'Everyday', path: '/shop?style=everyday' },
            ]
        }
    ];

    return (
        <div className="flex bg-white min-h-[450px] w-full max-w-[900px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-none overflow-hidden border border-gray-100">
            {/* Sidebar: All, Rings, etc. */}
            <div className="w-[240px] bg-[#f8f9fa] border-r border-gray-100 py-6 shrink-0">
                <ul className="flex flex-col">
                    {mainCategories.map((cat) => (
                        <li key={cat.id}>
                            <Link
                                to={cat.path}
                                onMouseEnter={() => setHoveredCategory(cat.name)}
                                onClick={resetMenu}
                                className={`flex items-center justify-between px-8 py-2.5 text-[15px] transition-all duration-200 ${hoveredCategory === cat.name ? 'text-gray-900 font-bold bg-white' : 'text-[#4b5563] hover:text-gray-900 hover:bg-white/50'}`}
                            >
                                <span className="tracking-tight whitespace-nowrap">{cat.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white py-5 px-12 overflow-y-auto max-h-[550px] no-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={hoveredCategory}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="mb-4">
                            <h3 className="text-[19px] font-bold text-gray-950 tracking-tight">
                                {hoveredCategory === 'All' ? 'All Jewellery' : hoveredCategory}
                            </h3>
                        </div>

                        {hoveredCategory === 'All' ? (
                            /* Screenshot View: Simple vertical list */
                            <div className="flex flex-col gap-2.5">
                                {allJewelleryLinks.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        to={sub.path}
                                        onClick={resetMenu}
                                        className="text-[17px] text-[#4b5563] hover:text-gray-950 transition-colors w-fit tracking-tight"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            /* Subcategory Columns for specific categories - Flexible Flex Layout to prevent overlap */
                            <div className="flex flex-wrap gap-x-12 gap-y-6">
                                {filterGroups.map((group) => (
                                    <div key={group.title} className="flex flex-col gap-3" style={{ minWidth: '130px' }}>
                                        <h4 className="text-[15px] font-bold text-gray-950 tracking-tight whitespace-nowrap">{group.title}</h4>
                                        <div className="flex flex-col gap-1.5">
                                            {group.items.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    onClick={resetMenu}
                                                    className="text-[14px] text-[#4b5563] hover:text-gray-950 transition-colors w-fit tracking-tight leading-tight"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AllJewelleryMenu;
