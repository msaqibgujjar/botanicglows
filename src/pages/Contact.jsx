import React from 'react';
import Button from '../components/ui/Button';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message sent! (Mock)');
    };

    return (
        <div className="contact-page container">
            <div className="contact-header">
                <h1>Get in Touch</h1>
                <p>We'd love to hear from you. Our team is always here to help.</p>
            </div>

            <div className="contact-grid">
                <div className="contact-form-section">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" placeholder="Your Name" required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="you@example.com" required />
                        </div>
                        <div className="form-group">
                            <label>Subject</label>
                            <input type="text" placeholder="How can we help?" required />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea rows="5" placeholder="Your message..." required></textarea>
                        </div>
                        <Button variant="primary" type="submit">Send Message</Button>
                    </form>
                </div>

                <div className="contact-info">
                    <div className="info-card">
                        <div className="icon-box"><Mail size={24} /></div>
                        <h3>Email Us</h3>
                        <p>hello@botanicglows.com</p>
                        <p>support@botanicglows.com</p>
                    </div>
                    <div className="info-card">
                        <div className="icon-box"><Phone size={24} /></div>
                        <h3>Call Us</h3>
                        <p>+1 (555) 123-4567</p>
                        <p>Mon-Fri, 9am - 6pm EST</p>
                    </div>
                    <div className="info-card">
                        <div className="icon-box"><MapPin size={24} /></div>
                        <h3>Visit Us</h3>
                        <p>123 Botanical Ave,</p>
                        <p>New York, NY 10012</p>
                    </div>
                </div>
            </div>

            <div className="map-section">
                {/* Mock Map */}
                <div className="mock-map">
                    Google Map Placeholder
                </div>
            </div>

            <style>{`
                .contact-page {
                    padding-top: 8rem;
                    padding-bottom: 6rem;
                }
                .contact-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                .contact-header h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                .contact-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 4rem;
                    margin-bottom: 6rem;
                }
                .contact-form {
                    background-color: var(--color-surface);
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--color-text-main);
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-sm);
                    font-family: var(--font-body);
                }
                .form-group input:focus, .form-group textarea:focus {
                    outline: 1px solid var(--color-primary);
                    border-color: var(--color-primary);
                }
                .contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .info-card {
                    background-color: var(--color-secondary);
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    text-align: center;
                }
                .icon-box {
                    margin-bottom: 1rem;
                    color: var(--color-primary-dark);
                }
                .info-card h3 {
                    margin-bottom: 0.5rem;
                    font-family: var(--font-heading);
                }
                .info-card p {
                    color: var(--color-text-muted);
                }
                .map-section {
                    height: 400px;
                    background-color: #f0f0f0;
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }
                .mock-map {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                    font-weight: 600;
                    background-image: url("https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80");
                    background-size: cover;
                    background-position: center;
                }
                @media (max-width: 768px) {
                    .contact-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Contact;
