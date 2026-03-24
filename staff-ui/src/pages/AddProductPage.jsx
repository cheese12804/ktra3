import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const defaultForm = {
  name: '',
  category: 'mobile',
  price: 0,
  quantity: 1,
  description: ''
};

export default function AddProductPage() {
  const [form, setForm] = useState(defaultForm);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', form);
      setMsg('Thêm sản phẩm thành công');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      setMsg(error.response?.data?.message || 'Thêm sản phẩm thất bại');
    }
  };

  const logout = () => {
    localStorage.removeItem('staff');
    navigate('/login');
  };

  return (
    <div className="page-wrap">
      <div className="container form-container">
        <div className="topbar">
          <h1>Add product</h1>
          <div className="topbar-actions">
            <Link className="link-btn" to="/dashboard">← Back</Link>
            <button className="danger-btn" onClick={logout}>Đăng xuất</button>
          </div>
        </div>

        <form onSubmit={submit} className="card">
          <label>Tên sản phẩm</label>
          <input placeholder="VD: iPhone 15" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="mobile">mobile</option>
            <option value="laptop">laptop</option>
          </select>

          <label>Price (VND)</label>
          <input type="number" placeholder="20000000" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />

          <label>Quantity</label>
          <input type="number" placeholder="20" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />

          <label>Description</label>
          <textarea placeholder="Mô tả ngắn" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <button type="submit">Create</button>
        </form>
        <p className="success-text">{msg}</p>
      </div>
    </div>
  );
}
