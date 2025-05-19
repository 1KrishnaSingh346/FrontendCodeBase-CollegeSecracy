import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const FullScreenLoader = ({ isLoading }) => {
  if (!isLoading) return null; // Hide when not needed

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center bg-white p-6 rounded-lg shadow-xl"
      >
        {/* Spinning Loader Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <Loader2 size={50} className="text-blue-500 animate-spin" />
        </motion.div>

        {/* Loading Text */}
        <p className="mt-4 text-gray-700 text-lg font-semibold">
          Please wait...
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FullScreenLoader;
