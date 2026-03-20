// Resume Form – Phase 4 + AI Integration (Phase 6)
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveResume, updateResume, getResumeById } from '../services/firestoreService';
import { generateResume } from '../services/aiService';
import { sanitizeObject } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiSend, FiSave, FiZap } from 'react-icons/fi';

const TEMPLATES = ['Modern', 'Classic', 'Creative', 'Minimal', 'Executive', 'Tech'];
const FREE_TEMPLATES = ['Modern', 'Classic'];

const ResumeForm = () => {
  const { currentUser, userProfile } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isPaid = userProfile?.plan === 'paid';

  const [form, setForm] = useState({
    name: '', email: '', phone: '', location: '',
    jobTitle: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    template: 'Modern',
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [aiOutput, setAiOutput] = useState('');
  const [resumeId, setResumeId] = useState(id || null);

  // Load existing resume for editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      getResumeById(id).then(r => {
        if (r) setForm(f => ({ ...f, ...r.formData, template: r.template || 'Modern', name: r.name }));
        if (r?.aiOutput) setAiOutput(r.aiOutput);
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.skills.trim()) errs.skills = 'Skills required';
    if (!form.experience.trim()) errs.experience = 'Experience required';
    if (!form.education.trim()) errs.education = 'Education required';
    return errs;
  };

  const availableTemplates = isPaid ? TEMPLATES : FREE_TEMPLATES;

  const handleAI = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Please fix form errors first'); return; }
    setAiLoading(true);
    setAiOutput('');
    try {
      const cleanForm = sanitizeObject(form);
      const result = await generateResume(cleanForm, isPaid);
      setAiOutput(result.resume);
      toast.success('AI resume generated! 🤖');
    } catch (err) {
      // Demo fallback when backend not configured
      const demo = buildDemoResume(form, isPaid);
      setAiOutput(demo);
      toast.success('Resume generated (demo mode)');
    } finally { setAiLoading(false); }
  };

  const buildDemoResume = (f, paid) => {
    const lines = [
      `# ${f.name}`,
      `📧 ${f.email}${f.phone ? ' | 📱 ' + f.phone : ''}${f.location ? ' | 📍 ' + f.location : ''}`,
      '',
      `## Professional Summary`,
      f.summary || `A skilled ${f.jobTitle || 'professional'} with expertise in ${f.skills.split(',')[0]}.`,
      '',
      `## Skills`,
      f.skills.split(',').map(s => `• ${s.trim()}`).join('\n'),
      '',
      `## Experience`,
      f.experience,
      '',
      `## Education`,
      f.education,
    ];
    if (!paid) lines.push('\n\n---\n*Free plan: Upgrade for full AI-powered content*');
    return lines.join('\n');
  };

  const handleSave = async () => {
    if (!aiOutput) { toast.error('Please generate or write your resume first'); return; }
    setLoading(true);
    try {
      const cleanForm = sanitizeObject(form);
      const payload = {
        userId: currentUser.uid,
        name: form.name,
        formData: cleanForm,
        template: form.template,
        aiOutput,
        type: isPaid ? 'paid' : 'free',
      };
      let rid;
      if (resumeId) {
        await updateResume(resumeId, payload);
        rid = resumeId;
        toast.success('Resume updated!');
      } else {
        rid = await saveResume(currentUser.uid, payload);
        setResumeId(rid);
        toast.success('Resume saved!');
      }
      navigate(`/resume/preview/${rid}`);
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally { setLoading(false); }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      />
      {errors[key] && <p className="form-error">{errors[key]}</p>}
    </div>
  );

  const textArea = (key, label, placeholder, isLocked = false) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea
        className="form-textarea"
        placeholder={isLocked ? '🔒 Upgrade to Pro to use this field' : placeholder}
        value={form[key]}
        disabled={isLocked}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{ minHeight: 120, opacity: isLocked ? 0.5 : 1 }}
      />
      {errors[key] && <p className="form-error">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">{id ? 'Edit Resume' : 'Build Your Resume'}</h1>
      <p className="page-subtitle">
        {isPaid ? '⭐ Pro Plan – Full AI, all templates' : '🆓 Free Plan – Limited features. '}
        {!isPaid && <a href="/payment" style={{ color: 'var(--primary)' }}>Upgrade →</a>}
      </p>

      <div className="grid-2" style={{ gap: 28, alignItems: 'start' }}>
        {/* Form */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 20 }}>📝 Your Details</h2>

          <div className="grid-2" style={{ gap: 16 }}>
            {field('name', 'Full Name *', 'text', 'John Doe')}
            {field('email', 'Email *', 'email', 'john@example.com')}
            {field('phone', 'Phone', 'tel', '+91 98765 43210')}
            {field('location', 'Location', 'text', 'Mumbai, India')}
          </div>

          {field('jobTitle', 'Job Title', 'text', 'Software Engineer')}
          {textArea('summary', 'Professional Summary', 'Write a brief professional summary...')}
          {textArea('skills', 'Skills *', 'React, Node.js, Python, SQL...')}
          {textArea('experience', 'Experience *', 'Company Name – Role (Year-Year)\n• Achievement 1\n• Achievement 2')}
          {textArea('education', 'Education *', 'B.Tech Computer Science\nIIT Delhi – 2020')}

          {/* Template selector */}
          <div className="form-group">
            <label className="form-label">Template</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TEMPLATES.map(t => {
                const locked = !isPaid && !FREE_TEMPLATES.includes(t);
                return (
                  <button
                    key={t}
                    className={`btn btn-sm ${form.template === t ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => !locked && setForm(f => ({ ...f, template: t }))}
                    style={{ opacity: locked ? 0.4 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}
                    title={locked ? 'Pro plan required' : t}
                  >
                    {locked ? '🔒 ' : ''}{t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Generate */}
          <button
            className="btn btn-primary w-full"
            style={{ marginBottom: 12, justifyContent: 'center' }}
            onClick={handleAI}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <>
                <span className="galaxy-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Generating with AI…
              </>
            ) : (
              <><FiZap /> Generate with AI</>
            )}
          </button>

          <button
            className="btn btn-success w-full"
            style={{ justifyContent: 'center' }}
            onClick={handleSave}
            disabled={loading || !aiOutput}
          >
            {loading ? 'Saving…' : <><FiSave /> Save Resume</>}
          </button>
        </div>

        {/* AI Output Preview */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 20 }}>🤖 AI Output</h2>
          {aiLoading ? (
            <div className="spinner-wrapper">
              <div className="galaxy-spinner" />
              <p className="text-muted text-sm">AI is crafting your resume…</p>
            </div>
          ) : aiOutput ? (
            <div>
              <pre style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                maxHeight: 500,
                overflowY: 'auto',
                padding: 8,
              }}>
                {aiOutput}
              </pre>
              <button
                className="btn btn-primary btn-sm mt-16"
                onClick={handleSave}
                disabled={loading}
                style={{ marginTop: 16 }}
              >
                <FiSave /> Save & Preview
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
              <p>Fill in your details and click<br />"Generate with AI" to see magic!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
