import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user on startup
    useEffect(() => {
        const token = localStorage.getItem('sands_token');
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const res = await api.get('auth/me');
            if (res.data.success) {
                // The backend success utility wraps everything in a 'data' field
                const userData = res.data.data?.user || res.data.user;
                if (userData) {
                    setUser(userData);
                    localStorage.setItem('sands_current_user', JSON.stringify(userData));
                }
            }
        } catch (err) {
            console.error("Failed to load user:", err.message);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // --- USER AUTH (OTP) ---
    const sendOtp = async (phone) => {
        try {
            const res = await api.post('auth/send-otp', { phone });
            return res.data;
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Failed to send OTP" };
        }
    };

    const verifyOtp = async (phone, otp, profileData = {}) => {
        try {
            const payload = {
                phone,
                otp,
                ...(profileData?.name ? { name: profileData.name } : {}),
                ...(profileData?.email ? { email: profileData.email } : {})
            };
            const res = await api.post('auth/verify-otp', payload);
            if (res.data.success) {
                const { user: userData, token } = res.data.data;
                setUser(userData);
                localStorage.setItem('sands_token', token);
                localStorage.setItem('sands_current_user', JSON.stringify(userData));
                toast.success("Login successful!");
            }
            return res.data;
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Invalid OTP" };
        }
    };

    // --- ADMIN AUTH ---
    const adminLogin = async (email, password) => {
        try {
            const res = await api.post('auth/admin/login', { email, password });
            if (res.data.success) {
                // Backend returns { success: true, data: { token, user } }
                const { user: userData, token } = res.data.data;
                setUser(userData);
                localStorage.setItem('sands_token', token);
                localStorage.setItem('sands_current_user', JSON.stringify(userData));
                toast.success("Admin login successful!");
            }
            return res.data;
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Invalid admin credentials" };
        }
    };

    // --- SELLER AUTH ---
    const sellerRegister = async (sellerData) => {
        try {
            const config = sellerData instanceof FormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : undefined;
            const res = await api.post('auth/seller/register', sellerData, config);
            return res.data;
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Seller registration failed" };
        }
    };

    const sellerLogin = async (identifier, password) => {
        try {
            const res = await api.post('auth/seller/login', { identifier, password });
            if (res.data.success) {
                const { user: userData, token } = res.data.data;
                const normalizedUser = userData?.role ? userData : { ...userData, role: 'seller' };
                setUser(normalizedUser);
                localStorage.setItem('sands_token', token);
                localStorage.setItem('sands_current_user', JSON.stringify(normalizedUser));
                toast.success("Seller login successful!");
            }
            return res.data;
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Invalid seller credentials" };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sands_token');
        localStorage.removeItem('sands_current_user');
        toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            sendOtp, 
            verifyOtp, 
            adminLogin, 
            sellerRegister, 
            sellerLogin, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
