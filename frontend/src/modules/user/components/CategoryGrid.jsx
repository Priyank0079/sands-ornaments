import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
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
    const { homepageSections } = useShop();
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
        <div className="w-full bg-white py-5 md:py-10 relative group">
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
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={category.path}
                            className="flex flex-col items-center group/item cursor-pointer shrink-0 snap-start"
                        >
                            <div className="relative w-[110px] h-[110px] md:w-[155px] md:h-[155px] mb-3 overflow-hidden rounded-[40px] border border-[#fce7e8] group-hover/item:border-[#9C5B61] transition-all duration-300 shadow-sm">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                                />
                                {category.badge ? (
                                    <div className="absolute top-2 right-2 bg-[#9C5B61] text-white text-[7px] md:text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase font-bold tracking-wider">
                                        <span className="text-[10px]">{'\u2728'}</span>
                                        {category.badge}
                                    </div>
                                ) : null}
                            </div>
                            <span className="text-[13px] md:text-[15px] font-medium text-gray-800 group-hover/item:text-[#9C5B61] transition-colors text-center tracking-tight leading-tight">
                                {category.name}
                            </span>
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
