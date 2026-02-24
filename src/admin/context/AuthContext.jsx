import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateAdmin } from '../services/adminData.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(() => {
        const saved = localStorage.getItem('bg_admin_session');
        return saved ? JSON.parse(saved) : null;
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (admin) {
            localStorage.setItem('bg_admin_session', JSON.stringify(admin));
        } else {
            localStorage.removeItem('bg_admin_session');
        }
    }, [admin]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const result = await authenticateAdmin(username, password);
            if (result) {
                setAdmin({ username: result.username, role: result.role });
                return { success: true };
            }
            return { success: false, error: 'Invalid username or password' };
        } catch {
            return { success: false, error: 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
            {children}
        </AuthContext.Provider>
    );
};
