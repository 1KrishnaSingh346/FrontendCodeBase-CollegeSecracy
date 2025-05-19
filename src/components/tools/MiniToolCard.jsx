import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const MiniToolCard = ({ icon, name, path, theme = 'dark' }) => {
  // Determine theme classes based on the theme prop
  const themeClasses = {
    bg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    text: theme === 'dark' ? 'text-white' : 'text-gray-800',
    hoverBg: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    shadow: theme === 'dark' ? 'shadow-gray-900/50' : 'shadow-md',
    iconColor: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600',
    secondaryText: theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${themeClasses.bg}
        rounded-xl p-5 text-center cursor-pointer 
        shadow-md hover:shadow-lg ${themeClasses.shadow}
        transition-all duration-200
        border ${themeClasses.border}
        ${themeClasses.hoverBg}
        w-full h-full
      `}
    >
      <Link 
        to={path} 
        className="flex flex-col items-center justify-center h-full group"
        aria-label={`Go to ${name} tool`}
      >
        <span className={`text-3xl block mb-3 ${themeClasses.iconColor}`}>
          {icon}
        </span>
        <span className={`
          ${themeClasses.text} 
          font-medium text-lg
          transition-colors duration-200
        `}>
          {name}
        </span>
        <span className={`
          mt-2 text-sm ${themeClasses.secondaryText}
          opacity-0 group-hover:opacity-100 transition-opacity
        `}>
          Click to open
        </span>
      </Link>
    </motion.div>
  );
};

MiniToolCard.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['light', 'dark'])
};

MiniToolCard.defaultProps = {
  theme: 'dark'
};

export default MiniToolCard;