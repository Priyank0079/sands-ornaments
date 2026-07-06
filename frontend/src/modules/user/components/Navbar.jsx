import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, ChevronRight, Bell, Sparkles, Coins, Gem, Droplet, LifeBuoy, Sun, Hexagon, Gift, MoreHorizontal, ShoppingBag } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { useNotification } from '../../../context/NotificationContext';
import logo from '@assets/SANDS JEWELS PINK (1).png';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductPrice, formatCurrency } from '../utils/price';
import { getSearchThumbUrl } from '../../../utils/imageUtils';

const Navbar = () => {
    const {
        cart,
        wishlist,
        user,
        pincode,
        setIsPincodeModalOpen,
        activeMetal,
        updateActiveMetal
    } = useShop();

    const { unreadCount } = useNotification();

    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [placeholderIdx, setPlaceholderIdx] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Reset search term when navigating away from the shop search route or if query is empty
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlSearch = params.get('search') || '';
        if (location.pathname !== '/shop' || !urlSearch) {
            setSearchTerm('');
        } else {
            setSearchTerm(urlSearch);
        }
    }, [location.pathname, location.search]);

    // Prevent background scrolling on mobile when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Sync the header toggle state with the current route/query
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const metalParam = String(params.get('metal') || '').trim().toLowerCase();
        const karatParam = String(params.get('karat') || params.get('purity') || '').trim();
        const silverTypeParam = String(params.get('silver_type') || '').trim();
        const isGoldRoute = location.pathname.startsWith('/gold');
        const desiredMetal = (
            metalParam === 'gold'
            || isGoldRoute
            || (!metalParam && Boolean(karatParam))
        ) ? 'gold' : (
            metalParam === 'silver'
            || (!metalParam && Boolean(silverTypeParam))
        ) ? 'silver' : 'silver';

        if (desiredMetal && desiredMetal !== activeMetal) {
            updateActiveMetal(desiredMetal);
        }
    }, [activeMetal, location.pathname, location.search, updateActiveMetal]);

    const placeholders = useMemo(() => [
        "Search 'Rings'",
        "Search 'Pendants'",
        "Search 'Earrings'",
        "Search 'Bracelets'"
    ], []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [placeholders]);

    // Predictive Search Logic
    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm.trim().length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const response = await api.get(`/public/products?search=${searchTerm}&limit=6`);
                setSearchResults(response.data.products || []);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const submitSearch = useCallback(() => {
        const query = searchTerm.trim();
        if (query) {
            navigate(`/shop?search=${encodeURIComponent(query)}`);
            setShowResults(false);
            setShowMobileSearch(false);
        }
    }, [searchTerm, navigate]);

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitSearch();
        }
    };

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    return (
        <nav className={`w-full bg-[#FFF0F4] transition-all duration-300 font-lato ${isScrolled ? 'border-b border-pink-100' : 'border-b border-pink-100'}`}>
    
            {/* Desktop Header */}
            <div className="hidden lg:block">
                <div className="container mx-auto px-4 lg:px-12 py-1.5 flex items-center justify-between gap-10">

                    {/* Left Section: Logo & Delivery Box */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                        <Link to="/" className="block">
                            <img
                                src={logo}
                                alt="Sands Jewels"
                                className="h-[80px] w-auto object-contain -my-3"
                            />
                        </Link>

                        <div
                            onClick={() => setIsPincodeModalOpen(true)}
                            className="flex items-center gap-3 px-3 py-2 border border-pink-100 rounded-lg cursor-pointer bg-white hover:border-pink-200 transition-all"
                        >
                            <div className="flex-shrink-0">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-400">
                                    <path d="M1 3H16V17H1V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 8L20 8L23 11V17H16V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-black leading-tight uppercase tracking-tight">Where to Deliver?</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[12px] text-gray-900 font-semibold">
                                        {pincode ? `Deliver to ${pincode}` : 'Enter Pincode'}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Wide Search Bar with Dropdown */}
                    <div className="flex-1 max-w-3xl relative">
                        <input
                            type="text"
                            placeholder={placeholders[placeholderIdx]}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowResults(true);
                            }}
                            onKeyDown={handleSearchKeyDown}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            onFocus={() => setShowResults(true)}
                            className="w-full bg-white border border-gray-300 rounded-md py-3 px-6 pr-12 text-[15px] focus:outline-none focus:border-gray-400 transition-all text-gray-950 placeholder-gray-600 font-medium"
                        />
                        <button
                            onClick={submitSearch}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
                        >
                            <Search className="w-5 h-5 stroke-[2]" />
                        </button>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {showResults && (searchTerm.length >= 2) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-[200] overflow-hidden"
                                >
                                    {isSearching ? (
                                        <div className="p-8 text-center">
                                            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Searching...</span>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="p-2">
                                            <div className="px-4 py-2 mb-1">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Suggested Products</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-1">
                                                {searchResults.map((product) => (
                                                    <div
                                                        key={product._id}
                                                        onClick={() => {
                                                            navigate(`/product/${product._id}`);
                                                            setSearchTerm('');
                                                            setShowResults(false);
                                                        }}
                                                        className="flex items-center gap-4 p-3 hover:bg-pink-50/50 rounded-lg cursor-pointer transition-colors group"
                                                    >
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                                            <img 
                                                                src={getSearchThumbUrl(product.images?.[0] || product.primaryImage)} 
                                                                alt={product.name} 
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest line-clamp-1">{product.name}</h4>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[10px] font-black text-pink-600">{formatCurrency(getProductPrice(product))}</span>
                                                                <span className="text-[9px] font-medium text-gray-400">{product.category?.name || product.category}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={submitSearch}
                                                className="w-full mt-2 py-3 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-pink-50 hover:text-pink-600 transition-colors border-t border-gray-100"
                                            >
                                                View all results for "{searchTerm}"
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <p className="text-sm font-medium text-gray-400 italic">No products found for "{searchTerm}"</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Section: Icons */}
                    <div className="flex items-center gap-8 flex-shrink-0">
                        <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 group ${(location.pathname.startsWith('/profile') || location.pathname === '/login') ? 'text-[#D39A9F]' : ''}`}>
                            <User className={`w-6 h-6 ${(location.pathname.startsWith('/profile') || location.pathname === '/login') ? 'text-[#D39A9F]' : 'text-gray-700'}`} strokeWidth={1.5} />
                            <span className={`text-[11px] font-bold tracking-wider ${(location.pathname.startsWith('/profile') || location.pathname === '/login') ? 'text-[#D39A9F]' : 'text-gray-800'}`}>ACCOUNT</span>
                        </Link>

                        <Link to="/wishlist" className={`flex flex-col items-center gap-1 group relative ${location.pathname === '/wishlist' ? 'text-[#D39A9F]' : ''}`}>
                            <Heart className={`w-6 h-6 ${location.pathname === '/wishlist' ? 'text-[#D39A9F]' : 'text-gray-700'}`} strokeWidth={1.5} />
                            {wishlist?.length > 0 && (
                                <span className="absolute -top-1 right-0 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                            <span className={`text-[11px] font-bold tracking-wider ${location.pathname === '/wishlist' ? 'text-[#D39A9F]' : 'text-gray-800'}`}>WISHLIST</span>
                        </Link>

                        <Link to="/notifications" className={`flex flex-col items-center gap-1 group relative ${location.pathname === '/notifications' ? 'text-[#D39A9F]' : ''}`}>
                            <Bell className={`w-6 h-6 ${location.pathname === '/notifications' ? 'text-[#D39A9F]' : 'text-gray-700'}`} strokeWidth={1.5} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 right-0 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                            <span className={`text-[11px] font-bold tracking-wider ${location.pathname === '/notifications' ? 'text-[#D39A9F]' : 'text-gray-800'}`}>INBOX</span>
                        </Link>

                        <Link to="/cart" className={`flex flex-col items-center gap-1 group relative ${location.pathname === '/cart' ? 'text-[#D39A9F]' : ''}`}>
                            <ShoppingCart className={`w-6 h-6 ${location.pathname === '/cart' ? 'text-[#D39A9F]' : 'text-gray-700'}`} strokeWidth={1.5} />
                            {cart?.length > 0 && (
                                <span className="absolute -top-1 right-0 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cart.length}
                                </span>
                            )}
                            <span className={`text-[11px] font-bold tracking-wider ${location.pathname === '/cart' ? 'text-[#D39A9F]' : 'text-gray-800'}`}>CART</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden flex flex-col w-full relative">
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-pink-100">
                    <Link to="/" className="block">
                        <img src={logo} alt="Sands Jewels" className="h-[72px] w-auto object-contain transform scale-[1.35] origin-left" />
                    </Link>
                    <div className="flex items-center gap-4 sm:gap-5">
                        <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="relative p-1">
                            <Search className="w-6 h-6 text-gray-800" />
                        </button>

                        <Link to="/wishlist" className="relative hidden sm:block">
                            <Heart className="w-6 h-6 text-gray-800" />
                        </Link>
                        <Link to="/notifications" className="relative">
                            <Bell className="w-6 h-6 text-gray-800" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative">
                            <ShoppingCart className="w-6 h-6 text-gray-800" />
                            {cart?.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsMenuOpen(true)} className="p-1">
                            <Menu className="w-7 h-7 text-gray-800" />
                        </button>
                    </div>
                </div>
                
                {/* Mobile Search Bar */}
                <AnimatePresence>
                    {showMobileSearch && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="w-full bg-white border-b border-pink-50 px-4 py-2 absolute top-full left-0 z-50 shadow-md"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={placeholders[placeholderIdx]}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowResults(true);
                                    }}
                                    onKeyDown={handleSearchKeyDown}
                                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                                    onFocus={() => setShowResults(true)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 pr-10 text-[14px] focus:outline-none focus:border-pink-300 transition-all"
                                />
                                <button
                                    onClick={submitSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Swipe-in sidebar */}
            {createPortal(
                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 bg-black/40 z-[9998]"
                            />
                            <motion.div
                                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                                transition={{ type: 'tween', duration: 0.3 }}
                                className="fixed top-0 left-0 h-full w-full bg-white z-[9999] flex flex-col"
                            >
                                {/* Top Header */}
                                <div className="flex justify-between items-center px-6 pt-6 pb-4">
                                    <User className="w-6 h-6 text-[#8E2B45]" strokeWidth={1.5} />
                                    <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-gray-900 font-bold" strokeWidth={2.5} />
                                    </button>
                                </div>

                                {/* Banner/Coupon */}
                                <div className="px-5 mb-6 mt-2">
                                    <div className="relative bg-[#FDF5F6] border border-[#EBCDD0] rounded-lg p-5 flex items-center justify-between shadow-sm">
                                        {/* Ticket Cutouts */}
                                        <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-[#EBCDD0]"></div>
                                        <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-[#EBCDD0]"></div>
                                        
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="flex-shrink-0 relative">
                                                <ShoppingBag className="w-10 h-10 text-[#8E2B45] opacity-80" strokeWidth={1.2} />
                                                <ShoppingBag className="w-7 h-7 text-[#8E2B45] absolute -bottom-1 -right-2 bg-[#FDF5F6]" strokeWidth={1.5} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-[17px] font-serif font-bold text-[#8E2B45] leading-tight mb-2 tracking-wide">Welcome to Sands Jewels</h3>
                                                <div className="flex items-center gap-2">
                                                    <Link to="/login" className="text-[11px] font-bold text-[#8E2B45] hover:underline uppercase tracking-wider" onClick={() => setIsMenuOpen(false)}>LOGIN</Link>
                                                    <span className="text-gray-300">|</span>
                                                    <Link to="/login" className="text-[11px] font-bold text-[#8E2B45] hover:underline uppercase tracking-wider" onClick={() => setIsMenuOpen(false)}>SIGN UP</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <nav className="flex-1 flex flex-col overflow-y-auto no-scrollbar px-3 pb-8">
                                    {[
                                        { label: 'All Jewellery', path: '/shop', icon: Sparkles },
                                        { label: 'Gold', path: '/gold-collection', icon: Coins },
                                        { label: 'Diamond', path: '/shop?category=diamond', icon: Gem },
                                        { label: 'Earrings', path: '/shop?category=earrings', icon: Droplet },
                                        { label: 'Rings', path: '/shop?category=rings', icon: LifeBuoy },
                                        { label: 'Daily Wear', path: '/shop?category=daily-wear', icon: Sun },
                                        { label: 'Gemstone', path: '/shop?category=gemstone', icon: Hexagon },
                                        { label: 'Wedding', path: '/shop?category=wedding', icon: Heart },
                                        { label: 'Gifting', path: '/shop?category=gifting', icon: Gift },
                                        { label: 'More', path: '/shop', icon: MoreHorizontal }
                                    ].map((item, index) => (
                                        <Link 
                                            key={index}
                                            to={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-between py-4 px-4 text-gray-800 hover:bg-[#FDF5F6] hover:text-[#8E2B45] rounded-xl transition-all group border-b border-gray-100 last:border-0"
                                        >
                                            <div className="flex items-center gap-5">
                                                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-[#8E2B45] transition-colors" strokeWidth={1.5} />
                                                <span className="text-[15px] font-medium group-hover:font-semibold tracking-wide text-gray-800 group-hover:text-[#8E2B45]">{item.label}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-900 group-hover:text-[#8E2B45] transition-colors" strokeWidth={2.5} />
                                        </Link>
                                    ))}
                                </nav>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </nav>
    );
};

export default Navbar;
