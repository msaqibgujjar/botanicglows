import React, { useState, useEffect } from 'react';
import { Search, UserX, Eye } from 'lucide-react';
import { customerStore, orderStore } from '../services/adminData.js';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        setCustomers(customerStore.getAll());
    }, []);

    const filtered = customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleBlock = (id) => {
        const c = customerStore.getById(id);
        customerStore.update(id, { status: c.status === 'Active' ? 'Blocked' : 'Active' });
        setCustomers(customerStore.getAll());
    };

    const handleDelete = () => {
        customerStore.remove(deleteId);
        setCustomers(customerStore.getAll());
        setDeleteId(null);
    };

    const getCustomerOrders = (name) => {
        return orderStore.getAll().filter((o) => o.customer === name);
    };

    const statusBadge = (status) => {
        return `admin-badge ${status === 'Active' ? 'admin-badge-success' : 'admin-badge-danger'}`;
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>Customers</h1>
                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    {customers.length} registered users
                </span>
            </div>

            <div className="admin-toolbar">
                <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="admin-card">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan="7" className="admin-empty">No customers found.</td></tr>
                            )}
                            {filtered.map((c) => (
                                <tr key={c.id}>
                                    <td><strong>{c.name}</strong></td>
                                    <td>{c.email}</td>
                                    <td>{c.phone}</td>
                                    <td>{c.orders}</td>
                                    <td>${c.totalSpent.toFixed(2)}</td>
                                    <td><span className={statusBadge(c.status)}>{c.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-secondary"
                                                onClick={() => setSelectedCustomer(c)}
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-outline"
                                                onClick={() => toggleBlock(c.id)}
                                            >
                                                <UserX size={14} />
                                            </button>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-danger"
                                                onClick={() => setDeleteId(c.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <div className="admin-modal-overlay" onClick={() => setSelectedCustomer(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
                        <h2>{selectedCustomer.name}</h2>
                        <div style={{ fontSize: '0.9rem', lineHeight: 2, marginBottom: '1rem' }}>
                            <div><strong>Email:</strong> {selectedCustomer.email}</div>
                            <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
                            <div><strong>Joined:</strong> {selectedCustomer.joinDate}</div>
                            <div><strong>Status:</strong> <span className={statusBadge(selectedCustomer.status)}>{selectedCustomer.status}</span></div>
                        </div>

                        <h3 style={{ fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', marginBottom: '0.75rem' }}>Order History</h3>
                        {getCustomerOrders(selectedCustomer.name).length === 0 ? (
                            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>No orders found.</p>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th></tr>
                                    </thead>
                                    <tbody>
                                        {getCustomerOrders(selectedCustomer.name).map((o) => (
                                            <tr key={o.id}>
                                                <td>#{o.id}</td>
                                                <td>{new Date(o.date).toLocaleDateString()}</td>
                                                <td>${o.total.toFixed(2)}</td>
                                                <td><span className={`admin-badge ${o.status === 'Delivered' ? 'admin-badge-success' : 'admin-badge-info'}`}>{o.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-outline" onClick={() => setSelectedCustomer(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Delete Customer</h2>
                        <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
