import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../../../context/ShopContext';

const AllJewelleryMenu = ({ resetMenu }) => {
    const { categories } = useShop();
    const [hoveredCategory, setHoveredCategory] = useState('All');

    const withQuery = (basePath, queryString) => {
        const base = String(basePath || '').trim() || '/shop';
        const qs = String(queryString || '').trim();
        if (!qs) return base;
        return `${base}${base.includes('?') ? '&' : '?'}${qs}`;
    };

    const fallbackMainCategories = [
        { id: 'all',       name: 'All',                   path: '/shop' },
        { id: 'rings',     name: 'Rings',                 path: '/category/rings',     hasSub: true },
        { id: 'necklaces', name: 'Necklaces & Pendants',  path: '/category/necklaces', hasSub: true },
        { id: 'bracelets', name: 'Bracelets',             path: '/category/bracelets', hasSub: true },
        { id: 'earrings',  name: 'Earrings',              path: '/category/earrings',  hasSub: true },
        { id: 'anklets',   name: 'Anklets',               path: '/category/anklets',   hasSub: true },
        { id: 'others',    name: 'Other Categories',      path: '/collections',         hasSub: true },
    ];

    const fallbackAllJewelleryLinks = [
        { id: 'sets',          name: 'Jewellery Sets',   path: '/category/sets' },
        { id: 'personalised',  name: 'Personalised',     path: '/category/personalised' },
        { id: 'watch-charms',  name: 'Watch Charms',     path: '/category/watch-charms' },
        { id: 'mangalsutras',  name: 'Mangalsutras',     path: '/category/mangalsutras' },
        { id: 'chains',        name: 'Chains',           path: '/category/chains' },
        { id: 'toe-rings',     name: 'Toe Rings',        path: '/category/toe-rings' },
        { id: 'nose-pins',     name: 'Nose Pins',        path: '/category/nose-pins' },
        { id: 'kids',          name: 'Kids',             path: '/category/kids' },
    ];

    const mainCategories = useMemo(() => {
        const navbarCategories = (categories || [])
            .filter((cat) => cat?.isActive !== false && cat?.showInNavbar !== false)
            .sort((a, b) => Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0)
                || String(a?.name || '').localeCompare(String(b?.name || '')))
            .map((cat) => {
                let slug = String(cat?.slug || cat?.path || '').trim();
                slug = slug.replace(/^\/+/, '');
                if (slug.toLowerCase().startsWith('category/')) {
                    slug = slug.slice('category/'.length);
                }
                const id = cat?._id || cat?.id || '';
                const safePath = slug
                    ? `/category/${slug}`
                    : (id ? `/shop?category=${encodeURIComponent(String(id))}` : '/shop');
                return {
                    id: id || slug || cat?.name,
                    name: cat?.name || '',
                    path: safePath,
                    hasSub: true
                };
            })
            .filter((cat) => Boolean(cat.name));

        if (navbarCategories.length === 0) {
            return fallbackMainCategories;
        }

        return [
            { id: 'all', name: 'All', path: '/shop' },
            ...navbarCategories
        ];
    }, [categories]);

    const allJewelleryLinks = useMemo(() => {
        const dynamicLinks = mainCategories
            .filter((cat) => cat.id !== 'all')
            .map((cat) => ({
                id: cat.id,
                name: cat.name,
                path: cat.path
            }));

        return dynamicLinks.length > 0 ? dynamicLinks : fallbackAllJewelleryLinks;
    }, [mainCategories]);

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
                // Align with purity behavior: 925 = sterling-only, pure gold = 24K.
                { name: '925 Silver', path: '/shop?metal=silver&silver_type=sterling' },
                { name: 'Pure Gold',  path: '/shop?metal=gold&karat=24' },
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
                { name: 'Gifting',   path: '/shop?search=gift' },
                { name: 'Minimalist',path: '/shop?search=minimalist' },
            ]
        }
    ];

    // Per-category filter groups (shown when a category like Rings is hovered)
    const getCategoryFilters = (categoryName) => {
        const matchedCategory = mainCategories.find((cat) => cat.name === categoryName);
        const fallbackSlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace('necklaces-&-pendants', 'necklaces');
        const catPath = matchedCategory?.path || `/category/${fallbackSlug}`;
        return [
            {
                title: 'Shop by Price',
                items: [
                    { name: 'Under ₹1,500',    path: withQuery(catPath, 'price_max=1500') },
                    { name: '₹1,500 – ₹3,000', path: withQuery(catPath, 'price_min=1500&price_max=3000') },
                    { name: '₹3,000 – ₹5,000', path: withQuery(catPath, 'price_min=3000&price_max=5000') },
                    { name: 'Above ₹5,000',    path: withQuery(catPath, 'price_min=5000') },
                ]
            },
            {
                title: 'Shop by Metal',
                items: [
                    // Keep consistent with the ALL TYPE purity behavior.
                    { name: '925 Silver', path: withQuery(catPath, 'metal=silver&silver_type=sterling') },
                    { name: 'Pure Gold',  path: withQuery(catPath, 'metal=gold&karat=24') },
                ]
            },
            {
                title: 'Colours',
                items: [
                    { name: 'Silver',      path: withQuery(catPath, 'metal=silver') },
                    { name: 'Gold Plated', path: withQuery(catPath, 'metal=gold') },
                    { name: 'Rose Gold',   path: withQuery(catPath, 'search=rose+gold') },
                    { name: 'Oxidised',    path: withQuery(catPath, 'search=oxidised') },
                ]
            },
        ];
    };

    const currentFilters = hoveredCategory === 'All'
        ? filterGroups
        : getCategoryFilters(hoveredCategory);

    return (
        <div className="flex bg-white h-[420px] w-full max-w-[850px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100 rounded-b-lg font-sans">

            {/* ── Left Sidebar: Category list (Compact & Scrollable) ─────────────────────────────── */}
            <div className="w-[220px] bg-[#fcfcfc] border-r border-gray-100 py-2 shrink-0 overflow-y-auto custom-scrollbar">
                <ul className="flex flex-col">
                    {mainCategories.map((cat) => (
                        <li key={cat.id}>
                            <Link
                                to={cat.path}
                                onMouseEnter={() => setHoveredCategory(cat.name)}
                                onClick={resetMenu}
                                className={`flex items-center px-5 py-2 text-[13px] transition-all duration-200 border-l-2 ${
                                    hoveredCategory === cat.name
                                        ? 'text-[#8E2B45] font-bold bg-white border-[#8E2B45]'
                                        : 'text-gray-500 font-normal border-transparent hover:text-gray-800 hover:bg-gray-50'
                                }`}
                            >
                                <span className="tracking-normal whitespace-nowrap">{cat.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── Right Content: Dynamic (Compact & Scrollable) ─────────── */}
            <div className="flex-1 bg-white py-6 px-8 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={hoveredCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        {/* Heading - Smaller & Cleaner */}
                        <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
                            <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">
                                {hoveredCategory === 'All' ? 'All Jewellery' : hoveredCategory}
                            </h3>
                            <Link
                                to={mainCategories.find(c => c.name === hoveredCategory)?.path || '/shop'}
                                onClick={resetMenu}
                                className="text-[11px] font-bold text-[#8E2B45] hover:underline uppercase tracking-wider"
                            >
                                View All →
                            </Link>
                        </div>

                        {hoveredCategory === 'All' ? (
                            /* All Jewellery: high-density grid */
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                {allJewelleryLinks.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        to={sub.path}
                                        onClick={resetMenu}
                                        className="text-[13.5px] font-normal text-gray-600 hover:text-[#8E2B45] transition-colors py-0.5"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            /* Category-specific: Price, Metal, Colour filter columns */
                            <div className="flex flex-wrap gap-x-10 gap-y-8">
                                {currentFilters.map((group) => (
                                    <div key={group.title} className="flex flex-col gap-3" style={{ minWidth: '130px' }}>
                                        <h4 className="text-[10px] font-black text-gray-400 tracking-[0.1em] uppercase whitespace-nowrap border-b border-gray-50 pb-1.5">
                                            {group.title}
                                        </h4>
                                        <div className="flex flex-col gap-2">
                                            {group.items.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    onClick={resetMenu}
                                                    className="text-[13px] text-gray-600 hover:text-[#8E2B45] transition-colors w-fit font-normal"
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
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ddd;
                }
            `}</style>
        </div>
    );
};

export default AllJewelleryMenu;
