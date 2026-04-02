import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">GRIND<span>OS</span></div>
        <div className="auth-tagline">// your daily mission control</div>

        <form className="auth-form" onSubmit={onSubmit}>
          {error && <div className="auth-error">⚠ {error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email"
              placeholder="agent@grindos.io"
              value={form.email} onChange={onChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password"
              placeholder="••••••••"
              value={form.password} onChange={onChange} required />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'AUTHENTICATING…' : 'LOGIN'}
          </button>
        </form>

        <div className="auth-switch">
          No account? <Link to="/signup">Create one →</Link>
        </div>
      </div>
    </div>
  );
}
