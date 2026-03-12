import React, { useState, useMemo } from 'react';
import {
    Plus,
    Ticket,
    Calendar,
    Users,
    Activity,
    Clock,
    Percent,
    Edit2,
    Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import Pagination from '../components/Pagination';
import DataTable from '../components/common/DataTable';
import AdminStatsCard from '../components/AdminStatsCard';

const CouponListPage = () => {
    const navigate = useNavigate();
    const { coupons, deleteCoupon } = useShop();

    // No local state for coupons, reading from Context directly


    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredCoupons = useMemo(() => {
        return (coupons || [])
            .filter(c => {
                const desc = c.description || c.desc || '';
                return (
                    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    desc.toLowerCase().includes(searchTerm.toLowerCase())
                );
            })
            .sort((a, b) => b.id?.localeCompare(a.id) || 0);
    }, [coupons, searchTerm]);

    const paginatedCoupons = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCoupons.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCoupons, currentPage]);

    const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            deleteCoupon(id);
        }
    };

    const getCouponStatus = (coupon) => {
        const now = new Date();
        if (!coupon.active) return { label: 'Inactive', color: 'bg-gray-100 text-gray-400 border-gray-200' };
        if (coupon.validUntil && new Date(coupon.validUntil) < now) return { label: 'Expired', color: 'bg-red-50 text-red-600 border-red-100' };
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return { label: 'Limit Reached', color: 'bg-amber-50 text-amber-600 border-amber-100' };
        return { label: 'Active', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    };

    const columns = [
        {
            key: 'code',
            header: 'Coupon Code',
            render: (coupon) => (
                <div className="flex items-center gap-4 normal-case">
                    <div className="w-10 h-10 bg-[#3E2723]/5 text-[#3E2723] rounded-full flex items-center justify-center border border-[#3E2723]/10 shrink-0">
                        <Ticket size={18} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm tracking-wide uppercase">{coupon.code}</p>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate normal-case">{coupon.desc || coupon.description}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'discount',
            header: 'Discount Value',
            render: (coupon) => {
                const amount = coupon.amount !== undefined ? coupon.amount : coupon.value;
                const minOrder = coupon.minOrder !== undefined ? coupon.minOrder : coupon.minOrderValue;
                return (
                    <div className="normal-case">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                            {coupon.type === 'percentage' ? (
                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-100">
                                    {amount}% OFF
                                </span>
                            ) : (
                                <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                                    ₹{amount} OFF
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Min Order: <span className="text-gray-900">₹{minOrder}</span></p>
                    </div>
                );
            }
        },
        {
            key: 'validity',
            header: 'Validity Period',
            render: (coupon) => (
                <div className="space-y-1 normal-case">
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        Ends {new Date(coupon.validUntil).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Starts {new Date(coupon.validFrom).toLocaleDateString()}
                    </p>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (coupon) => {
                const status = getCouponStatus(coupon);
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${status.color}`}>
                        {status.label}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            render: (coupon) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/admin/coupons/edit/${coupon.id}`)}
                        className="p-2 text-gray-500 hover:text-[#3E2723] hover:bg-[#3E2723]/5 rounded-lg transition-all"
                        title="Edit Coupon"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Coupon"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 text-left pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Marketing</h1>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Manage discount codes</p>
                </div>
                <button
                    onClick={() => navigate('/admin/coupons/add')}
                    className="bg-[#3E2723] text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#5D4037] transition-all shadow-lg shadow-[#3E2723]/20"
                >
                    <Plus size={16} strokeWidth={3} /> Create Coupon
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <AdminStatsCard
                    label="Total Coupons"
                    value={(coupons || []).length}
                    icon={Ticket}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="Active Campaigns"
                    value={(coupons || []).filter(c => c.active).length}
                    icon={Activity}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <AdminStatsCard
                    label="Expiring Soon"
                    value={(coupons || []).filter(c => {
                        if (!c.validUntil) return false;
                        const daysLeft = (new Date(c.validUntil) - new Date()) / (1000 * 60 * 60 * 24);
                        return daysLeft > 0 && daysLeft < 7;
                    }).length}
                    icon={Clock}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
            </div>

            <DataTable
                columns={columns}
                data={paginatedCoupons}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search by code or description..."
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                totalItems={filteredCoupons.length}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
};

export default CouponListPage;
