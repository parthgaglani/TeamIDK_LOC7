import { DashboardClient } from './client';
import { Dropdown } from '@/components/ui/Dropdown';

export default function DashboardPage() {
  // Add period options
  const periodOptions = [
    { value: 'this_month', label: 'This Month' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'this_year', label: 'This Year' },
  ];

  return <DashboardClient />;
} 