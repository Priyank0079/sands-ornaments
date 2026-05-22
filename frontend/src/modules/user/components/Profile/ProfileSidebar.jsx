import React, { useState } from 'react';
import { User, Package, MapPin, Heart, CreditCard, Tag, HelpCircle, FileText, ShieldCheck, Bell, BellOff, Shield, LogOut, Trash2, Edit2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = ({ 
    user, 
    activeTab, 
    safeOrders, 
    safeAddresses, 
    safeWishlist, 
    availableCoupons, 
    notificationsEnabled, 
    toggleNotificationSettings, 
    handleLogout, 
    setShowDeleteModal, 
    tabParam 
}) => {
    const navigate = useNavigate();

    return (
        <div className={`${tabParam ? 'hidden md:block' : 'block'} md:bg-white md:p-6 md:rounded-2xl md:shadow-sm h-fit border border-[#EBCDD0]`}>
            <div className="flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-8 md:bg-transparent md:p-0 p-3 text-center md:text-left">
                <div className="relative group">
                    <div className="bg-white p-4 md:p-4 rounded-full flex-shrink-0 shadow-sm border border-[#EBCDD0]">
                        <User className="w-10 h-10 md:w-8 md:h-8 text-[#D39A9F]" />
                    </div>
                    <button
                        onClick={() => navigate('/profile/profile/edit')}
                        className="absolute -top-1 -right-1 bg-[#3E2723] text-white p-1.5 rounded-full shadow-lg border-2 border-white md:hidden"
                    >
                        <Edit2 className="w-3 h-3" />
                    </button>
                    {/* Desktop Photo Edit Overlay */}
                    <button
                        onClick={() => navigate('/profile/profile/edit')}
                        className="hidden md:flex absolute inset-0 bg-black/20 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-[#3E2723] text-base md:text-lg">{user.name}</h3>
                    <p className="text-xs md:text-sm text-[#8D6E63]">{user.phone || user.email}</p>
                </div>
            </div>

            <nav className="space-y-1 md:space-y-2 md:bg-transparent md:p-0 p-1 rounded-2xl md:rounded-none md:shadow-none md:border-transparent">
                <button onClick={() => navigate('/profile/profile')} className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-[#F3F4F6]'}`}>
                    <User className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-sm md:text-base">Profile Details</span>
                </button>
                <button onClick={() => navigate('/profile/orders')} className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-[#F3F4F6]'}`}>
                    <Package className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-sm md:text-base">My Orders</span>
                    {safeOrders.length > 0 && <span className={`ml-auto text-xs py-0.5 px-2 rounded-full ${activeTab === 'orders' ? 'bg-white/20' : 'bg-[#F3F4F6]'}`}>{safeOrders.length}</span>}
                </button>
                <button onClick={() => navigate('/profile/addresses')} className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'addresses' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-[#F3F4F6]'}`}>
                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-sm md:text-base">My Addresses</span>
                    {safeAddresses.length > 0 && <span className={`ml-auto text-xs py-0.5 px-2 rounded-full ${activeTab === 'addresses' ? 'bg-white/20' : 'bg-[#F3F4F6]'}`}>{safeAddresses.length}</span>}
                </button>
                <button onClick={() => navigate('/wishlist')} className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 text-gray-600 hover:bg-[#F3F4F6] rounded-xl transition-all">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    <span className="font-medium text-sm md:text-base">My Wishlist</span>
                    {safeWishlist.length > 0 && <span className="ml-auto text-xs py-0.5 px-2 rounded-full bg-[#F3F4F6]">{safeWishlist.length}</span>}
                </button>
                <button onClick={() => navigate('/profile/payments')} className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'payments' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-[#F3F4F6]'}`}>
                    <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-sm md:text-base">Payments</span>
                </button>
                <button onClick={() => navigate('/profile/coupons')} className={`w-full flex items-center space-x-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'coupons' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-[#F3F4F6]'}`}>
                    <Tag className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-sm md:text-base">My Coupons</span>
                    {availableCoupons.length > 0 && <span className={`ml-auto text-xs py-0.5 px-2 rounded-full ${activeTab === 'coupons' ? 'bg-white/20' : 'bg-[#F3F4F6]'}`}>{availableCoupons.length}</span>}
                </button>
                <button onClick={() => navigate('/help')} className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 text-gray-600 hover:bg-[#F3F4F6] rounded-xl transition-all">
                    <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    <span className="font-medium text-sm md:text-base">Help Center</span>
                </button>
                <button onClick={() => navigate('/return-policy')} className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 text-gray-600 hover:bg-[#EFEBE9] rounded-xl transition-all">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#8D6E63]" />
                    <span className="font-medium text-sm md:text-base">Return Policy</span>
                </button>
                <button onClick={() => navigate('/replacement-policy')} className="w-full flex items-center space-x-3 px-3 md:px-4 py-3 text-gray-600 hover:bg-[#EFEBE9] rounded-xl transition-all">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-[#8D6E63]" />
                    <span className="font-medium text-sm md:text-base">Replacement Policy</span>
                </button>

                <hr className="my-4 border-[#EFEBE9]" />

                <div className="px-4 py-2 text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest">Preferences</div>
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3 text-gray-600">
                            {notificationsEnabled ? <Bell className="w-4 h-4 md:w-5 md:h-5 text-amber-500" /> : <BellOff className="w-4 h-4 md:w-5 md:h-5" />}
                            <span className="font-medium text-sm">Notifications</span>
                        </div>
                        <button onClick={toggleNotificationSettings} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-black' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                    <p className="text-[10px] text-[#8D6E63] leading-relaxed italic pr-2">
                        Don't miss any opportunity to grab your favorite ornaments as soon as they drop!
                    </p>
                </div>

                <div className="px-4 py-2 text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest">Legal</div>
                <button onClick={() => navigate('/terms')} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-[#EFEBE9] rounded-xl transition-all">
                    <FileText className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-sm">Terms & Conditions</span>
                </button>
                <button onClick={() => navigate('/privacy')} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-[#EFEBE9] rounded-xl transition-all">
                    <Shield className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-sm">Privacy Policy</span>
                </button>

                <hr className="my-4 border-[#EFEBE9]" />
                <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                    <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium">Logout</span>
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-2">
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-sm">Delete Account</span>
                </button>
            </nav>
        </div>
    );
};

export default ProfileSidebar;
