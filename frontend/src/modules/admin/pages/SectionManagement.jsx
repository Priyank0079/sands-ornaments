import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { ArrowLeft, Edit2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const SectionManagement = () => {
    const navigate = useNavigate();
    const { homepageSections } = useShop();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 md:p-8">
                <PageHeader
                    title="Homepage Sections"
                    subtitle="Manage content and layout of your homepage"
                    backPath="/admin"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(homepageSections || {}).map(section => (
                        <div key={section.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <ImageIcon size={20} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-green-50 text-green-600`}>
                                    Active
                                </span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-gray-800 mb-2">{section.label}</h3>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                                Manage the items, images, and links displayed in this section.
                            </p>

                            <button
                                onClick={() => navigate(`/admin/sections/${section.id}`)}
                                className="w-full py-2.5 rounded-lg bg-gray-50 text-gray-700 font-bold text-xs hover:bg-[#3E2723] hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Edit2 size={14} /> Edit Content
                            </button>
                        </div>
                    ))}

                    {/* Placeholder for future sections */}
                    {[].map((name, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-6 opacity-60">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                                    <ImageIcon size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gray-200 text-gray-500">
                                    Coming Soon
                                </span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-gray-400 mb-2">{name}</h3>
                            <p className="text-gray-400 text-sm mb-6">This section is not yet manageable.</p>
                            <button disabled className="w-full py-2.5 rounded-lg bg-gray-200 text-gray-400 font-bold text-xs cursor-not-allowed">
                                Manage
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SectionManagement;
