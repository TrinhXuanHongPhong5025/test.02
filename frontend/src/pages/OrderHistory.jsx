import React, { useState, useEffect } from 'react';
import api from '../services/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my-orders');
                setOrders(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
        try {
            await api.put(`/orders/${orderId}/cancel`);
            alert('Đã hủy đơn hàng!');
            // Refresh orders
            const res = await api.get('/orders/my-orders');
            setOrders(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Không thể hủy đơn hàng');
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="order-history">
            <h2 className="page-title">Lịch Sử Đơn Hàng</h2>
            
            {orders.length === 0 ? (
                <p className="empty-msg">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <span className="order-id">Mã đơn: #{order.id}</span>
                                    <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <span className={`order-status ${order.status}`}>{order.status}</span>
                            </div>
                            <div className="order-total">
                                <span>Tổng cộng:</span>
                                <span className="amount">₫{parseFloat(order.total_amount).toLocaleString()}</span>
                            </div>
                            {order.status === 'pending' && (
                                <button onClick={() => handleCancelOrder(order.id)} className="btn-cancel">Hủy Đơn Hàng</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .order-history { padding: 40px 0; }
                .page-title { color: var(--gold); text-align: center; margin-bottom: 3rem; }
                .empty-msg { text-align: center; color: var(--muted); }
                .orders-list { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .order-card { background: var(--card-bg); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 209, 102, 0.1); }
                .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .order-info { display: flex; flex-direction: column; gap: 0.2rem; }
                .order-id { font-weight: 700; color: var(--gold); }
                .order-date { font-size: 0.8rem; color: var(--muted); }
                .order-status { text-transform: capitalize; padding: 0.3rem 0.8rem; border-radius: 99px; font-size: 0.8rem; font-weight: 700; }
                .order-status.pending { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
                .order-status.delivered { background: rgba(40, 167, 69, 0.2); color: #28a745; }
                .order-status.cancelled { background: rgba(220, 53, 69, 0.2); color: #dc3545; }
                .order-total { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
                .amount { font-size: 1.2rem; font-weight: 700; color: var(--gold); }
                .btn-cancel { margin-top: 1.5rem; width: 100%; padding: 0.8rem; background: transparent; border: 1px solid #ff6b6b; color: #ff6b6b; border-radius: 6px; cursor: pointer; transition: all 0.3s; }
                .btn-cancel:hover { background: #ff6b6b; color: #fff; }
            `}</style>
        </div>
    );
};

export default OrderHistory;
