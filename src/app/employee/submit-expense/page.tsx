'use client';

import { useState, useCallback } from 'react';
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

interface UploadedFile {
  file: File;
  preview: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

interface ExtractedData {
  merchant: string;
  date: string;
  amount: string;
  category: string;
  description: string;
}

const categories = [
  'Travel',
  'Meals & Entertainment',
  'Office Supplies',
  'Transportation',
  'Accommodation',
  'Software & Services',
  'Other',
];

const policyLimits = {
  'Travel': 500,
  'Meals & Entertainment': 100,
  'Office Supplies': 200,
  'Transportation': 150,
  'Accommodation': 300,
  'Software & Services': 250,
  'Other': 100,
};

export default function SubmitExpensePage() {
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading',
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setIsAIProcessing(true);

    // Simulate OCR and AI processing
    setTimeout(() => {
      setFiles(prev =>
        prev.map(f =>
          newFiles.find(nf => nf.file === f.file) ? { ...f, status: 'processing' } : f
        )
      );

      // Simulate AI extraction
      setTimeout(() => {
        setFiles(prev =>
          prev.map(f =>
            newFiles.find(nf => nf.file === f.file) ? { ...f, status: 'complete' } : f
          )
        );

        // Simulate extracted data
        setExtractedData({
          merchant: 'Airline Company',
          date: '2024-03-20',
          amount: '850.00',
          category: 'Travel',
          description: 'Business flight ticket',
        });

        // Check policy violations
        checkPolicyViolations('Travel', 850);
        setIsAIProcessing(false);
      }, 2000);
    }, 1000);
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
    const limit = policyLimits[category as keyof typeof policyLimits];
    
    if (amount > limit) {
      violations.push(`Amount exceeds the limit for ${category.toLowerCase()} expenses ($${limit})`);
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    // Handle form submission
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Submit Expense Report</h1>
        <p className="text-gray-600">Upload receipts and our AI will help you process them</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        onClick={() => removeFile(file)}
                        className="text-gray-400 hover:text-red-600"
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

        {/* Expense Details Form */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Expense Details
              </h2>
              {isAIProcessing && (
                <div className="flex items-center text-blue-600">
                  <BsRobot className="animate-pulse mr-2" />
                  <span className="text-sm">AI Processing...</span>
                </div>
              )}
            </div>

            {policyViolations.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg">
                <div className="flex items-center text-red-800 text-sm font-medium mb-2">
                  <BsExclamationTriangle className="mr-2" />
                  Policy Violations Detected
                </div>
                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                  {policyViolations.map((violation, index) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  value={extractedData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={extractedData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {extractedData.category && (
                  <p className="mt-1 text-sm text-gray-500">
                    Limit: ${policyLimits[extractedData.category as keyof typeof policyLimits]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any additional details or justification..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isAIProcessing || isSaving || policyViolations.length > 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <BsLightning className="animate-pulse mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit for Approval
                      <BsArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
} 