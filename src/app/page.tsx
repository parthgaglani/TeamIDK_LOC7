'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { BsMicrosoft } from 'react-icons/bs';
import { BsArrowRight, BsShieldCheck, BsLightning, BsReceipt } from 'react-icons/bs';

const features = [
  {
    icon: BsReceipt,
    title: 'Smart Receipt Processing',
    description: 'Upload receipts and let AI extract all relevant information automatically.',
  },
  {
    icon: BsShieldCheck,
    title: 'Fraud Detection',
    description: 'Advanced AI algorithms detect suspicious patterns and prevent expense fraud.',
  },
  {
    icon: BsLightning,
    title: 'Quick Approvals',
    description: 'Streamlined approval workflows that save time and increase productivity.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6"
          >
            Expense Management,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Transform your expense management with AI-powered automation, real-time fraud detection, and seamless approvals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 blur-3xl opacity-50" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <feature.icon className="text-3xl text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Expense Management?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies that trust ExpenseAI to streamline their expense processes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Get Started <BsArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
