import { motion } from "framer-motion";
import { Database } from "lucide-react";

const DataFetchLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Rotating Database Icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      >
        <Database size={50} className="text-blue-500" />
      </motion.div>

      {/* Text */}
      <p className="mt-4 text-gray-600 text-lg font-medium">
        Fetching data...
      </p>
    </div>
  );
};

export default DataFetchLoader;
