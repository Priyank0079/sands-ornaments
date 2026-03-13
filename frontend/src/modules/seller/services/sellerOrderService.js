// Mock Service for Seller Order and Return Management
export const sellerOrderService = {
    // Get all orders for a specific seller
    getSellerOrders: () => {
        const orders = JSON.parse(localStorage.getItem('seller_orders') || '[]');
        return orders;
    },

    // Get order details by ID
    getOrderDetails: (id) => {
        const orders = JSON.parse(localStorage.getItem('seller_orders') || '[]');
        return orders.find(o => o.id === id);
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        let orders = JSON.parse(localStorage.getItem('seller_orders') || '[]');
        orders = orders.map(o => o.id === orderId ? { ...o, orderStatus: status } : o);
        localStorage.setItem('seller_orders', JSON.stringify(orders));
        
        // Add notification for status change
        const order = orders.find(o => o.id === orderId);
        if (order) {
            sellerOrderService.addNotification({
                id: Date.now(),
                title: 'Order Status Update',
                message: `Order #${orderId} status changed to ${status}`,
                date: new Date().toISOString(),
                unread: true,
                type: 'ORDER'
            });
        }
        
        return { success: true };
    },

    // Get all return requests
    getReturns: () => {
        const returns = JSON.parse(localStorage.getItem('seller_returns') || '[]');
        return returns;
    },

    // Get return details by ID
    getReturnDetails: (id) => {
        const returns = JSON.parse(localStorage.getItem('seller_returns') || '[]');
        return returns.find(r => r.id === id);
    },

    // Handle return approval/rejection
    processReturn: async (returnId, status) => {
        let returns = JSON.parse(localStorage.getItem('seller_returns') || '[]');
        let orders = JSON.parse(localStorage.getItem('seller_orders') || '[]');
        
        const returnReq = returns.find(r => r.id === returnId);
        if (!returnReq) return { success: false, message: 'Return request not found' };

        returns = returns.map(r => r.id === returnId ? { ...r, status } : r);
        localStorage.setItem('seller_returns', JSON.stringify(returns));

        // Update corresponding order status
        orders = orders.map(o => o.id === returnReq.orderId ? { ...o, orderStatus: status === 'APPROVED' ? 'RETURN APPROVED' : 'RETURN REJECTED' } : o);
        localStorage.setItem('seller_orders', JSON.stringify(orders));

        // If approved, update inventory (Simulation)
        if (status === 'APPROVED') {
            const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
            const updatedProducts = products.map(p => {
                if (p.id === returnReq.productId) {
                    const availableStock = parseInt(p.availableStock) + parseInt(returnReq.quantity);
                    const soldItems = parseInt(p.soldItems) - parseInt(returnReq.quantity);
                    
                    // Mark barcode as available again (simply the first sold one for simulation)
                    const barcodes = (p.barcodes || []).map(b => {
                        if (b.status.startsWith('SOLD') && b.number === returnReq.barcode) {
                            return { ...b, status: 'AVAILABLE' };
                        }
                        return b;
                    });

                    return { ...p, availableStock: availableStock.toString(), soldItems: soldItems.toString(), barcodes };
                }
                return p;
            });
            localStorage.setItem('seller_products', JSON.stringify(updatedProducts));
        }

        return { success: true };
    },

    // Notification System
    getNotifications: () => {
        return JSON.parse(localStorage.getItem('seller_notifications') || '[]');
    },

    addNotification: (notification) => {
        const notifications = JSON.parse(localStorage.getItem('seller_notifications') || '[]');
        notifications.unshift(notification);
        localStorage.setItem('seller_notifications', JSON.stringify(notifications));
    },

    markNotificationsRead: () => {
        let notifications = JSON.parse(localStorage.getItem('seller_notifications') || '[]');
        notifications = notifications.map(n => ({ ...n, unread: false }));
        localStorage.setItem('seller_notifications', JSON.stringify(notifications));
    },

    getAnalytics: () => {
        return {
            dailyOrders: [
                { date: '01 Mar', orders: 12 }, { date: '02 Mar', orders: 19 }, { date: '03 Mar', orders: 15 },
                { date: '04 Mar', orders: 8 }, { date: '05 Mar', orders: 22 }, { date: '06 Mar', orders: 30 },
                { date: '07 Mar', orders: 25 }, { date: '08 Mar', orders: 18 }, { date: '09 Mar', orders: 14 },
                { date: '10 Mar', orders: 28 }, { date: '11 Mar', orders: 35 }, { date: '12 Mar', orders: 42 }
            ],
            weeklyRevenue: [
                { week: 'W1', revenue: 125000 }, { week: 'W2', revenue: 185000 },
                { week: 'W3', revenue: 210000 }, { week: 'W4', revenue: 195000 }
            ],
            categoryPerformance: [
                { name: 'Necklaces', value: 45, color: '#3E2723' },
                { name: 'Rings', value: 25, color: '#8D6E63' },
                { name: 'Earrings', value: 20, color: '#D39A9F' },
                { name: 'Others', value: 10, color: '#EFEBE9' }
            ],
            todayStats: {
                orders: 24,
                revenue: 85200
            },
            monthlyStats: {
                revenue: 1245000,
                growth: 12.5
            }
        };
    }
};

// Seed initial data for demo if empty
if (!localStorage.getItem('seller_orders')) {
    const initialOrders = [
        {
            id: 'ORD-1023',
            customerName: 'Rahul Kumar',
            customerPhone: '9876543210',
            customerEmail: 'rahul@example.com',
            customerAddress: '123, Street Name, City, State, 110001',
            product: '22K Gold Wedding Ring',
            productId: 'prev-p1',
            barcode: 'RING001',
            quantity: 1,
            price: 25000,
            paymentStatus: 'PAID',
            paymentMethod: 'Credit Card',
            orderStatus: 'PENDING',
            orderDate: new Date().toISOString(),
            shippingCarrier: 'BlueDart',
            trackingId: 'BD123456789'
        },
        {
            id: 'ORD-1024',
            customerName: 'Priya Singh',
            customerPhone: '9876543211',
            customerEmail: 'priya@example.com',
            customerAddress: '456, Road Name, City, State, 110002',
            product: 'Silver Anklets',
            productId: 'prev-p2',
            barcode: 'SILV001',
            quantity: 2,
            price: 5000,
            paymentStatus: 'PAID',
            paymentMethod: 'UPI',
            orderStatus: 'ACCEPTED',
            orderDate: new Date(Date.now() - 86400000).toISOString(),
            shippingCarrier: 'Delhivery',
            trackingId: 'DLV987654321'
        }
    ];
    localStorage.setItem('seller_orders', JSON.stringify(initialOrders));
}

if (!localStorage.getItem('seller_returns')) {
    const initialReturns = [
        {
            id: 'RET-001',
            orderId: 'ORD-1022',
            customerName: 'Amit Shah',
            product: 'Gold Necklace',
            productId: 'prev-p3',
            barcode: 'NECK001',
            quantity: 1,
            returnReason: 'Quality not as expected. The polish seems dull in person.',
            status: 'RETURN REQUESTED',
            date: new Date().toISOString(),
            video360: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            images: [
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2046&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1887&auto=format&fit=crop'
            ]
        }
    ];
    localStorage.setItem('seller_returns', JSON.stringify(initialReturns));
}
