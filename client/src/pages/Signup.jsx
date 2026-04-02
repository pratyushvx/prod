import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Signup() {
  const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
      });
      login(data);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">GRIND<span>OS</span></div>
        <div className="auth-tagline">// initialize your grind sequence</div>

        <form className="auth-form" onSubmit={onSubmit}>
          {error && <div className="auth-error">⚠ {error}</div>}

          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" type="text" name="name"
              placeholder="Your name"
              value={form.name} onChange={onChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email"
              placeholder="agent@grindos.io"
              value={form.email} onChange={onChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password"
              placeholder="Min 6 characters"
              value={form.password} onChange={onChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" name="confirm"
              placeholder="••••••••"
              value={form.confirm} onChange={onChange} required />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'INITIALIZING…' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="auth-switch">
          Have an account? <Link to="/login">Login →</Link>
        </div>
      </div>
    </div>
  );
}
