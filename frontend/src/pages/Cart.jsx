import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await api.get('/cart');
            setCart(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            await api.put('/cart/update', { productId, quantity });
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await api.delete(`/cart/remove/${productId}`);
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckout = async () => {
        try {
            await api.post('/orders');
            alert('Đặt hàng thành công!');
            navigate('/orders');
        } catch (err) {
            alert(err.response?.data?.message || 'Checkout failed');
        }
    };

    if (loading) return <p>Đang tải...</p>;

    const total = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

    return (
        <div className="cart-page">
            <h2 className="page-title">Giỏ Hàng Của Bạn</h2>
            
            {!cart?.items?.length ? (
                <p className="empty-msg">Giỏ hàng đang trống.</p>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.items.map(item => (
                            <div key={item.product_id} className="cart-item">
                                <img src={item.image?.startsWith('http') ? item.image : `http://localhost:5000/uploads/${item.image}`} alt={item.name} />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">₫{parseFloat(item.price).toLocaleString()}</p>
                                </div>
                                <div className="item-qty">
                                    <button onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}>+</button>
                                </div>
                                <div className="item-subtotal">
                                    ₫{(item.price * item.quantity).toLocaleString()}
                                </div>
                                <button onClick={() => handleRemove(item.product_id)} className="btn-remove">✕</button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary">
                        <h3>Tổng Thanh Toán</h3>
                        <div className="summary-row">
                            <span>Tổng tiền hàng:</span>
                            <span>₫{total.toLocaleString()}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Tổng cộng:</span>
                            <span>₫{total.toLocaleString()}</span>
                        </div>
                        <button onClick={handleCheckout} className="btn-checkout">Đặt Hàng Ngay</button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .page-title {
                    color: var(--gold);
                    margin-bottom: 3rem;
                    text-align: center;
                }
                .cart-content {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 2rem;
                }
                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .cart-item {
                    display: flex;
                    align-items: center;
                    background: var(--card-bg);
                    padding: 1.5rem;
                    border-radius: 12px;
                    gap: 1.5rem;
                }
                .cart-item img {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 8px;
                }
                .item-info { flex: 1; }
                .item-info h3 { margin: 0 0 0.5rem; color: var(--gold); }
                .item-qty { display: flex; align-items: center; gap: 1rem; }
                .item-qty button {
                    background: transparent;
                    border: 1px solid var(--gold);
                    color: var(--gold);
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .item-subtotal {
                    font-weight: 700;
                    width: 150px;
                    text-align: right;
                }
                .btn-remove {
                    background: transparent;
                    border: none;
                    color: #ff6b6b;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: 1rem;
                }
                .cart-summary {
                    background: var(--card-bg);
                    padding: 2rem;
                    border-radius: 12px;
                    height: fit-content;
                    border: 1px solid rgba(255, 209, 102, 0.1);
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    color: var(--muted);
                }
                .summary-row.total {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--gold);
                }
                .btn-checkout {
                    width: 100%;
                    padding: 1rem;
                    background: var(--gold);
                    border: none;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 2rem;
                }
                .empty-msg { text-align: center; font-size: 1.2rem; color: var(--muted); }
            `}</style>
        </div>
    );
};

export default Cart;
