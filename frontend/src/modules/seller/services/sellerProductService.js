import api from '../../../services/api';

export const sellerProductService = {
  getSellerProducts: async () => {
    try {
      const res = await api.get('seller/products');
      return res.data.products || [];
    } catch (err) {
      console.error("Failed to fetch seller products:", err);
      return [];
    }
  },
  addProduct: async (data) => {
    try {
      const isFormData = data instanceof FormData;
      const res = await api.post('/seller/products', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return res.data.product;
    } catch (err) {
      console.error("Failed to add product:", err);
      throw err;
    }
  },
  updateBarcodeStatus: async (productId, barcodeNumber, status) => {
    try {
      const res = await api.patch(`/seller/products/${productId}/barcodes/${barcodeNumber}`, { status });
      return res.data.success;
    } catch (err) {
      console.error("Failed to update barcode status:", err);
      return false;
    }
  },
  sellByBarcode: async (barcodeNumber, isOnline = false) => {
    try {
      if (isOnline) {
         return { success: false, message: 'Online sales handled by storefront' };
      }
      const res = await api.post('/seller/orders/offline', { barcodeNumber });
      return res.data;
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Barcode not found or already sold' 
      };
    }
  }
};
