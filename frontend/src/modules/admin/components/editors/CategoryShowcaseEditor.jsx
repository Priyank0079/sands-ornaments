import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Tag, Search, CheckCircle, Edit2 } from 'lucide-react';
import { Input } from '../common/FormControls';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import ProductBrowserModal from './ProductBrowserModal';

// Import default assets
import catPendant from '../../../user/assets/cat_pendant_wine.png';
import catRing from '../../../user/assets/cat_ring_wine.png';
import catEarrings from '../../../user/assets/cat_earrings_wine.png';
import catBracelet from '../../../user/assets/cat_bracelet_wine.png';
import catAnklet from '../../../user/assets/cat_anklet_wine.png';
import catChain from '../../../user/assets/cat_chain_wine.png';

const CategoryShowcaseEditor = ({ sectionData, onSave, defaultItems = [] }) => {
    const navigate = useNavigate();
    const sectionId = sectionData?.id || 'category-showcase';
    const isCategoryShowcase = sectionId === 'category-showcase';

    // Default items to show if new
    const initialItemsFromProps = sectionData.items && sectionData.items.length > 0
        ? sectionData.items
        : (defaultItems.length > 0 ? defaultItems : [
            { id: '1', name: 'Pendants', path: '/category/pendants', image: catPendant, tag: '' },
            { id: '2', name: 'Rings', path: '/category/rings', image: catRing, tag: '' },
            { id: '3', name: 'Earrings', path: '/category/earrings', image: catEarrings, tag: '' },
            { id: '4', name: 'Bracelets', path: '/category/bracelets', image: catBracelet, tag: '' },
            { id: '5', name: 'Anklets', path: '/category/anklets', image: catAnklet, tag: '' },
            { id: '6', name: 'Chains', path: '/category/chains', image: catChain, tag: '' }
        ]);

    const [items, setItems] = useState(initialItemsFromProps);
    const [editingId, setEditingId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
    const [productPickerTarget, setProductPickerTarget] = useState(null);

    const parsePriceValue = (value) => {
        if (value === undefined || value === null) return null;
        const cleaned = String(value).replace(/[^0-9]/g, '');
        if (!cleaned) return null;
        const numeric = Number(cleaned);
        return Number.isFinite(numeric) ? numeric : null;
    };

    const getPriceMaxFromItem = (item) => {
        if (!item) return null;
        if (item.priceMax !== undefined && item.priceMax !== null && item.priceMax !== '') {
            return parsePriceValue(item.priceMax);
        }
        if (item.price !== undefined && item.price !== null && item.price !== '') {
            return parsePriceValue(item.price);
        }
        if (item.path && String(item.path).includes('price_max=')) {
            const query = item.path.split('price_max=')[1]?.split('&')[0];
            const parsed = parsePriceValue(query);
            if (parsed) return parsed;
        }
        if (item.name) {
            const parsed = parsePriceValue(item.name);
            if (parsed) return parsed;
        }
        return null;
    };

    const parseLimitValue = (value) => {
        if (value === undefined || value === null) return null;
        const cleaned = String(value).replace(/[^0-9]/g, '');
        if (!cleaned) return null;
        const numeric = Number(cleaned);
        return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
    };

    const getLimitFromItem = (item) => {
        if (!item) return null;
        if (item.limit !== undefined && item.limit !== null && item.limit !== '') {
            return parseLimitValue(item.limit);
        }
        if (item.path && String(item.path).includes('limit=')) {
            const query = item.path.split('limit=')[1]?.split('&')[0];
            const parsed = parseLimitValue(query);
            if (parsed) return parsed;
        }
        return null;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await adminService.getCategories();
            setCategories(data || []);
        };
        fetchCategories();
    }, []);

    // Initial Load & Restoration Logic
    useEffect(() => {
        // 1. Check if we have draft items from before navigation
        const draftItemsString = localStorage.getItem(`${sectionId}_draftItems`);
        let currentItems = draftItemsString ? JSON.parse(draftItemsString) : initialItemsFromProps;

        // 2. Check if we have returned with selected products
        const returnedProductsString = localStorage.getItem('temp_selected_products');
        const targetId = localStorage.getItem(`${sectionId}_targetId`);

        const shouldApplyReturn = Boolean(returnedProductsString && draftItemsString);

        if (shouldApplyReturn) {
            const products = JSON.parse(returnedProductsString);

            if (products.length > 0) {
                const product = products[0]; // Take first product
                const productId = product._id || product.id;
                const newItemData = {
                    productId,
                    name: product.name,
                    path: `/product/${productId}`,
                    image: product.image || (product.images && product.images[0]) || '',
                    tag: product.discount || ''
                };

                if (targetId) {
                    // Replace specific item
                    currentItems = currentItems.map(item =>
                        item.id === targetId ? { ...item, ...newItemData } : item
                    );
                } else {
                    // Add new item (fallback if no target, though we removed global add)
                    const newItem = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        ...newItemData
                    };
                    // Append new items, ensuring no duplicates based on productId if it exists
                    const existingProductIds = new Set(currentItems.map(item => item.productId).filter(Boolean));
                    if (!existingProductIds.has(newItem.productId)) {
                        currentItems = [...currentItems, newItem];
                    }
                }
            }

            // Cleanup (consume only for the originating section)
            localStorage.removeItem('temp_selected_products');
            localStorage.removeItem(`${sectionId}_draftItems`); // Clear draft after successful merge
            localStorage.removeItem(`${sectionId}_targetId`);
            setItems(currentItems);

        } else if (draftItemsString) {
            // If there are draft items but no new products, restore the draft
            setItems(currentItems);
        }
    }, [initialItemsFromProps, sectionId]);

    useEffect(() => {
        if (!isCategoryShowcase || categories.length === 0) return;
        setItems(prev => prev.map(item => {
            if (item.categoryId) return item;
            const resolved = getCategoryFromItem(item);
            if (!resolved) return item;
            return {
                ...item,
                categoryId: resolved._id,
                name: resolved.name,
                path: `/shop?category=${resolved._id}`,
                image: item.image || resolved.image || item.image
            };
        }));
    }, [categories, isCategoryShowcase]);

    useEffect(() => {
        if (sectionId !== 'price-range-showcase') return;
        setItems(prev => prev.map(item => {
            const priceMax = getPriceMaxFromItem(item);
            if (!priceMax) return item;
            return {
                ...item,
                priceMax,
                name: `Under INR ${priceMax}`,
                path: `/shop?price_max=${priceMax}`
            };
        }));
    }, [sectionId]);

    useEffect(() => {
        if (sectionId !== 'latest-drop') return;
        setItems(prev => prev.map(item => {
            const category = getCategoryFromItem(item);
            const existingLimit = getLimitFromItem(item);
            const limit = category ? (existingLimit || 12) : (existingLimit || '');
            const next = { ...item, limit };
            if (category) {
                next.categoryId = category._id;
                next.path = `/shop?category=${category._id}&limit=${limit}&sort=latest`;
                if (!next.name) next.name = category.name;
            } else if (!next.path) {
                next.path = '';
            }
            return next;
        }));
    }, [sectionId, categories]);

    useEffect(() => {
        if (sectionId !== 'most-gifted') return;
        setItems(prev => prev.map(item => {
            const category = getCategoryFromItem(item);
            const existingLimit = getLimitFromItem(item);
            const limit = category ? (existingLimit || 12) : (existingLimit || '');
            const next = { ...item, limit };
            if (category) {
                next.categoryId = category._id;
                next.path = `/shop?category=${category._id}&limit=${limit}&sort=most-sold`;
                if (!next.name) next.name = category.name;
            } else if (!next.path) {
                next.path = '';
            }
            return next;
        }));
    }, [sectionId, categories]);

    useEffect(() => {
        if (sectionId !== 'proposal-rings') return;
        setItems(prev => prev.map(item => {
            const category = getCategoryFromItem(item);
            const existingLimit = getLimitFromItem(item);
            const limit = category ? (existingLimit || 12) : (existingLimit || '');
            const next = { ...item, limit };
            if (category) {
                next.categoryId = category._id;
                next.path = `/shop?category=${category._id}&limit=${limit}&sort=latest`;
                if (!next.name) next.name = category.name;
            } else if (!next.path) {
                next.path = '';
            }
            return next;
        }));
    }, [sectionId, categories]);

    useEffect(() => {
        if (sectionId !== 'curated-for-you') return;
        setItems(prev => prev.map(item => {
            const limit = getLimitFromItem(item) || 12;
            const productIds = Array.isArray(item.productIds) ? item.productIds : [];
            const path = productIds.length > 0
                ? `/shop?products=${encodeURIComponent(productIds.join(','))}`
                : `/shop?limit=${limit}&sort=random`;
            return {
                ...item,
                limit,
                productIds,
                path
            };
        }));
    }, [sectionId]);

    useEffect(() => {
        if (sectionId !== 'style-it-your-way') return;
        setItems(prev => prev.map(item => {
            const limit = getLimitFromItem(item) || 12;
            const productIds = Array.isArray(item.productIds) ? item.productIds : [];
            const path = productIds.length > 0
                ? `/shop?products=${encodeURIComponent(productIds.join(','))}`
                : `/shop?limit=${limit}&sort=random`;
            return {
                ...item,
                limit,
                productIds,
                path
            };
        }));
    }, [sectionId]);

    const handleItemChange = (id, field, value) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                // If field is an index of extraImages, e.g., 'extraImage_0'
                if (field.startsWith('extraImage_')) {
                    const index = parseInt(field.split('_')[1]);
                    const newExtraImages = [...(item.extraImages || ['', '', ''])];
                    newExtraImages[index] = value;
                    return { ...item, extraImages: newExtraImages };
                }
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handleImageUpload = async (id, file, field = 'image') => {
        if (!file) return;
        const uploadedUrl = await adminService.uploadSectionImage(file);
        if (uploadedUrl) {
            handleItemChange(id, field, uploadedUrl);
            return;
        }
        toast.error("Image upload failed. Please try again.");
    };

    const removeItem = (id) => {
        const newItems = items.filter(item => item.id !== id);
        setItems(newItems);
        if (editingId === id) setEditingId(null);
        handleSave(newItems);
    };

    const saveCurrentItems = () => {
        setItems(prev => {
            handleSave(prev);
            return prev;
        });
    };

    const addItem = () => {
        const newItem = {
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            name: isCategoryShowcase ? '' : 'New Item',
            path: isCategoryShowcase ? '' : '/shop',
            image: '',
            tag: '',
            ...(sectionId === 'price-range-showcase' ? { priceMax: '' } : {}),
            ...(sectionId === 'latest-drop' ? { limit: '', categoryId: '' } : {}),
            ...(sectionId === 'most-gifted' ? { limit: '', categoryId: '' } : {}),
            ...(sectionId === 'proposal-rings' ? { limit: '', categoryId: '' } : {}),
            ...(sectionId === 'curated-for-you' ? { limit: 12, productIds: [] } : {}),
            ...(sectionId === 'style-it-your-way' ? { limit: 12, productIds: [] } : {})
        };
        const nextItems = [...items, newItem];
        setItems(nextItems);
        setEditingId(newItem.id);
        if (!isCategoryShowcase) {
            handleSave(nextItems);
        }
    };

    const handleRedirectToSelect = (itemId) => {
        // Save current state before navigating
        localStorage.setItem(`${sectionId}_draftItems`, JSON.stringify(items));
        if (itemId) {
            localStorage.setItem(`${sectionId}_targetId`, itemId);
        }
        navigate(`/admin/products?selectMode=true&returnUrl=/admin/sections/${sectionId}`);
    };

    const handleProductPickerOpen = (itemId) => {
        setProductPickerTarget(itemId);
        setIsProductPickerOpen(true);
    };

    const handleProductPickerSelect = (selectedItems) => {
        const selectedIds = (selectedItems || []).map(item => item.id || item._id).filter(Boolean);
        setItems(prev => prev.map(item => {
            if (item.id !== productPickerTarget) return item;
            const existing = new Set(item.productIds || []);
            selectedIds.forEach(id => existing.add(id));
            const productIds = Array.from(existing);
            const limit = getLimitFromItem(item) || 12;
            const path = productIds.length > 0
                ? `/shop?products=${encodeURIComponent(productIds.join(','))}`
                : `/shop?limit=${limit}&sort=random`;
            return { ...item, productIds, path };
        }));
        setIsProductPickerOpen(false);
        setProductPickerTarget(null);
    };

    const normalizeLabel = (value) => String(value || '')
        .trim()
        .toLowerCase()
        .replace(/['"]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const isRingCategory = (cat) => {
        const name = normalizeLabel(cat?.name || '');
        const slug = normalizeLabel(cat?.slug || cat?.path || '');
        return name.includes('ring') || slug.includes('ring');
    };

    const ringCategories = categories.filter(isRingCategory);

    const getCategoryFromPath = (path) => {
        if (!path || categories.length === 0) return null;
        try {
            if (path.startsWith('/category/')) {
                const slug = path.replace('/category/', '').split('?')[0];
                return categories.find(c => c.slug === slug || normalizeLabel(c.name) === slug) || null;
            }
            if (path.includes('category=')) {
                const query = path.split('category=')[1]?.split('&')[0];
                return categories.find(c => c.slug === query || c.name === query || normalizeLabel(c.name) === query || String(c._id) === String(query)) || null;
            }
        } catch (err) {
            return null;
        }
        return null;
    };

    const getCategoryFromItem = (item) => {
        if (!item) return null;
        if (item.categoryId && categories.length > 0) {
            const match = categories.find(c => String(c._id) === String(item.categoryId));
            if (match) return match;
        }
        if (item.name) {
            const byName = categories.find(c => normalizeLabel(c.name) === normalizeLabel(item.name));
            if (byName) return byName;
        }
        return getCategoryFromPath(item.path);
    };

    const validateItems = (nextItems) => {
        const invalid = nextItems
            .map(item => ({ item, category: getCategoryFromItem(item) }))
            .filter(({ category }) => category && (category.isActive === false || category.showInCollection === false));

        if (invalid.length > 0) {
            const names = invalid.map(({ category }) => category.name).join(', ');
            toast.error(`These categories are hidden or inactive: ${names}`);
            return false;
        }
        return true;
    };

    const handleSave = (nextItems) => {
        if (!validateItems(nextItems)) return;
        if (isCategoryShowcase) {
            const missing = nextItems.filter(item => !getCategoryFromItem(item));
            if (missing.length > 0) {
                toast.error('Select a category for each item before saving.');
                return;
            }
            const normalizedItems = nextItems.map((item) => {
                const category = getCategoryFromItem(item);
                if (!category) return item;
                return {
                    ...item,
                    categoryId: category._id,
                    name: category.name,
                    path: `/shop?category=${category._id}`,
                    image: item.image || category.image || item.image
                };
            });
            onSave({ items: normalizedItems });
            return;
        }
        if (sectionId === 'price-range-showcase') {
            const missing = nextItems.filter(item => !getPriceMaxFromItem(item));
            if (missing.length > 0) {
                const labels = missing.map(item => item.name || item.id || 'Item').join(', ');
                toast.error(`Enter a max price for each item before saving. Missing: ${labels}`);
                return;
            }
            const normalizedItems = nextItems.map((item) => {
                const priceMax = getPriceMaxFromItem(item);
                if (!priceMax) return item;
                return {
                    ...item,
                    priceMax,
                    name: `Under INR ${priceMax}`,
                    path: `/shop?price_max=${priceMax}`
                };
            });
            onSave({ items: normalizedItems });
            return;
        }
        if (sectionId === 'perfect-gift') {
            const normalizedItems = nextItems.map((item) => ({
                ...item,
                productIds: Array.isArray(item.productIds) ? item.productIds : []
            }));
            onSave({ items: normalizedItems });
            return;
        }
        if (sectionId === 'new-launch') {
            const normalizedItems = nextItems.map((item) => ({
                ...item,
                productIds: Array.isArray(item.productIds) ? item.productIds : []
            }));
            onSave({ items: normalizedItems });
            return;
        }
        if (sectionId === 'latest-drop') {
            const invalid = nextItems.filter(item => {
                const hasCategory = Boolean(getCategoryFromItem(item));
                const hasLimit = Boolean(getLimitFromItem(item));
                return hasCategory !== hasLimit;
            });
            if (invalid.length > 0) {
                const labels = invalid.map(item => item.name || item.id || 'Item').join(', ');
                toast.error(`For each card, set both Category and Limit. Missing: ${labels}`);
                return;
            }
            const normalizedItems = nextItems.map((item) => {
                const category = getCategoryFromItem(item);
                const limit = getLimitFromItem(item) || 12;
                if (!category) return { ...item, limit: getLimitFromItem(item) || '' };
                return {
                    ...item,
                    categoryId: category._id,
                    limit,
                    path: `/shop?category=${category._id}&limit=${limit}&sort=latest`
                };
            });
            onSave({ items: normalizedItems });
            return;
        }
        if (sectionId === 'most-gifted') {
            const invalid = nextItems.filter(item => {
                const hasCategory = Boolean(getCategoryFromItem(item));
                const hasLimit = Boolean(getLimitFromItem(item));
                return hasCategory !== hasLimit;
            });
            if (invalid.length > 0) {
                const labels = invalid.map(item => item.name || item.id || 'Item').join(', ');
                toast.error(`For each card, set both Category and Limit. Missing: ${labels}`);
                return;
            }
            const normalizedItems = nextItems.map((item) => {
                const category = getCategoryFromItem(item);
                const limit = getLimitFromItem(item) || 12;
                if (!category) return { ...item, limit: getLimitFromItem(item) || '' };
                return {
                    ...item,
                    categoryId: category._id,
                    limit,
                    path: `/shop?category=${category._id}&limit=${limit}&sort=most-sold`
                };
            });
            onSave({ items: normalizedItems });
            return;
        }
        if (sectionId === 'proposal-rings') {
            const invalid = nextItems.filter(item => {
                const hasCategory = Boolean(getCategoryFromItem(item));
                const hasLimit = Boolean(getLimitFromItem(item));
                return hasCategory !== hasLimit;
            });
            if (invalid.length > 0) {
                const labels = invalid.map(item => item.name || item.id || 'Item').join(', ');
                toast.error(`For each card, set both Category and Limit. Missing: ${labels}`);
                return;
            }
            const normalizedItems = nextItems.map((item) => {
                const category = getCategoryFromItem(item);
                const limit = getLimitFromItem(item) || 12;
                if (!category) return { ...item, limit: getLimitFromItem(item) || '' };
                return {
                    ...item,
                    categoryId: category._id,
                    limit,
                    path: `/shop?category=${category._id}&limit=${limit}&sort=latest`
                };
            });
            onSave({ items: normalizedItems });
            return;
        }
        if (sectionId === 'curated-for-you') {
            const missingLimit = nextItems.filter(item => !getLimitFromItem(item));
            if (missingLimit.length > 0) {
                const labels = missingLimit.map(item => item.name || item.id || 'Item').join(', ');
                toast.error(`Enter a limit for each item before saving. Missing: ${labels}`);
                return;
            }
            const normalizedItems = nextItems.map((item) => {
                const limit = getLimitFromItem(item) || 12;
                const productIds = Array.isArray(item.productIds) ? item.productIds : [];
                const path = productIds.length > 0
                    ? `/shop?products=${encodeURIComponent(productIds.join(','))}`
                    : `/shop?limit=${limit}&sort=random`;
                return {
                    ...item,
                    limit,
                    productIds,
                    path
                };
            });
            onSave({ items: normalizedItems });
            return;
        }
        if (sectionId === 'style-it-your-way') {
            const missingLimit = nextItems.filter(item => !getLimitFromItem(item));
            if (missingLimit.length > 0) {
                const labels = missingLimit.map(item => item.name || item.id || 'Item').join(', ');
                toast.error(`Enter a limit for each item before saving. Missing: ${labels}`);
                return;
            }
            const normalizedItems = nextItems.map((item) => {
                const limit = getLimitFromItem(item) || 12;
                const productIds = Array.isArray(item.productIds) ? item.productIds : [];
                const path = productIds.length > 0
                    ? `/shop?products=${encodeURIComponent(productIds.join(','))}`
                    : `/shop?limit=${limit}&sort=random`;
                return {
                    ...item,
                    limit,
                    productIds,
                    path
                };
            });
            onSave({ items: normalizedItems });
            return;
        }
        const normalizedItems = nextItems.map((item) => {
            if (sectionId === 'nav-gifts-for' || sectionId === 'nav-occasions') {
                const label = item.name || item.label || '';
                const slug = String(label || '')
                    .trim()
                    .toLowerCase()
                    .replace(/['"]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                const key = sectionId === 'nav-gifts-for' ? 'filter' : 'occasion';
                const path = item.path && item.path.trim().length > 0
                    ? item.path
                    : `/shop?${key}=${encodeURIComponent(slug)}`;
                return { ...item, path };
            }
            return item;
        });
        onSave({ items: normalizedItems });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {(sectionId === 'perfect-gift' || sectionId === 'new-launch' || sectionId === 'curated-for-you' || sectionId === 'style-it-your-way') && (
                <ProductBrowserModal
                    isOpen={isProductPickerOpen}
                    onClose={() => {
                        setIsProductPickerOpen(false);
                        setProductPickerTarget(null);
                    }}
                    onSelect={handleProductPickerSelect}
                    selectedIds={items.find(item => item.id === productPickerTarget)?.productIds || []}
                    maxSelection={50}
                />
            )}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h3 className="font-display text-sm md:text-base font-bold text-gray-800">Manage Items</h3>
                    <p className="text-[10px] md:text-xs text-gray-400">Add, edit, or remove items in this section</p>
                </div>
                <button
                    onClick={addItem}
                    className="flex items-center gap-2 bg-[#3E2723] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#2b1b18] transition-colors"
                >
                    <Plus size={14} /> Add Item
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => {
                    const isEditing = editingId === item.id;

                    return (
                        <div key={item.id} className={`bg-white border rounded-xl p-4 shadow-sm relative group animate-in zoom-in-95 duration-200 transition-all ${isEditing ? 'border-[#3E2723] ring-1 ring-[#3E2723]' : 'border-gray-200 hover:shadow-md'}`}>

                            {/* Header: Item # + Edit/Save Button */}
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${isEditing ? 'bg-[#3E2723] text-white' : 'text-[#3E2723] bg-[#3E2723]/5'}`}>
                                    Item #{index + 1}
                                </span>
                                <div className="flex gap-2">
                                    {isEditing && (
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (isEditing) {
                                                saveCurrentItems();
                                            }
                                            setEditingId(isEditing ? null : item.id);
                                        }}
                                        className={`p-1.5 rounded-lg transition-colors ${isEditing ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                        title={isEditing ? "Save" : "Edit"}
                                    >
                                        {isEditing ? <CheckCircle size={16} /> : <Edit2 size={16} />}
                                    </button>
                                </div>
                            </div>

                            {isEditing ? (
                                /* EDIT MODE */
                                <div className="space-y-4">
                                    {/* Main Image */}
                                    <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group/img">
                                        {item.image ? (
                                            <>
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                <button onClick={() => handleItemChange(item.id, 'image', '')} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center p-4">
                                                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <label className="cursor-pointer px-3 py-1.5 bg-[#3E2723] text-white text-xs font-bold rounded-lg block">
                                                    Upload Main
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(item.id, e.target.files[0])} />
                                                </label>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-white/95 p-2 border-t border-gray-100">
                                            <Input placeholder="URL..." value={item.image} onChange={(e) => handleItemChange(item.id, 'image', e.target.value)} className="text-xs h-8" />
                                        </div>
                                    </div>

                                    {/* Select Product Button (skip for category showcase + nav gifts/occasions + price range + perfect gift + new launch) */}
                                    {!isCategoryShowcase && sectionId !== 'nav-gifts-for' && sectionId !== 'nav-occasions' && sectionId !== 'price-range-showcase' && sectionId !== 'perfect-gift' && sectionId !== 'new-launch' && sectionId !== 'latest-drop' && sectionId !== 'most-gifted' && sectionId !== 'proposal-rings' && sectionId !== 'curated-for-you' && sectionId !== 'style-it-your-way' && (
                                        <button
                                            onClick={() => handleRedirectToSelect(item.id)}
                                            className="w-full py-2 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center gap-2 uppercase tracking-widest"
                                        >
                                            <Search size={14} /> Product Link
                                        </button>
                                    )}

                                    <div className="space-y-3">
                                        {isCategoryShowcase && (
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                                                <select
                                                    value={getCategoryFromItem(item)?._id || ''}
                                                    onChange={(e) => {
                                                        const selected = categories.find(c => String(c._id) === String(e.target.value));
                                                        if (!selected) return;
                                                        setItems(prev => prev.map(entry => {
                                                            if (entry.id !== item.id) return entry;
                                                            return {
                                                                ...entry,
                                                                categoryId: selected._id,
                                                                name: selected.name,
                                                                path: `/shop?category=${selected._id}`,
                                                                image: entry.image || selected.image || entry.image
                                                            };
                                                        }));
                                                    }}
                                                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723]/20"
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat._id} value={cat._id}>
                                                            {cat.name}{cat.isActive === false ? ' (Inactive)' : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        {(sectionId === 'latest-drop' || sectionId === 'most-gifted' || sectionId === 'proposal-rings') && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                                                    <select
                                                        value={getCategoryFromItem(item)?._id || ''}
                                                        onChange={(e) => {
                                                            const sourceCategories = sectionId === 'proposal-rings' ? ringCategories : categories;
                                                            const selected = sourceCategories.find(c => String(c._id) === String(e.target.value));
                                                            if (!selected) return;
                                                            const limit = getLimitFromItem(item) || 12;
                                                            setItems(prev => prev.map(entry => {
                                                                if (entry.id !== item.id) return entry;
                                                                return {
                                                                    ...entry,
                                                                    categoryId: selected._id,
                                                                    name: entry.name || selected.name,
                                                                    path: sectionId === 'most-gifted'
                                                                        ? `/shop?category=${selected._id}&limit=${limit}&sort=most-sold`
                                                                        : `/shop?category=${selected._id}&limit=${limit}&sort=latest`
                                                                };
                                                            }));
                                                        }}
                                                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723]/20"
                                                    >
                                                        <option value="">Select Category</option>
                                                        {(sectionId === 'proposal-rings' ? ringCategories : categories).map(cat => (
                                                            <option key={cat._id} value={cat._id}>
                                                                {cat.name}{cat.isActive === false ? ' (Inactive)' : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <Input
                                                    label="Number of Products"
                                                    type="number"
                                                    min="1"
                                                    value={item.limit ?? ''}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        const numeric = raw === '' ? '' : Number(raw);
                                                        setItems(prev => prev.map(entry => {
                                                            if (entry.id !== item.id) return entry;
                                                            const category = getCategoryFromItem(entry);
                                                            const limit = numeric || 0;
                                                            return {
                                                                ...entry,
                                                                limit: numeric,
                                                                path: category
                                                                    ? `/shop?category=${category._id}&limit=${limit}&sort=${sectionId === 'most-gifted' ? 'most-sold' : 'latest'}`
                                                                    : entry.path
                                                            };
                                                        }));
                                                    }}
                                                    placeholder="12"
                                                />
                                            </div>
                                        )}
                                        {sectionId === 'curated-for-you' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Selected Products</label>
                                                    <button
                                                        onClick={() => handleProductPickerOpen(item.id)}
                                                        className="w-full py-2 bg-gray-50 text-gray-700 text-[10px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 uppercase tracking-widest"
                                                    >
                                                        {Array.isArray(item.productIds) && item.productIds.length > 0
                                                            ? `Selected ${item.productIds.length} Products`
                                                            : 'Select Products'}
                                                    </button>
                                                </div>
                                                <Input
                                                    label="Number of Products"
                                                    type="number"
                                                    min="1"
                                                    value={item.limit ?? ''}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        const numeric = raw === '' ? '' : Number(raw);
                                                        setItems(prev => prev.map(entry => {
                                                            if (entry.id !== item.id) return entry;
                                                            const productIds = Array.isArray(entry.productIds) ? entry.productIds : [];
                                                            const limit = numeric || 0;
                                                            const path = productIds.length > 0
                                                                ? `/shop?products=${encodeURIComponent(productIds.join(','))}`
                                                                : `/shop?limit=${limit}&sort=random`;
                                                            return {
                                                                ...entry,
                                                                limit: numeric,
                                                                path
                                                            };
                                                        }));
                                                    }}
                                                    placeholder="12"
                                                />
                                            </div>
                                        )}
                                        {sectionId === 'style-it-your-way' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Selected Products</label>
                                                    <button
                                                        onClick={() => handleProductPickerOpen(item.id)}
                                                        className="w-full py-2 bg-gray-50 text-gray-700 text-[10px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 uppercase tracking-widest"
                                                    >
                                                        {Array.isArray(item.productIds) && item.productIds.length > 0
                                                            ? `Selected ${item.productIds.length} Products`
                                                            : 'Select Products'}
                                                    </button>
                                                </div>
                                                <Input
                                                    label="Number of Products"
                                                    type="number"
                                                    min="1"
                                                    value={item.limit ?? ''}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        const numeric = raw === '' ? '' : Number(raw);
                                                        setItems(prev => prev.map(entry => {
                                                            if (entry.id !== item.id) return entry;
                                                            const productIds = Array.isArray(entry.productIds) ? entry.productIds : [];
                                                            const limit = numeric || 0;
                                                            const path = productIds.length > 0
                                                                ? `/shop?products=${encodeURIComponent(productIds.join(','))}`
                                                                : `/shop?limit=${limit}&sort=random`;
                                                            return {
                                                                ...entry,
                                                                limit: numeric,
                                                                path
                                                            };
                                                        }));
                                                    }}
                                                    placeholder="12"
                                                />
                                            </div>
                                        )}
                                        {!isCategoryShowcase && sectionId !== 'price-range-showcase' && (
                                            <Input
                                                label={sectionId === 'style-it-your-way' ? "Title" : "Name"}
                                                value={item.name}
                                                onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                                placeholder="Name"
                                            />
                                        )}
                                        {isCategoryShowcase && (
                                            <Input
                                                label="Category Name"
                                                value={item.name}
                                                readOnly
                                                placeholder="Select a category"
                                                className="bg-gray-50 text-gray-500 cursor-not-allowed"
                                            />
                                        )}
                                        {sectionId === 'price-range-showcase' && (
                                            <div className="space-y-2">
                                                <Input
                                                    label="Max Price (INR)"
                                                    type="number"
                                                    min="0"
                                                    value={item.priceMax ?? ''}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        const numeric = raw === '' ? '' : Number(raw);
                                                        setItems(prev => prev.map(entry => {
                                                            if (entry.id !== item.id) return entry;
                                                            return {
                                                                ...entry,
                                                                priceMax: numeric,
                                                                name: numeric ? `Under INR ${numeric}` : entry.name
                                                            };
                                                        }));
                                                    }}
                                                    placeholder="999"
                                                />
                                                <Input
                                                    label="Display Label"
                                                    value={item.name || ''}
                                                    readOnly
                                                    placeholder="Under INR 999"
                                                    className="bg-gray-50 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                        )}
                                        {(sectionId === 'perfect-gift' || sectionId === 'new-launch') && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Selected Products</label>
                                                <button
                                                    onClick={() => handleProductPickerOpen(item.id)}
                                                    className="w-full py-2 bg-gray-50 text-gray-700 text-[10px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 uppercase tracking-widest"
                                                >
                                                    {Array.isArray(item.productIds) && item.productIds.length > 0
                                                        ? `Selected ${item.productIds.length} Products`
                                                        : 'Select Products'}
                                                </button>
                                            </div>
                                        )}
                                        <Input
                                            label={sectionId === 'style-it-your-way' ? "Subtitle" : "Badge"}
                                            value={item.tag}
                                            onChange={(e) => handleItemChange(item.id, 'tag', e.target.value)}
                                            placeholder="..."
                                        />

                                        {sectionId === 'style-it-your-way' && (
                                            <div className="pt-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">3 Mini Photos</label>
                                                <div className="flex gap-2">
                                                    {[0, 1, 2].map((i) => (
                                                        <div key={i} className="flex-1 aspect-square rounded-lg border border-dashed border-gray-300 relative group/mini overflow-hidden bg-gray-50">
                                                            {item.extraImages?.[i] ? (
                                                                <>
                                                                    <img src={item.extraImages[i]} className="w-full h-full object-cover" alt="" />
                                                                    <button onClick={() => handleItemChange(item.id, `extraImage_${i}`, '')} className="absolute inset-0 bg-red-500/20 opacity-0 group-hover/mini:opacity-100 flex items-center justify-center">
                                                                        <Trash2 size={12} className="text-white bg-red-500 p-1 rounded-full shadow-lg" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                                                    <Plus size={14} className="text-gray-400" />
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(item.id, e.target.files[0], `extraImage_${i}`)} />
                                                                </label>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* VIEW MODE */
                                <div className="space-y-3 p-4">
                                    {sectionId === 'style-it-your-way' ? (
                                        <div className="space-y-4">
                                            <div className="aspect-[16/9] md:aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden relative shadow-sm border border-gray-100">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                {(item.extraImages || ['', '', '']).map((img, i) => (
                                                    <div key={i} className="w-10 h-10 md:w-16 md:h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shadow-sm">
                                                        {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[#C9A24D] text-[10px] font-bold uppercase tracking-widest">{item.tag}</p>
                                                <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.name}</h3>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryShowcaseEditor;
