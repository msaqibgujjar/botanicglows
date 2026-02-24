import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success

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
        setStep(3);
        clearCart();
        window.scrollTo(0, 0);
    };

    if (step === 3) {
        return (
            <div className="container success-container">
                <div className="success-card">
                    <h2>Thank You for Your Order!</h2>
                    <p>Your order #BG{Math.floor(Math.random() * 10000)} has been placed successfully.</p>
                    <p>We've sent a confirmation email to you.</p>
                    <Link to="/">
                        <Button variant="primary">Return Home</Button>
                    </Link>
                </div>
                <style>{`
                    .success-container {
                        padding: 8rem 0;
                        display: flex;
                        justify-content: center;
                    }
                    .success-card {
                        text-align: center;
                        background: var(--color-surface);
                        padding: 3rem;
                        border-radius: var(--radius-lg);
                        box-shadow: var(--shadow-md);
                        max-width: 500px;
                    }
                    .success-card h2 {
                        color: var(--color-primary-dark);
                        margin-bottom: 1rem;
                    }
                    .success-card p {
                        margin-bottom: 2rem;
                        color: var(--color-text-muted);
                    }
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
                                <label>Address</label>
                                <input type="text" required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" required />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input type="text" required />
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h3>Payment Details</h3>
                            <div className="form-group">
                                <label>Card Number</label>
                                <input type="text" placeholder="0000 0000 0000 0000" required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input type="text" placeholder="MM/YY" required />
                                </div>
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input type="text" placeholder="123" required />
                                </div>
                            </div>
                        </section>

                        <Button variant="primary" type="submit" fullWidth style={{ marginTop: '2rem' }}>
                            Place Order - ${cartTotal.toFixed(2)}
                        </Button>
                    </form>
                </div>

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
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="total-row">
                        <span>Total to Pay</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <style>{`
                .checkout-page {
                    padding-top: 8rem;
                    padding-bottom: 6rem;
                }
                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 4rem;
                }
                .form-section {
                    margin-bottom: 2rem;
                }
                .form-section h3 {
                    margin-bottom: 1rem;
                    font-size: 1.2rem;
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 0.5rem;
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .form-group input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-sm);
                    font-family: var(--font-body);
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .checkout-summary {
                    background-color: var(--color-secondary);
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    height: fit-content;
                }
                .summary-items {
                    margin-bottom: 2rem;
                }
                .summary-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .summary-img {
                    position: relative;
                    width: 60px;
                    height: 60px;
                }
                .summary-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: var(--radius-md);
                    border: 1px solid rgba(0,0,0,0.1);
                }
                .qty-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background-color: var(--color-text-muted);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .summary-details {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9rem;
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    font-size: 1.2rem;
                    border-top: 1px solid rgba(0,0,0,0.1);
                    padding-top: 1rem;
                }
                @media (max-width: 768px) {
                    .checkout-grid {
                        grid-template-columns: 1fr;
                        display: flex;
                        flex-direction: column-reverse;
                    }
                }
            `}</style>
        </div>
    );
};

export default Checkout;
