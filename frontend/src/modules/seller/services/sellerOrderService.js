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

const normalizeReturn = (returnReq) => {
    if (!returnReq) return null;
    const primaryItem = Array.isArray(returnReq.items) ? returnReq.items[0] : null;
    return {
        ...returnReq,
        id: returnReq._id,
        returnDisplayId: returnReq.returnId || returnReq._id,
        orderDisplayId: returnReq.orderId?.orderId || returnReq.orderId || 'N/A',
        product: primaryItem?.name || 'Returned item',
        barcode: primaryItem?.sku || 'N/A',
        quantity: Number(primaryItem?.qty || 0),
        returnReason: returnReq.evidence?.reason || primaryItem?.reason || 'Not specified',
        comment: returnReq.evidence?.comment || '',
        createdAt: returnReq.createdAt || returnReq.requestDate,
        images: returnReq.evidence?.images || [],
        video360: returnReq.evidence?.video || '',
        customerName: returnReq.userId?.name || returnReq.customerName || 'Customer',
        customerEmail: returnReq.userId?.email || '',
        customerPhone: returnReq.userId?.phone || '',
        item: primaryItem,
        user: returnReq.userId,
        order: returnReq.orderId,
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

    updateOrderStatus: async (orderId, status, note = '', shippingInfo = null) => {
        try {
            const res = await api.patch(`seller/orders/${orderId}/status`, { status, note, shippingInfo });
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
            const returns = res.data?.data?.returns || res.data?.returns || [];
            return returns.map(normalizeReturn).filter(Boolean);
        } catch (err) {
            console.error('Failed to fetch return requests:', err);
            return [];
        }
    },

    getReturnDetails: async (id) => {
        const res = await api.get(`seller/returns/${id}`);
        return normalizeReturn(res.data?.data?.returnReq || res.data?.returnReq);
    },

    processReturn: async (returnId, status, remarks = '') => {
        try {
            const res = await api.patch(`seller/returns/${returnId}/process`, { status, remarks });
            return {
                success: true,
                message: res.data?.message || 'Return updated',
                data: normalizeReturn(res.data?.data?.returnReq || res.data?.returnReq),
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
