import React, { useEffect } from 'react';
import WomenHeroCarousel from '../components/women/WomenHeroCarousel';
import WomenCategoriesGrid from '../components/women/WomenCategoriesGrid';
import WomenCuratedCollections from '../components/women/WomenCuratedCollections';
import WomenOccasionCarousel from '../components/women/WomenOccasionCarousel';
import WomenDiscoverHue from '../components/women/WomenDiscoverHue';
import WomenPromoBanners from '../components/women/WomenPromoBanners';
import WomenProductsListing from '../components/women/WomenProductsListing';

const ShopForWomen = () => {
    useEffect(() => {
        document.title = "Shop Women's Jewellery | Sands Ornaments";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FDF5F6] min-h-screen text-black font-sans overflow-x-hidden">
            {/* 1. Hero Section (Img 1) */}
            <WomenHeroCarousel />

            {/* 2. Category Section (Img 2) */}
            <WomenCategoriesGrid />

            {/* 3. Curated Collections Marquee (Img 3) */}
            <WomenCuratedCollections />

            {/* 4. Shop by Occasion (Img 4) */}
            <WomenOccasionCarousel />

            {/* 4.5 Discover Your Hue (Img 4.5) */}
            <WomenDiscoverHue />

            {/* 5. Promotional Banners (Img 14) */}
            <WomenPromoBanners />

            {/* 6. Product Listing Section */}
            <WomenProductsListing />
        </div>
    );
};

export default ShopForWomen;
