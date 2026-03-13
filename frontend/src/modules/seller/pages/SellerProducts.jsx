import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Barcode, Eye, ArrowRight, ShoppingBag, Plus } from 'lucide-react';
import AdminTable from '../../admin/components/AdminTable';
import { sellerProductService } from '../services/sellerProductService';

const SellerProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(sellerProductService.getSellerProducts());
    }, []);

    const columns = [
        {
            header: 'PRODUCT',
            className: 'w-[35%]',
            render: (row) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 line-clamp-1 uppercase tracking-tighter">{row.name}</span>
                        <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{row.category} / {row.metalType}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'INVENTORY',
            className: 'w-[25%]',
            render: (row) => (
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Total</span>
                        <span className="text-xs font-bold text-gray-800">{row.quantity}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Stock</span>
                        <span className={`text-xs font-bold ${parseInt(row.availableStock) < 5 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {row.availableStock}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'PERFORMANCE',
            className: 'w-[20%]',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Sold Items</span>
                    <span className="text-xs font-bold text-indigo-600">{row.soldItems || 0}</span>
                </div>
            )
        },
        {
            header: 'ACTIONS',
            className: 'w-[20%] text-right',
            render: (row) => (
                <button 
                    onClick={() => navigate(`/seller/product-barcodes/${row.id}`)}
                    className="inline-flex items-center gap-2 bg-[#FDFBF7] border border-[#EFEBE9] text-[#8D6E63] px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#3E2723] hover:text-white transition-all shadow-sm"
                >
                    <Barcode className="w-3 h-3" />
                    View Barcodes
                </button>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">STORE INVENTORY</h1>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Manage and monitor your active product listings</p>
                </div>
                <button 
                    onClick={() => navigate('/seller/add-product')}
                    className="bg-[#3E2723] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdminTable columns={columns} data={products} />
            </div>
        </div>
    );
};

export default SellerProducts;
