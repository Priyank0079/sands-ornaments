import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import ProductCard from './ProductCard';

// Import bond category images
import bondWife from '../../../assets/bond_wife.png';
import bondHusband from '../../../assets/bond_husband.png';
import bondMother from '../../../assets/bond_mother.png';
import bondBrothers from '../../../assets/bond_brothers.png';
import bondSister from '../../../assets/bond_sister.png';
import bondFriends from '../../../assets/bond_friends.png';

const recipients = [
    { id: 'wife', name: "Wife", image: bondWife, path: "/collection/bond/wife" },
    { id: 'husband', name: "Husband", image: bondHusband, path: "/collection/bond/husband" },
    { id: 'mother', name: "Mother", image: bondMother, path: "/collection/bond/mother" },
    { id: 'brothers', name: "Brothers", image: bondBrothers, path: "/collection/bond/brothers" },
    { id: 'sister', name: "Sister", image: bondSister, path: "/collection/bond/sister" },
    { id: 'friends', name: "Friends", image: bondFriends, path: "/collection/bond/friends" }
];

const LEAD_PRODUCTS = [
    { id: 'lp1', name: "Soulmate Silver Band", price: 3499, originalPrice: 4899, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 12 },
    { id: 'lp2', name: "Amara Delicate Necklace", price: 4200, originalPrice: 5880, image: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviewCount: 8 },
    { id: 'lp3', name: "Zaya Crystal Earrings", price: 2800, originalPrice: 3920, image: "https://images.unsplash.com/photo-1635767798638-3e25273a8256?auto=format&fit=crop&q=80&w=800", rating: 4.2, reviewCount: 15 },
    { id: 'lp4', name: "Mens Curb Bracelet", price: 5999, originalPrice: 8399, image: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", rating: 4.7, reviewCount: 22 },
];

const PerfectGift = () => {
    const { products } = useShop();
    const displayLead = (products && products.length > 0) ? products.slice(0, 4) : LEAD_PRODUCTS;

    return (
        <section className="py-6 md:py-20 bg-white text-black overflow-hidden font-sans border-b border-gray-100">
            <div className="container mx-auto px-4">
                
                {/* Section Title */}
                <div className="text-center mb-6 md:mb-16">
                    <h2 className="text-2xl md:text-5xl font-black text-black tracking-tighter mb-4">
                        Shop by Bond
                    </h2>
                    <p className="text-gray-400 text-[10px] md:text-sm uppercase tracking-[0.4em] font-bold">
                        Curated for your loved ones
                    </p>
                </div>
                
                {/* Bonds Category Grid */}
                <div className="flex overflow-x-auto scrollbar-hide gap-4 md:gap-6 pb-6 md:pb-12 px-1 md:px-2 max-w-[1500px] mx-auto justify-start md:justify-center">
                    {recipients.map((item) => (
                        <Link 
                            key={item.id} 
                            to={item.path} 
                            className="flex flex-col items-center shrink-0 w-[130px] md:w-[210px] group"
                        >
                            <div className="bg-[#E8E8E8] p-1.5 md:p-2 rounded-2xl md:rounded-3xl w-full flex flex-col items-center transition-all duration-500 group-hover:bg-[#D3D3D3] group-hover:translate-y-[-6px]">
                                <div className="w-full aspect-[4/5] overflow-hidden rounded-xl md:rounded-2xl mb-3">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="text-[14px] md:text-[18px] font-black text-black tracking-tight pb-3 px-2 text-center leading-none">
                                    {item.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Featured Products Sub-section */}
                <div className="mt-6 md:mt-20 pt-6 md:pt-16 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-6 md:mb-12">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Featured Gifts</h3>
                            <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest mt-1">Handpicked for the perfect moment</p>
                        </div>
                        <Link to="/shop" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9C5B61] hover:text-black transition-all border-b-2 border-transparent hover:border-black">
                            View All Collection
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
                        {displayLead.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default PerfectGift;
