import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useCatalogue = () => {
    // Fetch Categories
    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('public/categories');
            const data = res.data.data.categories || [];
            return data.map(cat => ({
                id: cat._id,
                _id: cat._id,
                name: cat.name,
                slug: cat.slug,
                path: cat.slug,
                image: cat.image,
                showInNavbar: cat.showInNavbar,
                showInCollection: cat.showInCollection,
                isActive: cat.isActive,
                subcategories: (cat.subcategories || []).map(sub => ({
                    id: sub._id,
                    name: sub.name,
                    path: sub.slug,
                    image: sub.image
                }))
            }));
        },
        staleTime: 5 * 60 * 1000,
    });

    // Fetch Products
    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await api.get('public/products');
            const data = res.data.data.products || [];
            return data.map(prod => {
                const rawCategory = Array.isArray(prod.categories) ? prod.categories[0] : null;
                const rawCategoryId = rawCategory?._id || (typeof rawCategory === 'string' ? rawCategory : '');
                const rawCategoryName = typeof rawCategory === 'string' ? rawCategory : (rawCategory?.name || '');
                const rawCategorySlug = rawCategory?.slug || '';

                return ({
                id: prod._id,
                name: prod.name,
                slug: prod.slug,
                price: prod.variants?.[0]?.price || 0,
                originalPrice: prod.variants?.[0]?.mrp || 0,
                image: prod.images?.[0] || '',
                images: prod.images || [],
                rating: prod.rating || 4.5,
                reviews: prod.reviewCount || 0,
                isNew: prod.tags?.isNewArrival || false,
                isTrending: prod.tags?.isTrending || false,
                createdAt: prod.createdAt || prod.updatedAt || '',
                updatedAt: prod.updatedAt || prod.createdAt || '',
                sold: Number(prod.sold || (prod.variants || []).reduce((sum, v) => sum + (v.sold || 0), 0)),
                category: rawCategoryName || '', // Updated for flat populate + legacy string fallback
                categoryId: rawCategoryId || '',
                categorySlug: rawCategorySlug || '',
                material: prod.material || '',
                navShopByCategory: prod.navShopByCategory || [],
                navGiftsFor: prod.navGiftsFor || [],
                navOccasions: prod.navOccasions || [],
                faqs: prod.faqs || [], // Added FAQs
                goldCategory: prod.goldCategory || '',
                silverCategory: prod.silverCategory || '',
                variants: (prod.variants || []).map((v, index) => ({
                    ...v,
                    id: v._id || v.id || `${prod._id}-variant-${index}`
                }))
            });
            });
        },
        staleTime: 5 * 60 * 1000,
    });


    // Fetch Coupons
    const couponsQuery = useQuery({
        queryKey: ['coupons'],
        queryFn: async () => {
            const res = await api.get('public/coupons'); 
            return res.data.data.coupons || [];
        },
        staleTime: 5 * 60 * 1000, 
    });

    return {
        categories: categoriesQuery.data || [],
        products: productsQuery.data || [],
        coupons: couponsQuery.data || [],
        isLoading: categoriesQuery.isLoading || productsQuery.isLoading || couponsQuery.isLoading,
        isError: categoriesQuery.isError || productsQuery.isError || couponsQuery.isError,
        refetch: () => {
            categoriesQuery.refetch();
            productsQuery.refetch();
            couponsQuery.refetch();
        }
    };
};
