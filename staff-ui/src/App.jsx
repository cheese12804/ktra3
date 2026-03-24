import { Navigate, Route, Routes } from 'react-router-dom';
import StaffLoginPage from './pages/StaffLoginPage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<StaffLoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/add-product" element={<AddProductPage />} />
      <Route path="/edit-product/:id" element={<EditProductPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
