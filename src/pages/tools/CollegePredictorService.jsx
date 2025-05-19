import { useState, useEffect } from 'react';
import { FiBook, FiFilter, FiDownload, FiTrendingUp, FiAward, FiMapPin, FiClock, FiX, FiChevronLeft, FiChevronRight, FiSun, FiMoon, FiCheck, FiZap, FiBarChart2, FiLayers, FiUsers, FiGlobe, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CollegePredictorService = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Theme setup
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const services = [
    {
      id: 'josaa',
      title: 'JOSAA & CSAB',
      subtitle: 'IITs | NITs | IIITs | GFTIs',
      icon: <FiAward className="text-2xl" />,
      description: 'Comprehensive prediction engine with multi-round analysis for premier engineering institutes.',
      features: [
        "Analyze rank for IIT/NIT/IIIT/GFTI colleges",
        "3-year cutoff trends (2024-2022)",
        "Up to 6 rounds of counseling data",
        "Advanced filters: Branch, State, Duration",
        "Export choices as PDF",
        "Personalized recommendation engine",
        "College comparison tool"
      ],
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      buttonColor: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      redirectTo: '/tools/college-predictor'
    },
    {
      id: 'uptac',
      title: 'UPTAC',
      subtitle: 'AKTU Affiliated Colleges',
      icon: <FiMapPin className="text-2xl" />,
      description: 'Specialized predictor for Uttar Pradesh technical colleges with location-based analytics.',
      features: [
        "AKTU college rank analyzer",
        "3-year UPTAC cutoff trends",
        "Smart location-based filters",
        "Branch preference analyzer",
        "Priority list generator",
        "College infrastructure insights",
        "Placement statistics"
      ],
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      buttonColor: 'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800',
      redirectTo: '/tools/state-college-predictor'
    },
    {
      id: 'state',
      title: 'State Counseling',
      subtitle: 'Multiple State Boards',
      icon: <FiGlobe className="text-2xl" />,
      description: 'State-specific counseling predictors for engineering admissions across India.',
      features: [
        "Coverage for 10+ state counseling boards",
        "Regional college insights",
        "Local quota analysis",
        "State-specific cutoff trends",
        "Document requirement guides",
        "Seat matrix visualization",
        "Counseling schedule tracker"
      ],
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
      buttonColor: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
      redirectTo: '/tools/state-counseling'
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  const handlePayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_TEST_KEY,
      amount: '19900',
      currency: 'INR',
      name: 'College Predictor Powered By CollegeSecracy',
      description: `${selectedService === 'josaa' ? 'JOSAA & CSAB' : selectedService === 'uptac' ? 'UPTAC' : 'State Counseling'} Premium Plan`,
      image: 'https://example.com/logo.png',
      handler: function(response) {
        const service = services.find(s => s.id === selectedService);
        navigate(service.redirectTo);
      },
      theme: {
        color: darkMode ? '#1f2937' : '#3b82f6'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    if (showModal) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showModal]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* SVG Background with better visibility */}
      <div className="fixed inset-0 overflow-hidden -z-10 opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" 
                stroke={darkMode ? 'rgba(156, 163, 175, 0.3)' : 'rgba(209, 213, 219, 0.5)'} 
                strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(249, 250, 251, 0.8)'} />
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        {/* Blue blob */}
        <div className={`absolute -left-20 -top-20 w-64 h-64 rounded-full filter blur-3xl opacity-20 ${darkMode ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
        {/* Orange blob */}
        <div className={`absolute -right-20 bottom-1/3 w-72 h-72 rounded-full filter blur-3xl opacity-20 ${darkMode ? 'bg-orange-600' : 'bg-orange-400'}`}></div>
        {/* Purple blob */}
        <div className={`absolute right-1/4 -bottom-20 w-56 h-56 rounded-full filter blur-3xl opacity-20 ${darkMode ? 'bg-purple-600' : 'bg-purple-400'}`}></div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed right-6 top-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-white hover:bg-gray-100 text-gray-700'
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
      </button>

      {/* Hero Section */}
      <div className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute inset-0 bg-[url('https://uploads-ssl.webflow.com/5f5a53e153805db840dae2db/60d5595dcc9b9d0f9a8d1a1f_noise-texture.png')] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 mb-4 rounded-full backdrop-blur-sm bg-white/10 border border-white/10"
          >
            <span className="text-sm font-medium text-white/90">AI-Powered College Admissions</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
          >
            Smart College Predictor
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto mb-8"
          >
            Data-driven counseling solutions with 95% accuracy for JOSAA, CSAB, UPTAC and state-level admissions
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => {
                setSelectedService('josaa');
                setShowModal(true);
              }}
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started - ₹999/year
            </button>
            <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute -bottom-1 left-0 right-0 overflow-hidden">
          <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              fill={darkMode ? '#111827' : '#f9fafb'}
            ></path>
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              opacity=".5" 
              fill={darkMode ? '#111827' : '#f9fafb'}
            ></path>
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              fill={darkMode ? '#111827' : '#f9fafb'}
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Features Section */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12 sm:mb-16 relative"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">Our Predictive Analytics Engine</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
            <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Combining historical data with machine learning to give you the most accurate college predictions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: <FiBarChart2 className="text-3xl" />, title: "Data-Driven", desc: "Analyzing 5+ years of cutoff trends" },
              { icon: <FiZap className="text-3xl" />, title: "Real-Time", desc: "Updated with latest counseling data" },
              { icon: <FiLayers className="text-3xl" />, title: "Multi-Round", desc: "Simulates all counseling rounds" },
              { icon: <FiUsers className="text-3xl" />, title: "Personalized", desc: "Tailored to your preferences" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-6 rounded-xl ${
                  darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-gray-200'
                } border shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg mb-4 ${
                  darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Services Slider */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">Our Counseling Solutions</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
            <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Comprehensive predictors for all major engineering admission processes in India
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Navigation Arrows - Desktop */}
            <button 
              onClick={prevSlide}
              className={`hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full shadow-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'
              } transition-colors hover:shadow-md`}
              aria-label="Previous slide"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            
            <button 
              onClick={nextSlide}
              className={`hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full shadow-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'
              } transition-colors hover:shadow-md`}
              aria-label="Next slide"
            >
              <FiChevronRight className="text-xl" />
            </button>

            {/* Slider Track */}
            <div className="overflow-hidden">
              <motion.div 
                className="flex"
                animate={{ x: `-${currentSlide * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {services.map((service) => (
                  <div key={service.id} className="w-full flex-shrink-0 px-2 sm:px-4">
                    <div className={`relative rounded-2xl overflow-hidden h-full ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border shadow-xl hover:shadow-2xl transition-all duration-300`}>
                      {/* Background Image */}
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={service.image} 
                          alt="" 
                          className="w-full h-full object-cover opacity-20"
                        />
                        <div className={`absolute inset-0 ${
                          darkMode ? 'bg-gray-900/80' : 'bg-white/30'
                        }`}></div>
                      </div>
                      
                      <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
                        <div className="flex items-center mb-4 sm:mb-6">
                          <div className={`p-3 rounded-xl mr-4 ${
                            darkMode ? 'bg-gray-700/60 text-blue-400' : 'bg-white/80 text-blue-600'
                          } backdrop-blur-sm shadow-sm`}>
                            {service.icon}
                          </div>
                          <div>
                            <h3 className={`text-xl sm:text-2xl font-bold ${
                              darkMode ? 'text-white' : 'text-gray-800'
                            }`}>{service.title}</h3>
                            <p className={`text-xs sm:text-sm ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>{service.subtitle}</p>
                          </div>
                        </div>
                        
                        <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {service.description}
                        </p>
                        
                        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                          {service.features.map((feature, index) => (
                            <li key={index} className={`flex items-start ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            } text-sm sm:text-base`}>
                              <span className={`mt-0.5 mr-3 flex-shrink-0 ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                <FiCheck className="inline" />
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <button
                          onClick={() => {
                            setSelectedService(service.id);
                            setShowModal(true);
                          }}
                          className={`w-full py-3 px-6 rounded-xl font-medium text-white bg-gradient-to-r ${
                            service.buttonColor
                          } transition-all hover:shadow-lg`}
                        >
                          Enroll Now - ₹999/year
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Arrows - Mobile */}
            <div className="flex justify-center mt-4 sm:hidden space-x-4">
              <button 
                onClick={prevSlide}
                className={`p-3 rounded-full shadow-md ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'
                } transition-colors`}
                aria-label="Previous slide"
              >
                <FiChevronLeft className="text-xl" />
              </button>
              <button 
                onClick={nextSlide}
                className={`p-3 rounded-full shadow-md ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'
                } transition-colors`}
                aria-label="Next slide"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </div>

            {/* Slider Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index ? 'bg-gradient-to-r from-orange-500 to-pink-500 w-6' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">Trusted by Students</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
            <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Hear from students who secured admissions with our predictor
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: "Rahul Sharma", 
                college: "IIT Bombay, CSE", 
                text: "The predictor helped me secure my dream branch at IIT Bombay. The multi-round analysis was spot on!",
                rating: 5
              },
              { 
                name: "Priya Patel", 
                college: "NIT Trichy, ECE", 
                text: "Accurate predictions with great filtering options. Saved me hours of research and uncertainty.",
                rating: 5
              },
              { 
                name: "Amit Kumar", 
                college: "IIIT Hyderabad, CSE", 
                text: "The state quota analysis feature was invaluable. Got into my preferred college with better branch.",
                rating: 4
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-6 rounded-xl ${
                  darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-gray-200'
                } border shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-bold dark:text-white">{testimonial.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.college}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={`p-6 sm:p-8 rounded-2xl ${
              darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-lg max-w-4xl mx-auto`}
          >
            <h3 className="text-2xl font-bold mb-6 dark:text-white text-center">Transparent Pricing</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <th className="pb-4 text-left font-medium dark:text-gray-300">Feature</th>
                    <th className="pb-4 text-center font-medium dark:text-gray-300">Competitors</th>
                    <th className="pb-4 text-center font-medium dark:text-gray-300">Our Solution</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Multi-round analysis", competitors: "₹1,500-2,000", our: "Included" },
                    { feature: "Historical data (3+ years)", competitors: "Extra ₹500", our: "Included" },
                    { feature: "Advanced filters", competitors: "Limited", our: "Full access" },
                    { feature: "PDF export", competitors: "Extra ₹300", our: "Included" },
                    { feature: "Support", competitors: "Email only", our: "Priority chat + email" }
                  ].map((row, index) => (
                    <tr 
                      key={index} 
                      className={`border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <td className="py-4 text-left dark:text-gray-300">{row.feature}</td>
                      <td className="py-4 text-center dark:text-gray-300">{row.competitors}</td>
                      <td className="py-4 text-center font-medium text-blue-600 dark:text-blue-400">{row.our}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 text-center">
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                All features included for just <span className="font-bold text-blue-600 dark:text-blue-400">₹999/year</span>
              </p>
              <button
                onClick={() => {
                  setSelectedService('josaa');
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Get Started Now
              </button>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">Frequently Asked Questions</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How accurate are the predictions?",
                answer: "Our predictions have a 95% accuracy rate based on historical data analysis and machine learning algorithms. We continuously update our models with the latest cutoff trends."
              },
              {
                question: "Do you cover all counseling rounds?",
                answer: "Yes, our predictor analyzes all rounds of counseling including special rounds and spot rounds where applicable."
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer: "We offer a 7-day money-back guarantee if you're not satisfied with our service. Just contact our support team."
              },
              {
                question: "How often is the data updated?",
                answer: "We update our database after each counseling round and maintain historical data for the past 5 years."
              },
              {
                question: "Is my personal data secure?",
                answer: "Absolutely. We use bank-grade encryption and never share your data with third parties."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`mb-4 rounded-xl overflow-hidden ${
                  darkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-gray-200'
                } border shadow-sm`}
              >
                <button className="w-full p-4 sm:p-6 text-left flex justify-between items-center">
                  <span className={`text-lg font-medium ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`p-4 sm:p-6 pt-0 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {faq.answer}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className={`rounded-2xl overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl max-w-5xl mx-auto`}
          >
            <div className="grid md:grid-cols-2">
              <div className={`p-8 sm:p-12 ${
                darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-600 to-purple-600'
              }`}>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to make the right choice?</h3>
                <p className="text-blue-100 mb-6">
                  Join thousands of students who secured their dream colleges with our predictor
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setSelectedService('josaa');
                      setShowModal(true);
                    }}
                    className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Get Started - ₹999/year
                  </button>
                  <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
              <div className={`p-8 sm:p-12 ${
                darkMode ? 'bg-gray-800/70' : 'bg-white'
              }`}>
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl mr-4 ${
                    darkMode ? 'bg-gray-700/60 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <FiDollarSign className="text-2xl" />
                  </div>
                  <h4 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>Money Back Guarantee</h4>
                </div>
                <p className={`mb-6 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  We're confident in our predictor. If you're not satisfied within 7 days, we'll refund your payment.
                </p>
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${
                    darkMode ? 'bg-gray-700/60 text-orange-400' : 'bg-orange-100 text-orange-600'
                  }`}>
                    <FiUsers className="text-2xl" />
                  </div>
                  <h4 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>24/7 Support</h4>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t ${
        darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Services</h4>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.id}>
                    <button
                      onClick={() => {
                        setSelectedService(service.id);
                        setShowModal(true);
                      }}
                      className={`text-sm ${
                        darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {service.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>About Us</a></li>
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Careers</a></li>
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Privacy Policy</a></li>
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Blog</a></li>
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Help Center</a></li>
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Cutoff Trends</a></li>
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Counseling Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Contact Us</a></li>
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Twitter</a></li>
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Facebook</a></li>
                <li><a href="#" className={`text-sm ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className={`mt-12 pt-8 border-t ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
          } flex flex-col md:flex-row justify-between items-center`}>
            <div className="flex items-center mb-4 md:mb-0">
              <FiAward className={`text-2xl mr-2 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-lg font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>CollegeSecracy</span>
            </div>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              © {new Date().getFullYear()} CollegeSecracy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative rounded-2xl max-w-md w-full overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-2xl`}
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold dark:text-white">
                  {selectedService === 'josaa' ? 'JOSAA & CSAB' : selectedService === 'uptac' ? 'UPTAC' : 'State Counseling'} Enrollment
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-full ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } transition-colors`}
                  aria-label="Close modal"
                >
                  <FiX className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Plan Card */}
              <div className={`p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 ${
                darkMode ? 'bg-gray-700/50' : 'bg-blue-50/70'
              } backdrop-blur-sm border ${
                darkMode ? 'border-gray-600' : 'border-blue-100'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-lg dark:text-white">Premium Plan</h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Full access to all features</p>
                  </div>
                  <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${
                    darkMode ? 'bg-gray-600/50' : 'bg-white'
                  } shadow-sm backdrop-blur-sm`}>
                    <span className="font-bold dark:text-white">₹999</span>
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>/year</span>
                  </div>
                </div>
                
                <ul className="space-y-2 sm:space-y-3 text-sm">
                  {[
                    "Unlimited college predictions",
                    "Historical cutoff analytics",
                    "Advanced filtering options",
                    "PDF export functionality",
                    "Priority email support",
                    "7-day money back guarantee"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`mt-0.5 mr-2 ${
                        darkMode ? 'text-blue-400' : 'text-blue-500'
                      }`}>✓</span>
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Razorpay Payment Button */}
              <button
                onClick={handlePayment}
                className={`w-full py-3 px-6 rounded-xl font-medium text-white ${
                  darkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
                } transition-colors hover:shadow-lg`}
              >
                Pay with Razorpay
              </button>

              <p className={`mt-3 text-center text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Secure payments powered by Razorpay
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CollegePredictorService;