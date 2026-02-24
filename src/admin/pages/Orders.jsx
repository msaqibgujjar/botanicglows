import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import { orderStore } from '../services/adminData.js';

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        setOrders(orderStore.getAll());
    }, []);

    const filtered = orders.filter((o) => {
        const matchSearch =
            o.customer.toLowerCase().includes(search.toLowerCase()) ||
            String(o.id).includes(search);
        const matchStatus = statusFilter === 'All' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const updateStatus = (id, status) => {
        orderStore.update(id, { status });
        setOrders(orderStore.getAll());
    };

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
                <h1>Orders</h1>
                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    {filtered.length} orders found
                </span>
            </div>

            <div className="admin-toolbar">
                <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search by customer or order ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {statusOptions.map((s) => (
                    <button
                        key={s}
                        className={`admin-filter-btn ${statusFilter === s ? 'active' : ''}`}
                        onClick={() => setStatusFilter(s)}
                    >{s}</button>
                ))}
            </div>

            <div className="admin-card">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan="7" className="admin-empty">No orders found.</td></tr>
                            )}
                            {filtered.map((order) => (
                                <tr key={order.id}>
                                    <td><strong>#{order.id}</strong></td>
                                    <td>{order.customer}</td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td>${order.total.toFixed(2)}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{order.paymentMethod}</td>
                                    <td>
                                        <select
                                            className="admin-input"
                                            style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: 'auto', minWidth: '120px' }}
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                        >
                                            {statusOptions.filter((s) => s !== 'All').map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/admin/orders/${order.id}`}
                                            className="admin-btn admin-btn-sm admin-btn-secondary"
                                        >
                                            <Eye size={14} /> View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
