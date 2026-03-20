// User Dashboard – Phase 3
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserResumes, deleteResume } from '../services/firestoreService';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiPlus, FiFileText, FiTrash2, FiEdit, FiStar, FiZap, FiDownload } from 'react-icons/fi';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isPaid = userProfile?.plan === 'paid';

  useEffect(() => {
    if (!currentUser) return;
    getUserResumes(currentUser.uid)
      .then(setResumes)
      .catch(() => toast.error('Failed to load resumes'))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await deleteResume(id);
      setResumes(r => r.filter(x => x.id !== id));
      toast.success('Resume deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const stats = [
    { icon: '📄', value: resumes.length, label: 'Total Resumes' },
    { icon: '⭐', value: isPaid ? 'Pro' : 'Free', label: 'Current Plan' },
    { icon: '🤖', value: isPaid ? '∞' : '2', label: 'Resumes Left' },
    { icon: '📅', value: formatDate(userProfile?.signupDate), label: 'Member Since' },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-24">
        <div>
          <h1 className="page-title">
            👋 Welcome, {userProfile?.name || currentUser?.email?.split('@')[0]}!
          </h1>
          <p className="page-subtitle text-secondary">
            Manage your AI-generated resumes
          </p>
        </div>
        <Link to="/resume/new" className="btn btn-primary">
          <FiPlus /> New Resume
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-24">
        {stats.map(s => (
          <div key={s.label} className="glass-card stat-card animate-in">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Plan Banner */}
      {!isPaid && (
        <div className="glass-card animate-in" style={{
          padding: '20px 28px',
          marginBottom: 28,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>🚀 Upgrade to Pro</div>
            <p className="text-secondary text-sm">Get unlimited resumes, full AI output, and clean PDF downloads.</p>
          </div>
          <Link to="/payment" className="btn btn-primary">
            <FiZap /> Upgrade – ₹199
          </Link>
        </div>
      )}

      {/* Resumes Section */}
      <div className="glass-card" style={{ padding: 28 }}>
        <div className="flex justify-between items-center mb-16">
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>
            <FiFileText style={{ marginRight: 8 }} /> My Resumes
          </h2>
          <span className="badge badge-free">{resumes.length} total</span>
        </div>

        {loading ? (
          <div className="spinner-wrapper">
            <div className="galaxy-spinner" />
            <p className="text-muted text-sm">Loading resumes…</p>
          </div>
        ) : resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
            <p className="text-secondary mb-16">No resumes yet. Create your first one!</p>
            <Link to="/resume/new" className="btn btn-primary">
              <FiPlus /> Create Resume
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Template</th>
                  <th>Type</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.name || 'Untitled Resume'}</td>
                    <td>
                      <span className="badge badge-free">{r.template || 'Modern'}</span>
                    </td>
                    <td>
                      <span className={`badge ${r.type === 'paid' ? 'badge-pro' : 'badge-free'}`}>
                        {r.type === 'paid' ? '⭐ Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{formatDate(r.createdAt)}</td>
                    <td>
                      <div className="flex gap-8">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/resume/preview/${r.id}`)}
                        >
                          <FiDownload /> View
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/resume/edit/${r.id}`)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(r.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
