import { FiLock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import React from 'react';

const ToolCard = ({
  title,
  description,
  icon,
  onClick,
  isFree = false,
  accessType = '',
  locked = false,
}) => {
  const isPremium = accessType === 'premium';

  const badge = isFree ? 'FREE' : isPremium ? 'PREMIUM' : null;
  const badgeColor = isFree
    ? 'from-blue-500 to-blue-600'
    : isPremium
      ? 'from-green-500 to-green-600'
      : '';

  const cardBg = locked
    ? 'bg-gradient-to-br from-orange-50/30 to-orange-100/20 dark:from-orange-900/10 dark:to-orange-800/10'
    : 'bg-white/70 dark:bg-gray-800/40 backdrop-blur-md';

  const borderColor = locked
    ? 'border-orange-300 dark:border-orange-600'
    : isFree
      ? 'border-blue-200 dark:border-blue-600'
      : isPremium
        ? 'border-green-300 dark:border-green-600'
        : 'border-gray-200 dark:border-gray-700';

  const iconBg =
    isFree
      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
      : isPremium
        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
        : locked
          ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';

  const titleColor = locked ? 'text-orange-700 dark:text-orange-300' : 'text-gray-900 dark:text-white';
  const descColor = locked ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className={`relative min-h-[10rem] h-full rounded-xl border ${borderColor} shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 flex flex-col justify-between ${cardBg}`}
      onClick={onClick}
    >
      {/* Badge */}
      {badge && (
        <span
          className={`absolute top-2 right-2 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${badgeColor} text-white shadow-sm`}
        >
          {badge}
        </span>
      )}

      {/* Icon + Text */}
      <div className="flex items-start gap-3 mb-2">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {React.cloneElement(icon, { className: 'h-5 w-5' })}
        </div>
        <div className="flex-1">
          <h3 className={`text-sm sm:text-base font-semibold ${titleColor}`}>{title}</h3>
          <p className={`text-xs sm:text-sm mt-0.5 ${descColor}`}>{description}</p>
          {isPremium && (
            <p className="text-[11px] mt-1 text-green-600 dark:text-green-400">Lifetime access</p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto pt-1">
        {locked ? (
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <FiLock className="h-4 w-4" /> Premium
            </span>
            <button
              className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Unlock
            </button>
          </div>
        ) : (
          <button
            className={`w-full py-1.5 text-xs sm:text-sm font-medium rounded-md flex items-center justify-center gap-1 ${
              isFree
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {isFree ? 'Use Tool' : 'Access Tool'}
            <FiArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ToolCard;
