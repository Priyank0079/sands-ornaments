
import React from 'react';
import HeroSection from '../components/HeroSection';
import CategoryStrip from '../components/CategoryStrip';

import ShopByPacks from '../components/ShopByPacks';
const HomePage = () => {
    return (
        <div className="bg-white min-h-screen">
            <HeroSection />
            <CategoryStrip />

            <ShopByPacks />
        </div>
    );
};

export default HomePage;
