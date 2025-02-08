'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { BsArrowLeft } from 'react-icons/bs';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageName = pathname.split('/').pop();
  const formattedPageName = pageName
    ? pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, ' ')
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {children}
      </main>
    </div>
  );
} 