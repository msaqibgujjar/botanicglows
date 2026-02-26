import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchContent } from '../services/api';

const About = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchContent('about').then(d => { if (d) setData(d); });
    }, []);

    if (!data) return <div className="about-page container" style={{ paddingTop: '8rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>;

    return (
        <div className="about-page container">
            <motion.div
                className="about-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>{data.heroTitle || 'Our Story'}</h1>
                <p>{data.heroSubtitle || 'Rooted in nature, backed by science.'}</p>
            </motion.div>

            <div className="about-content">
                {(data.sections || []).map((s, i) => (
                    <div key={i} className={`about-section ${i % 2 === 1 ? 'reverse' : ''}`}>
                        <img src={s.image} alt={s.title} />
                        <div className="text">
                            <h2>{s.title}</h2>
                            <p>{s.text}</p>
                        </div>
                    </div>
                ))}

                <div className="mission-values">
                    {(data.values || []).map((v, i) => (
                        <div className="value-card" key={i}>
                            <h3>{v.title}</h3>
                            <p>{v.text}</p>
                        </div>
                    ))}
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
                    direction: ltr;
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
