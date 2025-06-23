import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InitialLoader = ({ isPageLoaded }) => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [theme, setTheme] = useState("dark");

  const msgs = [
    "Unlocking knowledge vault...",
    "Setting up your learning desk...",
    "Fueling mentorship engine...",
    "Securing academic network...",
    "Preparing your digital campus..."
  ];

  useEffect(() => {
    const t = localStorage.getItem("darkMode") === "true" ? "dark" : "light";
    setTheme(t);
  }, []);

  useEffect(() => {
    if (isPageLoaded) {
      const timeout = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timeout);
    } else setVisible(true);
  }, [isPageLoaded]);

  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % msgs.length), 2200);
    return () => clearInterval(iv);
  }, []);

  const themeColors = {
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      subtext: "text-gray-400",
      primary: "from-purple-500 via-pink-500 to-indigo-600",
      secondary: "via-pink-500",
      svgFill: "#a78bfa",
      dot1: "#8b5cf6",
      dot2: "#ec4899",
      bgPattern: "#1e1b4b",
      particle: "rgba(167, 139, 250, 0.6)"
    },
    light: {
      bg: "bg-gray-50",
      text: "text-gray-900",
      subtext: "text-gray-600",
      primary: "from-blue-500 via-cyan-500 to-teal-500",
      secondary: "via-emerald-500",
      svgFill: "#3b82f6",
      dot1: "#3b82f6",
      dot2: "#10b981",
      bgPattern: "#e0f2fe",
      particle: "rgba(59, 130, 246, 0.6)"
    }
  };

  const colors = themeColors[theme];

  // Floating particles configuration
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 0.5 + 0.3,
    delay: Math.random() * 2
  }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${colors.bg}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Animated Gradient Background */}
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} opacity-50`} />
          </motion.div>

          {/* SVG Background Pattern with Floating Particles */}
          <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-15">
            <svg
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <rect width="100" height="100" fill={colors.bgPattern} />
              {particles.map((particle) => (
                <motion.circle
                  key={particle.id}
                  cx={particle.x}
                  cy={particle.y}
                  r={particle.size}
                  fill={colors.particle}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    cx: particle.x + (Math.random() * 2 - 1),
                    cy: particle.y + (Math.random() * 2 - 1)
                  }}
                  transition={{
                    delay: particle.delay,
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              ))}
              <path
                d="M0,20 Q50,25 100,20 T200,20"
                stroke={colors.svgFill}
                strokeWidth="0.3"
                fill="none"
                strokeDasharray="2 2"
              />
            </svg>
          </div>

          {/* Main Content */}
          <motion.div
            className="relative z-10 text-center p-6 sm:p-8 max-w-md w-full mx-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
            {/* Animated Knowledge Hub Icon */}
            <motion.div
              className="mb-6 mx-auto w-28 h-28 relative"
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -8, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
            >
              <svg
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Book Cover */}
                <motion.path
                  d="M128 80v352a48 48 0 0 0 48 48h224a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48H176a48 48 0 0 0-48 48z"
                  fill="none"
                  stroke={colors.svgFill}
                  strokeWidth="24"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                {/* Pages */}
                <motion.path
                  d="M128 80c0-26.5 21.5-48 48-48h224c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48H176c-26.5 0-48-21.5-48-48V80z"
                  fill="none"
                  stroke={colors.text}
                  strokeWidth="16"
                  strokeDasharray="10 5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
                {/* Knowledge Sparkles */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <circle cx="256" cy="160" r="8" fill={colors.dot1} />
                  <circle cx="320" cy="240" r="6" fill={colors.dot2} />
                  <circle cx="200" cy="280" r="5" fill={colors.dot1} />
                </motion.g>
              </svg>
              
              {/* Animated Glow */}
              <motion.div
                className="absolute inset-0 rounded-full blur-md"
                style={{
                  background: `radial-gradient(circle at center, ${colors.svgFill} 0%, transparent 70%)`
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [0.9, 1.1, 0.9]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Brand Name with Subtle Glow */}
            <div className="relative inline-block">
              <motion.h1
                className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent mb-1`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                CollegeSecracy
              </motion.h1>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-1 blur-sm"
                style={{
                  background: `linear-gradient(90deg, ${colors.dot1}, ${colors.dot2})`
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>

            <motion.p
              className={`text-xs ${colors.subtext} mb-6`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8, transition: { delay: 0.8 } }}
            >
              Your Gateway to Academic Excellence
            </motion.p>

            {/* Animated Message with Typing Effect */}
            <motion.div className="h-14 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <p className={`text-lg ${colors.subtext} font-medium`}>
                    {msgs[idx]}
                    <motion.span
                      className="ml-1 inline-block w-1 h-5 align-middle"
                      style={{ backgroundColor: colors.text }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* DNA Strand Loading Indicator */}
            <div className="flex justify-center mt-6">
              <svg width="120" height="24" viewBox="0 0 120 24" className="mx-auto">
                {[0, 1, 2, 3, 4].map((i) => (
                  <g key={i} transform={`translate(${i * 24}, 0)`}>
                    <motion.path
                      d="M12 0 C 18 8, 6 16, 12 24"
                      stroke={colors.dot1}
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    />
                    <motion.path
                      d="M12 0 C 18 8, 6 16, 12 24"
                      stroke={colors.dot2}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="0.1 0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: i * 0.1 + 0.4,
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    />
                    <motion.circle
                      cx="12"
                      cy="0"
                      r="2"
                      fill={colors.dot1}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    <motion.circle
                      cx="12"
                      cy="24"
                      r="2"
                      fill={colors.dot2}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{
                        delay: i * 0.1 + 0.4,
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Footer Note with Animated Progress */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="h-1 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${colors.primary}`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "linear" }}
                />
              </div>
              <p className={`text-xs ${colors.subtext} flex items-center justify-center`}>
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  ⚡
                </motion.span>
                Empowering {new Date().getFullYear()} learners
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-block ml-2"
                >
                  🚀
                </motion.span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader;