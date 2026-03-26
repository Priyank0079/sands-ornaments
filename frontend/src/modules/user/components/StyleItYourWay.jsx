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
            const scrollAmount = 350; // Card width + gap
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
        const path = productIds.length > 0
            ? `/shop?products=${encodeURIComponent(productIds.join(','))}`
            : (item.path || `/shop?limit=${limit}&sort=random`);
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
        <section className="pt-8 pb-2 md:pt-24 md:pb-4 bg-white relative">
            <div className="container mx-auto px-2 md:px-4">

                {/* Centered Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="flex flex-col items-center">
                        <span className="text-[#C9A24D] text-sm font-bold tracking-[0.2em] uppercase mb-2 block">Curated For You</span>
                        <h2 className="font-display text-3xl md:text-5xl text-[#722F37]">
                            {sectionData?.label || "Style It Your Way"}
                        </h2>
                        <div className="h-1 w-20 bg-[#C9A24D] mt-3 rounded-full md:hidden"></div>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {displayCollections.map((detail) => (
                        <div
                            key={detail.id}
                            className={`min-w-[70vw] md:min-w-[850px] h-[180px] md:h-[480px] rounded-[1.25rem] md:rounded-[2.5rem] relative flex-shrink-0 snap-center group overflow-hidden cursor-pointer shadow-md md:shadow-2xl transition-all duration-500 isolate`}
                        >
                            <Link to={detail.path}>
                                {/* Full Card Banner Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={detail.image}
                                        alt={detail.title}
                                        className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay with Inner Shadow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent opacity-90 shadow-inner" />
                                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>

                                {/* Content Area - Left Aligned */}
                                <div className="absolute inset-0 flex flex-col justify-center items-start p-3 md:p-16 z-20 w-[80%] md:w-[70%]">
                                    <span className="text-[#C9A24D] text-[7px] md:text-sm font-bold tracking-[0.2em] uppercase mb-1 md:mb-3 drop-shadow-md bg-white/10 px-2 md:px-4 py-0.5 md:py-1.5 rounded-full backdrop-blur-md border border-white/20">
                                        {detail.subtitle}
                                    </span>
                                    <h3 className="font-display text-xl md:text-6xl text-white mb-2 md:mb-6 leading-tight drop-shadow-lg">
                                        {detail.title}
                                    </h3>
                                    <div className="h-[1.5px] w-8 md:w-16 bg-white/50 group-hover:w-32 transition-all duration-500" />
                                </div>
                            </Link>

                            {/* Floating Product Thumbnails - Bottom Right/Center */}
                            <div className="absolute bottom-3 md:bottom-8 right-2 md:right-8 flex gap-1.5 md:gap-4 z-30">
                                {detail.thumbnails.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        className="w-10 h-10 md:w-32 md:h-32 bg-white rounded-lg md:rounded-3xl shadow-md flex items-center justify-center transform hover:-translate-y-2 transition-transform duration-500 hover:scale-105 border border-gray-100 overflow-hidden"
                                    >
                                        <img src={thumb} alt="Product" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons for Desktop - Positioned Below Carousel */}
                <div className="hidden md:flex justify-center gap-6 mt-8">
                    <button
                        onClick={() => scroll('left')}
                        className="p-4 rounded-full border-2 border-[#722F37]/20 hover:bg-[#722F37] hover:text-white text-[#722F37] transition-all duration-300 shadow-sm hover:shadow-lg"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-4 rounded-full border-2 border-[#722F37]/20 hover:bg-[#722F37] hover:text-white text-[#722F37] transition-all duration-300 shadow-sm hover:shadow-lg"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default StyleItYourWay;
