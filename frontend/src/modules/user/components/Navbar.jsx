import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Store, Menu, X, Bell, ChevronDown } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import logo from '../../user/assets/SANDS JEWELS PINK (1).png';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { cart, wishlist, user, userNotifications, isMenuOpen, toggleMenu } = useShop();
    const location = useLocation();
    const isHome = location.pathname === '/';

    // Sidebar Menu Data
    const sidebarMenu = {
        shopByCategory: [
            { name: "Pendants", path: "/category/pendants" },
            { name: "Rings", path: "/category/rings" },
            { name: "Earrings", path: "/category/earrings" },
            { name: "Bracelets", path: "/category/bracelets" },
            { name: "Anklets", path: "/category/anklets" },
            { name: "Chains", path: "/category/necklaces" },
            { name: "All Products", path: "/shop" }
        ],
        giftsFor: [
            { name: "Womens", path: "/shop?filter=womens" },
            { name: "Girls", path: "/shop?filter=girls" },
            { name: "Mens", path: "/shop?filter=mens" },
            { name: "Couple", path: "/shop?filter=couple" },
            { name: "Kids", path: "/shop?filter=kids" }
        ],
        occasions: [
            { name: "Birthday", path: "/shop?occasion=birthday" },
            { name: "Anniversary", path: "/shop?occasion=anniversary" },
            { name: "Wedding", path: "/shop?occasion=wedding" },
            { name: "Mother's Day", path: "/shop?occasion=mothers-day" },
            { name: "Valentine Day", path: "/shop?occasion=valentine" }
        ]
    };

    // Sidebar Accordion State
    const [openSection, setOpenSection] = useState('shopByCategory'); // Default open
    const [mobileSelectedMetal, setMobileSelectedMetal] = useState(null); // null, 'gold', 'silver'

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <>
            <nav className="w-full transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm relative">
                {/* Top Bar - Asymmetric padding: Top 6, Bottom 3 */}
                <div className="container mx-auto px-4 md:px-6 pt-1 md:pt-1.5 pb-1 md:pb-1 flex items-center justify-between gap-4">

                    {/* Left: Menu Button & Logo */}
                    <div className="flex items-center gap-4 flex-1 md:flex-none">

                        {/* Logo */}
                        <Link to="/" className="relative h-10 w-10 md:h-14 md:w-14 flex items-center justify-center flex-shrink-0 group z-50">
                            <img
                                src={logo}
                                alt="Sands Jewels"
                                className="absolute top-1/2 left-0 -translate-y-1/2 h-28 w-28 md:h-40 md:w-40 max-w-none object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                            />
                        </Link>
                    </div>


                    {/* Search Bar - Prominent and Centered (Desktop Only) */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-auto relative group">
                        <input
                            type="text"
                            placeholder="Search for silver jewellery..."
                            className="w-full bg-white border border-gray-100 rounded-full py-2.5 px-6 pl-12 text-sm focus:outline-none focus:border-[#D39A9F] focus:ring-2 focus:ring-[#D39A9F]/20 transition-all shadow-sm group-hover:shadow-md text-black placeholder-gray-400"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#D39A9F] transition-colors" />
                    </div>

                    {/* Icons - Simplified on mobile */}
                    <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0 text-black">
                        <Link to="/shop" className="md:hidden hover:opacity-70">
                            <Search className="w-5 h-5 md:w-6 md:h-6" />
                        </Link>

                        <button className="hover:opacity-70 relative group">
                            <Link to="/notifications">
                                <Bell className="w-5 h-5 md:w-6 md:h-6" />
                                {userNotifications?.length > 0 && (
                                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                                )}
                            </Link>
                        </button>

                        <Link to="/cart" className="hover:opacity-70 relative">
                            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                            {cart?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#D39A9F] to-[#4A1015] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>
                            )}
                        </Link>

                        {/* Desktop Only Icons */}
                        <Link to="/wishlist" className="hidden md:block hover:opacity-70 relative">
                            <Heart className="w-6 h-6" />
                            {wishlist?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#D39A9F] to-[#4A1015] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">{wishlist.length}</span>
                            )}
                        </Link>

                        <Link to={user ? "/profile" : "/login"} className="hidden md:block hover:opacity-70">
                            <User className="w-6 h-6" />
                        </Link>
                    </div>
                </div>

                {/* Decorative Bottom Gradient Line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#D39A9F] via-[#4A1015] to-[#D39A9F] opacity-80"></div>
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

                                    {/* 1. Shop By Category */}
                                    <div className="border-b border-gray-100 pb-2">
                                        <button
                                            onClick={() => toggleSection('shopByCategory')}
                                            className="w-full flex items-center justify-between py-2 text-left font-display font-semibold text-black hover:text-[#4A1015] transition-colors"
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
                                                            <Link 
                                                                to="/gold-collection"
                                                                onClick={() => { toggleMenu(false); setMobileSelectedMetal(null); }}
                                                                className="flex flex-col items-center justify-center p-4 bg-[#FDFBF7] border border-gray-100 rounded-2xl hover:bg-[#D4AF37]/5 transition-colors text-center"
                                                            >
                                                                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center mb-2 shadow-sm">
                                                                    <span className="text-white font-black text-xs">Au</span>
                                                                </div>
                                                                <span className="text-[10px] font-black text-black uppercase">GOLD</span>
                                                            </Link>
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
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Silver Items</span>
                                                                <button 
                                                                    onClick={() => setMobileSelectedMetal(null)}
                                                                    className="text-xs text-[#D39A9F]"
                                                                >
                                                                    Change
                                                                </button>
                                                            </div>
                                                            <ul className="pl-4 py-2 space-y-3">
                                                                {sidebarMenu.shopByCategory.map((item, idx) => (
                                                                    <li key={idx}>
                                                                        <Link to={item.path} onClick={() => { toggleMenu(false); setMobileSelectedMetal(null); }} className="text-gray-600 text-sm hover:text-[#D39A9F] block">
                                                                            {item.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
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
                                            className="w-full flex items-center justify-between py-2 text-left font-display font-semibold text-black hover:text-[#4A1015] transition-colors"
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
                                                                <Link to={item.path} onClick={() => toggleMenu(false)} className="text-gray-600 text-sm hover:text-[#D39A9F] block">
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
                                            className="w-full flex items-center justify-between py-2 text-left font-display font-semibold text-black hover:text-[#4A1015] transition-colors"
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
                                                                <Link to={item.path} onClick={() => toggleMenu(false)} className="text-gray-600 text-sm hover:text-[#D39A9F] block">
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
                                        <Link to="/shop?maxPrice=1999" onClick={() => toggleMenu(false)} className="font-display font-semibold text-black hover:text-[#D39A9F] block tracking-wide">
                                            SUPER 1,999
                                        </Link>
                                    </div>

                                    {/* 5. Blogs */}
                                    <div className="py-2">
                                        <Link to="/blogs" onClick={() => toggleMenu(false)} className="font-display font-semibold text-black hover:text-[#D39A9F] block tracking-wide">
                                            BLOGS
                                        </Link>
                                    </div>

                                    {/* 6. About Us */}
                                    <div className="py-2">
                                        <Link to="/about" onClick={() => toggleMenu(false)} className="font-display font-semibold text-black hover:text-[#D39A9F] block tracking-wide">
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
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EBCDD0] px-6 py-3 flex items-center justify-between z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <Link to="/" className="flex flex-col items-center gap-1 text-gray-500 hover:text-black group">
                    <Store className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
                </Link>
                {/* Mobile Menu Trigger Replacement (Replacing Shop) */}
                <button onClick={() => toggleMenu(true)} className="flex flex-col items-center gap-1 text-gray-500 hover:text-black group">
                    <Menu className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
                </button>
                <Link to="/wishlist" className="flex flex-col items-center gap-1 text-gray-500 hover:text-black group relative">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    {wishlist?.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#D39A9F] text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">{wishlist.length}</span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Wishlist</span>
                </Link>
                <Link to={user ? "/profile" : "/login"} className="flex flex-col items-center gap-1 text-gray-500 hover:text-black group">
                    <User className="w-5 h-5 md:w-6 md:h-6 group-active:scale-90 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Account</span>
                </Link>
            </div>
        </>
    );
};

export default Navbar;
