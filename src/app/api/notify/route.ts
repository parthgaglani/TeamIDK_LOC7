import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ProcessedReceipt } from '@/lib/ocr';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Manager's email
const MANAGER_EMAIL = process.env.MANAGER_EMAIL || 'jaindaksh212004@gmail.com';

// Spending limit for flagging
const SPENDING_LIMIT = 100;

function generateApprovalLink(receiptId: string, action: 'approve' | 'reject'): string {
  // In production, this should be your actual domain
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';
  
  return `${baseUrl}/api/expenses/${action}/${receiptId}`;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const flaggedReceipt: ProcessedReceipt = data.receipt;

    if (!flaggedReceipt) {
      return NextResponse.json({ error: 'No receipt data provided' }, { status: 400 });
    }

    // Check if receipt should be flagged
    const shouldFlag = 
      flaggedReceipt.amount > SPENDING_LIMIT || 
      flaggedReceipt.anomaly !== 'Normal' ||
      !flaggedReceipt.vendor;

    if (!shouldFlag) {
      return NextResponse.json({ message: 'Receipt does not require notification' });
    }

    // Create email content with approval/reject links
    const emailContent = `
      <h2>Flagged Expense Report</h2>
      <div style="margin-bottom: 20px;">
        <p><strong>Vendor:</strong> ${flaggedReceipt.vendor}</p>
        <p><strong>Amount:</strong> $${flaggedReceipt.amount}</p>
        <p><strong>Date:</strong> ${flaggedReceipt.date}</p>
        <p><strong>Category:</strong> ${flaggedReceipt.category}</p>
        <p><strong>Justification:</strong> ${flaggedReceipt.justification}</p>
        <p><strong>Anomaly:</strong> ${flaggedReceipt.anomaly}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h3>Reason for Flag:</h3>
        <ul>
          ${flaggedReceipt.amount > SPENDING_LIMIT ? '<li>Amount exceeds spending limit</li>' : ''}
          ${flaggedReceipt.anomaly !== 'Normal' ? `<li>${flaggedReceipt.anomaly}</li>` : ''}
          ${!flaggedReceipt.vendor ? '<li>Missing vendor information</li>' : ''}
        </ul>
      </div>
      <div style="margin-top: 20px;">
        <p>Please review this expense and take appropriate action:</p>
        <div style="margin-top: 10px;">
          <a href="${generateApprovalLink(flaggedReceipt.id, 'approve')}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; margin-right: 10px;">
            Approve
          </a>
          <a href="${generateApprovalLink(flaggedReceipt.id, 'reject')}" 
             style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none;">
            Reject
          </a>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: MANAGER_EMAIL,
      subject: 'Flagged Expense Report - Action Required',
      html: emailContent
    });

    return NextResponse.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
} 