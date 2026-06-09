import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            alert('Cập nhật trạng thái thành công!');
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="admin-orders">
            <h2 className="page-title">Quản Lý Đơn Hàng</h2>
            
            <div className="orders-table-card">
                <table>
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.fullname}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>₫{parseFloat(order.total_amount).toLocaleString()}</td>
                                <td>
                                    <span className={`status-badge ${order.status}`}>{order.status}</span>
                                </td>
                                <td>
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .admin-orders { padding: 40px 0; }
                .page-title { color: var(--gold); text-align: center; margin-bottom: 3rem; }
                .orders-table-card { background: var(--card-bg); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 209, 102, 0.1); }
                table { width: 100%; border-collapse: collapse; }
                th { text-align: left; color: var(--gold); padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
                td { padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
                .status-badge { padding: 0.3rem 0.8rem; border-radius: 99px; font-size: 0.8rem; font-weight: 700; }
                .status-badge.pending { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
                .status-badge.delivered { background: rgba(40, 167, 69, 0.2); color: #28a745; }
                .status-badge.cancelled { background: rgba(220, 53, 69, 0.2); color: #dc3545; }
                .status-select { padding: 0.4rem; border-radius: 4px; background: #000; color: #fff; border: 1px solid var(--gold); }
            `}</style>
        </div>
    );
};

export default AdminOrders;
