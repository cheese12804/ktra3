import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });

  const loadCart = async () => {
    const cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      setCart({ items: [], total: 0 });
      return;
    }
    const { data } = await api.get(`/cart/${cartId}`);
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const logout = () => {
    localStorage.removeItem('customer');
    localStorage.removeItem('cart_id');
    navigate('/login');
  };

  const updateQuantity = async (productId, quantity) => {
    const cartId = Number(localStorage.getItem('cart_id'));
    await api.put('/cart/item', { cart_id: cartId, product_id: productId, quantity });
    loadCart();
  };

  const removeItem = async (productId) => {
    const cartId = Number(localStorage.getItem('cart_id'));
    await api.delete('/cart/item', { data: { cart_id: cartId, product_id: productId } });
    loadCart();
  };

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="topbar">
          <h1>Giỏ hàng của bạn</h1>
          <div className="topbar-actions">
            <Link className="link-btn" to="/home">Quay lại home</Link>
            <button className="danger-btn" onClick={logout}>Đăng xuất</button>
          </div>
        </div>

        <div className="card">
          {cart.items.length === 0 && <p>Giỏ hàng đang trống.</p>}
          {cart.items.map((item) => (
            <div key={item.product_id} className="row">
              <span>{item.name}</span>
              <span className="qty-box">
                <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                <strong>{item.quantity}</strong>
                <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
              </span>
              <span>{item.line_total.toLocaleString('vi-VN')} VND</span>
              <button className="danger-btn" onClick={() => removeItem(item.product_id)}>Xóa</button>
            </div>
          ))}
          <h3>Total: {cart.total.toLocaleString('vi-VN')} VND</h3>
        </div>
      </div>
    </div>
  );
}
