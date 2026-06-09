import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/orders/admin/stats');
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="admin-dashboard">
            <h2 className="page-title">Admin Dashboard</h2>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Tổng Người Dùng</h3>
                    <p className="value">{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Tổng Đơn Hàng</h3>
                    <p className="value">{stats.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Tổng Doanh Thu</h3>
                    <p className="value">₫{parseFloat(stats.totalRevenue).toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Tổng Sản Phẩm</h3>
                    <p className="value">{stats.totalProducts}</p>
                </div>
            </div>

            <div className="admin-nav">
                <Link to="/admin/products" className="nav-btn">Quản Lý Sản Phẩm</Link>
                <Link to="/admin/orders" className="nav-btn">Quản Lý Đơn Hàng</Link>
                <Link to="/admin/categories" className="nav-btn">Quản Lý Danh Mục</Link>
            </div>

            <style jsx>{`
                .admin-dashboard { padding: 40px 0; }
                .page-title { color: var(--gold); margin-bottom: 3rem; text-align: center; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 4rem; }
                .stat-card { background: var(--card-bg); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 209, 102, 0.1); text-align: center; }
                .stat-card h3 { font-size: 1rem; color: var(--muted); margin-bottom: 1rem; }
                .stat-card .value { font-size: 2rem; font-weight: 700; color: var(--gold); margin: 0; }
                .admin-nav { display: flex; gap: 2rem; justify-content: center; }
                .nav-btn { background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 700; transition: all 0.3s; }
                .nav-btn:hover { background: var(--gold); color: #000; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
