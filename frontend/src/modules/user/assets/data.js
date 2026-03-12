import catRings from './cat_rings.png';
import catEarrings from './cat_earrings.png';
import catPendant from './cat_pendant.png';
import catBracelets from './cat_bracelets.png';
import catAnklets from './cat_anklets.png';
import trendingHeritage from './trending_heritage.png';
import trendingModern from './trending_modern.png';
import prodRingMain from './prod_ring_main.png';
import prodEarringsMain from './prod_earrings_main.png';
import spotlightMain from './spotlight_silver_main.png';
import spotlightHover from './spotlight_silver_hover.png';

export const categories = [
    {
        id: 1,
        name: "Rings",
        path: "rings",
        image: catRings,
        subcategories: [
            { name: "Solitaire", image: prodRingMain },
            { name: "Engagement", image: catRings },
            { name: "Silver Bands", image: catRings },
            { name: "Gemstone", image: spotlightMain }
        ]
    },
    {
        id: 2,
        name: "Earrings",
        path: "earrings",
        image: catEarrings,
        subcategories: [
            { name: "Jhumkas", image: trendingHeritage },
            { name: "Hoops", image: catEarrings },
            { name: "Drops", image: prodEarringsMain }
        ]
    },
    {
        id: 4,
        name: "Chain Pendant",
        path: "chain-pendant",
        image: catPendant,
        subcategories: [
            { name: "Minimal", image: catPendant },
            { name: "Layered", image: trendingModern }
        ]
    },
    {
        id: 7,
        name: "Bracelets",
        path: "bracelets",
        image: catBracelets,
        subcategories: [
            { name: "Cuffs", image: trendingModern },
            { name: "Charms", image: catBracelets },
            { name: "Bangles", image: catBracelets }
        ]
    },
    {
        id: 8,
        name: "Anklets",
        path: "anklets",
        image: catAnklets,
        subcategories: [
            { name: "Silver", image: catAnklets },
            { name: "Beaded", image: catAnklets }
        ]
    },
    {
        id: 9,
        name: "Toe Rings",
        path: "toe-rings",
        image: catAnklets,
        subcategories: [
            { name: "Plain", image: catAnklets },
            { name: "Stone", image: catAnklets }
        ]
    },
    {
        id: 3,
        name: "Studs",
        path: "studs",
        image: catEarrings,
        subcategories: [
            { name: "Silver Studs", image: catEarrings },
            { name: "Stone Studs", image: prodEarringsMain }
        ]
    },
    {
        id: 5,
        name: "Pendants",
        path: "pendants",
        image: trendingHeritage,
        subcategories: [
            { name: "Religious", image: spotlightMain },
            { name: "Modern", image: spotlightHover }
        ]
    },
    {
        id: 6,
        name: "Chains",
        path: "chains",
        image: trendingModern,
        subcategories: [
            { name: "Thick", image: trendingHeritage },
            { name: "Thin", image: catPendant }
        ]
    }
];

export const products = [
    {
        id: 1,
        name: "Sterling Silver Solitaire Ring",
        category: "Rings",
        price: 2499,
        originalPrice: 4999,
        image: prodRingMain,
        images: [prodRingMain, catRings, spotlightMain, spotlightHover],
        rating: 4.5,
        reviews: 120,
        isNew: true,
        stylingTips: "<p><strong>Office Chic:</strong> Pair this ring with a crisp white shirt and tailored trousers for a sophisticated work look.</p><p><strong>Evening Glam:</strong> Stack it with other silver bands to create a statement piece for your night out.</p>"
    },
    {
        id: 2,
        name: "Silver Hoop Earrings",
        category: "Earrings",
        price: 1899,
        originalPrice: 3500,
        image: catEarrings,
        rating: 4.8,
        reviews: 85,
        isNew: false
    },
    {
        id: 3,
        name: "Silver Layered Necklace",
        category: "Necklaces",
        price: 5999,
        originalPrice: 8999,
        image: trendingModern,
        rating: 4.2,
        reviews: 45,
        isNew: true
    },
    {
        id: 4,
        name: "Minimalist Silver Bracelet",
        category: "Bracelets",
        price: 3200,
        originalPrice: 4500,
        image: catBracelets,
        rating: 4.6,
        reviews: 200,
        isNew: false
    },
    {
        id: 5,
        name: "Antique Silver Anklet",
        category: "Anklets",
        price: 1500,
        originalPrice: 2200,
        image: catAnklets,
        rating: 4.3,
        reviews: 60,
        isNew: false
    },
    {
        id: 6,
        name: "Gemstone Pendant",
        category: "Pendants",
        price: 2100,
        originalPrice: 3000,
        image: spotlightMain,
        rating: 4.7,
        reviews: 95,
        isNew: true
    },
    // Adding more mock products to reach 32
    { id: 7, name: "Floral Silver Studs", category: "Earrings", price: 1200, originalPrice: 1800, image: prodEarringsMain, rating: 4.9, reviews: 150, isNew: true },
    { id: 8, name: "Intricate Boho Ring", category: "Rings", price: 3500, originalPrice: 5000, image: trendingHeritage, rating: 4.6, reviews: 80, isNew: false },
    { id: 9, name: "Classic Silver Chain", category: "Chains", price: 2800, originalPrice: 4000, image: catPendant, rating: 4.4, reviews: 210, isNew: false },
    { id: 10, name: "Sleek Silver Cuff", category: "Bracelets", price: 4200, originalPrice: 6000, image: spotlightHover, rating: 4.8, reviews: 55, isNew: true },
    { id: 11, name: "Ethnic Silver Jhumkas", category: "Earrings", price: 2999, originalPrice: 4500, image: trendingHeritage, rating: 4.5, reviews: 110, isNew: false },
    { id: 12, name: "Designer Silver Band", category: "Rings", price: 1800, originalPrice: 2500, image: catRings, rating: 4.7, reviews: 90, isNew: true },
    { id: 13, name: "Pearl Drop Earrings", category: "Earrings", price: 2200, originalPrice: 3200, image: prodEarringsMain, rating: 4.6, reviews: 75, isNew: false },
    { id: 14, name: "Silver Charm Bracelet", category: "Bracelets", price: 3800, originalPrice: 5500, image: catBracelets, rating: 4.3, reviews: 130, isNew: true },
    { id: 15, name: "Beaded Silver Anklet", category: "Anklets", price: 1200, originalPrice: 1800, image: catAnklets, rating: 4.9, reviews: 40, isNew: false },
    { id: 16, name: "Moonlight Silver Pendant", category: "Pendants", price: 2600, originalPrice: 3800, image: spotlightMain, rating: 4.2, reviews: 65, isNew: false },
    { id: 17, name: "Statement Silver Necklace", category: "Necklaces", price: 7500, originalPrice: 9999, image: trendingModern, rating: 4.8, reviews: 30, isNew: true },
    { id: 18, name: "Silver Toe Rings (Set of 2)", category: "Toe Rings", price: 850, originalPrice: 1200, image: catAnklets, rating: 4.4, reviews: 180, isNew: false },
    { id: 19, name: "Vintage Floral Ring", category: "Rings", price: 3200, originalPrice: 4800, image: prodRingMain, rating: 4.7, reviews: 115, isNew: false },
    { id: 20, name: "Rose Sparkle Earrings", category: "Earrings", price: 2600, originalPrice: 3900, image: catEarrings, rating: 4.5, reviews: 50, isNew: true },
    { id: 21, name: "Modern Silver Bangle", category: "Bracelets", price: 4800, originalPrice: 6500, image: catBracelets, rating: 4.6, reviews: 140, isNew: false },
    { id: 22, name: "Geometric Silver Pendant", category: "Pendants", price: 1999, originalPrice: 2800, image: spotlightHover, rating: 4.3, reviews: 105, isNew: true },
    { id: 23, name: "Oxidized Silver Jhumkas", category: "Earrings", price: 1599, originalPrice: 2400, image: trendingHeritage, rating: 4.9, reviews: 220, isNew: false },
    { id: 24, name: "Silver Infinity Ring", category: "Rings", price: 1400, originalPrice: 2100, image: catRings, rating: 4.2, reviews: 70, isNew: true },
    { id: 25, name: "Layered Silver Chain", category: "Chains", price: 3500, originalPrice: 5200, image: catPendant, rating: 4.7, reviews: 85, isNew: false },
    { id: 26, name: "Delicate Flower Anklet", category: "Anklets", price: 1800, originalPrice: 2600, image: catAnklets, rating: 4.8, reviews: 95, isNew: true },
    { id: 27, name: "Silver Leaf Studs", category: "Earrings", price: 999, originalPrice: 1500, image: prodEarringsMain, rating: 4.5, reviews: 160, isNew: false },
    { id: 28, name: "Royal Silver Necklace", category: "Necklaces", price: 8900, originalPrice: 12000, image: trendingHeritage, rating: 4.6, reviews: 25, isNew: true },
    { id: 29, name: "Abstract Silver Band", category: "Rings", price: 2100, originalPrice: 3100, image: spotlightMain, rating: 4.4, reviews: 135, isNew: false },
    { id: 30, name: "Braided Silver Bracelet", category: "Bracelets", price: 3400, originalPrice: 4900, image: catBracelets, rating: 4.7, reviews: 110, isNew: true },
    { id: 31, name: "Silver Coin Pendant", category: "Pendants", price: 1800, originalPrice: 2500, image: catPendant, rating: 4.3, reviews: 80, isNew: false },
    { id: 32, name: "Heart Charm Earrings", category: "Earrings", price: 1400, originalPrice: 2000, image: catEarrings, rating: 4.8, reviews: 190, isNew: true }
];

export const banners = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1600",
        title: "Elegant Silver Collection",
        subtitle: "Up to 40% Off on New Arrivals"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1600",
        title: "Timeless Rings",
        subtitle: "Discover the perfect symbol of love"
    }
];
