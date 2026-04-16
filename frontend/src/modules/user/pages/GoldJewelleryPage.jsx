import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw, RotateCcw, Star, ArrowRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import GoldExploreCollections from '../components/GoldExploreCollections';
import BestStylesSection from '../components/BestStylesSection';
import GoldCategoryGrid from '../components/GoldCategoryGrid';
import AutoBannerSection from '../components/AutoBannerSection';
import GoldNewLaunchBanner from '../components/GoldNewLaunchBanner';
import GoldRingCarousel from '../components/GoldRingCarousel';
import GoldTestimonials from '../components/GoldTestimonials';
import CuratedForEveryBond from '../components/CuratedForEveryBond';
import GoldCuratedShowcase from '../components/GoldCuratedShowcase';

// Hero assets
import heroGold from '@assets/hero/bridal_royal.png';

const TRUST_BADGES = [
    {
        id: 1,
        icon: ShieldCheck,
        title: '100% Certified Lab',
        subtitle: 'Grown Diamonds',
    },
    {
        id: 2,
        icon: RefreshCw,
        title: 'Lifetime Exchange',
        subtitle: '& Buyback',
    },
    {
        id: 3,
        icon: RotateCcw,
        title: 'Easy 30',
        subtitle: 'Days Return',
    },
    {
        id: 4,
        icon: Star,
        title: 'B I S',
        subtitle: 'Hallmark',
    },
];

const GoldJewelleryPage = () => {
    const [shopNowHover, setShopNowHover] = useState(false);

    return (
        <div className="bg-white min-h-screen font-body">

            {/* ============================================================ */}
            {/* SECTION 1: HERO BANNER                                        */}
            {/* ============================================================ */}
            <div className="w-full h-[160px] md:h-[240px] flex overflow-hidden">

                {/* Left Panel — Product / Jewellery Image */}
                <div className="relative w-[55%] md:w-[60%] h-full overflow-hidden bg-[#0D1C12]">
                    <img
                        src={heroGold}
                        alt="Sands Gold Collection"
                        className="w-full h-full object-cover object-center opacity-90"
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D1C12]/30 via-transparent to-[#0D1C12]/60" />

                    {/* Left-panel label */}
                    <div className="absolute bottom-4 md:bottom-6 left-4 md:left-8">
                        <p className="text-[#D4AF37] text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] mb-1">
                            Crafted in Pure Gold
                        </p>
                    </div>
                </div>

                {/* Right Panel — Offer / Branding */}
                <div
                    className="relative w-[45%] md:w-[40%] h-full flex flex-col items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #0A1A0E 0%, #1A2E18 50%, #0D1C12 100%)',
                    }}
                >
                    {/* Decorative corner ornament */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 text-[#D4AF37]/30 text-[28px] md:text-[40px] leading-none select-none">
                        ✦
                    </div>
                    <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-[#D4AF37]/30 text-[20px] md:text-[32px] leading-none select-none rotate-90">
                        ✦
                    </div>

                    {/* Main Offer Text */}
                    <div className="text-center px-3 md:px-6">
                        {/* Ornamental divider */}
                        <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                            <div className="h-px w-6 md:w-10 bg-[#D4AF37]" />
                            <span className="text-[#D4AF37] text-[10px] md:text-[13px]">✦</span>
                            <div className="h-px w-6 md:w-10 bg-[#D4AF37]" />
                        </div>

                        <p className="text-[#D4AF37] font-serif italic text-[11px] md:text-[14px] mb-0.5">
                            Shubh
                        </p>
                        <h1
                            className="text-white font-serif font-bold leading-tight mb-3 md:mb-4"
                            style={{ fontSize: 'clamp(16px, 4vw, 30px)' }}
                        >
                            Akshaya Tritiya
                        </h1>

                        {/* Ornamental divider */}
                        <div className="flex items-center justify-center gap-2 mb-3 md:mb-5">
                            <div className="h-px w-5 md:w-8 bg-[#D4AF37]/50" />
                            <span className="text-[#D4AF37]/50 text-[8px]">✦</span>
                            <div className="h-px w-5 md:w-8 bg-[#D4AF37]/50" />
                        </div>

                        {/* Offer Badge Box */}
                        <div className="border border-[#D4AF37]/40 rounded-sm px-3 md:px-5 py-2 md:py-3 bg-[#D4AF37]/5 inline-block text-center">
                            <p className="text-white/60 text-[7px] md:text-[9px] uppercase tracking-widest mb-0.5">
                                Upto
                            </p>
                            <div className="flex items-baseline gap-1 justify-center">
                                <span className="text-white font-black" style={{ fontSize: 'clamp(20px, 5vw, 38px)' }}>
                                    0
                                </span>
                                <span className="text-white font-black text-[9px] md:text-[12px] leading-tight tracking-wide">
                                    MAKING<br />CHARGE
                                </span>
                            </div>
                            <p className="text-white/50 text-[6px] md:text-[8px] mt-1 mb-2">
                                On all gold jewellery
                            </p>
                            <Link
                                to="/shop?metal=gold"
                                onMouseEnter={() => setShopNowHover(true)}
                                onMouseLeave={() => setShopNowHover(false)}
                                className="inline-flex items-center gap-1 bg-white text-[#0D1C12] text-[7px] md:text-[10px] font-black uppercase tracking-widest px-3 md:px-5 py-1 md:py-1.5 rounded-sm hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                            >
                                Shop Now
                                <ArrowRight className={`w-2.5 h-2.5 transition-transform ${shopNowHover ? 'translate-x-1' : ''}`} />
                            </Link>
                        </div>
                    </div>

                    {/* T&C label */}
                    <p className="absolute bottom-2 right-2 text-white/20 text-[6px] md:text-[7px]">*T&C Apply</p>
                </div>
            </div>

            {/* ============================================================ */}
            {/* SECTION 2: SHOP BY CATEGORY                                   */}
            {/* ============================================================ */}
            <GoldCategoryGrid />

            {/* CURATED COLLECTIONS WITH OVERLAPPING THUMBNAILS (Matching Screenshot) */}
            <GoldExploreCollections />

            {/* BEST STYLES SECTION - NOW FULLY FUNCTIONAL */}
            <BestStylesSection />

            {/* ============================================================ */}
            {/* SECTION 3: TRUST BADGES (MATCHING SCREENSHOT)                 */}
            {/* ============================================================ */}
            <div className="w-full bg-white py-12">
                <div className="container mx-auto px-4 max-w-[1450px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {TRUST_BADGES.map((badge, idx) => (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-5 bg-[#F9F8EF] rounded-[24px] p-2 pr-4 md:pr-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                {/* White Square Icon Container */}
                                <div className="w-[70px] h-[70px] md:w-[85px] md:h-[85px] bg-white rounded-[20px] flex items-center justify-center shrink-0 shadow-sm border border-[#E8D8A0]/30">
                                    <div className="relative">
                                        <badge.icon className="w-7 h-7 md:w-9 md:h-9 text-[#2A4D35]" />
                                        {/* Decorative dots/circles from screenshot */}
                                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#2A4D35]/40" />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="py-1">
                                    <h4 className={`text-gray-900 leading-tight font-black ${badge.id === 4 ? 'tracking-[0.4em] text-[16px] md:text-[20px]' : 'text-[15px] md:text-[17px]'}`}>
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

            {/* ============================================================ */}
            {/* SECTION 4: NEW LAUNCH BANNER                                  */}
            {/* ============================================================ */}
            <GoldNewLaunchBanner />

            {/* ============================================================ */}
            {/* SECTION 5: GET THE RIGHT RING                                 */}
            {/* ============================================================ */}
            <GoldRingCarousel />
            <GoldTestimonials />
            <CuratedForEveryBond />
            <GoldCuratedShowcase />
        </div>
    );
};

export default GoldJewelleryPage;

