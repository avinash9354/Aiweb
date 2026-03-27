import { useResume } from '../../context/ResumeContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiAlignLeft, FiCamera, FiTrash2 } from 'react-icons/fi';

const PersonalInfoPanel = () => {
  const { resumeData, updatePersonal } = useResume();
  const { personal } = resumeData;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonal('photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const InputField = ({ label, value, icon, field, type = 'text', isTextArea = false }) => (
    <div className="editor-card">
      <label style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8, 
        fontSize: '0.8rem', 
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 4
      }}>
        {icon} {label}
      </label>
      {isTextArea ? (
        <textarea
          className="editor-input"
          style={{ minHeight: 100, resize: 'vertical' }}
          value={value}
          onChange={(e) => updatePersonal(field, e.target.value)}
          placeholder={`Enter your ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          type={type}
          className="editor-input"
          value={value}
          onChange={(e) => updatePersonal(field, e.target.value)}
          placeholder={`Enter your ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );

  return (
    <div className="animate-in">
      <div className="editor-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 20 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          border: '2px dashed rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {personal.photo ? (
            <>
              <img src={personal.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => updatePersonal('photo', '')}
                style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: '#fff', padding: 4, cursor: 'pointer' }}
              >
                <FiTrash2 size={12} />
              </button>
            </>
          ) : <FiUser size={32} style={{ opacity: 0.3 }} />}
        </div>
        <label className="btn btn-sm btn-secondary" style={{ cursor: 'pointer' }}>
          <FiCamera /> {personal.photo ? 'Change Photo' : 'Upload Photo'}
          <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
        </label>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Max size 2MB</p>
      </div>

      <InputField 
        label="Full Name" 
        value={personal.name} 
        icon={<FiUser />} 
        field="name" 
      />
      <InputField 
        label="Professional Title" 
        value={personal.jobTitle} 
        icon={<FiBriefcase />} 
        field="jobTitle" 
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <InputField 
          label="Email" 
          value={personal.email} 
          icon={<FiMail />} 
          field="email" 
          type="email"
        />
        <InputField 
          label="Phone" 
          value={personal.phone} 
          icon={<FiPhone />} 
          field="phone" 
        />
      </div>

      <InputField 
        label="Location" 
        value={personal.location} 
        icon={<FiMapPin />} 
        field="location" 
      />

      <InputField 
        label="Professional Summary" 
        value={personal.summary} 
        icon={<FiAlignLeft />} 
        field="summary" 
        isTextArea={true}
      />
      
      <div className="editor-card" style={{ borderStyle: 'dashed', opacity: 0.7 }}>
        <p style={{ fontSize: '0.75rem', textAlign: 'center' }}>
          💡 Tip: Keep your summary concise and focused on your top achievements.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoPanel;
