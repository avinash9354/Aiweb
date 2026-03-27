import React from 'react';

const MinimalTemplate = ({ data }) => {
  const { personal, sections, design } = data;
  const { themeColor, fontFamily, fontSize, lineHeight, sectionSpacing } = design;

  const style = {
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: `${fontSize}pt`,
    lineHeight: lineHeight,
    color: '#444',
    padding: '20mm'
  };

  return (
    <div style={style}>
      {/* Header */}
      <header style={{ marginBottom: sectionSpacing * 2 }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 300, color: '#000', marginBottom: 4, letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        <p style={{ fontSize: '11pt', color: themeColor, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
          {personal.jobTitle || 'Professional Title'}
        </p>
        <div style={{ marginTop: 15, fontSize: '9pt', color: '#888', display: 'flex', gap: 20 }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </header>

      {/* Sections */}
      {sections.filter(s => s.visible).map(section => (
        <section key={section.id} style={{ marginBottom: sectionSpacing * 1.5 }}>
          <h2 style={{ 
            fontSize: '10pt', 
            fontWeight: 700, 
            color: '#000', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            marginBottom: 15 
          }}>
            {section.title}
          </h2>
          {section.type === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {section.items.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '11pt', color: '#222' }}>{item.title}</span>
                    <span style={{ fontSize: '8pt', color: '#999' }}>{item.date}</span>
                  </div>
                  <div style={{ fontSize: '9pt', color: themeColor, marginBottom: 8 }}>{item.subtitle}</div>
                  <p style={{ fontSize: '9pt', textAlign: 'justify' }}>{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {section.items.map((item, idx) => (
                <span key={idx} style={{ fontSize: '9pt' }}>{item}{idx < section.items.length - 1 ? ' •' : ''}</span>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default MinimalTemplate;
