'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsClockHistory,
  BsExclamationTriangle,
  BsCheckCircle,
  BsXCircle,
  BsGraphUp,
  BsArrowUp,
  BsArrowDown,
  BsEye,
  BsChat,
  BsRobot,
} from 'react-icons/bs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Dropdown } from '@/components/ui/Dropdown';

// Sample data for charts
const monthlySpending = [
  { month: 'Jan', amount: 12500, limit: 15000 },
  { month: 'Feb', amount: 14200, limit: 15000 },
  { month: 'Mar', amount: 11800, limit: 15000 },
  { month: 'Apr', amount: 13900, limit: 15000 },
  { month: 'May', amount: 15600, limit: 15000 },
  { month: 'Jun', amount: 13200, limit: 15000 },
];

const pendingApprovals = [
  {
    id: 'EXP001',
    employee: 'John Doe',
    amount: '$850.00',
    date: '2024-03-20',
    category: 'Travel',
    status: 'flagged',
    riskScore: 85,
    aiWarning: 'Amount exceeds usual travel expense pattern',
  },
  {
    id: 'EXP002',
    employee: 'Alice Smith',
    amount: '$220.50',
    date: '2024-03-19',
    category: 'Office Supplies',
    status: 'pending',
    riskScore: 25,
    aiWarning: null,
  },
  {
    id: 'EXP003',
    employee: 'Bob Wilson',
    amount: '$450.00',
    date: '2024-03-18',
    category: 'Client Meeting',
    status: 'flagged',
    riskScore: 75,
    aiWarning: 'Missing attendee list for client meeting',
  },
];

// Add period options
const periodOptions = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'this_year', label: 'This Year' },
];

export default function ManagerDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600">Monitor and approve expense reports</p>
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
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-yellow-600">12</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BsClockHistory className="text-yellow-600 text-xl" />
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
              <p className="text-sm font-medium text-gray-600">Flagged Reports</p>
              <p className="text-2xl font-bold text-red-600">3</p>
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
              <p className="text-sm font-medium text-gray-600">Monthly Spend</p>
              <p className="text-2xl font-bold text-blue-600">$15.6K</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BsGraphUp className="text-blue-600 text-xl" />
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
              <p className="text-sm font-medium text-gray-600">Budget Status</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-green-600">96%</p>
                <BsArrowDown className="ml-2 text-green-600" />
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BsCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Monthly Spending Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Spending</h2>
          <Dropdown
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            className="w-48"
          />
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Actual Spend"
              />
              <Line
                type="monotone"
                dataKey="limit"
                stroke="#E5E7EB"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Budget Limit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pending Approvals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingApprovals.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                      {report.category} • {report.amount} • {report.date}
                    </p>
                    {report.aiWarning && (
                      <div className="flex items-center mt-1 text-red-600">
                        <BsRobot className="mr-1" />
                        <p className="text-xs">{report.aiWarning}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {report.status === 'flagged' && (
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor('flagged')}`}>
                      Risk: {report.riskScore}%
                    </span>
                  )}
                  <button className="text-blue-600 hover:text-blue-800">
                    <BsEye className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 