import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ streak = 0 }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/login'); };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        GRIND<span>OS</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/"       className={({ isActive }) => isActive ? 'active' : ''} end>Dashboard</NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>History</NavLink>
      </div>
      <div className="navbar-right">
        {streak > 0 && (
          <span style={{ fontSize: 13, color: 'var(--gold)', fontFamily: 'var(--font-mono)', display:'flex', alignItems:'center', gap:4 }}>
            🔥 {streak}d
          </span>
        )}
        <span className="navbar-name">{user?.name}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
