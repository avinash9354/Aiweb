import React from 'react';

const TechTemplate = ({ data }) => {
  const { personal, sections, design } = data;
  const { themeColor, fontFamily, fontSize, lineHeight, sectionSpacing } = design;

  const style = {
    fontFamily: `'JetBrains Mono', 'Fira Code', monospace`,
    fontSize: `${fontSize}pt`,
    lineHeight: lineHeight,
    color: '#1e293b',
    padding: '15mm'
  };

  return (
    <div style={style}>
      {/* Header */}
      <header style={{ 
        background: '#1e293b', 
        color: '#fff', 
        padding: '10mm', 
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: sectionSpacing
      }}>
        <div>
          <h1 style={{ fontSize: '22pt', fontWeight: 800, margin: 0 }}>{personal.name || 'DEVEL_OPER'}</h1>
          <p style={{ color: themeColor, fontWeight: 600, marginTop: 4 }}>{personal.jobTitle || 'UNIX_USER'}</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '8pt', opacity: 0.8 }}>
          <p>{personal.email}</p>
          <p>{personal.phone}</p>
          <p>{personal.location}</p>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 30 }}>
        {/* Left Col (Skills & More) */}
        <div>
          {sections.filter(s => s.id === 'skills').map(section => (
            <div key={section.id} style={{ marginBottom: 25 }}>
              <h2 style={{ fontSize: '10pt', color: themeColor, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase' }}>
                $ ls ./skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {section.items.map((skill, idx) => (
                  <span key={idx} style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 4, fontSize: '8pt', border: '1px solid #e2e8f0' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          <div style={{ fontSize: '8pt', color: '#64748b', background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>CONFIG_INFO</p>
            <p>Status: Available</p>
            <p>Uptime: 100%</p>
            <p>Locale: {personal.location}</p>
          </div>
        </div>

        {/* Right Col (Experience) */}
        <div>
          {personal.summary && (
            <div style={{ marginBottom: 25 }}>
              <h2 style={{ fontSize: '10pt', color: themeColor, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>
                $ cat biography.txt
              </h2>
              <p style={{ fontSize: '9pt', color: '#475569' }}>{personal.summary}</p>
            </div>
          )}

          {sections.filter(s => s.visible && s.id !== 'skills').map(section => (
            <div key={section.id} style={{ marginBottom: 25 }}>
              <h2 style={{ fontSize: '10pt', color: themeColor, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>
                $ cd ./{section.id}
              </h2>
              {section.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: 15, position: 'relative', paddingLeft: 12 }}>
                  <div style={{ position: 'absolute', left: 0, top: 6, bottom: 0, width: 2, background: themeColor, opacity: 0.3 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10pt' }}>
                    <span>{item.title}</span>
                    <span style={{ color: '#94a3b8', fontSize: '8pt' }}>{item.date}</span>
                  </div>
                  <div style={{ fontSize: '9pt', fontWeight: 600, color: '#64748b', marginBottom: 4 }}>{item.subtitle}</div>
                  <p style={{ fontSize: '9pt', color: '#475569' }}>{item.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechTemplate;
