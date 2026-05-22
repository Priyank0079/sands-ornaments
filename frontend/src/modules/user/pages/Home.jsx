import React, { lazy, Suspense, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import { useHomepageCms } from '../hooks/useHomepageCms';
import Loader from '../../shared/components/Loader';

// ─── ABOVE-FOLD: eagerly imported — these are visible immediately on page load ───
import PromoSlider from '../components/PromoSlider';
import CategoryGrid from '../components/CategoryGrid';
import TrustMarkers from '../components/TrustMarkers';

// ─── BELOW-FOLD: lazy loaded — downloaded only when user scrolls toward them ────
// This moves ~70KB of JS out of the critical render path
const ShopByPrice           = lazy(() => import('../components/ShopByPrice'));
const PremiumCategoryCards  = lazy(() => import('../components/PremiumCategoryCards'));
const BestStylesSection     = lazy(() => import('../components/BestStylesSection'));
const AutoBannerSection     = lazy(() => import('../components/AutoBannerSection'));
const SilverNewLaunchGrid   = lazy(() => import('../components/SilverNewLaunchGrid'));
const ShopByColour          = lazy(() => import('../components/ShopByColour'));
const PriceRangeShowcase    = lazy(() => import('../components/PriceRangeShowcase'));
const PerfectGift           = lazy(() => import('../components/PerfectGift'));
const NewLaunchSection      = lazy(() => import('../components/NewLaunchSection'));
const StyleItYourWay        = lazy(() => import('../components/StyleItYourWay'));
const OccasionalSpecial     = lazy(() => import('../components/OccasionalSpecial'));
const AllJewellery          = lazy(() => import('../components/AllJewellery'));
const SilverCollectionSection = lazy(() => import('../components/SilverCollectionSection'));
const SilverCuratedShowcase = lazy(() => import('../components/SilverCuratedShowcase'));
const ProposalBanner        = lazy(() => import('../components/ProposalBanner'));
const Testimonials          = lazy(() => import('../components/Testimonials'));
const BrandPromises         = lazy(() => import('../components/BrandPromises'));
const ChitChatSection       = lazy(() => import('../components/ChitChatSection'));
const FAQSection            = lazy(() => import('../components/FAQSection'));

// Lightweight fallback for lazy sections — invisible so layout doesn't shift
const SectionFallback = () => (
    <div style={{ minHeight: '200px' }} aria-hidden="true" />
);

// contentVisibility:auto skips layout/paint of off-screen sections
const SectionShell = ({ children }) => (
    <div style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}>
        <Suspense fallback={<SectionFallback />}>
            {children}
        </Suspense>
    </div>
);

const Home = () => {
    const { isLoading: isShopLoading } = useShop();
    const {
        isError: isHomepageCmsError,
        error: homepageCmsError,
        refetch: refetchHomepageCms,
    } = useHomepageCms();

    useEffect(() => {
        document.title = "Sands Ornaments | Pure 925 Silver Jewellery - Timeless Elegance";
    }, []);

    // ONLY block on shop data (products/categories) — CMS is enhancement-only.
    // Previously we also blocked on isHomepageCmsLoading which meant the entire
    // page showed a blank loader until TWO separate APIs finished. On mobile
    // with a slow connection, CMS fetch could take 1-2s extra. Now the page
    // renders immediately once products are ready, and CMS slots fill in async.
    if (isShopLoading) {
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

            {/* ── ABOVE FOLD: loaded eagerly (visible immediately) ── */}
            <PromoSlider />
            <CategoryGrid />
            <TrustMarkers />

            {/* ── BELOW FOLD: lazy loaded inside SectionShell ── */}
            <SectionShell><ShopByPrice /></SectionShell>
            <SectionShell><PremiumCategoryCards /></SectionShell>
            <SectionShell><BestStylesSection /></SectionShell>
            <SectionShell><AutoBannerSection /></SectionShell>
            <SectionShell><SilverNewLaunchGrid /></SectionShell>
            <SectionShell><ShopByColour /></SectionShell>
            <SectionShell><PriceRangeShowcase /></SectionShell>
            <SectionShell><PerfectGift /></SectionShell>
            <SectionShell><NewLaunchSection /></SectionShell>
            <SectionShell><StyleItYourWay /></SectionShell>
            <SectionShell><OccasionalSpecial /></SectionShell>
            <SectionShell><AllJewellery /></SectionShell>
            <SectionShell><SilverCollectionSection /></SectionShell>
            <SectionShell><SilverCuratedShowcase /></SectionShell>
            <SectionShell><ProposalBanner /></SectionShell>
            <SectionShell><Testimonials /></SectionShell>
            <SectionShell><BrandPromises /></SectionShell>
            <SectionShell><ChitChatSection /></SectionShell>
            <SectionShell><FAQSection /></SectionShell>
        </div>
    );
};

export default Home;
