import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
    LayoutDashboard, Package, ShoppingCart, Users, FileText,
    Settings, LogOut, Menu, X, CreditCard
} from 'lucide-react';
import '../admin.css';

const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Content', path: '/admin/content', icon: FileText },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-root">
            {/* Mobile toggle */}
            <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
            </button>
            <div
                className={`admin-mobile-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">🌿 Botanic Glows</div>
                    <div className="admin-sidebar-label">Admin Panel</div>
                </div>

                <nav className="admin-sidebar-nav">
                    <div className="admin-nav-section">Menu</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-nav-item" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-title">
                        {navItems.find((i) => window.location.pathname === i.path)?.label || 'Admin'}
                    </div>
                    <div className="admin-topbar-right">
                        <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                            {admin?.role}
                        </span>
                        <div className="admin-avatar">
                            {admin?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
