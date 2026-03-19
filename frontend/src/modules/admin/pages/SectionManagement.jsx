import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { adminService } from '../services/adminService';
import { sectionDefaults } from '../utils/sectionDefaults';
import toast from 'react-hot-toast';

const SectionManagement = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSections = async () => {
        setLoading(true);
        try {
            const data = await adminService.getSections();
            const filteredSections = (data || []).filter(section => section.sectionId !== 'nav-shop-by-category');
            setSections(filteredSections);
            const existingIds = new Set(filteredSections.map(section => section.sectionId));
            const missingDefaults = sectionDefaults.filter(def => !existingIds.has(def.sectionId));
            if (!data || data.length === 0 || missingDefaults.length > 0) {
                const seedPayload = missingDefaults.length > 0 ? missingDefaults : sectionDefaults;
                const seedRes = await adminService.bulkUpsertSections(seedPayload);
                if (seedRes.success !== false) {
                    const seeded = await adminService.getSections();
                    const filteredSeeded = (seeded || []).filter(section => section.sectionId !== 'nav-shop-by-category');
                    setSections(filteredSeeded);
                }
            }
        } catch (err) {
            toast.error("Failed to load sections");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSections();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 md:p-8">
                <PageHeader
                    title="Homepage Sections"
                    subtitle="Manage content and layout of your homepage"
                    backPath="/admin"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full bg-white border border-gray-100 rounded-xl p-10 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                            Loading sections...
                        </div>
                    ) : sections.map(section => (
                        <div key={section.sectionId || section._id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <ImageIcon size={20} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${section.isActive === false ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {section.isActive === false ? 'Inactive' : 'Active'}
                                </span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-gray-800 mb-2">{section.label}</h3>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                                Manage the items, images, and links displayed in this section.
                            </p>

                            <button
                                onClick={() => navigate(`/admin/sections/${section.sectionId}`)}
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
