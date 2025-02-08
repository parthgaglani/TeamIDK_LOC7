'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsExclamationTriangle,
  BsShieldCheck,
  BsDownload,
  BsFileEarmarkPdf,
  BsFileEarmarkExcel,
  BsFilter,
  BsCalendar,
  BsPrinter,
  BsBuilding,
  BsFlag,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Dropdown } from '@/components/ui/Dropdown';

// Sample data for charts
const violationsByDepartment = [
  { department: 'Sales', count: 25 },
  { department: 'Marketing', count: 18 },
  { department: 'Engineering', count: 15 },
  { department: 'Finance', count: 8 },
  { department: 'HR', count: 5 },
];

const violationsByType = [
  { name: 'Over Budget', value: 35, color: '#EF4444' },
  { name: 'Missing Receipt', value: 25, color: '#F59E0B' },
  { name: 'Late Submission', value: 20, color: '#3B82F6' },
  { name: 'Wrong Category', value: 15, color: '#10B981' },
  { name: 'Duplicate Claim', value: 5, color: '#6366F1' },
];

const recentViolations = [
  {
    id: 'VIO001',
    employee: 'John Doe',
    department: 'Sales',
    date: '2024-03-20',
    type: 'Over Budget',
    description: 'Travel expense exceeds department limit by $350',
    severity: 'high',
  },
  {
    id: 'VIO002',
    employee: 'Alice Smith',
    department: 'Marketing',
    date: '2024-03-19',
    type: 'Missing Receipt',
    description: 'No receipt attached for meal expense',
    severity: 'medium',
  },
  {
    id: 'VIO003',
    employee: 'Bob Wilson',
    department: 'Engineering',
    date: '2024-03-18',
    type: 'Late Submission',
    description: 'Expense report submitted after 30-day deadline',
    severity: 'low',
  },
];

// Add dropdown options
const periodOptions = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'this_year', label: 'This Year' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'compliant', label: 'Compliant' },
  { value: 'non_compliant', label: 'Non-Compliant' },
  { value: 'pending', label: 'Pending Review' },
];

export default function CompliancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const handleGeneratePDF = () => {
    // Handle PDF generation
    console.log('Generating PDF report');
  };

  const handleGenerateExcel = () => {
    // Handle Excel generation
    console.log('Generating Excel report');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Report</h1>
        <p className="text-gray-600">Track policy violations and generate compliance reports</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Violations</p>
              <p className="text-2xl font-bold text-red-600">71</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <BsExclamationTriangle className="text-red-600 text-xl" />
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
              <p className="text-sm font-medium text-gray-600">High Severity</p>
              <p className="text-2xl font-bold text-orange-600">15</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BsFlag className="text-orange-600 text-xl" />
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
              <p className="text-sm font-medium text-gray-600">Departments Affected</p>
              <p className="text-2xl font-bold text-blue-600">5</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BsBuilding className="text-blue-600 text-xl" />
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
              <p className="text-2xl font-bold text-green-600">85%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BsShieldCheck className="text-green-600 text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Export */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Departments</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>Engineering</option>
            <option>Finance</option>
            <option>HR</option>
          </select>

          <button
            onClick={handleGeneratePDF}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <BsFileEarmarkPdf />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleGenerateExcel}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <BsFileEarmarkExcel />
            <span>Export Excel</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Violations by Department */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Violations by Department
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationsByDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Violations by Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Violations by Type
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationsByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {violationsByType.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Violations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Violations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentViolations.map((violation) => (
            <div key={violation.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {violation.employee} - {violation.department}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {violation.type} • {violation.date}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {violation.description}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(violation.severity)}`}>
                    {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 