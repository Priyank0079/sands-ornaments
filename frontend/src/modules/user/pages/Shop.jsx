import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../assets/data'; // Import categories to map paths
import { Filter, ChevronDown, ArrowUpDown, ArrowLeft } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const Shop = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { category } = useParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false); // State for Sidebar
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); // New State for Subcategory
    const [filterNewArrivals, setFilterNewArrivals] = useState(false);
    const [filterTrending, setFilterTrending] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isWebSortOpen, setIsWebSortOpen] = useState(false); // New state for Web Sort Dropdown
    const [sortBy, setSortBy] = useState('Newest');
    const [priceRange, setPriceRange] = useState(10000); // Mock max price
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [pageTitle, setPageTitle] = useState('All Jewellery');

    // Effect to handle URL-based Logic + Local Category Filter
    useEffect(() => {
        const path = location.pathname;
        let baseProducts = products;
        let title = 'All Jewellery';

        // 1. Determine Base Products & Title from URL
        if (path === '/new-arrivals') {
            title = 'New Arrivals';
            baseProducts = products.filter(p => p.isNew);
        } else if (path === '/trending') {
            title = 'Trending Now';
            baseProducts = products.filter(p => p.rating >= 4.5);
        } else if (category) {
            const currentCat = categories.find(c => c.path === category);
            title = currentCat ? currentCat.name : category.charAt(0).toUpperCase() + category.slice(1);
            baseProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase() || (currentCat && p.category === currentCat.name));
        }

        // Apply Title overrides from Local Filters
        if (selectedSubCategory) {
            title = selectedSubCategory;
        } else if (selectedCategory !== 'All') {
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
            result = result.filter(p => p.category === selectedCategory);

            // 2.1 Apply Subcategory Filter
            if (selectedSubCategory) {
                // Assuming product names or descriptions usually contain the subcategory type for matching 
                // OR in a real app, products would have a 'subcategory' field.
                // For this demo, we'll try to match exact string if possible, or fuzzy match if product has that property.
                // Since data.js products don't specifically have 'subcategory' field, we might match name string roughly?
                // Wait, looking at data.js, products don't have subcategory field.
                // However, `data.js` structure has subcategories with specific names.
                // Let's assume for now we filter by checking if product NAME contains the subcategory name (e.g. "Solitaire").
                result = result.filter(p => p.name.includes(selectedSubCategory));
            }
        }

        // 2.2 Apply Collection Filters
        if (filterNewArrivals) {
            result = result.filter(p => p.isNew);
        }
        if (filterTrending) {
            result = result.filter(p => p.rating >= 4.5);
        }

        // 3. Apply Price Filter
        result = result.filter(p => p.price <= priceRange);

        // 4. Apply Sorting
        if (sortBy === 'Price: Low to High') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'Price: High to Low') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'Best Selling') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'Newest') {
            result.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1);
        }

        setFilteredProducts([...result]); // Create new array to force re-render

    }, [location, category, selectedCategory, selectedSubCategory, priceRange, filterNewArrivals, filterTrending, sortBy]);

    // Handle Category Change to reset subcategory
    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
        setSelectedSubCategory(null);
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
            <div className="container mx-auto px-4 pt-4 pb-32 md:pb-8">
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
                                            onClick={() => { setSortBy(option); setIsWebSortOpen(false); }}
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
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 gap-y-8 md:gap-y-12">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <h3 className="text-2xl font-serif text-black mb-2">No products found</h3>
                        <p className="text-black">Try adjusting your filters.</p>
                        <button onClick={() => { setSelectedCategory('All'); setSelectedSubCategory(null); setPriceRange(10000); }} className="mt-4 underline text-gray-600 hover:text-black">Clear all filters</button>
                    </div>
                )}
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
                        {(selectedCategory !== 'All' || selectedSubCategory || filterNewArrivals || filterTrending || priceRange < 10000) ? 'Filters applied' : 'No filter applied'}
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
                                {categories.map(cat => (
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

                                        {/* Show Subcategories if Selected */}
                                        {selectedCategory === cat.name && cat.subcategories && (
                                            <div className="ml-7 space-y-2 border-l-2 border-[#EBCDD0] pl-3 animate-in slide-in-from-left-2 duration-300">
                                                {cat.subcategories.map(sub => (
                                                    <button
                                                        key={sub.name}
                                                        onClick={() => setSelectedSubCategory(sub.name === selectedSubCategory ? null : sub.name)}
                                                        className={`block text-xs text-left w-full hover:text-black transition-colors ${selectedSubCategory === sub.name ? 'text-black font-bold' : 'text-gray-600'}`}
                                                    >
                                                        {sub.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
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
                                        onChange={(e) => setFilterNewArrivals(e.target.checked)}
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
                                        onChange={(e) => setFilterTrending(e.target.checked)}
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
                            <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-4">Max Price: ₹{priceRange.toLocaleString()}</h4>
                            <input
                                type="range"
                                min="500"
                                max="10000"
                                step="500"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D39A9F]"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-2">
                                <span>₹500</span>
                                <span>₹10,000+</span>
                            </div>
                        </div>

                        {/* 3. Availability (Mock) */}
                        <div>
                            <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-4">Availability</h4>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-[#D39A9F]" defaultChecked />
                                    <span className="text-sm text-gray-600">In Stock</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-[#D39A9F]" />
                                    <span className="text-sm text-gray-600">Out of Stock</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-[#EBCDD0] bg-white">
                        <button
                            onClick={() => { setSelectedCategory('All'); setSelectedSubCategory(null); setFilterNewArrivals(false); setFilterTrending(false); setPriceRange(10000); }}
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
                                    onClick={() => { setSortBy(option); setIsSortOpen(false); }}
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
