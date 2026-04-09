import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Store, Menu, X, ChevronDown, ChevronRight, Camera, Mic, Diamond, MapPin } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import logo from '../../user/assets/SANDS JEWELS PINK (1).png';
import { motion, AnimatePresence } from 'framer-motion';
import { ensureHomepageNavPath } from '../utils/homepageNav';

const Navbar = () => {
    // 1. Local UI state to avoid global context re-renders
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    
    // 2. Optimized shop context access - only destructure what's visually needed
    const { 
        cart, 
        wishlist, 
        user, 
        homepageSections, 
        pincode, 
        setIsPincodeModalOpen 
    } = useShop();

    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [placeholderIdx, setPlaceholderIdx] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    // 3. Performance: Auto-close menu on navigation change
    useEffect(() => {
        setIsMenuOpen(false);
        setOpenSection(null);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                if (!isScrolled) setIsScrolled(true);
            } else {
                if (isScrolled) setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    const placeholders = useMemo(() => [
        "Search for jewellery...",
        "Search for silver...",
        "Search for gold...",
        "Search for men...",
        "Search for women..."
    ], []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [placeholders]);

    // Sidebar Menu Data - memoized
    const sidebarMenu = useMemo(() => {
        const sectionGifts = homepageSections?.['nav-gifts-for'];
        const sectionOccasions = homepageSections?.['nav-occasions'];

        const normalizeItems = (section, fallback, queryKey) => {
            if (section?.items?.length) {
                return section.items.map(item => ({
                    name: item.name || item.label,
                    path: queryKey ? ensureHomepageNavPath(item.path, item.name || item.label, queryKey) : (item.path || '/shop')
                }));
            }
            return fallback;
        };

        return {
            giftsFor: normalizeItems(sectionGifts, [
                { name: "For Women", path: "/category/women" },
                { name: "For Girls", path: "/category/women" },
                { name: "For Men", path: "/category/men" },
                { name: "For Couples", path: "/shop?filter=couple" },
                { name: "For Kids", path: "/shop?filter=kids" }
            ], 'filter'),
            occasions: normalizeItems(sectionOccasions, [
                { name: "Birthday", path: "/shop?occasion=birthday" },
                { name: "Anniversary", path: "/shop?occasion=anniversary" },
                { name: "Wedding", path: "/shop?occasion=wedding" },
                { name: "Mother's Day", path: "/shop?occasion=mothers-day" },
                { name: "Valentine Day", path: "/shop?occasion=valentine" }
            ], 'occasion')
        };
    }, [homepageSections]);

    const toggleSection = (section) => {
        setOpenSection(prev => prev === section ? null : section);
    };

    const submitSearch = useCallback(() => {
        const query = searchTerm.trim();
        if (!query) {
            navigate('/shop');
        } else {
            navigate(`/shop?search=${encodeURIComponent(query)}`);
        }
        setIsMenuOpen(false);
    }, [searchTerm, navigate]);

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitSearch();
        }
    };

    return (
        <>
            <nav className={`w-full transition-all duration-500 z-[100] ${isScrolled ? 'bg-white/90 backdrop-blur-md py-1 shadow-sm' : 'bg-white py-1.5 md:py-2.5 border-b border-gray-50'}`}>
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-6">

                    {/* Left: Logo */}
                    <div className="flex items-center gap-20 lg:gap-32 flex-shrink-0">
                        <Link to="/" className="relative flex items-center justify-center z-50">
                            <img
                                src={logo}
                                alt="Sands Jewels"
                                className="h-[30px] md:h-[40px] lg:h-[48px] w-auto object-contain transition-transform duration-300 hover:scale-105 origin-left"
                            />
                        </Link>
                        
                        {/* Location Selector - Desktop only */}
                        <div 
                            onClick={() => setIsPincodeModalOpen(true)}
                            className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 border border-[#9C5B61]/20 rounded-xl cursor-pointer hover:bg-[#9C5B61]/5 hover:border-[#9C5B61]/40 transition-all duration-300 group shadow-sm hover:shadow-md"
                        >
                            <div className="bg-[#9C5B61]/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="w-4 h-4 text-[#9C5B61]" />
                            </div>
                            <div className="flex flex-col -space-y-0.5">
                                <span className="text-[10px] font-bold text-black uppercase tracking-widest opacity-80">Where to Deliver?</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[11px] text-gray-500 font-semibold whitespace-nowrap">
                                        {pincode ? `Pincode: ${pincode}` : 'Update Pincode'}
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-[#9C5B61] group-hover:rotate-180 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-3xl mx-auto relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9C5B61]">
                            <Search className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <input
                            type="text"
                            placeholder={placeholders[placeholderIdx]}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full bg-white border border-gray-300 rounded-lg py-2 md:py-2.5 px-12 text-sm focus:outline-none focus:border-[#9C5B61] focus:ring-2 focus:ring-[#9C5B61]/10 transition-all text-black placeholder-gray-400 font-medium"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-4 text-[#9C5B61]">
                            <button className="hover:scale-110 active:scale-95 transition-transform duration-200" aria-label="Camera search">
                                <Camera className="w-5 h-5" />
                            </button>
                            <button className="hover:scale-110 active:scale-95 transition-transform duration-200" aria-label="Voice search">
                                <Mic className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Icons Section */}
                    <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0 text-[#9C5B61]">
                        {/* Mobile Search Trigger */}
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            type="button" 
                            onClick={submitSearch} 
                            className="md:hidden" 
                            aria-label="Search products"
                        >
                            <Search className="w-5 h-5" />
                        </motion.button>

                        {/* Diamond Icon */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/shop?purity=diamond" className="hidden md:block" aria-label="Diamond jewellery">
                                <Diamond className="w-5 h-5" />
                            </Link>
                        </motion.div>

                        {/* Store/Branch Icon */}
                        <motion.div whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/stores" className="hidden md:block" aria-label="Our stores">
                                <Store className="w-5 h-5" />
                            </Link>
                        </motion.div>

                        {/* Wishlist Icon */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
                            <Link to="/wishlist" aria-label="Wishlist">
                                <Heart className="w-5 h-5" />
                                {wishlist?.length > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-[#9C5B61] text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white"
                                    >
                                        {wishlist.length}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>

                        {/* User/Profile Icon */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Link to={user ? "/profile" : "/login"} className="hidden md:block" aria-label="My account">
                                <User className="w-5 h-5" />
                            </Link>
                        </motion.div>

                        {/* Cart/Bag Icon */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
                            <Link to="/cart" aria-label="Shopping bag">
                                <ShoppingBag className="w-5 h-5" />
                                {cart?.length > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-[#9C5B61] text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white"
                                    >
                                        {cart.length}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </nav>

            {/* ─── Mobile Side Drawer ─────────────────────────────────────────── */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-sm"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[310px] md:w-[380px] bg-white z-[120] flex flex-col shadow-2xl overflow-hidden"
                        >
                            {/* Drawer Header */}
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
                                <span className="font-display text-base font-black tracking-[0.2em] text-black">MENU</span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5 text-black" />
                                </button>
                            </div>

                            {/* Main Nav Items */}
                            <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">

                                {/* 1. HOME */}
                                <Link
                                    to="/"
                                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl font-display font-bold text-[13px] text-gray-800 hover:text-[#9C5B61] hover:bg-[#9C5B61]/5 transition-all uppercase tracking-wider group border-b border-gray-50"
                                >
                                    <svg className="w-4 h-4 text-[#9C5B61]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                        <polyline points="9 22 9 12 15 12 15 22"/>
                                    </svg>
                                    Home
                                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
                                </Link>

                                {/* 2. ALL JEWELLERY */}
                                <Link
                                    to="/collections"
                                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl font-display font-bold text-[13px] text-gray-800 hover:text-[#9C5B61] hover:bg-[#9C5B61]/5 transition-all uppercase tracking-wider group border-b border-gray-50"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#9C5B61]/70 shrink-0">
                                        <path d="M5 4c0 2 1 8 7 8s7-6 7-8"/>
                                        <path d="M12 12v2"/>
                                        <path d="M12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                        <path d="M10.5 17.5 9 19"/>
                                        <path d="M13.5 17.5 15 19"/>
                                        <path d="M12 18.5v2"/>
                                    </svg>
                                    All Jewellery
                                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
                                </Link>

                                {/* 3. SHOP FOR MEN */}
                                <Link
                                    to="/category/men"
                                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl font-display font-bold text-[13px] text-gray-800 hover:text-[#9C5B61] hover:bg-[#9C5B61]/5 transition-all uppercase tracking-wider group border-b border-gray-50"
                                >
                                    <svg className="w-4 h-4 text-[#9C5B61]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="4"/>
                                        <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                                    </svg>
                                    Shop for Men
                                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
                                </Link>

                                {/* 4. SHOP FOR WOMEN */}
                                <Link
                                    to="/category/women"
                                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl font-display font-bold text-[13px] text-gray-800 hover:text-[#9C5B61] hover:bg-[#9C5B61]/5 transition-all uppercase tracking-wider group border-b border-gray-50"
                                >
                                    <svg className="w-4 h-4 text-[#9C5B61]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="4"/>
                                        <path d="M12 12v9"/>
                                        <path d="M8 17h8"/>
                                    </svg>
                                    Shop for Women
                                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
                                </Link>

                                {/* 5. SHOP FOR FAMILY */}
                                <Link
                                    to="/category/family"
                                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl font-display font-bold text-[13px] text-gray-800 hover:text-[#9C5B61] hover:bg-[#9C5B61]/5 transition-all uppercase tracking-wider group border-b border-gray-50"
                                >
                                    <svg className="w-4 h-4 text-[#9C5B61]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                    Shop for Family
                                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
                                </Link>

                                {/* 6. GIFTS FOR — Accordion */}
                                <div className="border-b border-gray-50">
                                    <button
                                        onClick={() => toggleSection('giftsFor')}
                                        className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl font-display font-bold text-[13px] uppercase tracking-wider transition-all ${openSection === 'giftsFor' ? 'text-[#9C5B61] bg-[#9C5B61]/5' : 'text-gray-800 hover:text-[#9C5B61] hover:bg-[#9C5B61]/5'}`}
                                    >
                                        <svg className="w-4 h-4 text-[#9C5B61]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="8" width="18" height="14" rx="2"/>
                                            <path d="M12 8V22"/>
                                            <path d="M19 8a4 4 0 0 0-7-3.87A4 4 0 0 0 5 8"/>
                                        </svg>
                                        Gifts For
                                        <ChevronDown className={`w-4 h-4 ml-auto opacity-40 transition-transform duration-300 ${openSection === 'giftsFor' ? 'rotate-180 opacity-70' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openSection === 'giftsFor' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.22, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <ul className="pl-10 pb-3 pt-1 space-y-0.5">
                                                    {sidebarMenu.giftsFor.map((item, idx) => (
                                                        <li key={idx}>
                                                            <Link
                                                                to={item.path}
                                                                className="flex items-center gap-2.5 py-2.5 text-gray-500 text-sm font-semibold hover:text-[#9C5B61] transition-colors rounded-lg px-2 hover:bg-[#9C5B61]/5"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#9C5B61]/50 shrink-0" />
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 7. OCCASIONS — Accordion */}
                                <div className="border-b border-gray-50">
                                    <button
                                        onClick={() => toggleSection('occasions')}
                                        className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl font-display font-bold text-[13px] uppercase tracking-wider transition-all ${openSection === 'occasions' ? 'text-[#9C5B61] bg-[#9C5B61]/5' : 'text-gray-800 hover:text-[#9C5B61] hover:bg-[#9C5B61]/5'}`}
                                    >
                                        <svg className="w-4 h-4 text-[#9C5B61]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 3l1.88 5.76a1 1 0 0 0 .95.69h6.06l-4.91 3.56a1 1 0 0 0-.36 1.12L17.5 20l-4.91-3.56a1 1 0 0 0-1.18 0L6.5 20l1.88-5.87a1 1 0 0 0-.36-1.12L3.11 9.45h6.06a1 1 0 0 0 .95-.69L12 3Z"/>
                                        </svg>
                                        Occasions
                                        <ChevronDown className={`w-4 h-4 ml-auto opacity-40 transition-transform duration-300 ${openSection === 'occasions' ? 'rotate-180 opacity-70' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openSection === 'occasions' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.22, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <ul className="pl-10 pb-3 pt-1 space-y-0.5">
                                                    {sidebarMenu.occasions.map((item, idx) => (
                                                        <li key={idx}>
                                                            <Link
                                                                to={item.path}
                                                                className="flex items-center gap-2.5 py-2.5 text-gray-500 text-sm font-semibold hover:text-[#9C5B61] transition-colors rounded-lg px-2 hover:bg-[#9C5B61]/5"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#9C5B61]/50 shrink-0" />
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 8. BLOGS */}
                                <Link
                                    to="/blogs"
                                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl font-display font-bold text-[13px] text-gray-800 hover:text-[#9C5B61] hover:bg-[#9C5B61]/5 transition-all uppercase tracking-wider group border-b border-gray-50"
                                >
                                    <svg className="w-4 h-4 text-[#9C5B61]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                    </svg>
                                    Blogs
                                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
                                </Link>

                                {/* 9. ABOUT US */}
                                <Link
                                    to="/about"
                                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl font-display font-bold text-[13px] text-gray-800 hover:text-[#9C5B61] hover:bg-[#9C5B61]/5 transition-all uppercase tracking-wider group"
                                >
                                    <svg className="w-4 h-4 text-[#9C5B61]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    About Us
                                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
                                </Link>

                            </div>

                            {/* Drawer Footer */}
                            <div className="px-4 py-4 border-t border-gray-100 space-y-1 shrink-0 bg-gray-50/50 mt-auto">
                                <Link
                                    to="/help"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-[#9C5B61] hover:bg-white transition-all"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                                    </svg>
                                    Help Center
                                </Link>
                                <Link
                                    to={user ? '/profile' : '/login'}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-[#9C5B61] hover:bg-white transition-all"
                                >
                                    <User className="w-3.5 h-3.5" />
                                    {user ? 'My Account' : 'Login / Sign Up'}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─── Floating Bottom Navigation - Mobile Only ─────────────────── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex items-center justify-between z-[105] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <Link to="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#9C5B61] group">
                    <Store className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
                </Link>
                <button 
                  onClick={() => setIsMenuOpen(true)} 
                  className={`flex flex-col items-center gap-1 group transition-colors ${isMenuOpen ? 'text-[#9C5B61]' : 'text-gray-400 hover:text-[#9C5B61]'}`}
                  aria-label="Open menu"
                >
                    <Menu className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
                </button>
                <Link to="/wishlist" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#9C5B61] group relative" aria-label="Mobile Wishlist">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    {wishlist?.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#9C5B61] text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white">{wishlist.length}</span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Wishlist</span>
                </Link>
                <Link to={user ? "/profile" : "/login"} className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#9C5B61] group">
                    <User className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Account</span>
                </Link>
            </div>
        </>
    );
};

export default Navbar;
