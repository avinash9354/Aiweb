// Export utilities for admin dashboard
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── EXCEL ─────────────────────────────────────────────────────────────────────
export const exportToExcel = (data, filename = 'export') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${filename}.xlsx`);
};

// ── CSV ───────────────────────────────────────────────────────────────────────
export const exportToCSV = (data, filename = 'export') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${filename}.csv`);
};

// ── PDF ───────────────────────────────────────────────────────────────────────
export const exportToPDF = (data, filename = 'export', title = 'Report') => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor(99, 102, 241);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  if (data.length > 0) {
    const columns = Object.keys(data[0]).map((k) => ({ header: k, dataKey: k }));
    autoTable(doc, {
      startY: 35,
      columns,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
    });
  }

  doc.save(`${filename}.pdf`);
};

// ── IMPORT ────────────────────────────────────────────────────────────────────
export const importFromExcel = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        resolve(XLSX.utils.sheet_to_json(ws));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
