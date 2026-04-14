import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../../../context/ShopContext';

const AllJewelleryMenu = ({ resetMenu }) => {
    const { activeMetal } = useShop();
    const [hoveredCategory, setHoveredCategory] = useState('All');

    const mainCategories = [
        { id: 'all',       name: 'All',                   path: '/shop' },
        { id: 'rings',     name: 'Rings',                 path: '/category/rings',     hasSub: true },
        { id: 'necklaces', name: 'Necklaces & Pendants',  path: '/category/necklaces', hasSub: true },
        { id: 'bracelets', name: 'Bracelets',             path: '/category/bracelets', hasSub: true },
        { id: 'earrings',  name: 'Earrings',              path: '/category/earrings',  hasSub: true },
        { id: 'anklets',   name: 'Anklets',               path: '/category/anklets',   hasSub: true },
        { id: 'others',    name: 'Other Categories',      path: '/collections',         hasSub: true },
    ];

    // Sub-category quick links shown in the "All Jewellery" panel
    const allJewelleryLinks = [
        { id: 'sets',          name: 'Jewellery Sets',   path: '/category/sets' },
        { id: 'personalised',  name: 'Personalised',     path: '/category/personalised' },
        { id: 'watch-charms',  name: 'Watch Charms',     path: '/category/watch-charms' },
        { id: 'mangalsutras',  name: 'Mangalsutras',     path: '/category/mangalsutras' },
        { id: 'chains',        name: 'Chains',           path: '/category/chains' },
        { id: 'toe-rings',     name: 'Toe Rings',        path: '/category/toe-rings' },
        { id: 'nose-pins',     name: 'Nose Pins',        path: '/category/nose-pins' },
        { id: 'kids',          name: 'Kids',             path: '/category/kids' },
    ];

    // ─── FIXED: all URLs now use params that Shop.jsx actually reads ────────────
    const filterGroups = [
        {
            title: 'Shop by Price',
            items: [
                // Shop.jsx reads price_max (upper bound) & price_min (lower bound — newly added)
                { name: 'Under ₹1,500',    path: '/shop?price_max=1500' },
                { name: '₹1,500 – ₹3,000', path: '/shop?price_min=1500&price_max=3000' },
                { name: '₹3,000 – ₹5,000', path: '/shop?price_min=3000&price_max=5000' },
                { name: 'Above ₹5,000',    path: '/shop?price_min=5000' },
            ]
        },
        {
            title: 'Shop by Metal',
            items: [
                // Shop.jsx reads `metal` param — these were already correct
                { name: '925 Silver', path: '/shop?metal=silver' },
                { name: 'Pure Gold',  path: '/shop?metal=gold' },
            ]
        },
        {
            title: 'Shop by Colour',
            items: [
                // Map colour options to search/metal params Shop.jsx supports
                { name: 'Silver',      path: '/shop?metal=silver' },
                { name: 'Gold Plated', path: '/shop?metal=gold' },
                { name: 'Rose Gold',   path: '/shop?search=rose+gold' },
                { name: 'Oxidised',    path: '/shop?search=oxidised' },
            ]
        },
        {
            title: 'Shop by Style',
            items: [
                // Map style to the sort param Shop.jsx supports
                { name: 'Everyday',  path: '/shop?sort=most-sold' },
                { name: 'Festive',   path: '/shop?search=festive' },
                { name: 'Gifting',   path: '/shop?filter=gift' },
                { name: 'Minimalist',path: '/shop?search=minimalist' },
            ]
        }
    ];

    // Per-category filter groups (shown when a category like Rings is hovered)
    const getCategoryFilters = (categoryName) => {
        const catSlug = categoryName.toLowerCase().replace(/\s+/g, '-');
        const catPath = `/category/${catSlug.replace('necklaces-&-pendants', 'necklaces')}`;
        return [
            {
                title: 'Shop by Price',
                items: [
                    { name: 'Under ₹1,500',    path: `${catPath}?price_max=1500` },
                    { name: '₹1,500 – ₹3,000', path: `${catPath}?price_min=1500&price_max=3000` },
                    { name: '₹3,000 – ₹5,000', path: `${catPath}?price_min=3000&price_max=5000` },
                    { name: 'Above ₹5,000',    path: `${catPath}?price_min=5000` },
                ]
            },
            {
                title: 'Shop by Metal',
                items: [
                    { name: '925 Silver', path: `${catPath}?metal=silver` },
                    { name: 'Pure Gold',  path: `${catPath}?metal=gold` },
                ]
            },
            {
                title: 'Colours',
                items: [
                    { name: 'Silver',      path: `${catPath}?metal=silver` },
                    { name: 'Gold Plated', path: `${catPath}?metal=gold` },
                    { name: 'Rose Gold',   path: `${catPath}?search=rose+gold` },
                    { name: 'Oxidised',    path: `${catPath}?search=oxidised` },
                ]
            },
        ];
    };

    const currentFilters = hoveredCategory === 'All'
        ? filterGroups
        : getCategoryFilters(hoveredCategory);

    return (
        <div className="flex bg-white min-h-[450px] w-full max-w-[900px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">

            {/* ── Left Sidebar: Category list ─────────────────────────────── */}
            <div className="w-[240px] bg-[#f8f9fa] border-r border-gray-100 py-6 shrink-0">
                <ul className="flex flex-col">
                    {mainCategories.map((cat) => (
                        <li key={cat.id}>
                            <Link
                                to={cat.path}
                                onMouseEnter={() => setHoveredCategory(cat.name)}
                                onClick={resetMenu}
                                className={`flex items-center justify-between px-8 py-2.5 text-[15px] transition-all duration-200 ${
                                    hoveredCategory === cat.name
                                        ? 'text-gray-900 font-bold bg-white border-l-2 border-[#9C3D5E]'
                                        : 'text-[#4b5563] hover:text-gray-900 hover:bg-white/50'
                                }`}
                            >
                                <span className="tracking-tight whitespace-nowrap">{cat.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── Right Content: Dynamic based on hovered category ─────────── */}
            <div className="flex-1 bg-white py-5 px-10 overflow-y-auto max-h-[550px] no-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={hoveredCategory}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                    >
                        {/* Heading with "View All" shortcut */}
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[20px] font-bold text-gray-950 tracking-tight">
                                {hoveredCategory === 'All' ? 'All Jewellery' : hoveredCategory}
                            </h3>
                            <Link
                                to={mainCategories.find(c => c.name === hoveredCategory)?.path || '/shop'}
                                onClick={resetMenu}
                                className="text-[13px] font-semibold text-[#9C3D5E] hover:underline"
                            >
                                View All →
                            </Link>
                        </div>

                        {hoveredCategory === 'All' ? (
                            /* All Jewellery: simple vertical list of sub-categories */
                            <div className="flex flex-col gap-2.5">
                                {allJewelleryLinks.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        to={sub.path}
                                        onClick={resetMenu}
                                        className="text-[17px] text-[#4b5563] hover:text-[#9C3D5E] transition-colors w-fit tracking-tight"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            /* Category-specific: Price, Metal, Colour filter columns */
                            <div className="flex flex-wrap gap-x-12 gap-y-6">
                                {currentFilters.map((group) => (
                                    <div key={group.title} className="flex flex-col gap-3" style={{ minWidth: '140px' }}>
                                        <h4 className="text-[14px] font-bold text-gray-950 tracking-tight uppercase whitespace-nowrap border-b border-gray-100 pb-2">
                                            {group.title}
                                        </h4>
                                        <div className="flex flex-col gap-2">
                                            {group.items.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    onClick={resetMenu}
                                                    className="text-[14px] text-[#4b5563] hover:text-[#9C3D5E] transition-colors w-fit tracking-tight leading-tight font-medium"
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
