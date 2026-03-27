import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiBriefcase, FiBook, FiCpu, 
  FiType, FiSidebar, FiLayout, FiDownload, 
  FiSave, FiChevronLeft, FiPlus, FiTrash2,
  FiFileText, FiLayers, FiZap
} from 'react-icons/fi';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { exportToPDF, getShareableLink } from '../services/exportService';
import { FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Sub-components
import PersonalInfoPanel from '../components/resume/PersonalInfoPanel';
import LivePreview from '../components/resume/LivePreview';
import SectionsPanel from '../components/resume/SectionsPanel';
import DesignPanel from '../components/resume/DesignPanel';
import TemplateGallery from '../components/resume/TemplateGallery';
import AIHelper from '../components/resume/AIHelper';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resumeData, loadResume, saveToCloud, isSaving } = useResume();
  const { currentUser } = useAuth();
  const resumeRef = React.useRef(null);
  
  const [activeTab, setActiveTab] = useState('personal'); 
  const [isExporting, setIsExporting] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);

  useEffect(() => {
    if (id) loadResume(id);
  }, [id]);

  const tabs = [
    { id: 'templates', icon: <FiLayout />, label: 'Templates' },
    { id: 'personal', icon: <FiUser />, label: 'Personal' },
    { id: 'sections', icon: <FiLayers />, label: 'Sections' },
    { id: 'design', icon: <FiType />, label: 'Design' },
    { id: 'ai', icon: <FiZap />, label: 'AI Helper' },
  ];

  return (
    <div className="editor-root" style={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)', 
      overflow: 'hidden',
      background: '#0f172a' 
    }}>
      {/* ── LEFT NAVIGATION (ICONS) ────────────────────── */}
      <div className="editor-nav" style={{
        width: 72,
        background: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        zIndex: 100
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setShowLeftSidebar(true);
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              border: 'none',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1.2rem'
            }}
            title={tab.label}
          >
            {tab.icon}
            <span style={{ fontSize: '0.6rem', marginTop: 4 }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── LEFT SIDEBAR (CONTENT) ─────────────────────── */}
      <AnimatePresence>
        {showLeftSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              overflowY: 'auto',
              zIndex: 90
            }}
          >
            <div style={{ padding: 24 }}>
              <motion.div
                key={activeTab}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#fff', textTransform: 'capitalize' }}>
                  {activeTab} Tool
                </h2>
                
                {/* Conditional Panel Rendering */}
                {activeTab === 'personal' && <PersonalInfoPanel />}
                {activeTab === 'templates' && <TemplateGallery />}
                {activeTab === 'sections' && <SectionsPanel />}
                {activeTab === 'design' && <DesignPanel />}
                {activeTab === 'ai' && <AIHelper />}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CENTER CANVAS (LIVE PREVIEW) ────────────────── */}
      <div className="editor-canvas" style={{
        flex: 1,
        background: '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Canvas Toolbar */}
        <div style={{
          height: 48,
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              {isSaving ? 'Saving...' : 'All changes saved'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              className="btn btn-sm btn-secondary" 
              style={{ padding: '6px 12px' }}
              onClick={async () => {
                if (!resumeRef.current) return;
                setIsExporting(true);
                try {
                  await exportToPDF(resumeRef.current, `${resumeData.personal.name || 'resume'}.pdf`);
                  toast.success('Resume exported successfully! 📄');
                } catch (err) {
                  toast.error('Export failed');
                } finally {
                  setIsExporting(false);
                }
              }}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : <><FiDownload /> Export PDF</>}
            </button>
            <button 
              className="btn btn-sm btn-secondary" 
              style={{ padding: '6px 12px' }}
              onClick={() => {
                const link = getShareableLink(id || 'demo');
                navigator.clipboard.writeText(link);
                toast.success('Public link copied to clipboard! 🔗');
              }}
            >
              <FiShare2 /> Share
            </button>
            <button className="btn btn-sm btn-primary" onClick={saveToCloud}><FiSave /> Save</button>
          </div>
        </div>

        {/* The Actual Resume Canvas */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '40px 20px',
          display: 'flex',
          justifyContent: 'center',
          background: '#0f172a'
        }}>
          <div ref={resumeRef}>
             <LivePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
