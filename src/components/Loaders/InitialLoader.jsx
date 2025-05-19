import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Users, Lock } from "lucide-react";

const InitialLoader = ({ isPageLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [theme, setTheme] = useState("dark"); // Default to dark
  
  // Array of icon components with unique IDs
  const icons = [
    { id: 1, component: GraduationCap, name: "GraduationCap" },
    { id: 2, component: BookOpen, name: "BookOpen" },
    { id: 3, component: Users, name: "Users" },
    { id: 4, component: Lock, name: "Lock" }
  ];
  
  const messages = [
    "Loading campus resources...",
    "Preparing mentorship tools...",
    "Connecting student network...",
    "Securing your data..."
  ];

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("darkMode") === "true" ? "dark" : "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (isPageLoaded) {
      // When page is loaded, wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setIsLoaderVisible(false);
      }, 700); // Matches the transition duration
      return () => clearTimeout(timer);
    } else {
      setIsLoaderVisible(true);
    }
  }, [isPageLoaded]);

  useEffect(() => {
    if (!isLoaderVisible) return;

    // Reset progress when loader becomes visible
    setProgress(0);

    // Progress animation with easing
    let start = null;
    const duration = 3000; // 3 seconds total
    const animateProgress = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      // Ease-out function for smoother progression
      const easedProgress = easeOutQuad(progress / 100) * 100;
      setProgress(easedProgress);
      
      if (elapsed < duration) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    requestAnimationFrame(animateProgress);

    // Icon/message rotation
    const iconInterval = setInterval(() => {
      setCurrentIconIndex(prev => (prev + 1) % icons.length);
    }, 1500);

    return () => {
      clearInterval(iconInterval);
    };
  }, [isLoaderVisible, icons.length]);

  // Easing function for smooth progress animation
  const easeOutQuad = (t) => {
    return t * (2 - t);
  };

  const currentIcon = icons[currentIconIndex];
  const CurrentIcon = currentIcon.component;

  // Theme colors
  const themeColors = {
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      secondaryText: "text-gray-400",
      progressBg: "bg-gray-700",
      iconColor: "text-orange-400",
      logoIconColor: "text-orange-500",
      dotColor: ["#60a5fa", "#f97316"],
      footerText: "text-gray-500",
      gradientFrom: "from-blue-500",
      gradientTo: "to-orange-500"
    },
    light: {
      bg: "bg-gray-50",
      text: "text-gray-900",
      secondaryText: "text-gray-600",
      progressBg: "bg-gray-200",
      iconColor: "text-blue-600",
      logoIconColor: "text-blue-500",
      dotColor: ["#3b82f6", "#ea580c"],
      footerText: "text-gray-400",
      gradientFrom: "from-blue-500",
      gradientTo: "to-orange-500"
    }
  };

  const colors = themeColors[theme];

  return (
    <AnimatePresence>
      {isLoaderVisible && (
        <motion.div
          className={`fixed inset-0 flex flex-col items-center justify-center ${colors.bg} z-[9999]`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.7, ease: "easeInOut" }
          }}
        >
          {/* Main Content Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Custom spring curve
            className="flex flex-col items-center w-full px-4 sm:px-8 md:max-w-md text-center"
          >
            {/* Animated Icon */}
            <motion.div
              key={`icon-${currentIcon.id}`}
              initial={{ y: 10, opacity: 0, rotate: -5 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                rotate: 0,
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 sm:mb-6"
            >
              <CurrentIcon 
                size={48}
                className={colors.iconColor}
                strokeWidth={1.75}
              />
            </motion.div>

            {/* Logo + Text */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-1">
              <motion.div 
                className="flex justify-center sm:block"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <GraduationCap 
                  size={32}
                  className={colors.logoIconColor} 
                />
              </motion.div>
              <motion.h1 
                className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} bg-clip-text text-transparent tracking-tight`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.2, duration: 0.5 }
                }}
              >
                College<span className="text-blue-400">Secracy</span>
              </motion.h1>
            </div>

            {/* Rotating Message */}
            <motion.p
              key={`message-${currentIcon.id}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.3 }
              }}
              exit={{ opacity: 0 }}
              className={`${colors.secondaryText} mb-4 sm:mb-6 h-6 text-sm sm:text-base md:text-lg`}
            >
              {messages[currentIconIndex]}
            </motion.p>

            {/* Progress Bar */}
            <div className={`w-full max-w-xs sm:max-w-sm md:max-w-md ${colors.progressBg} rounded-full h-2 sm:h-2.5 mb-4 sm:mb-6 overflow-hidden`}>
              <motion.div
                className={`h-full bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} rounded-full`}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Percentage Indicator */}
            <motion.div
              className={`${colors.text} font-mono text-xs sm:text-sm mb-1`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.4 }
              }}
            >
              {Math.round(progress)}%
            </motion.div>

            {/* Animated Dots */}
            <div className="flex mt-1 sm:mt-2 space-x-1 sm:space-x-2">
              {[1, 2, 3].map((dot) => (
                <motion.div
                  key={`dot-${dot}`}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{ backgroundColor: colors.dotColor[0] }}
                  animate={{ 
                    y: [0, -6, 0],
                    backgroundColor: [
                      colors.dotColor[0], 
                      colors.dotColor[1], 
                      colors.dotColor[0]
                    ],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                    delay: dot * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            className={`absolute bottom-4 sm:bottom-6 ${colors.footerText} text-xxs sm:text-xs px-4 text-center`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.7,
              transition: { delay: 1 }
            }}
          >
            Connecting students with mentors since 2025
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader;