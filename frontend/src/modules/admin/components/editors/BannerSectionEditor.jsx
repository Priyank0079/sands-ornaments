import React, { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Plus, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { FormSection, Input } from '../common/FormControls';
import { resolveLegacyCmsAsset } from '../../../user/utils/legacyCmsAssets';

const createBannerItem = () => ({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    label: '',
    subtitle: '',
    image: '',
    path: '/shop',
    tag: '',
    ctaLabel: 'Shop Collection',
    sortOrder: 0
});

const BannerSectionEditor = ({ sectionData, onSave, defaultItems = [] }) => {
    const sectionKey = sectionData?.sectionKey || sectionData?.id || '';
    const pageKey = sectionData?.pageKey || '';
    const isSingleBannerSection = sectionKey === 'personalized-banner' && pageKey === 'shop-women';

    const initialItems = useMemo(() => {
        if (Array.isArray(sectionData?.items) && sectionData.items.length > 0) {
            const sourceItems = isSingleBannerSection ? sectionData.items.slice(0, 1) : sectionData.items;
            return sourceItems.map((item, index) => ({
                id: item.itemId || item.id || `${Date.now()}_${index}`,
                ...item,
                sortOrder: item.sortOrder ?? index,
                subtitle: item.subtitle || item.price || '',
                ctaLabel: item.ctaLabel || 'Shop Collection'
            }));
        }

        if (Array.isArray(defaultItems) && defaultItems.length > 0) {
            const sourceItems = isSingleBannerSection ? defaultItems.slice(0, 1) : defaultItems;
            return sourceItems.map((item, index) => ({
                id: item.itemId || item.id || `${Date.now()}_${index}`,
                ...item,
                sortOrder: item.sortOrder ?? index,
                subtitle: item.subtitle || item.price || '',
                ctaLabel: item.ctaLabel || 'Shop Collection'
            }));
        }

        return [createBannerItem()];
    }, [defaultItems, isSingleBannerSection, sectionData?.items]);

    const [items, setItems] = useState(initialItems);
    const [settings, setSettings] = useState({
        autoplayMs: sectionData?.settings?.autoplayMs || 3000
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    useEffect(() => {
        setSettings({
            autoplayMs: sectionData?.settings?.autoplayMs || 3000
        });
    }, [sectionData?.settings]);

    const updateItem = (id, field, value) => {
        setItems((prev) => prev.map((item) => (
            item.id === id ? { ...item, [field]: value } : item
        )));
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

    const addBanner = () => {
        if (isSingleBannerSection) return;
        setItems((prev) => ([
            ...prev,
            {
                ...createBannerItem(),
                sortOrder: prev.length
            }
        ]));
    };

    const removeBanner = (id) => {
        if (isSingleBannerSection) return;
        const nextItems = items
            .filter((item) => item.id !== id)
            .map((item, index) => ({ ...item, sortOrder: index }));
        setItems(nextItems.length > 0 ? nextItems : [createBannerItem()]);
    };

    const handleSave = async () => {
        const invalid = items.find((item) => !item.label?.trim() || !item.image?.trim());
        if (invalid) {
            toast.error('Each banner needs at least a title and image before saving.');
            return;
        }

        setSaving(true);
        try {
            await onSave({
                settings: {
                    autoplayMs: Number(settings.autoplayMs) || 3000
                },
                items: items.map((item, index) => ({
                    ...item,
                    itemId: item.itemId || item.id,
                    sortOrder: index,
                    subtitle: item.subtitle || '',
                    ctaLabel: item.ctaLabel || 'Shop Collection',
                    price: item.subtitle || ''
                }))
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {!isSingleBannerSection && (
                <FormSection title="Banner Section Settings">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Autoplay Interval (ms)"
                            type="number"
                            min="1000"
                            step="500"
                            value={settings.autoplayMs}
                            onChange={(e) => setSettings((prev) => ({ ...prev, autoplayMs: e.target.value }))}
                            placeholder="3000"
                        />
                    </div>
                </FormSection>
            )}

            <div className="grid grid-cols-1 gap-6">
                {items.map((item, index) => (
                    <FormSection
                        key={item.id}
                        title={`Banner ${index + 1}`}
                    >
                        <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)] gap-6">
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                                    Banner Image
                                </label>
                                <div className="relative aspect-[4/5] rounded-2xl border border-dashed border-gray-300 bg-[#F8F5F2] overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={resolveLegacyCmsAsset(item.image, item.image)}
                                            alt={item.label || `Banner ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                <ImageIcon size={20} />
                                            </div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest">Upload Banner</p>
                                        </div>
                                    )}
                                </div>
                                <label className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3E2723] px-4 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#2D1B18] transition-all cursor-pointer">
                                    <ImageIcon size={14} />
                                    Change Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(item.id, e.target.files?.[0])}
                                    />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Eyebrow Label"
                                    value={item.name || ''}
                                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                    placeholder="Luxury Collection"
                                />
                                <Input
                                    label="Tag"
                                    value={item.tag || ''}
                                    onChange={(e) => updateItem(item.id, 'tag', e.target.value)}
                                    placeholder="Luxury Collection"
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Banner Title"
                                        value={item.label || ''}
                                        onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                                        placeholder="Eternal Diamond Brilliance"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-1.5">
                                        Banner Subtitle
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={item.subtitle || ''}
                                        onChange={(e) => updateItem(item.id, 'subtitle', e.target.value)}
                                        placeholder="Masterfully crafted for those who demand the extraordinary."
                                        className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#3E2723] focus:ring-2 focus:ring-[#3E2723]/10 transition-all shadow-sm resize-none"
                                    />
                                </div>
                                <Input
                                    label="CTA Label"
                                    value={item.ctaLabel || ''}
                                    onChange={(e) => updateItem(item.id, 'ctaLabel', e.target.value)}
                                    placeholder="Shop Collection"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                                Banner {index + 1} of {items.length}
                            </div>
                            {!isSingleBannerSection && (
                                <button
                                    type="button"
                                    onClick={() => removeBanner(item.id)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={14} />
                                    Remove
                                </button>
                            )}
                        </div>
                    </FormSection>
                ))}
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {!isSingleBannerSection && (
                    <button
                        type="button"
                        onClick={addBanner}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3E2723]/15 bg-white px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:bg-[#F8F5F2] transition-all"
                    >
                        <Plus size={14} />
                        Add Banner
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3E2723] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#2D1B18] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save Banner Section'}
                </button>
            </div>
        </div>
    );
};

export default BannerSectionEditor;
