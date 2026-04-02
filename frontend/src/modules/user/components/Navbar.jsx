import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Store, Menu, X, Bell, ChevronDown, Camera, Mic, Diamond } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import logo from '../../user/assets/SANDS JEWELS PINK (1).png';
import { motion, AnimatePresence } from 'framer-motion';
import { ensureHomepageNavPath } from '../utils/homepageNav';

const Navbar = () => {
    const { cart, wishlist, user, userNotifications, isMenuOpen, toggleMenu, homepageSections, categories, products } = useShop();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const [searchTerm, setSearchTerm] = useState('');
    const [placeholderIdx, setPlaceholderIdx] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        }, 1500); // Rotating every 1.5s for a balance between speed and readability
        return () => clearInterval(interval);
    }, [placeholders]);

    // Sidebar Menu Data
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

        const visibleCategories = (categories || []).filter(
            (c) => c.isActive !== false && c.showInNavbar !== false
        );
        const getCategoriesByMetal = (metal) => {
            const byMetal = visibleCategories.filter(c => c.metal?.toLowerCase() === metal.toLowerCase());
            return byMetal.map(cat => ({ name: cat.name, path: `/shop?category=${cat._id || cat.id}` }));
        };

        return {
            shopByCategory: {
                silver: [
                    ...getCategoriesByMetal('silver'),
                    { name: "All Products", path: "/shop" }
                ],
                gold: getCategoriesByMetal('gold')
            },
            giftsFor: normalizeItems(sectionGifts, [
                { name: "Womens", path: "/shop?filter=womens" },
                { name: "Girls", path: "/shop?filter=girls" },
                { name: "Mens", path: "/shop?filter=mens" },
                { name: "Couple", path: "/shop?filter=couple" },
                { name: "Kids", path: "/shop?filter=kids" }
            ], 'filter'),
            occasions: normalizeItems(sectionOccasions, [
                { name: "Birthday", path: "/shop?occasion=birthday" },
                { name: "Anniversary", path: "/shop?occasion=anniversary" },
                { name: "Wedding", path: "/shop?occasion=wedding" },
                { name: "Mother's Day", path: "/shop?occasion=mothers-day" },
                { name: "Valentine Day", path: "/shop?occasion=valentine" }
            ], 'occasion')
        };
    }, [homepageSections, categories, products]);

    // Sidebar Accordion State
    const [openSection, setOpenSection] = useState('shopByCategory'); // Default open
    const [mobileSelectedMetal, setMobileSelectedMetal] = useState(null); // null, 'gold', 'silver'

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const submitSearch = () => {
        const query = searchTerm.trim();
        if (!query) {
            navigate('/shop');
            return;
        }

        navigate(`/shop?search=${encodeURIComponent(query)}`);
        if (isMenuOpen) {
            toggleMenu(false);
        }
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitSearch();
        }
    };

    return (
        <>
            <nav className={`w-full transition-all duration-500 z-[100] ${isScrolled ? 'bg-white/80 backdrop-blur-lg py-1' : 'bg-white py-2 md:py-4 border-b border-gray-50'}`}>
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-6">

                    {/* Left: Logo */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <Link to="/" className="relative flex items-center justify-center z-50">
                            <img
                                src={logo}
                                alt="Sands Jewels"
                                className="h-10 md:h-14 w-auto object-contain transition-transform duration-300 hover:scale-110 scale-[1.3] md:scale-[1.5] origin-left"
                            />
                        </Link>
                    </div>


                    <motion.div 
                        initial={false}
                        whileFocus={{ scale: 1.01 }}
                        className="hidden md:flex flex-1 max-w-3xl mx-auto relative group"
                    >
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9C5B61]">
                            <Search className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <input
                            type="text"
                            placeholder={placeholders[placeholderIdx]}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full bg-white border border-gray-400 rounded-full py-3 px-14 text-sm focus:outline-none focus:border-[#9C5B61] focus:ring-4 focus:ring-[#9C5B61]/10 transition-all text-black placeholder-gray-400 font-medium"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-4 text-[#9C5B61]">
                            <button className="hover:scale-110 active:scale-95 transition-transform duration-200">
                                <Camera className="w-5 h-5" />
                            </button>
                            <button className="hover:scale-110 active:scale-95 transition-transform duration-200">
                                <Mic className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Icons Section - Matching Target UI Icons and Color */}
                    <div className="flex items-center space-x-5 md:space-x-8 flex-shrink-0 text-[#9C5B61]">
                        {/* Mobile Search Trigger */}
                        <motion.button 
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            type="button" 
                            onClick={submitSearch} 
                            className="md:hidden" 
                            aria-label="Search products"
                        >
                            <Search className="w-6 h-6" />
                        </motion.button>

                        {/* Diamond Icon */}
                        <motion.div whileHover={{ scale: 1.15, rotate: 15 }} whileTap={{ scale: 0.9 }}>
                            <Link to="/shop?purity=diamond" className="hidden md:block">
                                <Diamond className="w-6 h-6" />
                            </Link>
                        </motion.div>

                        {/* Store/Branch Icon */}
                        <motion.div whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.9 }}>
                            <Link to="/stores" className="hidden md:block">
                                <Store className="w-6 h-6" />
                            </Link>
                        </motion.div>

                        {/* Wishlist Icon */}
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="relative">
                            <Link to="/wishlist">
                                <Heart className="w-6 h-6" />
                                {wishlist?.length > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1.5 -right-1.5 bg-[#9C5B61] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white"
                                    >
                                        {wishlist.length}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>

                        {/* User/Profile Icon */}
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                            <Link to={user ? "/profile" : "/login"} className="hidden md:block">
                                <User className="w-6 h-6" />
                            </Link>
                        </motion.div>

                        {/* Cart/Bag Icon */}
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="relative">
                            <Link to="/cart">
                                <ShoppingBag className="w-6 h-6" />
                                {cart?.length > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1.5 -right-1.5 bg-[#9C5B61] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white"
                                    >
                                        {cart.length}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </nav>

            {/* Sidebar / Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => toggleMenu(false)}
                            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[300px] md:w-[350px] bg-white z-[70] overflow-y-auto shadow-2xl"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <span className="font-display text-xl font-bold tracking-widest text-black">MENU</span>
                                    <button onClick={() => { toggleMenu(false); setMobileSelectedMetal(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-black" />
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <div className="space-y-4">

                                    {/* 0. All Jewellery */}
                                <div className="border-b border-gray-100 pb-2">
                                    <Link 
                                        to="/collections" 
                                        onClick={() => toggleMenu(false)}
                                        className="w-full flex items-center justify-between py-2 text-left font-display font-semibold text-black hover:text-[#9C5B61] transition-colors uppercase"
                                    >
                                        ALL JEWELLERY
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* 1. Shop By Category */}
                                    <div className="border-b border-gray-100 pb-2">
                                        <button
                                            onClick={() => toggleSection('shopByCategory')}
                                            className="w-full flex items-center justify-between py-2 text-left font-display font-semibold text-black hover:text-[#9C5B61] transition-colors"
                                        >
                                            SHOP BY CATEGORY
                                            <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'shopByCategory' ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openSection === 'shopByCategory' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    {!mobileSelectedMetal ? (
                                                        <div className="grid grid-cols-2 gap-3 pl-4 py-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => setMobileSelectedMetal('gold')}
                                                                className="flex flex-col items-center justify-center p-4 bg-[#FDFBF7] border border-gray-100 rounded-2xl hover:bg-[#D4AF37]/5 transition-colors text-center"
                                                            >
                                                                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center mb-2 shadow-sm">
                                                                    <span className="text-white font-black text-xs">Au</span>
                                                                </div>
                                                                <span className="text-[10px] font-black text-black uppercase">GOLD</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => setMobileSelectedMetal('silver')}
                                                                className="flex flex-col items-center justify-center p-4 bg-[#FDFBF7] border border-gray-100 rounded-2xl hover:bg-gray-100 transition-colors"
                                                            >
                                                                <div className="w-10 h-10 bg-[#8D6E63] rounded-full flex items-center justify-center mb-2 shadow-sm">
                                                                    <span className="text-white font-black text-xs">Ag</span>
                                                                </div>
                                                                <span className="text-[10px] font-black text-black uppercase">SILVER</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between pl-4 pr-2">
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                    {mobileSelectedMetal === 'gold' ? 'Gold Items' : 'Silver Items'}
                                                                </span>
                                                                <button 
                                                                    onClick={() => setMobileSelectedMetal(null)}
                                                                    className="text-xs text-[#9C5B61]"
                                                                >
                                                                    Change
                                                                </button>
                                                            </div>
                                                            {sidebarMenu.shopByCategory[mobileSelectedMetal]?.length > 0 ? (
                                                                <ul className="pl-4 py-2 space-y-3">
                                                                    {sidebarMenu.shopByCategory[mobileSelectedMetal].map((item, idx) => (
                                                                        <li key={idx}>
                                                                            <Link to={item.path} onClick={() => { toggleMenu(false); setMobileSelectedMetal(null); }} className="text-gray-600 text-sm hover:text-[#9C5B61] block">
                                                                                {item.name}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <div className="pl-4 py-4 pr-2 space-y-2">
                                                                    <p className="text-sm font-semibold text-black">Coming Soon</p>
                                                                    <p className="text-xs text-gray-500">Gold categories will appear here as soon as they are added.</p>
                                                                    <Link
                                                                        to="/gold-collection"
                                                                        onClick={() => { toggleMenu(false); setMobileSelectedMetal(null); }}
                                                                        className="inline-flex text-xs font-bold uppercase tracking-wider text-[#9C5B61] hover:text-black transition-colors"
                                                                    >
                                                                        View Gold Update
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* 2. Gifts For */}
                                    <div className="border-b border-gray-100 pb-2">
                                        <button
                                            onClick={() => toggleSection('giftsFor')}
                                            className="w-full flex items-center justify-between py-2 text-left font-display font-semibold text-black hover:text-[#9C5B61] transition-colors"
                                        >
                                            GIFTS FOR
                                            <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'giftsFor' ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openSection === 'giftsFor' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <ul className="pl-4 py-2 space-y-3">
                                                        {sidebarMenu.giftsFor.map((item, idx) => (
                                                            <li key={idx}>
                                                                <Link to={item.path} onClick={() => toggleMenu(false)} className="text-gray-600 text-sm hover:text-[#9C5B61] block">
                                                                    {item.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* 3. Occasions */}
                                    <div className="border-b border-gray-100 pb-2">
                                        <button
                                            onClick={() => toggleSection('occasions')}
                                            className="w-full flex items-center justify-between py-2 text-left font-display font-semibold text-black hover:text-[#9C5B61] transition-colors"
                                        >
                                            OCCASIONS
                                            <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'occasions' ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openSection === 'occasions' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <ul className="pl-4 py-2 space-y-3">
                                                        {sidebarMenu.occasions.map((item, idx) => (
                                                            <li key={idx}>
                                                                <Link to={item.path} onClick={() => toggleMenu(false)} className="text-gray-600 text-sm hover:text-[#9C5B61] block">
                                                                    {item.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* 4. Super 1,999 */}
                                    <div className="py-2">
                                        <Link to="/shop?price_max=1999" onClick={() => toggleMenu(false)} className="font-display font-semibold text-black hover:text-[#9C5B61] block tracking-wide">
                                            SUPER 1,999
                                        </Link>
                                    </div>

                                    {/* 5. Blogs */}
                                    <div className="py-2">
                                        <Link to="/blogs" onClick={() => toggleMenu(false)} className="font-display font-semibold text-black hover:text-[#9C5B61] block tracking-wide">
                                            BLOGS
                                        </Link>
                                    </div>

                                    {/* 6. About Us */}
                                    <div className="py-2">
                                        <Link to="/about" onClick={() => toggleMenu(false)} className="font-display font-semibold text-black hover:text-[#9C5B61] block tracking-wide">
                                            ABOUT US
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Floating Bottom Navigation - Mobile Only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex items-center justify-between z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <Link to="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#9C5B61] group">
                    <Store className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
                </Link>
                {/* Mobile Menu Trigger Replacement (Replacing Shop) */}
                <button onClick={() => toggleMenu(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#9C5B61] group">
                    <Menu className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
                </button>
                <Link to="/wishlist" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#9C5B61] group relative">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    {wishlist?.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#9C5B61] text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">{wishlist.length}</span>
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
