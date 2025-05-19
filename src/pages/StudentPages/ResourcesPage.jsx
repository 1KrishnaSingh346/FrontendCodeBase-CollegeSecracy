import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FiBookOpen,
  FiVideo,
  FiFileText,
  FiDownload,
  FiSearch,
  FiFilter,
  FiBookmark,
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

const ResourcesPage = () => {
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
  
  const resourceCategories = [
    {
      title: "JEE Main Syllabus",
      description: "Complete syllabus breakdown with weightage analysis",
      icon: <FiBookOpen className="text-orange-500" />,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      items: 12
    },
    {
      title: "Previous Year Papers",
      description: "10 years of solved question papers with solutions",
      icon: <FiFileText className="text-blue-500" />,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1422&q=80",
      items: 32
    },
    {
      title: "Video Lectures",
      description: "Concept videos by IIT professors and top educators",
      icon: <FiVideo className="text-purple-500" />,
      image: "https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      items: 85
    },
    {
      title: "Formula Sheets",
      description: "All important formulas for quick revision",
      icon: <FiBookmark className="text-green-500" />,
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
      items: 24
    },
    {
      title: "Mock Test Series",
      description: "Full-length tests with detailed analysis",
      icon: <FiFileText className="text-red-500" />,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      items: 15
    },
    {
      title: "NCERT Solutions",
      description: "Class 11-12 NCERT solutions for all subjects",
      icon: <FiBookOpen className="text-yellow-500" />,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      items: 48
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            variants={fadeIn}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            JEE Preparation Resources
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="text-lg sm:text-xl text-orange-100 max-w-3xl mx-auto"
          >
            Curated study materials, video lectures, and practice papers to ace your JEE exams
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <motion.div 
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-medium">
                <FiFilter className="mr-2" />
                Filter
              </button>
              <button className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                Newest First
              </button>
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resourceCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/resources/${category.title.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              <div className="relative h-40">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm">
                    {category.icon}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-1">{category.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {category.items} resources
                  </span>
                  <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 flex items-center text-sm font-medium">
                    View all <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Resources */}
        <motion.div 
          variants={fadeIn}
          className="mt-12 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl overflow-hidden shadow-lg relative"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 p-6 sm:p-8 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Featured Resources</h2>
            <p className="mb-4 opacity-90 max-w-2xl">
              Our top picks to boost your JEE preparation this week
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "JEE Main 2023 Paper Analysis",
                  type: "PDF",
                  icon: <FiFileText className="text-white" />
                },
                {
                  title: "Organic Chemistry Shortcuts",
                  type: "Video",
                  icon: <FiVideo className="text-white" />
                },
                {
                  title: "Physics Formula Cheat Sheet",
                  type: "PDF",
                  icon: <FiFileText className="text-white" />
                }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:border-white/30 transition-colors">
                  <div className="flex items-start">
                    <div className="bg-white/20 p-2 rounded-lg mr-3">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm opacity-80">{item.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer theme={darkMode ? 'dark' : 'light'} />
    </motion.div>
  );
};

export default ResourcesPage;