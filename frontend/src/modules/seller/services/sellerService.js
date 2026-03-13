// Mock Service for Seller Authentication and Management
export const sellerService = {
    // Registration with status PENDING
    register: async (sellerData) => {
        const sellers = JSON.parse(localStorage.getItem('seller_data') || '[]');
        const newSeller = {
            ...sellerData,
            id: Date.now().toString(),
            status: 'PENDING',
            registrationDate: new Date().toISOString()
        };
        sellers.push(newSeller);
        localStorage.setItem('seller_data', JSON.stringify(sellers));

        // Add notification for Admin
        const adminNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
        adminNotifications.unshift({
            id: Date.now(),
            title: 'New Seller Registration Request',
            message: `${newSeller.fullName} has applied for a seller account for ${newSeller.shopName}.`,
            date: new Date().toISOString(),
            unread: true,
            isRead: false,
            type: 'SELLER_REQUEST',
            link: '/admin/sellers'
        });
        localStorage.setItem('admin_notifications', JSON.stringify(adminNotifications));
        
        return { success: true, message: "Your account has been submitted for admin verification. You can login only after approval." };
    },

    // Ensure test account exists
    initTestAccount: () => {
        const sellers = JSON.parse(localStorage.getItem('seller_data') || '[]');
        if (!sellers.find(s => s.email === 'seller@gmail.com')) {
            sellers.push({
                id: 'test-seller-1',
                fullName: 'Default Seller',
                shopName: 'Sands Ornaments Test Store',
                email: 'seller@gmail.com',
                mobileNumber: '9999999999',
                password: '123456',
                status: 'APPROVED',
                registrationDate: new Date().toISOString(),
                gstNumber: '22AAAAA0000A1Z5',
                panNumber: 'ABCDE1234F',
                shopAddress: '123, Jewel Square, Mumbai',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            });
            localStorage.setItem('seller_data', JSON.stringify(sellers));
        }
    },

    // Login with status checks
    login: async (identifier, password) => {
        const sellers = JSON.parse(localStorage.getItem('seller_data') || '[]');
        const seller = sellers.find(s => (s.email === identifier || s.mobileNumber === identifier) && s.password === password);

        if (!seller) {
            return { success: false, message: "Invalid email/mobile or password" };
        }

        if (seller.status === 'PENDING') {
            return { success: false, message: "Your seller account is under review by admin." };
        }

        if (seller.status === 'REJECTED') {
            return { success: false, message: "Your seller registration was rejected. Please contact support." };
        }

        if (seller.status === 'APPROVED') {
            localStorage.setItem('sellerAuth', 'true');
            localStorage.setItem('currentSeller', JSON.stringify(seller));
            return { success: true };
        }

        return { success: false, message: "Unknown account status" };
    },

    logout: () => {
        localStorage.removeItem('sellerAuth');
        localStorage.removeItem('currentSeller');
    },

    getCurrentSeller: () => {
        const seller = localStorage.getItem('currentSeller');
        return seller ? JSON.parse(seller) : null;
    },

    // Admin Methods to Manage Sellers
    getAllSellers: () => {
        return JSON.parse(localStorage.getItem('seller_data') || '[]');
    },

    getSellerById: (id) => {
        const sellers = JSON.parse(localStorage.getItem('seller_data') || '[]');
        return sellers.find(s => s.id === id);
    },

    updateSellerStatus: async (sellerId, status, reason = null) => {
        let sellers = JSON.parse(localStorage.getItem('seller_data') || '[]');
        sellers = sellers.map(s => s.id === sellerId ? { ...s, status, rejectionReason: reason } : s);
        localStorage.setItem('seller_data', JSON.stringify(sellers));
        return { success: true };
    }
};

// Initialize default test account
sellerService.initTestAccount();
