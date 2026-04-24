import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import api from '../../../services/api';

import Loader from '../../shared/components/Loader';

const ShopForFamily = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { recipient: recipientParam } = useParams();
    const [selectedRecipient, setSelectedRecipient] = useState(() => (
        normalizeFamilyRecipient(recipientParam || getFamilyRecipientFromSearch(location.search))
    ));
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState([]);

    const fetchFamilySections = useCallback(async () => {
        try {
            const res = await api.get('public/cms/pages/shop-family', {
                params: { _t: Date.now() }
            });
            if (!res?.data?.success) return;
            setSections(Array.isArray(res.data?.data?.sections) ? res.data.data.sections : []);
        } catch (err) {
            console.error('Failed to fetch family page sections:', err);
        }
    }, []);

    useEffect(() => {
        document.title = "Gifts for Family | Sands Ornaments";
        window.scrollTo(0, 0);
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        fetchFamilySections();
    }, [fetchFamilySections]);

    useEffect(() => {
        const handleFocusRefresh = () => {
            fetchFamilySections();
        };
        const handleVisibilityRefresh = () => {
            if (document.visibilityState === 'visible') {
                fetchFamilySections();
            }
        };

        window.addEventListener('focus', handleFocusRefresh);
        document.addEventListener('visibilitychange', handleVisibilityRefresh);
        return () => {
            window.removeEventListener('focus', handleFocusRefresh);
            document.removeEventListener('visibilitychange', handleVisibilityRefresh);
        };
    }, [fetchFamilySections]);

    useEffect(() => {
        const nextRecipient = normalizeFamilyRecipient(recipientParam || getFamilyRecipientFromSearch(location.search));
        if (nextRecipient !== selectedRecipient) {
            setSelectedRecipient(nextRecipient);
        }
    }, [location.search, recipientParam, selectedRecipient]);

    const sectionMap = useMemo(() => (
        (sections || []).reduce((acc, section) => {
            const key = section.sectionKey || section.sectionId;
            if (key) acc[key] = section;
            return acc;
        }, {})
    ), [sections]);

    if (loading) return <Loader />;

    const handleSelectRecipient = (recipientId) => {
        const normalizedRecipient = normalizeFamilyRecipient(recipientId);
        setSelectedRecipient(normalizedRecipient);
        navigate(buildFamilyShopPath({ recipient: normalizedRecipient }));
    };

    return (
        <div className="bg-white min-h-screen text-black font-sans overflow-x-hidden">
            {/* 1. Hero Section */}
            <FamilyHeroCarousel sectionData={sectionMap['hero-banners']} />

            {/* Curated Collections Showcase */}
            <FamilyCuratedCollections sectionData={sectionMap.collections || sectionMap['curated-collections']} />

            {/* Price Points Quick Access */}
            <FamilyPricePoints sectionData={sectionMap['luxury-within-reach']} />

            {/* 2. Category Section */}
            <FamilyRecipientCategories
                selectedRecipient={selectedRecipient}
                onSelectRecipient={handleSelectRecipient}
                sectionData={sectionMap['shop-by-relation']}
            />

            {/* Trending Section */}
            <FamilyTrendingNearYou sectionData={sectionMap['trending-near-you']} />

            {/* Promotional Banner */}
            <FamilyPromoBanner sectionData={sectionMap['family-promo-banner']} />

            {/* 3D Interactive Carousel */}
            <Family3DCarousel sectionData={sectionMap['gifts-to-remember']} />

            {/* 3. Product Listing Section */}
            <FamilyProductsCatalog
                selectedRecipient={selectedRecipient}
                onSelectRecipient={handleSelectRecipient}
                sectionData={sectionMap['products-listing']}
            />
        </div>
    );
};

export default ShopForFamily;
