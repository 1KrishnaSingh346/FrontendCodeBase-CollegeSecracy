import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import StarRating from './StudentPages/Components/StarRating.jsx';
import Logo  from "/Logo.webp";
import { 
  FiLogOut, 
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
  FiX
} from 'react-icons/fi';
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { PageLoader } from '../components/Loaders/script.js';
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
    purchasePremium, 
    loading, 
    error, 
    updateProfile, 
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
    suggestions: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Premium plans data
  const premiumPlans = [
    {
      id: 'josaa',
      title: "JOSAA Choice Filling",
      tag: "Most Popular",
      price: "₹599",
      sessions: "Till JOSAA Counselling",
      features: [
        "Optimal branch-institute selection",
        "Round-wise strategy planning",
        "Cutoff analysis & prediction",
        "Document verification support"
      ],
      highlight: true
    },
    {
      id: 'jac-delhi',
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
      id: 'uptac',
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
      id: 'whatsapp',
      title: "WhatsApp Support Package",
      price: "₹999",
      sessions: "Till JOSAA Counselling",
      features: [
        "24/7 query resolution",
        "Quick document review",
        "Application assistance",
        "Deadline reminders"
      ]
    }
  ];

  // Events data
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
      if (user.feedback) {
        setFeedback({
          rating: user.feedback.rating || 0,
          message: user.feedback.message || '',
          suggestions: user.feedback.suggestions || ''
        });
      }
    }
  }, [user, loadUser, initializeAuth, initialAuthCheckComplete]);

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

  const handlePurchase = async (planId = 'premium') => {
    try {
      await purchasePremium(planId);
      toast.success('Payment successful!');
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.rating) {
      toast.error('Please provide a rating');
      return;
    }
  
    if (feedback.message.trim().length < 10) {
      toast.error('Please provide more detailed feedback (at least 10 characters)');
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      await submitFeedback(feedback);
      toast.success('Feedback submitted successfully!');
      setSubmitted(true);
      setFeedback(prev => ({ ...prev, message: '', suggestions: '' }));
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

  if (!user || !initialAuthCheckComplete) return <PageLoader />;

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
          <DashboardStats user={user} />

          {/* Quick Actions */}
          <motion.div 
            variants={fadeIn}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiTool className="mr-2 text-blue-500" />
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <DashboardButton
                  icon={<FiCalendar className="text-orange-500" />}
                  label="Study Planner"
                  onClick={() => navigate(`/${user.role}-dashboard/tools/study-planner`)}
                  disabled={!user.premium}
                />
                <DashboardButton
                  icon={<FiBook className="text-blue-500" />}
                  label="Resources"
                  onClick={() => navigate(`/${user.role}-dashboard/resources`)}
                />
                <DashboardButton
                  icon={<FiAward className="text-green-500" />}
                  label="Mock Tests"
                  onClick={() => navigate(`/${user.role}-dashboard/tests`)}
                  disabled={!user.premium}
                />
                <DashboardButton
                  icon={<FiBarChart2 className="text-purple-500" />}
                  label="Progress"
                  onClick={() => navigate(`/${user.role}-dashboard/progress`)}
                />
              </div>
            </div>
          </motion.div>

          {/* Premium Status */}
          <motion.div 
            variants={fadeIn}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-2 ${user.premium ? 'border-green-500' : 'border-yellow-500'}`}
          >
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                {user.premium ? (
                  <FiUnlock className="mr-2 text-green-500" />
                ) : (
                  <FiLock className="mr-2 text-yellow-500" />
                )}
                {user.premium ? 'Premium Access' : 'Upgrade to Premium'}
              </h2>
              
              {user.premium ? (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    You have full access to all premium features.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 dark:text-green-200">Premium Benefits:</h3>
                    <ul className="mt-2 space-y-2 text-sm text-green-700 dark:text-green-300">
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>All study tools unlocked</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Personalized counseling</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Priority support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Unlock all premium tools and features to boost your JEE preparation.
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Premium Includes:</h3>
                    <ul className="mt-2 space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>College predictor tool</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Personalized study plan</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Expert counseling sessions</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handlePurchase('premium')}
                    disabled={loading}
                    className={`w-full mt-4 py-2 px-4 rounded-lg font-medium text-white transition-colors ${
                      loading 
                        ? 'bg-gray-400 dark:bg-gray-600' 
                        : 'bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Upgrade Now (₹299)'}
                  </button>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Counseling Plans Section */}
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

            {/* Mobile View - Horizontal Scroll */}
            <div className="md:hidden overflow-x-auto scrollbar-hide pb-6">
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
                        <div className="bg-gradient-to-r md:text-base text-sm from-orange-500 to-orange-600 text-white font-bold px-3 py-1 rounded-full w-max mb-4 shadow-lg backdrop-blur-sm">
                          {plan.tag}
                        </div>
                      )}
                      <h3 className="md:text-xl text-lg font-bold text-gray-900 dark:text-white mb-3">{plan.title}</h3>
                      <div className="md:text-3xl text-base font-bold text-orange-600 dark:text-orange-400 mb-4">
                        {plan.price}
                        <span className="md:text-sm text-xs text-gray-500 dark:text-gray-400">/package</span>
                      </div>
                      <div className="flex items-center mb-4 bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                        <FiCalendar className="md:h-5 h-4 w-4 md:w-5 mr-2 text-orange-500" />
                        <span className="text-gray-700 dark:text-gray-300 md:text-sm text-xs">{plan.sessions}</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <FiCheckCircle className="md:h-5 md:w-5 h-3 w-3 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300 md:text-sm text-xs">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => handlePurchase(plan.id)}
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
                      <FiCalendar className="h-5 w-5 mr-2 text-orange-500" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{plan.sessions}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <FiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => handlePurchase(plan.id)}
                      className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center backdrop-blur-sm ${
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
    
        {/* Tools Section */}
        <motion.section 
          id="tools-section"
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiTool className="mr-2 text-orange-500" />
              Study Tools
            </h2>
      
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ToolCard 
                title="Rank Calculator"
                description="Calculate your expected rank based on marks"
                icon={<FiBarChart2 className="text-blue-500" />}
                onClick={() => navigate(`/${user.role}-dashboard/tools/rank-calculator`)}
                premium={false}
              />
              <ToolCard 
                title="Percentile Calculator"
                description="Estimate your JEE Main percentile"
                icon={<FiPercent className="text-purple-500" />}
                onClick={() => navigate('/tools/percentile-calculator')}
                premium={false}
              />
              <ToolCard 
                title="CGPA Calculator"
                description="Calculate your CGPA from percentage"
                icon={<FiDollarSign className="text-green-500" />}
                onClick={() => navigate(`/${user.role}-dashboard/tools/cgpa-calculator`)}
                premium={false}
              />
              <ToolCard 
                title="College Predictor"
                description="Predict colleges based on your rank"
                icon={<FiAward className="text-orange-500" />}
                onClick={() => navigate(`/${user.role}-dashboard/tools/college-predictor`)}
                premium={true}
                locked={!user.premium}
              />
              <ToolCard 
                title="UPTAC College Predictor"
                description="Predict colleges based on your rank"
                icon={<FiAward className="text-orange-500" />}
                onClick={() => navigate(`/${user.role}-dashboard/tools/state-college-predictor`)}
                premium={true}
                locked={!user.premium}
              />
              <ToolCard 
                title="Study Planner"
                description="Create personalized study schedule"
                icon={<FiCalendar className="text-green-500" />}
                onClick={() => navigate(`/${user.role}-dashboard/tools/study-planner`)}
                premium={true}
                locked={!user.premium}
              />
              <ToolCard 
                title="Branch Comparison"
                description="Compare engineering branches"
                icon={<FiBook className="text-blue-500" />}
                onClick={() => navigate(`/${user.role}-dashboard/tools/branch-comparison`)}
                premium={true}
                locked={!user.premium}
              />
              <ToolCard 
                title="More Tools Coming"
                description="Exciting new tools in development"
                icon={<FiTool className="text-gray-500" />}
                onClick={() => {}}
                premium={false}
                disabled={true}
              />
            </div>
          </div>
        </motion.section>

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
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Rate Your Experience</h3>
                
                {submitted ? (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <FiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-green-800 dark:text-green-200">
                        Thank you for your feedback! We appreciate your input.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-2 md:text-sm text-xs text-green-600 dark:text-green-400 hover:underline"
                    >
                      Submit another feedback
                    </button>
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
                      <label htmlFor="feedback-message" className="block md:text-sm text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Feedback
                      </label>
                      <textarea
                        id="feedback-message"
                        name="message"
                        value={feedback.message}
                        onChange={handleFeedbackChange}
                        rows="3"
                        className="w-full md:px-4 px-2 py-1 md:py-2 border md:text-sm text-xs border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="What do you like about our platform?"
                        required
                        minLength="10"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="feedback-suggestions" className="block md:text-sm text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Suggestions for Improvement
                      </label>
                      <textarea
                        id="feedback-suggestions"
                        name="suggestions"
                        value={feedback.suggestions}
                        onChange={handleFeedbackChange}
                        rows="3"
                        className="w-full md:px-4 px-2 py-1 md:py-2 border md:text-base text-sm border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="What features would you like to see?"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-orange-600 rounded-md md:text-sm text-xs font-medium text-white hover:bg-orange-700 transition-colors ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      disabled={!feedback.rating || isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </form>
                )}
              </div>
              
              <div>
                <h3 className="font-medium md:text-base text-sm text-gray-800 dark:text-gray-200 mb-3">
                  Your Feedback History
                </h3>
                
                {user.feedback ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`h-4 w-4 ${user.feedback.rating >= star 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300 dark:text-gray-500'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(user.feedback.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {user.feedback.message && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        "{user.feedback.message}"
                      </p>
                    )}
                    
                    {user.feedback.suggestions && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Suggestion:</span> {user.feedback.suggestions}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg md:p-4 p-2 text-center">
                    <FiHelpCircle className="mx-auto md:h-8 h-5 w-5 md:w-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="md:text-sm text-xs text-gray-600 dark:text-gray-400">
                      You haven't submitted any feedback yet. Your feedback helps us improve!
                    </p>
                  </div>
                )}
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

const ToolCard = ({ title, description, icon, onClick, premium = false, locked = false, disabled = false }) => {
  return (
    <motion.div 
      whileHover={!disabled ? { y: -5 } : {}}
      className={`md:p-4 p-2 rounded-lg border ${
        locked || disabled
          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-orange-400 dark:hover:border-orange-400 cursor-pointer'
      }`}
      onClick={!locked && !disabled ? onClick : undefined}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-lg mr-4 ${
          locked || disabled
            ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`font-medium md:text-base text-sm ${
            locked || disabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
          }`}>
            {title}
            {premium && (
              <span className="ml-2 md:text-sm text-xs px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                PREMIUM
              </span>
            )}
          </h3>
          <p className={`md:text-sm text-xs ${
            locked || disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
          }`}>
            {description}
          </p>
          {locked && (
            <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center">
              <FiLock className="mr-1" /> Upgrade to unlock
            </div>
          )}
          {disabled && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              Coming soon
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenteePage;