'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsFilter,
  BsSearch,
  BsCheckCircle,
  BsXCircle,
  BsClockHistory,
  BsExclamationTriangle,
  BsEye,
  BsDownload,
  BsChat,
  BsArrowUp,
  BsArrowDown,
  BsRobot,
} from 'react-icons/bs';
import { Dropdown } from '@/components/ui/Dropdown';

interface ExpenseReport {
  id: string;
  employee: string;
  department: string;
  date: string;
  amount: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  riskScore: number;
  aiJustification: string;
  violations: string[];
}

const sampleReports: ExpenseReport[] = [
  {
    id: 'EXP001',
    employee: 'John Doe',
    department: 'Sales',
    date: '2024-03-20',
    amount: '$850.00',
    category: 'Travel',
    status: 'pending',
    riskScore: 85,
    aiJustification: 'Flight ticket prices are within market range for the route, but exceed department limit.',
    violations: ['Amount exceeds limit'],
  },
  {
    id: 'EXP002',
    employee: 'Alice Smith',
    department: 'Marketing',
    date: '2024-03-19',
    amount: '$120.50',
    category: 'Office Supplies',
    status: 'approved',
    riskScore: 25,
    aiJustification: 'Regular office supply purchase with standard items and quantities.',
    violations: [],
  },
  {
    id: 'EXP003',
    employee: 'Bob Wilson',
    department: 'Engineering',
    date: '2024-03-18',
    amount: '$250.00',
    category: 'Meals',
    status: 'rejected',
    riskScore: 75,
    aiJustification: 'Multiple meal expenses on the same day without attendee list.',
    violations: ['Missing justification', 'Duplicate claim suspected'],
  },
];

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'HR' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'travel', label: 'Travel' },
  { value: 'meals', label: 'Meals' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'software', label: 'Software' },
  { value: 'other', label: 'Other' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function ReviewExpensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedReport, setSelectedReport] = useState<ExpenseReport | null>(null);

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
      default: return <BsClockHistory />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const handleRequestInfo = (report: ExpenseReport) => {
    // Handle requesting additional information
    console.log('Requesting info for report:', report.id);
  };

  const handleApprove = (report: ExpenseReport) => {
    // Handle report approval
    console.log('Approving report:', report.id);
  };

  const handleReject = (report: ExpenseReport) => {
    // Handle report rejection
    console.log('Rejecting report:', report.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Review Expense Reports</h1>
        <p className="text-gray-600">Review and approve expense reports with AI assistance</p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="col-span-1 lg:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by employee or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 
                         rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent"
              />
              <BsSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div>
            <Dropdown
              options={departmentOptions}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Select Department"
            />
          </div>
          <div>
            <Dropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select Category"
            />
          </div>
          <div>
            <Dropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Select Status"
            />
          </div>
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
            <div
              key={report.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
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
                  <span className={`px-2 py-1 rounded-full text-sm ${getRiskColor(report.riskScore)}`}>
                    Risk: {report.riskScore}%
                  </span>
                  {report.violations.length > 0 && (
                    <div className="flex items-center text-red-600">
                      <BsExclamationTriangle className="mr-1" />
                      <span className="text-sm">{report.violations.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedReport?.id === report.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pl-12"
                >
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2 mb-4">
                      <BsRobot className="text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">AI Justification</p>
                        <p className="text-sm text-gray-600">{report.aiJustification}</p>
                      </div>
                    </div>

                    {report.violations.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-red-600 mb-2">Policy Violations:</p>
                        <ul className="list-disc list-inside text-sm text-red-600">
                          {report.violations.map((violation, index) => (
                            <li key={index}>{violation}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-4">
                      <button
                        onClick={() => handleRequestInfo(report)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <BsChat className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleReject(report)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <BsXCircle className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleApprove(report)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <BsCheckCircle className="text-xl" />
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