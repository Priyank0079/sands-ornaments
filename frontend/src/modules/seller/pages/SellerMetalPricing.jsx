import React, { useEffect, useMemo, useState } from 'react';
import { Save, Coins, RefreshCcw } from 'lucide-react';
import PageHeader from '../../admin/components/common/PageHeader';
import { sellerService } from '../services/sellerService';
import toast from 'react-hot-toast';

const INITIAL_RATES = {
    goldPerGram: 0,
    goldPerMilligram: 0,
    silverPerGram: 0,
    silverPerMilligram: 0
};

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString()}`;

const SellerMetalPricing = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [productCount, setProductCount] = useState(0);
    const [updatedAt, setUpdatedAt] = useState(null);
    const [gstRate, setGstRate] = useState(0);
    const [rates, setRates] = useState(INITIAL_RATES);

    const syncRates = (data) => {
        setRates({
            goldPerGram: Number(data?.metalRates?.goldPerGram) || 0,
            goldPerMilligram: Number(data?.metalRates?.goldPerMilligram) || 0,
            silverPerGram: Number(data?.metalRates?.silverPerGram) || 0,
            silverPerMilligram: Number(data?.metalRates?.silverPerMilligram) || 0
        });
        setProductCount(Number(data?.sellerProductCount) || 0);
        setUpdatedAt(data?.updatedAt || null);
        setGstRate(Number(data?.gstRate) || 0);
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await sellerService.getMetalPricing();
            syncRates(res);
            setLoading(false);
        };
        load();
    }, []);

    const updateRate = (field, value) => {
        const numericValue = value === '' ? '' : Number(value);

        setRates((prev) => {
            const nextRates = {
                ...prev,
                [field]: numericValue
            };

            if (field === 'goldPerGram') nextRates.goldPerMilligram = numericValue === '' ? '' : Number(numericValue) / 1000;
            if (field === 'goldPerMilligram') nextRates.goldPerGram = numericValue === '' ? '' : Number(numericValue) * 1000;
            if (field === 'silverPerGram') nextRates.silverPerMilligram = numericValue === '' ? '' : Number(numericValue) / 1000;
            if (field === 'silverPerMilligram') nextRates.silverPerGram = numericValue === '' ? '' : Number(numericValue) * 1000;

            return nextRates;
        });
    };

    const handleSave = async () => {
        const allRates = Object.values(rates);
        if (allRates.some((value) => Number(value) < 0)) {
            toast.error('Metal rates cannot be negative');
            return;
        }

        setSaving(true);
        const res = await sellerService.updateMetalPricing({
            metalRates: {
                goldPerGram: Number(rates.goldPerGram) || 0,
                goldPerMilligram: Number(rates.goldPerMilligram) || 0,
                silverPerGram: Number(rates.silverPerGram) || 0,
                silverPerMilligram: Number(rates.silverPerMilligram) || 0
            }
        });

        if (res.success) {
            toast.success('Metal pricing updated');
            syncRates(res.data || res);
        } else {
            toast.error(res.message || 'Failed to update metal pricing');
        }

        setSaving(false);
    };

    const cards = useMemo(() => ([
        {
            title: 'Seller-Owned Products',
            value: productCount,
            note: 'Only your products are repriced when you update seller metal rates.',
            icon: Coins
        },
        {
            title: 'Last Updated',
            value: updatedAt ? new Date(updatedAt).toLocaleDateString() : 'Not set',
            note: 'The latest time your seller metal rates were saved.',
            icon: RefreshCcw
        }
    ]), [productCount, updatedAt]);

    return (
        <div className="max-w-[1100px] mx-auto space-y-6 pb-20">
            <PageHeader title="Metal Pricing" subtitle="Update seller gold and silver rates for your products only" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cards.map((card) => (
                    <div key={card.title} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{card.title}</p>
                            <card.icon className="w-5 h-5 text-[#3E2723]" />
                        </div>
                        <p className="text-3xl font-black text-gray-900 mt-3">{card.value}</p>
                        <p className="text-sm text-gray-500 mt-2">{card.note}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
                    This page controls only your seller metal rates. Admin controls global GST separately in Tax Settings, and your current GST setting is {gstRate}% across final pricing.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Gold Rates</h3>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Per Gram</label>
                            <input
                                type="number"
                                value={rates.goldPerGram}
                                onChange={(e) => updateRate('goldPerGram', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#3E2723]/40"
                                placeholder="0"
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500">Per milligram syncs automatically: {formatCurrency(rates.goldPerMilligram)}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Silver Rates</h3>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Per Gram</label>
                            <input
                                type="number"
                                value={rates.silverPerGram}
                                onChange={(e) => updateRate('silverPerGram', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#3E2723]/40"
                                placeholder="0"
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500">Per milligram syncs automatically: {formatCurrency(rates.silverPerMilligram)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Read-Only Unit Sync</h3>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gold Per Milligram</label>
                            <input
                                type="number"
                                value={Number(rates.goldPerMilligram || 0).toFixed(4)}
                                readOnly
                                className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-600"
                            />
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Silver Per Milligram</label>
                            <input
                                type="number"
                                value={Number(rates.silverPerMilligram || 0).toFixed(4)}
                                readOnly
                                className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-600"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#3E2723] text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Metal Pricing'}
                </button>
            </div>
        </div>
    );
};

export default SellerMetalPricing;
