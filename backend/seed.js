const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// Fix DNS for Atlas SRV lookup
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

dotenv.config();

const Admin = require('./models/Admin');
const Category = require('./models/Category');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if SuperAdmin already exists
        const existingAdmin = await Admin.findOne({ role: 'SuperAdmin' });
        if (existingAdmin) {
            console.log('⚠️  SuperAdmin already exists:', existingAdmin.email);
        } else {
            // Create SuperAdmin
            const admin = await Admin.create({
                name: 'Super Admin',
                email: 'admin@botanicglows.com',
                password: 'admin123',
                role: 'SuperAdmin',
            });
            console.log('✅ SuperAdmin created successfully!');
            console.log('   Email:', admin.email);
            console.log('   Password: admin123');
            console.log('   ⚠️  Please change the default password after first login!');
        }

        // Seed default categories
        const defaultCategories = [
            { name: 'Moisturizers', description: 'Hydrating creams and lotions' },
            { name: 'Serums', description: 'Concentrated treatment formulas' },
            { name: 'Cleansers', description: 'Face washes and cleansing products' },
            { name: 'Masks', description: 'Face masks and treatment masks' },
            { name: 'Toners', description: 'Skin balancing and toning products' },
            { name: 'Lip Care', description: 'Lip balms and treatments' },
            { name: 'Body Care', description: 'Body lotions, scrubs, and oils' },
        ];

        for (const cat of defaultCategories) {
            const exists = await Category.findOne({ name: cat.name });
            if (!exists) {
                await Category.create(cat);
                console.log(`✅ Category created: ${cat.name}`);
            }
        }

        console.log('\n🌿 Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seedDB();
