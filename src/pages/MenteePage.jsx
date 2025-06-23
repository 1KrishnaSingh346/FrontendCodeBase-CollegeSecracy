import React from 'react';
import api from '@/lib/axios.js';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useAuthStore from '@/store/useAuthStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import StarRating from './StudentPages/Components/StarRating.jsx';
import ToolsSlider from "./StudentPages/Components/ToolSlider.jsx";
import PaymentModal from './StudentPages/Components/PaymentModal.jsx';
import Logo from "/Logo.webp";

import { 
  FiLogOut, 
  FiInfo,
  FiClock,
  FiUser, 
  FiSettings, 
  FiTool, 
  FiLock, 
  FiUnlock,
  FiCalendar,
  FiBook,
  FiAward,
  FiBarChart2,
  FiHelpCircle,
  FiCheckCircle,
  FiArrowRight,
  FiYoutube,
  FiPercent,
  FiDollarSign,
  FiStar,
  FiMail,
  FiHeart,
  FiExternalLink,
  FiMenu,
  FiX,
  FiEdit2,
} from 'react-icons/fi';
import { 
  SunIcon, 
  MoonIcon, 
  CalendarIcon, 
  CheckCircleIcon,  
  SparklesIcon,
  ArrowRightIcon,   
  ChevronDownIcon,
  BoltIcon,
  LockClosedIcon, 
} from "@heroicons/react/24/solid";
import { InitialLoader } from '../components/Loaders/script.js';
import Footer from './StudentPages/Components/Footer.jsx';
import YouTubeSlider from '@/components/YoutubeSlider.jsx';
import QuoteComponent from './StudentPages/Components/QuoteComponent.jsx';
import InteractiveCalendar from './StudentPages/Components/InteractiveCalendar.jsx';
import DashboardStats from './StudentPages/Components/DashboardStats.jsx';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MenteePage = () => {
  const { 
    user, 
    loadUser, 
    logout, 
    createPaymentOrder,
    initiateRazorpayPayment, 
    isLoading,
    menteeGetPlan, 
    feedbackHistory, 
    loadingFeedback,
    fetchFeedbackHistory,
    editFeedback,
    submitFeedback,
    initializeAuth,
    initialAuthCheckComplete
  } = useAuthStore();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: '',
    profilePic: null
  });
  const [feedback, setFeedback] = useState({
    rating: 0,
    message: '',
    category: 'general'
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBundleDetails, setShowBundleDetails] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showPremiumToolsModal, setShowPremiumToolsModal] = useState(false);
  const [paymentModalItem, setPaymentModalItem] = useState(null);
  const [paymentModalType, setPaymentModalType] = useState('tool');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  
  // State for plans
  const [counselingPlans, setCounselingPlans] = useState([]);
  const [premiumTools, setPremiumTools] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [errorPlans, setErrorPlans] = useState(null);

  console.log("Intital auth value : ", initialAuthCheckComplete);
useEffect(() => {
  if (!initialAuthCheckComplete) {
    initializeAuth();
  }
}, [initializeAuth, initialAuthCheckComplete]);

useEffect(() => {
  if (user) {
    setProfileData({
      fullName: user.fullName || '',
      bio: user.bio || '',
      profilePic: user.profilePic?.url || ''
    });
  }
}, [user]);



  // Fetch plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const counsellingData = await menteeGetPlan('counselling');
        const toolsData = await menteeGetPlan('tool');
        
        if (counsellingData) {
          setCounselingPlans(counsellingData);
        }
        if (toolsData) {
          setPremiumTools(toolsData);
        }
      } catch (err) {
        setErrorPlans(err.message || 'Failed to fetch plans');
        console.error('Error fetching plans:', err);
        toast.error('Failed to load plans. Please try again later.');
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);



  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Premium Tools bundle calculations
  const Discount = 30;
  const total = premiumTools.reduce((sum, tool) => sum + tool.price, 0);
  const discountedPrice = Math.round(total * (1 - Discount / 100));
  const savings = Math.round(total * (Discount / 100));

  // Important links
  const importantLinks = [
    {
      name: "JOSAA Counselling",
      url: "https://josaa.nic.in",
      description: "Official website for JOSAA counselling process"
    },
    {
      name: "CSAB Counselling",
      url: "https://csab.nic.in",
      description: "Official website for CSAB counselling process"
    },
    {
      name: "JEE Main",
      url: "https://jeemain.nta.nic.in",
      description: "JEE Main official website"
    },
    {
      name: "JEE Advanced",
      url: "https://jeeadv.ac.in",
      description: "JEE Advanced official website"
    },
    {
      name: "CUET",
      url: "https://cuet.nta.nic.in",
      description: "Common University Entrance Test portal"
    }
  ];

  // Health tips
  const healthTips = [
    "Take regular breaks during study sessions (try the Pomodoro technique)",
    "Maintain a consistent sleep schedule of 7-8 hours",
    "Stay hydrated and eat brain-boosting foods like nuts and berries",
    "Practice mindfulness or meditation for 10 minutes daily",
    "Exercise for at least 30 minutes every day"
  ];

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle click outside profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    toast.success(`Switched to ${newMode ? 'dark' : 'light'} mode`);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePurchaseClick = (item, type) => {
    setPaymentModalItem(item);
    setPaymentModalType(type);
  };

  const handlePurchase = async (planId, couponCode = '') => {
    try {
       setPaymentStatus('initiating');
      const orderResponse = await createPaymentOrder(planId, couponCode);

      if (!orderResponse.success) {
        toast.error(orderResponse.message || 'Failed to create payment order');
        setPaymentModalItem(null);
        return;
      }

      const orderData = orderResponse.data;
      setPaymentStatus('waiting');
const result = await initiateRazorpayPayment(orderData, {
  onPaymentSuccess: () => setPaymentStatus('verifying')
});

      
      if (result.success) {
        toast.success('Payment successful!', {
          duration: 4000,
          icon: '🎉',
          style: {
            background: '#4BB543',
            color: '#fff',
          }
        });
        
        await loadUser();
        setPaymentStatus('success');
        setPaymentModalItem(null);
        
        const purchasedItem = counselingPlans.concat(premiumTools).find(p => p._id === planId);
        if (purchasedItem) {
          toast.success(
            purchasedItem.Plantype === 'tool' 
              ? `${purchasedItem.title} tool unlocked successfully!` 
              : `${purchasedItem.title} plan activated successfully!`,
            { 
              duration: 5000,
              icon: '🔓',
              style: {
                background: '#4BB543',
                color: '#fff',
              }
            }
          );
        }
      } else {
        setPaymentStatus('error');
        toast.error(result.message || "Payment failed or cancelled", {
          duration: 4000,
          icon: '❌',
          style: {
            background: '#FF3333',
            color: '#fff',
          }
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus('error');
      toast.error(err.message || 'Payment failed. Please try again.', {
        duration: 4000,
        icon: '❌',
        style: {
          background: '#FF3333',
          color: '#fff',
        }
      });
      // setPaymentModalItem(null);
    }
  };

const handleLogout = async () => {
  try {
    await logout();
    // Store message before redirect
    sessionStorage.setItem('logoutMessage', 'Logged out successfully 👋');
    navigate('/');
  } catch (err) {
    toast.error('Logout failed. Please try again.', {
      duration: 3000,
      style: { background: '#D32F2F', color: '#fff' }
    });
  }
};


  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };


  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingFeedback && feedbackHistory?.length > 0) {
        await editFeedback(feedbackHistory[0]._id, {
          message: feedback.message,
          category: feedback.category,
          starRating: feedback.rating
        });
        toast.success('Feedback updated successfully! It will be reviewed again by our team.', {
          duration: 4000,
          icon: '🔄',
          style: {
            background: '#4BB543',
            color: '#fff',
          }
        });
      } else {
        await submitFeedback({
          message: feedback.message,
          category: feedback.category,
          starRating: feedback.rating
        });
        toast.success('Feedback submitted successfully! Our team will review it shortly.', {
          duration: 4000,
          icon: '📩',
          style: {
            background: '#4BB543',
            color: '#fff',
          }
        });
      }
      
      setEditingFeedback(false);
      fetchFeedbackHistory();
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback. Please try again.', {
        duration: 4000,
        icon: '❌',
        style: {
          background: '#FF3333',
          color: '#fff',
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  const isToolPurchased = (toolId) =>
    user?.premiumTools?.some(
      (t) => t.toolId?._id?.toString() === toolId?.toString() && t.active
    );

  if (!user || !initialAuthCheckComplete) return <InitialLoader />;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
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
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/">
              <div className="flex items-center cursor-pointer">
                <img src={Logo} className='h-12 md:h-16 md:w-40 w-28' alt="collegesecracy" />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => scrollToSection('tools-section')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiTool className="mr-2" />
                Tools
              </button>

              <button 
                onClick={() => scrollToSection('videos-section')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiYoutube className="mr-2" />
                Videos
              </button>

              <button 
                onClick={() => scrollToSection('counselling-section')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiAward className="mr-2" />
                Counselling
              </button>

              {/* Profile Section */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={handleProfileToggle}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user.profilePic?.url ?(
                    <img 
                      src={user.profilePic.url} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center text-white">
                      <FiUser />
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate(`/${user.role}-dashboard/profile`);
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                      >
                        <FiUser className="mr-2" />
                        View Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                      >
                        <FiLogOut className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button onClick={handleMenuToggle} className="text-gray-700 dark:text-gray-300 focus:outline-none">
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white dark:bg-gray-800 shadow-md">
            <button 
              onClick={() => { scrollToSection('tools-section'); setIsMenuOpen(false); }}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiTool className="mr-2" />
              Tools
            </button>
            <button 
              onClick={() => { scrollToSection('videos-section'); setIsMenuOpen(false); }}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiYoutube className="mr-2" />
              Videos
            </button>
            <button 
              onClick={() => { scrollToSection('counselling-section'); setIsMenuOpen(false); }}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiAward className="mr-2" />
              Counselling
            </button>

            {/* Profile Options inside Mobile Menu */}
            <hr className="border-gray-200 dark:border-gray-700 my-2" />
            <button
              onClick={() => { navigate(`/${user.role}-dashboard/profile`); setIsMenuOpen(false); }}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiUser className="mr-2" />
              View Profile
            </button>
            <button
              onClick={() => { handleLogout(); setIsMenuOpen(false); }}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  className="relative overflow-hidden rounded-2xl mb-6 min-h-[14rem] sm:min-h-[16rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
>
  {/* Enhanced SVG Background - More Visible in Both Modes */}
  <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]">
    {/* Bold Book Stack */}
    <svg 
      className="absolute -right-8 -top-4 h-64 w-64 sm:h-80 sm:w-80 text-indigo-400/70 dark:text-indigo-900/60"
      viewBox="0 0 200 200"
    >
      <path d="M30,30 L170,30 L150,80 L50,80 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M20,90 L180,90 L160,140 L40,140 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10,150 L190,150 L170,190 L30,190 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
    
    {/* Bold Graduation Cap */}
    <svg 
      className="absolute -left-8 -bottom-4 h-60 w-60 sm:h-72 sm:w-72 text-blue-400/70 dark:text-blue-900/60"
      viewBox="0 0 200 200"
    >
      <path d="M50,120 L150,120 L130,170 L70,170 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M80,70 L120,70 L100,120 L100,120 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
    
    {/* Bold Growth Chart */}
    <svg 
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 text-emerald-400/70 dark:text-emerald-900/60"
      viewBox="0 0 200 200"
    >
      <path d="M30,170 L50,120 L70,150 L90,100 L110,130 L130,80 L150,110 L170,60" 
        stroke="currentColor" 
        strokeWidth="4" 
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="50" cy="120" r="6" fill="currentColor" />
      <circle cx="110" cy="130" r="6" fill="currentColor" />
      <circle cx="170" cy="60" r="6" fill="currentColor" />
    </svg>
  </div>

  {/* Content Container */}
  <div className="relative z-10 h-full flex flex-col justify-center p-6 sm:p-8">
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="max-w-2xl mx-auto w-full"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
        Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user.fullName.split(' ')[0]}</span>!
      </h1>
      
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6"
      >
        We're excited to continue this learning journey with you. Discover new resources, track your progress, and achieve your educational goals with our comprehensive platform.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base"
      >
        <svg className="h-5 w-5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span className="text-sm">Your personalized learning dashboard is ready</span>  
      </motion.div>
    </motion.div>
  </div>
</motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Dashboard Stats */}
          <div className="md:col-span-1">
            <DashboardStats user={user} loading={loadingPlans} />
          </div>

          {/* Quick Actions + Premium Shortcuts */}
          <motion.div
            variants={fadeIn}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden md:col-span-1 border border-gray-200 dark:border-gray-700"
          >
            <div className="p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiTool className="mr-2 text-blue-500" /> Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {loadingPlans
                  ? Array(4).fill().map((_, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-start justify-start space-y-1 border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-700"
                      >
                        <Skeleton circle width={28} height={28} />
                        <Skeleton width="80%" height={10} />
                      </div>
                    ))
                  : (
                      <>
                        {/* Free Tools */}
                        <DashboardButton
                          icon={<FiBook className="text-blue-500" />}
                          label="Resources"
                          onClick={() => navigate(`/${user.role}-dashboard/resources`)}
                        />
                        <DashboardButton
                          icon={<FiBarChart2 className="text-purple-500" />}
                          label="Progress"
                          onClick={() => navigate(`/${user.role}-dashboard/progress`)}
                        />
                        <DashboardButton
                          icon={<FiBarChart2 className="text-purple-500" />}
                          label="Mock Tests"
                          onClick={() => navigate(`/${user.role}-dashboard/tests`)}
                        />

                        {/* Premium Tools */}
                        {premiumTools
                          .filter(tool => ['study-planner', 'branch-comparison'].includes(tool.link))
                          .map(tool => {
                            const isToolActive = user.premiumTools?.some(
                              t => t.toolId?._id?.toString() === tool._id?.toString() && t.active
                            );

                            return (
                              <div key={tool._id} className="relative group">
                                <DashboardButton
                                  icon={
                                    tool.link === 'study-planner' ? (
                                      <FiCalendar className="text-orange-500" />
                                    ) : (
                                      <FiAward className="text-green-500" />
                                    )
                                  }
                                  label={tool.title}
                                  onClick={() =>
                                    isToolActive
                                      ? navigate(`/${user.role}-dashboard/tools/${tool.link}`)
                                      : (setShowPremiumToolsModal(true), scrollToSection('tools-section'))
                                  }
                                  disabled={!isToolActive}
                                />
                                {!isToolActive && (
                                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none shadow-lg z-30">
                                    Upgrade to use this tool
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </>
                    )}
              </div>
            </div>
          </motion.div>

          {/* Popular Tools + Tips */}
          <motion.div
            variants={fadeIn}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 md:col-span-2 lg:col-span-1"
          >
            <div className="p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-orange-500" />
                Popular Tools for You
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {loadingPlans
                  ? Array(3).fill().map((_, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center mb-3">
                          <div className="mr-3">
                            <Skeleton circle height={32} width={32} />
                          </div>
                          <div className="flex-1">
                            <Skeleton height={12} width="80%" />
                          </div>
                        </div>
                        <Skeleton height={10} width="60%" />
                        <div className="mt-3">
                          <Skeleton height={8} width="50%" />
                        </div>
                      </div>
                    ))
                  : premiumTools.slice(0, 3).map(tool => {
                      const purchased = isToolPurchased(tool._id);
                      return (
                        <div
                          key={tool._id}
                          className={`relative group flex flex-col justify-between cursor-pointer bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border h-full transition-shadow ${
                            purchased
                              ? 'hover:shadow-md border-green-300 dark:border-green-600'
                              : 'hover:shadow-sm border-orange-300 dark:border-orange-600'
                          }`}
                          onClick={() =>
                            purchased
                              ? navigate(`/${user.role}-dashboard/tools/${tool.link}`)
                              : (setShowPremiumToolsModal(true), scrollToSection('tools-section'))
                          }
                        >
                          <div className="flex items-center mb-2">
                            <div
                              className={`p-2 md:p-0 rounded-lg mr-3 ${
                                purchased
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400'
                                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400'
                              }`}
                            >
                              <SparklesIcon className="h-4 w-4" />
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-white md:text-xs text-sm">
                              {tool.title}
                            </h3>
                          </div>

                          <div className="mt-3 text-xs flex items-center">
                            {purchased ? (
                              <div className="text-green-600 dark:text-green-400 flex items-center">
                                <FiCheckCircle className="mr-1 h-4 w-4" />
                                Access Tool
                              </div>
                            ) : (
                              <div className="text-orange-600 dark:text-orange-400 flex items-center">
                                <FiLock className="mr-1 h-4 w-4" />
                                Premium Feature
                              </div>
                            )}
                          </div>

                          {!purchased && (
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none z-30 shadow-lg">
                              Unlock with Premium Plan
                            </div>
                          )}
                        </div>
                      );
                    })}
              </div>

              {/* Testimonial */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-4 border border-orange-200 dark:border-orange-800">
                <div className="flex items-start">
                  <FiStar className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                  <div className="ml-3">
                    <p className="text-sm italic text-gray-800 dark:text-gray-200">
                      "This platform helped me understand the counselling process better..."
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">- JEE Aspirant, 2023</p>
                  </div>
                </div>
              </div>

              {/* Counselling Tip */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start">
                  <FiInfo className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  <div className="ml-3">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1 text-sm">
                      Counselling Tip
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      During CSAB counselling, keep 2–3 safety options in your preferred branches.
                    </p>
                  </div>
                </div>
              </div>

              {/* Getting Started Guide */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center text-sm sm:text-base">
                  <BoltIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-500" />
                  How to Get Started
                </h3>
                <ol className="space-y-3">
                  {[
                    'Explore the tools section to find helpful calculators',
                    'Check the events calendar for upcoming webinars',
                    'Review important links for official counselling websites',
                    'Bookmark helpful resources for quick access',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 bg-gray-300 dark:bg-gray-600 rounded-full h-5 w-5 flex items-center justify-center mr-3 text-xs font-medium mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </div>

<motion.section 
  id='counselling-section'
  className="md:py-8 py-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.8 }}
>
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-400/10 backdrop-blur-[100px]"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-400/10 backdrop-blur-[100px]"></div>
    <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-purple-400/10 backdrop-blur-[120px] transform -translate-x-1/2 -translate-y-1/2"></div>
  </div>
  
  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <div className="text-center mb-8">
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
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">Counselling</span> Packages
      </motion.h2>
      <motion.p 
        className="mt-4 md:text-lg text-sm text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        Premium guidance from IIT/NIT alumni with 10+ years of admission expertise
      </motion.p>
    </div>

   {loadingPlans && (
  <>
    {/* Mobile View - Horizontal Scroll Skeletons */}
    <div className="md:hidden overflow-x-auto scrollbar-hide pb-6 px-4">
      <div className="flex space-x-4 w-max">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="w-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-6 space-y-4 min-h-[480px]"
          >
            <Skeleton height={20} width={100} baseColor="#f3f4f6" highlightColor="#e5e7eb" />
            <Skeleton height={28} width="60%" baseColor="#f3f4f6" highlightColor="#e5e7eb" />
            <Skeleton height={20} width="80%" baseColor="#f3f4f6" highlightColor="#e5e7eb" />
            <Skeleton height={60} baseColor="#f3f4f6" highlightColor="#e5e7eb" />
            <Skeleton count={4} baseColor="#f3f4f6" highlightColor="#e5e7eb" />
            <Skeleton height={40} width="100%" borderRadius={8} baseColor="#f3f4f6" highlightColor="#e5e7eb" />
          </div>
        ))}
      </div>
    </div>

    {/* Desktop View - Grid Skeletons */}
    <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-8">
      {[1, 2, 3].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden shadow-xl backdrop-blur-md bg-white/70 dark:bg-gray-800/70 p-6 space-y-4 min-h-[480px]"
        >
          <Skeleton height={20} width={100} baseColor="#f3f4f6" highlightColor="#e5e7eb" />
          <Skeleton height={28} width="60%" baseColor="#f3f4f6" highlightColor="#e5e7eb" />
          <Skeleton height={20} width="80%" baseColor="#f3f4f6" highlightColor="#e5e7eb" />
          <Skeleton height={60} baseColor="#f3f4f6" highlightColor="#e5e7eb" />
          <Skeleton count={4} baseColor="#f3f4f6" highlightColor="#e5e7eb" />
          <Skeleton height={40} width="100%" borderRadius={8} baseColor="#f3f4f6" highlightColor="#e5e7eb" />
        </div>
      ))}
    </div>
  </>
)}

    {/* Error state */}
    {errorPlans && !loadingPlans && (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
        <p className="text-red-600 dark:text-red-400">{errorPlans}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Retry
        </button>
      </div>
    )}

{/* Mobile View - Horizontal Scroll */}
{!loadingPlans && !errorPlans && counselingPlans.length > 0 && (
  <div className="md:hidden overflow-x-auto scrollbar-hide pb-6 px-4">
    <div className="flex space-x-4 w-max">
      {counselingPlans.map((plan, index) => {
        const isPurchased = user?.counselingPlans?.some(
          (p) => p?.planId?._id?.toString() === plan._id?.toString() && p?.active
        );

        const purchasedPlan = user?.counselingPlans?.find(
          (p) => p?.planId?._id?.toString() === plan._id?.toString() && p?.active
        );

        const expiry = purchasedPlan?.planId?.expiryDate
          ? new Date(purchasedPlan.planId.expiryDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : null;

        return (
          <motion.div
            key={plan._id}
            whileHover={{ scale: 1.02 }}
            className={`relative w-72 flex-shrink-0 min-h-[480px] flex flex-col justify-between rounded-2xl overflow-hidden shadow-xl backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 ${
              plan.highlight ? 'ring-2 ring-orange-500' : ''
            }`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
{plan.tag && (
  <div className="absolute top-0 -left-2 z-10">
    {/* Ribbon main strip */}
    <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-r-md shadow-md">
      {plan.tag}
    </div>

    {/* Triangle tail below */}
    <div className="w-0 h-0 border-t-[10px] border-l-[10px] border-t-orange-500 border-l-transparent"></div>
  </div>
)}



            <div className="p-6 flex flex-col space-y-4 h-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.title}</h3>

              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                ₹{plan.price}
                <span className="text-sm text-gray-500 dark:text-gray-300 font-medium"> /package</span>
              </div>

              {plan.sessions && (
                <div className="flex items-center bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
                  <FiCalendar className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{plan.sessions}</span>
                </div>
              )}

              <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-300 min-h-[110px]">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <FiCheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isPurchased && (
                <div className="text-xs bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 px-3 py-1 rounded">
                  ✅ Purchased {expiry && `– Valid till ${expiry}`}
                </div>
              )}

              <div className="mt-auto">
                <button
                  onClick={() => !isPurchased && handlePurchaseClick(plan, 'plan')}
                  disabled={isPurchased}
                  className={`w-full py-2 px-4 mt-4 rounded-lg text-sm font-medium transition duration-300 shadow-md hover:shadow-xl flex items-center justify-center ${
                    isPurchased
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : plan.highlight
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                      : 'bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                  }`}
                >
                  {isPurchased
                    ? 'Already Purchased'
                    : plan.highlight
                    ? 'Get Premium'
                    : 'Choose Plan'}
                  {!isPurchased && <FiArrowRight className="h-4 w-4 ml-2" />}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
)}


{/* Swiper Slider – Desktop View */}
<div className="hidden md:block px-6 py-8">
  <Swiper
    spaceBetween={24}
    slidesPerView={1}
    breakpoints={{
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }}
  >
    {counselingPlans.map((plan, index) => {
      const isPlanPurchased = user?.counselingPlans?.some(
        (p) => p?.planId?._id?.toString() === plan._id?.toString() && p?.active
      );

      const purchasedPlan = user?.counselingPlans?.find(
        (p) => p?.planId?._id?.toString() === plan._id?.toString() && p?.active
      );

      const expiry = purchasedPlan?.planId?.expiryDate
        ? new Date(purchasedPlan.planId.expiryDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : null;

      return (
        <SwiperSlide key={plan._id}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative w-[320px] min-h-[500px] mx-auto flex flex-col justify-between rounded-2xl overflow-hidden shadow-xl backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-gray-600 transition-all duration-300 ${
              plan.highlight ? 'ring-2 ring-orange-500' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Tag */}
            {plan.tag && (
              <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-br-xl z-10 shadow-md">
                {plan.tag}
              </div>
            )}

            {/* Card Content */}
            <div className="p-6 flex flex-col space-y-3 h-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.title}</h3>

              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                ₹{plan.price}
                <span className="text-sm text-gray-500 dark:text-gray-300 font-medium"> /package</span>
              </div>

              {plan.sessions && (
                <div className="flex items-center bg-white/30 dark:bg-gray-700/40 px-3 py-1.5 rounded-lg">
                  <FiCalendar className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{plan.sessions}</span>
                </div>
              )}

              <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <FiCheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isPlanPurchased && (
                <div className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded">
                  ✅ Purchased {expiry && `– Valid till ${expiry}`}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => !isPlanPurchased && handlePurchaseClick(plan, 'plan')}
                disabled={isPlanPurchased}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition duration-300 shadow-md hover:shadow-xl flex items-center justify-center ${
                  isPlanPurchased
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : plan.highlight
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                    : 'bg-white/80 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }`}
              >
                {isPlanPurchased
                  ? 'Already Purchased'
                  : plan.highlight
                  ? 'Get Premium'
                  : 'Choose Plan'}
                {!isPlanPurchased && <FiArrowRight className="h-4 w-4 ml-2" />}

              </button>
            </div>
          </motion.div>
        </SwiperSlide>
      );
    })}
  </Swiper>
</div>

    {/* No plans available */}
    {!loadingPlans && !errorPlans && counselingPlans.length === 0 && (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
        <FiInfo className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No counseling plans available</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Currently there are no counseling plans offered. Please check back later.
        </p>
      </div>
    )}
  </div>
</motion.section>

        {/* YouTube Videos Section */}
        <YouTubeSlider/>

        {/* Event Calendar & Workshops Section */}
        {/* <motion.section
          id="events-section"
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="md:text-lg text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiCalendar className="mr-2 text-orange-500" />
              Events & Workshops
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="font-medium md:text-base text-sm text-gray-800 dark:text-gray-200 mb-3">Upcoming Events</h3>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div 
                      key={event.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg md:p-4 p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium md:text-base text-sm text-gray-900 dark:text-white">{event.title}</h4>
                          <div className="flex items-center mt-1 md:text-sm text-xs text-gray-600 dark:text-gray-400">
                            <FiCalendar className="mr-1.5" />
                            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            <span className="mx-1.5">•</span>
                            <span>{event.time}</span>
                            <span className="mx-1.5">•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              event.type === 'online' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {event.type === 'online' ? 'Online' : 'In-Person'}
                            </span>
                          </div>
                        </div>
                        <button className="text-orange-500 hover:text-orange-600">
                          <FiArrowRight />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium md:text-base text-sm text-gray-800 dark:text-gray-200 mb-3">Personal Calendar</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-full">
                  <div className="md:col-span-2">
                    <InteractiveCalendar 
                      events={events} 
                      onDateSelect={setSelectedEvent} 
                    />
                  </div>
                  <div className="mt-4">
                    <button 
                      onClick={() => navigate('/tools/study-planner')}
                      className="w-full py-2 px-4 md:text-sm text-xs bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
                    >
                      Open Study Planner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section> */}

        {/* Health & Wellness Section */}
        <motion.section
          id="wellness-section"
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="md:text-lg text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiHeart className="mr-2 text-orange-500" />
              Health & Wellness
            </h2>
            
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
              <nav className="flex space-x-8 overflow-x-auto no-scrollbar scrollbar-hide">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`whitespace-nowrap py-2 md:py-4 px-1 border-b-2 font-medium md:text-sm text-xs ${
                    activeTab === 'events'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Mental Health Tips
                </button>
                <button
                  onClick={() => setActiveTab('fitness')}
                  className={`whitespace-nowrap py-2 md:py-4 px-1 border-b-2 font-medium md:text-sm text-xs ${
                    activeTab === 'fitness'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Fitness Tracker
                </button>
                <button
                  onClick={() => setActiveTab('quotes')}
                  className={`whitespace-nowrap md:py-4 py-2 px-1 border-b-2 font-medium md:text-sm text-xs ${
                    activeTab === 'quotes'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Daily Motivation
                </button>
              </nav>
            </div>
            
            <div className="mt-4">
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <h3 className="font-medium md:text-base text-sm text-gray-800 dark:text-gray-200">Exam Stress Management</h3>
                  <ul className="space-y-3">
                    {healthTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 md:h-5 md:w-5 h-4 w-4 text-green-500 mr-2 mt-0.5">✓</span>
                        <span className="text-gray-700 md:text-base text-xs dark:text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <button 
                      onClick={() => navigate(`/${user.role}-dashboard/resources/mental-health`)}
                      className="text-orange-600 dark:text-orange-400 hover:underline md:text-sm text-xs font-medium"
                    >
                      View more resources →
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'fitness' && (
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Fitness Progress</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg md:p-4 p-2">
                    <div className="flex items-center justify-center md:h-40 h-32">
                      <p className="text-gray-500 dark:text-gray-400 md:text-base text-sm">
                        Fitness tracker will sync with your health app
                      </p>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white dark:bg-gray-600 p-2 rounded">
                        <p className="md:text-sm text-xs text-gray-500 dark:text-gray-400">Steps</p>
                        <p className="font-medium">--</p>
                      </div>
                      <div className="bg-white dark:bg-gray-600 p-2 rounded">
                        <p className="md:text-sm text-xs text-gray-500 dark:text-gray-400">Workouts</p>
                        <p className="font-medium">--</p>
                      </div>
                      <div className="bg-white dark:bg-gray-600 p-2 rounded">
                        <p className="md:text-sm text-xs text-gray-500 dark:text-gray-400">Sleep</p>
                        <p className="font-medium">--</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-2 py-1 md:py-2 md:px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium">
                      Connect Health App
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'quotes' && (
                <QuoteComponent/>
              )}
            </div>
          </div>
        </motion.section>

  {/* Tool Section  */}
<motion.section 
  id="tools-section"
  variants={fadeIn}
  className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700"
>
  <div className="p-4 md:p-8">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10">
      <div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white mb-3 shadow-sm">
          PREMIUM TOOLS
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          Powerful Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">Tools</span>
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 max-w-xl">
          Access our premium tools designed to optimize your preparation
        </p>
      </div>
    </div>

    {/* ✅ Use the slider component here */}
    <ToolsSlider 
      user={user}
      navigate={navigate}
      setShowPremiumToolsModal={setShowPremiumToolsModal}
    />
  </div>
</motion.section>

<AnimatePresence>
  {showPremiumToolsModal && (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowPremiumToolsModal(false)}
    >
      <motion.div
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] scrollbar-hide overflow-y-auto border border-gray-200 dark:border-gray-600"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] to-[#3A8DFF] opacity-90" />
          <div className="relative z-10 p-4 sm:p-6 flex justify-between items-center backdrop-blur-sm">
            <div>
              <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-wide">
                {loadingPlans ? (
                  <div className="w-48 h-6 bg-white/30 rounded animate-pulse" />
                ) : (
                  'Premium Tools'
                )}
              </h2>
              <p className="text-xs md:text-base text-orange-100 mt-1 font-medium">
                {loadingPlans ? (
                  <div className="w-60 h-4 bg-white/20 rounded mt-1 animate-pulse" />
                ) : (
                  'Unlock powerful tools to boost your preparation'
                )}
              </p>
            </div>
            <button
              onClick={() => setShowPremiumToolsModal(false)}
              className="text-white hover:text-orange-200 transition-colors p-2 rounded-full border border-white/20 hover:bg-white/10"
            >
              <FiX size={22} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-hide">
          {loadingPlans ? (
            // Skeleton Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl border bg-white/50 dark:bg-transparent border-gray-400 dark:border-gray-600 p-4 sm:p-5 animate-pulse"
                >
                  <div className="flex items-start mb-3 gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/40" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
                      <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-600 rounded" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                    <div className="h-8 w-24 bg-orange-400/60 dark:bg-orange-700/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (() => {
            const unpurchasedTools = premiumTools.filter(tool => !isToolPurchased(tool._id));
            const allPurchased = unpurchasedTools.length === 0;

            if (allPurchased) {
              return (
                <div className="text-center py-16 px-6">
                  <SparklesIcon className="h-10 w-10 mx-auto text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                    All tools purchased
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    You've already unlocked all available premium tools. Feel free to access them anytime from your dashboard. 🎉
                  </p>
                  <button
                    onClick={() => setShowPremiumToolsModal(false)}
                    className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                  >
                    Go to Dashboard
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {unpurchasedTools.map((tool) => (
                  <div
                    key={tool._id}
                    className="relative overflow-hidden rounded-xl border bg-white/50 dark:bg-transparent border-gray-400 dark:border-gray-600 transition-all duration-300 hover:shadow-md hover:border-orange-500"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start mb-3">
                        <div className="p-3 rounded-lg mr-4 bg-orange-100 dark:bg-orange-900/40 text-orange-600">
                          <SparklesIcon className="md:h-5 h-4 w-4 md:w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold md:text-base text-sm text-gray-800 dark:text-white">
                            {tool.title}
                          </h3>
                          <p className="md:text-sm text-xs text-gray-600 dark:text-gray-300 mt-1">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="font-bold text-orange-600 dark:text-orange-400 md:text-base text-sm">
                          ₹{tool.price}
                        </span>
                        <button
                          onClick={() => handlePurchaseClick(tool, 'tool')}
                          disabled={isLoading}
                          className={`px-4 py-2 rounded-lg font-medium text-white md:text-sm text-xs transition-all ${
                            isLoading
                              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow'
                          }`}
                        >
                          {isLoading ? 'Processing...' : 'Purchase'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>





        {/* Important Links Section */}
        <motion.section
          id="links-section"
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="md:p-6 p-4">
            <h2 className="md:text-lg text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiExternalLink className="mr-2 text-orange-500" />
              Important Links
            </h2>
            
            <div className="grid md:text-base text-sm grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {importantLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 dark:border-gray-700 rounded-lg md:p-4 p-2 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{link.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
                  <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center">
                    <FiExternalLink className="mr-1" /> Visit Website
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.section>

{/* Feedback & Suggestions Section */}
<motion.section
  id="feedback-section"
  variants={fadeIn}
  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
>
  <div className="p-6">
    <h2 className="md:text-lg text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <FiMail className="mr-2 text-orange-500" />
      Feedback & Suggestions
    </h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Feedback Display/Edit Area */}
      <div>
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
          {feedbackHistory?.length > 0 ? 'Your Feedback' : 'Share Your Feedback'}
        </h3>
        
        {loadingFeedback ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : feedbackHistory?.length > 0 ? (
          <div>
            {editingFeedback ? (
              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-4">
                  <StarRating 
                    rating={feedback.rating}
                    onRatingChange={(rating) => setFeedback(prev => ({ ...prev, rating }))}
                    hoverRating={hoverRating}
                    onHoverChange={setHoverRating}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="feedback-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Feedback Category
                  </label>
                  <select
                    id="feedback-category"
                    name="category"
                    value={feedback.category}
                    onChange={handleFeedbackChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="counselling">Counselling Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback-message"
                    name="message"
                    value={feedback.message}
                    onChange={handleFeedbackChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Please share your detailed feedback..."
                    required
                    minLength="10"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-orange-600 rounded-md text-sm font-medium text-white hover:bg-orange-700 transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={!feedback.rating || isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Feedback'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingFeedback(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`h-4 w-4 ${
                          feedbackHistory[0].starRating >= star 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300 dark:text-gray-500'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {feedbackHistory[0].category}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(feedbackHistory[0].createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  "{feedbackHistory[0].message}"
                </p>
                
                <button
                  onClick={() => {
                    setEditingFeedback(true);
                    setFeedback({
                      rating: feedbackHistory[0].starRating,
                      category: feedbackHistory[0].category,
                      message: feedbackHistory[0].message
                    });
                  }}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-md text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center"
                >
                  <FiEdit2 className="mr-1" /> Edit Feedback
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit}>
            <div className="mb-4">
              <StarRating 
                rating={feedback.rating}
                onRatingChange={(rating) => setFeedback(prev => ({ ...prev, rating }))}
                hoverRating={hoverRating}
                onHoverChange={setHoverRating}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="feedback-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Feedback Category
              </label>
              <select
                id="feedback-category"
                name="category"
                value={feedback.category}
                onChange={handleFeedbackChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="counselling">Counselling Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Feedback
              </label>
              <textarea
                id="feedback-message"
                name="message"
                value={feedback.message}
                onChange={handleFeedbackChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Please share your detailed feedback..."
                required
                minLength="10"
              />
            </div>
            
            <button
              type="submit"
              className={`px-4 py-2 bg-orange-600 rounded-md text-sm font-medium text-white hover:bg-orange-700 transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={!feedback.rating || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
      
      {/* Feedback Guidelines */}
      <div>
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
          Feedback Guidelines
        </h3>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
            <FiInfo className="mr-2" /> How to give effective feedback
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <li className="flex items-start">
              <FiCheckCircle className="flex-shrink-0 h-4 w-4 mt-0.5 mr-2 text-blue-500" />
              Be specific about what you liked or want improved
            </li>
            <li className="flex items-start">
              <FiCheckCircle className="flex-shrink-0 h-4 w-4 mt-0.5 mr-2 text-blue-500" />
              Provide clear examples when reporting issues
            </li>
            <li className="flex items-start">
              <FiCheckCircle className="flex-shrink-0 h-4 w-4 mt-0.5 mr-2 text-blue-500" />
              Suggestions for improvement are always welcome
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            <FiClock className="mr-2" /> What happens next?
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Our team reviews all feedback regularly. While we can't respond to each submission individually, 
            we use your input to prioritize improvements and fix issues.
          </p>
        </div>
      </div>
    </div>
  </div>
</motion.section>

        {/* Help Section */}
        <motion.div 
          variants={fadeIn}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl overflow-hidden shadow-lg relative"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 md:p-6 p-4 text-white">
            <div className="flex items-start">
              <FiHelpCircle className="md:text-3xl text-xl mr-4 flex-shrink-0" />
              <div>
                <h2 className="md:text-xl text-lg font-bold mb-2">Need Help?</h2>
                <p className="mb-4 opacity-90 md:text-base text-sm">
                  Our team of JEE experts is available 24/7 to answer your questions.
                </p>
                <button 
                  onClick={() => navigate('/contact')}
                  className="md:px-4 px-2 py-1 md:py-2 md:text-base text-sm bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer theme={darkMode ? 'dark' : 'light'} />
    {/* Add PaymentModal here */}
    {paymentModalItem && (
      <PaymentModal
        item={paymentModalItem}
        onClose={() => setPaymentModalItem(null)}
        handlePurchase={handlePurchase}
        loading={isLoading}
        type={paymentModalType}
        paymentStatus={paymentStatus}
      />
    )}
    </motion.div>
  );
};



const DashboardButton = ({ icon, label, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
        disabled
          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-orange-400 dark:hover:border-orange-400 hover:shadow-md'
      }`}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default MenteePage;