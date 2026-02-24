import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import Button from '../ui/Button';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">Botanic Glows</Link>
                        <p className="footer-desc">Premium botanical skincare grounded in nature, backed by science.</p>
                        <div className="social-links">
                            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Shop</h4>
                        <ul>
                            <li><Link to="/shop?category=skincare">Skincare</Link></li>
                            <li><Link to="/shop?category=body">Body</Link></li>
                            <li><Link to="/shop?category=kits">Kits & Sets</Link></li>
                            <li><Link to="/shop?category=best-sellers">Best Sellers</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>About</h4>
                        <ul>
                            <li><Link to="/about">Our Story</Link></li>
                            <li><Link to="/blog">Journal</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <h4>Join the Glow</h4>
                        <p>Subscribe for skincare tips and exclusive offers.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Your email address" required />
                            <Button variant="primary" type="submit">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Botanic Glows. All rights reserved.</p>
                    <div className="legal-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>

            <style>{`
        .footer {
          background-color: var(--color-background);
          padding: 4rem 0 2rem;
          border-top: 1px solid var(--color-border);
          margin-top: auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .footer-logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin-bottom: 1rem;
          display: block;
        }

        .footer-desc {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
          max-width: 300px;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          color: var(--color-text-main);
          transition: color 0.2s;
        }

        .social-links a:hover {
          color: var(--color-primary);
        }

        .footer-links h4 {
          font-family: var(--font-body);
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
        }

        .footer-links ul {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-links a {
          color: var(--color-text-muted);
          font-size: 0.95rem;
        }

        .footer-links a:hover {
          color: var(--color-primary);
        }

        .footer-newsletter h4 {
          font-family: var(--font-body);
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .footer-newsletter p {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin-bottom: 1rem;
        }

        .newsletter-form {
          display: flex;
          gap: 0.5rem;
        }

        .newsletter-form input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
        }

        .newsletter-form input:focus {
          outline: 1px solid var(--color-primary);
          border-color: var(--color-primary);
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .legal-links {
          display: flex;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .footer-brand {
            justify-items: center;
            display: grid;
          }

          .footer-desc {
            margin: 0 auto 1.5rem;
          }

          .social-links {
            justify-content: center;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
