import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Reuse existing category assets (dark stone/lotus theme)
import ringsImg from '../../../assets/categories/rings.png';
import earringsImg from '../../../assets/categories/earrings.png';
import pendantsImg from '../../../assets/categories/pendants.png';
import braceletsImg from '../../../assets/categories/bracelets.png';
import nosepinImg from '../../../assets/categories/nosepin.png';
import mangalsutraImg from '../../../assets/categories/mangalsutra.png';
import setsImg from '../../../assets/categories/sets.png';
import bangleImg from '../../../assets/categories/bangle.png';
import newlaunchImg from '../../../assets/categories/newlaunch.png';

// Newly generated green assets
import goldRingsGreen from '../../../assets/categories/gold_rings_green.png';
import goldEarringsGreen from '../../../assets/categories/gold_earrings_green.png';
import goldPendantsGreen from '../../../assets/categories/gold_pendants_green.png';
import goldBraceletsGreen from '../../../assets/categories/gold_bracelets_green.png';
import goldNosepinsGreen from '../../../assets/categories/gold_nosepins_green.png';
import goldMangalsutraGreen from '../../../assets/categories/gold_mangalsutra_green.png';
import goldBanglesGreen from '../../../assets/categories/gold_bangles_green.png';
import goldSetsGreen from '../../../assets/categories/gold_sets_green.png';
import goldNewArrivalsGreen from '../../../assets/categories/gold_new_arrivals_green.png';

const GOLD_CATEGORIES = [
    { id: 1, name: 'Gold Rings', image: goldRingsGreen, path: '/shop?metal=gold&category=rings', isCustom: true },
    { id: 2, name: 'Gold Earrings', image: goldEarringsGreen, path: '/shop?metal=gold&category=earrings', isCustom: true },
    { id: 3, name: 'Gold Pendants', image: goldPendantsGreen, path: '/shop?metal=gold&category=necklaces' },
    { id: 4, name: 'Gold Bracelets', image: goldBraceletsGreen, path: '/shop?metal=gold&category=bracelets' },
    { id: 5, name: 'Gold Nose Pins', image: goldNosepinsGreen, path: '/shop?metal=gold&category=nose-pins' },
    { id: 6, name: 'Gold Mangalsutra', image: goldMangalsutraGreen, path: '/shop?metal=gold&category=mangalsutras' },
    { id: 7, name: 'Gold Bangles', image: goldBanglesGreen, path: '/shop?metal=gold&category=bangles' },
    { id: 8, name: 'Gold Sets', image: goldSetsGreen, path: '/shop?metal=gold&category=sets' },
    { id: 9, name: 'New Arrivals', image: goldNewArrivalsGreen, path: '/shop?metal=gold&filter=new', badge: 'New' },
];

const GoldCategoryGrid = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full bg-white py-10 relative group">
            <div className="max-w-[1450px] mx-auto px-4 relative">
                {/* Section Title */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className="text-[#C9A84C] text-xl">❧</span>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]" />
                        <h2 className="text-[22px] md:text-[26px] font-semibold text-gray-900 tracking-tight">
                            Shop by Category
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]" />
                    </div>
                    <span className="text-[#C9A84C] text-xl">❧</span>
                </div>

                {/* Scroll Left Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-6 top-[110px] -translate-y-1/2 z-20 bg-white/90 shadow-lg rounded-full p-2 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-white"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                {/* Category Cards */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide gap-4 md:gap-5 pb-4 px-2"
                >
                    {GOLD_CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            to={cat.path}
                            className="flex flex-col items-center group/item cursor-pointer shrink-0"
                        >
                            <div className="relative w-[120px] h-[140px] md:w-[175px] md:h-[195px] mb-3 overflow-hidden rounded-[14px] border border-[#e8d5a3] group-hover/item:border-[#C9A84C] transition-all duration-300 shadow-sm">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                                />
                                {cat.badge && (
                                    <div className="absolute top-2 right-2 bg-[#C9A84C] text-white text-[7px] md:text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase font-bold tracking-wider z-10">
                                        <span className="text-[10px]">✨</span>
                                        {cat.badge}
                                    </div>
                                )}
                            </div>
                            <span className="text-[14px] md:text-[16px] font-bold text-gray-800 group-hover/item:text-[#A8862A] transition-colors text-center tracking-tight leading-tight">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Scroll Right Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-6 top-[110px] -translate-y-1/2 z-20 bg-white/90 shadow-lg rounded-full p-2 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-white"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
            </div>
        </div>
    );
};

export default GoldCategoryGrid;
