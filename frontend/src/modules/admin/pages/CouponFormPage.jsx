import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Ticket,
    Calendar,
    Settings,
    ShieldCheck,
    Info,
    CheckCircle2,
    XCircle,
    Copy,
    AlertCircle
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { PRODUCTS as mockProducts } from '../../../mockData/data'; // Fallback / Helper
import PageHeader from '../components/common/PageHeader';
import { FormSection, Input, Select, TextArea } from '../components/common/FormControls';

const CouponFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, coupons, addCoupon, updateCoupon } = useShop();
    const isEdit = Boolean(id);

    // Hardcoded Categories for simplicty (usually from context)
    const CATEGORIES = [
        { id: 'nuts', name: 'Nuts' },
        { id: 'dried-fruits', name: 'Dried Fruits' },
        { id: 'seeds-mixes', name: 'Seeds & Mixes' },
        { id: 'combos-packs', name: 'Combos & Packs' }
    ];

    const SUBCATEGORIES = [
        'Almonds', 'Cashews', 'Walnuts (Akhrot)', 'Pistachios',
        'Raisins', 'Dates', 'Dried Figs (Anjeer)',
        'Seeds', 'Mixes', 'Daily Packs', 'Gifting'
    ];

    const [formData, setFormData] = useState({
        code: '',
        type: 'flat',
        value: '',
        minOrderValue: '',
        maxDiscount: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        usageLimit: '',
        perUserLimit: 1,
        active: true,
        userEligibility: 'all',
        description: '',
        // New Fields
        applicabilityType: 'all', // 'all', 'category', 'subcategory', 'product'
        targetItems: [] // Array of IDs or Names
    });

    useEffect(() => {
        if (isEdit && coupons) {
            const coupon = coupons.find(c => c.id === id);
            if (coupon) setFormData({
                ...coupon,
                value: coupon.amount || coupon.value || '', // Handle both structures
                minOrderValue: coupon.minOrder || coupon.minOrderValue || '',
                description: coupon.desc || coupon.description || '',
                applicabilityType: coupon.applicabilityType || 'all',
                targetItems: coupon.targetItems || []
            });
        }
    }, [id, isEdit, coupons]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleTargetItem = (itemValue) => {
        setFormData(prev => {
            const current = prev.targetItems || [];
            if (current.includes(itemValue)) {
                return { ...prev, targetItems: current.filter(i => i !== itemValue) };
            } else {
                return { ...prev, targetItems: [...current, itemValue] };
            }
        });
    };

    const handleSave = (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            // Map to standard structure
            amount: Number(formData.value),
            minOrder: Number(formData.minOrderValue),
            desc: formData.description,
            // Keep original fields too for compatibility if needed, but standardize on above
            value: Number(formData.value),
            minOrderValue: Number(formData.minOrderValue),
            description: formData.description,

            usageCount: isEdit ? formData.usageCount : 0,
            maxDiscount: Number(formData.maxDiscount) || null,
            usageLimit: Number(formData.usageLimit) || 1000,
            perUserLimit: Number(formData.perUserLimit) || 1
        };

        if (isEdit) {
            updateCoupon(id, payload);
        } else {
            addCoupon(payload);
        }
        navigate('/admin/coupons');
    };

    const handleSaveAction = {
        label: isEdit ? 'Update Coupon' : 'Deploy Coupon',
        icon: <Save size={16} />,
        onClick: handleSave
    };

    return (
        <div className="space-y-10 pb-20 text-left animate-in fade-in duration-500">
            <PageHeader
                title={isEdit ? 'Configure Coupon' : 'New Promo Campaign'}
                subtitle={isEdit ? `Modifying settings for ${formData.code}` : 'Design a new high-conversion discount code'}
                backPath="/admin/coupons"
                action={handleSaveAction}
            />

            <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Core Logic */}
                <div className="lg:col-span-8 space-y-6">
                    {/* 1. Core Settings */}
                    <FormSection title="Core Settings" icon={<Info size={18} className="text-gray-400" />}>
                        <div className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <Input
                                    label="Promotional Code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder="e.g., WELCOME50"
                                />
                                <div className="text-right">
                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-[#3E2723] hover:underline"
                                        onClick={() => setFormData({ ...formData, code: `SALE${Math.floor(Math.random() * 900) + 100}` })}
                                    >
                                        Auto-Generate
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Select
                                    label="Discount Type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'flat', label: 'Flat Amount (₹)' },
                                        { value: 'percentage', label: 'Percentage (%)' },
                                        { value: 'free_shipping', label: 'Free Shipping' }
                                    ]}
                                />
                                <Input
                                    label="Discount Value"
                                    type="number"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleChange}
                                    disabled={formData.type === 'free_shipping'}
                                    placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
                                />
                            </div>

                            <TextArea
                                label="Campaign Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Explain the offer to customers..."
                            />
                        </div>
                    </FormSection>

                    {/* 2. Coupon Scope (Unified) */}
                    <FormSection title="Coupon Scope" icon={<ShieldCheck size={18} className="text-gray-400" />}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-gray-500">Define where this coupon applies.</span>
                            {formData.targetItems.length > 0 && (
                                <span className="text-[10px] font-bold text-white bg-[#3E2723] px-2 py-1 rounded">
                                    {formData.targetItems.length} items selected
                                </span>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Scope Tabs */}
                            <div className="flex p-1 bg-gray-100 rounded-lg space-x-1 overflow-x-auto">
                                {[
                                    { id: 'all', label: 'All Orders' },
                                    { id: 'new_user', label: 'New Users' },
                                    { id: 'category', label: 'Category' },
                                    { id: 'product', label: 'Product' }
                                ].map(scope => {
                                    const isActive = (scope.id === 'new_user' && formData.userEligibility === 'new') ||
                                        (scope.id !== 'new_user' && formData.applicabilityType === scope.id && formData.userEligibility !== 'new');

                                    return (
                                        <button
                                            key={scope.id}
                                            type="button"
                                            onClick={() => {
                                                if (scope.id === 'new_user') {
                                                    setFormData({ ...formData, applicabilityType: 'all', userEligibility: 'new', targetItems: [] });
                                                } else {
                                                    setFormData({ ...formData, applicabilityType: scope.id, userEligibility: 'all', targetItems: [] });
                                                }
                                            }}
                                            className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${isActive
                                                ? 'bg-white text-[#3E2723] shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {scope.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Scope Content */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden min-h-[150px] max-h-[400px] overflow-y-auto p-4 bg-gray-50">
                                {formData.userEligibility === 'new' && (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-2">
                                        <div className="w-12 h-12 bg-[#3E2723]/10 rounded-full flex items-center justify-center text-[#3E2723] mb-2">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">New Users Only</p>
                                        <p className="text-xs text-gray-500 max-w-xs">This coupon will only work for customers placing their first order.</p>
                                    </div>
                                )}

                                {formData.applicabilityType === 'all' && formData.userEligibility !== 'new' && (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-2">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">Entire Order</p>
                                        <p className="text-xs text-gray-500 max-w-xs">This coupon applies to the total cart value for all users.</p>
                                    </div>
                                )}

                                {formData.applicabilityType === 'category' && formData.userEligibility !== 'new' && (
                                    <div className="space-y-2">
                                        {CATEGORIES.map(cat => (
                                            <label key={cat.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-[#3E2723]/30 transition-all">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.targetItems.includes(cat.id) ? 'bg-[#3E2723] border-[#3E2723]' : 'border-gray-300'}`}>
                                                    {formData.targetItems.includes(cat.id) && <CheckCircle2 size={12} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={formData.targetItems.includes(cat.id)}
                                                    onChange={() => toggleTargetItem(cat.id)}
                                                />
                                                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {formData.applicabilityType === 'product' && formData.userEligibility !== 'new' && (
                                    <div className="space-y-2">
                                        {(products || []).length > 0 ? (products || []).map(p => (
                                            <label key={p.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-[#3E2723]/30 transition-all">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${formData.targetItems.includes(p.id) ? 'bg-[#3E2723] border-[#3E2723]' : 'border-gray-300'}`}>
                                                    {formData.targetItems.includes(p.id) && <CheckCircle2 size={12} className="text-white" />}
                                                </div>
                                                <img src={p.image} className="w-8 h-8 object-contain mix-blend-multiply" alt="" />
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={formData.targetItems.includes(p.id)}
                                                    onChange={() => toggleTargetItem(p.id)}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-semibold text-gray-800 truncate">{p.name}</div>
                                                    <div className="text-[10px] text-gray-500">{p.id} • {p.category}</div>
                                                </div>
                                            </label>
                                        )) : (
                                            <div className="text-center p-4 text-sm text-gray-400">No products found.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </FormSection>
                </div>

                {/* Right: Validity & Targets */}
                <div className="lg:col-span-4 space-y-6">
                    <FormSection title="Validity Period" icon={<Calendar size={18} className="text-gray-400" />}>
                        <div className="space-y-4">
                            <Input
                                label="Start Date"
                                type="date"
                                name="validFrom"
                                value={formData.validFrom}
                                onChange={handleChange}
                            />
                            <Input
                                label="Expiry Date"
                                type="date"
                                name="validUntil"
                                value={formData.validUntil}
                                onChange={handleChange}
                            />
                        </div>
                    </FormSection>

                    {/* Usage Restraints */}
                    <FormSection title="Limits & Caps" icon={<Settings size={18} className="text-gray-400" />}>
                        <div className="space-y-4">
                            <Input
                                label="Min Order (₹)"
                                type="number"
                                name="minOrderValue"
                                value={formData.minOrderValue}
                                onChange={handleChange}
                            />
                            <Input
                                label="Max Discount (₹)"
                                type="number"
                                name="maxDiscount"
                                value={formData.maxDiscount}
                                onChange={handleChange}
                                disabled={formData.type === 'flat'}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Total Limit"
                                    type="number"
                                    name="usageLimit"
                                    value={formData.usageLimit}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="User Limit"
                                    type="number"
                                    name="perUserLimit"
                                    value={formData.perUserLimit}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-6"></div>

                        <div className="flex items-center justify-between p-1">
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Coupon Active</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, active: !formData.active })}
                                className={`w-11 h-6 rounded-full transition-all relative ${formData.active ? 'bg-[#3E2723]' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.active ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </FormSection>
                </div>
            </form>
        </div>
    );
};

export default CouponFormPage;
