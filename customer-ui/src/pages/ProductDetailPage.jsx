import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const customer = localStorage.getItem('customer');
    if (!customer) {
      navigate('/login');
      return;
    }

    (async () => {
      const { data } = await api.get('/products');
      const found = data.find((item) => item.id === Number(id));
      setProduct(found || null);
    })();
  }, [id]);

  const logout = () => {
    localStorage.removeItem('customer');
    localStorage.removeItem('cart_id');
    navigate('/login');
  };

  const addToCart = async () => {
    if (!product) return;
    const customer = JSON.parse(localStorage.getItem('customer'));
    let cartId = localStorage.getItem('cart_id');

    if (!cartId) {
      const { data } = await api.post('/cart', { customer_id: customer.id });
      cartId = data.cart_id;
      localStorage.setItem('cart_id', cartId);
    }

    await api.post('/cart/add', { cart_id: Number(cartId), product_id: product.id, quantity: 1 });
    setMsg('Đã thêm sản phẩm vào giỏ hàng');
  };

  if (!product) {
    return (
      <div className="page-wrap">
        <div className="container">
          <h1>Product Detail</h1>
          <p>Không tìm thấy sản phẩm.</p>
          <Link className="link-btn" to="/home">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="topbar">
          <h1>Chi tiết sản phẩm</h1>
          <div className="topbar-actions">
            <Link className="link-btn" to="/home">Quay lại home</Link>
            <Link className="link-btn" to="/cart">Giỏ hàng</Link>
            <button className="danger-btn" onClick={logout}>Đăng xuất</button>
          </div>
        </div>

        <div className="card detail-card">
          {product.image_url && <img className="detail-image" src={product.image_url} alt={product.name} />}
          <h2>{product.name}</h2>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Giá:</strong> {Number(product.price).toLocaleString('vi-VN')} VND</p>
          <p><strong>Tồn kho:</strong> {product.quantity}</p>
          <p><strong>Mô tả:</strong> {product.description || 'Không có mô tả'}</p>
          <button onClick={addToCart}>Add to cart</button>
          {msg && <p className="success-text">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
