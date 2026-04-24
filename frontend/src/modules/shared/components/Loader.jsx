import React from 'react';

const Loader = ({ fullPage = true }) => {
  return (
    <div className={`${fullPage ? 'fixed inset-0 z-[9999] bg-[#FDF5F6]/80' : 'w-full py-12'} flex items-center justify-center backdrop-blur-sm`}>
      <div className="relative">
        {/* Single Outer Ring - Hugging the logo closely */}
        <div className="absolute inset-4 md:inset-6 border-2 border-[#9C5B61]/10 rounded-full"></div>
        <div className="absolute inset-4 md:inset-6 border-2 border-t-[#9C5B61] border-r-[#9C5B61] border-b-transparent border-l-transparent rounded-full animate-[spin_1.2s_linear_infinite]"></div>
        
        {/* Central Logo - Enlarged */}
        <div className="relative w-36 h-36 md:w-56 md:h-56 flex items-center justify-center">
          <img 
            src="/loader.png" 
            alt="Loading..." 
            className="w-full h-full object-contain animate-[loader-pulse_2s_ease-in-out_infinite]"
          />
        </div>
        
        {/* Loading Text */}
        <div className="absolute -bottom-16 md:-bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="font-display text-[#7A2E3A] text-sm tracking-[0.3em] uppercase animate-pulse">
            Sands Jewels
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
