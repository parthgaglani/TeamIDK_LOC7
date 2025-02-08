import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ExtractedReceipt } from './ocr';

export interface ExpenseReport {
  id: string;
  userId: string;
  userName: string;
  department: string;
  receipts: ExtractedReceipt[];
  totalAmount: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  pdfUrl?: string;
  receiptUrls: string[];
}

export function generatePDFReport(report: ExpenseReport): Blob {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text('Expense Report', 105, 15, { align: 'center' });

  // Add report details
  doc.setFontSize(12);
  doc.text(`Report ID: ${report.id}`, 20, 30);
  doc.text(`Employee: ${report.userName}`, 20, 40);
  doc.text(`Department: ${report.department}`, 20, 50);
  doc.text(`Date: ${new Date(report.submittedAt).toLocaleDateString()}`, 20, 60);
  doc.text(`Total Amount: $${report.totalAmount.toFixed(2)}`, 20, 70);

  // Add receipts table
  const tableData = report.receipts.map(receipt => [
    receipt.vendor,
    `$${receipt.amount.toFixed(2)}`,
    receipt.date,
    receipt.category,
  ]);

  (doc as any).autoTable({
    startY: 80,
    head: [['Vendor', 'Amount', 'Date', 'Category']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Add notes if any
  if (report.notes) {
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.text('Notes:', 20, finalY + 10);
    doc.setFontSize(10);
    doc.text(report.notes, 20, finalY + 20);
  }

  return doc.output('blob');
}

export function generateFraudReport(report: ExpenseReport, fraudAlerts: any[]): Blob {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text('Fraud Detection Report', 105, 15, { align: 'center' });

  // Add report details
  doc.setFontSize(12);
  doc.text(`Report ID: ${report.id}`, 20, 30);
  doc.text(`Employee: ${report.userName}`, 20, 40);
  doc.text(`Department: ${report.department}`, 20, 50);
  doc.text(`Date: ${new Date(report.submittedAt).toLocaleDateString()}`, 20, 60);

  // Add fraud alerts table
  const tableData = fraudAlerts.map(alert => [
    alert.type,
    alert.description,
    alert.severity,
    alert.confidence + '%',
  ]);

  (doc as any).autoTable({
    startY: 70,
    head: [['Alert Type', 'Description', 'Severity', 'Confidence']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [220, 53, 69] },
  });

  return doc.output('blob');
} 