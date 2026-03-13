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
        { id: 1, name: 'Rings', metal: 'silver', count: 124, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop' },
        { id: 2, name: 'Earrings', metal: 'silver', count: 85, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop' },
        { id: 3, name: 'Chain Pendant', metal: 'silver', count: 64, status: 'Active', showInCollection: false, showInNavbar: true, image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=100&h=100&fit=crop' },
        { id: 4, name: 'Bracelets', metal: 'silver', count: 42, status: 'Active', showInCollection: false, showInNavbar: true, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1520e?w=100&h=100&fit=crop' },
        { id: 5, name: 'Anklets', metal: 'silver', count: 28, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1629227351401-4903330691e8?w=100&h=100&fit=crop' },
        { id: 6, name: 'Toe Rings', metal: 'silver', count: 15, status: 'Active', showInCollection: false, showInNavbar: false, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop' },
        { id: 7, name: 'Studs', metal: 'silver', count: 45, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop' },
        { id: 8, name: 'Pendants', metal: 'silver', count: 32, status: 'Active', showInCollection: false, showInNavbar: true, image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=100&h=100&fit=crop' },
        { id: 9, name: 'Chains', metal: 'silver', count: 56, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=100&h=100&fit=crop' },
        
        // Gold Collection Placeholders
        { id: 10, name: 'Gold Bangles', metal: 'gold', count: 0, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop' },
        { id: 11, name: 'Temple Jewellery', metal: 'gold', count: 0, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100&h=100&fit=crop' },
        { id: 12, name: '18K Chains', metal: 'gold', count: 0, status: 'Active', showInCollection: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=100&h=100&fit=crop' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMetal, setSelectedMetal] = useState(null); // null, 'gold', 'silver'

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

    const filteredByMetal = categories.filter(c => c.metal === selectedMetal);

    const stats = [
        {
            label: 'Total Categories',
            value: filteredByMetal.length,
            icon: Box,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            label: 'Active Categories',
            value: filteredByMetal.filter(c => c.status === 'Active').length,
            icon: CheckCircle,
            color: 'bg-green-50 text-green-600'
        },
        {
            label: 'Hidden Categories',
            value: filteredByMetal.filter(c => c.status === 'Hidden').length,
            icon: EyeOff,
            color: 'bg-orange-50 text-orange-600'
        }
    ];

    if (!selectedMetal) {
        return (
            <div className="space-y-10 animate-in fade-in duration-500">
                <PageHeader
                    title="Metal Selection"
                    subtitle="Select a collection metal type to manage its respective categories."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-10">
                    {/* Gold Collection */}
                    <button
                        onClick={() => setSelectedMetal('gold')}
                        className="group relative bg-[#FDFBF7] border border-gray-100 rounded-[2.5rem] p-12 text-center transition-all hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-2 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#D4AF37]/10 transition-colors" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C] rounded-full mx-auto flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                                <span className="text-3xl font-black text-white italic">Au</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Gold Collection</h3>
                                <p className="text-[10px] font-bold text-[#AA8C2C] uppercase tracking-[0.2em] mt-2">Premium 18K & 22K Hallmarked</p>
                            </div>
                            <div className="pt-4">
                                <span className="inline-block px-4 py-2 bg-[#D4AF37]/10 text-[#AA8C2C] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#D4AF37]/20">Coming Soon</span>
                            </div>
                        </div>
                    </button>

                    {/* Silver Collection */}
                    <button
                        onClick={() => setSelectedMetal('silver')}
                        className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-12 text-center transition-all hover:shadow-2xl hover:shadow-[#8D6E63]/10 hover:-translate-y-2 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8D6E63]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#8D6E63]/10 transition-colors" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#C0C0C0] to-[#8D8D8D] rounded-full mx-auto flex items-center justify-center shadow-lg shadow-gray-300 group-hover:scale-110 transition-transform">
                                <span className="text-3xl font-black text-white italic">Ag</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Silver Collection</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Sterling 925 Hallmarked</p>
                            </div>
                            <div className="pt-4">
                                <span className="inline-block px-4 py-2 bg-[#8D6E63]/10 text-[#8D6E63] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#8D6E63]/20">Active Management</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSelectedMetal(null)}
                    className="p-2.5 hover:bg-white rounded-xl border border-gray-100 shadow-sm transition-all"
                    title="Change Metal"
                >
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                </button>
                <PageHeader
                    title={`${selectedMetal === 'gold' ? 'Gold' : 'Silver'} Category Management`}
                    subtitle={`Manage ${selectedMetal === 'gold' ? '18K/22K gold' : 'sterling silver'} collections and their global visibility settings.`}
                    action={{
                        label: "Add New Category",
                        onClick: () => navigate('/admin/categories/new')
                    }}
                />
            </div>

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
                data={filteredByMetal.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search categories..."
                filters={filters}
            />
        </div>
    );
};

export default CategoryPage;
