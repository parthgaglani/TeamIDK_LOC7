'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BsCheckCircle,
  BsXCircle,
  BsExclamationTriangle,
  BsEye,
  BsDownload,
  BsFilter,
  BsSearch,
} from 'react-icons/bs';
import { ExpenseReport } from '@/lib/pdf';
import { generatePDFReport, generateFraudReport } from '@/lib/pdf';
import { useAuth } from '@/lib/AuthContext';

interface FraudAlert {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
}

interface ReviewFilters {
  status: string;
  dateRange: string;
  department: string;
  minAmount: string;
  maxAmount: string;
  searchTerm: string;
}

export default function ReviewExpensesPage() {
  const { userData } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseReport[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseReport | null>(null);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ReviewFilters>({
    status: '',
    dateRange: '',
    department: '',
    minAmount: '',
    maxAmount: '',
    searchTerm: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userData) {
        setError('Please sign in to view expenses');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/expenses?status=pending', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (response.status === 401) {
          setError('Your session has expired. Please sign in again.');
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch expenses');
        }
        
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userData]);

  const handleApprove = async (expenseId: string) => {
    if (!userData) {
      setError('Please sign in to approve expenses');
      return;
    }

    try {
      const response = await fetch(`/api/expenses/${expenseId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        setError('Your session has expired. Please sign in again.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve expense');
      }
      
      setExpenses(prev =>
        prev.map(exp =>
          exp.id === expenseId ? { ...exp, status: 'approved' } : exp
        )
      );
    } catch (error) {
      console.error('Error approving expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to approve expense');
    }
  };

  const handleReject = async (expenseId: string) => {
    if (!userData) {
      setError('Please sign in to reject expenses');
      return;
    }

    try {
      const response = await fetch(`/api/expenses/${expenseId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        setError('Your session has expired. Please sign in again.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject expense');
      }
      
      setExpenses(prev =>
        prev.map(exp =>
          exp.id === expenseId ? { ...exp, status: 'rejected' } : exp
        )
      );
    } catch (error) {
      console.error('Error rejecting expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to reject expense');
    }
  };

  const handleDownloadReport = async (expense: ExpenseReport) => {
    const pdfBlob = generatePDFReport(expense);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${expense.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFraudReport = async (expense: ExpenseReport) => {
    const pdfBlob = generateFraudReport(expense, fraudAlerts);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud-report-${expense.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filters.status && expense.status !== filters.status) return false;
    if (filters.department && expense.department !== filters.department) return false;
    if (filters.minAmount && expense.totalAmount < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && expense.totalAmount > parseFloat(filters.maxAmount)) return false;
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        expense.userName.toLowerCase().includes(searchLower) ||
        expense.department.toLowerCase().includes(searchLower) ||
        expense.id.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Review Expenses</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <BsFilter className="mr-2" />
            Filters
          </button>
            <div className="relative">
              <input
                type="text"
              placeholder="Search expenses..."
              value={filters.searchTerm}
              onChange={e =>
                setFilters(prev => ({ ...prev, searchTerm: e.target.value }))
              }
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <BsSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-600">
          <BsExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm mb-8 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full rounded-lg border-gray-300"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
          </div>

          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, department: e.target.value }))
                  }
                  className="w-full rounded-lg border-gray-300"
                >
                  <option value="">All</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                </select>
          </div>

          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAmount}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, minAmount: e.target.value }))
                    }
                    className="w-1/2 rounded-lg border-gray-300"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAmount}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, maxAmount: e.target.value }))
                    }
                    className="w-1/2 rounded-lg border-gray-300"
                  />
                </div>
          </div>
        </div>
      </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(expense => (
                  <tr
                    key={expense.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {expense.userName}
                      </div>
                      <div className="text-sm text-gray-500">{expense.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${expense.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          expense.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : expense.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {expense.status.charAt(0).toUpperCase() +
                          expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedExpense(expense)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <BsEye />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(expense)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <BsDownload />
                        </button>
                        {expense.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(expense.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <BsCheckCircle />
                            </button>
                            <button
                              onClick={() => handleReject(expense.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <BsXCircle />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Details Modal */}
      <AnimatePresence>
        {selectedExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Expense Details
                  </h2>
                  <button
                    onClick={() => setSelectedExpense(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <BsXCircle className="text-xl" />
                  </button>
                  </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Basic Information
                    </h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Employee
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {selectedExpense.userName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Department
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {selectedExpense.department}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Total Amount
                        </dt>
                        <dd className="text-sm text-gray-900">
                          ${selectedExpense.totalAmount.toFixed(2)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Submission Date
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(
                            selectedExpense.submittedAt
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Receipts</h3>
                    <div className="space-y-4">
                      {selectedExpense.receipts.map((receipt, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{receipt.vendor}</p>
                              <p className="text-sm text-gray-500">
                                {receipt.date}
                              </p>
                            </div>
                            <p className="font-medium">
                              ${receipt.amount.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            {receipt.category}
                          </p>
                </div>
                      ))}
                    </div>
                </div>
              </div>

                {fraudAlerts.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                      <BsExclamationTriangle className="mr-2" />
                      Fraud Alerts
                    </h3>
                    <div className="space-y-4">
                      {fraudAlerts.map((alert, index) => (
                        <div
                          key={index}
                          className="p-4 bg-red-50 rounded-lg border border-red-200"
                        >
                          <div className="flex items-center justify-between">
                      <div>
                              <p className="font-medium text-red-800">
                                {alert.type}
                              </p>
                              <p className="text-sm text-red-600">
                                {alert.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-red-800">
                                Severity: {alert.severity}
                              </p>
                              <p className="text-sm text-red-600">
                                Confidence: {alert.confidence}%
                              </p>
                            </div>
                          </div>
                      </div>
                      ))}
                    </div>
                      </div>
                    )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleDownloadFraudReport(selectedExpense)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Download Fraud Report
                  </button>
                      <button
                    onClick={() => handleDownloadReport(selectedExpense)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                    Download Report
                      </button>
                  {selectedExpense.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleApprove(selectedExpense.id);
                          setSelectedExpense(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedExpense.id);
                          setSelectedExpense(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                    </div>
                  </div>
            </motion.div>
                </motion.div>
              )}
      </AnimatePresence>
    </div>
  );
} 