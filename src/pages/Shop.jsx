import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/products/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [sortBy, setSortBy] = useState('popularity');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const categories = ['All', 'Serums', 'Face Wash', 'Moisturizers', 'Oils', 'Treatments', 'Bundles'];

    const activeCategory = categoryParam || 'All';

    const handleCategoryChange = (cat) => {
        if (cat === 'All') {
            searchParams.delete('category');
            setSearchParams(searchParams);
        } else {
            setSearchParams({ category: cat });
        }
        setMobileFiltersOpen(false);
    };

    const filteredProducts = useMemo(() => {
        let filtered = products;
        if (activeCategory !== 'All') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }
        return filtered;
    }, [activeCategory]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
            return (b.reviews || 0) - (a.reviews || 0); // popularity default
        });
    }, [filteredProducts, sortBy]);

    return (
        <div className="shop-page container">
            <div className="shop-header">
                <h1>Shop All</h1>
                <p>Curated botanical skincare for your daily ritual.</p>
            </div>

            <div className="shop-controls">
                <button
                    className="filter-toggle mobile-only"
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                >
                    <SlidersHorizontal size={18} /> Filters
                </button>

                <div className={`categories ${mobileFiltersOpen ? 'open' : ''}`}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="sort-dropdown">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="popularity">Popularity</option>
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="product-grid-section">
                {sortedProducts.length > 0 ? (
                    <div className="product-grid">
                        {sortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No products found in this category.</p>
                        <button onClick={() => handleCategoryChange('All')} className="reset-btn">View All Products</button>
                    </div>
                )}
            </div>

            <style>{`
                .shop-page {
                    padding-top: 8rem;
                    padding-bottom: 4rem;
                }

                .shop-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .shop-header h1 {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                }

                .shop-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 1rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .categories {
                    display: flex;
                    gap: 1.5rem;
                }

                .category-btn {
                    font-family: var(--font-body);
                    font-size: 0.95rem;
                    color: var(--color-text-muted);
                    background: none;
                    border: none;
                    padding: 0.5rem 0;
                    cursor: pointer;
                    position: relative;
                    transition: color 0.2s;
                }

                .category-btn:hover,
                .category-btn.active {
                    color: var(--color-text-main);
                    font-weight: 600;
                }

                .category-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1rem; /* Aligns with border-bottom of shop-controls */
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: var(--color-primary);
                }

                .sort-dropdown select {
                    padding: 0.5rem 2rem 0.5rem 1rem;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-sm);
                    font-family: var(--font-body);
                    background-color: transparent;
                    cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 0.7rem center;
                    background-size: 1em;
                }

                .filter-toggle {
                    display: none;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-sm);
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 2.5rem;
                }

                .no-results {
                    text-align: center;
                    padding: 4rem 0;
                }

                .reset-btn {
                    color: var(--color-primary);
                    text-decoration: underline;
                    margin-top: 1rem;
                }

                @media (max-width: 768px) {
                    .shop-controls {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .categories {
                        display: none;
                        flex-direction: column;
                        width: 100%;
                        padding-top: 1rem;
                        gap: 0.5rem;
                    }

                    .categories.open {
                        display: flex;
                    }

                    .categories.open .category-btn.active::after {
                        display: none;
                    }

                    .category-btn {
                        text-align: left;
                        padding: 0.5rem;
                    }

                    .category-btn.active {
                        background-color: var(--color-secondary);
                    }

                    .filter-toggle {
                        display: flex;
                    }

                    .sort-dropdown {
                        width: 100%;
                    }
                    
                    .sort-dropdown select {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Shop;
