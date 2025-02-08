'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsSpeedometer2,
  BsReceipt,
  BsClockHistory,
  BsCheckCircle,
  BsXCircle,
  BsExclamationTriangle,
  BsGraphUp,
  BsBell,
  BsArrowUp,
  BsArrowDown,
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
} from 'recharts';

// Sample data for spending trends
const spendingTrends = [
  { month: 'Jan', amount: 1200, lastYear: 1000 },
  { month: 'Feb', amount: 1800, lastYear: 1500 },
  { month: 'Mar', amount: 1400, lastYear: 1600 },
  { month: 'Apr', amount: 2200, lastYear: 1800 },
  { month: 'May', amount: 1600, lastYear: 1400 },
  { month: 'Jun', amount: 1900, lastYear: 1700 },
];

// Sample data for recent expenses
const recentExpenses = [
  {
    id: 1,
    date: '2024-03-15',
    merchant: 'Airline Company',
    category: 'Travel',
    amount: 850.00,
    status: 'pending',
    violations: ['Amount exceeds limit'],
  },
  {
    id: 2,
    date: '2024-03-10',
    merchant: 'Office Supplies Co',
    category: 'Office',
    amount: 120.50,
    status: 'approved',
  },
  {
    id: 3,
    date: '2024-03-05',
    merchant: 'Local Restaurant',
    category: 'Meals',
    amount: 250.00,
    status: 'rejected',
    violations: ['Missing receipt'],
  },
];

// Sample notifications
const notifications = [
  {
    id: 1,
    type: 'violation',
    message: 'Travel expense exceeds policy limit by $350',
    expense: 'Flight Ticket - Airline Company',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'action',
    message: 'Missing receipt for team lunch expense',
    expense: 'Team Lunch - Local Restaurant',
    time: '1 day ago',
  },
  {
    id: 3,
    type: 'approval',
    message: 'Office supplies expense approved',
    expense: 'Office Supplies Co',
    time: '2 days ago',
  },
];

export function DashboardClient() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'violation': return <BsExclamationTriangle className="text-red-500" />;
      case 'action': return <BsBell className="text-yellow-500" />;
      case 'approval': return <BsCheckCircle className="text-green-500" />;
      default: return <BsBell className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your expense reports and spending</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
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
              <p className="text-sm font-medium text-gray-600">Approved This Month</p>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BsCheckCircle className="text-green-600 text-xl" />
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
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-blue-600">$2,450</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BsGraphUp className="text-blue-600 text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Spending Trends</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="This Year"
                />
                <Line
                  type="monotone"
                  dataKey="lastYear"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  name="Last Year"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start space-x-4"
              >
                <div className="p-2 rounded-lg bg-gray-50">
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {notification.expense}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(expense.status)}`}>
                    {getStatusIcon(expense.status)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {expense.merchant}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {expense.date} • {expense.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </span>
                  {expense.violations && (
                    <div className="flex items-center text-red-600">
                      <BsExclamationTriangle className="mr-1" />
                      <span className="text-sm">
                        {expense.violations.length} violation
                        {expense.violations.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 