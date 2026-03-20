// Resume Preview + PDF Download – Phase 7
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getResumeById } from '../services/firestoreService';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiDownload, FiEdit, FiArrowLeft } from 'react-icons/fi';
import { useReactToPrint } from 'react-to-print';

const ResumePreview = () => {
  const { id } = useParams();
  const { userProfile } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();
  const isPaid = userProfile?.plan === 'paid';

  useEffect(() => {
    getResumeById(id)
      .then(setResume)
      .catch(() => toast.error('Failed to load resume'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: resume?.name || 'Resume',
    onAfterPrint: () => toast.success('PDF downloaded!'),
  });

  const renderMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="resume-section-title">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');
  };

  if (loading) return (
    <div className="spinner-wrapper" style={{ minHeight: '60vh' }}>
      <div className="galaxy-spinner" />
      <p className="text-muted">Loading resume…</p>
    </div>
  );

  if (!resume) return (
    <div className="page-container text-center">
      <p className="text-secondary">Resume not found.</p>
      <Link to="/dashboard" className="btn btn-primary mt-16" style={{ marginTop: 16 }}>← Dashboard</Link>
    </div>
  );

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-24">
        <div>
          <Link to="/dashboard" className="btn btn-secondary btn-sm mb-8" style={{ marginBottom: 8 }}>
            <FiArrowLeft /> Dashboard
          </Link>
          <h1 className="page-title">{resume.name}</h1>
          <p className="text-secondary text-sm">Created {formatDate(resume.createdAt)}</p>
        </div>
        <div className="flex gap-8">
          <Link to={`/resume/edit/${id}`} className="btn btn-secondary">
            <FiEdit /> Edit
          </Link>
          {isPaid ? (
            <button className="btn btn-primary" onClick={handlePrint}>
              <FiDownload /> Download PDF
            </button>
          ) : (
            <Link to="/payment" className="btn btn-primary">
              🔒 Upgrade for Clean PDF
            </Link>
          )}
        </div>
      </div>

      {/* Printable Resume */}
      <div
        ref={printRef}
        className={`resume-preview ${!isPaid ? 'watermark' : ''}`}
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)', position: 'relative' }}
      >
        {!isPaid && (
          <div style={{
            background: 'linear-gradient(135deg, #ede9fe, #e0e7ff)',
            borderRadius: 8,
            padding: '8px 16px',
            marginBottom: 20,
            fontSize: '0.8rem',
            color: '#4f46e5',
            fontWeight: 600,
            textAlign: 'center',
          }}>
            🔒 Free Plan – Watermark added. <a href="/payment" style={{ color: '#4f46e5' }}>Upgrade to remove</a>
          </div>
        )}

        <div
          dangerouslySetInnerHTML={{ __html: renderMarkdown(resume.aiOutput || '') }}
          style={{ lineHeight: 1.7 }}
        />

        {/* Resume sections from formData if aiOutput is empty */}
        {!resume.aiOutput && resume.formData && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e1b4b' }}>{resume.formData.name}</h1>
            <p style={{ color: '#64748b', marginBottom: 16 }}>
              {resume.formData.email} {resume.formData.phone ? `• ${resume.formData.phone}` : ''} {resume.formData.location ? `• ${resume.formData.location}` : ''}
            </p>
            {resume.formData.summary && (
              <div className="resume-section">
                <h2>Summary</h2>
                <p>{resume.formData.summary}</p>
              </div>
            )}
            <div className="resume-section">
              <h2>Skills</h2>
              <p>{resume.formData.skills}</p>
            </div>
            <div className="resume-section">
              <h2>Experience</h2>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{resume.formData.experience}</pre>
            </div>
            <div className="resume-section">
              <h2>Education</h2>
              <p>{resume.formData.education}</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .resume-preview, .resume-preview * { visibility: visible; }
          .resume-preview { position: absolute; inset: 0; }
        }
        .resume-section-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #4f46e5;
          border-bottom: 2px solid #e0e7ff;
          padding-bottom: 4px;
          margin: 16px 0 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;
