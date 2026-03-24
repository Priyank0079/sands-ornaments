import api from '../../../services/api';

const isFormData = (payload) =>
  typeof FormData !== 'undefined' && payload instanceof FormData;

export const adminService = {
  // Product Orchestration
  getProducts: async (params = {}) => {
    try {
      const res = await api.get('admin/products', { params });
      return {
        products: res.data.data?.products || res.data.products || [],
        pagination: res.data.data?.pagination || res.data.pagination
      };
    } catch (err) {
      console.error("Admin fetch products failed:", err);
      return { products: [], pagination: null };
    }
  },
  deleteProduct: async (id) => {
    try {
      const res = await api.delete(`admin/products/${id}`);
      return res.data.success;
    } catch (err) {
      console.error("Admin delete product failed:", err);
      return false;
    }
  },
  bulkUpdatePrices: async (config) => {
    try {
      const res = await api.patch('admin/products/bulk/prices', config);
      return res.data.success;
    } catch (err) {
      console.error("Admin bulk price update failed:", err);
      return false;
    }
  },
  getProductById: async (id) => {
    try {
      const res = await api.get(`admin/products/${id}`);
      return res.data.data?.product || res.data.product;
    } catch (err) {
      console.error("Admin fetch product details failed:", err);
      throw err;
    }
  },
  createProduct: async (data) => {
    try {
      const config = isFormData(data)
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;
      const res = await api.post('admin/products', data, config);
      return res.data;
    } catch (err) {
      console.error("Admin create product failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to create product" };
    }
  },
  updateProduct: async (id, data) => {
    try {
      const config = isFormData(data)
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;
      const res = await api.put(`admin/products/${id}`, data, config);
      return res.data;
    } catch (err) {
      console.error("Admin update product failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to update product" };
    }
  },
  toggleProductStatus: async (id) => {
    try {
      const res = await api.patch(`admin/products/${id}/toggle-status`);
      return res.data.success;
    } catch (err) {
      console.error("Admin toggle product status failed:", err);
      return false;
    }
  },

  // Category Management
  getCategories: async () => {
    try {
      const res = await api.get('admin/categories');
      return res.data.data.categories || [];
    } catch (err) {
      console.error("Admin fetch categories failed:", err);
      return [];
    }
  },
  getCategoryById: async (id) => {
    try {
      const res = await api.get(`admin/categories/${id}`);
      return res.data.data.category;
    } catch (err) {
      console.error("Admin fetch category details failed:", err);
      throw err;
    }
  },
  createCategory: async (data) => {
    try {
      const config = isFormData(data)
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;
      const res = await api.post('admin/categories', data, config);
      return res.data;
    } catch (err) {
      console.error("Admin create category failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to create category" };
    }
  },
  updateCategory: async (id, data) => {
    try {
      const config = isFormData(data)
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;
      const res = await api.put(`admin/categories/${id}`, data, config);
      return res.data;
    } catch (err) {
      console.error("Admin update category failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to update category" };
    }
  },
  deleteCategory: async (id) => {
    try {
      const res = await api.delete(`admin/categories/${id}`);
      return res.data.success;
    } catch (err) {
      console.error("Admin delete category failed:", err);
      return false;
    }
  },


  // Coupon Management
  getCoupons: async () => {
    try {
      const res = await api.get('admin/coupons');
      return res.data.data.coupons || [];
    } catch (err) {
      console.error("Admin fetch coupons failed:", err);
      return [];
    }
  },
  getCouponById: async (id) => {
    try {
      const res = await api.get(`admin/coupons/${id}`);
      return res.data.data?.coupon || res.data.coupon;
    } catch (err) {
      console.error("Admin fetch coupon failed:", err);
      throw err;
    }
  },
  createCoupon: async (data) => {
    try {
      const res = await api.post('admin/coupons', data);
      return res.data;
    } catch (err) {
      console.error("Admin create coupon failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to create coupon" };
    }
  },
  updateCoupon: async (id, data) => {
    try {
      const res = await api.put(`admin/coupons/${id}`, data);
      return res.data;
    } catch (err) {
      console.error("Admin update coupon failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to update coupon" };
    }
  },
  deleteCoupon: async (id) => {
    try {
      const res = await api.delete(`admin/coupons/${id}`);
      return res.data.success;
    } catch (err) {
      console.error("Admin delete coupon failed:", err);
      return false;
    }
  },
  toggleCoupon: async (id) => {
    try {
      const res = await api.patch(`admin/coupons/${id}/toggle`);
      return res.data;
    } catch (err) {
      console.error("Admin toggle coupon failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to toggle coupon" };
    }
  },

  // Inventory Management
  getInventory: async (params = {}) => {
    try {
      const res = await api.get('admin/inventory', { params });
      return res.data.data?.inventory || res.data.inventory || [];
    } catch (err) {
      console.error("Admin fetch inventory failed:", err);
      return [];
    }
  },
  adjustStock: async (payload) => {
    try {
      const res = await api.post('admin/inventory/adjust', payload);
      return res.data;
    } catch (err) {
      console.error("Admin adjust stock failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to adjust stock" };
    }
  },
  getStockHistory: async (params = {}) => {
    try {
      const res = await api.get('admin/inventory/history', { params });
      return res.data.data?.logs || res.data.logs || [];
    } catch (err) {
      console.error("Admin fetch stock history failed:", err);
      return [];
    }
  },
  getLowStockAlerts: async (params = {}) => {
    try {
      const res = await api.get('admin/inventory/alerts', { params });
      return res.data.data?.alerts || res.data.alerts || [];
    } catch (err) {
      console.error("Admin fetch low stock alerts failed:", err);
      return [];
    }
  },

  // Homepage Sections (CMS)
  getHomepageLayout: async () => {
    try {
      const res = await api.get('admin/cms/homepage');
      return res.data.layout;
    } catch (err) {
      console.error("Admin fetch homepage layout failed:", err);
      return null;
    }
  },
  getMetalPricing: async () => {
    try {
      const res = await api.get('admin/settings/metal-pricing');
      return res.data?.data || res.data || { metalRates: {}, gstRate: 0 };
    } catch (err) {
      console.error("Admin fetch metal pricing failed:", err);
      return { metalRates: {}, gstRate: 0 };
    }
  },
  updateMetalPricing: async (payload) => {
    try {
      const res = await api.patch('admin/settings/metal-pricing', payload);
      return res.data;
    } catch (err) {
      console.error("Admin update metal pricing failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to update metal pricing" };
    }
  },
  getSections: async () => {
    try {
      const res = await api.get('admin/sections');
      return res.data.data?.sections || res.data.sections || [];
    } catch (err) {
      console.error("Admin fetch sections failed:", err);
      return [];
    }
  },
  getSectionById: async (id) => {
    try {
      const res = await api.get(`admin/sections/${id}`);
      return res.data.data?.section || res.data.section;
    } catch (err) {
      console.error("Admin fetch section failed:", err);
      throw err;
    }
  },
  updateSection: async (id, payload) => {
    try {
      const res = await api.put(`admin/sections/${id}`, payload);
      return res.data;
    } catch (err) {
      console.error("Admin update section failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to update section" };
    }
  },
  bulkUpsertSections: async (sections) => {
    try {
      const res = await api.post('admin/sections/bulk', { sections });
      return res.data;
    } catch (err) {
      console.error("Admin bulk section upsert failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to seed sections" };
    }
  },
  uploadSectionImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('admin/sections/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data?.data?.url || null;
    } catch (err) {
      console.error("Admin section image upload failed:", err);
      return null;
    }
  },
  updateHomepageSection: async (sectionId, data) => {
    try {
      const res = await api.patch(`admin/cms/homepage/sections/${sectionId}`, data);
      return res.data.success;
    } catch (err) {
      console.error("Admin update section failed:", err);
      return false;
    }
  },

  // Order Management
  getOrders: async (params = {}) => {
    try {
      const res = await api.get('admin/orders', { params });
      return res.data.data?.orders || res.data.orders || [];
    } catch (err) {
      console.error("Admin fetch orders failed:", err);
      return [];
    }
  },
  getOrderDetails: async (id) => {
    try {
      const res = await api.get(`admin/orders/${id}`);
      return res.data.order;
    } catch (err) {
      console.error("Admin fetch order details failed:", err);
      throw err;
    }
  },
  updateOrderStatus: async (id, status) => {
    try {
      const res = await api.patch(`admin/orders/${id}/status`, { status });
      return res.data.success;
    } catch (err) {
      console.error("Admin update order status failed:", err);
      return false;
    }
  },

  // Return Management (RMA)
  getReturns: async () => {
    try {
      const res = await api.get('admin/returns');
      return res.data.returns || [];
    } catch (err) {
      console.error("Admin fetch returns failed:", err);
      return [];
    }
  },
  getReturnDetails: async (id) => {
    try {
      const res = await api.get(`admin/returns/${id}`);
      return res.data.returnRequest;
    } catch (err) {
      console.error("Admin fetch return details failed:", err);
      throw err;
    }
  },
  processReturn: async (id, status) => {
    try {
      const res = await api.patch(`admin/returns/${id}/status`, { status });
      return res.data.success;
    } catch (err) {
      console.error("Admin process return failed:", err);
      return false;
    }
  },

  // Seller Management
  getSellers: async (params = {}) => {
    try {
      const res = await api.get('admin/sellers', { params });
      return res.data.data?.sellers || res.data.sellers || [];
    } catch (err) {
      console.error("Admin fetch sellers failed:", err);
      return [];
    }
  },
  getSellerDetails: async (id) => {
    try {
      const res = await api.get(`admin/sellers/${id}`);
      return res.data.data?.seller || res.data.seller;
    } catch (err) {
      console.error("Admin fetch seller details failed:", err);
      throw err;
    }
  },
  updateSellerStatus: async (id, status, rejectionReason = null) => {
    try {
      const res = await api.patch(`admin/sellers/${id}/status`, { status, rejectionReason });
      return res.data.success;
    } catch (err) {
      console.error("Admin update seller status failed:", err);
      return false;
    }
  },

  // User Management
  getUsers: async (params = {}) => {
    try {
      const res = await api.get('admin/users', { params });
      return res.data.data?.users || res.data.users || [];
    } catch (err) {
      console.error("Admin fetch users failed:", err);
      return [];
    }
  },
  getUserById: async (id) => {
    try {
      const res = await api.get(`admin/users/${id}`);
      return res.data.data?.user || res.data.user;
    } catch (err) {
      console.error("Admin fetch user details failed:", err);
      throw err;
    }
  },
  toggleUserStatus: async (id) => {
    try {
      const res = await api.patch(`admin/users/${id}/block`);
      return res.data.success;
    } catch (err) {
      console.error("Admin toggle user status failed:", err);
      return false;
    }
  },

  // Blog Management
  getAdminBlogs: async () => {
    try {
      const res = await api.get('admin/blogs');
      return res.data.data.blogs || [];
    } catch (err) {
      console.error("Admin fetch blogs failed:", err);
      return [];
    }
  },
  createBlog: async (formData) => {
    try {
      const res = await api.post('admin/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      console.error("Admin create blog failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to create blog" };
    }
  },
  updateBlog: async (id, formData) => {
    try {
      const res = await api.put(`admin/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      console.error("Admin update blog failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to update blog" };
    }
  },
  deleteBlog: async (id) => {
    try {
      const res = await api.delete(`admin/blogs/${id}`);
      return res.data.success;
    } catch (err) {
      console.error("Admin delete blog failed:", err);
      return false;
    }
  },

  // Dynamic Pages (CMS)
  getPageBySlug: async (slug) => {
    try {
      const res = await api.get(`admin/pages/${slug}`);
      return res.data;
    } catch (err) {
      console.error(`Fetch page ${slug} failed:`, err);
      return { success: false, message: err.response?.data?.message || "Failed to fetch page" };
    }
  },
  savePage: async (data) => {
    try {
      const res = await api.post(`admin/pages`, data);
      return res.data;
    } catch (err) {
      console.error("Save page failed:", err);
      return { success: false, message: err.response?.data?.message || "Failed to save page" };
    }
  },

  // Admin Notifications
  getAdminNotifications: async () => {
    try {
      const res = await api.get('admin/notifications');
      return res.data.data?.notifications || res.data.notifications || [];
    } catch (err) {
      console.error("Admin fetch notifications failed:", err);
      return [];
    }
  },
  markAdminNotificationRead: async (id) => {
    try {
      const res = await api.patch(`admin/notifications/${id}/read`);
      return res.data.success;
    } catch (err) {
      console.error("Admin mark notification read failed:", err);
      return false;
    }
  },
  markAllAdminNotificationsRead: async () => {
    try {
      const res = await api.patch('admin/notifications/read-all');
      return res.data.success;
    } catch (err) {
      console.error("Admin mark all notifications read failed:", err);
      return false;
    }
  },
  deleteAdminNotification: async (id) => {
    try {
      const res = await api.delete(`admin/notifications/${id}`);
      return res.data.success;
    } catch (err) {
      console.error("Admin delete notification failed:", err);
      return false;
    }
  }
};
