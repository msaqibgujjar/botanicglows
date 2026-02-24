import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Truck, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { orderStore } from '../services/adminData.js';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [tracking, setTracking] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const o = orderStore.getById(id);
        if (o) {
            setOrder(o);
            setTracking(o.trackingNumber || '');
        } else {
            navigate('/admin/orders');
        }
    }, [id, navigate]);

    if (!order) return null;

    const updateStatus = (status) => {
        orderStore.update(id, { status });
        setOrder({ ...order, status });
        setSuccess(`Status updated to ${status}`);
        setTimeout(() => setSuccess(''), 2000);
    };

    const saveTracking = () => {
        orderStore.update(id, { trackingNumber: tracking });
        setOrder({ ...order, trackingNumber: tracking });
        setSuccess('Tracking number saved!');
        setTimeout(() => setSuccess(''), 2000);
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

    const currentStep = statusSteps.indexOf(order.status);

    return (
        <div>
            <div className="admin-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => navigate('/admin/orders')}>
                        <ArrowLeft size={16} />
                    </button>
                    <h1>Order #{order.id}</h1>
                    <span className={statusBadge(order.status)}>{order.status}</span>
                </div>
            </div>

            {success && <div className="admin-alert admin-alert-success">{success}</div>}

            {/* Order Progress */}
            {order.status !== 'Cancelled' && (
                <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '1rem 0' }}>
                        {statusSteps.map((step, i) => (
                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: i <= currentStep ? 'var(--admin-primary)' : 'var(--admin-border)',
                                    color: i <= currentStep ? 'white' : 'var(--admin-text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '0.5rem'
                                }}>
                                    {i === 0 && <Clock size={16} />}
                                    {i === 1 && <Package size={16} />}
                                    {i === 2 && <Truck size={16} />}
                                    {i === 3 && <CheckCircle size={16} />}
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: i <= currentStep ? 600 : 400, color: i <= currentStep ? 'var(--admin-text)' : 'var(--admin-text-muted)' }}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="admin-grid-2">
                {/* Order Items */}
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Order Items</h2>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, i) => (
                                    <tr key={i}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <img src={item.image} alt={item.name} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                                            {item.name}
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td><strong>${(item.price * item.quantity).toFixed(2)}</strong></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>
                        Total: ${order.total.toFixed(2)}
                    </div>
                </div>

                {/* Customer & Actions */}
                <div>
                    <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Customer Info</h2>
                        <div style={{ fontSize: '0.9rem', lineHeight: 2 }}>
                            <div><strong>Name:</strong> {order.customer}</div>
                            <div><strong>Email:</strong> {order.email}</div>
                            <div><strong>Phone:</strong> {order.phone}</div>
                            <div><strong>Address:</strong> {order.address}</div>
                            <div><strong>Payment:</strong> {order.paymentMethod}</div>
                            <div><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Update Status</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {statusSteps.map((s) => (
                                <button
                                    key={s}
                                    className={`admin-btn admin-btn-sm ${order.status === s ? 'admin-btn-primary' : 'admin-btn-outline'}`}
                                    onClick={() => updateStatus(s)}
                                >{s}</button>
                            ))}
                            <button
                                className={`admin-btn admin-btn-sm ${order.status === 'Cancelled' ? 'admin-btn-danger' : 'admin-btn-outline'}`}
                                style={{ color: order.status !== 'Cancelled' ? 'var(--admin-danger)' : undefined }}
                                onClick={() => updateStatus('Cancelled')}
                            >
                                <XCircle size={14} /> Cancel
                            </button>
                        </div>
                    </div>

                    <div className="admin-card">
                        <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Tracking</h2>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                className="admin-input"
                                value={tracking}
                                onChange={(e) => setTracking(e.target.value)}
                                placeholder="Enter tracking number"
                            />
                            <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={saveTracking}>
                                <Save size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
