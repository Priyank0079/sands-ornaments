import React, { useState } from 'react';
import {
    Image as ImageIcon, Plus, Trash2, Eye, EyeOff,
    Calendar, Link as LinkIcon, Edit3,
    Bell, Send, Layout, Move, ChevronRight, X, ExternalLink,
    MousePointer2
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const BannerManagement = () => {
    // Mock Banners Data matching the Home.jsx heroSlides structure
    const [banners, setBanners] = useState([
        {
            id: 'BN-001',
            badge: 'Daily Essentials',
            title: 'Minimalist Grace Every Day',
            description: 'Statement pieces designed for your everyday lifestyle.',
            btnText: 'Explore Now',
            link: '/shop',
            image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&w=1600&q=80',
            cardImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200',
            status: 'Active',
            startDate: 'Dec 01, 2024',
            endDate: 'Jan 31, 2025',
            secondaryTitle: 'Exquisite Details',
            secondaryLink: '/collections/minimalist'
        },
        {
            id: 'BN-002',
            badge: 'Wedding Specials',
            title: 'Bridal Elegance Redefined',
            description: 'Timeless silver pieces for your most special moments.',
            btnText: 'Shop Bridal',
            link: '/category/rings',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80',
            cardImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200',
            status: 'Active',
            startDate: 'Dec 20, 2024',
            endDate: 'Feb 28, 2025',
            secondaryTitle: 'Bridal Sets',
            secondaryLink: '/collections/bridal'
        }
    ]);

    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        badge: '',
        title: '',
        description: '',
        btnText: 'Explore Now',
        link: '/shop',
        image: '',
        cardImage: '',
        secondaryTitle: 'Exquisite Details',
        secondaryLink: '/shop',
        status: 'Active',
        startDate: '',
        endDate: ''
    });

    const [notificationData, setNotificationData] = useState({
        title: '',
        message: '',
        target: 'All Users'
    });

    const openAddModal = () => {
        setEditingBanner(null);
        setFormData({
            badge: '',
            title: '',
            description: '',
            btnText: 'Explore Now',
            link: '/shop',
            image: '',
            cardImage: '',
            secondaryTitle: 'Exquisite Details',
            secondaryLink: '/shop',
            status: 'Active',
            startDate: '',
            endDate: ''
        });
        setIsBannerModalOpen(true);
    };

    const openEditModal = (banner) => {
        setEditingBanner(banner.id);
        setFormData(banner);
        setIsBannerModalOpen(true);
    };

    const handleSaveBanner = (e) => {
        e.preventDefault();
        if (editingBanner) {
            setBanners(banners.map(b => b.id === editingBanner ? { ...formData, id: b.id } : b));
        } else {
            const newBanner = {
                ...formData,
                id: `BN-${Math.floor(100 + Math.random() * 900)}`
            };
            setBanners([newBanner, ...banners]);
        }
        setIsBannerModalOpen(false);
    };

    const toggleBannerStatus = (id) => {
        setBanners(banners.map(b =>
            b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b
        ));
    };

    const deleteBanner = (id) => {
        if (window.confirm('Delete this banner from the homepage rotation?')) {
            setBanners(banners.filter(b => b.id !== id));
        }
    };

    const handleSendNotification = (e) => {
        e.preventDefault();
        alert(`Notification "${notificationData.title}" sent successfully.`);
        setNotificationData({ title: '', message: '', target: 'All Users' });
        setIsNotificationModalOpen(false);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <PageHeader
                    title="Banner Management"
                    subtitle="Control hero slides and marketing actions"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsNotificationModalOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs md:text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <Bell className="w-4 h-4 text-amber-500" />
                        <span>Push</span>
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-[#3E2723] text-white rounded-lg text-xs md:text-sm font-bold hover:bg-[#5D4037] transition-all shadow-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Slide</span>
                    </button>
                </div>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden group">
                        {/* Visual Preview */}
                        <div className="aspect-[21/9] relative overflow-hidden bg-gray-100 border-b border-gray-100">
                            <img
                                src={banner.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'}
                                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${banner.status === 'Inactive' ? 'grayscale opacity-60' : ''}`}
                                alt={banner.title}
                            />

                            {/* UI Overlay Simulation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-center p-4 md:p-8">
                                <div className="max-w-[70%] md:max-w-[60%] space-y-1 md:space-y-2">
                                    <div className="px-1.5 py-0.5 bg-white/20 backdrop-blur-md rounded text-[7px] md:text-[8px] border border-white/30 text-white w-fit font-bold uppercase tracking-widest">
                                        {banner.badge}
                                    </div>
                                    <h3 className="text-white text-sm md:text-lg font-bold leading-tight line-clamp-1">{banner.title}</h3>
                                    <p className="text-white/70 text-[9px] md:text-[10px] leading-relaxed line-clamp-2 md:line-clamp-2">{banner.description}</p>
                                    <div className="pt-1 md:pt-2">
                                        <div className="px-2 md:px-3 py-0.5 md:py-1 bg-white text-gray-900 text-[8px] md:text-[10px] font-bold rounded-full w-fit">
                                            {banner.btnText}
                                        </div>
                                    </div>
                                </div>

                                {/* Small Card Image Simulation */}
                                <div className="absolute bottom-3 right-3 bg-white/95 rounded-lg p-1.5 md:p-2 w-20 md:w-28 shadow-lg md:block border border-white hidden">
                                    <div className="h-8 md:h-12 w-full bg-gray-100 rounded mb-1 md:mb-2 overflow-hidden">
                                        <img src={banner.cardImage} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <p className="text-[7px] md:text-[9px] font-bold text-gray-800 leading-none truncate">{banner.secondaryTitle}</p>
                                    <p className="text-[6px] md:text-[7px] text-[#8D6E63] font-bold uppercase mt-1">Explore →</p>
                                </div>
                            </div>

                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold border shadow-md ${banner.status === 'Active'
                                    ? 'bg-green-500 text-white border-green-600'
                                    : 'bg-white text-gray-400 border-gray-100'
                                    }`}>
                                    {banner.status}
                                </span>
                            </div>
                        </div>

                        {/* Banner Info Inline */}
                        <div className="p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
                                <div className="space-y-3 md:space-y-4 flex-1">
                                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                                        <div className="space-y-0.5 md:space-y-1">
                                            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Button</p>
                                            <p className="text-xs md:text-sm font-bold text-gray-700 truncate">{banner.btnText}</p>
                                            <p className="text-[9px] md:text-[10px] text-blue-500 font-bold truncate tracking-tight">{banner.link}</p>
                                        </div>
                                        <div className="space-y-0.5 md:space-y-1">
                                            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spotlight</p>
                                            <p className="text-xs md:text-sm font-bold text-gray-700 truncate">{banner.secondaryTitle}</p>
                                            <p className="text-[9px] md:text-[10px] text-[#8D6E63] font-bold truncate tracking-tight">{banner.secondaryLink}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-1">
                                        <div className="flex items-center gap-1.5 text-[9px] md:text-xs text-gray-500 font-bold bg-gray-50 px-2.5 py-1 md:py-1.5 rounded-lg border border-gray-100">
                                            <Calendar className="w-3 md:w-4 h-3 md:h-4 text-gray-400" />
                                            {banner.startDate} — {banner.endDate}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <button
                                        onClick={() => toggleBannerStatus(banner.id)}
                                        className="flex-1 md:flex-none p-2 md:p-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white text-gray-600 hover:text-[#3E2723] transition-all flex items-center justify-center"
                                        title={banner.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    >
                                        {banner.status === 'Active' ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(banner)}
                                        className="flex-1 md:flex-none p-2 md:p-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white text-gray-600 hover:text-[#3E2723] transition-all flex items-center justify-center"
                                    >
                                        <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteBanner(banner.id)}
                                        className="flex-1 md:flex-none p-2 md:p-2.5 rounded-xl border border-gray-100 bg-red-50 hover:bg-red-600 text-red-500 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Banner Editor Modal */}
            {isBannerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FDFBF7]">
                            <h3 className="text-xl font-bold text-black">
                                {editingBanner ? 'Edit Homepage Slide' : 'Add New Homepage Slide'}
                            </h3>
                            <button onClick={() => setIsBannerModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveBanner} className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Left Side: Primary Content */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-black uppercase tracking-widest border-b border-[#F5F0EB] pb-2 flex items-center gap-2">
                                        <Layout className="w-4 h-4" />
                                        Primary Display Settings
                                    </h4>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-black uppercase tracking-tighter">Main Large Background Image URL</label>
                                        <input
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#3E2723]/10"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://images.unsplash.com/..."
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-black">Badge Text</label>
                                            <input
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                                                value={formData.badge}
                                                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                                placeholder="e.g. Daily Essentials"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-black">Main Heading</label>
                                            <input
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-black">Description</label>
                                        <textarea
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold h-24 resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Primary Button Settings - Normalized */}
                                <div className="space-y-4 pt-4 border-t border-[#F5F0EB]">
                                    <h4 className="text-[11px] font-bold text-black uppercase flex items-center gap-2">
                                        <MousePointer2 className="w-4 h-4" /> Main Action Button
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-black">Button Label</label>
                                            <input
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                                                value={formData.btnText}
                                                onChange={(e) => setFormData({ ...formData, btnText: e.target.value })}
                                                placeholder="Explore Now"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-black">Button Destination (Link)</label>
                                            <input
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                                                value={formData.link}
                                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                                placeholder="/shop"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Dual Image & Secondary Card */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <h4 className="text-xs font-bold text-black uppercase tracking-widest border-b border-[#F5F0EB] pb-2 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Floating Spotlight Card
                                    </h4>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-black uppercase tracking-tighter">Small Secondary Item Image URL</label>
                                        <input
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                                            value={formData.cardImage}
                                            onChange={(e) => setFormData({ ...formData, cardImage: e.target.value })}
                                            placeholder="Link to item photo..."
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-black">Card Heading</label>
                                            <input
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                                                value={formData.secondaryTitle}
                                                onChange={(e) => setFormData({ ...formData, secondaryTitle: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-black">Card Link</label>
                                            <input
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold"
                                                value={formData.secondaryLink}
                                                onChange={(e) => setFormData({ ...formData, secondaryLink: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Visibility Schedule */}
                                <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#F5F0EB] space-y-4">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-black uppercase">
                                        <Calendar className="w-4 h-4" /> Visibility Schedule
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-black">Start Date</label>
                                            <input
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                placeholder="Dec 01, 2024"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-black">End Date</label>
                                            <input
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                placeholder="Jan 31, 2025"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsBannerModalOpen(false)}
                                        className="flex-1 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-4 bg-[#3E2723] text-white rounded-xl text-sm font-bold shadow-xl hover:bg-[#5D4037] transition-all"
                                    >
                                        Save All Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notifications Modal Remains Same */}
            {isNotificationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-black">Push Notification Blast</h3>
                            </div>
                            <button onClick={() => setIsNotificationModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSendNotification} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-black px-1">Target Audience</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10"
                                    value={notificationData.target}
                                    onChange={(e) => setNotificationData({ ...notificationData, target: e.target.value })}
                                >
                                    <option>All Users</option>
                                    <option>Recent Shoppers (30 days)</option>
                                    <option>Inactive Users (6 months)</option>
                                    <option>Wishlist Holders</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-black px-1">Notification Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Flash Sale Live! ⚡"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10"
                                    value={notificationData.title}
                                    onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-black px-1">Message Content</label>
                                <textarea
                                    placeholder="Enter the message you want to send..."
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 min-h-[120px] resize-none"
                                    value={notificationData.message}
                                    onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsNotificationModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-[#3E2723] text-white rounded-xl text-sm font-semibold shadow-lg hover:bg-[#5D4037] transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Notification
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerManagement;
