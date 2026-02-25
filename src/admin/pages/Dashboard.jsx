import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { getStats, getWeeklySales } from '../services/adminData.js';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, lowStockAlerts: 0, recentOrders: [] });
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [statsData, salesData] = await Promise.all([getStats(), getWeeklySales()]);
            setStats(statsData);
            setSales(salesData);
            setLoading(false);
        };
        load();
    }, []);

    const maxSale = Math.max(...sales.map((s) => s.amount), 1);

    const statCards = [
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'blue' },
        { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'green' },
        { label: 'Products', value: stats.totalProducts, icon: Package, color: 'purple' },
        { label: 'Low Stock', value: stats.lowStockAlerts, icon: AlertTriangle, color: 'orange' },
    ];

    if (loading) return <div className="admin-loading">Loading dashboard...</div>;

    return (
        <div>
            <div className="admin-page-header"><h1>Dashboard</h1></div>

            <div className="admin-stats-grid">
                {statCards.map((s) => (
                    <div className="admin-stat-card" key={s.label}>
                        <div className={`admin-stat-icon ${s.color}`}><s.icon size={22} /></div>
                        <div className="admin-stat-info">
                            <h3>{s.value}</h3>
                            <p>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Weekly Sales Chart */}
            <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Weekly Sales</h2>
                <div className="admin-chart">
                    {sales.map((s) => (
                        <div className="admin-chart-bar-group" key={s.day}>
                            <div className="admin-chart-bar" style={{ height: `${(s.amount / maxSale) * 100}%` }}></div>
                            <span className="admin-chart-label">{s.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Recent Orders</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                            {(stats.recentOrders || []).slice(0, 8).map((o, i) => (
                                <tr key={o.id || i}>
                                    <td>{o.customer || o.customerName}</td>
                                    <td>${(o.total || o.totalAmount || 0).toFixed(2)}</td>
                                    <td><span className={`admin-badge admin-badge-${(o.status || o.orderStatus || '').toLowerCase()}`}>{o.status || o.orderStatus}</span></td>
                                    <td>{new Date(o.date || o.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
