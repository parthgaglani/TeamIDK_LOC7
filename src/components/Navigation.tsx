'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { signOutUser } from '@/lib/firebase';
import {
  BsSpeedometer2,
  BsReceipt,
  BsShieldCheck,
  BsCheckCircle,
  BsGear,
  BsPerson,
  BsBell,
  BsChevronDown,
  BsClockHistory,
  BsChatDots,
  BsGraphUp,
  BsPeople,
  BsShield,
  BsSliders,
  BsGrid,
  BsClipboardCheck,
  BsShieldExclamation,
  BsPlus,
} from 'react-icons/bs';
import { IconType } from 'react-icons';
import { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
}

// Navigation items for different user roles
const financeLinks: NavItem[] = [
  { href: '/finance/dashboard', label: 'Dashboard', icon: BsGrid },
  { href: '/finance/review-expenses', label: 'Review & Approve', icon: BsClipboardCheck },
  { href: '/finance/fraud-detection', label: 'Fraud Detection', icon: BsShieldExclamation },
  { href: '/finance/compliance', label: 'Compliance', icon: BsShieldCheck },
  { href: '/finance/analytics', label: 'Analytics', icon: BsGraphUp },
];

const employeeLinks: NavItem[] = [
  { href: '/employee/dashboard', label: 'Dashboard', icon: BsGrid },
  { href: '/employee/expenses', label: 'My Expenses', icon: BsReceipt },
  { href: '/employee/submit', label: 'Submit Expense', icon: BsPlus },
];

const roleLinks: Record<Exclude<UserRole, 'manager'>, NavItem[]> = {
  finance: financeLinks,
  employee: employeeLinks,
};

const Navigation = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = userData?.role && userData.role !== 'manager' ? roleLinks[userData.role] : [];
  const isAuthenticated = !!userData;

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: isScrolled ? 'blur(10px)' : 'blur(5px)',
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={isAuthenticated ? `/${userData.role}/dashboard` : '/'} className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ExpenseAI
              </span>
              {userData?.role && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                  {userData.role}
                </span>
              )}
            </Link>

            {/* Navigation Links - Only show when authenticated */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="mr-2 text-lg" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              ) : isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                    <BsBell className="text-gray-500 w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {userData.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <BsChevronDown className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {userData.email}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {userData.role} Account
                            </p>
                          </div>
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <BsPerson className="mr-2" />
                            Profile
                          </Link>
                          <Link
                            href={`/${userData.role}/settings`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <BsGear className="mr-2" />
                            Settings
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex flex-col items-center py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="text-lg mb-1" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`pt-16 ${isAuthenticated ? 'pb-16 md:pb-0' : 'pb-0'}`}>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Navigation; 