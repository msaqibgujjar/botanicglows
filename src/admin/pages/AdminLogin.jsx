import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminLogin = () => {
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        const result = await login(email, password);
        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.error);
        }
    };

    if (isAuthenticated) return <Navigate to="/admin" replace />;

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display, serif', color: 'var(--admin-primary)' }}>
                        🌿 Botanic Glows
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.25rem' }}>Admin Panel</p>
                </div>

                {error && <div className="admin-alert admin-alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Email</label>
                        <input
                            className="admin-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@botanicglows.com"
                            autoComplete="email"
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Password</label>
                        <input
                            className="admin-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>
                    <button className="admin-btn admin-btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999', marginTop: '1.5rem' }}>
                    Default: admin@botanicglows.com / admin123
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
