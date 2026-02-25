import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3 } from 'lucide-react';
import { contentStore, blogStore } from '../services/adminData.js';

const tabs = ['Homepage', 'Blog Posts', 'FAQ'];

const ContentManager = () => {
    const [activeTab, setActiveTab] = useState('Homepage');
    const [content, setContent] = useState({ heroTitle: '', heroSubtitle: '', aboutText: '', faqItems: [] });
    const [blogs, setBlogs] = useState([]);
    const [blogForm, setBlogForm] = useState(null);
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [c, b] = await Promise.all([contentStore.get(), blogStore.getAll()]);
            setContent(c);
            setBlogs(b);
            setLoading(false);
        };
        load();
    }, []);

    const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 2000); };

    // Homepage
    const saveContent = async () => {
        await contentStore.save(content);
        flash('Content saved!');
    };

    // Blog
    const saveBlog = async () => {
        if (!blogForm.title) return;
        if (blogForm.id) {
            const updated = await blogStore.update(blogForm.id, blogForm);
            setBlogs((prev) => prev.map((b) => (b.id === blogForm.id ? updated : b)));
        } else {
            const created = await blogStore.create(blogForm);
            setBlogs((prev) => [...prev, created]);
        }
        setBlogForm(null);
        flash('Blog saved!');
    };

    const deleteBlog = async (id) => {
        await blogStore.remove(id);
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        flash('Blog deleted');
    };

    // FAQ
    const addFaq = () => setContent((prev) => ({ ...prev, faqItems: [...prev.faqItems, { q: '', a: '' }] }));
    const updateFaq = (i, field, val) => {
        const updated = [...content.faqItems];
        updated[i] = { ...updated[i], [field]: val };
        setContent((prev) => ({ ...prev, faqItems: updated }));
    };
    const removeFaq = (i) => setContent((prev) => ({ ...prev, faqItems: prev.faqItems.filter((_, idx) => idx !== i) }));

    if (loading) return <div className="admin-loading">Loading content...</div>;

    return (
        <div>
            <div className="admin-page-header"><h1>Content Manager</h1></div>

            {success && <div className="admin-alert admin-alert-success">{success}</div>}

            <div className="admin-tabs">
                {tabs.map((t) => (
                    <button key={t} className={`admin-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
                ))}
            </div>

            {/* Homepage Tab */}
            {activeTab === 'Homepage' && (
                <div className="admin-card">
                    <div className="admin-form-group">
                        <label>Hero Title</label>
                        <input className="admin-input" value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Hero Subtitle</label>
                        <textarea className="admin-input admin-textarea" value={content.heroSubtitle} onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>About Text</label>
                        <textarea className="admin-input admin-textarea" value={content.aboutText} onChange={(e) => setContent({ ...content, aboutText: e.target.value })} />
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={saveContent}><Save size={16} /> Save</button>
                </div>
            )}

            {/* Blog Tab */}
            {activeTab === 'Blog Posts' && (
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button className="admin-btn admin-btn-primary" onClick={() => setBlogForm({ title: '', content: '', image: '', status: 'Draft' })}>
                            <Plus size={16} /> New Post
                        </button>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead><tr><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                            <tbody>
                                {blogs.map((b) => (
                                    <tr key={b.id}>
                                        <td>{b.title}</td>
                                        <td><span className={`admin-badge admin-badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                                        <td>{b.date}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => setBlogForm(b)}><Edit3 size={14} /></button>
                                                <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteBlog(b.id)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Blog Form Modal */}
                    {blogForm && (
                        <div className="admin-modal-overlay" onClick={() => setBlogForm(null)}>
                            <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
                                <h3>{blogForm.id ? 'Edit Post' : 'New Post'}</h3>
                                <div className="admin-form-group">
                                    <label>Title</label>
                                    <input className="admin-input" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Content</label>
                                    <textarea className="admin-input admin-textarea" value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Image URL</label>
                                    <input className="admin-input" value={blogForm.image} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Status</label>
                                    <select className="admin-input admin-select" value={blogForm.status} onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}>
                                        <option>Draft</option><option>Published</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button className="admin-btn admin-btn-primary" onClick={saveBlog}><Save size={16} /> Save</button>
                                    <button className="admin-btn admin-btn-outline" onClick={() => setBlogForm(null)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'FAQ' && (
                <div className="admin-card">
                    {content.faqItems.map((faq, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <input className="admin-input" placeholder="Question" value={faq.q} onChange={(e) => updateFaq(i, 'q', e.target.value)} style={{ marginBottom: '0.5rem' }} />
                                <textarea className="admin-input admin-textarea" placeholder="Answer" value={faq.a} onChange={(e) => updateFaq(i, 'a', e.target.value)} />
                            </div>
                            <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => removeFaq(i)}><Trash2 size={14} /></button>
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="admin-btn admin-btn-outline" onClick={addFaq}><Plus size={16} /> Add FAQ</button>
                        <button className="admin-btn admin-btn-primary" onClick={saveContent}><Save size={16} /> Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManager;
