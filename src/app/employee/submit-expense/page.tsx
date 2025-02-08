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
  BsCheck2Circle,
  BsExclamationCircle,
  BsCalendar,
} from 'react-icons/bs';
import { processReceipt, ExtractedReceipt } from '@/lib/ocr';

interface FormData extends ExtractedReceipt {
  description: string;
  projectCode?: string;
}

export default function SubmitExpensePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormData>({
    vendor: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    fullText: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setProcessing(true);
    setError(null);

    try {
      const file = acceptedFiles[0];
      const extractedData = await processReceipt(file);
      
      console.log('Raw OCR data:', extractedData);

      // Parse the date from DD/MM/YYYY format to YYYY-MM-DD for input
      let formattedDate = new Date().toISOString().split('T')[0];
      if (extractedData.date) {
        console.log('Extracted date before parsing:', extractedData.date);
        const [day, month, year] = extractedData.date.split('/').map(num => parseInt(num, 10));
        console.log('Parsed date components:', { day, month, year });
        
        // Create date in local timezone to avoid timezone offset issues
        const parsedDate = new Date(Date.UTC(year, month - 1, day));
        console.log('Parsed date object:', parsedDate);
        
        if (!isNaN(parsedDate.getTime())) {
          // Format as YYYY-MM-DD while preserving the correct date
          formattedDate = parsedDate.toISOString().split('T')[0];
          console.log('Final formatted date:', formattedDate);
        }
      }
      
      setCurrentForm(prev => ({
        ...prev,
        vendor: extractedData.vendor || '',
        amount: extractedData.amount || 0,
        date: formattedDate,
        category: extractedData.category || '',
        description: extractedData.description || '',
        fullText: extractedData.fullText || '',
      }));
      
      setSuccess(true);
    } catch (err) {
      setError('Failed to process receipt. Please try again or enter details manually.');
      console.error('Receipt processing error:', err);
    } finally {
      setProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data before submission
    if (!currentForm.vendor || !currentForm.amount || !currentForm.date || !currentForm.category || !currentForm.description) {
      setError('Please fill in all required fields');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append receipt file if exists
      if (files.length > 0) {
        formData.append('receipt', files[0]);
      }

      // Append form fields with null checks
      formData.append('vendor', currentForm.vendor || '');
      formData.append('amount', (currentForm.amount || 0).toString());
      formData.append('date', currentForm.date || new Date().toISOString().split('T')[0]);
      formData.append('category', currentForm.category || '');
      formData.append('description', currentForm.description || '');
      formData.append('fullText', currentForm.fullText || '');
      if (currentForm.projectCode) {
        formData.append('projectCode', currentForm.projectCode);
      }

      const response = await fetch('/api/expenses', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.status === 401) {
        throw new Error('Please sign in to submit expenses');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit expense');
      }
      
      // Reset form state
      setSuccess(true);
      setFiles([]);
      setCurrentForm({
        vendor: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: '',
        fullText: '',
        description: '',
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit expense. Please try again.');
    } finally {
      setProcessing(false);
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

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <BsReceipt className="text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-600"
                    >
                      <BsTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {processing && (
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
          </div>

          {/* Right Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor
              </label>
              <input
                type="text"
                value={currentForm.vendor}
                onChange={e =>
                  setCurrentForm(prev => ({ ...prev, vendor: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter vendor name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={currentForm.amount}
                  onChange={e =>
                    setCurrentForm(prev => ({
                      ...prev,
                      amount: parseFloat(e.target.value),
                    }))
                  }
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
                  value={formatDisplayDate(currentForm.date)}
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
                      value={currentForm.date}
                      onChange={(e) => {
                        setCurrentForm(prev => ({
                          ...prev,
                          date: e.target.value
                        }));
                        setShowDatePicker(false);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentForm(prev => ({
                          ...prev,
                          date: new Date().toISOString().split('T')[0]
                        }));
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
                value={currentForm.category}
                onChange={e =>
                  setCurrentForm(prev => ({ ...prev, category: e.target.value }))
                }
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
                value={currentForm.description}
                onChange={e =>
                  setCurrentForm(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
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
                value={currentForm.projectCode || ''}
                onChange={e =>
                  setCurrentForm(prev => ({
                    ...prev,
                    projectCode: e.target.value,
                  }))
                }
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
                <span className="text-sm">Receipt processed successfully!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
                ${
                  processing
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {processing ? (
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