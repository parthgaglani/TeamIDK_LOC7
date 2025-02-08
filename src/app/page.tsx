'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BsReceipt,
  BsShieldCheck,
  BsLightning,
  BsGraphUp,
  BsClock,
  BsArrowRight,
  BsChatDots,
  BsCheck2Circle,
} from 'react-icons/bs';

const features = [
  {
    icon: BsReceipt,
    title: 'Smart Receipt Scanning',
    description: 'Upload receipts instantly with our AI-powered OCR technology.',
  },
  {
    icon: BsShieldCheck,
    title: 'Fraud Detection',
    description: 'Advanced AI algorithms detect suspicious expense patterns.',
  },
  {
    icon: BsLightning,
    title: 'Instant Processing',
    description: 'Get your expenses approved and reimbursed faster than ever.',
  },
  {
    icon: BsGraphUp,
    title: 'Analytics Dashboard',
    description: 'Gain insights into spending patterns and budget allocation.',
  },
  {
    icon: BsClock,
    title: 'Real-time Tracking',
    description: 'Monitor expense status and approvals in real-time.',
  },
  {
    icon: BsChatDots,
    title: 'AI Assistant',
    description: 'Get help with expense categorization and policy compliance.',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Finance Manager',
    company: 'TechCorp',
    content: 'ExpenseAI has revolutionized how we handle expense reports. The AI-powered automation saves us countless hours.',
  },
  {
    name: 'Michael Chen',
    role: 'Business Owner',
    company: 'InnovateCo',
    content: 'The fraud detection features give us peace of mind, and the interface is incredibly user-friendly.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Employee',
    company: 'StartupX',
    content: 'Submitting expenses used to be a hassle. Now with ExpenseAI, I can do it in minutes from my phone.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span className="block">Expense Management</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Streamline your expense reporting with AI-powered automation. Save time, reduce errors,
              and gain insights into your business spending.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get Started Free
              </Link>
              <Link
                href="#features"
                className="flex items-center text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <BsArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage expenses
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our AI-powered platform makes expense management effortless
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-4 left-4 inline-block rounded-xl bg-blue-600 p-3 shadow-lg">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-4 text-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by companies worldwide
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what our customers have to say about ExpenseAI
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-base text-gray-600">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-20 shadow-xl sm:px-12 sm:py-32">
            <div className="relative">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to streamline your expense management?
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
                  Join thousands of businesses that trust ExpenseAI for their expense management needs.
                  Get started today with our free trial.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    href="/signup"
                    className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm font-semibold leading-6 text-white flex items-center"
                  >
                    View pricing <BsArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
