import React, { useEffect } from 'react';
import MenHeroCarousel from '../components/men/MenHeroCarousel';
import MenCategoriesGrid from '../components/men/MenCategoriesGrid';
import MenCuratedCollections from '../components/men/MenCuratedCollections';
import MenProductsListing from '../components/men/MenProductsListing';
import CelebrateMen from '../components/men/CelebrateMen';
import ShopTheLook from '../components/men/ShopTheLook';
import MenStyleTrends from '../components/men/MenStyleTrends';
import MenInteractiveLook from '../components/men/MenInteractiveLook';
import MenStyleGuide from '../components/men/MenStyleGuide';
import MenPersonalizedBanner from '../components/men/MenPersonalizedBanner';

const ShopForMen = () => {
    useEffect(() => {
        document.title = "Shop Men's Jewellery | Sands Ornaments";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FDF5F6] min-h-screen text-[#111827] font-sans overflow-x-hidden">
            <MenHeroCarousel />
            <MenCategoriesGrid />
            <MenCuratedCollections />
            <MenPersonalizedBanner />
            <CelebrateMen />
            <MenInteractiveLook />
            <MenStyleGuide />
            <MenProductsListing />
            <MenStyleTrends />
            <ShopTheLook />
        </div>
    );
};

export default ShopForMen;
