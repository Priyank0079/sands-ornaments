import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, EyeOff, Box, CheckCircle, ChevronDown, ChevronRight, Plus, Search, Layers } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const SubcategoryManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock grouped data structure
    const [categoryGroups, setCategoryGroups] = useState([
        {
            id: 101,
            name: 'Rings',
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop',
            isExpanded: false,
            subcategories: [
                { id: 1, name: 'Solitaire', productCount: 42, status: 'Active' },
                { id: 2, name: 'Band', productCount: 28, status: 'Active' },
                { id: 5, name: 'Cocktail', productCount: 15, status: 'Hidden' }
            ]
        },
        {
            id: 102,
            name: 'Earrings',
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop',
            isExpanded: false,
            subcategories: [
                { id: 3, name: 'Crystal Drop', productCount: 35, status: 'Active' },
                { id: 4, name: 'Hoops', productCount: 18, status: 'Hidden' }
            ]
        },
        {
            id: 103,
            name: 'Necklaces',
            image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=100&h=100&fit=crop',
            isExpanded: false,
            subcategories: [
                { id: 6, name: 'Pendants', productCount: 56, status: 'Active' },
                { id: 7, name: 'Chokers', productCount: 22, status: 'Active' }
            ]
        }
    ]);

    // Derived stats
    const totalSubcategories = categoryGroups.reduce((acc, cat) => acc + cat.subcategories.length, 0);
    const activeSubcategories = categoryGroups.reduce((acc, cat) => acc + cat.subcategories.filter(s => s.status === 'Active').length, 0);
    const totalParents = categoryGroups.length;

    const toggleGroupExpand = (groupId) => {
        setCategoryGroups(categoryGroups.map(group =>
            group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
        ));
    };

    const toggleSubcategoryStatus = (groupId, subId) => {
        setCategoryGroups(categoryGroups.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    subcategories: group.subcategories.map(sub =>
                        sub.id === subId ? { ...sub, status: sub.status === 'Active' ? 'Hidden' : 'Active' } : sub
                    )
                };
            }
            return group;
        }));
    };

    const handleDeleteSubcategory = (groupId, subId) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            setCategoryGroups(categoryGroups.map(group => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        subcategories: group.subcategories.filter(sub => sub.id !== subId)
                    };
                }
                return group;
            }));
        }
    };

    // Filter logic
    const filteredGroups = categoryGroups.map(group => ({
        ...group,
        subcategories: group.subcategories.filter(sub =>
            sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) || group.subcategories.length > 0
    );

    const stats = [
        { label: 'Total Sub-levels', value: totalSubcategories, icon: Layers, color: 'bg-blue-50 text-blue-600' },
        { label: 'Live Levels', value: activeSubcategories, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
        { label: 'Parent Groups', value: totalParents, icon: Box, color: 'bg-orange-50 text-orange-600' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Subcategory Management"
                subtitle="Manage secondary product levels grouped by parent categories."
                action={{
                    label: "Add Sub-Category",
                    onClick: () => navigate('/admin/subcategories/new'),
                    icon: <Plus className="w-4 h-4" />
                }}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search sub-categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8D6E63]/20 focus:border-[#8D6E63] transition-all"
                    />
                </div>
            </div>

            {/* Grouped Lists */}
            <div className="space-y-4">
                {filteredGroups.map(group => (
                    <div key={group.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
                        {/* Parent Header */}
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleGroupExpand(group.id)}
                        >
                            <div className="flex items-center gap-4">
                                <button className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                                    {group.isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </button>
                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                    <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{group.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{group.subcategories.length} Levels</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => navigate(`/admin/subcategories/new?parent=${group.id}`)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#8D6E63] hover:border-[#8D6E63]/30 transition-all shadow-sm"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Sub
                                </button>
                            </div>
                        </div>

                        {/* Subcategories Table */}
                        {group.isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50/30 animate-in slide-in-from-top-2 duration-300">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="text-gray-500 font-bold uppercase tracking-widest text-[10px] bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 pl-20">Sub-Category</th>
                                                <th className="px-6 py-3 text-center">Products</th>
                                                <th className="px-6 py-3 text-center">Status</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {group.subcategories.length > 0 ? (
                                                group.subcategories.map(sub => (
                                                    <tr key={sub.id} className="hover:bg-white transition-colors group">
                                                        <td className="px-6 py-3 pl-20">
                                                            <span className="font-bold text-gray-800 text-sm">{sub.name}</span>
                                                        </td>
                                                        <td className="px-6 py-3 text-center">
                                                            <span className="font-bold text-sm text-gray-800">{sub.productCount}</span>
                                                        </td>
                                                        <td className="px-6 py-3 text-center">
                                                            <button
                                                                onClick={() => toggleSubcategoryStatus(group.id, sub.id)}
                                                                className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${sub.status === 'Active'
                                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                                                    }`}
                                                            >
                                                                {sub.status}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => navigate(`/admin/subcategories/edit/${sub.id}`)}
                                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteSubcategory(group.id, sub.id)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-xs italic">
                                                        No subcategories found for {group.name}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubcategoryManagement;
