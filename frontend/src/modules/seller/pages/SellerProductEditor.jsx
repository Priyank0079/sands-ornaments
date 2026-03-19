import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../admin/components/common/PageHeader';
import { FormSection, Input, Select, TextArea } from '../../admin/components/common/FormControls';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { sellerProductService } from '../services/sellerProductService';
import api from '../../../services/api';
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
    'list', 'bullet',
    'link'
];

const SellerProductEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isViewMode = location.pathname.includes('/view/');
    const isEditMode = Boolean(id) && !isViewMode;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(isEditMode || isViewMode);
    const [imageFiles, setImageFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [navGiftOptions, setNavGiftOptions] = useState([]);
    const [navOccasionOptions, setNavOccasionOptions] = useState([]);

    const toSlugValue = (label) => {
        return String(label || '')
            .trim()
            .toLowerCase()
            .replace(/['"]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const getQueryParamValue = (path, key) => {
        if (!path || !path.includes('?')) return '';
        const query = path.split('?')[1] || '';
        const params = new URLSearchParams(query);
        return params.get(key) || '';
    };

    const buildNavOptions = (section, key, fallback) => {
        if (section?.items?.length) {
            return section.items.map(item => {
                const label = item.name || item.label || '';
                const value = getQueryParamValue(item.path, key) || toSlugValue(label);
                return { label, value };
            }).filter(opt => opt.value);
        }
        return fallback.map(label => ({ label, value: toSlugValue(label) }));
    };

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        stylingTips: '',
        cardLabel: '',
        cardBadge: '',
        material: 'Silver',
        weight: '',
        weightUnit: 'Grams',
        specifications: '',
        supplierInfo: '',
        categories: [{ category: '' }],
        tags: {
            isNewArrival: false,
            isMostGifted: false,
            isNewLaunch: false
        },
        navGiftsFor: [],
        navOccasions: [],
        variants: [
            { id: Date.now(), name: 'Standard', mrp: '', price: '', stock: '' }
        ],
        faqs: [],
        deletedImages: []
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const [catsRes, cmsRes] = await Promise.all([
                    api.get('public/categories'),
                    api.get('public/cms/homepage').catch(() => null)
                ]);
                const list = catsRes.data?.data?.categories || [];
                setCategories(list.filter(cat => cat.isActive !== false));

                const sections = cmsRes?.data?.data?.sections || [];
                const giftSection = sections.find(sec => sec.sectionId === 'nav-gifts-for');
                const occasionSection = sections.find(sec => sec.sectionId === 'nav-occasions');
                setNavGiftOptions(buildNavOptions(giftSection, 'filter', ['Womens', 'Girls', 'Mens', 'Couple', 'Kids']));
                setNavOccasionOptions(buildNavOptions(occasionSection, 'occasion', ['Birthday', 'Anniversary', 'Wedding', "Mother's Day", 'Valentine Day']));
            } catch (err) {
                toast.error("Failed to load categories");
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadProduct = async () => {
            if (!isEditMode && !isViewMode) {
                setLoading(false);
                return;
            }
            try {
                const data = await sellerProductService.getSellerProductRaw(id);
                if (data) {
                    const normalizedCategories = (data.categories || []).map(c => ({
                        category: typeof c === 'object' ? (c._id || c.name || '') : c
                    }));
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        material: data.material || data.metal || 'Silver',
                        weight: data.weight || '',
                        weightUnit: data.weightUnit || 'Grams',
                        categories: normalizedCategories.slice(0, 1),
                        navGiftsFor: Array.isArray(data.navGiftsFor) ? data.navGiftsFor : [],
                        navOccasions: Array.isArray(data.navOccasions) ? data.navOccasions : [],
                        variants: data.variants?.map(v => ({ ...v, id: v._id || Math.random() })) || prev.variants,
                        faqs: data.faqs || [],
                        deletedImages: []
                    }));
                    if (data.images) {
                        setPreviewImages(data.images);
                    }
                }
            } catch (err) {
                toast.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id, isEditMode, isViewMode]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.slice(0, 5 - imageFiles.length);
        const previews = newFiles.map(file => URL.createObjectURL(file));
        setImageFiles(prev => [...prev, ...newFiles]);
        setPreviewImages(prev => [...prev, ...previews].slice(0, 5));
    };

    const handleRemoveImage = (index) => {
        const removedImage = previewImages[index];
        const newPreviewImages = previewImages.filter((_, i) => i !== index);

        const updates = { deletedImages: [...formData.deletedImages] };
        if (typeof removedImage === 'string' && !removedImage.startsWith('blob:')) {
            updates.deletedImages.push(removedImage);
        } else if (removedImage?.startsWith('blob:')) {
            const newFileIndex = previewImages.slice(0, index).filter(img => img.startsWith('blob:')).length;
            setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
        }

        setFormData(prev => ({ ...prev, deletedImages: updates.deletedImages }));
        setPreviewImages(newPreviewImages);
    };

    const handleVariantChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => {
                if (v.id === id) {
                    const updated = { ...v, [field]: value };
                    if ((field === 'mrp' || field === 'price') && updated.mrp && updated.price) {
                        const m = parseFloat(updated.mrp);
                        const p = parseFloat(updated.price);
                        updated.discount = m > p ? Math.round(((m - p) / m) * 100) : 0;
                    }
                    return updated;
                }
                return v;
            })
        }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { id: Date.now(), name: '', mrp: '', price: '', stock: '' }]
        }));
    };

    const removeVariant = (id) => {
        if (formData.variants.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.id !== id)
        }));
    };

    const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, categories: [{ category: value }] }));
    };

    const toggleNavValue = (field, value) => {
        setFormData(prev => {
            const current = Array.isArray(prev[field]) ? prev[field] : [];
            const exists = current.includes(value);
            const updated = exists ? current.filter(v => v !== value) : [...current, value];
            return { ...prev, [field]: updated };
        });
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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.categories?.[0]?.category) newErrors.categories = "Please select a category before publishing.";
        if (!formData.variants || formData.variants.length === 0) {
            newErrors.variants = "At least one variant is required";
        } else {
            formData.variants.forEach((v, i) => {
                if (!v.name) newErrors[`variant_${i}_name`] = "Variant name is required";
                if (!v.mrp) newErrors[`variant_${i}_mrp`] = "MRP is required";
                if (!v.price) newErrors[`variant_${i}_price`] = "Price is required";
                if (v.stock === '' || v.stock === null || v.stock === undefined) {
                    newErrors[`variant_${i}_stock`] = "Stock is required";
                }
            });
        }
        setErrors(newErrors);
        return { valid: Object.keys(newErrors).length === 0, errors: newErrors };
    };

    const getFirstError = (errs) => {
        const keys = Object.keys(errs || {});
        if (keys.length === 0) return "Please review the form fields and try again.";
        return errs[keys[0]];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validateForm();
        if (!validation.valid) {
            toast.error(getFirstError(validation.errors));
            return;
        }

        setIsSaving(true);
        try {
            const productForm = new FormData();
            const excludes = ['variants', 'categories', 'tags', 'deletedImages', 'navGiftsFor', 'navOccasions', 'navShopByCategory'];

            Object.keys(formData).forEach(key => {
                if (excludes.includes(key)) return;
                if (formData[key] !== undefined && formData[key] !== '') {
                    let value = formData[key];
                    if (key === 'weight') value = parseFloat(value) || 0;
                    productForm.append(key, value);
                }
            });

            productForm.append('categories', JSON.stringify([formData.categories[0].category]));
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
            const normalizedGifts = (formData.navGiftsFor || []).map(toSlugValue);
            const normalizedOccasions = (formData.navOccasions || []).map(toSlugValue);
            productForm.append('navGiftsFor', JSON.stringify(normalizedGifts));
            productForm.append('navOccasions', JSON.stringify(normalizedOccasions));
            productForm.append('deletedImages', JSON.stringify(formData.deletedImages || []));

            imageFiles.forEach(file => productForm.append('images', file));

            if (isEditMode) {
                const res = await sellerProductService.updateProduct(id, productForm);
                if (res.success === false) throw new Error(res.message || "Update failed");
                toast.success("Product updated");
            } else {
                await sellerProductService.addProduct(productForm);
                toast.success("Product created");
            }
            navigate('/seller/products');
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to save product");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 md:p-8">
                <PageHeader
                    title={isViewMode ? `View Product` : (isEditMode ? `Edit Product` : `Create New Product`)}
                    subtitle={isViewMode ? `Viewing details for ${formData.name || id}` : (isEditMode ? `ID: ${id || 'N/A'}` : `Setup your new product details`)}
                    backPath="/seller/products"
                    action={!isViewMode ? {
                        label: loading || isSaving ? (isEditMode ? 'Saving...' : 'Publishing...') : (isEditMode ? 'Save Changes' : `Publish Product`),
                        onClick: handleSubmit,
                        disabled: loading || isSaving || !formData.categories?.[0]?.category
                    } : undefined}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        <FormSection title="Images">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {previewImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            {!isViewMode && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-white text-gray-600 rounded-full shadow hover:text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {!isViewMode && previewImages.length < 5 && (
                                        <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300">
                                            <Upload size={18} className="text-gray-400" />
                                            <span className="text-[10px] text-gray-400 uppercase font-bold mt-2">Upload</span>
                                            <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Display Labels">
                            <Input
                                label="Card Label"
                                value={formData.cardLabel}
                                onChange={(e) => setFormData({ ...formData, cardLabel: e.target.value })}
                                disabled={isViewMode}
                            />
                            <Input
                                label="Card Badge"
                                value={formData.cardBadge}
                                onChange={(e) => setFormData({ ...formData, cardBadge: e.target.value })}
                                disabled={isViewMode}
                            />
                        </FormSection>

                        <FormSection title="Specifications">
                            <Select
                                label="Material"
                                value={formData.material}
                                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                options={[
                                    { label: 'Gold', value: 'Gold' },
                                    { label: 'Silver', value: 'Silver' }
                                ]}
                                disabled={isViewMode}
                            />
                            <Input
                                label="Weight"
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                disabled={isViewMode}
                            />
                            <Select
                                label="Weight Unit"
                                value={formData.weightUnit}
                                onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                                options={[
                                    { label: 'Grams', value: 'Grams' },
                                    { label: 'Carats', value: 'Carats' },
                                    { label: 'Milligrams', value: 'Milligrams' }
                                ]}
                                disabled={isViewMode}
                            />
                            <TextArea
                                label="Specifications"
                                value={formData.specifications}
                                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                                disabled={isViewMode}
                            />
                            <TextArea
                                label="Supplier Info"
                                value={formData.supplierInfo}
                                onChange={(e) => setFormData({ ...formData, supplierInfo: e.target.value })}
                                disabled={isViewMode}
                            />
                        </FormSection>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <FormSection title="Core Information">
                            <Input
                                label="Product Title"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={isViewMode}
                                error={errors.name}
                            />

                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                {errors.categories && <span className="text-[10px] text-red-500 font-bold">{errors.categories}</span>}
                                <select
                                    value={formData.categories?.[0]?.category || ''}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className={`w-full bg-white border rounded-lg py-2.5 px-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all shadow-sm ${errors.categories ? 'border-red-300 focus:border-red-400 focus:ring-red-200/40' : 'border-gray-300 focus:border-[#3E2723] focus:ring-[#3E2723]/10'}`}
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
                        </FormSection>

                        <FormSection title="Navigation Placement">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gifts For</label>
                                        <span className="text-[10px] text-gray-400">Optional</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {(navGiftOptions || []).map(opt => {
                                            const checked = (formData.navGiftsFor || []).includes(opt.value);
                                            return (
                                                <label
                                                    key={opt.value}
                                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                                                        checked ? 'border-[#3E2723] bg-[#3E2723]/5 text-[#3E2723]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    } ${isViewMode ? 'pointer-events-none opacity-70' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="h-3.5 w-3.5 rounded border-gray-300 text-[#3E2723] focus:ring-[#3E2723]"
                                                        checked={checked}
                                                        onChange={() => toggleNavValue('navGiftsFor', opt.value)}
                                                        disabled={isViewMode}
                                                    />
                                                    <span>{opt.label}</span>
                                                </label>
                                            );
                                        })}
                                        {navGiftOptions.length === 0 && (
                                            <div className="text-xs text-gray-400">No gifts configured.</div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Occasions</label>
                                        <span className="text-[10px] text-gray-400">Optional</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {(navOccasionOptions || []).map(opt => {
                                            const checked = (formData.navOccasions || []).includes(opt.value);
                                            return (
                                                <label
                                                    key={opt.value}
                                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                                                        checked ? 'border-[#3E2723] bg-[#3E2723]/5 text-[#3E2723]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    } ${isViewMode ? 'pointer-events-none opacity-70' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="h-3.5 w-3.5 rounded border-gray-300 text-[#3E2723] focus:ring-[#3E2723]"
                                                        checked={checked}
                                                        onChange={() => toggleNavValue('navOccasions', opt.value)}
                                                        disabled={isViewMode}
                                                    />
                                                    <span>{opt.label}</span>
                                                </label>
                                            );
                                        })}
                                        {navOccasionOptions.length === 0 && (
                                            <div className="text-xs text-gray-400">No occasions configured.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Product Narrative & Styling">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">Product Description</label>
                                    {errors.description && <span className="text-[10px] text-red-500 font-bold">{errors.description}</span>}
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
                                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">Styling Tips</label>
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

                        <FormSection title="Variants & Pricing">
                            {errors.variants && <span className="text-[10px] text-red-500 font-bold">{errors.variants}</span>}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[520px] text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Variant</th>
                                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">MRP</th>
                                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Price</th>
                                            <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock</th>
                                            {!isViewMode && <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {formData.variants.map((variant, index) => (
                                            <tr key={variant.id}>
                                                <td className="px-4 py-2">
                                                    <input
                                                        value={variant.name}
                                                        onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)}
                                                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2 text-xs"
                                                        disabled={isViewMode}
                                                    />
                                                    {errors[`variant_${index}_name`] && <div className="text-[10px] text-red-500 mt-1">{errors[`variant_${index}_name`]}</div>}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={variant.mrp}
                                                        onChange={(e) => handleVariantChange(variant.id, 'mrp', e.target.value)}
                                                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2 text-xs"
                                                        disabled={isViewMode}
                                                    />
                                                    {errors[`variant_${index}_mrp`] && <div className="text-[10px] text-red-500 mt-1">{errors[`variant_${index}_mrp`]}</div>}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={variant.price}
                                                        onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                                                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2 text-xs"
                                                        disabled={isViewMode}
                                                    />
                                                    {errors[`variant_${index}_price`] && <div className="text-[10px] text-red-500 mt-1">{errors[`variant_${index}_price`]}</div>}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={variant.stock}
                                                        onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                                                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2 text-xs"
                                                        disabled={isViewMode}
                                                    />
                                                    {errors[`variant_${index}_stock`] && <div className="text-[10px] text-red-500 mt-1">{errors[`variant_${index}_stock`]}</div>}
                                                </td>
                                                {!isViewMode && (
                                                    <td className="px-4 py-2 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVariant(variant.id)}
                                                            className="p-1 text-gray-400 hover:text-red-500"
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
                            {!isViewMode && (
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="mt-4 text-[10px] font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-1 hover:underline"
                                >
                                    <Plus size={14} /> Add Variant
                                </button>
                            )}
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
                                    {(formData.faqs || []).map((faq, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200 relative group animate-in fade-in slide-in-from-top-2 space-y-3">
                                            <Input
                                                label="Question"
                                                value={faq.question}
                                                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                                placeholder="e.g. Is it 925 silver?"
                                                disabled={isViewMode}
                                            />
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-gray-700 tracking-wide">Answer</label>
                                                <textarea
                                                    value={faq.answer}
                                                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                                    placeholder="Yes, this is 925 hallmark silver."
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
                                    {(formData.faqs || []).length === 0 && (
                                        <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                                            <p className="text-xs text-gray-400">No FAQs added yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProductEditor;
