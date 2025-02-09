'use client';

import { useState, useCallback, useEffect } from 'react';
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

// Separate the styles to prevent dynamic class generation
const styles = {
  container: "max-w-4xl mx-auto px-4 py-8",
  card: "bg-white rounded-xl shadow-sm p-6",
  title: "text-2xl font-bold mb-6",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-8",
  dropzone: {
    base: "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
    active: "border-blue-500 bg-blue-50",
    inactive: "border-gray-300 hover:border-blue-500"
  },
  uploadIcon: {
    container: "w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center",
    icon: "w-8 h-8 text-blue-500"
  },
  filePreview: "mt-4",
  fileCard: "flex items-center justify-between p-3 bg-gray-50 rounded-lg",
  loadingCard: "mt-4 p-4 bg-blue-50 rounded-lg",
  processedDataCard: "mt-4 p-4 bg-gray-50 rounded-lg space-y-2",
  form: "space-y-6",
  inputGroup: "relative",
  label: "block text-sm font-medium text-gray-700 mb-1",
  input: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  amountInput: "w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  datePickerButton: "relative w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 cursor-pointer transition-colors flex items-center",
  datePickerDropdown: "absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200",
  submitButton: {
    base: "w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white",
    enabled: "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
    disabled: "bg-blue-400 cursor-not-allowed"
  }
};

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
  
  // Initialize date in useEffect to avoid hydration mismatch
  const [date, setDate] = useState<string>('');
  useEffect(() => {
    // Set initial date only on client side
    if (date === '') {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  }, [date]);

  const formatDisplayDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    
    try {
      // If the date is already in DD-MM-YY format, return it as is
      if (/^\d{2}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Otherwise, parse and format the date
      const dateParts = dateString.split('-');
      if (dateParts.length !== 3) return dateString;

      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);

      return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${(year % 100).toString().padStart(2, '0')}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  }, []);

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
    setError(null);

    // Validate all required fields
    if (!file) {
      setError('Please select a receipt image');
      return;
    }
    if (!userData) {
      setError('Please ensure you are logged in');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
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

      // Generate PDF
      try {
        console.log('Generating PDF...');
        const pdfBlob = generatePDFReport(expenseReport);
        console.log('PDF blob generated:', pdfBlob);
        setPdfData({ blob: pdfBlob, reportId: expenseReport.id });
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        setError('Failed to generate PDF report');
        return;
      }

      // Prepare form data with all required fields
      const formData = new FormData();
      
      // Required fields
      formData.append('expenseId', expenseReport.id);
      formData.append('receipt', file);
      formData.append('amount', amount.toString());
      formData.append('category', category);
      formData.append('description', description.trim());
      formData.append('date', date);
      formData.append('userId', userData.uid);
      formData.append('userName', userData.email);
      formData.append('department', userData.department || 'General');
      formData.append('status', 'pending');
      formData.append('submittedAt', new Date().toISOString());

      // Optional fields
      if (projectCode) formData.append('projectCode', projectCode.trim());
      if (processedData) {
        formData.append('vendor', processedData.vendor);
        formData.append('anomaly', processedData.anomaly);
        formData.append('justification', processedData.justification);
        formData.append('fullText', processedData.fullText);
      }

      // Log the data being sent
      const formDataObj = Object.fromEntries(formData.entries());
      console.log('Submitting expense with data:', formDataObj);

      // Submit to backend with proper headers
      const response = await fetch('/api/expenses', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header when using FormData
          // It will be set automatically with the correct boundary
          'Accept': 'application/json',
        },
      });

      const responseText = await response.text();
      console.log('Response from server:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || 'Failed to submit expense');
        } catch (parseError) {
          throw new Error(`Failed to submit expense: ${responseText}`);
        }
      }

      // Parse the response only if it's JSON
      let expenseData;
      try {
        expenseData = JSON.parse(responseText);
        console.log('Expense submitted successfully:', expenseData);
      } catch (parseError) {
        console.warn('Response was not JSON:', responseText);
      }

      // Handle notifications for flagged expenses
      if (processedData && (
        processedData.anomaly !== 'Normal' || 
        processedData.amount > 100 || 
        !processedData.vendor
      )) {
        console.log('Expense flagged for notification:', {
          amount: processedData.amount,
          anomaly: processedData.anomaly,
          vendor: processedData.vendor,
          id: expenseReport.id
        });

        try {
          console.log('Attempting to send notification...');
          const notifyResponse = await fetch('/api/notify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              receipt: {
                ...processedData,
                id: expenseReport.id
              }
            }),
          });

          const notifyResponseText = await notifyResponse.text();
          console.log('Notification response:', notifyResponseText);

          if (!notifyResponse.ok) {
            console.error('Failed to send notification:', notifyResponseText);
          } else {
            console.log('Notification sent successfully');
          }
        } catch (notifyError) {
          console.error('Error sending notification:', notifyError);
        }
      } else {
        console.log('Expense not flagged for notification:', {
          amount: processedData?.amount,
          anomaly: processedData?.anomaly,
          vendor: processedData?.vendor
        });
      }

      setSuccess(true);
      setFile(null);
      downloadPDF();

      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setProcessedData(null);
        setPdfData(null);
        setAmount('');
        setCategory('');
        setDescription('');
        setProjectCode('');
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        setDate(`${year}-${month}-${day}`);
      }, 10000);
    } catch (err) {
      console.error('Error submitting expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className="neon-card p-6">
        <h1 className="text-2xl font-bold neon-text mb-6">Submit Expense</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - File Upload */}
          <div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-neon-primary bg-neon-primary/10' : 'border-neon-secondary hover:border-neon-primary'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-darker-bg/50 flex items-center justify-center">
                  <BsUpload className="w-8 h-8 text-neon-secondary" />
                </div>
                <div>
                  <p className="text-neon-secondary font-medium">
                    {isDragActive ? 'Drop the receipt here' : 'Drag & drop receipt'}
                  </p>
                  <p className="text-sm text-neon-secondary/70 mt-1">or click to browse</p>
                </div>
                <div className="text-xs text-neon-secondary/60">
                  Supported formats: JPEG, PNG
                </div>
              </div>
            </div>

            {file && (
              <div className="mt-4 p-3 bg-darker-bg/50 rounded-lg border border-neon-secondary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BsReceipt className="text-neon-secondary" />
                    <span className="text-sm text-neon-secondary truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-4 p-4 bg-darker-bg/50 rounded-lg border border-neon-secondary">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin">
                    <BsRobot className="text-neon-secondary" />
                  </div>
                  <span className="text-sm text-neon-secondary">
                    Processing receipt...
                  </span>
                </div>
              </div>
            )}

            {processedData && (
              <div className="mt-4 p-4 bg-darker-bg/50 rounded-lg border border-neon-secondary space-y-2">
                <h3 className="font-medium text-neon-secondary">Processed Receipt Data:</h3>
                <p className="text-neon-secondary"><span className="font-medium">Vendor:</span> {processedData.vendor}</p>
                <p className="text-neon-secondary"><span className="font-medium">Amount:</span> ${processedData.amount}</p>
                <p className="text-neon-secondary"><span className="font-medium">Date:</span> {processedData.date}</p>
                <p className="text-neon-secondary"><span className="font-medium">Category:</span> {processedData.category}</p>
                {processedData.anomaly !== 'Normal' && (
                  <p className="text-red-400">
                    <span className="font-medium">Warning:</span> {processedData.anomaly}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neon-secondary mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-neon-secondary">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="neon-input w-full pl-7 text-white placeholder-gray-400"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neon-secondary mb-1">
                Date
              </label>
              <div 
                className="relative neon-input w-full cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <BsCalendar className="absolute left-3 top-2.5 text-neon-secondary" />
                <input
                  type="text"
                  value={date ? formatDisplayDate(date) : ''}
                  readOnly
                  className="w-full pl-10 bg-transparent text-white cursor-pointer"
                  placeholder="Select date"
                />
              </div>
              
              {showDatePicker && (
                <div className="absolute mt-1 p-2 bg-darker-bg border border-neon-secondary rounded-lg shadow-lg z-10">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setShowDatePicker(false);
                    }}
                    className="neon-input w-full text-white"
                  />
                  <div className="mt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = (today.getMonth() + 1).toString().padStart(2, '0');
                        const day = today.getDate().toString().padStart(2, '0');
                        setDate(`${year}-${month}-${day}`);
                        setShowDatePicker(false);
                      }}
                      className="text-sm text-neon-primary hover:text-neon-primary/80"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(false)}
                      className="text-sm text-neon-secondary hover:text-neon-secondary/80"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neon-secondary mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="neon-input w-full text-white"
                required
              >
                <option value="" className="bg-darker-bg">Select a category</option>
                <option value="Travel" className="bg-darker-bg">Travel</option>
                <option value="Meals" className="bg-darker-bg">Meals</option>
                <option value="Office Supplies" className="bg-darker-bg">Office Supplies</option>
                <option value="Equipment" className="bg-darker-bg">Equipment</option>
                <option value="Software" className="bg-darker-bg">Software</option>
                <option value="Other" className="bg-darker-bg">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neon-secondary mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="neon-input w-full text-white placeholder-gray-400"
                placeholder="Enter expense description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neon-secondary mb-1">
                Project Code (Optional)
              </label>
              <input
                type="text"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                className="neon-input w-full text-white placeholder-gray-400"
                placeholder="Enter project code"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg flex items-center space-x-2 text-red-400">
                <BsExclamationCircle />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-900/20 border border-green-500 rounded-lg flex items-center space-x-2 text-green-400">
                <BsCheck2Circle />
                <span className="text-sm">
                  Expense submitted successfully!
                  {pdfData && (
                    <button
                      type="button"
                      onClick={downloadPDF}
                      className="ml-2 underline hover:text-green-300"
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
              className={`w-full neon-button ${
                loading || !file ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="ml-2">Processing...</span>
                </div>
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