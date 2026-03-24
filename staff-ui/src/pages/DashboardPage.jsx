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

  return (
    <div className="container">
      <h1>Staff Dashboard</h1>
      <Link to="/add-product">Add product</Link>
      <div className="card">
        {products.map((p) => (
          <div className="row" key={p.id}>
            <span>{p.name} ({p.category}) - ${Number(p.price).toFixed(2)} - qty: {p.quantity}</span>
            <Link to={`/edit-product/${p.id}`}>Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
