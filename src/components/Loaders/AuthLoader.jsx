import { motion } from "framer-motion";
import { Lock, KeyRound } from "lucide-react";

const AuthLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg"
      >
        {/* Lock Icon */}
        <Lock size={40} className="text-blue-500 mb-3" />

        {/* Rotating Key Loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <KeyRound size={30} className="text-gray-700" />
        </motion.div>

        {/* Text */}
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Authenticating...
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLoader;
