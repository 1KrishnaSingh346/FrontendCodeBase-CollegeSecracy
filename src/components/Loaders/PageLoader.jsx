import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10, repeat: Infinity, repeatType: "reverse" }}
      >
        {/* Glowing Animated Loader Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          className="relative"
        >
          <Loader2 className="w-14 h-14 text-blue-400 animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        </motion.div>

        {/* Loading Text with Shine */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
        >
          <motion.p className="text-slate-300 text-xl font-semibold tracking-wider">
            Preparing your experience...
          </motion.p>
          <motion.div
            className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ left: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PageLoader;
