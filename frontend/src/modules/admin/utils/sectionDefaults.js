import price999 from '../../user/assets/price_under_999.png';
import price1999 from '../../user/assets/price_under_1999.png';
import price2999 from '../../user/assets/price_under_2999.png';
import price3999 from '../../user/assets/price_under_3999.png';

import giftMother from '../../user/assets/gift_mother_silver.png';
import giftFriends from '../../user/assets/gift_friends_silver.png';
import giftWife from '../../user/assets/gift_wife_silver.png';
import giftSister from '../../user/assets/gift_sister_silver.png';

import newEarrings from '../../user/assets/new_launch_earrings.png';
import newChains from '../../user/assets/new_launch_chains.png';
import newStuds from '../../user/assets/new_launch_studs.png';
import newBracelets from '../../user/assets/new_launch_bracelets.png';
import newAnklets from '../../user/assets/new_launch_anklets.png';

import latestRing from '../../user/assets/latest_drop_ring.png';
import latestNecklace from '../../user/assets/latest_drop_necklace.png';
import latestEarrings from '../../user/assets/latest_drop_earrings.png';
import latestBracelet from '../../user/assets/latest_drop_bracelet.png';

import pinkBracelets from '../../user/assets/pink_bracelets_1767775488371.png';
import pinkEarrings from '../../user/assets/pink_earrings_1767775466166.png';
import pinkChains from '../../user/assets/pink_chains_1767775516641.png';
import pinkAnklets from '../../user/assets/pink_anklets_1767775536388.png';

import proposalBannerImg from '../../user/assets/proposal_banner.png';

import haldiImg from '../../user/assets/haldi.png';
import sangeetImg from '../../user/assets/sangeet.png';
import receptionImg from '../../user/assets/reception.png';
import bridalImg from '../../user/assets/bridal.png';
import bridesmaidImg from '../../user/assets/hero_slide_3.png';
import sandsLogoDefault from '../../user/assets/sands-logo.png';

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

import catPendant from '../../user/assets/cat_pendant.png';
import catRing from '../../user/assets/cat_rings.png';
import catEarrings from '../../user/assets/cat_earrings.png';
import catBracelet from '../../user/assets/cat_bracelets.png';
import catAnklet from '../../user/assets/cat_anklets.png';
import catChain from '../../user/assets/cat_chain_wine.png';

import navGiftWomen from '../../user/assets/nav_gift_women.png';
import navGiftGirls from '../../user/assets/nav_gift_girls.png';
import navGiftMens from '../../user/assets/nav_gift_mens.png';
import navGiftCouple from '../../user/assets/nav_gift_couple.png';
import navGiftKids from '../../user/assets/nav_gift_kids.png';

import navOccasionBirthday from '../../user/assets/nav_occasion_birthday.png';
import navOccasionAnniversary from '../../user/assets/nav_occasion_anniversary.png';
import navOccasionWedding from '../../user/assets/nav_occasion_wedding.png';
import navOccasionMothers from '../../user/assets/nav_occasion_mothers.png';
import navOccasionValentine from '../../user/assets/nav_occasion_valentine.png';
import premiumMenDefault from '../../user/assets/cat_men_nobg.png';
import premiumWomenDefault from '../../user/assets/cat_women_premium_nobg.png';
import premiumFamilyDefault from '../../user/assets/cat_all_nobg.png';
import testimonialCustomer1 from '../../../assets/testimonial_customer_1.png';
import testimonialCustomer2 from '../../../assets/testimonial_customer_2.png';
import testimonialCustomer3 from '../../../assets/testimonial_customer_3.png';

import menHeroDefault from '../../../assets/hero/gold_fusion.png';
import womenHeroDefault from '../../../assets/hero/diamond_luxury.png';
import silverHeroDefault from '../../../assets/hero/silver_minimalist.png';
import familyHeroDefault from '../../../assets/hero/bridal_royal.png';
import menCategoryDefault from '../../../assets/collections/DazzlingRings.png';
import womenCategoryDefault from '../../../assets/women-categories/Rings.png';
import familyCategoryDefault from '../../user/assets/cat_all_premium.png';
import promoPremiumGift from '../../../assets/promos/PremiumGifts.png';
import promoCoupleRings from '../../../assets/promos/CoupleRings.png';
import trendingCuratedCombos from '../../../assets/trending/CuratedCombos.png';
import trendingChainLayering from '../../../assets/trending/ChainLayering.png';

export const PAGE_SECTIONS = [
  { pageKey: 'home', label: 'Home Sections', description: 'Manage the homepage narrative, hero banners, and product storytelling.' },
  { pageKey: 'shop-men', label: 'Shop for Men', description: "Manage the men's landing page banners, categories, and curated merchandising." },
  { pageKey: 'shop-women', label: 'Shop for Women', description: "Manage the women's landing page banners, occasions, and curated product stories." },
  { pageKey: 'shop-family', label: 'Shop for Family', description: 'Manage the family landing page hero, collections, and product merchandising.' }
];

const homeSections = [
  {
    pageKey: 'home',
    sectionKey: 'nav-gifts-for',
    sectionType: 'nav-links',
    label: 'Nav: Gifts For',
    isActive: true,
    sortOrder: 101,
    items: [
      { id: 'women', name: 'Womens', image: navGiftWomen, path: '/shop?filter=womens', tag: '' },
      { id: 'girls', name: 'Girls', image: navGiftGirls, path: '/shop?filter=girls', tag: '' },
      { id: 'mens', name: 'Mens', image: navGiftMens, path: '/shop?filter=mens', tag: '' },
      { id: 'couple', name: 'Couple', image: navGiftCouple, path: '/shop?filter=couple', tag: '' },
      { id: 'kids', name: 'Kids', image: navGiftKids, path: '/shop?filter=kids', tag: '' }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'nav-occasions',
    sectionType: 'nav-links',
    label: 'Nav: Occasions',
    isActive: true,
    sortOrder: 102,
    items: [
      { id: 'birthday', name: 'Birthday', image: navOccasionBirthday, path: '/shop?occasion=birthday', tag: '' },
      { id: 'anniversary', name: 'Anniversary', image: navOccasionAnniversary, path: '/shop?occasion=anniversary', tag: '' },
      { id: 'wedding', name: 'Wedding', image: navOccasionWedding, path: '/shop?occasion=wedding', tag: '' },
      { id: 'mothers-day', name: "Mother's Day", image: navOccasionMothers, path: '/shop?occasion=mothers-day', tag: '' },
      { id: 'valentine', name: 'Valentine Day', image: navOccasionValentine, path: '/shop?occasion=valentine', tag: '' }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'hero-banners',
    sectionType: 'banner',
    label: 'Home Hero Banners',
    isActive: true,
    sortOrder: 0,
    settings: { autoplayMs: 3000 },
    items: [
      { id: 'hero-1', name: 'Luxury Collection', label: 'Eternal Diamond Brilliance', subtitle: 'Masterfully crafted for those who demand the extraordinary.', image: womenHeroDefault, path: '/shop', tag: 'Luxury Collection', ctaLabel: 'Shop Collection' },
      { id: 'hero-2', name: 'Contemporary Luxe', label: 'Modern Gold Fusion', subtitle: 'Minimalist silhouettes elegantly refined in pure 18K gold.', image: menHeroDefault, path: '/shop', tag: 'Contemporary Luxe', ctaLabel: 'Shop Collection' },
      { id: 'hero-3', name: 'Handcrafted Silver', label: 'Sterling Silver Heritage', subtitle: 'Timeless craftsmanship meets modern architectural design.', image: silverHeroDefault, path: '/shop', tag: 'Handcrafted Silver', ctaLabel: 'Shop Collection' },
      { id: 'hero-4', name: 'Bridal Signature', label: 'The Royal Bridal Legacy', subtitle: 'Sacred ornaments for your once-in-a-lifetime journey.', image: familyHeroDefault, path: '/shop', tag: 'Bridal Signature', ctaLabel: 'Shop Collection' }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'premium-category-cards',
    sectionType: 'category-grid',
    label: 'Premium Category Cards',
    isActive: true,
    sortOrder: 0.5,
    items: [
      { id: 'premium-men', name: 'Men', image: premiumMenDefault, path: '/category/men', tag: 'FOR HIM' },
      { id: 'premium-women', name: 'Women', image: premiumWomenDefault, path: '/category/women', tag: 'FOR HER' },
      { id: 'premium-family', name: 'Family', image: premiumFamilyDefault, path: '/category/family', tag: 'FOR EVERYONE' }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'category-showcase',
    sectionType: 'category-grid',
    label: 'Category Showcase',
    isActive: true,
    sortOrder: 1,
    items: [
      { id: 'pendants', name: 'Pendants', image: catPendant, hoverImage: latestNecklace, path: '/category/pendants', tag: '' },
      { id: 'rings', name: 'Rings', image: catRing, hoverImage: latestRing, path: '/category/rings', tag: '' },
      { id: 'earrings', name: 'Earrings', image: catEarrings, hoverImage: latestEarrings, path: '/category/earrings', tag: '' },
      { id: 'bracelets', name: 'Bracelets', image: catBracelet, hoverImage: latestBracelet, path: '/category/bracelets', tag: '' },
      { id: 'anklets', name: 'Anklets', image: catAnklet, hoverImage: newAnklets, path: '/category/anklets', tag: '' },
      { id: 'chains', name: 'Chains', image: catChain, hoverImage: catChain, path: '/category/chains', tag: '' }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'price-range-showcase',
    sectionType: 'promo-grid',
    label: 'Luxury in Range',
    isActive: true,
    sortOrder: 2,
    items: [
      { id: 'under-999', name: 'Under INR 999', priceMax: 999, image: price999, path: '/shop?price_max=999', tag: '' },
      { id: 'under-1999', name: 'Under INR 1999', priceMax: 1999, image: price1999, path: '/shop?price_max=1999', tag: '' },
      { id: 'under-2999', name: 'Under INR 2999', priceMax: 2999, image: price2999, path: '/shop?price_max=2999', tag: '' },
      { id: 'under-3999', name: 'Under INR 3999', priceMax: 3999, image: price3999, path: '/shop?price_max=3999', tag: '' }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'perfect-gift',
    sectionType: 'product-collection',
    label: 'Find the Perfect Gift',
    isActive: true,
    sortOrder: 3,
    items: [
      { id: 'mother', name: 'Mother', image: giftMother, path: '/shop', tag: '', productIds: [] },
      { id: 'friends', name: 'Friends', image: giftFriends, path: '/shop', tag: '', productIds: [] },
      { id: 'wife', name: 'Wife', image: giftWife, path: '/shop', tag: '', productIds: [] },
      { id: 'sister', name: 'Sister', image: giftSister, path: '/shop', tag: '', productIds: [] }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'new-launch',
    sectionType: 'product-collection',
    label: 'Limited Edition',
    isActive: true,
    sortOrder: 4,
    items: [
      { id: 'earrings', name: 'Earrings', image: newEarrings, path: '/shop', tag: '', productIds: [] },
      { id: 'chains', name: 'Chains', image: newChains, path: '/shop', tag: '', productIds: [] },
      { id: 'studs', name: 'Studs', image: newStuds, path: '/shop', tag: '', productIds: [] },
      { id: 'bracelets', name: 'Bracelets', image: newBracelets, path: '/shop', tag: '', productIds: [] },
      { id: 'anklets', name: 'Anklets', image: newAnklets, path: '/shop', tag: '', productIds: [] }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'latest-drop',
    sectionType: 'product-carousel',
    label: 'Latest Drop',
    isActive: true,
    sortOrder: 5,
    items: [
      { id: '1', name: 'Latest Rings', image: latestRing, path: '/shop?sort=latest', tag: '', limit: 12, categoryId: null },
      { id: '2', name: 'Latest Pendants', image: latestNecklace, path: '/shop?sort=latest', tag: '', limit: 12, categoryId: null },
      { id: '3', name: 'Latest Earrings', image: latestEarrings, path: '/shop?sort=latest', tag: '', limit: 12, categoryId: null },
      { id: '4', name: 'Latest Chains', image: latestBracelet, path: '/shop?sort=latest', tag: '', limit: 12, categoryId: null }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'most-gifted',
    sectionType: 'product-carousel',
    label: 'Most Gifted Items',
    isActive: true,
    sortOrder: 6,
    items: [
      { id: '1', name: 'Earrings', image: pinkEarrings, path: '/shop?sort=most-sold', tag: '', limit: 12, categoryId: null },
      { id: '2', name: 'Bracelets', image: pinkBracelets, path: '/shop?sort=most-sold', tag: '', limit: 12, categoryId: null },
      { id: '3', name: 'Chains', image: pinkChains, path: '/shop?sort=most-sold', tag: '', limit: 12, categoryId: null },
      { id: '4', name: 'Anklets', image: pinkAnklets, path: '/shop?sort=most-sold', tag: '', limit: 12, categoryId: null }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'proposal-rings',
    sectionType: 'product-carousel',
    label: 'Proposal Rings',
    isActive: true,
    sortOrder: 7,
    items: [
      { id: 'banner', name: 'Proposal Rings', image: proposalBannerImg, path: '/shop?sort=latest', tag: '', limit: 12, categoryId: null }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'curated-for-you',
    sectionType: 'promo-grid',
    label: 'Curated For You',
    isActive: true,
    sortOrder: 8,
    items: [
      { id: 'haldi', name: 'Haldi', image: haldiImg, path: '/shop?sort=random', tag: '', limit: 12, productIds: [] },
      { id: 'sangeet', name: 'Sangeet', image: sangeetImg, path: '/shop?sort=random', tag: '', limit: 12, productIds: [] },
      { id: 'reception', name: 'Reception', image: receptionImg, path: '/shop?sort=random', tag: '', limit: 12, productIds: [] },
      { id: 'bridal', name: 'Gift for Bride', image: bridalImg, path: '/shop?sort=random', tag: '', limit: 12, productIds: [] },
      { id: 'bridesmaids', name: 'Gift for Bridesmaid', image: bridesmaidImg, path: '/shop?sort=random', tag: '', limit: 12, productIds: [] }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'style-it-your-way',
    sectionType: 'promo-grid',
    label: 'Style It Your Way',
    isActive: true,
    sortOrder: 9,
    items: [
      { id: '1', name: 'Daily Wear', image: bannerDaily, tag: 'Effortless Everyday', extraImages: [prodPendant, prodWineEar, prodAnklet], limit: 12, productIds: [] },
      { id: '2', name: 'Office Wear', image: bannerOffice, tag: 'Professional Chic', extraImages: [prodEarring, prodPendant, prodRing], limit: 12, productIds: [] },
      { id: '3', name: 'Party Wear', image: bannerParty, tag: 'Glamour And Shine', extraImages: [prodWineEar, prodWineRing, prodAnklet], limit: 12, productIds: [] },
      { id: '4', name: 'Casual Wear', image: bannerCasual, tag: 'Relaxed Vibes', extraImages: [prodAnklet, prodBracelet, prodSis], limit: 12, productIds: [] }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'all-jewellery',
    sectionType: 'rich-content',
    label: 'All Jewellery',
    isActive: true,
    sortOrder: 10,
    settings: {
      eyebrow: 'Our Collection',
      title: 'All Jewellery',
      ctaLabel: 'View Full Collection',
      ctaLink: '/shop',
      productLimit: 16
    },
    items: []
  },
  {
    pageKey: 'home',
    sectionKey: 'testimonials',
    sectionType: 'testimonial',
    label: 'Customer Stories',
    isActive: true,
    sortOrder: 11,
    items: [
      {
        id: 'testimonial-1',
        name: 'Ananya Sharma',
        subtitle: 'Verified Buyer',
        image: testimonialCustomer1,
        rating: 5,
        description: "The 925 silver ring I ordered is even more beautiful in person! The craftsmanship is exquisite, and the packaging felt so premium. It's my new favorite piece of jewelry.",
        location: 'Mumbai'
      },
      {
        id: 'testimonial-2',
        name: 'Rahul Verma',
        subtitle: 'Gift Purchase',
        image: testimonialCustomer2,
        rating: 5,
        description: "Bought a bracelet for my sister's birthday. She absolutely loved it! The shine is perfect, and the delivery was very fast. Highly recommend Sands Ornaments for quality silver.",
        location: 'Delhi'
      },
      {
        id: 'testimonial-3',
        name: 'Priya Patel',
        subtitle: 'Regular Customer',
        image: testimonialCustomer3,
        rating: 5,
        description: "I've purchased multiple items now, and they never disappoint. The 'Style It Your Way' collections are so well-curated. Elegant, timeless, and very classy design language.",
        location: 'Bangalore'
      }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'faqs',
    sectionType: 'faq',
    label: 'Frequently Asked Questions',
    isActive: true,
    sortOrder: 14,
    items: [
      {
        id: 'faq-1',
        name: 'Is your jewellery made of real silver?',
        description: 'Yes, all our jewellery is crafted from high-quality 925 Sterling Silver. Each piece comes with a hallmark stamp of authenticity so you can shop with confidence.'
      },
      {
        id: 'faq-2',
        name: 'How do I take care of my silver jewellery?',
        description: 'To keep your silver shining, store it in the provided zip-lock bag when not in use. Avoid direct contact with perfumes, lotions, and harsh chemicals. You can gently clean it with a soft cloth.'
      },
      {
        id: 'faq-3',
        name: 'Do you offer a warranty on the plating?',
        description: 'Absolutely! We offer a 6-month warranty on the gold and rose gold plating of our silver jewellery. If you face any issues, just reach out to us.'
      },
      {
        id: 'faq-4',
        name: 'What is your return and exchange policy?',
        description: 'We offer a hassle-free 7-day return and exchange policy. If you are not completely satisfied with your purchase, you can return it in its original condition within 7 days.'
      }
    ]
  },
  {
    pageKey: 'home',
    sectionKey: 'chit-chat',
    sectionType: 'rich-content',
    label: 'Chit Chat Section',
    isActive: true,
    sortOrder: 13,
    settings: {
      title: "We're Here for You",
      subtitle: "Questions or styling advice? We'd love to hear from you.",
      responseText: 'Replies within 2 hours',
      submitLabel: 'Send Message',
      successMessage: "Thanks for chatting with us! We'll get back to you shortly.",
      logo: sandsLogoDefault
    },
    items: []
  },
  {
    pageKey: 'home',
    sectionKey: 'brand-promises',
    sectionType: 'rich-content',
    label: 'Why Choose Us',
    isActive: true,
    sortOrder: 12,
    items: [
      {
        id: 'promise-1',
        name: 'Pure 925',
        subtitle: 'SILVER',
        description: 'Certified Authenticity',
        iconKey: 'gem'
      },
      {
        id: 'promise-2',
        name: '30-Day Easy',
        subtitle: 'RETURN',
        description: 'Hassle-free Refund',
        iconKey: 'rotate-ccw'
      },
      {
        id: 'promise-3',
        name: 'Free Delivery',
        subtitle: 'ABOVE INR 999',
        description: 'Fast Shipping',
        iconKey: 'truck'
      },
      {
        id: 'promise-4',
        name: 'T&C Apply',
        subtitle: 'SECURE SHOP',
        description: '100% Protection',
        iconKey: 'file-text'
      }
    ]
  }
];

const shopMenSections = [
  {
    pageKey: 'shop-men',
    sectionKey: 'hero-banners',
    sectionType: 'banner',
    label: 'Hero Banners',
    isActive: true,
    sortOrder: 1,
    items: [
      { id: 'men-hero-1', name: 'For Him', label: 'Modern Jewellery for Men', subtitle: 'Clean silhouettes and strong styling for everyday statement looks.', image: menHeroDefault, path: '/shop?filter=mens', tag: 'Shop for Men', ctaLabel: 'Explore Now' }
    ]
  },
  {
    pageKey: 'shop-men',
    sectionKey: 'categories-grid',
    sectionType: 'category-grid',
    label: 'Categories Grid',
    isActive: true,
    sortOrder: 2,
    items: [
      { id: 'men-rings', name: 'Rings', image: menCategoryDefault, path: '/shop?filter=mens' },
      { id: 'men-bracelets', name: 'Bracelets', image: promoPremiumGift, path: '/shop?filter=mens' },
      { id: 'men-chains', name: 'Chains', image: trendingChainLayering, path: '/shop?filter=mens' }
    ]
  },
  {
    pageKey: 'shop-men',
    sectionKey: 'curated-collections',
    sectionType: 'product-collection',
    label: 'Curated Collections',
    isActive: true,
    sortOrder: 3,
    items: []
  },
  {
    pageKey: 'shop-men',
    sectionKey: 'products-listing',
    sectionType: 'product-carousel',
    label: 'Products Listing',
    isActive: true,
    sortOrder: 4,
    items: []
  }
];

const shopWomenSections = [
  {
    pageKey: 'shop-women',
    sectionKey: 'hero-banners',
    sectionType: 'banner',
    label: 'Hero Banners',
    isActive: true,
    sortOrder: 1,
    items: [
      { id: 'women-hero-1', name: 'For Her', label: 'Timeless Elegance for Women', subtitle: 'Discover refined silver and gold pieces for modern femininity.', image: womenHeroDefault, path: '/shop?filter=womens', tag: 'Shop for Women', ctaLabel: 'Explore Now' }
    ]
  },
  {
    pageKey: 'shop-women',
    sectionKey: 'product-categories',
    sectionType: 'category-grid',
    label: 'Product Categories',
    isActive: true,
    sortOrder: 2,
    items: [
      { id: 'women-rings', name: 'Rings', image: womenCategoryDefault, path: '/shop?filter=womens' },
      { id: 'women-earrings', name: 'Earrings', image: pinkEarrings, path: '/shop?filter=womens' },
      { id: 'women-pendants', name: 'Pendants', image: promoCoupleRings, path: '/shop?filter=womens' }
    ]
  },
  {
    pageKey: 'shop-women',
    sectionKey: 'promo-banners',
    sectionType: 'promo-grid',
    label: 'Promo Banners',
    isActive: true,
    sortOrder: 3,
    items: [
      { id: 'women-promo-1', name: 'Personalised', image: promoPremiumGift, path: '/shop?filter=womens', tag: 'Personalised Picks' },
      { id: 'women-promo-2', name: 'Occasion Styling', image: trendingCuratedCombos, path: '/shop?filter=womens', tag: 'Occasion Edit' }
    ]
  },
  {
    pageKey: 'shop-women',
    sectionKey: 'products-listing',
    sectionType: 'product-carousel',
    label: 'Products Listing',
    isActive: true,
    sortOrder: 4,
    items: []
  }
];

const shopFamilySections = [
  {
    pageKey: 'shop-family',
    sectionKey: 'hero-banners',
    sectionType: 'banner',
    label: 'Hero Banners',
    isActive: true,
    sortOrder: 1,
    items: [
      { id: 'family-hero-1', name: 'For Everyone', label: 'Jewellery Stories for the Whole Family', subtitle: 'Giftable collections and timeless pieces for every celebration.', image: familyHeroDefault, path: '/shop', tag: 'Shop for Family', ctaLabel: 'Explore Now' }
    ]
  },
  {
    pageKey: 'shop-family',
    sectionKey: 'collections',
    sectionType: 'category-grid',
    label: 'Collections',
    isActive: true,
    sortOrder: 2,
    items: [
      { id: 'family-gifting', name: 'Gifting', image: familyCategoryDefault, path: '/shop' },
      { id: 'family-combos', name: 'Curated Combos', image: trendingCuratedCombos, path: '/shop' },
      { id: 'family-couple', name: 'Couple Picks', image: promoCoupleRings, path: '/shop' }
    ]
  },
  {
    pageKey: 'shop-family',
    sectionKey: 'products-listing',
    sectionType: 'product-carousel',
    label: 'Products Listing',
    isActive: true,
    sortOrder: 3,
    items: []
  }
];

export const sectionDefaultsByPage = {
  home: homeSections,
  'shop-men': shopMenSections,
  'shop-women': shopWomenSections,
  'shop-family': shopFamilySections
};

export const sectionDefaults = Object.values(sectionDefaultsByPage).flat();

export const getSectionDefaultsForPage = (pageKey) => sectionDefaultsByPage[pageKey] || [];

export const getPageConfig = (pageKey) => PAGE_SECTIONS.find((page) => page.pageKey === pageKey) || PAGE_SECTIONS[0];
