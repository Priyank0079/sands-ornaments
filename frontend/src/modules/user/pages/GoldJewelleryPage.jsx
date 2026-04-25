import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw, RotateCcw, Star, ArrowRight, Truck, FileText } from 'lucide-react';
import GoldExploreCollections from '../components/GoldExploreCollections';
import BestStylesSection from '../components/BestStylesSection';
import GoldCategoryGrid from '../components/GoldCategoryGrid';
import GoldNewLaunchBanner from '../components/GoldNewLaunchBanner';
import GoldRingCarousel from '../components/GoldRingCarousel';
import GoldTestimonials from '../components/GoldTestimonials';
import CuratedForEveryBond from '../components/CuratedForEveryBond';
import GoldCuratedShowcase from '../components/GoldCuratedShowcase';
import GoldExclusiveLaunch from '../components/GoldExclusiveLaunch';
import GoldLifestyleGrid from '../components/GoldLifestyleGrid';
import GoldShopByColour from '../components/GoldShopByColour';
import GoldLuxuryWithinReach from '../components/GoldLuxuryWithinReach';
import GoldDirectProducts from '../components/GoldDirectProducts';
import GoldTrustStrip from '../components/GoldTrustStrip';
import HeerCustomisationBanner from '../components/HeerCustomisationBanner';
import Loader from '../../shared/components/Loader';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';
import { usePublicCmsPage } from '../hooks/usePublicCmsPage';

import heroGold from '@assets/hero/bridal_royal.png';

const TRUST_BADGES = [
    { id: 1, icon: ShieldCheck, title: '100% Certified Lab', subtitle: 'Grown Diamonds' },
    { id: 2, icon: RefreshCw, title: 'Lifetime Exchange', subtitle: '& Buyback' },
    { id: 3, icon: RotateCcw, title: 'Easy 30', subtitle: 'Days Return' },
    { id: 4, icon: Star, title: 'B I S', subtitle: 'Hallmark' },
];

const GoldJewelleryPage = () => {
    const [loading, setLoading] = useState(true);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const {
        data: sections = [],
        isLoading: isCmsLoading,
        isError,
        error: cmsError,
        refetch
    } = usePublicCmsPage('gold-collection');

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Shop Gold Jewellery | Sands Ornaments';
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const sectionMap = useMemo(() => (
        (sections || []).reduce((acc, section) => {
            const key = section.sectionKey || section.sectionId;
            if (key) acc[key] = section;
            return acc;
        }, {})
    ), [sections]);

    const heroSlides = useMemo(() => {
        const ensureGoldPath = (rawPath = '') => {
            const source = String(rawPath || '').trim();
            if (!source) return '/shop?metal=gold';
            if (!source.startsWith('/shop')) return source;
            if (/([?&])metal=gold(&|$)/i.test(source)) return source;
            return `${source}${source.includes('?') ? '&' : '?'}metal=gold`;
        };
        const heroSection = sectionMap['hero-banners-gold'];
        const configuredItems = Array.isArray(heroSection?.items) ? heroSection.items : [];
        const slides = configuredItems
            .filter((item) => item?.label || item?.name || item?.image)
            .map((item, index) => ({
                id: item.itemId || item.id || `gold-hero-${index + 1}`,
                image: resolveLegacyCmsAsset(item.image, heroGold),
                title: String(item?.label || item?.title || 'Akshaya Tritiya').trim() || 'Akshaya Tritiya',
                subtitle: String(item?.subtitle || item?.description || 'On all gold jewellery').trim() || 'On all gold jewellery',
                eyebrow: String(item?.name || item?.tag || item?.eyebrow || 'Shubh').trim() || 'Shubh',
                ctaLabel: String(item?.ctaLabel || 'Shop Now').trim() || 'Shop Now',
                ctaPath: ensureGoldPath(item?.path || '/shop?metal=gold')
            }));

        if (slides.length > 0) return slides;

        return [{
            id: 'gold-hero-fallback',
            image: heroGold,
            title: 'Akshaya Tritiya',
            subtitle: 'On all gold jewellery',
            eyebrow: 'Shubh',
            ctaLabel: 'Shop Now',
            ctaPath: '/shop?metal=gold'
        }];
    }, [sectionMap]);

    useEffect(() => {
        setCurrentHeroIndex(0);
    }, [heroSlides.length]);

    useEffect(() => {
        if (heroSlides.length <= 1) return undefined;
        const autoplayMs = Number(sectionMap['hero-banners-gold']?.settings?.autoplayMs) || 3000;
        const timer = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
        }, autoplayMs);
        return () => clearInterval(timer);
    }, [heroSlides.length, sectionMap]);

    const heroContent = heroSlides[currentHeroIndex] || heroSlides[0];

    const trustBadges = useMemo(() => {
        const trustSection = sectionMap['gold-trust-markers'];
        const configured = Array.isArray(trustSection?.items) ? trustSection.items : [];
        if (configured.length === 0) return TRUST_BADGES;

        const iconLookup = {
            'ShieldCheck': ShieldCheck,
            'RefreshCw': RefreshCw,
            'RotateCcw': RotateCcw,
            'Star': Star,
            'Truck': Truck,
            'FileText': FileText,
            'gem': ShieldCheck,
            'rotate-ccw': RefreshCw,
            'truck': Truck,
            'file-text': FileText
        };

        return configured.map((item, idx) => ({
            id: item?.itemId || item?.id || `gold-trust-${idx + 1}`,
            icon: iconLookup[item.iconName] || iconLookup[item.iconKey] || TRUST_BADGES[idx % TRUST_BADGES.length].icon,
            title: item.name || item.label || TRUST_BADGES[idx % TRUST_BADGES.length].title,
            subtitle: item.subtitle || TRUST_BADGES[idx % TRUST_BADGES.length].subtitle,
            image: item?.image ? resolveLegacyCmsAsset(item.image, '') : ''
        }));
    }, [sectionMap]);

    if (loading || isCmsLoading) return <Loader />;
    if (isError) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-6 py-14">
                <div className="max-w-xl w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
                    <div className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400">
                        Gold Collection
                    </div>
                    <h1 className="mt-2 text-2xl font-extrabold text-gray-900">
                        Unable to load page content
                    </h1>
                    <p className="mt-3 text-sm text-gray-600">
                        {cmsError?.response?.data?.message || cmsError?.message || 'Please try again.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#3E2723] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:opacity-95"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-body">
            <div className="w-full h-[160px] md:h-[240px] flex overflow-hidden">
                <div className="relative w-[55%] md:w-[60%] h-full overflow-hidden bg-[#0D1C12]">
                    <img
                        src={heroContent.image}
                        alt="Sands Gold Collection"
                        className="w-full h-full object-cover object-center opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D1C12]/30 via-transparent to-[#0D1C12]/60" />
                </div>

                <div
                    className="relative w-[45%] md:w-[40%] h-full flex flex-col items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #0A1A0E 0%, #1A2E18 50%, #0D1C12 100%)',
                    }}
                >
                    <div className="text-center px-3 md:px-6">
                        <p className="text-[#D4AF37] font-serif italic text-[11px] md:text-[14px] mb-0.5">{heroContent.eyebrow}</p>
                        <h1 className="text-white font-serif font-bold leading-tight mb-3 md:mb-4" style={{ fontSize: 'clamp(16px, 4vw, 30px)' }}>
                            {heroContent.title}
                        </h1>
                        <p className="text-white/70 text-[7px] md:text-[10px] mt-1 mb-2">{heroContent.subtitle}</p>
                        <Link
                            to={heroContent.ctaPath}
                            className="inline-flex items-center gap-1 bg-white text-[#0D1C12] text-[7px] md:text-[10px] font-black uppercase tracking-widest px-3 md:px-5 py-1 md:py-1.5 rounded-sm hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                        >
                            {heroContent.ctaLabel}
                            <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                    </div>
                </div>
            </div>

            <GoldCategoryGrid sectionData={sectionMap['gold-category-grid']} />
            <HeerCustomisationBanner />
            <GoldExploreCollections sectionData={sectionMap['gold-explore-collections']} />
            <BestStylesSection sectionData={sectionMap['best-styles']} />

            <div className="w-full bg-white py-12">
                <div className="container mx-auto px-4 max-w-[1450px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {trustBadges.map((badge, idx) => (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-5 bg-[#F9F8EF] rounded-[24px] p-2 pr-4 md:pr-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="w-[70px] h-[70px] md:w-[85px] md:h-[85px] bg-white rounded-[20px] flex items-center justify-center shrink-0 shadow-sm border border-[#E8D8A0]/30 overflow-hidden">
                                    {badge.image ? (
                                        <img src={badge.image} alt={badge.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <badge.icon className="w-7 h-7 md:w-9 md:h-9 text-[#2A4D35]" />
                                    )}
                                </div>

                                <div className="py-1">
                                    <h4 className={`text-gray-900 leading-tight font-black ${idx === 3 ? 'tracking-[0.4em] text-[16px] md:text-[20px]' : 'text-[15px] md:text-[17px]'}`}>
                                        {badge.title}
                                    </h4>
                                    <p className="text-[#333] text-[15px] md:text-[17px] font-medium leading-tight">
                                        {badge.subtitle}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <GoldNewLaunchBanner sectionData={sectionMap['gold-new-launch-banner']} />
            <GoldExclusiveLaunch sectionData={sectionMap['gold-exclusive-launch']} />
            <GoldRingCarousel sectionData={sectionMap['gold-ring-carousel']} />
            <HeerCustomisationBanner />
            <GoldShopByColour sectionData={sectionMap['gold-shop-by-colour']} />
            <GoldLuxuryWithinReach sectionData={sectionMap['gold-luxury-within-reach']} />
            <GoldTestimonials sectionData={sectionMap['gold-testimonials']} />
            <CuratedForEveryBond sectionData={sectionMap['gold-curated-bond']} />
            <GoldCuratedShowcase sectionData={sectionMap['gold-curated-showcase']} />
            <GoldLifestyleGrid sectionData={sectionMap['gold-lifestyle-grid']} />
            <GoldTrustStrip />
            <GoldDirectProducts sectionData={sectionMap['gold-products-listing']} />
        </div>
    );
};

export default GoldJewelleryPage;
