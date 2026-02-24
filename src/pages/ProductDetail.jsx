import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';
import { Star, Minus, Plus, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    if (!product) {
        return <div className="container" style={{ padding: '8rem 0' }}>Product not found</div>;
    }

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    const handleQuantityChange = (type) => {
        if (type === 'inc') setQuantity(prev => prev + 1);
        if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
    };

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="product-main">
                    <motion.div
                        className="product-gallery"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <img src={product.image} alt={product.name} />
                    </motion.div>

                    <motion.div
                        className="product-info-section"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="product-header">
                            <span className="product-category">{product.category}</span>
                            <h1>{product.name}</h1>
                            <div className="product-rating-large">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "var(--color-primary)" : "none"} color="var(--color-primary)" />
                                    ))}
                                </div>
                                <span>{product.rating} ({product.reviews} reviews)</span>
                            </div>
                            <p className="product-price-large">${product.price.toFixed(2)}</p>
                        </div>

                        <p className="product-short-desc">{product.description}</p>

                        <div className="product-actions">
                            <div className="quantity-selector">
                                <button onClick={() => handleQuantityChange('dec')}><Minus size={16} /></button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange('inc')}><Plus size={16} /></button>
                            </div>
                            <Button variant="primary" className="add-to-cart-btn" fullWidth onClick={handleAddToCart}>
                                Add to Cart - ${(product.price * quantity).toFixed(2)}
                            </Button>
                        </div>

                        <div className="product-features">
                            <div className="feature">
                                <Truck size={20} />
                                <span>Free Shipping over $50</span>
                            </div>
                            <div className="feature">
                                <RotateCcw size={20} />
                                <span>30-Day Returns</span>
                            </div>
                            <div className="feature">
                                <ShieldCheck size={20} />
                                <span>Secure Checkout</span>
                            </div>
                        </div>

                        <div className="product-tabs">
                            <div className="tab-headers">
                                <button
                                    className={activeTab === 'description' ? 'active' : ''}
                                    onClick={() => setActiveTab('description')}
                                >
                                    Description
                                </button>
                                <button
                                    className={activeTab === 'ingredients' ? 'active' : ''}
                                    onClick={() => setActiveTab('ingredients')}
                                >
                                    Ingredients
                                </button>
                                <button
                                    className={activeTab === 'usage' ? 'active' : ''}
                                    onClick={() => setActiveTab('usage')}
                                >
                                    How to Use
                                </button>
                            </div>
                            <div className="tab-content">
                                {activeTab === 'description' && (
                                    <p>{product.description} Can be used mainly for {product.category.toLowerCase()}. Designed to bring out your natural glow with organic components.</p>
                                )}
                                {activeTab === 'ingredients' && (
                                    <p>Aqua, Rosa Damascena Flower Water, Glycerin, Niacinamide, Sodium Hyaluronate, Vitamin C (L-Ascorbic Acid), Tocopherol (Vitamin E), Phenoxyethanol.</p>
                                )}
                                {activeTab === 'usage' && (
                                    <p>Apply 2-3 drops to clean skin morning and night. Massage gently until fully absorbed. Follow with moisturizer.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="related-products">
                        <h3>You May Also Like</h3>
                        <div className="product-grid">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .product-detail-page {
                    padding-top: 8rem;
                    padding-bottom: 4rem;
                }

                .product-main {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    margin-bottom: 6rem;
                }

                .product-gallery img {
                    width: 100%;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }

                .product-category {
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    font-weight: 600;
                }

                .product-header h1 {
                    font-size: 2.5rem;
                    margin: 0.5rem 0;
                }

                .product-rating-large {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    color: var(--color-text-muted);
                }

                .stars {
                    display: flex;
                    gap: 2px;
                }

                .product-price-large {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--color-text-main);
                    margin-bottom: 2rem;
                }

                .product-short-desc {
                    color: var(--color-text-muted);
                    margin-bottom: 2rem;
                    line-height: 1.8;
                }

                .product-actions {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2.5rem;
                }

                .quantity-selector {
                    display: flex;
                    align-items: center;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-full);
                    padding: 0 0.5rem;
                }

                .quantity-selector button {
                    padding: 0.75rem;
                    color: var(--color-text-main);
                }

                .quantity-selector span {
                    min-width: 2rem;
                    text-align: center;
                    font-weight: 600;
                }

                .product-features {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 3rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .feature {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                }

                .product-tabs {
                    margin-top: 2rem;
                }

                .tab-headers {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .tab-headers button {
                    padding-bottom: 0.75rem;
                    font-family: var(--font-body);
                    font-weight: 500;
                    color: var(--color-text-muted);
                    position: relative;
                }

                .tab-headers button.active {
                    color: var(--color-text-main);
                }

                .tab-headers button.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: var(--color-primary);
                }

                .tab-content {
                    color: var(--color-text-muted);
                    line-height: 1.8;
                }

                .related-products h3 {
                    margin-bottom: 2rem;
                    font-size: 1.75rem;
                    text-align: center;
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    .product-main {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    
                    .product-actions {
                        flex-direction: column;
                    }
                    
                    .product-features {
                        flex-wrap: wrap;
                        gap: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductDetail;
