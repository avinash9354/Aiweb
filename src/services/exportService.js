import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Exports the resume element to a high-quality PDF.
 * @param {HTMLElement} element The resume paper element.
 * @param {string} filename The name of the file to save.
 */
export const exportToPDF = async (element, filename = 'resume.pdf') => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('PDF Export failed:', err);
    throw err;
  }
};

/**
 * Generates a shareable public link for a resume.
 * (Note: This is a placeholder, real implementation requires a public route)
 */
export const getShareableLink = (resumeId) => {
  return `${window.location.origin}/share/${resumeId}`;
};
