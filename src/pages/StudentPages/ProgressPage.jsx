import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FiBarChart2,
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiBook,
  FiClock,
  FiFilter,
  FiDownload,
  FiChevronDown,
  FiChevronUp
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

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedTest, setExpandedTest] = useState(null);
  const [timeRange, setTimeRange] = useState('last-30-days');
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

  // Sample data - replace with real data from your backend
  const testHistory = [
    {
      id: 1,
      title: "JEE Main Full Test #5",
      date: "2023-05-15",
      score: 78,
      percentile: 92.5,
      timeSpent: "2h 45m",
      accuracy: 72,
      rank: 1245,
      subjects: [
        { name: "Physics", score: 25, total: 30 },
        { name: "Chemistry", score: 27, total: 30 },
        { name: "Mathematics", score: 26, total: 30 }
      ]
    },
    {
      id: 2,
      title: "Physics Advanced Test",
      date: "2023-05-08",
      score: 24,
      percentile: 85.3,
      timeSpent: "55m",
      accuracy: 80,
      rank: 3542,
      subjects: [
        { name: "Mechanics", score: 8, total: 10 },
        { name: "Electrodynamics", score: 7, total: 10 },
        { name: "Modern Physics", score: 9, total: 10 }
      ]
    },
    {
      id: 3,
      title: "Chemistry Concept Test",
      date: "2023-05-01",
      score: 21,
      percentile: 88.7,
      timeSpent: "42m",
      accuracy: 84,
      rank: 2876,
      subjects: [
        { name: "Organic", score: 8, total: 10 },
        { name: "Inorganic", score: 6, total: 10 },
        { name: "Physical", score: 7, total: 10 }
      ]
    }
  ];

  const performanceMetrics = {
    testsTaken: 12,
    averageScore: 72.5,
    highestScore: 89,
    improvementRate: "+15%",
    accuracy: 74.3,
    timeManagement: 68.2
  };

  const toggleTestExpand = (id) => {
    setExpandedTest(expandedTest === id ? null : id);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            variants={fadeIn}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Your Progress Dashboard
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="text-lg sm:text-xl text-orange-100 max-w-3xl mx-auto"
          >
            Track your performance, identify strengths, and improve weak areas
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <motion.div 
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <FiCalendar className="text-gray-500 dark:text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="all-time">All Time</option>
              </select>
            </div>
            <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <FiDownload className="mr-2" />
              Export Report
            </button>
          </div>
        </motion.div>

        {/* Performance Overview */}
        <motion.div 
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-orange-500 text-orange-600 dark:text-orange-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('subjects')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'subjects' ? 'border-orange-500 text-orange-600 dark:text-orange-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Subject Analysis
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'timeline' ? 'border-orange-500 text-orange-600 dark:text-orange-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Progress Timeline
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'overview' && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <MetricCard 
                  icon={<FiBarChart2 className="text-orange-500" />}
                  title="Average Score"
                  value={`${performanceMetrics.averageScore}%`}
                  change="+5.2% from last month"
                  positive={true}
                />
                <MetricCard 
                  icon={<FiTrendingUp className="text-blue-500" />}
                  title="Improvement Rate"
                  value={performanceMetrics.improvementRate}
                  change="Consistent growth"
                  positive={true}
                />
                <MetricCard 
                  icon={<FiAward className="text-green-500" />}
                  title="Highest Score"
                  value={`${performanceMetrics.highestScore}%`}
                  change="Achieved on May 15"
                  positive={true}
                />
                <MetricCard 
                  icon={<FiBook className="text-purple-500" />}
                  title="Accuracy"
                  value={`${performanceMetrics.accuracy}%`}
                  change="+3.1% from last month"
                  positive={true}
                />
                <MetricCard 
                  icon={<FiClock className="text-yellow-500" />}
                  title="Time Management"
                  value={`${performanceMetrics.timeManagement}%`}
                  change="Needs improvement"
                  positive={false}
                />
                <MetricCard 
                  icon={<FiAward className="text-red-500" />}
                  title="Tests Taken"
                  value={performanceMetrics.testsTaken}
                  change="3 this week"
                  positive={true}
                />
              </motion.div>
            )}
            {activeTab === 'subjects' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Subject-wise Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SubjectProgress 
                    name="Physics"
                    score={72}
                    improvement="+8%"
                    topics={[
                      { name: "Mechanics", proficiency: 80 },
                      { name: "Electrodynamics", proficiency: 65 },
                      { name: "Optics", proficiency: 75 },
                      { name: "Modern Physics", proficiency: 70 }
                    ]}
                  />
                  <SubjectProgress 
                    name="Chemistry"
                    score={78}
                    improvement="+12%"
                    topics={[
                      { name: "Physical", proficiency: 82 },
                      { name: "Organic", proficiency: 75 },
                      { name: "Inorganic", proficiency: 77 }
                    ]}
                  />
                  <SubjectProgress 
                    name="Mathematics"
                    score={68}
                    improvement="+5%"
                    topics={[
                      { name: "Algebra", proficiency: 70 },
                      { name: "Calculus", proficiency: 65 },
                      { name: "Coordinate Geometry", proficiency: 72 },
                      { name: "Trigonometry", proficiency: 65 }
                    ]}
                  />
                </div>
              </div>
            )}
            {activeTab === 'timeline' && (
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Progress timeline chart will be displayed here</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Test History */}
        <motion.div 
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold flex items-center">
              <FiBook className="mr-2 text-orange-500" />
              Test History
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {testHistory.map((test) => (
              <div key={test.id} className="p-6">
                <div 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                  onClick={() => toggleTestExpand(test.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{test.title}</h3>
                    <div className="flex flex-wrap items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-4">
                        <FiCalendar className="mr-1" />
                        {new Date(test.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center mr-4">
                        <FiClock className="mr-1" />
                        {test.timeSpent}
                      </span>
                      <span className="flex items-center">
                        <FiAward className="mr-1" />
                        Rank: {test.rank.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0">
                    <div className="text-right mr-4">
                      <span className="block text-lg font-bold text-orange-600 dark:text-orange-400">
                        {test.score}%
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {test.percentile}% Percentile
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      {expandedTest === test.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>
                
                {expandedTest === test.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Accuracy</h4>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${test.accuracy}%` }}
                          ></div>
                        </div>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          {test.accuracy}% questions correct
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Time Spent</h4>
                        <div className="flex items-center">
                          <FiClock className="mr-2 text-blue-500" />
                          <span>{test.timeSpent}</span>
                        </div>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          vs average 2h 55m
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Percentile</h4>
                        <div className="flex items-center">
                          <FiAward className="mr-2 text-purple-500" />
                          <span>{test.percentile}%</span>
                        </div>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          Top {100 - test.percentile}% of test takers
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium mb-2">Subject-wise Breakdown</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {test.subjects.map((subject, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{subject.name}</span>
                            <span className="text-sm">{subject.score}/{subject.total}</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${(subject.score / subject.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 font-medium">
                        View Detailed Analysis
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <button className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 font-medium">
              Load More Tests
            </button>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div 
          variants={fadeIn}
          className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl overflow-hidden shadow-lg relative"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 p-6 sm:p-8 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Personalized Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Focus on Electrodynamics",
                  description: "Your weakest area in Physics (65% proficiency)",
                  action: "Practice Now"
                },
                {
                  title: "Improve Time Management",
                  description: "You're spending 12% more time than average",
                  action: "Take Speed Tests"
                },
                {
                  title: "Revise Organic Chemistry",
                  description: "Key area with 75% proficiency - aim for 85%+",
                  action: "Study Plan"
                }
              ].map((rec, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:border-white/30 transition-colors">
                  <h3 className="font-medium mb-2">{rec.title}</h3>
                  <p className="text-sm opacity-80 mb-3">{rec.description}</p>
                  <button className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">
                    {rec.action}
                  </button>
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

const MetricCard = ({ icon, title, value, change, positive }) => {
  return (
    <motion.div
      variants={fadeIn}
      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
    >
      <div className="flex items-start">
        <div className="p-2 rounded-lg mr-4 bg-white dark:bg-gray-600 shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-xl font-bold mt-1">{value}</p>
          <p className={`text-xs mt-1 ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {change}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const SubjectProgress = ({ name, score, improvement, topics }) => {
  return (
    <motion.div
      variants={fadeIn}
      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">{name}</h3>
        <div className="text-right">
          <span className="block text-lg font-bold text-orange-600 dark:text-orange-400">{score}%</span>
          <span className="block text-xs text-green-600 dark:text-green-400">{improvement}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {topics.map((topic, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span>{topic.name}</span>
              <span>{topic.proficiency}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  topic.proficiency >= 80 ? 'bg-green-500' :
                  topic.proficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${topic.proficiency}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

};

export default ProgressPage;