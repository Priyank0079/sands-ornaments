import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, CheckCircle, XCircle, Eye } from 'lucide-react';
import AdminTable from '../../admin/components/AdminTable';
import { sellerOrderService } from '../services/sellerOrderService';

const SellerReturns = () => {
    const [returns, setReturns] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setReturns(sellerOrderService.getReturns());
    }, []);

    const handleAction = async (id, status) => {
        const res = await sellerOrderService.processReturn(id, status);
        if (res.success) {
            setReturns(sellerOrderService.getReturns());
        }
    };

    const columns = [
        {
            header: 'ORDER ID',
            accessor: 'orderId',
            className: 'w-[15%] font-black text-gray-900 tracking-tight'
        },
        {
            header: 'PRODUCT',
            className: 'w-[20%]',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-900 uppercase truncate max-w-[180px]">{row.product}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Barcode: {row.barcode}</span>
                </div>
            )
        },
        {
            header: 'CUSTOMER',
            accessor: 'customerName',
            className: 'w-[15%] text-[10px] font-black text-gray-900 uppercase'
        },
        {
            header: 'RETURN REASON',
            accessor: 'returnReason',
            className: 'w-[20%] text-[10px] text-gray-500 font-medium italic'
        },
        {
            header: 'STATUS',
            className: 'w-[15%]',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                    row.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    row.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'ACTIONS',
            className: 'w-[15%] text-right',
            render: (row) => (
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => navigate(`/seller/return-details/${row.id}`)}
                        className="p-2 hover:bg-[#3E2723]/5 rounded-lg text-[#3E2723] transition-all border border-[#3E2723]/10 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest"
                        title="View Full Case"
                    >
                        <Eye size={14} /> Full Detail
                    </button>
                    {row.status === 'RETURN REQUESTED' && (
                        <>
                            <button 
                                onClick={() => handleAction(row.id, 'APPROVED')}
                                className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all border border-emerald-100 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest"
                                title="Approve"
                            >
                                <CheckCircle size={14} />
                            </button>
                            <button 
                                onClick={() => handleAction(row.id, 'REJECTED')}
                                className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-all border border-red-100 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest"
                                title="Reject"
                            >
                                <XCircle size={14} />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            <div>
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight text-left">CLAIM RESOLUTION</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 text-left">Process and resolve customer return requests</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdminTable columns={columns} data={returns} />
            </div>
        </div>
    );
};

export default SellerReturns;
