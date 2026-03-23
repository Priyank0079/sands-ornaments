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

import catPendant from '../../user/assets/cat_pendant_wine.png';
import catRing from '../../user/assets/cat_ring_wine.png';
import catEarrings from '../../user/assets/cat_earrings_wine.png';
import catBracelet from '../../user/assets/cat_bracelet_wine.png';
import catAnklet from '../../user/assets/cat_anklet_wine.png';
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

export const sectionDefaults = [
  {
    sectionId: 'nav-gifts-for',
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
    sectionId: 'nav-occasions',
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
    sectionId: 'category-showcase',
    label: 'Category Showcase',
    isActive: true,
    sortOrder: 1,
    items: [
      { id: 'pendants', name: 'Pendants', image: catPendant, path: '/category/pendants', tag: '' },
      { id: 'rings', name: 'Rings', image: catRing, path: '/category/rings', tag: '' },
      { id: 'earrings', name: 'Earrings', image: catEarrings, path: '/category/earrings', tag: '' },
      { id: 'bracelets', name: 'Bracelets', image: catBracelet, path: '/category/bracelets', tag: '' },
      { id: 'anklets', name: 'Anklets', image: catAnklet, path: '/category/anklets', tag: '' },
      { id: 'chains', name: 'Chains', image: catChain, path: '/category/chains', tag: '' }
    ]
  },
  {
    sectionId: 'price-range-showcase',
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
    sectionId: 'perfect-gift',
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
    sectionId: 'new-launch',
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
    sectionId: 'latest-drop',
    label: 'Latest Drop',
    isActive: true,
    sortOrder: 5,
    items: [
      { id: '1', name: 'Midnight Silver Ring', price: 'INR 2499', image: latestRing, path: '/product/midnight-ring', tag: '' },
      { id: '2', name: 'Lunar Pendant', price: 'INR 4999', image: latestNecklace, path: '/product/lunar-pendant', tag: '' },
      { id: '3', name: 'Noir Drop Earrings', price: 'INR 3299', image: latestEarrings, path: '/product/noir-earrings', tag: '' },
      { id: '4', name: 'Obsidian Chain', price: 'INR 5999', image: latestBracelet, path: '/product/obsidian-chain', tag: '' }
    ]
  },
  {
    sectionId: 'most-gifted',
    label: 'Most Gifted Items',
    isActive: true,
    sortOrder: 6,
    items: [
      { id: '1', name: 'Earrings', image: pinkEarrings, path: '/shop?category=earrings', tag: '' },
      { id: '2', name: 'Bracelets', image: pinkBracelets, path: '/shop?category=bracelets', tag: '' },
      { id: '3', name: 'Chains', image: pinkChains, path: '/shop?category=chains', tag: '' },
      { id: '4', name: 'Anklets', image: pinkAnklets, path: '/shop?category=anklets', tag: '' }
    ]
  },
  {
    sectionId: 'proposal-rings',
    label: 'Proposal Rings',
    isActive: true,
    sortOrder: 7,
    items: [
      { id: 'banner', name: 'Proposal Rings', image: proposalBannerImg, path: '/category/rings', tag: '' }
    ]
  },
  {
    sectionId: 'curated-for-you',
    label: 'Curated For You',
    isActive: true,
    sortOrder: 8,
    items: [
      { id: 'haldi', name: 'Haldi', image: haldiImg, path: '/category/haldi', tag: '' },
      { id: 'sangeet', name: 'Sangeet', image: sangeetImg, path: '/category/sangeet', tag: '' },
      { id: 'reception', name: 'Reception', image: receptionImg, path: '/category/reception', tag: '' },
      { id: 'bridal', name: 'Gift for Bride', image: bridalImg, path: '/category/bridal', tag: '' },
      { id: 'bridesmaids', name: 'Gift for Bridesmaid', image: bridesmaidImg, path: '/category/bridesmaids', tag: '' }
    ]
  },
  {
    sectionId: 'style-it-your-way',
    label: 'Style It Your Way',
    isActive: true,
    sortOrder: 9,
    items: [
      { id: '1', name: 'Daily Wear', image: bannerDaily, tag: 'Effortless Everyday', extraImages: [prodPendant, prodWineEar, prodAnklet] },
      { id: '2', name: 'Office Wear', image: bannerOffice, tag: 'Professional Chic', extraImages: [prodEarring, prodPendant, prodRing] },
      { id: '3', name: 'Party Wear', image: bannerParty, tag: 'Glamour And Shine', extraImages: [prodWineEar, prodWineRing, prodAnklet] },
      { id: '4', name: 'Casual Wear', image: bannerCasual, tag: 'Relaxed Vibes', extraImages: [prodAnklet, prodBracelet, prodSis] }
    ]
  }
];
