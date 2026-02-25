import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Truck, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { orderStore } from '../services/adminData.js';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const statusIcons = { Pending: Clock, Processing: Package, Shipped: Truck, Delivered: CheckCircle, Cancelled: XCircle };

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [tracking, setTracking] = useState('');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await orderStore.getById(id);
            if (data) {
                setOrder(data);
                setTracking(data.trackingNumber || '');
            }
            setLoading(false);
        };
        load();
    }, [id]);

    const updateStatus = async (newStatus) => {
        await orderStore.update(id, { orderStatus: newStatus });
        setOrder((prev) => ({ ...prev, status: newStatus }));
        setSuccess(`Status updated to ${newStatus}`);
        setTimeout(() => setSuccess(''), 2000);
    };

    const saveTracking = async () => {
        await orderStore.update(id, { trackingNumber: tracking });
        setOrder((prev) => ({ ...prev, trackingNumber: tracking }));
        setSuccess('Tracking number saved!');
        setTimeout(() => setSuccess(''), 2000);
    };

    if (loading) return <div className="admin-loading">Loading order...</div>;
    if (!order) return <div className="admin-card"><p>Order not found</p></div>;

    const currentStep = statusSteps.indexOf(order.status);

    return (
        <div>
            <div className="admin-page-header">
                <h1>Order #{String(order.id).slice(-6)}</h1>
                <button className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/orders')}>
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {success && <div className="admin-alert admin-alert-success">{success}</div>}

            {/* Status Progress */}
            {order.status !== 'Cancelled' && (
                <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {statusSteps.map((step, i) => {
                            const Icon = statusIcons[step];
                            const isActive = i <= currentStep;
                            return (
                                <div key={step} style={{ textAlign: 'center', flex: 1, opacity: isActive ? 1 : 0.3 }}>
                                    <Icon size={24} color={isActive ? 'var(--admin-primary)' : '#ccc'} />
                                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{step}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="admin-grid-2">
                {/* Order Info */}
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Customer</h2>
                    <p><strong>{order.customer}</strong></p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>{order.email}</p>
                    {order.phone && <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>{order.phone}</p>}
                    <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>{order.address}</p>
                </div>

                {/* Status Update */}
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Update Status</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {[...statusSteps, 'Cancelled'].map((s) => (
                            <button key={s} className={`admin-btn admin-btn-sm ${order.status === s ? 'admin-btn-primary' : 'admin-btn-outline'}`}
                                onClick={() => updateStatus(s)}>{s}</button>
                        ))}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Tracking Number</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <input className="admin-input" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Enter tracking number" />
                            <button className="admin-btn admin-btn-primary" onClick={saveTracking}><Save size={14} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="admin-card" style={{ marginTop: '1.25rem' }}>
                <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Items</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
                        <tbody>
                            {(order.items || []).map((item, i) => (
                                <tr key={i}>
                                    <td>{item.name}</td>
                                    <td>${(item.price || 0).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 600 }}>Total</td>
                                <td style={{ fontWeight: 600 }}>${(order.total || 0).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
