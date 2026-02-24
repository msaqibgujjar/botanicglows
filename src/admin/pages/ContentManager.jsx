import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit } from 'lucide-react';
import { contentStore, blogStore } from '../services/adminData.js';

const ContentManager = () => {
    const [tab, setTab] = useState('homepage');
    const [content, setContent] = useState(contentStore.get());
    const [blogs, setBlogs] = useState([]);
    const [success, setSuccess] = useState('');
    const [editingBlog, setEditingBlog] = useState(null);
    const [blogForm, setBlogForm] = useState({ title: '', content: '', image: '', status: 'Draft' });

    useEffect(() => {
        setBlogs(blogStore.getAll());
    }, []);

    const saveContent = () => {
        contentStore.save(content);
        setSuccess('Content saved successfully!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleContentChange = (field, value) => {
        setContent((prev) => ({ ...prev, [field]: value }));
    };

    const handleFaqChange = (index, field, value) => {
        const faq = [...content.faqItems];
        faq[index] = { ...faq[index], [field]: value };
        setContent((prev) => ({ ...prev, faqItems: faq }));
    };

    const addFaq = () => {
        setContent((prev) => ({ ...prev, faqItems: [...prev.faqItems, { q: '', a: '' }] }));
    };

    const removeFaq = (index) => {
        setContent((prev) => ({
            ...prev,
            faqItems: prev.faqItems.filter((_, i) => i !== index),
        }));
    };

    // Blog CRUD
    const saveBlog = () => {
        if (!blogForm.title) return;
        if (editingBlog) {
            blogStore.update(editingBlog.id, { ...blogForm, date: new Date().toISOString().split('T')[0] });
        } else {
            blogStore.create({ ...blogForm, date: new Date().toISOString().split('T')[0] });
        }
        setBlogs(blogStore.getAll());
        setEditingBlog(null);
        setBlogForm({ title: '', content: '', image: '', status: 'Draft' });
        setSuccess(editingBlog ? 'Blog updated!' : 'Blog created!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const deleteBlog = (id) => {
        blogStore.remove(id);
        setBlogs(blogStore.getAll());
    };

    const tabs = ['homepage', 'blog', 'faq'];

    return (
        <div>
            <div className="admin-page-header">
                <h1>Content Management</h1>
            </div>

            {success && <div className="admin-alert admin-alert-success">{success}</div>}

            <div className="admin-tabs">
                {tabs.map((t) => (
                    <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Homepage */}
            {tab === 'homepage' && (
                <div className="admin-card">
                    <div className="admin-form-group">
                        <label>Hero Title</label>
                        <input className="admin-input" value={content.heroTitle} onChange={(e) => handleContentChange('heroTitle', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                        <label>Hero Subtitle</label>
                        <textarea className="admin-input admin-textarea" value={content.heroSubtitle} onChange={(e) => handleContentChange('heroSubtitle', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                        <label>About Section Text</label>
                        <textarea className="admin-input admin-textarea" value={content.aboutText} onChange={(e) => handleContentChange('aboutText', e.target.value)} />
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={saveContent}>
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            )}

            {/* Blog */}
            {tab === 'blog' && (
                <div>
                    <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>
                            {editingBlog ? 'Edit Post' : 'New Blog Post'}
                        </h2>
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input className="admin-input" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} placeholder="Blog title..." />
                        </div>
                        <div className="admin-form-group">
                            <label>Content</label>
                            <textarea className="admin-input admin-textarea" style={{ minHeight: 120 }} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="Write your blog post..." />
                        </div>
                        <div className="admin-grid-2">
                            <div className="admin-form-group">
                                <label>Image URL</label>
                                <input className="admin-input" value={blogForm.image} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="admin-form-group">
                                <label>Status</label>
                                <select className="admin-input admin-select" value={blogForm.status} onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}>
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="admin-btn admin-btn-primary" onClick={saveBlog}>
                                <Save size={16} /> {editingBlog ? 'Update' : 'Publish'}
                            </button>
                            {editingBlog && (
                                <button className="admin-btn admin-btn-outline" onClick={() => { setEditingBlog(null); setBlogForm({ title: '', content: '', image: '', status: 'Draft' }); }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="admin-card">
                        <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>All Posts</h2>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr><th>Title</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {blogs.map((b) => (
                                        <tr key={b.id}>
                                            <td><strong>{b.title}</strong></td>
                                            <td>{b.date}</td>
                                            <td><span className={`admin-badge ${b.status === 'Published' ? 'admin-badge-success' : 'admin-badge-neutral'}`}>{b.status}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className="admin-btn admin-btn-sm admin-btn-outline"
                                                        onClick={() => { setEditingBlog(b); setBlogForm({ title: b.title, content: b.content, image: b.image, status: b.status }); }}>
                                                        <Edit size={14} />
                                                    </button>
                                                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteBlog(b.id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* FAQ */}
            {tab === 'faq' && (
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', margin: 0 }}>FAQ Items</h2>
                        <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={addFaq}>
                            <Plus size={14} /> Add FAQ
                        </button>
                    </div>

                    {content.faqItems.map((faq, i) => (
                        <div key={i} style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-sm)', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong style={{ fontSize: '0.85rem' }}>FAQ #{i + 1}</strong>
                                <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => removeFaq(i)}>
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <div className="admin-form-group">
                                <label>Question</label>
                                <input className="admin-input" value={faq.q} onChange={(e) => handleFaqChange(i, 'q', e.target.value)} />
                            </div>
                            <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                <label>Answer</label>
                                <textarea className="admin-input admin-textarea" value={faq.a} onChange={(e) => handleFaqChange(i, 'a', e.target.value)} />
                            </div>
                        </div>
                    ))}

                    <button className="admin-btn admin-btn-primary" onClick={saveContent} style={{ marginTop: '0.5rem' }}>
                        <Save size={16} /> Save FAQ
                    </button>
                </div>
            )}
        </div>
    );
};

export default ContentManager;
