import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import PageHeader from '../components/common/PageHeader';
import CategoryShowcaseEditor from '../components/editors/CategoryShowcaseEditor';

// Import Price Range Images (for fallback defaults)
import price999 from '../../user/assets/price_under_999.png';
import price1999 from '../../user/assets/price_under_1999.png';
import price2999 from '../../user/assets/price_under_2999.png';
import price3999 from '../../user/assets/price_under_3999.png';

// Import Gift Images (for fallback defaults)
import giftMother from '../../user/assets/gift_mother_silver.png';
import giftFriends from '../../user/assets/gift_friends_silver.png';
import giftWife from '../../user/assets/gift_wife_silver.png';
import giftSister from '../../user/assets/gift_sister_silver.png';

// Import New Launch Images
import newEarrings from '../../user/assets/new_launch_earrings.png';
import newChains from '../../user/assets/new_launch_chains.png';
import newStuds from '../../user/assets/new_launch_studs.png';
import newBracelets from '../../user/assets/new_launch_bracelets.png';
import newAnklets from '../../user/assets/new_launch_anklets.png';

// Import Latest Drop Images
import latestRing from '../../user/assets/latest_drop_ring.png';
import latestNecklace from '../../user/assets/latest_drop_necklace.png';
import latestEarrings from '../../user/assets/latest_drop_earrings.png';
import latestBracelet from '../../user/assets/latest_drop_bracelet.png';

// Import Pink Premium Images (for Most Gifted defaults)
import pinkBracelets from '../../user/assets/pink_bracelets_1767775488371.png';
import pinkEarrings from '../../user/assets/pink_earrings_1767775466166.png';
import pinkChains from '../../user/assets/pink_chains_1767775516641.png';
import pinkAnklets from '../../user/assets/pink_anklets_1767775536388.png';

// Import Proposal Images
import proposalBannerImg from '../../user/assets/proposal_banner.png';

// Import Occasional Special Images
import haldiImg from '../../user/assets/haldi.png';
import sangeetImg from '../../user/assets/sangeet.png';
import receptionImg from '../../user/assets/reception.png';
import bridalImg from '../../user/assets/bridal.png';
import bridesmaidImg from '../../user/assets/hero_slide_3.png';

// Import Style It Your Way Images
import bannerDaily from '../../user/assets/banner_daily.png';
import bannerOffice from '../../user/assets/banner_office.png';
import bannerParty from '../../user/assets/banner_party.png';
import bannerCasual from '../../user/assets/trending_heritage.png';
import prodAnklet from '../../user/assets/cat_anklets.png';
import prodWineEar from '../../user/assets/cat_earrings_wine.png';
import prodWineRing from '../../user/assets/cat_ring_wine.png';
import prodRing from '../../user/assets/cat_ring_wine.png';
import prodPendant from '../../user/assets/cat_pendant.png';
import prodEarring from '../../user/assets/silver_earrings_product.png';
import prodBracelet from '../../user/assets/silver_bracelet_product.png';
import prodSis from '../../user/assets/gift_sister_silver.png';

const SectionEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { homepageSections, updateSection } = useShop();

    const [sectionData, setSectionData] = useState(null);

    useEffect(() => {
        if (homepageSections && homepageSections[id]) {
            setSectionData(homepageSections[id]);
        } else {
            // If section not found (or data loading), maybe redirect or show error
            // navigating back for now if strict
        }
    }, [id, homepageSections]);

    if (!sectionData) {
        return <div className="p-10 text-center">Loading Section Editor...</div>;
    }

    const handleSave = (newData) => {
        updateSection(id, newData);
        // navigate('/admin/sections'); // Optional: go back or stay
    };

    // Render appropriate editor based on section ID or type
    const renderEditor = () => {
        switch (id) {
            case 'category-showcase':
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} />;
            case 'price-range-showcase':
                const priceRangeDefaults = [
                    { id: 'under-999', name: 'Under ₹999', image: price999, path: "/shop?price_max=999", tag: '' },
                    { id: 'under-1999', name: 'Under ₹1999', image: price1999, path: "/shop?price_max=1999", tag: '' },
                    { id: 'under-2999', name: 'Under ₹2999', image: price2999, path: "/shop?price_max=2999", tag: '' },
                    { id: 'under-3999', name: 'Under ₹3999', image: price3999, path: "/shop?price_max=3999", tag: '' }
                ];
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={priceRangeDefaults} />;
            case 'perfect-gift':
                const perfectGiftDefaults = [
                    { id: 'mother', name: "Mother", image: giftMother, path: "/shop?recipient=mother", tag: '' },
                    { id: 'friends', name: "Friends", image: giftFriends, path: "/shop?recipient=friends", tag: '' },
                    { id: 'wife', name: "Wife", image: giftWife, path: "/shop?recipient=wife", tag: '' },
                    { id: 'sister', name: "Sister", image: giftSister, path: "/shop?recipient=sister", tag: '' }
                ];
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={perfectGiftDefaults} />;
            case 'new-launch':
                const newLaunchDefaults = [
                    { id: 'earrings', name: "Earrings", image: newEarrings, path: "/category/earrings", tag: '' },
                    { id: 'chains', name: "Chains", image: newChains, path: "/category/chains", tag: '' },
                    { id: 'studs', name: "Studs", image: newStuds, path: "/category/studs", tag: '' },
                    { id: 'bracelets', name: "Bracelets", image: newBracelets, path: "/category/bracelets", tag: '' },
                    { id: 'anklets', name: "Anklets", image: newAnklets, path: "/category/anklets", tag: '' }
                ];
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={newLaunchDefaults} />;
            case 'latest-drop':
                const latestDropDefaults = [
                    { id: '1', name: "Midnight Silver Ring", price: "₹2,499", image: latestRing, path: "/product/midnight-ring", tag: '' },
                    { id: '2', name: "Lunar Pendant", price: "₹4,999", image: latestNecklace, path: "/product/lunar-pendant", tag: '' },
                    { id: '3', name: "Noir Drop Earrings", price: "₹3,299", image: latestEarrings, path: "/product/noir-earrings", tag: '' },
                    { id: '4', name: "Obsidian Chain", price: "₹5,999", image: latestBracelet, path: "/product/obsidian-chain", tag: '' }
                ];
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={latestDropDefaults} />;
            case 'most-gifted':
                const mostGiftedDefaults = [
                    { id: '1', name: "Earrings", image: pinkEarrings, path: "/shop?category=earrings", tag: '' },
                    { id: '2', name: "Bracelets", image: pinkBracelets, path: "/shop?category=bracelets", tag: '' },
                    { id: '3', name: "Chains", image: pinkChains, path: "/shop?category=chains", tag: '' },
                    { id: '4', name: "Anklets", image: pinkAnklets, path: "/shop?category=anklets", tag: '' }
                ];
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={mostGiftedDefaults} />;
            case 'proposal-rings':
                const proposalDefaults = [
                    { id: 'banner', name: "Proposal Rings", image: proposalBannerImg, path: "/category/rings", tag: '' }
                ];
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={proposalDefaults} />;
            case 'curated-for-you':
                const curatedDefaults = [
                    { id: 'haldi', name: 'Haldi', image: haldiImg, path: '/category/haldi' },
                    { id: 'sangeet', name: 'Sangeet', image: sangeetImg, path: '/category/sangeet' },
                    { id: 'reception', name: 'Reception', image: receptionImg, path: '/category/reception' },
                    { id: 'bridal', name: 'Gift for Bride', image: bridalImg, path: '/category/bridal' },
                    { id: 'bridesmaids', name: 'Gift for Bridesmaid', image: bridesmaidImg, path: '/category/bridesmaids' },
                ];
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={curatedDefaults} />;
            case 'style-it-your-way':
                const styleDefaults = [
                    { id: '1', name: "Daily Wear", image: bannerDaily, tag: "Effortless Everyday", extraImages: [prodPendant, prodWineEar, prodAnklet] },
                    { id: '2', name: "Office Wear", image: bannerOffice, tag: "Professional Chic", extraImages: [prodEarring, prodPendant, prodRing] },
                    { id: '3', name: "Party Wear", image: bannerParty, tag: "Glamour & Shine", extraImages: [prodWineEar, prodWineRing, prodAnklet] },
                    { id: '4', name: "Casual Wear", image: bannerCasual, tag: "Relaxed Vibes", extraImages: [prodAnklet, prodBracelet, prodSis] },
                ];
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={styleDefaults} />;
            default:
                return (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <h3 className="text-xl font-bold text-gray-400">Editor not implemented for this section type yet.</h3>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 md:p-8">
                <PageHeader
                    title={`Edit ${sectionData.label}`}
                    subtitle="Customize the content for this homepage section"
                    backPath="/admin/sections"
                />

                {renderEditor()}
            </div>
        </div>
    );
};

export default SectionEditor;
