import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function StaffLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/staff/login', { username, password });
      localStorage.setItem('staff', JSON.stringify(data.staff));
      navigate('/dashboard');
    } catch (error) {
      setMsg(error.response?.data?.message || 'Login thất bại');
    }
  };

  return (
    <div className="container">
      <h1>Staff Login</h1>
      <form onSubmit={onSubmit} className="card">
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Đăng nhập</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
