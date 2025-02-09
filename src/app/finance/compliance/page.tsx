'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsShieldCheck,
  BsExclamationTriangle,
  BsDownload,
  BsBarChart,
  BsClockHistory,
  BsSearch,
  BsFilter,
  BsFileEarmarkText,
  BsCheckCircle,
  BsXCircle,
  BsEye,
} from 'react-icons/bs';
import { Dropdown } from '@/app/components/ui/Dropdown';

interface PolicyViolation {
  id: string;
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'pending' | 'resolved' | 'waived';
  department: string;
  employee: string;
  date: string;
  reportId: string;
  impact: string;
  resolution?: {
    action: string;
    date: string;
    by: string;
    notes: string;
  };
}

interface ComplianceMetric {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  period: string;
}

const policyViolations: PolicyViolation[] = [
  {
    id: 'POL001',
    type: 'Over Budget',
    description: 'Department monthly expense limit exceeded by 25%',
    severity: 'high',
    status: 'pending',
    department: 'Sales',
    employee: 'John Doe',
    date: '2024-03-20',
    reportId: 'EXP001',
    impact: 'Budget Control',
  },
  {
    id: 'POL002',
    type: 'Missing Documentation',
    description: 'Required receipts not provided for expenses over $100',
    severity: 'medium',
    status: 'resolved',
    department: 'Marketing',
    employee: 'Alice Smith',
    date: '2024-03-19',
    reportId: 'EXP002',
    impact: 'Audit Compliance',
    resolution: {
      action: 'Documentation provided',
      date: '2024-03-20',
      by: 'Alice Smith',
      notes: 'All missing receipts have been uploaded',
    },
  },
  {
    id: 'POL003',
    type: 'Unauthorized Category',
    description: 'Expense category not approved for employee role',
    severity: 'medium',
    status: 'waived',
    department: 'Engineering',
    employee: 'Bob Wilson',
    date: '2024-03-18',
    reportId: 'EXP003',
    impact: 'Policy Compliance',
    resolution: {
      action: 'Exception granted',
      date: '2024-03-19',
      by: 'Finance Manager',
      notes: 'One-time exception approved due to project requirements',
    },
  },
];

const complianceMetrics: ComplianceMetric[] = [
  {
    id: 'COMP001',
    name: 'Policy Compliance Rate',
    value: 94.5,
    trend: 'up',
    change: 2.5,
    period: 'vs. last month',
  },
  {
    id: 'COMP002',
    name: 'Open Violations',
    value: 8,
    trend: 'down',
    change: 3,
    period: 'vs. last month',
  },
  {
    id: 'COMP003',
    name: 'Average Resolution Time',
    value: 2.5,
    trend: 'down',
    change: 0.5,
    period: 'days vs. last month',
  },
  {
    id: 'COMP004',
    name: 'Documentation Rate',
    value: 97.8,
    trend: 'up',
    change: 1.2,
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
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'waived', label: 'Waived' },
];

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
];

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
];

export default function CompliancePage() {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_week');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedViolation, setExpandedViolation] = useState<string | null>(null);

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
      case 'resolved':
        return 'text-green-600 bg-green-50';
      case 'waived':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
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
        <h1 className="text-2xl font-bold text-gray-900">Compliance & Policy Enforcement</h1>
        <p className="text-gray-600">Monitor policy compliance and manage violations</p>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {complianceMetrics.map((metric) => (
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
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                    {metric.name.includes('Rate') ? '%' : ''}
                  </p>
                  <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)} {metric.change}
                    {metric.name.includes('Rate') ? '%' : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{metric.period}</p>
              </div>
              <div className={`p-3 rounded-lg ${getSeverityColor(metric.trend === 'up' ? 'low' : 'high')}`}>
                <BsBarChart className="text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <button className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
          <BsFileEarmarkText className="text-blue-600" />
          <span className="text-sm font-medium text-gray-900">Generate Compliance Report</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
          <BsDownload className="text-blue-600" />
          <span className="text-sm font-medium text-gray-900">Export Audit Data</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
          <BsShieldCheck className="text-blue-600" />
          <span className="text-sm font-medium text-gray-900">Run Policy Check</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search violations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 
                       rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent"
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
            options={departmentOptions}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            placeholder="Department"
          />
          <Dropdown
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            placeholder="Time Period"
          />
        </div>
      </motion.div>

      {/* Policy Violations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Policy Violations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {policyViolations.map((violation) => (
            <div
              key={violation.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setExpandedViolation(expandedViolation === violation.id ? null : violation.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getSeverityColor(violation.severity)}`}>
                    <BsExclamationTriangle className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{violation.type}</h3>
                    <p className="text-sm text-gray-500">{violation.description}</p>
                    <div className="mt-1 flex items-center space-x-4">
                      <span className="text-xs text-gray-500">
                        {violation.department} • {violation.employee}
                      </span>
                      <span className="text-xs text-gray-500">
                        Report: {violation.reportId}
                      </span>
                      <span className="text-xs text-gray-500">
                        Date: {violation.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(violation.status)}`}>
                    {violation.status.charAt(0).toUpperCase() + violation.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                    {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                  </span>
                </div>
              </div>

              {expandedViolation === violation.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pl-12"
                >
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    {/* Impact Information */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Impact Area</p>
                      <div className="bg-white p-2 rounded-lg">
                        <p className="text-sm text-gray-600">{violation.impact}</p>
                      </div>
                    </div>

                    {/* Resolution Information */}
                    {violation.resolution && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Resolution</p>
                        <div className="bg-white p-3 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Action Taken:</span>
                            <span className="text-sm font-medium text-gray-900">{violation.resolution.action}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Resolved By:</span>
                            <span className="text-sm font-medium text-gray-900">{violation.resolution.by}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Resolution Date:</span>
                            <span className="text-sm font-medium text-gray-900">{violation.resolution.date}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Notes:</span>
                            <p className="text-sm text-gray-900 mt-1">{violation.resolution.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 mt-4">
                      <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <BsEye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      {violation.status === 'pending' && (
                        <>
                          <button className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <BsXCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors">
                            <BsCheckCircle className="w-4 h-4" />
                            <span>Resolve</span>
                          </button>
                        </>
                      )}
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