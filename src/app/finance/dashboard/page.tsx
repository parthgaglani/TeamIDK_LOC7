'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsClipboardCheck,
  BsShieldCheck,
  BsExclamationTriangle,
  BsGraphUp,
  BsClock,
  BsArrowRight,
  BsFlag,
  BsFileEarmarkText,
  BsSearch,
  BsFilter,
  BsCheckCircle,
  BsBarChart,
  BsXCircle,
  BsEye,
  BsDownload,
  BsCalendar,
} from 'react-icons/bs';
import { Dropdown } from '@/app/components/ui/Dropdown';

// Sample data for demonstration
const pendingReports = [
  {
    id: 'EXP001',
    employee: 'John Doe',
    department: 'Sales',
    amount: '$850.00',
    date: '2024-03-20',
    status: 'flagged',
    riskScore: 85,
    policyViolations: ['Amount exceeds limit', 'Missing receipt'],
  },
  {
    id: 'EXP002',
    employee: 'Alice Smith',
    department: 'Marketing',
    amount: '$220.50',
    date: '2024-03-19',
    status: 'pending',
    riskScore: 25,
    policyViolations: [],
  },
];

const fraudAlerts = [
  {
    id: 'ALERT001',
    type: 'Duplicate Receipt',
    description: 'Same receipt submitted twice in different reports',
    severity: 'high',
    reports: ['EXP001', 'EXP003'],
    aiConfidence: '95%',
  },
  {
    id: 'ALERT002',
    type: 'Unusual Amount',
    description: 'Amount significantly higher than average for category',
    severity: 'medium',
    reports: ['EXP002'],
    aiConfidence: '85%',
  },
];

const policyViolations = [
  {
    id: 'POL001',
    type: 'Over Budget',
    description: 'Department monthly limit exceeded',
    department: 'Sales',
    impact: 'High',
    status: 'pending',
  },
  {
    id: 'POL002',
    type: 'Unauthorized Category',
    description: 'Expense category not approved for role',
    department: 'Marketing',
    impact: 'Medium',
    status: 'pending',
  },
];

const highRiskTransactions = [
  {
    id: 'RISK001',
    amount: '$1,200.00',
    category: 'Travel',
    employee: 'Bob Wilson',
    riskFactors: ['Unusual amount', 'Weekend transaction'],
    score: 92,
  },
  {
    id: 'RISK002',
    amount: '$750.00',
    category: 'Entertainment',
    employee: 'Carol Brown',
    riskFactors: ['Non-standard vendor', 'Multiple submissions'],
    score: 78,
  },
];

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
];

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
];

export default function FinanceDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview of expense reports, fraud alerts, and compliance</p>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white p-4 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports, employees..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <BsSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Dropdown
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              placeholder="Select Period"
            />
            <Dropdown
              options={departmentOptions}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Select Department"
            />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-xs text-gray-500 mt-1">4 high priority</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BsClipboardCheck className="text-blue-600 text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fraud Alerts</p>
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-xs text-gray-500 mt-1">2 require immediate action</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <BsExclamationTriangle className="text-red-600 text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Policy Violations</p>
              <p className="text-2xl font-bold text-yellow-600">5</p>
              <p className="text-xs text-gray-500 mt-1">+2 from last week</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BsFlag className="text-yellow-600 text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-green-600">94%</p>
              <p className="text-xs text-gray-500 mt-1">+5% this month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BsShieldCheck className="text-green-600 text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {report.employee} - {report.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {report.department} • {report.date}
                    </p>
                    {report.policyViolations.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {report.policyViolations.map((violation, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            {violation}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">
                      {report.amount}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <BsArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fraud Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Fraud Alerts</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{alert.type}</h3>
                    <p className="text-sm text-gray-500">{alert.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <BsShieldCheck className="text-blue-500" />
                        <span className="text-xs text-gray-500">AI Confidence: {alert.aiConfidence}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Reports:</span>
                        {alert.reports.map((reportId) => (
                          <span key={reportId} className="text-xs font-medium text-blue-600">
                            {reportId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <BsEye />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Policy Violations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Policy Violations</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {policyViolations.map((violation) => (
              <div key={violation.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{violation.type}</h3>
                    <p className="text-sm text-gray-500">{violation.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Department: {violation.department}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.impact.toLowerCase())}`}>
                      {violation.impact}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <BsEye />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* High Risk Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">High Risk Transactions</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {highRiskTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {transaction.employee} - {transaction.amount}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {transaction.category}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {transaction.riskFactors.map((factor, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(transaction.score)}`}>
                      Risk: {transaction.score}%
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <BsEye />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 