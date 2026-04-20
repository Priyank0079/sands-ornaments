import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import AllJewellerySectionEditor from '../components/editors/AllJewellerySectionEditor';
import BestStylesSectionEditor from '../components/editors/BestStylesSectionEditor';
import ShopByBondEditor from '../components/editors/ShopByBondEditor';
import ShopByColourEditor from '../components/editors/ShopByColourEditor';
import SilverNewLaunchGridEditor from '../components/editors/SilverNewLaunchGridEditor';
import MenLuxurySectionEditor from '../components/editors/MenLuxurySectionEditor';
import CelebrateMenEditor from '../components/editors/CelebrateMenEditor';
import MenCuratedCollectionsEditor from '../components/editors/MenCuratedCollectionsEditor';
import MenExploreCollectionsEditor from '../components/editors/MenExploreCollectionsEditor';
import MenPersonalizedBannerEditor from '../components/editors/MenPersonalizedBannerEditor';
import MenPickYourGlamEditor from '../components/editors/MenPickYourGlamEditor';
import MenStyleGuideEditor from '../components/editors/MenStyleGuideEditor';
import MenStyleTrendsEditor from '../components/editors/MenStyleTrendsEditor';
import MenFeaturedProductsEditor from '../components/editors/MenFeaturedProductsEditor';
import WomenFeaturedProductsEditor from '../components/editors/WomenFeaturedProductsEditor';
import FamilyFeaturedProductsEditor from '../components/editors/FamilyFeaturedProductsEditor';
import CategoryShowcaseEditor from '../components/editors/CategoryShowcaseEditor';
import BannerSectionEditor from '../components/editors/BannerSectionEditor';
import BrandPromisesEditor from '../components/editors/BrandPromisesEditor';
import FAQSectionEditor from '../components/editors/FAQSectionEditor';
import TestimonialSectionEditor from '../components/editors/TestimonialSectionEditor';
import { adminService } from '../services/adminService';
import { getPageConfig, getSectionDefaultsForPage } from '../utils/sectionDefaults';
import toast from 'react-hot-toast';

const SectionEditor = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [sectionData, setSectionData] = useState(null);
    const [saving, setSaving] = useState(false);
    const pageKey = searchParams.get('pageKey') || 'home';
    const pageConfig = getPageConfig(pageKey);

    useEffect(() => {
        const loadSection = async () => {
            try {
                const data = await adminService.getSectionById(id, pageKey);
                if (data) {
                    const items = (data.items || []).map((item) => ({
                        id: item.itemId || item.id || item._id || `${Date.now()}_${Math.random()}`,
                        ...item
                    }));
                    setSectionData({
                        id: data.sectionId,
                        sectionKey: data.sectionKey || id,
                        pageKey: data.pageKey || pageKey,
                        sectionType: data.sectionType || 'rich-content',
                        label: data.label,
                        items,
                        settings: data.settings || {}
                    });
                }
            } catch (err) {
                toast.error("Failed to load section");
            }
        };
        loadSection();
    }, [id, pageKey]);

    if (!sectionData) {
        return <div className="p-10 text-center">Loading Section Editor...</div>;
    }

    const handleSave = async (newData) => {
        setSaving(true);
        try {
            const payload = {
                pageKey,
                sectionKey: sectionData.sectionKey || id,
                sectionType: sectionData.sectionType || 'rich-content',
                label: sectionData.label,
                settings: newData.settings || sectionData.settings || {},
                items: newData.items || []
            };
            const res = await adminService.updateSection(id, payload, pageKey);
            if (res.success === false) {
                toast.error(res.message || "Failed to save section");
                return { success: false };
            }
            const savedSection = res.data?.section || res.data?.data?.section || res.section || null;
            if (savedSection) {
                const items = (savedSection.items || []).map((item) => ({
                    id: item.itemId || item.id || item._id || `${Date.now()}_${Math.random()}`,
                    ...item
                }));
                setSectionData({
                    id: savedSection.sectionId,
                    sectionKey: savedSection.sectionKey || id,
                    pageKey: savedSection.pageKey || pageKey,
                    sectionType: savedSection.sectionType || 'rich-content',
                    label: savedSection.label || sectionData.label,
                    items,
                    settings: savedSection.settings || {}
                });
            } else {
                setSectionData((prev) => ({
                    ...prev,
                    settings: newData.settings || prev.settings || {},
                    items: (newData.items || []).map((item) => ({
                        id: item.itemId || item.id || item._id || `${Date.now()}_${Math.random()}`,
                        ...item
                    }))
                }));
            }
            toast.success("Section updated");
            return { success: true };
        } catch (err) {
            toast.error("Failed to save section");
            return { success: false };
        } finally {
            setSaving(false);
        }
    };

    const defaultSection = getSectionDefaultsForPage(pageKey).find((section) => (
        section.sectionKey === id || section.sectionId === id
    ));
    const defaultItems = defaultSection?.items || [];

    // Render appropriate editor based on section ID or type
    const renderEditor = () => {
        if (sectionData.sectionType === 'banner') {
            return <BannerSectionEditor sectionData={sectionData} onSave={handleSave} defaultItems={defaultItems} />;
        }

        if (sectionData.sectionType === 'testimonial') {
            return <TestimonialSectionEditor sectionData={sectionData} onSave={handleSave} defaultItems={defaultItems} />;
        }

        if (sectionData.sectionType === 'faq') {
            return <FAQSectionEditor sectionData={sectionData} onSave={handleSave} defaultItems={defaultItems} />;
        }

        if ((sectionData.sectionKey || id) === 'brand-promises') {
            return <BrandPromisesEditor sectionData={sectionData} onSave={handleSave} defaultItems={defaultItems} />;
        }

        if ((sectionData.sectionKey || id) === 'all-jewellery') {
            return <AllJewellerySectionEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'best-styles' || (sectionData.sectionKey || id) === 'featured-gifts') {
            return <BestStylesSectionEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'shop-by-colour') {
            return <ShopByColourEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'shop-by-bond') {
            return <ShopByBondEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'shop-by-relation') {
            return <ShopByBondEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'silver-new-launch-grid') {
            return <SilverNewLaunchGridEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'luxury-section') {
            return <MenLuxurySectionEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'celebrate-men') {
            return <CelebrateMenEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'curated-collections' && pageKey === 'shop-men') {
            return <MenCuratedCollectionsEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'explore-collections' && pageKey === 'shop-men') {
            return <MenExploreCollectionsEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'personalized-banner' && pageKey === 'shop-men') {
            return <MenPersonalizedBannerEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'personalized-banner' && pageKey === 'shop-women') {
            return <BannerSectionEditor sectionData={sectionData} onSave={handleSave} defaultItems={defaultItems} />;
        }

        if ((sectionData.sectionKey || id) === 'pick-your-glam' && pageKey === 'shop-men') {
            return <MenPickYourGlamEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'style-guide' && pageKey === 'shop-men') {
            return <MenStyleGuideEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'style-trends' && pageKey === 'shop-men') {
            return <MenStyleTrendsEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'products-listing' && pageKey === 'shop-men') {
            return <MenFeaturedProductsEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'products-listing' && pageKey === 'shop-women') {
            return <WomenFeaturedProductsEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        if ((sectionData.sectionKey || id) === 'products-listing' && pageKey === 'shop-family') {
            return <FamilyFeaturedProductsEditor sectionData={sectionData} onSave={handleSave} defaultSection={defaultSection} />;
        }

        const supportedSections = [
            'silver-collection',
            'silver-curated',
            'luxury-within-reach',
            'category-grid',
            'collections',
            'categories-grid',
            'trending-near-you',
            'product-categories',
            'curated-collections',
            'occasion-carousel',
            'gifts-to-remember',
            'discover-hue',
            'promo-banners',
            'premium-category-cards',
            'category-showcase',
            'price-range-showcase',
            'perfect-gift',
            'new-launch',
            'latest-drop',
            'most-gifted',
            'proposal-rings',
            'curated-for-you',
            'style-it-your-way',
            'nav-gifts-for',
            'nav-occasions'
        ];

        if (supportedSections.includes(sectionData.sectionKey || id)) {
            return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={defaultItems} />;
        }

        return (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <h3 className="text-xl font-bold text-gray-400">Editor not implemented for this section type yet.</h3>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 md:p-8">
                <PageHeader
                    title={`Edit ${sectionData.label}`}
                    subtitle={saving ? "Saving changes..." : `Customize the content for ${pageConfig?.label || 'this page'} section`}
                    backPath={`/admin/sections?pageKey=${pageKey}`}
                />

                {renderEditor()}
            </div>
        </div>
    );
};

export default SectionEditor;
