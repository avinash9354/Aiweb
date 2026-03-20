// Navbar component
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser, FiShield, FiFileText, FiBriefcase, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ✦ ResumeAI
      </Link>

      <ul className="navbar-links">
        {currentUser ? (
          <>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/resume/new">Build Resume</NavLink></li>
            <li><NavLink to="/jobs">Jobs</NavLink></li>
            <li><NavLink to="/ai-tools">AI Tools</NavLink></li>
            {isAdmin() && (
              <li>
                <NavLink to="/admin" style={{ color: '#f59e0b' }}>
                  <FiShield style={{ marginRight: 4 }} /> Admin
                </NavLink>
              </li>
            )}
            <li>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '6px 10px' }}>
                {userProfile?.name || currentUser.email.split('@')[0]}
                {userProfile?.plan === 'paid' && (
                  <span className="badge badge-pro" style={{ marginLeft: 6 }}>Pro</span>
                )}
              </span>
            </li>
            <li>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
