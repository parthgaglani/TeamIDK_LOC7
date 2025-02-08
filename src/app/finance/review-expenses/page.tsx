'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BsFilter,
  BsSearch,
  BsCheckCircle,
  BsXCircle,
  BsClockHistory,
  BsExclamationTriangle,
  BsEye,
  BsDownload,
  BsChat,
  BsArrowUp,
  BsArrowDown,
  BsRobot,
  BsFlag,
} from 'react-icons/bs';
import { Dropdown } from '@/components/ui/Dropdown';

interface ExpenseReport {
  id: string;
  employee: string;
  department: string;
  date: string;
  amount: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  riskScore: number;
  aiJustification: string;
  policyViolations: string[];
  items: {
    description: string;
    amount: string;
    category: string;
    receipt?: string;
    notes?: string;
  }[];
}

const sampleReports: ExpenseReport[] = [
  {
    id: 'EXP001',
    employee: 'John Doe',
    department: 'Sales',
    date: '2024-03-20',
    amount: '$850.00',
    category: 'Travel',
    status: 'pending',
    riskScore: 85,
    aiJustification: 'Flight ticket prices are within market range for the route, but exceed department limit by 15%. Hotel rates are standard for the location. Meal expenses follow company policy.',
    policyViolations: ['Amount exceeds department limit by $150', 'Missing itemized receipt for dinner'],
    items: [
      { description: 'Flight Ticket (Round Trip)', amount: '$450.00', category: 'Travel', receipt: 'receipt1.pdf' },
      { description: 'Hotel Stay (3 nights)', amount: '$300.00', category: 'Accommodation', receipt: 'receipt2.pdf' },
      { description: 'Business Dinner', amount: '$100.00', category: 'Meals', notes: 'Client meeting - 4 attendees' },
    ],
  },
  {
    id: 'EXP002',
    employee: 'Alice Smith',
    department: 'Marketing',
    date: '2024-03-19',
    amount: '$220.50',
    category: 'Office Supplies',
    status: 'pending',
    riskScore: 25,
    aiJustification: 'All items are standard office supplies with prices matching approved vendors. Quantities are reasonable for the department size.',
    policyViolations: [],
    items: [
      { description: 'Printer Paper (5 reams)', amount: '$45.50', category: 'Supplies', receipt: 'receipt3.pdf' },
      { description: 'Ink Cartridges', amount: '$175.00', category: 'Supplies', receipt: 'receipt4.pdf' },
    ],
  },
  {
    id: 'EXP003',
    employee: 'Bob Wilson',
    department: 'Engineering',
    date: '2024-03-18',
    amount: '$1,250.00',
    category: 'Software',
    status: 'flagged',
    riskScore: 75,
    aiJustification: 'Software subscription cost is higher than usual. Similar tools available through corporate license. Recommend review of existing licenses.',
    policyViolations: ['Non-approved software vendor', 'Missing IT department approval'],
    items: [
      { description: 'Development Tool License', amount: '$1,250.00', category: 'Software', receipt: 'receipt5.pdf', notes: 'Annual subscription' },
    ],
  },
];

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'HR' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'travel', label: 'Travel' },
  { value: 'meals', label: 'Meals' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'software', label: 'Software' },
  { value: 'other', label: 'Other' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'flagged', label: 'Flagged' },
];

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
];

export default function ReviewExpensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedReport, setSelectedReport] = useState<ExpenseReport | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'flagged': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <BsCheckCircle />;
      case 'rejected': return <BsXCircle />;
      case 'flagged': return <BsFlag />;
      default: return <BsClockHistory />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const handleRequestInfo = (report: ExpenseReport) => {
    // Handle requesting additional information
    console.log('Requesting info for report:', report.id);
  };

  const handleApprove = (report: ExpenseReport) => {
    // Handle report approval
    console.log('Approving report:', report.id);
  };

  const handleReject = (report: ExpenseReport) => {
    // Handle report rejection
    console.log('Rejecting report:', report.id);
  };

  const handleFlag = (report: ExpenseReport) => {
    // Handle report flagging
    console.log('Flagging report:', report.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Review & Approve Expenses</h1>
        <p className="text-gray-600">Review expense reports with AI-powered insights and automated policy checks</p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="col-span-1 lg:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by employee, ID, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 
                         rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent"
              />
              <BsSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div>
            <Dropdown
              options={departmentOptions}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Department"
            />
          </div>
          <div>
            <Dropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Category"
            />
          </div>
          <div>
            <Dropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Status"
            />
          </div>
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Expense Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sampleReports.map((report) => (
            <div
              key={report.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
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
                      {report.department} • {report.category} • {report.date}
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
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">
                    {report.amount}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-sm ${getRiskColor(report.riskScore)}`}>
                    Risk: {report.riskScore}%
                  </span>
                </div>
              </div>

              {selectedReport?.id === report.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pl-12"
                >
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    {/* AI Justification */}
                    <div className="flex items-start space-x-2">
                      <BsRobot className="text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">AI Analysis</p>
                        <p className="text-sm text-gray-600">{report.aiJustification}</p>
                      </div>
                    </div>

                    {/* Expense Items */}
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Expense Items</p>
                      <div className="space-y-2">
                        {report.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.description}</p>
                              <p className="text-xs text-gray-500">{item.category}</p>
                              {item.notes && (
                                <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-medium text-gray-900">{item.amount}</span>
                              {item.receipt && (
                                <button className="text-blue-600 hover:text-blue-800">
                                  <BsDownload className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestInfo(report);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <BsChat className="w-4 h-4" />
                        <span>Request Info</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(report);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <BsXCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlag(report);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <BsFlag className="w-4 h-4" />
                        <span>Flag</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(report);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                      >
                        <BsCheckCircle className="w-4 h-4" />
                        <span>Approve</span>
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