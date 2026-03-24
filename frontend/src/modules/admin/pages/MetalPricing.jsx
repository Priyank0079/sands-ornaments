import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const MetalPricing = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [rates, setRates] = useState({
        goldPerGram: 0,
        goldPerMilligram: 0,
        silverPerGram: 0,
        silverPerMilligram: 0
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await adminService.getMetalPricing();
            setRates({
                goldPerGram: res.metalRates?.goldPerGram ?? 0,
                goldPerMilligram: res.metalRates?.goldPerMilligram ?? 0,
                silverPerGram: res.metalRates?.silverPerGram ?? 0,
                silverPerMilligram: res.metalRates?.silverPerMilligram ?? 0
            });
            setLoading(false);
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const res = await adminService.updateMetalPricing({ metalRates: rates });
        if (res.success) toast.success("Metal rates updated");
        else toast.error(res.message || "Failed to update metal rates");
        setSaving(false);
    };

    return (
        <div className="max-w-[900px] mx-auto space-y-6 pb-20">
            <PageHeader title="Metal Pricing" subtitle="Update daily gold and silver rates for your own catalog" />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Gold Rates</h3>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Per Gram</label>
                            <input
                                type="number"
                                value={rates.goldPerGram}
                                onChange={(e) => setRates(prev => ({ ...prev, goldPerGram: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#3E2723]/40"
                                placeholder="0"
                                disabled={loading}
                            />
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Per Milligram</label>
                            <input
                                type="number"
                                value={rates.goldPerMilligram}
                                onChange={(e) => setRates(prev => ({ ...prev, goldPerMilligram: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#3E2723]/40"
                                placeholder="0"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Silver Rates</h3>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Per Gram</label>
                            <input
                                type="number"
                                value={rates.silverPerGram}
                                onChange={(e) => setRates(prev => ({ ...prev, silverPerGram: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#3E2723]/40"
                                placeholder="0"
                                disabled={loading}
                            />
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Per Milligram</label>
                            <input
                                type="number"
                                value={rates.silverPerMilligram}
                                onChange={(e) => setRates(prev => ({ ...prev, silverPerMilligram: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#3E2723]/40"
                                placeholder="0"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#3E2723] text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-md"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Rates"}
                </button>
            </div>
        </div>
    );
};

export default MetalPricing;
