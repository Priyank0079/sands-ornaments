import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, TrendingUp } from 'lucide-react';
import PageHeader from '../../admin/components/common/PageHeader';
import DataTable from '../../admin/components/common/DataTable';
import { sellerProductService } from '../services/sellerProductService';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const SellerProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categoryOptions, setCategoryOptions] = useState([{ label: 'All Categories', value: 'all' }]);
    const [categoryLookup, setCategoryLookup] = useState({});

    useEffect(() => {
        const loadProducts = async () => {
            const data = await sellerProductService.getSellerProductsRaw();
            setProducts(data || []);
            setLoading(false);
        };
        loadProducts();
    }, []);

    useEffect(() => {
        const loadCategoryLookup = async () => {
            try {
                const res = await api.get('public/categories');
                const list = res.data?.data?.categories || [];
                const map = list.reduce((acc, cat) => {
                    acc[String(cat._id)] = cat.name;
                    return acc;
                }, {});
                setCategoryLookup(map);
            } catch (err) {
                setCategoryLookup({});
            }
        };
        loadCategoryLookup();
    }, []);

    useEffect(() => {
        const categories = Array.from(
            new Map(
                products
                    .flatMap((p) => p.categories || [])
                    .map((c) => [String(c?._id || c), c?.name || c])
            )
        ).map(([value, name]) => ({ label: name || 'Uncategorized', value }));

        setCategoryOptions([
            { label: 'All Categories', value: 'all' },
            ...categories
        ]);
    }, [products]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const success = await sellerProductService.deleteProduct(id);
            if (success) {
                setProducts(prev => prev.filter(p => p._id !== id));
                toast.success("Product deleted successfully");
            } else {
                toast.error("Failed to delete product");
            }
        }
    };

    const formatNavLabel = (value) => {
        return String(value || '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const renderNavBadges = (label, values) => {
        if (!values || values.length === 0) return null;
        return (
            <div className="flex flex-wrap items-center gap-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
                {values.map((val) => (
                    <span key={`${label}-${val}`} className="px-2 py-0.5 rounded-full bg-[#F8F1F1] text-[10px] font-semibold text-[#3E2723] border border-[#EBCDD0]">
                        {formatNavLabel(val)}
                    </span>
                ))}
            </div>
        );
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.categories?.[0]?._id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const columns = [
        {
            header: 'Product Name',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        {item.images?.[0] ? (
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase">No Image</div>
                        )}
                    </div>
                    <span className="font-semibold text-gray-900 text-[13px] tracking-tight">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Category',
            render: (item) => (
                <div className="min-w-[140px] flex flex-col justify-center">
                    <span className="font-medium text-gray-900 text-xs">{item.categories?.[0]?.name || 'Uncategorized'}</span>
                </div>
            )
        },
        {
            header: 'Placement',
            render: (item) => {
                const shopCats = (item.navShopByCategory || [])
                    .map(id => categoryLookup[String(id)] || '')
                    .filter(Boolean);
                const gifts = item.navGiftsFor || [];
                const occasions = item.navOccasions || [];

                if (shopCats.length === 0 && gifts.length === 0 && occasions.length === 0) {
                    return <span className="text-gray-400 text-xs font-semibold">-</span>;
                }

                return (
                    <div className="flex flex-col gap-1.5 min-w-[180px]">
                        {renderNavBadges('Shop', shopCats)}
                        {renderNavBadges('Gifts', gifts)}
                        {renderNavBadges('Occasion', occasions)}
                    </div>
                );
            }
        },
        {
            header: 'Price',
            render: (item) => {
                const price = item.variants?.[0]?.price || '0';
                return <span className="font-semibold text-gray-900 text-xs tabular-nums">INR {price}</span>;
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
            header: 'Status',
            render: (item) => {
                const isActive = item.active !== false;
                const status = item.status || 'Active';
                return (
                    <div className="min-w-[100px] flex gap-2 items-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isActive
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-tighter ${status === 'Draft' ? 'text-amber-500' : 'text-blue-500'}`}>
                            {status}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Date',
            render: (item) => {
                if (!item.createdAt) return <span className="text-gray-400 text-xs font-semibold">-</span>;
                const date = new Date(item.createdAt);
                return <span className="text-gray-900 text-xs font-semibold">{date.toLocaleDateString()}</span>;
            }
        },
        {
            header: 'Actions',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-3 min-w-[100px]">
                    <button
                        onClick={() => navigate(`/seller/products/view/${item._id}`)}
                        className="p-1 text-gray-700 hover:text-black transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate(`/seller/products/edit/${item._id}`)}
                        className="p-1 text-gray-700 hover:text-black transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 text-gray-700 hover:text-red-700 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filters = [
        {
            options: categoryOptions,
            onChange: (val) => setSelectedCategory(val)
        }
    ];

    return (
        <div className="max-w-[1400px] mx-auto space-y-4 md:space-y-6 pb-20 animate-in fade-in duration-500 relative">
            <PageHeader
                title="Products"
                subtitle="Manage your inventory, pricing, and product details."
                action={{
                    label: "Add New Product",
                    onClick: () => navigate('/seller/products/new')
                }}
            />

            <DataTable
                columns={columns}
                data={filteredProducts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search products by name..."
                filters={filters}
            >
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => navigate('/seller/inventory/adjust')}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 hover:bg-[#3E2723] hover:text-white hover:border-[#3E2723] transition-all flex items-center gap-2 shrink-0"
                        title="Adjust Stock"
                    >
                        <TrendingUp size={14} />
                        <span className="hidden md:inline">Adjust Stock</span>
                        <span className="md:hidden">Adjust</span>
                    </button>
                </div>
            </DataTable>
        </div>
    );
};

export default SellerProducts;
