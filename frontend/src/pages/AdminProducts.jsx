import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        name: '', description: '', price: '', stock: '', category_id: '', image: null
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products?limit=100');
            setProducts(res.data.products);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    const handleFileChange = (e) => {
        setCurrentProduct({ ...currentProduct, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(currentProduct).forEach(key => {
            formData.append(key, currentProduct[key]);
        });

        try {
            if (isEditing) {
                await api.put(`/products/${currentProduct.id}`, formData);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await api.post('/products', formData);
                alert('Thêm sản phẩm thành công!');
            }
            fetchProducts();
            resetForm();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa sản phẩm này?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const resetForm = () => {
        setCurrentProduct({ name: '', description: '', price: '', stock: '', category_id: '', image: null });
        setIsEditing(false);
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="admin-products">
            <h2 className="page-title">Quản Lý Sản Phẩm</h2>
            
            <div className="admin-container">
                <div className="product-form-card">
                    <h3>{isEditing ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên sản phẩm</label>
                            <input type="text" name="name" value={currentProduct.name} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Danh mục</label>
                            <select name="category_id" value={currentProduct.category_id} onChange={handleInputChange} required>
                                <option value="">Chọn danh mục</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Giá (₫)</label>
                                <input type="number" name="price" value={currentProduct.price} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Kho</label>
                                <input type="number" name="stock" value={currentProduct.stock} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea name="description" value={currentProduct.description} onChange={handleInputChange} required rows="4"></textarea>
                        </div>
                        <div className="form-group">
                            <label>Hình ảnh</label>
                            <input type="file" onChange={handleFileChange} />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-submit">{isEditing ? 'Cập Nhật' : 'Thêm Mới'}</button>
                            {isEditing && <button type="button" onClick={resetForm} className="btn-cancel">Hủy</button>}
                        </div>
                    </form>
                </div>

                <div className="product-list-card">
                    <h3>Danh sách sản phẩm</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Kho</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td><img src={p.image?.startsWith('http') ? p.image : `http://localhost:5000/uploads/${p.image}`} alt="" /></td>
                                    <td>{p.name}</td>
                                    <td>₫{parseFloat(p.price).toLocaleString()}</td>
                                    <td>{p.stock}</td>
                                    <td>
                                        <button onClick={() => handleEdit(p)} className="btn-edit">Sửa</button>
                                        <button onClick={() => handleDelete(p.id)} className="btn-delete">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .admin-products { padding: 40px 0; }
                .page-title { color: var(--gold); text-align: center; margin-bottom: 3rem; }
                .admin-container { display: grid; grid-template-columns: 400px 1fr; gap: 2rem; align-items: start; }
                .product-form-card, .product-list-card { background: var(--card-bg); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 209, 102, 0.1); }
                h3 { color: var(--gold); margin-bottom: 1.5rem; font-size: 1.2rem; }
                .form-group { margin-bottom: 1.2rem; }
                .form-row { display: flex; gap: 1rem; }
                label { display: block; margin-bottom: 0.5rem; color: var(--muted); font-size: 0.9rem; }
                input, select, textarea { width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.3); color: #fff; box-sizing: border-box; }
                .form-actions { display: flex; gap: 1rem; margin-top: 1rem; }
                .btn-submit { flex: 1; padding: 0.8rem; background: var(--gold); border: none; border-radius: 6px; font-weight: 700; cursor: pointer; }
                .btn-cancel { padding: 0.8rem 1.5rem; background: transparent; border: 1px solid var(--muted); color: var(--muted); border-radius: 6px; cursor: pointer; }
                
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                th { text-align: left; color: var(--gold); padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
                td { padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
                td img { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; }
                .btn-edit { background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem; }
                .btn-delete { background: transparent; border: 1px solid #ff6b6b; color: #ff6b6b; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default AdminProducts;
