import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Founders, TeamMembers, Milestones, Testimonials } from '../utils/constants';
import { Mission, Tailored } from '../assets/script';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import {FiUser, FiLogOut } from "react-icons/fi";

const AboutUs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');
  const {user, logout} = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white/10 text-gray-900'}`}>
     {/* Enhanced Glassmorphic Navbar */}
<nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${darkMode ? 'bg-gray-900/80 shadow-gray-900/30' : 'bg-white/80 shadow-gray-200/30'} border-b ${darkMode ? 'border-gray-700/30' : 'border-gray-200/30'}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo with enhanced animation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="flex-shrink-0"
      >
        <Link to="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r flex justify-between items-center from-blue-600 to-orange-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-orange-400 transition-all duration-300">
          <GraduationCap className="text-orange-500 md:size-10 size-8"/>College<span className=" text-blue-500">Secracy</span>
        </Link>
      </motion.div>

      {/* Desktop Navigation with glass cards */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${darkMode ? 
              'text-gray-300 hover:text-white hover:bg-gray-700/50' : 
              'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-orange-400 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">About Us</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
          <Link 
            to="/contact" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${darkMode ? 
              'text-gray-300 hover:text-white hover:bg-gray-700/50' : 
              'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'}`}
          >
            Contact
          </Link>
          {user ? (
            <div className="relative">
              <button
                onClick={handleProfileToggle}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300"
              >
                {user.profilePic?.url ? (
                  <img 
                    src={user.profilePic?.url} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-400"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center text-white">
                    <FiUser className="w-4 h-4" />
                  </div>
                )}
              </button>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30 z-50 overflow-hidden"
                >
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/70'}`}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/70'}`}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-gray-700/50' : 'text-red-600 hover:bg-gray-100/70'}`}
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 ${darkMode ? 
                'text-gray-300 border-gray-600 hover:border-orange-400 hover:text-orange-400 hover:bg-gray-700/50' : 
                'text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-500 hover:bg-gray-100/70'}`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu button with animation */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`inline-flex items-center justify-center p-2 rounded-lg focus:outline-none transition-all duration-300 ${darkMode ? 
            'text-gray-300 hover:text-white hover:bg-gray-700/50' : 
            'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'}`}
        >
          {isMenuOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 180, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="menu"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </motion.svg>
          )}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu with glassmorphic effect */}
  <motion.div 
    initial={{ opacity: 0, height: 0 }}
    animate={{ 
      opacity: isMenuOpen ? 1 : 0,
      height: isMenuOpen ? 'auto' : 0
    }}
    transition={{ duration: 0.3 }}
    className={`md:hidden overflow-hidden ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md`}
  >
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <Link
        to="/"
        className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${darkMode ? 
          'text-gray-300 hover:text-white hover:bg-gray-700/50' : 
          'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/about"
        className="block px-3 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 transition-all duration-300"
        onClick={() => setIsMenuOpen(false)}
      >
        About Us
      </Link>
      <Link
        to="/contact"
        className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${darkMode ? 
          'text-gray-300 hover:text-white hover:bg-gray-700/50' : 
          'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        Contact
      </Link>
      {user ? (
        <>
          <Link
            to="/profile"
            className={`block px-3 py-3 rounded-lg text-base font-medium ${darkMode ? 
              'text-gray-300 hover:text-white hover:bg-gray-700/50' : 
              'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            My Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className={`block w-full text-left px-3 py-3 rounded-lg text-base font-medium ${darkMode ? 
              'text-red-400 hover:bg-gray-700/50' : 
              'text-red-600 hover:bg-gray-100/70'}`}
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/signup"
          className={`block px-3 py-3 rounded-lg text-base font-medium border transition-all duration-300 ${darkMode ? 
            'text-gray-300 border-gray-600 hover:border-orange-400 hover:text-orange-400 hover:bg-gray-700/50' : 
            'text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-500 hover:bg-gray-100/70'}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Sign In
        </Link>
      )}
    </div>
  </motion.div>
</nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero About Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={`relative py-16 rounded-xl mb-20 overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-400 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
            >
              Our Story
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-lg sm:text-xl mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              CollegeSecracy was born from a simple idea: every student deserves authentic guidance when making one of life's most important decisions. What started as a campus project has grown into a nationwide movement.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/signup"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Join Our Community
              </Link>
              <Link
                to="/contact"
                className={`px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 border border-gray-300'}`}
              >
                Contact Our Team
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* About Tabs Navigation */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`flex flex-wrap justify-center mb-12 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}
        >
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-6 py-3 font-medium text-sm md:text-base ${activeTab === 'mission' ? 'text-blue-600 border-b-2 border-blue-600' : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Our Mission
          </button>
          <button
            onClick={() => setActiveTab('values')}
            className={`px-6 py-3 font-medium text-sm md:text-base ${activeTab === 'values' ? 'text-blue-600 border-b-2 border-blue-600' : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Our Values
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`px-6 py-3 font-medium text-sm md:text-base ${activeTab === 'impact' ? 'text-blue-600 border-b-2 border-blue-600' : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Our Impact
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-6 py-3 font-medium text-sm md:text-base ${activeTab === 'team' ? 'text-blue-600 border-b-2 border-blue-600' : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Our Team
          </button>
        </motion.div>

        {/* Tab Content */}
        <div className="mb-20">
          {/* Mission Tab */}
          {activeTab === 'mission' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Empowering Students Through Authentic Guidance</h2>
                <p className={`mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  At CollegeSecracy, we believe that choosing a college shouldn't be based solely on rankings or marketing materials. Our mission is to connect students with real experiences from peers who have walked the path before them.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Authentic peer-to-peer mentorship</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Transparent, unbiased information</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Affordable access to quality guidance</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src={Mission}
                  alt="Our Mission"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
          )}

          {/* Values Tab */}
          {activeTab === 'values' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src={Tailored}
                  alt="Our Values"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div>
                <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>The Principles That Guide Us</h2>
                <div className="space-y-8">
                  <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-xl font-bold text-blue-600 mb-3">Integrity</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      We prioritize honesty and transparency in all our interactions. Every review and piece of advice on our platform is verified and authentic.
                    </p>
                  </div>
                  <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-xl font-bold text-orange-500 mb-3">Empowerment</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      We believe in empowering students with knowledge and tools to make informed decisions about their future.
                    </p>
                  </div>
                  <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-xl font-bold text-blue-600 mb-3">Community</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Our strength comes from our community of students helping students. We foster connections that go beyond college decisions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Impact Tab */}
          {activeTab === 'impact' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>The Difference We're Making</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className={`p-6 rounded-xl shadow-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="text-5xl font-bold text-blue-600 mb-3">10,000+</div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Students Helped</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>And counting across the country</p>
                </div>
                <div className={`p-6 rounded-xl shadow-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="text-5xl font-bold text-orange-500 mb-3">200+</div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Colleges Covered</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>With detailed reviews and insights</p>
                </div>
                <div className={`p-6 rounded-xl shadow-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="text-5xl font-bold text-blue-600 mb-3">95%</div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Satisfaction Rate</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>From students who used our services</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Success Stories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Testimonials.slice(0, 2).map((testimonial, index) => (
                    <div key={index} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                      <p className="italic mb-4">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm opacity-80">{testimonial.college}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Link to="/testimonials" className="inline-block px-6 py-2 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-colors">
                    Read More Stories
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Meet Our Founders</h2>
              
              {/* Enhanced Founders Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {Founders.map((founder, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    className={`rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
                  >
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-orange-400">
                      <img
                        src={founder.url}
                        alt={founder.Name}
                        className="w-32 h-32 rounded-full border-4 border-white absolute -bottom-16 left-1/2 transform -translate-x-1/2 object-cover"
                      />
                    </div>
                    <div className="pt-20 pb-6 px-6 text-center">
                      <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{founder.Name}</h3>
                      <p className="text-blue-600 mb-3">{founder.Role}</p>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{founder.About}</p>
                      <div className="flex justify-center space-x-4">
                        {founder.socialLinks?.linkedin && (
                          <a href={founder.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-700'}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        )}
                        {founder.socialLinks?.twitter && (
                          <a href={founder.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-400'}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Leadership Team */}
              <h2 className={`text-3xl sm:text-4xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Our Leadership Team</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {TeamMembers.map((member, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    className={`rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 text-center ${darkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-md'}`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{member.name}</h3>
                      <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.department}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Advisory Board */}
              <h2 className={`text-3xl sm:text-4xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Advisory Board</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item, index) => (
                  <div key={index} className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center mb-4">
                      <img
                        src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index + 30}.jpg`}
                        alt={`Advisor ${index + 1}`}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Advisor Name</h3>
                        <p className="text-blue-600">Position</p>
                      </div>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Former Dean of Admissions at Prestigious University with 20+ years of experience in student counseling.
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Our Journey Timeline */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className={`text-3xl sm:text-4xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Our Journey</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 to-orange-500 transform -translate-x-1/2"></div>
            
            <div className="space-y-8 md:space-y-16">
              {Milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative ${index % 2 === 0 ? 'md:pr-8 md:pl-16' : 'md:pl-8 md:pr-16'}`}
                >
                  <div className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`inline-block p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="text-sm font-semibold text-blue-600 mb-1">{milestone.date}</div>
                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{milestone.title}</h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{milestone.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-1/2">
                      {/* Empty space for alignment */}
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 top-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-4 border-white"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Values in Action */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Commitment to Excellence</h2>
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                We don't just talk about our values - we live them every day through our programs, services, and community initiatives.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold mb-1">Quality Assurance</h3>
                    <p className="opacity-90">Every mentor is vetted and every review is verified to ensure you get reliable information.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold mb-1">Accessibility</h3>
                    <p className="opacity-90">We keep our services affordable because we believe quality guidance shouldn't be a privilege.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`p-12 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>By The Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Student satisfaction rate</p>
                </div>
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-4xl font-bold text-orange-500 mb-2">5K+</div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active mentors</p>
                </div>
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Campus partners</p>
                </div>
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Support available</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`relative py-16 rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className={`absolute inset-0 opacity-30 ${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-blue-50 to-orange-50'}`}></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Ready to Join Our Community?</h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Whether you're seeking guidance or looking to share your experience, we welcome you to be part of our growing family.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Sign Up Now
              </Link>
              <Link
                to="/contact"
                className={`px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 border border-gray-300'}`}
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutUs;