import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { orderStore } from '../services/adminData.js';

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
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

    const filtered = orders.filter((o) => {
        const matchSearch = (o.customer || '').toLowerCase().includes(search.toLowerCase()) ||
            String(o.id).includes(search);
        const matchStatus = !filterStatus || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const updateStatus = async (id, newStatus) => {
        await orderStore.update(id, { orderStatus: newStatus });
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    };

    if (loading) return <div className="admin-loading">Loading orders...</div>;

    return (
        <div>
            <div className="admin-page-header">
                <h1>Orders ({filtered.length})</h1>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={16} />
                    <input placeholder="Search by customer or order ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="admin-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="admin-card">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map((o) => (
                                <tr key={o.id}>
                                    <td><strong>#{String(o.id).slice(-6)}</strong></td>
                                    <td>{o.customer}</td>
                                    <td>${(o.total || 0).toFixed(2)}</td>
                                    <td>{o.paymentMethod}</td>
                                    <td>
                                        <select className="admin-select admin-select-sm" value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                                            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td>{new Date(o.date).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/admin/orders/${o.id}`} className="admin-btn admin-btn-sm admin-btn-outline">
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
