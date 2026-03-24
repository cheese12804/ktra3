import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });

  const loadCart = async () => {
    const cartId = localStorage.getItem('cart_id');
    if (!cartId) return;
    const { data } = await api.get(`/cart/${cartId}`);
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div className="container">
      <h1>Giỏ hàng</h1>
      <Link to="/home">← Quay lại home</Link>
      <div className="card">
        {cart.items.map((item) => (
          <div key={item.product_id} className="row">
            <span>{item.name}</span>
            <span>SL: {item.quantity}</span>
            <span>${item.line_total.toFixed(2)}</span>
          </div>
        ))}
        <h3>Total: ${cart.total.toFixed(2)}</h3>
      </div>
    </div>
  );
}
