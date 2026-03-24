import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '', full_name: '', phone: '' });
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
        <input placeholder="Email (@gmail.com)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Họ và tên" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input placeholder="Số điện thoại (10 số)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button type="submit">Đăng ký</button>
      </form>
      <p>{msg}</p>
      <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
    </div>
  );
}
