import React, { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

import ProductCard from './ProductCard';

const BestStylesSection = () => {
    const scrollRef = useRef(null);
    const { products, activeMetal, homepageSections } = useShop();
    const section = homepageSections?.['best-styles'];
    const settings = section?.settings || {};
    const sectionTitle = settings.title || 'Best styles, now for less!';
    const ctaLabel = settings.ctaLabel || 'View All Collection';
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
            if (activeMetal === 'gold') {
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
    }, [activeMetal, productLimit, products]);

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
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                        <h2 className="text-[20px] md:text-[24px] font-sans font-medium text-gray-900 tracking-tight">
                            {sectionTitle}
                        </h2>
                        <Link to="/shop" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8E4A50] hover:underline transition-all">
                            {ctaLabel}
                        </Link>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory px-1">
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
