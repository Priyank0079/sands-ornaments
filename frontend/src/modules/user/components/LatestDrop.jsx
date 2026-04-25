import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { useHomepageCms } from '../hooks/useHomepageCms';
import ProductCard from './ProductCard';
import { COLLECTION_MOCK_PRODUCTS } from '../data/mockCollectionData';

const LatestDrop = () => {
    const { products } = useShop();
    const { data: homepageSections = {} } = useHomepageCms();
    const scrollRef = React.useRef(null);

    const sectionData = homepageSections?.['latest-drop'];
    
    const displayProducts = React.useMemo(() => {
        // Use the 'lp' (lead products) from mocks, or find recent products from the context
        const mockLatest = COLLECTION_MOCK_PRODUCTS.lp || [];
        const contextLatest = products.slice(-8); // Get last 8 from context if available
        
        // Remove duplicates if any
        const combined = [...mockLatest, ...contextLatest.filter(p => !mockLatest.some(m => m.name === p.name))];
        return combined.slice(0, 12);
    }, [products]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const scrollAmount = window.innerWidth > 768 ? 400 : 250;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1450px]">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                        <span className="text-[#8E4A50] font-sans tracking-[0.3em] font-bold text-[10px] uppercase mb-1">
                            Fresh Arrivals
                        </span>
                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                            <h2 className="text-[20px] md:text-[24px] font-sans font-medium text-gray-900 tracking-tight">
                                {sectionData?.label || "Latest Drop"}
                            </h2>
                            <Link to="/new-arrivals" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8E4A50] hover:underline transition-all">
                                View All Collection
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ArrowRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory px-1">
                    {displayProducts.map((product) => (
                        <div key={product.id} className="min-w-[180px] md:min-w-[280px] w-[180px] md:w-[280px] snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
        </section>
    );
};

export default LatestDrop;
