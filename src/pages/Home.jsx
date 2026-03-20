// Home / Landing page
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiZap, FiShield, FiDownload, FiStar } from 'react-icons/fi';

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Writing', desc: 'GPT-4 generates professional resume content tailored to your skills and experience.' },
  { icon: '🎨', title: '20+ Templates', desc: 'Choose from modern, creative, and ATS-optimized resume templates.' },
  { icon: '💳', title: 'UPI & Card Payments', desc: 'Upgrade to Pro with Razorpay – UPI, cards, wallets, all supported.' },
  { icon: '📄', title: 'PDF Export', desc: 'Download your resume as a polished PDF instantly.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and never shared. Firebase auth protects your account.' },
  { icon: '📊', title: 'Admin Analytics', desc: 'Full admin dashboard with charts, export/import, and user management.' },
];

const PLANS = [
  {
    name: 'Free', price: '₹0', color: '#64748b',
    features: ['2 Resumes', 'Basic Templates', 'Limited AI (300 tokens)', 'PDF with Watermark'],
  },
  {
    name: 'Pro', price: '₹199', color: '#6366f1', popular: true,
    features: ['Unlimited Resumes', 'All Templates', 'Full AI Output', 'Clean PDF Download', 'Priority Support'],
  },
];

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div className="badge badge-pro" style={{ marginBottom: 20, fontSize: '0.8rem' }}>
          ✦ AI-Powered Resume Builder
        </div>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: 20,
          background: 'linear-gradient(135deg, #f1f5f9 0%, #a78bfa 50%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Build Your Dream Resume<br />With the Power of AI
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Create professional, ATS-optimized resumes in minutes using GPT-4. Free tier available. Upgrade for unlimited AI magic.
        </p>
        <div className="flex justify-center gap-12" style={{ flexWrap: 'wrap' }}>
          <Link to={currentUser ? '/resume/new' : '/signup'} className="btn btn-primary btn-lg">
            Start Building Free <FiArrowRight />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-20 mt-24" style={{ flexWrap: 'wrap' }}>
          {['🔒 Secure', '⚡ Fast', '🌟 AI-Powered', '📱 Responsive'].map(t => (
            <span key={t} style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
          Everything You Need
        </h2>
        <p className="text-center text-secondary mb-24" style={{ marginBottom: 36 }}>
          Professional tools to land your dream job
        </p>
        <div className="grid-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-card" style={{ padding: 28 }}>
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
          Simple Pricing
        </h2>
        <p className="text-secondary mb-24" style={{ marginBottom: 36 }}>Start free, upgrade when you're ready</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {PLANS.map((plan) => (
            <div key={plan.name} className="glass-card" style={{
              padding: 28,
              border: plan.popular ? '1px solid rgba(99,102,241,0.5)' : undefined,
              position: 'relative',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  color: 'white', fontSize: '0.7rem', fontWeight: 700,
                  padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap',
                }}>⭐ MOST POPULAR</div>
              )}
              <div style={{ fontSize: '1rem', color: plan.color, fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 800, margin: '8px 0 20px', color: 'var(--text-primary)' }}>
                {plan.price}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: 24, textAlign: 'left' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: '#10b981' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                to={currentUser ? (plan.name === 'Pro' ? '/payment' : '/resume/new') : '/signup'}
                className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'center' }}
              >
                {plan.name === 'Pro' ? 'Upgrade to Pro' : 'Start Free'}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
