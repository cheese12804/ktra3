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
    <div className="page-wrap">
      <div className="container">
        <div className="topbar">
          <h1>Giỏ hàng của bạn</h1>
          <Link className="link-btn" to="/home">Quay lại home</Link>
        </div>

        <div className="card">
          {cart.items.length === 0 && <p>Giỏ hàng đang trống.</p>}
          {cart.items.map((item) => (
            <div key={item.product_id} className="row">
              <span>{item.name}</span>
              <span>SL: {item.quantity}</span>
              <span>{item.line_total.toLocaleString('vi-VN')} VND</span>
            </div>
          ))}
          <h3>Total: {cart.total.toLocaleString('vi-VN')} VND</h3>
        </div>
      </div>
    </div>
  );
}
