import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, TrendingUp, Grid, List, Barcode as BarcodeIcon, X, Download, Scan } from 'lucide-react';
import PageHeader from '../../admin/components/common/PageHeader';
import DataTable from '../../admin/components/common/DataTable';
import { sellerProductService } from '../services/sellerProductService';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import Barcode from 'react-barcode';
import { Html5Qrcode } from 'html5-qrcode';


const SellerProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categoryOptions, setCategoryOptions] = useState([{ label: 'All Categories', value: 'all' }]);
    const [categoryLookup, setCategoryLookup] = useState({});
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [activeTagProduct, setActiveTagProduct] = useState(null);
    const [batchPrintList, setBatchPrintList] = useState(null);
    const [isScannerActive, setIsScannerActive] = useState(false);
    const [scannerResult, setScannerResult] = useState('');

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

    useEffect(() => {
        let scanner = null;
        const startScanner = async () => {
            if (activeTagProduct && isScannerActive) {
                try {
                    scanner = new Html5Qrcode("modal-reader");
                    await scanner.start(
                        { facingMode: "environment" },
                        { 
                            fps: 15, 
                            qrbox: { width: 140, height: 140 },
                            aspectRatio: 1
                        },
                        (decodedText) => {
                            setScannerResult(decodedText);
                            const target = (activeTagProduct.productCode || activeTagProduct.sku || '').toUpperCase();
                            if (decodedText.toUpperCase() === target && target !== '') {
                                toast.success("Verified! Digital Signature Matches.", { icon: '✅' });
                                setIsScannerActive(false);
                            } else {
                                toast.error(`Signature Mismatch: ${decodedText}`);
                            }
                        },
                        () => {}
                    );
                } catch (err) {
                    setIsScannerActive(false);
                }
            }
        };

        if (isScannerActive) startScanner();
        return () => {
            if (scanner && scanner.isScanning) {
                scanner.stop().catch(() => {});
            }
        };
    }, [isScannerActive, activeTagProduct]);

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
            header: 'Code',
            render: (item) => (
                <span className="font-mono font-bold text-[#8D6E63] text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-widest whitespace-nowrap">
                    {item.productCode || item.sku || 'N/A'}
                </span>
            )
        },
        {
            header: 'Tag',
            render: (item) => (
                <button 
                    onClick={() => setActiveTagProduct(item)}
                    className="group relative flex items-center justify-center w-10 h-10 bg-white border border-gray-100 rounded-xl hover:border-[#3E2723] hover:bg-[#3E2723]/5 transition-all shadow-sm"
                >
                    <div className="flex flex-col items-center gap-0.5 opacity-60 group-hover:opacity-100">
                        <BarcodeIcon size={12} className="text-[#3E2723]" />
                        <span className="text-[7px] font-black uppercase tracking-tighter text-[#3E2723]">INFO</span>
                    </div>
                </button>
            )
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

            <div className="flex justify-between items-center px-2">
                <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-[#3E2723] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <List size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#3E2723] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Grid size={18} />
                    </button>
                </div>
            </div>

            {viewMode === 'table' ? (
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
                        <button
                            onClick={() => setBatchPrintList(filteredProducts)}
                            className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center gap-2"
                            title="Print Labels for All Filtered Products"
                        >
                            <BarcodeIcon size={14} />
                            <span className="hidden md:inline">Print Batch</span>
                        </button>
                    </div>
                </DataTable>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    {filteredProducts.map((item) => (
                        <div key={item._id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4">
                                     <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-amber-800 border border-amber-100 uppercase tracking-widest shadow-sm">
                                         {item.categories?.[0]?.name || 'Artifact'}
                                     </span>
                                </div>
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                     <button onClick={() => navigate(`/seller/products/view/${item._id}`)} className="p-2.5 bg-white text-gray-900 rounded-full shadow-xl hover:bg-[#3E2723] hover:text-white transition-all"><Eye size={16} /></button>
                                     <button onClick={() => navigate(`/seller/products/edit/${item._id}`)} className="p-2.5 bg-white text-gray-900 rounded-full shadow-xl hover:bg-[#3E2723] hover:text-white transition-all"><Edit2 size={16} /></button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight uppercase line-clamp-1">{item.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                         <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                             {item.productCode || item.sku}
                                         </span>
                                         <span className={`text-[10px] font-bold uppercase tracking-widest ${item.active !== false ? 'text-emerald-500' : 'text-gray-400'}`}>
                                             {item.active !== false ? 'Active' : 'Inactive'}
                                         </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center gap-3">
                                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Digital Registry</p>
                                     <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm w-full flex justify-center">
                                          <Barcode value={item.productCode || item.sku || 'N/A'} width={1.2} height={25} displayValue={false} />
                                     </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                     <div className="flex flex-col">
                                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Base Rate</p>
                                         <p className="text-lg font-black text-[#3E2723]">₹{item.variants?.[0]?.price || 0}</p>
                                     </div>
                                     <div className="flex flex-col text-right">
                                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Inventory</p>
                                         <p className={`text-xs font-black uppercase ${((item.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0)) > 5 ? 'text-emerald-600' : 'text-amber-500'}`}>
                                             {(item.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0)} Units
                                         </p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Product Tag Overlay Modal */}
            {activeTagProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
                         onClick={() => { setActiveTagProduct(null); setIsScannerActive(false); setScannerResult(''); }} />
                    
                    <div className="relative w-full max-w-[240px] bg-white rounded-[1.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-gray-100">
                        {/* Decorative Side Notches (Jewelry Tag Style) */}
                        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-black/60 rounded-full -translate-y-1/2 z-[110] blur-[1px]" />
                        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-black/60 rounded-full -translate-y-1/2 z-[110] blur-[1px]" />

                        {/* Tag Header */}
                        <div className="bg-[#3E2723] p-3 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-white/5 rounded-b-full" />
                            <div className="relative z-10 pt-1">
                                <h2 className="text-white text-[7px] font-black uppercase tracking-[0.3em] opacity-30">Registry No.</h2>
                                <p className="text-amber-200 text-xs font-black uppercase line-clamp-1 tracking-tight">{activeTagProduct.name}</p>
                            </div>
                            <button 
                                onClick={() => { setActiveTagProduct(null); setIsScannerActive(false); setScannerResult(''); }}
                                className="absolute top-2 right-2 text-white/20 hover:text-white transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>

                        {/* Tag Body */}
                        <div className="p-4 space-y-4">
                            {/* Barcode Section */}
                            <div className="space-y-1.5">
                                <div className="bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 flex flex-col items-center shadow-inner">
                                    <Barcode 
                                        value={activeTagProduct.productCode || activeTagProduct.sku || `${activeTagProduct.name.replace(/[^a-zA-Z0-9]/g, '').substring(0,4).toUpperCase()}-${(activeTagProduct.id || '0000').slice(-4).toUpperCase()}`} 
                                        width={1} 
                                        height={30} 
                                        fontSize={8} 
                                        background="transparent"
                                        margin={0}
                                    />
                                    <div className="mt-1.5 flex flex-col items-center">
                                         <span className="text-[10px] font-mono font-black text-[#3E2723] tracking-[0.15em] uppercase">
                                             {activeTagProduct.productCode || activeTagProduct.sku || `${activeTagProduct.name.replace(/[^a-zA-Z0-9]/g, '').substring(0,4).toUpperCase()}-${(activeTagProduct.id || '0000').slice(-4).toUpperCase()}`}
                                         </span>
                                         <div className="h-[1px] w-8 bg-amber-200 mt-0.5" />
                                    </div>
                                </div>
                            </div>

                            {/* Divider with Center Hole (Tag Style) */}
                            <div className="relative flex items-center gap-4">
                                <div className="h-[1px] bg-gray-100 flex-grow" />
                                <div className="w-4 h-4 rounded-full border-2 border-gray-100" />
                                <div className="h-[1px] bg-gray-100 flex-grow" />
                            </div>

                            {/* Verification Scanner Section (Replaces Old QR) */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-1">
                                        <Scan size={8} className="text-gray-400" />
                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Verification</p>
                                    </div>
                                    <span className={`text-[6px] font-black px-1 py-0.5 rounded-full uppercase tracking-tighter ${isScannerActive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-300'}`}>
                                        {isScannerActive ? 'Live' : 'Ready'}
                                    </span>
                                </div>
                                
                                <div className="relative aspect-square w-full max-w-[140px] mx-auto group">
                                    <div className="absolute inset-0 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-[#3E2723]/10 transition-all flex items-center justify-center overflow-hidden shadow-inner">
                                        {isScannerActive ? (
                                            <div id="modal-reader" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => setIsScannerActive(true)}
                                                    className="w-10 h-10 bg-[#3E2723]/5 rounded-full flex items-center justify-center text-[#3E2723] hover:scale-110 transition-transform"
                                                >
                                                    <Scan size={14} />
                                                </button>
                                                <span className="text-[6px] font-black uppercase text-[#3E2723] tracking-widest">Start Scanner</span>
                                            </div>
                                        )}

                                        {/* Scanner Overlay UI */}
                                        {isScannerActive && (
                                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                                <div className="w-24 h-24 border-2 border-white/40 rounded-3xl" />
                                                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-red-500/40 shadow-[0_0_15px_red] animate-pulse" />
                                            </div>
                                        )}
                                    </div>

                                    {scannerResult && (
                                        <div className="absolute -bottom-2 translate-y-full left-0 right-0 text-center animate-in slide-in-from-top-2 duration-300">
                                            <span className="text-[10px] font-black text-[#3E2723] bg-amber-100 px-3 py-1 rounded-full border border-amber-200 uppercase">
                                                Last Scan: {scannerResult}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tag Footer - Final Compact Actions */}
                        <div className="p-3 bg-gray-50/50 flex gap-2">
                            <button 
                                onClick={() => window.print()}
                                className="flex-grow bg-[#3E2723] text-white py-2 rounded-lg font-black text-[8px] uppercase tracking-[0.1em] hover:bg-[#2D1B18] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                            >
                                <Download size={10} /> Manifest Tag
                            </button>
                            <button 
                                onClick={() => { setActiveTagProduct(null); setIsScannerActive(false); setScannerResult(''); }}
                                className="px-3 py-2 border border-gray-200 text-gray-400 rounded-lg hover:text-gray-600 hover:border-gray-300 transition-all text-[8px] font-black uppercase"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Batch Printing Overlay */}
            {batchPrintList && (
                <div className="fixed inset-0 z-[110] bg-white overflow-y-auto p-8 no-print-bg">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-10 print:hidden border-b pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-[#3E2723] uppercase">Batch Print Queue</h2>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Found {batchPrintList.length} tags to manifest</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => window.print()}
                                    className="px-8 py-3 bg-[#3E2723] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E2723]/20"
                                >
                                    Start Printing
                                </button>
                                <button
                                    onClick={() => setBatchPrintList(null)}
                                    className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest"
                                >
                                    Close Queue
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                            {batchPrintList.map((product, idx) => (
                                <div key={product._id || idx} className="w-[200px] border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm p-3 space-y-3 print:border-none print:shadow-none print:break-inside-avoid print:m-2">
                                    <div className="bg-[#3E2723] p-1.5 text-center rounded-lg">
                                        <p className="text-amber-200 text-[8px] font-black uppercase line-clamp-1">{product.name}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <Barcode 
                                            value={product.productCode || product.sku || 'N/A'} 
                                            width={0.8} 
                                            height={30} 
                                            fontSize={8}
                                            margin={0}
                                        />
                                        <span className="text-[9px] font-mono font-black text-[#3E2723] uppercase tracking-widest">
                                            {product.productCode || product.sku}
                                        </span>
                                        <div className="h-[1px] w-full bg-gray-100" />
                                        <div className="flex justify-between w-full text-[8px] font-black uppercase text-gray-400">
                                            <span>RATE: ₹{product.variants?.[0]?.price}</span>
                                            <span>SANDS</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProducts;
