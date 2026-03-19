import api from '../../../services/api';

const normalizeCustomer = (customer) => {
    if (!customer) return null;
    return {
        id: customer.id || customer._id,
        name: customer.name || 'Customer'
    };
};

export const sellerCustomerService = {
    getCustomers: async () => {
        try {
            const res = await api.get('seller/customers');
            const customers = res.data?.data?.customers || res.data?.customers || [];
            return customers.map(normalizeCustomer).filter(Boolean);
        } catch (err) {
            console.error("Failed to fetch seller customers:", err);
            return [];
        }
    },

    getCustomerDetails: async (id) => {
        try {
            const res = await api.get(`seller/customers/${id}`);
            const payload = res.data?.data || res.data || {};
            const customer = payload.customer || null;
            const orders = payload.orders || [];
            return { customer, orders };
        } catch (err) {
            console.error("Failed to fetch seller customer details:", err);
            return { customer: null, orders: [] };
        }
    },

    updateCustomerStatus: async () => {
        return { success: false, message: "Not available for sellers" };
    }
};
