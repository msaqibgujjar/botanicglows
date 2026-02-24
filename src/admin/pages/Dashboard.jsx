import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, DollarSign, Package, AlertTriangle, ArrowRight } from 'lucide-react';
import { getStats, getWeeklySales, orderStore } from '../services/adminData.js';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, lowStockAlerts: 0 });
    const [sales, setSales] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        setStats(getStats());
        setSales(getWeeklySales());
        setRecentOrders(orderStore.getAll().slice(0, 5));
    }, []);

    const maxSale = Math.max(...sales.map((s) => s.amount), 1);

    const statusBadge = (status) => {
        const map = {
            Pending: 'admin-badge-warning',
            Processing: 'admin-badge-info',
            Shipped: 'admin-badge-info',
            Delivered: 'admin-badge-success',
            Cancelled: 'admin-badge-danger',
        };
        return `admin-badge ${map[status] || 'admin-badge-neutral'}`;
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>Dashboard</h1>
                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    Welcome back! Here's what's happening today.
                </span>
            </div>

            {/* Stats */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon blue">
                        <ShoppingCart size={22} />
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon green">
                        <DollarSign size={22} />
                    </div>
                    <div className="admin-stat-info">
                        <h3>${stats.totalRevenue.toLocaleString()}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon orange">
                        <Package size={22} />
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.totalProducts}</h3>
                        <p>Total Products</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon red">
                        <AlertTriangle size={22} />
                    </div>
                    <div className="admin-stat-info">
                        <h3>{stats.lowStockAlerts}</h3>
                        <p>Low Stock Alerts</p>
                    </div>
                </div>
            </div>

            <div className="admin-grid-2">
                {/* Sales Chart */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2>Weekly Sales</h2>
                    </div>
                    <div className="admin-chart">
                        {sales.map((s, i) => (
                            <div className="admin-chart-bar" key={i}>
                                <div className="admin-chart-bar-value">${s.amount}</div>
                                <div
                                    className="admin-chart-bar-fill"
                                    style={{ height: `${(s.amount / maxSale) * 100}%` }}
                                />
                                <div className="admin-chart-bar-label">{s.day}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2>Recent Orders</h2>
                        <Link to="/admin/orders" className="admin-btn admin-btn-sm admin-btn-secondary">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td><strong>#{order.id}</strong></td>
                                        <td>{order.customer}</td>
                                        <td>${order.total.toFixed(2)}</td>
                                        <td><span className={statusBadge(order.status)}>{order.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
