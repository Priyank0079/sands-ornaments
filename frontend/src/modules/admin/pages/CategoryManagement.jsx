import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';

const CategoryManagement = () => {
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

    const columns = [
        {
            header: 'Category',
            render: (item) => (
                <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.count} Products</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Products',
            render: (item) => (
                <span className="font-medium text-gray-600">{item.count}</span>
            )
        },
        {
            header: 'In Collection',
            render: (item) => (
                <button
                    onClick={() => toggleVisibility(item.id, 'showInCollection')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold transition-all ${item.showInCollection ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-50 text-gray-400'
                        }`}
                >
                    {item.showInCollection ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {item.showInCollection ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'In Navbar',
            render: (item) => (
                <button
                    onClick={() => toggleVisibility(item.id, 'showInNavbar')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold transition-all ${item.showInNavbar ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-50 text-gray-400'
                        }`}
                >
                    {item.showInNavbar ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {item.showInNavbar ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'Status',
            render: (item) => (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Active'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/admin/categories/edit/${item.id}`)}
                        className="p-2 text-gray-400 hover:text-[#8D6E63] hover:bg-[#8D6E63]/5 rounded-lg transition-all"
                        title="View Products"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate(`/admin/categories/edit/${item.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

export default CategoryManagement;
