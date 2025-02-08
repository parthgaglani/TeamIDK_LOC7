'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsGraphUp,
  BsArrowUp,
  BsArrowDown,
  BsPeople,
  BsLightning,
  BsCalendar,
  BsBarChart,
  BsPieChart,
} from 'react-icons/bs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for charts
const departmentSpending = [
  { name: 'Sales', amount: 25000 },
  { name: 'Marketing', amount: 18000 },
  { name: 'Engineering', amount: 22000 },
  { name: 'HR', amount: 12000 },
  { name: 'Operations', amount: 15000 },
];

const categoryBreakdown = [
  { name: 'Travel', value: 35, color: '#3B82F6' },
  { name: 'Office Supplies', value: 20, color: '#10B981' },
  { name: 'Client Meetings', value: 25, color: '#6366F1' },
  { name: 'Training', value: 15, color: '#F59E0B' },
  { name: 'Others', value: 5, color: '#6B7280' },
];

const employeeSpending = [
  { name: 'John Doe', amount: 4500 },
  { name: 'Alice Smith', amount: 3800 },
  { name: 'Bob Wilson', amount: 4200 },
  { name: 'Emma Davis', amount: 3200 },
  { name: 'Mike Johnson', amount: 3900 },
];

const savingsOpportunities = [
  {
    title: 'Bulk Office Supplies',
    description: 'Switch to bulk purchasing for common office supplies',
    potentialSavings: '$2,500/year',
    impact: 'high',
  },
  {
    title: 'Travel Booking',
    description: 'Book flights 3 weeks in advance',
    potentialSavings: '$4,000/year',
    impact: 'high',
  },
  {
    title: 'Virtual Meetings',
    description: 'Increase virtual meetings by 30%',
    potentialSavings: '$3,000/year',
    impact: 'medium',
  },
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Trends</h1>
        <p className="text-gray-600">Track spending patterns and identify cost-saving opportunities</p>
      </div>

      {/* Period Selector */}
      <div className="mb-8">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
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
              <p className="text-sm font-medium text-gray-600">Total Spend</p>
              <p className="text-2xl font-bold text-blue-600">$92,000</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BsGraphUp className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <BsArrowUp className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">8.2%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
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
              <p className="text-sm font-medium text-gray-600">Avg. per Employee</p>
              <p className="text-2xl font-bold text-indigo-600">$3,900</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <BsPeople className="text-indigo-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <BsArrowDown className="text-red-500 mr-1" />
            <span className="text-red-500 font-medium">2.5%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
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
              <p className="text-sm font-medium text-gray-600">Potential Savings</p>
              <p className="text-2xl font-bold text-green-600">$9,500</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BsLightning className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-500">Annually</span>
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
              <p className="text-sm font-medium text-gray-600">Reports</p>
              <p className="text-2xl font-bold text-purple-600">156</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BsCalendar className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <BsArrowUp className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">12%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Department Spending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Department Spending</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentSpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Spenders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Spenders</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeSpending} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="amount" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cost Saving Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Cost Saving Opportunities</h2>
          <div className="space-y-4">
            {savingsOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${getImpactColor(opportunity.impact)}`}>
                    {opportunity.potentialSavings}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{opportunity.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 