import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome, FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";

const ToolLayout = ({ title, description, children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('theme');
      if (savedMode) return savedMode === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 pb-16 sm:pb-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header with navigation */}
        <motion.header 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-6 sm:pt-8 pb-4 sm:pb-6"
        >
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link 
                to="/tools" 
                className="flex items-center text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 transition-colors group text-sm sm:text-base"
              >
                <FiArrowLeft className="mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>All Tools</span>
              </Link>
              <Link 
                to="/" 
                className="flex items-center text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 transition-colors group text-sm sm:text-base"
              >
                <FiHome className="mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </Link>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end space-x-4">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-600 to-blue-800 p-1 rounded-lg shadow-lg"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-white dark:bg-black px-3 sm:px-4 py-1 sm:py-2 rounded-md">
                  {title}
                </h1>
              </motion.div>

              {/* Desktop Theme Toggle (hidden on mobile) */}
              <div className="hidden sm:block">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isDark ? 'dark' : 'light'}
                      initial={{ opacity: 0, rotate: -30 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 30 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isDark ? (
                        <FiSun className="h-5 w-5 text-orange-400" />
                      ) : (
                        <FiMoon className="h-5 w-5 text-gray-700" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
          
          {description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 sm:mt-4 text-gray-600 dark:text-gray-400 max-w-2xl text-sm sm:text-base"
            >
              {description}
            </motion.p>
          )}
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-blue-600 mt-4 sm:mt-6 rounded-full"
          />
        </motion.header>

        {/* Main content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pb-8 sm:pb-12"
        >
          {children}
        </motion.main>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-6 pb-4 sm:pt-8 sm:pb-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
        >
          <p>© {new Date().getFullYear()} Tools Collection. All rights reserved.</p>
        </motion.footer>
      </div>

      {/* Floating Theme Toggle for Mobile */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? 'dark' : 'light'}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? (
                <FiSun className="h-6 w-6 text-orange-400" />
              ) : (
                <FiMoon className="h-6 w-6 text-gray-700" />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ToolLayout;