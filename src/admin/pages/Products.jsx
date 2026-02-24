import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { productStore, categories } from '../services/adminData.js';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('All');
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setProducts(productStore.getAll());
    }, []);

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'All' || p.category === catFilter;
        return matchSearch && matchCat;
    });

    const handleDelete = () => {
        productStore.remove(deleteId);
        setProducts(productStore.getAll());
        setDeleteId(null);
    };

    const toggleStatus = (id) => {
        const p = productStore.getById(id);
        productStore.update(id, { status: p.status === 'Active' ? 'Inactive' : 'Active' });
        setProducts(productStore.getAll());
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>Products</h1>
                <Link to="/admin/products/new" className="admin-btn admin-btn-primary" >
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            <div className="admin-toolbar">
                <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className={`admin-filter-btn ${catFilter === 'All' ? 'active' : ''}`}
                    onClick={() => setCatFilter('All')}
                >All</button>
                {categories.map((c) => (
                    <button
                        key={c}
                        className={`admin-filter-btn ${catFilter === c ? 'active' : ''}`}
                        onClick={() => setCatFilter(c)}
                    >{c}</button>
                ))}
            </div>

            <div className="admin-card">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan="7" className="admin-empty">No products found.</td></tr>
                            )}
                            {filtered.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <img src={p.image} alt={p.name} className="admin-image-preview" />
                                    </td>
                                    <td><strong>{p.name}</strong></td>
                                    <td>{p.category}</td>
                                    <td>
                                        ${p.price.toFixed(2)}
                                        {p.discount > 0 && (
                                            <span className="admin-badge admin-badge-success" style={{ marginLeft: 6 }}>
                                                -{p.discount}%
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={p.stock < 10 ? 'admin-badge admin-badge-danger' : ''}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <label className="admin-toggle">
                                            <input type="checkbox" checked={p.status === 'Active'} onChange={() => toggleStatus(p.id)} />
                                            <span className="admin-toggle-slider"></span>
                                        </label>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-outline"
                                                onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-danger"
                                                onClick={() => setDeleteId(p.id)}
                                            >
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

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Delete Product</h2>
                        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
