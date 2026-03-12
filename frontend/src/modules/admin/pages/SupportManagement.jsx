import React, { useState } from 'react';
import { Eye, Trash2, Mail, Calendar, Inbox, AlertCircle, ShoppingBag, FileText, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import AdminStatsCard from '../components/AdminStatsCard';

const SupportManagement = () => {
    // Mock Data mimicking the "Create Support Ticket" form
    const [tickets, setTickets] = useState([
        {
            id: 'TKT-2024-001',
            subject: 'Refund not received for returned item',
            category: 'Payment & Refunds',
            orderId: '1735123456',
            message: 'I returned the "Polki Ruby Necklace" 5 days ago, and the app says return delivered, but I have not received the refund in my account yet.',
            userName: 'Priya Sharma',
            userEmail: 'priya.s@example.com',
            status: 'Unread',
            date: '2024-10-26T10:30:00',
        },
        {
            id: 'TKT-2024-002',
            subject: 'Wrong size delivered',
            category: 'Order Issues',
            orderId: '1735987654',
            message: 'I ordered size 2.4 bangles but received 2.6. Please arrange for an exchange.',
            userName: 'Rahul Verma',
            userEmail: 'rahul.v@example.com',
            status: 'Unread',
            date: '2024-10-25T15:45:00',
        },
        {
            id: 'TKT-2024-003',
            subject: 'General enquiry about bridal sets',
            category: 'General Enquiry',
            orderId: '',
            message: 'Do you provide customization for bridal sets? I want a specific color combination.',
            userName: 'Sneha Patel',
            userEmail: 'sneha.p@example.com',
            status: 'Read',
            date: '2024-10-24T11:20:00',
        },
        {
            id: 'TKT-2024-004',
            subject: 'Payment failed but money deducted',
            category: 'Payment Issue',
            orderId: '1735112233',
            message: 'My UPI transaction failed on the checkout page, but the amount was debited from my bank.',
            userName: 'Amit Kumar',
            userEmail: 'amit.k@example.com',
            status: 'Unread',
            date: '2024-10-23T18:10:00',
        },
        {
            id: 'TKT-2024-005',
            subject: 'Change delivery address',
            category: 'Shipping',
            orderId: '1735445566',
            message: 'I accidentally put my old address. Please update it to the new one before shipping.',
            userName: 'Kavita Singh',
            userEmail: 'kavita.s@example.com',
            status: 'Read',
            date: '2024-10-22T09:00:00',
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTicket, setSelectedTicket] = useState(null);

    const handleDelete = (id) => {
        if (window.confirm('Delete this ticket?')) {
            setTickets(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalTickets = tickets.length;
    const unreadTickets = tickets.filter(t => t.status === 'Unread').length;
    const readTickets = tickets.filter(t => t.status === 'Read').length;

    const columns = [
        {
            header: 'Date',
            render: (item) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900">{new Date(item.date).toLocaleDateString()}</span>
                    <span className="text-[10px] text-gray-500">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            header: 'User',
            render: (item) => (
                <div>
                    <p className="text-xs font-bold text-gray-900">{item.userName}</p>
                </div>
            )
        },
        {
            header: 'Subject',
            render: (item) => (
                <div>
                    <p className="text-sm font-bold text-black line-clamp-1">{item.subject}</p>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{item.category}</span>
                </div>
            )
        },
        {
            header: 'Status',
            align: 'center',
            render: (item) => (
                <select
                    value={item.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={`text-[10px] font-bold uppercase tracking-wider bg-transparent border-none focus:ring-0 cursor-pointer ${item.status === 'Unread' ? 'text-red-600' : 'text-green-600'
                        }`}
                >
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                </select>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setSelectedTicket(item)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#3E2723] hover:bg-[#3E2723]/5 rounded-lg transition-all"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Ticket"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filters = [
        {
            options: [
                { label: 'All', value: 'All' },
                { label: 'Unread', value: 'Unread' },
                { label: 'Read', value: 'Read' }
            ],
            onChange: (val) => setStatusFilter(val)
        }
    ];

    return (
        <div className="max-w-[1400px] mx-auto w-full flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] animate-in fade-in duration-500 pb-10">
            <PageHeader
                title="Support Tickets"
                subtitle="Track and resolve customer support requests"
            />

            {/* 3 Stats Cards: All, Unread, Read */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-8 shrink-0">
                <AdminStatsCard
                    label="Total Tickets"
                    value={totalTickets}
                    icon={Inbox}
                    color="text-gray-600"
                    bgColor="bg-gray-50"
                />
                <AdminStatsCard
                    label="Unread"
                    value={unreadTickets}
                    icon={AlertCircle}
                    color="text-red-500"
                    bgColor="bg-red-50"
                />
                <AdminStatsCard
                    label="Read"
                    value={readTickets}
                    icon={CheckCircle2}
                    color="text-green-500"
                    bgColor="bg-green-50"
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredTickets}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search tickets..."
                filters={filters}
            />

            {/* Ticket Details Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
                        {/* Header */}
                        <div className="bg-[#3E2723] px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Ticket Details</h3>
                                    <p className="text-[#D7CCC8] text-xs font-medium">{selectedTicket.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                            {/* Subject & Status */}
                            <div className="flex items-start justify-between gap-4 pb-6 border-b border-gray-100">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedTicket.subject}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{selectedTicket.category}</span>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${selectedTicket.status === 'Unread' ? 'text-red-700 bg-red-50 border-red-100' :
                                    'text-green-700 bg-green-50 border-green-100'
                                    }`}>
                                    {selectedTicket.status}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="space-y-4">
                                {/* Row 1: User & Order */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* User */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Submitted By</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#3E2723] flex items-center justify-center text-white text-sm font-bold">
                                                {selectedTicket.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{selectedTicket.userName}</p>
                                                <p className="text-xs text-gray-500 font-medium">{selectedTicket.userEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order ID */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Order Information</label>
                                        <div className="flex items-center gap-2 h-10">
                                            {selectedTicket.orderId ? (
                                                <>
                                                    <ShoppingBag className="w-5 h-5 text-[#3E2723]" />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">Order #{selectedTicket.orderId}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic font-medium">Not linked to a specific order</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Message Body */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Detailed Message</label>
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm text-gray-800 font-medium leading-relaxed">
                                        {selectedTicket.message}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline/Meta */}
                            <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Submitted on: {new Date(selectedTicket.date).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all w-full md:w-auto"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportManagement;
