// Signup page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const Signup = () => {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup(form.email.trim(), form.password, form.name.trim());
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message.includes('email-already-in-use')
        ? 'Email already in use'
        : err.message);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome! 🌟');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const field = (key, label, type, icon, placeholder) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }}>{icon}</span>
        <input
          type={type}
          className="form-input"
          style={{ paddingLeft: 40 }}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        />
      </div>
      {errors[key] && <p className="form-error">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="auth-wrapper">
      <div className="glass-card-strong auth-card animate-in">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: '2.5rem' }}>✦</div>
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start building your AI-powered resume</p>

        <form onSubmit={handleSubmit}>
          {field('name', 'Full Name', 'text', <FiUser />, 'John Doe')}
          {field('email', 'Email', 'email', <FiMail />, 'you@example.com')}
          {field('password', 'Password', 'password', <FiLock />, '••••••••')}
          {field('confirm', 'Confirm Password', 'password', <FiLock />, '••••••••')}

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={loading}
            style={{ marginBottom: 12, justifyContent: 'center' }}
          >
            {loading ? (
              <span className="galaxy-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : (
              <><FiUserPlus /> Create Account</>
            )}
          </button>
        </form>

        <div className="divider">or</div>

        <button
          className="btn btn-secondary w-full"
          style={{ justifyContent: 'center', marginBottom: 24 }}
          onClick={handleGoogle}
          disabled={loading}
        >
          <FcGoogle size={18} /> Continue with Google
        </button>

        <p className="text-center text-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
