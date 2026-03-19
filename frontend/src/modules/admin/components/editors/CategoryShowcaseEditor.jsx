import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Tag, Search, CheckCircle, Edit2 } from 'lucide-react';
import { Input } from '../common/FormControls';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

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
            const resolved = getCategoryFromPath(item.path);
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

    const addItem = () => {
        const newItem = {
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            name: isCategoryShowcase ? '' : 'New Item',
            path: isCategoryShowcase ? '' : '/shop',
            image: '',
            tag: ''
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

    const getCategoryFromPath = (path) => {
        if (!path || categories.length === 0) return null;
        try {
            if (path.startsWith('/category/')) {
                const slug = path.replace('/category/', '').split('?')[0];
                return categories.find(c => c.slug === slug) || null;
            }
            if (path.includes('category=')) {
                const query = path.split('category=')[1]?.split('&')[0];
                return categories.find(c => c.slug === query || c.name === query) || null;
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

    // SPECIAL UI FOR LATEST DROP (Streamlined List + Add Button)
    if (sectionId === 'latest-drop') {
        return (
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
                {/* Simplified Header with Add Button */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="font-display font-bold text-gray-800 text-lg">Featured Products</h3>
                        <p className="text-xs text-gray-400">{items.length} products currently displayed in Latest Drop</p>
                    </div>
                    <button
                        onClick={() => handleRedirectToSelect()}
                        className="flex items-center justify-center gap-2 bg-[#722F37] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#5a252c] transition-all shadow-md active:scale-95"
                    >
                        <Plus size={18} /> Add New Product
                    </button>
                </div>

                {/* List View of Products */}
                <div className="grid grid-cols-1 gap-3">
                    {items.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-12 text-center">
                            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 font-medium">No products added yet.</p>
                            <button
                                onClick={() => handleRedirectToSelect()}
                                className="text-[#722F37] text-sm font-bold mt-2 hover:underline"
                            >
                                Click here to add your first product
                            </button>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all animate-in slide-in-from-left-4 duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 shadow-inner">
                                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-[#722F37] transition-colors">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">ID: {item.productId?.slice(-6)}</span>
                                            <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">Active</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleRedirectToSelect(item.id)}
                                        className="p-2.5 text-gray-400 hover:text-[#722F37] hover:bg-[#722F37]/5 rounded-xl transition-all"
                                        title="Change Product"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Remove"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <p className="text-center text-gray-400 text-[10px] uppercase tracking-[0.2em] pt-4">
                        End of product list
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
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
                                                handleSave(items);
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

                                    {/* Select Product Button (skip for category showcase + nav gifts/occasions) */}
                                    {!isCategoryShowcase && sectionId !== 'nav-gifts-for' && sectionId !== 'nav-occasions' && (
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
                                        {!isCategoryShowcase && (
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
