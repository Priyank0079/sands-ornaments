import api from '../../../services/api';

export const sellerOrderService = {
    // Get all orders for the current seller
    getSellerOrders: async () => {
        try {
            const res = await api.get('seller/orders');
            return res.data.orders || [];
        } catch (err) {
            console.error("Failed to fetch seller orders:", err);
            return [];
        }
    },

    // Get order details by ID
    getOrderDetails: async (id) => {
        try {
            const res = await api.get(`/seller/orders/${id}`);
            return res.data.order;
        } catch (err) {
            console.error("Failed to fetch order details:", err);
            throw err;
        }
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        try {
            const res = await api.patch(`/seller/orders/${orderId}/status`, { status });
            return res.data;
        } catch (err) {
            console.error("Failed to update order status:", err);
            return { success: false, message: err.response?.data?.message || "Update failed" };
        }
    },

    // Get all return requests for the seller
    getReturns: async () => {
        try {
            const res = await api.get('seller/returns');
            return res.data.returns || [];
        } catch (err) {
            console.error("Failed to fetch return requests:", err);
            return [];
        }
    },

    // Get return details by ID
    getReturnDetails: async (id) => {
        try {
            const res = await api.get(`/seller/returns/${id}`);
            return res.data.returnRequest;
        } catch (err) {
            console.error("Failed to fetch return details:", err);
            throw err;
        }
    },

    // Handle return approval/rejection
    processReturn: async (returnId, status) => {
        try {
            const res = await api.patch(`/seller/returns/${returnId}/status`, { status });
            return res.data;
        } catch (err) {
            console.error("Failed to process return:", err);
            return { success: false, message: err.response?.data?.message || "Process failed" };
        }
    },

    // Notification System (Uses general user notifications)
    getNotifications: async () => {
        try {
            const res = await api.get('user/notifications'); // Assuming shared notifications
            return res.data.notifications || [];
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            return [];
        }
    },

    markNotificationsRead: async () => {
        try {
            await api.patch('/user/notifications/read-all');
            return true;
        } catch (err) {
            console.error("Failed to mark notifications as read:", err);
            return false;
        }
    }
};
