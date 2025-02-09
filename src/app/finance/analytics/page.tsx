'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsBarChart,
  BsGraphUp,
  BsLightbulb,
  BsArrowDown,
  BsArrowUp,
  BsCalendar,
  BsDownload,
  BsFilter,
  BsSearch,
  BsBuilding,
  BsTag,
  BsCurrencyDollar,
} from 'react-icons/bs';
import { Dropdown } from '@/app/components/ui/Dropdown';

interface SpendingTrend {
  id: string;
  department: string;
  currentSpend: number;
  previousSpend: number;
  change: number;
  trend: 'up' | 'down';
  categories: {
    name: string;
    amount: number;
    change: number;
  }[];
}

interface CostSaving {
  id: string;
  title: string;
  description: string;
  impact: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  categories: string[];
  aiConfidence: number;
}

interface TopExpense {
  id: string;
  category: string;
  amount: number;
  change: number;
  trend: 'up' | 'down';
  department: string;
  details: string;
}

const spendingTrends: SpendingTrend[] = [
  {
    id: 'TREND001',
    department: 'Sales',
    currentSpend: 45000,
    previousSpend: 38000,
    change: 18.4,
    trend: 'up',
    categories: [
      { name: 'Travel', amount: 20000, change: 25 },
      { name: 'Entertainment', amount: 15000, change: 15 },
      { name: 'Office Supplies', amount: 10000, change: -5 },
    ],
  },
  {
    id: 'TREND002',
    department: 'Marketing',
    currentSpend: 32000,
    previousSpend: 35000,
    change: -8.6,
    trend: 'down',
    categories: [
      { name: 'Advertising', amount: 18000, change: -12 },
      { name: 'Events', amount: 8000, change: -5 },
      { name: 'Software', amount: 6000, change: 8 },
    ],
  },
  {
    id: 'TREND003',
    department: 'Engineering',
    currentSpend: 28000,
    previousSpend: 25000,
    change: 12,
    trend: 'up',
    categories: [
      { name: 'Software', amount: 15000, change: 20 },
      { name: 'Hardware', amount: 8000, change: 5 },
      { name: 'Training', amount: 5000, change: -10 },
    ],
  },
];

const costSavings: CostSaving[] = [
  {
    id: 'SAVE001',
    title: 'Consolidate Software Licenses',
    description: 'Multiple departments are using different tools for the same purpose. Consolidating licenses could reduce costs.',
    impact: 15000,
    difficulty: 'medium',
    timeframe: '3 months',
    categories: ['Software', 'Subscriptions'],
    aiConfidence: 92,
  },
  {
    id: 'SAVE002',
    title: 'Optimize Travel Bookings',
    description: 'Implementing advance booking policy and preferred vendor agreements could reduce travel costs.',
    impact: 25000,
    difficulty: 'easy',
    timeframe: '1 month',
    categories: ['Travel', 'Transportation'],
    aiConfidence: 88,
  },
  {
    id: 'SAVE003',
    title: 'Reduce Office Supply Waste',
    description: 'Analysis shows high volume of unused supplies. Implementing inventory management could reduce waste.',
    impact: 8000,
    difficulty: 'easy',
    timeframe: '2 months',
    categories: ['Office Supplies', 'Operations'],
    aiConfidence: 95,
  },
];

const topExpenses: TopExpense[] = [
  {
    id: 'EXP001',
    category: 'Travel',
    amount: 45000,
    change: 15,
    trend: 'up',
    department: 'Sales',
    details: 'Increased client visits and conference attendance',
  },
  {
    id: 'EXP002',
    category: 'Software',
    amount: 35000,
    change: 8,
    trend: 'up',
    department: 'Engineering',
    details: 'New development tools and cloud services',
  },
  {
    id: 'EXP003',
    category: 'Marketing',
    amount: 30000,
    change: -12,
    trend: 'down',
    department: 'Marketing',
    details: 'Shift from traditional to digital marketing',
  },
];

const periodOptions = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'last_quarter', label: 'Last Quarter' },
  { value: 'this_year', label: 'This Year' },
];

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'travel', label: 'Travel' },
  { value: 'software', label: 'Software' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'marketing', label: 'Marketing' },
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTrend, setExpandedTrend] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-red-600' : 'text-green-600';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <BsArrowUp /> : <BsArrowDown />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Spending Insights</h1>
        <p className="text-gray-600">Track spending patterns and discover cost-saving opportunities</p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            placeholder="Department"
          />
          <Dropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Category"
          />
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <BsDownload className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </motion.div>

      {/* Department Spending Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm mb-8"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Department Spending Trends</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {spendingTrends.map((trend) => (
            <div
              key={trend.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setExpandedTrend(expandedTrend === trend.id ? null : trend.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BsBuilding className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{trend.department}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        Current: {formatCurrency(trend.currentSpend)}
                      </span>
                      <span className={`flex items-center text-sm ${getTrendColor(trend.trend)}`}>
                        {getTrendIcon(trend.trend)}
                        {trend.change}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {expandedTrend === trend.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pl-12"
                >
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Top Categories</p>
                      <div className="space-y-2">
                        {trend.categories.map((category, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-3 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <BsTag className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {category.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-900">
                                {formatCurrency(category.amount)}
                              </span>
                              <span
                                className={`text-sm ${
                                  category.change > 0 ? 'text-red-600' : 'text-green-600'
                                }`}
                              >
                                {category.change > 0 ? '+' : ''}
                                {category.change}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cost-Saving Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm mb-8"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">AI-Powered Cost-Saving Recommendations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {costSavings.map((saving) => (
            <div key={saving.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <BsLightbulb className="text-yellow-600 text-xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{saving.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{saving.description}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(saving.impact)} potential savings
                    </span>
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(saving.difficulty)}`}>
                      {saving.difficulty.charAt(0).toUpperCase() + saving.difficulty.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Implementation: {saving.timeframe}
                    </span>
                    <span className="text-xs text-gray-500">
                      AI Confidence: {saving.aiConfidence}%
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {saving.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Expenses</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {topExpenses.map((expense) => (
            <div key={expense.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <BsCurrencyDollar className="text-gray-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{expense.category}</h3>
                    <p className="text-sm text-gray-500">{expense.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Department: {expense.department}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                  <span className={`text-sm ${getTrendColor(expense.trend)}`}>
                    {expense.change > 0 ? '+' : ''}
                    {expense.change}%
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