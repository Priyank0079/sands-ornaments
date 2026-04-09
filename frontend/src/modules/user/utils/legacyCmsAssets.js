import catPendantWine from '../assets/cat_pendant_wine.png';
import catRingWine from '../assets/cat_ring_wine.png';
import catEarringsWine from '../assets/cat_earrings_wine.png';
import catBraceletWine from '../assets/cat_bracelet_wine.png';
import catAnkletWine from '../assets/cat_anklet_wine.png';
import catChainWine from '../assets/cat_chain_wine.png';
import price999 from '../assets/price_under_999.png';
import price1999 from '../assets/price_under_1999.png';
import price2999 from '../assets/price_under_2999.png';
import price3999 from '../assets/price_under_3999.png';
import giftMother from '../assets/gift_mother_silver.png';
import giftFriends from '../assets/gift_friends_silver.png';
import giftWife from '../assets/gift_wife_silver.png';
import giftSister from '../assets/gift_sister_silver.png';
import newEarrings from '../assets/new_launch_earrings.png';
import newChains from '../assets/new_launch_chains.png';
import newStuds from '../assets/new_launch_studs.png';
import newBracelets from '../assets/new_launch_bracelets.png';
import newAnklets from '../assets/new_launch_anklets.png';
import latestRing from '../assets/latest_drop_ring.png';
import latestNecklace from '../assets/latest_drop_necklace.png';
import latestEarrings from '../assets/latest_drop_earrings.png';
import latestBracelet from '../assets/latest_drop_bracelet.png';
import pinkBracelets from '../assets/pink_bracelets_1767775488371.png';
import pinkEarrings from '../assets/pink_earrings_1767775466166.png';
import pinkChains from '../assets/pink_chains_1767775516641.png';
import pinkAnklets from '../assets/pink_anklets_1767775536388.png';
import proposalBanner from '../assets/proposal_banner.png';
import haldi from '../assets/haldi.png';
import sangeet from '../assets/sangeet.png';
import reception from '../assets/reception.png';
import bridal from '../assets/bridal.png';
import bridesmaid from '../assets/hero_slide_3.png';
import bannerDaily from '../assets/banner_daily.png';
import bannerOffice from '../assets/banner_office.png';
import bannerParty from '../assets/banner_party.png';
import trendingHeritage from '../assets/trending_heritage.png';
import sandsLogo from '../assets/sands-logo.png';
import catPendant from '../assets/cat_pendant.png';
import silverEarringsProduct from '../assets/silver_earrings_product.png';
import silverBraceletProduct from '../assets/silver_bracelet_product.png';
import catAnklets from '../assets/cat_anklets.png';
import navGiftWomen from '../assets/nav_gift_women.png';
import navGiftGirls from '../assets/nav_gift_girls.png';
import navGiftMens from '../assets/nav_gift_mens.png';
import navGiftCouple from '../assets/nav_gift_couple.png';
import navGiftKids from '../assets/nav_gift_kids.png';
import navOccasionBirthday from '../assets/nav_occasion_birthday.png';
import navOccasionAnniversary from '../assets/nav_occasion_anniversary.png';
import navOccasionWedding from '../assets/nav_occasion_wedding.png';
import navOccasionMothers from '../assets/nav_occasion_mothers.png';
import navOccasionValentine from '../assets/nav_occasion_valentine.png';

const legacyAssetMap = {
  'cat_pendant_wine.png': catPendantWine,
  'cat_ring_wine.png': catRingWine,
  'cat_earrings_wine.png': catEarringsWine,
  'cat_bracelet_wine.png': catBraceletWine,
  'cat_anklet_wine.png': catAnkletWine,
  'cat_chain_wine.png': catChainWine,
  'price_under_999.png': price999,
  'price_under_1999.png': price1999,
  'price_under_2999.png': price2999,
  'price_under_3999.png': price3999,
  'gift_mother_silver.png': giftMother,
  'gift_friends_silver.png': giftFriends,
  'gift_wife_silver.png': giftWife,
  'gift_sister_silver.png': giftSister,
  'new_launch_earrings.png': newEarrings,
  'new_launch_chains.png': newChains,
  'new_launch_studs.png': newStuds,
  'new_launch_bracelets.png': newBracelets,
  'new_launch_anklets.png': newAnklets,
  'latest_drop_ring.png': latestRing,
  'latest_drop_necklace.png': latestNecklace,
  'latest_drop_earrings.png': latestEarrings,
  'latest_drop_bracelet.png': latestBracelet,
  'pink_bracelets_1767775488371.png': pinkBracelets,
  'pink_earrings_1767775466166.png': pinkEarrings,
  'pink_chains_1767775516641.png': pinkChains,
  'pink_anklets_1767775536388.png': pinkAnklets,
  'proposal_banner.png': proposalBanner,
  'haldi.png': haldi,
  'sangeet.png': sangeet,
  'reception.png': reception,
  'bridal.png': bridal,
  'hero_slide_3.png': bridesmaid,
  'banner_daily.png': bannerDaily,
  'banner_office.png': bannerOffice,
  'banner_party.png': bannerParty,
  'trending_heritage.png': trendingHeritage,
  'sands-logo.png': sandsLogo,
  'cat_pendant.png': catPendant,
  'silver_earrings_product.png': silverEarringsProduct,
  'silver_bracelet_product.png': silverBraceletProduct,
  'cat_anklets.png': catAnklets,
  'nav_gift_women.png': navGiftWomen,
  'nav_gift_girls.png': navGiftGirls,
  'nav_gift_mens.png': navGiftMens,
  'nav_gift_couple.png': navGiftCouple,
  'nav_gift_kids.png': navGiftKids,
  'nav_occasion_birthday.png': navOccasionBirthday,
  'nav_occasion_anniversary.png': navOccasionAnniversary,
  'nav_occasion_wedding.png': navOccasionWedding,
  'nav_occasion_mothers.png': navOccasionMothers,
  'nav_occasion_valentine.png': navOccasionValentine
};

export const resolveLegacyCmsAsset = (value, fallback = '') => {
  const source = String(value || '').trim();
  if (!source) return fallback;
  const parts = source.split('/');
  const fileName = parts[parts.length - 1];
  return legacyAssetMap[fileName] || source || fallback;
};
