'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsExclamationTriangle,
  BsShieldCheck,
  BsClockHistory,
  BsCheckCircle,
  BsXCircle,
  BsGraphUp,
  BsFileText,
  BsEye,
  BsFlag,
  BsArrowUp,
  BsArrowDown,
  BsFilter,
} from 'react-icons/bs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Dropdown } from '@/components/ui/Dropdown';

// Sample data for charts
const fraudRiskTrend = [
  { month: 'Jan', score: 25 },
  { month: 'Feb', score: 32 },
  { month: 'Mar', score: 28 },
  { month: 'Apr', score: 45 },
  { month: 'May', score: 30 },
  { month: 'Jun', score: 35 },
];

const violationsByType = [
  { type: 'Over Budget', count: 15 },
  { type: 'Missing Receipt', count: 12 },
  { type: 'Duplicate Claim', count: 8 },
  { type: 'Wrong Category', count: 6 },
  { type: 'Late Submission', count: 4 },
];

const recentAlerts = [
  {
    id: 1,
    type: 'fraud',
    message: 'Duplicate receipt detected for travel expense',
    employee: 'John Doe',
    amount: '$850.00',
    time: '2 hours ago',
    riskScore: 85,
  },
  {
    id: 2,
    type: 'policy',
    message: 'Expense exceeds category limit by 50%',
    employee: 'Alice Smith',
    amount: '$450.00',
    time: '4 hours ago',
    riskScore: 65,
  },
  {
    id: 3,
    type: 'anomaly',
    message: 'Unusual spending pattern detected',
    employee: 'Bob Wilson',
    amount: '$1,200.00',
    time: '1 day ago',
    riskScore: 75,
  },
];

const periodOptions = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'this_year', label: 'This Year' },
];

export default function FinanceDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fraud':
        return <BsExclamationTriangle className="text-red-500" />;
      case 'policy':
        return <BsFlag className="text-yellow-500" />;
      case 'anomaly':
        return <BsGraphUp className="text-orange-500" />;
      default:
        return <BsExclamationTriangle className="text-gray-500" />;
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
        <p className="text-gray-600">Monitor expense reports, fraud alerts, and compliance</p>
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
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BsClockHistory className="text-blue-600 text-xl" />
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
              <p className="text-sm font-medium text-gray-600">High Risk Reports</p>
              <p className="text-2xl font-bold text-red-600">8</p>
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
              <p className="text-2xl font-bold text-yellow-600">15</p>
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
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-green-600">92%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BsShieldCheck className="text-green-600 text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Fraud Risk Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Fraud Risk Trend</h2>
            <Dropdown
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              className="w-48"
            />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fraudRiskTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Risk Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Policy Violations by Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Policy Violations by Type
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6">
                  {violationsByType.map((entry, index) => (
                    <Cell key={index} fill={index % 2 ? '#60A5FA' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-gray-50">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {alert.employee} • {alert.amount} • {alert.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${getRiskColor(alert.riskScore)}`}>
                    Risk: {alert.riskScore}%
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
  );
} 