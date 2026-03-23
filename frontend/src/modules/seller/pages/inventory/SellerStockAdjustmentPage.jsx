import React, { useState, useEffect, useMemo } from 'react';
import { Search, Save, RotateCcw, Plus, Minus, CheckCircle2, Package, Barcode as BarcodeIcon, X, ScanLine } from 'lucide-react';
import { sellerInventoryService } from '../../services/sellerInventoryService';
import toast from 'react-hot-toast';

const SellerStockAdjustmentPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [adjustments, setAdjustments] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [serializeModal, setSerializeModal] = useState({
        isOpen: false,
        product: null,
        codes: [],
        count: 0
    });
    const [serializing, setSerializing] = useState(false);

    const loadInventory = async () => {
        setLoading(true);
        try {
            const inventory = await sellerInventoryService.getInventory();
            const flattened = (inventory || []).flatMap(p => (p.variants || []).map(v => ({
                productId: p._id || p.id,
                variantId: v._id,
                name: p.name,
                category: p.categories?.[0]?.name || 'Uncategorized',
                stock: v.stock,
                variantName: v.name,
                image: p.images?.[0] || ''
            })));
            setProducts(flattened);
        } catch (err) {
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInventory();
    }, []);

    const handleAdjustmentChange = (id, value) => {
        const val = parseInt(value) || 0;
        if (val === 0) {
            const newAdjustments = { ...adjustments };
            delete newAdjustments[id];
            setAdjustments(newAdjustments);
        } else {
            setAdjustments({ ...adjustments, [id]: val });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const entries = Object.entries(adjustments);
            for (const [variantId, delta] of entries) {
                const item = products.find(p => p.variantId === variantId);
                if (!item) continue;
                const newStock = item.stock + delta;
                await sellerInventoryService.adjustStock({
                    productId: item.productId,
                    variantId,
                    newStock,
                    reason: "Manual adjustment by Seller"
                });
            }
            toast.success("Inventory updated");
            setAdjustments({});
            await loadInventory();
        } catch (err) {
            toast.error("Failed to update inventory");
        } finally {
            setSaving(false);
        }
    };

    const handleSerialize = async () => {
        if (!serializeModal.product) return;
        setSerializing(true);
        try {
            await sellerInventoryService.serializeStock({
                productId: serializeModal.product.productId,
                variantId: serializeModal.product.variantId,
                productCodes: serializeModal.codes
            });
            toast.success(`Converted ${serializeModal.codes.length} items to serialized listings`);
            setSerializeModal({ isOpen: false, product: null, codes: [], count: 0 });
            await loadInventory();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to serialize stock");
        } finally {
            setSerializing(false);
        }
    };

    const resetAdjustments = () => {
        setAdjustments({});
    };

    const filteredProducts = useMemo(() => products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [products, searchTerm]);

    const pendingCount = Object.keys(adjustments).length;

    return (
        <div className="space-y-8 font-sans pb-24 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Stock Adjustment</h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Manually update product inventory</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={resetAdjustments}
                        disabled={pendingCount === 0 || saving}
                        className="px-4 py-2 border border-gray-200 bg-white text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        <RotateCcw size={14} /> Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={pendingCount === 0 || saving}
                        className="px-6 py-2 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={14} />
                        )}
                        Sync Changes
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center gap-4 sticky top-4 z-20">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                        type="text"
                        placeholder="Search product by Name or Category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none text-xs font-bold text-gray-900 focus:ring-0 placeholder:text-gray-400"
                    />
                </div>
                {pendingCount > 0 && (
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{pendingCount} Pending Modifications</span>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[50%]">Product Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Current Stock</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Add / Remove</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Final Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">Loading Inventory...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No products found</td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const adjustment = adjustments[product.variantId] || 0;
                                    const finalStock = product.stock + adjustment;
                                    const isModified = adjustment !== 0;

                                    return (
                                        <tr key={product.variantId} className={`hover:bg-gray-50/50 transition-colors group ${isModified ? 'bg-blue-50/30' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 p-1 flex-shrink-0">
                                                        {product.image ? (
                                                            <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                                        ) : (
                                                            <Package size={20} className="text-gray-300 m-auto" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{product.category} - {product.variantName || 'Standard'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-sm font-black ${product.stock === 0 ? 'text-red-500' : 'text-gray-900'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center relative">
                                                    <input
                                                        type="number"
                                                        value={adjustment === 0 ? '' : adjustment}
                                                        onChange={(e) => handleAdjustmentChange(product.variantId, e.target.value)}
                                                        placeholder="0"
                                                        className={`w-24 px-3 py-2 text-center rounded-xl border-2 text-sm font-black focus:outline-none focus:ring-0 transition-all
                                                            ${adjustment > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-600 placeholder:text-emerald-300' : ''}
                                                            ${adjustment < 0 ? 'bg-red-50 border-red-200 text-red-600 placeholder:text-red-300' : ''}
                                                            ${adjustment === 0 ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-gray-400' : ''}
                                                        `}
                                                    />
                                                    {adjustment > 0 && <Plus size={12} className="absolute left-3 text-emerald-500 pointer-events-none" />}
                                                    {adjustment < 0 && <Minus size={12} className="absolute left-3 text-red-500 pointer-events-none" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => setSerializeModal({
                                                        isOpen: true,
                                                        product: product,
                                                        count: 0,
                                                        codes: []
                                                    })}
                                                    className="p-2 hover:bg-[#3E2723] hover:text-white rounded-lg text-gray-400 border border-transparent hover:border-[#3E2723] transition-all flex items-center justify-center gap-1.5 m-auto"
                                                    title="Split into individual barcodes"
                                                >
                                                    <BarcodeIcon size={14} />
                                                    <span className="text-[10px] font-black uppercase">Serialize</span>
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`text-sm font-black transition-all ${finalStock < 0 ? 'text-red-600' :
                                                        finalStock !== product.stock ? 'text-blue-600' : 'text-gray-900'
                                                        }`}>
                                                        {finalStock}
                                                    </span>
                                                    {isModified && (
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">(New)</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pendingCount > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-6 border border-gray-800 w-[90%] md:w-auto max-w-2xl">
                    <div className="flex items-center gap-3 border-r border-gray-700 pr-6">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-black text-xs">
                            {pendingCount}
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest">Pending Changes</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Review before syncing</p>
                        </div>
                    </div>
                    <div className="flex gap-3 flex-1 md:flex-initial">
                        <button
                            onClick={resetAdjustments}
                            className="px-4 py-2 hover:bg-gray-800 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                        >
                            Reset All
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
                        >
                            {saving ? 'Syncing...' : 'Confirm Updates'} <CheckCircle2 size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Serialize Modal */}
            {serializeModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        <div className="bg-[#3E2723] p-6 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Serialize Stock</h2>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mt-1">{serializeModal.product?.name}</p>
                            </div>
                            <button onClick={() => setSerializeModal({ ...serializeModal, isOpen: false })} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20} /></button>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest block">Number of Items to Serialize (Max {serializeModal.product?.stock})</label>
                                <input 
                                    type="number" 
                                    max={serializeModal.product?.stock}
                                    value={serializeModal.count || ''}
                                    onChange={(e) => {
                                        const val = Math.min(parseInt(e.target.value) || 0, serializeModal.product?.stock || 0);
                                        const newCodes = Array(val).fill('').map((_, i) => serializeModal.codes[i] || '');
                                        setSerializeModal({ ...serializeModal, count: val, codes: newCodes });
                                    }}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-xl font-black text-gray-900 focus:outline-none focus:border-[#3E2723] transition-all"
                                    placeholder="0"
                                />
                            </div>

                            {serializeModal.count > 0 && (
                                <div className="space-y-4 pt-4 border-t border-gray-50 animate-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Barcodes / Serial Numbers</label>
                                        <button 
                                            onClick={() => {
                                                const codes = serializeModal.codes.map((c, i) => c || `SN${Date.now().toString().slice(-6)}${i}`);
                                                setSerializeModal({ ...serializeModal, codes });
                                            }}
                                            className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                        >
                                            Auto-Fill Empty
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
                                        {serializeModal.codes.map((code, idx) => (
                                            <div key={idx} className="flex gap-3 animate-in fade-in duration-300">
                                                <div className="flex-1 relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 group-focus-within:text-[#3E2723]">#{idx+1}</span>
                                                    <input 
                                                        value={code}
                                                        onChange={(e) => {
                                                            const newCodes = [...serializeModal.codes];
                                                            newCodes[idx] = e.target.value.toUpperCase();
                                                            setSerializeModal({ ...serializeModal, codes: newCodes });
                                                        }}
                                                        className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-12 text-xs font-mono font-bold focus:border-[#3E2723] outline-none transition-all"
                                                        placeholder="SCAN OR ENTER MANUALLY"
                                                    />
                                                    <ScanLine className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 hover:text-[#3E2723] cursor-pointer" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                            <button 
                                onClick={() => setSerializeModal({ ...serializeModal, isOpen: false })}
                                className="flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-200 transition-all border border-transparent"
                            >
                                Cancel
                            </button>
                            <button 
                                disabled={serializeModal.count === 0 || serializeModal.codes.some(c => !c) || serializing}
                                onClick={handleSerialize}
                                className="flex-[2] py-4 px-6 bg-[#3E2723] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-900/20 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {serializing ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Finalize Serialization <CheckCircle2 size={16} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerStockAdjustmentPage;
