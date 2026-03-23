import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    IndianRupee, 
    Image as ImageIcon, Plus, CheckCircle2, X, Upload, 
    Info, Tag, Layout, Type, ScanLine, ArrowLeft,
    Sparkles, ImagePlus, Copy, ExternalLink, FileText
} from 'lucide-react';
import { sellerProductService } from '../services/sellerProductService';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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

const sizeOptions = [
    '5', '6', '7', '8', '9', '10', '2.2', '2.4', '2.6', 'Adjustable'
];

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        stylingTips: '',
        cardLabel: '',
        cardBadge: '',
        metalType: 'Silver',
        weight: '',
        weightUnit: 'Grams',
        originalPrice: '',
        sellingPrice: '',
        discount: 0,
        quantity: '',
        images: [], // for previews
        sizes: [],
        categoryId: '',
        isSerialized: false,
        productCodes: [],
        tags: {
            isNewArrival: false,
            isMostGifted: false,
            isNewLaunch: false
        }
    });

    const [enhancingIndex, setEnhancingIndex] = useState(null);
    const [showEnhanceModal, setShowEnhanceModal] = useState(false);
    const [enhancedIndices, setEnhancedIndices] = useState(new Set());

    const ENHANCEMENT_PROMPT = "Enhance this product image for eCommerce use. Improve lighting, sharpness, remove background noise, make it look professional, high resolution, clean white or premium background, realistic colors, suitable for online store listing.";

    // Fetch dynamic categories
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await api.get('public/categories');
                if (res.data.success) {
                    const list = res.data.data.categories || [];
                    setCategoriesList(list.filter(cat => cat.isActive !== false));
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCats();
    }, []);

    // Auto-calculate discount
    useEffect(() => {
        if (formData.originalPrice && formData.sellingPrice) {
            const original = parseFloat(formData.originalPrice);
            const selling = parseFloat(formData.sellingPrice);
            if (original > selling) {
                const disc = Math.round(((original - selling) / original) * 100);
                setFormData(prev => ({ ...prev, discount: disc }));
            } else {
                setFormData(prev => ({ ...prev, discount: 0 }));
            }
        }
    }, [formData.originalPrice, formData.sellingPrice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        
        setImageFiles(prev => [...prev, ...files].slice(0, 5));
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newPreviews].slice(0, 5)
        }));
    };

    const handleEnhancedUpload = (e) => {
        const file = e.target.files[0];
        if (!file || enhancingIndex === null) return;
        
        const preview = URL.createObjectURL(file);
        
        // Replace original image and file
        setFormData(prev => {
            const newImages = [...prev.images];
            newImages[enhancingIndex] = preview;
            return { ...prev, images: newImages };
        });
        setImageFiles(prev => {
            const newFiles = [...prev];
            newFiles[enhancingIndex] = file;
            return newFiles;
        });
        
        setEnhancedIndices(prev => new Set(prev).add(enhancingIndex));
        setShowEnhanceModal(false);
        setEnhancingIndex(null);
        toast.success("✅ Image enhanced successfully");
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, categoryId: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productForm = new FormData();

            if (!formData.name || !formData.categoryId) {
                toast.error("Please add a product name and select a category.");
                setLoading(false);
                return;
            }
            
            // Append flat fields
            productForm.append('name', formData.name);
            productForm.append('description', formData.description);
            productForm.append('stylingTips', formData.stylingTips);
            productForm.append('cardLabel', formData.cardLabel);
            productForm.append('cardBadge', formData.cardBadge);
            productForm.append('weight', parseFloat(formData.weight) || 0);
            productForm.append('weightUnit', formData.weightUnit);
            productForm.append('material', formData.metalType);

            // Single category
            productForm.append('categories', JSON.stringify([formData.categoryId]));

            // Map Variants
            const variants = [{
                name: "Standard",
                mrp: parseFloat(formData.originalPrice) || 0,
                price: parseFloat(formData.sellingPrice) || 0,
                stock: parseInt(formData.quantity) || 0,
                discount: parseInt(formData.discount) || 0
            }];
            productForm.append('variants', JSON.stringify(variants));

            // Append Tags & Sizes
            productForm.append('tags', JSON.stringify(formData.tags));
            productForm.append('sizes', JSON.stringify(formData.sizes));

            productForm.append('isSerialized', formData.isSerialized);
            if (formData.isSerialized) {
                productForm.append('productCodes', JSON.stringify(formData.productCodes));
            }

            // Append Images
            imageFiles.forEach(file => productForm.append('images', file));

            const res = await sellerProductService.addProduct(productForm);
            const count = res?.products?.length || (formData.isSerialized ? formData.quantity : 1);
            toast.success(formData.isSerialized ? `${count} Serialized items created successfully` : "Product submitted successfully");
            setLoading(false);
            navigate('/seller/products');
        } catch (err) {
            console.error("Submit failed:", err);
            toast.error(err.response?.data?.message || "Failed to publish product. Please check all fields.");
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-12 text-sm focus:outline-none focus:border-[#8D6E63] focus:ring-4 focus:ring-[#8D6E63]/5 transition-all shadow-inner";
    const labelClasses = "text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-1 mb-2 block";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#8D6E63] transition-colors mt-[3px]";

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/seller/products')}
                        className="p-2.5 hover:bg-white rounded-xl border border-gray-100 shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Create New Listing</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Setup your product narrative & technical composition</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button type="button" onClick={() => navigate('/seller/products')} className="px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all border border-transparent">Cancel</button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-3.5 bg-[#3E2723] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all flex items-center gap-2 group"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Publish Product <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" /></>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Side Bar: Media & Card Labels (4 Columns) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Visual Gallery */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.2em]">Visual Gallery (Max 5)</h3>
                            <ImageIcon className="w-4 h-4 text-gray-300" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 shadow-sm animate-in zoom-in-95">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            {formData.images.length < 5 && (
                                <label className="aspect-square rounded-2xl bg-[#FDFBF7] border-2 border-dashed border-[#EFEBE9] flex flex-col items-center justify-center cursor-pointer hover:border-[#8D6E63] hover:bg-[#8D6E63]/5 transition-all group">
                                    <Upload className="w-6 h-6 text-gray-300 group-hover:text-[#8D6E63] transition-colors" />
                                    <span className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Add Shot</span>
                                    <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            )}
                        </div>

                        <div className="flex gap-2 w-full mt-2">
                            <label className="flex-[5] py-3.5 bg-gray-50 border border-gray-200 text-[#3E2723] rounded-xl text-[9px] font-black uppercase tracking-widest text-center cursor-pointer hover:bg-white hover:border-[#3E2723] transition-all flex items-center justify-center gap-2">
                                <Upload size={14} /> Upload Image
                                <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </label>
                            
                            <div className="flex-[6] relative group">
                                <button 
                                    type="button"
                                    disabled={formData.images.length === 0}
                                    onClick={() => {
                                        setEnhancingIndex(0); // Default to first image
                                        setShowEnhanceModal(true);
                                    }}
                                    className={`w-full py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border shadow-sm
                                        ${formData.images.length > 0 
                                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600' 
                                            : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                        }`}
                                >
                                    <Sparkles size={14} className={formData.images.length > 0 ? "animate-pulse" : ""} /> Enhance Image
                                </button>
                                
                                {formData.images.length === 0 && (
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-widest">
                                        Upload image first
                                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {formData.images.length > 0 && enhancedIndices.size > 0 && (
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span className="text-[8px] font-black text-emerald-800 uppercase tracking-widest">Images listed below are AI-Enhanced</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card Labels */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.2em]">Display Overlays</h3>
                            <Layout className="w-4 h-4 text-gray-300" />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={labelClasses}>Top Label (Left)</label>
                                <input name="cardLabel" value={formData.cardLabel} onChange={handleChange} className={inputClasses.replace('px-12', 'px-4')} placeholder="e.g. 9 TO 5 SILVER" />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Corner Badge (Right)</label>
                                <input name="cardBadge" value={formData.cardBadge} onChange={handleChange} className={inputClasses.replace('px-12', 'px-4')} placeholder="e.g. NEW" />
                            </div>
                        </div>
                    </div>

                    {/* Specifications & Pricing */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.2em]">Economic Matrix</h3>
                            <IndianRupee className="w-4 h-4 text-gray-300" />
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={labelClasses}>Material</label>
                                <select name="metalType" value={formData.metalType} onChange={handleChange} className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63] transition-all cursor-pointer">
                                    <option value="Gold">Gold</option>
                                    <option value="Silver">Silver</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Weight & Unit</label>
                                <div className="flex gap-2">
                                    <input type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange} className="flex-1 bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-gray-800 outline-none" placeholder="0.00" />
                                    <select name="weightUnit" value={formData.weightUnit} onChange={handleChange} className="w-24 bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl text-[10px] font-black uppercase text-[#8D6E63] transition-all cursor-pointer">
                                        <option value="Grams">Grams</option>
                                        <option value="Carats">Carats</option>
                                        <option value="Milligrams">Milligrams</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Original Price (INR)</label>
                                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-gray-800 outline-none" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Offer Price (INR)</label>
                                <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-[#8D6E63] outline-none border-[#8D6E63]/20" placeholder="0" />
                            </div>
                            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
                                <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Computed Discount</span>
                                <span className="text-xs font-black text-emerald-700">{formData.discount}% OFF</span>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <div className="flex items-center justify-between">
                                    <label className={labelClasses}>Serialized Inventory</label>
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData(prev => ({ ...prev, isSerialized: !prev.isSerialized }))}
                                        className={`w-10 h-5 rounded-full transition-all relative ${formData.isSerialized ? 'bg-[#3E2723]' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isSerialized ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight tracking-wider">
                                    Create distinct records for every piece (for unique tracking)
                                </p>

                                {formData.isSerialized ? (
                                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Physical Counts</label>
                                            <input 
                                                type="number" 
                                                min="1"
                                                max="100"
                                                value={formData.quantity} 
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 0;
                                                    setFormData(prev => {
                                                        const newCodes = [...prev.productCodes];
                                                        if (val > newCodes.length) {
                                                            // Add empty slots
                                                            for(let i=newCodes.length; i<val; i++) newCodes.push('');
                                                        } else {
                                                            newCodes.length = val;
                                                        }
                                                        return { ...prev, quantity: val, productCodes: newCodes };
                                                    });
                                                }}
                                                className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-gray-800 outline-none" 
                                                placeholder="Total Items to Scan" 
                                            />
                                        </div>

                                        <div className="space-y-3 max-h-[200px] overflow-y-auto px-1 custom-scrollbar">
                                            {formData.productCodes.map((code, idx) => (
                                                <div key={idx} className="flex gap-2 animate-in fade-in duration-300">
                                                    <div className="flex-1 relative group">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-300 group-focus-within:text-[#3E2723]">#{idx+1}</span>
                                                        <input 
                                                            value={code}
                                                            onChange={(e) => {
                                                                const newVal = e.target.value.toUpperCase();
                                                                setFormData(prev => {
                                                                    const nc = [...prev.productCodes];
                                                                    nc[idx] = newVal;
                                                                    return { ...prev, productCodes: nc };
                                                                });
                                                            }}
                                                            className="w-full bg-white border border-[#EFEBE9] rounded-lg py-2.5 pl-8 pr-10 text-[11px] font-mono font-bold focus:border-[#3E2723] outline-none transition-all"
                                                            placeholder="ENTER CODE / SCAN"
                                                        />
                                                        <ScanLine className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 hover:text-[#3E2723] cursor-pointer" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {formData.productCodes.length > 0 && (
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        productCodes: prev.productCodes.map((c, i) => c || `SN${Date.now().toString().slice(-6)}${i}`)
                                                    }));
                                                }}
                                                className="w-full py-2 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-[#3E2723] hover:bg-gray-100 transition-all"
                                            >
                                                Auto-Generate Empty Codes
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2 animate-in fade-in duration-300">
                                        <label className={labelClasses}>Standard Stock Quantity</label>
                                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-gray-800 outline-none" placeholder="0" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Column: Info & Narrative (8 Columns) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Core Information */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.2em]">Product Classification</h3>
                            <Type className="w-4 h-4 text-gray-300" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className={labelClasses}>Product Title</label>
                                <button 
                                    type="button"
                                    onClick={() => alert('Opening Vision Scanner...')}
                                    className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5 hover:underline"
                                >
                                    <ScanLine size={12} /> Scan SKU
                                </button>
                            </div>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-2xl py-5 px-6 text-lg font-bold text-gray-900 focus:outline-none focus:border-[#8D6E63] transition-all placeholder:text-gray-300" placeholder="e.g. 925 Silver Solitaire Ring" />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className={labelClasses}>Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="w-full bg-white border border-[#EFEBE9] rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723] transition-all"
                                >
                                    <option value="">Select Category...</option>
                                    {categoriesList.map(catItem => (
                                        <option key={catItem._id} value={catItem._id}>{catItem.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Available Sizes */}
                        <div className="space-y-4 pt-4">
                            <label className={labelClasses}>Variant Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {sizeOptions.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                            formData.sizes.includes(size)
                                            ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-lg shadow-[#3E2723]/20'
                                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Narrative & Narrative */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.2em]">Storytelling & Styling</h3>
                            <Info className="w-4 h-4 text-gray-300" />
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-3">
                                <label className={labelClasses}>The Craftsmanship (Description)</label>
                                <div className="bg-[#FDFBF7] rounded-3xl overflow-hidden border border-[#EFEBE9]">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        style={{ height: '250px', marginBottom: '50px' }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className={labelClasses}>Professional Styling Tips</label>
                                <div className="bg-[#FDFBF7] rounded-3xl overflow-hidden border border-[#EFEBE9]">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.stylingTips}
                                        onChange={(val) => setFormData(prev => ({ ...prev, stylingTips: val }))}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        style={{ height: '150px', marginBottom: '50px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Launch Configuration */}
                    <div className="bg-[#0F172A] rounded-[2rem] p-10 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20">
                                    <Tag className="w-5 h-5 text-sky-400" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest">Marketplace Tags</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Object.entries(formData.tags).map(([key, val]) => (
                                    <label key={key} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                                        val ? 'bg-sky-500/10 border-sky-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-sky-100">{key.replace('is', '').replace(/([A-Z])/g, ' $1')}</span>
                                        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                                            val ? 'bg-sky-500 border-sky-500' : 'bg-transparent border-white/20'
                                        }`}>
                                            {val && <Plus className="w-3.5 h-3.5 text-white" />}
                                            <input 
                                                type="checkbox" 
                                                className="hidden" 
                                                checked={val}
                                                onChange={() => setFormData(prev => ({
                                                    ...prev,
                                                    tags: { ...prev.tags, [key]: !prev.tags[key] }
                                                }))}
                                            />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-sky-500/10 transition-colors" />
                    </div>
                </div>
            </div>

            {/* AI Enhancement Modal */}
            {showEnhanceModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
                        <div className="bg-[#3E2723] p-8 text-white relative">
                            <div className="flex items-center gap-3 mb-2">
                                <Sparkles className="w-6 h-6 text-amber-400" />
                                <h2 className="text-2xl font-black uppercase tracking-tight">AI Image Enhancement</h2>
                            </div>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Unlock studio-quality visuals with Gemini</p>
                            <button 
                                onClick={() => setShowEnhanceModal(false)}
                                className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Current Image Preview */}
                            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                                <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                                    <img src={formData.images[enhancingIndex]} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Image</p>
                                    <p className="text-xs font-bold text-[#3E2723]">Processing Shot #{enhancingIndex + 1}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest">The Enhancement Workflow</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { icon: ExternalLink, text: "Click 'Open Gemini' below to open the AI Studio" },
                                        { icon: Upload, text: "Upload this product shot into the Gemini chat" },
                                        { icon: FileText, text: "Copy and paste our specialized prompt" },
                                        { icon: ImagePlus, text: "Download the enhanced result & upload it here" }
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                                <step.icon size={12} className="text-amber-600" />
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-600 leading-relaxed">{step.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 bg-[#FDFBF7] p-5 rounded-2xl border border-[#EFEBE9]">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-[#8D6E63] uppercase tracking-[0.2em]">The Prompt</span>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(ENHANCEMENT_PROMPT);
                                            toast.success("Prompt copied to clipboard");
                                        }}
                                        className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase hover:underline"
                                    >
                                        <Copy size={10} /> Copy Prompt
                                    </button>
                                </div>
                                <p className="text-[11px] font-medium text-gray-500 italic leading-relaxed">
                                    "{ENHANCEMENT_PROMPT}"
                                </p>
                            </div>
                        </div>

                        <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                            <a 
                                href="https://gemini.google.com/" 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full py-4 bg-[#3E2723] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/20 hover:bg-black transition-all flex items-center justify-center gap-2 group"
                            >
                                1. Open Gemini <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            
                            <label className="w-full py-4 bg-white border-2 border-dashed border-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-amber-600 hover:text-amber-600 cursor-pointer transition-all flex items-center justify-center gap-2 group">
                                <ImagePlus size={14} /> 2. Upload Enhanced Product
                                <input type="file" className="hidden" onChange={handleEnhancedUpload} accept="image/*" />
                            </label>
                            
                            <button 
                                onClick={() => setShowEnhanceModal(false)}
                                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Continue without enhancing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProduct;
