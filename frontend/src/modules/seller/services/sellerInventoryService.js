import api from '../../../services/api';

export const sellerInventoryService = {
  getInventory: async (params = {}) => {
    try {
      const res = await api.get('seller/inventory', { params });
      return res.data.data?.inventory || res.data.inventory || [];
    } catch (err) {
      console.error("Seller fetch inventory failed:", err);
      return [];
    }
  },
  adjustStock: async (payload) => {
    try {
      const res = await api.post('seller/inventory/adjust', payload);
      return res.data;
    } catch (err) {
      console.error("Seller adjust stock failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to adjust stock" };
    }
  },
  getStockHistory: async (params = {}) => {
    try {
      const res = await api.get('seller/inventory/history', { params });
      return res.data.data?.logs || res.data.logs || [];
    } catch (err) {
      console.error("Seller fetch stock history failed:", err);
      return [];
    }
  },
  getLowStockAlerts: async (params = {}) => {
    try {
      const res = await api.get('seller/inventory/alerts', { params });
      return res.data.data?.alerts || res.data.alerts || [];
    } catch (err) {
      console.error("Seller fetch low stock alerts failed:", err);
      return [];
    }
  }
};
