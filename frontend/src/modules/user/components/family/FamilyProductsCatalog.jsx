import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildFamilyShopPath, normalizeFamilyRecipient } from '../../utils/familyNavigation';
import { ShopContext } from '../../../../context/ShopContext';
import ProductCard from '../ProductCard';
import giftMother from '@assets/gift_mother_silver.png';
import giftFather from '@assets/gift_husband_silver.png';
import giftBrother from '@assets/gift_brother_silver.png';
import giftSister from '@assets/gift_sister_silver.png';
import giftHusband from '@assets/gift_husband_silver.png';
import giftWife from '@assets/gift_wife_silver.png';

const defaultRecipientLabels = {
    all: 'All Family Collections',
    mother: 'Mother Collections',
    father: 'Father Collections',
    brother: 'Brother Collections',
    sister: 'Sister Collections',
    husband: 'Husband Collections',
    wife: 'Wife Collections'
};

const FAMILY_TABS = ['all', 'mother', 'father', 'brother', 'sister', 'husband', 'wife'];

const FALLBACK_PRODUCTS = [
    { id: 'f1', recipient: 'mother', name: 'Grace Bloom Silver Pendant for Mother', price: '2,499', originalPrice: '3,699', image: giftMother, rating: 4.7, reviews: 132, badge: "Mother's Pick" },
    { id: 'f2', recipient: 'mother', name: 'Heritage Silver Gift Set for Mother', price: '4,299', originalPrice: '6,299', image: giftMother, rating: 4.9, reviews: 208, badge: 'Limited Edition' },
    { id: 'f3', recipient: 'father', name: 'Classic Crest Silver Ring for Father', price: '3,199', originalPrice: '4,699', image: giftFather, rating: 4.9, reviews: 341, badge: 'Bestseller' },
    { id: 'f4', recipient: 'father', name: 'Signature Link Bracelet for Father', price: '3,899', originalPrice: '5,500', image: giftFather, rating: 4.6, reviews: 79, badge: 'Gift Ready' },
    { id: 'f5', recipient: 'brother', name: 'Bold Chain Bracelet for Brother', price: '2,799', originalPrice: '4,099', image: giftBrother, rating: 4.5, reviews: 55, badge: 'Top Pick' },
    { id: 'f6', recipient: 'brother', name: 'Minimal Silver Ring for Brother', price: '1,999', originalPrice: '3,099', image: giftBrother, rating: 4.8, reviews: 91, badge: 'Essentials' },
    { id: 'f7', recipient: 'sister', name: 'Rose Glow Earrings for Sister', price: '2,199', originalPrice: '3,199', image: giftSister, rating: 4.7, reviews: 114, badge: "Sister's Fave" },
    { id: 'f8', recipient: 'sister', name: 'Heart Charm Pendant for Sister', price: '2,899', originalPrice: '4,099', image: giftSister, rating: 4.8, reviews: 176, badge: 'New Arrival' },
    { id: 'f9', recipient: 'husband', name: 'Modern Silver Band for Husband', price: '3,499', originalPrice: '5,099', image: giftHusband, rating: 4.8, reviews: 124, badge: 'Top Rated' },
    { id: 'f10', recipient: 'husband', name: 'Statement Pendant for Husband', price: '4,099', originalPrice: '5,999', image: giftHusband, rating: 4.6, reviews: 88, badge: 'Premium Pick' },
    { id: 'f11', recipient: 'wife', name: 'Moonlight Silver Necklace for Wife', price: '4,699', originalPrice: '6,899', image: giftWife, rating: 4.9, reviews: 243, badge: 'Most Loved' },
    { id: 'f12', recipient: 'wife', name: 'Sparkle Drop Earrings for Wife', price: '2,599', originalPrice: '3,799', image: giftWife, rating: 4.7, reviews: 167, badge: 'Gift Ready' }
];

const normalizeToken = (value = '') => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeIdValue = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'object') return String(value._id || value.id || '').trim();
    return String(value).trim();
};

const parsePositiveNumber = (value, fallback = 8) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
};

const parseMoney = (value) => Number(String(value || '').replace(/[^0-9.]/g, '')) || 0;

const productCreatedAt = (product = {}) => {
    const ts = product.createdAt || product.updatedAt || '';
    const date = ts ? new Date(ts).getTime() : 0;
    if (date) return date;
    const id = String(product._id || product.id || '');
    return id ? parseInt(id.substring(0, 8), 16) || 0 : 0;
};

const getProductPrice = (product = {}) => {
    const topLevel = [product.finalPrice, product.price, product.originalPrice, product.mrp]
        .map((value) => Number(value))
        .find((value) => Number.isFinite(value) && value > 0);
    if (topLevel) return topLevel;

    const variantPrices = (product.variants || [])
        .map((variant) => Number(variant.finalPrice ?? variant.price ?? variant.mrp ?? 0))
        .filter((value) => Number.isFinite(value) && value > 0);
    if (variantPrices.length > 0) return Math.min(...variantPrices);
    return 0;
};

const getProductOriginalPrice = (product = {}) => {
    const variantMrps = (product.variants || [])
        .map((variant) => Number(variant.mrp ?? variant.originalPrice ?? 0))
        .filter((value) => Number.isFinite(value) && value > 0);
    if (variantMrps.length > 0) return Math.max(...variantMrps);
    const fallback = Number(product.originalPrice ?? product.mrp ?? 0);
    return Number.isFinite(fallback) && fallback > 0 ? fallback : getProductPrice(product);
};

const matchesCategory = (product = {}, categoryId = '') => {
    const target = normalizeToken(categoryId);
    if (!target) return true;
    const categoryTokens = new Set([
        normalizeToken(product.categoryId),
        normalizeToken(product.category),
        normalizeToken(product.categorySlug),
        ...((product.navShopByCategory || []).map((id) => normalizeToken(id)))
    ].filter(Boolean));
    return categoryTokens.has(target);
};

const matchesRecipientAudience = (_product = {}, _recipient = 'all') => {
    // Legacy "navGiftsFor/navOccasions" tags are retired. Family tabs are driven by CMS
    // category selection (or manual pinned products), so we no longer filter by audience tags.
    return true;
};

const toFallbackProductCard = (product) => {
    const price = parseMoney(product.price);
    const originalPrice = parseMoney(product.originalPrice);
    return {
        id: product.id,
        _id: product.id,
        name: product.name,
        image: product.image,
        price,
        originalPrice,
        rating: product.rating,
        reviews: product.reviews,
        isTrending: String(product.badge || '').toLowerCase().includes('bestseller'),
        priceDrop: originalPrice > price,
        variants: [{ id: `${product.id}-v1`, price, mrp: originalPrice }]
    };
};

const toProductCard = (product) => {
    const id = product.id || product._id;
    const price = getProductPrice(product);
    const originalPrice = getProductOriginalPrice(product);
    return {
        ...product,
        id,
        _id: id,
        image: product.image || product.images?.[0] || '',
        price,
        originalPrice,
        rating: Number(product.rating || 4.5),
        reviews: Number(product.reviews || product.reviewCount || 0),
        isTrending: false,
        priceDrop: originalPrice > price,
        variants: Array.isArray(product.variants) && product.variants.length > 0
            ? product.variants
            : [{ id: `${id}-v1`, price, mrp: originalPrice }]
    };
};

const defaultTabConfig = (tabKey = 'all') => ({
    tabLabel: defaultRecipientLabels[tabKey] || defaultRecipientLabels.all,
    productLimit: 8,
    sourceMode: 'category',
    categoryId: '',
    productIds: []
});

const FamilyProductsCatalog = ({
    selectedRecipient = 'all',
    onSelectRecipient,
    allowedProductIds = null,
    minPrice = null,
    maxPrice = null,
    titleOverride = null,
    eyebrowOverride = null,
    subtitleOverride = null,
    hideRecipientFilters = false,
    sectionData = null
}) => {
    const navigate = useNavigate();
    const { products } = useContext(ShopContext);

    const resolvedSettings = useMemo(() => {
        const settings = sectionData?.settings || {};
        const rawTabConfigs = settings.tabConfigs || {};
        const legacyGlobalLimit = parsePositiveNumber(settings.productLimit, 8);
        const tabConfigs = FAMILY_TABS.reduce((acc, key) => {
            const source = rawTabConfigs[key] || {};
            acc[key] = {
                tabLabel: String(source.tabLabel || defaultRecipientLabels[key] || '').trim() || defaultRecipientLabels[key],
                productLimit: parsePositiveNumber(source.productLimit, legacyGlobalLimit),
                sourceMode: source.sourceMode === 'manual' ? 'manual' : 'category',
                categoryId: String(source.categoryId || '').trim(),
                productIds: Array.isArray(source.productIds) ? source.productIds.map((id) => String(id)).filter(Boolean) : []
            };
            return acc;
        }, {});

        const manualIdsFromItems = {};
        (Array.isArray(sectionData?.items) ? sectionData.items : []).forEach((item) => {
            const tabKey = String(item?.recipient || item?.relationKey || 'all').trim().toLowerCase();
            if (!FAMILY_TABS.includes(tabKey)) return;
            const ids = [];
            const primaryId = normalizeIdValue(item?.productId);
            if (primaryId) ids.push(primaryId);
            if (Array.isArray(item?.productIds)) {
                ids.push(...item.productIds.map((id) => normalizeIdValue(id)).filter(Boolean));
            }
            if (ids.length === 0) return;
            manualIdsFromItems[tabKey] = [...new Set([...(manualIdsFromItems[tabKey] || []), ...ids])];
        });

        FAMILY_TABS.forEach((tabKey) => {
            if (tabConfigs[tabKey].sourceMode === 'manual') {
                tabConfigs[tabKey].productIds = [...new Set([...(tabConfigs[tabKey].productIds || []), ...(manualIdsFromItems[tabKey] || [])])];
            }
        });

        return {
            title: String(settings.title || 'All Family Collections').trim() || 'All Family Collections',
            highlightWord: String(settings.highlightWord || 'Edit').trim() || 'Edit',
            subtitle: String(settings.subtitle || '"Curated boutique jewellery picks for every family member."').trim()
                || '"Curated boutique jewellery picks for every family member."',
            ctaLabel: String(settings.ctaLabel || 'View All Collections').trim() || 'View All Collections',
            tabConfigs
        };
    }, [sectionData]);

    const productsList = Array.isArray(products) && products.length > 0 ? products : [];
    const sortedProducts = useMemo(() => [...productsList].sort((a, b) => productCreatedAt(b) - productCreatedAt(a)), [productsList]);

    const effectiveTab = useMemo(() => (
        FAMILY_TABS.includes(selectedRecipient) ? selectedRecipient : 'all'
    ), [selectedRecipient]);

    const activeTabConfig = resolvedSettings.tabConfigs[effectiveTab] || defaultTabConfig(effectiveTab);
    const allTabConfig = resolvedSettings.tabConfigs.all || defaultTabConfig('all');
    const runtimeTabConfig = (
        activeTabConfig.sourceMode === 'category' && !activeTabConfig.categoryId && effectiveTab !== 'all'
    ) ? allTabConfig : activeTabConfig;
    const runtimeLimit = parsePositiveNumber(runtimeTabConfig.productLimit, 8);
    const runtimeLabels = FAMILY_TABS.reduce((acc, tabKey) => {
        acc[tabKey] = resolvedSettings.tabConfigs?.[tabKey]?.tabLabel || defaultRecipientLabels[tabKey];
        return acc;
    }, {});

    const visibleProductCards = useMemo(() => {
        if (sortedProducts.length === 0) {
            const fallbackVisible = FALLBACK_PRODUCTS.filter((product) => (
                effectiveTab === 'all' || product.recipient === effectiveTab
            ));
            return fallbackVisible.map(toFallbackProductCard);
        }

        let selected = [];
        if (runtimeTabConfig.sourceMode === 'manual') {
            const pinnedMap = new Map(sortedProducts.map((product) => [String(product.id || product._id), product]));
            selected = (runtimeTabConfig.productIds || [])
                .map((id) => pinnedMap.get(String(id)))
                .filter(Boolean)
                .map(toProductCard);
        } else {
            const categoryFiltered = runtimeTabConfig.categoryId
                ? sortedProducts.filter((product) => matchesCategory(product, runtimeTabConfig.categoryId))
                : sortedProducts;

            const recipientFiltered = categoryFiltered.filter((product) => matchesRecipientAudience(product, effectiveTab));
            const withFallback = recipientFiltered.length > 0 ? recipientFiltered : categoryFiltered;
            selected = withFallback.map(toProductCard);
        }

        const allowedIds = Array.isArray(allowedProductIds) ? allowedProductIds.map((id) => String(id)) : null;
        if (allowedIds && allowedIds.length > 0) {
            const filtered = selected.filter((product) => allowedIds.includes(String(product.id || product._id)));
            if (filtered.length > 0) selected = filtered;
        }

        selected = selected.filter((product) => {
            const price = Number(product.price || 0);
            const matchesMin = minPrice === null || Number.isNaN(minPrice) || price >= minPrice;
            const matchesMax = maxPrice === null || Number.isNaN(maxPrice) || price <= maxPrice;
            return matchesMin && matchesMax;
        });

        return selected.slice(0, runtimeLimit);
    }, [
        allowedProductIds,
        effectiveTab,
        maxPrice,
        minPrice,
        runtimeLimit,
        runtimeTabConfig,
        sortedProducts
    ]);

    const handleSelectRecipient = (recipientId) => {
        const normalizedRecipient = normalizeFamilyRecipient(recipientId);
        onSelectRecipient?.(normalizedRecipient);
        navigate(buildFamilyShopPath({ recipient: normalizedRecipient }));
    };

    const PINK_LIGHT = '#FFD9E0';
    const MAROON = '#8E2B45';

    if (visibleProductCards.length === 0) return null;

    return (
        <section id="family-products" className="py-3 md:py-10 bg-white">
            <div className="container mx-auto px-4 md:px-12 max-w-[1500px]">
                <div className="text-center mb-4 md:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-none mb-2"
                        style={{ background: PINK_LIGHT, border: `1px solid ${MAROON}22` }}
                    >
                        <Gift className="w-3.5 h-3.5" style={{ color: MAROON }} />
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: MAROON }}>
                            For Family
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-xl sm:text-3xl md:text-4xl font-serif text-[#2D060F] tracking-tight mb-1"
                    >
                        {(titleOverride || runtimeLabels[effectiveTab] || resolvedSettings.title)}{' '}
                        <span className="italic" style={{ color: MAROON }}>
                            {eyebrowOverride || resolvedSettings.highlightWord}
                        </span>
                    </motion.h2>

                    <p className="text-[10px] md:text-xs text-zinc-500 max-w-xl mx-auto italic">
                        {subtitleOverride || resolvedSettings.subtitle}
                    </p>
                    <div className="w-10 h-[1px] mx-auto mt-2.5 md:mt-5" style={{ background: PINK_LIGHT }} />
                </div>

                {!hideRecipientFilters && (
                    <div className="grid grid-cols-2 gap-2 max-w-[560px] mx-auto md:flex md:flex-wrap md:justify-center md:gap-3 mb-4 md:mb-10">
                        {Object.entries(runtimeLabels).map(([recipientId, label], index, entries) => {
                            const isActive = recipientId === effectiveTab;
                            const isLastOdd = entries.length % 2 === 1 && index === entries.length - 1;
                            return (
                                <button
                                    key={recipientId}
                                    type="button"
                                    onClick={() => handleSelectRecipient(recipientId)}
                                    className={`w-full md:w-auto px-3 py-1.5 md:px-4 md:py-2 rounded-none text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-all border leading-none ${isLastOdd ? 'col-span-2' : ''}`}
                                    style={{
                                        background: isActive ? PINK_LIGHT : '#fff',
                                        color: isActive ? MAROON : '#444',
                                        borderColor: isActive ? PINK_LIGHT : '#eee'
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {visibleProductCards.map((product, idx) => (
                        <motion.div
                            key={product.id || product._id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: (idx % 4) * 0.1 }}
                            className="group relative"
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 md:mt-12 text-center">
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={() => handleSelectRecipient('all')}
                        className="px-8 py-3 md:px-10 md:py-3.5 rounded-none font-bold uppercase tracking-widest text-[10px] transition-all shadow-md hover:shadow-lg"
                        style={{ background: PINK_LIGHT, color: MAROON }}
                    >
                        {resolvedSettings.ctaLabel}
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default FamilyProductsCatalog;
