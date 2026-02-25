import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2 } from 'lucide-react';
import { productStore, categories } from '../services/adminData.js';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await productStore.getAll();
            setProducts(data);
            setLoading(false);
        };
        load();
    }, []);

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const catName = typeof p.category === 'object' ? p.category?.name : p.category;
        const matchCat = !filterCat || catName === filterCat;
        return matchSearch && matchCat;
    });

    const toggleStatus = async (id) => {
        const p = products.find((x) => (x._id || x.id) === id);
        if (!p) return;
        const updated = await productStore.update(id, { isActive: !p.isActive });
        setProducts((prev) => prev.map((x) => ((x._id || x.id) === id ? { ...x, isActive: !x.isActive } : x)));
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await productStore.remove(deleteId);
        setProducts((prev) => prev.filter((x) => (x._id || x.id) !== deleteId));
        setDeleteId(null);
    };

    if (loading) return <div className="admin-loading">Loading products...</div>;

    return (
        <div>
            <div className="admin-page-header">
                <h1>Products ({filtered.length})</h1>
                <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={16} />
                    <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="admin-select" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="admin-card">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr><th>Product</th><th>Price</th><th>Stock</th><th>Category</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => {
                                const pid = p._id || p.id;
                                const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                                return (
                                    <tr key={pid}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {(p.images?.[0] || p.image) && <img src={p.images?.[0] || p.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />}
                                                <Link to={`/admin/products/edit/${pid}`} style={{ color: 'var(--admin-text)', fontWeight: 500 }}>{p.name}</Link>
                                            </div>
                                        </td>
                                        <td>${p.price?.toFixed(2)}</td>
                                        <td><span style={{ color: p.stock < 10 ? '#e74c3c' : 'inherit' }}>{p.stock}</span></td>
                                        <td>{catName || '—'}</td>
                                        <td>
                                            <label className="admin-toggle">
                                                <input type="checkbox" checked={p.isActive !== false} onChange={() => toggleStatus(pid)} />
                                                <span className="admin-toggle-slider"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link to={`/admin/products/edit/${pid}`} className="admin-btn admin-btn-sm admin-btn-outline">Edit</Link>
                                                <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(pid)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteId && (
                <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Product?</h3>
                        <p>This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <button className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
                            <button className="admin-btn admin-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
