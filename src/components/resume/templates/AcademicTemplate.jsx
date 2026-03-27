import React from 'react';

const AcademicTemplate = ({ data }) => {
  const { personal, sections, design } = data;
  const { themeColor, fontFamily, fontSize, lineHeight, sectionSpacing } = design;

  const style = {
    fontFamily: `'EB Garamond', 'Garamond', serif`,
    fontSize: `${fontSize + 1}pt`,
    lineHeight: lineHeight,
    color: '#000',
    padding: '25mm'
  };

  return (
    <div style={style}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: sectionSpacing * 2 }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 500, borderBottom: '1px solid #000', paddingBottom: 10, marginBottom: 10 }}>
          {personal.name || 'Your Name'}
        </h1>
        <p style={{ fontSize: '10pt' }}>
          {personal.location && <span>{personal.location}</span>}
          {personal.phone && <span> • {personal.phone}</span>}
          {personal.email && <span> • {personal.email}</span>}
        </p>
      </header>

      {/* Summary / Research Interest */}
      {personal.summary && (
        <section style={{ marginBottom: sectionSpacing }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, fontVariant: 'small-caps', borderBottom: '0.5pt solid #000', marginBottom: 8 }}>
            Research Interests & Objective
          </h2>
          <p style={{ textAlign: 'justify' }}>{personal.summary}</p>
        </section>
      )}

      {/* Sections (Prioritizing Education for Academic) */}
      {[...sections].sort((a,b) => a.id === 'education' ? -1 : 1).filter(s => s.visible).map(section => (
        <section key={section.id} style={{ marginBottom: sectionSpacing }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, fontVariant: 'small-caps', borderBottom: '0.5pt solid #000', marginBottom: 10 }}>
            {section.title}
          </h2>
          {section.type === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {section.items.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>{item.title}</span>
                    <span>{item.date}</span>
                  </div>
                  <div style={{ fontStyle: 'italic', marginBottom: 4 }}>{item.subtitle}</div>
                  <p style={{ fontSize: '10pt' }}>{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '10pt' }}>{section.items.join(', ')}</p>
          )}
        </section>
      ))}
    </div>
  );
};

export default AcademicTemplate;
