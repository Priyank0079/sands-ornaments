import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, ChevronRight, Bell } from 'lucide-react';
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
        <nav className={`w-full bg-[#FFF0F4] transition-all duration-300 z-[100] font-lato ${isScrolled ? 'shadow-sm' : 'border-b border-pink-100'}`}>
    
            {/* Desktop Header */}
            <div className="hidden lg:block">
                <div className="container mx-auto px-4 lg:px-12 py-1.5 flex items-center justify-between gap-10">

                    {/* Left Section: Logo & Delivery Box */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                        <Link to="/" className="block">
                            <img
                                src={logo}
                                alt="Sands Jewels"
                                className="h-14 w-auto object-contain"
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
                    <div className="flex items-center gap-10 flex-shrink-0">
                        <Link to={user ? "/profile" : "/login"} className="flex flex-col items-center gap-1.5 group">
                            <User className="w-7 h-7 text-gray-950" strokeWidth={1.5} />
                            <span className="text-[11px] font-bold text-black tracking-wider">ACCOUNT</span>
                        </Link>

                        <Link to="/wishlist" className="flex flex-col items-center gap-1.5 group relative">
                            <Heart className="w-7 h-7 text-gray-950" strokeWidth={1.5} />
                            {wishlist?.length > 0 && (
                                <span className="absolute -top-1 right-0 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                            <span className="text-[11px] font-bold text-black tracking-wider">WISHLIST</span>
                        </Link>

                        <Link to="/notifications" className="flex flex-col items-center gap-1.5 group relative">
                            <Bell className="w-7 h-7 text-gray-950" strokeWidth={1.5} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 right-0 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                            <span className="text-[11px] font-bold text-black tracking-wider">INBOX</span>
                        </Link>

                        <Link to="/cart" className="flex flex-col items-center gap-1.5 group relative">
                            <ShoppingCart className="w-7 h-7 text-gray-950" strokeWidth={1.5} />
                            {cart?.length > 0 && (
                                <span className="absolute -top-1 right-0 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cart.length}
                                </span>
                            )}
                            <span className="text-[11px] font-bold text-black tracking-wider">CART</span>
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
                        <Link to={user ? "/profile" : "/login"} className="relative">
                            <User className="w-6 h-6 text-gray-800" />
                        </Link>
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
                                className="fixed top-0 left-0 h-full w-[280px] bg-white z-[9999] p-6 shadow-2xl flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-8 border-b pb-4">
                                    <span className="text-lg tracking-wide uppercase">Menu</span>
                                    <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-7 h-7 text-gray-500" />
                                    </button>
                                </div>

                                <div className="flex bg-gray-100 p-1 rounded-full mb-6">
                                    <button
                                        onClick={() => {
                                            updateActiveMetal('silver');
                                            navigate('/');
                                            setIsMenuOpen(false);
                                        }}
                                        className={`flex-1 py-2 px-4 rounded-full text-sm transition-all duration-300 ${activeMetal === 'silver' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Silver
                                    </button>
                                    <button
                                        onClick={() => {
                                            updateActiveMetal('gold');
                                            navigate('/gold-collection');
                                            setIsMenuOpen(false);
                                        }}
                                        className={`flex-1 py-2 px-4 rounded-full text-sm transition-all duration-300 ${activeMetal === 'gold' ? 'bg-white text-[#C9A24D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Gold
                                    </button>
                                </div>

                                <nav className="flex flex-col gap-1 overflow-y-auto pb-8 no-scrollbar">
                                    <Link to="/" className="text-gray-900 text-base py-3 px-2 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>Home</Link>
                                    <Link to="/shop" className="text-gray-900 text-base py-3 px-2 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>Shop All</Link>

                                    <div className="my-2 border-t border-gray-200" />

                                    <button
                                        onClick={() => toggleSection('allType')}
                                        className="flex items-center justify-between py-3 px-2 text-gray-900 text-base hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
                                    >
                                        ALL TYPE
                                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expandedSections.allType ? 'rotate-90' : ''}`} />
                                    </button>
                                    {expandedSections.allType && (
                                        <div className="pl-4 flex flex-col gap-1 py-2 bg-gray-50 rounded-lg my-1">
                                            {/* Gold Section */}
                                            <button
                                                onClick={() => toggleSection('allTypeGold')}
                                                className="flex items-center justify-between py-2 px-2 text-gray-800 text-sm font-semibold hover:text-pink-500 rounded transition-all"
                                            >
                                                Gold Collection
                                                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.allTypeGold ? 'rotate-90' : ''}`} />
                                            </button>
                                            {expandedSections.allTypeGold && (
                                                <div className="pl-4 flex flex-col gap-1.5 pb-2">
                                                    <Link to="/shop?metal=gold&karat=24" className="text-gray-600 text-sm py-1.5 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>24K Gold</Link>
                                                    <Link to="/shop?metal=gold&karat=22" className="text-gray-600 text-sm py-1.5 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>22K Gold</Link>
                                                    <Link to="/shop?metal=gold&karat=18" className="text-gray-600 text-sm py-1.5 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>18K Gold</Link>
                                                    <Link to="/shop?metal=gold&karat=14" className="text-gray-600 text-sm py-1.5 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>14K Gold</Link>
                                                </div>
                                            )}

                                            {/* Silver Section */}
                                            <button
                                                onClick={() => toggleSection('allTypeSilver')}
                                                className="flex items-center justify-between py-2 px-2 text-gray-800 text-sm font-semibold hover:text-pink-500 rounded transition-all"
                                            >
                                                Silver Collection
                                                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.allTypeSilver ? 'rotate-90' : ''}`} />
                                            </button>
                                            {expandedSections.allTypeSilver && (
                                                <div className="pl-4 flex flex-col gap-1.5 pb-2">
                                                    <Link to="/shop?metal=silver&silver_type=sterling" className="text-gray-600 text-sm py-1.5 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>925 Sterling Silver</Link>
                                                    <Link to="/shop?metal=silver&silver_type=fine" className="text-gray-600 text-sm py-1.5 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Fine Silver</Link>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => toggleSection('categories')}
                                        className="flex items-center justify-between py-3 px-2 text-gray-900 text-base hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
                                    >
                                        Shop by Category
                                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expandedSections.categories ? 'rotate-90' : ''}`} />
                                    </button>
                                    {expandedSections.categories && (
                                        <div className="pl-4 flex flex-col gap-2 py-2 bg-gray-50 rounded-lg my-1">
                                            <Link to="/collections" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>All Categories</Link>
                                            <Link to="/category/men" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Men's Collection</Link>
                                            <Link to="/category/women" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Women's Collection</Link>
                                            <Link to="/category/family" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Family Collection</Link>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => toggleSection('collections')}
                                        className="flex items-center justify-between py-3 px-2 text-gray-900 text-base hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
                                    >
                                        Collections & Gifts
                                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expandedSections.collections ? 'rotate-90' : ''}`} />
                                    </button>
                                    {expandedSections.collections && (
                                        <div className="pl-4 flex flex-col gap-2 py-2 bg-gray-50 rounded-lg my-1">
                                            <Link to="/category/men" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Gifts for Him</Link>
                                            <Link to="/category/women" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Gifts for Her</Link>
                                            <Link to="/category/family" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Gifts for Family</Link>
                                            <Link to="/shop?search=exclusive" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Exclusive Collections</Link>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => toggleSection('more')}
                                        className="flex items-center justify-between py-3 px-2 text-gray-900 text-base hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
                                    >
                                        More at Sands
                                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expandedSections.more ? 'rotate-90' : ''}`} />
                                    </button>
                                    {expandedSections.more && (
                                        <div className="pl-4 flex flex-col gap-2 py-2 bg-gray-50 rounded-lg my-1">
                                            <Link to="/gift-cards" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Gift Cards</Link>
                                            <Link to="/blogs" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>Blogs</Link>
                                            <Link to="/about" className="text-gray-700 text-sm py-2 px-2 hover:text-pink-500 hover:bg-white rounded transition-all" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                                        </div>
                                    )}
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
