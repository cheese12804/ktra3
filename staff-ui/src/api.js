import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_STAFF_API || 'http://localhost:3002'
});

export default api;
