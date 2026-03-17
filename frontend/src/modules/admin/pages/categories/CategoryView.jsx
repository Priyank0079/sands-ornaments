import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { adminService } from '../../services/adminService';
import { Edit2, Trash2, Plus, CheckCircle, Eye, EyeOff, Box } from 'lucide-react';
import toast from 'react-hot-toast';

import DataTable from '../../components/common/DataTable';
import AdminStatsCard from '../../components/AdminStatsCard';

const CategoryView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newSubName, setNewSubName] = useState('');
    const [isAddingSub, setIsAddingSub] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await adminService.getCategoryById(id);
                setCategory(data);
            } catch (err) {
                toast.error("Failed to load details");
                navigate('/admin/categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id, navigate]);

    const handleAddSubcategory = async (e) => {
        e.preventDefault();
        if (!newSubName.trim()) return;
        try {
            const res = await adminService.createSubcategory({
                name: newSubName,
                parentCategory: id
            });
            if (res.success) {
                setCategory(prev => ({
                    ...prev,
                    subcategories: [...(prev.subcategories || []), res.data.subcategory]
                }));
                setNewSubName('');
                setIsAddingSub(false);
                toast.success("Subcategory added");
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error("Failed to add");
        }
    };

    const handleDeleteSubcategory = async (subId) => {
        if (window.confirm("Are you sure?")) {
            const success = await adminService.deleteSubcategory(subId);
            if (success) {
                setCategory(prev => ({
                    ...prev,
                    subcategories: prev.subcategories.filter(s => s._id !== subId)
                }));
                toast.success("Deleted successfully");
            }
        }
    };

    const toggleSubVisibility = async (subId, field) => {
        const sub = category.subcategories.find(s => s._id === subId);
        const success = await adminService.updateSubcategory(subId, { [field]: !sub[field] });
        if (success) {
            setCategory(prev => ({
                ...prev,
                subcategories: prev.subcategories.map(s => 
                    s._id === subId ? { ...s, [field]: !sub[field] } : s
                )
            }));
            toast.success("Updated");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Loading collection details...</div>;
    if (!category) return null;

    const stats = [
        {
            label: `Total ${category.name} Subcategories`,
            value: category.subcategories?.length || 0,
            icon: Box,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            label: 'Active Subcategories',
            value: category.subcategories?.filter(s => s.isActive).length || 0,
            icon: CheckCircle,
            color: 'bg-green-50 text-green-600'
        },
        {
            label: 'Hidden Subcategories',
            value: category.subcategories?.filter(s => !s.isActive).length || 0,
            icon: EyeOff,
            color: 'bg-orange-50 text-orange-600'
        }
    ];

    const columns = [
        {
            header: 'Subcategory',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono uppercase">{item.slug}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Products',
            render: (item) => <span className="font-bold text-gray-700 text-sm">--</span>
        },
        {
            header: 'In Collection',
            render: (item) => (
                <button
                    onClick={() => toggleSubVisibility(item._id, 'showInCollection')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${item.showInCollection !== false ? 'bg-[#8D6E63]/5 text-[#8D6E63] border border-[#8D6E63]/10' : 'bg-gray-100 text-gray-400'}`}
                >
                    <Eye className="w-3 h-3" /> {item.showInCollection !== false ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'In Navbar',
            render: (item) => (
                <button
                    onClick={() => toggleSubVisibility(item._id, 'showInNavbar')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${item.showInNavbar !== false ? 'bg-[#8D6E63]/5 text-[#8D6E63] border border-[#8D6E63]/10' : 'bg-gray-100 text-gray-400'}`}
                >
                    <Eye className="w-3 h-3" /> {item.showInNavbar !== false ? 'Shown' : 'Hidden'}
                </button>
            )
        },
        {
            header: 'Status',
            render: (item) => (
                <button
                    onClick={() => toggleSubVisibility(item._id, 'isActive')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${item.isActive !== false ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}
                >
                    {item.isActive !== false ? <CheckCircle className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {item.isActive !== false ? 'Active' : 'Inactive'}
                </button>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-1">
                    <button onClick={() => navigate(`/admin/products?subcategory=${item._id}`)} className="p-2 text-gray-400 hover:text-[#8D6E63] transition-colors"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => navigate(`/admin/categories/edit/${item._id}?type=subcategory`)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteSubcategory(item._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title={`${category.name.toUpperCase()} SUBCATEGORIES`}
                subtitle={`Manage subcategories within the ${category.name} category.`}
                backPath="/admin/categories"
                action={{
                    label: "Add New Subcategory",
                    onClick: () => setIsAddingSub(true)
                }}
            />

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
                data={category.subcategories?.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())) || []}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search subcategories..."
            >
                {isAddingSub && (
                    <form onSubmit={handleAddSubcategory} className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 rounded-xl animate-in fade-in zoom-in duration-300">
                        <div className="bg-white border border-[#EBCDD0] p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center space-y-6">
                            <h3 className="text-xl font-black text-gray-900 uppercase">New Subcategory</h3>
                            <input 
                                type="text"
                                placeholder="E.g. Rings, Earrings"
                                value={newSubName}
                                onChange={(e) => setNewSubName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-[#8D6E63] text-center font-bold"
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 py-3 bg-[#8D6E63] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#3E2723] shadow-lg shadow-[#8D6E63]/20 transition-all">Save</button>
                                <button type="button" onClick={() => setIsAddingSub(false)} className="flex-1 py-3 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                            </div>
                        </div>
                    </form>
                )}
            </DataTable>
        </div>
    );
};

export default CategoryView;
