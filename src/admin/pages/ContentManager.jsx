import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3 } from 'lucide-react';
import { contentStore, blogStore } from '../services/adminData.js';

const tabs = ['Homepage', 'About', 'Contact', 'Blog Posts'];

const ContentManager = () => {
    const [activeTab, setActiveTab] = useState('Homepage');
    const [homepage, setHomepage] = useState(null);
    const [about, setAbout] = useState(null);
    const [contact, setContact] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [blogForm, setBlogForm] = useState(null);
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [hp, ab, ct, bl] = await Promise.all([
                contentStore.get('homepage'),
                contentStore.get('about'),
                contentStore.get('contact'),
                blogStore.getAll(),
            ]);
            setHomepage(hp || {});
            setAbout(ab || {});
            setContact(ct || {});
            setBlogs(bl);
            setLoading(false);
        };
        load();
    }, []);

    const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 2000); };

    // Save content
    const saveHomepage = async () => { await contentStore.save('homepage', homepage); flash('Homepage saved!'); };
    const saveAbout = async () => { await contentStore.save('about', about); flash('About page saved!'); };
    const saveContact = async () => { await contentStore.save('contact', contact); flash('Contact page saved!'); };

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

    // Helpers for nested state updates
    const updateFeature = (i, field, val) => {
        const updated = [...(homepage.features || [])];
        updated[i] = { ...updated[i], [field]: val };
        setHomepage({ ...homepage, features: updated });
    };
    const updateTestimonial = (i, field, val) => {
        const updated = [...(homepage.testimonials || [])];
        updated[i] = { ...updated[i], [field]: val };
        setHomepage({ ...homepage, testimonials: updated });
    };
    const updateAboutSection = (i, field, val) => {
        const updated = [...(about.sections || [])];
        updated[i] = { ...updated[i], [field]: val };
        setAbout({ ...about, sections: updated });
    };
    const updateAboutValue = (i, field, val) => {
        const updated = [...(about.values || [])];
        updated[i] = { ...updated[i], [field]: val };
        setAbout({ ...about, values: updated });
    };

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

            {/* ─── HOMEPAGE ─── */}
            {activeTab === 'Homepage' && homepage && (
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Hero Section</h2>
                    <div className="admin-form-group">
                        <label>Hero Title</label>
                        <input className="admin-input" value={homepage.heroTitle || ''} onChange={(e) => setHomepage({ ...homepage, heroTitle: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Hero Subtitle</label>
                        <textarea className="admin-input admin-textarea" value={homepage.heroSubtitle || ''} onChange={(e) => setHomepage({ ...homepage, heroSubtitle: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Hero Image URL</label>
                        <input className="admin-input" value={homepage.heroImage || ''} onChange={(e) => setHomepage({ ...homepage, heroImage: e.target.value })} />
                    </div>

                    <hr style={{ margin: '1.5rem 0', borderColor: 'var(--admin-border)' }} />
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Features</h2>
                    {(homepage.features || []).map((f, i) => (
                        <div key={i} className="admin-grid-2" style={{ marginBottom: '0.75rem' }}>
                            <div className="admin-form-group"><label>Title</label><input className="admin-input" value={f.title} onChange={(e) => updateFeature(i, 'title', e.target.value)} /></div>
                            <div className="admin-form-group"><label>Text</label><input className="admin-input" value={f.text} onChange={(e) => updateFeature(i, 'text', e.target.value)} /></div>
                        </div>
                    ))}

                    <hr style={{ margin: '1.5rem 0', borderColor: 'var(--admin-border)' }} />
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>About Section</h2>
                    <div className="admin-form-group">
                        <label>About Title</label>
                        <input className="admin-input" value={homepage.aboutTitle || ''} onChange={(e) => setHomepage({ ...homepage, aboutTitle: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>About Paragraph 1</label>
                        <textarea className="admin-input admin-textarea" value={homepage.aboutText1 || ''} onChange={(e) => setHomepage({ ...homepage, aboutText1: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>About Paragraph 2</label>
                        <textarea className="admin-input admin-textarea" value={homepage.aboutText2 || ''} onChange={(e) => setHomepage({ ...homepage, aboutText2: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>About Image URL</label>
                        <input className="admin-input" value={homepage.aboutImage || ''} onChange={(e) => setHomepage({ ...homepage, aboutImage: e.target.value })} />
                    </div>

                    <hr style={{ margin: '1.5rem 0', borderColor: 'var(--admin-border)' }} />
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Testimonials</h2>
                    {(homepage.testimonials || []).map((t, i) => (
                        <div key={i} className="admin-grid-2" style={{ marginBottom: '0.75rem' }}>
                            <div className="admin-form-group"><label>Quote</label><textarea className="admin-input admin-textarea" value={t.text} onChange={(e) => updateTestimonial(i, 'text', e.target.value)} /></div>
                            <div className="admin-form-group"><label>Author</label><input className="admin-input" value={t.author} onChange={(e) => updateTestimonial(i, 'author', e.target.value)} /></div>
                        </div>
                    ))}

                    <button className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }} onClick={saveHomepage}><Save size={16} /> Save Homepage</button>
                </div>
            )}

            {/* ─── ABOUT ─── */}
            {activeTab === 'About' && about && (
                <div className="admin-card">
                    <div className="admin-form-group">
                        <label>Page Title</label>
                        <input className="admin-input" value={about.heroTitle || ''} onChange={(e) => setAbout({ ...about, heroTitle: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Page Subtitle</label>
                        <input className="admin-input" value={about.heroSubtitle || ''} onChange={(e) => setAbout({ ...about, heroSubtitle: e.target.value })} />
                    </div>

                    <hr style={{ margin: '1.5rem 0', borderColor: 'var(--admin-border)' }} />
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Content Sections</h2>
                    {(about.sections || []).map((s, i) => (
                        <div key={i} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                            <div className="admin-form-group"><label>Title</label><input className="admin-input" value={s.title} onChange={(e) => updateAboutSection(i, 'title', e.target.value)} /></div>
                            <div className="admin-form-group"><label>Text</label><textarea className="admin-input admin-textarea" value={s.text} onChange={(e) => updateAboutSection(i, 'text', e.target.value)} /></div>
                            <div className="admin-form-group"><label>Image URL</label><input className="admin-input" value={s.image} onChange={(e) => updateAboutSection(i, 'image', e.target.value)} /></div>
                        </div>
                    ))}

                    <hr style={{ margin: '1.5rem 0', borderColor: 'var(--admin-border)' }} />
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Values</h2>
                    {(about.values || []).map((v, i) => (
                        <div key={i} className="admin-grid-2" style={{ marginBottom: '0.75rem' }}>
                            <div className="admin-form-group"><label>Title</label><input className="admin-input" value={v.title} onChange={(e) => updateAboutValue(i, 'title', e.target.value)} /></div>
                            <div className="admin-form-group"><label>Text</label><input className="admin-input" value={v.text} onChange={(e) => updateAboutValue(i, 'text', e.target.value)} /></div>
                        </div>
                    ))}

                    <button className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }} onClick={saveAbout}><Save size={16} /> Save About</button>
                </div>
            )}

            {/* ─── CONTACT ─── */}
            {activeTab === 'Contact' && contact && (
                <div className="admin-card">
                    <div className="admin-form-group">
                        <label>Page Title</label>
                        <input className="admin-input" value={contact.heroTitle || ''} onChange={(e) => setContact({ ...contact, heroTitle: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Page Subtitle</label>
                        <input className="admin-input" value={contact.heroSubtitle || ''} onChange={(e) => setContact({ ...contact, heroSubtitle: e.target.value })} />
                    </div>
                    <div className="admin-grid-2">
                        <div className="admin-form-group"><label>Email 1</label><input className="admin-input" value={contact.email1 || ''} onChange={(e) => setContact({ ...contact, email1: e.target.value })} /></div>
                        <div className="admin-form-group"><label>Email 2</label><input className="admin-input" value={contact.email2 || ''} onChange={(e) => setContact({ ...contact, email2: e.target.value })} /></div>
                    </div>
                    <div className="admin-grid-2">
                        <div className="admin-form-group"><label>Phone</label><input className="admin-input" value={contact.phone || ''} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
                        <div className="admin-form-group"><label>Phone Hours</label><input className="admin-input" value={contact.phoneHours || ''} onChange={(e) => setContact({ ...contact, phoneHours: e.target.value })} /></div>
                    </div>
                    <div className="admin-grid-2">
                        <div className="admin-form-group"><label>Address Line 1</label><input className="admin-input" value={contact.address1 || ''} onChange={(e) => setContact({ ...contact, address1: e.target.value })} /></div>
                        <div className="admin-form-group"><label>Address Line 2</label><input className="admin-input" value={contact.address2 || ''} onChange={(e) => setContact({ ...contact, address2: e.target.value })} /></div>
                    </div>
                    <button className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }} onClick={saveContact}><Save size={16} /> Save Contact</button>
                </div>
            )}

            {/* ─── BLOG ─── */}
            {activeTab === 'Blog Posts' && (
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button className="admin-btn admin-btn-primary" onClick={() => setBlogForm({ title: '', content: '', excerpt: '', image: '', status: 'Draft', author: 'Botanic Glows Team' })}>
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
                                        <td><span className={`admin-badge admin-badge-${(b.status || '').toLowerCase()}`}>{b.status}</span></td>
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

                    {blogForm && (
                        <div className="admin-modal-overlay" onClick={() => setBlogForm(null)}>
                            <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
                                <h3>{blogForm.id ? 'Edit Post' : 'New Post'}</h3>
                                <div className="admin-form-group"><label>Title</label><input className="admin-input" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Excerpt</label><input className="admin-input" value={blogForm.excerpt || ''} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Content</label><textarea className="admin-input admin-textarea" rows="5" value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Image URL</label><input className="admin-input" value={blogForm.image} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} /></div>
                                <div className="admin-grid-2">
                                    <div className="admin-form-group"><label>Author</label><input className="admin-input" value={blogForm.author || ''} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} /></div>
                                    <div className="admin-form-group"><label>Status</label>
                                        <select className="admin-input admin-select" value={blogForm.status} onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}>
                                            <option>Draft</option><option>Published</option>
                                        </select>
                                    </div>
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
        </div>
    );
};

export default ContentManager;
