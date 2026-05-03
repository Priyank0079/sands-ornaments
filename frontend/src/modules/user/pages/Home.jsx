import React, { useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import { useHomepageCms } from '../hooks/useHomepageCms';
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
import Loader from '../../shared/components/Loader';

const SectionShell = ({ children }) => (
    <div style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
        {children}
    </div>
);

const Home = () => {
    const { isLoading } = useShop();
    const {
        isError: isHomepageCmsError,
        error: homepageCmsError,
        refetch: refetchHomepageCms,
    } = useHomepageCms();

    useEffect(() => {
        document.title = "Sands Ornaments | Pure 925 Silver Jewellery - Timeless Elegance";
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="bg-white font-body text-black relative selection:bg-[#D39A9F] selection:text-white">
            {isHomepageCmsError && (
                <div className="mx-auto max-w-[1450px] px-4 pt-4">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <span className="font-bold">Homepage content is using fallback data.</span>{' '}
                            <span className="opacity-80">
                                {homepageCmsError?.response?.data?.message || homepageCmsError?.message || ''}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => refetchHomepageCms()}
                            className="shrink-0 rounded-lg bg-[#3E2723] px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white hover:opacity-95"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}
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

            <SectionShell>
                {/* BEST STYLES SECTION (Horizontal Scroll) */}
                <BestStylesSection />
            </SectionShell>

            <SectionShell>
                {/* AUTO SCROLLING BANNERS */}
                <AutoBannerSection />
            </SectionShell>

            <SectionShell>
                {/* NEW LAUNCH SPECIAL GRID */}
                <SilverNewLaunchGrid />
            </SectionShell>

            <SectionShell>
                {/* SHOP BY COLOUR SECTION */}
                <ShopByColour />
            </SectionShell>

            <SectionShell>
                <PriceRangeShowcase />
            </SectionShell>
            <SectionShell>
                <PerfectGift />
            </SectionShell>
            <SectionShell>
                <NewLaunchSection />
            </SectionShell>
            <SectionShell>
                <StyleItYourWay />
            </SectionShell>
            <SectionShell>
                <OccasionalSpecial />
            </SectionShell>
            <SectionShell>
                <AllJewellery />
            </SectionShell>
            <SectionShell>
                <SilverCollectionSection />
            </SectionShell>
            <SectionShell>
                <SilverCuratedShowcase />
            </SectionShell>
            <SectionShell>
                <Testimonials />
            </SectionShell>
            <SectionShell>
                <BrandPromises />
            </SectionShell>
            <SectionShell>
                <ChitChatSection />
            </SectionShell>
            <SectionShell>
                <FAQSection />
            </SectionShell>
        </div>
    );
};

export default Home;
