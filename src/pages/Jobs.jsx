import { useState, useEffect } from 'react';
import { getAllJobs } from '../services/firestoreService';
import { FiBriefcase, FiMapPin, FiDollarSign, FiExternalLink, FiSearch, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (err) {
        toast.error('Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter(j =>
    (j.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (j.company || '').toLowerCase().includes(search.toLowerCase()) ||
    (j.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    (j.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">💼 Job Board</h1>
      <p className="text-secondary page-subtitle">Browse top tech opportunities & daily updates</p>

      <div className="form-group mb-24" style={{ maxWidth: 400, marginBottom: 28, position: 'relative' }}>
        <FiSearch style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-input"
          placeholder="Search jobs, skills, companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 40 }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div className="galaxy-spinner" style={{ margin: '0 auto' }}></div>
          <p className="text-muted mt-16">Loading latest jobs...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {filtered.map(job => (
            <div key={job.id} className="glass-card animate-in" style={{ padding: 24 }}>
              <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8, color: '#f1f5f9' }}>{job.title}</h3>
                  <div className="flex gap-16 items-center" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flexWrap: 'wrap', marginBottom: 12 }}>
                    <span className="flex items-center gap-8"><FiBriefcase /> {job.company}</span>
                    <span className="flex items-center gap-8"><FiMapPin /> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-8"><FiDollarSign /> {job.salary || 'Not Disclosed'}</span>
                    <span className="flex items-center gap-8"><FiClock /> {job.type || 'Full-time'}</span>
                  </div>
                  
                  {job.description && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {job.description}
                    </p>
                  )}

                  <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                    {(job.tags || []).map(t => (
                      <span key={t} className="badge badge-free">{t}</span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-12" style={{ alignItems: 'flex-end', minWidth: 140 }}>
                  {job.link ? (
                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Apply Link <FiExternalLink />
                    </a>
                  ) : (
                    <a href="/resume/new" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Build AI Resume
                    </a>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {job.createdAt?.seconds ? new Date(job.createdAt.seconds * 1000).toLocaleDateString() : 'New'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="glass-card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginBottom: 8 }}>No jobs found</h3>
              <p>We couldn't find any jobs matching "{search}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
