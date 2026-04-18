import React, { useEffect } from 'react';
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

import Loader from '../../shared/components/Loader';

const ShopForWomen = () => {
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        document.title = "Shop Women's Jewellery | Sands Ornaments";
        window.scrollTo(0, 0);
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="bg-[#FDF5F6] min-h-screen text-black font-sans overflow-x-hidden">
            {/* 1. Hero Section */}
            <WomenHeroCarousel />

            {/* Price Range — Luxury within Reach */}
            <WomenPriceRange />

            {/* New Category Section */}
            <WomenProductCategories />

            {/* 2. Category Section (Img 2) */}
            <WomenCategoriesGrid />

            {/* 3. Curated Collections Marquee (Img 3) */}
            <WomenCuratedCollections />

            {/* 4. Shop by Occasion (Img 4) */}
            <WomenOccasionCarousel />

            {/* New Personalised Banner */}
            <WomenPersonalisedBanner />

            {/* 4.5 Discover Your Hue (Img 4.5) */}
            <WomenDiscoverHue />


            {/* 5. Promotional Banners (Img 14) */}
            <WomenPromoBanners />

            {/* Feature Banner Section */}
            <WomenFeatureBanner />

            {/* 6. Product Listing Section */}
            <WomenProductsListing />
        </div>
    );
};

export default ShopForWomen;
