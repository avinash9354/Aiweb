import React, { useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { FiType, FiDroplet, FiMaximize, FiAlignCenter } from 'react-icons/fi';

const DesignPanel = () => {
  const { resumeData, updateDesign } = useResume();
  const { design } = resumeData;

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
    'Playfair Display', 'Merriweather', 'EB Garamond', 
    'JetBrains Mono', 'Poppins', 'Oswald'
  ];

  // Dynamic Google Fonts Loader
  useEffect(() => {
    if (!design.fontFamily) return;
    const fontId = 'google-font-' + design.fontFamily.replace(/\s+/g, '-').toLowerCase();
    if (document.getElementById(fontId)) return;

    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${design.fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }, [design.fontFamily]);

  const colors = [
    '#6366f1', '#3b82f6', '#0ea5e9', '#10b981', 
    '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
    '#1e293b', '#334155', '#475569'
  ];

  const ControlGroup = ({ label, icon, children }) => (
    <div className="editor-card" style={{ marginBottom: 16 }}>
      <label style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8, 
        fontSize: '0.85rem', 
        fontWeight: 600,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 12
      }}>
        {icon} {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="animate-in">
      {/* Theme Color */}
      <ControlGroup label="Theme Color" icon={<FiDroplet />}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {colors.map(color => (
            <button
              key={color}
              onClick={() => updateDesign('themeColor', color)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: color,
                border: design.themeColor === color ? '2px solid white' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                transform: design.themeColor === color ? 'scale(1.1)' : 'scale(1)'
              }}
            />
          ))}
          <input 
            type="color" 
            value={design.themeColor}
            onChange={(e) => updateDesign('themeColor', e.target.value)}
            style={{ width: 28, height: 28, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
          />
        </div>
      </ControlGroup>

      {/* Typography */}
      <ControlGroup label="Typography" icon={<FiType />}>
        <select 
          className="editor-input"
          value={design.fontFamily}
          onChange={(e) => updateDesign('fontFamily', e.target.value)}
          style={{ marginBottom: 12 }}
        >
          {fonts.map(font => (
            <option key={font} value={font} style={{ fontFamily: font, color: '#333' }}>
              {font}
            </option>
          ))}
        </select>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Font Size (pt)</label>
            <input 
              type="number" 
              className="editor-input"
              value={design.fontSize}
              onChange={(e) => updateDesign('fontSize', parseInt(e.target.value))}
              min="8" max="14"
            />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Line Height</label>
            <input 
              type="number" 
              className="editor-input"
              value={design.lineHeight}
              onChange={(e) => updateDesign('lineHeight', parseFloat(e.target.value))}
              step="0.1" min="1" max="2"
            />
          </div>
        </div>
      </ControlGroup>

      {/* Spacing */}
      <ControlGroup label="Layout & Spacing" icon={<FiMaximize />}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Section Spacing</label>
          <input 
            type="range" 
            style={{ width: '100%', accentColor: 'var(--primary)' }}
            value={design.sectionSpacing}
            onChange={(e) => updateDesign('sectionSpacing', parseInt(e.target.value))}
            min="10" max="40"
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className={`btn btn-sm ${design.layout === '1-column' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: '0.7rem' }}
            onClick={() => updateDesign('layout', '1-column')}
          >
            1 Column
          </button>
          <button 
            className={`btn btn-sm ${design.layout === '2-column' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: '0.7rem' }}
            onClick={() => updateDesign('layout', '2-column')}
          >
            2 Columns
          </button>
        </div>
      </ControlGroup>

      <div className="editor-card" style={{ borderStyle: 'dashed', opacity: 0.7 }}>
        <p style={{ fontSize: '0.75rem', textAlign: 'center' }}>
          ✨ Pro Tip: High-contrast colors work best for professional ATS-friendly resumes.
        </p>
      </div>
    </div>
  );
};

export default DesignPanel;
