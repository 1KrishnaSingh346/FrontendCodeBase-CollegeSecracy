import React from 'react';
import api from '@/lib/axios.js';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import StarRating from './StudentPages/Components/StarRating.jsx';
import Logo  from "/Logo.webp";
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
import { SunIcon, MoonIcon, CalendarIcon, CheckCircleIcon,  SparklesIcon,
  ArrowRightIcon,   ChevronDownIcon,
  BoltIcon,
  LockClosedIcon, } from "@heroicons/react/24/solid";
import { InitialLoader} from '../components/Loaders/script.js';
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
    loading, 
    error,
    menteeGetPlan,
    updateProfile, 
     feedbackHistory, 
  loadingFeedback,
  fetchFeedbackHistory,
  editFeedback,
  submitFeedback ,
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
  category: 'general' // default category
});


  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Add this to your existing state declarations
const [editingFeedback, setEditingFeedback] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
    const [showPremiumToolsModal, setShowPremiumToolsModal] = useState(false);
  
    
    {/* State for plans */}
    const [counselingPlans, setCounselingPlans] = useState([]);
    const [premiumTools, setPremiumTools] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [errorPlans, setErrorPlans] = useState(null);

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
          if(toolsData)
          {
            setPremiumTools(toolsData);
          }
        } catch (err) {
          setErrorPlans(err.message || 'Failed to fetch plans');
          console.error('Error fetching plans:', err);
        } finally {
          setLoadingPlans(false);
        }
      };

      fetchPlans();
    }, []);

  // Initialize auth and load user data
  useEffect(() => {
    if (!initialAuthCheckComplete) {
      initializeAuth();
    } else if (!user) {
      loadUser();
    } else {
      setProfileData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        profilePic: user.profilePic || ''
      });
      if (user) {
         fetchFeedbackHistory();
      }
    }
  }, [user, loadUser, initializeAuth, initialAuthCheckComplete, fetchFeedbackHistory]);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Premium Tools bundle
  // discount given
const Discount = 30;
const total = premiumTools.reduce((sum, tool) => sum + tool.price, 0);
const discountedPrice = Math.round(total * (1 - Discount / 100));
const savings = Math.round(total * (Discount / 100));

  const events = [
    {
      id: 1,
      title: "JEE Advanced Strategy Webinar",
      date: "2023-11-15",
      time: "18:00",
      type: "online",
      description: "Learn advanced strategies from top rankers for JEE Advanced preparation",
      registrationLink: "#"
    },
    {
      id: 2,
      title: "Campus Tour: IIT Bombay",
      date: "2023-11-20",
      time: "10:00",
      type: "offline",
      description: "Guided tour of IIT Bombay campus with current students",
      registrationLink: "#"
    },
    {
      id: 3,
      title: "Stress Management Workshop",
      date: "2023-11-25",
      time: "15:00",
      type: "online",
      description: "Techniques to manage exam stress and anxiety",
      registrationLink: "#"
    }
  ];

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
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

 const handlePurchase = async (planId) => {
    try {
      // Step 1: Create order
      console.log("PlanId:", planId);
      const plan = counselingPlans.find(p => p._id === planId);
      const tool = premiumTools.find(p => p._id === planId);

      if (plan) 
      {
          console.log("Plan Title : ",plan.title);
      }
      else if(tool)
        {
          console.log("Plan Title : ", tool.title);
        } 
      else 
      {
          console.log('Plan not found');
      }
      if(planId == "premium-bundle")
      {
        // To do
          // as premium-bundle schema is not in database so do here manually in premium bundle jitne bhi preimum tools and sab ki plan_id for purchase and database mei jb pruchase ho jaye to vaha jabhi ki planid to ho hi aur sath mei ye bhi ho ko premium bundle kharida hai isne jb amdin fetch kare
      }
      const orderData = await createPaymentOrder(planId);
      
      // Step 2: Open Razorpay checkout and handle payment
      const result = await initiateRazorpayPayment(orderData);
      
      // Payment was successful
      toast.success('Payment successful!');
      toast.success('Tool unlocked successfully!');
      setShowPremiumToolsModal(false);
      // Optional: Refresh user data to get updated premium status
      await loadUser();
      
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

const handleFeedbackChange = (e) => {
  const { name, value } = e.target;
  setFeedback(prev => ({ ...prev, [name]: value }));
};

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

// Update the feedback submit handler
// Update the handleFeedbackSubmit function
const handleFeedbackSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    if (editingFeedback && feedbackHistory?.length > 0) {
      // Editing existing feedback
      await editFeedback(feedbackHistory[0]._id, {
        message: feedback.message,
        category: feedback.category,
        starRating: feedback.rating
      });
      toast.success('Feedback updated successfully! It will be reviewed again by our team.');
    } else {
      // Creating new feedback
      await submitFeedback({
        message: feedback.message,
        category: feedback.category,
        starRating: feedback.rating
      });
      toast.success('Feedback submitted successfully! Our team will review it shortly.');
    }
    
    setEditingFeedback(false);
    fetchFeedbackHistory(); // Refresh the feedback list
  } catch (err) {
    toast.error(err.message || 'Failed to submit feedback');
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

  const handleEventRegister = (eventId) => {
    toast.success(`Registered for event! We'll send you details soon.`);
    setSelectedEvent(null);
  };

    // Check if a tool is purchased
  const isToolPurchased = (toolId) => {
    return user?.premiumTools?.includes(toolId);
  };


  if (!user || !initialAuthCheckComplete) return <InitialLoader />;

  const PlanStatusCard = ({ plan, user }) => {
    if (!user.counselingPlans?.[plan]) return null;

    const planData = user.counselingPlans[plan];
    const isValid = new Date(planData.validUntil) > new Date();

    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white capitalize">
              {plan.replace(/([A-Z])/g, ' $1')} Plan
            </h3>
            <p className={`text-sm ${isValid ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
              {isValid ? 'Active' : 'Expired'} - Valid until {new Date(planData.validUntil).toLocaleDateString()}
            </p>
          </div>
          {isValid && plan === 'whatsapp' && planData.whatsappGroupLink && (
            <a 
              href={planData.whatsappGroupLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full"
            >
              Join Group
            </a>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Purchased on {new Date(planData.purchasedOn).toLocaleDateString()}
        </div>
      </div>
    );
  };

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
                  {user.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center text-white">
                      <FiUser />
                    </div>
                  )}
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {user.fullName}
                  </span>
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
                        onClick={handleEditToggle}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                      >
                        <FiSettings className="mr-2" />
                        Edit Profile
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
              onClick={() => { handleEditToggle(); setIsMenuOpen(false); }}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiSettings className="mr-2" />
              Edit Profile
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
        {/* Welcome Banner */}
        <motion.div 
          variants={fadeIn}
          className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl overflow-hidden shadow-lg mb-8 relative"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 p-6 sm:p-8 md:p-10 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user.fullName.split(' ')[0]}!
            </h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-2xl">
              {user.premium 
                ? "You have full access to all premium tools and resources."
                : "Upgrade to premium to unlock all study tools and counseling services."}
            </p>
          </div>
        </motion.div>

{/* Dashboard Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  {/* Dashboard Stats - Full width on mobile, then takes normal space */}
  <div className="md:col-span-1 lg:col-span-1">
    <DashboardStats user={user} />
  </div>


<motion.div 
  variants={fadeIn}
  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:col-span-1 lg:col-span-1"
>
  <div className="p-6">
    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <FiTool className="mr-2 text-blue-500" />
      Quick Actions
    </h2>
    
    <div className="grid grid-cols-2 gap-3">
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
      
      {/* Premium Tools - Conditionally disabled */}
      {premiumTools.filter(tool => ['study-planner', 'branch-comparison'].includes(tool.link)).map(tool => (
        <DashboardButton
          key={tool._id}
          icon={tool.link === 'study-planner' ? 
            <FiCalendar className="text-orange-500" /> : 
            <FiAward className="text-green-500" />}
          label={tool.title}
          onClick={() => {
            if (user.premiumTools?.includes(tool._id)) {
              navigate(`/${user.role}-dashboard/tools/${tool.link}`);
            } else {
              setShowPremiumToolsModal(true);
              scrollToSection('tools-section');
            }
          }}
          disabled={!user.premiumTools?.includes(tool._id)}
        />
      ))}
    </div>
  </div>
</motion.div>

  {/* Popular Tools & Resources Section - Full width on all screens, but properly aligned in grid */}
{/* Popular Tools & Resources Section */}
<motion.div 
  variants={fadeIn}
  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-2 border-gray-200 dark:border-gray-700 md:col-span-2 lg:col-span-1"
>
  <div className="p-5 sm:p-6">
    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <SparklesIcon className="h-5 w-5 mr-2 text-orange-500" />
      Popular Tools for You
    </h2>
    
    {/* Dynamic Tools Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {premiumTools.slice(0, 3).map((tool) => (
        <div 
          key={tool._id}
          className="flex flex-col bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600 h-full hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            if (isToolPurchased(tool._id)) {
              navigate(`/${user.role}-dashboard/tools/${tool.link}`);
            } else {
              setShowPremiumToolsModal(true);
              scrollToSection('tools-section');
            }
          }}
        >
          <div className="flex items-center mb-2">
            <div className={`p-2 rounded-lg mr-3 ${
              isToolPurchased(tool._id)
                ? 'bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400'
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400'
            }`}>
              <SparklesIcon className=" h-4 w-4" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white text-xs md:text-xs">
              {tool.title}
              {isToolPurchased(tool._id) && (
                <span className="ml-1 text-xs text-green-600 dark:text-green-400">✓</span>
              )}
            </h3>
          </div>
          <p className="text-xs sm:text-xs text-gray-600 dark:text-gray-300 mt-auto">
            {tool.description}
          </p>
          {!isToolPurchased(tool._id) && (
            <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center">
              <FiLock className="mr-1" /> Premium Feature
            </div>
          )}
        </div>
      ))}
    </div>
    
    {/* Testimonial Card */}
    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-4 border border-orange-200 dark:border-orange-800">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5 text-orange-500 dark:text-orange-400">
          <FiStar className="h-4 w-4" />
        </div>
        <div className="ml-3">
          <p className="text-xs sm:text-sm italic text-gray-800 dark:text-gray-200">
            "This platform helped me understand the counselling process better..."
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            - JEE Aspirant, 2023
          </p>
        </div>
      </div>
    </div>
    
    {/* Counselling Tip */}
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5 text-blue-500 dark:text-blue-400">
          <FiInfo className="h-4 w-4" />
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1 text-sm sm:text-base">
            Counselling Tip
          </h3>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
            During CSAB counselling, keep 2-3 safety options in your preferred branches.
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
          "Explore the tools section to find helpful calculators",
          "Check the events calendar for upcoming webinars",
          "Review important links for official counselling websites",
          "Bookmark helpful resources for quick access"
        ].map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="flex-shrink-0 bg-gray-200 dark:bg-gray-600 rounded-full h-5 w-5 flex items-center justify-center mr-3 text-xs font-medium mt-0.5">
              {index + 1}
            </span>
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{item}</span>
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

    {/* Loading state */}
    {loadingPlans && (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
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
      <>
        <div className="md:hidden overflow-x-auto scrollbar-hide pb-6">
          <div className="flex space-x-6 w-max px-4">
            {counselingPlans.map((plan, index) => (
              <motion.div 
                key={plan._id}
                whileHover={{ scale: 1.02 }}
                className={`w-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 ${plan.highlight ? 'ring-2 ring-orange-500' : ''}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-6 h-full flex flex-col">
                  {plan.tag && (
                    <div className="bg-gradient-to-r md:text-base text-sm from-orange-500 to-orange-600 text-white font-bold px-3 py-1 rounded-full w-max mb-4 shadow-lg backdrop-blur-sm">
                      {plan.tag}
                    </div>
                  )}
                  <h3 className="md:text-xl text-lg font-bold text-gray-900 dark:text-white mb-3">{plan.title}</h3>
                  <div className="md:text-3xl text-base font-bold text-orange-600 dark:text-orange-400 mb-4">
                      {'₹'}{plan.price}
                    <span className="md:text-sm text-xs text-gray-500 dark:text-gray-400">/package</span>
                  </div>
                  {plan.sessions && (
                    <div className="flex items-center mb-4 bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <FiCalendar className="md:h-5 h-4 w-4 md:w-5 mr-2 text-orange-500" />
                      <span className="text-gray-700 dark:text-gray-300 md:text-sm text-xs">{plan.sessions}</span>
                    </div>
                  )}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <FiCheckCircle className="md:h-5 md:w-5 h-3 w-3 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300 md:text-sm text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handlePurchase(plan._id)}
                    className={`mt-auto md:text-base text-sm w-full md:py-3 md:px-4 py-2 px-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center backdrop-blur-sm ${
                      plan.highlight 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                        : 'bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                    }`}
                  >
                    {plan.highlight ? 'Get Premium' : 'Choose Plan'}
                    <FiArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop View - Grid Layout */}
        <div className="hidden md:block overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide px-4">
          <div className="inline-flex space-x-6 min-w-max">
            {counselingPlans.map((plan, index) => (
              <motion.div 
                key={plan._id}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`snap-center w-[320px] transition-transform duration-300 ease-in-out transform rounded-xl overflow-hidden shadow-lg backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 hover:shadow-xl ${
                  plan.highlight ? 'scale-[1.02] z-10 border-2 border-orange-500' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-6 flex flex-col h-full">
                  {plan.tag && (
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-4 shadow-lg backdrop-blur-sm">
                      {plan.tag}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{plan.title}</h3>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                    {'₹'}{plan.price}
                    <span className="text-sm text-gray-500 dark:text-gray-400">/package</span>
                  </div>
                  {plan.sessions && (
                    <div className="flex items-center mb-4 bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <CalendarIcon className="h-5 w-5 mr-2 text-orange-500" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{plan.sessions}</span>
                    </div>
                  )}
                  <ul className="space-y-3 mb-6 flex-1 overflow-hidden">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handlePurchase(plan._id)}
                    className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center backdrop-blur-sm ${
                      plan.highlight 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                        : 'bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                    }`}
                  >
                    {plan.highlight ? 'Get Premium' : 'Choose Plan'}
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </>
    )}

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

    {/* Active Plans */}
    {user.counselingPlans && (
      <div className="mt-12">
        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Your Active Counseling Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PlanStatusCard plan="josaa" user={user} />
          <PlanStatusCard plan="jacDelhi" user={user} />
          <PlanStatusCard plan="uptac" user={user} />
          <PlanStatusCard plan="whatsapp" user={user} />
        </div>
      </div>
    )}
  </div>
</motion.section>

        {/* YouTube Videos Section */}
        <YouTubeSlider/>

        {/* Event Calendar & Workshops Section */}
        <motion.section
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
        </motion.section>

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
    
{/* Tools Section - Enhanced */}
{/* Tools Section - Enhanced */}
<motion.section 
  id="tools-section"
  variants={fadeIn}
  className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700"
>
  <div className="p-4 md:p-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
      <div className="mb-4 md:mb-0">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white mb-3">
          PREMIUM TOOLS
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Powerful Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">Tools</span>
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
          Access our premium tools designed to optimize your preparation
        </p>
      </div>
      {!user.premium && (
        <button 
          onClick={() => setShowPremiumToolsModal(true)}
          className="w-full md:w-auto px-4 py-2 md:px-6 md:py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
        >
          Unlock All Tools
        </button>
      )}
    </div>
    
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Free Tools */}
      <ToolCard 
        title="Rank Calculator"
        description="Calculate expected rank based on marks"
        icon={<FiBarChart2 className="text-blue-500" />}
        onClick={() => navigate(`/${user.role}-dashboard/tools/rank-calculator`)}
        isFree={true}
      />
      <ToolCard 
        title="Percentile Calculator"
        description="Estimate JEE Main percentile"
        icon={<FiPercent className="text-purple-500" />}
        onClick={() => navigate(`/${user.role}-dashboard/tools/percentile-calculator`)}
        isFree={true}
      />
      <ToolCard 
        title="CGPA Calculator"
        description="Calculate CGPA from percentage"
        icon={<FiDollarSign className="text-green-500" />}
        onClick={() => navigate(`/${user.role}-dashboard/tools/cgpa-calculator`)}
        isFree={true}
      />
      
      {/* Premium Tools */}
      {user?.premiumTools?.map(toolId => {
        const tool = premiumTools.find(t => t._id === toolId);
        if (!tool) return null;
        
        return (
          <ToolCard 
            key={tool._id}
            title={tool.title}
            description={tool.description}
            icon={<SparklesIcon className="text-orange-500" />}
            onClick={() => navigate(`/${user.role}-dashboard/tools/${tool.link}`)}
            isPremium={true}
          />
        );
      })}
      
      {/* Unlock Card */}
      <ToolCard 
        title="Unlock Premium"
        description="Get all advanced study tools"
        icon={<SparklesIcon className="text-orange-500" />}
        onClick={() => setShowPremiumToolsModal(true)}
        isLocked={true}
      />
    </div>
  </div>
</motion.section>

{/* Responsive Premium Tools Modal */}
<AnimatePresence>
  {showPremiumToolsModal && (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowPremiumToolsModal(false)}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] scrollbar-hide overflow-y-auto border border-gray-200 dark:border-gray-700"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-4 sm:p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Premium Tools</h2>
              <p className="text-orange-100 mt-1 text-sm sm:text-base">
                Unlock powerful tools to boost your preparation
              </p>
            </div>
            <button 
              onClick={() => setShowPremiumToolsModal(false)}
              className="text-white hover:text-orange-200 transition-colors p-1"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {/* Tool Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {premiumTools.map((tool) => (
              <div 
                key={tool._id}
                id={`tool-${tool._id}`}
                className={`relative overflow-hidden rounded-lg sm:rounded-xl border ${
                  isToolPurchased(tool._id)
                    ? 'border-green-500/30 bg-green-50/50 dark:bg-green-900/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500'
                } transition-all duration-300`}
              >
                {/* Ribbon for purchased tools */}
                {isToolPurchased(tool._id) && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 transform rotate-45 translate-x-8 translate-y-3 sm:translate-y-4 w-28 sm:w-32 text-center">
                    Purchased
                  </div>
                )}
                
                <div className="p-4 sm:p-5">
                  <div className="flex items-start mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 ${
                      isToolPurchased(tool._id)
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${
                        isToolPurchased(tool._id)
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {tool.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  
                  {isToolPurchased(tool._id) ? (
                    <button
                      onClick={() => {
                        setShowPremiumToolsModal(false);
                        navigate(`/${user.role}-dashboard/tools/${tool.link}`);
                      }}
                      className="w-full py-2 px-3 sm:px-4 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-900 text-green-700 dark:text-green-300 rounded-md sm:rounded-lg font-medium transition-colors flex items-center justify-center text-xs sm:text-sm"
                    >
                      <FiCheckCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Access Tool
                    </button>
                  ) : (
                    <div className="flex justify-between items-center mt-3 sm:mt-4">
                      <div className="text-sm sm:text-base">
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          ₹{tool.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePurchase(tool._id)}
                        disabled={loading}
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg font-medium text-white transition-colors text-xs sm:text-sm ${
                          loading 
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {loading ? 'Processing...' : 'Purchase'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Bundle Offer - Responsive */}
          {premiumTools.length > 1 && (
            <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-700 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"></div>
              <div className="absolute -left-8 -bottom-8 w-32 h-32 sm:w-40 sm:h-40 bg-blue-300 dark:bg-blue-700 rounded-full opacity-10"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-3 sm:mb-0">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-1 sm:mb-2">
                      Premium Bundle
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 max-w-lg">
                      Get all tools at <span className="font-bold">30% discount</span>
                    </p>
                  </div>
                   <div className="text-right">
    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 dark:text-blue-200">
      ₹{discountedPrice}
    </div>
    <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
      <span className="line-through mr-1 sm:mr-2">₹{total}</span>
      Save ₹{savings}
    </div>
  </div>
                </div>
                <button
                  onClick={() => handlePurchase('premium-bundle')}
                  disabled={loading}
                  className={`mt-4 w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-bold text-white transition-all text-sm sm:text-base ${
                    loading 
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? 'Processing...' : 'Get Complete Package'}
                </button>
              </div>
            </div>
          )}
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

{/* Enhanced ToolCard Component */}
const ToolCard = ({ title, description, icon, onClick, isFree = false, isPremium = false, isLocked = false }) => {
  return (
    <motion.div 
      whileHover={{ y: window.innerWidth > 768 ? -5 : 0 }} // Only animate hover on desktop
      whileTap={{ scale: 0.98 }} // Add tap feedback on mobile
      className={`relative overflow-hidden h-full border ${
        isFree
          ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10'
          : isPremium
            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10'
            : isLocked
              ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10'
              : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
      } rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all duration-300`}
      onClick={onClick}
    >
      <div className="p-3 sm:p-4 md:p-5 h-full flex flex-col">
        {/* Badge - Responsive */}
        {isFree && (
          <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-[10px] xs:text-xs font-medium px-2 py-0.5 rounded-full">
            FREE
          </span>
        )}
        {isPremium && (
          <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-[10px] xs:text-xs font-medium px-2 py-0.5 rounded-full">
            PREMIUM
          </span>
        )}
        
        <div className="flex items-start mb-2 sm:mb-3 md:mb-4">
          <div className={`p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 ${
            isFree
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : isPremium
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : isLocked
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {React.cloneElement(icon, { className: "h-4 w-4 sm:h-5 sm:w-5" })}
          </div>
          <div className="flex-1">
            <h3 className={`text-sm sm:text-base md:text-lg font-bold ${
              isLocked ? 'text-orange-700 dark:text-orange-300' : 'text-gray-900 dark:text-white'
            }`}>
              {title}
            </h3>
            <p className={`mt-1 text-xs sm:text-sm ${
              isLocked ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {description}
            </p>
          </div>
        </div>
        
        <div className="mt-auto">
          {isLocked ? (
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">
                <FiLock className="inline mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Premium
              </span>
              <button 
                className="text-xs sm:text-sm bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-md sm:rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card onClick from firing
                  onClick();
                }}
              >
                Unlock
              </button>
            </div>
          ) : (
            <button 
              className={`w-full py-1 sm:py-2 px-3 sm:px-4 rounded-md sm:rounded-lg font-medium transition-colors flex items-center justify-center text-xs sm:text-sm ${
                isFree
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-900 dark:text-blue-300'
                  : 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:hover:bg-green-900 dark:text-green-300'
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card onClick from firing
                onClick();
              }}
            >
              {isFree ? 'Use Tool' : 'Access Tool'}
              <FiArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenteePage;