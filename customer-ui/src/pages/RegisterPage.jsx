import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setMsg('Đăng ký thành công. Vui lòng đăng nhập.');
      setTimeout(() => navigate('/login'), 500);
    } catch (error) {
      setMsg(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="container">
      <h1>Customer Register</h1>
      <form onSubmit={onSubmit} className="card">
        <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button type="submit">Đăng ký</button>
      </form>
      <p>{msg}</p>
      <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
    </div>
  );
}
