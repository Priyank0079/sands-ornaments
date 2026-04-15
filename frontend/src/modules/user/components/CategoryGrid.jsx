import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Assets
import mangalsutraImg from '../../../assets/categories/mangalsutra.png';
import nosepinImg from '../../../assets/categories/nosepin.png';
import personalisedImg from '../../../assets/categories/personalised.png';
import bangleImg from '../../../assets/categories/bangle.png';
import toeringsImg from '../../../assets/categories/toerings.png';
import newlaunchImg from '../../../assets/categories/newlaunch.png';
import ringsImg from '../../../assets/categories/rings.png';
import braceletsImg from '../../../assets/categories/bracelets.png';
import pendantsImg from '../../../assets/categories/pendants.png';
import earringsImg from '../../../assets/categories/earrings.png';
import mensilverImg from '../../../assets/categories/mensilver.png';
import setsImg from '../../../assets/categories/sets.png';
import ankletsImg from '../../../assets/categories/anklets.png';
import silverchainsImg from '../../../assets/categories/silverchains.png';

const CATEGORIES = [
    { id: 1, name: 'Rings', image: ringsImg, path: '/category/rings' },
    { id: 2, name: 'Bracelets', image: braceletsImg, path: '/category/bracelets' },
    { id: 3, name: 'Pendants', image: pendantsImg, path: '/category/necklaces' },
    { id: 4, name: 'Earrings', image: earringsImg, path: '/category/earrings' },
    { id: 5, name: 'Men in Silver', image: mensilverImg, path: '/category/men' },
    { id: 6, name: 'Sets', image: setsImg, path: '/category/sets' },
    { id: 7, name: 'Anklets', image: ankletsImg, path: '/category/anklets' },
    { id: 8, name: 'Silver Chains', image: silverchainsImg, path: '/category/chains' },
    { id: 9, name: 'Mangalsutras', image: mangalsutraImg, path: '/category/mangalsutras' },
    { id: 10, name: 'Nose Pins', image: nosepinImg, path: '/category/nose-pins' },
    { id: 11, name: 'Personalised', image: personalisedImg, path: '/category/personalised' },
    { id: 13, name: 'Bangles', image: bangleImg, path: '/category/bangle' },
    { id: 14, name: 'Toe Rings', image: toeringsImg, path: '/category/toe-rings' },
    { id: 15, name: 'New Launch', image: newlaunchImg, path: '/category/new-launch', badge: 'Fresh Drops' },
];

const CategoryGrid = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full bg-white py-5 md:py-10 relative group">
            <div className="container mx-auto px-4 relative">
                {/* Scroll Buttons */}
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
                    {CATEGORIES.map((cat) => (
                        <Link 
                            key={cat.id} 
                            to={cat.path} 
                            className="flex flex-col items-center group/item cursor-pointer shrink-0 snap-start"
                        >
                            <div className="relative w-[86px] h-[86px] md:w-[155px] md:h-[155px] mb-2 md:mb-3 overflow-hidden rounded-[28px] md:rounded-[40px] border border-[#fce7e8] group-hover/item:border-[#9C5B61] transition-all duration-300 shadow-sm">
                                <img 
                                    src={cat.image} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                                />
                                {cat.badge && (
                                    <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-[#9C5B61] text-white text-[6px] md:text-[9px] px-1.5 md:px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase font-bold tracking-wider">
                                        <span className="text-[10px]">✨</span>
                                        {cat.badge}
                                    </div>
                                )}
                            </div>
                            <span className="text-[12px] md:text-[15px] font-medium text-gray-800 group-hover/item:text-[#9C5B61] transition-colors text-center tracking-tight leading-tight">
                                {cat.name}
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
