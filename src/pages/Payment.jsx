// Payment page – Phase 5
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initiatePayment } from '../services/paymentService';
import toast from 'react-hot-toast';
import { FiCheck, FiZap, FiShield, FiCreditCard } from 'react-icons/fi';

const PRO_FEATURES = [
  'Unlimited AI-generated resumes',
  'All premium templates (Modern, Creative, Executive, Tech...)',
  'Full GPT-4 AI output (no token limit)',
  'Clean PDF download (no watermark)',
  'Resume history & edit/regenerate',
  'Priority support',
];

const Payment = () => {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (userProfile?.plan === 'paid') {
    return (
      <div className="page-container text-center">
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⭐</div>
        <h1 className="page-title">You're on Pro!</h1>
        <p className="text-secondary mb-24">Enjoy unlimited AI resume generation.</p>
        <button className="btn btn-primary" onClick={() => navigate('/resume/new')}>
          Build a Resume <FiZap />
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    setLoading(true);
    initiatePayment({
      amount: 199,
      userProfile,
      onSuccess: (response) => {
        toast.success('🎉 Payment successful! You are now on Pro.');
        setUserProfile(p => ({ ...p, plan: 'paid' }));
        setLoading(false);
        navigate('/dashboard');
      },
      onFailure: (msg) => {
        toast.error(msg || 'Payment failed');
        setLoading(false);
      },
    });
  };

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 className="page-title">Upgrade to Pro</h1>
        <p className="text-secondary">One-time payment. Lifetime access to Pro features.</p>
      </div>

      <div className="glass-card" style={{ padding: 36 }}>
        {/* Price */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: 4 }}>
            ₹999/year
          </div>
          <div style={{ fontFamily: 'Outfit', fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>
            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ₹199
            </span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Lifetime Pro Access</div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 32 }}>
          {PRO_FEATURES.map(f => (
            <div key={f} className="flex items-center gap-12" style={{ marginBottom: 12 }}>
              <span style={{ width: 24, height: 24, background: 'rgba(16,185,129,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiCheck style={{ color: '#10b981', fontSize: '0.8rem' }} />
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Payment Methods Info */}
        <div className="glass-card" style={{ padding: 16, marginBottom: 24, background: 'rgba(99,102,241,0.08)' }}>
          <div className="flex items-center gap-8 mb-8">
            <FiCreditCard style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Accepted Payment Methods</span>
          </div>
          <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
            {['💳 Cards', '📱 UPI', '🏦 Net Banking', '👝 Wallets'].map(m => (
              <span key={m} className="badge badge-free">{m}</span>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="flex items-center gap-8 mb-24" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 24 }}>
          <FiShield style={{ color: '#10b981' }} />
          Secured by Razorpay • 256-bit SSL encryption
        </div>

        <button
          className="btn btn-primary w-full btn-lg"
          style={{ justifyContent: 'center' }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="galaxy-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              Opening Payment…
            </>
          ) : (
            <><FiZap /> Pay ₹199 with Razorpay</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;
