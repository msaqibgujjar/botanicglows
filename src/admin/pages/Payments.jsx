import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Banknote, DollarSign } from 'lucide-react';
import { orderStore, settingsStore } from '../services/adminData.js';

const Payments = () => {
    const [tab, setTab] = useState('transactions');
    const [orders, setOrders] = useState([]);
    const [settings, setSettings] = useState(settingsStore.get());
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setOrders(orderStore.getAll());
    }, []);

    const transactions = orders.map((o) => ({
        id: `TXN-${o.id}`,
        orderId: o.id,
        customer: o.customer,
        amount: o.total,
        method: o.paymentMethod,
        date: o.date,
        status: o.status === 'Cancelled' ? 'Refunded' : o.status === 'Delivered' ? 'Completed' : 'Pending',
    }));

    const totalRevenue = transactions.filter((t) => t.status !== 'Refunded').reduce((s, t) => s + t.amount, 0);
    const completedPayments = transactions.filter((t) => t.status === 'Completed').length;
    const pendingPayments = transactions.filter((t) => t.status === 'Pending').length;

    const togglePaymentMethod = (method) => {
        const updated = {
            ...settings,
            paymentMethods: {
                ...settings.paymentMethods,
                [method]: !settings.paymentMethods[method],
            },
        };
        setSettings(updated);
        settingsStore.save(updated);
        setSuccess('Payment settings updated!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const statusBadge = (status) => {
        const map = { Completed: 'admin-badge-success', Pending: 'admin-badge-warning', Refunded: 'admin-badge-danger' };
        return `admin-badge ${map[status] || 'admin-badge-neutral'}`;
    };

    const paymentMethods = [
        { key: 'creditCard', label: 'Credit/Debit Card', icon: CreditCard, description: 'Stripe payment gateway' },
        { key: 'jazzCash', label: 'JazzCash', icon: Smartphone, description: 'JazzCash mobile payments' },
        { key: 'easyPaisa', label: 'EasyPaisa', icon: Smartphone, description: 'EasyPaisa mobile wallet' },
        { key: 'cashOnDelivery', label: 'Cash on Delivery', icon: Banknote, description: 'Pay when delivered' },
    ];

    return (
        <div>
            <div className="admin-page-header">
                <h1>Payments</h1>
            </div>

            {success && <div className="admin-alert admin-alert-success">{success}</div>}

            {/* Payment Stats */}
            <div className="admin-stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon green"><DollarSign size={22} /></div>
                    <div className="admin-stat-info">
                        <h3>${totalRevenue.toFixed(2)}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon blue"><CreditCard size={22} /></div>
                    <div className="admin-stat-info">
                        <h3>{completedPayments}</h3>
                        <p>Completed Payments</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon orange"><CreditCard size={22} /></div>
                    <div className="admin-stat-info">
                        <h3>{pendingPayments}</h3>
                        <p>Pending Payments</p>
                    </div>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={`admin-tab ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')}>
                    Transactions
                </button>
                <button className={`admin-tab ${tab === 'methods' ? 'active' : ''}`} onClick={() => setTab('methods')}>
                    Payment Methods
                </button>
            </div>

            {tab === 'transactions' && (
                <div className="admin-card">
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td><strong>{t.id}</strong></td>
                                        <td>#{t.orderId}</td>
                                        <td>{t.customer}</td>
                                        <td>${t.amount.toFixed(2)}</td>
                                        <td>{t.method}</td>
                                        <td>{new Date(t.date).toLocaleDateString()}</td>
                                        <td><span className={statusBadge(t.status)}>{t.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'methods' && (
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Payment Gateways</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '1.5rem' }}>
                        Enable or disable payment methods for your store.
                    </p>
                    {paymentMethods.map((pm) => (
                        <div key={pm.key} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-sm)',
                            marginBottom: '0.75rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="admin-stat-icon green" style={{ width: 40, height: 40 }}>
                                    <pm.icon size={18} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{pm.label}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{pm.description}</div>
                                </div>
                            </div>
                            <label className="admin-toggle">
                                <input type="checkbox" checked={settings.paymentMethods[pm.key]} onChange={() => togglePaymentMethod(pm.key)} />
                                <span className="admin-toggle-slider"></span>
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Payments;
