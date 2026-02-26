import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogPosts } from '../services/api';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogPosts().then(data => { setPosts(data); setLoading(false); });
    }, []);

    return (
        <div className="blog-page container">
            <div className="blog-header">
                <h1>The Journal</h1>
                <p>Tips, guides, and stories for a beautiful life.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>Loading posts...</div>
            ) : (
                <div className="blog-grid">
                    {posts.map(post => (
                        <article key={post.id} className="blog-card">
                            <div className="blog-img">
                                <img src={post.image} alt={post.title} />
                            </div>
                            <div className="blog-content">
                                <span className="blog-date">{post.date}</span>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt || post.content?.substring(0, 120) + '...'}</p>
                                <Link to="#" className="read-more">Read More →</Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}

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
