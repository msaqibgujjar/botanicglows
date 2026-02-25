const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

dotenv.config();

const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const User = require('./models/User');

const products = [
    { name: 'Glow Radiance Serum', price: 45.00, category: 'Serums', rating: 4.8, numReviews: 124, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'A powerful vitamin C serum that brightens and evens out skin tone for a natural glow.', isNewArrival: true, isBestSeller: true, stock: 25 },
    { name: 'Hydrating Rose Mist', price: 28.00, category: 'Cleansers', rating: 4.5, numReviews: 89, image: 'https://images.unsplash.com/photo-1608248598972-e160a22a3629?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Refresh and hydrate your skin with our organic rose water mist.', isNewArrival: false, isBestSeller: true, stock: 30 },
    { name: 'Botanical Night Oil', price: 52.00, category: 'Body Care', rating: 4.9, numReviews: 210, image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Repair and rejuvenate your skin overnight with this blend of precious botanical oils.', isNewArrival: false, isBestSeller: true, stock: 20 },
    { name: 'Soothing Clay Mask', price: 34.00, category: 'Masks', rating: 4.7, numReviews: 156, image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Detoxify and calm irritated skin with pink clay and chamomile.', isNewArrival: true, isBestSeller: false, stock: 35 },
    { name: 'Daily Moisture Cream', price: 38.00, category: 'Moisturizers', rating: 4.6, numReviews: 178, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Lightweight daily moisturizer with hyaluronic acid for lasting hydration.', isNewArrival: false, isBestSeller: true, stock: 40 },
    { name: 'Exfoliating Scrub', price: 32.00, category: 'Cleansers', rating: 4.4, numReviews: 95, image: 'https://images.unsplash.com/photo-1556228720-19777f987f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', description: 'Gentle exfoliation with crushed walnut shells and jojoba beads.', isNewArrival: false, isBestSeller: false, stock: 28 },
];

const customers = [
    { name: 'Ayesha Khan', email: 'ayesha.khan@email.com', phone: '+92 300 1234567' },
    { name: 'Ali Raza', email: 'ali.raza@email.com', phone: '+92 301 2345678' },
    { name: 'Sara Ahmed', email: 'sara.ahmed@email.com', phone: '+92 302 3456789' },
    { name: 'Usman Malik', email: 'usman.malik@email.com', phone: '+92 303 4567890' },
    { name: 'Fatima Noor', email: 'fatima.noor@email.com', phone: '+92 304 5678901' },
];

const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi'];
const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});
        console.log('🗑️  Cleared existing products, users, and orders');

        // Get category map
        const allCats = await Category.find();
        const catMap = {};
        allCats.forEach(c => catMap[c.name] = c._id);

        // Create products
        const createdProducts = [];
        for (const p of products) {
            const catId = catMap[p.category];
            if (!catId) { console.log(`⚠️  Category "${p.category}" not found, skipping ${p.name}`); continue; }
            const prod = await Product.create({
                name: p.name, price: p.price, category: catId, rating: p.rating, numReviews: p.numReviews,
                images: [p.image], description: p.description, isNewArrival: p.isNewArrival,
                isBestSeller: p.isBestSeller, stock: p.stock, ingredients: 'Natural botanical extracts, vitamin E, hyaluronic acid',
            });
            createdProducts.push(prod);
            console.log(`✅ Product: ${prod.name}`);
        }

        // Create customers
        const createdUsers = [];
        for (const c of customers) {
            const user = await User.create(c);
            createdUsers.push(user);
            console.log(`✅ Customer: ${user.name}`);
        }

        // Create sample orders
        for (let i = 0; i < 8; i++) {
            const user = createdUsers[i % createdUsers.length];
            const prod1 = createdProducts[i % createdProducts.length];
            const prod2 = createdProducts[(i + 1) % createdProducts.length];
            const qty1 = 1 + (i % 3);
            const qty2 = 1;
            const total = (prod1.price * qty1) + (prod2.price * qty2);

            await Order.create({
                user: user._id,
                customerName: user.name,
                customerEmail: user.email,
                customerPhone: user.phone,
                items: [
                    { product: prod1._id, name: prod1.name, price: prod1.price, quantity: qty1 },
                    { product: prod2._id, name: prod2.name, price: prod2.price, quantity: qty2 },
                ],
                totalAmount: total,
                orderStatus: statuses[i % 5],
                paymentMethod: i % 2 === 0 ? 'CreditCard' : 'CashOnDelivery',
                paymentStatus: i < 4 ? 'Paid' : 'Pending',
                shippingAddress: {
                    street: `${100 + i} Main Street`,
                    city: cities[i % cities.length],
                    state: 'Punjab',
                    zipCode: `5${4000 + i}`,
                    country: 'Pakistan',
                },
                trackingNumber: i < 3 ? `BG${100000 + i}` : '',
                createdAt: new Date(Date.now() - i * 86400000 * 2),
            });
            console.log(`✅ Order #${i + 1}: ${user.name} - $${total.toFixed(2)} (${statuses[i % 5]})`);
        }

        console.log('\n🌿 All data seeded successfully!');
        console.log(`   ${createdProducts.length} products, ${createdUsers.length} customers, 8 orders`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
}

seedData();
