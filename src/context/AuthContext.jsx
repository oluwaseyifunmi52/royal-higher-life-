import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/authApi';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getProfile()
                .then((response) => {
                    const profile = response.data?.user ?? response.data?.data?.user ?? response.data?.data;
                    setUser(profile ?? null);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const loginUser = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logoutUser = () => {
        const token = localStorage.getItem('token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (token) api.post('/api/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
        sessionStorage.removeItem('adminRole');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
