import React, { useEffect } from 'react';
import MenHeroCarousel from '../components/men/MenHeroCarousel';
import MenCategoriesGrid from '../components/men/MenCategoriesGrid';
import MenCuratedCollections from '../components/men/MenCuratedCollections';
import MenProductsListing from '../components/men/MenProductsListing';
import CelebrateMen from '../components/men/CelebrateMen';
import ShopTheLook from '../components/men/ShopTheLook';
import MenInteractiveLook from '../components/men/MenInteractiveLook';
import MenStyleGuide from '../components/men/MenStyleGuide';

const ShopForMen = () => {
    useEffect(() => {
        document.title = "Shop Men's Jewellery | Sands Ornaments";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#F8FAFC] min-h-screen text-[#111827] font-sans overflow-x-hidden">
            <MenHeroCarousel />
            <MenCategoriesGrid />
            <MenCuratedCollections />
            <CelebrateMen />
            <MenStyleGuide />
            <MenInteractiveLook />
            <MenProductsListing />
        </div>
    );
};

export default ShopForMen;
