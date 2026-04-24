import React, { useState } from 'react';
import { Send, Users, Bell } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const AddNotification = () => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        audience: 'Send to All Users',
        type: 'GENERAL',
        priority: 'Medium',
        link: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const response = await adminService.broadcastAdminNotification({
            title: formData.title,
            message: formData.message,
            type: formData.type,
            priority: formData.priority,
            link: formData.link
        });
        setSubmitting(false);

        if (response?.success) {
            toast.success(response.message || 'Notification blast sent successfully!');
            setFormData({
                title: '',
                message: '',
                audience: 'Send to All Users',
                type: 'GENERAL',
                priority: 'Medium',
                link: ''
            });
            return;
        }

        toast.error(response?.message || 'Failed to send notification');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            <div className="max-w-[700px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
                <PageHeader
                    title="Send Notification"
                    subtitle="Create and send alerts to your users"
                />

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-black text-black flex items-center gap-2 uppercase tracking-wide">
                            <Send className="w-4 h-4" />
                            Compose Message
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Title Field */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Flash Sale"
                                className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-300 placeholder:font-medium"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        {/* Message Field */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Message</label>
                            <textarea
                                placeholder="Type your message here..."
                                className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-sm font-medium text-gray-900 h-24 resize-none focus:outline-none focus:border-black transition-all placeholder:text-gray-300 leading-relaxed"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>

                        {/* Audience Field */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Audience</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
                                    value={formData.audience}
                                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                >
                                    <option>Send to All Users</option>
                                    <option>Active Customers</option>
                                    <option>Recent Registrations</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Type</label>
                                <select
                                    className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-black transition-all"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="GENERAL">General</option>
                                    <option value="ORDER">Order</option>
                                    <option value="RETURN">Return</option>
                                    <option value="REPLACEMENT">Replacement</option>
                                    <option value="COUPON">Coupon</option>
                                    <option value="SELLER_REQUEST">Seller Request</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Priority</label>
                                <select
                                    className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-black transition-all"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Link (Optional)</label>
                            <input
                                type="text"
                                placeholder="/shop or /admin/seller-details/..."
                                className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-300"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            />
                        </div>

                        {/* Preview Box - Optional Visual Aid */}
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                                <Bell className="w-4 h-4 text-white" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-900">
                                    {formData.title || "Notification Title"}
                                </p>
                                <p className="text-[11px] text-gray-500 leading-snug">
                                    {formData.message || "Message preview will appear here..."}
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full text-white py-3.5 rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 active:scale-[0.99]'}`}
                        >
                            <Send className="w-3.5 h-3.5" />
                            {submitting ? 'Sending...' : 'Send Notification'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddNotification;
