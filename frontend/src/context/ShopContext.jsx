import { createContext, useContext, useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PRODUCTS as initialProducts, COUPONS as initialCoupons } from '../mockData/data';
import { useAuth } from './AuthContext';
import { useCatalogue } from '../hooks/useCatalogue';
import { adminService } from '../modules/admin/services/adminService';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const { user, logout: authLogout } = useAuth();
    // Initialize from LocalStorage if available
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('orders');
        return saved ? JSON.parse(saved) : [];
    });
    const [addresses, setAddresses] = useState(() => {
        const saved = localStorage.getItem('addresses');
        return saved ? JSON.parse(saved) : [];
    });
    const [supportTickets, setSupportTickets] = useState(() => {
        const saved = localStorage.getItem('supportTickets');
        if (saved) return JSON.parse(saved);

        // Initial Dummy Data to show the flow
        return [
            {
                id: 'TKT-827415',
                userName: 'Aditi Singh',
                userEmail: 'aditi.s@gmail.com',
                subject: 'Polishing issue with Silver Necklace',
                category: 'Product Feedback',
                orderId: '1735921',
                message: 'The necklace I bought last week seems to be losing its shine already. Is this normal or can I get it polished?',
                date: new Date(Date.now() - 86400000).toISOString(),
                status: 'In Progress',
                replies: [
                    {
                        from: 'admin',
                        text: 'Hello Aditi! We are sorry to hear that. 925 Silver can sometimes tarnish due to humidity, but it shouldn\'t happen so soon. Please bring it to our store or ship it back, and we will polish it for free!',
                        date: new Date(Date.now() - 43200000).toISOString()
                    }
                ]
            },
            {
                id: 'TKT-192837',
                userName: 'Rahul Verma',
                userEmail: 'rahul.v@yahoo.com',
                subject: 'Tracking showing "Returned to Origin"',
                category: 'Order Tracking',
                orderId: '1735123',
                message: 'My order tracking says the package is being sent back to the warehouse. I was at home all day!',
                date: new Date(Date.now() - 172800000).toISOString(),
                status: 'Open',
                replies: []
            }
        ];
    });
    const { 
        products, 
        categories, 
        banners, 
        coupons: apiCoupons, 
        isLoading: isCatalogueLoading 
    } = useCatalogue();

    const [coupons, setCoupons] = useState([]);
    const [defaultAddressId, setDefaultAddressId] = useState(() => {
        return localStorage.getItem('defaultAddressId') || null;
    });
    
    useEffect(() => {
        if (apiCoupons.length > 0) setCoupons(apiCoupons);
    }, [apiCoupons]);

    const [notification, setNotification] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = (state) => {
        setIsMenuOpen(state !== undefined ? state : !isMenuOpen);
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

    const deleteUserNotification = (id) => {
        setUserNotifications(prev => prev.filter(n => n.id !== id));
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
        if (user) {
            fetchAddresses();
            fetchWishlist();
        } else {
            setAddresses([]);
            setWishlist([]);
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await api.get('user/addresses');
            if (res.data.success) {
                setAddresses(res.data.addresses);
                const defaultAddr = res.data.addresses.find(a => a.isDefault);
                if (defaultAddr) setDefaultAddressId(defaultAddr._id);
            }
        } catch (err) { console.error("Fetch addresses failed", err); }
    };

    const fetchWishlist = async () => {
        try {
            const res = await api.get('user/wishlist');
            if (res.data.success) {
                setWishlist(res.data.products);
            }
        } catch (err) { console.error("Fetch wishlist failed", err); }
    };

    // Persist Cart
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Persist Support Tickets
    useEffect(() => {
        localStorage.setItem('supportTickets', JSON.stringify(supportTickets));
    }, [supportTickets]);

    // Persist Coupons
    useEffect(() => {
        localStorage.setItem('farmlyf_coupons', JSON.stringify(coupons));
    }, [coupons]);

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
    };

    const placeOrder = async (orderDetails) => {
        try {
            // 1. Create order on backend
            const res = await api.post('/user/orders', {
                items: cart.map(item => ({
                    productId: item.id || item._id,
                    variantId: item.variantId || item.variants?.[0]?.id, // Adjust based on your cart structure
                    quantity: item.quantity
                })),
                addressId: orderDetails.addressId || defaultAddressId,
                paymentMethod: orderDetails.paymentMethod,
                couponCode: orderDetails.couponCode
            });

            if (!res.data.success) {
                toast.error(res.data.message);
                return null;
            }

            const { order } = res.data;

            // 2. Handle Razorpay if selected
            if (orderDetails.paymentMethod === 'razorpay' && res.data.razorpayOrderId) {
                return await handleRazorpayPayment(res.data.razorpayOrderId, order);
            }

            // 3. For COD or other methods, complete local flow
            setOrders(prev => [order, ...prev]);
            setCart([]);
            showNotification("Order placed successfully!");
            return order._id;

        } catch (err) {
            toast.error(err.response?.data?.message || "Checkout failed");
            return null;
        }
    };

    const handleRazorpayPayment = (razorpayOrderId, backendOrder) => {
        return new Promise((resolve) => {
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: backendOrder.totalAmount * 100,
                currency: "INR",
                name: "Sands Ornaments",
                description: "Order #" + backendOrder.orderId,
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/user/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            setOrders(prev => [verifyRes.data.order, ...prev]);
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

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, amount) => {
        setCart((prev) => prev.map((item) => {
            if (item.id === productId) {
                const newQuantity = Math.max(1, (item.quantity || 1) + amount);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const addToWishlist = async (product) => {
        if (!user) {
            toast.error("Please login to add to wishlist");
            return;
        }
        try {
            const res = await api.post('/user/wishlist/toggle', { productId: product.id || product._id });
            if (res.data.success) {
                fetchWishlist();
                showNotification("Wishlist updated");
            }
        } catch (err) { showNotification("Failed to update wishlist"); }
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter(item => item.id !== productId));
    };

    const removeFromWishlist = async (productId) => {
        try {
            const res = await api.post('/user/wishlist/toggle', { productId });
            if (res.data.success) {
                fetchWishlist();
                showNotification("Removed from wishlist");
            }
        } catch (err) { showNotification("Failed to remove item"); }
    };

    const clearCart = () => {
        setCart([]);
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

    const createTicket = (ticketData) => {
        const newTicket = {
            id: 'TKT-' + Date.now().toString().slice(-6),
            date: new Date().toISOString(),
            status: 'Open',
            replies: [],
            ...ticketData
        };
        setSupportTickets(prev => [newTicket, ...prev]);
        showNotification("Support ticket created. We will get back to you soon!");
        return newTicket.id;
    };

    const updateTicketStatus = (ticketId, newStatus) => {
        setSupportTickets(prev => prev.map(t =>
            t.id === ticketId ? { ...t, status: newStatus } : t
        ));
    };

    const addTicketReply = (ticketId, reply) => {
        setSupportTickets(prev => prev.map(t => {
            if (t.id === ticketId) {
                return {
                    ...t,
                    status: reply.from === 'admin' ? 'In Progress' : t.status,
                    replies: [...(t.replies || []), {
                        ...reply,
                        date: new Date().toISOString()
                    }]
                };
            }
            return t;
        }));
    };

    const deleteTicket = (ticketId) => {
        setSupportTickets(prev => prev.filter(t => t.id !== ticketId));
        showNotification("Ticket removed successfully.");
    };

    const deleteAccount = () => {
        setUser(null);
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
            // Format items for backend: { productId, variantId, quantity, price, categoryId, subcategoryId }
            const formattedItems = items.map(item => ({
                productId: item.productId || item.id,
                variantId: item.variantId || item.id,
                quantity: item.qty || item.quantity,
                price: item.price,
                categoryId: item.categoryId || '',
                subcategoryId: item.subcategoryId || ''
            }));

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

    // Homepage Sections Management
    const [homepageSections, setHomepageSections] = useState(() => {
        try {
            const saved = localStorage.getItem('homepageSections');
            const parsed = saved ? JSON.parse(saved) : null;

            const defaultState = {
                'category-showcase': {
                    id: 'category-showcase',
                    label: 'Category Showcase',
                    items: []
                },
                'price-range-showcase': {
                    id: 'price-range-showcase',
                    label: 'Luxury in Range',
                    items: []
                },
                'perfect-gift': {
                    id: 'perfect-gift',
                    label: 'Find the Perfect Gift',
                    items: []
                },
                'new-launch': {
                    id: 'new-launch',
                    label: 'Limited Edition',
                    items: []
                },
                'latest-drop': {
                    id: 'latest-drop',
                    label: 'Latest Drop',
                    items: []
                },
                'most-gifted': {
                    id: 'most-gifted',
                    label: 'Most Gifted Items',
                    items: []
                },
                'proposal-rings': {
                    id: 'proposal-rings',
                    label: 'Proposal Rings',
                    items: []
                },
                'curated-for-you': {
                    id: 'curated-for-you',
                    label: 'Curated For You',
                    items: []
                },
                'style-it-your-way': {
                    id: 'style-it-your-way',
                    label: 'Style It Your Way',
                    items: []
                }
            };

            // Force merge 'category-showcase' if missing (e.g. from older state)
            if (parsed && !parsed['category-showcase']) {
                parsed['category-showcase'] = defaultState['category-showcase'];
            }

            // Force merge 'price-range-showcase' if missing
            if (parsed && !parsed['price-range-showcase']) {
                parsed['price-range-showcase'] = defaultState['price-range-showcase'];
            }

            // Force merge 'perfect-gift' if missing
            if (parsed && !parsed['perfect-gift']) {
                parsed['perfect-gift'] = defaultState['perfect-gift'];
            }

            // Force merge 'new-launch' if missing
            if (parsed && !parsed['new-launch']) {
                parsed['new-launch'] = defaultState['new-launch'];
            }

            // Force merge 'latest-drop' if missing
            if (parsed && !parsed['latest-drop']) {
                parsed['latest-drop'] = defaultState['latest-drop'];
            }

            // Force merge 'most-gifted' if missing
            if (parsed && !parsed['most-gifted']) {
                parsed['most-gifted'] = defaultState['most-gifted'];
            }

            // Force merge 'proposal-rings' if missing
            if (parsed && !parsed['proposal-rings']) {
                parsed['proposal-rings'] = defaultState['proposal-rings'];
            }

            // Force merge 'curated-for-you' if missing
            if (parsed && !parsed['curated-for-you']) {
                parsed['curated-for-you'] = defaultState['curated-for-you'];
            }

            // Force merge 'style-it-your-way' if missing
            if (parsed && !parsed['style-it-your-way']) {
                parsed['style-it-your-way'] = defaultState['style-it-your-way'];
            }

            // Migration: Remove (15% OFF) from label if present
            if (parsed && parsed['category-showcase'] && parsed['category-showcase'].label.includes('(15% OFF)')) {
                parsed['category-showcase'].label = 'Category Showcase';
            }

            return parsed || defaultState;
        } catch (error) {
            console.error("Error parsing homepageSections:", error);
            return {
                'category-showcase': {
                    id: 'category-showcase',
                    label: 'Category Showcase',
                    items: []
                }
            };
        }
    });

    useEffect(() => {
        localStorage.setItem('homepageSections', JSON.stringify(homepageSections));
    }, [homepageSections]);

    const updateSection = (sectionId, newData) => {
        setHomepageSections(prev => ({
            ...prev,
            [sectionId]: { ...prev[sectionId], ...newData }
        }));
        showNotification("Section updated successfully");
    };

    // Product & Bulk Management
    const updateProduct = (id, updatedData) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const bulkUpdatePrices = (config) => {
        const { type, value, category, productIds } = config;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        setProducts(prev => prev.map(product => {
            // Filter logic
            const matchCategory = !category || category === 'all' || product.category === category;
            const matchIds = !productIds || productIds.includes(product.id);

            if (matchCategory && matchIds) {
                // Products in mockData have variants. We need to update prices in variants.
                const updatedVariants = (product.variants || []).map(variant => {
                    let newPrice = variant.price;
                    let newMrp = variant.mrp;

                    switch (type) {
                        case 'increase_amount':
                            newPrice += numValue;
                            newMrp += numValue;
                            break;
                        case 'decrease_amount':
                            newPrice = Math.max(0, newPrice - numValue);
                            newMrp = Math.max(0, newMrp - numValue);
                            break;
                        case 'increase_percent':
                            newPrice = Math.round(newPrice * (1 + numValue / 100));
                            newMrp = Math.round(newMrp * (1 + numValue / 100));
                            break;
                        case 'decrease_percent':
                            newPrice = Math.round(newPrice * (1 - numValue / 100));
                            newMrp = Math.round(newMrp * (1 - numValue / 100));
                            break;
                        case 'set_price':
                            newPrice = numValue;
                            break;
                        default:
                            break;
                    }

                    return {
                        ...variant,
                        price: newPrice,
                        mrp: newMrp,
                        discount: newMrp > 0 ? `${Math.round(((newMrp - newPrice) / newMrp) * 100)}%off` : '0%off'
                    };
                });

                return { ...product, variants: updatedVariants };
            }
            return product;
        }));

        showNotification("Bulk price update completed successfully!");
    };

    const getActiveCoupons = () => {
        return coupons.filter(c => c.active);
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
            cart, wishlist, user, orders, addresses, supportTickets,
            login, logout, placeOrder, addToCart, addToWishlist,
            removeFromCart, removeFromWishlist, updateQuantity, clearCart,
            addAddress, removeAddress, updateAddress, setDefaultAddress,
            defaultAddressId, createTicket, updateTicketStatus, addTicketReply, deleteTicket,

            showNotification, deleteAccount,
            coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon, getActiveCoupons, validateCoupon,
            notificationsEnabled, userNotifications, toggleNotificationSettings, deleteUserNotification,
            isMenuOpen, toggleMenu,

            products, updateProduct, bulkUpdatePrices,
            categories, banners, isLoading: isCatalogueLoading,

            // Homepage Sections Management
            homepageSections, updateSection
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
