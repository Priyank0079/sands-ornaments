import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FamilyHeroCarousel from '../components/family/FamilyHeroCarousel';
import FamilyPricePoints from '../components/family/FamilyPricePoints';
import FamilyRecipientCategories from '../components/family/FamilyRecipientCategories';
import FamilyCuratedCollections from '../components/family/FamilyCuratedCollections';
import FamilyTrendingNearYou from '../components/family/FamilyTrendingNearYou';
import FamilyPromoBanner from '../components/family/FamilyPromoBanner';
import Family3DCarousel from '../components/family/Family3DCarousel';
import FamilyProductsCatalog from '../components/family/FamilyProductsCatalog';
import { buildFamilyShopPath, getFamilyRecipientFromSearch, normalizeFamilyRecipient } from '../utils/familyNavigation';

const ShopForFamily = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { recipient: recipientParam } = useParams();
    const [selectedRecipient, setSelectedRecipient] = useState(() => (
        normalizeFamilyRecipient(recipientParam || getFamilyRecipientFromSearch(location.search))
    ));

    useEffect(() => {
        document.title = "Gifts for Family | Sands Ornaments";
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const nextRecipient = normalizeFamilyRecipient(recipientParam || getFamilyRecipientFromSearch(location.search));
        if (nextRecipient !== selectedRecipient) {
            setSelectedRecipient(nextRecipient);
        }
    }, [location.search, recipientParam, selectedRecipient]);

    const handleSelectRecipient = (recipientId) => {
        const normalizedRecipient = normalizeFamilyRecipient(recipientId);
        setSelectedRecipient(normalizedRecipient);
        navigate(buildFamilyShopPath({ recipient: normalizedRecipient }));
    };

    return (
        <div className="bg-white min-h-screen text-black font-sans overflow-x-hidden">
            {/* 1. Hero Section */}
            <FamilyHeroCarousel />

            {/* Curated Collections Showcase */}
            <FamilyCuratedCollections />

            {/* Price Points Quick Access */}
            <FamilyPricePoints />

            {/* 2. Category Section */}
            <FamilyRecipientCategories
                selectedRecipient={selectedRecipient}
                onSelectRecipient={handleSelectRecipient}
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
                onSelectRecipient={handleSelectRecipient}
            />
        </div>
    );
};

export default ShopForFamily;
