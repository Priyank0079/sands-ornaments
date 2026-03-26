import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryShowcase from '../components/CategoryShowcase';
import PriceRangeShowcase from '../components/PriceRangeShowcase';
import PerfectGift from '../components/PerfectGift';
import NewLaunchSection from '../components/NewLaunchSection';
import LatestDrop from '../components/LatestDrop';
import MostGifted from '../components/MostGifted';
import PromoSlider from '../components/PromoSlider';
import OccasionalSpecial from '../components/OccasionalSpecial';
import ProposalBanner from '../components/ProposalBanner';
import StyleItYourWay from '../components/StyleItYourWay';
import AllJewellery from '../components/AllJewellery';
import BrandPromises from '../components/BrandPromises';
import FAQSection from '../components/FAQSection';
import ChitChatSection from '../components/ChitChatSection';
import heroSlide1 from '../assets/hero_slide_1.png';
import heroSlide2 from '../assets/hero_slide_2.png';
import heroSlide3 from '../assets/hero_slide_3.png';
import spotlightMain from '../assets/spotlight_silver_main.png';
import spotlightHover from '../assets/spotlight_silver_hover.png';
import { useShop } from '../../../context/ShopContext';
import { normalizeStoreLink } from '../utils/navigation';

const Home = () => {
    const { banners, isLoading } = useShop();
    const heroBannerItems = (banners || []).filter((banner) => (banner.placement || 'hero') === 'hero');
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        document.title = "Sands Ornaments | Pure 925 Silver Jewellery - Timeless Elegance";
    }, []);

    const staticHeroSlides = [
        {
            image: heroSlide1,
            badge: "New Collection 2024",
            title: "Adorn Your Soul with Silver",
            description: "Handcrafted luxury that blends traditional artistry with modern grace.",
            btnText: "Discover Our Bag",
            link: "/shop"
        },
        {
            image: heroSlide2,
            badge: "Wedding Specials",
            title: "Bridal Elegance Redefined",
            description: "Timeless silver pieces for your most special moments.",
            btnText: "Shop Bridal",
            link: "/category/rings"
        },
        {
            image: heroSlide3,
            badge: "Daily Essentials",
            title: "Minimalist Grace Every Day",
            description: "Statement pieces designed for your everyday lifestyle.",
            btnText: "Explore Now",
            link: "/shop"
        }
    ];

    const heroSlides = heroBannerItems.length > 0
        ? heroBannerItems.map((banner) => ({
            image: banner.image,
            title: banner.title || "Sands Ornaments",
            description: banner.subtitle || "Crafted in Pure 925 Silver",
            link: normalizeStoreLink(banner.link),
            btnText: "Shop Now"
        }))
        : staticHeroSlides;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [heroSlides.length]);

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#4A1015] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white font-body text-black relative selection:bg-[#D39A9F] selection:text-white">
            <section className="relative overflow-hidden">
                <div className="relative h-[75vh] md:h-[calc(100vh-153px)]">
                    <AnimatePresence>
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <img
                                src={heroSlides[currentSlide].image}
                                alt={heroSlides[currentSlide].title}
                                className="absolute inset-0 w-full h-full object-cover transform scale-100 animate-slow-zoom"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/70 via-black/30 md:from-white/70 md:via-white/20 to-transparent flex items-end md:items-center pb-16 md:pb-0">
                                <div className="container mx-auto px-2 md:px-4">
                                    <div className="max-w-xl text-white md:text-[#1F1F1F] space-y-3 md:space-y-6 text-center md:text-left">
                                        <div className="relative inline-block">
                                            <motion.h1
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
                                                className="text-2xl md:text-5xl font-display font-normal leading-tight tracking-wide text-white md:text-[#1F1F1F]"
                                            >
                                                {heroSlides[currentSlide].title || "Timeless Jewellery"} <br />
                                                <span className="font-serif italic font-light">For Every Moment</span>
                                            </motion.h1>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '100px' }}
                                                transition={{ duration: 1.0, delay: 0.8 }}
                                                className="h-1 bg-[#C9A24D] mt-4 mx-auto md:mx-0"
                                            />
                                        </div>

                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1.0, ease: "easeOut", delay: 0.3 }}
                                            className="text-white/90 md:text-[#1F1F1F]/80 text-base md:text-2xl font-serif italic font-light max-w-sm md:max-w-md mx-auto md:mx-0 leading-relaxed"
                                        >
                                            {heroSlides[currentSlide].description || "Crafted in Pure 925 Silver"}
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1.0, ease: "easeOut", delay: 0.4 }}
                                            className="flex items-center justify-center md:justify-start space-x-6 pt-2 md:pt-4"
                                        >
                                            <Link to={heroSlides[currentSlide].link || "/shop"} className="bg-[#4A1015] text-white w-full md:w-auto px-8 py-4 md:px-12 md:py-5 rounded-full font-semibold tracking-wide hover:bg-[#2F0005] active:scale-95 md:hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 group/btn text-base md:text-base min-h-[56px] md:min-h-0">
                                                <span>{heroSlides[currentSlide].btnText || "Shop Now"}</span>
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
                        {heroSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 md:h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-12 md:w-10 bg-white' : 'w-2 md:w-1.5 bg-white/50 md:bg-white/40 active:bg-white/70 md:hover:bg-white/60'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <div
                        className="hidden md:block absolute bottom-12 right-12 bg-white/95 backdrop-blur-xl p-8 rounded-3xl max-w-xs shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-10 duration-1000 delay-300"
                        onMouseEnter={(e) => e.nativeEvent.stopImmediatePropagation()}
                        onMouseLeave={(e) => e.nativeEvent.stopImmediatePropagation()}
                    >
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gray-300 overflow-hidden relative">
                                        <img src={`https://randomuser.me/api/portraits/women/${i + 20}.jpg`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-2 border-white bg-[#5D4037] text-white flex items-center justify-center text-sm font-medium">+</div>
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-xl text-black">12k+</h4>
                                <p className="text-xs text-gray-600 uppercase tracking-wider">Happy Customers</p>
                            </div>
                        </div>
                        <div className="relative h-40 rounded-2xl overflow-hidden mb-4 group/card cursor-pointer">
                            <img
                                src={spotlightMain}
                                alt="Monthly Highlight"
                                className="absolute inset-0 w-full h-full object-cover transform duration-700 opacity-100 group-hover/card:opacity-0"
                            />
                            <img
                                src={spotlightHover}
                                alt="Highlight Detail"
                                className="absolute inset-0 w-full h-full object-cover transform duration-700 opacity-0 group-hover/card:opacity-100"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover/card:bg-transparent transition-colors duration-500" />
                        </div>
                        <h5 className="font-display font-semibold text-lg text-black">Exquisite Details</h5>
                        <Link to="/shop" className="text-xs font-bold text-[#D39A9F] uppercase tracking-widest mt-2 inline-flex items-center hover:text-black group">
                            Explore Collection <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            <PromoSlider />
            <CategoryShowcase />
            <PriceRangeShowcase />
            <PerfectGift />
            <NewLaunchSection />
            <LatestDrop />
            <MostGifted />
            <ProposalBanner />
            <OccasionalSpecial />
            <StyleItYourWay />
            <AllJewellery />
            <BrandPromises />
            <ChitChatSection />
            <FAQSection />
        </div>
    );
};

export default Home;
