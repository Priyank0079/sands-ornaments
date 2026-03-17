import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { Upload, X, Save, Plus, ChevronRight, Trash2, Box } from 'lucide-react';
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
        ['link'],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link'
];



const ItemEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const typeParam = searchParams.get('type');

    // Determine context
    const isCategoryPath = location.pathname.includes('/categories');
    const isCategory = isCategoryPath;
    const isProduct = location.pathname.includes('/products');
    const isViewMode = location.pathname.includes('/view/');

    const resourceType = isCategory ? 'Category' : 'Product';
    const backPath = isProduct 
        ? '/admin/products' 
        : '/admin/categories';

    const isEditMode = Boolean(id) && !isViewMode;

    // Mock initial data for lists
    const [categories, setCategories] = useState([]); // List of all categories from DB
    const [loading, setLoading] = useState(isEditMode || isViewMode);
    const [imageFiles, setImageFiles] = useState([]); // Store actual File objects
    const [previewImages, setPreviewImages] = useState([]); // Store image URLs for display

    const [formData, setFormData] = useState({
        name: '',
        parentId: '',
        description: '',
        stylingTips: '',
        showInCollection: true,
        showInNavbar: true,
        isActive: true,
        metal: 'silver', // Default to silver
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
        categories: [{ category: '' }], // Single category for product
        tags: {
            isNewArrival: false,
            isMostGifted: false,
            isNewLaunch: false
        },
        faqs: [],
        variants: [
            { id: Date.now(), name: '', mrp: '', price: '', stock: '' }
        ],
        deletedImages: []
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const getFriendlyError = (err, fallback = "Something went wrong. Please try again.") => {
        const responseMessage = err?.response?.data?.message;
        const responseError = err?.response?.data?.error;
        const rawMessage = responseMessage || err?.message || fallback;

        if (responseError === "VALIDATION_ERROR") {
            return "Please review the form fields and try again.";
        }
        if (typeof rawMessage === 'string') {
            return rawMessage.replace(/^"|"$/g, '').replace(/\\"/g, '"');
        }
        return fallback;
    };

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
        const loadData = async () => {
            try {
                const results = await Promise.all([
                    adminService.getCategories(),
                    (isEditMode || isViewMode) ? (isCategory ? adminService.getCategoryById(id) : adminService.getProductById(id)) : Promise.resolve(null)
                ]);

                const [cats, data] = results;
                setCategories(cats);

                if (data) {
                    // Normalize categories if it's a product
                    if (isProduct && data.categories) {
                        const normalized = data.categories.map(c => ({
                            category: typeof c === 'object' ? (c._id || c.name || '') : c
                        }));
                        data.categories = normalized.slice(0, 1);
                    }
                    
                    setFormData(prev => ({ 
                        ...prev, 
                        ...data,
                        originalPrice: data.variants?.[0]?.mrp || '',
                        sellingPrice: data.variants?.[0]?.price || '',
                        stock: data.variants?.[0]?.stock || '',
                        discount: data.variants?.[0]?.discount || 0,
                        faqs: data.faqs || [],
                        variants: data.variants?.map(v => ({ ...v, id: v._id || Math.random() })) || [
                            { id: Date.now(), name: '', mrp: '', price: '', stock: '' }
                        ]
                    }));
                    if (data.images) setPreviewImages(data.images);
                }
            } catch (err) {
                console.error("Load failed:", err);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, isEditMode, isViewMode, isCategory, isProduct]);

    // Handle initial params from URL (e.g. parent category for new creation)
    useEffect(() => {
        const parentParam = searchParams.get('parent');
        if (!isEditMode && !isViewMode && parentParam) {
            setFormData(prev => ({ ...prev, parentId: parentParam }));
        }
    }, [searchParams, isEditMode, isViewMode]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (isCategory) {
            // For category, only one image at a time
            const file = files[0];
            if (file) {
                setImageFiles([file]);
                const preview = URL.createObjectURL(file);
                setFormData(prev => ({
                    ...prev,
                    images: [preview]
                }));
                setPreviewImages([preview]);
            }
        } else {
            // For product, allow multiple
            const newFiles = files.slice(0, 5 - imageFiles.length); // Limit new files
            setImageFiles(prev => [...prev, ...newFiles]);
            const previews = newFiles.map(file => URL.createObjectURL(file));
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...previews].slice(0, 5)
            }));
            setPreviewImages(prev => [...prev, ...previews].slice(0, 5));
        }
    };

    const handleRemoveImage = (index) => {
        const removedImage = previewImages[index]; // Use previewImages for display
        const newPreviewImages = previewImages.filter((_, i) => i !== index);
        
        const updates = { images: newPreviewImages }; // Update formData.images to reflect current previews
        
        // If it's an existing image (string URL, not a blob URL from new upload), track for backend deletion
        if (typeof removedImage === 'string' && !removedImage.startsWith('blob:')) {
            updates.deletedImages = [...formData.deletedImages, removedImage];
        } else if (removedImage.startsWith('blob:')) {
            // If it's a new image (blob URL), remove the corresponding file from imageFiles
            // This requires careful indexing. A better approach would be to store {file, previewUrl} pairs.
            // For now, we'll assume new files are added to the end of imageFiles and previewImages.
            // This logic might be imperfect if existing images are removed from the middle.
            const newFileIndex = previewImages.slice(0, index).filter(img => img.startsWith('blob:')).length;
            setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
        }
        
        setFormData(prev => ({ ...prev, ...updates }));
        setPreviewImages(newPreviewImages);
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    // Category Management for Products (New)
    const addCategoryRow = () => {
        setFormData(prev => ({
            ...prev,
            categories: [...(prev.categories || []), { category: '' }]
        }));
    };

    const removeCategoryRow = (index) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index)
        }));
    };

    const handleCategoryChange = (index, value) => {
        const newCats = [...formData.categories];
        newCats[index].category = value;
        setFormData({ ...formData, categories: newCats });
    };

    const addFaq = () => {
        setFormData(prev => ({
            ...prev,
            faqs: [...prev.faqs, { question: '', answer: '' }]
        }));
    };

    const removeFaq = (index) => {
        setFormData(prev => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index)
        }));
    };

    const handleFaqChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq)
        }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { id: Date.now(), name: '', mrp: '', price: '', stock: '' }]
        }));
    };

    const removeVariant = (id) => {
        if (formData.variants.length > 1) {
            setFormData(prev => ({
                ...prev,
                variants: prev.variants.filter(v => v.id !== id)
            }));
        }
    };

    const handleVariantChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => {
                if (v.id === id) {
                    const updated = { ...v, [field]: value };
                    // Auto-calculate discount if mrp and price changed
                    if ((field === 'mrp' || field === 'price') && updated.mrp && updated.price) {
                        const m = parseFloat(updated.mrp);
                        const p = parseFloat(updated.price);
                        if (m > p) {
                            updated.discount = Math.round(((m - p) / m) * 100);
                        } else {
                            updated.discount = 0;
                        }
                    }
                    return updated;
                }
                return v;
            })
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        
        if (isProduct) {
            if (!formData.description || formData.description.trim() === '') {
                newErrors.description = "Description is required";
            }
            const selectedCategories = (formData.categories || []).filter(c => c.category);
            if (selectedCategories.length === 0) {
                newErrors.categories = "At least one category is required";
            }
            if (!formData.variants || formData.variants.length === 0) {
                newErrors.variants = "At least one variant is required";
            } else {
                formData.variants.forEach((v, i) => {
                    if (!v.name) newErrors[`variant_${i}_name`] = "Size/Name is required";
                    if (!v.mrp) newErrors[`variant_${i}_mrp`] = "MRP is required";
                    if (!v.price) newErrors[`variant_${i}_price`] = "Price is required";
                    if (v.stock === '' || v.stock === null || v.stock === undefined) {
                        newErrors[`variant_${i}_stock`] = "Stock is required";
                    }
                    if (v.mrp && Number(v.price) > Number(v.mrp)) {
                        newErrors[`variant_${i}_price`] = "Price cannot exceed MRP";
                    }
                });
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors before saving");
            return;
        }

        setIsSaving(true);
        try {
            if (isCategory) {
                const form = new FormData();
                form.append('name', formData.name.trim());
                form.append('description', formData.description);
                form.append('metal', formData.metal);
                form.append('showInNavbar', formData.showInNavbar);
                form.append('showInCollection', formData.showInCollection);
                form.append('isActive', formData.isActive);
                if (imageFiles.length > 0) {
                    imageFiles.forEach(file => form.append('image', file));
                }
                if (isEditMode && (formData.deletedImages || []).length > 0) {
                    form.append('deletedImages', JSON.stringify(formData.deletedImages));
                }

                let res;
                if (isEditMode) {
                    res = await adminService.updateCategory(id, form);
                    if (res.success) toast.success("Category updated");
                    else throw new Error(res.message || "Update failed");
                } else {
                    res = await adminService.createCategory(form);
                    if (res.success) toast.success("Category created");
                    else throw new Error(res.message || "Operation failed");
                }
            } else {
                // Product Management Logic (Keep existing)
                const mappedCategories = (formData.categories || [])
                    .filter(c => c.category)
                    .map(c => c.category);

                const productForm = new FormData();
                Object.keys(formData).forEach(key => {
                    const productExcludes = [
                        'images', 'categories', 'tags', 'variants', 
                        'originalPrice', 'sellingPrice', 'stock', 
                        'discount', 'faqs', 'deletedImages',
                        'parentId', 'metal', 'sizes', 'variantStock',
                        'isActive',
                        '_id', 'createdAt', 'updatedAt', '__v',
                        'rating', 'reviewCount', 'sellerId'
                    ];
                    const categoryExcludes = [
                        'images', 'parentId', 'deletedImages', 'originalPrice', 
                        'sellingPrice', 'stock', 'discount', 'variants', 
                        'categories', 'tags', 'faqs', 'sizes', 'variantStock'
                    ];

                    const excludes = isProduct ? productExcludes : categoryExcludes;

                    if (!excludes.includes(key)) {
                        if (formData[key] !== undefined && formData[key] !== '') {
                            let value = formData[key];
                            if (isProduct && key === 'weight') value = parseFloat(value) || 0;
                            productForm.append(key, value);
                        }
                    }
                });

                productForm.append('categories', JSON.stringify(mappedCategories));
                productForm.append('variants', JSON.stringify(formData.variants.map(({ id, _id, sold, ...rest }) => ({
                    ...rest,
                    mrp: parseFloat(rest.mrp) || 0,
                    price: parseFloat(rest.price) || 0,
                    stock: parseInt(rest.stock) || 0,
                    discount: parseInt(rest.discount) || 0
                }))));
                productForm.append('tags', JSON.stringify(formData.tags));
                productForm.append('faqs', JSON.stringify((formData.faqs || []).map(({ _id, ...rest }) => ({
                    ...rest
                }))));
                productForm.append('deletedImages', JSON.stringify(formData.deletedImages));

                if (imageFiles.length > 0) {
                    imageFiles.forEach(file => productForm.append('images', file));
                }

                let res;
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
            toast.success(isEditMode ? "Updated successfully" : "Created successfully");
            navigate(-1);
        } catch (err) {
            console.error("Submit failed:", err);
            toast.error(getFriendlyError(err));
        } finally {
            setIsSaving(false);
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
                        label: loading ? (isEditMode ? 'Saving...' : 'Publishing...') : (isEditMode ? 'Save Changes' : `Publish ${resourceType}`),
                        onClick: handleSubmit,
                        disabled: loading
                    } : undefined}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Side/Utility Column (Spans 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <FormSection title={isProduct ? "Visual Gallery (Max 5)" : "Cover Image"}>
                            <div className="grid grid-cols-2 gap-3">
                                {previewImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 shadow-sm">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        {!isViewMode && (
                                            <button
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!isViewMode && previewImages.length < (isProduct ? 5 : 1) && (
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

                                <FormSection title="Product Variants (Size/Stock)">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Define stock per size/variant</p>
                                            {!isViewMode && (
                                                <button
                                                    type="button"
                                                    onClick={addVariant}
                                                    className="text-[10px] font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-1 hover:underline"
                                                >
                                                    <Plus size={14} /> Add Variant
                                                </button>
                                            )}
                                        </div>
                                        <div className="overflow-x-auto -mx-4 md:mx-0">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-100">
                                                        <th className="py-3 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Size/Name</th>
                                                        <th className="py-3 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">MRP (₹)</th>
                                                        <th className="py-3 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Price (₹)</th>
                                                        <th className="py-3 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                                                        {!isViewMode && <th className="py-3 px-4 text-[9px] font-bold text-center text-gray-400 uppercase tracking-widest">Action</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.variants.map((variant, idx) => (
                                                        <tr key={variant.id} className="border-b border-gray-50 group hover:bg-white transition-all">
                                                            <td className="py-3 px-2">
                                                                <input
                                                                    type="text"
                                                                    value={variant.name}
                                                                    onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)}
                                                                    placeholder="e.g. Size 6"
                                                                    className={`w-full bg-white/50 border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:bg-white transition-all ${errors[`variant_${idx}_name`] ? 'border-red-500' : 'border-gray-200 focus:border-[#3E2723]'}`}
                                                                    disabled={isViewMode}
                                                                />
                                                                {errors[`variant_${idx}_name`] && <p className="text-[8px] text-red-500 font-bold mt-0.5 ml-1">{errors[`variant_${idx}_name`]}</p>}
                                                            </td>
                                                            <td className="py-3 px-2">
                                                                <input
                                                                    type="number"
                                                                    value={variant.mrp}
                                                                    onChange={(e) => handleVariantChange(variant.id, 'mrp', e.target.value)}
                                                                    placeholder="5000"
                                                                    className={`w-full bg-white/50 border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:bg-white transition-all tabular-nums ${errors[`variant_${idx}_mrp`] ? 'border-red-500' : 'border-gray-200 focus:border-[#3E2723]'}`}
                                                                    disabled={isViewMode}
                                                                />
                                                                {errors[`variant_${idx}_mrp`] && <p className="text-[8px] text-red-500 font-bold mt-0.5 ml-1">{errors[`variant_${idx}_mrp`]}</p>}
                                                            </td>
                                                            <td className="py-3 px-2">
                                                                <input
                                                                    type="number"
                                                                    value={variant.price}
                                                                    onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                                                                    placeholder="3999"
                                                                    className={`w-full bg-white/50 border rounded-lg py-1.5 px-3 text-sm font-bold text-[#3E2723] focus:outline-none focus:bg-white transition-all tabular-nums ${errors[`variant_${idx}_price`] ? 'border-red-500' : 'border-gray-200 focus:border-[#3E2723]'}`}
                                                                    disabled={isViewMode}
                                                                />
                                                                {errors[`variant_${idx}_price`] && <p className="text-[8px] text-red-500 font-bold mt-0.5 ml-1">{errors[`variant_${idx}_price`]}</p>}
                                                            </td>
                                                            <td className="py-3 px-2">
                                                                <input
                                                                    type="number"
                                                                    value={variant.stock}
                                                                    onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                                                                    placeholder="100"
                                                                    className={`w-full bg-white/50 border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:bg-white transition-all ${errors[`variant_${idx}_stock`] ? 'border-red-500' : 'border-gray-200 focus:border-[#3E2723]'}`}
                                                                    disabled={isViewMode}
                                                                />
                                                                {errors[`variant_${idx}_stock`] && <p className="text-[8px] text-red-500 font-bold mt-0.5 ml-1">{errors[`variant_${idx}_stock`]}</p>}
                                                            </td>
                                                            {!isViewMode && (
                                                                <td className="py-3 px-2 text-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeVariant(variant.id)}
                                                                        disabled={formData.variants.length <= 1}
                                                                        className="p-1.5 text-gray-300 hover:text-red-500 disabled:opacity-0 transition-all"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </FormSection>
                            </>
                        )}
                    </div>

                    {/* Primary Content Column (Spans 8) */}
                    <div className="lg:col-span-8 space-y-6">
                        <FormSection title="Core Information" className="space-y-6">
                            <Input
                                label={isCategory ? "Category Name" : "Product Title"}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={isCategory ? "e.g. Gold" : "e.g. Gold Floral Ring"}
                                disabled={isViewMode}
                                error={errors.name}
                            />

                            {isCategory && (
                                <>
                                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
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

                                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all flex-1 ${formData.isActive
                                            ? 'border-[#8D6E63] bg-[#8D6E63]/5 ring-1 ring-[#8D6E63]/20'
                                            : 'border-gray-200 hover:border-[#8D6E63]/30 hover:bg-gray-50'
                                            } ${isViewMode ? 'pointer-events-none opacity-80' : ''}`}>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isActive
                                                ? 'bg-[#8D6E63] border-[#8D6E63]'
                                                : 'bg-white border-gray-300'
                                                }`}>
                                                {formData.isActive && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="hidden"
                                                disabled={isViewMode}
                                            />
                                            <span className={`text-sm font-medium ${formData.isActive ? 'text-[#3E2723]' : 'text-gray-700'}`}>Active Category</span>
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block ml-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category Description</label>
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
 
                                    <Select
                                        label="Category Metal (Internal)"
                                        value={formData.metal}
                                        onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                                        options={[
                                            { label: 'Silver (Ag)', value: 'silver' },
                                            { label: 'Gold (Au)', value: 'gold' }
                                        ]}
                                        disabled={isViewMode}
                                    />
                                </>
                            )}


                            {isProduct && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex flex-col">
                                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Product Category</label>
                                            {errors.categories && <span className="text-[10px] text-red-500 font-bold mt-0.5">{errors.categories}</span>}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {(formData.categories && formData.categories.length > 0 ? formData.categories : [{ category: '' }]).map((catRow, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100 group transition-all hover:bg-white hover:border-gray-200">
                                                <div className="flex-1 space-y-1">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Main Category</span>
                                                    <select
                                                        value={catRow.category}
                                                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                                                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#3E2723] transition-all focus:ring-1 focus:ring-[#3E2723]/20"
                                                        disabled={isViewMode}
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.map(cat => (
                                                            <option key={cat._id} value={cat._id} disabled={cat.isActive === false}>
                                                                {cat.name}{cat.isActive === false ? ' (Inactive)' : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </FormSection>

                        {isProduct && (
                            <>
                                <FormSection title="Product Narrative & Styling">
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="block ml-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Description</label>
                                            {errors.description && (
                                                <p className="text-[10px] text-red-500 font-bold ml-1">{errors.description}</p>
                                            )}
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

                                <FormSection title="Product Questions (FAQ)">
                                    <div className="space-y-4">
                                        <div className="flex justify-end">
                                            {!isViewMode && (
                                                <button
                                                    type="button"
                                                    onClick={addFaq}
                                                    className="text-[10px] font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-1 hover:underline"
                                                >
                                                    <Plus size={14} /> Add FAQ
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            {formData.faqs.map((faq, index) => (
                                                <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200 relative group animate-in fade-in slide-in-from-top-2 space-y-3">
                                                    <Input
                                                        label="Question"
                                                        value={faq.question}
                                                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                                        placeholder="e.g. Is it high quality silver?"
                                                        disabled={isViewMode}
                                                    />
                                                    <div className="space-y-1.5">
                                                        <label className="block ml-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Answer</label>
                                                        <textarea
                                                            value={faq.answer}
                                                            onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                                            placeholder="Yes, it is 925 Hallmark..."
                                                            disabled={isViewMode}
                                                            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3.5 text-sm text-gray-900 focus:outline-none focus:border-[#3E2723] focus:ring-2 focus:ring-[#3E2723]/10 transition-all shadow-sm"
                                                            rows={2}
                                                        />
                                                    </div>
                                                    {!isViewMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFaq(index)}
                                                            className="absolute -top-2 -right-2 p-1.5 bg-white text-gray-400 hover:text-red-500 border border-gray-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {formData.faqs.length === 0 && (
                                                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                                                    <p className="text-xs text-gray-400">No FAQs added yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </FormSection>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemEditor;
