'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { processReceipt, ProcessedReceipt } from '@/lib/ocr';
import { generatePDFReport, ExpenseReport } from '@/lib/pdf';
import { useDropzone } from 'react-dropzone';
import {
  BsUpload,
  BsReceipt,
  BsTrash,
  BsRobot,
  BsCalendar,
  BsExclamationCircle,
  BsCheck2Circle,
} from 'react-icons/bs';

export default function SubmitExpensePage() {
  const { userData } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedReceipt | null>(null);
  const [pdfData, setPdfData] = useState<{ blob: Blob; reportId: string } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const formatDisplayDate = (dateString: string) => {
    try {
      // If the date is already in DD-MM-YY format, return it as is
      if (/^\d{2}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Otherwise, parse and format the date
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = (date.getFullYear() % 100).toString().padStart(2, '0');
      return `${day}-${month}-${year}`;
    } catch (e) {
      return dateString;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const newFile = acceptedFiles[0];
    setFile(newFile);
    setLoading(true);
    setError(null);

    try {
      const receiptData = await processReceipt(newFile);
      console.log('Receipt data processed:', receiptData);
      setProcessedData(receiptData);
      
      // Directly use the processed receipt data to fill form fields
      setAmount(receiptData.amount.toFixed(2));
      setDate(receiptData.date);
      setCategory(receiptData.category);
      setDescription(receiptData.description || '');
      if (receiptData.projectCode) {
        setProjectCode(receiptData.projectCode);
      }
      
      setSuccess(true);
    } catch (err) {
      console.error('Error processing receipt:', err);
      setError('Failed to process receipt. Please try again or enter details manually.');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const downloadPDF = () => {
    if (!pdfData) return;
    
    try {
      const pdfUrl = URL.createObjectURL(pdfData.blob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `expense_report_${pdfData.reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    } catch (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      setError('Failed to download PDF. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !userData) {
      setError('Please select a receipt image and ensure you are logged in');
      return;
    }

    setLoading(true);
    setError(null);
    setPdfData(null);

    try {
      // Create expense report data
      const expenseReport: ExpenseReport = {
        id: crypto.randomUUID(),
        userId: userData.uid,
        userName: userData.email,
        department: userData.department || 'General',
        receipts: processedData ? [processedData] : [],
        totalAmount: parseFloat(amount),
        submittedAt: new Date().toISOString(),
        status: 'pending',
        receiptUrls: []
      };

      try {
        // Generate PDF
        console.log('Generating PDF...');
        const pdfBlob = generatePDFReport(expenseReport);
        console.log('PDF blob generated:', pdfBlob);
        setPdfData({ blob: pdfBlob, reportId: expenseReport.id });
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        setError('Failed to generate PDF report');
        return;
      }

      // Submit to backend
      const formData = new FormData();
      formData.append('receipt', file);
      formData.append('amount', amount);
      formData.append('category', category);
      formData.append('date', date);
      formData.append('description', description);
      if (projectCode) formData.append('projectCode', projectCode);

      const response = await fetch('/api/expenses', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit expense');
      }

      const expenseData = await response.json();

      // Check if receipt needs to be flagged and send notification
      if (processedData && (
        processedData.anomaly !== 'Normal' || 
        processedData.amount > 100 || // Spending limit check
        !processedData.vendor
      )) {
        try {
          const notifyResponse = await fetch('/api/notify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              receipt: {
                ...processedData,
                id: expenseReport.id // Add the expense ID for approval/rejection links
              }
            }),
          });

          if (!notifyResponse.ok) {
            console.error('Failed to send notification:', await notifyResponse.text());
          }
        } catch (notifyError) {
          console.error('Error sending notification:', notifyError);
        }
      }

      setSuccess(true);
      setFile(null);
      downloadPDF();

      // Reset form after 10 seconds
      setTimeout(() => {
        setSuccess(false);
        setProcessedData(null);
        setPdfData(null);
      }, 10000);
    } catch (err) {
      console.error('Error submitting expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Submit Expense</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - File Upload */}
          <div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                  <BsUpload className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    {isDragActive ? 'Drop the receipt here' : 'Drag & drop receipt'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                </div>
                <div className="text-xs text-gray-500">
                  Supported formats: JPEG, PNG
                </div>
              </div>
            </div>

            {file && (
              <div className="mt-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BsReceipt className="text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin">
                    <BsRobot className="text-blue-500" />
                  </div>
                  <span className="text-sm text-blue-600">
                    Processing receipt...
                  </span>
                </div>
              </div>
            )}

            {processedData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                <h3 className="font-medium">Processed Receipt Data:</h3>
                <p><span className="font-medium">Vendor:</span> {processedData.vendor}</p>
                <p><span className="font-medium">Amount:</span> ${processedData.amount}</p>
                <p><span className="font-medium">Date:</span> {processedData.date}</p>
                <p><span className="font-medium">Category:</span> {processedData.category}</p>
                {processedData.anomaly !== 'Normal' && (
                  <p className="text-red-600">
                    <span className="font-medium">Warning:</span> {processedData.anomaly}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div 
                className="relative w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                         hover:border-blue-500 cursor-pointer transition-colors flex items-center"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <BsCalendar className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={formatDisplayDate(date)}
                  readOnly
                  className="w-full focus:outline-none cursor-pointer bg-transparent"
                  placeholder="Select date"
                />
              </div>
              
              {showDatePicker && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="p-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setShowDatePicker(false);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setDate(new Date().toISOString().split('T')[0]);
                        setShowDatePicker(false);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(false)}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                <option value="Travel">Travel</option>
                <option value="Meals">Meals</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Equipment">Equipment</option>
                <option value="Software">Software</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter expense description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Code (Optional)
              </label>
              <input
                type="text"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project code"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center space-x-2 text-red-600">
                <BsExclamationCircle />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center space-x-2 text-green-600">
                <BsCheck2Circle />
                <span className="text-sm">
                  Expense submitted successfully!
                  {pdfData && (
                    <button
                      type="button"
                      onClick={downloadPDF}
                      className="ml-2 underline hover:text-green-700"
                    >
                      Download PDF Report
                    </button>
                  )}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
                ${
                  loading || !file
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2">
                    <BsRobot />
                  </div>
                  Processing...
                </>
              ) : (
                'Submit Expense'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 