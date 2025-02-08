'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsExclamationTriangle,
  BsShieldCheck,
  BsGraphUp,
  BsSearch,
  BsFilter,
  BsEye,
  BsArrowRight,
  BsFlag,
  BsDownload,
  BsBarChart,
  BsClockHistory,
} from 'react-icons/bs';
import { Dropdown } from '@/components/ui/Dropdown';

interface FraudAlert {
  id: string;
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'investigating' | 'resolved';
  detectedAt: string;
  reports: string[];
  aiConfidence: number;
  riskFactors: string[];
  evidence: {
    type: string;
    description: string;
    link?: string;
  }[];
}

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  period: string;
}

const fraudAlerts: FraudAlert[] = [
  {
    id: 'FRAUD001',
    type: 'Duplicate Receipt',
    description: 'Multiple expense claims with identical receipt images detected',
    severity: 'high',
    status: 'new',
    detectedAt: '2024-03-20T10:30:00Z',
    reports: ['EXP001', 'EXP003'],
    aiConfidence: 98,
    riskFactors: [
      'Identical receipt amounts',
      'Same vendor',
      'Submissions within 48 hours',
    ],
    evidence: [
      {
        type: 'Image Analysis',
        description: 'Receipt images show 98% similarity score',
        link: 'receipt-comparison.pdf',
      },
      {
        type: 'Transaction Data',
        description: 'Same amount ($458.50) claimed in both reports',
      },
    ],
  },
  {
    id: 'FRAUD002',
    type: 'Unusual Spending Pattern',
    description: 'Significant increase in entertainment expenses for department',
    severity: 'medium',
    status: 'investigating',
    detectedAt: '2024-03-19T15:45:00Z',
    reports: ['EXP005', 'EXP006', 'EXP007'],
    aiConfidence: 85,
    riskFactors: [
      '150% increase from monthly average',
      'Multiple high-value claims',
      'Weekend transactions',
    ],
    evidence: [
      {
        type: 'Trend Analysis',
        description: 'Monthly spending trend shows unusual spike',
        link: 'trend-analysis.pdf',
      },
    ],
  },
  {
    id: 'FRAUD003',
    type: 'Split Transaction',
    description: 'Large purchase potentially split to bypass approval threshold',
    severity: 'high',
    status: 'new',
    detectedAt: '2024-03-18T09:15:00Z',
    reports: ['EXP008', 'EXP009'],
    aiConfidence: 92,
    riskFactors: [
      'Sequential transactions',
      'Same vendor',
      'Total exceeds approval limit',
    ],
    evidence: [
      {
        type: 'Transaction Analysis',
        description: 'Two payments of $2,400 and $2,600 to same vendor within 1 hour',
      },
      {
        type: 'Policy Check',
        description: 'Combined amount ($5,000) exceeds single transaction limit of $3,000',
      },
    ],
  },
];

const riskMetrics: RiskMetric[] = [
  {
    id: 'RISK001',
    name: 'Duplicate Claims',
    value: 2.5,
    trend: 'up',
    change: 0.5,
    period: 'vs. last month',
  },
  {
    id: 'RISK002',
    name: 'Policy Violations',
    value: 8.2,
    trend: 'down',
    change: 1.2,
    period: 'vs. last month',
  },
  {
    id: 'RISK003',
    name: 'High-Risk Transactions',
    value: 4.8,
    trend: 'stable',
    change: 0.1,
    period: 'vs. last month',
  },
  {
    id: 'RISK004',
    name: 'Average Risk Score',
    value: 42,
    trend: 'down',
    change: 3,
    period: 'vs. last month',
  },
];

const severityOptions = [
  { value: 'all', label: 'All Severities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'investigating', label: 'Investigating' },
  { value: 'resolved', label: 'Resolved' },
];

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
];

export default function FraudDetection() {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_week');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

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
      case 'new':
        return 'text-red-600 bg-red-50';
      case 'investigating':
        return 'text-yellow-600 bg-yellow-50';
      case 'resolved':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-red-600';
      case 'down':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Fraud & Anomaly Detection</h1>
        <p className="text-gray-600">AI-powered fraud detection and risk analysis dashboard</p>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {riskMetrics.map((metric) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}%</p>
                  <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)} {metric.change}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{metric.period}</p>
              </div>
              <div className={`p-3 rounded-lg ${getSeverityColor(metric.trend === 'up' ? 'high' : 'low')}`}>
                <BsBarChart className="text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <BsSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <Dropdown
            options={severityOptions}
            value={selectedSeverity}
            onChange={setSelectedSeverity}
            placeholder="Severity"
          />
          <Dropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="Status"
          />
          <Dropdown
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            placeholder="Time Period"
          />
        </div>
      </motion.div>

      {/* Fraud Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Fraud Alerts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {fraudAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <BsExclamationTriangle className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{alert.type}</h3>
                    <p className="text-sm text-gray-500">{alert.description}</p>
                    <div className="mt-1 flex items-center space-x-4">
                      <span className="text-xs text-gray-500">
                        Detected: {new Date(alert.detectedAt).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Reports: {alert.reports.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                </div>
              </div>

              {expandedAlert === alert.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pl-12"
                >
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    {/* AI Confidence */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BsShieldCheck className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">
                          AI Confidence Score: {alert.aiConfidence}%
                        </span>
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Risk Factors:</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.riskFactors.map((factor, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Evidence */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Evidence:</p>
                      <div className="space-y-2">
                        {alert.evidence.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-2 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.type}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            {item.link && (
                              <button className="text-blue-600 hover:text-blue-800">
                                <BsDownload className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 mt-4">
                      <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <BsEye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                        <BsFlag className="w-4 h-4" />
                        <span>Flag for Review</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                        <BsClockHistory className="w-4 h-4" />
                        <span>Start Investigation</span>
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