import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="about-page container">
            <motion.div
                className="about-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Our Story</h1>
                <p>Rooted in nature, backed by science.</p>
            </motion.div>

            <div className="about-content">
                <div className="about-section">
                    <img src="https://images.unsplash.com/photo-1556228720-19777f987f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Founder" />
                    <div className="text text-right">
                        <h2>The Beginning</h2>
                        <p>Botanic Glows was born from a desire to create skincare that is as kind to the planet as it is to your skin. Founded in 2023, our mission has always been to harness the power of botanicals to reveal your natural radiance.</p>
                    </div>
                </div>

                <div className="about-section reverse">
                    <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ingredients" />
                    <div className="text">
                        <h2>Our Philosophy</h2>
                        <p>We believe in transparency and purity. Every ingredient is carefully selected for its efficacy and sustainability. No fillers, no harsh chemicals, just pure botanical goodness.</p>
                    </div>
                </div>

                <div className="mission-values">
                    <div className="value-card">
                        <h3>Sustainability</h3>
                        <p>Packaged in recyclable glass and responsibly sourced materials.</p>
                    </div>
                    <div className="value-card">
                        <h3>Cruelty-Free</h3>
                        <p>We never test on animals, and we never will.</p>
                    </div>
                    <div className="value-card">
                        <h3>Community</h3>
                        <p>Supporting local farmers and ethical supply chains.</p>
                    </div>
                </div>
            </div>

            <style>{`
                .about-page {
                    padding-top: 8rem;
                    padding-bottom: 6rem;
                }
                .about-hero {
                    text-align: center;
                    margin-bottom: 6rem;
                }
                .about-hero h1 {
                    font-size: 3.5rem;
                    margin-bottom: 1rem;
                }
                .about-hero p {
                    font-size: 1.2rem;
                    color: var(--color-text-muted);
                }
                .about-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: center;
                    margin-bottom: 6rem;
                }
                .about-section.reverse {
                    direction: rtl;
                }
                .about-section.reverse .text {
                    direction: ltr; /* Reset text direction for content */
                }
                .about-section img {
                    width: 100%;
                    border-radius: var(--radius-lg);
                }
                .text h2 {
                    font-size: 2rem;
                    margin-bottom: 1.5rem;
                }
                .text p {
                    color: var(--color-text-muted);
                    line-height: 1.8;
                }
                .mission-values {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                    margin-top: 4rem;
                }
                .value-card {
                    background-color: var(--color-secondary);
                    padding: 2.5rem;
                    border-radius: var(--radius-lg);
                    text-align: center;
                }
                .value-card h3 {
                    margin-bottom: 1rem;
                    font-family: var(--font-heading);
                }
                @media (max-width: 768px) {
                    .about-section {
                        grid-template-columns: 1fr;
                        direction: ltr !important;
                    }
                    .about-section.reverse {
                        direction: ltr;
                    }
                    .about-section img {
                        order: 2;
                    }
                    .mission-values {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default About;
