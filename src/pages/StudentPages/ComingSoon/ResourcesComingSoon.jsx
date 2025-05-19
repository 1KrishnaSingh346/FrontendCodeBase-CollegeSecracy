import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';

const ResourcesComingSoon = () => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check local storage or prefer-color-scheme for initial value
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) return JSON.parse(savedMode);
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      });

        // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:py-32 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Premium Study Resources
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-orange-100 max-w-3xl mx-auto"
          >
            Curated materials, video lectures, and practice papers coming soon!
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 md:p-16 text-center">
            <div className="max-w-2xl mx-auto">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 shadow-lg"
              >
                COMING SOON
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
              >
                Boost Your JEE Preparation
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              >
                We're preparing an extensive library of high-quality study materials to help you ace your exams. Get notified when we launch!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-md mx-auto"
              >
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700"
                  />
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-r-lg font-medium transition-colors">
                    Notify Me
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-8">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-lg font-medium text-center mb-6">What to Expect:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: (
                      <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ),
                    title: "Previous Year Papers",
                    description: "10+ years of solved question papers with detailed solutions"
                  },
                  {
                    icon: (
                      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: "Video Lectures",
                    description: "Concept videos by IIT professors and top educators"
                  },
                  {
                    icon: (
                      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ),
                    title: "Formula Sheets",
                    description: "All important formulas for quick revision before exams"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center"
                  >
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h4 className="font-medium mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer theme={darkMode ? 'dark' : 'light'} />
    </motion.div>
  );
};

export default ResourcesComingSoon;