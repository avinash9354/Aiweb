import React from 'react';

const CreativeTemplate = ({ data }) => {
  const { personal, sections, design } = data;
  const { themeColor, fontFamily, fontSize, lineHeight, sectionSpacing } = design;

  const style = {
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: `${fontSize}pt`,
    lineHeight: lineHeight,
    color: '#333',
    display: 'flex',
    minHeight: '297mm'
  };

  return (
    <div style={style}>
      {/* Sidebar (Left) */}
      <aside style={{ 
        width: '35%', 
        background: themeColor, 
        color: '#fff', 
        padding: '20mm 15mm',
        display: 'flex',
        flexDirection: 'column',
        gap: 30
      }}>
        {/* Profile Photo Placeholder */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid rgba(255,255,255,0.3)'
        }}>
          {personal.photo ? <img src={personal.photo} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : 'PHOTO'}
        </div>

        <section>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', marginBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 4 }}>
            Contact
          </h2>
          <div style={{ fontSize: '9pt', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p>📧 {personal.email}</p>
            <p>📱 {personal.phone}</p>
            <p>📍 {personal.location}</p>
          </div>
        </section>

        {/* Skills (Tags) */}
        {sections.filter(s => s.id === 'skills').map(section => (
          <section key={section.id}>
            <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', marginBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 4 }}>
              {section.title}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {section.items.map((skill, idx) => (
                <span key={idx} style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: 4, fontSize: '8pt' }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ))}
      </aside>

      {/* Main Content (Right) */}
      <main style={{ flex: 1, padding: '20mm 15mm' }}>
        <header style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: '32pt', fontWeight: 800, color: themeColor, marginBottom: 4 }}>
            {personal.name || 'Your Name'}
          </h1>
          <p style={{ fontSize: '14pt', fontWeight: 500, color: '#666' }}>
            {personal.jobTitle || 'Professional Title'}
          </p>
        </header>

        {personal.summary && (
          <section style={{ marginBottom: sectionSpacing }}>
            <h2 style={{ fontSize: '14pt', fontWeight: 700, color: themeColor, marginBottom: 10 }}>Profile</h2>
            <p style={{ textAlign: 'justify' }}>{personal.summary}</p>
          </section>
        )}

        {sections.filter(s => s.visible && s.id !== 'skills').map(section => (
          <section key={section.id} style={{ marginBottom: sectionSpacing }}>
            <h2 style={{ fontSize: '14pt', fontWeight: 700, color: themeColor, marginBottom: 10 }}>{section.title}</h2>
            <div>
              {section.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: 15 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span style={{ fontSize: '11pt' }}>{item.title}</span>
                    <span style={{ color: '#999', fontSize: '9pt' }}>{item.date}</span>
                  </div>
                  <div style={{ color: themeColor, fontWeight: 600, fontSize: '10pt', marginBottom: 4 }}>
                    {item.subtitle}
                  </div>
                  <p style={{ whiteSpace: 'pre-wrap', fontSize: '10pt' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default CreativeTemplate;
