// ─── Public API helpers for the storefront ──────────────
const API_BASE = 'http://localhost:5000/api/public';

export async function fetchProducts(params = {}) {
    try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/products${query ? '?' + query : ''}`);
        const data = await res.json();
        if (!data.success) return [];
        // Normalize to what ProductCard expects: id, image, isNew, reviews
        return data.data.map(p => ({
            ...p,
            id: p._id,
            image: (p.images && p.images[0]) || '',
            isNew: p.isNewArrival || false,
            reviews: p.numReviews || 0,
            category: typeof p.category === 'object' ? p.category.name : p.category,
        }));
    } catch (err) {
        console.error('Failed to fetch products:', err);
        return [];
    }
}

export async function fetchProductById(id) {
    try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        const data = await res.json();
        if (!data.success) return null;
        const p = data.data;
        return {
            ...p,
            id: p._id,
            image: (p.images && p.images[0]) || '',
            isNew: p.isNewArrival || false,
            reviews: p.numReviews || 0,
            category: typeof p.category === 'object' ? p.category.name : p.category,
        };
    } catch (err) {
        console.error('Failed to fetch product:', err);
        return null;
    }
}

export async function fetchCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        const data = await res.json();
        return data.success ? data.data.map(c => c.name) : [];
    } catch (err) {
        console.error('Failed to fetch categories:', err);
        return [];
    }
}

export async function fetchContent(type) {
    try {
        const res = await fetch(`${API_BASE}/content/${type}`);
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (err) {
        console.error(`Failed to fetch ${type} content:`, err);
        return null;
    }
}

export async function fetchBlogPosts() {
    try {
        const res = await fetch(`${API_BASE}/blog`);
        const data = await res.json();
        if (!data.success) return [];
        return data.data.map(p => ({
            ...p,
            id: p._id,
            date: new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        }));
    } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        return [];
    }
}

export async function fetchShippingCities() {
    try {
        const res = await fetch(`${API_BASE}/shipping/cities`);
        const data = await res.json();
        return data.success ? data.data : {};
    } catch (err) {
        console.error('Failed to fetch cities:', err);
        return {};
    }
}

export async function fetchShippingRate(province, city) {
    try {
        const res = await fetch(`${API_BASE}/shipping/rate?province=${encodeURIComponent(province)}&city=${encodeURIComponent(city)}`);
        const data = await res.json();
        return data.success ? data.data.rate : 0;
    } catch (err) {
        console.error('Failed to fetch shipping rate:', err);
        return 0;
    }
}
