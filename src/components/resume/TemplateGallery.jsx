import React from 'react';
import { useResume } from '../../context/ResumeContext';

const TemplateGallery = () => {
  const { resumeData, updateDesign } = useResume();
  const { design } = resumeData;

  const templates = [
    { id: 'Modern', name: 'Modern Professional', category: 'Professional', preview: 'https://via.placeholder.com/150x200?text=Modern' },
    { id: 'Classic', name: 'Classic Executive', category: 'Professional', preview: 'https://via.placeholder.com/150x200?text=Classic' },
    { id: 'Creative', name: 'Creative Designer', category: 'Creative', preview: 'https://via.placeholder.com/150x200?text=Creative' },
    { id: 'Minimal', name: 'Minimalist Clean', category: 'Minimal', preview: 'https://via.placeholder.com/150x200?text=Minimal' },
    { id: 'Tech', name: 'Tech Developer', category: 'Developer', preview: 'https://via.placeholder.com/150x200?text=Tech' },
    { id: 'Academic', name: 'Academic Scholar', category: 'Student', preview: 'https://via.placeholder.com/150x200?text=Academic' },
  ];

  const categories = ['All', 'Professional', 'Creative', 'Minimal', 'Developer'];

  return (
    <div className="animate-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {templates.map(template => (
          <div 
            key={template.id}
            onClick={() => updateDesign('template', template.id)}
            style={{
              padding: 8,
              background: design.template === template.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
              border: `2px solid ${design.template === template.id ? 'var(--primary)' : 'transparent'}`,
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '100%',
              aspectRatio: '3/4',
              background: '#fff',
              borderRadius: 8,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333',
              fontSize: '0.8rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {template.id}
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>{template.name}</p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{template.category}</p>
          </div>
        ))}
      </div>
      
      <div className="editor-card" style={{ marginTop: 20, borderStyle: 'dashed', opacity: 0.7 }}>
        <p style={{ fontSize: '0.75rem', textAlign: 'center' }}>
          🆕 More templates arriving soon!
        </p>
      </div>
    </div>
  );
};

export default TemplateGallery;
