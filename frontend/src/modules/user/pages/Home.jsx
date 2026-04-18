import React, { useEffect } from 'react';
import PriceRangeShowcase from '../components/PriceRangeShowcase';
import PerfectGift from '../components/PerfectGift';
import NewLaunchSection from '../components/NewLaunchSection';
import PromoSlider from '../components/PromoSlider';
import CategoryGrid from '../components/CategoryGrid';
import TrustMarkers from '../components/TrustMarkers';
import ShopByPrice from '../components/ShopByPrice';
import PremiumCategoryCards from '../components/PremiumCategoryCards';
import BestStylesSection from '../components/BestStylesSection';
import AutoBannerSection from '../components/AutoBannerSection';
import ShopByColour from '../components/ShopByColour';
import StyleItYourWay from '../components/StyleItYourWay';
import OccasionalSpecial from '../components/OccasionalSpecial';
import AllJewellery from '../components/AllJewellery';
import Testimonials from '../components/Testimonials';
import BrandPromises from '../components/BrandPromises';
import FAQSection from '../components/FAQSection';
import ChitChatSection from '../components/ChitChatSection';
import SilverNewLaunchGrid from '../components/SilverNewLaunchGrid';
import SilverCollectionSection from '../components/SilverCollectionSection';
import SilverCuratedShowcase from '../components/SilverCuratedShowcase';
import { useShop } from '../../../context/ShopContext';

const Home = () => {
    const { isLoading } = useShop();

    useEffect(() => {
        document.title = "Sands Ornaments | Pure 925 Silver Jewellery - Timeless Elegance";
    }, []);

    // Hero logic moved to PromoSlider component for better modularity and premium layout.
    // Carousel state handled within PromoSlider component.

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#4A1015] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white font-body text-black relative selection:bg-[#D39A9F] selection:text-white">
            {/* NEW PREMIUM HERO CAROUSEL */}
            <PromoSlider />

            {/* NEW CATEGORY GRID SECTION */}
            <CategoryGrid />

            {/* BRAND TRUST MARKERS */}
            <TrustMarkers />

            {/* SHOP BY PRICE SECTION (Luxury within Reach) */}
            <ShopByPrice />

            {/* GENDER / COLLECTION CARDS */}
            <PremiumCategoryCards />

            {/* BEST STYLES SECTION (Horizontal Scroll) */}
            <BestStylesSection />

            {/* AUTO SCROLLING BANNERS */}
            <AutoBannerSection />

            {/* NEW LAUNCH SPECIAL GRID */}
            <SilverNewLaunchGrid />

            {/* SHOP BY COLOUR SECTION */}
            <ShopByColour />


            <PriceRangeShowcase />
            <PerfectGift />
            <NewLaunchSection />
            <StyleItYourWay />
            <OccasionalSpecial />
            <AllJewellery />
            <SilverCollectionSection />
            <SilverCuratedShowcase />
            <Testimonials />
            <BrandPromises />
            <ChitChatSection />
            <FAQSection />
        </div>
    );
};

export default Home;
