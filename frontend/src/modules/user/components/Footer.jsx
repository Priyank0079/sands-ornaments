import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Truck, Mail, Phone, MapPin, Heart, ShieldCheck, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/sands-logo.png'; // Using the official logo
import { normalizeExternalLink, normalizeFooterLink } from '../utils/navigation';

const Footer = () => {
    const location = useLocation();
    const isOrderSuccess = location.pathname === '/order-success';

    const [settings, setSettings] = useState({
        footerTagline: 'Timeless Elegance,',
        footerSubTagline: 'Handcrafted for You.',
        footerDescription: 'Every piece at Sands tell a story of heritage and modern Grace. Join our community of silver lovers and celebrate life\'s most precious moments.',
        address: '123 Silver Arcade, Heritage Marg, Jaipur',
        phone: '+91 98765 43210',
        email: 'support@sandsornaments.com',

        footerColumn1Title: 'Experience',
        footerColumn2Title: 'Policies',
        footerColumn3Title: 'Our World',

        footerExperienceLinks: [
            { name: "Easy Returns", path: "/returns" },
            { name: "Contact Us", path: "/contact" },
            { name: "FAQs", path: "/help" },
            { name: "Blogs", path: "/blogs" },
        ],
        footerPoliciesLinks: [
            { name: "Shipping Policy", path: "/shipping-policy" },
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Cancellation Policy", path: "/cancellation-policy" },
            { name: "Terms & Conditions", path: "/terms" },
        ],
        footerWorldLinks: [
            { name: "About Us", path: "/about" },
            { name: "Jewellery Care Guide", path: "/care-guide" },
            { name: "Our Craft", path: "/craft" },
        ],
        socialLinks: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            youtube: '#'
        },
        footerDeliveryText: 'Safe & Insured Express Worldwide Delivery',
        footerCopyrightText: `Sands Ornaments Pvt Ltd. All Rights Reserved.`
    });

    useEffect(() => {
        const loadSettings = () => {
            const saved = localStorage.getItem('siteSettings');
            if (saved) {
                setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
            }
        };
        loadSettings();

        window.addEventListener('storage', loadSettings);
        return () => window.removeEventListener('storage', loadSettings);
    }, []);

    if (isOrderSuccess) return null;

    const renderFooterLink = (link, idx) => {
        const safePath = normalizeFooterLink(link.path);
        return (
            <li key={idx}>
                <Link to={safePath} className="text-xs text-gray-600 font-medium hover:text-[#4A1015] transition-all hover:pl-2 flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-[#C9A24D] rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                    {link.name}
                </Link>
            </li>
        );
    };

    return (
        <footer className="relative bg-white pt-8 pb-4 overflow-hidden">
            {/* Decorative Top Border - Luxury Gradient */}
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#4A1015] via-[#C9A24D] to-[#4A1015]"></div>

            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FDF8F8] -z-0 skew-x-[-15deg] translate-x-1/2"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6">

                    {/* Brand Identity Section */}
                    <div className="lg:col-span-4 space-y-3">
                        <Link to="/" className="inline-block">
                            <img src={logo} alt="Sands Ornaments" className="h-12 w-auto object-contain brightness-90 hover:brightness-100 transition-all" />
                        </Link>
                        <div className="space-y-1.5">
                            <h3 className="text-xl font-display text-[#4A1015] leading-tight">
                                {settings.footerTagline} <br />
                                <span className="italic font-serif text-[#C9A24D]">{settings.footerSubTagline}</span>
                            </h3>
                            <p className="text-gray-500 font-serif text-sm leading-relaxed max-w-sm">
                                {settings.footerDescription}
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex gap-4 pt-1">
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-[#FDF8F8] flex items-center justify-center text-[#C9A24D]">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Secure</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-[#FDF8F8] flex items-center justify-center text-[#C9A24D]">
                                    <Star className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">925 Pure</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-[#FDF8F8] flex items-center justify-center text-[#C9A24D]">
                                    <Heart className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <h4 className="font-display text-[#4A1015] font-bold uppercase tracking-[0.25em] text-[10px] border-b border-[#EBCDD0] pb-1 inline-block">{settings.footerColumn1Title}</h4>
                            <ul className="space-y-1.5">
                                {settings.footerExperienceLinks?.map((link, idx) => (
                                    renderFooterLink(link, idx)
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-display text-[#4A1015] font-bold uppercase tracking-[0.25em] text-[10px] border-b border-[#EBCDD0] pb-1 inline-block">{settings.footerColumn2Title}</h4>
                            <ul className="space-y-1.5">
                                {settings.footerPoliciesLinks?.map((link, idx) => (
                                    renderFooterLink(link, idx)
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-display text-[#4A1015] font-bold uppercase tracking-[0.25em] text-[10px] border-b border-[#EBCDD0] pb-1 inline-block">{settings.footerColumn3Title}</h4>
                            <ul className="space-y-1.5">
                                {settings.footerWorldLinks?.map((link, idx) => (
                                    renderFooterLink(link, idx)
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="lg:col-span-3 space-y-3 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-[#EBCDD0]/50 shadow-md">
                        <div className="space-y-3">
                            <h4 className="font-display text-[#4A1015] font-bold uppercase tracking-[0.2em] text-[10px]">Connect Directly</h4>
                            <div className="space-y-2">
                                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 bg-[#4A1015] text-white rounded-lg flex items-center justify-center group-hover:bg-[#C9A24D] transition-all duration-500">
                                        <Mail className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 hover:text-[#4A1015] transition-colors">{settings.email}</span>
                                </a>
                                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 bg-[#4A1015] text-white rounded-lg flex items-center justify-center group-hover:bg-[#C9A24D] transition-all duration-500">
                                        <Phone className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 hover:text-[#4A1015] transition-colors">{settings.phone}</span>
                                </a>
                                <div className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 bg-[#4A1015] text-white rounded-lg flex items-center justify-center group-hover:bg-[#C9A24D] transition-all duration-500">
                                        <MapPin className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-serif italic text-gray-500 leading-tight">{settings.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Icons - Premium Style */}
                        <div className="space-y-3 pt-2 border-t border-gray-100">
                            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400">Social Gallery</p>
                            <div className="flex gap-3">
                                {[
                                    { Icon: Facebook, link: settings.socialLinks?.facebook },
                                    { Icon: Twitter, link: settings.socialLinks?.twitter },
                                    { Icon: Instagram, link: settings.socialLinks?.instagram },
                                    { Icon: Youtube, link: settings.socialLinks?.youtube }
                                ].map((social, i) => (
                                    <a key={i} href={normalizeExternalLink(social.link)} target="_blank" rel="noreferrer" className="w-8 h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:border-[#4A1015] hover:bg-[#4A1015] hover:text-white hover:-translate-y-1 transition-all duration-500 shadow-sm">
                                        <social.Icon className="w-3.5 h-3.5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fraud Disclaimer (Uses global fraud warning if available, else static) */}
                <div className="mb-4 border border-red-100 bg-red-50/50 rounded-lg p-3 flex items-start gap-3 md:items-center justify-center max-w-4xl mx-auto">
                    <ShieldCheck className="w-4 h-4 text-red-500 shrink-0 mt-0.5 md:mt-0" />
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed md:text-center text-left">
                        {settings.fraudWarning || "BEWARE OF FRAUD: Sands Ornaments will NEVER ask for OTPs, passwords, or sensitive financial information via unsolicited calls, WhatsApp, or emails."}
                    </p>
                </div>

                {/* Bottom Bar: Delivery & Copyright */}
                <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 bg-[#4A1015]/5 px-6 py-2 rounded-full border border-[#4A1015]/10">
                        <Truck className="w-4 h-4 text-[#4A1015]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#4A1015]">{settings.footerDeliveryText}</span>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
                            &copy; {new Date().getFullYear()} {settings.footerCopyrightText}
                        </p>
                        <p className="text-[9px] text-gray-300 font-serif italic">Designed with love for the Modern Muse</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
