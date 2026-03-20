// Input sanitization to prevent XSS
import DOMPurify from 'dompurify';

export const sanitize = (str) =>
  typeof str === 'string' ? DOMPurify.sanitize(str.trim()) : '';

export const sanitizeObject = (obj) => {
  const clean = {};
  for (const key in obj) {
    clean[key] = typeof obj[key] === 'string' ? sanitize(obj[key]) : obj[key];
  }
  return clean;
};

// Format Firestore timestamp
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// Truncate text
export const truncate = (str, length = 100) =>
  str && str.length > length ? str.slice(0, length) + '…' : str;

// Plan labels
export const PLAN_LABELS = { free: 'Free', paid: 'Pro' };
export const PLAN_COLORS = { free: '#64748b', paid: '#6366f1' };

// Plan limits
export const FREE_RESUME_LIMIT = 2;
export const FREE_AI_TOKENS = 300;
