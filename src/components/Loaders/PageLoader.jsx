import { motion } from "framer-motion";
import { Loader2, BookOpen, Rocket, BrainCircuit } from "lucide-react";

const PageLoader = () => {
  // Mobile-first responsive values
  const iconSize = window.innerWidth < 640 ? 40 : 48;
  const textSize = window.innerWidth < 640 ? "text-xl" : "text-2xl";
  const containerPadding = window.innerWidth < 640 ? "p-6" : "p-8";
  const loaderWidth = window.innerWidth < 640 ? "w-48" : "w-64";

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] z-50 overflow-hidden touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Performance-optimized particles (reduced count for mobile) */}
      {[...Array(window.innerWidth < 640 ? 8 : 12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-400/20 pointer-events-none"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 40],
            x: [0, (Math.random() - 0.5) * 30],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}

      <motion.div
        className={`flex flex-col items-center space-y-4 sm:space-y-6 ${containerPadding} rounded-xl sm:rounded-2xl backdrop-blur-sm bg-slate-900/70 border border-slate-800/30 shadow-lg mx-4 sm:mx-0`}
        initial={{ scale: 0.96, y: 5 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 10,
          mass: 0.5
        }}
        style={{
          maxWidth: "calc(100vw - 2rem)", // Ensure doesn't touch screen edges
          width: "auto"
        }}
      >
        {/* Responsive Icon Container */}
        <motion.div 
          className="relative"
          style={{
            width: `${iconSize * 1.5}px`,
            height: `${iconSize * 1.5}px`
          }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "linear" 
            }}
          >
            <Loader2 
              className="text-blue-400/30" 
              style={{
                width: `${iconSize * 1.5}px`,
                height: `${iconSize * 1.5}px`
              }} 
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.08, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 12, -12, 0],
                y: [0, -4, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BookOpen 
                className="text-blue-400" 
                style={{
                  width: `${iconSize}px`,
                  height: `${iconSize}px`
                }} 
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1.05, 0.8]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.1, 0.2]
            }}
          >
            <BrainCircuit 
              className="text-indigo-400" 
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`
              }} 
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1.05, 0.8]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0.3, 0.4, 0.5]
            }}
          >
            <Rocket 
              className="text-cyan-400" 
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`
              }} 
            />
          </motion.div>
        </motion.div>

        {/* Responsive Text */}
        <motion.div className="relative overflow-hidden text-center max-w-full px-2">
          <motion.h2
            className={`${textSize} font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent leading-tight`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Preparing Your Experience
          </motion.h2>
          
          {/* Shine Effect (reduced on mobile) */}
          {window.innerWidth >= 640 && (
            <motion.div
              className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] pointer-events-none"
              animate={{ left: ["-100%", "150%"] }}
              transition={{
                delay: 1,
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeIn"
              }}
            />
          )}
        </motion.div>

        {/* Responsive Progress Bar */}
        <motion.div 
          className={`${loaderWidth} h-1.5 bg-slate-800 rounded-full overflow-hidden`}
          style={{
            maxWidth: '80vw'
          }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>

        {/* Status Message */}
        <motion.div 
          className="h-6 sm:h-8 flex items-center justify-center"
          style={{
            maxWidth: '80vw'
          }}
        >
          <motion.p
            className="text-xs sm:text-sm text-slate-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Loading resources...
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1,
                ease: "easeInOut"
              }}
              className="ml-0.5"
            >
              █
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="text-[0.65rem] sm:text-xs text-slate-500 mt-2 sm:mt-4 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8 }}
          style={{
            maxWidth: '80vw'
          }}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="mr-1"
          >
            ⚡
          </motion.span>
          Optimizing your journey
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PageLoader;