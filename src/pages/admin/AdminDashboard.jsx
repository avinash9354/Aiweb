// ═══════════════════════════════════════════════════════════════
//  FULL ADMIN PANEL – AI Resume Builder
//  Features: Users mgmt, Resumes mgmt, Payments mgmt,
//            Charts, Export/Import, Settings, Galaxy UI
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { getAllUsers, getAllResumes, getAllPayments, getAllJobs, addJob, updateJob, deleteJob, updateUserProfile, deleteResume } from '../../services/firestoreService';
import { exportToExcel, exportToCSV, exportToPDF, importFromExcel } from '../../utils/exportUtils';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import {
  FiUsers, FiFileText, FiDollarSign, FiSettings, FiDownload,
  FiUpload, FiRefreshCw, FiEdit, FiTrash2, FiCheck, FiX,
  FiHome, FiPieChart, FiCreditCard, FiShield, FiSearch,
  FiTrendingUp, FiStar, FiAlertCircle, FiBriefcase, FiMapPin,
  FiExternalLink, FiPlus
} from 'react-icons/fi';

// ── Chart colours ──────────────────────────────────────────────
const C = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

// ── Sidebar items ──────────────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Overview',  icon: <FiHome /> },
  { id: 'users',     label: 'Users',     icon: <FiUsers /> },
  { id: 'resumes',   label: 'Resumes',   icon: <FiFileText /> },
  { id: 'payments',  label: 'Payments',  icon: <FiCreditCard /> },
  { id: 'jobs',      label: 'Jobs',      icon: <FiBriefcase /> },
  { id: 'analytics', label: 'Analytics', icon: <FiPieChart /> },
  { id: 'settings',  label: 'Settings',  icon: <FiSettings /> },
];

const TEMPLATES_LIST = ['Modern', 'Classic', 'Creative', 'Minimal', 'Executive', 'Tech'];

export default function AdminDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers]         = useState([]);
  const [resumes, setResumes]     = useState([]);
  const [payments, setPayments]   = useState([]);
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editingJob, setEditingJob]   = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', salary: '', type: 'Full-time', link: '', description: '', tags: '' });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [u, r, p, j] = await Promise.all([getAllUsers(), getAllResumes(), getAllPayments(), getAllJobs()]);
      setUsers(u); setResumes(r); setPayments(p); setJobs(j);
    } catch (e) { toast.error('Load failed: ' + e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  /* ── Derived data ─────────────────────────────────────── */
  const paidUsers  = users.filter(u => u.plan === 'paid');
  const freeUsers  = users.filter(u => u.plan !== 'paid');
  const totalRev   = payments.filter(p => p.status === 'success').reduce((s, p) => s + (p.amount || 0), 0);
  const successPay = payments.filter(p => p.status === 'success').length;

  const overviewStats = [
    { icon: <FiUsers  />, value: users.length,    label: 'Total Users',   color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
    { icon: <FiStar   />, value: paidUsers.length, label: 'Pro Users',    color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { icon: <FiFileText/>,value: resumes.length,  label: 'Resumes',       color: '#06b6d4', bg: 'rgba(6,182,212,0.15)'  },
    { icon: <FiDollarSign/>,value:`₹${totalRev}`, label: 'Revenue',       color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { icon: <FiCreditCard/>,value: successPay,    label: 'Payments',      color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
    { icon: <FiTrendingUp/>,value:`${paidUsers.length > 0 ? Math.round((paidUsers.length/users.length)*100) : 0}%`, label: 'Conversion', color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
  ];

  const planChartData = [
    { name: 'Free', value: freeUsers.length },
    { name: 'Pro',  value: paidUsers.length },
  ];

  const templateChart = TEMPLATES_LIST.map(t => ({
    name: t, count: resumes.filter(r => r.template === t).length,
  })).filter(d => d.count > 0);

  const revenueChart = buildRevenueData(payments);

  const userGrowthChart = buildGrowthData(users);

  /* ── Filters ──────────────────────────────────────────────── */
  const filteredUsers    = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredResumes  = resumes.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.template?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPayments = payments.filter(p =>
    p.userId?.includes(search) || p.paymentId?.includes(search)
  );

  /* ── Actions ──────────────────────────────────────────────── */
  const handleUpgradeUser = async (uid) => {
    try {
      await updateUserProfile(uid, { plan: 'paid' });
      setUsers(us => us.map(u => u.uid === uid ? { ...u, plan: 'paid' } : u));
      toast.success('User upgraded to Pro ⭐');
    } catch { toast.error('Failed to upgrade'); }
  };

  const handleDowngradeUser = async (uid) => {
    try {
      await updateUserProfile(uid, { plan: 'free' });
      setUsers(us => us.map(u => u.uid === uid ? { ...u, plan: 'free' } : u));
      toast.success('User downgraded to Free');
    } catch { toast.error('Failed to downgrade'); }
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm('Delete this resume permanently?')) return;
    try {
      await deleteResume(id);
      setResumes(rs => rs.filter(r => r.id !== id));
      toast.success('Resume deleted');
    } catch { toast.error('Failed to delete'); }
  };
  const handleExport = (dataset, format) => {
    const map = { users, resumes, payments, jobs };
    const clean = (map[dataset] || []).map(flattenObj);
    if (format === 'excel') exportToExcel(clean, dataset);
    else if (format === 'csv') exportToCSV(clean, dataset);
    else exportToPDF(clean, dataset, dataset.toUpperCase() + ' Report');
    toast.success(`${dataset} exported as ${format.toUpperCase()}`);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const rows = await importFromExcel(file);
      toast.success(`Imported ${rows.length} rows — review in console`);
      console.table(rows);
    } catch { toast.error('Import failed – check file format'); }
    e.target.value = '';
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    const data = { ...jobForm, tags: jobForm.tags.split(',').map(t => t.trim()).filter(t => t) };
    try {
      if (editingJob) {
        await updateJob(editingJob.id, data);
        toast.success('Job updated successfully');
      } else {
        await addJob(data);
        toast.success('Job added successfully');
      }
      setShowJobModal(false);
      setEditingJob(null);
      setJobForm({ title: '', company: '', location: '', salary: '', type: 'Full-time', link: '', description: '', tags: '' });
      loadAll();
    } catch (err) {
      toast.error('Failed to save job');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job post?')) return;
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      loadAll();
    } catch { toast.error('Failed to delete job'); }
  };

  const openEditJob = (job) => {
    setEditingJob(job);
    setJobForm({ ...job, tags: (job.tags || []).join(', ') });
    setShowJobModal(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'rgba(13, 19, 51, 0.4)',
        borderRight: '1px solid var(--glass-border)',
        backdropFilter: 'blur(40px)',
        padding: '24px 0',
        position: 'sticky', top: 76, height: 'calc(100vh - 76px)',
        overflowY: 'auto',
      }}>
        {/* Logo row */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🛡️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Admin Panel</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ResumeAI</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '16px 12px' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 12px', marginBottom: 4,
                background: activeTab === t.id ? 'rgba(99,102,241,0.2)' : 'transparent',
                border: activeTab === t.id ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
                borderRadius: 10, cursor: 'pointer',
                color: activeTab === t.id ? '#a78bfa' : 'var(--text-secondary)',
                fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{t.icon}</span>
              {t.label}
              {t.id === 'users' && <span style={{ marginLeft: 'auto', background: 'rgba(99,102,241,0.3)', color: '#a78bfa', borderRadius: 20, padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>{users.length}</span>}
            </button>
          ))}
        </nav>

        {/* Admin info */}
        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, padding: '0 16px' }}>
          <div className="glass-card" style={{ padding: 12 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Logged in as</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.email}
            </div>
            <div className="badge badge-success" style={{ marginTop: 6, fontSize: '0.65rem' }}>⭐ Admin</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '28px 28px 60px', overflow: 'auto' }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-24">
          <div>
            <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg,#f1f5f9,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 4 }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-8">
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                className="form-input"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36, width: 200, height: 38 }}
              />
            </div>
            <button className="btn btn-secondary btn-sm" onClick={loadAll} disabled={loading}>
              <FiRefreshCw style={{ animation: loading ? 'galaxy-spin 1s linear infinite' : '' }} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── OVERVIEW ──────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="animate-in">
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
              {overviewStats.map(s => (
                <div key={s.label} className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: s.color, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.6rem', fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* Free vs Pro Pie */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiPieChart style={{ color: '#6366f1' }} /> User Plans
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={planChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35}
                      label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}>
                      {planChartData.map((_, i) => <Cell key={i} fill={C[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Line */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiTrendingUp style={{ color: '#10b981' }} /> Revenue Trend
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={revenueChart}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Template Usage */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🎨 Template Usage</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={templateChart.length ? templateChart : [{ name: 'No data', count: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                      {templateChart.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* User Growth */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiUsers style={{ color: '#6366f1' }} /> User Growth
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={userGrowthChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card" style={{ padding: 24, marginTop: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>⚡ Recent Activity</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {[...(users.slice(0, 3).map(u => ({ type: 'user', label: `New user: ${u.email}`, time: u.signupDate, icon: '👤' }))),
                  ...(resumes.slice(0, 3).map(r => ({ type: 'resume', label: `Resume created: ${r.name || 'Untitled'}`, time: r.createdAt, icon: '📄' }))),
                  ...(payments.slice(0, 3).map(p => ({ type: 'payment', label: `Payment ₹${p.amount}: ${p.status}`, time: p.date, icon: '💳' }))),
                ].sort((a, b) => (b.time?.seconds || 0) - (a.time?.seconds || 0)).slice(0, 8)
                  .map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                      <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(item.time)}</span>
                    </div>
                  ))
                }
                {users.length === 0 && resumes.length === 0 && payments.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>No activity yet. Waiting for users to sign up!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TABLE ───────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="animate-in">
            {/* Export/Import bar */}
            <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontWeight: 700 }}>👥 Users</span>
                <span className="badge badge-free" style={{ marginLeft: 8 }}>{filteredUsers.length} total</span>
              </div>
              <div className="flex gap-8">
                <BtnExport label="Excel" onClick={() => handleExport('users', 'excel')} />
                <BtnExport label="CSV"   onClick={() => handleExport('users', 'csv')}   />
                <BtnExport label="PDF"   onClick={() => handleExport('users', 'pdf')}   />
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <FiUpload /> Import
                  <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleImport} />
                </label>
              </div>
            </div>

            <div className="glass-card overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Email</th><th>Plan</th>
                    <th>Admin</th><th>Signed Up</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={7}><LoadingRow /></td></tr>
                  : filteredUsers.length === 0 ? <tr><td colSpan={7}><EmptyRow msg="No users found" /></td></tr>
                  : filteredUsers.map((u, i) => (
                    <tr key={u.id || u.uid}>
                      <td className="text-muted text-xs">{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{u.name || '—'}</td>
                      <td className="text-muted text-sm">{u.email}</td>
                      <td>
                        <span className={`badge ${u.plan === 'paid' ? 'badge-pro' : 'badge-free'}`}>
                          {u.plan === 'paid' ? '⭐ Pro' : 'Free'}
                        </span>
                      </td>
                      <td>
                        {u.isAdmin
                          ? <span className="badge badge-success"><FiShield style={{ marginRight: 4 }} />Admin</span>
                          : <span className="text-muted text-xs">—</span>}
                      </td>
                      <td className="text-muted text-sm">{formatDate(u.signupDate)}</td>
                      <td>
                        <div className="flex gap-8">
                          {u.plan !== 'paid'
                            ? <button className="btn btn-primary btn-sm" onClick={() => handleUpgradeUser(u.uid || u.id)}>⭐ Upgrade</button>
                            : <button className="btn btn-secondary btn-sm" onClick={() => handleDowngradeUser(u.uid || u.id)}>↓ Free</button>
                          }
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RESUMES TABLE ─────────────────────────────────── */}
        {activeTab === 'resumes' && (
          <div className="animate-in">
            <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontWeight: 700 }}>📄 Resumes</span>
                <span className="badge badge-free" style={{ marginLeft: 8 }}>{filteredResumes.length} total</span>
              </div>
              <div className="flex gap-8">
                <BtnExport label="Excel" onClick={() => handleExport('resumes', 'excel')} />
                <BtnExport label="CSV"   onClick={() => handleExport('resumes', 'csv')}   />
                <BtnExport label="PDF"   onClick={() => handleExport('resumes', 'pdf')}   />
              </div>
            </div>

            <div className="glass-card overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Name</th><th>User ID</th><th>Template</th><th>Type</th><th>Created</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={7}><LoadingRow /></td></tr>
                  : filteredResumes.length === 0 ? <tr><td colSpan={7}><EmptyRow msg="No resumes yet" /></td></tr>
                  : filteredResumes.map((r, i) => (
                    <tr key={r.id}>
                      <td className="text-muted text-xs">{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{r.name || 'Untitled'}</td>
                      <td className="text-muted text-xs">{(r.userId || '').slice(0, 14)}…</td>
                      <td><span className="badge badge-free">{r.template || 'Modern'}</span></td>
                      <td><span className={`badge ${r.type === 'paid' ? 'badge-pro' : 'badge-free'}`}>{r.type || 'free'}</span></td>
                      <td className="text-muted text-sm">{formatDate(r.createdAt)}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteResume(r.id)}>
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PAYMENTS TABLE ────────────────────────────────── */}
        {activeTab === 'payments' && (
          <div className="animate-in">
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Total Revenue', value: `₹${totalRev}`, color: '#10b981' },
                { label: 'Successful', value: successPay, color: '#6366f1' },
                { label: 'Total Transactions', value: payments.length, color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ padding: 20 }}>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontWeight: 700 }}>💳 Payments</span>
                <span className="badge badge-free" style={{ marginLeft: 8 }}>{payments.length} total</span>
              </div>
              <div className="flex gap-8">
                <BtnExport label="Excel" onClick={() => handleExport('payments', 'excel')} />
                <BtnExport label="CSV"   onClick={() => handleExport('payments', 'csv')}   />
                <BtnExport label="PDF"   onClick={() => handleExport('payments', 'pdf')}   />
              </div>
            </div>

            <div className="glass-card overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Payment ID</th><th>User ID</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={7}><LoadingRow /></td></tr>
                  : filteredPayments.length === 0 ? <tr><td colSpan={7}><EmptyRow msg="No payments yet" /></td></tr>
                  : filteredPayments.map((p, i) => (
                    <tr key={p.id}>
                      <td className="text-muted text-xs">{i + 1}</td>
                      <td className="text-xs text-muted">{(p.paymentId || p.id || '').slice(0, 16)}…</td>
                      <td className="text-xs text-muted">{(p.userId || '').slice(0, 14)}…</td>
                      <td style={{ fontWeight: 700, color: '#10b981' }}>₹{p.amount || 0}</td>
                      <td className="text-sm">{p.method || 'razorpay'}</td>
                      <td>
                        <span className={`badge ${p.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                          {p.status === 'success' ? <><FiCheck /> Success</> : <><FiX /> {p.status}</>}
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

        {/* ── JOBS MANAGEMENT ─────────────────────────────── */}
        {activeTab === 'jobs' && (
          <div className="animate-in">
            <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontWeight: 700 }}>💼 Jobs Management</span>
                <span className="badge badge-free" style={{ marginLeft: 8 }}>{jobs.length} posts</span>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => { setEditingJob(null); setJobForm({ title: '', company: '', location: '', salary: '', type: 'Full-time', link: '', description: '', tags: '' }); setShowJobModal(true); }}>
                + Post New Job
              </button>
            </div>

            <div className="glass-card overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Title</th><th>Company</th><th>Location</th><th>Salary</th><th>Type</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={7}><LoadingRow /></td></tr>
                  : jobs.length === 0 ? <tr><td colSpan={7}><EmptyRow msg="No jobs posted yet" /></td></tr>
                  : jobs.filter(j => j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase())).map((j, i) => (
                    <tr key={j.id}>
                      <td className="text-muted text-xs">{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{j.title}</td>
                      <td className="text-sm">{j.company}</td>
                      <td className="text-muted text-sm">{j.location}</td>
                      <td className="text-success text-sm">{j.salary}</td>
                      <td><span className="badge badge-success">{j.type}</span></td>
                      <td>
                        <div className="flex gap-8">
                          <button className="btn btn-secondary btn-sm" onClick={() => openEditJob(j)}><FiEdit /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteJob(j.id)}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showJobModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, backdropFilter: 'blur(12px)' }}>
                <div className="glass-card animate-in-up" style={{ 
                  width: '100%', maxWidth: 580, maxHeight: '95vh', 
                  overflowY: 'auto', padding: '24px 28px', position: 'relative',
                  border: '1px solid var(--glass-border-brighter)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
                }}>
                  <button onClick={() => setShowJobModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer', zIndex: 10 }}><FiX /></button>
                  <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {editingJob ? <span style={{ color: 'var(--accent2)' }}>✍️ Edit Job Post</span> : <span style={{ color: 'var(--primary)' }}>🚀 Post New Job</span>}
                  </h2>
                  
                  <form onSubmit={handleSaveJob} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div className="grid-2" style={{ gap: 12 }}>
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label className="form-label">Job Title</label>
                        <input className="form-input" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required placeholder="e.g. Senior Frontend Engineer" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label className="form-label">Company</label>
                        <input className="form-input" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} required placeholder="e.g. Google" />
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: 12 }}>
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label className="form-label">Location</label>
                        <input className="form-input" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. Remote, Mumbai" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label className="form-label">Salary Range</label>
                        <input className="form-input" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} placeholder="e.g. ₹15L–25L" />
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: 12 }}>
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label className="form-label">Type</label>
                        <select className="form-input" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label className="form-label">Apply Link</label>
                        <input className="form-input" value={jobForm.link} onChange={e => setJobForm({...jobForm, link: e.target.value})} placeholder="https://..." />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 12 }}>
                      <label className="form-label">Tags (comma separated)</label>
                      <input className="form-input" value={jobForm.tags} onChange={e => setJobForm({...jobForm, tags: e.target.value})} placeholder="React, Node.js, AWS" />
                    </div>

                    <div className="form-group" style={{ marginBottom: 12 }}>
                      <label className="form-label">Job Description</label>
                      <textarea className="form-textarea" style={{ minHeight: 80 }} value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} placeholder="Mention key requirements..."></textarea>
                    </div>

                    <div className="flex gap-12 mt-16">
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', height: 48 }}>
                        {editingJob ? 'Update Post' : 'Deploy Post'}
                      </button>
                      <button type="button" className="btn btn-secondary" style={{ padding: '0 24px', height: 48 }} onClick={() => setShowJobModal(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS ─────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="animate-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📈 Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={revenueChart}>
                    <defs>
                      <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#rev2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🎨 Templates Breakdown</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={templateChart.length ? templateChart : [{ name: 'None', count: 1 }]}
                      dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {(templateChart.length ? templateChart : [{ name: 'None', count: 1 }]).map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>👥 Free vs Pro – All Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Free Users', count: freeUsers.length },
                  { name: 'Pro Users', count: paidUsers.length },
                  { name: 'Total Resumes', count: resumes.length },
                  { name: 'Payments', count: payments.length },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {[0, 1, 2, 3].map(i => <Cell key={i} fill={C[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── SETTINGS ──────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="animate-in" style={{ maxWidth: 640 }}>
            <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🔐 Admin Info</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  { label: 'Admin Email', value: currentUser?.email },
                  { label: 'Admin UID',   value: currentUser?.uid },
                  { label: 'Firebase Project', value: 'aiweb-ea64b' },
                  { label: 'Firestore Region', value: 'asia-south1 (Mumbai)' },
                  { label: 'Total Users',   value: users.length },
                  { label: 'Total Resumes', value: resumes.length },
                  { label: 'Total Revenue', value: `₹${totalRev}` },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{r.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500, wordBreak: 'break-all', textAlign: 'right', maxWidth: '65%' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📦 Export All Data</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {['users', 'resumes', 'payments'].map(ds => (
                  <div key={ds} className="glass-card" style={{ padding: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 10, textTransform: 'capitalize' }}>{ds}</div>
                    <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleExport(ds, 'excel')}>Excel</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleExport(ds, 'csv')}>CSV</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleExport(ds, 'pdf')}>PDF</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 28, border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="flex items-center gap-8 mb-16" style={{ marginBottom: 12 }}>
                <FiAlertCircle style={{ color: '#ef4444', fontSize: '1.2rem' }} />
                <h3 style={{ fontWeight: 700, color: '#ef4444' }}>Danger Zone</h3>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(239,68,68,0.06)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>Export & Backup</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Download all data before making changes</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => { handleExport('users', 'excel'); handleExport('resumes', 'excel'); handleExport('payments', 'excel'); }}>
                    <FiDownload /> Backup All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Small reusable components ──────────────────────────────── */
const BtnExport = ({ label, onClick }) => (
  <button className="btn btn-secondary btn-sm" onClick={onClick}>
    <FiDownload /> {label}
  </button>
);

const LoadingRow = () => (
  <div style={{ textAlign: 'center', padding: 40 }}>
    <div className="galaxy-spinner" style={{ margin: '0 auto 12px' }} />
    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading…</p>
  </div>
);

const EmptyRow = ({ msg }) => (
  <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
    <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
    <p>{msg}</p>
  </div>
);

/* ── Tooltip style ────────────────────────────────────────── */
const tooltipStyle = {
  background: 'rgba(13,19,51,0.98)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#f1f5f9',
  fontSize: '0.8rem',
};

/* ── Data helpers ──────────────────────────────────────────── */
const flattenObj = (obj) => {
  const out = {};
  for (const k in obj) {
    if (obj[k]?.seconds) out[k] = new Date(obj[k].seconds * 1000).toLocaleDateString();
    else if (typeof obj[k] === 'object' && obj[k] !== null) out[k] = JSON.stringify(obj[k]);
    else out[k] = obj[k];
  }
  return out;
};

const buildRevenueData = (payments) => {
  const map = {};
  payments.filter(p => p.status === 'success').forEach(p => {
    const d = p.date?.seconds ? new Date(p.date.seconds * 1000) : new Date();
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    map[key] = (map[key] || 0) + (p.amount || 0);
  });
  const keys = Object.keys(map);
  if (!keys.length) return [{ month: 'No data', revenue: 0 }];
  return keys.slice(-6).map(month => ({ month, revenue: map[month] }));
};

const buildGrowthData = (users) => {
  const map = {};
  users.forEach(u => {
    const d = u.signupDate?.seconds ? new Date(u.signupDate.seconds * 1000) : new Date();
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    map[key] = (map[key] || 0) + 1;
  });
  const keys = Object.keys(map);
  if (!keys.length) return [{ month: 'No data', users: 0 }];
  return keys.slice(-6).map(month => ({ month, users: map[month] }));
};
