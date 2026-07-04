import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomepageCms } from '../hooks/useHomepageCms';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';
import { homeCategoryGridDefaults } from '../utils/homeCategoryGridDefaults';

const normalizeItems = (items = []) => items
    .filter((item) => Boolean(item?.name && item?.image && item?.path))
    .map((item, index) => ({
        id: item.itemId || item.id || `category-grid-item-${index + 1}`,
        name: item.name,
        image: resolveLegacyCmsAsset(item.image, item.image),
        path: item.path,
        badge: item.badge || ''
    }));

const CategoryGrid = () => {
    const scrollRef = useRef(null);
    const { data: homepageSections = {} } = useHomepageCms();
    const sectionData = homepageSections?.['category-grid'];

    const categories = useMemo(() => {
        const dynamicItems = normalizeItems(sectionData?.items || []);
        if (dynamicItems.length > 0) {
            return dynamicItems;
        }
        return normalizeItems(homeCategoryGridDefaults);
    }, [sectionData?.items]);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const { scrollLeft } = scrollRef.current;
        const nextScrollLeft = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
        scrollRef.current.scrollTo({ left: nextScrollLeft, behavior: 'smooth' });
    };

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-white py-3 md:py-6 relative group">
            <div className="container mx-auto px-4 relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-6 top-[75px] -translate-y-1/2 z-20 bg-white/90 shadow-lg rounded-full p-2 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-white"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide gap-4 md:gap-7 pb-2 md:pb-4 px-1 md:px-2 snap-x snap-mandatory"
                >
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            to={category.path}
                            className="flex flex-col group/item cursor-pointer shrink-0 snap-start bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#fce7e8] overflow-hidden w-[120px] md:w-[160px] transition-all duration-300"
                        >
                            <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    loading={index < 4 ? 'eager' : 'lazy'}
                                    decoding={index < 4 ? 'sync' : 'async'}
                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700 ease-out"
                                />
                                {category.badge ? (
                                    <div className="absolute top-2 right-2 bg-[#9C5B61] text-white text-[7px] md:text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase font-bold tracking-wider z-20">
                                        <span className="text-[10px]">{'\u2728'}</span>
                                        {category.badge}
                                    </div>
                                ) : null}

                                {/* Sliding Button Overlay */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#9C5B61] to-[#D39A9F] py-2 md:py-3 transform translate-y-full group-hover/item:translate-y-0 transition-transform duration-500 ease-in-out flex items-center justify-center shadow-[0_-4px_15px_rgba(0,0,0,0.1)] z-10">
                                    <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-1">
                                        Explore <ChevronRight className="w-3 h-3 md:w-3" />
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 text-center bg-white border-t border-gray-50">
                                <span className="text-[12px] md:text-[14px] font-bold text-gray-800 group-hover/item:text-[#9C5B61] transition-colors tracking-tight">
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-6 top-[75px] -translate-y-1/2 z-20 bg-white/90 shadow-lg rounded-full p-2 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-white"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
            </div>
        </div>
    );
};

export default CategoryGrid;
