import React, { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { useHomepageCms } from '../hooks/useHomepageCms';

import ProductCard from './ProductCard';

const ensureGoldPath = (rawPath = '') => {
    const source = String(rawPath || '').trim();
    if (!source) return '/shop?metal=gold';
    if (!source.startsWith('/shop')) return source;
    if (/([?&])metal=gold(&|$)/i.test(source)) return source;
    return `${source}${source.includes('?') ? '&' : '?'}metal=gold`;
};

const BestStylesSection = ({ sectionData = null }) => {
    const scrollRef = useRef(null);
    const { products, activeMetal } = useShop();
    const { data: homepageSections = {} } = useHomepageCms();
    const section = sectionData || homepageSections?.['best-styles'];
    const settings = section?.settings || {};
    const isGoldSection = section?.pageKey === 'gold-collection' || String(section?.sectionId || '').startsWith('gold-collection:');
    const sectionTitle = settings.title || 'Best styles, now for less!';
    const sectionSubtitle = settings.subtitle || '';
    const ctaLabel = settings.ctaLabel || 'View All Collection';
    const ctaPath = isGoldSection
        ? ensureGoldPath(settings.ctaPath || '/shop?metal=gold')
        : (settings.ctaPath || '/shop');
    const productLimit = Math.max(1, Number(settings.productLimit) || 6);

    const dynamicProducts = useMemo(() => {
        const getEffectivePrice = (product) => {
            const topLevelCandidates = [
                product?.finalPrice,
                product?.price
            ]
                .map((value) => Number(value))
                .filter((value) => Number.isFinite(value) && value > 0);

            if (topLevelCandidates.length > 0) return topLevelCandidates[0];

            const variantPrices = (product?.variants || [])
                .map((variant) => Number(variant?.finalPrice ?? variant?.price))
                .filter((value) => Number.isFinite(value) && value > 0);
            return variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
        };

        const getOriginalPrice = (product) => {
            const topLevelCandidates = [
                product?.originalPrice,
                product?.mrp
            ]
                .map((value) => Number(value))
                .filter((value) => Number.isFinite(value) && value > 0);

            if (topLevelCandidates.length > 0) return topLevelCandidates[0];

            const variantMrps = (product?.variants || [])
                .map((variant) => Number(variant?.mrp ?? variant?.price ?? variant?.finalPrice))
                .filter((value) => Number.isFinite(value) && value > 0);
            return variantMrps.length > 0 ? Math.max(...variantMrps) : 0;
        };

        const getDiscountAmount = (product) => {
            const originalPrice = getOriginalPrice(product);
            const effectivePrice = getEffectivePrice(product);
            return Math.max(0, originalPrice - effectivePrice);
        };

        const getProductMetal = (product) => {
            const explicitMetal = String(product?.metal || product?.material || '').trim().toLowerCase();
            if (explicitMetal) return explicitMetal;
            if (product?.goldCategory) return 'gold';
            return 'silver';
        };

        const matchingMetalProducts = products.filter((product) => {
            if (isGoldSection || activeMetal === 'gold') {
                return getProductMetal(product) === 'gold';
            }
            return getProductMetal(product) !== 'gold';
        });

        return matchingMetalProducts
            .map((product) => {
                const price = getEffectivePrice(product);
                const originalPrice = getOriginalPrice(product);
                const discountAmount = getDiscountAmount(product);
                return {
                    ...product,
                    id: product.id || product._id,
                    price,
                    originalPrice,
                    rating: Number(product.rating || 4.5),
                    reviewCount: Number(product.reviewCount ?? product.reviews ?? 0),
                    priceDrop: discountAmount > 0,
                    isTrending: Boolean(product.isTrending || product.tags?.isTrending),
                    discountAmount,
                    soldCount: Number(product.sold || 0)
                };
            })
            .filter((product) => product.price > 0 && product.originalPrice > product.price)
            .sort((a, b) => {
                if (Boolean(b.isTrending) !== Boolean(a.isTrending)) {
                    return b.isTrending ? 1 : -1;
                }
                if (b.discountAmount !== a.discountAmount) {
                    return b.discountAmount - a.discountAmount;
                }
                if (b.soldCount !== a.soldCount) {
                    return b.soldCount - a.soldCount;
                }
                return b.originalPrice - a.originalPrice;
            })
            .slice(0, productLimit);
    }, [activeMetal, isGoldSection, productLimit, products]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const scrollAmount = window.innerWidth > 768 ? 400 : 250;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const displayItems = dynamicProducts;

    if (displayItems.length === 0) return null;

    return (
        <section className="pt-2 pb-2 md:pt-4 md:pb-4 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1450px]">
                <div className="relative mb-4 md:mb-6 flex flex-col items-center">
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-[24px] md:text-[40px] font-serif text-gray-900 tracking-tight leading-tight mb-2">
                            {sectionTitle}
                        </h2>
                        {sectionSubtitle ? (
                            <p className="text-[13px] md:text-[15px] text-gray-500 mb-3">{sectionSubtitle}</p>
                        ) : null}
                        <Link to={ctaPath} className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] text-[#8E4A50] hover:text-[#5B1E26] transition-all flex items-center gap-2 group">
                            {ctaLabel}
                            <div className="w-4 h-4 rounded-full bg-[#8E4A50]/10 flex items-center justify-center group-hover:bg-[#8E4A50] group-hover:text-white transition-all">
                                <ChevronRight className="w-2.5 h-2.5" />
                            </div>
                        </Link>
                    </div>
                    
                    {/* Navigation Arrows - Positioned on the right for desktop */}
                    <div className="hidden md:flex gap-2 absolute right-0 bottom-0">
                        <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 md:pb-8 snap-x snap-mandatory px-1">
                    {dynamicProducts.map((product) => (
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

export default BestStylesSection;
