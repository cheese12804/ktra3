import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('customer', JSON.stringify(data.user));
      navigate('/home');
    } catch (error) {
      setMsg(error.response?.data?.message || 'Login thất bại');
    }
  };

  return (
    <div className="container">
      <h1>Customer Login</h1>
      <form onSubmit={onSubmit} className="card">
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Đăng nhập</button>
      </form>
      <p>{msg}</p>
      <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
    </div>
  );
}
