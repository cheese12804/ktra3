import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    const { data } = await api.get('/products', { params: { category: category || undefined } });
    setProducts(data);
  };

  useEffect(() => {
    const customer = localStorage.getItem('customer');
    if (!customer) navigate('/login');
    loadProducts();
  }, [category]);

  const onSearch = async () => {
    if (!search.trim()) return loadProducts();
    const { data } = await api.get('/products/search', { params: { q: search } });
    setProducts(data);
  };

  const addToCart = async (productId) => {
    const customer = JSON.parse(localStorage.getItem('customer'));
    let cartId = localStorage.getItem('cart_id');

    if (!cartId) {
      const { data } = await api.post('/cart', { customer_id: customer.id });
      cartId = data.cart_id;
      localStorage.setItem('cart_id', cartId);
    }

    await api.post('/cart/add', { cart_id: Number(cartId), product_id: productId, quantity: 1 });
    alert('Đã thêm vào giỏ hàng');
  };

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="topbar">
          <h1>Customer Store</h1>
          <Link className="link-btn" to="/cart">View cart</Link>
        </div>

        <div className="toolbar card">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            <option value="mobile">Mobile</option>
            <option value="laptop">Laptop</option>
          </select>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product by name" />
          <button onClick={onSearch}>Search</button>
        </div>

        <div className="grid">
          {products.map((p) => (
            <div className="card product-card" key={p.id}>
              <h3>{p.name}</h3>
              <p>Category: {p.category}</p>
              <p>Giá: {Number(p.price).toLocaleString('vi-VN')} VND</p>
              <p>Tồn kho: {p.quantity}</p>
              <div className="actions">
                <Link className="link-btn" to={`/products/${p.id}`}>Chi tiết</Link>
                <button onClick={() => addToCart(p.id)}>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
