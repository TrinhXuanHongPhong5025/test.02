import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <h1>Khẳng định đẳng cấp — Sống khác biệt</h1>
                <p>CROWN-CO Shop tuyển chọn tinh hoa của thế giới xa xỉ: đồng hồ Thụy Sĩ, túi da thủ công, trang sức quý và những vật phẩm phong cách sống dành cho người sành sỏi.</p>
                <div className="cta">
                    <Link to="/products" className="btn-primary">Khám phá bộ sưu tập</Link>
                </div>
            </section>

            <style jsx>{`
                .hero {
                    text-align: center;
                    padding: 100px 0;
                }
                .hero h1 {
                    font-size: 3.5rem;
                    color: var(--gold);
                    margin-bottom: 1.5rem;
                }
                .hero p {
                    font-size: 1.2rem;
                    max-width: 800px;
                    margin: 0 auto 2.5rem;
                    color: var(--muted);
                }
                .btn-primary {
                    background: var(--gold);
                    color: #000;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 700;
                    transition: transform 0.3s;
                    display: inline-block;
                }
                .btn-primary:hover {
                    transform: translateY(-5px);
                }
            `}</style>
        </div>
    );
};

export default Home;
