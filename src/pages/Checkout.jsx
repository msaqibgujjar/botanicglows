import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { fetchShippingCities, fetchShippingRate } from '../services/api';

const paymentMethods = [
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your order arrives' },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, etc.' },
    { id: 'jazzcash', label: 'JazzCash', icon: Smartphone, desc: 'Pay via JazzCash mobile wallet' },
    { id: 'easypaisa', label: 'EasyPaisa', icon: Smartphone, desc: 'Pay via EasyPaisa mobile wallet' },
];

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [phone, setPhone] = useState('');

    // Province/City
    const [citiesData, setCitiesData] = useState({});
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [shippingRate, setShippingRate] = useState(null);
    const [loadingRate, setLoadingRate] = useState(false);

    // Load cities on mount
    useEffect(() => {
        fetchShippingCities().then(setCitiesData);
    }, []);

    // Fetch shipping rate when city changes
    useEffect(() => {
        if (selectedProvince && selectedCity) {
            setLoadingRate(true);
            fetchShippingRate(selectedProvince, selectedCity).then(rate => {
                setShippingRate(rate);
                setLoadingRate(false);
            });
        } else {
            setShippingRate(null);
        }
    }, [selectedProvince, selectedCity]);

    const provinces = Object.keys(citiesData);
    const availableCities = selectedProvince ? (citiesData[selectedProvince] || []) : [];
    const finalShipping = shippingRate || 0;
    const orderTotal = cartTotal + finalShipping;

    if (cartItems.length === 0 && step !== 3) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <Link to="/shop"><Button variant="primary">Continue Shopping</Button></Link>
            </div>
        );
    }

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!selectedProvince || !selectedCity) {
            alert('Please select your province and city');
            return;
        }
        setStep(3);
        clearCart();
        window.scrollTo(0, 0);
    };

    if (step === 3) {
        const method = paymentMethods.find(m => m.id === selectedPayment);
        return (
            <div className="container success-container">
                <div className="success-card">
                    <div className="success-icon">✓</div>
                    <h2>Thank You for Your Order!</h2>
                    <p>Your order #BG{Math.floor(Math.random() * 10000)} has been placed successfully.</p>
                    <p className="payment-confirm">Payment Method: <strong>{method?.label}</strong></p>
                    {selectedPayment === 'cod' && <p className="payment-note">Please keep the exact amount ready at the time of delivery.</p>}
                    {(selectedPayment === 'jazzcash' || selectedPayment === 'easypaisa') && <p className="payment-note">You will receive a payment request on your mobile shortly.</p>}
                    <Link to="/"><Button variant="primary">Return Home</Button></Link>
                </div>
                <style>{`
                    .success-container { padding: 8rem 0; display: flex; justify-content: center; }
                    .success-card { text-align: center; background: var(--color-surface); padding: 3rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); max-width: 500px; }
                    .success-icon { width: 60px; height: 60px; border-radius: 50%; background: var(--color-primary); color: white; font-size: 1.8rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
                    .success-card h2 { color: var(--color-primary-dark); margin-bottom: 1rem; }
                    .success-card p { margin-bottom: 1rem; color: var(--color-text-muted); }
                    .payment-confirm { background: var(--color-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-sm); display: inline-block; }
                    .payment-note { font-size: 0.9rem; font-style: italic; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="checkout-page container">
            <h1>Checkout</h1>
            <div className="checkout-grid">
                <div className="checkout-form">
                    <form onSubmit={handlePlaceOrder}>
                        <section className="form-section">
                            <h3>Contact Information</h3>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" required placeholder="you@example.com" />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" required placeholder="03XX XXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        </section>

                        <section className="form-section">
                            <h3>Shipping Address</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" required />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Street Address</label>
                                <input type="text" required placeholder="House no, Street, Area" />
                            </div>

                            {/* Province / City */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Province *</label>
                                    <select
                                        required
                                        value={selectedProvince}
                                        onChange={(e) => {
                                            setSelectedProvince(e.target.value);
                                            setSelectedCity('');
                                            setShippingRate(null);
                                        }}
                                        className="form-select"
                                    >
                                        <option value="">Select Province</option>
                                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>City *</label>
                                    <select
                                        required
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        disabled={!selectedProvince}
                                        className={`form-select ${!selectedProvince ? 'disabled' : ''}`}
                                    >
                                        <option value="">{selectedProvince ? 'Select City' : 'Select province first'}</option>
                                        {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Postal Code</label>
                                <input type="text" placeholder="Optional" />
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="form-section">
                            <h3>Payment Method</h3>
                            <div className="payment-methods">
                                {paymentMethods.map(method => {
                                    const Icon = method.icon;
                                    return (
                                        <label
                                            key={method.id}
                                            className={`payment-option ${selectedPayment === method.id ? 'selected' : ''}`}
                                        >
                                            <input type="radio" name="paymentMethod" value={method.id} checked={selectedPayment === method.id} onChange={(e) => setSelectedPayment(e.target.value)} />
                                            <div className="payment-option-content">
                                                <div className="payment-icon"><Icon size={22} /></div>
                                                <div>
                                                    <div className="payment-label">{method.label}</div>
                                                    <div className="payment-desc">{method.desc}</div>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </section>

                        {selectedPayment === 'card' && (
                            <section className="form-section card-details">
                                <h3>Card Details</h3>
                                <div className="form-group"><label>Card Number</label><input type="text" placeholder="0000 0000 0000 0000" required /></div>
                                <div className="form-row">
                                    <div className="form-group"><label>Expiry Date</label><input type="text" placeholder="MM/YY" required /></div>
                                    <div className="form-group"><label>CVV</label><input type="text" placeholder="123" required /></div>
                                </div>
                            </section>
                        )}

                        {(selectedPayment === 'jazzcash' || selectedPayment === 'easypaisa') && (
                            <section className="form-section wallet-details">
                                <h3>{selectedPayment === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Account</h3>
                                <div className="form-group"><label>Mobile Account Number</label><input type="tel" placeholder="03XX XXXXXXX" required /></div>
                                <p className="wallet-note">You will receive a payment confirmation request on this number.</p>
                            </section>
                        )}

                        {selectedPayment === 'cod' && (
                            <div className="cod-note">
                                <p>💰 You will pay <strong>Rs. {orderTotal.toFixed(0)}</strong> in cash when your order is delivered.</p>
                            </div>
                        )}

                        <Button variant="primary" type="submit" fullWidth style={{ marginTop: '2rem' }}>
                            {selectedPayment === 'cod' ? `Place Order — Rs. ${orderTotal.toFixed(0)}` : `Pay Rs. ${orderTotal.toFixed(0)}`}
                        </Button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="checkout-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <div className="summary-img">
                                    <img src={item.image} alt={item.name} />
                                    <span className="qty-badge">{item.quantity}</span>
                                </div>
                                <div className="summary-details">
                                    <span>{item.name}</span>
                                    <span>Rs. {(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="summary-line">
                        <span>Subtotal</span>
                        <span>Rs. {cartTotal.toFixed(0)}</span>
                    </div>
                    <div className="summary-line shipping-line">
                        <span>Shipping {selectedCity && <span className="shipping-city">({selectedCity})</span>}</span>
                        <span>
                            {!selectedCity ? (
                                <span className="select-city-hint">Select city</span>
                            ) : loadingRate ? (
                                <span className="loading-rate">...</span>
                            ) : shippingRate === 0 ? (
                                <span className="free-shipping">Free</span>
                            ) : (
                                `Rs. ${shippingRate}`
                            )}
                        </span>
                    </div>
                    <div className="total-row">
                        <span>Total</span>
                        <span>Rs. {orderTotal.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            <style>{`
                .checkout-page { padding-top: 8rem; padding-bottom: 6rem; }
                .checkout-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 4rem; }
                .form-section { margin-bottom: 2rem; }
                .form-section h3 { margin-bottom: 1rem; font-size: 1.2rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; }
                .form-group { margin-bottom: 1rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; }
                .form-group input, .form-select { width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 0.95rem; background: white; }
                .form-group input:focus, .form-select:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(76,175,80,0.1); }
                .form-select { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1em; cursor: pointer; }
                .form-select.disabled { background-color: #f5f5f5; color: #999; cursor: not-allowed; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

                .payment-methods { display: flex; flex-direction: column; gap: 0.75rem; }
                .payment-option { display: flex; align-items: center; padding: 1rem 1.25rem; border: 2px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s ease; background: var(--color-surface); }
                .payment-option:hover { border-color: var(--color-primary); background: rgba(76,175,80,0.02); }
                .payment-option.selected { border-color: var(--color-primary); background: rgba(76,175,80,0.05); box-shadow: 0 0 0 1px var(--color-primary); }
                .payment-option input[type="radio"] { display: none; }
                .payment-option-content { display: flex; align-items: center; gap: 1rem; width: 100%; }
                .payment-icon { width: 44px; height: 44px; border-radius: var(--radius-sm); background: var(--color-secondary); display: flex; align-items: center; justify-content: center; color: var(--color-primary-dark); flex-shrink: 0; }
                .payment-label { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.15rem; }
                .payment-desc { font-size: 0.8rem; color: var(--color-text-muted); }

                .card-details, .wallet-details { animation: slideDown 0.3s ease; background: var(--color-secondary); padding: 1.5rem; border-radius: var(--radius-md); }
                .wallet-note { font-size: 0.85rem; color: var(--color-text-muted); font-style: italic; margin-top: 0.5rem; }
                .cod-note { background: var(--color-secondary); padding: 1.25rem; border-radius: var(--radius-md); margin-top: 1rem; border-left: 4px solid var(--color-primary); }
                .cod-note p { margin: 0; font-size: 0.95rem; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

                .checkout-summary { background-color: var(--color-secondary); padding: 2rem; border-radius: var(--radius-lg); height: fit-content; position: sticky; top: 6rem; }
                .summary-items { margin-bottom: 1.5rem; }
                .summary-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .summary-img { position: relative; width: 60px; height: 60px; }
                .summary-img img { width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md); border: 1px solid rgba(0,0,0,0.1); }
                .qty-badge { position: absolute; top: -8px; right: -8px; background-color: var(--color-text-muted); color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; }
                .summary-details { flex: 1; display: flex; justify-content: space-between; font-size: 0.9rem; }
                .summary-line { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0.5rem; }
                .shipping-city { font-size: 0.8rem; }
                .select-city-hint { font-size: 0.8rem; color: var(--color-primary); font-style: italic; }
                .loading-rate { color: var(--color-text-muted); }
                .free-shipping { color: var(--color-primary-dark); font-weight: 600; }
                .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 1.2rem; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 1rem; margin-top: 0.5rem; }
                @media (max-width: 768px) {
                    .checkout-grid { grid-template-columns: 1fr; display: flex; flex-direction: column-reverse; }
                    .form-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Checkout;
