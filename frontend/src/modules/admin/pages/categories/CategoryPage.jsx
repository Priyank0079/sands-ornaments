// Imports from lucide-react were modified, so I should ensure I include the correct imports at the top
// But the replace_file_content cannot edit two blocks at once if non-contiguous AND allow_multiple=false unless I replace a big chunk.
// I will split this into two calls or use multi_replacement. The chunk is large (imports + JSX + Logic). I will rewrite a contiguous large chunk.
// I will replace from imports to end of render.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, EyeOff, Box, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import AdminStatsCard from '../../components/AdminStatsCard';

const CategoryPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([
        { id: 1, name: 'Rings', count: 124, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop' },
        { id: 2, name: 'Earrings', count: 85, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop' },
        { id: 3, name: 'Necklaces', count: 64, status: 'Active', showInCollection: false, showInNavbar: true, image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=100&h=100&fit=crop' },
        { id: 4, name: 'Bracelets', count: 42, status: 'Hidden', showInCollection: false, showInNavbar: false, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1520e?w=100&h=100&fit=crop' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(cat => cat.id !== id));
        }
    };

    const toggleVisibility = (id, field) => {
        setCategories(categories.map(cat =>
            cat.id === id ? { ...cat, [field]: !cat[field] } : cat
        ));
    };

    const toggleStatus = (id) => {
        setCategories(categories.map(cat =>
            cat.id === id ? { ...cat, status: cat.status === 'Active' ? 'Hidden' : 'Active' } : cat
        ));
    };

    const columns = [
        {
            header: 'Category',
            render: (item) => (
                <div className="flex items-center gap-4 text-gray-900">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-black text-sm">{item.name}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Products',
            render: (item) => (
                <span className="font-bold text-sm text-gray-800">{item.count}</span>
            )
        },
        {
            header: 'In Collection',
            render: (item) => (
                <button
                    onClick={() => toggleVisibility(item.id, 'showInCollection')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${item.showInCollection ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    {item.showInCollection ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {item.showInCollection ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'In Navbar',
            render: (item) => (
                <button
                    onClick={() => toggleVisibility(item.id, 'showInNavbar')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${item.showInNavbar ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    {item.showInNavbar ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {item.showInNavbar ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'Status',
            render: (item) => (
                <button
                    onClick={() => toggleStatus(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${item.status === 'Active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-orange-50 text-orange-700 border-orange-200'
                        }`}
                >
                    {item.status === 'Active' ? <CheckCircle className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {item.status}
                </button>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/admin/categories/view/${item.id}`)}
                        className="p-2 text-gray-600 hover:text-[#8D6E63] hover:bg-[#8D6E63]/5 rounded-lg transition-all"
                        title="View Category"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate(`/admin/categories/edit/${item.id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filters = [
        {
            options: [
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Hidden', value: 'hidden' }
            ],
            onChange: (val) => console.log('Filter by status:', val)
        }
    ];

    const stats = [
        {
            label: 'Total Categories',
            value: categories.length,
            icon: Box,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            label: 'Active Categories',
            value: categories.filter(c => c.status === 'Active').length,
            icon: CheckCircle,
            color: 'bg-green-50 text-green-600'
        },
        {
            label: 'Hidden Categories',
            value: categories.filter(c => c.status === 'Hidden').length,
            icon: EyeOff,
            color: 'bg-orange-50 text-orange-600'
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Category Management"
                subtitle="Manage main collections and their global visibility settings."
                action={{
                    label: "Add New Category",
                    onClick: () => navigate('/admin/categories/new')
                }}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <AdminStatsCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color.split(' ').find(c => c.startsWith('text-'))}
                        bgColor={stat.color.split(' ').find(c => c.startsWith('bg-'))}
                    />
                ))}
            </div>

            <DataTable
                columns={columns}
                data={categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search categories..."
                filters={filters}
            />
        </div>
    );
};

export default CategoryPage;
