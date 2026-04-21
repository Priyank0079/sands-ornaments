import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MenHeroCarousel from '../components/men/MenHeroCarousel';
import MenCategoriesGrid from '../components/men/MenCategoriesGrid';
import MenLuxurySection from '../components/men/MenLuxurySection';
import MenCuratedCollections from '../components/men/MenCuratedCollections';
import MenExploreCollections from '../components/men/MenExploreCollections';
import MenPickYourGlam from '../components/men/MenPickYourGlam';
import CelebrateMen from '../components/men/CelebrateMen';
import MenPersonalizedBanner from '../components/men/MenPersonalizedBanner';
import MenInteractiveLook from '../components/men/MenInteractiveLook';
import MenStyleGuide from '../components/men/MenStyleGuide';
import MenStyleTrends from '../components/men/MenStyleTrends';
import MenFeaturedProducts from '../components/men/MenFeaturedProducts';

import Loader from '../../shared/components/Loader';
import api from '../../../services/api';

const ShopForMen = () => {
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState([]);

    const fetchMenSections = useCallback(async () => {
        try {
            const res = await api.get('public/cms/pages/shop-men', {
                params: { _t: Date.now() }
            });
            if (!res?.data?.success) return;
            setSections(Array.isArray(res.data?.data?.sections) ? res.data.data.sections : []);
        } catch (err) {
            console.error('Failed to fetch men page sections:', err);
        }
    }, []);

    useEffect(() => {
        document.title = "Shop Men's Jewellery | Sands Ornaments";
        window.scrollTo(0, 0);
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        fetchMenSections();
    }, [fetchMenSections]);

    useEffect(() => {
        const handleFocusRefresh = () => {
            fetchMenSections();
        };
        const handleVisibilityRefresh = () => {
            if (document.visibilityState === 'visible') {
                fetchMenSections();
            }
        };

        window.addEventListener('focus', handleFocusRefresh);
        document.addEventListener('visibilitychange', handleVisibilityRefresh);
        return () => {
            window.removeEventListener('focus', handleFocusRefresh);
            document.removeEventListener('visibilitychange', handleVisibilityRefresh);
        };
    }, [fetchMenSections]);

    const sectionMap = useMemo(() => (
        (sections || []).reduce((acc, section) => {
            const key = section.sectionKey || section.sectionId;
            if (key) acc[key] = section;
            return acc;
        }, {})
    ), [sections]);

    if (loading) return <Loader />;

    return (
        <div className="mens-section bg-[#FDF5F6] min-h-screen text-[#111827] overflow-x-hidden">
            <MenHeroCarousel sectionData={sectionMap['hero-banners']} />
            <MenCategoriesGrid sectionData={sectionMap['categories-grid']} />
            <MenLuxurySection sectionData={sectionMap['luxury-section']} />
            <CelebrateMen sectionData={sectionMap['celebrate-men']} />
            <MenCuratedCollections sectionData={sectionMap['curated-collections']} />
            <MenExploreCollections sectionData={sectionMap['explore-collections']} />
            <MenPersonalizedBanner sectionData={sectionMap['personalized-banner']} />
            <MenPickYourGlam sectionData={sectionMap['pick-your-glam']} />
            <MenInteractiveLook />
            <MenStyleGuide sectionData={sectionMap['style-guide']} />
            <MenStyleTrends sectionData={sectionMap['style-trends']} />
            <MenFeaturedProducts sectionData={sectionMap['products-listing']} />
        </div>
    );
};

export default ShopForMen;
