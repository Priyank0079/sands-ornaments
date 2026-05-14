import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/price';

const RecentlyViewed = () => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setItems(recentlyViewed);
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="mt-20 px-4 max-w-7xl mx-auto mb-20">
            <div className="flex items-end justify-between mb-10">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#D39A9F] uppercase tracking-[0.4em] mb-2">Continue Exploring</span>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-black tracking-tight">Recently Viewed</h2>
                </div>
                <button 
                    onClick={() => navigate('/shop')}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#9C5B61] transition-colors group"
                >
                    View All Designs <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="flex overflow-x-auto gap-4 md:gap-8 pb-8 no-scrollbar snap-x">
                {items.map((item, idx) => (
                    <div 
                        key={`${item.id}-${idx}`}
                        onClick={() => {
                            navigate(`/product/${item.id}`);
                            window.scrollTo(0, 0);
                        }}
                        className="min-w-[140px] md:min-w-[240px] group cursor-pointer snap-start"
                    >
                        <div className="aspect-[4/5] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-[#FDF5F6] border border-gray-100 relative shadow-sm group-hover:shadow-xl transition-all duration-700">
                            <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            
                            {/* Quick Action Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                    <Sparkles className="w-4 h-4 text-[#D39A9F]" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 px-2">
                            <h3 className="text-[10px] md:text-xs font-bold text-gray-900 uppercase tracking-widest line-clamp-1 group-hover:text-[#9C5B61] transition-colors">
                                {item.name}
                            </h3>
                            <p className="text-[10px] md:text-sm font-black text-[#8E2B45] mt-1">
                                {formatCurrency(item.price)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
