import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { productStore, categories } from '../services/adminData.js';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({
        name: '',
        price: '',
        category: 'Serums',
        description: '',
        ingredients: '',
        image: '',
        stock: '',
        discount: 0,
        status: 'Active',
        rating: 0,
        reviews: 0,
        isNew: false,
        isBestSeller: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isEdit) {
            const product = productStore.getById(id);
            if (product) {
                setForm({
                    ...product,
                    price: String(product.price),
                    stock: String(product.stock),
                    discount: product.discount || 0,
                });
            } else {
                navigate('/admin/products');
            }
        }
    }, [id, isEdit, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!form.name || !form.price || !form.image || !form.stock) {
            setError('Please fill in all required fields');
            return;
        }

        const data = {
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock, 10),
            discount: parseInt(form.discount, 10) || 0,
        };

        if (isEdit) {
            productStore.update(id, data);
            setSuccess('Product updated successfully!');
        } else {
            productStore.create(data);
            setSuccess('Product created successfully!');
            setTimeout(() => navigate('/admin/products'), 1000);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => navigate('/admin/products')}>
                        <ArrowLeft size={16} />
                    </button>
                    <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                </div>
            </div>

            {error && <div className="admin-alert admin-alert-error">{error}</div>}
            {success && <div className="admin-alert admin-alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="admin-grid-2">
                    <div className="admin-card">
                        <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Product Information</h2>

                        <div className="admin-form-group">
                            <label>Product Name *</label>
                            <input className="admin-input" name="name" value={form.name} onChange={handleChange} placeholder="Enter product name" />
                        </div>

                        <div className="admin-grid-2">
                            <div className="admin-form-group">
                                <label>Price ($) *</label>
                                <input className="admin-input" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" />
                            </div>
                            <div className="admin-form-group">
                                <label>Category</label>
                                <select className="admin-input admin-select" name="category" value={form.category} onChange={handleChange}>
                                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Description</label>
                            <textarea className="admin-input admin-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Product description..." />
                        </div>

                        <div className="admin-form-group">
                            <label>Ingredients</label>
                            <textarea className="admin-input admin-textarea" name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="List of ingredients..." />
                        </div>
                    </div>

                    <div>
                        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Media & Stock</h2>

                            <div className="admin-form-group">
                                <label>Image URL *</label>
                                <input className="admin-input" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                            </div>

                            {form.image && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <img src={form.image} alt="Preview" className="admin-image-preview-lg" />
                                </div>
                            )}

                            <div className="admin-grid-2">
                                <div className="admin-form-group">
                                    <label>Stock *</label>
                                    <input className="admin-input" name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Discount (%)</label>
                                    <input className="admin-input" name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} placeholder="0" />
                                </div>
                            </div>
                        </div>

                        <div className="admin-card">
                            <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Status & Tags</h2>

                            <div className="admin-form-group">
                                <label>Status</label>
                                <select className="admin-input admin-select" name="status" value={form.status} onChange={handleChange}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} />
                                    New Arrival
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} />
                                    Best Seller
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="admin-btn admin-btn-primary">
                        <Save size={16} /> {isEdit ? 'Update Product' : 'Create Product'}
                    </button>
                    <button type="button" className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/products')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
