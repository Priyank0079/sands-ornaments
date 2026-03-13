import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Search, Filter, MoreVertical, Eye, Ban, CheckCircle2 } from 'lucide-react';
import AdminTable from '../../admin/components/AdminTable';
import { sellerCustomerService } from '../services/sellerCustomerService';

const SellerCustomers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setCustomers(sellerCustomerService.getCustomers());
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        const res = await sellerCustomerService.updateCustomerStatus(id, newStatus);
        if (res.success) {
            setCustomers(customers.map(c => c.id === id ? { ...c, status: newStatus } : c));
        }
    };

    const columns = [
        {
            header: 'CUSTOMER NAME',
            className: 'w-[20%]',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 font-bold text-[#3E2723] text-[10px]">
                        {row.name.charAt(0)}
                    </div>
                    <span className="text-[11px] font-black text-gray-900 uppercase">{row.name}</span>
                </div>
            )
        },
        {
            header: 'CONTACT INFO',
            className: 'w-[20%]',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-700">{row.email}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{row.phone}</span>
                </div>
            )
        },
        {
            header: 'ORDER METRICS',
            className: 'w-[15%]',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-900">{row.totalOrders} ORDERS</span>
                    <span className="text-[10px] text-emerald-600 font-black mt-0.5">₹{row.totalSpend.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'LAST ACTIVITY',
            className: 'w-[15%]',
            render: (row) => <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(row.lastOrderDate).toLocaleDateString()}</span>
        },
        {
            header: 'STATUS',
            className: 'w-[15%]',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                    row.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
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
                        onClick={() => navigate(`/seller/customer-details/${row.id}`)}
                        className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-[#3E2723] transition-all"
                    >
                        <Eye size={16} />
                    </button>
                    <button 
                        onClick={() => toggleStatus(row.id, row.status)}
                        className={`p-1.5 rounded-lg transition-all ${
                            row.status === 'ACTIVE' ? 'hover:bg-red-50 text-gray-400 hover:text-red-500' : 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-500'
                        }`}
                    >
                        {row.status === 'ACTIVE' ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                    </button>
                </div>
            )
        }
    ];

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Customer Management</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Audit client relationships & acquisition metrics</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3E2723] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="SEARCH CLIENTS..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#3E2723] transition-all w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <AdminTable columns={columns} data={filteredCustomers} />
            </div>
        </div>
    );
};

export default SellerCustomers;
