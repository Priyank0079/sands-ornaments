import React, { useEffect } from 'react';
import MenHeroCarousel from '../components/men/MenHeroCarousel';
import MenCategoriesGrid from '../components/men/MenCategoriesGrid';
import MenLuxurySection from '../components/men/MenLuxurySection';
import MenCuratedCollections from '../components/men/MenCuratedCollections';
import CelebrateMen from '../components/men/CelebrateMen';
import MenPersonalizedBanner from '../components/men/MenPersonalizedBanner';
import MenInteractiveLook from '../components/men/MenInteractiveLook';
import MenStyleGuide from '../components/men/MenStyleGuide';
import MenStyleTrends from '../components/men/MenStyleTrends';
import ShopTheLook from '../components/men/ShopTheLook';
import MenFeaturedProducts from '../components/men/MenFeaturedProducts';

const ShopForMen = () => {
    useEffect(() => {
        document.title = "Shop Men's Jewellery | Sands Ornaments";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FDF5F6] min-h-screen text-[#111827] font-sans overflow-x-hidden">
            <MenHeroCarousel />
            <MenCategoriesGrid />
            <MenLuxurySection />
            <CelebrateMen />
            <MenCuratedCollections />
            <MenPersonalizedBanner />
            <MenInteractiveLook />
            <MenStyleGuide />
            <MenStyleTrends />
            <ShopTheLook />
            <MenFeaturedProducts />
        </div>
    );
};

export default ShopForMen;
