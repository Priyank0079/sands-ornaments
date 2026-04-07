import React, { useEffect } from 'react';
import FamilyHeroCarousel from '../components/family/FamilyHeroCarousel';
import FamilyProductsListing from '../components/family/FamilyProductsListing';

const ShopForFamily = () => {
    useEffect(() => {
        document.title = "Gifts for Family | Sands Ornaments";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FDF5F6] min-h-screen text-black font-sans overflow-x-hidden">
            {/* 1. Hero Section */}
            <FamilyHeroCarousel />

            {/* 2. Product Listing Section */}
            <FamilyProductsListing />
        </div>
    );
};

export default ShopForFamily;
