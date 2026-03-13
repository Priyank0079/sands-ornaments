import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, CheckCircle, XCircle } from 'lucide-react';
import AdminTable from '../../admin/components/AdminTable';
import { sellerOrderService } from '../services/sellerOrderService';

const SellerOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setOrders(sellerOrderService.getSellerOrders());
    }, []);

    const handleAction = async (id, status) => {
        const res = await sellerOrderService.updateOrderStatus(id, status);
        if (res.success) {
            setOrders(sellerOrderService.getSellerOrders());
        }
    };

    const columns = [
        {
            header: 'TRANSACTION ID',
            accessor: 'id',
            className: 'w-[12%] font-black text-gray-900 tracking-tight'
        },
        {
            header: 'CUSTOMER',
            className: 'w-[15%]',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-900 uppercase">{row.customerName}</span>
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest italic mt-0.5">KYC VERIFIED</span>
                </div>
            )
        },
        {
            header: 'PRODUCT',
            className: 'w-[18%]',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-900 uppercase truncate max-w-[150px]">{row.product}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">QTY: {row.quantity}</span>
                </div>
            )
        },
        {
            header: 'PRICE',
            className: 'w-[10%]',
            render: (row) => <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">₹{row.price.toLocaleString()}</span>
        },
        {
            header: 'REMITTANCE',
            className: 'w-[10%]',
            render: (row) => (
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    row.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                    {row.paymentStatus}
                </span>
            )
        },
        {
            header: 'STATUS',
            className: 'w-[15%]',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-[0.1em] border ${
                    ['DELIVERED', 'ACCEPTED', 'RETURN APPROVED'].includes(row.orderStatus) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    ['REJECTED', 'CANCELLED', 'RETURN REJECTED'].includes(row.orderStatus) ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                    {row.orderStatus}
                </span>
            )
        },
        {
            header: 'DATE',
            className: 'w-[10%]',
            render: (row) => <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(row.orderDate).toLocaleDateString()}</span>
        },
        {
            header: 'ACTIONS',
            className: 'w-[10%] text-right',
            render: (row) => (
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => navigate(`/seller/order-details/${row.id}`)}
                        className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-[#3E2723] transition-all"
                    >
                        <Eye size={16} />
                    </button>
                    {row.orderStatus === 'PENDING' && (
                        <>
                            <button 
                                onClick={() => handleAction(row.id, 'ACCEPTED')}
                                className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-all"
                            >
                                <CheckCircle size={16} />
                            </button>
                            <button 
                                onClick={() => handleAction(row.id, 'REJECTED')}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all"
                            >
                                <XCircle size={16} />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ORDER FULFILLMENT PIPELINE</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Surveillance and management of active transaction streams</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdminTable columns={columns} data={orders} />
            </div>
        </div>
    );
};

export default SellerOrders;
