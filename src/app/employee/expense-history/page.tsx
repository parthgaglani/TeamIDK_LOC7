'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsSearch,
  BsFilter,
  BsChevronDown,
  BsReceipt,
  BsDownload,
  BsCalendar3,
  BsExclamationTriangle,
  BsCheckCircle,
  BsXCircle,
  BsGraphUp,
} from 'react-icons/bs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Dropdown } from '@/app/components/ui/Dropdown';

// Sample data for spending analysis
const monthlySpending = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 1800 },
  { month: 'Mar', amount: 1400 },
  { month: 'Apr', amount: 2200 },
  { month: 'May', amount: 1600 },
  { month: 'Jun', amount: 1900 },
];

// Sample data for expense history
const expenseHistory = [
  {
    id: 1,
    date: '2024-03-15',
    merchant: 'Airline Company',
    category: 'Travel',
    amount: 850.00,
    status: 'pending',
    items: [
      { description: 'Flight Ticket', amount: 850.00 }
    ],
    violations: ['Amount exceeds limit'],
    comments: ['Please provide travel authorization'],
    receipt: 'receipt-001.pdf',
  },
  {
    id: 2,
    date: '2024-03-10',
    merchant: 'Office Supplies Co',
    category: 'Office',
    amount: 120.50,
    status: 'approved',
    items: [
      { description: 'Printer Paper', amount: 45.50 },
      { description: 'Ink Cartridges', amount: 75.00 }
    ],
    receipt: 'receipt-002.pdf',
  },
  {
    id: 3,
    date: '2024-03-05',
    merchant: 'Local Restaurant',
    category: 'Meals',
    amount: 250.00,
    status: 'rejected',
    items: [
      { description: 'Team Lunch', amount: 250.00 }
    ],
    violations: ['Missing receipt'],
    comments: ['Please upload the receipt'],
  },
];

// Define dropdown options
const periodOptions = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'this_year', label: 'This Year' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'travel', label: 'Travel' },
  { value: 'meals', label: 'Meals' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'software', label: 'Software' },
  { value: 'other', label: 'Other' },
];

export default function ExpenseHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedExpense, setExpandedExpense] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort expenses
  const filteredExpenses = expenseHistory
    .filter(expense => {
      const matchesSearch = expense.merchant.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || expense.status === selectedStatus.toLowerCase();
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <BsCheckCircle />;
      case 'rejected': return <BsXCircle />;
      default: return <BsCalendar3 />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Expense History</h1>
        <p className="text-gray-600">Track and manage your expense reports</p>
      </div>

      {/* Spending Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dropdown
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            placeholder="Select Period"
          />
          <Dropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="Select Status"
          />
          <Dropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Select Category"
          />
        </div>
      </motion.div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy('date')}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              sortBy === 'date'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-gray-300 text-gray-700'
            }`}
          >
            Date
          </button>
          <button
            onClick={() => setSortBy('amount')}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              sortBy === 'amount'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-gray-300 text-gray-700'
            }`}
          >
            Amount
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Expense Header */}
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedExpense(
                expandedExpense === expense.id ? null : expense.id
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(expense.status)}`}>
                    {getStatusIcon(expense.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {expense.merchant}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {expense.date} • {expense.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <BsChevronDown
                    className={`transform transition-transform ${
                      expandedExpense === expense.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedExpense === expense.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="border-t border-gray-200 p-6"
              >
                {/* Expense Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Expense Items</h4>
                  <div className="space-y-2">
                    {expense.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.description}</span>
                        <span className="text-gray-900">${item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policy Violations */}
                {expense.violations && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Policy Violations</h4>
                    <div className="space-y-2">
                      {expense.violations.map((violation, index) => (
                        <div key={index} className="flex items-center text-sm text-red-600">
                          <BsExclamationTriangle className="mr-2" />
                          {violation}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                {expense.comments && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
                    <div className="space-y-2">
                      {expense.comments.map((comment, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {comment}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-4">
                  {expense.receipt && (
                    <button className="flex items-center text-gray-600 hover:text-gray-900">
                      <BsReceipt className="mr-2" />
                      View Receipt
                    </button>
                  )}
                  <button className="flex items-center text-gray-600 hover:text-gray-900">
                    <BsDownload className="mr-2" />
                    Download PDF
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 