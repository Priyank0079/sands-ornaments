import api from '../../../services/api';

const normalizeProduct = (product) => {
  if (!product) return null;
  const variants = product.variants || [];
  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  const totalSold = variants.reduce((sum, v) => sum + (Number(v.sold) || 0), 0);
  const firstCategory = Array.isArray(product.categories) ? product.categories[0] : null;

  return {
    id: product._id,
    name: product.name,
    image: product.images?.[0] || '',
    category: firstCategory?.name || 'Uncategorized',
    categoryId: firstCategory?._id || firstCategory || '',
    metalType: product.material || product.metal || product.metalType || '',
    quantity: totalStock,
    availableStock: totalStock,
    soldItems: totalSold,
    barcodes: product.barcodes || [],
    raw: product
  };
};

export const sellerProductService = {
  getSellerProducts: async () => {
    try {
      const res = await api.get('seller/products');
      const products = res.data?.data?.products || res.data?.products || [];
      return products.map(normalizeProduct).filter(Boolean);
    } catch (err) {
      console.error("Failed to fetch seller products:", err);
      return [];
    }
  },
  getSellerProductsRaw: async () => {
    try {
      const res = await api.get('seller/products');
      return res.data?.data?.products || res.data?.products || [];
    } catch (err) {
      console.error("Failed to fetch seller products:", err);
      return [];
    }
  },
  getSellerProductById: async (id) => {
    try {
      const res = await api.get(`seller/products/${id}`);
      const product = res.data?.data?.product || res.data?.product;
      return normalizeProduct(product);
    } catch (err) {
      console.error("Failed to fetch seller product:", err);
      return null;
    }
  },
  getSellerProductRaw: async (id) => {
    try {
      const res = await api.get(`seller/products/${id}`);
      return res.data?.data?.product || res.data?.product;
    } catch (err) {
      console.error("Failed to fetch seller product:", err);
      return null;
    }
  },
  addProduct: async (data) => {
    try {
      const isFormData = data instanceof FormData;
      const res = await api.post('/seller/products', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return res.data?.data?.product || res.data?.product;
    } catch (err) {
      console.error("Failed to add product:", err);
      throw err;
    }
  },
  updateProduct: async (id, data) => {
    try {
      const isFormData = data instanceof FormData;
      const res = await api.put(`/seller/products/${id}`, data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return res.data;
    } catch (err) {
      console.error("Failed to update product:", err);
      throw err;
    }
  },
  deleteProduct: async (id) => {
    try {
      const res = await api.delete(`/seller/products/${id}`);
      return res.data?.success ?? true;
    } catch (err) {
      console.error("Failed to delete product:", err);
      return false;
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
        message: err.response?.data?.message || 'Serial code not found or already sold' 
      };
    }
  },
  scanProduct: async (productCode) => {
    try {
      // Assuming endpoint POST /api/seller/products/scan exists or as requested
      const res = await api.post('/seller/products/scan', { productCode });
      return res.data?.data || res.data;
    } catch (err) {
      console.error("Failed to scan product:", err);
      return { 
        success: false, 
        message: err.response?.data?.message || "Product not found or system error" 
      };
    }
  }
};
