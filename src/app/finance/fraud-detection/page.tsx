'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsExclamationTriangle,
  BsShieldCheck,
  BsArrowUp,
  BsArrowDown,
  BsEye,
  BsFlag,
  BsGraphUp,
  BsSearch,
  BsFilter,
  BsRobot,
  BsArrowRight,
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
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import { Dropdown } from '@/components/ui/Dropdown';

// Sample data for anomaly detection
const anomalyData = [
  { x: 100, y: 200, amount: 100, risk: 85, id: 'EXP001', employee: 'John Doe' },
  { x: 150, y: 300, amount: 150, risk: 45, id: 'EXP002', employee: 'Alice Smith' },
  { x: 400, y: 800, amount: 400, risk: 90, id: 'EXP003', employee: 'Bob Wilson' },
  { x: 200, y: 400, amount: 200, risk: 30, id: 'EXP004', employee: 'Emma Davis' },
  { x: 300, y: 900, amount: 300, risk: 95, id: 'EXP005', employee: 'Charlie Brown' },
];

const duplicateReceipts = [
  {
    id: 'DUP001',
    originalReport: 'EXP001',
    duplicateReport: 'EXP003',
    amount: '$850.00',
    employee: 'John Doe',
    date: '2024-03-20',
    similarity: 95,
    status: 'pending',
  },
  {
    id: 'DUP002',
    originalReport: 'EXP005',
    duplicateReport: 'EXP008',
    amount: '$450.00',
    employee: 'Alice Smith',
    date: '2024-03-19',
    similarity: 88,
    status: 'escalated',
  },
];

const outlierTransactions = [
  {
    id: 'OUT001',
    employee: 'Bob Wilson',
    amount: '$1,200.00',
    category: 'Travel',
    date: '2024-03-18',
    zScore: 3.5,
    reason: 'Amount significantly higher than average travel expense',
  },
  {
    id: 'OUT002',
    employee: 'Emma Davis',
    amount: '$800.00',
    category: 'Meals',
    date: '2024-03-17',
    zScore: 4.2,
    reason: 'Multiple high-value meals in single day',
  },
];

const periodOptions = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'this_year', label: 'This Year' },
];

export default function FraudDetectionPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#EF4444';
    if (score >= 60) return '#F59E0B';
    return '#10B981';
  };

  const handleEscalate = (id: string) => {
    // Handle escalation to management
    console.log('Escalating case:', id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Fraud Detection Panel</h1>
        <p className="text-gray-600">AI-powered fraud detection and risk analysis</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Cases</p>
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
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Duplicate Receipts</p>
              <p className="text-2xl font-bold text-yellow-600">5</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BsFlag className="text-yellow-600 text-xl" />
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
              <p className="text-sm font-medium text-gray-600">Outlier Transactions</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BsGraphUp className="text-orange-600 text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Anomaly Detection Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Expense Anomaly Detection</h2>
          <Dropdown
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            className="w-48"
          />
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="Amount" unit="$" />
              <YAxis type="number" dataKey="y" name="Frequency" />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                      <p className="font-medium">{data.employee}</p>
                      <p className="text-sm text-gray-600">Amount: ${data.amount}</p>
                      <p className="text-sm text-gray-600">Risk Score: {data.risk}%</p>
                    </div>
                  );
                }}
              />
              <Scatter data={anomalyData}>
                {anomalyData.map((entry, index) => (
                  <Cell key={index} fill={getRiskColor(entry.risk)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Duplicate Receipts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Duplicate Receipts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {duplicateReceipts.map((dup) => (
              <div key={dup.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {dup.employee}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {dup.date} • {dup.amount}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Reports: {dup.originalReport} & {dup.duplicateReport}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-orange-600">
                      {dup.similarity}% Match
                    </span>
                    <button
                      onClick={() => handleEscalate(dup.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <BsArrowUp className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Outlier Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Outlier Transactions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {outlierTransactions.map((trans) => (
              <div key={trans.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {trans.employee}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {trans.category} • {trans.amount} • {trans.date}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {trans.reason}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-red-600">
                      z-score: {trans.zScore}
                    </span>
                    <button
                      onClick={() => handleEscalate(trans.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <BsArrowUp className="text-xl" />
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