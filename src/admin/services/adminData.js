import { products as seedProducts } from '../../data/products.js';

// ─── Helpers ──────────────────────────────────────────────
const store = (key) => ({
    getAll() {
        return JSON.parse(localStorage.getItem(key) || '[]');
    },
    setAll(data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    getById(id) {
        return this.getAll().find((i) => String(i.id) === String(id));
    },
    create(item) {
        const all = this.getAll();
        item.id = Date.now();
        all.push(item);
        this.setAll(all);
        return item;
    },
    update(id, updates) {
        let all = this.getAll();
        all = all.map((i) => (String(i.id) === String(id) ? { ...i, ...updates } : i));
        this.setAll(all);
        return this.getById(id);
    },
    remove(id) {
        const all = this.getAll().filter((i) => String(i.id) !== String(id));
        this.setAll(all);
    },
});

// ─── Stores ───────────────────────────────────────────────
export const productStore = store('bg_admin_products');
export const orderStore = store('bg_admin_orders');
export const customerStore = store('bg_admin_customers');
export const blogStore = store('bg_admin_blog');
export const settingsStore = {
    get() {
        return JSON.parse(localStorage.getItem('bg_admin_settings') || 'null') || defaultSettings;
    },
    save(data) {
        localStorage.setItem('bg_admin_settings', JSON.stringify(data));
    },
};
export const contentStore = {
    get() {
        return JSON.parse(localStorage.getItem('bg_admin_content') || 'null') || defaultContent;
    },
    save(data) {
        localStorage.setItem('bg_admin_content', JSON.stringify(data));
    },
};

// ─── Seed data ────────────────────────────────────────────
const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const defaultSettings = {
    shippingRate: 5.99,
    freeShippingThreshold: 50,
    taxRate: 8,
    socialLinks: { instagram: '', facebook: '', twitter: '' },
    paymentMethods: {
        creditCard: true,
        jazzCash: false,
        easyPaisa: false,
        cashOnDelivery: true,
    },
};

const defaultContent = {
    heroTitle: 'Unlock Your Natural Glow',
    heroSubtitle: 'Experience the power of organic botanical skincare designed to nourish, repair, and illuminate your skin.',
    aboutText: 'At Botanic Glows, we believe that true beauty comes from nature.',
    faqItems: [
        { q: 'Are your products organic?', a: 'Yes, all our products use 100% certified organic ingredients.' },
        { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy on all products.' },
        { q: 'Do you ship internationally?', a: 'Yes, we ship to over 30 countries worldwide.' },
    ],
};

function seedIfEmpty() {
    // Products
    if (productStore.getAll().length === 0) {
        const prods = seedProducts.map((p, i) => ({
            ...p,
            stock: 20 + i * 5,
            status: 'Active',
            discount: 0,
            ingredients: 'Natural botanical extracts, vitamin E, hyaluronic acid',
        }));
        productStore.setAll(prods);
    }

    // Orders
    if (orderStore.getAll().length === 0) {
        const names = ['Ayesha Khan', 'Ali Raza', 'Sara Ahmed', 'Usman Malik', 'Fatima Noor', 'Hassan Sheikh', 'Zainab Qureshi', 'Bilal Tariq'];
        const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi'];
        const orders = [];
        const prods = productStore.getAll();
        for (let i = 0; i < 12; i++) {
            const items = prods.slice(i % 3, (i % 3) + 2).map((p) => ({ ...p, quantity: 1 + (i % 3) }));
            const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
            orders.push({
                id: 1000 + i,
                customer: names[i % names.length],
                email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@email.com`,
                phone: `+92 300 ${String(1234567 + i * 111).slice(0, 7)}`,
                items,
                total: +total.toFixed(2),
                status: statuses[i % 5],
                date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
                address: `${100 + i} Main Street, ${cities[i % cities.length]}`,
                trackingNumber: i < 4 ? `BG${100000 + i}` : '',
                paymentMethod: i % 2 === 0 ? 'Credit Card' : 'Cash on Delivery',
            });
        }
        orderStore.setAll(orders);
    }

    // Customers
    if (customerStore.getAll().length === 0) {
        const customers = [
            { id: 1, name: 'Ayesha Khan', email: 'ayesha.khan@email.com', phone: '+92 300 1234567', orders: 3, totalSpent: 145.00, status: 'Active', joinDate: '2025-11-15' },
            { id: 2, name: 'Ali Raza', email: 'ali.raza@email.com', phone: '+92 301 2345678', orders: 2, totalSpent: 98.00, status: 'Active', joinDate: '2025-12-01' },
            { id: 3, name: 'Sara Ahmed', email: 'sara.ahmed@email.com', phone: '+92 302 3456789', orders: 5, totalSpent: 312.50, status: 'Active', joinDate: '2025-10-20' },
            { id: 4, name: 'Usman Malik', email: 'usman.malik@email.com', phone: '+92 303 4567890', orders: 1, totalSpent: 45.00, status: 'Active', joinDate: '2026-01-05' },
            { id: 5, name: 'Fatima Noor', email: 'fatima.noor@email.com', phone: '+92 304 5678901', orders: 4, totalSpent: 210.00, status: 'Blocked', joinDate: '2025-09-10' },
        ];
        customerStore.setAll(customers);
    }

    // Blog
    if (blogStore.getAll().length === 0) {
        blogStore.setAll([
            { id: 1, title: '5 Benefits of Botanical Skincare', content: 'Discover why botanical ingredients are revolutionizing the beauty industry...', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600', date: '2026-01-15', status: 'Published' },
            { id: 2, title: 'Morning Skincare Routine Guide', content: 'Start your day right with this simple yet effective skincare routine...', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600', date: '2026-01-28', status: 'Published' },
            { id: 3, title: 'Understanding Your Skin Type', content: 'Learn how to identify your skin type and choose the right products...', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600', date: '2026-02-10', status: 'Draft' },
        ]);
    }
}

// Run seeding on import
seedIfEmpty();

// ─── Stats helpers ────────────────────────────────────────
export function getStats() {
    const orders = orderStore.getAll();
    const products = productStore.getAll();
    const totalRevenue = orders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((s, o) => s + o.total, 0);
    const lowStock = products.filter((p) => p.stock < 10).length;

    return {
        totalOrders: orders.length,
        totalRevenue: +totalRevenue.toFixed(2),
        totalProducts: products.length,
        lowStockAlerts: lowStock,
    };
}

export function getWeeklySales() {
    const orders = orderStore.getAll().filter((o) => o.status !== 'Cancelled');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const salesByDay = days.map(() => 0);
    orders.forEach((o) => {
        const day = new Date(o.date).getDay();
        salesByDay[day] += o.total;
    });
    return days.map((d, i) => ({ day: d, amount: +salesByDay[i].toFixed(2) }));
}

// ─── Admin Auth ───────────────────────────────────────────
const ADMIN_KEY = 'bg_admin_users';

function initAdmins() {
    if (!localStorage.getItem(ADMIN_KEY)) {
        // Default admin — password: admin123
        localStorage.setItem(
            ADMIN_KEY,
            JSON.stringify([
                { id: 1, username: 'admin', passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', role: 'Super Admin' },
            ])
        );
    }
}
initAdmins();

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function authenticateAdmin(username, password) {
    const admins = JSON.parse(localStorage.getItem(ADMIN_KEY) || '[]');
    const hash = await sha256(password);
    const admin = admins.find((a) => a.username === username && a.passwordHash === hash);
    return admin || null;
}

export async function changeAdminPassword(username, newPassword) {
    const admins = JSON.parse(localStorage.getItem(ADMIN_KEY) || '[]');
    const hash = await sha256(newPassword);
    const updated = admins.map((a) => (a.username === username ? { ...a, passwordHash: hash } : a));
    localStorage.setItem(ADMIN_KEY, JSON.stringify(updated));
}

export async function addAdminUser(username, password, role = 'Staff Admin') {
    const admins = JSON.parse(localStorage.getItem(ADMIN_KEY) || '[]');
    if (admins.find((a) => a.username === username)) return null;
    const hash = await sha256(password);
    const newAdmin = { id: Date.now(), username, passwordHash: hash, role };
    admins.push(newAdmin);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
    return newAdmin;
}

export const categories = ['Serums', 'Face Wash', 'Moisturizers', 'Oils', 'Treatments', 'Masks', 'Toners'];
