import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user, logout: authLogout } = useAuth();
    const isUserRole = user?.role === 'user';
    const hasAuthToken = () => Boolean(localStorage.getItem('sands_token'));

    // ── State ────────────────────────────────────────────────────────────────
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        return localStorage.getItem('notificationsEnabled') === 'true';
    });

    const [userNotifications, setUserNotifications] = useState(() => {
        const saved = localStorage.getItem('userNotifications');
        return saved ? JSON.parse(saved) : [];
    });

    // ── Persistence ──────────────────────────────────────────────────────────
    useEffect(() => {
        localStorage.setItem('notificationsEnabled', notificationsEnabled);
    }, [notificationsEnabled]);

    useEffect(() => {
        localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
    }, [userNotifications]);

    // ── fetchNotifications ───────────────────────────────────────────────────
    const fetchNotifications = useCallback(async () => {
        if (!isUserRole || !hasAuthToken()) return;
        try {
            const res = await api.get('user/notifications');
            if (res.data.success) {
                const list = res.data.data?.notifications || res.data.notifications || [];
                setUserNotifications(list.map(note => ({ ...note, id: note._id || note.id })));
            }
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401 || status === 403) { authLogout({ silent: true }); return; }
            console.error('Fetch notifications failed', err);
        }
    }, [isUserRole, authLogout]);

    // ── deleteUserNotification (mark as read) ────────────────────────────────
    const deleteUserNotification = useCallback(async (id) => {
        if (!isUserRole || !hasAuthToken()) return;
        try {
            await api.patch(`user/notifications/${id}/read`);
            await fetchNotifications();
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401 || status === 403) { authLogout({ silent: true }); return; }
            setUserNotifications(prev => prev.filter(n => (n._id || n.id) !== id));
        }
    }, [isUserRole, fetchNotifications, authLogout]);

    // ── toggleNotificationSettings ───────────────────────────────────────────
    const toggleNotificationSettings = useCallback(() => {
        setNotificationsEnabled(prev => !prev);
    }, []);

    // ── clearOnDelete ────────────────────────────────────────────────────────
    const clearNotificationsOnDelete = useCallback(() => {
        setUserNotifications([]);
        localStorage.removeItem('userNotifications');
        localStorage.removeItem('notificationsEnabled');
    }, []);

    const refreshNotifications = useCallback(() => fetchNotifications(), [fetchNotifications]);

    const value = {
        userNotifications, notificationsEnabled,
        fetchNotifications, deleteUserNotification,
        toggleNotificationSettings, refreshNotifications,
        clearNotificationsOnDelete,
        // Expose setter for ShopContext clear-on-logout
        setUserNotifications,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotification must be used inside NotificationProvider');
    return ctx;
};

export default NotificationContext;
