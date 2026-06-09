import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await api.post('/cart/add', { productId: id, quantity });
            alert('Đã thêm vào giỏ hàng!');
            navigate('/cart');
        } catch (err) {
            alert('Hãy đăng nhập để mua hàng!');
            navigate('/login');
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (!product) return <p>Không tìm thấy sản phẩm.</p>;

    return (
        <div className="product-detail">
            <div className="detail-container">
                <div className="product-image">
                    <img src={product.image?.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`} alt={product.name} />
                </div>
                <div className="product-info">
                    <p className="category">{product.category_name}</p>
                    <h1>{product.name}</h1>
                    <p className="price">₫{parseFloat(product.price).toLocaleString()}</p>
                    <p className="description">{product.description}</p>
                    
                    <div className="purchase-actions">
                        <div className="qty-selector">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                        <button onClick={handleAddToCart} className="btn-add">Thêm Vào Giỏ Hàng</button>
                    </div>
                    
                    <p className="stock">Còn lại: {product.stock} sản phẩm</p>
                </div>
            </div>

            <style jsx>{`
                .product-detail { padding: 50px 0; }
                .detail-container { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
                .product-image img { width: 100%; border-radius: 12px; border: 1px solid rgba(255, 209, 102, 0.1); }
                .category { color: var(--gold); text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; margin-bottom: 1rem; }
                h1 { font-size: 3rem; margin: 0 0 1.5rem; }
                .price { font-size: 2rem; font-weight: 700; color: var(--gold); margin-bottom: 2rem; }
                .description { line-height: 1.8; color: var(--muted); margin-bottom: 3rem; font-size: 1.1rem; }
                .purchase-actions { display: flex; gap: 2rem; align-items: center; margin-bottom: 2rem; }
                .qty-selector { display: flex; align-items: center; gap: 1.5rem; background: rgba(255, 255, 255, 0.05); padding: 0.5rem 1rem; border-radius: 8px; }
                .qty-selector button { background: transparent; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
                .qty-selector span { font-size: 1.2rem; font-weight: 700; min-width: 30px; text-align: center; }
                .btn-add { flex: 1; padding: 1.2rem; background: var(--gold); border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; }
                .stock { color: var(--muted); font-size: 0.9rem; }
            `}</style>
        </div>
    );
};

export default ProductDetail;
