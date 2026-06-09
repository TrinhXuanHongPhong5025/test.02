import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/categories/${currentCategory.id}`, currentCategory);
                alert('Cập nhật danh mục thành công!');
            } else {
                await api.post('/categories', currentCategory);
                alert('Thêm danh mục thành công!');
            }
            fetchCategories();
            resetForm();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (cat) => {
        setCurrentCategory(cat);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa danh mục này?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const resetForm = () => {
        setCurrentCategory({ name: '', description: '' });
        setIsEditing(false);
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="admin-categories">
            <h2 className="page-title">Quản Lý Danh Mục</h2>
            
            <div className="admin-container">
                <div className="form-card">
                    <h3>{isEditing ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên danh mục</label>
                            <input 
                                type="text" 
                                value={currentCategory.name} 
                                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea 
                                value={currentCategory.description} 
                                onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})} 
                                required 
                                rows="4"
                            ></textarea>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-submit">{isEditing ? 'Cập Nhật' : 'Thêm Mới'}</button>
                            {isEditing && <button type="button" onClick={resetForm} className="btn-cancel">Hủy</button>}
                        </div>
                    </form>
                </div>

                <div className="list-card">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên danh mục</th>
                                <th>Mô tả</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td>{cat.name}</td>
                                    <td>{cat.description}</td>
                                    <td>
                                        <button onClick={() => handleEdit(cat)} className="btn-edit">Sửa</button>
                                        <button onClick={() => handleDelete(cat.id)} className="btn-delete">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .admin-categories { padding: 40px 0; }
                .page-title { color: var(--gold); text-align: center; margin-bottom: 3rem; }
                .admin-container { display: grid; grid-template-columns: 400px 1fr; gap: 2rem; align-items: start; }
                .form-card, .list-card { background: var(--card-bg); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 209, 102, 0.1); }
                h3 { color: var(--gold); margin-bottom: 1.5rem; }
                .form-group { margin-bottom: 1.2rem; }
                label { display: block; margin-bottom: 0.5rem; color: var(--muted); }
                input, textarea { width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.3); color: #fff; box-sizing: border-box; }
                .form-actions { display: flex; gap: 1rem; }
                .btn-submit { flex: 1; padding: 0.8rem; background: var(--gold); border: none; border-radius: 6px; font-weight: 700; cursor: pointer; }
                .btn-cancel { padding: 0.8rem 1.5rem; background: transparent; border: 1px solid var(--muted); color: var(--muted); border-radius: 6px; cursor: pointer; }
                table { width: 100%; border-collapse: collapse; }
                th { text-align: left; color: var(--gold); padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
                td { padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
                .btn-edit { background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem; }
                .btn-delete { background: transparent; border: 1px solid #ff6b6b; color: #ff6b6b; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default AdminCategories;
