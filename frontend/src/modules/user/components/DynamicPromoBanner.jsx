import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHomepageCms } from '../hooks/useHomepageCms';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

const DynamicPromoBanner = () => {
    const { data: homepageSections = {} } = useHomepageCms();
    const sectionData = homepageSections?.['dynamic-promo-banner'];

    const bannerItems = useMemo(() => {
        const items = Array.isArray(sectionData?.items) ? sectionData.items : [];
        return items
            .filter((item) => Boolean(item?.image)) // image is required
            .map((item, index) => ({
                id: item.itemId || item.id || `dynamic-promo-${index + 1}`,
                image: resolveLegacyCmsAsset(item.image, item.image),
                mobileImage: item.mobileImage ? resolveLegacyCmsAsset(item.mobileImage, item.mobileImage) : null,
                link: item.path || '/shop',
                title: item.label || 'Promo Banner'
            }));
    }, [sectionData?.items]);

    if (bannerItems.length === 0) {
        return null;
    }

    // Use the first banner if multiple exist
    const banner = bannerItems[0];

    return (
        <section className="w-full bg-white">
            <div className="container mx-auto px-4">
                <Link to={banner.link} className="block w-full">
                    {/* 
                        Container locks aspect ratio dynamically.
                        If a mobile image is provided, it uses 16:9 on mobile and 4:1 on desktop.
                        If no mobile image is provided, it uses 4:1 everywhere to prevent cropping the desktop image on mobile screens.
                    */}
                    <div className={`w-full relative rounded-2xl overflow-hidden shadow-sm group ${banner.mobileImage ? 'aspect-[16/9] md:aspect-[4/1]' : 'aspect-[4/1]'}`}>
                        
                        {/* Mobile Image */}
                        {banner.mobileImage && (
                            <img
                                src={banner.mobileImage}
                                alt={banner.title}
                                className="w-full h-full object-cover block md:hidden"
                                loading="lazy"
                                decoding="async"
                            />
                        )}

                        {/* Desktop Image */}
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className={`w-full h-full object-cover ${banner.mobileImage ? 'hidden md:block' : 'block'}`}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default DynamicPromoBanner;
