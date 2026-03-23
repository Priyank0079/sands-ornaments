import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { Upload, X, Save, Plus, ChevronRight, Trash2, Box, Barcode as BarcodeIcon, QrCode, Download, Copy, Loader2, Sparkles, Layout, IndianRupee, Type, Info, ScanLine, CheckCircle2, ShoppingBag, ImagePlus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { FormSection, Input, Select } from '../components/common/FormControls';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';
import { downloadImage } from '../../../utils/downloadUtils';
import Barcode from 'react-barcode';
import { useShop } from '../../../context/ShopContext';

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
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Determine context
    const isCategoryPath = location.pathname.includes('/categories');
    const isCategory = isCategoryPath;
    const isProduct = location.pathname.includes('/products');
    const isViewMode = location.pathname.includes('/view/');

    const resourceType = isCategory ? 'Category' : 'Product';
    const backPath = isProduct ? '/admin/products' : '/admin/categories';
    const isEditMode = Boolean(id) && !isViewMode;

    const [categories, setCategories] = useState([]);
    const [fetchedGiftOptions, setFetchedGiftOptions] = useState([]);
    const [fetchedOccasionOptions, setFetchedOccasionOptions] = useState([]);
    const [loading, setLoading] = useState(isEditMode || isViewMode);
    const [imageFiles, setImageFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        huid: '',
        parentId: '',
        description: '',
        stylingTips: '',
        careTips: '',
        technicalSpecifications: '',
        supplierInfo: '',
        showInCollection: true,
        showInNavbar: true,
        isActive: true,
        metalType: 'Silver',
        silverCategory: '',
        goldCategory: '',
        weight: '',
        weightUnit: 'Grams',
        originalPrice: '',
        sellingPrice: '',
        discount: 0,
        stock: '',
        categoryId: '',
        sizes: [],
        images: [],
        faqs: [],
        isSerialized: false,
        productCodes: [],
        variants: [{ id: Date.now(), name: '', makingCharge: '', diamondPrice: '', mrp: '', price: '', stock: '' }],
        deletedImages: [],
        tags: { isNewArrival: false, isMostGifted: false, isNewLaunch: false },
        navGiftsFor: [],
        navOccasions: []
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
        }));
    };

    const toggleNavValue = (field, value) => {
        setFormData(prev => {
            const current = Array.isArray(prev[field]) ? prev[field] : [];
            const exists = current.includes(value);
            return { ...prev, [field]: exists ? current.filter(v => v !== value) : [...current, value] };
        });
    };

    const addFaq = () => setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
    const removeFaq = (idx) => setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }));
    const handleFaqChange = (idx, field, val) => setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.map((f, i) => i === idx ? { ...f, [field]: val } : f)
    }));

    const { globalGst } = useShop();

    const addVariant = () => setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { 
            id: Date.now(), 
            name: '', 
            makingCharge: '', 
            diamondPrice: '', 
            mrp: (parseFloat(globalGst) || 0).toString(), 
            price: '', 
            stock: '' 
        }]
    }));
    const removeVariant = (vid) => setFormData(prev => ({
        ...prev,
        variants: prev.variants.length > 1 ? prev.variants.filter(v => v.id !== vid) : prev.variants
    }));
    const handleVariantChange = (vid, field, val) => setFormData(prev => ({
        ...prev,
        variants: prev.variants.map(v => {
            if (v.id === vid) {
                const updated = { ...v, [field]: val };
                if (['makingCharge', 'diamondPrice'].includes(field)) {
                    updated.mrp = (
                        (parseFloat(updated.makingCharge) || 0) + 
                        (parseFloat(updated.diamondPrice) || 0) + 
                        (parseFloat(globalGst) || 0)
                    ).toString();
                }
                return updated;
            }
            return v;
        })
    }));

    // Auto-recalculate all MRPs when globalGst changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => ({
                ...v,
                mrp: (
                    (parseFloat(v.makingCharge) || 0) + 
                    (parseFloat(v.diamondPrice) || 0) + 
                    (parseFloat(globalGst) || 0)
                ).toString()
            }))
        }));
    }, [globalGst]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(prev => [...prev, ...files]);
        const previews = files.map(f => URL.createObjectURL(f));
        setPreviewImages(prev => [...prev, ...previews]);
    };

    const handleRemoveImage = (idx) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== idx));
        // Logic for tracking deleted images can be added here
    };

    const handleSerializedQuantityChange = (val) => {
        const qty = Math.min(Math.max(parseInt(val) || 0, 0), 100);
        setFormData(prev => {
            const currentCodes = [...prev.productCodes];
            const nextCodes = Array(qty).fill('').map((_, i) => currentCodes[i] || '');
            return { ...prev, productCodes: nextCodes };
        });
    };

    const autoGenerateProductCodes = () => {
        if (!formData.name) {
            toast.error("Set a product title first to derive a prefix");
            return;
        }
        const prefix = formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4) || 'ITEM';
        setFormData(prev => ({
            ...prev,
            productCodes: prev.productCodes.map((_, i) => `${prefix}${(i + 1).toString().padStart(3, '0')}`)
        }));
        toast.success("Synchronized sequential identities");
    };

    const handleProductCodeChange = (idx, val) => {
        setFormData(prev => ({
            ...prev,
            productCodes: prev.productCodes.map((c, i) => i === idx ? val.toUpperCase() : c)
        }));
    };

    const handleEnhanceImage = () => {
        if (!formData.name) {
            toast.error("Please specify a product title to generate a prompt");
            return;
        }
        const prompt = `Generate a hyper-realistic, high-end professional studio shot of a ${formData.metalType} ${formData.name} jewelry piece. The lighting should be elegant, focusing on the intricate details and craftsmanship of ${formData.metalType} ${formData.silverCategory || formData.goldCategory || ''}. The background should be a soft, minimalist aesthetic consistent with luxury branding.`;
        const encodedPrompt = encodeURIComponent(prompt);
        window.open(`https://gemini.google.com/app?q=${encodedPrompt}`, '_blank');
    };

    const getIdentityMarker = () => {
        if (formData.productCode) return formData.productCode;
        if (formData.name) {
            // Generate a temporary SKU-like preview from the name
            const prefix = formData.name.substring(0, 3).toUpperCase();
            const timestamp = Date.now().toString().slice(-4);
            return `${prefix}${timestamp}`;
        }
        return 'PENDING...';
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Artisan product title is required';
        if (!formData.categoryId) newErrors.categoryId = 'Primary collection assignment is required';
        if (isProduct && !formData.huid) newErrors.huid = 'HUID certification is mandatory for authentication';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!validate()) {
            toast.error("Please refine the highlighted details");
            return;
        }

        setLoading(true);
        const toastId = toast.loading(isEditMode ? "Preserving changes..." : "Orchestrating new creation...");

        try {
            const data = new FormData();
            
            // Append basic fields
            Object.keys(formData).forEach(key => {
                if (key === 'variants') {
                    const sanitizedVariants = (formData.variants || []).map(v => ({
                        ...v,
                        makingCharge: parseFloat(v.makingCharge) || 0,
                        diamondPrice: parseFloat(v.diamondPrice) || 0,
                        mrp: parseFloat(v.mrp) || 0,
                        price: parseFloat(v.price) || 0,
                        stock: parseInt(v.stock) || 0
                    }));
                    data.append(key, JSON.stringify(sanitizedVariants));
                } else if (['images', 'faqs', 'navGiftsFor', 'navOccasions', 'tags', 'sizes', 'productCodes'].includes(key)) {
                    data.append(key, JSON.stringify(formData[key]));
                } else if (key !== 'deletedImages') {
                    data.append(key, formData[key]);
                }
            });

            // Append images
            imageFiles.forEach(file => data.append('images', file));

            const response = isEditMode 
                ? await adminService.updateProduct(id, data)
                : await adminService.createProduct(data);

            if (response.success) {
                toast.success(isEditMode ? "Masterpiece updated successfully" : "New creation published to the registry", { id: toastId });
                navigate(backPath);
            } else {
                toast.error(response.message || "An error occurred during preservation", { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const cats = await adminService.getCategories();
                setCategories(cats);
                if (id) {
                    const data = isCategory ? await adminService.getCategoryById(id) : await adminService.getProductById(id);
                    if (data) {
                        setFormData(prev => ({ 
                            ...prev, 
                            ...data,
                            // Ensure arrays are initialized correctly
                            navGiftsFor: data.navGiftsFor || [],
                            navOccasions: data.navOccasions || [],
                            variants: (data.variants || []).map(v => ({ 
                                ...v, 
                                makingCharge: (v.makingCharge || 0).toString(), 
                                diamondPrice: (v.diamondPrice || 0).toString() 
                            })) || [{ id: Date.now(), name: '', makingCharge: '0', diamondPrice: '0', mrp: globalGst || '0', price: '', stock: '' }]
                        }));
                        setPreviewImages(data.images || []);
                    }
                }
            } catch (err) { 
                console.error(err);
                toast.error("Failed to synchronize with the vault");
            } finally {
                setLoading(false); 
            }
        };
        load();
    }, [id, isCategory]);

    const sizeOptions = ['5', '6', '7', '8', '9', '10', '2.2', '2.4', '2.6', 'Adjustable'];
    const navGiftOptions = [
        { label: 'Sophisticated Women', value: 'womens' },
        { label: 'Modern Gentleman', value: 'mens' },
        { label: 'Elegant Couples', value: 'couple' },
        { label: 'Younger Generation', value: 'kids' },
        { label: 'Gifts Under 500', value: 'under-500' }
    ];
    const navOccasionOptions = [
        { label: 'Milestone Birthday', value: 'birthday' },
        { label: 'Grand Anniversary', value: 'anniversary' },
        { label: 'Royal Wedding', value: 'wedding' },
        { label: 'Maternal Tribute', value: 'mothers-day' },
        { label: 'Romantic Occasion', value: 'valentine' }
    ];

    if (loading && !formData.name) return (
        <div className="flex flex-col h-screen items-center justify-center bg-white space-y-4">
            <Loader2 className="animate-spin w-12 h-12 text-[#3E2723]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Authenticating Vault Data...</p>
        </div>
    );

    const isSubmitDisabled = loading;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
                        </button>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight uppercase">
                                {isViewMode ? `View ${resourceType}` : (isEditMode ? `Edit ${resourceType}` : `Create New ${resourceType}`)}
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                {isViewMode ? `Viewing details for ${formData.name || id}` : (isEditMode ? `Update details for ID: ${id || 'N/A'}` : `Setup your new ${resourceType.toLowerCase()} details`)}
                            </p>
                        </div>
                    </div>
                    {!isViewMode && (
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitDisabled}
                            className="bg-[#3E2723] hover:bg-[#2D1B18] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-[#3E2723]/10 transition-all disabled:opacity-50"
                        >
                             {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                            {loading ? (isEditMode ? 'Preserving...' : 'Orchestrating...') : (isEditMode ? 'Save Changes' : `Publish ${resourceType}`)}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN (Spans 4) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Images Section */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">Images</h3>
                            <div className="space-y-4">
                                <div className="aspect-square w-full rounded-[1.5rem] border-2 border-dashed border-gray-200 bg-[#FDFBF7] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-[#8D6E63] transition-all overflow-hidden relative">
                                    {previewImages.length > 0 ? (
                                        <div className="grid grid-cols-2 w-full h-full p-4 gap-2">
                                            {previewImages.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group/img">
                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }} className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                            {previewImages.length < 5 && (
                                                <label className="aspect-square rounded-xl border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-white transition-all">
                                                    <Plus className="w-4 h-4 text-gray-300" />
                                                    <input type="file" multiple hidden onChange={handleImageUpload} />
                                                </label>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-[#8D6E63] shadow-sm transition-colors border border-gray-100">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload</span>
                                            <input type="file" multiple hidden onChange={handleImageUpload} />
                                        </>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-100 rounded-xl text-[10px] font-black text-gray-600 uppercase tracking-widest hover:bg-gray-50 cursor-pointer transition-all">
                                        <Upload size={14} />
                                        Upload Image
                                        <input type="file" multiple hidden onChange={handleImageUpload} />
                                    </label>
                                    <button 
                                        type="button"
                                        onClick={handleEnhanceImage}
                                        disabled={isViewMode}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isViewMode ? 'text-gray-300 bg-gray-50/50 cursor-not-allowed' : 'text-[#8D6E63] hover:bg-white hover:border-[#8D6E63]/30 shadow-sm cursor-pointer'}`}
                                    >
                                        <Sparkles size={14} />
                                        Enhance Image
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/* Display Labels Section */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">Display Labels</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Card Label</label>
                                    <input 
                                        name="cardLabel"
                                        value={formData.cardLabel || ''}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        placeholder="e.g. 9 TO 5 SILVER"
                                        className="w-full bg-[#FDFBF7] border border-transparent rounded-xl py-4 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all disabled:opacity-50" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Card Badge</label>
                                    <input 
                                        name="cardBadge"
                                        value={formData.cardBadge || ''}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        placeholder="e.g. NEW"
                                        className="w-full bg-[#FDFBF7] border border-transparent rounded-xl py-4 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all disabled:opacity-50" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Specifications Section */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">Specifications</h3>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Material</label>
                                    <select 
                                        name="metalType"
                                        value={formData.metalType}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        className="w-full bg-[#FDFBF7] border border-transparent rounded-xl py-4 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all disabled:opacity-50"
                                    >
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        {formData.metalType} Purity Categorization
                                    </label>
                                    <select 
                                        name={formData.metalType === 'Silver' ? "silverCategory" : "goldCategory"}
                                        value={formData.metalType === 'Silver' ? formData.silverCategory : formData.goldCategory}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        className="w-full bg-[#FDFBF7] border border-transparent rounded-xl py-4 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all disabled:opacity-50"
                                    >
                                        <option value="">Select Purity</option>
                                        {formData.metalType === 'Silver' ? (
                                            ['800','835','925','925 sterling silver','958','970','990','999'].map(v => <option key={v} value={v}>{v}</option>)
                                        ) : (
                                            ['14','18','22','24'].map(v => <option key={v} value={v}>{v} Karat</option>)
                                        )}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Weight</label>
                                        <input 
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            disabled={isViewMode}
                                            placeholder="0.00"
                                            className="w-full bg-[#FDFBF7] border border-transparent rounded-xl py-4 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all disabled:opacity-50" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Weight Unit</label>
                                        <select 
                                            name="weightUnit"
                                            value={formData.weightUnit}
                                            onChange={handleChange}
                                            disabled={isViewMode}
                                            className="w-full bg-[#FDFBF7] border border-transparent rounded-xl py-4 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all disabled:opacity-50"
                                        >
                                            <option value="Grams">Grams</option>
                                            <option value="Carats">Carats</option>
                                            <option value="Milligrams">Milligrams</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specifications</label>
                                    <textarea 
                                        name="technicalSpecifications"
                                        value={formData.technicalSpecifications}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        rows={3}
                                        className="w-full bg-[#FDFBF7] border border-transparent rounded-xl py-4 px-5 text-sm font-medium text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all disabled:opacity-50" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Supplier Info</label>
                                    <textarea 
                                        name="supplierInfo"
                                        value={formData.supplierInfo}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        rows={3}
                                        className="w-full bg-[#FDFBF7] border border-transparent rounded-xl py-4 px-5 text-sm font-medium text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all disabled:opacity-50" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Spans 8) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Basic Information Section */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600">Product Name</label>
                                    <input 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        placeholder="e.g. Stunning Silver Ring"
                                        className="w-full bg-white border border-gray-100 rounded-xl py-4 px-6 text-sm font-medium text-gray-900 outline-none focus:border-[#8D6E63] transition-all disabled:opacity-50" 
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600">HUID (Hallmark Unique ID) <span className="text-red-500">*</span></label>
                                    <input 
                                        name="huid"
                                        value={formData.huid}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        placeholder="e.g. ABC123"
                                        className={`w-full bg-white border ${errors.huid ? 'border-red-300' : 'border-gray-100'} rounded-xl py-4 px-6 text-sm font-medium text-gray-900 outline-none focus:border-[#8D6E63] transition-all disabled:opacity-50`} 
                                    />
                                    {errors.huid && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.huid}</p>}
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                                        <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em]">System Identity Marker (Immutable)</p>
                                    </div>
                                    <div className="w-full bg-[#FDFBF7] border border-[#EFEBE9] border-dashed rounded-2xl py-6 px-8 flex items-center justify-between group">
                                        <span className="text-xl font-mono font-black text-gray-300 tracking-[0.25em]">{getIdentityMarker()}</span>
                                        <div className="flex gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                            {[1,2,3,4,5].map(i => <div key={i} className="w-0.5 h-4 bg-gray-200"></div>)}
                                        </div>
                                    </div>
                                    <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-2 ml-1 italic">
                                        This signature is mathematically locked to the product registry.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600">Category <span className="text-red-500">*</span></label>
                                    <select 
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        className={`w-full bg-white border ${errors.categoryId ? 'border-red-300' : 'border-gray-100'} rounded-xl py-4 px-6 text-sm font-medium text-gray-900 outline-none focus:border-[#8D6E63] appearance-none disabled:opacity-50`}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                    {errors.categoryId && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.categoryId}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Placement Section */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Navigation Placement</h3>
                            
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gifts For</label>
                                        <span className="text-[9px] font-bold text-gray-300 uppercase italic">Optional</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {navGiftOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => !isViewMode && toggleNavValue('navGiftsFor', opt.value)}
                                                disabled={isViewMode}
                                                className={`flex items-center gap-2 py-2.5 px-5 rounded-xl border text-xs font-bold transition-all ${
                                                    formData.navGiftsFor.includes(opt.value)
                                                    ? 'bg-[#3E2723] border-[#3E2723] text-white'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                                } ${isViewMode ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                                            >
                                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                                                    formData.navGiftsFor.includes(opt.value) ? 'bg-white border-white' : 'border-gray-200'
                                                }`}>
                                                    {formData.navGiftsFor.includes(opt.value) && <CheckCircle2 className="w-2.5 h-2.5 text-[#3E2723]" />}
                                                </div>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Occasions</label>
                                        <span className="text-[9px] font-bold text-gray-300 uppercase italic">Optional</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {navOccasionOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => !isViewMode && toggleNavValue('navOccasions', opt.value)}
                                                disabled={isViewMode}
                                                className={`flex items-center gap-2 py-2.5 px-5 rounded-xl border text-xs font-bold transition-all ${
                                                    formData.navOccasions.includes(opt.value)
                                                    ? 'bg-[#3E2723] border-[#3E2723] text-white'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                                } ${isViewMode ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                                            >
                                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                                                    formData.navOccasions.includes(opt.value) ? 'bg-white border-white' : 'border-gray-200'
                                                }`}>
                                                    {formData.navOccasions.includes(opt.value) && <CheckCircle2 className="w-2.5 h-2.5 text-[#3E2723]" />}
                                                </div>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Strategy Section */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Inventory Strategy</h3>
                            <div 
                                onClick={() => !isViewMode && setFormData(p => ({ ...p, isSerialized: !p.isSerialized }))}
                                className={`w-full bg-[#FDFBF7] border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${!isViewMode ? 'cursor-pointer hover:border-[#8D6E63]/30' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                        <BarcodeIcon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-[#1A1A1A] uppercase tracking-widest">Serialized Inventory</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Generate unique IDs per item (e.g. RING001, RING002)</p>
                                    </div>
                                </div>
                                <div className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${formData.isSerialized ? 'bg-[#3E2723]' : 'bg-gray-200'}`}>
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${formData.isSerialized ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {formData.isSerialized && (
                                <div className="space-y-6 pt-4 animate-in slide-in-from-top-4 duration-500">
                                    <div className="bg-[#FDFBF7] border border-gray-100 rounded-[1.5rem] p-6 space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Master Quantity Hub</label>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase italic">Units requested from the artisan</p>
                                            </div>
                                            <input 
                                                type="number" 
                                                min="1"
                                                max="100"
                                                value={formData.productCodes.length || ''}
                                                disabled={isViewMode}
                                                onChange={(e) => handleSerializedQuantityChange(e.target.value)}
                                                className="w-20 bg-white border border-gray-100 rounded-xl py-2 px-4 text-xs font-black text-center focus:outline-none focus:border-[#8D6E63]/30 transition-all text-gray-800"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="space-y-4 border-t border-gray-100 pt-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-3 bg-amber-200 rounded-full" />
                                                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Registry Allocation</p>
                                                </div>
                                                {!isViewMode && (
                                                    <button 
                                                        type="button"
                                                        onClick={autoGenerateProductCodes}
                                                        className="text-[9px] font-black text-[#8D6E63] uppercase hover:underline tracking-widest"
                                                    >
                                                        Auto-Generate
                                                    </button>
                                                )}
                                            </div>

                                            {formData.productCodes.length > 0 ? (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {formData.productCodes.map((code, idx) => (
                                                        <div key={idx} className="relative group">
                                                            <input 
                                                                placeholder={`Unit #${idx + 1}`}
                                                                value={code}
                                                                disabled={isViewMode}
                                                                onChange={(e) => handleProductCodeChange(idx, e.target.value)}
                                                                className="w-full bg-white border border-gray-100 rounded-lg py-2.5 px-3 text-[10px] font-mono font-black text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#8D6E63]/30 transition-all"
                                                            />
                                                            <div className="absolute top-1 right-2 text-[8px] font-black text-gray-200 uppercase pointer-events-none group-focus-within:hidden">#{idx + 1}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center py-4 text-[9px] font-bold text-gray-300 uppercase italic tracking-widest">
                                                    Awaiting unit count for registry generation...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Product Narrative & Styling Section */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-8 text-gray-950">
                            <h3 className="text-xl font-bold text-gray-900">Product Narrative & Styling</h3>
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-600">Product Description</label>
                                <ReactQuill 
                                    theme="snow" 
                                    value={formData.description} 
                                    onChange={(v) => !isViewMode && setFormData(p => ({...p, description: v}))} 
                                    readOnly={isViewMode}
                                    placeholder="Tell the story of this jewelry..."
                                    className="bg-white rounded-xl overflow-hidden"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-600">Styling Tips</label>
                                    <ReactQuill 
                                        theme="snow" 
                                        value={formData.stylingTips} 
                                        onChange={(v) => !isViewMode && setFormData(p => ({...p, stylingTips: v}))} 
                                        readOnly={isViewMode}
                                        placeholder="How to wear it..."
                                        className="bg-white rounded-xl overflow-hidden"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-600">Caring Tips</label>
                                        {!isViewMode && (
                                            <button 
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, careTips: "<p><strong>Jewelry Care Guide:</strong></p><ul><li>Avoid direct contact with perfumes, lotions, and hairsprays.</li><li>Remove jewelry before swimming, bathing, or exercising.</li><li>Store in a cool, dry place, ideally in an airtight bag or box.</li><li>Clean occasionally with a soft, lint-free cloth to restore shine.</li></ul>" }))}
                                                className="text-[9px] font-black text-[#8D6E63] uppercase underline tracking-widest"
                                            >
                                                Template
                                            </button>
                                        )}
                                    </div>
                                    <ReactQuill 
                                        theme="snow" 
                                        value={formData.careTips} 
                                        onChange={(v) => !isViewMode && setFormData(p => ({...p, careTips: v}))} 
                                        readOnly={isViewMode}
                                        placeholder="Maintenance guide..."
                                        className="bg-white rounded-xl overflow-hidden"
                                    />
                                </div>
                            </div>

                            {/* Variants Section */}
                            <div className="space-y-6 pt-8 border-t border-gray-50">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900">Inventory Details</h3>
                                    {!isViewMode && (
                                        <button type="button" onClick={addVariant} className="flex items-center gap-2 text-[10px] font-black text-[#3E2723] uppercase tracking-widest">
                                            <Plus size={14} /> Add Variant
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {formData.variants.map((v, idx) => (
                                        <div key={v.id} className="flex flex-col gap-4 bg-[#FDFBF7] p-6 rounded-[1.5rem] border border-gray-100 group relative">
                                            {!isViewMode && formData.variants.length > 1 && (
                                                <button 
                                                    onClick={() => removeVariant(v.id)} 
                                                    className="absolute top-4 right-4 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            )}
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Variant Name</label>
                                                    <input 
                                                        value={v.name} 
                                                        onChange={(e) => handleVariantChange(v.id, 'name', e.target.value)} 
                                                        disabled={isViewMode} 
                                                        className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all" 
                                                        placeholder="Standard" 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Making Charge</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="number" 
                                                            value={v.makingCharge} 
                                                            onChange={(e) => handleVariantChange(v.id, 'makingCharge', e.target.value)} 
                                                            disabled={isViewMode} 
                                                            className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-10 pr-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all" 
                                                            placeholder="0" 
                                                        />
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₹</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Diamond Price</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="number" 
                                                            value={v.diamondPrice} 
                                                            onChange={(e) => handleVariantChange(v.id, 'diamondPrice', e.target.value)} 
                                                            disabled={isViewMode} 
                                                            className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-10 pr-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all" 
                                                            placeholder="0" 
                                                        />
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₹</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-50 pt-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest">Total Retail MRP (Calculated)</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="number" 
                                                            value={v.mrp} 
                                                            onChange={(e) => handleVariantChange(v.id, 'mrp', e.target.value)} 
                                                            disabled={isViewMode} 
                                                            readOnly
                                                            className="w-full bg-amber-50/5 border border-amber-100/30 rounded-xl py-4 pl-10 pr-5 text-sm font-black text-[#3E2723] outline-none" 
                                                            placeholder="Total MRP" 
                                                        />
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 font-bold">₹</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selling Price</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="number" 
                                                            value={v.price} 
                                                            onChange={(e) => handleVariantChange(v.id, 'price', e.target.value)} 
                                                            disabled={isViewMode} 
                                                            className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-10 pr-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all" 
                                                            placeholder="Final Price" 
                                                        />
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₹</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Units</label>
                                                    <input 
                                                        type="number" 
                                                        value={v.stock} 
                                                        onChange={(e) => handleVariantChange(v.id, 'stock', e.target.value)} 
                                                        disabled={isViewMode} 
                                                        className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63]/30 transition-all" 
                                                        placeholder="Stock" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemEditor;
