import React from 'react';
import { 
    HelpCircle, Search, Truck, Info, Plus, Trash2, 
    MessageSquare, Globe, Ship, Heart, ShieldCheck,
    Tag as TagIcon, Link as LinkIcon, Star, TrendingUp,
    Zap, Gem
} from 'lucide-react';
import { FormSection, Input } from '../../../admin/components/common/FormControls';

const ProductAdvancedTab = ({ 
    formData, 
    setFormData, 
    isViewMode, 
    addFaq, 
    removeFaq, 
    handleFaqChange 
}) => {
    const marketingTags = [
        { label: 'New Arrival', key: 'isNewArrival', icon: <Zap size={14} className="text-emerald-500" /> },
        { label: 'Trending', key: 'isTrending', icon: <TrendingUp size={14} className="text-blue-500" /> },
        { label: 'Most Gifted', key: 'isMostGifted', icon: <Heart size={14} className="text-pink-500" /> },
        { label: 'New Launch', key: 'isNewLaunch', icon: <Star size={14} className="text-amber-500" /> },
        { label: 'Premium', key: 'isPremium', icon: <Gem size={14} className="text-purple-500" /> }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* FAQ Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <HelpCircle size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Global Product FAQs</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Common questions appearing across all variants</p>
                        </div>
                    </div>
                    {!isViewMode && (
                        <button
                            type="button"
                            onClick={addFaq}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all shadow-sm"
                        >
                            <Plus size={14} /> Add FAQ
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(formData.faqs || []).map((faq, index) => (
                        <div key={index} className="p-6 rounded-[2rem] bg-white border border-gray-100 relative group shadow-sm hover:shadow-md transition-all">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Question</label>
                                    <input
                                        value={faq.question}
                                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                        placeholder="e.g. Is it 925 silver?"
                                        disabled={isViewMode}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-200 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Answer</label>
                                    <textarea
                                        value={faq.answer}
                                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                        placeholder="Yes, this is 925 hallmark silver."
                                        disabled={isViewMode}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-200 transition-all"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            {!isViewMode && (
                                <button
                                    type="button"
                                    onClick={() => removeFaq(index)}
                                    className="absolute -top-2 -right-2 h-8 w-8 bg-white text-gray-400 hover:text-red-500 border border-gray-100 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {(formData.faqs || []).length === 0 && (
                        <div className="col-span-full py-12 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                            <MessageSquare className="text-gray-200 mb-3" size={32} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No global FAQs defined</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Marketing & Related Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FormSection title="Marketing Attributes">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {marketingTags.map((tag) => (
                            <label 
                                key={tag.key} 
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${formData.tags?.[tag.key] ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${formData.tags?.[tag.key] ? 'bg-white' : 'bg-gray-50'}`}>
                                        {tag.icon}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${formData.tags?.[tag.key] ? 'text-amber-900' : 'text-gray-500'}`}>
                                        {tag.label}
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.tags?.[tag.key] || false}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        tags: { ...(prev.tags || {}), [tag.key]: e.target.checked }
                                    }))}
                                    disabled={isViewMode}
                                    className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                />
                            </label>
                        ))}
                    </div>
                </FormSection>

                <FormSection title="Discovery Logic">
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Related Products (IDs)</label>
                            <textarea
                                value={Array.isArray(formData.relatedProducts) ? formData.relatedProducts.join(', ') : ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    relatedProducts: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                                }))}
                                placeholder="Comma separated product IDs..."
                                disabled={isViewMode}
                                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723] transition-all shadow-sm"
                                rows={3}
                            />
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                Curates the "You May Also Like" section on the product details page.
                            </p>
                        </div>
                    </div>
                </FormSection>
            </div>

            {/* SEO & Logistics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SEO & Marketing */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                            <Search size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Search Engine Optimization</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Control how search engines index this product</p>
                        </div>
                    </div>

                    <div className="bg-[#FDFBF7] rounded-[2.5rem] p-8 border border-amber-100/50 space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="SEO Meta Title"
                                value={formData.seo?.title || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))}
                                placeholder="e.g. Pure 925 Sterling Silver Heart Pendant"
                                disabled={isViewMode}
                            />
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SEO Meta Description</label>
                                <textarea
                                    value={formData.seo?.description || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))}
                                    placeholder="Brief summary for Google search results..."
                                    disabled={isViewMode}
                                    className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-800 outline-none focus:border-[#3E2723] focus:ring-4 focus:ring-[#3E2723]/5 transition-all shadow-sm"
                                    rows={4}
                                />
                                <div className="flex justify-between px-1">
                                    <p className="text-[8px] font-bold text-gray-400 uppercase">Recommended: 150-160 characters</p>
                                    <p className={`text-[8px] font-black uppercase ${(formData.seo?.description || '').length > 160 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {(formData.seo?.description || '').length} Characters
                                    </p>
                                </div>
                            </div>
                            <Input
                                label="Keywords (Comma separated)"
                                value={formData.seo?.keywords || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value } }))}
                                placeholder="silver, jewelry, pendant, gift"
                                disabled={isViewMode}
                            />
                        </div>
                    </div>
                </div>

                {/* Logistics & Documentation */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                            <Truck size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Logistics & Compliance</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Fulfillment and documentation parameters</p>
                        </div>
                    </div>

                    <div className="bg-emerald-50/30 rounded-[2.5rem] p-8 border border-emerald-100/50 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Est. Shipping Days</label>
                                <div className="relative">
                                    <input 
                                        type="number"
                                        value={formData.logistics?.estimatedShippingDays || 3}
                                        onChange={(e) => setFormData(prev => ({ ...prev, logistics: { ...prev.logistics, estimatedShippingDays: parseInt(e.target.value) || 0 } }))}
                                        disabled={isViewMode}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-5 text-sm font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all shadow-sm"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Days</span>
                                    </div>
                                </div>
                            </div>
                            <Input
                                label="Registry Artifact URL"
                                value={formData.logistics?.certificateUrl || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, logistics: { ...prev.logistics, certificateUrl: e.target.value } }))}
                                placeholder="Cloudinary/Drive Link"
                                disabled={isViewMode}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductAdvancedTab;
