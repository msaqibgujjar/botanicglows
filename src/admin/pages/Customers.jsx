import React, { useState, useEffect } from 'react';
import { Search, Ban, Trash2, Eye } from 'lucide-react';
import { customerStore } from '../services/adminData.js';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await customerStore.getAll();
            setCustomers(data);
            setLoading(false);
        };
        load();
    }, []);

    const filtered = customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleBlock = async (id) => {
        const updated = await customerStore.toggleBlock(id);
        if (updated) {
            setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
        }
    };

    const deleteCustomer = async (id) => {
        if (!window.confirm('Delete this customer?')) return;
        await customerStore.remove(id);
        setCustomers((prev) => prev.filter((c) => c.id !== id));
    };

    const viewOrders = async (customer) => {
        setSelectedCustomer(customer);
        const orders = await customerStore.getOrders(customer.id);
        setCustomerOrders(orders);
    };

    if (loading) return <div className="admin-loading">Loading customers...</div>;

    return (
        <div>
            <div className="admin-page-header">
                <h1>Customers ({filtered.length})</h1>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={16} />
                    <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => (
                                <tr key={c.id}>
                                    <td><strong>{c.name}</strong></td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || '—'}</td>
                                    <td>{c.orders}</td>
                                    <td>${(c.totalSpent || 0).toFixed(2)}</td>
                                    <td><span className={`admin-badge admin-badge-${c.status.toLowerCase()}`}>{c.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button className="admin-btn admin-btn-sm admin-btn-outline" title="View Orders" onClick={() => viewOrders(c)}>
                                                <Eye size={14} />
                                            </button>
                                            <button className="admin-btn admin-btn-sm admin-btn-outline" title={c.status === 'Blocked' ? 'Unblock' : 'Block'}
                                                onClick={() => toggleBlock(c.id)}>
                                                <Ban size={14} />
                                            </button>
                                            <button className="admin-btn admin-btn-sm admin-btn-danger" title="Delete" onClick={() => deleteCustomer(c.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Orders Modal */}
            {selectedCustomer && (
                <div className="admin-modal-overlay" onClick={() => setSelectedCustomer(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
                        <h3>{selectedCustomer.name}'s Orders</h3>
                        {customerOrders.length === 0 ? (
                            <p style={{ color: 'var(--admin-text-muted)' }}>No orders found.</p>
                        ) : (
                            <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
                                <table className="admin-table">
                                    <thead><tr><th>Order</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                                    <tbody>
                                        {customerOrders.map((o, i) => (
                                            <tr key={o._id || i}>
                                                <td>#{String(o._id || '').slice(-6)}</td>
                                                <td>${(o.totalAmount || 0).toFixed(2)}</td>
                                                <td><span className={`admin-badge admin-badge-${(o.orderStatus || '').toLowerCase()}`}>{o.orderStatus}</span></td>
                                                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <button className="admin-btn admin-btn-outline" style={{ marginTop: '1rem' }} onClick={() => setSelectedCustomer(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
