import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart container">
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't discovered your glow yet.</p>
                <Link to="/shop">
                    <Button variant="primary">Start Shopping</Button>
                </Link>
                <style>{`
                    .empty-cart {
                        padding: 10rem 0;
                        text-align: center;
                    }
                    .empty-cart h2 {
                        font-family: var(--font-heading);
                        font-size: 2.5rem;
                        margin-bottom: 1rem;
                    }
                    .empty-cart p {
                        color: var(--color-text-muted);
                        margin-bottom: 2rem;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            <h1>Your Cart</h1>
            <div className="cart-grid">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-image">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="cart-item-details">
                                <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                                <p className="item-price">${item.price.toFixed(2)}</p>
                                <div className="item-controls">
                                    <div className="quantity-ctrl">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                            <div className="item-total">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <Link to="/checkout" style={{ display: 'block' }}>
                        <Button variant="primary" fullWidth>
                            Proceed to Checkout <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </Button>
                    </Link>
                </div>
            </div>

            <style>{`
                .cart-page {
                    padding-top: 8rem;
                    padding-bottom: 6rem;
                }

                .cart-page h1 {
                    font-size: 2.5rem;
                    margin-bottom: 3rem;
                    text-align: center;
                }

                .cart-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 4rem;
                }

                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .cart-item {
                    display: grid;
                    grid-template-columns: 100px 1fr auto;
                    gap: 1.5rem;
                    align-items: center;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .cart-item-image img {
                    width: 100%;
                    border-radius: var(--radius-md);
                    aspect-ratio: 1;
                    object-fit: cover;
                }

                .item-name {
                    font-family: var(--font-heading);
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                    display: block;
                }

                .item-price {
                    color: var(--color-text-muted);
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }

                .item-controls {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .quantity-ctrl {
                    display: flex;
                    align-items: center;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-full);
                    padding: 0 0.25rem;
                }

                .quantity-ctrl button {
                    padding: 0.4rem;
                    color: var(--color-text-muted);
                }

                .quantity-ctrl span {
                    min-width: 1.5rem;
                    text-align: center;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .remove-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.85rem;
                    color: #ef4444;
                }

                .item-total {
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .cart-summary {
                    background-color: var(--color-background);
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    height: fit-content;
                }

                .cart-summary h3 {
                    margin-bottom: 1.5rem;
                    font-size: 1.2rem;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    color: var(--color-text-muted);
                }

                .summary-row.total {
                    border-top: 1px solid var(--color-border);
                    padding-top: 1rem;
                    margin-top: 1rem;
                    margin-bottom: 2rem;
                    font-weight: 700;
                    color: var(--color-text-main);
                    font-size: 1.2rem;
                }

                @media (max-width: 768px) {
                    .cart-grid {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    
                    .cart-item {
                        grid-template-columns: 80px 1fr;
                    }
                    
                    .item-total {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Cart;
