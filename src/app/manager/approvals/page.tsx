'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsSearch,
  BsFilter,
  BsCheckCircle,
  BsXCircle,
  BsClockHistory,
  BsExclamationTriangle,
  BsChat,
  BsRobot,
  BsReceipt,
  BsArrowRight,
} from 'react-icons/bs';

interface ExpenseReport {
  id: string;
  employee: string;
  department: string;
  date: string;
  amount: string;
  category: string;
  status: 'pending' | 'flagged';
  items: Array<{ description: string; amount: string }>;
  aiSuggestions: string[];
  riskScore: number;
  receipts: number;
}

const sampleReports: ExpenseReport[] = [
  {
    id: 'EXP001',
    employee: 'John Doe',
    department: 'Sales',
    date: '2024-03-20',
    amount: '$850.00',
    category: 'Travel',
    status: 'flagged',
    items: [
      { description: 'Flight Ticket', amount: '$500.00' },
      { description: 'Hotel Stay', amount: '$300.00' },
      { description: 'Taxi Fare', amount: '$50.00' },
    ],
    aiSuggestions: [
      'Flight ticket price is 30% above average for this route',
      'Hotel stay overlaps with weekend',
    ],
    riskScore: 85,
    receipts: 3,
  },
  {
    id: 'EXP002',
    employee: 'Alice Smith',
    department: 'Marketing',
    date: '2024-03-19',
    amount: '$220.50',
    category: 'Office Supplies',
    status: 'pending',
    items: [
      { description: 'Printer Cartridges', amount: '$150.00' },
      { description: 'Paper Supplies', amount: '$70.50' },
    ],
    aiSuggestions: [],
    riskScore: 25,
    receipts: 2,
  },
  {
    id: 'EXP003',
    employee: 'Bob Wilson',
    department: 'Engineering',
    date: '2024-03-18',
    amount: '$450.00',
    category: 'Client Meeting',
    status: 'flagged',
    items: [
      { description: 'Restaurant Bill', amount: '$400.00' },
      { description: 'Parking', amount: '$50.00' },
    ],
    aiSuggestions: [
      'Meal expense exceeds per-person limit',
      'Missing attendee list',
    ],
    riskScore: 75,
    receipts: 2,
  },
];

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'flagged': return <BsExclamationTriangle />;
      case 'pending': return <BsClockHistory />;
      default: return <BsCheckCircle />;
    }
  };

  const handleApprove = (id: string) => {
    // Handle approval logic
    console.log('Approving report:', id);
  };

  const handleReject = (id: string) => {
    // Handle rejection logic
    console.log('Rejecting report:', id);
  };

  const handleRequestChanges = (id: string) => {
    // Handle change request logic
    console.log('Requesting changes for report:', id, 'Comment:', comment);
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Approval Workflow</h1>
        <p className="text-gray-600">Review and approve expense reports</p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by employee or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <BsSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Departments</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>Engineering</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Categories</option>
            <option>Travel</option>
            <option>Office Supplies</option>
            <option>Client Meeting</option>
          </select>
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Expense Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sampleReports.map((report) => (
            <div key={report.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {report.employee} - {report.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {report.department} • {report.category} • {report.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">
                    {report.amount}
                  </span>
                  {report.status === 'flagged' && (
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor('flagged')}`}>
                      Risk: {report.riskScore}%
                    </span>
                  )}
                  <button
                    onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <BsArrowRight className={`transform transition-transform ${
                      expandedReport === report.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                </div>
              </div>

              {/* Expanded View */}
              {expandedReport === report.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pl-12"
                >
                  <div className="border-l-2 border-gray-200 pl-4 space-y-4">
                    {/* Expense Items */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Expense Items
                      </h4>
                      <div className="space-y-2">
                        {report.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.description}</span>
                            <span className="text-gray-900">{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    {report.aiSuggestions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          AI Suggestions
                        </h4>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <BsRobot className="text-blue-600 mt-1" />
                            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                              {report.aiSuggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comment Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Add Comment
                      </h4>
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Enter your comment..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleRequestChanges(report.id)}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-4">
                      <button
                        onClick={() => handleReject(report.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(report.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 