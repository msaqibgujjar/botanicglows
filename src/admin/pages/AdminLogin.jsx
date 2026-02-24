import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, User } from 'lucide-react';
import '../admin.css';

const AdminLogin = () => {
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }
        const result = await login(username, password);
        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-logo">🌿 Botanic Glows</div>
                <h1>Admin Panel</h1>
                <p className="admin-login-subtitle">Sign in to manage your store</p>

                {error && (
                    <div className="admin-alert admin-alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label htmlFor="username">
                            <User size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="admin-input"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="admin-form-group">
                        <label htmlFor="password">
                            <Lock size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="admin-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-btn admin-btn-primary admin-btn-block"
                        disabled={loading}
                        style={{ marginTop: '0.5rem' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#999' }}>
                    Default: admin / admin123
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
