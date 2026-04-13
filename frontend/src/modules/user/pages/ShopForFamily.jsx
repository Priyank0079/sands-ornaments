import React, { useEffect, useState } from 'react';
import FamilyHeroCarousel from '../components/family/FamilyHeroCarousel';
import FamilyPricePoints from '../components/family/FamilyPricePoints';
import FamilyRecipientCategories from '../components/family/FamilyRecipientCategories';
import FamilyCuratedCollections from '../components/family/FamilyCuratedCollections';
import FamilyTrendingNearYou from '../components/family/FamilyTrendingNearYou';
import FamilyPromoBanner from '../components/family/FamilyPromoBanner';
import Family3DCarousel from '../components/family/Family3DCarousel';
import FamilyProductsCatalog from '../components/family/FamilyProductsCatalog';

const ShopForFamily = () => {
    const [selectedRecipient, setSelectedRecipient] = useState('all');

    useEffect(() => {
        document.title = "Gifts for Family | Sands Ornaments";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen text-black font-sans overflow-x-hidden">
            {/* 1. Hero Section */}
            <FamilyHeroCarousel />

            {/* Price Points Quick Access */}
            <FamilyPricePoints />

            {/* Curated Collections Showcase */}
            <FamilyCuratedCollections />

            {/* 2. Category Section */}
            <FamilyRecipientCategories
                selectedRecipient={selectedRecipient}
                onSelectRecipient={setSelectedRecipient}
            />

            {/* Trending Section */}
            <FamilyTrendingNearYou />

            {/* Promotional Banner */}
            <FamilyPromoBanner />

            {/* 3D Interactive Carousel */}
            <Family3DCarousel />

            {/* 3. Product Listing Section */}
            <FamilyProductsCatalog
                selectedRecipient={selectedRecipient}
                onSelectRecipient={setSelectedRecipient}
            />
        </div>
    );
};

export default ShopForFamily;
