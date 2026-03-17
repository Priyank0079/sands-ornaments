import api from '../../../services/api';

export const sellerService = {
    // Registration with status PENDING
    register: async (sellerData) => {
        try {
            const res = await api.post('/auth/seller/register', sellerData);
            return res.data;
        } catch (err) {
            return { 
                success: false, 
                message: err.response?.data?.message || "Registration failed" 
            };
        }
    },

    // Login with status checks
    login: async (identifier, password) => {
        try {
            const res = await api.post('/auth/seller/login', { 
                email: identifier, // Identifying if its email or phone happens at backend
                password 
            });
            
            if (res.data.success) {
                localStorage.setItem('sellerAuth', 'true');
                localStorage.setItem('sellerToken', res.data.token);
                localStorage.setItem('currentSeller', JSON.stringify(res.data.user));
            }
            return res.data;
        } catch (err) {
            return { 
                success: false, 
                message: err.response?.data?.message || "Login failed" 
            };
        }
    },

    logout: () => {
        localStorage.removeItem('sellerAuth');
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('currentSeller');
    },

    getCurrentSeller: () => {
        const seller = localStorage.getItem('currentSeller');
        return seller ? JSON.parse(seller) : null;
    }
};
