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

  return (
    <div className="container">
      <h1>Add product</h1>
      <Link to="/dashboard">← Back</Link>
      <form onSubmit={submit} className="card">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="mobile">mobile</option>
          <option value="laptop">laptop</option>
        </select>
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Create</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
