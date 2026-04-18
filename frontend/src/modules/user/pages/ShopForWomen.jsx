import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import api from '../../../services/api';

const ShopForWomen = () => {
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState([]);

    const fetchWomenSections = useCallback(async () => {
        try {
            const res = await api.get('public/cms/pages/shop-women', {
                params: { _t: Date.now() }
            });
            if (!res?.data?.success) return;
            setSections(Array.isArray(res.data?.data?.sections) ? res.data.data.sections : []);
        } catch (err) {
            console.error('Failed to fetch women page sections:', err);
        }
    }, []);

    useEffect(() => {
        document.title = "Shop Women's Jewellery | Sands Ornaments";
        window.scrollTo(0, 0);
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        fetchWomenSections();
    }, [fetchWomenSections]);

    useEffect(() => {
        const handleFocusRefresh = () => {
            fetchWomenSections();
        };
        const handleVisibilityRefresh = () => {
            if (document.visibilityState === 'visible') {
                fetchWomenSections();
            }
        };

        window.addEventListener('focus', handleFocusRefresh);
        document.addEventListener('visibilitychange', handleVisibilityRefresh);
        return () => {
            window.removeEventListener('focus', handleFocusRefresh);
            document.removeEventListener('visibilitychange', handleVisibilityRefresh);
        };
    }, [fetchWomenSections]);

    const sectionMap = useMemo(() => (
        (sections || []).reduce((acc, section) => {
            const key = section.sectionKey || section.sectionId;
            if (key) acc[key] = section;
            return acc;
        }, {})
    ), [sections]);

    if (loading) return <Loader />;

    return (
        <div className="bg-[#FDF5F6] min-h-screen text-black font-sans overflow-x-hidden">
            <WomenHeroCarousel sectionData={sectionMap['hero-banners']} />
            <WomenPriceRange sectionData={sectionMap['price-range-showcase']} />
            <WomenProductCategories sectionData={sectionMap['product-categories']} />
            <WomenCategoriesGrid sectionData={sectionMap['categories-grid']} />
            <WomenCuratedCollections sectionData={sectionMap['curated-collections']} />
            <WomenOccasionCarousel sectionData={sectionMap['occasion-carousel']} />
            <WomenPersonalisedBanner sectionData={sectionMap['personalized-banner']} />
            <WomenDiscoverHue sectionData={sectionMap['discover-hue']} />
            <WomenPromoBanners sectionData={sectionMap['promo-banners']} />
            <WomenFeatureBanner />
            <WomenProductsListing sectionData={sectionMap['products-listing']} />
        </div>
    );
};

export default ShopForWomen;
