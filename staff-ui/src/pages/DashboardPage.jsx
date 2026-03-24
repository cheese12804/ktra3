import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const loadProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  };

  useEffect(() => {
    const staff = localStorage.getItem('staff');
    if (!staff) navigate('/login');
    loadProducts();
  }, []);

  const logout = () => {
    localStorage.removeItem('staff');
    navigate('/login');
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa sản phẩm này?');
    if (!confirmDelete) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="topbar">
          <div>
            <h1>Staff Dashboard</h1>
            <p className="subtext">Quản lý danh sách sản phẩm</p>
          </div>
          <div className="topbar-actions">
            <Link className="link-btn primary-link" to="/add-product">+ Add product</Link>
            <button className="danger-btn" onClick={logout}>Đăng xuất</button>
          </div>
        </div>

        <div className="card table-card">
          <div className="table-head">
            <span>Tên sản phẩm</span>
            <span>Category</span>
            <span>Giá</span>
            <span>SL</span>
            <span>Hành động</span>
          </div>

          {products.map((p) => (
            <div className="table-row" key={p.id}>
              <span>{p.name}</span>
              <span>{p.category}</span>
              <span>{Number(p.price).toLocaleString('vi-VN')} VND</span>
              <span>{p.quantity}</span>
              <div className="actions">
                <Link className="link-btn" to={`/edit-product/${p.id}`}>Edit</Link>
                <button className="danger-btn" onClick={() => deleteProduct(p.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
