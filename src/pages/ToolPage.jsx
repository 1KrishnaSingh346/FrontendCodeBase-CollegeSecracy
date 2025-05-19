import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToolCard from "../components/tools/ToolCard";
import MiniToolCard from "../components/tools/MiniToolCard";
import { Link } from "react-router-dom";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { 
  FiHome, FiTool, FiBookOpen, FiAward, FiBarChart2, 
  FiCalendar, FiClipboard, FiSun, FiMoon, FiMail, 
  FiGithub, FiTwitter, FiLinkedin, FiZap, FiLayers,
  FiUsers, FiDollarSign, FiCheck
} from "react-icons/fi";
import { 
  FaCalculator, FaUniversity, FaChartLine, 
  FaRegChartBar, FaGraduationCap, FaCrown
} from "react-icons/fa";

// Custom SVG Components
const ToolsIllustration = () => (
  <svg className="w-full h-auto max-w-xs" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 150C100 120 125 100 150 100C175 100 200 120 200 150C200 180 175 200 150 200C125 200 100 180 100 150Z" 
          stroke="currentColor" strokeWidth="8" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M200 150C200 120 225 100 250 100C275 100 300 120 300 150C300 180 275 200 250 200C225 200 200 180 200 150Z" 
          stroke="currentColor" strokeWidth="8" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M150 100V50H250V100" stroke="currentColor" strokeWidth="8" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M150 200V250H250V200" stroke="currentColor" strokeWidth="8" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M100 150H50" stroke="currentColor" strokeWidth="8" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M300 150H350" stroke="currentColor" strokeWidth="8" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M150 50H250" stroke="currentColor" strokeWidth="8" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M150 250H250" stroke="currentColor" strokeWidth="8" strokeMiterlimit="10" strokeLinecap="round"/>
  </svg>
);

const AcademicIllustration = () => (
  <svg className="w-full h-auto max-w-xs" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M200 50L50 120L200 190L350 120L200 50Z" 
          stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M50 120V180C50 180 100 210 200 210C300 210 350 180 350 180V120" 
          stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M200 190V210" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M150 150V170C150 185 165 200 200 200C235 200 250 185 250 170V150" 
          stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WaveDivider = () => (
  <svg className="w-full h-16 md:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
    <path 
      d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
      fill="currentColor" 
      opacity=".25"
      className="text-gray-300 dark:text-gray-800"
    />
    <path 
      d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
      fill="currentColor" 
      opacity=".5"
      className="text-gray-300 dark:text-gray-800"
    />
    <path 
      d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
      fill="currentColor" 
      className="text-gray-200 dark:text-gray-900"
    />
  </svg>
);

const ToolsPage = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('theme');
      if (savedMode) return savedMode === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        {/* Blue blob */}
        <div className={`absolute -left-20 -top-20 w-64 h-64 rounded-full filter blur-3xl opacity-20 ${isDark ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
        {/* Orange blob */}
        <div className={`absolute -right-20 bottom-1/3 w-72 h-72 rounded-full filter blur-3xl opacity-20 ${isDark ? 'bg-orange-600' : 'bg-orange-400'}`}></div>
        {/* Purple blob */}
        <div className={`absolute right-1/4 -bottom-20 w-56 h-56 rounded-full filter blur-3xl opacity-20 ${isDark ? 'bg-purple-600' : 'bg-purple-400'}`}></div>
      </div>

      {/* Mobile Home Button - Fixed at top left */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <Link 
          to="/" 
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
          aria-label="Back to Home"
        >
          <FiHome className="h-5 w-5" />
        </Link>
      </div>

      {/* Theme Toggle Button - Fixed at bottom right */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-gray-200 dark:bg-gray-700 shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
      >
        <div className="container mx-auto px-4 sm:px-6 pb-16">
          {/* Header Section */}
          <motion.header 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center pt-16 pb-8 md:pb-16 relative"
          >
            {/* Desktop Home Button - Hidden on mobile */}
            <div className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2">
              <Link 
                to="/" 
                className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors group"
              >
                <FiHome className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </Link>
            </div>
            
            <div className="inline-flex flex-col items-center px-4 sm:px-0">
              <div className="flex items-center justify-center mb-4">
                <FiTool className="text-orange-600 dark:text-orange-400 text-3xl md:text-4xl mr-3" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-blue-600 dark:from-orange-400 dark:to-blue-400">
                  Student Tools
                </h2>
              </div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="h-1.5 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 rounded-full mb-4"
              />
              
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg md:text-xl">
                Essential calculators and planners for your academic success
              </p>
            </div>
          </motion.header>

          {/* Main Tools Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            <ToolCard 
              title="Rank Calculator"
              description="Calculate your college rank based on marks and total students"
              icon={<FaCalculator className="text-3xl text-orange-600 dark:text-orange-400" />}
              gradient="from-orange-500 to-blue-600"
              link="/tools/rank-calculator"
              theme={isDark ? 'dark' : 'light'}
              image="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            />
            <ToolCard 
              title="Percentile Calculator"
              description="Determine your exam percentile from marks and total candidates"
              icon={<FaRegChartBar className="text-3xl text-orange-600 dark:text-orange-400" />}
              gradient="from-blue-500 to-orange-500"
              link="/tools/percentile-calculator"
              theme={isDark ? 'dark' : 'light'}
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            />
            
            {/* Premium College Predictor Card */}
            <div className="relative group">
              <div className={`absolute inset-0 rounded-xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:-translate-y-1`}></div>
              <div className={`relative h-full rounded-xl overflow-hidden border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } shadow-md group-hover:shadow-xl transition-all duration-300`}>
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                    alt="" 
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className={`absolute inset-0 ${
                    isDark ? 'bg-gray-900/70' : 'bg-white/40'
                  }`}></div>
                </div>
                
                <div className="relative z-10 p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-xl mr-4 ${
                      isDark ? 'bg-gray-700/60 text-orange-400' : 'bg-white/70 text-blue-600'
                    } backdrop-blur-sm shadow-sm`}>
                      <FaUniversity className="text-2xl" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>College Predictor</h3>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>Premium Tool</p>
                    </div>
                  </div>
                  
                  <p className={`mb-4 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    AI-powered college prediction with 95% accuracy for JOSAA, CSAB, and state-level admissions.
                  </p>
                  
                  <div className="flex-grow">
                    <ul className="space-y-2 mb-4">
                      {[
                        "Multi-round counseling analysis",
                        "3-year cutoff trends",
                        "Personalized recommendations",
                        "Advanced filtering options",
                        "Export as PDF"
                      ].map((feature, index) => (
                        <li key={index} className={`flex items-start text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <span className={`mt-0.5 mr-2 ${
                            isDark ? 'text-orange-400' : 'text-blue-600'
                          }`}>
                            <FiCheck className="inline" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center mb-3">
                      <FaCrown className={`text-lg mr-2 ${
                        isDark ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>Premium Feature</span>
                    </div>
                    <Link
                      to="/tools/college-predictor-services"
                      className={`w-full py-2 px-4 rounded-lg font-medium text-white bg-gradient-to-r ${
                        isDark ? 'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' : 
                        'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                      } transition-colors flex items-center justify-center`}
                    >
                      <FaIndianRupeeSign className="mr-2" />
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <ToolCard 
              title="Marking Scheme"
              description="Calculate your score based on exam pattern"
              icon={<FiClipboard className="text-3xl text-orange-600 dark:text-orange-400" />}
              gradient="from-blue-500 to-orange-500"
              link="/tools/marking-scheme"
              theme={isDark ? 'dark' : 'light'}
              image="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
            />
            <ToolCard 
              title="Cutoff Analyzer"
              description="Check college eligibility based on your rank"
              icon={<FaChartLine className="text-3xl text-orange-600 dark:text-orange-400" />}
              gradient="from-orange-500 to-blue-500"
              link="/tools/cutoff-analyzer"
              theme={isDark ? 'dark' : 'light'}
              image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            />
            <ToolCard 
              title="Exam Tools"
              description="All exam utilities in one place"
              icon={<FiBookOpen className="text-3xl text-orange-600 dark:text-orange-400" />}
              gradient="from-blue-500 to-orange-500"
              link="/tools/exam-tools"
              theme={isDark ? 'dark' : 'light'}
              image="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1522&q=80"
            />
          </motion.div>

          {/* Divider */}
          <div className="relative my-8 md:my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className={`px-4 ${
                isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'
              } text-sm font-medium`}>
                Quick Access Tools
              </span>
            </div>
          </div>

          {/* Mini Tools Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12"
          >
            <MiniToolCard 
              icon={<FaCalculator className="text-xl text-orange-600 dark:text-orange-400" />} 
              name="CGPA Calc" 
              path="/tools/cgpa-calculator" 
              theme={isDark ? 'dark' : 'light'}
            />
            <MiniToolCard 
              icon={<FiClipboard className="text-xl text-orange-600 dark:text-orange-400" />} 
              name="Marking Scheme" 
              path="/tools/marking-scheme" 
              theme={isDark ? 'dark' : 'light'}
            />
            <MiniToolCard 
              icon={<FiCalendar className="text-xl text-orange-600 dark:text-orange-400" />} 
              name="Exam Planner" 
              path="/tools/exam-planner" 
              theme={isDark ? 'dark' : 'light'}
            />
            <MiniToolCard 
              icon={<FaChartLine className="text-xl text-orange-600 dark:text-orange-400" />} 
              name="Cutoff Analyzer" 
              path="/tools/cutoff-analyzer" 
              theme={isDark ? 'dark' : 'light'}
            />
            <MiniToolCard 
              icon={<FaGraduationCap className="text-xl text-orange-600 dark:text-orange-400" />} 
              name="JEE Tools" 
              path="/tools/jee" 
              theme={isDark ? 'dark' : 'light'}
            />
            <MiniToolCard 
              icon={<FaGraduationCap className="text-xl text-orange-600 dark:text-orange-400" />} 
              name="NEET Tools" 
              path="/tools/neet" 
              theme={isDark ? 'dark' : 'light'}
            />
          </motion.div>

          {/* Features Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`rounded-2xl overflow-hidden ${
              isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-lg p-6 sm:p-8 mb-12`}
          >
            <h3 className="text-2xl font-bold text-center mb-8 dark:text-white">Why Choose Our Tools?</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: <FiZap className="text-2xl" />, 
                  title: "Fast & Accurate", 
                  desc: "Instant calculations with 99% accuracy",
                  color: "text-blue-600 dark:text-blue-400"
                },
                { 
                  icon: <FiBarChart2 className="text-2xl" />, 
                  title: "Data-Driven", 
                  desc: "Based on historical trends and patterns",
                  color: "text-orange-600 dark:text-orange-400"
                },
                { 
                  icon: <FiUsers className="text-2xl" />, 
                  title: "Student-Focused", 
                  desc: "Designed specifically for academic needs",
                  color: "text-purple-600 dark:text-purple-400"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                  } ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold dark:text-white mb-2">{feature.title}</h4>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Illustration Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          >
            <div className="w-full max-w-md text-orange-600 dark:text-orange-400">
              <AcademicIllustration />
            </div>
            
            <div className="text-center md:text-left max-w-md">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                More Tools Coming Soon!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We're constantly adding new tools to help students in their academic journey.
              </p>
              <div className="w-full max-w-xs text-blue-600 dark:text-blue-400 mx-auto md:mx-0">
                <ToolsIllustration />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer with Wave Divider */}
      <footer className="bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 relative transition-colors duration-300">
        <div className="text-gray-300 dark:text-gray-800 transition-colors duration-300">
          <WaveDivider />
        </div>
        
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                CollegeSecracy
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Helping students succeed with powerful academic tools and calculators.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-4 mb-4">
                <a href="mailto:contact@collegesecracy.com" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiMail className="h-5 w-5" />
                </a>
                <a href="https://github.com/collegesecracy" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiGithub className="h-5 w-5" />
                </a>
                <a href="https://twitter.com/collegesecracy" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiTwitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/company/collegesecracy" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiLinkedin className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} CollegeSecracy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ToolsPage;