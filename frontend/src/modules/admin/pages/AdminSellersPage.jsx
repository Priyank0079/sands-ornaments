import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Eye, CheckCircle, XCircle, FileText, ShieldCheck, Search, Users, UserCheck, UserPlus, UserX, Clock } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminStatsCard from '../components/AdminStatsCard';
import { sellerService } from '../../seller/services/sellerService';

const AdminSellersPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');

    const refreshSellers = () => {
        setSellers(sellerService.getAllSellers());
    };

    useEffect(() => {
        refreshSellers();
        const interval = setInterval(refreshSellers, 3000);
        window.addEventListener('storage', refreshSellers);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', refreshSellers);
        };
    }, []);

    const handleAction = async (id, status) => {
        const res = await sellerService.updateSellerStatus(id, status);
        if (res.success) {
            refreshSellers();
        }
    };

    const stats = {
        total: sellers.length,
        pending: sellers.filter(s => s.status === 'PENDING').length,
        approved: sellers.filter(s => s.status === 'APPROVED').length,
        rejected: sellers.filter(s => s.status === 'REJECTED').length,
    };

    const filteredSellers = sellers.filter(seller => {
        const matchesStatus = activeFilter === 'ALL' || seller.status === activeFilter;
        const matchesSearch = 
            seller.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.shopName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusFilters = [
        { label: 'All Sellers', value: 'ALL', count: stats.total, icon: Users },
        { label: 'Pending', value: 'PENDING', count: stats.pending, icon: Clock, color: 'text-amber-500' },
        { label: 'Approved', value: 'APPROVED', count: stats.approved, icon: UserCheck, color: 'text-emerald-500' },
        { label: 'Rejected', value: 'REJECTED', count: stats.rejected, icon: UserX, color: 'text-red-500' },
    ];

    const columns = [
        {
            header: 'SELLER NAME',
            className: 'w-[18%]',
            render: (row) => (
                <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">{row.fullName}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">{row.email}</span>
                </div>
            )
        },
        {
            header: 'SHOP NAME',
            accessor: 'shopName',
            className: 'w-[12%]'
        },
        {
            header: 'MOBILE',
            accessor: 'mobileNumber',
            className: 'w-[10%]'
        },
        {
            header: 'GST',
            accessor: 'gstNumber',
            className: 'w-[10%]'
        },
        {
            header: 'DOCS',
            className: 'w-[10%]',
            render: (row) => (
                <div className="flex gap-1.5 items-center">
                    <div title="AADHAR CARD" className={`w-7 h-7 rounded-lg flex items-center justify-center border ${row.aadhar ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-50 text-gray-300 border-gray-100'}`}>
                        <FileText size={14} />
                    </div>
                    <div title="SHOP LICENSE" className={`w-7 h-7 rounded-lg flex items-center justify-center border ${row.shopLicense ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-50 text-gray-300 border-gray-100'}`}>
                        <ShieldCheck size={14} />
                    </div>
                </div>
            )
        },
        {
            header: 'DATE',
            render: (row) => (
                <span className="text-[10px] font-bold text-gray-500 uppercase">
                    {new Date(row.registrationDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            ),
            className: 'w-[10%]'
        },
        {
            header: 'STATUS',
            className: 'w-[10%]',
            render: (row) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
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
                        onClick={() => navigate(`/admin/seller-details/${row.id}`)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#3E2723] transition-all"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                    {row.status === 'PENDING' && (
                        <>
                            <button 
                                onClick={() => handleAction(row.id, 'APPROVED')}
                                className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-all"
                                title="Approve"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button 
                                onClick={() => handleAction(row.id, 'REJECTED')}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all"
                                title="Reject"
                            >
                                <XCircle size={18} />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">SELLER MANAGEMENT</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">APPROVE PARTNERS & OVERSEE MARKETPLACE SCALE</p>
                </div>
                <div className="relative w-full md:w-72 group">
                    <input 
                        type="text"
                        placeholder="SEARCH SELLERS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#3E2723] focus:ring-4 focus:ring-[#3E2723]/5 transition-all outline-none"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3E2723] transition-colors" />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <AdminStatsCard label="TOTAL MERCHANTS" value={stats.total} icon={Store} color="text-gray-900" bgColor="bg-white border-gray-100" />
                <AdminStatsCard label="PENDING REVIEW" value={stats.pending} icon={Clock} color="text-amber-500" bgColor="bg-amber-50/50 border-amber-100" />
                <AdminStatsCard label="ACTIVE PARTNERS" value={stats.approved} icon={UserCheck} color="text-emerald-500" bgColor="bg-emerald-50/50 border-emerald-100" />
                <AdminStatsCard label="REJECTED" value={stats.rejected} icon={UserX} color="text-red-500" bgColor="bg-red-50/50 border-red-100" />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-1">
                {statusFilters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                            activeFilter === filter.value 
                            ? 'text-[#3E2723]' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <filter.icon className={`w-3.5 h-3.5 ${activeFilter === filter.value ? (filter.color || 'text-[#3E2723]') : 'text-gray-300'}`} />
                        {filter.label}
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[8px] border ${
                            activeFilter === filter.value 
                            ? 'bg-[#3E2723] text-white border-[#3E2723]' 
                            : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}>
                            {filter.count}
                        </span>
                        {activeFilter === filter.value && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3E2723] animate-in slide-in-from-left-full duration-300" />
                        )}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdminTable 
                    columns={columns} 
                    data={filteredSellers} 
                    emptyMessage={`No ${activeFilter.toLowerCase()} sellers found matching your search.`}
                />
            </div>
        </div>
    );
};

export default AdminSellersPage;
