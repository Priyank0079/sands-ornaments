import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import CategoryShowcaseEditor from '../components/editors/CategoryShowcaseEditor';
import { adminService } from '../services/adminService';
import { sectionDefaults } from '../utils/sectionDefaults';
import toast from 'react-hot-toast';

const SectionEditor = () => {
    const { id } = useParams();
    const [sectionData, setSectionData] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadSection = async () => {
            try {
                const data = await adminService.getSectionById(id);
                if (data) {
                    const items = (data.items || []).map((item) => ({
                        id: item.itemId || item.id || item._id || `${Date.now()}_${Math.random()}`,
                        ...item
                    }));
                    setSectionData({
                        id: data.sectionId,
                        label: data.label,
                        items
                    });
                }
            } catch (err) {
                toast.error("Failed to load section");
            }
        };
        loadSection();
    }, [id]);

    if (!sectionData) {
        return <div className="p-10 text-center">Loading Section Editor...</div>;
    }

    const handleSave = async (newData) => {
        setSaving(true);
        try {
            const payload = {
                label: sectionData.label,
                items: newData.items || []
            };
            const res = await adminService.updateSection(id, payload);
            if (res.success === false) {
                toast.error(res.message || "Failed to save section");
                return;
            }
            toast.success("Section updated");
        } catch (err) {
            toast.error("Failed to save section");
        } finally {
            setSaving(false);
        }
    };

    const defaultSection = sectionDefaults.find((section) => section.sectionId === id);
    const defaultItems = defaultSection?.items || [];

    // Render appropriate editor based on section ID or type
    const renderEditor = () => {
        const supportedSections = [
            'category-showcase',
            'price-range-showcase',
            'perfect-gift',
            'new-launch',
            'latest-drop',
            'most-gifted',
            'proposal-rings',
            'curated-for-you',
            'style-it-your-way',
            'nav-gifts-for',
            'nav-occasions'
        ];

        if (supportedSections.includes(id)) {
            return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={defaultItems} />;
        }

        return (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <h3 className="text-xl font-bold text-gray-400">Editor not implemented for this section type yet.</h3>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 md:p-8">
                <PageHeader
                    title={`Edit ${sectionData.label}`}
                    subtitle={saving ? "Saving changes..." : "Customize the content for this homepage section"}
                    backPath="/admin/sections"
                />

                {renderEditor()}
            </div>
        </div>
    );
};

export default SectionEditor;
