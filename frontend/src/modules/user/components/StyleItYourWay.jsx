import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

// Importing assets for Banners (using available hero/trending assets)
import bannerDaily from '../assets/banner_daily.png';
import bannerOffice from '../assets/banner_office.png';
import bannerParty from '../assets/banner_party.png';
import bannerCasual from '../assets/trending_heritage.png';

// Importing assets for Thumbnails (using available product assets)
import prodChain from '../assets/silver_chain_product.png';
import prodBracelet from '../assets/silver_bracelet_product.png';
import prodEarring from '../assets/silver_earrings_product.png';
import prodPendant from '../assets/cat_pendant.png';
import prodRing from '../assets/cat_ring_wine.png';
import prodAnklet from '../assets/cat_anklets.png'; // Premium Asset
import prodGift from '../assets/gift_friends_silver.png';
import prodSis from '../assets/gift_sister_silver.png';
import prodWineEar from '../assets/cat_earrings_wine.png';
import prodWineRing from '../assets/cat_ring_wine.png';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

const StyleItYourWay = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['style-it-your-way'];

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth / 2 + 20; // Approximately one card width + gap half
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const defaultCollections = [
        {
            id: 1,
            title: "Daily Wear",
            subtitle: "Effortless Everyday",
            image: bannerDaily,
            thumbnails: [prodPendant, prodWineEar, prodAnklet],
            path: "/shop"
        },
        {
            id: 2,
            title: "Office Wear",
            subtitle: "Professional Chic",
            image: bannerOffice,
            thumbnails: [prodEarring, prodPendant, prodRing],
            path: "/shop"
        },
        {
            id: 3,
            title: "Party Wear",
            subtitle: "Glamour & Shine",
            image: bannerParty,
            thumbnails: [prodWineEar, prodWineRing, prodAnklet],
            path: "/shop"
        },
        {
            id: 4,
            title: "Casual Wear",
            subtitle: "Relaxed Vibes",
            image: bannerCasual,
            thumbnails: [prodAnklet, prodBracelet, prodSis],
            path: "/shop"
        }
    ];

    const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
    const normalizedConfiguredItems = configuredItems.map((item, index) => {
        const fallback = defaultCollections[index] || defaultCollections[0];
        const productIds = Array.isArray(item.productIds) ? item.productIds.filter(Boolean) : [];
        const limit = item.limit ? Number(item.limit) : 12;
        const path = item.path || (
            productIds.length > 0
                ? `/shop?products=${encodeURIComponent(productIds.join(','))}&limit=${limit}&sort=random`
                : `/shop?limit=${limit}&sort=random`
        );
        const extraImages = Array.isArray(item.extraImages) ? item.extraImages.filter(Boolean) : [];
        return {
            id: item.itemId || item._id || item.id || `style-${index}`,
            title: item.name || item.label || fallback.title,
            subtitle: item.tag || fallback.subtitle,
            image: resolveLegacyCmsAsset(item.image, fallback.image),
            thumbnails: (extraImages.length > 0 ? extraImages : fallback.thumbnails).map((thumb) => resolveLegacyCmsAsset(thumb, thumb)),
            path
        };
    });

    const displayCollections = normalizedConfiguredItems.length > 0 ? normalizedConfiguredItems : defaultCollections;

    React.useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { current } = scrollRef;
                const maxScroll = current.scrollWidth - current.clientWidth;
                const isAtEnd = current.scrollLeft >= maxScroll - 10;

                if (isAtEnd) {
                    current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    current.scrollBy({ left: current.clientWidth * 0.9 + 24, behavior: 'smooth' });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="pt-6 pb-2 md:pt-16 md:pb-4 bg-white relative">
            <div className="container mx-auto px-4 md:px-6">

                {/* Centered Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="flex flex-col items-center">
                        <span className="text-[#C9A24D] text-sm font-bold tracking-[0.2em] uppercase mb-2 block">Curated For You</span>
                        <h2 className="font-display text-2xl md:text-4xl text-[#722F37]">
                            {sectionData?.label || "Style It Your Way"}
                        </h2>
                    </div>
                </div>

                <div className="relative group/carousel">
                    {/* Navigation Buttons - Absolute Positioned */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 z-50 p-2.5 bg-white rounded-full shadow-xl text-[#4A1015] hover:bg-[#4A1015] hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center border border-gray-100"
                        title="Scroll Left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 z-50 p-2.5 bg-white rounded-full shadow-xl text-[#4A1015] hover:bg-[#4A1015] hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center border border-gray-100"
                        title="Scroll Right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Carousel Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-10 overflow-x-auto pb-24 pt-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {displayCollections.map((detail) => (
                            <div
                                key={detail.id}
                                className={`min-w-[85vw] md:min-w-[calc(50%-20px)] h-[220px] md:h-[380px] rounded-[1.5rem] md:rounded-[2.5rem] relative flex-shrink-0 snap-center group overflow-visible cursor-pointer transition-all duration-500 isolate mb-12`}
                            >
                                <Link to={detail.path}>
                                    {/* Full Card Banner Image */}
                                    <div className="absolute inset-0 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                                        <img
                                            src={detail.image}
                                            alt={detail.title}
                                            className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                                        />
                                        {/* Gradient Overlay with Inner Shadow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent opacity-90 shadow-inner" />
                                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
                                    </div>

                                    {/* Content Area - Left Aligned */}
                                    <div className="absolute inset-0 flex flex-col justify-center items-start p-4 md:p-12 z-20 w-[80%] md:w-[70%]">
                                        <span className="text-[#C9A24D] text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase mb-1 md:mb-3 drop-shadow-md bg-white/10 px-3 md:px-4 py-1 rounded-full backdrop-blur-md border border-white/20">
                                            {detail.subtitle}
                                        </span>
                                        <h3 className="font-display text-2xl md:text-5xl text-white mb-2 md:mb-5 leading-tight drop-shadow-lg">
                                            {detail.title}
                                        </h3>
                                        <div className="h-[1.5px] w-12 md:w-20 bg-white/50 group-hover:w-32 transition-all duration-500 shadow-sm" />
                                    </div>
                                </Link>

                                {/* Floating Product Thumbnails - Bottom Centered & Overlapping */}
                                <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 md:gap-6 z-40 w-full px-4">
                                    {detail.thumbnails.slice(0, 3).map((thumb, idx) => (
                                        <div
                                            key={idx}
                                            className="w-[28%] aspect-square md:w-36 md:h-36 bg-white rounded-2xl md:rounded-[2rem] shadow-[0_10px_35px_rgba(0,0,0,0.15)] flex items-center justify-center border-2 md:border-[3px] border-[#C9A24D] overflow-hidden"
                                        >
                                            <img src={thumb} alt="Product" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StyleItYourWay;
