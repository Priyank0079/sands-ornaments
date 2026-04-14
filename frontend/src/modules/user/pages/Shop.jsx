import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import {
    Filter, ChevronDown, ShoppingBag, SlidersHorizontal,
    ArrowLeft, ArrowUpDown
} from 'lucide-react';

import menRing from '../assets/men_prod_ring.png';
import menPendant from '../assets/men_prod_pendant.png';
import menBracelet from '../assets/men_prod_bracelet.png';
import menChain from '../assets/men_prod_chain.png';

import womenEarrings from '../assets/cat_earrings.png';
import womenPendant from '../assets/trending_modern.png';
import womenRing from '../assets/prod_ring_main.png';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const currencyText = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const Shop = () => {
    const { products, categories, isLoading } = useShop();
    const visibleCategories = categories.filter(
        (cat) => cat.isActive !== false && cat.showInCollection !== false
    );
    const location = useLocation();
    const navigate = useNavigate();
    const { category } = useParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filterNewArrivals, setFilterNewArrivals] = useState(false);
    const [filterTrending, setFilterTrending] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isWebSortOpen, setIsWebSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Newest');
    const [priceRange, setPriceRange] = useState(50000); 
    const [filteredProducts, setFilteredProducts] = useState(products || []);
    const [pageTitle, setPageTitle] = useState('All Jewellery');
    const queryParams = new URLSearchParams(location.search);
    const isComingSoonQuery = queryParams.get('status') === 'coming-soon';
    const filterQuery = queryParams.get('filter');
    const occasionQuery = queryParams.get('occasion');
    const priceMaxQuery = queryParams.get('price_max');   // upper bound — e.g. price_max=3000
    const priceMinQuery = queryParams.get('price_min');   // lower bound — e.g. price_min=1500
    const productsQuery = queryParams.get('products');
    const limitQuery = queryParams.get('limit');
    const sortQuery = queryParams.get('sort');
    const searchQuery = queryParams.get('search');
    const karatQuery = queryParams.get('karat');
    const silverTypeQuery = queryParams.get('silver_type');

    useEffect(() => {
        const categoryQuery = queryParams.get('category');
        const parsedPrice = Number(String(priceMaxQuery || '').replace(/[^0-9]/g, ''));

        if (categoryQuery) {
            const categoryFromQuery = categories.find((c) => (
                c._id === categoryQuery ||
                c.id === categoryQuery ||
                c.slug === categoryQuery ||
                c.path === categoryQuery ||
                c.name === categoryQuery
            ));
            if (categoryFromQuery && selectedCategory !== categoryFromQuery.name) {
                setSelectedCategory(categoryFromQuery.name);
            }
        } else if (selectedCategory !== 'All') {
            setSelectedCategory('All');
        }

        setFilterNewArrivals(location.pathname === '/new-arrivals');
        setFilterTrending(location.pathname === '/trending');

        if (sortQuery === 'most-sold' && sortBy !== 'Best Selling') {
            setSortBy('Best Selling');
        } else if (sortQuery === 'latest' && sortBy !== 'Newest') {
            setSortBy('Newest');
        } else if (sortQuery === 'price-asc' && sortBy !== 'Price: Low to High') {
            setSortBy('Price: Low to High');
        } else if (sortQuery === 'price-desc' && sortBy !== 'Price: High to Low') {
            setSortBy('Price: High to Low');
        }

        if (Number.isFinite(parsedPrice) && parsedPrice > 0) {
            if (priceRange !== parsedPrice) {
                setPriceRange(parsedPrice);
            }
        } else if (priceRange !== 50000) {
            setPriceRange(50000);
        }
    }, [location.search, location.pathname, categories]);

    const updateShopQuery = (updates = {}, pathOverride = location.pathname) => {
        const params = new URLSearchParams(location.search);

        Object.entries(updates).forEach(([key, value]) => {
            if (
                value === undefined ||
                value === null ||
                value === '' ||
                value === false ||
                value === 'All'
            ) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        const nextSearch = params.toString();
        navigate(`${pathOverride}${nextSearch ? `?${nextSearch}` : ''}`, { replace: true });
    };

    // Effect to handle URL-based Logic + Local Category Filter
    useEffect(() => {
        const path = location.pathname;
        const categoryQuery = queryParams.get('category');
        const metalQuery = queryParams.get('metal');
        
        let baseProducts = products;
        let title = 'All Jewellery';

        const getProductPrice = (product) => {
            if (!product) return 0;
            const topLevelCandidates = [
                product.finalPrice,
                product.price,
                product.originalPrice,
                product.mrp
            ]
                .map((value) => Number(value))
                .filter((value) => Number.isFinite(value) && value > 0);

            if (topLevelCandidates.length > 0) {
                return topLevelCandidates[0];
            }

            const variantPrices = (product.variants || [])
                .map((variant) => Number(
                    variant.finalPrice ??
                    variant.price ??
                    variant.mrp ??
                    0
                ))
                .filter(v => Number.isFinite(v) && v > 0);
            if (variantPrices.length > 0) return Math.min(...variantPrices);
            return 0;
        };
        const getProductCreatedAt = (product) => {
            const ts = product?.createdAt || product?.updatedAt || '';
            const date = ts ? new Date(ts).getTime() : 0;
            if (date) return date;
            const id = String(product?._id || product?.id || '');
            return id ? parseInt(id.substring(0, 8), 16) || 0 : 0;
        };
        const getProductSold = (product) => {
            if (!product) return 0;
            if (Number.isFinite(product.sold)) return product.sold;
            const variantSold = (product.variants || []).reduce((sum, v) => sum + (v.sold || 0), 0);
            return Number.isFinite(variantSold) ? variantSold : 0;
        };
        const shuffleArray = (arr) => {
            const copy = [...arr];
            for (let i = copy.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
        };

        const categoryQueryObj = categoryQuery ? categories.find(c => (
            c._id === categoryQuery ||
            c.id === categoryQuery ||
            c.name === categoryQuery ||
            c.slug === categoryQuery ||
            c.path === categoryQuery
        )) || null : null;

        const matchesCategory = (product, value, cat) => {
            if (!value && !cat) return true;
            const valueStr = value ? String(value) : '';
            const valueLower = valueStr.toLowerCase();
            const productCategory = product.category || '';
            const productCategorySlug = product.categorySlug || '';
            const productCategoryId = product.categoryId || product.category_id || '';
            const catId = cat?._id || cat?.id || '';
            const catName = cat?.name || '';
            const catSlug = cat?.path || cat?.slug || '';
            const navCategoryIds = (product.navShopByCategory || []).map(id => String(id));

            if (productCategoryId && valueStr && String(productCategoryId) === valueStr) return true;
            if (productCategoryId && catId && String(productCategoryId) === String(catId)) return true;
            if (valueStr && navCategoryIds.includes(valueStr)) return true;
            if (catId && navCategoryIds.includes(String(catId))) return true;
            if (productCategory && valueLower && productCategory.toLowerCase() === valueLower) return true;
            if (productCategorySlug && valueLower && productCategorySlug.toLowerCase() === valueLower) return true;
            if (productCategory && catName && productCategory === catName) return true;
            if (productCategory && catSlug && productCategory.toLowerCase() === catSlug.toLowerCase()) return true;
            if (productCategorySlug && catSlug && productCategorySlug.toLowerCase() === catSlug.toLowerCase()) return true;

            return false;
        };
        const getProductMetal = (product) => {
            const material = String(product?.material || '').trim();
            if (material) return material;
            const catId = product.categoryId || product.category_id || '';
            const cat = categories.find(c => String(c._id || c.id) === String(catId));
            return cat?.metal || product.metal;
        };
        const normalizeSilverTier = (value) => {
            const normalized = String(value || '').trim().toLowerCase();
            if (!normalized) return 'silver';
            if (normalized === '925 sterling silver') return '925 sterling silver';
            return 'silver';
        };
        const matchesPurityTier = (product) => {
            if (metalQuery?.toLowerCase() === 'gold' && karatQuery) {
                return String(product.goldCategory || '') === String(karatQuery);
            }
            if (metalQuery?.toLowerCase() === 'silver' && silverTypeQuery) {
                return normalizeSilverTier(product.silverCategory) === normalizeSilverTier(silverTypeQuery);
            }
            return true;
        };

        // 1. Determine Base Products & Title from URL
        if (path === '/new-arrivals') {
            title = 'New Arrivals';
            baseProducts = products.filter(p => p.isNew);
        } else if (path === '/trending') {
            title = 'Trending Now';
            baseProducts = products.filter(p => p.rating >= 4.5);
        } else if (metalQuery) {
            title = `${metalQuery.charAt(0).toUpperCase() + metalQuery.slice(1)} Collection`;
            baseProducts = products.filter(p => {
                const metal = getProductMetal(p);
                return metal?.toLowerCase() === metalQuery.toLowerCase();
            });
            if (karatQuery) {
                title = `${metalQuery.toUpperCase()} ${karatQuery} Karat`;
            } else if (silverTypeQuery) {
                title = metalQuery.toLowerCase() === 'silver'
                    ? (normalizeSilverTier(silverTypeQuery) === '925 sterling silver' ? '925 Sterling Silver' : 'Silver')
                    : title;
            }
        } else if (category) {
            const currentCat = categories.find(c => c.path === category || c.slug === category);
            title = currentCat ? currentCat.name : category.charAt(0).toUpperCase() + category.slice(1);
            baseProducts = products.filter(p => matchesCategory(p, category, currentCat));
        } else if (filterQuery) {
            title = `Gifts for ${filterQuery.charAt(0).toUpperCase() + filterQuery.slice(1)}`;
        } else if (occasionQuery) {
            title = `${occasionQuery.charAt(0).toUpperCase() + occasionQuery.slice(1)} Picks`;
        }

        if (metalQuery && (karatQuery || silverTypeQuery)) {
            baseProducts = baseProducts.filter(matchesPurityTier);
        }

        if (categoryQuery) {
            baseProducts = baseProducts.filter(p => matchesCategory(p, categoryQuery, categoryQueryObj));
        }

        if (priceMaxQuery && priceMinQuery) {
            const parsedMin = Number(String(priceMinQuery).replace(/[^0-9]/g, ''));
            const parsedMax = Number(String(priceMaxQuery).replace(/[^0-9]/g, ''));
            title = `₹${parsedMin.toLocaleString('en-IN')} – ₹${parsedMax.toLocaleString('en-IN')}`;
        } else if (priceMaxQuery) {
            const parsedPrice = Number(String(priceMaxQuery).replace(/[^0-9]/g, ''));
            title = `Under ₹${parsedPrice.toLocaleString('en-IN')}`;
        } else if (priceMinQuery) {
            const parsedMin = Number(String(priceMinQuery).replace(/[^0-9]/g, ''));
            title = `Above ₹${parsedMin.toLocaleString('en-IN')}`;
        }
        if (productsQuery) {
            const ids = String(productsQuery)
                .split(',')
                .map(id => id.trim())
                .filter(Boolean);
            if (ids.length > 0) {
                baseProducts = baseProducts.filter(p => ids.includes(String(p._id || p.id)));
                title = 'Perfect Gift';
            }
        }
        if (sortQuery === 'latest') {
            title = selectedCategory !== 'All' ? selectedCategory : 'Latest Drop';
        }
        if (sortQuery === 'most-sold') {
            title = selectedCategory !== 'All' ? selectedCategory : 'Most Gifted';
        }
        if (sortQuery === 'random') {
            title = selectedCategory !== 'All' ? selectedCategory : 'Curated For You';
        }
        if (searchQuery) {
            title = `Search: ${searchQuery}`;
        }

        // Apply Title overrides from Local Filters
        if (selectedCategory !== 'All') {
            title = selectedCategory;
        } else if (filterNewArrivals && path === '/shop') {
            title = 'Just Arrived';
        } else if (filterTrending && path === '/shop') {
            title = 'Trending Now';
        }

        setPageTitle(title);

        let result = baseProducts;

        // 2. Apply Local Category Filter (if selected)
        if (selectedCategory !== 'All') {
            const selectedCat = categories.find(c => c.name === selectedCategory || c.slug === selectedCategory || c.path === selectedCategory);
            result = result.filter(p => matchesCategory(p, selectedCategory, selectedCat));
        }

        // 2.1 Apply Audience/Occasion Text Filters (if present)
        const filterTerm = filterQuery || occasionQuery;
        if (filterTerm) {
            const normalize = (value) => String(value || '')
                .trim()
                .toLowerCase()
                .replace(/['"]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            const term = normalize(filterTerm);
            const matchesNavTags = (product) => {
                const giftTags = (product.navGiftsFor || []).map(t => normalize(t));
                const occasionTags = (product.navOccasions || []).map(t => normalize(t));
                if (filterQuery) return giftTags.includes(term);
                if (occasionQuery) return occasionTags.includes(term);
                return false;
            };

            result = result.filter(matchesNavTags);
        }

        if (searchQuery) {
            const normalizedSearch = String(searchQuery).trim().toLowerCase();
            result = result.filter((product) => {
                const haystack = [
                    product.name,
                    product.description,
                    product.shortDescription,
                    product.category,
                    product.categorySlug,
                    ...(product.tags || []),
                    ...(product.navGiftsFor || []),
                    ...(product.navOccasions || []),
                    ...(product.variants || []).map((variant) => variant.name)
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                return haystack.includes(normalizedSearch);
            });
        }

        // 2.2 Apply Collection Filters
        if (filterNewArrivals) {
            result = result.filter(p => p.isNew);
        }
        if (filterTrending) {
            result = result.filter(p => p.rating >= 4.5);
        }

        // 3. Apply Price Filter
        // URL-driven range filters (price_min / price_max) take priority over slider
        const urlPriceMax = priceMaxQuery ? Number(String(priceMaxQuery).replace(/[^0-9]/g, '')) : null;
        const urlPriceMin = priceMinQuery ? Number(String(priceMinQuery).replace(/[^0-9]/g, '')) : null;

        if (urlPriceMax && Number.isFinite(urlPriceMax) && urlPriceMax > 0) {
            result = result.filter(p => getProductPrice(p) <= urlPriceMax);
        } else {
            // Fall back to local slider state
            result = result.filter(p => getProductPrice(p) <= priceRange);
        }
        if (urlPriceMin && Number.isFinite(urlPriceMin) && urlPriceMin > 0) {
            result = result.filter(p => getProductPrice(p) >= urlPriceMin);
        }

        // 4. Apply Sorting
        if (sortQuery === 'latest') {
            result.sort((a, b) => getProductCreatedAt(b) - getProductCreatedAt(a));
        } else if (sortQuery === 'most-sold') {
            result.sort((a, b) => getProductSold(b) - getProductSold(a));
        } else if (sortQuery === 'random') {
            result = shuffleArray(result);
        } else if (sortBy === 'Price: Low to High') {
            result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        } else if (sortBy === 'Price: High to Low') {
            result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        } else if (sortBy === 'Best Selling') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'Newest') {
            result.sort((a, b) => {
                const dateDiff = getProductCreatedAt(b) - getProductCreatedAt(a);
                if (dateDiff !== 0) return dateDiff;
                if (Boolean(b.isNew) !== Boolean(a.isNew)) return b.isNew ? 1 : -1;
                return 0;
            });
        }

        const menDummyProducts = [
            {
                id: 'p1',
                name: "Silver Fibonacci Flow Ring For Him",
                price: 2899,
                originalPrice: 4699,
                discountPrice: 1739,
                image: menRing,
                rating: 4.6,
                reviews: 107,
                isNew: true,
                category: "Rings",
                categorySlug: "rings",
                metal: "silver",
                variants: [{ id: 'p1-v1', price: 2899, mrp: 4699 }]
            },
            {
                id: 'p2',
                name: "Silver Anjaneya Pendant With Box Chain",
                price: 3799,
                originalPrice: 6199,
                discountPrice: 2279,
                image: menPendant,
                rating: 4.6,
                reviews: 100,
                isNew: false,
                category: "Pendants",
                categorySlug: "pendants",
                metal: "silver",
                variants: [{ id: 'p2-v1', price: 3799, mrp: 6199 }]
            },
            {
                id: 'p4',
                name: "Silver Trooper Bracelet For Him",
                price: 4199,
                originalPrice: 6999,
                discountPrice: 2519,
                image: menBracelet,
                rating: 4.9,
                reviews: 215,
                isNew: true,
                category: "Bracelets",
                categorySlug: "bracelets",
                metal: "silver",
                variants: [{ id: 'p4-v1', price: 4199, mrp: 6999 }]
            },
            {
                id: 'p5',
                name: "Silver Statement Link Chain",
                price: 6599,
                originalPrice: 9999,
                discountPrice: 3959,
                image: menChain,
                rating: 4.8,
                reviews: 84,
                isNew: false,
                category: "Chains",
                categorySlug: "chains",
                metal: "silver",
                variants: [{ id: 'p5-v1', price: 6599, mrp: 9999 }]
            }
        ];
        
        const womenDummyProducts = [
            {
                id: 'w1',
                name: "Rose Glow Sterling Drop Earrings",
                price: 1899,
                originalPrice: 3299,
                discountPrice: 1699,
                image: womenEarrings,
                rating: 4.8,
                reviews: 245,
                isNew: true,
                category: "Earrings",
                categorySlug: "earrings",
                metal: "silver",
                variants: [{ id: 'w1-v1', price: 1899, mrp: 3299 }]
            },
            {
                id: 'w2',
                name: "Eternal Blossom Pendant Necklace",
                price: 2499,
                originalPrice: 4199,
                discountPrice: 2249,
                image: womenPendant,
                rating: 4.9,
                reviews: 180,
                isNew: false,
                category: "Pendants",
                categorySlug: "pendants",
                metal: "silver",
                variants: [{ id: 'w2-v1', price: 2499, mrp: 4199 }]
            },
            {
                id: 'w3',
                name: "Infinite Love Stackable Silver Ring",
                price: 1299,
                originalPrice: 2499,
                discountPrice: 1169,
                image: womenRing,
                rating: 4.6,
                reviews: 92,
                isNew: true,
                category: "Rings",
                categorySlug: "rings",
                metal: "silver",
                variants: [{ id: 'w3-v1', price: 1299, mrp: 2499 }]
            }
        ];

        // 5. Apply Limit (query)
        if (limitQuery) {
            const parsedLimit = Number(String(limitQuery).replace(/[^0-9]/g, ''));
            if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
                result = result.slice(0, parsedLimit);
            }
        }

        // 6. Inject Dummy Products for Men/Women Categories if empty
        const isMenCategory = category?.toLowerCase() === 'men' || 
                             selectedCategory?.toLowerCase() === 'men' ||
                             location.pathname.includes('/men') ||
                             menDummyProducts.some(p => p.categorySlug === category || p.categorySlug === selectedCategory?.toLowerCase());

        const isWomenCategory = category?.toLowerCase() === 'women' || 
                               category?.toLowerCase() === 'womens' ||
                               selectedCategory?.toLowerCase() === 'women' ||
                               location.pathname.includes('/women') ||
                               womenDummyProducts.some(p => p.categorySlug === category || p.categorySlug === selectedCategory?.toLowerCase());

        if (result.length === 0 && isMenCategory) {
            result = menDummyProducts;
            if (category && category !== 'men') {
                result = result.filter(p => p.categorySlug === category);
            } else if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'Men') {
                result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
            }
            if (result.length === 0) result = menDummyProducts.slice(0, 2);
        } else if (result.length === 0 && isWomenCategory) {
            result = womenDummyProducts;
            if (category && category !== 'women' && category !== 'womens') {
                result = result.filter(p => p.categorySlug === category);
            } else if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'Women') {
                result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
            }
            if (result.length === 0) result = womenDummyProducts.slice(0, 3);
        }

        setFilteredProducts([...result]); // Create new array to force re-render

    }, [location, category, selectedCategory, priceRange, filterNewArrivals, filterTrending, sortBy, categories, products]);

    useEffect(() => {
        document.title = `${pageTitle} | Sands Ornaments - Pure 925 Silver Jewellery`;
    }, [pageTitle]);

    // Handle Category Change
    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
        const selectedCat = categories.find((cat) => cat.name === val);
        updateShopQuery({
            category: val === 'All' ? null : (selectedCat?._id || selectedCat?.id || selectedCat?.slug || selectedCat?.path || val)
        });
    };

    const handleSortChange = (option) => {
        setSortBy(option);
        const sortMap = {
            'Newest': 'latest',
            'Best Selling': 'most-sold',
            'Price: Low to High': 'price-asc',
            'Price: High to Low': 'price-desc'
        };
        updateShopQuery({ sort: sortMap[option] || null });
    };

    const handlePriceRangeChange = (value) => {
        const nextValue = Number(value);
        setPriceRange(nextValue);
        updateShopQuery({ price_max: nextValue >= 50000 ? null : nextValue });
    };

    const handleCollectionToggle = (type, checked) => {
        if (type === 'new-arrivals') {
            if (checked) {
                setFilterNewArrivals(true);
                setFilterTrending(false);
                navigate(`/new-arrivals${location.search || ''}`, { replace: true });
            } else {
                setFilterNewArrivals(false);
                navigate(`/shop${location.search || ''}`, { replace: true });
            }
            return;
        }

        if (type === 'trending') {
            if (checked) {
                setFilterTrending(true);
                setFilterNewArrivals(false);
                navigate(`/trending${location.search || ''}`, { replace: true });
            } else {
                setFilterTrending(false);
                navigate(`/shop${location.search || ''}`, { replace: true });
            }
        }
    };

    const clearAllFilters = () => {
        setSelectedCategory('All');
        setFilterNewArrivals(false);
        setFilterTrending(false);
        setPriceRange(50000);
        setSortBy('Newest');
        navigate('/shop');
    };

    return (
        <div className="bg-white min-h-screen relative">
            <div className="container mx-auto px-4 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-black hover:text-black transition-all group font-bold uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
            </div>
            <div className="container mx-auto px-4 md:px-6 pt-4 pb-32 md:pb-8">
                {/* Header Section - Single Row: Title Left, Filter Button Right */}
                {/* Header Section - Compact Mobile */}
                <div className="sticky top-[50px] md:top-[141px] z-30 bg-white pt-2 md:pt-4 flex flex-row justify-between items-center mb-4 md:mb-10 pb-2 md:pb-6 border-b border-[#EBCDD0] gap-4 transition-all duration-300">
                    <div className="text-left shrink-0">
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-medium text-black">{pageTitle}</h1>
                        <p className="text-black mt-1 md:mt-2 text-xs md:text-base font-medium">{filteredProducts.length} Products Found</p>
                    </div>

                    <div className="hidden md:flex items-center gap-2 md:gap-4 shrink-0">
                        {/* Desktop Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsWebSortOpen(!isWebSortOpen)}
                                className="flex items-center gap-2 text-black font-medium text-sm border border-[#EBCDD0] px-4 py-2 rounded-full hover:bg-[#FDF5F6] hover:shadow-sm transition-all"
                            >
                                <ArrowUpDown className="w-4 h-4" />
                                <span>Sort By</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isWebSortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isWebSortOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#EBCDD0] rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                                    {['Newest', 'Price: High to Low', 'Price: Low to High', 'Best Selling'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => { handleSortChange(option); setIsWebSortOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#FDF5F6] transition-colors flex items-center justify-between group ${sortBy === option ? 'text-black font-bold bg-[#FDF5F6]' : 'text-gray-600'}`}
                                        >
                                            <span>{option}</span>
                                            {sortBy === option && <div className="w-2 h-2 rounded-full bg-[#D39A9F]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center gap-1.5 md:gap-2 border border-[#EBCDD0] px-3 md:px-6 py-1.5 md:py-2.5 rounded-full hover:bg-[#D39A9F] hover:text-white hover:border-[#D39A9F] hover:shadow-md transition-all text-black text-xs md:text-sm font-medium bg-white/50"
                        >
                            <Filter className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>



                {/* Product Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 gap-y-8 md:gap-y-12">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : (() => {
                    const isComingSoon = isComingSoonQuery || (selectedCategory !== 'All' && filteredProducts.length === 0);

                    if (isComingSoon) {
                        return (
                            <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-[#D39A9F]/10 rounded-full flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-10 h-10 text-[#D39A9F]" />
                                </div>
                                <h3 className="text-3xl font-serif text-black mb-3 italic">Coming Soon</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-8">
                                    We're currently handcrafting new exquisite designs for <span className="text-black font-semibold">{selectedCategory}</span>. Stay tuned!
                                </p>
                                <button 
                                    onClick={clearAllFilters}
                                    className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#D39A9F] transition-all shadow-lg"
                                >
                                    Explore Other Collections
                                </button>
                            </div>
                        );
                    }

                    if (filteredProducts.length > 0) {
                        return (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 gap-y-8 md:gap-y-12">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        );
                    }

                    return (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="text-2xl font-serif text-black mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your filters to find your perfect match.</p>
                            <button 
                                onClick={clearAllFilters} 
                                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#D39A9F] hover:underline"
                            >
                                <SlidersHorizontal className="w-4 h-4" /> Clear all filters
                            </button>
                        </div>
                    );
                })()}
            </div>

            {/* Mobile Bottom Action Bar (Nykaa Style) */}
            <div className="md:hidden fixed bottom-[62px] left-0 right-0 bg-white z-[60] border-t border-[#EBCDD0] flex h-14 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {/* Sort Button (Custom Sheet Trigger) */}
                <div onClick={() => setIsSortOpen(true)} className="flex-1 border-r border-[#EBCDD0] relative flex flex-col items-center justify-center active:bg-gray-50 cursor-pointer py-1">
                    <span className="text-black font-bold text-xs flex items-center gap-1.5">
                        <ArrowUpDown className="w-3 h-3" /> Sort by
                    </span>
                    <span className="text-[10px] text-gray-600 font-medium mt-0.5">{sortBy}</span>
                </div>

                {/* Filter Button */}
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex-1 flex flex-col items-center justify-center active:bg-gray-50 py-1"
                >
                    <span className="text-black font-bold text-xs flex items-center gap-1.5">
                        <Filter className="w-3 h-3" /> Filter
                    </span>
                    <span className="text-[10px] text-gray-600 font-medium mt-0.5">
                        {(selectedCategory !== 'All' || filterNewArrivals || filterTrending || priceRange < 50000 || !!searchQuery || !!filterQuery || !!occasionQuery) ? 'Filters applied' : 'No filter applied'}
                    </span>
                </button>
            </div>

            {/* Filter Sidebar Drawer */}
            {/* Overlay */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[105] backdrop-blur-sm transition-opacity"
                    onClick={() => setIsFilterOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-[320px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-[#EBCDD0] ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[#EBCDD0]">
                        <h3 className="text-xl font-serif text-black">Filters</h3>
                        <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-black">
                            <ChevronDown className="w-6 h-6 rotate-90" /> {/* Using Chevron as Close Icon approximation or could import X */}
                        </button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="p-6 flex-1 overflow-y-auto space-y-8">

                        {/* 1. Category Filter */}
                        <div>
                            <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-4">Category</h4>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="All"
                                        checked={selectedCategory === 'All'}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="form-radio text-black focus:ring-[#D39A9F] h-4 w-4 border-gray-300"
                                    />
                                    <span className={`text-sm group-hover:text-black transition-colors ${selectedCategory === 'All' ? 'text-black font-medium' : 'text-gray-600'}`}>All Categories</span>
                                </label>
                                {visibleCategories.map(cat => (
                                    <div key={cat.id}>
                                        <label className="flex items-center space-x-3 cursor-pointer group mb-2">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat.name}
                                                checked={selectedCategory === cat.name}
                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                className="form-radio text-black focus:ring-[#D39A9F] h-4 w-4 border-gray-300"
                                            />
                                            <span className={`text-sm group-hover:text-black transition-colors ${selectedCategory === cat.name ? 'text-black font-medium' : 'text-gray-600'}`}>{cat.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>



                        {/* 1.5 Collections Filter */}
                        <div className="pt-6 border-t border-[#EBCDD0]">
                            <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-4">Collections</h4>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filterNewArrivals}
                                        onChange={(e) => handleCollectionToggle('new-arrivals', e.target.checked)}
                                        className="rounded border-gray-300 text-black focus:ring-[#D39A9F] h-4 w-4"
                                    />
                                    <span className={`text-sm group-hover:text-black transition-colors ${filterNewArrivals ? 'text-black font-medium' : 'text-gray-600'}`}>
                                        Just Arrived
                                    </span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filterTrending}
                                        onChange={(e) => handleCollectionToggle('trending', e.target.checked)}
                                        className="rounded border-gray-300 text-black focus:ring-[#D39A9F] h-4 w-4"
                                    />
                                    <span className={`text-sm group-hover:text-black transition-colors ${filterTrending ? 'text-black font-medium' : 'text-gray-600'}`}>
                                        Trending Now
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* 2. Price Filter */}
                        <div className="pt-6 border-t border-[#EBCDD0]">
                            <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-4">Max Price: {currencyText(priceRange)}</h4>
                            <input
                                type="range"
                                min="500"
                                max="50000"
                                step="500"
                                value={priceRange}
                                onChange={(e) => handlePriceRangeChange(e.target.value)}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D39A9F]"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-2">
                                <span>{currencyText(500)}</span>
                                <span>{currencyText(50000)}+</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-[#EBCDD0] bg-white">
                        <button
                            onClick={clearAllFilters}
                            className="w-full py-3 border border-[#EBCDD0] text-black font-medium rounded-lg hover:bg-[#FDF5F6] hover:shadow-sm transition-all text-sm mb-3"
                        >
                            Reset Filters
                        </button>
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full py-3 bg-[#D39A9F] text-white font-medium rounded-lg hover:bg-[#D39A9F] shadow-lg hover:shadow-xl transition-all text-sm"
                        >
                            View Results
                        </button>
                    </div>
                </div>
            </div>

            {/* Sort Bottom Sheet */}
            {isSortOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-[70] backdrop-blur-sm transition-opacity" onClick={() => setIsSortOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-[80] rounded-t-2xl p-6 pb-8 animate-in slide-in-from-bottom duration-300 safe-bottom">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 opacity-50" />
                        <h3 className="text-lg font-serif font-bold text-black mb-6">Sort By</h3>
                        <div className="space-y-4">
                            {['Newest', 'Price: High to Low', 'Price: Low to High', 'Best Selling'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => { handleSortChange(option); setIsSortOpen(false); }}
                                    className="w-full flex items-center justify-between text-left py-2 group"
                                >
                                    <span className={`text-sm transition-colors ${sortBy === option ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>{option}</span>
                                    {sortBy === option ? (
                                        <div className="w-5 h-5 rounded-full bg-[#D39A9F] flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border border-gray-300 group-hover:border-[#D39A9F]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default Shop;
