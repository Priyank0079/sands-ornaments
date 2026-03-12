import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Edit2, Trash2, Eye, Package, TrendingUp, Check } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import { useShop } from '../../../context/ShopContext';
import BulkUpdateModal from '../components/BulkUpdateModal';

const ProductManagement = () => {
    const navigate = useNavigate();
    const { products, deleteProduct, bulkUpdatePrices } = useShop();
    const [searchParams] = useSearchParams();
    const isSelectMode = searchParams.get('selectMode') === 'true';
    const returnUrl = searchParams.get('returnUrl') || '/admin/products';

    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleConfirmSelection = () => {
        const selectedProducts = products.filter(p => selectedIds.includes(p.id));
        localStorage.setItem('temp_selected_products', JSON.stringify(selectedProducts));
        navigate(returnUrl);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            // Logic placeholder
        }
    };

    const columns = [
        ...(isSelectMode ? [{
            header: '',
            render: (item) => (
                <div onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }} className="cursor-pointer">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedIds.includes(item.id) ? 'bg-[#3E2723] border-[#3E2723] text-white' : 'border-gray-300 bg-white'}`}>
                        {selectedIds.includes(item.id) && <Check size={12} strokeWidth={3} />}
                    </div>
                </div>
            )
        }] : []),
        {
            header: 'Product Name',
            render: (item) => (
                <div className="flex items-center py-1">
                    <span className="font-semibold text-gray-900 text-[13px] tracking-tight">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Category',
            render: (item) => {
                const categories = item.categories || (item.category ? [{ category: item.category, subcategory: item.subcategory }] : []);
                const primary = categories[0] || { category: 'Uncategorized', subcategory: '' };
                return (
                    <div className="min-w-[140px] flex flex-col justify-center">
                        <span className="font-medium text-gray-900 text-xs">{primary.category}</span>
                        {primary.subcategory && <span className="text-[10px] text-gray-500 mt-0.5">{primary.subcategory}</span>}
                    </div>
                );
            }
        },
        {
            header: 'Price',
            render: (item) => {
                const price = item.variants?.[0]?.price || '0';
                return <span className="font-semibold text-gray-900 text-xs tabular-nums">₹{price}</span>;
            }
        },
        {
            header: 'Stock',
            render: (item) => {
                const totalStock = (item.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
                const inStock = totalStock > 0;
                return (
                    <div className="min-w-[100px]">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${inStock
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                            : 'bg-red-50 text-red-800 border-red-100'
                            }`}>
                            {inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Rating',
            render: (item) => (
                <div className="flex items-center gap-1 min-w-[60px]">
                    <span className="text-amber-500 text-xs">★</span>
                    <span className="font-bold text-gray-900 text-xs">4.2</span>
                </div>
            )
        },
        {
            header: 'Status',
            render: (item) => {
                const isActive = item.active !== false;
                const toggleStatus = (e) => {
                    e.stopPropagation();
                    // Mock toggle logic - in reality would call API
                    item.active = !isActive;
                    // Force update would happen via state change usually
                };

                return (
                    <div className="min-w-[80px]">
                        <button
                            onClick={toggleStatus}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all hover:scale-105 active:scale-95 ${isActive
                                ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                }`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </button>
                    </div>
                );
            }
        },
        {
            header: 'Date',
            render: () => <span className="text-gray-900 text-xs font-semibold">20/01/2024</span>
        },
        ...(!isSelectMode ? [{
            header: 'Actions',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-3 min-w-[100px]">
                    <button
                        onClick={() => navigate(`/admin/products/view/${item.id}`)}
                        className="p-1 text-gray-700 hover:text-black transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate(`/admin/products/edit/${item.id}`)}
                        className="p-1 text-gray-700 hover:text-black transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-gray-700 hover:text-red-700 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }] : [])
    ];

    const filters = [
        {
            options: [
                { label: 'All Categories', value: 'all' },
                { label: 'Necklaces', value: 'necklaces' },
                { label: 'Rings', value: 'rings' },
                { label: 'Earrings', value: 'earrings' },
                { label: 'Bangles', value: 'bangles' }
            ],
            onChange: (val) => setSelectedCategory(val)
        }
    ];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Support both old format (category) and new format (categories array)
        const categories = p.categories || (p.category ? [{ category: p.category, subcategory: p.subcategory }] : []);
        const matchesCategory = selectedCategory === 'all' || categories.some(cat => cat.category === selectedCategory);

        return matchesSearch && matchesCategory;
    });

    const handleBulkApply = (config) => {
        // config already contains productIds selected in the modal
        bulkUpdatePrices({
            category: selectedCategory,
            ...config
        });
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-4 md:space-y-6 pb-20 animate-in fade-in duration-500 relative">
            <PageHeader
                title={isSelectMode ? "Select Products" : "Products"}
                subtitle={isSelectMode ? `Select products to add to showcase (${selectedIds.length} selected)` : "Manage your inventory, pricing, and product details."}
                action={!isSelectMode ? {
                    label: "Add New Product",
                    onClick: () => navigate('/admin/products/new')
                } : undefined}
            />

            <DataTable
                columns={columns}
                data={filteredProducts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search products by name..."
                filters={filters}
            >
                {!isSelectMode && (
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 hover:bg-[#3E2723] hover:text-white hover:border-[#3E2723] transition-all flex items-center gap-2 shrink-0"
                        title="Bulk Update Prices"
                    >
                        <TrendingUp size={14} />
                        <span className="hidden md:inline">Bulk Actions</span>
                        <span className="md:hidden">Bulk</span>
                    </button>
                )}
            </DataTable>

            {isSelectMode && selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3E2723] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
                    <span className="font-bold text-sm">{selectedIds.length} Products Selected</span>
                    <button
                        onClick={handleConfirmSelection}
                        className="bg-white text-[#3E2723] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors"
                    >
                        Confirm Selection
                    </button>
                </div>
            )}

            <BulkUpdateModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onApply={handleBulkApply}
                products={filteredProducts}
            />
        </div>
    );
};

export default ProductManagement;
