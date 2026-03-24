import React, { useMemo } from 'react';
import SellerProductEditor from '../../seller/pages/SellerProductEditor';
import { adminService } from '../services/adminService';

const AdminProductEditor = () => {
    const productApi = useMemo(() => ({
        getProduct: adminService.getProductById,
        createProduct: async (formData) => {
            const res = await adminService.createProduct(formData);
            if (res?.success === false) {
                throw new Error(res?.message || 'Failed to create product');
            }
            return res?.data?.product || res?.product || res?.data?.data?.product;
        },
        updateProduct: async (id, formData) => {
            const res = await adminService.updateProduct(id, formData);
            if (res?.success === false) {
                throw new Error(res?.message || 'Failed to update product');
            }
            return res;
        }
    }), []);

    const metalPricingApi = useMemo(() => ({
        getMetalPricing: adminService.getMetalPricing
    }), []);

    return (
        <SellerProductEditor
            productApi={productApi}
            metalPricingApi={metalPricingApi}
            backPath="/admin/products"
        />
    );
};

export default AdminProductEditor;
