import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { 
  FiPlus, FiTrash2, FiChevronDown, FiChevronUp, 
  FiBriefcase, FiBook, FiCpu, FiLayers, FiEdit2 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SectionsPanel = () => {
  const { resumeData, addSectionItem, removeSectionItem, updateSectionItem } = useResume();
  const { sections } = resumeData;

  const [expandedSection, setExpandedSection] = useState(null);

  const SectionItem = ({ section, item, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempItem, setTempItem] = useState(item);

    const handleSave = () => {
      updateSectionItem(section.id, index, tempItem);
      setIsEditing(false);
    };

    if (section.type === 'tags') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <input 
            className="editor-input" 
            style={{ marginTop: 0 }}
            value={item} 
            onChange={(e) => updateSectionItem(section.id, index, e.target.value)}
          />
          <button 
            onClick={() => removeSectionItem(section.id, index)}
            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
          >
            <FiTrash2 />
          </button>
        </div>
      );
    }

    return (
      <div className="editor-card" style={{ padding: 12 }}>
        {!isEditing ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{item.title || 'Untitled Item'}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{item.subtitle}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setIsEditing(true)} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}><FiEdit2 /></button>
              <button onClick={() => removeSectionItem(section.id, index)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}><FiTrash2 /></button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input 
              className="editor-input" 
              placeholder="Title (e.g. Software Engineer)"
              value={tempItem.title} 
              onChange={e => setTempItem({...tempItem, title: e.target.value})}
            />
            <input 
              className="editor-input" 
              placeholder="Subtitle (e.g. Google)"
              value={tempItem.subtitle} 
              onChange={e => setTempItem({...tempItem, subtitle: e.target.value})}
            />
            <input 
              className="editor-input" 
              placeholder="Date (e.g. 2020 - Present)"
              value={tempItem.date} 
              onChange={e => setTempItem({...tempItem, date: e.target.value})}
            />
            <textarea 
              className="editor-input" 
              placeholder="Description/Achievements..."
              style={{ minHeight: 80 }}
              value={tempItem.description} 
              onChange={e => setTempItem({...tempItem, description: e.target.value})}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="btn btn-sm btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section) => {
    const isExpanded = expandedSection === section.id;
    const Icon = section.id === 'experience' ? FiBriefcase : section.id === 'education' ? FiBook : section.id === 'skills' ? FiCpu : FiLayers;

    return (
      <div key={section.id} style={{ marginBottom: 12 }}>
        <button 
          onClick={() => setExpandedSection(isExpanded ? null : section.id)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: isExpanded ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isExpanded ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12,
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon style={{ color: isExpanded ? 'var(--primary)' : 'rgba(255,255,255,0.5)' }} />
            <span style={{ fontWeight: 600 }}>{section.title}</span>
          </div>
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '12px 4px' }}>
                {section.items.map((item, idx) => (
                  <SectionItem key={idx} section={section} item={item} index={idx} />
                ))}
                
                <button 
                  className="btn btn-sm btn-secondary" 
                  style={{ width: '100%', borderStyle: 'dashed', background: 'transparent' }}
                  onClick={() => {
                    const newItem = section.type === 'tags' ? 'New Skill' : { title: '', subtitle: '', date: '', description: '' };
                    addSectionItem(section.id, newItem);
                  }}
                >
                  <FiPlus /> Add {section.title.slice(0, -1)}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="animate-in">
      {sections.map(renderSection)}
    </div>
  );
};

export default SectionsPanel;
