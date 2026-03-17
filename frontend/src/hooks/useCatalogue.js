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
                path: cat.slug,
                image: cat.image,
                metal: cat.metal,
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
            return data.map(prod => ({
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
                category: prod.categories?.[0]?.name || '', // Updated for flat populate
                categoryId: prod.categories?.[0]?._id || '',
                faqs: prod.faqs || [], // Added FAQs
                variants: (prod.variants || []).map(v => ({
                    ...v,
                    id: v._id || Math.random() // Ensure ID for selection logic
                }))
            }));
        },
        staleTime: 5 * 60 * 1000,
    });

    // Fetch Banners
    const bannersQuery = useQuery({
        queryKey: ['banners'],
        queryFn: async () => {
            const res = await api.get('public/banners');
            return res.data.data.banners || [];
        },
        staleTime: 10 * 60 * 1000,
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
        banners: bannersQuery.data || [],
        coupons: couponsQuery.data || [],
        isLoading: categoriesQuery.isLoading || productsQuery.isLoading || bannersQuery.isLoading || couponsQuery.isLoading,
        isError: categoriesQuery.isError || productsQuery.isError || bannersQuery.isError || couponsQuery.isError,
        refetch: () => {
            categoriesQuery.refetch();
            productsQuery.refetch();
            bannersQuery.refetch();
            couponsQuery.refetch();
        }
    };
};
