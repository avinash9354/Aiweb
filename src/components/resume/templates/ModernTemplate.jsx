import React from 'react';

const ModernTemplate = ({ data }) => {
  const { personal, sections, design } = data;
  const { themeColor, fontFamily, fontSize, lineHeight, sectionSpacing } = design;

  const style = {
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: `${fontSize}pt`,
    lineHeight: lineHeight,
    color: '#333',
  };

  return (
    <div style={style}>
      {/* Header */}
      <header style={{ 
        textAlign: 'center', 
        marginBottom: sectionSpacing * 1.5,
        borderBottom: `2px solid ${themeColor}`,
        paddingBottom: 20
      }}>
        <h1 style={{ 
          fontSize: '28pt', 
          fontWeight: 800, 
          color: themeColor,
          marginBottom: 4,
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {personal.name || 'Your Name'}
        </h1>
        <p style={{ fontSize: '12pt', fontWeight: 600, color: '#666' }}>
          {personal.jobTitle || 'Professional Title'}
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 15, 
          fontSize: '9pt', 
          marginTop: 8,
          color: '#888'
        }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section style={{ marginBottom: sectionSpacing }}>
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 700, 
            color: themeColor,
            textTransform: 'uppercase',
            borderBottom: `1px solid rgba(0,0,0,0.1)`,
            paddingBottom: 4,
            marginBottom: 8
          }}>
            Professional Summary
          </h2>
          <p style={{ textAlign: 'justify' }}>{personal.summary}</p>
        </section>
      )}

      {/* Dynamic Sections */}
      {sections.filter(s => s.visible).map(section => (
        <section key={section.id} style={{ marginBottom: sectionSpacing }}>
          <h2 style={{ 
            fontSize: '12pt', 
            fontWeight: 700, 
            color: themeColor,
            textTransform: 'uppercase',
            borderBottom: `1px solid rgba(0,0,0,0.1)`,
            paddingBottom: 4,
            marginBottom: 8
          }}>
            {section.title}
          </h2>

          {section.type === 'list' ? (
            <div>
              {section.items.length > 0 ? (
                section.items.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>{item.title}</span>
                      <span>{item.date}</span>
                    </div>
                    <div style={{ fontStyle: 'italic', color: '#666', marginBottom: 4 }}>
                      {item.subtitle}
                    </div>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{item.description}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>No items added yet.</p>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {section.items.length > 0 ? (
                section.items.map((item, idx) => (
                  <span key={idx} style={{ 
                    background: '#f3f4f6', 
                    padding: '4px 10px', 
                    borderRadius: 4,
                    fontSize: '9pt',
                    border: `1px solid rgba(0,0,0,0.05)`
                  }}>
                    {item}
                  </span>
                ))
              ) : (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>No skills added yet.</p>
              )}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default ModernTemplate;
