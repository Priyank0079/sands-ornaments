import React, { useEffect, useMemo } from 'react';
import { useShop } from '../../../context/ShopContext';
import WomenHeroCarousel from '../components/women/WomenHeroCarousel';
import WomenCategoriesGrid from '../components/women/WomenCategoriesGrid';
import WomenCuratedCollections from '../components/women/WomenCuratedCollections';
import WomenOccasionCarousel from '../components/women/WomenOccasionCarousel';
import WomenDiscoverHue from '../components/women/WomenDiscoverHue';
import WomenPromoBanners from '../components/women/WomenPromoBanners';
import WomenProductsListing from '../components/women/WomenProductsListing';
import WomenProductCategories from '../components/women/WomenProductCategories';
import WomenPersonalisedBanner from '../components/women/WomenPersonalisedBanner';
import WomenPriceRange from '../components/women/WomenPriceRange';
import WomenFeatureBanner from '../components/women/WomenFeatureBanner';

const ShopForWomen = () => {
    const { homepageSections, isLoading } = useShop();

    useEffect(() => {
        document.title = "Shop Women's Jewellery | Sands Ornaments";
        window.scrollTo(0, 0);
    }, []);

    // Filter sections for this page from the global CMS object
    const sections = useMemo(() => {
        // homepageSections is stored as an object { sectionId: { ... } }
        return Object.values(homepageSections || {}).filter(s => s.pageKey === 'shop-women');
    }, [homepageSections]);

    const getSection = (key) => sections.find(s => s.sectionKey === key);

    if (isLoading && sections.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#FDF5F6] min-h-screen text-black font-sans overflow-x-hidden">
            {/* 1. Hero Section */}
            <WomenHeroCarousel data={getSection('hero-banners')} />

            {/* Price Range — Luxury within Reach */}
            <WomenPriceRange data={getSection('price-range')} />

            {/* New Category Section */}
            <WomenProductCategories data={getSection('product-categories')} />

            {/* 2. Category Section (Trending Near You) */}
            <WomenCategoriesGrid data={getSection('trending-grid')} />

            {/* 3. Curated Collections Marquee */}
            <WomenCuratedCollections data={getSection('curated-collections')} />

            {/* 4. Shop by Occasion */}
            <WomenOccasionCarousel data={getSection('occasion-carousel')} />

            {/* New Personalised Banner */}
            <WomenPersonalisedBanner data={getSection('personalised-promo')} />

            {/* 4.5 Discover Your Hue */}
            <WomenDiscoverHue data={getSection('discover-hues')} />

            {/* 5. Promotional Banners (Dark Edit) */}
            <WomenPromoBanners data={getSection('women-promos')} />

            {/* Feature Banner Section */}
            <WomenFeatureBanner data={getSection('feature-banner')} />

            {/* 6. Product Listing Section */}
            <WomenProductsListing data={getSection('products-listing')} />
        </div>
    );
};

export default ShopForWomen;
