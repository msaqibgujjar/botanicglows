import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { orderStore, settingsStore } from '../services/adminData.js';

const Payments = () => {
    const [orders, setOrders] = useState([]);
    const [settings, setSettings] = useState(settingsStore.get());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await orderStore.getAll();
            setOrders(data);
            setLoading(false);
        };
        load();
    }, []);

    const paidOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = paidOrders.reduce((s, o) => s + (o.total || 0), 0);
    const codOrders = paidOrders.filter((o) => o.paymentMethod === 'Cash on Delivery');
    const cardOrders = paidOrders.filter((o) => o.paymentMethod !== 'Cash on Delivery');

    const togglePayment = (key) => {
        const updated = { ...settings, paymentMethods: { ...settings.paymentMethods, [key]: !settings.paymentMethods[key] } };
        setSettings(updated);
        settingsStore.save(updated);
    };

    if (loading) return <div className="admin-loading">Loading payments...</div>;

    return (
        <div>
            <div className="admin-page-header"><h1>Payments</h1></div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon green"><DollarSign size={22} /></div>
                    <div className="admin-stat-info"><h3>${totalRevenue.toFixed(2)}</h3><p>Total Revenue</p></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon blue"><CreditCard size={22} /></div>
                    <div className="admin-stat-info"><h3>{cardOrders.length}</h3><p>Card Payments</p></div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon orange"><TrendingUp size={22} /></div>
                    <div className="admin-stat-info"><h3>{codOrders.length}</h3><p>COD Orders</p></div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Payment Methods</h2>
                {Object.entries(settings.paymentMethods).map(([key, enabled]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--admin-border)' }}>
                        <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                        <label className="admin-toggle">
                            <input type="checkbox" checked={enabled} onChange={() => togglePayment(key)} />
                            <span className="admin-toggle-slider"></span>
                        </label>
                    </div>
                ))}
            </div>

            {/* Transaction History */}
            <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Recent Transactions</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                            {paidOrders.slice(0, 20).map((o) => (
                                <tr key={o.id}>
                                    <td>#{String(o.id).slice(-6)}</td>
                                    <td>{o.customer}</td>
                                    <td>${(o.total || 0).toFixed(2)}</td>
                                    <td>{o.paymentMethod}</td>
                                    <td><span className={`admin-badge admin-badge-${(o.paymentStatus || o.status || '').toLowerCase()}`}>{o.paymentStatus || o.status}</span></td>
                                    <td>{new Date(o.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
