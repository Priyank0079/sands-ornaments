import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { products } from '../assets/data';
import ProductCard from './ProductCard';

const AllJewellery = () => {
    // Show 4 rows of 4 products (16 total)
    const displayProducts = products.slice(0, 16);

    return (
        <section className="py-8 md:py-24 bg-white">
            <div className="container mx-auto px-2 md:px-4">
                {/* Header - Centered for Mobile, Original for Desktop */}
                <div className="flex flex-col md:flex-row md:justify-between items-center md:items-end text-center md:text-left mb-10 md:mb-16 gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#C9A24D] font-bold mb-1 md:mb-2">Our Collection</span>
                        <h2 className="text-2xl md:text-5xl font-display text-[#722F37]">All Jewellery</h2>
                        <div className="h-1 w-12 bg-[#C9A24D] mt-2 rounded-full md:hidden"></div>
                    </div>
                </div>

                {/* Grid - Using the standard ProductCard component */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Subtle View All Link at Bottom */}
                <div className="mt-8 md:mt-16 flex justify-center">
                    <Link
                        to="/shop"
                        className="group flex items-center gap-3 text-sm font-medium text-[#722F37] transition-all"
                    >
                        <span className="border-b border-[#722F37] pb-0.5 group-hover:text-[#C9A24D] group-hover:border-[#C9A24D] transition-all">
                            View Full Collection
                        </span>
                        <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AllJewellery;
