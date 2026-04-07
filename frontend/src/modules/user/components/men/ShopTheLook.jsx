import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const collections = [
    {
        id: 'edge',
        title: 'EDGE',
        subtitle: 'Sleek, silver, and made to turn heads',
        titleStyle: 'font-sans italic font-black text-4xl md:text-6xl tracking-tight',
        textColor: 'text-white',
        bgClass: 'bg-gradient-to-r from-[#071022] to-[#12213D]',
        image: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?q=80&w=800&auto=format&fit=crop',
        products: [
            { id: 'e1', img: 'https://images.unsplash.com/photo-1603561913955-44288053a479?q=80&w=200&auto=format&fit=crop', name: 'Ring' },
            { id: 'e2', img: 'https://images.unsplash.com/photo-1508685002320-134756157d53?q=80&w=200&auto=format&fit=crop', name: 'Chain' },
            { id: 'e3', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=200&auto=format&fit=crop', name: 'Band' }
        ]
    },
    {
        id: 'classics',
        title: 'THE CLASSICS',
        subtitle: 'Because classics never go out of style',
        titleStyle: 'font-serif text-3xl md:text-5xl font-medium tracking-wide',
        textColor: 'text-[#E5D3BD]',
        bgClass: 'bg-gradient-to-r from-[#0B1528] to-[#0A1A2A]',
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
        products: [
            { id: 'c1', img: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=200&auto=format&fit=crop', name: 'Studs' },
            { id: 'c2', img: 'https://images.unsplash.com/photo-1589410185121-6bd79ceba696?q=80&w=200&auto=format&fit=crop', name: 'Pendant' },
            { id: 'c3', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=200&auto=format&fit=crop', name: 'Link' }
        ]
    }
];

const ShopTheLook = () => {
    return (
        <section className="py-16 md:py-24 bg-[#FDF7F4] overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                
                {/* Header Section */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-4xl font-bold text-[#111] uppercase tracking-wide">
                        Explore Collections
                    </h2>
                </div>

                {/* Collections Slider / Grid */}
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-20 -mx-4 px-4 md:mx-0 md:px-0 gap-6 md:gap-10">
                    
                    {collections.map((collection, index) => (
                        <div 
                            key={collection.id}
                            className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[800px] snap-center relative"
                        >
                            {/* Main Large Card */}
                            <div className={`w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden relative shadow-lg ${collection.bgClass} flex`}>
                                
                                {/* Background Image */}
                                <div className="absolute top-0 right-0 h-full w-[60%] opacity-80 mix-blend-lighten mask-image-l" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}>
                                    <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

                                {/* Card Text Content */}
                                <div className="relative z-10 p-8 md:p-14 flex flex-col justify-center w-[70%]">
                                    <h3 className={`${collection.titleStyle} ${collection.textColor} mb-3`}>
                                        {collection.title}
                                    </h3>
                                    <p className="text-white/80 text-sm md:text-base font-sans mt-2">
                                        {collection.subtitle}
                                    </p>
                                </div>
                                
                                {/* Floating Navigation Buttons (Cosmetic matching image 4) */}
                                {index === 0 && (
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-colors z-20">
                                        <ChevronLeft className="w-6 h-6 text-black" />
                                    </div>
                                )}
                                {index === collections.length - 1 && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-colors z-20">
                                        <ChevronRight className="w-6 h-6 text-black" />
                                    </div>
                                )}

                            </div>

                            {/* Overlapping Bottom Product Tiles */}
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3 md:gap-6 w-full justify-center px-8 z-30">
                                {collection.products.map((prod, i) => (
                                    <Link to={`/shop?category=men`} key={prod.id} className="group flex-shrink-0">
                                        <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] bg-white rounded-xl md:rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.12)]">
                                            <img src={prod.img} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            
                        </div>
                    ))}
                    
                </div>
            </div>
        </section>
    );
};

export default ShopTheLook;
