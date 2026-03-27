import React from 'react';
import { useResume } from '../../context/ResumeContext';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TechTemplate from './templates/TechTemplate';
import AcademicTemplate from './templates/AcademicTemplate';

const LivePreview = () => {
  const { resumeData } = useResume();
  const { design } = resumeData;

  // Template registry mapping
  const templates = {
    'Modern': ModernTemplate,
    'Classic': ClassicTemplate,
    'Creative': CreativeTemplate,
    'Minimal': MinimalTemplate,
    'Tech': TechTemplate,
    'Academic': AcademicTemplate,
  };

  const SelectedTemplate = templates[design.template] || ModernTemplate;

  return (
    <div className="resume-paper" style={{
      width: '210mm',
      minHeight: '297mm',
      background: '#fff',
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
      borderRadius: 4,
      transformOrigin: 'top center',
      transition: 'transform 0.3s ease',
      color: '#333',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SelectedTemplate data={resumeData} />
    </div>
  );
};

export default LivePreview;
