import React, { useEffect, useState } from 'react';
import { Search, Mail, ShoppingBag, IndianRupee, CalendarDays, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminTable from '../../admin/components/AdminTable';
import { sellerCustomerService } from '../services/sellerCustomerService';

const SellerCustomers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        let active = true;
        const loadCustomers = async () => {
            setLoading(true);
            const res = await sellerCustomerService.getCustomersPaged({
                page,
                limit: 10,
                ...(searchQuery ? { search: searchQuery } : {})
            });
            if (!active) return;
            setCustomers(res.customers || []);
            setPagination(res.pagination || null);
            setLoading(false);
        };
        const t = setTimeout(loadCustomers, 250);
        return () => { active = false; };
    }, [page, searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const columns = [
        {
            header: 'CUSTOMER NAME',
            className: 'w-[24%]',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 font-bold text-[#3E2723] text-[10px]">
                        {row.name?.charAt(0) || 'C'}
                    </div>
                    <span className="text-[11px] font-black text-gray-900 uppercase">{row.name || 'Customer'}</span>
                </div>
            )
        },
        {
            header: 'EMAIL',
            className: 'w-[24%]',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Mail size={12} className="text-gray-300" />
                    <span className="text-[11px] font-bold text-gray-700 normal-case break-all">
                        {row.email || 'Email not available'}
                    </span>
                </div>
            )
        },
        {
            header: 'ORDERS',
            className: 'w-[12%]',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <ShoppingBag size={12} className="text-blue-500" />
                    <span className="text-[11px] font-black text-gray-900">{row.totalOrders || 0}</span>
                </div>
            )
        },
        {
            header: 'SELLER REVENUE',
            className: 'w-[16%]',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <IndianRupee size={12} className="text-emerald-500" />
                    <span className="text-[11px] font-black text-gray-900">{Number(row.totalSpend || 0).toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'LAST ORDER',
            className: 'w-[14%]',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <CalendarDays size={12} className="text-gray-300" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {row.lastOrderDate ? new Date(row.lastOrderDate).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: 'ACTION',
            className: 'w-[10%] text-right',
            render: (row) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/seller/customer-details/${row.id}`);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#8D6E63] hover:text-[#3E2723]"
                >
                    View <ArrowRight size={12} />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Customer Directory</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Seller-scoped customer insights without phone or address</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3E2723] transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH NAME OR EMAIL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#3E2723] transition-all w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <AdminTable
                    columns={columns}
                    data={customers}
                    emptyMessage={loading ? "Loading customers..." : "No customers found"}
                    onRowClick={(row) => navigate(`/seller/customer-details/${row.id}`)}
                    pagination={pagination ? {
                        ...pagination,
                        onPageChange: (nextPage) => setPage(nextPage)
                    } : undefined}
                />
            </div>
        </div>
    );
};

export default SellerCustomers;
