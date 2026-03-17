import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { Upload, X, Save, Plus, ChevronRight } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { FormSection, Input, Select } from '../components/common/FormControls';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
];

const ItemEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const typeParam = searchParams.get('type');

    // Determine context
    const isCategoryPath = location.pathname.includes('/categories');
    const isSubcategory = typeParam === 'subcategory';
    const isCategory = isCategoryPath && !isSubcategory;
    const isProduct = location.pathname.includes('/products');
    const isViewMode = location.pathname.includes('/view/');

    const resourceType = isCategory ? 'Category' : (isSubcategory ? 'Subcategory' : 'Product');
    const backPath = isProduct 
        ? '/admin/products' 
        : (isSubcategory && formData.parentId 
            ? `/admin/categories/view/${formData.parentId}` 
            : '/admin/categories');

    const isEditMode = Boolean(id) && !isViewMode;

    // Mock initial data for lists
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]); // Store actual File objects

    const [formData, setFormData] = useState({
        name: '',
        parentId: '',
        subCategoryId: '',
        description: '',
        stylingTips: '',
        showInCollection: true,
        showInNavbar: true,
        metal: metalParam || 'silver', // Default to param or silver
        // Product Display Labels
        cardLabel: '',
        cardBadge: '',
        // Product Specific Fields
        material: '925 Silver',
        weight: '', // New field
        specifications: '', // New field
        supplierInfo: '',  // New field
        originalPrice: '',
        sellingPrice: '',
        discount: 0,
        stock: '',
        status: 'Active',
        images: [], // Multiple images
        sizes: [], // Selected sizes
        variantStock: {}, // Stock per variant
        categories: [{ id: Date.now(), category: '', subcategory: '' }], // Multiple categories for product
        tags: {
            isNewArrival: false,
            isMostGifted: false,
            isNewLaunch: false
        }
    });

    const sizeOptions = isProduct ? [
        '5', '6', '7', '8', '9', '10', '2.2', '2.4', '2.6', 'Adjustable'
    ] : [];

    // Auto-calculate discount
    useEffect(() => {
        if (isProduct && formData.originalPrice && formData.sellingPrice) {
            const original = parseFloat(formData.originalPrice);
            const selling = parseFloat(formData.sellingPrice);
            if (original > selling) {
                const disc = Math.round(((original - selling) / original) * 100);
                setFormData(prev => ({ ...prev, discount: disc }));
            } else {
                setFormData(prev => ({ ...prev, discount: 0 }));
            }
        }
    }, [formData.originalPrice, formData.sellingPrice, isProduct]);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const cats = await adminService.getCategories();
                setCategories(cats);
                // Flatten subcategories for easy access
                const allSubs = cats.flatMap(c => c.subcategories || []);
                setSubcategories(allSubs);
            } catch (err) {
                toast.error("Failed to load categories");
            }
        };
        fetchMetadata();

        if (isEditMode || isViewMode) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    let data; // Declare data here
                    if (isCategory) {
                        data = await adminService.getCategoryById(id);
                        setFormData({
                            name: data.name,
                            description: data.description || '',
                            showInCollection: data.showInCollection,
                            showInNavbar: data.showInNavbar,
                            isActive: data.isActive,
                            metal: data.metal || 'silver', // Populate metal from fetched data
                            images: data.image ? [data.image] : []
                        });
                    } else if (isSubcategory) {
                        // We need a getSubcategoryById or similar, but often it's included in parent or fetched directly
                        // For now assuming adminService has getSubcategoryById or we can find it in categories
                        const cats = await adminService.getCategories();
                        const sub = cats.flatMap(c => c.subcategories || []).find(s => s._id === id);
                        if (sub) {
                            setFormData({
                                name: sub.name,
                                parentId: sub.parentCategory?._id || sub.parentCategory,
                                showInCollection: sub.showInCollection !== false,
                                showInNavbar: sub.showInNavbar !== false,
                                isActive: sub.isActive !== false,
                                images: sub.image ? [sub.image] : []
                            });
                        }
                    } else if (isProduct) {
                        data = await adminService.getProductById(id);
                        setFormData({
                            ...data,
                            originalPrice: data.variants?.[0]?.mrp || '',
                            sellingPrice: data.variants?.[0]?.price || '',
                            stock: data.variants?.[0]?.stock || '',
                            discount: data.variants?.[0]?.discount || 0,
                            categories: data.categories.map(c => ({
                                id: Math.random(),
                                category: c.categoryId?._id || c.categoryId,
                                subcategoryId: c.subcategoryId?._id || c.subcategoryId
                            }))
                        });
                    }
                } catch (err) {
                    toast.error("Failed to fetch data");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }

        const searchParams = new URLSearchParams(location.search);
        const parentParam = searchParams.get('parent');
        if (!isEditMode && !isViewMode && parentParam) {
            setFormData(prev => ({ ...prev, parentId: parentParam }));
        }
    }, [id, isEditMode, isViewMode, isCategory, isSubcategory, isProduct, location.search]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(prev => [...prev, ...files].slice(0, 5));
        
        const previews = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...previews].slice(0, 5)
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    // Category Management for Products
    const addCategory = () => {
        setFormData(prev => ({
            ...prev,
            categories: [...prev.categories, { id: Date.now(), category: '', subcategory: '' }]
        }));
    };

    const removeCategory = (id) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c.id !== id)
        }));
    };

    const handleCategoryChange = (valId, field, value) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map(c => {
                if (c.id === valId) {
                    if (field === 'category') {
                        return { ...c, category: value, subcategory: '' }; // Reset subcategory
                    }
                    return { ...c, [field]: value };
                }
                return c;
            })
        }));
    };

    const getAvailableSubcategories = (categoryId) => {
        const cat = categories.find(c => c._id === categoryId);
        return cat ? cat.subcategories : [];
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            let res;
            if (isCategory) {
                const form = new FormData();
                form.append('name', formData.name);
                form.append('description', formData.description);
                form.append('metal', formData.metal); // Append metal to form data
                form.append('showInNavbar', formData.showInNavbar);
                form.append('showInCollection', formData.showInCollection);
                if (imageFiles.length > 0) {
                    imageFiles.forEach(file => form.append('image', file));
                }

                if (isEditMode) {
                    const success = await adminService.updateCategory(id, form);
                    if (success) toast.success("Category updated");
                    else throw new Error("Update failed");
                } else {
                    res = await adminService.createCategory(form);
                    if (res.success) toast.success("Category created");
                    else throw new Error(res.message);
                }
            } else if (isSubcategory) {
                const form = new FormData();
                form.append('name', formData.name);
                form.append('description', formData.description);
                form.append('parentCategory', formData.parentId);
                form.append('showInNavbar', formData.showInNavbar);
                form.append('showInCollection', formData.showInCollection);
                if (imageFiles.length > 0) {
                    imageFiles.forEach(file => form.append('image', file));
                }

                if (isEditMode) {
                    const success = await adminService.updateSubcategory(id, form);
                    if (success) toast.success("Subcategory updated");
                    else throw new Error("Update failed");
                } else {
                    res = await adminService.createSubcategory(form);
                    if (res.success) toast.success("Subcategory created");
                    else throw new Error(res.message);
                }
            } else {
                // Product Management
                const mappedCategories = formData.categories
                    .filter(c => c.category)
                    .map(c => ({
                        categoryId: c.category,
                        subcategoryId: c.subcategoryId || null
                    }));

                const variants = [{
                    name: 'Default',
                    mrp: parseFloat(formData.originalPrice) || 0,
                    price: parseFloat(formData.sellingPrice) || 0,
                    stock: parseInt(formData.stock) || 0,
                    discount: parseInt(formData.discount) || 0
                }];

                const productForm = new FormData();
                Object.keys(formData).forEach(key => {
                    if (!['images', 'categories', 'tags', 'variants', 'originalPrice', 'sellingPrice', 'stock', 'discount'].includes(key)) {
                        if (formData[key] !== undefined) productForm.append(key, formData[key]);
                    }
                });

                productForm.append('categories', JSON.stringify(mappedCategories));
                productForm.append('variants', JSON.stringify(variants));
                productForm.append('tags', JSON.stringify(formData.tags));

                if (imageFiles.length > 0) {
                    imageFiles.forEach(file => productForm.append('images', file));
                }

                if (isEditMode) {
                    res = await adminService.updateProduct(id, productForm);
                    if (res.success) toast.success("Product updated");
                    else throw new Error(res.message);
                } else {
                    res = await adminService.createProduct(productForm);
                    if (res.success) toast.success("Product published");
                    else throw new Error(res.message);
                }
            }
            navigate(backPath);
        } catch (err) {
            toast.error(err.message || "Operation failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 md:p-8">
                <PageHeader
                    title={isViewMode ? `View ${resourceType}` : (isEditMode ? `Edit ${resourceType}` : `Create New ${resourceType}`)}
                    subtitle={isViewMode ? `Viewing details for ${formData.name || id}` : (isEditMode ? `ID: ${id || 'N/A'}` : `Setup your new ${resourceType.toLowerCase()} details`)}
                    backPath={backPath}
                    action={!isViewMode ? {
                        label: isEditMode ? 'Save Changes' : `Publish ${resourceType}`,
                        onClick: handleSubmit
                    } : undefined}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Side/Utility Column (Spans 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <FormSection title={isProduct ? "Visual Gallery (Max 5)" : "Cover Image"}>
                            <div className="grid grid-cols-2 gap-3">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 shadow-sm">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        {!isViewMode && (
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!isViewMode && formData.images.length < (isProduct ? 5 : 1) && (
                                    <label className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#3E2723] hover:bg-[#3E2723]/5 transition-all group">
                                        <Upload className="w-5 h-5 text-gray-300 group-hover:text-[#3E2723]" />
                                        <span className="text-[9px] font-bold text-gray-400 mt-1">Add Shot</span>
                                        <input type="file" multiple={isProduct} className="hidden" onChange={handleImageUpload} accept="image/*" disabled={isViewMode} />
                                    </label>
                                )}
                            </div>
                        </FormSection>

                        {isProduct && (
                            <>
                                <FormSection title="Card Display Labels">
                                    <div className="space-y-4">
                                        <Input
                                            label="Top Label (Left)"
                                            value={formData.cardLabel}
                                            onChange={(e) => setFormData({ ...formData, cardLabel: e.target.value })}
                                            placeholder="e.g. 9 TO 5 SILVER JEWELLERY"
                                            disabled={isViewMode}
                                        />
                                        <Input
                                            label="Corner Badge (Right)"
                                            value={formData.cardBadge}
                                            onChange={(e) => setFormData({ ...formData, cardBadge: e.target.value })}
                                            placeholder="e.g. NEW"
                                            disabled={isViewMode}
                                        />
                                    </div>
                                </FormSection>

                                <FormSection title="Specifications & Pricing" className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Material"
                                                value={formData.material}
                                                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                                placeholder="925 Sterling Silver"
                                                disabled={isViewMode}
                                            />
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-gray-700 tracking-wide">Weight & Unit</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.weight}
                                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                        placeholder="5.40"
                                                        disabled={isViewMode}
                                                        className="flex-1 bg-white border border-gray-300 rounded-lg py-2.5 px-3.5 text-sm text-gray-900 focus:outline-none focus:border-[#3E2723] focus:ring-2 focus:ring-[#3E2723]/10 transition-all shadow-sm"
                                                    />
                                                    <select
                                                        value={formData.weightUnit || 'Grams'}
                                                        onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                                                        disabled={isViewMode}
                                                        className="w-24 bg-white border border-gray-300 rounded-lg py-2.5 px-2 text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#3E2723] focus:ring-2 focus:ring-[#3E2723]/10 transition-all shadow-sm cursor-pointer"
                                                    >
                                                        <option value="Grams">Grams</option>
                                                        <option value="Carats">Carat</option>
                                                        <option value="Milligrams">mg</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <Input
                                            label="Original Price (₹)"
                                            type="number"
                                            value={formData.originalPrice}
                                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                            placeholder="5000"
                                            disabled={isViewMode}
                                        />
                                        <Input
                                            label="Offer Price (₹)"
                                            type="number"
                                            value={formData.sellingPrice}
                                            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                            placeholder="3999"
                                            disabled={isViewMode}
                                        />
                                        <div className="space-y-1.5">
                                            <label className="block ml-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Computed Discount</label>
                                            <div className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-bold text-[#3E2723] flex items-center justify-between shadow-sm">
                                                <span className="text-[10px] text-gray-400">OFFER:</span>
                                                <span>{formData.discount}% OFF</span>
                                            </div>
                                        </div>
                                        <Input
                                            label="Stock Quantity"
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            placeholder="100"
                                            disabled={isViewMode}
                                        />
                                    </div>
                                </FormSection>
                            </>
                        )}
                    </div>

                    {/* Primary Content Column (Spans 8) */}
                    <div className="lg:col-span-8 space-y-6">
                        <FormSection title="Core Information" className="space-y-6">
                            <Input
                                label={isCategory ? "Category Name" : (isSubcategory ? "Subcategory Name" : "Product Title")}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={isCategory ? "e.g. Gold" : (isSubcategory ? "e.g. Rings" : "e.g. Gold Floral Ring")}
                                disabled={isViewMode}
                            />

                            {isCategory && (
                                <>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all flex-1 ${formData.showInCollection
                                            ? 'border-[#8D6E63] bg-[#8D6E63]/5 ring-1 ring-[#8D6E63]/20'
                                            : 'border-gray-200 hover:border-[#8D6E63]/30 hover:bg-gray-50'
                                            } ${isViewMode ? 'pointer-events-none opacity-80' : ''}`}>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.showInCollection
                                                ? 'bg-[#8D6E63] border-[#8D6E63]'
                                                : 'bg-white border-gray-300'
                                                }`}>
                                                {formData.showInCollection && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={formData.showInCollection}
                                                onChange={(e) => setFormData({ ...formData, showInCollection: e.target.checked })}
                                                className="hidden"
                                                disabled={isViewMode}
                                            />
                                            <span className={`text-sm font-medium ${formData.showInCollection ? 'text-[#3E2723]' : 'text-gray-700'}`}>Show in Collection</span>
                                        </label>

                                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all flex-1 ${formData.showInNavbar
                                            ? 'border-[#8D6E63] bg-[#8D6E63]/5 ring-1 ring-[#8D6E63]/20'
                                            : 'border-gray-200 hover:border-[#8D6E63]/30 hover:bg-gray-50'
                                            } ${isViewMode ? 'pointer-events-none opacity-80' : ''}`}>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.showInNavbar
                                                ? 'bg-[#8D6E63] border-[#8D6E63]'
                                                : 'bg-white border-gray-300'
                                                }`}>
                                                {formData.showInNavbar && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={formData.showInNavbar}
                                                onChange={(e) => setFormData({ ...formData, showInNavbar: e.target.checked })}
                                                className="hidden"
                                                disabled={isViewMode}
                                            />
                                            <span className={`text-sm font-medium ${formData.showInNavbar ? 'text-[#3E2723]' : 'text-gray-700'}`}>Show in Navbar</span>
                                        </label>
                                    </div>

                                    <Select
                                        label="Category Metal (Internal)"
                                        value={formData.metal}
                                        onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                                        options={[
                                            { label: 'Silver (Ag)', value: 'silver' },
                                            { label: 'Gold (Au)', value: 'gold' },
                                            { label: 'Platinum (Pt)', value: 'platinum' }
                                        ]}
                                        disabled={isViewMode}
                                    />
                                </>
                            )}

                            {isSubcategory && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Select
                                        label="Parent Category"
                                        value={formData.parentId}
                                        onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                        options={[
                                            { label: 'Select Parent Category...', value: '' },
                                            ...categories.map(c => ({ label: c.name, value: c.id || c._id }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                </div>
                            )}

                            {isProduct && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block ml-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Categories</label>
                                        {!isViewMode && (
                                            <button
                                                type="button"
                                                onClick={addCategory}
                                                className="text-[10px] font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-1 hover:underline"
                                            >
                                                <Plus size={14} /> Add Category
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {formData.categories.map((cat, index) => (
                                            <div key={cat.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 relative group animate-in fade-in slide-in-from-top-2">
                                                <div className="flex gap-4">
                                                    <div className="flex-1 space-y-1.5">
                                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Select Category</label>
                                                        <select
                                                            value={cat.category}
                                                            onChange={(e) => handleCategoryChange(cat.id, 'category', e.target.value)}
                                                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723]/20 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                                                            disabled={isViewMode}
                                                        >
                                                            <option value="">Choose Material...</option>
                                                            {categories.map(c => (
                                                                <option key={c._id} value={c._id}>
                                                                    {c.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex-1 space-y-1.5">
                                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Select Subcategory</label>
                                                        <select
                                                            value={cat.subcategoryId}
                                                            onChange={(e) => handleCategoryChange(cat.id, 'subcategoryId', e.target.value)}
                                                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723]/20 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                                                            disabled={isViewMode || !cat.category}
                                                        >
                                                            <option value="">Choose Subcategory...</option>
                                                            {getAvailableSubcategories(cat.category).map(s => (
                                                                <option key={s._id} value={s._id}>{s.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Custom Category/Subcategory Inputs */}
                                                {(cat.category === 'other' || cat.category === 'Other') && (
                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-1 duration-200">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-wider">Custom Category Name</label>
                                                            <input
                                                                type="text"
                                                                value={cat.customCategory || ''}
                                                                onChange={(e) => handleCategoryChange(cat.id, 'customCategory', e.target.value)}
                                                                className="w-full bg-white border border-[#EFEBE9] rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723]/20 transition-all"
                                                                placeholder="e.g. Traditional Bangles"
                                                                disabled={isViewMode}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-wider">Custom Sub-Category</label>
                                                            <input
                                                                type="text"
                                                                value={cat.customSubcategory || ''}
                                                                onChange={(e) => handleCategoryChange(cat.id, 'customSubcategory', e.target.value)}
                                                                className="w-full bg-white border border-[#EFEBE9] rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723]/20 transition-all"
                                                                placeholder="e.g. Handmade"
                                                                disabled={isViewMode}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {!isViewMode && formData.categories.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCategory(cat.id)}
                                                        className="absolute -top-2 -right-2 p-1.5 bg-white text-gray-400 hover:text-red-500 border border-gray-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </FormSection>



                        {isProduct && (
                            <FormSection title="Product Narrative & Styling">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="block ml-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Description</label>
                                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.description}
                                                onChange={(value) => setFormData({ ...formData, description: value })}
                                                readOnly={isViewMode}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                style={{ height: '200px', marginBottom: '50px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block ml-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Styling Tips</label>
                                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.stylingTips}
                                                onChange={(value) => setFormData({ ...formData, stylingTips: value })}
                                                readOnly={isViewMode}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                style={{ height: '150px', marginBottom: '50px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FormSection>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemEditor;
