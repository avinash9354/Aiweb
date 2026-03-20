// Jobs page – Phase 12 Bonus
const JOBS = [
  { id: 1, title: 'Senior React Developer', company: 'TechCorp India', location: 'Bangalore (Remote)', salary: '₹18L–30L', type: 'Full-time', tags: ['React', 'Node.js', 'AWS'] },
  { id: 2, title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Mumbai', salary: '₹12L–20L', type: 'Full-time', tags: ['Next.js', 'Python', 'PostgreSQL'] },
  { id: 3, title: 'Machine Learning Engineer', company: 'AI Solutions', location: 'Hyderabad', salary: '₹20L–35L', type: 'Full-time', tags: ['Python', 'TensorFlow', 'AWS'] },
  { id: 4, title: 'DevOps Engineer', company: 'CloudTech', location: 'Pune (Remote)', salary: '₹15L–25L', type: 'Full-time', tags: ['Kubernetes', 'Docker', 'CI/CD'] },
  { id: 5, title: 'UI/UX Designer', company: 'Design Studio', location: 'Delhi', salary: '₹8L–15L', type: 'Full-time', tags: ['Figma', 'Adobe XD', 'CSS'] },
  { id: 6, title: 'Data Scientist', company: 'DataCorp', location: 'Bangalore', salary: '₹18L–28L', type: 'Full-time', tags: ['Python', 'R', 'Tableau'] },
  { id: 7, title: 'Product Manager', company: 'FinTech Inc', location: 'Mumbai (Hybrid)', salary: '₹22L–40L', type: 'Full-time', tags: ['Agile', 'Roadmap', 'Analytics'] },
  { id: 8, title: 'Backend Engineer (Go)', company: 'Infra Labs', location: 'Remote', salary: '₹16L–28L', type: 'Full-time', tags: ['Go', 'gRPC', 'Kafka'] },
];

const Jobs = () => {
  const [search, setSearch] = useState('');
  const filtered = JOBS.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-container">
      <h1 className="page-title">💼 Job Board</h1>
      <p className="text-secondary page-subtitle">Browse top tech opportunities in India</p>

      <div className="form-group mb-24" style={{ maxWidth: 400, marginBottom: 28 }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Search jobs, skills, companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.map(job => (
          <div key={job.id} className="glass-card animate-in" style={{ padding: 24 }}>
            <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{job.title}</h3>
                <div className="flex gap-12 items-center" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                  <span>🏢 {job.company}</span>
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                </div>
                <div className="flex gap-8 mt-8" style={{ marginTop: 10, flexWrap: 'wrap' }}>
                  {job.tags.map(t => (
                    <span key={t} className="badge badge-free">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-8">
                <span className="badge badge-success">{job.type}</span>
                <a href="/resume/new" className="btn btn-primary btn-sm">Apply with AI Resume</a>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</div>
            <p>No jobs found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
export default Jobs;
