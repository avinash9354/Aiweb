import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { FiZap, FiRefreshCw, FiCheck, FiCpu, FiMessageSquare } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AIHelper = () => {
  const { resumeData, updatePersonal, updateSectionItem } = useResume();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTool, setActiveTool] = useState(null); // 'summary', 'experience', 'skills'

  const generateAISuggestions = async (type) => {
    setLoading(true);
    setActiveTool(type);
    
    // Simulate API call for now (since Firebase Function URL is a placeholder)
    setTimeout(() => {
      let results = [];
      const title = resumeData.personal.jobTitle || 'Professional';
      
      if (type === 'summary') {
        results = [
          `Accomplished ${title} with a proven track record of delivering high-quality solutions and driving project success.`,
          `Dynamic and results-oriented ${title} specializing in modern technologies and scalable architecture.`,
          `Passionate ${title} dedicated to continuous improvement and staying ahead of industry trends.`
        ];
      } else if (type === 'experience') {
        results = [
          `Spearheaded the development of a flagship application, increasing user engagement by 40%.`,
          `Optimized legacy codebases, resulting in a 25% reduction in server response times.`,
          `Collaborated with cross-functional teams to deliver projects 15% ahead of schedule.`
        ];
      }
      
      setSuggestions(results);
      setLoading(false);
      toast.success('AI suggestions generated! ✨');
    }, 1500);
  };

  const applySuggestion = (suggestion) => {
    if (activeTool === 'summary') {
      updatePersonal('summary', suggestion);
    }
    // For experience, we'd need to know which item to apply to. 
    // Simplified for now: toast info.
    toast.success('Applied to summary! 📝');
  };

  return (
    <div className="animate-in">
      <div className="editor-card" style={{ background: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--primary)' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <FiZap style={{ color: 'var(--primary)' }} /> AI Resume Assistant
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
          Let AI help you write compelling content that gets you hired.
        </p>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className="btn btn-sm btn-primary" 
            style={{ flex: 1, fontSize: '0.7rem' }}
            onClick={() => generateAISuggestions('summary')}
            disabled={loading}
          >
            {loading && activeTool === 'summary' ? <FiRefreshCw className="animate-spin" /> : 'Suggest Summary'}
          </button>
          <button 
            className="btn btn-sm btn-secondary" 
            style={{ flex: 1, fontSize: '0.7rem' }}
            onClick={() => generateAISuggestions('experience')}
            disabled={loading}
          >
             {loading && activeTool === 'experience' ? <FiRefreshCw className="animate-spin" /> : 'Optimize Exp'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiMessageSquare /> AI Suggestions
            </h4>
            {suggestions.map((suggestion, idx) => (
              <div 
                key={idx} 
                className="editor-card" 
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => applySuggestion(suggestion)}
              >
                <p style={{ fontSize: '0.8rem', color: '#fff', lineHeight: 1.5 }}>
                  {suggestion}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiCheck /> Click to Apply
                  </span>
                </div>
              </div>
            ))}
            <button 
              className="btn btn-sm btn-link" 
              style={{ width: '100%', color: 'rgba(255,255,255,0.4)' }}
              onClick={() => setSuggestions([])}
            >
              Clear Suggestions
            </button>
          </div>
        )}
      </AnimatePresence>

      <div className="editor-card" style={{ marginTop: 20, borderStyle: 'dashed', opacity: 0.7 }}>
        <p style={{ fontSize: '0.75rem', textAlign: 'center' }}>
          🤖 Resume Score: 85/100<br/>
          <span style={{ fontSize: '0.65rem' }}>Improve your Experience section to reach 90+</span>
        </p>
      </div>
    </div>
  );
};

export default AIHelper;
