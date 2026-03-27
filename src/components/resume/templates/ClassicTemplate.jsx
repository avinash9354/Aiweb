import React from 'react';

const ClassicTemplate = ({ data }) => {
  const { personal, sections, design } = data;
  const { themeColor, fontFamily, fontSize, lineHeight, sectionSpacing } = design;

  const style = {
    fontFamily: `'Times New Roman', serif`,
    fontSize: `${fontSize}pt`,
    lineHeight: lineHeight,
    color: '#000',
  };

  return (
    <div style={style}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: sectionSpacing }}>
        <h1 style={{ fontSize: '22pt', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ fontSize: '10pt', fontStyle: 'italic', color: '#333' }}>
          {personal.location && <span>{personal.location}</span>}
          {personal.phone && <span> • {personal.phone}</span>}
          {personal.email && <span> • {personal.email}</span>}
        </div>
        <p style={{ marginTop: 8, fontWeight: 700 }}>{personal.jobTitle}</p>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section style={{ marginBottom: sectionSpacing }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, borderBottom: '1px solid #000', marginBottom: 6, textTransform: 'uppercase' }}>
            Professional Profile
          </h2>
          <p style={{ textAlign: 'justify' }}>{personal.summary}</p>
        </section>
      )}

      {/* Sections */}
      {sections.filter(s => s.visible).map(section => (
        <section key={section.id} style={{ marginBottom: sectionSpacing }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, borderBottom: '1px solid #000', marginBottom: 6, textTransform: 'uppercase' }}>
            {section.title}
          </h2>
          {section.type === 'list' ? (
            <div>
              {section.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>{item.subtitle}</span>
                    <span>{item.date}</span>
                  </div>
                  <div style={{ fontStyle: 'italic' }}>{item.title}</div>
                  <p style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>{section.items.join(', ')}</p>
          )}
        </section>
      ))}
    </div>
  );
};

export default ClassicTemplate;
