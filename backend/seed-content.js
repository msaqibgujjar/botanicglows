const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
dotenv.config();

const Content = require('./models/Content');
const BlogPost = require('./models/BlogPost');

const contentData = [
    {
        type: 'homepage',
        data: {
            heroTitle: 'Unlock Your Natural Glow',
            heroSubtitle: 'Experience the power of organic botanical skincare designed to nourish, repair, and illuminate your skin.',
            heroImage: 'https://images.unsplash.com/photo-1556228720-19777f987f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            features: [
                { title: '100% Organic', text: 'Sourced from sustainable farms.' },
                { title: 'Deep Hydration', text: 'Formulated for lasting moisture.' },
                { title: 'Cruelty Free', text: 'Tested on humans, never animals.' },
            ],
            aboutTitle: "Nature's Best Kept Secret",
            aboutText1: 'At Botanic Glows, we believe that true beauty comes from nature. Our formulas are crafted with ethically sourced botanicals, free from harsh chemicals and synthetic fragrances.',
            aboutText2: 'We combine ancient herbal wisdom with modern dermatological science to create skincare that not only works but feels luxurious.',
            aboutImage: 'https://images.unsplash.com/photo-1552693673-1bf958298935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            testimonials: [
                { text: 'The Glow Radiance Serum has completely transformed my skin. I\'ve never felt more confident!', author: 'Sarah M.' },
                { text: 'Finally, a natural brand that actually delivers results. The night oil is a game changer.', author: 'Jessica K.' },
                { text: 'I love the sustainable packaging and the clean ingredients. Botanic Glows is my new favorite.', author: 'Emily R.' },
            ],
        },
    },
    {
        type: 'about',
        data: {
            heroTitle: 'Our Story',
            heroSubtitle: 'Rooted in nature, backed by science.',
            sections: [
                {
                    title: 'The Beginning',
                    text: 'Botanic Glows was born from a desire to create skincare that is as kind to the planet as it is to your skin. Founded in 2023, our mission has always been to harness the power of botanicals to reveal your natural radiance.',
                    image: 'https://images.unsplash.com/photo-1556228720-19777f987f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                },
                {
                    title: 'Our Philosophy',
                    text: 'We believe in transparency and purity. Every ingredient is carefully selected for its efficacy and sustainability. No fillers, no harsh chemicals, just pure botanical goodness.',
                    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                },
            ],
            values: [
                { title: 'Sustainability', text: 'Packaged in recyclable glass and responsibly sourced materials.' },
                { title: 'Cruelty-Free', text: 'We never test on animals, and we never will.' },
                { title: 'Community', text: 'Supporting local farmers and ethical supply chains.' },
            ],
        },
    },
    {
        type: 'contact',
        data: {
            heroTitle: 'Get in Touch',
            heroSubtitle: "We'd love to hear from you. Our team is always here to help.",
            email1: 'hello@botanicglows.com',
            email2: 'support@botanicglows.com',
            phone: '+1 (555) 123-4567',
            phoneHours: 'Mon-Fri, 9am - 6pm EST',
            address1: '123 Botanical Ave,',
            address2: 'New York, NY 10012',
            mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        },
    },
];

const blogPosts = [
    {
        title: '5 Steps to Glowing Skin',
        content: 'Discover the simple routine that will transform your complexion naturally. Start with a gentle cleanser, follow with a toner, apply a serum, moisturize, and always use sunscreen.',
        excerpt: 'Discover the simple routine that will transform your complexion naturally.',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'Published',
        author: 'Botanic Glows Team',
    },
    {
        title: 'The Benefits of Rose Hip Oil',
        content: 'Why this miracle ingredient should be a staple in your skincare arsenal. Rose hip oil is rich in vitamins A and C, and helps reduce scars, fine lines, and hyperpigmentation.',
        excerpt: 'Why this miracle ingredient should be a staple in your skincare arsenal.',
        image: 'https://images.unsplash.com/photo-1601049541289-9b3b7d5d71da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'Published',
        author: 'Botanic Glows Team',
    },
    {
        title: 'Sustainable Beauty Guide',
        content: 'How to make your beauty routine more eco-friendly and sustainable. Choose products with minimal packaging, support cruelty-free brands, and recycle your empties.',
        excerpt: 'How to make your beauty routine more eco-friendly and sustainable.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'Published',
        author: 'Botanic Glows Team',
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log('✅ Connected to MongoDB');

        // Seed content pages
        for (const item of contentData) {
            await Content.findOneAndUpdate({ type: item.type }, item, { upsert: true, new: true });
            console.log(`✅ Content: ${item.type}`);
        }

        // Seed blog posts (only if none exist)
        const blogCount = await BlogPost.countDocuments();
        if (blogCount === 0) {
            for (const post of blogPosts) {
                await BlogPost.create(post);
                console.log(`✅ Blog: ${post.title}`);
            }
        } else {
            console.log(`⏭️  ${blogCount} blog posts already exist, skipping`);
        }

        console.log('\n🌿 Content seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

seed();
