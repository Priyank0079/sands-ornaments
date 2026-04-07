import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MenStyleGuide = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth / 2 + 20; 
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const displayCollections = [
        {
            id: 1,
            title: "Daily Wear",
            subtitle: "Effortless Everyday",
            image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1600&auto=format&fit=crop",
            thumbnails: [
                "https://images.unsplash.com/photo-1627252824855-5874256677fe?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1616890795183-53d3cfa343f7?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop"
            ],
            path: "/category/men"
        },
        {
            id: 2,
            title: "Office Wear",
            subtitle: "Professional Chic",
            image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
            thumbnails: [
                "https://images.unsplash.com/photo-1633192070622-c313a9686315?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=80&w=400&auto=format&fit=crop"
            ],
            path: "/category/men"
        },
        {
            id: 3,
            title: "Party Wear",
            subtitle: "Glamour & Shine",
            image: "https://images.unsplash.com/photo-1520330363299-4065651cd724?q=80&w=1600&auto=format&fit=crop",
            thumbnails: [
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1624448664188-348651a02801?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1623991109023-124372861c17?q=80&w=400&auto=format&fit=crop"
            ],
            path: "/category/men"
        }
    ];

    // Mobile Auto-scroll functionality from Homepage
    useEffect(() => {
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

                {/* Centered Header - Exactly same as Homepage */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="flex flex-col items-center">
                        <span className="text-[#C9A24D] text-sm font-bold tracking-[0.2em] uppercase mb-2 block">Curated For Him</span>
                        <h2 className="font-serif text-2xl md:text-4xl text-[#722F37]">
                            Style It Your Way
                        </h2>
                    </div>
                </div>

                <div className="relative group/carousel">
                    {/* Navigation Buttons - Exactly same as Homepage */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-[40%] text-[#722F37] -translate-y-1/2 -translate-x-1/2 z-50 p-2.5 bg-white rounded-full shadow-xl hover:bg-[#722F37] hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center border border-gray-100"
                        title="Scroll Left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-[40%] text-[#722F37] -translate-y-1/2 translate-x-1/2 z-50 p-2.5 bg-white rounded-full shadow-xl hover:bg-[#722F37] hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center border border-gray-100"
                        title="Scroll Right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Carousel Container - Exactly same as Homepage */}
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
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent opacity-90 shadow-inner" />
                                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
                                    </div>

                                    {/* Content Area - Left Aligned */}
                                    <div className="absolute inset-0 flex flex-col justify-center items-start p-4 md:p-12 z-20 w-[80%] md:w-[70%]">
                                        <span className="text-[#C9A24D] text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase mb-1 md:mb-3 drop-shadow-md bg-white/10 px-3 md:px-4 py-1 rounded-full backdrop-blur-md border border-white/20">
                                            {detail.subtitle}
                                        </span>
                                        <h3 className="font-serif text-2xl md:text-5xl text-white mb-2 md:mb-5 leading-tight drop-shadow-lg font-medium">
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

export default MenStyleGuide;
