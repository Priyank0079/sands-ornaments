// Asset Imports for Collection Mock Data
import prod1 from '../assets/cat_pendant_wine.png';
import prod2 from '../assets/cat_ring_wine.png';
import prod3 from '../assets/cat_bracelet_wine.png';
import prod4 from '../assets/cat_earrings_wine.png';
import prod5 from '../assets/latest_drop_necklace.png';
import prod6 from '../assets/latest_drop_ring.png';
import prod7 from '../assets/latest_drop_bracelet.png';
import prod8 from '../assets/latest_drop_earrings.png';
import prod9 from '../assets/new_launch_chains.png';
import prod10 from '../assets/cat_rings.png';
import prod11 from '../assets/new_launch_bracelets.png';
import prod12 from '../assets/new_launch_earrings.png';
import prod13 from '../assets/pink_chains_1767775516641.png';
import prod14 from '../assets/prod_ring_main.png';
import prod15 from '../assets/pink_bracelets_1767775488371.png';
import prod16 from '../assets/pink_earrings_1767775466166.png';
import prod17 from '../assets/silver_chain_product.png';
import prod18 from '../assets/prod_ring_main.png';
import prod19 from '../assets/silver_bracelet_product.png';
import prod20 from '../assets/silver_earrings_product.png';
import prod21 from '../assets/silver_anklet_product.png';
import prod22 from '../assets/new_launch_anklets.png';
import prod23 from '../assets/cat_anklets.png';
import prod24 from '../assets/cat_anklet_wine.png';

export const COLLECTION_MOCK_PRODUCTS = {
    '24k': [
        { id: 'm1', name: 'Royal Gold Haram', price: 145000, img: prod1, metal: 'Gold', purity: '24K' },
        { id: 'm2', name: 'Temple Gold Ring', price: 42000, img: prod2, metal: 'Gold', purity: '24K' },
        { id: 'm3', name: 'Gold Kada Bangle', price: 89000, img: prod3, metal: 'Gold', purity: '24K' },
        { id: 'm4', name: 'Traditional Jhumka', price: 58000, img: prod4, metal: 'Gold', purity: '24K' },
    ],
    '22k': [
        { id: 'm5', name: 'Daily Gold Chain', price: 28000, img: prod5, metal: 'Gold', purity: '22K' },
        { id: 'm6', name: 'Simple Gold Band', price: 12000, img: prod6, metal: 'Gold', purity: '22K' },
        { id: 'm7', name: 'Solid Gold Kada', price: 65000, img: prod7, metal: 'Gold', purity: '22K' },
        { id: 'm8', name: 'Floral Gold Studs', price: 8500, img: prod8, metal: 'Gold', purity: '22K' },
    ],
    '18k': [
        { id: 'm9', name: 'Modern Gold Choker', price: 32000, img: prod9, metal: 'Gold', purity: '18K' },
        { id: 'm10', name: 'Diamond Set Ring', price: 75000, img: prod10, metal: 'Gold', purity: '18K' },
        { id: 'm11', name: 'Sleek Gold Cuff', price: 24000, img: prod11, metal: 'Gold', purity: '18K' },
        { id: 'm12', name: 'Drop Earrings', price: 18000, img: prod12, metal: 'Gold', purity: '18K' },
    ],
    '14k': [
        { id: 'm13', name: 'Rose Gold Chain', price: 15000, img: prod13, metal: 'Gold', purity: '14K' },
        { id: 'm14', name: 'Eternity Ring', price: 22000, img: prod14, metal: 'Gold', purity: '14K' },
        { id: 'm15', name: 'Dainty Bracelet', price: 9500, img: prod15, metal: 'Gold', purity: '14K' },
        { id: 'm16', name: 'Heart Studs', price: 4500, img: prod16, metal: 'Gold', purity: '14K' },
    ],
    'sterling': [
        { id: 'm17', name: 'Sterling Rope Chain', price: 3500, img: prod17, metal: 'Silver', purity: 'Sterling' },
        { id: 'm18', name: 'Silver Signet Ring', price: 1800, img: prod18, metal: 'Silver', purity: 'Sterling' },
        { id: 'm19', name: 'Charm Bracelet', price: 2900, img: prod19, metal: 'Silver', purity: 'Sterling' },
        { id: 'm20', name: 'Oxidized Earrings', price: 1200, img: prod20, metal: 'Silver', purity: 'Sterling' },
    ],
    'pure': [
        { id: 'm21', name: 'Pure Silver Payal', price: 4500, img: prod21, metal: 'Silver', purity: 'Pure' },
        { id: 'm22', name: 'Silver Toe Rings', price: 800, img: prod22, metal: 'Silver', purity: 'Pure' },
        { id: 'm23', name: 'Heavy Silver Kada', price: 12000, img: prod23, metal: 'Silver', purity: 'Pure' },
        { id: 'm24', name: 'Silver Ghungroo', price: 5500, img: prod24, metal: 'Silver', purity: 'Pure' },
    ],
    'bond': [
        // Wife
        { id: 'mock-w1', name: "Eternal Silver Necklace", price: 4999, originalPrice: 6999, img: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 12, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-w2', name: "Aaria Diamond Ring", price: 8500, originalPrice: 11900, img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviewCount: 8, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-w3', name: "Bridal Silver Set", price: 12500, originalPrice: 17500, img: "https://images.unsplash.com/photo-1535633302704-b02f4f122750?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviewCount: 5, priceDrop: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-w4', name: "Petal Flower Earrings", price: 2999, originalPrice: 4199, img: "https://images.unsplash.com/photo-1635767798638-3e25273a8256?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1630019017590-f04859664292?auto=format&fit=crop&q=80&w=800", rating: 4.4, reviewCount: 15, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-w5', name: "Infinity Love Bracelet", price: 3800, originalPrice: 5320, img: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800", rating: 4.6, reviewCount: 20, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-w6', name: "Starlight Silver Pendant", price: 5200, originalPrice: 7280, img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800", rating: 4.7, reviewCount: 33, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-w7', name: "Dainty Pearl Earrings", price: 2100, originalPrice: 2940, img: "https://images.unsplash.com/photo-1543160363-9b43ed53f652?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1535633602481-9033f32ca631?auto=format&fit=crop&q=80&w=800", rating: 4.3, reviewCount: 12, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-w8', name: "Eternal Sparkle Band", price: 4500, originalPrice: 6300, img: "https://images.unsplash.com/photo-1627250262174-8846be0684f4?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1603561591411-071c4f713932?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 41, metal: 'Silver', purity: 'Sterling' },
        // Husband
        { id: 'mock-h1', name: "Executive Silver Watch", price: 15999, originalPrice: 22399, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1539533377285-3422cc0469bb?auto=format&fit=crop&q=80&w=800", rating: 4.7, reviewCount: 22, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-h2', name: "Cuban Link Chain", price: 5499, originalPrice: 7699, img: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1535633302704-b02f4f122750?auto=format&fit=crop&q=80&w=800", rating: 4.6, reviewCount: 31, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-h3', name: "Minimalist Silver Ring", price: 3200, originalPrice: 4480, img: "https://images.unsplash.com/photo-1603561591411-071c4f713932?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1627250262174-8846be0684f4?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 10, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-h4', name: "Silver Cufflinks", price: 2500, originalPrice: 3500, img: "https://images.unsplash.com/photo-1511406361295-0a5ff814c0ad?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?auto=format&fit=crop&q=80&w=800", rating: 4.3, reviewCount: 6, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-h5', name: "The Trooper Bracelet", price: 4199, originalPrice: 6999, img: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviewCount: 15, priceDrop: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-h6', name: "Fibonacci Flow Ring", price: 2899, originalPrice: 4699, img: "https://images.unsplash.com/photo-1603561591411-071c4f713932?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 22, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-h7', name: "Statement Link Chain", price: 6599, originalPrice: 9999, img: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviewCount: 18, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-h8', name: "Signature Mens Cuff", price: 3400, originalPrice: 4800, img: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800", rating: 4.4, reviewCount: 9, metal: 'Silver', purity: 'Sterling' },
        // Mother
        { id: 'mock-m1', name: "Heirloom Silver Pendant", price: 7200, originalPrice: 9999, img: "https://images.unsplash.com/photo-1535633302704-b02f4f122750?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviewCount: 18, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-m2', name: "Classic Pearl Studs", price: 4500, originalPrice: 6300, img: "https://images.unsplash.com/photo-1535633602481-9033f32ca631?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1543160363-9b43ed53f652?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviewCount: 42, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-m3', name: "Silver Bangle Set", price: 8999, originalPrice: 12500, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", rating: 4.7, reviewCount: 9, priceDrop: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-m4', name: "Mother of Pearl Necklace", price: 5600, originalPrice: 7840, img: "https://images.unsplash.com/photo-1535633602481-9033f32ca631?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", rating: 4.6, reviewCount: 25, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-m5', name: "Guardian Angel Charm", price: 1500, originalPrice: 2100, img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviewCount: 55, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-m6', name: "Vintage Rose Studs", price: 3200, originalPrice: 4480, img: "https://images.unsplash.com/photo-1635767798638-3e25273a8256?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1630019017590-f04859664292?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 16, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-m7', name: "Sacred Om Pendant", price: 2400, originalPrice: 3360, img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviewCount: 38, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-m8', name: "Traditional Silk Bangle", price: 4200, originalPrice: 5880, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800", rating: 4.6, reviewCount: 21, metal: 'Silver', purity: 'Sterling' },
        // Brothers
        { id: 'mock-b1', name: "Bold Silver Bracelet", price: 4500, originalPrice: 6300, img: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 15, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-b2', name: "Titan Link Chain", price: 7800, originalPrice: 10900, img: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviewCount: 12, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-b3', name: "Minimalist Curb Ring", price: 1800, originalPrice: 2500, img: "https://images.unsplash.com/photo-1603561591411-071c4f713932?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1627250262174-8846be0684f4?auto=format&fit=crop&q=80&w=800", rating: 4.4, reviewCount: 8, priceDrop: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-b4', name: "Industrial Hex Nut Studs", price: 1500, originalPrice: 2100, img: "https://images.unsplash.com/photo-1511406361295-0a5ff814c0ad?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?auto=format&fit=crop&q=80&w=800", rating: 4.2, reviewCount: 5, metal: 'Silver', purity: 'Sterling' },
        // Sister
        { id: 'mock-s1', name: "Sparkling Ear Cuffs", price: 1800, originalPrice: 2500, img: "https://images.unsplash.com/photo-1635767798638-3e25273a8256?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1630019017590-f04859664292?auto=format&fit=crop&q=80&w=800", rating: 4.6, reviewCount: 24, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-s2', name: "Initial S Heart Necklace", price: 3500, originalPrice: 4900, img: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviewCount: 18, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-s3', name: "Flower Bud Studs", price: 2100, originalPrice: 2940, img: "https://images.unsplash.com/photo-1635767798638-3e25273a8256?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1630019017590-f04859664292?auto=format&fit=crop&q=80&w=800", rating: 4.3, reviewCount: 12, priceDrop: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-s4', name: "Silk Thread Bracelet", price: 1200, originalPrice: 1680, img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 31, metal: 'Silver', purity: 'Sterling' },
        // Friends
        { id: 'mock-f1', name: "Friendship Charm Bracelet", price: 1500, originalPrice: 2100, img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviewCount: 55, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-f2', name: "Matching Silver Bands", price: 2800, originalPrice: 3900, img: "https://images.unsplash.com/photo-1603561591411-071c4f713932?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1627250262174-8846be0684f4?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 12, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-f3', name: "Mini Star Pendant", price: 1999, originalPrice: 2799, img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", rating: 4.7, reviewCount: 9, priceDrop: true, metal: 'Silver', purity: 'Sterling' },
        { id: 'mock-f4', name: "Geometric Ear Studs", price: 1100, originalPrice: 1540, img: "https://images.unsplash.com/photo-1635767798638-3e25273a8256?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1630019017590-f04859664292?auto=format&fit=crop&q=80&w=800", rating: 4.4, reviewCount: 20, metal: 'Silver', purity: 'Sterling' },
        // Lead Home Mocks
        { id: 'lp1', name: "Soulmate Silver Band", price: 3499, originalPrice: 4899, img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", rating: 4.5, reviewCount: 12, metal: 'Silver', purity: 'Sterling' },
        { id: 'lp2', name: "Amara Delicate Necklace", price: 4200, originalPrice: 5880, img: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviewCount: 8, metal: 'Silver', purity: 'Sterling' },
        { id: 'lp3', name: "Zaya Crystal Earrings", price: 2800, originalPrice: 3920, img: "https://images.unsplash.com/photo-1635767798638-3e25273a8256?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1630019017590-f04859664292?auto=format&fit=crop&q=80&w=800", rating: 4.2, reviewCount: 15, metal: 'Silver', purity: 'Sterling' },
        { id: 'lp4', name: "Mens Curb Bracelet", price: 5999, originalPrice: 8399, img: "https://images.unsplash.com/photo-1611085583191-a3b1a6a939db?auto=format&fit=crop&q=80&w=800", secondaryImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800", rating: 4.7, reviewCount: 22, metal: 'Silver', purity: 'Sterling' },
    ],
    'home': [
        { id: "best-1", name: "Classic Silver Cuban Chain", price: 2499, originalPrice: 4999, img: prod17, rating: 4.9, reviewCount: 1240, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: "best-2", name: "Elegant Silver Drop Earrings", price: 1899, originalPrice: 3599, img: prod20, rating: 4.8, reviewCount: 856, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: "best-3", name: "Rustic Silver Signature Ring", price: 1599, originalPrice: 2899, img: prod18, rating: 4.7, reviewCount: 642, priceDrop: true, metal: 'Silver', purity: 'Sterling' },
        { id: "best-4", name: "Vintage Silver Filigree Band", price: 2199, originalPrice: 4299, img: prod14, rating: 4.8, reviewCount: 312, priceDrop: true, metal: 'Silver', purity: 'Sterling' },
        { id: "best-5", name: "Premium Silver Link Bracelet", price: 3299, originalPrice: 6499, img: prod19, rating: 4.9, reviewCount: 1105, bestseller: true, metal: 'Silver', purity: 'Sterling' },
        { id: "best-6", name: "Minimalist Silver Choker", price: 4599, originalPrice: 8999, img: prod21, rating: 4.7, reviewCount: 432, priceDrop: true, metal: 'Silver', purity: 'Sterling' }
    ]
};
