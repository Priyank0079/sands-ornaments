import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Package, Layers, IndianRupee, Hash, FileText, 
    Image as ImageIcon, Plus, CheckCircle2, X, Upload, Trash2, 
    Info, Tag, Layout, Type, ScanLine, ArrowLeft
} from 'lucide-react';
import { sellerProductService } from '../services/sellerProductService';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import api from '../../../services/api';

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
        metalType: 'Gold',
        weight: '',
        weightUnit: 'Gram',
        originalPrice: '',
        sellingPrice: '',
        discount: 0,
        quantity: '',
        images: [], // for previews
        sizes: [],
        categories: [{ id: Date.now(), category: '' }],
        tags: {
            isNewArrival: false,
            isMostGifted: false,
            isNewLaunch: false
        }
    });

    // Fetch dynamic categories
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await api.get('/categories');
                if (res.data.success) {
                    setCategoriesList(res.data.data.categories);
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

    const handleCategoryChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map(c => {
                if (c.id === id) {
                    if (field === 'category') {
                        return { ...c, category: value };
                    }
                    return { ...c, [field]: value };
                }
                return c;
            })
        }));
    };

    const addCategory = () => {
        setFormData(prev => ({
            ...prev,
            categories: [...prev.categories, { id: Date.now(), category: '' }]
        }));
    };

    const removeCategory = (id) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c.id !== id)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productForm = new FormData();
            
            // Append flat fields
            productForm.append('name', formData.name);
            productForm.append('description', formData.description);
            productForm.append('stylingTips', formData.stylingTips);
            productForm.append('cardLabel', formData.cardLabel);
            productForm.append('cardBadge', formData.cardBadge);
            productForm.append('weight', parseFloat(formData.weight) || 0);
            productForm.append('weightUnit', formData.weightUnit);
            productForm.append('metal', formData.metalType); // Map metalType to metal for consistency

            // Map categories to IDs
            const categoryIds = formData.categories
                .filter(c => c.category && c.category !== 'other')
                .map(c => c.category);
            productForm.append('categories', JSON.stringify(categoryIds));

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

            // Append Images
            imageFiles.forEach(file => productForm.append('images', file));

            await sellerProductService.addProduct(productForm);
            setLoading(false);
            navigate('/seller/products');
        } catch (err) {
            console.error("Submit failed:", err);
            alert("Failed to publish product. Please check all fields.");
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
                                <label className={labelClasses}>Metal Type</label>
                                <select name="metalType" value={formData.metalType} onChange={handleChange} className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-gray-800 outline-none focus:border-[#8D6E63] transition-all cursor-pointer">
                                    <option value="Gold">Gold</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Diamond">Diamond</option>
                                    <option value="Platinum">Platinum</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Weight & Unit</label>
                                <div className="flex gap-2">
                                    <input type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange} className="flex-1 bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-gray-800 outline-none" placeholder="0.00" />
                                    <select name="weightUnit" value={formData.weightUnit} onChange={handleChange} className="w-24 bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl text-[10px] font-black uppercase text-[#8D6E63] transition-all cursor-pointer">
                                        <option value="Gram">Grams</option>
                                        <option value="Carat">Carats</option>
                                        <option value="Milligram">mg</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Original Price (₹)</label>
                                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-gray-800 outline-none" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Offer Price (₹)</label>
                                <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-[#8D6E63] outline-none border-[#8D6E63]/20" placeholder="0" />
                            </div>
                            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
                                <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Computed Discount</span>
                                <span className="text-xs font-black text-emerald-700">{formData.discount}% OFF</span>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Stock Quantity</label>
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-4 text-sm font-bold text-gray-800 outline-none" placeholder="0" />
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
                            <div className="flex items-center justify-between">
                                <label className={labelClasses}>Categories (Multiple Hierarchy)</label>
                                <button type="button" onClick={addCategory} className="text-[9px] font-black text-[#3E2723] uppercase tracking-widest flex items-center gap-1 hover:underline">
                                    <Plus className="w-3.5 h-3.5" /> Add Category
                                </button>
                            </div>
                            <div className="space-y-4">
                                {formData.categories.map((cat, index) => (
                                    <div key={cat.id} className="p-6 rounded-3xl bg-[#FDFBF7] border border-[#EFEBE9] relative group animate-in slide-in-from-top-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Main Category</p>
                                                <select
                                                    value={cat.category}
                                                    onChange={(e) => handleCategoryChange(cat.id, 'category', e.target.value)}
                                                    className="w-full bg-white border border-[#EFEBE9] rounded-xl p-3 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723] transition-all"
                                                >
                                                    <option value="">Select Category...</option>
                                                    {categoriesList.map(catItem => (
                                                        <option key={catItem._id} value={catItem._id}>{catItem.name}</option>
                                                    ))}
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        {cat.category === 'other' && (
                                            <div className="mt-4 animate-in zoom-in-95">
                                                <input
                                                    type="text"
                                                    value={cat.customCategory || ''}
                                                    onChange={(e) => handleCategoryChange(cat.id, 'customCategory', e.target.value)}
                                                    className="w-full bg-white border border-[#EFEBE9] rounded-xl p-3 text-[11px] font-bold uppercase"
                                                    placeholder="Custom Category..."
                                                />
                                            </div>
                                        )}

                                        {formData.categories.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(cat.id)}
                                                className="absolute -top-3 -right-3 p-2 bg-white text-gray-400 hover:text-red-500 border border-gray-100 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
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
        </div>
    );
};

export default AddProduct;
