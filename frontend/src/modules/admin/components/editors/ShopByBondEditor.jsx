import React, { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { Input } from '../common/FormControls';

const BOND_OPTIONS = [
    { value: 'wife', label: 'Wife' },
    { value: 'husband', label: 'Husband' },
    { value: 'mother', label: 'Mother' },
    { value: 'brothers', label: 'Brothers' },
    { value: 'sister', label: 'Sister' },
    { value: 'friends', label: 'Friends' }
];

const createFallbackItems = (items = []) => items.map((item, index) => ({
    id: item.itemId || item.id || `shop-by-bond-${index + 1}`,
    name: item.name || '',
    image: item.image || '',
    bondKey: item.bondKey || ''
}));

const ShopByBondEditor = ({ sectionData, onSave, defaultSection = {} }) => {
    const initialSettings = useMemo(() => {
        const fallbackSettings = defaultSection?.settings || {};
        const currentSettings = sectionData?.settings || {};

        return {
            title: currentSettings.title || fallbackSettings.title || 'Shop by Bond',
            subtitle: currentSettings.subtitle || fallbackSettings.subtitle || 'Curated for your loved ones'
        };
    }, [defaultSection?.settings, sectionData?.settings]);

    const initialItems = useMemo(() => {
        const sourceItems = Array.isArray(sectionData?.items) && sectionData.items.length > 0
            ? sectionData.items
            : (defaultSection?.items || []);

        return createFallbackItems(sourceItems);
    }, [defaultSection?.items, sectionData?.items]);

    const [settings, setSettings] = useState(initialSettings);
    const [items, setItems] = useState(initialItems);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setSettings(initialSettings);
    }, [initialSettings]);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const updateItem = (id, field, value) => {
        setItems((prev) => prev.map((item) => {
            if (item.id !== id) return item;

            if (field === 'bondKey') {
                const selectedBond = BOND_OPTIONS.find((option) => option.value === value);
                return {
                    ...item,
                    bondKey: value,
                    name: selectedBond?.label || item.name
                };
            }

            return { ...item, [field]: value };
        }));
    };

    const handleImageUpload = async (id, file) => {
        if (!file) return;
        const uploadedUrl = await adminService.uploadSectionImage(file);
        if (!uploadedUrl) {
            toast.error('Image upload failed. Please try again.');
            return;
        }
        updateItem(id, 'image', uploadedUrl);
    };

    const handleSave = async () => {
        const invalid = items.find((item) => !item.image?.trim() || !item.bondKey);
        if (invalid) {
            toast.error(`Each bond card needs an image and bond type before saving. Missing: ${invalid.name || 'Card'}`);
            return;
        }

        setSaving(true);
        try {
            await onSave({
                settings: {
                    title: settings.title?.trim() || 'Shop by Bond',
                    subtitle: settings.subtitle?.trim() || 'Curated for your loved ones'
                },
                items: items.map((item, index) => ({
                    ...item,
                    itemId: item.itemId || item.id,
                    sortOrder: index
                }))
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#3E2723]">Shop by Bond</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage the six bond cards safely. The destination is generated automatically from the selected bond,
                        so admin cannot break navigation with a custom link.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#3E2723] text-white font-semibold text-sm hover:bg-[#5a3d36] transition-colors disabled:opacity-60"
                >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Section'}
                </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Section Title"
                        value={settings.title}
                        onChange={(event) => setSettings((prev) => ({ ...prev, title: event.target.value }))}
                        placeholder="Shop by Bond"
                    />
                    <Input
                        label="Section Subtitle"
                        value={settings.subtitle}
                        onChange={(event) => setSettings((prev) => ({ ...prev, subtitle: event.target.value }))}
                        placeholder="Curated for your loved ones"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {items.map((item, index) => (
                        <div key={item.id} className="rounded-2xl border border-[#EFE3DF] bg-[#FFFCFB] p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#B28A8A]">
                                    Card {index + 1}
                                </div>
                                <div className="text-[11px] font-semibold text-gray-400">
                                    Route auto-generated from bond type
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)] gap-5">
                                <div className="space-y-3">
                                    <div className="relative aspect-[4/5] rounded-2xl border border-dashed border-gray-300 bg-[#F8F5F2] overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name || `Bond card ${index + 1}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
                                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                    <ImageIcon size={20} />
                                                </div>
                                                <p className="text-[11px] font-bold uppercase tracking-widest">Upload Image</p>
                                            </div>
                                        )}
                                    </div>
                                    <label className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3E2723] px-4 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#2D1B18] transition-all cursor-pointer">
                                        <ImageIcon size={14} />
                                        Change Image
                                        <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImageUpload(item.id, event.target.files?.[0])} />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Bond Type</label>
                                        <select
                                            value={item.bondKey || ''}
                                            onChange={(event) => updateItem(item.id, 'bondKey', event.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723]/20"
                                        >
                                            <option value="">Select Bond</option>
                                            {BOND_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <Input
                                        label="Display Name"
                                        value={item.name || ''}
                                        onChange={(event) => updateItem(item.id, 'name', event.target.value)}
                                        placeholder="Wife"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopByBondEditor;
