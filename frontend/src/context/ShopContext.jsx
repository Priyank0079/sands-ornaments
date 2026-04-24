import { createContext, useContext, useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useCatalogue } from '../hooks/useCatalogue';
import { adminService } from '../modules/admin/services/adminService';
import { useQuery } from '@tanstack/react-query';

export const ShopContext = createContext();

const normalizeVariantForCart = (variant = {}, fallbackProduct = {}) => ({
    ...variant,
    id: variant.id || variant._id,
    _id: variant._id || variant.id,
    price: Number(variant.price ?? variant.finalPrice) || 0,
    mrp: Number(variant.mrp ?? variant.finalPrice ?? variant.price) || 0,
    finalPrice: Number(variant.finalPrice ?? variant.price) || 0,
    image: variant.image || fallbackProduct.image || fallbackProduct.images?.[0] || '',
    weight: variant.weight ?? fallbackProduct.weight ?? 0,
    weightUnit: variant.weightUnit || fallbackProduct.weightUnit || 'Grams'
});

const normalizeProductForCart = (product = {}, selectedVariant = null) => {
    const normalizedVariant = selectedVariant
        ? normalizeVariantForCart(selectedVariant, product)
        : normalizeVariantForCart(product.variants?.[0] || {}, product);

    return {
        ...product,
        id: product.id || product._id,
        _id: product._id || product.id,
        image: product.image || product.images?.[0] || normalizedVariant.image || '',
        images: product.images || (product.image ? [product.image] : []),
        price: normalizedVariant.price,
        originalPrice: normalizedVariant.mrp,
        gst: Number(normalizedVariant.gst ?? product.gst) || 0,
        finalPrice: normalizedVariant.finalPrice,
        selectedVariant: normalizedVariant,
        variantId: normalizedVariant.id || normalizedVariant._id || null,
        variants: Array.isArray(product.variants)
            ? product.variants.map((variant) => normalizeVariantForCart(variant, product))
            : []
    };
};

const resolveAvailableStock = (product = {}, variantId = null) => {
    const selected = (product.selectedVariant && (variantId == null || String(product.selectedVariant.id || product.selectedVariant._id) === String(variantId)))
        ? product.selectedVariant
        : (product.variants || []).find((variant) => String(variant.id || variant._id) === String(variantId))
            || product.selectedVariant
            || (product.variants || [])[0]
            || null;

    const stock = Number(selected?.stock);
    if (Number.isFinite(stock) && stock >= 0) return stock;
    return null;
};

export const ShopProvider = ({ children }) => {
    const { user, logout: authLogout } = useAuth();
    const isUserRole = user?.role === 'user';
    // Initialize from LocalStorage if available
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState(() => {
        const saved = localStorage.getItem('addresses');
        return saved ? JSON.parse(saved) : [];
    });
    const [supportTickets, setSupportTickets] = useState([]);
    const [returns, setReturns] = useState([]);
    const [replacements, setReplacements] = useState([]);
    const {
        products,
        categories,
        coupons: apiCoupons,
        isLoading: isCatalogueLoading
    } = useCatalogue();

    const [defaultAddressId, setDefaultAddressId] = useState(() => {
        return localStorage.getItem('defaultAddressId') || null;
    });
    const [coupons, setCoupons] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(() => {
        const saved = localStorage.getItem('appliedCoupon');
        return saved ? JSON.parse(saved) : null;
    });
    const [couponDiscount, setCouponDiscount] = useState(() => {
        const saved = localStorage.getItem('couponDiscount');
        return saved ? Number(saved) : 0;
    });
    const [globalGst, _setGlobalGst] = useState(() => {
        return localStorage.getItem('admin_global_gst') || '0';
    });

    const setGlobalGst = (val) => {
        _setGlobalGst(val);
        localStorage.setItem('admin_global_gst', val);
    };

    useEffect(() => {
        if (apiCoupons.length > 0) setCoupons(apiCoupons);
    }, [apiCoupons]);

    const [notification, setNotification] = useState(null);
    const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
    const [pincode, setPincode] = useState(() => {
        return localStorage.getItem('user_pincode') || '';
    });
    const [activeMetal, setActiveMetal] = useState(() => {
        return localStorage.getItem('user_active_metal') || 'silver';
    });

    const updateActiveMetal = (metal) => {
        setActiveMetal(metal);
        localStorage.setItem('user_active_metal', metal);
    };

    const updatePincode = (newPincode) => {
        setPincode(newPincode);
        if (newPincode) {
            localStorage.setItem('user_pincode', newPincode);
        } else {
            localStorage.removeItem('user_pincode');
        }
    };

    // Notification Preferences & List
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        return localStorage.getItem('notificationsEnabled') === 'true';
    });

    const [userNotifications, setUserNotifications] = useState(() => {
        const saved = localStorage.getItem('userNotifications');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleNotificationSettings = () => {
        setNotificationsEnabled(prev => !prev);
    };

    const deleteUserNotification = async (id) => {
        if (!isUserRole) return;
        try {
            await api.patch(`/user/notifications/${id}/read`);
            await fetchNotifications();
        } catch (err) {
            setUserNotifications(prev => prev.filter(n => (n._id || n.id) !== id));
        }
    };

    // Auto-hide notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // FETCH USER DATA ON LOGIN
    useEffect(() => {
        // These endpoints are user-only. When logged in as admin/seller, calling them
        // will correctly return 403, but we don't want console noise or wasted requests.
        if (isUserRole) {
            fetchAddresses();
            fetchWishlist();
            fetchOrders();
            fetchReturns();
            fetchReplacements();
            fetchSupportTickets();
            fetchNotifications();
        } else {
            setAddresses([]);
            setWishlist([]);
            setOrders([]);
            setReturns([]);
            setReplacements([]);
            setSupportTickets([]);
            setUserNotifications([]);
        }
    }, [user]);

    const fetchAddresses = async () => {
        if (!isUserRole) return;
        try {
            const res = await api.get('user/addresses');
            if (res.data.success) {
                const list = res.data.addresses || [];
                const normalized = list.map(addr => ({ ...addr, id: addr._id || addr.id }));
                setAddresses(normalized);
                const defaultAddr = normalized.find(a => a.isDefault);
                if (defaultAddr) setDefaultAddressId(defaultAddr._id);
            }
        } catch (err) { console.error("Fetch addresses failed", err); }
    };

    const fetchWishlist = async () => {
        if (!isUserRole) return;
        try {
            const res = await api.get('user/wishlist');
            if (res.data.success) {
                const list = res.data.data?.wishlist || res.data.wishlist || res.data.products || [];
                const normalized = (list || []).map((item) => {
                    const variants = item.variants || [];
                    const firstVariant = variants[0] || {};
                    const rawCategory = Array.isArray(item.categories) ? item.categories[0] : null;
                    const categoryName = typeof rawCategory === 'string' ? rawCategory : (rawCategory?.name || item.category || '');
                    const categoryId = rawCategory?._id || rawCategory?.id || item.categoryId || '';
                    const categorySlug = rawCategory?.slug || item.categorySlug || '';
                    return {
                        ...item,
                        id: item._id || item.id,
                        price: item.price ?? item.finalPrice ?? firstVariant.price ?? firstVariant.finalPrice ?? 0,
                        originalPrice: item.originalPrice ?? item.mrp ?? firstVariant.mrp ?? firstVariant.price ?? 0,
                        image: item.image || item.images?.[0] || firstVariant.image || '',
                        images: item.images || (item.image ? [item.image] : []),
                        rating: item.rating || 0,
                        reviews: item.reviewCount || item.reviews || 0,
                        category: categoryName,
                        categoryId,
                        categorySlug,
                        metal: item.metal || item.material || '',
                        variants: variants.map(v => ({
                            ...v,
                            id: v._id || v.id,
                            image: v.image || item.image || item.images?.[0] || '',
                            price: Number(v.price ?? v.finalPrice) || 0,
                            mrp: Number(v.mrp ?? v.price ?? v.finalPrice) || 0
                        }))
                    };
                });
                setWishlist(normalized);
            }
        } catch (err) { console.error("Fetch wishlist failed", err); }
    };

    const fetchOrders = async () => {
        if (!isUserRole) return;
        try {
            const res = await api.get('user/orders');
            if (res.data.success) {
                const list = res.data.data?.orders || res.data.orders || [];
                setOrders(list.map(order => ({ ...order, id: order._id || order.id, displayId: order.orderId || order._id })));
            }
        } catch (err) { console.error("Fetch orders failed", err); }
    };

    const fetchReturns = async () => {
        if (!isUserRole) return;
        try {
            const res = await api.get('user/returns');
            if (res.data.success) {
                const list = res.data.data?.returns || res.data.returns || [];
                setReturns(list.map(ret => ({
                    ...ret,
                    id: ret._id || ret.id,
                    displayId: ret.returnId || ret._id || ret.id,
                    requestDate: ret.createdAt || ret.requestDate || ret.date,
                    reason: ret.evidence?.reason || ret.reason || ret.items?.[0]?.reason || '',
                    comments: ret.evidence?.comment || ret.comments || '',
                    images: ret.evidence?.images || ret.images || [],
                    type: 'refund'
                })));
            }
        } catch (err) { console.error("Fetch returns failed", err); }
    };

    const fetchReplacements = async () => {
        if (!isUserRole) return;
        try {
            const res = await api.get('user/replacements');
            if (res.data.success) {
                const list = res.data.data?.replacements || res.data.replacements || [];
                setReplacements(list.map(rep => ({
                    ...rep,
                    id: rep._id || rep.id,
                    displayId: rep.replacementId || rep._id || rep.id,
                    requestDate: rep.createdAt || rep.requestDate || rep.date,
                    reason: rep.evidence?.reason || rep.reason || rep.originalItems?.[0]?.reason || '',
                    comments: rep.evidence?.comment || rep.comments || '',
                    images: rep.evidence?.images || rep.images || [],
                    video: rep.evidence?.video || rep.video || '',
                    evidenceVideo: rep.evidence?.video || rep.evidenceVideo || '',
                    items: rep.originalItems || rep.items || [],
                    type: 'replacement'
                })));
            }
        } catch (err) { console.error("Fetch replacements failed", err); }
    };

    const fetchSupportTickets = async () => {
        if (!isUserRole) return;
        try {
            const res = await api.get('user/support');
            if (res.data.success) {
                const list = res.data.data?.tickets || res.data.tickets || [];
                setSupportTickets(list.map(ticket => ({ ...ticket, id: ticket._id || ticket.id || ticket.ticketId })));
            }
        } catch (err) { console.error("Fetch support tickets failed", err); }
    };

    const fetchNotifications = async () => {
        if (!isUserRole) return;
        try {
            const res = await api.get('user/notifications');
            if (res.data.success) {
                const list = res.data.data?.notifications || res.data.notifications || [];
                setUserNotifications(list.map(note => ({ ...note, id: note._id || note.id })));
            }
        } catch (err) { console.error("Fetch notifications failed", err); }
    };

    const refreshOrders = () => fetchOrders();
    const refreshReturns = () => fetchReturns();
    const refreshReplacements = () => fetchReplacements();
    const refreshSupportTickets = () => fetchSupportTickets();
    const refreshNotifications = () => fetchNotifications();

    // Persist Cart
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Persist Coupons
    useEffect(() => {
        localStorage.setItem('farmlyf_coupons', JSON.stringify(coupons));
    }, [coupons]);

    useEffect(() => {
        if (appliedCoupon) {
            localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
        } else {
            localStorage.removeItem('appliedCoupon');
        }
        localStorage.setItem('couponDiscount', String(couponDiscount || 0));
    }, [appliedCoupon, couponDiscount]);

    // Persist Products
    useEffect(() => {
        localStorage.setItem('farmlyf_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        if (defaultAddressId) {
            localStorage.setItem('defaultAddressId', defaultAddressId);
        }
    }, [defaultAddressId]);

    const showNotification = (message) => {
        setNotification(message);
    };

    const login = (userData) => {
        // Obsolete: Auth handled by AuthContext now
    };

    const logout = () => {
        authLogout();
        setCart([]);
        setWishlist([]);
        clearAppliedCoupon();
    };

    const placeOrder = async (orderDetails) => {
        try {
            const { items, shippingAddress, paymentMethod, couponCode, addressId } = orderDetails;
            const resolvedAddress = shippingAddress || addresses.find(a => a._id === addressId);

            // 1. Create order on backend
            // Note: backend expects { items: [{productId, variantId, quantity}], shippingAddress, paymentMethod, couponCode }
            const res = await api.post('/user/orders/place', {
                items: (items || cart).map(item => ({
                    productId: item.id || item._id,
                    variantId: item.variantId || item.variants?.[0]?.id || item.variants?.[0]?._id,
                    quantity: item.qty || item.quantity
                })),
                shippingAddress: resolvedAddress,
                paymentMethod,
                couponCode
            });

            if (!res.data.success) {
                toast.error(res.data.message);
                return null;
            }

            const order = res.data?.data?.order;
            if (!order) {
                toast.error("Order response is incomplete. Please try again.");
                return null;
            }

            // 2. Handle Razorpay if selected
            if (orderDetails.paymentMethod === 'razorpay' && order.razorpayOrderId) {
                return await handleRazorpayPayment(order.razorpayOrderId, order);
            }

            // 3. For COD or other methods, complete local flow
            await fetchOrders();
            setCart([]);
            showNotification("Order placed successfully!");
            return order._id;

        } catch (err) {
            const apiError = err.response?.data;
            if (apiError?.error === "VALIDATION_ERROR") {
                toast.error("Please check your shipping address and try again.");
            } else {
                toast.error(apiError?.message || "Checkout failed");
            }
            return null;
        }
    };

    const handleRazorpayPayment = (razorpayOrderId, backendOrder) => {
        return new Promise((resolve) => {
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: Math.round(Number(backendOrder.total || 0) * 100),
                currency: "INR",
                name: "Sands Ornaments",
                description: "Order #" + backendOrder.orderId,
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/user/payments/verify', {
                            orderId: backendOrder._id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            await fetchOrders();
                            setCart([]);
                            toast.success("Payment successful!");
                            resolve(backendOrder._id);
                        } else {
                            toast.error("Payment verification failed");
                            resolve(null);
                        }
                    } catch (err) {
                        toast.error("Verification error");
                        resolve(null);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone
                },
                theme: { color: "#EBCDD0" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        });
    };

    const addToCart = (arg1, arg2, arg3) => {
        let productId, variantId, qty = 1, productData = null;

        if (!user) {
            toast.error("Please login to add to cart");
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
            return;
        }

        if (typeof arg1 === 'object') {
            // Logic for addToCart(product)
            const selectedVariant = arg1.selectedVariant || arg1.variants?.find(v => (v.id || v._id) === (arg1.variantId || arg1.selectedVariantId)) || arg1.variants?.[0];
            productData = normalizeProductForCart(arg1, selectedVariant);
            productId = productData.id || productData._id;
            variantId = productData.variantId;
        } else {
            // Logic for addToCart(userId, productId, quantity)
            productId = arg2;
            qty = arg3 || 1;
            const foundProduct = products.find(p => p.id === productId);
            productData = foundProduct ? normalizeProductForCart(foundProduct) : null;
        }

        if (!productId) return;
        const requestedQty = Number.isFinite(Number(qty)) ? Math.max(1, Number(qty)) : 1;
        const maxStock = resolveAvailableStock(productData || {}, variantId);
        if (maxStock !== null && maxStock <= 0) {
            toast.error("This variant is out of stock");
            return;
        }

        setCart((prev) => {
            const existing = prev.find((item) => item.id === productId && item.variantId === variantId);
            if (existing) {
                const currentStock = resolveAvailableStock(existing, variantId);
                const limitStock = currentStock !== null ? currentStock : maxStock;
                const nextQuantity = existing.quantity + requestedQty;
                if (limitStock !== null && nextQuantity > limitStock) {
                    toast.error(`Only ${limitStock} units available`);
                    const cappedQty = Math.max(1, Math.min(limitStock, nextQuantity));
                    return prev.map((item) =>
                        (item.id === productId && item.variantId === variantId)
                            ? { ...item, quantity: cappedQty, qty: cappedQty }
                            : item
                    );
                }
                return prev.map((item) =>
                    (item.id === productId && item.variantId === variantId) ? { ...item, quantity: nextQuantity, qty: nextQuantity } : item
                );
            }
            // If productData not found in list, try to use whatever we have
            const itemBase = productData || { id: productId, name: 'Product', price: 0, originalPrice: 0, image: '' };
            const finalQty = maxStock !== null ? Math.min(requestedQty, maxStock) : requestedQty;
            if (maxStock !== null && requestedQty > maxStock) {
                toast.error(`Only ${maxStock} units available`);
            }
            return [...prev, {
                ...itemBase,
                id: productId,
                variantId: variantId,
                packId: variantId || productId, // For CartPage compatibility
                gst: Number(itemBase.gst ?? itemBase.selectedVariant?.gst) || 0,
                quantity: finalQty,
                qty: finalQty // For CartPage compatibility
            }];
        });
        showNotification("Added to bag");
    };

    const updateQuantity = (productId, amount, variantId) => {
        setCart((prev) => prev.map((item) => {
            const itemVariantKey = item.variantId || item.packId || null;
            const targetVariantKey = variantId || null;
            if (item.id === productId && (targetVariantKey === null || itemVariantKey === targetVariantKey)) {
                const maxStock = resolveAvailableStock(item, itemVariantKey);
                const requestedQuantity = Math.max(1, item.quantity + amount);
                const newQuantity = maxStock !== null ? Math.min(requestedQuantity, maxStock) : requestedQuantity;
                if (maxStock !== null && requestedQuantity > maxStock) {
                    toast.error(`Only ${maxStock} units available`);
                }
                return { ...item, quantity: newQuantity, qty: newQuantity };
            }
            return item;
        }));
    };

    // Helper for CartPage compatibility
    const updateCartQty = (userId, packId, newQty) => {
        setCart(prev => prev.map(item => {
            if (item.packId === packId || item.id === packId || item.variantId === packId) {
                const normalizedQty = Math.max(1, Number(newQty) || 1);
                const maxStock = resolveAvailableStock(item, item.variantId || item.packId || null);
                const finalQty = maxStock !== null ? Math.min(normalizedQty, maxStock) : normalizedQty;
                if (maxStock !== null && normalizedQty > maxStock) {
                    toast.error(`Only ${maxStock} units available`);
                }
                return { ...item, quantity: finalQty, qty: finalQty };
            }
            return item;
        }));
    };

    const getCart = () => cart;

    const getVariantById = (variantId) => {
        for (const prod of products) {
            const v = (prod.variants || []).find(v => v.id === variantId || v._id === variantId);
            if (v) return { ...v, product: prod };
        }
        return null;
    };

    const getPackById = (packId) => {
        // Fallback for legacy packs
        return products.find(p => p.id === packId) || null;
    };

    const addToWishlist = async (product) => {
        if (!user) {
            toast.error("Please login to save items to your wishlist");
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
            return;
        }
        try {
            const res = await api.post('/user/wishlist', { productId: product.id || product._id });
            if (res.data.success) {
                fetchWishlist();
                showNotification("Wishlist updated");
            }
        } catch (err) { showNotification("Failed to update wishlist"); }
    };

    const removeFromCart = (userId, productId) => {
        // Supports removeFromCart(productId), removeFromCart(productId, variantId), and legacy signatures.
        if (typeof userId === 'object' && userId !== null) {
            const productIdToRemove = userId.productId || userId.id;
            const variantIdToRemove = userId.variantId || userId.packId || null;
            setCart((prev) => prev.filter((item) => !(item.id === productIdToRemove && (variantIdToRemove == null || (item.variantId || item.packId) === variantIdToRemove))));
            return;
        }

        setCart((prev) => prev.filter((item) => {
            if (!productId) {
                return item.id !== userId && item.packId !== userId && item.variantId !== userId;
            }

            const matchesVariantScopedRemoval = item.id === userId && (item.variantId || item.packId) === productId;
            if (matchesVariantScopedRemoval) return false;

            const matchesLegacyRemoval = item.id === productId || item.packId === productId || item.variantId === productId;
            if (matchesLegacyRemoval) return false;

            return true;
        }));
    };

    const removeFromWishlist = async (productId) => {
        try {
            const res = await api.delete(`/user/wishlist/${productId}`);
            if (res.data.success) {
                fetchWishlist();
                showNotification("Removed from wishlist");
            }
        } catch (err) { showNotification("Failed to remove item"); }
    };

    const clearCart = () => {
        setCart([]);
        clearAppliedCoupon();
    };

    const applyCoupon = async (code, cartTotal, items) => {
        const result = await validateCoupon(code, cartTotal, items);
        if (!result.valid) {
            return result;
        }
        setAppliedCoupon(result.coupon);
        setCouponDiscount(result.discount || 0);
        return result;
    };

    const clearAppliedCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
    };

    const addAddress = async (address) => {
        try {
            const res = await api.post('/user/addresses', address);
            if (res.data.success) {
                fetchAddresses();
                showNotification("Address added successfully");
            }
        } catch (err) { showNotification("Failed to add address"); }
    };

    const setDefaultAddress = async (addressId) => {
        try {
            const res = await api.patch(`/user/addresses/${addressId}/set-default`);
            if (res.data.success) {
                fetchAddresses();
                showNotification("Marked as default address");
            }
        } catch (err) { showNotification("Failed to set default address"); }
    };

    const removeAddress = async (addressId) => {
        try {
            const res = await api.delete(`/user/addresses/${addressId}`);
            if (res.data.success) {
                fetchAddresses();
                showNotification("Address removed");
            }
        } catch (err) { showNotification("Failed to remove address"); }
    };

    const updateAddress = async (updatedAddress) => {
        try {
            const res = await api.patch(`/user/addresses/${updatedAddress.id || updatedAddress._id}`, updatedAddress);
            if (res.data.success) {
                fetchAddresses();
                showNotification("Address updated");
            }
        } catch (err) { showNotification("Failed to update address"); }
    };

    const createTicket = async (ticketData) => {
        try {
            const res = await api.post('/user/support', ticketData);
            if (res.data.success) {
                await fetchSupportTickets();
                showNotification("Support ticket created. We will get back to you soon!");
                return res.data.data?.ticket?._id || null;
            }
            toast.error(res.data.message || "Failed to create ticket");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create ticket");
        }
        return null;
    };

    const addTicketReply = async (ticketId, reply) => {
        try {
            const res = await api.post(`/user/support/${ticketId}/reply`, { message: reply.text || reply.message || '' });
            if (res.data.success) {
                await fetchSupportTickets();
                showNotification("Reply sent");
                return true;
            }
            toast.error(res.data.message || "Failed to send reply");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send reply");
        }
        return false;
    };

    const deleteTicket = (ticketId) => {
        setSupportTickets(prev => prev.filter(t => (t._id || t.id || t.ticketId) !== ticketId));
        showNotification("Ticket removed successfully.");
    };

    const deleteAccount = () => {
        // User state is owned by AuthContext; we just clear dependent state here.
        authLogout();
        setOrders([]);
        setAddresses([]);
        setCart([]);
        setWishlist([]);
        setSupportTickets([]);
        setDefaultAddressId(null);
        localStorage.clear();
        showNotification("Account deleted successfully.");
    };

    // Coupon Management
    const addCoupon = async (couponData) => {
        const res = await adminService.createCoupon(couponData);
        if (res.success) {
            const allCoupons = await adminService.getCoupons();
            setCoupons(allCoupons);
            showNotification("Coupon created successfully");
        } else {
            toast.error(res.message);
        }
    };

    const updateCoupon = async (id, updatedData) => {
        const res = await adminService.updateCoupon(id, updatedData);
        if (res.success) {
            const allCoupons = await adminService.getCoupons();
            setCoupons(allCoupons);
            showNotification("Coupon updated successfully");
        } else {
            toast.error(res.message);
        }
    };

    const deleteCoupon = async (id) => {
        const success = await adminService.deleteCoupon(id);
        if (success) {
            const allCoupons = await adminService.getCoupons();
            setCoupons(allCoupons);
            showNotification("Coupon deleted successfully");
        } else {
            toast.error("Failed to delete coupon");
        }
    };

    const toggleCoupon = async (id) => {
        const res = await adminService.toggleCoupon(id);
        if (res.success) {
            const allCoupons = await adminService.getCoupons();
            setCoupons(allCoupons);
            showNotification(res.message);
        } else {
            toast.error(res.message);
        }
    };

    const validateCoupon = async (code, cartTotal, items) => {
        try {
            // Format items for backend: { productId, variantId, quantity, price, categoryId }
            const formattedItems = (Array.isArray(items) ? items : []).map(item => {
                const rawCategory = item.categoryId || item.category?._id || item.category?.id || item.categories?.[0]?._id || item.categories?.[0]?.id || '';
                return {
                    productId: item.productId || item.id || item._id,
                    variantId: item.variantId || item.selectedVariant?.id || item.selectedVariant?._id || item.id,
                    quantity: item.qty || item.quantity || 1,
                    price: Number(item.price || 0),
                    categoryId: rawCategory ? String(rawCategory) : ''
                };
            });

            const res = await api.post('/user/coupons/validate', {
                code,
                cartTotal,
                items: formattedItems
            });

            if (res.data.success) {
                return {
                    valid: true,
                    discount: res.data.data.discount,
                    coupon: {
                        code: res.data.data.code,
                        type: res.data.data.type,
                        value: res.data.data.value,
                        isFreeShipping: res.data.data.isFreeShipping
                    }
                };
            } else {
                return {
                    valid: false,
                    error: res.data.message
                };
            }
        } catch (err) {
            console.error("Coupon validation error:", err);
            return {
                valid: false,
                error: err.response?.data?.message || "Failed to validate coupon"
            };
        }
    };

    const homepageSectionsQuery = useQuery({
        queryKey: ['public-cms', 'homepage'],
        queryFn: async () => api.get('public/cms/homepage'),
        select: (res) => {
            const sections = res?.data?.data?.sections || [];
            return (sections || []).reduce((acc, section) => {
                const key = section.sectionId || section.sectionKey;
                if (!key) return acc;
                acc[key] = {
                    id: section.sectionId,
                    sectionId: section.sectionId,
                    sectionKey: section.sectionKey,
                    label: section.label,
                    isActive: section.isActive !== false,
                    sortOrder: section.sortOrder || 0,
                    items: section.items || [],
                    settings: section.settings || {},
                    pageKey: section.pageKey || 'home',
                    sectionType: section.sectionType || null
                };
                return acc;
            }, {});
        },
        staleTime: 30 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    const homepageSections = homepageSectionsQuery.data || {};

    // Product & Bulk Management
    // `products` comes from `useCatalogue()` (read-only). Admin/Seller updates are handled
    // through their own modules; the user shop doesn't mutate this list directly.

    const getActiveCoupons = () => {
        return (coupons || []).filter(c => c?.active !== false);
    };

    // Persist Notifications
    useEffect(() => {
        localStorage.setItem('notificationsEnabled', notificationsEnabled);
    }, [notificationsEnabled]);

    useEffect(() => {
        localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
    }, [userNotifications]);

    return (
        <ShopContext.Provider value={{
            cart, wishlist, user, orders, addresses, supportTickets, returns, replacements,
            login, logout, placeOrder, addToCart, addToWishlist,
            removeFromCart, removeFromWishlist, updateQuantity, updateCartQty, clearCart,
            getCart, getVariantById, getPackById, getRecommendations: (uid, n) => products.slice(0, n), // Basic stub
            addAddress, removeAddress, updateAddress, setDefaultAddress,
            defaultAddressId, createTicket, addTicketReply, deleteTicket,
            refreshOrders, refreshReturns, refreshReplacements, refreshSupportTickets, refreshNotifications,

            showNotification, deleteAccount,
            coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon, getActiveCoupons, validateCoupon,
            appliedCoupon, couponDiscount, applyCoupon, clearAppliedCoupon,
            notificationsEnabled, userNotifications, toggleNotificationSettings, deleteUserNotification,
            isPincodeModalOpen, setIsPincodeModalOpen,
            pincode, updatePincode,
            activeMetal, updateActiveMetal,

            products,
            categories, isLoading: isCatalogueLoading,

            // Homepage Sections Management
            homepageSections,

            // Global Config
            globalGst, setGlobalGst
        }}>
            {children}
            {/* Custom Toast Notification */}
            {notification && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-[#3E2723] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 min-w-[300px] justify-center">
                        <div className="bg-white/20 p-1 rounded-full">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-sm tracking-wide">{notification}</span>
                    </div>
                </div>
            )}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
