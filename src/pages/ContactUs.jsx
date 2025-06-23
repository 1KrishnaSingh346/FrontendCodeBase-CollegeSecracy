import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contactPageFAQs } from '../utils/constants';
import FAQs from '../components/FAQ';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone, MessageSquare, MapPin, Clock, User, HelpCircle, ChevronRight } from 'lucide-react';
import axios from 'axios';
import api from '@/lib/axios';
import useAuthStore from "@/store/useAuthStore";
import { FiUser, FiLogOut } from "react-icons/fi";

const ContactUs = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    message: '', 
    queryType: 'general' 
  });
  const [formStatus, setFormStatus] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', message: 'Sending your message...' });
    
    try {
      const response = await api.post('/api/v1/contact/send', formData);
      
      if (response.data.status === 'success') {  
        setFormStatus({ 
          type: 'success', 
          message: response.data.message || 'Thank you for reaching out! We will get back to you soon.' 
        });
        setFormData({ name: '', email: '', message: '', queryType: 'general' });
      } else {
        setFormStatus({ 
          type: 'error', 
          message: response.data.message || 'Something went wrong. Please try again later.' 
        });
      }
    } catch (error) {
      setFormStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to send message. Please try again or contact us directly.' 
      });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      {/* Navbar with Glassmorphic Effect */}
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
            <Link to="/" className="text-xl md:text-3xl font-bold bg-gradient-to-r flex justify-between items-center from-blue-600 to-orange-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-orange-400 transition-all duration-300">
              <GraduationCap className="text-orange-500 md:size-10 size-8"/>College<span className=" text-blue-500">Secracy</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation with glass cards */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Link 
                to="/" 
                className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-all duration-300 ${darkMode ? 
                  'text-gray-300 hover:text-white hover:bg-gray-700/50' : 
                  'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'}`}
              >
                Home
              </Link>
              <a 
                href="#contact-form" 
                className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-orange-400 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Contact Us</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              <Link 
                to="/about" 
                className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-all duration-300 ${darkMode ? 
                  'text-gray-300 hover:text-white hover:bg-gray-700/50' : 
                  'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'}`}
              >
                About
              </Link>
              {user ? (
                <div className="relative">
                  <button
                    onClick={handleProfileToggle}
                    className="flex items-center space-x-1 px-3 py-1 md:px-3 md:py-2 rounded-lg transition-all duration-300"
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
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/70'}`}
                        onClick={() => setIsProfileOpen(false)}
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
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium border transition-all duration-300 ${darkMode ? 
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
          <a
            href='#contact-form'
            className="block px-3 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </a>
          <Link
            to="/about"
            className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${darkMode ? 
              'text-gray-300 hover:text-white hover:bg-gray-700/50' : 
              'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
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
                onClick={handleLogout}
                className={`block w-full text-left px-3 py-3 rounded-lg text-base font-medium ${darkMode ? 
                  'text-red-400 hover:bg-gray-700/50' : 
                  'text-red-600 hover:bg-gray-100/70'}`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
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

      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${darkMode ? 'from-gray-900/90 to-gray-900/70' : 'from-blue-500/20 to-orange-500/20'}`}></div>
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
          alt="Support team background" 
          className="w-full h-64 md:h-96 object-cover"
          loading="lazy"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl md:text-6xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              We're Here to Help
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-lg md:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Our support team is ready to assist you with any questions or issues you might have.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <a 
                href="#contact-form" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 transition-all duration-300"
              >
                Contact Us Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Support Options Section */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-orange-400' : 'text-blue-600'}`}>
              How Can We Help You Today?
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose the support option that works best for you. We're available 24/7 to ensure you get the help you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email Support Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-100 text-blue-600'}`}>
                <Mail className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Email Support</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Send us an email and we'll get back to you within 24 hours with a detailed response.
              </p>
              <a 
                href="mailto:helpcollegesecracy@gmail.com" 
                className={`inline-flex items-center font-medium ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                Email Us
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </motion.div>

            {/* Live Chat Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-100 text-blue-600'}`}>
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Live Chat</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Chat with our support team in real-time for immediate assistance with your questions.
              </p>
              <a 
                href="https://t.me/collegesecracy" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center font-medium ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                Start Chat
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </motion.div>

            {/* Phone Support Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-100 text-blue-600'}`}>
                <Phone className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Phone Support</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Call us directly during business hours for personalized support from our team.
              </p>
              <a 
                href="" 
                className={`inline-flex items-center font-medium ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-blue-600 hover:text-blue-500'}`}
              >
                Coming Soon
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="mb-16 md:mb-24">
          <div className={`p-8 rounded-xl shadow-lg overflow-hidden relative ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Decorative SVG Elements */}
            <div className="absolute top-0 right-0 opacity-10">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 0C44.8 0 0 44.8 0 100C0 155.2 44.8 200 100 200C155.2 200 200 155.2 200 100C200 44.8 155.2 0 100 0ZM100 180C55.8 180 20 144.2 20 100C20 55.8 55.8 20 100 20C144.2 20 180 55.8 180 100C180 144.2 144.2 180 100 180Z" fill={darkMode ? "#F97316" : "#2563EB"} />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 opacity-10">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 200C155.2 200 200 155.2 200 100C200 44.8 155.2 0 100 0C44.8 0 0 44.8 0 100C0 155.2 44.8 200 100 200ZM100 20C144.2 20 180 55.8 180 100C180 144.2 144.2 180 100 180C55.8 180 20 144.2 20 100C20 55.8 55.8 20 100 20Z" fill={darkMode ? "#F97316" : "#2563EB"} />
              </svg>
            </div>

            <div className="relative">
              <div className="text-center mb-8">
                <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-blue-600'}`}>
                  Send Us a Message
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Your Name
                      </div>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border border-gray-300 placeholder-gray-500'}`}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address
                      </div>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border border-gray-300 placeholder-gray-500'}`}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="queryType" className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      How Can We Help?
                    </div>
                  </label>
                  <select
                    id="queryType"
                    name="queryType"
                    value={formData.queryType}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="account">Account Help</option>
                    <option value="feedback">Feedback/Suggestions</option>
                    <option value="policy">Privacy/Terms/Cookie/refund Policy Query</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border border-gray-300 placeholder-gray-500'}`}
                    rows="6"
                    placeholder="Tell us how we can help..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:from-blue-500 hover:to-orange-400 transition duration-300 shadow-md flex items-center justify-center"
                  disabled={formStatus?.type === 'loading'}
                >
                  {formStatus?.type === 'loading' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                {formStatus && (
                  <div className={`mt-4 p-3 rounded-lg text-center ${formStatus.type === 'success' ? 
                    (darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700') : 
                    (darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700')}`}>
                    {formStatus.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Support Resources Section */}
        <section className={`p-8 rounded-xl shadow-lg mb-16 md:mb-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-blue-600'}`}>
              Helpful Resources
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Check out these resources before contacting us - you might find your answer right away!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a 
              href="/faq" 
              className={`p-6 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg mr-4 ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-100 text-blue-600'}`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>FAQs</h4>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Browse our frequently asked questions to find quick answers to common questions.
              </p>
            </a>

            <a 
              href="/knowledge-base" 
              className={`p-6 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg mr-4 ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-100 text-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Knowledge Base</h4>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Detailed articles and guides to help you make the most of our services.
              </p>
            </a>

            <a 
              href="/community" 
              className={`p-6 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg mr-4 ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-100 text-blue-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Community Forum</h4>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Connect with other users and get help from our active community.
              </p>
            </a>
          </div>
        </section>

        {/* Location Section */}
        <section className={`p-8 rounded-xl shadow-lg mb-16 md:mb-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? 'text-orange-400' : 'text-blue-600'}`}>
                Visit Our Office
              </h3>
              
              <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-start mb-4">
                  <MapPin className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 ${darkMode ? 'text-orange-400' : 'text-blue-600'}`} />
                  <div>
                    <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Address</h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      123 College Street, Suite 456<br />
                      College City, CC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start mb-4">
                  <Phone className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 ${darkMode ? 'text-orange-400' : 'text-blue-600'}`} />
                  <div>
                    <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Phone</h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      +1 (123) 456-7890<br />
                      Mon-Fri, 9am-5pm EST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 ${darkMode ? 'text-orange-400' : 'text-blue-600'}`} />
                  <div>
                    <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Business Hours</h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=123+College+Street,+College+City,+Country"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg text-center font-medium transition duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  Get Directions
                </a>
                <a
                  href="tel:+11234567890"
                  className={`p-3 rounded-lg text-center font-medium transition duration-300 ${darkMode ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  Call Now
                </a>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-md h-64 md:h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215256064576!2d-73.98811768459375!3d40.74844017932799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629999999999!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className={`${darkMode ? 'grayscale-[50%]' : ''}`}
              ></iframe>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQs FAQs={contactPageFAQs} page={"contact"} darkMode={darkMode} />

        {/* Fixed Contact Buttons */}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col space-y-2 md:space-y-3">
          <a 
            href="https://t.me/collegesecracy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`p-3 md:p-4 rounded-full shadow-lg flex items-center justify-center ${darkMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} transition duration-300`}
            aria-label="Live chat"
          >
            <MessageSquare className="text-white w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a 
            href="#" 
            className={`p-3 md:p-4 rounded-full shadow-lg flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} transition duration-300 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            aria-label="Call us"
          >
            <Phone className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-orange-400' : 'text-blue-600'}`} />
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-8 md:py-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h4 className={`text-base md:text-lg font-bold mb-3 md:mb-4 ${darkMode ? 'text-orange-400' : 'text-blue-400'}`}>CollegeSecracy</h4>
              <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>
                Empowering students with authentic guidance for their college journey.
              </p>
            </div>
            <div>
              <h4 className={`text-base md:text-lg font-bold mb-3 md:mb-4 ${darkMode ? 'text-orange-400' : 'text-blue-400'}`}>Quick Links</h4>
              <ul className="space-y-1 md:space-y-2">
                <li><Link to="/" className={`text-xs md:text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-300 hover:text-blue-400'}`}>Home</Link></li>
                <li><Link to="/about" className={`text-xs md:text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-300 hover:text-blue-400'}`}>About Us</Link></li>
                <li><Link to="/contact" className={`text-xs md:text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-300 hover:text-blue-400'}`}>Contact</Link></li>
                <li><Link to="/faq" className={`text-xs md:text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-300 hover:text-blue-400'}`}>FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className={`text-base md:text-lg font-bold mb-3 md:mb-4 ${darkMode ? 'text-orange-400' : 'text-blue-400'}`}>Legal</h4>
              <ul className="space-y-1 md:space-y-2">
                <li><Link to="/privacy" className={`text-xs md:text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-300 hover:text-blue-400'}`}>Privacy Policy</Link></li>
                <li><Link to="/terms" className={`text-xs md:text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-300 hover:text-blue-400'}`}>Terms of Service</Link></li>
                <li><Link to="/cookies" className={`text-xs md:text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-300 hover:text-blue-400'}`}>Cookie Policy</Link></li>
                <li><Link to="/refund" className={`text-xs md:text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-300 hover:text-blue-400'}`}>Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className={`text-base md:text-lg font-bold mb-3 md:mb-4 ${darkMode ? 'text-orange-400' : 'text-blue-400'}`}>Newsletter</h4>
              <p className={`text-xs md:text-sm mb-3 md:mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>
                Subscribe to our newsletter for the latest updates.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-l-lg text-xs md:text-sm w-full ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-800 text-white placeholder-gray-300'}`}
                />
                <button className={`px-3 py-1 md:px-4 md:py-2 rounded-r-lg text-xs md:text-sm font-medium ${darkMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className={`border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-800 text-gray-300'}`}>
            <p>&copy; {new Date().getFullYear()} CollegeSecracy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;