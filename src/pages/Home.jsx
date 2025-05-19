import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQs from "../components/FAQ";
import { BG, bg3 } from "../assets/script";
import Slider from "../components/Slider";
import { homePageFAQs, info, quality } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";

import { 
  ChevronDownIcon,
  BoltIcon,
  LockClosedIcon,
  CalendarIcon,
  StarIcon,
  MoonIcon,
  SunIcon,
  LockOpenIcon,
  LockClosedIcon as LockIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon
} from "@heroicons/react/24/solid";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const Home = ({ isLoggedIn }) => {
    const LoggedIn = false  ;
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or prefer-color-scheme for initial value
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [infoRef, infoInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [qualityRef, qualityInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsData, setStatsData] = useState({
    mentees: 10000,
    mentors: 5000,
    states: 10
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStatsData({
          mentees: data.mentees,
          mentors: data.mentors,
          states: data.states
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStatsData({
          mentees: 10000,
          mentors: 5000,
          states: 10
        });
      }
    };

    const timer = setTimeout(() => {
      fetchStats();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Premium plans data
  const premiumPlans =
    [
          {
            title: "JOSAA Choice Filling",
            tag: "Most Popular",
            price: "₹599",
            sessions: "Till Jossa Counselling",
            features: [
              "Optimal branch-institute selection",
              "Round-wise strategy planning",
              "Cutoff analysis & prediction",
              "Document verification support"
            ],
            highlight: true
          },
          {
            title: "JAC Delhi Counselling",
            price: "₹399",
            sessions: "Till Counselling",
            features: [
              "College preference strategy",
              "Cutoff trend analysis",
              "Course selection guidance",
              "Document preparation help"
            ]
          },
          {
            title: "UPTAC Counselling Support",
            price: "₹399",
            sessions: "Till Counselling",
            features: [
              "State-specific guidance",
              "College ranking advice",
              "Seat matrix analysis",
              "Fee structure explanation"
            ]
          },
          {
            title: "WhatsApp Support Package",
            price: "₹999",
            sessions: "Till Jossa Counselling",
            features: [
              "24/7 query resolution",
              "Quick document review",
              "Application assistance",
              "Deadline reminders"
            ]
          }
  ];

  return (
    <motion.div 
      initial="hidden" 
      animate="visible"
      className="overflow-x-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed z-50 bottom-6 right-6 bg-gray-800 dark:bg-orange-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>

      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} theme={darkMode ? 'dark' : 'light'} />

      {/* Hero Section */}
      <motion.section
        id="hero"
        className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden px-4"
        variants={fadeIn}
      >
        {/* Animated Background Elements (Reduced on mobile) */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute rounded-full bg-orange-400/20 dark:bg-orange-400/20"
              style={{
                width: `${Math.random() * 150 + 50}px`,
                height: `${Math.random() * 150 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Background Image with overlay */}
        <div className="absolute inset-0 bg-black/60 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 sm:scale-105"
            style={{ 
              backgroundImage: `url(${BG})`,
              filter: "blur(2px) brightness(.4)"
            }}
            aria-label="Background image of students"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-2 sm:px-4 max-w-4xl mx-auto">
          <motion.h1 
            className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-orange-400">CollegeSecracy</span> Bridges The Gap
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-200 dark:text-gray-300 mb-6 sm:mb-10 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect with mentors and mentees, share knowledge, and grow together
          </motion.p>

          {/* Buttons */}
          {!isLoggedIn && (
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/authForm?type=register"
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Register Now
              </Link>
              <Link
                to="/authForm?type=login"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Login
              </Link>
            </motion.div>
          )}

          {/* Scroll indicator */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce mt-8 sm:mt-16"
          >
            <ChevronDownIcon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section 
        id="stats" 
        className="py-12 sm:py-16 bg-gray-200 dark:bg-gray-800" 
        ref={statsRef}
        variants={staggerContainer}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
      >
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white" variants={fadeIn}>
            Our Impact
          </motion.h2>
          <motion.p className="text-lg sm:text-2xl xl:text-3xl font-medium mb-8 sm:mb-16 text-orange-600 dark:text-orange-400" variants={fadeIn}>
            <CountUp 
              start={0} 
              end={statsData.mentees} 
              duration={3} 
              separator="," 
              className="font-bold"
            />+ Professionals Trust CollegeSecracy
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              { value: statsData.mentees, label: "Mentees Helped" },
              { value: statsData.mentors, label: "Registered Mentors" },
              { value: statsData.states, label: "States Represented" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-orange-500/20 to-blue-500/20 p-1 rounded-xl"
                variants={fadeIn}
              >
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full">
                  <p className="text-3xl sm:text-4xl xl:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-1 sm:mb-2">
                    {statsInView && (
                      <CountUp 
                        start={0} 
                        end={stat.value} 
                        duration={2} 
                        separator="," 
                      />
                    )}+
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Highlight Section */}
      <motion.section 
        className="py-12 sm:py-16 bg-white dark:bg-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
            Why Students <span className="text-orange-600 dark:text-orange-400">Love Us</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <BoltIcon className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600 dark:text-orange-400" />,
                title: "Instant Matching",
                desc: "Get paired with ideal mentors in under 24 hours"
              },
              {
                icon: <LockClosedIcon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />,
                title: "Secure Platform",
                desc: "End-to-end encrypted communications"
              },
              {
                icon: <CalendarIcon className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600 dark:text-orange-400" />,
                title: "Flexible Scheduling",
                desc: "Book sessions at your convenience"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 rounded-xl text-center hover:shadow-lg transition-all"
                variants={fadeIn}
              >
                <div className="bg-gray-200 dark:bg-gray-700 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>


{/* Premium Counselling Section   */}
<motion.section 
   id="counseling-plans"
  className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.8 }}
>
  {/* Glassmorphic background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-400/10 backdrop-blur-[100px]"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-400/10 backdrop-blur-[100px]"></div>
    <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-purple-400/10 backdrop-blur-[120px] transform -translate-x-1/2 -translate-y-1/2"></div>
  </div>
  
  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <div className="text-center mb-16">
      <motion.div
        className="inline-block bg-gradient-to-r from-orange-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        PREMIUM SERVICES
      </motion.div>
      <motion.h2 
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">Counselling</span> Packages
      </motion.h2>
      <motion.p 
        className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        Premium guidance from IIT/NIT alumni with 10+ years of admission expertise
      </motion.p>
    </div>

    {/* Mobile View - Horizontal Scroll */}
    <div className="md:hidden overflow-x-auto pb-6">
      <div className="flex space-x-6 w-max px-4">
        {premiumPlans.map((plan, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02 }}
            className={`w-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 ${plan.highlight ? 'ring-2 ring-orange-500' : ''}`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="p-6 h-full flex flex-col">
              {plan.tag && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-4 shadow-lg backdrop-blur-sm">
                  {plan.tag}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{plan.title}</h3>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                {plan.price}
                <span className="text-sm text-gray-500 dark:text-gray-400">/package</span>
              </div>
              <div className="flex items-center mb-4 bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                <CalendarIcon className="h-5 w-5 mr-2 text-orange-500" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">{plan.sessions}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
              to="/authForm?type=register"
                className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center backdrop-blur-sm ${
                  plan.highlight 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                    : 'bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                }`}
              >
                {plan.highlight ? 'Get Premium' : 'Choose Plan'}
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Desktop View - Grid Layout */}
    <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {premiumPlans.map((plan, index) => (
        <motion.div 
          key={index}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`rounded-xl overflow-hidden shadow-lg backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 ${
            plan.highlight ? 'transform scale-[1.02] z-10 border-2 border-orange-500' : ''
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="p-6 h-full flex flex-col">
            {plan.tag && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-4 shadow-lg backdrop-blur-sm">
                {plan.tag}
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{plan.title}</h3>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-4">
              {plan.price}
              <span className="text-sm text-gray-500 dark:text-gray-400">/package</span>
            </div>
            <div className="flex items-center mb-4 bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded-lg backdrop-blur-sm">
              <CalendarIcon className="h-5 w-5 mr-2 text-orange-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{plan.sessions}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Link 
            to="/authForm?type=register"
              className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center backdrop-blur-sm ${
                plan.highlight 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                  : 'bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-800 dark:text-white'
              }`}
            >
              {plan.highlight ? 'Get Premium' : 'Choose Plan'}
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Coming Soon Notice */}
    <motion.div 
      className="mt-12 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
        <SparklesIcon className="h-4 w-4 mr-2" />
        More specialized counselling packages coming soon!
      </div>
    </motion.div>
  </div>
</motion.section>

      {/* Get Started Section */}
      <motion.section 
        id="info" 
        className="py-12 sm:py-16 bg-white dark:bg-gray-900"
        ref={infoRef}
        variants={staggerContainer}
        initial="hidden"
        animate={infoInView ? "visible" : "hidden"}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div variants={fadeIn}>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Get Started in 3 easy steps</h1>
            <div className="h-1.5 sm:h-2 w-16 sm:w-20 rounded bg-orange-500 mb-8 sm:mb-12"></div>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {info.map((data, index) => (
              <motion.div
                key={index}
                className="w-full sm:w-[45%] md:w-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className="p-4 sm:p-6 text-center h-full flex flex-col">
                  <img 
                    className="w-full h-36 sm:h-40 md:h-48 object-contain mb-3 sm:mb-4 hover:scale-105 transition-transform" 
                    src={data.url} 
                    alt={data.title}
                    loading="lazy"
                  />
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">{data.title}</h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 flex-grow">{data.Description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Tracker */}
          <div className="mt-8 sm:mt-12 md:mt-16 max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
            <h4 className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 text-center">Your mentorship journey:</h4>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
              <div 
                className="bg-orange-500 h-full rounded-full" 
                style={{ width: '33%' }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>1. Sign Up</span>
              <span>2. Find Mentor</span>
              <span>3. Get Guidance</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* What Makes Us Special */}
      <motion.section 
        id="quality" 
        className="py-12 sm:py-16 relative bg-gray-200 dark:bg-gray-800"
        ref={qualityRef}
        variants={staggerContainer}
        initial="hidden"
        animate={qualityInView ? "visible" : "hidden"}
      >
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <img 
            className="w-full h-full object-cover" 
            src={bg3} 
            alt="Quality background" 
            loading="lazy"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div variants={fadeIn}>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-white">What makes CollegeSecracy better?</h1>
            <div className="h-1.5 sm:h-2 w-16 sm:w-20 rounded bg-orange-500 mb-8 sm:mb-12"></div>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {quality.map((data, index) => (
              <motion.div
                key={index}
                className="w-full sm:w-[45%] md:w-[300px] bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-105"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className="p-4 sm:p-6 text-center h-full flex flex-col">
                  <img 
                    className="w-full h-36 sm:h-40 md:h-48 object-contain mb-3 sm:mb-4 hover:rotate-6 transition-transform" 
                    src={data.url} 
                    alt={data.title}
                    loading="lazy"
                  />
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">{data.title}</h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 flex-grow">{data.Description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

{/* Tools Section */}
<motion.section 
  id="tools"
  className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  {/* Abstract Background Elements */}
  <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-30 pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-blue-500/10 to-orange-500/10 dark:from-gray-900/80 dark:via-blue-900/30 dark:to-orange-900/30"></div>
    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-900/20"></div>
    <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl dark:bg-orange-900/20"></div>
  </div>

  {/* SVG Decorations */}
  <svg className="absolute top-10 left-10 w-24 h-24 text-blue-500/20 dark:text-blue-900/30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 6V4M8 8H6M16 8h2M12 18v2M8 16H6M16 16h2" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" strokeWidth="1.5"/>
  </svg>
  <svg className="absolute bottom-10 right-10 w-24 h-24 text-orange-500/20 dark:text-orange-900/30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M8 3v4m0 0V3m0 4H4m4 0h4m8 0h4m-4 0V3m0 4v4m-8 10v4m0-4v4m0-4H8m8 0h4m-4 0h-4" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>

  <div className="container mx-auto px-4 sm:px-6 relative z-0">
    <div className="text-center mb-16">
      <motion.h2 
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-500 dark:from-orange-400 dark:to-blue-400">Academic Journey</span>
      </motion.h2>
      <motion.div 
        className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto rounded-full mb-6"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.p 
        className="mt-6 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Our powerful suite of tools helps you analyze, predict and optimize your academic performance with precision
      </motion.p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Rank Calculator */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -10 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50"
      >
        <div className="p-8 h-full flex flex-col relative">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-blue-500/10 dark:bg-blue-900/20 blur-xl"></div>
          <div className="bg-gradient-to-r from-orange-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg z-10">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Rank Calculator</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Instantly calculate your exact position among peers based on exam scores and total participants
          </p>
          <Link 
            to={LoggedIn ? "/tools/rank-calculator" : "/authForm"}
            className="mt-auto bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-500 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 inline-flex items-center justify-center"
          >
            <span>Calculate Rank</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </motion.div>

      {/* Percentile Calculator */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ y: -10 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50"
      >
        <div className="p-8 h-full flex flex-col relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-orange-500/10 dark:bg-orange-900/20 blur-xl"></div>
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg z-10">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Percentile Calculator</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Determine your exact percentile ranking to understand how you compare with other test takers
          </p>
          <Link 
            to={LoggedIn ? "/tools/percentile-calculator" : "/authForm"}
            className="mt-auto bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-500 hover:to-orange-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 inline-flex items-center justify-center"
          >
            <span>Find Percentile</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </motion.div>

      {/* College Predictor */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ y: -10 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50"
      >
        <div className="p-8 h-full flex flex-col relative">
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-r from-orange-500/10 to-blue-500/10 dark:from-orange-900/20 dark:to-blue-900/20 blur-xl"></div>
          <div className="bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg z-10">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">College Predictor</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Discover which colleges you can get into based on your rank, category, and previous cutoffs
          </p>
          <Link 
            to={LoggedIn ? "/tools/college-predictor" : "/authForm"}
            className="mt-auto bg-gradient-to-r from-orange-600 via-blue-600 to-orange-600 hover:from-orange-500 hover:via-blue-500 hover:to-orange-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 inline-flex items-center justify-center"
          >
            <span>Predict Colleges</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Additional Tools */}
    <motion.div 
      className="mt-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">More Powerful Tools</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { 
            name: "CGPA Calculator", 
            icon: "🧮", 
            description: "Calculate and track your GPA/CGPA across semesters",
            path: "/tools/cgpa-calculator" 
          },
          { 
            name: "Marking Scheme", 
            icon: "📝", 
            description: "Understand exam patterns and scoring systems",
            path: "/tools/marking-scheme" 
          },
          { 
            name: "Cutoff Analyzer", 
            icon: "📊", 
            description: "Analyze historical cutoff trends for colleges",
            path: "/tools/cutoff-analyzer" 
          },
          { 
            name: "All Tools", 
            icon: "🔧", 
            description: "Explore our complete collection of academic tools",
            path: "/tools" 
          }
        ].map((tool, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300 border border-white/30 dark:border-gray-700/50"
          >
            <Link to={LoggedIn ? tool.path : "/authForm"} className="block">
              <span className="text-4xl block mb-4">{tool.icon}</span>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tool.description}</p>
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm inline-flex items-center">
                Explore Tool
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Call to Action */}
    {!LoggedIn && (
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30 dark:border-gray-700/50">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to unlock all tools?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Create your free account to access all our premium academic tools and calculators
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/authForm?type=register"
              className="bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-500 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/authForm?type=login"
              className="bg-white/90 hover:bg-white text-gray-900 font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </motion.div>
    )}
  </div>
</motion.section>


      {/* Review Section */}
      <motion.section 
        id="review" 
        className="py-12 sm:py-16 bg-white dark:bg-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Student Reviews</h1>
          <div className="h-1.5 sm:h-2 w-16 sm:w-20 rounded bg-orange-500 mb-8 sm:mb-12"></div>
          
          <div className="relative">
            <Slider />
          </div>
        </div>
      </motion.section>

      {/* FAQs Section */}
      <motion.section 
        className="py-12 sm:py-16 bg-gray-100 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <FAQs FAQs={homePageFAQs} darkMode={darkMode} />
        </div>
      </motion.section>

      {/* Call to Action */}
      {!isLoggedIn && (
        <motion.section 
          className="py-12 sm:py-16 bg-gradient-to-r from-orange-600 via-blue-600 to-orange-800 text-white text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Ready to find your perfect mentor?</h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-orange-100">Join thousands of students who have accelerated their careers with CollegeSecracy</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                to="/authForm?type=register"
                className="bg-white text-orange-700 font-bold px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Sign Up Free
              </Link>
              <Link
                to="/about"
                className="bg-transparent border-2 border-white text-white font-bold px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg rounded-md hover:bg-white hover:text-orange-700 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <Footer theme={darkMode ? 'dark': 'light'}/>
    </motion.div>
  );
}; 

export default Home;