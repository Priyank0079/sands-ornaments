import React, { useEffect } from 'react';
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

const ShopForMen = () => {
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        document.title = "Shop Men's Jewellery | Sands Ornaments";
        window.scrollTo(0, 0);
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="mens-section bg-[#FDF5F6] min-h-screen text-[#111827] overflow-x-hidden">
            <MenHeroCarousel />
            <MenCategoriesGrid />
            <MenLuxurySection />
            <CelebrateMen />
            <MenCuratedCollections />
            <MenExploreCollections />
            <MenPersonalizedBanner />
            <MenPickYourGlam />
            <MenInteractiveLook />
            <MenStyleGuide />
            <MenStyleTrends />
            <MenFeaturedProducts />
        </div>
    );
};

export default ShopForMen;
