'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import {
  BsPersonCircle,
  BsEnvelope,
  BsBuilding,
  BsShieldLock,
  BsKey,
  BsCheckCircle,
  BsCamera,
  BsPencil,
  BsChevronRight,
} from 'react-icons/bs';

export default function ProfilePage() {
  const { userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeSection, setActiveSection] = useState<'info' | 'security'>('info');
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    role: '',
    department: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        displayName: userData.displayName || '',
        email: userData.email || '',
        role: userData.role || '',
        department: userData.department || '',
      }));
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl backdrop-blur-3xl" />
          <div className="relative px-8 py-10">
            <div className="flex items-center space-x-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-r p-[2px] from-blue-600 to-indigo-600">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {userData?.displayName?.[0]?.toUpperCase() || userData?.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white shadow-lg text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BsCamera className="w-4 h-4" />
                </button>
              </motion.div>
              <div className="space-y-1">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                >
                  {userData?.displayName || 'Your Name'}
                </motion.h1>
                <p className="text-gray-500">{userData?.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                    {userData?.role}
                  </span>
                  {userData?.department && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                      {userData.department}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl backdrop-blur-xl shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <BsCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-green-800 font-medium">Profile updated successfully</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {['info', 'security'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section as 'info' | 'security')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === section
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="capitalize">{section === 'info' ? 'Personal Information' : 'Security Settings'}</span>
                  <BsChevronRight className={`w-4 h-4 transition-transform ${
                    activeSection === section ? 'rotate-90 text-blue-600' : ''
                  }`} />
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden backdrop-blur-xl"
            >
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeSection === 'info' ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                                Display Name
                              </label>
                              <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <BsPersonCircle className="text-gray-400 w-5 h-5" />
                                  </div>
                                  <input
                                    type="text"
                                    name="displayName"
                                    id="displayName"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="pl-12 block w-full h-14 text-base rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    placeholder="Your display name"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                              </label>
                              <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 transition-opacity" />
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <BsEnvelope className="text-gray-400 w-5 h-5" />
                                  </div>
                                  <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    disabled={true}
                                    className="pl-12 block w-full h-14 text-base rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                              </label>
                              <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 transition-opacity" />
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <BsShieldLock className="text-gray-400 w-5 h-5" />
                                  </div>
                                  <input
                                    type="text"
                                    name="role"
                                    id="role"
                                    value={formData.role}
                                    disabled={true}
                                    className="pl-12 block w-full h-14 text-base rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 capitalize transition-all"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                Department
                              </label>
                              <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <BsBuilding className="text-gray-400 w-5 h-5" />
                                  </div>
                                  <input
                                    type="text"
                                    name="department"
                                    id="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="pl-12 block w-full h-14 text-base rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                            <div key={field} className="space-y-2">
                              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                                {field.split(/(?=[A-Z])/).join(' ')}
                              </label>
                              <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    {field === 'currentPassword' ? (
                                      <BsKey className="text-gray-400 w-5 h-5" />
                                    ) : (
                                      <BsShieldLock className="text-gray-400 w-5 h-5" />
                                    )}
                                  </div>
                                  <input
                                    type="password"
                                    name={field}
                                    id={field}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="pl-12 block w-full h-14 text-base rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    placeholder={`Enter ${field.split(/(?=[A-Z])/).join(' ').toLowerCase()}`}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <motion.div 
                    className="mt-8 flex justify-end space-x-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all flex items-center space-x-2"
                        >
                          {isSaving ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <BsCheckCircle className="w-4 h-4" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center space-x-2"
                      >
                        <BsPencil className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 