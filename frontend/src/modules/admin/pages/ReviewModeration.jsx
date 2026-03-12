import React, { useState } from 'react';
import {
    Star, Search, CheckCircle2,
    XCircle, Trash2, Eye, EyeOff,
    MessageSquare, User, Package, Calendar,
    ChevronRight, MoreHorizontal, Clock
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AdminStatsCard from '../components/AdminStatsCard';

const ReviewModeration = () => {
    // Mock Reviews Data
    const [reviews, setReviews] = useState([
        {
            id: 'REV-101',
            userName: 'Aditi Singh',
            productName: 'Classic Solitaire Ring',
            rating: 5,
            comment: 'Absolutely stunning! The quality of the silver is top-notch and it looks even better than the pictures.',
            date: 'Dec 24, 2024',
            status: 'Pending',
            isVisible: true
        },
        {
            id: 'REV-102',
            userName: 'Rahul Verma',
            productName: '925 Silver Chain',
            rating: 2,
            comment: 'The chain is too thin for my liking. Product delivery was also late by 3 days.',
            date: 'Dec 20, 2024',
            status: 'Approved',
            isVisible: true
        },
        {
            id: 'REV-103',
            userName: 'Spam User',
            productName: 'Minimalist Bangle',
            rating: 1,
            comment: 'BUY CHEAP COINS AT WWW.SPAM-SITE.COM !!! FAST AND EASY !!!',
            date: 'Dec 18, 2024',
            status: 'Rejected',
            isVisible: false
        },
        {
            id: 'REV-104',
            userName: 'Sneha Kapoor',
            productName: 'Infinity Silver Bracelet',
            rating: 4,
            comment: 'Very elegant design. The clasp is a bit tight but manageable.',
            date: 'Dec 15, 2024',
            status: 'Approved',
            isVisible: true
        }
    ]);

    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusMove = (id, newStatus) => {
        setReviews(reviews.map(rev =>
            rev.id === id ? { ...rev, status: newStatus, isVisible: newStatus === 'Approved' } : rev
        ));
    };

    const toggleVisibility = (id) => {
        setReviews(reviews.map(rev =>
            rev.id === id ? { ...rev, isVisible: !rev.isVisible } : rev
        ));
    };

    const deleteReview = (id) => {
        if (window.confirm('Are you sure you want to permanently delete this review?')) {
            setReviews(reviews.filter(rev => rev.id !== id));
        }
    };

    const filteredReviews = reviews.filter(rev => {
        const matchesStatus = filterStatus === 'All' || rev.status === filterStatus;
        const matchesSearch = rev.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rev.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rev.comment.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusStyles = {
        'Approved': 'bg-green-50 text-green-700 border-green-100',
        'Rejected': 'bg-red-50 text-red-700 border-red-100',
        'Pending': 'bg-blue-50 text-blue-700 border-blue-100'
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-3 md:space-y-4 animate-in fade-in duration-500 pb-20 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 px-1">
                <PageHeader
                    title="Reviews"
                    subtitle="Manage product feedback"
                />
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatsCard
                    label="All Reviews"
                    value={reviews.length}
                    icon={MessageSquare}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="Pending"
                    value={reviews.filter(r => r.status === 'Pending').length}
                    icon={Clock}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <AdminStatsCard
                    label="Approved"
                    value={reviews.filter(r => r.status === 'Approved').length}
                    icon={CheckCircle2}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
            </div>

            {/* Filters Row */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row flex-1 gap-3 w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 overflow-x-auto scrollbar-hide">
                        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all whitespace-nowrap ${filterStatus === status
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Review</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Customer</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs">Product</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs w-[40%]">Comment</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs text-center">Status</th>
                                <th className="px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 uppercase tracking-tighter text-[10px] md:text-[11px] text-gray-900">
                            {filteredReviews.map((rev) => (
                                <tr key={rev.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="space-y-1">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-2.5 h-2.5 md:w-3 md:h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[8px] md:text-[10px] font-bold text-gray-400">{rev.date}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#8D6E63] font-bold text-[10px] md:text-xs border border-[#EFEBE9] shrink-0">
                                                {rev.userName.charAt(0)}
                                            </div>
                                            <p className="font-bold text-gray-900 truncate">{rev.userName}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <p className="font-bold text-gray-600 truncate max-w-[120px]">{rev.productName}</p>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <p className="text-xs text-gray-600 font-bold leading-relaxed line-clamp-2 md:line-clamp-none lowercase">
                                            {rev.comment}
                                        </p>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold border ${statusStyles[rev.status]}`}>
                                                {rev.status}
                                            </span>
                                            <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-tight ${rev.isVisible ? 'text-green-600' : 'text-gray-400'}`}>
                                                {rev.isVisible ? 'Public' : 'Hidden'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center justify-end gap-1 md:gap-2">
                                            {rev.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusMove(rev.id, 'Approved')}
                                                        className="p-1.5 md:p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-sm"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusMove(rev.id, 'Rejected')}
                                                        className="p-1.5 md:p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {rev.status !== 'Pending' && (
                                                <button
                                                    onClick={() => toggleVisibility(rev.id)}
                                                    className={`p-1.5 md:p-2 rounded-lg transition-all active:scale-95 shadow-sm ${rev.isVisible
                                                        ? 'bg-gray-100 text-gray-500'
                                                        : 'bg-[#3E2723]/10 text-[#3E2723]'
                                                        }`}
                                                >
                                                    {rev.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteReview(rev.id)}
                                                className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReviewModeration;
