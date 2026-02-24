import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const posts = [
        {
            id: 1,
            title: "5 Steps to Glowing Skin",
            excerpt: "Discover the simple routine that will transform your complexion naturally.",
            date: "October 12, 2023",
            image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            title: "The Benefits of Rose Hip Oil",
            excerpt: "Why this miracle ingredient should be a staple in your skincare arsenal.",
            date: "September 28, 2023",
            image: "https://images.unsplash.com/photo-1601049541289-9b3b7d5d71da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 3,
            title: "Sustainable Beauty Guide",
            excerpt: "How to make your beauty routine more eco-friendly and sustainable.",
            date: "September 15, 2023",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        }
    ];

    return (
        <div className="blog-page container">
            <div className="blog-header">
                <h1>The Journal</h1>
                <p>Tips, guides, and stories for a beautiful life.</p>
            </div>

            <div className="blog-grid">
                {posts.map(post => (
                    <article key={post.id} className="blog-card">
                        <div className="blog-img">
                            <img src={post.image} alt={post.title} />
                        </div>
                        <div className="blog-content">
                            <span className="blog-date">{post.date}</span>
                            <h3>{post.title}</h3>
                            <p>{post.excerpt}</p>
                            <Link to="#" className="read-more">Read More →</Link>
                        </div>
                    </article>
                ))}
            </div>

            <style>{`
                .blog-page {
                    padding-top: 8rem;
                    padding-bottom: 6rem;
                }
                .blog-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                .blog-header h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                .blog-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 3rem;
                }
                .blog-card {
                    transition: transform 0.3s ease;
                }
                .blog-card:hover {
                    transform: translateY(-5px);
                }
                .blog-img {
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                    aspect-ratio: 16/9;
                }
                .blog-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .blog-card:hover .blog-img img {
                    transform: scale(1.05);
                }
                .blog-date {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: block;
                    margin-bottom: 0.5rem;
                }
                .blog-content h3 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    font-family: var(--font-heading);
                }
                .blog-content p {
                    color: var(--color-text-muted);
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }
                .read-more {
                    color: var(--color-primary-dark);
                    font-weight: 500;
                    font-size: 0.95rem;
                }
            `}</style>
        </div>
    );
};

export default Blog;
