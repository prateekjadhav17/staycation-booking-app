import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check user authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/current-user');
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/login', { username, password });
            if (response.data && response.data.user) {
                setUser(response.data.user);
                return { success: true, message: response.data.message };
            }
            return { success: false, error: "Authentication failed" };
        } catch (err) {
            const errMsg = err.response?.data?.error || "Login failed";
            return { success: false, error: errMsg };
        }
    };

    const signup = async (username, email, password) => {
        try {
            const response = await api.post('/signup', { username, email, password });
            if (response.data && response.data.user) {
                setUser(response.data.user);
                return { success: true, message: response.data.message };
            }
            return { success: false, error: "Registration failed" };
        } catch (err) {
            const errMsg = err.response?.data?.error || "Signup failed";
            return { success: false, error: errMsg };
        }
    };

    const logout = async () => {
        try {
            await api.get('/logout');
            setUser(null);
            return { success: true };
        } catch (err) {
            console.error("Logout failed:", err);
            return { success: false, error: "Logout failed" };
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
