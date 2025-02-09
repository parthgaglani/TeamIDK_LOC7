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
      <div className={styles.card}>
        <h1 className={styles.title}>Submit Expense</h1>

        <div className={styles.grid}>
          {/* Left Column - File Upload */}
          <div>
            <div
              {...getRootProps()}
              className={`${styles.dropzone.base} ${
                isDragActive ? styles.dropzone.active : styles.dropzone.inactive
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className={styles.uploadIcon.container}>
                  <BsUpload className={styles.uploadIcon.icon} />
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
              <div className={styles.filePreview}>
                <div className={styles.fileCard}>
                  <div className="flex items-center space-x-3">
                    <BsReceipt className="text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className={styles.loadingCard}>
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
              <div className={styles.processedDataCard}>
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
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label className={styles.label}>
                Amount
              </label>
              <div className={styles.inputGroup}>
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={styles.amountInput}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Date
              </label>
              <div 
                className={styles.datePickerButton}
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <BsCalendar className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={date ? formatDisplayDate(date) : ''}
                  readOnly
                  className={styles.input}
                  placeholder="Select date"
                />
              </div>
              
              {showDatePicker && (
                <div className={styles.datePickerDropdown}>
                  <div className="p-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setShowDatePicker(false);
                      }}
                      className={styles.input}
                    />
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-between">
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
              <label className={styles.label}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.input}
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
              <label className={styles.label}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={styles.input}
                placeholder="Enter expense description"
                required
              />
            </div>

            <div>
              <label className={styles.label}>
                Project Code (Optional)
              </label>
              <input
                type="text"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                className={styles.input}
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
              className={`${styles.submitButton.base} ${
                loading || !file ? styles.submitButton.disabled : styles.submitButton.enabled
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