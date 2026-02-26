// ─── API Configuration ────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('bg_admin_token');

const api = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = { ...options.headers };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'API request failed');
    }
    return data;
};

// ─── Auth ─────────────────────────────────────────────────
export async function authenticateAdmin(email, password) {
    try {
        const data = await api('/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.success) {
            localStorage.setItem('bg_admin_token', data.token);
            return data.admin;
        }
        return null;
    } catch (error) {
        console.error('Login error:', error.message);
        return null;
    }
}

export async function changeAdminPassword(currentPassword, newPassword) {
    try {
        const data = await api('/admin/auth/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        if (data.token) {
            localStorage.setItem('bg_admin_token', data.token);
        }
        return data.success;
    } catch (error) {
        console.error('Password change error:', error.message);
        throw error;
    }
}

export async function addAdminUser(name, email, password, role = 'Admin') {
    try {
        const data = await api('/admin/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role }),
        });
        return data.success ? data.admin : null;
    } catch (error) {
        console.error('Add admin error:', error.message);
        return null;
    }
}

// ─── Product Store ────────────────────────────────────────
export const productStore = {
    async getAll() {
        try {
            const data = await api('/admin/products?limit=100');
            return data.data || [];
        } catch { return []; }
    },
    async getById(id) {
        try {
            const data = await api(`/admin/products/${id}`);
            return data.data || null;
        } catch { return null; }
    },
    async create(item) {
        const data = await api('/admin/products', {
            method: 'POST',
            body: JSON.stringify(item),
        });
        return data.data;
    },
    async update(id, updates) {
        const data = await api(`/admin/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        return data.data;
    },
    async remove(id) {
        await api(`/admin/products/${id}`, { method: 'DELETE' });
    },
};

// ─── Category Helpers ─────────────────────────────────────
export async function fetchCategories() {
    try {
        const data = await api('/admin/products/categories/all');
        return data.data || [];
    } catch { return []; }
}

// Legacy fallback for pages that import `categories` directly
export const categories = ['Moisturizers', 'Serums', 'Cleansers', 'Masks', 'Toners', 'Lip Care', 'Body Care'];

// ─── Order Store ──────────────────────────────────────────
export const orderStore = {
    async getAll() {
        try {
            const data = await api('/admin/orders?limit=100');
            return (data.data || []).map(normalizeOrder);
        } catch { return []; }
    },
    async getById(id) {
        try {
            const data = await api(`/admin/orders/${id}`);
            return data.data ? normalizeOrder(data.data) : null;
        } catch { return null; }
    },
    async update(id, updates) {
        const data = await api(`/admin/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        return data.data ? normalizeOrder(data.data) : null;
    },
};

// Normalize backend order shape to match what the frontend expects
function normalizeOrder(o) {
    return {
        id: o._id || o.id,
        customer: o.customerName || o.customer,
        email: o.customerEmail || o.email,
        phone: o.customerPhone || o.phone,
        items: (o.items || []).map((it) => ({
            ...it,
            id: it.product || it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
        })),
        total: o.totalAmount || o.total,
        status: o.orderStatus || o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus || 'Pending',
        date: o.createdAt || o.date,
        address: o.shippingAddress
            ? `${o.shippingAddress.street}, ${o.shippingAddress.city}`
            : (o.address || ''),
        trackingNumber: o.trackingNumber || '',
    };
}

// ─── Customer Store ───────────────────────────────────────
export const customerStore = {
    async getAll() {
        try {
            const data = await api('/admin/customers?limit=100');
            return (data.data || []).map(normalizeCustomer);
        } catch { return []; }
    },
    async getById(id) {
        try {
            const data = await api(`/admin/customers/${id}`);
            return data.data ? normalizeCustomer(data.data) : null;
        } catch { return null; }
    },
    async toggleBlock(id) {
        const data = await api(`/admin/customers/${id}/block`, { method: 'PUT' });
        return data.data ? normalizeCustomer(data.data) : null;
    },
    async remove(id) {
        await api(`/admin/customers/${id}`, { method: 'DELETE' });
    },
    async getOrders(id) {
        try {
            const data = await api(`/admin/customers/${id}/orders`);
            return data.data || [];
        } catch { return []; }
    },
};

function normalizeCustomer(c) {
    return {
        id: c._id || c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '',
        orders: c.totalOrders || 0,
        totalSpent: c.totalSpent || 0,
        status: c.isBlocked ? 'Blocked' : 'Active',
        joinDate: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '',
    };
}

// ─── Blog Store ───────────────────────────────────────────
export const blogStore = {
    async getAll() {
        try {
            const data = await api('/admin/content/blog');
            return (data.data || []).map(normalizeBlog);
        } catch { return []; }
    },
    async create(item) {
        const data = await api('/admin/content/blog', {
            method: 'POST',
            body: JSON.stringify(item),
        });
        return data.data ? normalizeBlog(data.data) : data.data;
    },
    async update(id, updates) {
        const data = await api(`/admin/content/blog/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        return data.data ? normalizeBlog(data.data) : data.data;
    },
    async remove(id) {
        await api(`/admin/content/blog/${id}`, { method: 'DELETE' });
    },
};

function normalizeBlog(b) {
    return {
        id: b._id || b.id,
        title: b.title,
        content: b.content,
        excerpt: b.excerpt || '',
        image: b.image || '',
        author: b.author || '',
        date: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : b.date,
        status: b.status || 'Draft',
    };
}

// ─── Content Store (per page type) ────────────────────────
export const contentStore = {
    async get(type) {
        try {
            const data = await api(`/admin/content/${type}`);
            return data.data?.data || {};
        } catch {
            return {};
        }
    },
    async save(type, contentData) {
        await api(`/admin/content/${type}`, {
            method: 'PUT',
            body: JSON.stringify({ data: contentData }),
        });
    },
};

// ─── Settings Store ──────────────────────────────────────
const defaultSettings = {
    shippingRate: 5.99,
    freeShippingThreshold: 50,
    taxRate: 8,
    socialLinks: { instagram: '', facebook: '', twitter: '' },
    paymentMethods: { creditCard: true, jazzCash: false, easyPaisa: false, cashOnDelivery: true },
};

export const settingsStore = {
    get() {
        return JSON.parse(localStorage.getItem('bg_admin_settings') || 'null') || defaultSettings;
    },
    save(data) {
        localStorage.setItem('bg_admin_settings', JSON.stringify(data));
    },
};

// ─── Dashboard Stats ──────────────────────────────────────
export async function getStats() {
    try {
        const data = await api('/admin/dashboard/stats');
        const d = data.data;
        return {
            totalOrders: d.totalOrders,
            totalRevenue: +d.totalRevenue.toFixed(2),
            totalProducts: d.totalProducts,
            lowStockAlerts: d.lowStockProducts,
            recentOrders: (d.recentOrders || []).map(normalizeOrder),
        };
    } catch {
        return { totalOrders: 0, totalRevenue: 0, totalProducts: 0, lowStockAlerts: 0, recentOrders: [] };
    }
}

export async function getWeeklySales() {
    try {
        const data = await api('/admin/dashboard/sales?period=weekly');
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const salesByDay = days.map(() => 0);

        (data.data || []).forEach((item) => {
            const date = new Date(item._id.year, item._id.month - 1, item._id.day);
            salesByDay[date.getDay()] = item.revenue;
        });

        return days.map((d, i) => ({ day: d, amount: +salesByDay[i].toFixed(2) }));
    } catch {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => ({ day: d, amount: 0 }));
    }
}
