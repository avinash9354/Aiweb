import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { saveResume, updateResume, getResumeById } from '../services/firestoreService';
import toast from 'react-hot-toast';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [resumeId, setResumeId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initial Resume State
  const initialData = {
    personal: {
      name: '',
      email: '',
      phone: '',
      location: '',
      jobTitle: '',
      photo: '',
      summary: '',
    },
    sections: [
      { id: 'experience', title: 'Work Experience', type: 'list', items: [], visible: true },
      { id: 'education', title: 'Education', type: 'list', items: [], visible: true },
      { id: 'skills', title: 'Skills', type: 'tags', items: [], visible: true },
      { id: 'projects', title: 'Projects', type: 'list', items: [], visible: true },
    ],
    design: {
      template: 'Modern',
      themeColor: '#6366f1',
      secondaryColor: '#1e293b',
      fontFamily: 'Inter',
      fontSize: 10,
      lineHeight: 1.5,
      sectionSpacing: 20,
      layout: '1-column', // '1-column' or '2-column'
    }
  };

  const [resumeData, setResumeData] = useState(initialData);

  // Auto-save logic
  useEffect(() => {
    if (!resumeId || !currentUser) return;
    
    const timer = setTimeout(async () => {
      saveToCloud();
    }, 5000); // Auto-save every 5 seconds of inactivity
    
    return () => clearTimeout(timer);
  }, [resumeData]);

  const saveToCloud = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      const payload = {
        userId: currentUser.uid,
        name: resumeData.personal.name || 'Untitled Resume',
        data: resumeData,
        updatedAt: new Date().toISOString(),
      };
      
      if (resumeId) {
        await updateResume(resumeId, payload);
      } else {
        const id = await saveResume(currentUser.uid, payload);
        setResumeId(id);
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const loadResume = async (id) => {
    try {
      const data = await getResumeById(id);
      if (data && data.data) {
        setResumeData(data.data);
        setResumeId(id);
      }
    } catch (err) {
      toast.error('Failed to load resume');
    }
  };

  const updatePersonal = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updateDesign = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      design: { ...prev.design, [field]: value }
    }));
  };

  const addSectionItem = (sectionId, item) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, items: [...s.items, item] } : s
      )
    }));
  };

  const removeSectionItem = (sectionId, index) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, items: s.items.filter((_, i) => i !== index) } : s
      )
    }));
  };

  const updateSectionItem = (sectionId, index, item) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, items: s.items.map((it, i) => i === index ? item : it) } : s
      )
    }));
  };

  const reorderSections = (newSections) => {
    setResumeData(prev => ({ ...prev, sections: newSections }));
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      setResumeData,
      resumeId,
      isSaving,
      updatePersonal,
      updateDesign,
      addSectionItem,
      removeSectionItem,
      updateSectionItem,
      reorderSections,
      loadResume,
      saveToCloud
    }}>
      {children}
    </ResumeContext.Provider>
  );
};
