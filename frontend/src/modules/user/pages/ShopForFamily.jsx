import React, { useEffect, useState } from 'react';
import FamilyHeroCarousel from '../components/family/FamilyHeroCarousel';
import FamilyRecipientCategories from '../components/family/FamilyRecipientCategories';
import FamilyProductsCatalog from '../components/family/FamilyProductsCatalog';

const ShopForFamily = () => {
    const [selectedRecipient, setSelectedRecipient] = useState('all');

    useEffect(() => {
        document.title = "Gifts for Family | Sands Ornaments";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FDF5F6] min-h-screen text-black font-sans overflow-x-hidden">
            {/* 1. Hero Section */}
            <FamilyHeroCarousel />

            {/* 2. Category Section */}
            <FamilyRecipientCategories
                selectedRecipient={selectedRecipient}
                onSelectRecipient={setSelectedRecipient}
            />

            {/* 3. Product Listing Section */}
            <FamilyProductsCatalog
                selectedRecipient={selectedRecipient}
                onSelectRecipient={setSelectedRecipient}
            />
        </div>
    );
};

export default ShopForFamily;
