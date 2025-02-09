'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import {
  BsHouseFill,
  BsFileEarmarkTextFill,
  BsClockHistory,
  BsRobot,
  BsBoxArrowRight,
  BsPersonFill,
  BsLock,
  BsPersonPlus,
} from 'react-icons/bs';

export default function Navigation({ children }: { children: React.ReactNode }) {
  const { userData, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      href: '/employee/dashboard',
      icon: <BsHouseFill className="w-5 h-5" />,
      text: 'Dashboard',
    },
    {
      href: '/employee/submit-expense',
      icon: <BsFileEarmarkTextFill className="w-5 h-5" />,
      text: 'Submit Expense',
    },
    {
      href: '/employee/expense-history',
      icon: <BsClockHistory className="w-5 h-5" />,
      text: 'History',
    },
    {
      href: '/employee/ai-assistant',
      icon: <BsRobot className="w-5 h-5" />,
      text: 'AI Assistant',
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <motion.nav
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-darker-bg border-r-2 border-neon-primary"
      >
        <div className="p-4">
          <motion.div
            className="text-2xl font-bold neon-text text-center mb-8 wave-hover"
            whileHover={{ scale: 1.05 }}
          >
            ExpenseAI
          </motion.div>

          {userData ? (
            // Show menu items for authenticated users
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className="flex items-center p-3 rounded-lg neon-button wave-hover"
                    whileHover={{ x: 5 }}
                  >
                    {item.icon}
                    <span className="ml-3">{item.text}</span>
                  </motion.div>
                </Link>
              ))}
              <motion.div
                className="flex items-center p-3 rounded-lg neon-button wave-hover text-neon-primary border-neon-primary mt-4"
                whileHover={{ x: 5 }}
                onClick={handleSignOut}
                style={{ cursor: 'pointer' }}
              >
                <BsBoxArrowRight className="w-5 h-5" />
                <span className="ml-3">Sign Out</span>
              </motion.div>
            </div>
          ) : (
            // Show auth buttons for non-authenticated users
            <div className="space-y-4">
              <Link href="/login">
                <motion.div
                  className="flex items-center p-3 rounded-lg neon-button wave-hover"
                  whileHover={{ x: 5 }}
                >
                  <BsLock className="w-5 h-5" />
                  <span className="ml-3">Sign In</span>
                </motion.div>
              </Link>
              <Link href="/signup">
                <motion.div
                  className="flex items-center p-3 rounded-lg neon-button wave-hover"
                  whileHover={{ x: 5 }}
                >
                  <BsPersonPlus className="w-5 h-5" />
                  <span className="ml-3">Sign Up</span>
                </motion.div>
              </Link>
            </div>
          )}
        </div>

        {userData && (
          <div className="absolute bottom-0 w-full p-4 border-t-2 border-neon-primary">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BsPersonFill className="w-5 h-5 text-neon-secondary" />
                <span className="ml-2 text-sm truncate">{userData.email}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-neon-primary/20"
              >
                <BsBoxArrowRight className="w-5 h-5 text-neon-primary" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.nav>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="neon-button p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ x: isMenuOpen ? 0 : '100%' }}
        className="lg:hidden fixed inset-y-0 right-0 w-64 bg-darker-bg border-l-2 border-neon-primary z-40"
      >
        <div className="p-4">
          {userData ? (
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className="flex items-center p-3 rounded-lg neon-button wave-hover"
                    whileHover={{ x: 5 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.text}</span>
                  </motion.div>
                </Link>
              ))}
              <motion.div
                className="flex items-center p-3 rounded-lg neon-button wave-hover text-neon-primary border-neon-primary mt-4"
                whileHover={{ x: 5 }}
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                <BsBoxArrowRight className="w-5 h-5" />
                <span className="ml-3">Sign Out</span>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-4">
              <Link href="/login">
                <motion.div
                  className="flex items-center p-3 rounded-lg neon-button wave-hover"
                  whileHover={{ x: 5 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BsLock className="w-5 h-5" />
                  <span className="ml-3">Sign In</span>
                </motion.div>
              </Link>
              <Link href="/signup">
                <motion.div
                  className="flex items-center p-3 rounded-lg neon-button wave-hover"
                  whileHover={{ x: 5 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BsPersonPlus className="w-5 h-5" />
                  <span className="ml-3">Sign Up</span>
                </motion.div>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 