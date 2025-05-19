import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiClock,
  FiAward,
  FiBarChart2,
  FiBook,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiChevronRight
} from 'react-icons/fi';
import Footer from './Components/Footer';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const MockTestPage = () => {
  const navigate = useNavigate();
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
  
  const testSeries = [
    {
      title: "JEE Main Full Syllabus Test 1",
      type: "Full Test",
      duration: "3 Hours",
      questions: 90,
      date: "Available Now",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      premium: false
    },
    {
      title: "Physics Advanced Level Test",
      type: "Subject Test",
      duration: "1 Hour",
      questions: 30,
      date: "Available Now",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      premium: false
    },
    {
      title: "JEE Advanced Mock Series 1",
      type: "Full Test",
      duration: "3 Hours",
      questions: 90,
      date: "Starts Jun 15",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      premium: true
    },
    {
      title: "Chemistry Concept Test",
      type: "Chapter Test",
      duration: "45 Minutes",
      questions: 25,
      date: "Available Now",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      premium: false
    },
    {
      title: "Mathematics Speed Test",
      type: "Practice Test",
      duration: "1 Hour",
      questions: 30,
      date: "Available Now",
      image: "https://images.unsplash.com/photo-1509869175650-a1d97972541a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      premium: false
    },
    {
      title: "JEE Main Grand Finale Test",
      type: "Full Test",
      duration: "3 Hours",
      questions: 90,
      date: "Starts Jul 1",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      premium: true
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            variants={fadeIn}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            JEE Mock Test Series
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="text-lg sm:text-xl text-orange-100 max-w-3xl mx-auto"
          >
            Simulate real exam conditions with our timed mock tests and detailed performance analysis
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Filters */}
        <motion.div 
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button className="whitespace-nowrap px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium">
                All Tests
              </button>
              <button className="whitespace-nowrap px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-medium">
                Full Tests
              </button>
              <button className="whitespace-nowrap px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-medium">
                Subject Tests
              </button>
              <button className="whitespace-nowrap px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-medium">
                Chapter Tests
              </button>
              <button className="whitespace-nowrap px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-medium">
                Previous Year
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-medium">
                <FiFilter className="mr-2" />
                Filter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Test Series Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testSeries.map((test, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all ${
                test.premium ? 'border-2 border-orange-500' : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="relative h-40">
                <img 
                  src={test.image} 
                  alt={test.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                {test.premium && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    PREMIUM
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm">
                      <FiClock className="text-orange-500" />
                    </div>
                    <span className="text-white text-sm font-medium bg-black/30 px-2 py-1 rounded">
                      {test.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{test.title}</h3>
                  {test.premium && (
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{test.type} • {test.questions} Questions</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiCalendar className="mr-1" />
                    {test.date}
                  </div>
                  <button 
                    onClick={() => navigate(`/tests/${test.title.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 text-sm font-medium"
                  >
                    Details <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Performance Analysis */}
        <motion.div 
          variants={fadeIn}
          className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl overflow-hidden shadow-lg relative"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 p-6 sm:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Your Test Performance</h2>
                <p className="opacity-90 max-w-2xl">
                  Track your progress with detailed analytics and personalized recommendations
                </p>
              </div>
              <button 
                onClick={() => navigate('/performance')}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors self-start md:self-center"
              >
                View Analytics
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Tests Taken", value: "7", icon: <FiBook className="text-2xl" /> },
                { label: "Average Score", value: "72%", icon: <FiBarChart2 className="text-2xl" /> },
                { label: "Highest Rank", value: "1,245", icon: <FiAward className="text-2xl" /> },
                { label: "Accuracy", value: "68%", icon: <FiAward className="text-2xl" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                    <div className="text-white/70">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Test Instructions */}
        <motion.div 
          variants={fadeIn}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiAward className="mr-2 text-orange-500" />
            Test Taking Instructions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Before the Test</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Ensure you have a stable internet connection</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use a desktop/laptop for best experience</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Keep your admit card and ID ready</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">During the Test</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Don't refresh or close the browser window</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use the question palette to navigate</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Submit before time runs out</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer theme={darkMode ? 'dark' : 'light'} />
    </motion.div>
  );
};

export default MockTestPage;