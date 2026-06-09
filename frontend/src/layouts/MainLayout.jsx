import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const MainLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="main-layout">
            <header className="site-header">
                <div className="container header-inner">
                    <Link to="/" className="brand">
                        <h1 className="site-title">CROWN-CO</h1>
                    </Link>
                    <nav className="site-nav">
                        <ul>
                            <li><Link to="/">Trang Chủ</Link></li>
                            <li><Link to="/products">Sản Phẩm</Link></li>
                            {user ? (
                                <>
                                    <li><Link to="/cart">Giỏ Hàng</Link></li>
                                    <li><Link to="/profile">Hồ Sơ</Link></li>
                                    <li><Link to="/orders">Đơn Hàng</Link></li>
                                    {user.role === 'admin' && (
                                        <li><Link to="/admin">Admin</Link></li>
                                    )}
                                    <li><button onClick={handleLogout} className="btn-logout">Đăng Xuất</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login">Đăng Nhập</Link></li>
                                    <li><Link to="/register">Đăng Ký</Link></li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="site-main">
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <footer className="site-footer">
                <div className="container">
                    <p>&copy; 2025 CROWN-CO Luxury Shop. All Rights Reserved.</p>
                </div>
            </footer>

            <style jsx>{`
                .site-header {
                    background: rgba(0, 0, 0, 0.85);
                    border-bottom: 1px solid rgba(255, 209, 102, 0.1);
                    padding: 1rem 0;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                .header-inner {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .brand {
                    text-decoration: none;
                    color: var(--gold);
                }
                .site-title {
                    margin: 0;
                    font-size: 1.5rem;
                }
                .site-nav ul {
                    display: flex;
                    list-style: none;
                    gap: 1.5rem;
                    margin: 0;
                    padding: 0;
                    align-items: center;
                }
                .site-nav a {
                    color: var(--text);
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.3s;
                }
                .site-nav a:hover {
                    color: var(--gold);
                }
                .btn-logout {
                    background: transparent;
                    border: 1px solid var(--gold);
                    color: var(--gold);
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .btn-logout:hover {
                    background: var(--gold);
                    color: #000;
                }
                .site-main {
                    padding: 2rem 0;
                    min-height: 80vh;
                }
                .site-footer {
                    text-align: center;
                    padding: 2rem 0;
                    border-top: 1px solid rgba(255, 209, 102, 0.1);
                    color: var(--muted);
                }
            `}</style>
        </div>
    );
};

export default MainLayout;
