import axios from 'axios';

// VITE_API_URL = http://localhost:5000  (local)
//              = https://your-app.onrender.com  (production)
const BASE = import.meta.env.VITE_API_URL;

if (!BASE) {
  console.error('⚠️  VITE_API_URL is not set. Create client/.env with VITE_API_URL=http://localhost:5000');
}

const api = axios.create({ baseURL: `${BASE}/api` });

// Restore token on page reload
const stored = localStorage.getItem('user');
if (stored) {
  console.log("Called");
  const { token } = JSON.parse(stored);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
