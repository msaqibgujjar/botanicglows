import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { productStore, fetchCategories, categories as fallbackCategories } from '../services/adminData.js';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({
        name: '', description: '', price: '', category: '', stock: '',
        discount: '0', ingredients: '', isActive: true, images: [],
    });
    const [categories, setCategories] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            // Load categories from API
            const cats = await fetchCategories();
            setCategories(cats.length > 0 ? cats : fallbackCategories.map((c, i) => ({ _id: `cat-${i}`, name: c })));

            if (isEdit) {
                const product = await productStore.getById(id);
                if (product) {
                    setForm({
                        name: product.name || '',
                        description: product.description || '',
                        price: product.price || '',
                        category: typeof product.category === 'object' ? product.category?._id : product.category,
                        stock: product.stock || '',
                        discount: product.discount || '0',
                        ingredients: product.ingredients || '',
                        isActive: product.isActive !== false,
                        images: product.images || [],
                    });
                }
            }
        };
        load();
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.price || !form.category) {
            setError('Name, price, and category are required');
            return;
        }

        setLoading(true);
        try {
            const data = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                category: form.category,
                stock: parseInt(form.stock) || 0,
                discount: parseFloat(form.discount) || 0,
                ingredients: form.ingredients,
                isActive: form.isActive,
                images: form.images,
            };

            if (isEdit) {
                await productStore.update(id, data);
                setSuccess('Product updated!');
            } else {
                await productStore.create(data);
                setSuccess('Product created!');
            }
            setTimeout(() => navigate('/admin/products'), 1000);
        } catch (err) {
            setError(err.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
                <button className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/products')}>
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {success && <div className="admin-alert admin-alert-success">{success}</div>}
            {error && <div className="admin-alert admin-alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="admin-card">
                <div className="admin-grid-2">
                    <div className="admin-form-group">
                        <label>Product Name *</label>
                        <input className="admin-input" name="name" value={form.name} onChange={handleChange} placeholder="Product name" />
                    </div>
                    <div className="admin-form-group">
                        <label>Price ($) *</label>
                        <input className="admin-input" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" />
                    </div>
                </div>

                <div className="admin-form-group">
                    <label>Description</label>
                    <textarea className="admin-input admin-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Product description..." />
                </div>

                <div className="admin-grid-2">
                    <div className="admin-form-group">
                        <label>Category *</label>
                        <select className="admin-input admin-select" name="category" value={form.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c._id || c} value={c._id || c}>{c.name || c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="admin-form-group">
                        <label>Stock</label>
                        <input className="admin-input" name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" />
                    </div>
                </div>

                <div className="admin-grid-2">
                    <div className="admin-form-group">
                        <label>Discount (%)</label>
                        <input className="admin-input" name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} />
                    </div>
                    <div className="admin-form-group">
                        <label>Ingredients</label>
                        <input className="admin-input" name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="e.g., Vitamin E, Aloe Vera" />
                    </div>
                </div>

                <div className="admin-form-group">
                    <label>Image URL</label>
                    <input className="admin-input" value={form.images[0] || ''} onChange={(e) => setForm((prev) => ({ ...prev, images: [e.target.value] }))} placeholder="https://..." />
                    {form.images[0] && <img src={form.images[0]} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, marginTop: '0.5rem' }} />}
                </div>

                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label className="admin-toggle">
                        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                        <span className="admin-toggle-slider"></span>
                    </label>
                    <span>Active</span>
                </div>

                <button className="admin-btn admin-btn-primary" type="submit" disabled={loading}>
                    <Save size={16} /> {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
