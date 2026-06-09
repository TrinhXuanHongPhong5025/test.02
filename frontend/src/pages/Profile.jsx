import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [fullname, setFullname] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setUser(res.data);
            setFullname(res.data.fullname);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/profile', { fullname });
            alert('Cập nhật hồ sơ thành công!');
            fetchProfile();
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/change-password', { oldPassword, newPassword });
            alert('Đổi mật khẩu thành công!');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            alert(err.response?.data?.message || 'Change password failed');
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="profile-page">
            <h2 className="page-title">Hồ Sơ Của Bạn</h2>
            <div className="profile-container">
                <div className="profile-card">
                    <h3>Thông tin cá nhân</h3>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={user.email} disabled />
                        </div>
                        <div className="form-group">
                            <label>Họ và Tên</label>
                            <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-save">Lưu thay đổi</button>
                    </form>
                </div>

                <div className="profile-card">
                    <h3>Đổi mật khẩu</h3>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label>Mật khẩu cũ</label>
                            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-save">Đổi mật khẩu</button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .profile-page { padding: 40px 0; }
                .page-title { color: var(--gold); text-align: center; margin-bottom: 3rem; }
                .profile-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 900px; margin: 0 auto; }
                .profile-card { background: var(--card-bg); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 209, 102, 0.1); }
                .profile-card h3 { color: var(--gold); margin-bottom: 1.5rem; }
                .form-group { margin-bottom: 1.2rem; }
                label { display: block; margin-bottom: 0.5rem; color: var(--muted); font-size: 0.9rem; }
                input { width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.3); color: #fff; box-sizing: border-box; }
                input:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-save { width: 100%; padding: 0.8rem; background: var(--gold); border: none; border-radius: 6px; font-weight: 700; cursor: pointer; margin-top: 1rem; }
            `}</style>
        </div>
    );
};

export default Profile;
