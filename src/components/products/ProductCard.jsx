import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if clicking inside link
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="product-image" />
        </Link>
        {product.isNew && <span className="badge new">New</span>}
        {product.isBestSeller && <span className="badge best-seller">Best Seller</span>}

        <div className="product-overlay">
          <Button variant="primary" className="quick-add-btn" onClick={handleAddToCart}>
            <ShoppingBag size={18} style={{ marginRight: '0.5rem' }} /> Add to Cart
          </Button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-rating">
          <Star size={14} fill="var(--color-primary)" color="var(--color-primary)" />
          <span>{product.rating}</span>
          <span className="review-count">({product.reviews})</span>
        </div>
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>

      <style>{`
        .product-card {
          position: relative;
          transition: transform 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .product-image-container {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 1rem;
          background-color: #f0f0f0;
          aspect-ratio: 1 / 1.25;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          z-index: 10;
        }

        .badge.new {
          background-color: var(--color-background);
          color: var(--color-primary-dark);
        }

        .badge.best-seller {
          background-color: var(--color-accent);
          color: var(--color-text-main);
        }

        .product-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
          transform: translateY(100%);
          transition: transform 0.3s ease;
          display: flex;
          justify-content: center;
        }

        .product-card:hover .product-overlay {
          transform: translateY(0);
        }

        .quick-add-btn {
          width: 100%;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          box-shadow: var(--shadow-md);
        }

        .product-info {
          text-align: center;
        }

        .product-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
        }

        .review-count {
          color: #999;
          font-size: 0.8rem;
        }

        .product-name {
          display: block;
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--color-text-main);
        }

        .product-name:hover {
          color: var(--color-primary);
        }

        .product-price {
          font-weight: 500;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
