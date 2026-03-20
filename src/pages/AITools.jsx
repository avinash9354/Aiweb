// AI Tools page – Phase 12 Bonus
const AI_TOOLS = [
  { icon: '🤖', name: 'Resume Generator', desc: 'Generate a complete AI-powered resume in minutes using GPT-4.', href: '/resume/new', color: '#6366f1' },
  { icon: '✨', name: 'Cover Letter Writer', desc: 'Get a personalized cover letter tailored to any job description.', href: '#', color: '#8b5cf6', comingSoon: true },
  { icon: '🎯', name: 'ATS Score Checker', desc: 'Analyze your resume against ATS keywords for any job posting.', href: '#', color: '#06b6d4', comingSoon: true },
  { icon: '💬', name: 'Interview Coach', desc: 'Practice interview questions with AI feedback and scoring.', href: '#', color: '#10b981', comingSoon: true },
  { icon: '📊', name: 'Salary Predictor', desc: 'Get AI-predicted salary range based on your skills and experience.', href: '#', color: '#f59e0b', comingSoon: true },
  { icon: '🔍', name: 'Job Match Finder', desc: 'AI matches your profile to the best job listings automatically.', href: '#', color: '#ec4899', comingSoon: true },
];

const TIPS = [
  'Use numbers to quantify achievements (e.g., "Increased sales by 40%")',
  'Tailor your resume for each job application using relevant keywords',
  'Keep your resume to 1-2 pages maximum for most roles',
  'Use action verbs: Led, Built, Improved, Designed, Delivered',
  'Include a professional summary that highlights your top 3 skills',
  'ATS systems scan for exact keyword matches from the job description',
];

const AITools = () => (
  <div className="page-container">
    <h1 className="page-title">⚡ AI Tools</h1>
    <p className="text-secondary page-subtitle">Supercharge your job search with AI-powered tools</p>

    <div className="grid-3 mb-24">
      {AI_TOOLS.map(tool => (
        <div key={tool.name} className="glass-card" style={{ padding: 28, position: 'relative' }}>
          {tool.comingSoon && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b',
              fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
              border: '1px solid rgba(245,158,11,0.3)', textTransform: 'uppercase',
            }}>Coming Soon</div>
          )}
          <div style={{ fontSize: '2rem', marginBottom: 14 }}>{tool.icon}</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8, color: tool.color }}>{tool.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 16 }}>{tool.desc}</p>
          <a
            href={tool.href}
            className={`btn btn-sm ${tool.comingSoon ? 'btn-secondary' : 'btn-primary'}`}
            style={{ pointerEvents: tool.comingSoon ? 'none' : 'auto', opacity: tool.comingSoon ? 0.6 : 1 }}
          >
            {tool.comingSoon ? '🔒 Coming Soon' : 'Try Now →'}
          </a>
        </div>
      ))}
    </div>

    {/* Tips */}
    <div className="glass-card" style={{ padding: 28 }}>
      <h2 style={{ fontWeight: 700, marginBottom: 20 }}>💡 Pro Resume Tips</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {TIPS.map((tip, i) => (
          <div key={i} className="flex gap-12 items-center" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
              {i + 1}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AITools;
