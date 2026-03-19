import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import AdminTable from '../../admin/components/AdminTable';
import { sellerCustomerService } from '../services/sellerCustomerService';

const SellerCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let active = true;
        const loadCustomers = async () => {
            const data = await sellerCustomerService.getCustomers();
            if (active) setCustomers(data || []);
        };
        loadCustomers();
        return () => { active = false; };
    }, []);

    const columns = [
        {
            header: 'CUSTOMER NAME',
            className: 'w-full',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 font-bold text-[#3E2723] text-[10px]">
                        {row.name?.charAt(0) || 'C'}
                    </div>
                    <span className="text-[11px] font-black text-gray-900 uppercase">{row.name || 'Customer'}</span>
                </div>
            )
        }
    ];

    const filteredCustomers = customers.filter(c =>
        (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Customer Directory</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Customer names only</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3E2723] transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH NAME OR ADDRESS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#3E2723] transition-all w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <AdminTable columns={columns} data={filteredCustomers} emptyMessage="No customers found" />
            </div>
        </div>
    );
};

export default SellerCustomers;
