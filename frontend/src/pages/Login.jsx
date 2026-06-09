import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-page">
            <div className="auth-card">
                <h2>Đăng Nhập</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-submit">Đăng Nhập</button>
                </form>
            </div>

            <style jsx>{`
                .login-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 50px 0;
                }
                .auth-card {
                    background: var(--card-bg);
                    padding: 2.5rem;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 400px;
                    border: 1px solid rgba(255, 209, 102, 0.1);
                }
                h2 {
                    color: var(--gold);
                    margin-bottom: 2rem;
                    text-align: center;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--muted);
                }
                input {
                    width: 100%;
                    padding: 0.8rem;
                    border-radius: 6px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.3);
                    color: #fff;
                    box-sizing: border-box;
                }
                .btn-submit {
                    width: 100%;
                    padding: 1rem;
                    background: var(--gold);
                    border: none;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 1rem;
                }
                .error {
                    color: #ff6b6b;
                    background: rgba(255, 107, 107, 0.1);
                    padding: 0.8rem;
                    border-radius: 6px;
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default Login;
