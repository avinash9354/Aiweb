// Admin Dashboard – Phase 9 (Charts, Tables, Export, Import)
import { useState, useEffect } from 'react';
import { getAllUsers, getAllResumes, getAllPayments } from '../../services/firestoreService';
import { exportToExcel, exportToCSV, exportToPDF, importFromExcel } from '../../utils/exportUtils';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FiUsers, FiFileText, FiDollarSign, FiDownload, FiUpload, FiRefreshCw } from 'react-icons/fi';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [importing, setImporting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [u, r, p] = await Promise.all([getAllUsers(), getAllResumes(), getAllPayments()]);
      setUsers(u);
      setResumes(r);
      setPayments(p);
    } catch (err) {
      toast.error('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // ── Derived chart data ─────────────────────────────────────────────────────
  const planData = [
    { name: 'Free', value: users.filter(u => u.plan !== 'paid').length },
    { name: 'Pro', value: users.filter(u => u.plan === 'paid').length },
  ];

  const templateData = TEMPLATES_LIST.map(t => ({
    name: t,
    count: resumes.filter(r => r.template === t).length,
  })).filter(d => d.count > 0);

  const revenueData = buildRevenueData(payments);

  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // ── Export handlers ────────────────────────────────────────────────────────
  const handleExport = (type, format) => {
    const dataMap = { users, resumes, payments };
    const raw = dataMap[type];
    const clean = raw.map(r => flattenForExport(r));
    if (format === 'excel') exportToExcel(clean, type);
    else if (format === 'csv') exportToCSV(clean, type);
    else exportToPDF(clean, type, `${type.toUpperCase()} Report`);
    toast.success(`${type} exported as ${format.toUpperCase()}`);
  };

  const handleImport = async (e, collectionName) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast.error('Only Excel/CSV files allowed'); return;
    }
    setImporting(true);
    try {
      const rows = await importFromExcel(file);
      toast.success(`Imported ${rows.length} rows from ${file.name}. Review before saving.`);
      console.log('Imported data:', rows);
    } catch { toast.error('Import failed – invalid file format'); }
    finally { setImporting(false); e.target.value = ''; }
  };

  const stats = [
    { icon: <FiUsers />, value: users.length, label: 'Total Users', color: '#6366f1' },
    { icon: <FiFileText />, value: resumes.length, label: 'Total Resumes', color: '#8b5cf6' },
    { icon: <FiDollarSign />, value: `₹${totalRevenue}`, label: 'Revenue', color: '#10b981' },
    { icon: '⭐', value: users.filter(u => u.plan === 'paid').length, label: 'Pro Users', color: '#f59e0b' },
  ];

  const TABS = ['overview', 'users', 'resumes', 'payments'];

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-24">
        <div>
          <h1 className="page-title">🛡️ Admin Dashboard</h1>
          <p className="text-secondary page-subtitle">Manage users, resumes, and revenue</p>
        </div>
        <button className="btn btn-secondary" onClick={loadAll} disabled={loading}>
          <FiRefreshCw style={{ animation: loading ? 'galaxy-spin 1s linear infinite' : '' }} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-24">
        {stats.map(s => (
          <div key={s.label} className="glass-card stat-card animate-in">
            <div className="stat-icon" style={{ color: s.color, fontSize: '1.5rem' }}>{s.icon}</div>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-24" style={{ flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t}
            className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab: Overview (Charts) */}
      {tab === 'overview' && (
        <div>
          <div className="grid-2 mb-24">
            {/* Free vs Paid Pie */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>👥 Free vs Pro Users</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={planData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {planData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(13,19,51,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Line */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>💰 Revenue Over Time</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'rgba(13,19,51,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Template Usage Bar */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🎨 Template Usage</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={templateData.length ? templateData : [{ name: 'No data', count: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'rgba(13,19,51,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {tab === 'users' && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="flex justify-between items-center mb-16">
            <h3 style={{ fontWeight: 700 }}>👥 Users ({users.length})</h3>
            <ExportButtons onExport={(fmt) => handleExport('users', fmt)} onImport={(e) => handleImport(e, 'users')} />
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Plan</th><th>Admin</th><th>Signed Up</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.name || '—'}</td>
                    <td className="text-muted text-sm">{u.email}</td>
                    <td><span className={`badge ${u.plan === 'paid' ? 'badge-pro' : 'badge-free'}`}>{u.plan === 'paid' ? '⭐ Pro' : 'Free'}</span></td>
                    <td>{u.isAdmin ? <span className="badge badge-success">Admin</span> : '—'}</td>
                    <td className="text-muted text-sm">{formatDate(u.signupDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Resumes */}
      {tab === 'resumes' && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="flex justify-between items-center mb-16">
            <h3 style={{ fontWeight: 700 }}>📄 Resumes ({resumes.length})</h3>
            <ExportButtons onExport={(fmt) => handleExport('resumes', fmt)} onImport={(e) => handleImport(e, 'resumes')} />
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Name</th><th>User ID</th><th>Template</th><th>Type</th><th>Created</th></tr></thead>
              <tbody>
                {resumes.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.name || '—'}</td>
                    <td className="text-muted text-xs">{r.userId?.slice(0, 12)}…</td>
                    <td><span className="badge badge-free">{r.template || 'Modern'}</span></td>
                    <td><span className={`badge ${r.type === 'paid' ? 'badge-pro' : 'badge-free'}`}>{r.type}</span></td>
                    <td className="text-muted text-sm">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Payments */}
      {tab === 'payments' && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="flex justify-between items-center mb-16">
            <h3 style={{ fontWeight: 700 }}>💳 Payments ({payments.length})</h3>
            <ExportButtons onExport={(fmt) => handleExport('payments', fmt)} onImport={(e) => handleImport(e, 'payments')} showImport={false} />
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Payment ID</th><th>User ID</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="text-xs text-muted">{p.paymentId || p.id?.slice(0, 12)}</td>
                    <td className="text-xs text-muted">{p.userId?.slice(0, 12)}…</td>
                    <td style={{ fontWeight: 600 }}>₹{p.amount || 0}</td>
                    <td className="text-sm">{p.method || '—'}</td>
                    <td>
                      <span className={`badge ${p.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{formatDate(p.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Export Buttons Component ──────────────────────────────────────────────────
const ExportButtons = ({ onExport, onImport, showImport = true }) => (
  <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
    <button className="btn btn-secondary btn-sm" onClick={() => onExport('excel')}><FiDownload /> Excel</button>
    <button className="btn btn-secondary btn-sm" onClick={() => onExport('csv')}><FiDownload /> CSV</button>
    <button className="btn btn-secondary btn-sm" onClick={() => onExport('pdf')}><FiDownload /> PDF</button>
    {showImport && (
      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
        <FiUpload /> Import
        <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={onImport} />
      </label>
    )}
  </div>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const TEMPLATES_LIST = ['Modern', 'Classic', 'Creative', 'Minimal', 'Executive', 'Tech'];

const flattenForExport = (obj) => {
  const flat = {};
  for (const k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      flat[k] = obj[k]?.seconds
        ? new Date(obj[k].seconds * 1000).toLocaleDateString()
        : JSON.stringify(obj[k]);
    } else {
      flat[k] = obj[k];
    }
  }
  return flat;
};

const buildRevenueData = (payments) => {
  const monthMap = {};
  payments.filter(p => p.status === 'success').forEach(p => {
    const d = p.date?.seconds
      ? new Date(p.date.seconds * 1000)
      : new Date();
    const month = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthMap[month] = (monthMap[month] || 0) + (p.amount || 0);
  });
  return Object.entries(monthMap)
    .slice(-6)
    .map(([month, revenue]) => ({ month, revenue }));
};

export default AdminDashboard;
