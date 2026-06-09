import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, category, page]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products', {
                params: { search, categoryId: category, page, limit: 8 }
            });
            setProducts(res.data.products);
            setTotalPages(res.data.pagination.totalPages);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="products-page">
            <h2 className="page-title">Bộ Sưu Tập Sang Trọng</h2>
            
            <div className="filters">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="category-select"
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className="loading">Đang tải...</p>
            ) : (
                <>
                    <div className="product-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="img-wrap">
                                    <img src={product.image?.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`} alt={product.name} />
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="price">₫{parseFloat(product.price).toLocaleString()}</p>
                                    <Link to={`/products/${product.id}`} className="btn-view">Xem chi tiết</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button 
                                key={p} 
                                onClick={() => setPage(p)}
                                className={page === p ? 'active' : ''}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <style jsx>{`
                .page-title {
                    text-align: center;
                    color: var(--gold);
                    margin-bottom: 3rem;
                    font-size: 2.5rem;
                }
                .filters {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 3rem;
                    justify-content: center;
                }
                .search-input, .category-select {
                    padding: 0.8rem;
                    border-radius: 6px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.3);
                    color: #fff;
                }
                .search-input { width: 300px; }
                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 2rem;
                }
                .product-card {
                    background: var(--card-bg);
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 209, 102, 0.1);
                    transition: transform 0.3s;
                }
                .product-card:hover {
                    transform: translateY(-10px);
                }
                .img-wrap {
                    height: 200px;
                }
                .img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .product-info {
                    padding: 1.5rem;
                }
                h3 {
                    margin: 0 0 0.5rem;
                    color: var(--gold);
                }
                .price {
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }
                .btn-view {
                    display: block;
                    text-align: center;
                    background: var(--gold);
                    color: #000;
                    text-decoration: none;
                    padding: 0.8rem;
                    border-radius: 6px;
                    font-weight: 600;
                }
                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 3rem;
                }
                .pagination button {
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    border: 1px solid var(--gold);
                    background: transparent;
                    color: var(--gold);
                    cursor: pointer;
                }
                .pagination button.active {
                    background: var(--gold);
                    color: #000;
                }
            `}</style>
        </div>
    );
};

export default Products;
