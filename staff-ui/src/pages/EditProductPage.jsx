import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: 'mobile', price: 0, quantity: 1, description: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/products');
      const product = data.find((item) => item.id === Number(id));
      if (product) setForm(product);
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, form);
      setMsg('Cập nhật thành công');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      setMsg(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div className="page-wrap">
      <div className="container form-container">
        <div className="topbar">
          <h1>Edit product #{id}</h1>
          <Link className="link-btn" to="/dashboard">← Back</Link>
        </div>

        <form onSubmit={submit} className="card">
          <label>Tên sản phẩm</label>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="mobile">mobile</option>
            <option value="laptop">laptop</option>
          </select>

          <label>Price (VND)</label>
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />

          <label>Quantity</label>
          <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />

          <label>Description</label>
          <textarea placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <button type="submit">Update</button>
        </form>
        <p className="success-text">{msg}</p>
      </div>
    </div>
  );
}
