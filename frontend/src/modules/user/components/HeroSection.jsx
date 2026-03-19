import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

const HeroSection = () => {
    const { banners } = useShop();
    const banner = banners?.[0];

    if (!banner) return null;

    return (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-100 group">
            <img
                src={banner.image}
                alt={banner.title || 'Banner'}
                className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl text-white space-y-6 animate-fade-in-up">
                        {banner.subtitle && (
                            <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase">{banner.subtitle}</h2>
                        )}
                        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">{banner.title || 'Sands Ornaments'}</h1>
                        <Link to={banner.link || '/shop'} className="inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-[#8B4513] hover:text-white transition-all transform hover:translate-x-1">
                            <span>Shop Now</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
