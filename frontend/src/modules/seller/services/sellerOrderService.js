import api from '../../../services/api';

const getPrimarySellerItem = (order) => {
    const sellerItems = Array.isArray(order?.sellerItems) ? order.sellerItems : [];
    return sellerItems[0] || null;
};

const getPrimaryItemImage = (item) =>
    item?.image ||
    item?.productId?.images?.[0] ||
    item?.productId?.image ||
    '';

const mapSellerOrder = (order) => {
    const primaryItem = getPrimarySellerItem(order);
    return {
        ...order,
        id: order._id,
        orderStatus: order.status,
        orderDate: order.createdAt,
        totalAmount: Number(order.total || 0),
        sellerSubtotal: Number(order.sellerSubtotal || 0),
        quantity: (order.sellerItems || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        product: primaryItem?.name || primaryItem?.productId?.name || 'Seller Order',
        productImage: getPrimaryItemImage(primaryItem),
        primaryItem,
    };
};

export const sellerOrderService = {
    getSellerOrders: async () => {
        const res = await api.get('seller/orders');
        const orders = res.data?.data?.orders || [];
        return orders.map(mapSellerOrder);
    },

    getOrderDetails: async (id) => {
        const res = await api.get(`seller/orders/${id}`);
        const order = res.data?.data?.order;
        return order ? mapSellerOrder(order) : null;
    },

    updateOrderStatus: async (orderId, status, note = '') => {
        try {
            const res = await api.patch(`seller/orders/${orderId}/status`, { status, note });
            const order = res.data?.data?.order;
            return {
                success: true,
                message: res.data?.message || 'Order updated',
                order: order ? mapSellerOrder(order) : null,
            };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Update failed',
            };
        }
    },

    getReturns: async () => {
        try {
            const res = await api.get('seller/returns');
            return res.data?.data?.returns || res.data?.returns || [];
        } catch (err) {
            console.error('Failed to fetch return requests:', err);
            return [];
        }
    },

    getReturnDetails: async (id) => {
        const res = await api.get(`seller/returns/${id}`);
        return res.data?.data?.returnRequest || res.data?.returnRequest;
    },

    processReturn: async (returnId, status) => {
        try {
            const res = await api.patch(`seller/returns/${returnId}/status`, { status });
            return {
                success: true,
                message: res.data?.message || 'Return updated',
                data: res.data?.data || null,
            };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Process failed',
            };
        }
    },

    getNotifications: async () => {
        try {
            const res = await api.get('user/notifications');
            return res.data?.data?.notifications || res.data?.notifications || [];
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            return [];
        }
    },

    markNotificationsRead: async () => {
        try {
            await api.patch('user/notifications/read-all');
            return true;
        } catch (err) {
            console.error('Failed to mark notifications as read:', err);
            return false;
        }
    }
};
