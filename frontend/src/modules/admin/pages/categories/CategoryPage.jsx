import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, EyeOff, Box, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import AdminStatsCard from '../../components/AdminStatsCard';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const CategoryPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMetal, setSelectedMetal] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await adminService.getCategories();
                setCategories(data);
            } catch (err) {
                toast.error("Failed to load categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const success = await adminService.deleteCategory(id);
            if (success) {
                setCategories(prev => prev.filter(cat => cat._id !== id));
                toast.success("Category deleted");
            } else {
                toast.error("Delete failed");
            }
        }
    };

    const toggleVisibility = async (id, field) => {
        // Optimistic Update
        const originalCategories = [...categories];
        setCategories(categories.map(cat =>
            cat._id === id ? { ...cat, [field]: !cat[field] } : cat
        ));

        const res = await adminService.updateCategory(id, { [field]: !categories.find(c => c._id === id)[field] });
        if (res.success) {
            toast.success("Updated visibility");
        } else {
            setCategories(originalCategories); // Rollback
            toast.error(res.message || "Update failed");
        }
    };

    const columns = [
        {
            header: 'Category',
            render: (item) => (
                    <div className="flex items-center gap-4 text-gray-700">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                            <img src={item.image || 'https://placehold.co/100'} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{item.name}</p>
                            <p className="text-[10px] text-gray-400">{item.productCount || 0} Products</p>
                        </div>
                    </div>
                )
            },
        {
            header: 'In Collection',
            render: (item) => (
                <button
                    onClick={() => toggleVisibility(item._id, 'showInCollection')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${item.showInCollection !== false ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-50 text-gray-400'}`}
                >
                    {item.showInCollection !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {item.showInCollection !== false ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'In Navbar',
            render: (item) => (
                <button
                    onClick={() => toggleVisibility(item._id, 'showInNavbar')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${item.showInNavbar !== false ? 'bg-[#8D6E63]/10 text-[#8D6E63]' : 'bg-gray-50 text-gray-400'}`}
                >
                    {item.showInNavbar !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {item.showInNavbar !== false ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'Status',
            render: (item) => (
                <button
                    onClick={() => toggleVisibility(item._id, 'isActive')}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${item.isActive !== false
                        ? 'bg-green-50 text-green-700 border border-green-100 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                        }`}
                >
                    {item.isActive !== false ? 'Active' : 'Inactive'}
                </button>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/admin/categories/edit/${item._id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item._id)}
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
            onChange: (val) => setStatusFilter(val)
        }
    ];

    const filteredByMetal = categories.filter(c => c.metal?.toLowerCase() === selectedMetal?.toLowerCase());
    const baseList = selectedMetal === 'all' ? categories : filteredByMetal;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredData = baseList.filter(cat => {
        const matchesSearch = !normalizedSearch || cat.name?.toLowerCase().includes(normalizedSearch);
        const isActive = cat.isActive !== false;
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? isActive : !isActive);
        return matchesSearch && matchesStatus;
    });

    const stats = [
        {
            label: 'Total Categories',
            value: selectedMetal === 'all' ? categories.length : filteredByMetal.length,
            icon: Box,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Active Categories',
            value: (selectedMetal === 'all' ? categories : filteredByMetal).filter(c => c.isActive !== false).length,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Hidden Categories',
            value: (selectedMetal === 'all' ? categories : filteredByMetal).filter(c => c.isActive === false).length,
            icon: EyeOff,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    if (loading) return <div className="p-20 text-center font-bold text-gray-400 animate-pulse tracking-widest uppercase">Initializing Category Vault...</div>;

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
                                <span className="inline-block px-4 py-2 bg-[#D4AF37]/10 text-[#AA8C2C] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#D4AF37]/20">Active Management</span>
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
                    {/* All Collections */}
                    <button
                        onClick={() => setSelectedMetal('all')}
                        className="group relative bg-[#F8F9FA] border border-gray-100 rounded-[2.5rem] p-12 text-center transition-all hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 overflow-hidden md:col-span-2"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gray-200/10 transition-colors" />
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Box className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">All Collections</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">Complete Catalog Overview</p>
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
                    className="p-2.5 hover:bg-white rounded-xl border border-gray-100 shadow-sm transition-all text-gray-400 hover:text-black"
                    title="Change Metal"
                >
                    <AlertCircle className="w-5 h-5" />
                </button>
                <PageHeader
                    title={selectedMetal === 'all' ? "Master Category Management" : `${selectedMetal.toUpperCase()} Category Management`}
                    subtitle={selectedMetal === 'all' ? "Overview of all collections across metals." : `Manage ${selectedMetal === 'gold' ? '18K/22K gold' : 'sterling silver'} collections.`}
                    action={{
                        label: "Add New Category",
                        onClick: () => navigate(`/admin/categories/new${selectedMetal !== 'all' ? `?metal=${selectedMetal}` : ''}`)
                    }}
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <AdminStatsCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        bgColor={stat.bgColor}
                    />
                ))}
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search categories..."
                filters={filters}
            />
        </div>
    );
};

export default CategoryPage;
