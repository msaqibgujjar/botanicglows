import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Leaf, Sun } from 'lucide-react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="hero">
    <div className="container hero-container">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Unlock Your Natural Glow</h1>
        <p>Experience the power of organic botanical skincare designed to nourish, repair, and illuminate your skin.</p>
        <Link to="/shop">
          <Button variant="primary">Shop Collection</Button>
        </Link>
      </motion.div>
      <motion.div
        className="hero-image"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <img src="https://images.unsplash.com/photo-1556228720-19777f987f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Natural Skincare Products" />
      </motion.div>
    </div>
    <style>{`
      .hero {
        background-color: var(--color-background);
        padding: 8rem 0 4rem;
        min-height: 80vh;
        display: flex;
        align-items: center;
      }

      .hero-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
      }

      .hero-content h1 {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        line-height: 1.1;
      }

      .hero-content p {
        font-size: 1.1rem;
        color: var(--color-text-muted);
        margin-bottom: 2rem;
        max-width: 90%;
      }

      .hero-image img {
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
      }

      @media (max-width: 768px) {
        .hero {
          padding: 6rem 0 3rem;
        }

        .hero-container {
          grid-template-columns: 1fr;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 2.5rem;
        }

        .hero-content p {
          margin: 0 auto 2rem;
        }
      }
    `}</style>
  </section>
);

const Features = () => (
  <section className="features-section">
    <div className="container">
      <div className="features-grid">
        <div className="feature-item">
          <Leaf size={32} color="var(--color-primary)" />
          <h3>100% Organic</h3>
          <p>Sourced from sustainable farms.</p>
        </div>
        <div className="feature-item">
          <Droplets size={32} color="var(--color-primary)" />
          <h3>Deep Hydration</h3>
          <p>Formulated for lasting moisture.</p>
        </div>
        <div className="feature-item">
          <Sun size={32} color="var(--color-primary)" />
          <h3>Cruelty Free</h3>
          <p>Tested on humans, never animals.</p>
        </div>
      </div>
    </div>
    <style>{`
      .features-section {
        padding: 4rem 0;
        background-color: var(--color-secondary);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        text-align: center;
      }
      .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
      .feature-item h3 {
        font-family: var(--font-body);
        font-size: 1.1rem;
        margin-bottom: 0;
        font-weight: 600;
      }
      .feature-item p {
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }
      @media (max-width: 768px) {
        .features-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </section>
);

const FeaturedProducts = () => {
  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    fetchProducts({ bestsellers: 'true', limit: 4 }).then(setFeatured);
  }, []);
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Best Sellers</h2>
          <Link to="/shop" className="view-all-link">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="product-grid">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <style>{`
        .section {
          padding: 6rem 0;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }
        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-primary-dark);
          font-weight: 500;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }
      `}</style>
    </section>
  );
};

const AboutSection = () => (
  <section className="about-section">
    <div className="container about-container">
      <div className="about-image">
        <img src="https://images.unsplash.com/photo-1552693673-1bf958298935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Natural Ingredients" />
      </div>
      <div className="about-content">
        <h2>Nature's Best Kept Secret</h2>
        <p>At Botanic Glows, we believe that true beauty comes from nature. Our formulas are crafted with ethically sourced botanicals, free from harsh chemicals and synthetic fragrances.</p>
        <p>We combine ancient herbal wisdom with modern dermatological science to create skincare that not only works but feels luxurious.</p>
        <Link to="/about">
          <Button variant="outline">Our Story</Button>
        </Link>
      </div>
    </div>
    <style>{`
      .about-section {
        padding: 6rem 0;
        background-color: var(--color-background);
      }
      .about-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
      }
      .about-image img {
        border-radius: var(--radius-lg);
        height: 100%;
        object-fit: cover;
      }
      .about-content h2 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
      }
      .about-content p {
        margin-bottom: 1.5rem;
        color: var(--color-text-muted);
      }
      @media (max-width: 768px) {
        .about-container {
          grid-template-columns: 1fr;
        }
        .about-image {
          order: 2;
        }
      }
    `}</style>
  </section>
);

const Testimonials = () => (
  <section className="testimonials-section">
    <div className="container">
      <h2>Loved by Thousands</h2>
      <div className="testimonials-grid">
        <div className="testimonial-card">
          <div className="stars">★★★★★</div>
          <p>"The Glow Radiance Serum has completely transformed my skin. I've never felt more confident!"</p>
          <h4>- Sarah M.</h4>
        </div>
        <div className="testimonial-card">
          <div className="stars">★★★★★</div>
          <p>"Finally, a natural brand that actually delivers results. The night oil is a game changer."</p>
          <h4>- Jessica K.</h4>
        </div>
        <div className="testimonial-card">
          <div className="stars">★★★★★</div>
          <p>"I love the sustainable packaging and the clean ingredients. Botanic Glows is my new favorite."</p>
          <h4>- Emily R.</h4>
        </div>
      </div>
    </div>
    <style>{`
      .testimonials-section {
        padding: 6rem 0;
        background-color: var(--color-secondary);
        text-align: center;
      }
      .testimonials-section h2 {
        margin-bottom: 3rem;
        font-family: var(--font-heading);
        font-size: 2.5rem;
      }
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
      .testimonial-card {
        background-color: var(--color-surface);
        padding: 2.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .stars {
        color: var(--color-primary);
        margin-bottom: 1.5rem;
        font-size: 1.2rem;
        letter-spacing: 2px;
      }
      .testimonial-card p {
        font-style: italic;
        margin-bottom: 2rem;
        color: var(--color-text-muted);
        line-height: 1.6;
      }
      .testimonial-card h4 {
        font-family: var(--font-body);
        font-weight: 600;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: auto;
      }
      @media (max-width: 768px) {
        .testimonials-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </section>
);

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <FeaturedProducts />
      <AboutSection />
      <Testimonials />
    </div>
  );
};

export default Home;
