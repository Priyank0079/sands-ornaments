import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, PackageCheck, Truck, XCircle } from 'lucide-react';
import AdminTable from '../../admin/components/AdminTable';
import { sellerOrderService } from '../services/sellerOrderService';
import toast from 'react-hot-toast';

const formatCurrency = (value) => `INR ${Number(value || 0).toLocaleString()}`;

const STATUS_COLORS = {
    Processing: 'bg-amber-50 text-amber-700 border-amber-100',
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
    Packed: 'bg-violet-50 text-violet-700 border-violet-100',
    Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Cancelled: 'bg-red-50 text-red-700 border-red-100',
};

const SellerOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await sellerOrderService.getSellerOrders();
            setOrders(data);
        } catch (err) {
            toast.error('Unable to load seller orders right now.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleAction = async (orderId, status) => {
        const res = await sellerOrderService.updateOrderStatus(orderId, status);
        if (!res.success) {
            toast.error(res.message || 'Unable to update order status.');
            return;
        }

        toast.success(res.message || 'Order updated');
        setOrders((prev) => prev.map((order) => (
            order.id === orderId && res.order ? res.order : order
        )));
    };

    const columns = useMemo(() => ([
        {
            header: 'ORDER ID',
            accessor: 'orderId',
            className: 'w-[13%] font-black text-gray-900 tracking-tight'
        },
        {
            header: 'CUSTOMER',
            className: 'w-[16%]',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-900 uppercase">{row.customerName || 'Customer'}</span>
                    <span className="text-[9px] text-gray-400 font-bold">{row.customerPhone || row.customerEmail || 'Private profile'}</span>
                </div>
            )
        },
        {
            header: 'SELLER ITEMS',
            className: 'w-[20%]',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-900 uppercase truncate max-w-[180px]">{row.product}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                        Qty: {row.quantity} {row.sellerItemCount > 1 ? `| ${row.sellerItemCount} items` : ''}
                    </span>
                </div>
            )
        },
        {
            header: 'AMOUNT',
            className: 'w-[11%]',
            render: (row) => <span className="text-[10px] font-black text-gray-900">{formatCurrency(row.sellerSubtotal || row.totalAmount || 0)}</span>
        },
        {
            header: 'PAYMENT',
            className: 'w-[10%]',
            render: (row) => (
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    ['paid'].includes(String(row.paymentStatus).toLowerCase()) ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                }`}>
                    {String(row.paymentStatus || 'pending').toUpperCase()}
                </span>
            )
        },
        {
            header: 'STATUS',
            className: 'w-[12%]',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-[0.1em] border ${STATUS_COLORS[row.orderStatus] || 'bg-gray-50 text-gray-700 border-gray-100'}`}>
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
            className: 'w-[12%] text-right',
            render: (row) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => navigate(`/seller/order-details/${row.id}`)}
                        className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-[#3E2723] transition-all"
                        title="View order"
                    >
                        <Eye size={16} />
                    </button>
                    {row.canManageStatus && row.orderStatus === 'Processing' && (
                        <>
                            <button
                                onClick={() => handleAction(row.id, 'Confirmed')}
                                className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-all"
                                title="Confirm order"
                            >
                                <PackageCheck size={16} />
                            </button>
                            <button
                                onClick={() => handleAction(row.id, 'Cancelled')}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all"
                                title="Cancel order"
                            >
                                <XCircle size={16} />
                            </button>
                        </>
                    )}
                    {row.canManageStatus && row.orderStatus === 'Confirmed' && (
                        <button
                            onClick={() => handleAction(row.id, 'Packed')}
                            className="p-1.5 hover:bg-violet-50 rounded-lg text-gray-400 hover:text-violet-600 transition-all"
                            title="Mark packed"
                        >
                            <PackageCheck size={16} />
                        </button>
                    )}
                    {row.canManageStatus && row.orderStatus === 'Packed' && (
                        <button
                            onClick={() => navigate(`/seller/order-details/${row.id}`)}
                            className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-all"
                            title="Open detail to add shipping info"
                        >
                            <Truck size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ]), [navigate]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">SELLER ORDER PIPELINE</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Manage only the orders that belong to your catalogue</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400 font-black uppercase tracking-widest">Loading seller orders...</div>
                ) : (
                    <AdminTable columns={columns} data={orders} />
                )}
            </div>
        </div>
    );
};

export default SellerOrders;
