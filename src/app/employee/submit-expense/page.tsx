'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  BsUpload,
  BsImage,
  BsTrash,
  BsCheckCircle,
  BsExclamationTriangle,
  BsArrowRight,
  BsRobot,
  BsReceipt,
  BsLightning,
} from 'react-icons/bs';
import { Dropdown } from '@/components/ui/Dropdown';

interface UploadedFile {
  file: File;
  preview: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  data?: {
    text: string;
    amount: number;
    date: string;
    merchant: string;
    category: string;
    confidence_score: number;
  };
}

interface ExtractedData {
  merchant: string;
  date: string;
  amount: string;
  category: string;
  description: string;
}

interface MonthlyExpenses {
  [category: string]: number;
}

const categories = [
  'Meals & Dining',
  'Travel (Flights)',
  'Accommodation',
  'Local Transport',
  'Office Supplies',
  'Client Entertainment',
];

const policyLimits = {
  'Meals & Dining': 50,
  'Travel (Flights)': 1000,
  'Accommodation': 200,
  'Local Transport': 30,
  'Office Supplies': 100,
  'Client Entertainment': 150,
};

const monthlyLimits = {
  'Meals & Dining': 500,
  'Travel (Flights)': 3000,
  'Accommodation': 2500,
  'Local Transport': 500,
  'Office Supplies': 300,
  'Client Entertainment': 1000,
};

// Define dropdown options
const categoryOptions = categories.map(cat => ({
  value: cat.toLowerCase().replace(/[\s()&]+/g, '_'),
  label: cat
}));

const currencyOptions = [
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'gbp', label: 'GBP (£)' },
  { value: 'jpy', label: 'JPY (¥)' },
];

export default function SubmitExpensePage() {
  const [isClient, setIsClient] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    merchant: '',
    date: '',
    amount: '',
    category: '',
    description: '',
  });
  const [policyViolations, setPolicyViolations] = useState<string[]>([]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpenses>({});

  // Use useEffect to mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch monthly expenses when component mounts
  useEffect(() => {
    fetchMonthlyExpenses();
  }, []);

  const fetchMonthlyExpenses = async () => {
    try {
      const response = await fetch('/api/monthly-expenses');
      const result = await response.json();
      if (result.success) {
        setMonthlyExpenses(result.data);
      }
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
    }
  };

  const updateMonthlyExpenses = async (category: string, amount: number) => {
    try {
      const response = await fetch('/api/monthly-expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, amount }),
      });
      const result = await response.json();
      if (result.success) {
        setMonthlyExpenses(result.data);
      }
    } catch (error) {
      console.error('Error updating monthly expenses:', error);
    }
  };

  const processReceipt = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Starting receipt processing for:', file.name);
      const response = await fetch('/api/process-receipt', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to process receipt: ${errorText}`);
      }

      const result = await response.json();
      console.log('Processing result:', result);
      return result;
    } catch (error) {
      console.error('Error processing receipt:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles.map(f => f.name));
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading' as const,
    }));
    setFiles(prev => [...prev, ...newFiles]);

    // Process each file with ML
    for (const fileData of newFiles) {
      try {
        console.log('Processing file:', fileData.file.name);
        setIsAIProcessing(true);
        
        // Update status to processing
        setFiles(prev =>
          prev.map(f =>
            f === fileData
              ? { ...f, status: 'processing' }
              : f
          )
        );

        const result = await processReceipt(fileData.file);
        console.log('Processing completed for:', fileData.file.name, result);
        
        if (result.success) {
          setFiles(prev =>
            prev.map(f =>
              f === fileData
                ? { ...f, status: 'complete', data: result.data }
                : f
            )
          );

          // Update form with the first processed receipt's data
          if (fileData === newFiles[0]) {
            setExtractedData({
              merchant: result.data.merchant || '',
              date: result.data.date || '',
              amount: result.data.amount?.toString() || '',
              category: result.data.category || '',
              description: result.data.text || '',
            });

            // Check policy violations
            if (result.data.amount && result.data.category) {
              checkPolicyViolations(result.data.category, result.data.amount);
            }
          }
        } else {
          console.error('Processing failed:', result.error);
          setFiles(prev =>
            prev.map(f =>
              f === fileData
                ? { ...f, status: 'error' }
                : f
            )
          );
        }
      } catch (error) {
        console.error('Error processing file:', fileData.file.name, error);
        setFiles(prev =>
          prev.map(f =>
            f === fileData
              ? { ...f, status: 'error' }
              : f
          )
        );
      }
    }
    setIsAIProcessing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  const removeFile = (file: UploadedFile) => {
    URL.revokeObjectURL(file.preview);
    setFiles(prev => prev.filter(f => f !== file));
  };

  const checkPolicyViolations = (category: string, amount: number) => {
    const violations: string[] = [];
    const transactionLimit = policyLimits[category as keyof typeof policyLimits];
    const monthlyLimit = monthlyLimits[category as keyof typeof monthlyLimits];
    
    if (amount > transactionLimit) {
      violations.push(`Amount exceeds the per-transaction limit for ${category.toLowerCase()} (USD $${transactionLimit})`);
    }

    // Check monthly limit
    const currentMonthlyTotal = (monthlyExpenses[category] || 0) + amount;
    if (currentMonthlyTotal > monthlyLimit) {
      violations.push(`Total monthly expenses for ${category.toLowerCase()} (USD $${currentMonthlyTotal.toFixed(2)}) would exceed the monthly limit of USD $${monthlyLimit}`);
    }
    
    if (!files.length) {
      violations.push('Receipt is required');
    }

    setPolicyViolations(violations);
  };

  const handleCategoryChange = (category: string) => {
    setExtractedData(prev => ({ ...prev, category }));
    const amount = parseFloat(extractedData.amount);
    if (!isNaN(amount)) {
      checkPolicyViolations(category, amount);
    }
  };

  const handleAmountChange = (amount: string) => {
    setExtractedData(prev => ({ ...prev, amount }));
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && extractedData.category) {
      checkPolicyViolations(extractedData.category, numAmount);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const amount = parseFloat(extractedData.amount);
      if (!isNaN(amount) && extractedData.category) {
        // Update monthly expenses
        await updateMonthlyExpenses(extractedData.category, amount);
      }

      // Here you would submit the form data to your backend
      const formData = {
        ...extractedData,
        receipts: files.map(f => ({
          preview: f.preview,
          data: f.data,
        })),
        currency: selectedCurrency,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitted form data:', formData);

      // Reset form
      setFiles([]);
      setExtractedData({
        merchant: '',
        date: '',
        amount: '',
        category: '',
        description: '',
      });
      setPolicyViolations([]);
      setSelectedCategory('');
      setSelectedCurrency('usd');

      // Refresh monthly expenses
      await fetchMonthlyExpenses();
    } catch (error) {
      console.error('Error submitting expense:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Only render the component content when we're on the client
  if (!isClient) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Submit Expense Report</h1>
        <p className="text-gray-600">Upload receipts and our AI will help you process them</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <BsUpload className="mx-auto text-3xl text-gray-400 mb-4" />
              <p className="text-gray-600">
                {isDragActive
                  ? 'Drop the files here...'
                  : 'Drag & drop receipts here, or click to select files'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports JPG, PNG, and PDF files
              </p>
            </div>
          </motion.div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Uploaded Files
              </h2>
              <div className="space-y-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BsImage className="text-gray-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.file.size / 1024).toFixed(0)} KB
                        </p>
                        {file.data && (
                          <p className="text-xs text-green-600 mt-1">
                            Processed with {(file.data.confidence_score * 100).toFixed(0)}% confidence
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {file.status === 'uploading' && (
                        <div className="animate-pulse text-blue-600">
                          Uploading...
                        </div>
                      )}
                      {file.status === 'processing' && (
                        <div className="flex items-center text-blue-600">
                          <BsRobot className="animate-pulse mr-2" />
                          Processing
                        </div>
                      )}
                      {file.status === 'complete' && (
                        <BsCheckCircle className="text-green-600" />
                      )}
                      {file.status === 'error' && (
                        <BsExclamationTriangle className="text-red-600" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(file)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Expense Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Merchant
                </label>
                <input
                  type="text"
                  value={extractedData.merchant}
                  onChange={(e) =>
                    setExtractedData((prev) => ({
                      ...prev,
                      merchant: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={extractedData.date}
                  onChange={(e) =>
                    setExtractedData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      value={extractedData.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <Dropdown
                    options={currencyOptions}
                    value={selectedCurrency}
                    onChange={setSelectedCurrency}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <Dropdown
                  options={categoryOptions}
                  value={extractedData.category.toLowerCase().replace(/[\s()&]+/g, '_')}
                  onChange={(value) =>
                    handleCategoryChange(
                      categories.find(
                        (cat) =>
                          cat.toLowerCase().replace(/[\s()&]+/g, '_') === value
                      ) || ''
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={extractedData.description}
                  onChange={(e) =>
                    setExtractedData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Policy Violations */}
          {policyViolations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 p-4 rounded-xl"
            >
              <h3 className="text-sm font-medium text-red-800">
                Policy Violations
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {policyViolations.map((violation, index) => (
                  <li key={index}>{violation}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <button
              type="submit"
              disabled={isSaving || policyViolations.length > 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                (isSaving || policyViolations.length > 0) &&
                'opacity-50 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <BsLightning className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Expense
                  <BsArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  );
} 