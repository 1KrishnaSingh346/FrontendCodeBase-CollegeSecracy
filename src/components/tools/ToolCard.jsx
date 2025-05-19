import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const ToolCard = ({ title, description, icon, gradient, link, theme = 'dark' }) => {
  // Theme-based classes
  const themeClasses = {
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    cardBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    titleColor: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    buttonBg: theme === 'dark' ? 'bg-orange-600 hover:bg-orange-500' : 'bg-orange-500 hover:bg-orange-400',
    shadow: theme === 'dark' ? 'shadow-lg hover:shadow-xl' : 'shadow-md hover:shadow-lg'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${themeClasses.cardBg} ${themeClasses.cardBorder}
        rounded-xl overflow-hidden border
        ${themeClasses.shadow}
        transition-all duration-200
        h-full flex flex-col
      `}
    >
      <div className="p-6 h-full flex flex-col">
        <div className={`bg-gradient-to-r ${gradient} w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-inner`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>
        
        <h3 className={`text-xl font-bold ${themeClasses.titleColor} mb-2`}>
          {title}
        </h3>
        
        <p className={`${themeClasses.textColor} mb-4 text-sm md:text-base`}>
          {description}
        </p>
        
        <Link 
          to={link}
          className={`
            mt-auto ${themeClasses.buttonBg}
            text-white font-medium py-2 px-4 rounded-lg
            transition-colors text-center
            focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50
          `}
        >
          Use Tool
        </Link>
      </div>
    </motion.div>
  );
};

ToolCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  gradient: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['light', 'dark'])
};

ToolCard.defaultProps = {
  theme: 'dark'
};

export default ToolCard;